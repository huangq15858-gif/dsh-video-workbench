# Universal Installation Guide — DSH Video Workbench (`v0.4.0`)

> **Original Author**: Merziller · **QQ**: `1411574209` · **WeChat**: `Merziller` · **Email**: `k26789228@gmail.com`  
> **GitHub**: https://github.com/Merziller/dsh-video-workbench (MIT Open Source)

**No longer restricted to DeepSeek Harness (DSH)!** You can install and run `dsh-video-workbench` inside **Claude Code, OpenAI Codex CLI, WorkBuddy, Cursor, Windsurf, Cline, OpenCode, Antigravity, DeepSeek Harness (DSH), or Standalone Local Browser**.

---

## One-Sentence Agent Setup Prompt
Paste this single sentence into **Claude Code / Codex CLI / WorkBuddy / Cursor / Antigravity**:
```text
Read https://github.com/Merziller/dsh-video-workbench/blob/main/docs/install.md and install & connect dsh-video-workbench MCP server + local Web Studio in my current agent.
```

---

## 1. Clone & Install Dependencies (Required for All Non-DSH Agents)
```bash
git clone https://github.com/Merziller/dsh-video-workbench.git
cd dsh-video-workbench
npm install
node ./bin/dsh-video-cli.mjs doctor
```

## 2. Connect to Your Preferred AI Agent

### A. Claude Code
```bash
claude mcp add dsh-video-workbench -- node "/absolute/path/to/dsh-video-workbench/bin/dsh-video-mcp.mjs"
```
Or open the cloned folder directly in Claude Code (`.mcp.json` and `.claude-plugin/plugin.json` are auto-detected!).

### B. OpenAI Codex CLI
Add to `~/.codex/config.toml`:
```toml
[mcp_servers.dsh_video_workbench]
command = "node"
args = ["/absolute/path/to/dsh-video-workbench/bin/dsh-video-mcp.mjs"]
```
Codex also auto-reads `AGENTS.md` and `SKILL.md`.

### C. WorkBuddy / Cursor / Windsurf / Cline / OpenCode
1. Install the universal Skill (optional, via Skills CLI):
   ```bash
   npx skills add Merziller/dsh-video-workbench
   ```
2. Add the MCP server to your agent's MCP config (or use the included `.mcp.json`):
   ```json
   {
     "mcpServers": {
       "dsh-video-workbench": {
         "command": "node",
         "args": ["/absolute/path/to/dsh-video-workbench/bin/dsh-video-mcp.mjs"]
       }
     }
   }
   ```

### D. DeepSeek Harness (DSH)
```bash
dsh plugin --profile desktop add github:Merziller/dsh-video-workbench
```
Or click **Install** from the DSH Plugin Market (`awesome-dsh-plugin`).

### E. Standalone Visual Web Studio (Zero Agent Required)
```bash
node ./bin/dsh-video-cli.mjs studio --open
# Opens http://127.0.0.1:4399 in your browser with full 4-Agent War Room, Reference Remake, & Multi-Engine TTS UI!
```

---

## 3. Optional Local TTS Engine Installation (IndexTTS-2.5 / IndexTTS-2 / GPT-SoVITS / Edge-TTS)
All neural TTS engines are **100% optional** — without installing any of them, you can already use **Windows Native SAPI (0GB VRAM)** or **Pure-Music Beat-Sync (`subtitle-mv`)** out of the box.

To install a local TTS engine with automatic `voices/` initialization & auto-wiring into the plugin:
- **In Web Studio**: Topbar **「🎙 配音」 → 「📦 一键安装依赖包」** tab -> choose `Edge-TTS (0GB)`, `IndexTTS-2.5 (8GB+)`, `GPT-SoVITS (4GB+)`, or `IndexTTS-2` -> click **一键安装并接入**.
- **Via CLI**:
  ```bash
  node ./bin/dsh-video-cli.mjs install-tts --engine edge-tts --mirror cn
  node ./bin/dsh-video-cli.mjs install-tts --engine indextts25 --dir D:/AI-TTS/index-tts --mirror cn
  node ./bin/dsh-video-cli.mjs install-tts --engine gptvoice --dir D:/AI-TTS/GPT-SoVITS --mirror cn
  ```
- **Via Windows PowerShell Interactive Menu** (also downloadable as `dsh-tts-installer-pack.zip` from GitHub Releases):
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\scripts\install-tts-engine.ps1
  ```
