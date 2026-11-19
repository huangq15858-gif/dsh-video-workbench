import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  loadEnv,
  REPO_ROOT,
  resolveEnvPath,
  runCommandRedirected,
} from '../packages/shared/index.js'
import { setupDshVideoProfile } from './install-profile.mjs'
import LocalTtsPlugin from '../packages/dsh-tool-local-tts/index.js'
import AvatarPlugin from '../packages/dsh-tool-avatar/index.js'
import VideoSuitePlugin from '../packages/dsh-tool-video-suite/index.js'
import PresetVideoPlugin from '../packages/dsh-preset-video/index.js'
import WebVideoWorkbenchPlugin, {
  handleWorkbenchApiRequest,
  listVideoProjects,
} from '../packages/dsh-web-video-workbench/lib/index.js'

/**
 * Verify Cordis plugin registration (`ctx.tools`, `ctx.agentPresets`, `ctx.connection`, `ctx.webui`)
 * in a mock/lightweight Cordis host context.
 */
export function verifyCordisPluginMounting() {
  const registeredTools = []
  const registeredPresets = []
  const registeredRoutes = []
  const registeredStaticModules = []

  const mockCtx = {
    tools: {
      register(def) {
        registeredTools.push({
          name: def.name,
          description: def.description,
          required: def.parameters?.required || [],
          execute: def.execute,
        })
      },
    },
    agentPresets: {
      register(def) {
        registeredPresets.push({
          id: def.id,
          name: def.name,
          pluginCount: Array.isArray(def.plugins) ? def.plugins.length : 0,
        })
      },
    },
    connection: {
      fetch: {
        register(def) {
          registeredRoutes.push({ path: def.path, methods: def.methods })
        },
      },
    },
    webui: {
      addStaticModule(def) {
        registeredStaticModules.push(def)
      },
    },
    plugin(plg) {
      if (typeof plg === 'function') plg(mockCtx)
      else if (plg && typeof plg.apply === 'function') plg.apply(mockCtx)
    },
    inject(_deps, fn) {
      fn(mockCtx)
    },
  }

  PresetVideoPlugin.apply(mockCtx)
  WebVideoWorkbenchPlugin.apply(mockCtx)

  return {
    tools: registeredTools.map((t) => t.name),
    toolDefinitions: registeredTools,
    presets: registeredPresets,
    routes: registeredRoutes,
    staticModules: registeredStaticModules,
  }
}

async function main() {
  loadEnv()
  const rawArgs = process.argv.slice(2)
  // Handle `pnpm.cmd dsh video ...` or `node dsh-runner.mjs video ...`
  const args = rawArgs[0] === 'dsh' ? rawArgs.slice(1) : rawArgs
  const profileName = args[0] && !args[0].startsWith('-') ? args[0] : 'video'
  const flags = new Set(args.filter((a) => a.startsWith('-')))

  const profileSetup = setupDshVideoProfile()
  const projectsInfo = listVideoProjects()
  const cordisMount = verifyCordisPluginMounting()

  console.log('======================================================================')
  console.log(`🎬 DeepSeek Harness Video Workbench — Profile: [${profileName}]`)
  console.log('======================================================================')
  console.log(`• Profile Config : ${profileSetup.profilePatchPath}`)
  console.log(`• Desktop Mount  : ${profileSetup.desktopMounted ? `Mounted (${profileSetup.desktopPatchPath})` : 'Isolated (.dsh-home)'}`)
  console.log(`• Registered Preset : ${cordisMount.presets.map((p) => `${p.name} (${p.id})`).join(', ')}`)
  console.log(`• Registered Tools  : ${cordisMount.tools.join(', ')}`)
  console.log(`• Registered Routes : ${cordisMount.routes.map((r) => r.path).join(', ')}`)
  console.log(`• Active Projects   : ${projectsInfo.projects.map((p) => `${p.name} [${p.engine}]`).join(', ')}`)

  if (flags.has('--dump-config')) {
    const patchContent = readFileSync(profileSetup.profilePatchPath, 'utf8')
    console.log('\n--- [cordis.patch.yml (profile: video)] ---')
    console.log(patchContent.trim())
    console.log('-------------------------------------------')
    return
  }

  // Try probing DSH CLI if available and requested
  const dshAppRoot = resolveEnvPath('DSH_APP_ROOT', '')
  const dshCliCmd = dshAppRoot ? join(dshAppRoot, 'resources', 'runtime', 'cli', 'bin', 'dsh.cmd') : ''

  if (flags.has('--dsh-native') && dshCliCmd && existsSync(dshCliCmd)) {
    console.log(`\n🚀 Launching native DSH CLI with profile '${profileName}'...`)
    const res = await runCommandRedirected(
      'cmd.exe',
      ['/d', '/s', '/c', `"${dshCliCmd}" --profile ${profileName} --version`],
      {
        env: { ...process.env, DSH_HOME: profileSetup.dshHome },
        timeoutMs: 30_000,
      },
    )
    console.log('DSH CLI Output:', (res.stdout || res.stderr).trim())
  }

  // Start HTTP Verification / Standalone Preview Server for `dsh-web-video-workbench`
  const RUNNER_VERSION = 'v8'
  const basePort = Number(process.env.DSH_VIDEO_PORT || 4399)
  const smokeMode = flags.has('--smoke') || flags.has('--verify') || !flags.has('--keep-alive')
  const shouldOpenBrowser = flags.has('--open')

  // Check if an existing runner is already active on basePort
  if (!smokeMode) {
    try {
      const probeRes = await fetch(`http://127.0.0.1:${basePort}/api/video-workbench/runner-info`, {
        signal: AbortSignal.timeout(1200),
      })
      if (probeRes.ok) {
        const info = await probeRes.json()
        if (info?.version === RUNNER_VERSION && info?.repoRoot === REPO_ROOT) {
          console.log(`\n✅ Active DSH Video Workbench (${RUNNER_VERSION}) already listening at: http://127.0.0.1:${basePort}`)
          if (shouldOpenBrowser && process.platform === 'win32') {
            spawn('cmd.exe', ['/c', 'start', '', `http://127.0.0.1:${basePort}`], { detached: true, stdio: 'ignore' }).unref()
          }
          return
        }
      }
    } catch {}
  }

  let actualPort = basePort
  const server = createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://127.0.0.1:${actualPort}`)
    if (url.pathname === '/api/video-workbench/runner-info') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.end(
        JSON.stringify({
          ok: true,
          version: RUNNER_VERSION,
          pid: process.pid,
          port: actualPort,
          url: `http://127.0.0.1:${actualPort}`,
          repoRoot: REPO_ROOT,
        }),
      )
      return
    }
    if (url.pathname.startsWith('/api/video-workbench/')) {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const bodyBuf = Buffer.concat(chunks)
      const webReq = new Request(url.href, {
        method: req.method,
        headers: req.headers,
        body: ['GET', 'HEAD'].includes(req.method || 'GET') ? undefined : bodyBuf,
      })
      const webRes = await handleWorkbenchApiRequest(webReq)
      res.statusCode = webRes.status
      webRes.headers.forEach((v, k) => res.setHeader(k, v))
      const arrayBuf = await webRes.arrayBuffer()
      res.end(Buffer.from(arrayBuf))
      return
    }

    if (url.pathname === '/client.js') {
      const clientJsPath = join(REPO_ROOT, 'packages', 'dsh-web-video-workbench', 'lib', 'client.js')
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.end(readFileSync(clientJsPath, 'utf8'))
      return
    }

    // Serve standalone interactive preview shell hosting `dsh-web-video-workbench` (`client.js`)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.end(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DeepSeek Harness — 双引擎视频工作台 (Profile: ${profileName})</title>
  <style>
    html, body, #root { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: #090d18; color: #f8fafc; font-family: 'Noto Sans SC', 'Microsoft YaHei', Consolas, sans-serif; }
    .dsh-boot-fallback { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 28px; text-align: center; box-sizing: border-box; }
    .dsh-boot-card { max-width: 560px; padding: 24px 28px; border-radius: 16px; background: rgba(15, 23, 42, 0.92); border: 1px solid rgba(148, 163, 184, 0.25); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55); }
  </style>
</head>
<body>
  <div id="root">
    <div class="dsh-boot-fallback" id="boot-splash">
      <div class="dsh-boot-card">
        <div style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">🎬 正在加载 AI 视频工坊...</div>
        <div style="font-size: 13px; color: #94a3b8;" id="boot-status">正在初始化 React 运行时与工作台模块</div>
      </div>
    </div>
  </div>
  <script type="module">
    const showBootError = (title, detail) => {
      const rootEl = document.getElementById('root');
      if (!rootEl) return;
      rootEl.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.className = 'dsh-boot-fallback';
      const card = document.createElement('div');
      card.className = 'dsh-boot-card';
      card.innerHTML = '<div style="font-size:18px;font-weight:800;color:#fb7185;margin-bottom:8px;"></div><pre style="text-align:left;white-space:pre-wrap;font-size:12px;color:#cbd5e1;background:#020617;padding:12px;border-radius:10px;max-height:220px;overflow:auto;"></pre><div style="margin-top:12px;display:flex;gap:10px;justify-content:center;"><button onclick="location.reload()" style="padding:8px 16px;border-radius:8px;border:none;background:#22d3ee;color:#06121e;font-weight:700;cursor:pointer;">重新加载</button></div>';
      card.querySelector('div').textContent = title;
      card.querySelector('pre').textContent = String(detail || '');
      wrap.appendChild(card);
      rootEl.appendChild(wrap);
    };

    window.addEventListener('error', (ev) => {
      if (document.getElementById('boot-splash')) showBootError('工作台页面脚本异常', ev.error?.stack || ev.message);
    });
    window.addEventListener('unhandledrejection', (ev) => {
      if (document.getElementById('boot-splash')) showBootError('工作台模块加载失败', ev.reason?.stack || ev.reason);
    });

    async function loadReactPair() {
      const cdns = [
        ['https://esm.sh/react@18.3.1', 'https://esm.sh/react-dom@18.3.1', 'https://esm.sh/react-dom@18.3.1/client'],
        ['https://cdn.jsdelivr.net/npm/react@18.3.1/+esm', 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/+esm', 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/client/+esm'],
      ];
      let lastErr = null;
      for (const [rUrl, rdUrl, rdcUrl] of cdns) {
        try {
          const [rMod, rdMod, rdcMod] = await Promise.all([import(rUrl), import(rdUrl), import(rdcUrl)]);
          return {
            React: rMod.default || rMod,
            ReactDOM: rdMod.default || rdMod,
            createRoot: rdcMod.createRoot || rdcMod.default?.createRoot || (rdMod.default || rdMod).createRoot,
          };
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr || new Error('无法加载 React 18 运行时（请检查本机网络或关闭异常代理）');
    }

    try {
      const { React, ReactDOM, createRoot } = await loadReactPair();
      window.__DSH_STANDALONE__ = true;
      const slots = new Map();
      window.__ModuleLoader__ = {
        load: ({ factory }) => {
          try {
            const plugin = factory((mod) => {
              if (mod === 'react') return React;
              if (mod === 'react-dom') return ReactDOM;
              return null;
            });
            const ctx = {
              connection: { fetch: window.fetch.bind(window) },
              slots: {
                inject(_slotName, fn) {
                  return typeof fn === 'function' ? fn() : undefined;
                },
                register(arg1, arg2) {
                  if (typeof arg1 === 'string') {
                    slots.set(arg1, arg2);
                  } else if (arg1 && typeof arg1 === 'object' && typeof arg2 === 'function') {
                    slots.set(arg1.name, { ...arg1, render: () => React.createElement(arg2) });
                  }
                }
              }
            };
            plugin.apply(ctx);
            const mainSlot = slots.get('main');
            const overlaySlot = slots.get('shell.overlay');
            const targetSlot = mainSlot || overlaySlot;
            const root = createRoot(document.getElementById('root'));
            root.render(targetSlot ? targetSlot.render() : null);
          } catch (err) {
            showBootError('工作台渲染初始化失败', err?.stack || err);
          }
        }
      };

      const s = document.createElement('script');
      s.src = '/client.js?ts=' + Date.now();
      s.onerror = () => showBootError('加载 /client.js 失败', '无法从独立预览服务读取前端脚本');
      document.body.appendChild(s);
    } catch (err) {
      showBootError('独立浏览器预览运行时加载失败', (err?.stack || err) + '\\n\\n提示：你也可以直接在 DeepSeek Harness 客户端内点击「AI 视频工坊」使用，无需外网 CDN。');
    }
  </script>
</body>
</html>`)
  })
  server.requestTimeout = 660_000
  server.headersTimeout = 660_000

  for (let offset = 0; offset <= 15; offset++) {
    const candidatePort = basePort + offset
    try {
      await new Promise((resolveListen, rejectListen) => {
        const onErr = (err) => {
          server.off('listening', onOk)
          rejectListen(err)
        }
        const onOk = () => {
          server.off('error', onErr)
          resolveListen()
        }
        server.once('error', onErr)
        server.once('listening', onOk)
        server.listen(candidatePort, '127.0.0.1')
      })
      actualPort = candidatePort
      break
    } catch (err) {
      if (err?.code !== 'EADDRINUSE' || offset === 15) throw err
    }
  }
  if (actualPort !== basePort) {
    console.log(`⚠️  Port ${basePort} was busy (e.g. legacy process); auto-bound to free port http://127.0.0.1:${actualPort}`)
  }
  console.log(`\n✅ DSH Video Workbench Service listening at: http://127.0.0.1:${actualPort}`)

  // Perform quick live HTTP self-check against `/api/video-workbench/state`
  const stateResp = await fetch(`http://127.0.0.1:${actualPort}/api/video-workbench/state`)
  const stateJson = await stateResp.json()
  console.log(
    `✅ Live API Health Check (/api/video-workbench/state): HTTP ${stateResp.status} · Voices Loaded: ${stateJson.voiceCatalog?.length || 0} · Active TTS: ${stateJson.ttsConfig?.activeEngineId || 'indextts25'} · Active Preset: ${stateJson.presetName}`,
  )

  if (smokeMode) {
    server.close()
    console.log('✅ `pnpm dsh video` startup & live verification completed with 0 errors.')
  } else {
    if (shouldOpenBrowser && process.platform === 'win32') {
      spawn('cmd.exe', ['/c', 'start', '', `http://127.0.0.1:${actualPort}`], { detached: true, stdio: 'ignore' }).unref()
    }
    console.log('💡 Press Ctrl+C to stop the server.')
  }
}

const isDirectEntry =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isDirectEntry) {
  main().catch((err) => {
    console.error('❌ [dsh-runner] Error:', err)
    process.exit(1)
  })
}
