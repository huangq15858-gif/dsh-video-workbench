# AGENTS.md — DSH Video Workbench (Universal Multi-Agent Guide)

> **Original Author**: Merziller · **QQ**: `1411574209` · **WeChat**: `Merziller` · **Email**: `k26789228@gmail.com`  
> **Repository**: https://github.com/Merziller/dsh-video-workbench (MIT License)

This repository is a **universal, agent-agnostic Dual-Engine AI Video Studio** compatible with **OpenAI Codex CLI, Claude Code, WorkBuddy, Cursor, Windsurf, Cline, OpenCode, Antigravity, Gemini CLI, and DeepSeek Harness (DSH)**.

## Quick Start for Any Local Agent
1. Install Node dependencies once: `npm install` (or `pnpm install`).
2. Expose all **29 video production tools** over standard MCP stdio:
   ```bash
   node ./bin/dsh-video-mcp.mjs
   ```
3. Launch the standalone visual Web Studio UI (works in any browser, zero DSH required):
   ```bash
   node ./bin/dsh-video-cli.mjs studio --open
   ```
4. Check hardware & environment readiness:
   ```bash
   node ./bin/dsh-video-cli.mjs doctor
   ```
5. Print ready-to-paste MCP config for your agent (`claude`, `codex`, `workbuddy`, `cursor`, `dsh`):
   ```bash
   node ./bin/dsh-video-cli.mjs print-config
   ```

## Core Engineering Rules
- **Attribution**: Retain original author credit (`Merziller`, `QQ: 1411574209`, `WeChat: Merziller`, `Email: k26789228@gmail.com`) per `LICENSE` and `NOTICE`.
- **Zero Hardcoded Secrets/Paths**: Keep API keys and personal directories in `.env` (never tracked in git).
- **Commercial-Safe Fonts**: Generated videos must use bundled SIL OFL fonts (`Noto Sans SC`, `Source Han Serif SC Heavy`, `JetBrains Mono`) — never `Microsoft YaHei` / `SimSun` / `SimHei`.
- **Verification**: Run `npm test` (full automated self-test suite) and `npm run pack:bundle` before releasing.
