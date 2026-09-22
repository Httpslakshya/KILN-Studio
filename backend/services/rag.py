from backend.config.settings import settings
from backend.vectorstore.qdrant import get_vector_db, get_qdrant_client
from backend.utils.logging_config import logger

def index_document(filename: str, file_path: str) -> int:
    """
    Loads, splits, and embeds a PDF file into Qdrant.
    
    Returns:
        int: Number of pages indexed.
    """
    logger.info(f"Indexing process started for file: {filename}")
    try:
        from langchain_community.document_loaders import PyPDFLoader
        from langchain_text_splitters import RecursiveCharacterTextSplitter

        loader = PyPDFLoader(file_path)
        docs = loader.load()
        page_count = len(docs)
        logger.info(f"Successfully loaded {page_count} pages from {filename}.")
        
        # Split documents into chunks with optimal context window
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,
            chunk_overlap=200
        )
        chunks = text_splitter.split_documents(docs)
        
        # Set normalized metadata
        for chunk in chunks:
            chunk.metadata["source"] = filename
            if "page" in chunk.metadata:
                chunk.metadata["page_label"] = str(chunk.metadata["page"] + 1)
            else:
                chunk.metadata["page_label"] = "1"
                
        # Index in Qdrant with rate-limiting backoff
        from backend.api.documents import _index_chunks_with_backoff
        vector_db = get_vector_db()
        _index_chunks_with_backoff(vector_db, chunks, batch_size=30)
        logger.info(f"Added {len(chunks)} chunks to Qdrant collection for '{filename}'.")
        return page_count
        
    except Exception as e:
        logger.error(f"Error during indexing of document {filename}: {e}", exc_info=True)
        raise RuntimeError(f"Failed to process and index PDF: {e}")

def delete_document_vectors(filename: str):
    """Deletes all vectorized points associated with the filename source."""
    logger.info(f"Deleting vector points in Qdrant for document: {filename}")
    try:
        from qdrant_client.http import models as rest

        client = get_qdrant_client()
        client.delete(
            collection_name="chatpdf",
            points_selector=rest.Filter(
                must=[
                    rest.FieldCondition(
                        key="metadata.source",
                        match=rest.MatchValue(value=filename)
                    )
                ]
            )
        )
        logger.info(f"Successfully deleted vectors for document: {filename}")
    except Exception as e:
        logger.error(f"Failed to delete Qdrant points for {filename}: {e}", exc_info=True)

_groq_key_counter = 0

def _get_next_groq_key(preferred_idx: int = None) -> str:
    """Rotates through available Groq API keys to distribute rate limits across multiple accounts."""
    global _groq_key_counter
    keys = settings.groq_keys
    if not keys:
        return ""
    if preferred_idx is not None and preferred_idx < len(keys):
        return keys[preferred_idx]
    key = keys[_groq_key_counter % len(keys)]
    _groq_key_counter += 1
    return key

def _call_groq_direct(system_prompt: str, user_query: str, key_override: str = None) -> str:
    """Invokes Groq API using specified or rotating key with model fallback and zero-wait retry."""
    from openai import OpenAI
    groq_keys = [key_override] if key_override else settings.groq_keys
    candidate_models = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b"]
    
    last_err = None
    for key in groq_keys:
        if not key:
            continue
        client = OpenAI(api_key=key, base_url="https://api.groq.com/openai/v1", max_retries=0)
        for model in candidate_models:
            try:
                response = client.chat.completions.create(
                    model=model,
                    temperature=0.2,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_query}
                    ]
                )
                return response.choices[0].message.content
            except Exception as e:
                last_err = e
                continue
    raise RuntimeError(f"All configured Groq API keys and models failed: {last_err}")

def _call_openrouter_direct(system_prompt: str, user_query: str, model: str = "meta-llama/llama-3.3-70b-instruct") -> str:
    """Invokes OpenRouter API."""
    api_key = settings.OPENROUTER_API_KEY
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not set.")
    from openai import OpenAI
    client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        default_headers={"HTTP-Referer": "https://docmind.ai", "X-Title": "DocMind"}
    )
    response = client.chat.completions.create(
        model=model,
        temperature=0.2,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ]
    )
    return response.choices[0].message.content

def _call_gemini_direct(system_prompt: str, user_query: str) -> str:
    """Invokes Google Gemini API."""
    gemini_key = settings.GEMINI_API_KEY
    if not gemini_key:
        raise ValueError("GEMINI_API_KEY not set.")
    import google.generativeai as genai
    genai.configure(api_key=gemini_key)
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        generation_config={"temperature": 0.2}
    )
    full_prompt = f"{system_prompt}\n\nUser Question:\n{user_query}"
    response = model.generate_content(full_prompt)
    return response.text

def call_llm(system_prompt: str, user_query: str, role: str = "general") -> str:
    """
    Intelligent multi-provider LLM router protected by AgentPrahari.
    Distributes workload across different LLMs and keys based on agent role:
    - researcher: OpenRouter -> Groq Key 1 -> Gemini
    - verifier:   Groq Key 2 -> OpenRouter -> Gemini
    - writer:     Groq Key 1 -> Groq Key 2 -> OpenRouter -> Gemini
    - editor:     Gemini -> OpenRouter -> Groq Key 2 (distinct reviewer model!)
    - general:    Groq (Rotated) -> OpenRouter -> Gemini
    """
    # 1. AgentPrahari Pre-execution Guardrail check (for direct user queries, bypass for internal system agents)
    if role not in ["writer", "verifier", "editor", "researcher", "repurposer"]:
        try:
            from agentprahari import AgentPrahari
            prahari = AgentPrahari.custom(
                enable_pii=True,
                enable_prompt_injection=True,
                enable_output_secrets=True
            )
            guard_res = prahari.validate_input(user_query)
            if not guard_res.is_valid:
                logger.warning(f"AgentPrahari Guardrail Blocked Prompt: {guard_res.rejection_reason}")
                return f"🛡️ [AgentPrahari Security Notice]: Input was blocked by safety guardrails. Reason: {guard_res.rejection_reason or 'Policy violation'}"
            
            if guard_res.sanitized_content:
                user_query = guard_res.sanitized_content
        except Exception as ge:
            logger.warning(f"AgentPrahari guard check notice: {ge}")

    # Build prioritized provider sequence based on agent role
    keys = settings.groq_keys
    k1 = keys[0] if len(keys) > 0 else None
    k2 = keys[1] if len(keys) > 1 else k1

    if role == "researcher":
        providers = [
            ("Groq Account 1 (Qwen 27B)", lambda: _call_groq_direct(system_prompt, user_query, key_override=k1)),
            ("Groq Account 2 (Qwen 27B)", lambda: _call_groq_direct(system_prompt, user_query, key_override=k2)),
            ("OpenRouter (Llama 3.3)", lambda: _call_openrouter_direct(system_prompt, user_query)),
        ]
    elif role == "verifier":
        providers = [
            ("Groq Account 2 (Qwen 27B Verifier)", lambda: _call_groq_direct(system_prompt, user_query, key_override=k2)),
            ("Groq Account 1 (Qwen 27B)", lambda: _call_groq_direct(system_prompt, user_query, key_override=k1)),
            ("OpenRouter (Llama 3.3)", lambda: _call_openrouter_direct(system_prompt, user_query)),
        ]
    elif role == "editor":
        providers = [
            ("Groq Account 2 (Qwen 27B Editor)", lambda: _call_groq_direct(system_prompt, user_query, key_override=k2)),
            ("Groq Account 1 (Qwen 27B)", lambda: _call_groq_direct(system_prompt, user_query, key_override=k1)),
            ("OpenRouter (Llama 3.3)", lambda: _call_openrouter_direct(system_prompt, user_query)),
        ]
    else:  # writer or general Q&A
        providers = [
            ("Groq Account 1 (Qwen 27B)", lambda: _call_groq_direct(system_prompt, user_query, key_override=k1)),
            ("Groq Account 2 (Qwen 27B)", lambda: _call_groq_direct(system_prompt, user_query, key_override=k2)),
            ("OpenRouter (Llama 3.3)", lambda: _call_openrouter_direct(system_prompt, user_query)),
        ]

    content = None
    for provider_name, invoke_fn in providers:
        try:
            logger.info(f"Routing completion request for role [{role}] to {provider_name}...")
            content = invoke_fn()
            if content and len(content.strip()) > 0:
                break
        except Exception as err:
            logger.warning(f"Provider {provider_name} failed: {err}. Attempting next provider in pool...")

    if not content:
        return "Error: Unable to connect to LLM APIs (All Groq, OpenRouter, and Gemini providers failed or are unconfigured)."

    # 2. AgentPrahari Post-execution check for leaked secrets or toxic claims
    try:
        from agentprahari import AgentPrahari
        prahari = AgentPrahari.custom(enable_output_secrets=True)
        out_res = prahari.validate_output(content, prompt=user_query)
        return out_res.sanitized_content or content
    except Exception:
        return content
