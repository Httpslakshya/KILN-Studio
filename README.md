# 🔥 KILN Studio

<div align="center">
  <img src="frontend/public/static/kiln-logo.png" alt="KILN Studio Logo" width="280" />
  <h3>Unified Intelligence & Autonomous Creator Forge Platform</h3>
  <p><strong>Forge raw documents and real-time world data into verified intelligence, cited answers, and viral multi-agent content.</strong></p>

  <p>
    <a href="https://pypi.org/project/agentprahari/"><img src="https://img.shields.io/badge/Security-AgentPrahari%20v0.1.0-7B61FF?style=for-the-badge&logo=pypi&logoColor=white" alt="AgentPrahari on PyPI" /></a>
    <img src="https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Frontend-Vite%20%7C%20Vanilla%20JS-FF5B22?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/VectorDB-Qdrant%20Cloud-DC2626?style=for-the-badge&logo=qdrant&logoColor=white" alt="Qdrant" />
    <img src="https://img.shields.io/badge/Protocol-Anthropic%20MCP-4F46E5?style=for-the-badge" alt="MCP" />
  </p>
</div>

---

## 📖 Table of Contents

* [Overview](#-overview)
* [Core Architectural Pillars](#-core-architectural-pillars)
* [Unified Workspace Suites](#-unified-workspace-suites)
  * [1. Autonomous Creator Forge (4-Agent Loop)](#1-autonomous-creator-forge-4-agent-loop)
  * [2. Document Knowledge Base & Cited PDF RAG](#2-document-knowledge-base--cited-pdf-rag)
  * [3. Old & New House Synergy (Document-Enriched Research)](#3-old--new-house-synergy-document-enriched-research)
  * [4. Live Fact-Check & News Radar](#4-live-fact-check--news-radar)
  * [5. AgentPrahari Security Console](#5-agentprahari-security-console)
* [Model Context Protocol (MCP) Server](#-model-context-protocol-mcp-server)
* [System Architecture](#-system-architecture)
* [Tech Stack](#-tech-stack)
* [Getting Started & Local Setup](#-getting-started--local-setup)
  * [Prerequisites](#prerequisites)
  * [Backend Setup](#1-backend-setup)
  * [Frontend Setup](#2-frontend-setup)
  * [Environment Variables (`.env`)](#3-environment-variables)
* [API Reference](#-api-reference)
* [Author & Acknowledgements](#-author--acknowledgements)

---

## 🚀 Overview

**KILN Studio** is a handcrafted, Neobrutalist AI platform built on a unified "rebuilt house" architecture. Just like raw clay or ore is fired into enduring ceramics inside a kiln, **KILN Studio** transforms raw documents (PDFs) and chaotic real-time web streams into fire-tested, publication-ready intelligence.

Instead of siloed tools, KILN Studio merges:
1. **Cited Document RAG** with page-level PDF source navigation.
2. **Autonomous 4-Agent Pipeline** (Supervisor $\to$ Researcher $\to$ Verifier $\to$ Writer $\to$ Editor Critic).
3. **Cross-Source Corroboration Engine** requiring $\ge 2$ independent domain consensus with time-decay freshness scoring.
4. **Multi-Format Creator Suite** generating articles, LinkedIn posts, carousel decks, reel scripts, and infometry blogs in one click.
5. **Production LLM Guardrails** powered by [**AgentPrahari**](https://pypi.org/project/agentprahari/) on PyPI.
6. **Anthropic Model Context Protocol (MCP)** server for seamless IDE & Claude Desktop integration.

---

## 🌟 Core Architectural Pillars

```
                     ┌──────────────────────────────────────────────┐
                     │          KILN STUDIO UNIFIED CORE            │
                     └──────────────────────┬───────────────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌───────────────┐   ┌───────────────┐               ┌───────────────┐   ┌───────────────┐
│ 4-Agent Forge │   │ Cited PDF RAG │               │ Live Radar    │   │ AgentPrahari  │
│ Closed Loop   │   │ Qdrant Vector │               │ Consensus RSS │   │ PyPI Defense  │
└───────┬───────┘   └───────┬───────┘               └───────┬───────┘   └───────┬───────┘
        │                   │                               │                   │
        └───────────────────┼───────────────────────────────┴───────────────────┘
                            ▼
           ┌─────────────────────────────────┐
           │ Model Context Protocol (MCP)    │
           │ Claude Desktop • Cursor IDE     │
           └─────────────────────────────────┘
```

1. **🛡️ Enterprise Security with AgentPrahari**: Every input prompt and agent output passes through PyPI's `agentprahari` guardrails to stop DAN jailbreaks, prompt injections, PII leakage, and ungrounded hallucinations.
2. **🌐 Exponential Time-Decay Scoring ($e^{-\lambda \Delta t}$)**: Freshness is mathematically scored against publication age to prioritize breaking intelligence over stale data.
3. **🔍 Cross-Domain Corroboration Matrix**: Facts are only stamped as verified when backed by at least two independent, reputable publisher domains.
4. **🔁 Self-Correcting Revision Loops**: If the Editor Critic detects ungrounded claims or poor formatting, it automatically kicks drafts back to the Writer with targeted feedback until the groundedness threshold is met.
5. **⚡ Old House & New House Synergy**: Documents in your PDF library directly feed private, authoritative context into the Creator Forge agents.

---

## 🎛️ Unified Workspace Suites

### 1. Autonomous Creator Forge (4-Agent Loop)

The heart of KILN Studio is an autonomous multi-agent creation suite utilizing the Supervisor/Critic pattern:

* **🕵️ Agent 1: Researcher**: Scrapes live RSS feeds, Google News streams, and indexed PDF knowledge bases for raw evidence and citations.
* **✅ Agent 2: Verifier**: Groups claims into a corroboration matrix. Flags single-source claims with `[UNVERIFIED]` or `[DISPUTED]` warnings and verifies consensus across $\ge 2$ distinct domains.
* **✍️ Agent 3: Writer**: Synthesizes verified findings into narrative prose with inline citation anchors (`[1]`, `[2]`).
* **🧐 Agent 4: Editor Critic**: Evaluates groundedness (0–100%), citation density, and audience alignment. If the score falls below 85%, triggers an autonomous revision cycle.

#### 🎯 12 Genuine Target Audience Profiles
* **Creators & Influencers**: Social Media Influencers, Storytellers & Reel Creators, Journalists & Media Publishers.
* **Engineering & Technology**: AI & Software Engineers, System Architects, Academic Researchers.
* **Business & Executive**: Startup Founders & VCs, Enterprise C-Suite Executives, Product Managers & Strategists, FinTech & Market Analysts.
* **General Audience**: Tech & Media Enthusiasts, Curious Beginners (EL5 / Zero Jargon).

#### 🎨 5 Instant In-Place Creator Formats
1. **Verified Long-Form Article**: Markdown-rendered deep dive with Groundedness Scorecard, source pills, and verified footnotes.
2. **LinkedIn Thought Leadership Post**: Formatted with hook, clean whitespace, verified checkmarks, and custom KILN creator header.
3. **Interactive Carousel Deck**: Slide-by-slide view with card progression, copy-all-slides button, and swipeable cards.
4. **Viral Reel / Short Script**: Hook, visual scene directions, dialogue, and on-screen text instructions.
5. **Infometry Blog**: Data-centric breakdown with key metric callouts.

---

### 2. Document Knowledge Base & Cited PDF RAG

* **Fast Ingestion**: Upload PDFs to be chunked via recursive tokenizers, embedded via Gemini, and indexed into Qdrant Cloud.
* **Page-Level Navigation**: Answers cite specific PDF pages with clickable buttons that jump directly to that page in the embedded document viewer.
* **One-Click Study Tools**: Instantly generate notes, quizzes, summaries, or comprehensive study guides.

---

### 3. Old & New House Synergy (Document-Enriched Research)

A standout architectural feature: **bridges between static document intelligence and dynamic multi-agent research**.
* Select any PDF from your library using the **"Enrich Research with Context from Document Library"** checkbox in the Creator Forge.
* Or click **"Send to Studio"** on any document card to automatically seed the 4-agent pipeline with your document's topic and extracted chunks!

---

### 4. Live Fact-Check & News Radar

* Real-time query intelligence scraping breaking news feeds.
* Displays a **Cross-Source Corroboration Matrix** showing which domains corroborated each claim.
* **One-Click Repurpose**: Transfer live radar findings straight into LinkedIn posts, Carousel slides, or Reel scripts.

---

### 5. AgentPrahari Security Console

* Real-time interactive testing console for LLM security guardrails.
* Test against:
  * **Jailbreak Detection** (DAN, Developer Mode, Roleplay attacks)
  * **Prompt Injection Defense** (Indirect and system prompt overrides)
  * **PII Redaction** (Email addresses, phone numbers, API keys, tokens)
  * **Hallucination & Groundedness Scoring**

---

## 🔌 Model Context Protocol (MCP) Server

KILN Studio includes an Anthropic-compliant **Model Context Protocol (MCP)** server located in `backend/mcp/server.py`.

### Supported MCP Tools
* `check_guardrails(text, user_id)`: Runs AgentPrahari security analysis.
* `live_fact_check(query, max_sources)`: Performs cross-source news radar search with time-decay scoring.
* `forge_content(topic, target_audience, tone, format_type)`: Runs the full 4-agent consensus loop directly from Claude or Cursor!

### Connecting to Claude Desktop
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "kiln-studio": {
      "command": "python",
      "args": ["-m", "backend.mcp.server"],
      "cwd": "/absolute/path/to/chatpdf"
    }
  }
}
```

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        KILN STUDIO FRONTEND                            │
│  Vite • Neobrutalist Design System • Warm Hearth Stone & Flame Orange  │
│  ChatGPT-Style Collapsible Navigation • In-Place Multi-Format Dock     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / SSE
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND ENGINE                          │
│                                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Pipeline Service │  │ Live RAG Service │  │ Document Service     │  │
│  │ 4-Agent Engine   │  │ RSS Time-Decay   │  │ Chunker & Qdrant RAG │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
│           │                     │                       │              │
│           ▼                     ▼                       ▼              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    AgentPrahari Security Layer                   │  │
│  │         (PII Scrubbing • DAN Defense • Hallucination Filter)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Qdrant Cloud   │      │ Google Gemini    │      │ Groq Cloud       │
│  Vector Embeddings      │ 2.5 Flash / Embed │      │ Qwen 2.5 32B     │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Vanilla JS (ES Modules), HTML5, Vite, Tailwind CSS (Neobrutalism), Google Fonts (Space Grotesk), Material Symbols |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic, HTTPX, PyPDF2, pdfplumber, BeautifulSoup4, feedparser |
| **Security** | [**AgentPrahari**](https://pypi.org/project/agentprahari/) on PyPI |
| **Vector DB** | Qdrant Cloud (Cosine Similarity, 768-dim / 1536-dim), fallback ChromaDB |
| **LLM Inference** | Groq (Qwen 2.5 32B / Llama 3.3 70B), Google Gemini 2.5 Flash, OpenRouter |
| **Protocols** | Anthropic Model Context Protocol (MCP) |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Python 3.11+** installed
* **Node.js 18+** and **npm** installed
* API Keys for:
  * Google Gemini API (`GEMINI_API_KEY`)
  * Groq Cloud API (`GROQ_API_KEY`)
  * Qdrant Cloud URL & Key (`QDRANT_URL`, `QDRANT_API_KEY`)

---

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/lakshya/DocMind.git
cd DocMind

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies including AgentPrahari from PyPI
pip install -r requirements.txt
pip install agentprahari

# Launch FastAPI backend server
python -m backend.main
```
The backend will boot up at `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).

---

### 2. Frontend Setup

```bash
# Open a new terminal in the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will be live at `http://localhost:5173`.

---

### 3. Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=8000
HOST=127.0.0.1
ENVIRONMENT=development

# LLM Providers
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Vector Database (Qdrant Cloud)
QDRANT_URL=https://your-cluster.qdrant.tech:6333
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION_NAME=kiln_documents

# Storage (Supabase or Local)
STORAGE_TYPE=local
UPLOAD_DIR=./data/uploads
```

---

## 📡 API Reference

### Creator Forge & Multi-Agent Pipeline
* `POST /api/pipeline/run`: Launch the 4-agent closed-loop creator pipeline.
  ```json
  {
    "topic": "Quantum Computing Scalability",
    "target_audience": "AI & Software Engineers",
    "tone": "Authoritative Thought Leadership",
    "use_pdf_context": true,
    "selected_pdf": "quantum_whitepaper.pdf"
  }
  ```

### Live Fact-Check & News Radar
* `POST /api/live-rag/search`: Run multi-source RSS ingestion with consensus matrix.
  ```json
  {
    "query": "NVIDIA Blackwell B200 Benchmark Results",
    "max_articles": 8
  }
  ```

### Document Management & Cited RAG
* `POST /api/upload`: Upload and vector-index a PDF document into Qdrant.
* `GET /api/documents`: List all indexed documents in the workspace.
* `POST /api/chat`: Send a question and receive cited answers with page numbers.
* `DELETE /api/document/{filename}`: Remove a document from the vector store and storage.

### AgentPrahari Security
* `POST /api/guardrails/check`: Evaluate prompt or completion against security rules.

---

## 👨‍💻 Author & Acknowledgements

Developed with passion by **Lakshya Dharkar**  
* B.Tech Computer Science Student  
* Creator of [**AgentPrahari**](https://pypi.org/project/agentprahari/) on PyPI  
* AI/ML Engineer • Full Stack Developer • Agentic Systems Architect

⭐ **If you find KILN Studio valuable, please give this repository a star!**
