---
name: dsh-video-workbench
description: Universal Dual-Engine AI Video Studio (Remotion 4.x + Three.js 3D & HyperFrames HTML5) for Claude Code, OpenAI Codex CLI, WorkBuddy, Cursor, Windsurf, Cline, Antigravity, OpenCode, and DeepSeek Harness (DSH). Use when creating animated videos, beat-synced historical/lyric MVs, software tutorials, data/code explainers, reverse-engineering & remaking reference videos via MOTION.md, synthesizing local Chinese TTS/cloning (IndexTTS-2.5, GPT-SoVITS, Edge-TTS, Windows SAPI), or launching the local visual Video Studio.
---

# DSH Video Workbench — Universal Multi-Agent Video Studio Skill

> **Original Author**: Merziller · **QQ**: `1411574209` · **WeChat**: `Merziller` · **Email**: `k26789228@gmail.com`  
> **Repository**: https://github.com/Merziller/dsh-video-workbench (MIT License — retain original author attribution in forks/redistributions)

## Capabilities (29 MCP Tools + Visual Web Studio)

1. **Dual-Engine Video Creation**:
   - **Remotion 4.x TSX + Three.js 3D (`<FreeformThreeStage />`) + Dynamic SVG + `NarrativeDioramaStage`** (backlit hero silhouettes, charging cavalry, waving banners, crescent sword slash VFX, red-black conquest maps, 3D bamboo slips)
   - **HyperFrames HTML5/Canvas + Three.js 3D** deterministic full-FPS CDP renderer
2. **Reference Video Deep Reverse-Engineering & Same-Style Remake (`analyze_reference_video` + `MOTION.md`)**:
   - Feed any reference `.mp4` -> FFprobe + FFmpeg shot-boundary detection + audio BPM/drops + 9-frame contact sheet + 4-protocol Multimodal Vision LLM extracts replicable visual/character/VFX/transition/pacing DNA, writes `MOTION.md`, and binds `script.json.referenceStyle`.
3. **BGM Beat-Sync & Pure-Music MV (`subtitle-mv` / `tts-beat-sync` / `tts`)**:
   - Real BPM/phase/drop detection, 0.5/1/2/4-beat shot quantization, 34–54 high-density shots for dynamic MVs, procedural 48kHz combat/drum/slash/click SFX choreography, and broadcast `-14.5 LUFS` mastering.
4. **Optional Multi-Engine TTS (`install_tts_engine` / `generate_speech`)**:
   - Works out-of-the-box with **0GB GPU Windows Native SAPI** or **Pure-Music Beat-Sync (no TTS)**, OR optionally one-click installs `Edge-TTS`, `IndexTTS-2.5`, `IndexTTS-2`, or `GPT-SoVITS` (automatically creates `voices/` and seeds default reference WAVs!).
5. **Hardware Guard & Brand Kit**:
   - `check_hardware_profile` protects 8GB RAM / iGPU laptops (`auto` / `safe` / `performance`); `manage_brand_kit` persists brand colors, logo, tagline & exports `MOTION.md`.

## Recommended Agent Workflow

1. **Connect MCP** (if not yet connected):
   - Claude Code: `claude mcp add dsh-video-workbench -- node "<repo>/bin/dsh-video-mcp.mjs"`
   - Codex CLI (`~/.codex/config.toml`): `[mcp_servers.dsh_video_workbench]` -> `command = "node"`, `args = ["<repo>/bin/dsh-video-mcp.mjs"]`
   - WorkBuddy / Cursor / Windsurf / Cline: use `.mcp.json` pointing to `node ./bin/dsh-video-mcp.mjs`
   - DeepSeek Harness (DSH): `dsh plugin --profile desktop add github:Merziller/dsh-video-workbench`
2. **Open Visual Studio UI (optional)**: call `open_video_studio` (or run `node bin/dsh-video-cli.mjs studio --open`) -> `http://127.0.0.1:4399`.
3. **Create from Reference Video**:
   - Call `analyze_reference_video({ projectDir, videoPath })` -> inspects cuts, BPM, visual DNA & writes `MOTION.md`.
   - Call `import_assets({ projectDir, sources: [...] })` if user provided BGM or footage.
   - Call `run_agent_pipeline({ projectDir, topic, engine: 'remotion', narrationMode: 'subtitle-mv', mode: 'ai-coded' })`.
4. **Create from Scratch / Assets**:
   - `import_assets` -> `run_agent_pipeline` (or `ai_create_video`) -> `video_qa` -> `export_publish_pack`.
5. **Optional Local TTS Installation**:
   - Call `install_tts_engine({ action: 'list' })` or `install_tts_engine({ action: 'install', engineId: 'edge-tts' | 'indextts25' | 'gptvoice', mirror: 'cn' })`.
