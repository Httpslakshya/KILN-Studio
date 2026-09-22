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
    <img src="https://img.shields.io/badge/Auth-Supabase%20%2B%20PBKDF2-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase Auth" />
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
* [Authentication & User Management](#-authentication--user-management)
* [Autonomous Creator Forge (Core Engine)](#-autonomous-creator-forge-core-engine)
  * [The 4-Agent Closed-Loop Pipeline](#the-4-agent-closed-loop-pipeline)
  * [5 Instant Publication Formats](#5-instant-publication-formats)
  * [12 Target Audience Profiles](#12-target-audience-profiles)
  * [Private Document-Enriched Synergy](#private-document-enriched-synergy)
* [Carousel Forge & Slide Exporter](#-carousel-forge--slide-exporter)
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
| **Cloud Storage & Auth** | **Supabase** | Cloud Storage & Auth | S3-compatible cloud storage bucket and user auth |

---

## 🔐 Authentication & User Management

KILN Studio provides a production-grade, workable authentication system featuring both Sign In and dedicated Sign Up:

* **Dual-Layer Auth Architecture**:
  1. **Supabase Auth Engine**: Primary cloud authentication provider for user signup, credential verification, and identity tokens.
  2. **Local Salted PBKDF2 Fallback Store**: High-security fallback engine (`data/users.json`) utilizing `hashlib.pbkdf2_hmac` with 100,000 iterations and unique 16-byte cryptographic salts. Ensures 100% reliable local development and offline resilience.
* **Workable Pages**:
  * **Sign In (`/login` or `index.html`)**: Email & password authentication, real-time error feedback, and remember-me support.
  * **Sign Up (`/signup` or `signup.html`)**: Complete registration form with full name, email, password strength check (min 6 characters), and password confirmation validation.
  * **Instant Guest Mode**: 1-click **"Continue as Guest"** for instant demo evaluation without registration hurdles.
* **Session Management**: Secure HTTP-only cookies combined with `x-session-id` headers and local storage sync for decoupled API client routing.

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
            │  5 Publication Formats    │
            │  Citation Bracket Locking │
            └─────────────┬─────────────┘
                          │ First Draft
                          ▼
            ┌───────────────────────────┐
            │     4. CRITIC AGENT       │
            │  Audience Persona Scoring │
            │  Self-Correcting Iteration│
            └─────────────┬─────────────┘
                          │ Verified Output
                          ▼
                 Production-Ready Asset
```

### 5 Instant Publication Formats
1. **Verified Technical Article**: Full-length analytical writeup with executive summary, claim-by-claim citations, and inline source attribution.
2. **Viral LinkedIn Thought Leadership**: Hook-driven, skimmable post formatted with punchy whitespace and data callouts.
3. **Carousel Deck**: Structured, multi-slide blueprints ready for immediate design export.
4. **Viral Short-Form Reel / TikTok Script**: Scene-by-scene visual cues, on-screen text instructions, and retention-engineered spoken hooks.
5. **Infometry Blog Post**: Structured editorial article tailored for corporate research publications.

---

## 🎨 Carousel Forge & Slide Exporter

KILN Studio features a dedicated **Carousel Forge** (`/carousel` or `carousel.html`) for designing and exporting 1080px social carousel decks:

* **11 Designer Aesthetic Themes**:
  1. *KILN Neobrutalist Gold* (Flagship cream paper, gold accents, bold ink borders)
  2. *Aura Glow & Glass* (Translucent frosted glassmorphism, warm amber mesh glow)
  3. *LinkedIn Authority* (Clean white & red brackets with question cards)
  4. *Bold Kinetic Condensed* (Deep indigo, Anton caps & alternating neon pink)
  5. *Retro Pill Stack & Chat* (Flame orange, stacked badges & iMessage bubbles)
  6. *Boho Roadmap* (Warm sand, Playfair serif, authentic flow arrows)
  7. *Minimal Editorial* (Refined Newsreader serif, terracotta accents)
  8. *Cobalt & Acid Lime* (Electric blue & high-voltage neon yellow)
  9. *Klowt Punch* (Viral purple gradient & social handles)
  10. *Mono Asterisk* (Minimalist dark carbon & editorial symbols)
  11. *Forest Lime* (Deep pine green & citrus accents)
* **Real-Time WYSIWYG Editor**:
  * Live multiline breaking: respects explicit `\n` (pressing Enter) and `<br>` tags.
  * Length-responsive text fitting: dynamically scales headlines to fit without clipping.
  * Highlight pill formatting locked to line baselines.
  * Custom slide deck strip with add, duplicate, and delete controls.
* **1080px High-Resolution Canvas Exporter**:
  * Utilizes native SVG `<foreignObject>` rasterization with Chrome's Blink GPU compositor via `html-to-image` for 100% pixel fidelity (accurate gradients, frosted glass blurs, and shadows).
  * Single Slide PNG download (1080×1350 portrait / 1080×1080 square).
  * 1-click **Download Full Deck (ZIP)** bundling the entire carousel archive.
  * Official website attribution on every closing CTA slide: `kiln-studioai.vercel.app`.

---

## 🏛️ System Architecture

```
                                  KILN STUDIO ARCHITECTURE
                                  
 ┌──────────────────────────────────────────────────────────────────────────────────────┐
 │                              FRONTEND LAYER (Vercel)                                 │
 │  • index.html (Login)       • signup.html (Registration)  • dashboard.html (Studio) │
 │  • carousel.html (Forge)    • live_rag.html (Radar)       • chat.html (Cited RAG)   │
 │  • Tailwind CSS (Neobrutal) • Space Grotesk / Inter       • ES Modules / Vite       │
 └──────────────────────────────────────────┬───────────────────────────────────────────┘
                                            │ REST API (JSON / FormData)
                                            ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────┐
 │                             BACKEND API (FastAPI / Render)                           │
 │                                                                                      │
 │  ┌───────────────────────┐ ┌────────────────────────┐ ┌───────────────────────────┐  │
 │  │      Auth Engine      │ │   Content Pipeline     │ │      Live RAG Radar       │  │
 │  │ • /api/signup         │ │ • 4-Agent Supervisor   │ │ • RSS Feeds (Tech, AI)    │  │
 │  │ • /api/login          │ │ • Researcher/Verifier  │ │ • Multi-Domain Consensus  │  │
 │  │ • Supabase + PBKDF2   │ │ • Writer/Critic Loop   │ │ • Time-Decay Scoring      │  │
 │  └───────────────────────┘ └────────────────────────┘ └───────────────────────────┘  │
 │  ┌───────────────────────┐ ┌────────────────────────┐ ┌───────────────────────────┐  │
 │  │     Document RAG      │ │  Security Guardrails   │ │    Anthropic MCP Server   │  │
 │  │ • PyPDF2 / Chunker    │ │ • AgentPrahari v0.1.0  │ │ • forge_content tool      │  │
 │  │ • Clickable Citations │ │ • Prompt Injection     │ │ • live_fact_check tool    │  │
 │  │ • Hybrid Retrieval    │ │ • PII / Leak Scanner   │ │ • check_guardrails tool   │  │
 │  └───────────────────────┘ └────────────────────────┘ └───────────────────────────┘  │
 └──────────────────────┬───────────────────┬───────────────────┬───────────────────────┘
                        │                   │                   │
                        ▼                   ▼                   ▼
             ┌─────────────────────┐ ┌─────────────┐ ┌─────────────────────┐
             │    Qdrant Cloud     │ │  Supabase   │ │    LLM Inference    │
             │   Vector Database   │ │ Cloud Store │ │ • Groq (Qwen 32B)   │
             │ 384-dim Embeddings  │ │  and Auth   │ │ • Gemini 2.5 Flash  │
             └─────────────────────┘ └─────────────┘ └─────────────────────┘
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
| **Authentication** | Supabase Auth API + Local PBKDF2-HMAC-SHA256 Salted Hashing |
| **Security** | [**AgentPrahari**](https://pypi.org/project/agentprahari/) on PyPI |
| **Vector Database** | Qdrant Cloud (Cosine Similarity), fallback ChromaDB |
| **LLM Inference** | Groq (Qwen 2.5 32B / Llama 3.3 70B), Google Gemini 2.5 Flash, OpenRouter |
| **Protocol** | Anthropic Model Context Protocol (MCP) |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Python 3.11+** installed
* **Node.js 18+** and **npm** installed
* API Keys for **Gemini**, **Groq**, **Qdrant Cloud**, and **Supabase**

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

# Supabase Auth & Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_BUCKET=docmind
```

---

## 📡 API Reference

### Authentication Endpoints
* `POST /api/signup`: Creates a new workspace account (`name`, `email`, `password`).
* `POST /api/login`: Verifies credentials, registers session, and sets secure auth cookie.
* `POST /api/logout`: Deregisters active session and clears auth cookies.
* `GET /api/auth/check`: Validates current session status.

### Creator & Intelligence Endpoints
* `POST /api/pipeline/run`: Executes the 4-agent creator forge.
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
