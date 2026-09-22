from backend.config.settings import settings
from backend.utils.logging_config import logger

_qdrant_client = None
_vector_db = None
_embeddings = None

def get_embeddings():
    """Initializes and caches lightweight HuggingFace model (all-MiniLM-L6-v2, 384 dimensions)."""
    global _embeddings
    if _embeddings is None:
        from langchain_huggingface import HuggingFaceEmbeddings
        logger.info("Initializing HuggingFace sentence-transformers/all-MiniLM-L6-v2 model (384 dim)...")
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )
        logger.info("HuggingFace embeddings initialized successfully.")
    return _embeddings

def get_qdrant_client():
    """Returns a cached QdrantClient configured for remote Cloud with automatic local fallback."""
    global _qdrant_client
    if _qdrant_client is not None:
        return _qdrant_client

    from qdrant_client import QdrantClient

    qdrant_url = settings.QDRANT_URL
    qdrant_api_key = settings.QDRANT_API_KEY

    # Attempt remote Qdrant Cloud if configuration exists
    if qdrant_url and "localhost" not in qdrant_url:
        logger.info(f"Attempting connection to remote Qdrant Cloud instance: {qdrant_url}")
        try:
            client = QdrantClient(
                url=qdrant_url,
                api_key=qdrant_api_key,
                prefer_grpc=False,
                timeout=5
            )
            client.get_collections()
            logger.info("Successfully connected to remote Qdrant Cloud.")
            _qdrant_client = client
            return _qdrant_client
        except Exception as e:
            logger.warning(f"Failed to connect to remote Qdrant Cloud ({e}). Falling back to local embedded Qdrant.")

    local_path = str(settings.QDRANT_LOCAL_PATH)
    logger.info(f"Connecting to local Qdrant DB at {local_path}...")
    _qdrant_client = QdrantClient(path=local_path)
    return _qdrant_client

def ensure_collection_exists():
    """Creates or migrates 'chatpdf' collection to 384 dimensions for all-MiniLM-L6-v2."""
    from qdrant_client.models import Distance, VectorParams
    client = get_qdrant_client()
    existing = [c.name for c in client.get_collections().collections]
    
    recreate = False
    if "chatpdf" in existing:
        try:
            info = client.get_collection("chatpdf")
            current_dim = getattr(info.config.params.vectors, "size", None)
            if current_dim != 384:
                logger.info(f"Collection 'chatpdf' has dimension {current_dim}, migrating to 384 dimensions...")
                client.delete_collection("chatpdf")
                recreate = True
            else:
                logger.info("Collection 'chatpdf' exists with matching 384 dimensions.")
        except Exception as e:
            logger.warning(f"Could not inspect collection 'chatpdf': {e}")
    else:
        recreate = True

    if recreate:
        logger.info("Creating collection 'chatpdf' with 384 dimensions (all-MiniLM-L6-v2)...")
        client.create_collection(
            collection_name="chatpdf",
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)
        )
        logger.info("Collection 'chatpdf' created successfully.")

    # Always ensure payload index for metadata.source exists for fast filtered searches
    try:
        client.create_payload_index(
            collection_name="chatpdf",
            field_name="metadata.source",
            field_schema="keyword"
        )
    except Exception:
        pass

def get_vector_db():
    """Returns the LangChain QdrantVectorStore wrapper instance."""
    global _vector_db
    if _vector_db is None:
        from langchain_qdrant import QdrantVectorStore

        ensure_collection_exists()
        client = get_qdrant_client()
        embeddings = get_embeddings()
        logger.info("Initializing LangChain QdrantVectorStore wrapper (collection: 'chatpdf')...")
        _vector_db = QdrantVectorStore(
            client=client,
            embedding=embeddings,
            collection_name="chatpdf"
        )
        logger.info("QdrantVectorStore initialized successfully.")
    return _vector_db