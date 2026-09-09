# 🧠 DocMind: AI-Powered PDF Chat & Live Verified Intelligence Platform

> Chat with PDFs, generate summaries, notes, and quizzes, or run autonomous 4-agent creator pipelines with real-time verified intelligence.

![Python](https://img.shields.io/badge/Python-FastAPI-blue)
![React](https://img.shields.io/badge/Frontend-Vite-61DAFB)
![Qdrant](https://img.shields.io/badge/VectorDB-Qdrant-red)
![AgentPrahari](https://img.shields.io/badge/Security-AgentPrahari-purple)
![AI](https://img.shields.io/badge/AI-Groq%20%7C%20OpenRouter%20%7C%20Gemini-orange)

DocMind is a Neobrutalist AI platform combining static document intelligence with real-time, multi-source verified RAG, an autonomous 4-agent content pipeline, an Anthropic-compliant Model Context Protocol (MCP) server, and production guardrails powered by [**AgentPrahari**](https://pypi.org/project/agentprahari/) on PyPI.

### 🌟 Core Architectural Pillars
1. **🛡️ AgentPrahari Guardrails**: Integrated from PyPI to protect prompts and completions against prompt injections, jailbreaks (DAN), PII leakage (emails, phone numbers, API keys), and ungrounded hallucinations.
2. **🌐 Live / Verified Agentic RAG**: Real-time RSS & news stream ingestion, exponential time-decay freshness scoring ($e^{-\lambda \Delta t}$), and cross-source consensus verification ($\ge 2$ independent publisher domains).
3. **🤖 Autonomous 4-Agent Content Pipeline**: Supervisor/Critic pattern (**Researcher** $\to$ **Verifier** $\to$ **Writer** $\to$ **Editor**) with automated revision feedback cycles.
4. **🔌 Model Context Protocol (MCP) Server**: Exposes guardrails, verified live search, and content generation as standard tools to Claude Desktop, Cursor, and any MCP client.
5. **📄 Cited PDF Workspace**: Neobrutalist RAG chat with page-level clickable citations and vector indexing via Qdrant/ChromaDB.

---

## 🚀 Overview

DocMind is an AI-powered document intelligence platform that transforms static PDFs into interactive knowledge sources.

Users can upload PDF documents and:

* 💬 Chat with PDFs using natural language
* 📝 Generate summaries
* 📚 Create study notes
* ❓ Generate quizzes
* 🔍 Perform semantic search
* 📖 Get citation-backed answers
* ☁️ Store and manage documents in the cloud

---

## ✨ Features

* PDF Upload & Management
* AI Chat with Documents
* Citation-Based Responses
* Semantic Search
* Automatic Summarization
* Quiz Generation
* Notes Generation
* Cloud Storage Integration
* Background Document Indexing
* Real-Time Indexing Progress Tracking
* Vector Search using Qdrant Cloud

---

## 🏗️ Architecture

```text
Frontend (Vercel)
        │
        ▼
React + Vite
        │
        ▼
FastAPI Backend (Render)
        │
 ┌──────┼─────────┐
 ▼      ▼         ▼
Supabase   Qdrant   Gemini
Storage    Cloud    Embeddings
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript

### Backend

* Python
* FastAPI
* Uvicorn

### AI & RAG

* Google Gemini Embeddings
* LangChain
* Qdrant Cloud

### Storage

* Supabase Storage
* Supabase Database

### Deployment

* Vercel
* Render

---

## 📂 Project Structure

```text
DocMind/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── backend/
│   ├── api/
│   ├── services/
│   ├── storage/
│   ├── vectorstore/
│   ├── models/
│   └── main.py
│
├── data/
├── logs/
└── README.md
```

---

## 🔄 Document Processing Flow

```text
Upload PDF
     │
     ▼
Supabase Storage
     │
     ▼
PDF Parsing (PyPDFLoader)
     │
     ▼
Chunk Generation
     │
     ▼
Gemini Embeddings
     │
     ▼
Qdrant Vector Indexing
     │
     ▼
Ready for AI Chat
```

---

## 🔐 Security

* Session-based authentication
* CORS protection
* Environment variable configuration
* Secure API key handling
* Backend-only access to AI services

---

## 🚨 Challenges Solved

| Problem                          | Solution                                            |
| -------------------------------- | --------------------------------------------------- |
| Memory crashes on deployment     | Migrated from local embedding models to Gemini API  |
| Lost indexing jobs after restart | Persistent job tracking                             |
| Vector dimension mismatch        | Recreated Qdrant collection with correct dimensions |
| Cross-origin deployment issues   | Production-ready CORS configuration                 |

---

## 📈 Future Roadmap

* Multi-user accounts
* OCR support for scanned PDFs
* Voice-based PDF interaction
* Flashcard generation
* PDF citation highlighting
* Collaborative workspaces
* Mobile application

---

## 🌐 Deployment

### Frontend

Vercel

### Backend

Render

### Storage

Supabase

### Vector Database

Qdrant Cloud

### AI Model

Google Gemini

---

## 👨‍💻 Author

**Lakshya Dharkar**

B.Tech Computer Science Student
AI/ML Enthusiast • Full Stack Developer • Building AI-powered products

---

⭐ If you found this project interesting, consider giving it a star.
