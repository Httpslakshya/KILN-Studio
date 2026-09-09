# 🔌 AgentPrahari & Live Verified RAG MCP Server

A standards-compliant **Model Context Protocol (MCP)** server providing real-time AI security guardrails, multi-source verified live search, and autonomous fact-checked content generation to any MCP client (Claude Desktop, Cursor, Antigravity, etc.).

---

## 🛠️ Available MCP Tools

| Tool Name | Purpose | Key Inputs |
|---|---|---|
| `agentprahari_validate_input` | Prompt injection detection, jailbreak blocking, and PII masking via `agentprahari`. | `prompt` (str), `client_id` (str, optional) |
| `agentprahari_validate_output` | Evaluates model responses for secret leaks and hallucination. | `output_text` (str), `context` (str, optional) |
| `search_verified_live_news` | Live news search with freshness decay scoring & $\ge 2$ source domain corroboration. | `query` (str), `max_articles` (int) |
| `generate_verified_content` | 4-agent content pipeline (Researcher $\to$ Verifier $\to$ Writer $\to$ Editor) with revision cycles. | `topic` (str), `target_audience` (str) |

---

## 🚀 Claude Desktop Configuration

Add the server to your `claude_desktop_config.json` (located at `%APPDATA%\Claude\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "agentprahari": {
      "command": "python",
      "args": [
        "d:/Codes/anaconda/chatpdf/mcp_server/server.py"
      ],
      "env": {
        "GROQ_API_KEY": "your-groq-key",
        "GEMINI_API_KEY": "your-gemini-key"
      }
    }
  }
}
```

---

## 💻 Standalone Verification

You can test the JSON-RPC interface directly in terminal:

```bash
python mcp_server/server.py
```

Send the JSON-RPC initialize request:
```json
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}}
```

List tools:
```json
{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}
```
