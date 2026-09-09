# 🔥 KILN Studio

<div align="center">
  <img src="frontend/public/static/kiln-logo.png" alt="KILN Studio Logo" width="280" />
  <h3>Unified Intelligence & Autonomous Creator Forge Platform</h3>
  <p><strong>Forge raw documents and real-time world data into verified intelligence, cited answers, and viral multi-agent content.</strong></p>

  <p>
    <a href="https://kiln-studioai.vercel.app" target="_blank"><img src="https://img.shields.io/badge/🚀%20Live%20Application-kiln--studioai.vercel.app-FF5B22?style=for-the-badge&logo=vercel&logoColor=white" alt="Live on Vercel" /></a>
    <a href="https://pypi.org/project/agentprahari/"><img src="https://img.shields.io/badge/Security-AgentPrahari%20v0.1.0-7B61FF?style=for-the-badge&logo=pypi&logoColor=white" alt="AgentPrahari on PyPI" /></a>
    <img src="https://img.shields.io/badge/Backend-FastAPI%20%7C%20Render-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI on Render" />
    <img src="https://img.shields.io/badge/Frontend-Vite%20%7C%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
    <img src="https://img.shields.io/badge/VectorDB-Qdrant%20Cloud-DC2626?style=for-the-badge&logo=qdrant&logoColor=white" alt="Qdrant" />
    <img src="https://img.shields.io/badge/Protocol-Anthropic%20MCP-4F46E5?style=for-the-badge" alt="MCP" />
  </p>

  <p>
    🔗 <strong>Live App:</strong> <a href="https://kiln-studioai.vercel.app" target="_blank"><strong>https://kiln-studioai.vercel.app</strong></a> &nbsp;|&nbsp;
    ⚡ <strong>API Endpoint:</strong> <a href="https://docmind-8qsv.onrender.com" target="_blank"><strong>https://docmind-8qsv.onrender.com</strong></a> &nbsp;|&nbsp;
    📚 <strong>Swagger Docs:</strong> <a href="https://docmind-8qsv.onrender.com/docs" target="_blank"><strong>/docs</strong></a>
  </p>
</div>

---

> 🚀 **KILN Studio is Live in Production!**  
> Experience the autonomous 4-agent creator forge, live fact-checking, and cited PDF intelligence directly in your browser:  
> **👉 [https://kiln-studioai.vercel.app](https://kiln-studioai.vercel.app)**

---

## 📖 Table of Contents

* [Overview](#-overview)
* [Live Deployment](#-live-deployment)
* [Autonomous Creator Forge (Core Engine)](#-autonomous-creator-forge-core-engine)
  * [The 4-Agent Closed-Loop Pipeline](#the-4-agent-closed-loop-pipeline)
  * [5 Instant Publication Formats](#5-instant-publication-formats)
  * [12 Target Audience Profiles](#12-target-audience-profiles)
  * [Private Document-Enriched Synergy](#private-document-enriched-synergy)
* [System Architecture](#-system-architecture)
* [Supporting Capabilities](#-supporting-capabilities)
  * [Cited PDF Knowledge Base](#cited-pdf-knowledge-base)
  * [Live Fact-Check & News Radar](#live-fact-check--news-radar)
  * [AgentPrahari Security Guardrails](#agentprahari-security-guardrails)
* [Model Context Protocol (MCP) Server](#-model-context-protocol-mcp-server)
* [Tech Stack](#-tech-stack)
* [Getting Started & Local Setup](#-getting-started--local-setup)
* [API Reference](#-api-reference)
* [Author & Acknowledgements](#-author--acknowledgements)

---

## 🚀 Overview

**KILN Studio** is an autonomous intelligence and creator forge platform designed for writers, researchers, founders, and digital creators. Just as raw clay or ore is fired into durable ceramic inside a kiln, **KILN Studio** transforms raw documents (PDFs) and chaotic live web streams into high-confidence, publication-ready creator assets.

Instead of writing ungrounded generic drafts with raw LLMs, KILN Studio deploys an autonomous **Supervisor-governed 4-Agent loop** that scrapes fresh sources, verifies claims across $\ge 2$ independent publisher domains, drafts cited narratives, and automatically critiques quality with self-correcting revision cycles.

---

## 🌐 Live Deployment

KILN Studio is deployed and fully operational in production across high-performance edge and cloud infrastructure:

| Component | Platform | Live URL / Endpoint | Details |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | **Vercel** | [**https://kiln-studioai.vercel.app**](https://kiln-studioai.vercel.app) | Vite SPA with Neobrutalist UI, responsive mobile/desktop, guest demo access |
| **Backend API Engine** | **Render** | [**https://docmind-8qsv.onrender.com**](https://docmind-8qsv.onrender.com) | FastAPI + Uvicorn with AgentPrahari guardrails & multi-model LLM router |
| **Interactive API Docs** | **Swagger UI** | [**https://docmind-8qsv.onrender.com/docs**](https://docmind-8qsv.onrender.com/docs) | OpenAPI interactive endpoints specification |
| **Vector Database** | **Qdrant Cloud** | Managed AWS Cluster | Hybrid semantic retrieval with sub-50ms latency |

> 💡 **Try It Instantly:** Visit [**kiln-studioai.vercel.app**](https://kiln-studioai.vercel.app) and click **"Continue as Guest"** or **"Start with demo access"** to test the 4-agent creator forge without needing any setup!

---

## ✍️ Autonomous Creator Forge (Core Engine)

The flagship workspace of KILN Studio is built specifically for high-conviction content creators:

### The 4-Agent Closed-Loop Pipeline

```
  Creator Input (Topic, Audience, Tone, Optional PDF)
                          │
                          ▼
            ┌───────────────────────────┐
            │    1. RESEARCHER AGENT    │
            │  Scrapes Live RSS & Web   │
            │  + Pulls Cited PDF Chunks │
            └─────────────┬─────────────┘
                          │ Raw Evidence
                          ▼
            ┌───────────────────────────┐
            │     2. VERIFIER AGENT     │
            │  Consensus Matrix (≥2 dom)│
            │  Time-Decay Freshness     │
            └─────────────┬─────────────┘
                          │ Verified Facts
                          ▼
            ┌───────────────────────────┐
            │      3. WRITER AGENT      │
            │  Drafts Cited Narrative   │
            │  Audience-Tailored Voice  │
            └─────────────┬─────────────┘
                          │ Draft
                          ▼
            ┌───────────────────────────┐
            │   4. EDITOR CRITIC AGENT  │◄───┐
            │  Groundedness Scoring     │    │ Auto-Revision
            │  Hallucination Detection  │────┘ (if Score < 85%)
            └─────────────┬─────────────┘
                          │ Approved (Score ≥ 85%)
                          ▼
         Instant In-Place Creator Formats
```

1. **🕵️ Agent 1: Researcher**: Scrapes live RSS feeds, Google News streams, and indexed PDF collections for primary evidence.
2. **✅ Agent 2: Verifier**: Organizes claims into a cross-source corroboration matrix. Enforces $\ge 2$ independent domain verification and calculates exponential freshness scores ($e^{-\lambda \Delta t}$).
3. **✍️ Agent 3: Writer**: Synthesizes verified claims into punchy, authoritative prose with numbered citation anchors (`[1]`, `[2]`).
4. **🧐 Agent 4: Editor Critic**: Evaluates groundedness (0–100%), citation density, and audience alignment. If unsubstantiated claims are detected, it triggers a targeted revision cycle back to the Writer.

---

### 5 Instant Publication Formats

Switch instantly between publication-ready creator assets from a single run:

| Format | Output Description |
| :--- | :--- |
| 📰 **Verified Article** | Deep-dive markdown essay with inline citations, Groundedness Scorecard, and clickable primary source tags. |
| 💼 **LinkedIn Post** | Viral thought leadership draft formatted with clean spacing, hook opening, verified checkmarks (`✓`), and KILN creator header. |
| 📱 **Interactive Carousel Deck** | Card-by-card slide deck with slide progression dots, clean visual formatting, and a **"Copy All Slides"** export button. |
| 🎬 **Viral Reel / Short Script** | Timed video production script with scene visual cues, spoken dialogue, and on-screen text instructions. |
| 📊 **Infometry Deep-Dive Blog** | Analytical report emphasizing statistics, corroborated metrics, and executive takeaways. |

---

### 12 Target Audience Profiles

Tailor research and vocabulary to match your exact readership:
* **Creators & Influencers**: Social Media Influencers, Storytellers & Reel Creators, Journalists & Media Publishers.
* **Engineering & Technology**: AI & Software Engineers, System Architects, Academic Researchers.
* **Business & Executive**: Startup Founders & VCs, Enterprise C-Suite Executives, Product Managers & Strategists, FinTech & Market Analysts.
* **General Audience**: Tech & Media Enthusiasts, Curious Beginners (EL5 / Zero Jargon).

---

### 📄 Private Document-Enriched Synergy

KILN Studio seamlessly connects your private document library with the public Creator Forge:
* Enable **"Enrich Research with Context from Document Library"** to ground the agents with your proprietary PDFs, whitepapers, or reports.
* Or click **"Send to Studio"** directly on any document card to automatically launch a 4-agent creation cycle using that document as context.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     KILN STUDIO UI                                          │
│         Vite • Tailwind Neobrutalism • Warm Hearth & Flame Palette • Responsive             │
│   ┌────────────────────────┬─────────────────────────┬──────────────────────────────────┐   │
│   │ 4-Agent Creator Studio │ Cited PDF Knowledge Base│ Live Fact-Check & News Radar     │   │
│   └────────────────────────┴─────────────────────────┴──────────────────────────────────┘   │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │ HTTP / REST / Server-Sent Events
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FASTAPI APPLICATION ENGINE                                  │
│                                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                         4-Agent Autonomous Creator Pipeline                         │   │
│   │   [Researcher Agent] ──► [Verifier Agent] ──► [Writer Agent] ──► [Editor Critic]    │   │
│   └──────────────────────────┬──────────────────────────────────────────────────────────┘   │
│                              │                                                              │
│   ┌──────────────────────────┴─────────────────────────┐  ┌─────────────────────────────┐   │
│   │ Live RAG & News Stream Service                     │  │ Document Chunker & PDF RAG  │   │
│   │ (RSS Ingestion • Time-Decay e^-λt • Consensus)     │  │ (Qdrant Vector Collections) │   │
│   └──────────────────────────┬─────────────────────────┘  └──────────────┬──────────────┘   │
│                              │                                           │                  │
│                              ▼                                           ▼                  │
│   ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                             AgentPrahari Security Layer                             │   │
│   │       Prompt Injection Defense • DAN Jailbreak Shield • PII Redaction Filter        │   │
│   └─────────────────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────────────┬───────────────────┘
                            │                                             │
             ┌──────────────┴──────────────┐               ┌──────────────┴──────────────┐
             ▼                             ▼               ▼                             ▼
   ┌───────────────────┐         ┌───────────────────┐   ┌───────────────────┐ ┌───────────────┐
   │   Qdrant Cloud    │         │ Google Gemini     │   │ Groq Cloud        │ │ Anthropic MCP │
   │ Vector Embeddings │         │ 2.5 Flash / Embed │   │ Qwen 2.5 32B      │ │ Cursor/Claude │
   └───────────────────┘         └───────────────────┘   └───────────────────┘ └───────────────┘
```

---

## 🛠️ Supporting Capabilities

### Cited PDF Knowledge Base
* Fast document indexing into Qdrant Cloud vector collections.
* Natural language chat with page-level clickable citation badges that jump straight to the source page in the built-in PDF viewer.
* Quick-action study tools: Generate Notes, Generate Quizzes, Summarize, and Create Study Guides.

### Live Fact-Check & News Radar
* Scrapes live RSS feeds across top industry publications.
* Displays a real-time **Cross-Source Corroboration Matrix** showing which domains verified each fact.
* One-click repurpose: convert live news radar findings directly into LinkedIn posts or carousel decks.

### AgentPrahari Security Guardrails
* Integrated directly from [**AgentPrahari on PyPI**](https://pypi.org/project/agentprahari/).
* Defends against prompt injections, DAN jailbreak attacks, and credential/PII leaks before text ever reaches the LLM or user.

---

## 🔌 Model Context Protocol (MCP) Server

KILN Studio includes an Anthropic-compliant **Model Context Protocol (MCP)** server (`backend/mcp/server.py`) exposing its tools to Claude Desktop, Cursor, and any MCP-compatible agent.

### Supported Tools
* `forge_content(topic, target_audience, tone, format_type)`: Runs the full 4-agent creation loop.
* `live_fact_check(query, max_sources)`: Scrapes live news feeds and checks multi-domain consensus.
* `check_guardrails(text, user_id)`: Runs AgentPrahari security scanning.

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

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Vanilla JS (ES Modules), HTML5, Vite, Tailwind CSS (Neobrutalism), Space Grotesk typography |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic, HTTPX, PyPDF2, pdfplumber, BeautifulSoup4, feedparser |
| **Security** | [**AgentPrahari**](https://pypi.org/project/agentprahari/) on PyPI |
| **Vector Database** | Qdrant Cloud (Cosine Similarity), fallback ChromaDB |
| **LLM Inference** | Groq (Qwen 2.5 32B / Llama 3.3 70B), Google Gemini 2.5 Flash, OpenRouter |
| **Protocol** | Anthropic Model Context Protocol (MCP) |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Python 3.11+** installed
* **Node.js 18+** and **npm** installed
* API Keys for **Gemini**, **Groq**, and **Qdrant Cloud**

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/Httpslakshya/KILN-Studio.git
cd KILN-Studio

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install agentprahari

# Launch FastAPI server
python -m backend.main
```
Backend runs at `http://127.0.0.1:8000` (API docs at `/docs`).

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 3. Environment Variables (`.env`)
```env
PORT=8000
HOST=127.0.0.1
ENVIRONMENT=development

# LLM Keys
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Qdrant Vector Cloud
QDRANT_URL=https://your-cluster.qdrant.tech:6333
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION_NAME=kiln_documents
```

---

## 📡 API Reference

* `POST /api/pipeline/run`: Executes the 4-agent creator forge.
  ```json
  {
    "topic": "Frontier AI Reasoning Models",
    "target_audience": "AI & Software Engineers",
    "tone": "Authoritative Thought Leadership",
    "use_pdf_context": false
  }
  ```
* `POST /api/live-rag/search`: Queries live RSS streams and returns consensus matrix.
* `POST /api/upload`: Uploads and vector-indexes a PDF file into Qdrant.
* `POST /api/chat`: Performs cited RAG chat on uploaded documents.
* `POST /api/guardrails/check`: Scans prompt or completion via AgentPrahari.

---

## 👨‍💻 Author & Acknowledgements

Developed by **Lakshya Dharkar**  
* B.Tech Computer Science Student  
* Creator of [**AgentPrahari**](https://pypi.org/project/agentprahari/) on PyPI  
* AI/ML Engineer • Full Stack Developer • Agentic Systems Architect

⭐ **If you find KILN Studio valuable, please consider giving it a star!**
