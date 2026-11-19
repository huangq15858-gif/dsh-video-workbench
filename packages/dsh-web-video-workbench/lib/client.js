/* eslint-disable no-undef */
/**
 * DSH Video Workbench Frontend Client (v6 — Kinetic War Room & Studio Redesign)
 * Pure ES Module loaded dynamically inside DSH Web UI via window.__ModuleLoader__.
 * Zero build/JSX required; zero DSH core mutation.
 */
window.__ModuleLoader__?.load({
  id: 'dsh-video-workbench',
  factory: (resolveModule) => {
    const ReactMod = resolveModule('react')
    const React = ReactMod?.default || ReactMod
    const ReactDomMod = (() => {
      try {
        return resolveModule('react-dom')
      } catch {
        return null
      }
    })()
    const createPortal = ReactDomMod?.createPortal || ReactDomMod?.default?.createPortal || null
    const { useState, useEffect, useRef, useMemo, useCallback } = React
    const h = React.createElement

    // =========================================================================
    // 1. UNIFIED VISUAL TOKENS, THEMES & STATIC CATALOGS
    // =========================================================================
    const DARK_THEME = {
      mode: 'dark',
      bgRoot: '#06080E',
      bgPanel: 'rgba(13, 18, 30, 0.84)',
      bgPanelSolid: '#0E1422',
      bgElevated: 'rgba(20, 27, 45, 0.78)',
      bgInput: 'rgba(8, 12, 22, 0.88)',
      bgSidebar: 'rgba(10, 14, 24, 0.90)',
      bgHover: 'rgba(255, 255, 255, 0.06)',
      monitorShell: '#04060A',
      borderSubtle: 'rgba(148, 163, 184, 0.16)',
      borderStrong: 'rgba(148, 163, 184, 0.30)',
      textPrimary: '#F1F5F9',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      accentGold: '#F5B942',
      accentGoldBg: 'rgba(245, 185, 66, 0.14)',
      accentGoldBorder: 'rgba(245, 185, 66, 0.45)',
      accentBlue: '#22D3EE',
      accentBlueBg: 'rgba(34, 211, 238, 0.13)',
      accentBlueBorder: 'rgba(34, 211, 238, 0.42)',
      accentViolet: '#A78BFA',
      accentVioletBg: 'rgba(167, 139, 250, 0.14)',
      accentGreen: '#34D399',
      accentGreenBg: 'rgba(52, 211, 153, 0.13)',
      accentRed: '#FB7185',
      accentRedBg: 'rgba(251, 113, 133, 0.14)',
      shadowCard: '0 20px 54px rgba(0, 0, 0, 0.56)',
      shadowPopover: '0 24px 64px rgba(0, 0, 0, 0.72)',
      scrollThumb: 'rgba(148, 163, 184, 0.28)',
    }

    const LIGHT_THEME = {
      mode: 'light',
      bgRoot: '#EEF3FA',
      bgPanel: 'rgba(255, 255, 255, 0.88)',
      bgPanelSolid: '#FFFFFF',
      bgElevated: 'rgba(243, 247, 253, 0.90)',
      bgInput: 'rgba(255, 255, 255, 0.96)',
      bgSidebar: 'rgba(248, 250, 254, 0.94)',
      bgHover: 'rgba(15, 23, 42, 0.05)',
      monitorShell: '#0F172A',
      borderSubtle: 'rgba(15, 23, 42, 0.11)',
      borderStrong: 'rgba(15, 23, 42, 0.24)',
      textPrimary: '#0F172A',
      textSecondary: '#334155',
      textMuted: '#64748B',
      accentGold: '#B45309',
      accentGoldBg: 'rgba(217, 119, 6, 0.11)',
      accentGoldBorder: 'rgba(217, 119, 6, 0.36)',
      accentBlue: '#0284C7',
      accentBlueBg: 'rgba(2, 132, 199, 0.10)',
      accentBlueBorder: 'rgba(2, 132, 199, 0.35)',
      accentViolet: '#7C3AED',
      accentVioletBg: 'rgba(124, 58, 237, 0.10)',
      accentGreen: '#059669',
      accentGreenBg: 'rgba(5, 150, 105, 0.10)',
      accentRed: '#E11D48',
      accentRedBg: 'rgba(225, 29, 72, 0.10)',
      shadowCard: '0 14px 36px rgba(15, 23, 42, 0.09)',
      shadowPopover: '0 18px 46px rgba(15, 23, 42, 0.18)',
      scrollThumb: 'rgba(15, 23, 42, 0.20)',
    }

    const SKIN_PRESETS = [
      {
        id: 'obsidian-nebula',
        name: '深邃星云 · Cinema',
        badge: '默认',
        darkBg:
          'radial-gradient(ellipse 90% 60% at 15% 15%, rgba(34,211,238,0.16), transparent 60%), radial-gradient(ellipse 80% 55% at 85% 20%, rgba(245,185,66,0.13), transparent 60%), radial-gradient(circle at 50% 90%, rgba(124,58,237,0.18), transparent 65%), #06080E',
        lightBg:
          'radial-gradient(ellipse 90% 60% at 15% 15%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(ellipse 80% 55% at 85% 25%, rgba(245,158,11,0.14), transparent 60%), linear-gradient(180deg, #F0F5FC 0%, #E6EEF8 100%)',
      },
      {
        id: 'cyber-laser',
        name: '霓虹激光矩阵',
        badge: '科技',
        darkBg:
          'radial-gradient(circle at 20% 25%, rgba(6,182,212,0.22), transparent 55%), radial-gradient(circle at 80% 75%, rgba(236,72,153,0.16), transparent 58%), #050811',
        lightBg:
          'radial-gradient(circle at 20% 25%, rgba(14,165,233,0.16), transparent 55%), radial-gradient(circle at 80% 75%, rgba(236,72,153,0.12), transparent 58%), #EDF2FA',
      },
      {
        id: 'emerald-trench',
        name: '翡翠深空舱',
        badge: '沉浸',
        darkBg:
          'radial-gradient(ellipse at 30% 20%, rgba(16,185,129,0.20), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(34,211,238,0.14), transparent 55%), #040B0D',
        lightBg:
          'radial-gradient(ellipse at 30% 20%, rgba(16,185,129,0.16), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(14,165,233,0.12), transparent 55%), #EDF7F4',
      },
      {
        id: 'amber-premiere',
        name: '曜金首映厅',
        badge: '电影',
        darkBg:
          'radial-gradient(ellipse at 50% 0%, rgba(245,185,66,0.22), transparent 60%), radial-gradient(ellipse at 85% 85%, rgba(244,63,94,0.12), transparent 55%), #09070B',
        lightBg:
          'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.16), transparent 60%), radial-gradient(ellipse at 85% 85%, rgba(244,63,94,0.09), transparent 55%), #FAF6EE',
      },
    ]

    // Unified styles matching @dsh-video/shared `VIDEO_STYLES`
    const UNIFIED_STYLES = [
      { id: 'emerald', label: '墨翠轻奢', desc: '深翠墨底 · 柔金光影', swatch: '#45D1B2', gradient: 'linear-gradient(135deg, #45D1B2, #0F766E)' },
      { id: 'tech', label: '科技锋芒', desc: '几何光线 · 精密节奏', swatch: '#22D3EE', gradient: 'linear-gradient(135deg, #0EA5E9, #6366F1)' },
      { id: 'cinematic', label: '电影大片', desc: '黄金比例 · 光影叙事', swatch: '#F5B942', gradient: 'linear-gradient(135deg, #F59E0B, #B45309)' },
      { id: 'documentary', label: '极简纪实', desc: '克制留白 · 权威旁白', swatch: '#94A3B8', gradient: 'linear-gradient(135deg, #64748B, #334155)' },
      { id: 'energetic', label: '活力潮牌', desc: '快切节拍 · 高能撞色', swatch: '#FB7185', gradient: 'linear-gradient(135deg, #F43F5E, #EC4899)' },
      { id: 'warm', label: '温暖故事', desc: '柔光琥珀 · 人文温度', swatch: '#FB923C', gradient: 'linear-gradient(135deg, #FB923C, #D97706)' },
    ]

    const ASPECT_RATIO_OPTIONS = [
      { id: 'auto', label: 'AI 智能判断', sub: '依据主题自动', icon: '✦' },
      { id: '16:9', label: '16:9 横屏', sub: 'B站 / YouTube / 大屏', icon: '▭' },
      { id: '9:16', label: '9:16 竖屏', sub: '抖音 / 快手 / 小红书', icon: '▯' },
      { id: '1:1', label: '1:1 方屏', sub: '信息流 / 动态卡片', icon: '◻' },
      { id: '4:3', label: '4:3 复古', sub: '课件 / 访谈叙事', icon: '❐' },
      { id: 'custom', label: '自定义', sub: '手动宽高像素', icon: '⊞' },
    ]

    const QUALITY_OPTIONS = [
      { id: '720p', label: '720P 极速预览', desc: '快速渲染 · 审片演练' },
      { id: '1080p', label: '1080P 全高清', desc: '主流平台发布标准' },
      { id: '4k', label: '4K 超清母带', desc: '极致画质 · 耗时较长' },
      { id: 'custom', label: '自定义分辨率', desc: '自由输入宽高像素' },
    ]

    const PLATFORM_OPTIONS = [
      { id: 'universal', label: '通用全平台', hint: '标准 5% 安全边距' },
      { id: 'douyin', label: '抖音 / 视频号', hint: '避让右侧点赞与底部字幕区' },
      { id: 'bilibili', label: 'B站 / YouTube', hint: '横屏片头与弹幕防遮挡' },
      { id: 'xiaohongshu', label: '小红书图文视频', hint: '底部文案与首图防裁切' },
    ]

    const MOTION_OPTIONS = [
      { value: 'zoom-in', label: '缓推拉近 (Zoom In)' },
      { value: 'zoom-out', label: '缓拉远景 (Zoom Out)' },
      { value: 'pan-left', label: '横向左移 (Pan Left)' },
      { value: 'pan-right', label: '横向右移 (Pan Right)' },
      { value: 'static', label: '锁定静止 (Static)' },
    ]

    const SCENE_LAYOUT_OPTIONS = [
      { value: '3d-stage-opener', label: '🪐 Three.js 3D 空间开场', sub: '三维透视卡片群 + 3D 几何舞台' },
      { value: 'svg-architecture-flow', label: '🕸️ 动态 SVG 架构拓扑图', sub: '5种系统拓扑 + 贝塞尔光子总线' },
      { value: 'hud-telemetry-dashboard', label: '📊 HUD 遥测数据与代码流', sub: '实时 TSX 代码流 + 环形仪表 + 波形' },
      { value: 'vibecoding-spring-stage', label: '⚡ Vibecoding 节拍弹簧舞台', sub: '双栏弹簧物理联动 + 拓扑/遥测' },
      { value: 'app-focus-shot', label: '🖥️ 软件窗口推镜特写', sub: 'AppWindow + 焦点放大镜' },
      { value: 'workflow-steps', label: '🔗 多步流程演进卡片', sub: '3~5 步横向流程拆解' },
      { value: 'metric-dashboard', label: '📈 核心数据增长看板', sub: '滚动数字 + 进度矩阵 + 架构视窗' },
      { value: 'split-wipe-compare', label: '🌓 A/B 滑动擦除对比', sub: '双画面动态分割线对比' },
      { value: 'multi-window-trio', label: '🪟 三联多视窗矩阵', sub: '三窗口并列脉冲高亮' },
      { value: 'card-fan-opener', label: '🃏 扇形图集阵列开场', sub: '多图弧形扇面展开' },
      { value: 'mosaic-pulse-wall', label: '🧱 节拍脉冲图墙', sub: '6 宫格随音乐鼓点跃动' },
      { value: 'kinetic-impact', label: '💥 高能大字冲击卡点', sub: '逐字弹簧冲击 + 粒子光环' },
      { value: 'radial-climax', label: '🎯 终幕流光印章收尾', sub: '放射速度线 + 品牌落版印章' },
      { value: 'narrative-diorama', label: '🏯 东方史诗剪影剧场', sub: '水墨剪影 + 竖排书法 (历史专用)' },
    ]

    const THREE_PRESET_OPTIONS = [
      { value: 'orbital-core', label: '🪐 星环核心 (orbital-core)' },
      { value: 'cyber-terrain', label: '🏔️ 赛博山谷网格 (cyber-terrain)' },
      { value: 'particle-vortex', label: '🌀 量子粒子星云 (particle-vortex)' },
      { value: 'floating-monoliths', label: '🗿 悬浮几何碑林 (floating-monoliths)' },
      { value: 'chrono-helix', label: '🧬 时空双螺旋 (chrono-helix)' },
      { value: 'matrix-cubes', label: '🧊 全息算力矩阵 (matrix-cubes)' },
    ]

    const WIRE_PROTOCOL_CARDS = [
      {
        id: 'openai-completions',
        title: 'OpenAI 兼容 Chat',
        path: '/v1/chat/completions',
        tag: '通用首选 / 中转站',
        desc: 'DeepSeek、Qwen、硅基流动及绝大多数 API 中转',
        color: '#22D3EE',
      },
      {
        id: 'anthropic-messages',
        title: 'Anthropic 原生 Messages',
        path: '/v1/messages',
        tag: 'Claude 专属',
        desc: '直连 Claude Opus / Sonnet 原生协议头',
        color: '#F5B942',
      },
      {
        id: 'openai-responses',
        title: 'OpenAI Responses',
        path: '/v1/responses',
        tag: 'OpenAI 新一代',
        desc: '官方 GPT Reasoning / Responses 新规范接口',
        color: '#34D399',
      },
      {
        id: 'gemini-native',
        title: 'Gemini 原生 Generate',
        path: '/v1beta/models',
        tag: 'Google 直连',
        desc: 'Google Gemini 原生流式与多模态通道',
        color: '#A78BFA',
      },
    ]

    const LAUNCH_INSPIRATION_TEMPLATES = [
      {
        label: '🪐 Opus 5.5 架构与代码动画',
        topic: '制作一条 35 秒 Opus 5.5 级 Vibecoding 技术大片：融合 Three.js 3D 星环/赛博网格舞台、动态 SVG 系统架构拓扑总线、全息 HUD 遥测代码面板与节拍同步弹簧物理 (spring/interpolate)，硬核拆解 AI 多智能体协同架构。',
        style: 'tech',
        aspect: '16:9',
      },
      {
        label: '🚀 AI 产品震撼发布',
        topic: '制作一条 30 秒电影级产品发布短片：节奏先慢后燃，用高对比霓虹视觉、震撼数字计数动效与强鼓点转场，讲透我们的 AI 新品如何让普通人 3 分钟出大片。',
        style: 'tech',
        aspect: '16:9',
      },
      {
        label: '📱 爆款口播干货教程',
        topic: '制作一条 35 秒竖屏高完播干货口播短片：前 3 秒抛出反常识金句，配合大字高亮动画与重点卡片弹出，分享普通人一定要知道的三个高效创作秘诀。',
        style: 'energetic',
        aspect: '9:16',
      },
      {
        label: '🌟 品牌温情故事短片',
        topic: '制作一条 30 秒温暖电影感品牌故事短片：采用柔和琥珀光影与舒缓钢琴弦乐铺底，讲述团队从灵感萌芽到打磨出第一件作品的真实历程。',
        style: 'warm',
        aspect: '16:9',
      },
      {
        label: '📊 深度洞察与行业拆解',
        topic: '制作一条 35 秒极简纪实风格行业洞察视频：用清晰的图表对比动效、章节导航条与沉稳权威旁白，客观拆解今年行业变革与核心机会点。',
        style: 'documentary',
        aspect: '16:9',
      },
    ]

    const QUICK_FIX_PILLS = [
      { label: '🪐 AI 自由手写本幕 3D+SVG', prompt: '根据本幕台词与主题，使用 FreeformThreeStage 与内联动态 SVG 从零自由编写独一无二的 3D 场景与 2D 矢量图表动画，突破固定预设' },
      { label: '🕸️ 切换为动态 SVG 架构图', prompt: '将当前镜头改为动态 SVG 系统架构拓扑图与光子数据流展示' },
      { label: '📊 切换为 HUD 遥测代码面板', prompt: '将当前镜头改为全息 HUD 遥测环形仪表与实时 TSX 代码流展示' },
      { label: '⚡ 节奏加快一倍', prompt: '把全片切换节奏加快，转场更有冲击力，单幕更干脆利落' },
      { label: '✨ 动效粒子更炫酷', prompt: '升级当前幕前景视觉特效与动效代码，加入光影扫描和数字动效，确保文字清晰' },
      { label: '🔤 加大重点字幕字号', prompt: '显著放大画面标题与关键字幕字号，提高文字与背景对比度，适合手机端一眼看清' },
      { label: '🥁 鼓点配乐更燃', prompt: '重编 BGM 与转场音效节奏，鼓点更有力量感并与分镜切点对齐' },
    ]

    const AGENT_STATION_META = [
      {
        id: 'director',
        name: '策划导演 Agent',
        role: '剧本 · 分镜 · 视觉方案',
        stepTarget: 2,
        icon: 'sparkles',
        color: '#22D3EE',
      },
      {
        id: 'editor',
        name: '素材剪辑 Agent',
        role: '智能选片 · 裁切调色',
        stepTarget: 1,
        icon: 'scissors',
        color: '#F5B942',
      },
      {
        id: 'audio',
        name: '配音混音 Agent',
        role: '多引擎配音 · 人声闪避',
        stepTarget: 2,
        icon: 'mic',
        color: '#34D399',
      },
      {
        id: 'motion_qa',
        name: '动效质检 Agent',
        role: 'Remotion编码 · 自检出片',
        stepTarget: 3,
        icon: 'film',
        color: '#A78BFA',
      },
    ]

    // =========================================================================
    // 2. HELPERS: MEDIA DETECT, ICONS, BEGINNER ERROR TRANSLATOR, THEME WATCH
    // =========================================================================
    function detectDshThemeIsDark() {
      try {
        const html = document.documentElement
        const body = document.body
        const dt = (html.getAttribute('data-theme') || body?.getAttribute('data-theme') || '').toLowerCase()
        if (dt === 'light') return false
        if (dt === 'dark') return true
        if (html.classList.contains('light') || body?.classList.contains('light')) return false
        if (html.classList.contains('dark') || body?.classList.contains('dark')) return true
        const bg = getComputedStyle(body || html).backgroundColor
        const m = bg && bg.match(/\d+/g)
        if (m && m.length >= 3) {
          const lum = (Number(m[0]) * 299 + Number(m[1]) * 587 + Number(m[2]) * 114) / 1000
          return lum < 130
        }
        return window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true
      } catch {
        return true
      }
    }

    function fmtTimecode(frame, fps = 30) {
      const f = Math.max(0, Math.floor(frame))
      const safeFps = Math.max(1, Number(fps) || 30)
      const sec = f / safeFps
      const mm = String(Math.floor(sec / 60)).padStart(2, '0')
      const ss = String(Math.floor(sec % 60)).padStart(2, '0')
      const ff = String(f % safeFps).padStart(2, '0')
      return `${mm}:${ss}:${ff}`
    }

    function fmtSeconds(sec) {
      const s = Math.max(0, Math.floor(Number(sec) || 0))
      const mm = String(Math.floor(s / 60)).padStart(2, '0')
      const ss = String(s % 60).padStart(2, '0')
      return `${mm}:${ss}`
    }

    function readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = () => {
          const str = String(fr.result || '')
          const idx = str.indexOf(',')
          resolve(idx >= 0 ? str.slice(idx + 1) : str)
        }
        fr.onerror = () => reject(fr.error || new Error('读取文件失败'))
        fr.readAsDataURL(file)
      })
    }

    function translateBeginnerError(raw) {
      const msg = String(raw || '').trim()
      if (!msg) return { title: '操作遇到问题', detail: '' }
      const low = msg.toLowerCase()
      if (low.includes('401') || low.includes('403') || low.includes('unauthorized') || low.includes('api key') || low.includes('未配置') || low.includes('invalid x-api-key')) {
        return {
          title: '模型密钥 (API Key) 未设置或无效 — 请点右上角「AI 模型」核对密钥，或切换为「本地草稿预演」零配置先出片',
          detail: msg,
          action: 'open-llm',
        }
      }
      if (low.includes('429') || low.includes('quota') || low.includes('rate limit') || low.includes('余额')) {
        return {
          title: '模型接口请求过于频繁或额度不足 — 请更换模型、稍后重试，或点选「本地草稿预演」继续创作',
          detail: msg,
          action: 'open-llm',
        }
      }
      if (low.includes('enotfound') || low.includes('econnrefused') || low.includes('fetch failed') || low.includes('networkerror') || low.includes('timed out')) {
        return {
          title: '网络连接大模型或本地服务超时 — 请检查网络代理设置或 API Base URL 地址是否正确',
          detail: msg,
          action: 'open-llm',
        }
      }
      if (low.includes('no assets') || low.includes('暂无可用素材')) {
        return {
          title: '当前工程还没有画面素材 — 点一下「🎁 加载新手演示素材」即可立刻试拍成片',
          detail: msg,
          action: 'load-starter',
        }
      }
      return { title: msg, detail: '' }
    }

    function taskStatusBadge(status) {
      if (status === 'completed') return { label: '已完成', color: '#34D399', bg: 'rgba(52, 211, 153, 0.14)', border: 'rgba(52, 211, 153, 0.4)' }
      if (status === 'running') return { label: '运行中', color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.14)', border: 'rgba(34, 211, 238, 0.45)' }
      if (status === 'paused') return { label: '已暂停', color: '#F5B942', bg: 'rgba(245, 185, 66, 0.15)', border: 'rgba(245, 185, 66, 0.45)' }
      if (status === 'failed') return { label: '需处理', color: '#FB7185', bg: 'rgba(251, 113, 133, 0.14)', border: 'rgba(251, 113, 133, 0.45)' }
      if (status === 'stopped') return { label: '已停止', color: '#FB7185', bg: 'rgba(251, 113, 133, 0.12)', border: 'rgba(251, 113, 133, 0.35)' }
      return { label: '待命中', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.25)' }
    }

    function Icon({ name, size = 16, color = 'currentColor' }) {
      const common = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: color,
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        style: { flexShrink: 0, display: 'inline-block' },
      }
      const p = (...ds) => ds.map((d, i) => h('path', { key: i, d }))
      switch (name) {
        case 'film':
          return h('svg', common, h('rect', { x: 2, y: 3, width: 20, height: 18, rx: 3 }), ...p('M7 3v18', 'M17 3v18', 'M2 12h20', 'M2 7.5h5', 'M2 16.5h5', 'M17 7.5h5', 'M17 16.5h5'))
        case 'sparkles':
          return h('svg', common, ...p('M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z', 'M5 17l.9 2.1L8 20l-2.1.9L5 23l-.9-2.1L2 20l2.1-.9z', 'M19 3l.8 1.8L21.5 5.6l-1.7.7L19 8l-.7-1.7-1.8-.7 1.8-.8z'))
        case 'play':
          return h('svg', { ...common, fill: color }, h('polygon', { points: '6 4 20 12 6 20 6 4' }))
        case 'pause':
          return h('svg', { ...common, fill: color }, h('rect', { x: 6, y: 4, width: 4, height: 16 }), h('rect', { x: 14, y: 4, width: 4, height: 16 }))
        case 'upload':
          return h('svg', common, ...p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'))
        case 'folder':
          return h('svg', common, ...p('M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'))
        case 'mic':
          return h('svg', common, ...p('M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v4', 'M8 23h8'))
        case 'cpu':
          return h('svg', common, h('rect', { x: 4, y: 4, width: 16, height: 16, rx: 2 }), h('rect', { x: 9, y: 9, width: 6, height: 6 }), ...p('M9 1v3', 'M15 1v3', 'M9 20v3', 'M15 20v3', 'M20 9h3', 'M20 14h3', 'M1 9h3', 'M1 14h3'))
        case 'sun':
          return h('svg', common, h('circle', { cx: 12, cy: 12, r: 4 }), ...p('M12 2v2', 'M12 20v2', 'M4.93 4.93l1.41 1.41', 'M17.66 17.66l1.41 1.41', 'M2 12h2', 'M20 12h2', 'M6.34 17.66l-1.41 1.41', 'M19.07 4.93l-1.41 1.41'))
        case 'moon':
          return h('svg', common, ...p('M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'))
        case 'plus':
          return h('svg', common, ...p('M12 5v14', 'M5 12h14'))
        case 'trash':
          return h('svg', common, ...p('M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'))
        case 'download':
          return h('svg', common, ...p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'))
        case 'check':
          return h('svg', common, ...p('M20 6L9 17l-5-5'))
        case 'x':
          return h('svg', common, ...p('M18 6L6 18', 'M6 6l12 12'))
        case 'undo':
          return h('svg', common, ...p('M3 7v6h6', 'M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13'))
        case 'code':
          return h('svg', common, ...p('M16 18l6-6-6-6', 'M8 6l-6 6 6 6'))
        case 'zap':
          return h('svg', common, ...p('M13 2L3 14h9l-1 8 10-12h-9l1-8z'))
        case 'camera':
          return h('svg', common, ...p('M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'), h('circle', { cx: 12, cy: 13, r: 4 }))
        case 'palette':
          return h('svg', common, ...p('M12 22a1 1 0 0 1-1-1v-2a1 1 0 0 0-1-1H7a5 5 0 0 1 0-10h1a6 6 0 0 0 6-6 9 9 0 0 1 9 9 9 9 0 0 1-9 9z'))
        case 'scissors':
          return h('svg', common, h('circle', { cx: 6, cy: 6, r: 3 }), h('circle', { cx: 6, cy: 18, r: 3 }), ...p('M20 4L8.12 15.88', 'M14.47 14.48L20 20', 'M8.12 8.12L12 12'))
        case 'chevron-down':
          return h('svg', common, ...p('M6 9l6 6 6-6'))
        case 'sliders':
          return h('svg', common, ...p('M4 21v-7', 'M4 10V3', 'M12 21v-9', 'M12 8V3', 'M20 21v-5', 'M20 12V3', 'M1 14h6', 'M9 8h6', 'M17 16h6'))
        case 'gift':
          return h('svg', common, h('rect', { x: 3, y: 8, width: 18, height: 4 }), h('rect', { x: 4, y: 12, width: 16, height: 9, rx: 1 }), ...p('M12 8v13', 'M12 8H8a2.5 2.5 0 1 1 2.5-2.5V8', 'M12 8h4a2.5 2.5 0 1 0-2.5-2.5V8'))
        case 'eye':
          return h('svg', common, ...p('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'), h('circle', { cx: 12, cy: 12, r: 3 }))
        case 'bot':
          return h('svg', common, h('rect', { x: 3, y: 7, width: 18, height: 13, rx: 3 }), ...p('M12 7V3', 'M8 3h8', 'M9 13v2', 'M15 13v2'))
        default:
          return h('svg', common, h('circle', { cx: 12, cy: 12, r: 8 }))
      }
    }

    function SidebarVideoIcon(props) {
      const sz = Number(props?.size) || 20
      return h(
        'svg',
        { viewBox: '0 0 24 24', width: sz, height: sz, fill: 'none', stroke: 'currentColor', strokeWidth: 1.85, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('rect', { x: 2.5, y: 3.5, width: 19, height: 17, rx: 3 }),
        h('line', { x1: 7.5, y1: 3.5, x2: 7.5, y2: 20.5 }),
        h('line', { x1: 16.5, y1: 3.5, x2: 16.5, y2: 20.5 }),
        h('polygon', { points: '10.5 9 14.5 12 10.5 15', fill: 'currentColor', stroke: 'none' }),
      )
    }

    const ReactComponentBase = React && typeof React.Component === 'function' ? React.Component : class { constructor(props) { this.props = props || {} } }

    class PanelBoundary extends ReactComponentBase {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }
      static getDerivedStateFromError(error) {
        return { error }
      }
      render() {
        if (this.state.error) {
          return h(
            'div',
            { style: { padding: '32px', color: '#FB7185', background: '#07090F', minHeight: '220px', fontFamily: 'Microsoft YaHei, sans-serif' } },
            h('h3', { style: { margin: '0 0 10px', fontSize: '18px' } }, '电影视频工坊面板渲染异常'),
            h('pre', { style: { fontSize: '13px', whiteSpace: 'pre-wrap', opacity: 0.9 } }, String(this.state.error?.message || this.state.error)),
            h(
              'button',
              {
                onClick: () => this.setState({ error: null }),
                style: { marginTop: '14px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#22D3EE', color: '#051018', fontWeight: 700, cursor: 'pointer', fontSize: '14px' },
              },
              '重新加载界面',
            ),
          )
        }
        return this.props.children
      }
    }

    // =========================================================================
    // 3. CUSTOM UI PRIMITIVES (ZERO NATIVE <select> — CINEMA GLASS POPOVER)
    // =========================================================================
    function CinemaSelect({ value, options = [], onChange, placeholder = '请选择', T, style = {}, menuWidth = 'auto', compact = false, disabled = false }) {
      const [open, setOpen] = useState(false)
      const [dropUp, setDropUp] = useState(false)
      const [menuRect, setMenuRect] = useState(null)
      const rootRef = useRef(null)
      const menuRef = useRef(null)

      useEffect(() => {
        if (!open) return undefined
        const syncRect = () => {
          const rect = rootRef.current?.getBoundingClientRect()
          if (!rect) return
          const spaceBelow = Math.max(80, window.innerHeight - rect.bottom - 12)
          const spaceAbove = Math.max(80, rect.top - 12)
          const shouldFlip = spaceBelow < 220 && spaceAbove > spaceBelow
          setDropUp(shouldFlip)
          const maxH = Math.min(280, Math.max(120, Math.floor(shouldFlip ? spaceAbove : spaceBelow)))
          const targetW = menuWidth === 'auto' ? Math.max(rect.width, 180) : menuWidth
          const clampedLeft = Math.max(8, Math.min(rect.left, window.innerWidth - (typeof targetW === 'number' ? targetW : rect.width) - 8))
          setMenuRect({
            left: Math.round(clampedLeft),
            minWidth: typeof targetW === 'number' ? Math.round(targetW) : targetW,
            top: shouldFlip ? undefined : Math.round(rect.bottom + 6),
            bottom: shouldFlip ? Math.round(window.innerHeight - rect.top + 6) : undefined,
            maxHeight: maxH,
          })
        }
        syncRect()
        const onDocClick = (ev) => {
          if (rootRef.current?.contains(ev.target) || menuRef.current?.contains(ev.target)) return
          setOpen(false)
        }
        const onEsc = (ev) => {
          if (ev.key === 'Escape') setOpen(false)
        }
        const onViewportMove = (ev) => {
          if (menuRef.current && ev?.target instanceof Node && menuRef.current.contains(ev.target)) return
          syncRect()
        }
        document.addEventListener('mousedown', onDocClick)
        document.addEventListener('click', onDocClick)
        window.addEventListener('keydown', onEsc)
        window.addEventListener('resize', syncRect)
        window.addEventListener('scroll', onViewportMove, true)
        return () => {
          document.removeEventListener('mousedown', onDocClick)
          document.removeEventListener('click', onDocClick)
          window.removeEventListener('keydown', onEsc)
          window.removeEventListener('resize', syncRect)
          window.removeEventListener('scroll', onViewportMove, true)
        }
      }, [open, menuWidth])

      const activeOpt = options.find((o) => String(o.value) === String(value))
      const menuNode = open
        ? h(
            'div',
            {
              ref: menuRef,
              className: 'dsh-vw-scroll dsh-vw-popover-in',
              style: {
                ...(createPortal && menuRect && typeof document !== 'undefined' && document.body
                  ? {
                      position: 'fixed',
                      left: `${menuRect.left}px`,
                      ...(menuRect.top !== undefined ? { top: `${menuRect.top}px` } : { bottom: `${menuRect.bottom}px` }),
                      width: typeof menuRect.minWidth === 'number' ? `${menuRect.minWidth}px` : menuRect.minWidth,
                      maxWidth: 'calc(100vw - 16px)',
                      maxHeight: `${menuRect.maxHeight}px`,
                      zIndex: 9999,
                    }
                  : {
                      position: 'absolute',
                      left: 0,
                      right: menuWidth === 'auto' ? 0 : 'auto',
                      minWidth: menuWidth === 'auto' ? '100%' : menuWidth,
                      ...(dropUp ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }),
                      maxHeight: '280px',
                      zIndex: 4200,
                    }),
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                padding: '6px',
                borderRadius: '12px',
                background: T.bgPanelSolid,
                border: `1px solid ${T.borderStrong}`,
                boxShadow: T.shadowPopover,
                backdropFilter: 'blur(22px)',
                boxSizing: 'border-box',
                fontFamily: '"Noto Sans SC", system-ui, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
              },
            },
            options.length === 0
              ? h('div', { style: { padding: '12px', fontSize: '13px', color: T.textMuted, textAlign: 'center' } }, '暂无可选项')
              : options.map((opt) => {
                  const isSel = String(opt.value) === String(value)
                  return h(
                    'button',
                    {
                      key: String(opt.value),
                      type: 'button',
                      onClick: () => {
                        setOpen(false)
                        onChange(opt.value)
                      },
                      style: {
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        padding: '9px 11px',
                        borderRadius: '9px',
                        border: 'none',
                        background: isSel ? T.accentBlueBg : 'transparent',
                        color: isSel ? T.accentBlue : T.textPrimary,
                        fontSize: '13.5px',
                        fontWeight: isSel ? 700 : 500,
                        textAlign: 'left',
                        cursor: 'pointer',
                      },
                    },
                    h(
                      'div',
                      { style: { minWidth: 0, flex: 1 } },
                      h(
                        'div',
                        { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '7px' } },
                        opt.badgeColor ? h('span', { style: { width: '9px', height: '9px', borderRadius: '50%', background: opt.badgeColor, flexShrink: 0 } }) : null,
                        opt.label,
                      ),
                      opt.sub ? h('div', { style: { fontSize: '12px', color: T.textMuted, marginTop: '2px' } }, opt.sub) : null,
                    ),
                    isSel ? h(Icon, { name: 'check', size: 15, color: T.accentBlue }) : null,
                  )
                }),
          )
        : null

      return h(
        'div',
        { ref: rootRef, style: { position: 'relative', minWidth: 0, width: style.width || '100%', ...style } },
        h(
          'button',
          {
            type: 'button',
            disabled,
            className: 'dsh-vw-btn',
            onClick: () => !disabled && setOpen((v) => !v),
            style: {
              width: '100%',
              minWidth: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: compact ? '5px' : '8px',
              padding: compact ? '7px 9px' : '10px 14px',
              borderRadius: '10px',
              background: T.bgInput,
              border: `1px solid ${open ? T.accentBlueBorder : T.borderStrong}`,
              boxShadow: open ? `0 0 0 3px ${T.accentBlueBg}` : 'none',
              color: activeOpt ? T.textPrimary : T.textMuted,
              fontSize: compact ? '12px' : '13.5px',
              fontWeight: 600,
              textAlign: 'left',
              cursor: disabled ? 'not-allowed' : 'pointer',
            },
          },
          h(
            'span',
            { style: { minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' } },
            activeOpt?.badgeColor ? h('span', { style: { width: '9px', height: '9px', borderRadius: '50%', background: activeOpt.badgeColor, flexShrink: 0 } }) : null,
            activeOpt ? activeOpt.label : placeholder,
          ),
          h(Icon, { name: 'chevron-down', size: compact ? 13 : 15, color: open ? T.accentBlue : T.textMuted }),
        ),
        menuNode ? (createPortal && typeof document !== 'undefined' && document.body ? createPortal(menuNode, document.body) : menuNode) : null,
      )
    }

    function SegmentedPills({ value, options = [], onChange, T, accent = 'blue', size = 'md', fullWidth = false }) {
      const acColor = accent === 'gold' ? T.accentGold : T.accentBlue
      const acBg = accent === 'gold' ? T.accentGoldBg : T.accentBlueBg
      const acBorder = accent === 'gold' ? T.accentGoldBorder : T.accentBlueBorder
      return h(
        'div',
        {
          style: {
            display: fullWidth ? 'flex' : 'inline-flex',
            flexWrap: 'wrap',
            ...(fullWidth ? { width: '100%' } : {}),
            gap: '5px',
            padding: '4px',
            borderRadius: '11px',
            background: T.bgInput,
            border: `1px solid ${T.borderSubtle}`,
            flexShrink: 0,
          },
        },
        options.map((opt) => {
          const on = String(opt.id) === String(value)
          return h(
            'button',
            {
              key: String(opt.id),
              type: 'button',
              className: 'dsh-vw-btn',
              onClick: () => onChange(opt.id),
              style: {
                ...(fullWidth ? { flex: '1 1 0%', minWidth: 'fit-content', maxWidth: '100%' } : {}),
                padding: size === 'sm' ? '6px 11px' : '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${on ? acBorder : 'transparent'}`,
                background: on ? acBg : 'transparent',
                color: on ? acColor : T.textSecondary,
                fontSize: size === 'sm' ? '12.5px' : '13px',
                fontWeight: on ? 800 : 600,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                whiteSpace: fullWidth ? 'normal' : 'nowrap',
                lineHeight: 1.35,
                textAlign: 'center',
                wordBreak: 'keep-all',
                overflow: 'hidden',
                cursor: 'pointer',
              },
            },
            opt.icon ? h('span', null, opt.icon) : null,
            opt.label,
          )
        }),
      )
    }

    // =========================================================================
    // 4. KINETIC 3D PERSPECTIVE CANVAS & REAL-TIME DSP WAVEFORM
    // =========================================================================
    function WarRoomKineticCanvas({ active, dark, agents = [] }) {
      const canvasRef = useRef(null)
      const stateRef = useRef({ active: false, dark: true, agents: [] })
      stateRef.current = { active: Boolean(active), dark: Boolean(dark), agents: agents || [] }

      useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return undefined
        const ctx2d = canvas.getContext('2d')
        if (!ctx2d) return undefined

        let raf = 0
        let w = 1280
        let hPx = 460
        const resize = () => {
          const rect = canvas.parentElement?.getBoundingClientRect()
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          w = Math.max(600, Math.floor(rect?.width || 1280))
          hPx = Math.max(360, Math.floor(rect?.height || 460))
          canvas.width = Math.floor(w * dpr)
          canvas.height = Math.floor(hPx * dpr)
          ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
        resize()
        window.addEventListener('resize', resize)

        const particles = Array.from({ length: 48 }, (_, i) => ({
          x: Math.random() * 1400,
          y: Math.random() * 600,
          vx: (Math.random() - 0.5) * 0.42,
          vy: -0.18 - Math.random() * 0.35,
          r: (i % 5 === 0 ? 2.6 : 1.4) + Math.random() * 1.1,
          tone: i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'violet' : 'cyan',
        }))

        let t = 0
        let lastTs = 0
        const draw = (ts) => {
          raf = requestAnimationFrame(draw)
          if (ts - lastTs < 24) return
          const dt = Math.min(50, lastTs ? ts - lastTs : 24) / 16.6
          lastTs = ts
          const { active: isAct, dark: isDk, agents: ags } = stateRef.current
          t += 0.018 * (isAct ? 2.3 : 0.85) * dt

          ctx2d.clearRect(0, 0, w, hPx)

          // A. Volumetric aurora halos behind command stage
          const glow1 = ctx2d.createRadialGradient(w * 0.5, hPx * 0.36, 12, w * 0.5, hPx * 0.36, w * 0.46)
          glow1.addColorStop(0, isDk ? (isAct ? 'rgba(34,211,238,0.16)' : 'rgba(34,211,238,0.08)') : isAct ? 'rgba(2,132,199,0.12)' : 'rgba(2,132,199,0.05)')
          glow1.addColorStop(0.55, isDk ? 'rgba(124,58,237,0.06)' : 'rgba(124,58,237,0.03)')
          glow1.addColorStop(1, 'transparent')
          ctx2d.fillStyle = glow1
          ctx2d.fillRect(0, 0, w, hPx)

          // B. 3D Perspective receding floor grid (lower 52% of stage)
          const horizonY = hPx * 0.44
          const floorH = hPx - horizonY
          ctx2d.save()
          ctx2d.beginPath()
          ctx2d.rect(0, horizonY, w, floorH)
          ctx2d.clip()

          const gridColor = isDk ? (isAct ? 'rgba(34,211,238,0.22)' : 'rgba(148,163,184,0.12)') : isAct ? 'rgba(2,132,199,0.18)' : 'rgba(15,23,42,0.09)'
          ctx2d.strokeStyle = gridColor
          ctx2d.lineWidth = 1
          const cols = 16
          for (let c = -cols; c <= cols; c += 1) {
            const topX = w * 0.5 + c * (w / 32)
            const botX = w * 0.5 + c * (w / 7.5)
            ctx2d.beginPath()
            ctx2d.moveTo(topX, horizonY)
            ctx2d.lineTo(botX, hPx)
            ctx2d.stroke()
          }
          const rows = 10
          const zShift = (t * 0.75) % 1
          for (let r = 0; r < rows; r += 1) {
            const p = (r + zShift) / rows
            const y = horizonY + Math.pow(p, 1.85) * floorH
            const alpha = Math.min(1, p * 1.1) * (isDk ? (isAct ? 0.34 : 0.16) : isAct ? 0.24 : 0.11)
            ctx2d.strokeStyle = isDk ? `rgba(34,211,238,${alpha.toFixed(3)})` : `rgba(2,132,199,${alpha.toFixed(3)})`
            ctx2d.beginPath()
            ctx2d.moveTo(0, y)
            ctx2d.lineTo(w, y)
            ctx2d.stroke()
          }
          ctx2d.restore()

          // C. Smooth energy conduits linking the 4 horizontal agent anchors
          const anchors = [0.14, 0.38, 0.62, 0.86].map((rx) => ({ x: w * rx, y: hPx * 0.44 }))
          for (let idx = 0; idx < 3; idx += 1) {
            const p1 = anchors[idx]
            const p2 = anchors[idx + 1]
            const agCur = ags[idx]
            const agNext = ags[idx + 1]
            const conduitHot = isAct && (agCur?.status === 'running' || agCur?.status === 'completed' || agNext?.status === 'running')
            const midX = (p1.x + p2.x) * 0.5
            const ctrlY = p1.y - (idx % 2 === 0 ? 46 : -38)

            ctx2d.strokeStyle = conduitHot
              ? isDk
                ? 'rgba(34,211,238,0.58)'
                : 'rgba(2,132,199,0.52)'
              : isDk
                ? 'rgba(148,163,184,0.18)'
                : 'rgba(15,23,42,0.12)'
            ctx2d.lineWidth = conduitHot ? 2.2 : 1.2
            ctx2d.beginPath()
            ctx2d.moveTo(p1.x, p1.y)
            ctx2d.quadraticCurveTo(midX, ctrlY, p2.x, p2.y)
            ctx2d.stroke()

            // Animated data pulse traveling across bezier curve
            const pulseCount = conduitHot ? 2 : 1
            for (let k = 0; k < pulseCount; k += 1) {
              const u = (t * (conduitHot ? 0.55 : 0.22) + idx * 0.27 + k * 0.5) % 1
              const inv = 1 - u
              const px = inv * inv * p1.x + 2 * inv * u * midX + u * u * p2.x
              const py = inv * inv * p1.y + 2 * inv * u * ctrlY + u * u * p2.y
              ctx2d.fillStyle = conduitHot ? '#F5B942' : isDk ? 'rgba(34,211,238,0.55)' : 'rgba(2,132,199,0.45)'
              ctx2d.beginPath()
              ctx2d.arc(px, py, conduitHot ? 4.2 : 2.6, 0, Math.PI * 2)
              ctx2d.fill()
            }
          }

          // D. Rising luminous ambient motes
          for (const pt of particles) {
            pt.x += pt.vx * dt
            pt.y += pt.vy * (isAct ? 1.8 : 0.8) * dt
            if (pt.y < -12) {
              pt.y = hPx + 12
              pt.x = Math.random() * w
            }
            if (pt.x < -12) pt.x = w + 12
            if (pt.x > w + 12) pt.x = -12
            const alpha = isDk ? (isAct ? 0.72 : 0.36) : isAct ? 0.5 : 0.22
            ctx2d.fillStyle =
              pt.tone === 'gold'
                ? `rgba(245,185,66,${alpha})`
                : pt.tone === 'violet'
                  ? `rgba(167,139,250,${alpha})`
                  : isDk
                    ? `rgba(34,211,238,${alpha})`
                    : `rgba(2,132,199,${alpha})`
            ctx2d.beginPath()
            ctx2d.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2)
            ctx2d.fill()
          }
        }
        raf = requestAnimationFrame(draw)
        return () => {
          cancelAnimationFrame(raf)
          window.removeEventListener('resize', resize)
        }
      }, [])

      return h('canvas', {
        ref: canvasRef,
        'aria-hidden': 'true',
        style: { position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' },
      })
    }

    function AudioWaveformCanvas({ active, isPlaying, dark, height = 42 }) {
      const canvasRef = useRef(null)
      const stRef = useRef({ active: false, isPlaying: false, dark: true })
      stRef.current = { active: Boolean(active), isPlaying: Boolean(isPlaying), dark: Boolean(dark) }

      useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return undefined
        const ctx2d = canvas.getContext('2d')
        if (!ctx2d) return undefined

        let raf = 0
        let lastTs = 0
        let phase = 0
        const render = (ts) => {
          raf = requestAnimationFrame(render)
          if (ts - lastTs < 30) return
          lastTs = ts
          const { active: isAct, isPlaying: isPly, dark: isDk } = stRef.current
          const w = canvas.clientWidth || 320
          const hPx = canvas.clientHeight || height
          if (canvas.width !== w || canvas.height !== hPx) {
            canvas.width = w
            canvas.height = hPx
          }
          phase += isAct || isPly ? 0.16 : 0.045
          ctx2d.clearRect(0, 0, w, hPx)

          const bars = Math.max(24, Math.floor(w / 8))
          const step = w / bars
          for (let i = 0; i < bars; i += 1) {
            const norm = i / bars
            const env = Math.sin(norm * Math.PI)
            const wave = Math.abs(Math.sin(phase + i * 0.42) * 0.65 + Math.cos(phase * 1.3 - i * 0.26) * 0.35)
            const amp = (isAct || isPly ? 0.22 + wave * 0.74 : 0.14 + wave * 0.22) * env
            const bh = Math.max(4, amp * (hPx - 6))
            ctx2d.fillStyle =
              i % 4 === 0
                ? isDk
                  ? '#F5B942'
                  : '#D97706'
                : isDk
                  ? '#22D3EE'
                  : '#0284C7'
            ctx2d.beginPath()
            const x = i * step + 1.5
            const y = (hPx - bh) * 0.5
            ctx2d.roundRect ? ctx2d.roundRect(x, y, Math.max(3, step - 3.5), bh, 2) : ctx2d.rect(x, y, Math.max(3, step - 3.5), bh)
            ctx2d.fill()
          }
        }
        raf = requestAnimationFrame(render)
        return () => cancelAnimationFrame(raf)
      }, [height])

      return h('canvas', { ref: canvasRef, style: { width: '100%', height: `${height}px`, display: 'block' } })
    }

    // =========================================================================
    // 5. MAIN APPLICATION
    // =========================================================================
    let hostLayoutSvc = null
    const hostLayoutListeners = new Set()
    const notifyHostLayout = () => {
      for (const cb of hostLayoutListeners) {
        try {
          cb()
        } catch {}
      }
    }
    const attachHostLayout = (layout) => {
      if (!layout || hostLayoutSvc === layout) return
      hostLayoutSvc = layout
      notifyHostLayout()
      try {
        layout.panelInfo?.subscribe?.(notifyHostLayout)
      } catch {}
    }

    const DEFAULT_TTS_ENGINES_FALLBACK = [
      {
        id: 'indextts25',
        builtin: true,
        kind: 'indextts25',
        name: 'IndexTTS-2.5 (高保真情感克隆)',
        shortName: 'IndexTTS-2.5',
        vramBadge: '推荐 8GB+ 显存',
        description: '支持零样本音色克隆、情感语音参考及 Qwen 情绪指令控制，音质细腻。',
        endpoint: 'http://127.0.0.1:9880',
      },
      {
        id: 'indextts2',
        builtin: true,
        kind: 'indextts2',
        name: 'IndexTTS-2 (经典本地版本)',
        shortName: 'IndexTTS-2',
        vramBadge: '6–8GB 显存',
        description: '兼容旧版 cy_app / IndexTTS-2 HTTP 与本地推理入口。',
        endpoint: 'http://127.0.0.1:9880',
      },
      {
        id: 'gptvoice',
        builtin: true,
        kind: 'gptvoice',
        name: 'GPT-SoVITS (低显存轻量克隆)',
        shortName: 'GPT-SoVITS',
        vramBadge: '4GB+ 显存 · 低配友好',
        description: '专为低显存 / 中低配显卡优化的轻量配音与音色克隆方案，兼容 api_v2.py 与 v1 接口。',
        endpoint: 'http://127.0.0.1:9881',
      },
    ]

    const DEFAULT_TTS_TEMPLATES_FALLBACK = [
      {
        templateId: 'edge-tts-cpu',
        label: 'Edge-TTS (零显卡纯 CPU 命令行)',
        engine: {
          id: 'edge-tts-cpu',
          name: 'Edge-TTS 轻量旁白 (纯CPU零显存)',
          kind: 'cli-command',
          vramBadge: '0GB 显存 · 纯CPU',
          command: 'edge-tts',
          argsTemplate: '--text {{text}} --voice {{voice}} --write-media {{output}}',
          defaultVoice: 'zh-CN-YunxiNeural',
          outputExt: '.mp3',
        },
      },
      {
        templateId: 'fish-speech-openai',
        label: 'Fish Speech / OpenAI /v1/audio/speech',
        engine: {
          id: 'fish-speech-openai',
          name: 'Fish Speech / OpenAI TTS 接口',
          kind: 'openai-tts',
          vramBadge: '云端或本机 API',
          endpoint: 'http://127.0.0.1:8080/v1/audio/speech',
          model: 'fish-speech-1.5',
          voice: 'default',
          responseFormat: 'wav',
          speed: 1.0,
        },
      },
      {
        templateId: 'kokoro-openai',
        label: 'Kokoro-FastAPI (超轻量本地 / CPU)',
        engine: {
          id: 'kokoro-openai',
          name: 'Kokoro 82M 超轻量语音',
          kind: 'openai-tts',
          vramBadge: 'CPU / <2GB 显存',
          endpoint: 'http://127.0.0.1:8880/v1/audio/speech',
          model: 'kokoro',
          voice: 'zf_xiaoxiao',
          responseFormat: 'wav',
          speed: 1.0,
        },
      },
      {
        templateId: 'cosyvoice-http',
        label: 'CosyVoice / ChatTTS 通用 HTTP JSON',
        engine: {
          id: 'cosyvoice-http',
          name: 'CosyVoice / 自定义 HTTP 模型',
          kind: 'http-json',
          vramBadge: '自定义 HTTP',
          endpoint: 'http://127.0.0.1:9882/tts',
          method: 'POST',
          responseType: 'binary',
          responseAudioPath: 'audio',
          payloadTemplate: { text: '{{text}}', voice: '{{voiceName}}', lang: '{{lang}}', speed: '{{speed}}', ref_audio: '{{refAudio}}', prompt_text: '{{promptText}}' },
        },
      },
    ]

    function VideoWorkbenchApp({ ctx, isMainSlot = false, layoutService = null }) {
      const [, setHostLayoutRev] = useState(0)
      useEffect(() => {
        const listener = () => setHostLayoutRev((r) => r + 1)
        hostLayoutListeners.add(listener)
        return () => hostLayoutListeners.delete(listener)
      }, [])
      const getHostLayout = () => {
        if (layoutService) return layoutService
        if (hostLayoutSvc) return hostLayoutSvc
        try {
          if (typeof ctx?.get === 'function') return ctx.get('layout') || null
        } catch {}
        try {
          return ctx?.layout || null
        } catch {}
        return null
      }
      const connFetch = useMemo(() => {
        try {
          const conn = typeof ctx?.get === 'function' ? ctx.get('connection') : ctx?.connection
          if (typeof conn?.fetch === 'function') return conn.fetch.bind(conn)
        } catch {}
        return (url, init = {}) => window.fetch(url, { credentials: 'same-origin', ...init })
      }, [ctx])

      // Host Mode & Theme
      const [mode, setMode] = useState('video')
      const [mainSlotActive, setMainSlotActive] = useState(false)
      const [themePref, setThemePref] = useState(() => {
        try {
          return localStorage.getItem('dsh-vw-theme-pref') || 'follow-dsh'
        } catch {
          return 'follow-dsh'
        }
      })
      const [hostIsDark, setHostIsDark] = useState(() => detectDshThemeIsDark())
      const resolvedDark = themePref === 'follow-dsh' ? hostIsDark : themePref === 'dark'
      const T = resolvedDark ? DARK_THEME : LIGHT_THEME

      useEffect(() => {
        if (themePref !== 'follow-dsh') return undefined
        const update = () => setHostIsDark(detectDshThemeIsDark())
        update()
        const obs = new MutationObserver(update)
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] })
        if (document.body) obs.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] })
        const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
        mq?.addEventListener?.('change', update)
        return () => {
          obs.disconnect()
          mq?.removeEventListener?.('change', update)
        }
      }, [themePref])

      const cycleThemePref = () => {
        const next = themePref === 'follow-dsh' ? 'dark' : themePref === 'dark' ? 'light' : 'follow-dsh'
        setThemePref(next)
        try {
          localStorage.setItem('dsh-vw-theme-pref', next)
        } catch {}
      }

      // Navigation: Streamlined 3 Top Modes (`warroom` | `studio` | `tasks`) + Studio Step `1..4`
      const [activeNav, setActiveNav] = useState('warroom')
      const [studioStep, setStudioStep] = useState(1)
      const [warCenterTab, setWarCenterTab] = useState('theater') // 'theater' | 'mp4' | 'preview'
      const [showProjectDrawer, setShowProjectDrawer] = useState(false)
      const [showAdvancedDirector, setShowAdvancedDirector] = useState(false)

      const goToStudioStep = (step) => {
        setIsPlaying(false)
        setActiveNav('studio')
        setStudioStep(step)
      }

      // Project & Backend Workspace State
      const [projects, setProjects] = useState([])
      const [activeProjectDir, setActiveProjectDir] = useState('')
      const [script, setScript] = useState(null)
      const [projectAssets, setProjectAssets] = useState([])
      const [assetSummary, setAssetSummary] = useState({ image: 0, video: 0, music: 0, sfx: 0, notes: 0, hostVideo: 0, avatarBase: 0, voiceClone: 0 })
      const [hasMp4, setHasMp4] = useState(false)
      const [hasSnapshot, setHasSnapshot] = useState(false)
      const [hasMasterAudio, setHasMasterAudio] = useState(false)
      const [sceneThumbs, setSceneThumbs] = useState({})
      const [step3MonitorSource, setStep3MonitorSource] = useState('html-draft') // 'final-video' | 'html-draft'
      const [qaReport, setQaReport] = useState(null)
      const [buildLog, setBuildLog] = useState(null)
      const [historyCount, setHistoryCount] = useState(0)
      const [voiceCatalog, setVoiceCatalog] = useState([])
      const [availableEmotions, setAvailableEmotions] = useState(['平静', '高兴', '激昂', '温和', '自信', '严肃', '期待', '深沉', '伤心'])
      const [hardwareProfile, setHardwareProfile] = useState(null)
      const [hardwarePreferences, setHardwarePreferences] = useState({ lowSpecMode: 'auto' })
      const [hardwarePolicy, setHardwarePolicy] = useState(null)
      const [showHardwareModal, setShowHardwareModal] = useState(false)
      const [hardwareRefreshing, setHardwareRefreshing] = useState(false)
      const [ttsStatus, setTtsStatus] = useState({ reachable: false, ready: false, engine: 'indextts25', engineName: 'IndexTTS-2.5' })
      const [ttsConfig, setTtsConfig] = useState({
        activeEngineId: 'indextts25',
        engines: DEFAULT_TTS_ENGINES_FALLBACK,
        templates: DEFAULT_TTS_TEMPLATES_FALLBACK,
      })
      const [ttsBackendOutdated, setTtsBackendOutdated] = useState(false)
      const [showTtsModal, setShowTtsModal] = useState(false)
      const [ttsModalTab, setTtsModalTab] = useState('engines') // 'engines' | 'add' | 'import'
      const [builtinTtsForm, setBuiltinTtsForm] = useState({
        indextts25Endpoint: 'http://127.0.0.1:9880',
        indexttsRootDir: '',
        indexttsPythonBin: '',
        gptvoiceEndpoint: 'http://127.0.0.1:9881',
        gptvoiceRootDir: '',
        gptvoicePythonBin: '',
        gptvoiceTextLang: 'zh',
        gptvoicePromptLang: 'zh',
      })
      const [customTtsForm, setCustomTtsForm] = useState({
        id: '',
        name: '',
        kind: 'openai-tts',
        vramBadge: '自定义模型 / 低配友好',
        endpoint: 'http://127.0.0.1:8080/v1/audio/speech',
        method: 'POST',
        apiKey: '',
        model: 'fish-speech-1.5',
        voice: 'default',
        responseFormat: 'wav',
        speed: 1.0,
        responseType: 'binary',
        responseAudioPath: 'audio',
        payloadTemplateText: '{\n  "text": "{{text}}",\n  "voice": "{{voiceName}}",\n  "lang": "{{lang}}",\n  "speed": "{{speed}}"\n}',
        command: 'edge-tts',
        argsTemplate: '--text {{text}} --voice {{voice}} --write-media {{output}}',
        outputExt: '.mp3',
      })
      const [ttsImportJsonText, setTtsImportJsonText] = useState('')
      const [ttsTesting, setTtsTesting] = useState(false)
      const [ttsTestResult, setTtsTestResult] = useState(null)

      // Director & Production Configuration
      const [directorForm, setDirectorForm] = useState({
        topic: '',
        displayTitle: '',
        genre: '',
        genreLabel: '',
        directorNotes: '',
        contentOutline: [],
        style: 'tech',
        engine: 'remotion',
        creationMode: 'ai-coded',
        bgmMode: 'llm-coded',
        narrationMode: 'tts',
        pacingMode: 'auto',
        durationMode: 'auto',
        targetDurationSec: 120,
        bgmTtsPrompt: '科技光影律动 温暖氛围铺底',
        targetPlatform: 'universal',
        aspectRatio: 'auto',
        quality: '1080p',
        customWidth: 1080,
        customHeight: 1920,
        aiBadge: true,
        aiBadgeEnabled: true,
        aiBadgePosition: 'top-right',
        aiBadgeText: '',
        visual3dMode: 'auto',
        useDraftReference: true,
        fps: 30,
        voiceId: 'auto',
      })
      const [polishingTopic, setPolishingTopic] = useState(false)
      const [unpolishedTopicBackup, setUnpolishedTopicBackup] = useState('')
      const [showAvatarEndpointCfg, setShowAvatarEndpointCfg] = useState(false)
      const [avatarEndpointForm, setAvatarEndpointForm] = useState({ provider: 'auto', endpoint: '', apiKey: '' })

      // Step 1: Uploads, Drag State & Teleprompter Camera
      const [isDraggingUpload, setIsDraggingUpload] = useState(false)
      const [uploadProgressState, setUploadProgressState] = useState(null) // { current, total, fileName, percent }
      const [assetDirInput, setAssetDirInput] = useState('')
      const [assetFilter, setAssetFilter] = useState('all')
      const [showTeleprompter, setShowTeleprompter] = useState(false)
      const [teleLinesText, setTeleLinesText] = useState(
        '欢迎来到 DSH 电影视频工坊。\n只要在这里导入素材或现场录制一段口播，\n四位 AI 智能体就会协同完成分镜、剪辑、配音混音与 1080P 成片渲染。',
      )
      const [teleScrollSpeed, setTeleScrollSpeed] = useState(1.1)
      const [teleFontSize, setTeleFontSize] = useState(26)
      const [teleLineHeight, setTeleLineHeight] = useState(1.65)
      const [teleBgOpacity, setTeleBgOpacity] = useState(0.62)
      const [camSelfieMirror, setCamSelfieMirror] = useState(true)
      const [teleMirror, setTeleMirror] = useState(false)
      const [teleAutoScroll, setTeleAutoScroll] = useState(false)
      const [teleCountdown, setTeleCountdown] = useState(0) // 3 -> 2 -> 1 -> 0
      const [camStreaming, setCamStreaming] = useState(false)
      const [camRecording, setCamRecording] = useState(false)
      const [camSeconds, setCamSeconds] = useState(0)
      const [camError, setCamError] = useState('')
      const [camMicLevel, setCamMicLevel] = useState(0)
      const [camTargetRole, setCamTargetRole] = useState('host_video')
      const [camExtractClone, setCamExtractClone] = useState(true)
      const [pendingRecPreview, setPendingRecPreview] = useState(null) // { blob, url, fileName, durationEst }

      // Step 2: Avatar & Advanced Options
      const [avatarTemplates, setAvatarTemplates] = useState([])
      const [avatarProvider, setAvatarProvider] = useState({ provider: 'auto', endpoint: '' })
      const [avatarVisualNotice, setAvatarVisualNotice] = useState('')
      const [avatarCfg, setAvatarCfg] = useState({
        enabled: false,
        mode: 'ai-human',
        layout: 'pip-br',
        presetId: 'cyber-anchor',
        sourcePath: '',
        voiceSamplePath: '',
        chromaKeyColor: '',
      })
      const [speechTempo, setSpeechTempo] = useState(1.0)
      const [useHostVocal, setUseHostVocal] = useState(false)
      const [aiAuthorCode, setAiAuthorCode] = useState(true)
      const [trimClipSec, setTrimClipSec] = useState(0)
      const [clipSpeedMult, setClipSpeedMult] = useState(1.0)
      const [bgmComposePreviewUrl, setBgmComposePreviewUrl] = useState('')

      // Step 3: Monitor, Safe Zone, Script Edits & AI Refine
      const [selectedSceneIdx, setSelectedSceneIdx] = useState(0)
      const [currentFrame, setCurrentFrame] = useState(0)
      const [isPlaying, setIsPlaying] = useState(false)
      const [showSafeGuides, setShowSafeGuides] = useState(false)
      const [safeZonePreflight, setSafeZonePreflight] = useState(null)
      const [refinePrompt, setRefinePrompt] = useState('')
      const [refineScope, setRefineScope] = useState('scene')
      const [scriptDirty, setScriptDirty] = useState(false)

      // Step 4: Publish Pack & QA
      const [publishPackResult, setPublishPackResult] = useState(null)
      const [showMatrixPreview, setShowMatrixPreview] = useState(false)

      // Task Center / Agent Pipeline Runs
      const [taskRuns, setTaskRuns] = useState([])
      const [selectedRunId, setSelectedRunId] = useState('')
      const [taskFilter, setTaskFilter] = useState('all')

      // Modals & Drawers
      const [showNewModal, setShowNewModal] = useState(false)
      const [newProjectTitle, setNewProjectTitle] = useState('')
      const [confirmDeleteDir, setConfirmDeleteDir] = useState('')

      const [showLlmModal, setShowLlmModal] = useState(false)
      const [llmConfig, setLlmConfig] = useState(null)
      const [llmForm, setLlmForm] = useState({
        mode: 'follow-dsh',
        dshProviderId: 'active',
        provider: 'custom',
        format: 'auto',
        baseUrl: '',
        apiKey: '',
        model: '',
        maxRepairRounds: 3,
      })
      const [llmTesting, setLlmTesting] = useState(false)
      const [llmTestResult, setLlmTestResult] = useState(null)

      const [showVoiceModal, setShowVoiceModal] = useState(false)
      const [voiceModalTab, setVoiceModalTab] = useState('library') // 'library' | 'clone'
      const [voiceModalTarget, setVoiceModalTarget] = useState('global')
      const [voiceSearch, setVoiceSearch] = useState('')
      const [voiceGenderFilter, setVoiceGenderFilter] = useState('all')
      const [playingVoiceId, setPlayingVoiceId] = useState('')
      const [voiceImportPath, setVoiceImportPath] = useState('')
      const [voiceImportName, setVoiceImportName] = useState('')
      const [voiceImportGender, setVoiceImportGender] = useState('female')
      const [cloneSubMode, setCloneSubMode] = useState('mic') // 'mic' | 'file' | 'path'
      const [micRecording, setMicRecording] = useState(false)
      const [micSeconds, setMicSeconds] = useState(0)
      const [micVuLevel, setMicVuLevel] = useState(0)
      const [recordedB64, setRecordedB64] = useState('')
      const [recordedFileName, setRecordedFileName] = useState('')
      const [cloneVoiceName, setCloneVoiceName] = useState('')
      const [cloneVoiceGender, setCloneVoiceGender] = useState('female')
      const [cloneVoicePrompt, setCloneVoicePrompt] = useState('')
      const [cloneAuditionVoiceId, setCloneAuditionVoiceId] = useState('')
      const [cloneAuditionText, setCloneAuditionText] = useState('你好，这是我刚克隆完成的专属声线，用大模型驱动的动画配音听起来自然流畅吗？')
      const [cloneAuditionUrl, setCloneAuditionUrl] = useState('')

      const [showVendorModal, setShowVendorModal] = useState(false)
      const [vendorSourceDir, setVendorSourceDir] = useState('')
      const [vendorName, setVendorName] = useState('')
      const [vendorDurationSec, setVendorDurationSec] = useState(6)

      const [showCodeDrawer, setShowCodeDrawer] = useState(false)
      const [codeFiles, setCodeFiles] = useState([])
      const [selectedCodePath, setSelectedCodePath] = useState('')

      const [showSkinModal, setShowSkinModal] = useState(false)
      const [skinConfig, setSkinConfig] = useState(() => {
        try {
          const raw = localStorage.getItem('dsh-vw-skin-v5')
          if (raw) return { id: 'obsidian-nebula', customUrl: '', blurPx: 14, opacity: 0.78, ...JSON.parse(raw) }
        } catch {}
        return { id: 'obsidian-nebula', customUrl: '', blurPx: 14, opacity: 0.78 }
      })

      useEffect(() => {
        try {
          localStorage.setItem('dsh-vw-skin-v5', JSON.stringify(skinConfig))
        } catch {}
      }, [skinConfig])

      // Busy & Toast Notifications
      const [busyLabel, setBusyLabel] = useState('')
      const [busyProgress, setBusyProgress] = useState(0)
      const [toast, setToast] = useState(null)
      const [showRawError, setShowRawError] = useState(false)
      const [assetVersion, setAssetVersion] = useState(1)

      // DOM & Stream Refs
      const initialLoadedRef = useRef(false)
      const prevProjectDirRef = useRef('')
      const thumbRequestedRef = useRef(new Set())
      const iframeRef = useRef(null)
      const step3VideoRef = useRef(null)
      const stageAudioRef = useRef(null)
      const previewAudioRef = useRef(null)
      const fileInputRef = useRef(null)
      const folderInputRef = useRef(null)
      const bgmInputRef = useRef(null)
      const teleImportRef = useRef(null)
      const cloneFileInputRef = useRef(null)
      const skinFileInputRef = useRef(null)
      const avatarBaseInputRef = useRef(null)
      const voiceCloneInputRef = useRef(null)
      const camVideoRef = useRef(null)
      const camStreamRef = useRef(null)
      const camRecorderRef = useRef(null)
      const camTimerRef = useRef(null)
      const camCountdownTimerRef = useRef(null)
      const camAudioCtxRef = useRef(null)
      const camVuRafRef = useRef(0)
      const camChunksRef = useRef([])
      const teleBoxRef = useRef(null)
      const teleRafRef = useRef(0)
      const mediaRecorderRef = useRef(null)
      const micTimerRef = useRef(null)
      const micChunksRef = useRef([])
      const micAudioCtxRef = useRef(null)
      const micVuRafRef = useRef(0)

      const notify = useCallback((message, type = 'info') => {
        setShowRawError(false)
        setToast({ message, type, id: Date.now() })
      }, [])

      useEffect(() => {
        if (!toast || toast.type === 'error') return undefined
        const id = setTimeout(() => setToast(null), 5500)
        return () => clearTimeout(id)
      }, [toast])

      // Inject CSS keyframes + glass utilities dynamically
      const themeCss = useMemo(
        () => `
        .dsh-vw-root { color-scheme: ${resolvedDark ? 'dark' : 'light'}; }
        .dsh-vw-root * { box-sizing: border-box; }
        .dsh-vw-scroll::-webkit-scrollbar { width: 7px; height: 7px; }
        .dsh-vw-scroll::-webkit-scrollbar-track { background: transparent; }
        .dsh-vw-scroll::-webkit-scrollbar-thumb { background: ${T.scrollThumb}; border-radius: 99px; }
        .dsh-vw-btn { transition: background-color 0.16s ease, border-color 0.16s ease, box-shadow 0.2s ease, transform 0.12s ease, opacity 0.15s ease; cursor: pointer; }
        .dsh-vw-btn:hover:not(:disabled) { filter: brightness(1.07); }
        .dsh-vw-btn:active:not(:disabled) { transform: scale(0.982); }
        .dsh-vw-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .dsh-vw-popover-in { animation: dshPopoverIn 0.14s cubic-bezier(0.16, 1, 0.3, 1); }
        .dsh-vw-plasma-cta {
          position: relative;
          overflow: hidden;
          background: ${resolvedDark ? 'linear-gradient(135deg, #0891B2 0%, #2563EB 50%, #D97706 100%)' : 'linear-gradient(135deg, #0369A1 0%, #1D4ED8 54%, #B45309 100%)'};
          background-size: 200% 200%;
          animation: dshPlasmaShift 6s ease infinite;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.42);
        }
        .dsh-vw-plasma-cta::after {
          content: '';
          position: absolute;
          top: -20%;
          left: -55%;
          width: 42%;
          height: 140%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: skewX(-24deg);
          animation: dshReactorSweep 3.4s ease-in-out infinite;
          pointer-events: none;
        }
        .dsh-vw-rec-dot { animation: dshRecPulse 1.1s ease-in-out infinite; }
        .dsh-vw-topbar { min-height: 60px; padding: 8px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: nowrap; }
        .dsh-vw-grid-agents { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; align-items: stretch; margin-top: 6px; }
        .dsh-vw-grid-dock { display: grid; grid-template-columns: 1.05fr 1.35fr 1.05fr; gap: 18px; align-items: stretch; }
        .dsh-vw-grid-filmstrip { display: grid; grid-template-columns: 1.6fr 1fr auto; gap: 16px; align-items: center; }
        .dsh-vw-grid-tasks { display: grid; grid-template-columns: 320px 1fr; gap: 18px; align-items: start; }
        .dsh-vw-grid-studio-2col { display: grid; grid-template-columns: 1.15fr 1fr; gap: 20px; align-items: start; }
        @media (max-width: 1180px) {
          .dsh-vw-topbar { flex-wrap: wrap; padding: 8px 14px; row-gap: 8px; }
          .dsh-vw-grid-agents { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .dsh-vw-grid-dock { grid-template-columns: 1fr; }
          .dsh-vw-grid-filmstrip { grid-template-columns: 1fr; }
          .dsh-vw-grid-tasks { grid-template-columns: 1fr; }
          .dsh-vw-grid-studio-2col { grid-template-columns: 1fr; }
        }
        @keyframes dshPopoverIn { from { opacity: 0; transform: translateY(-4px) scale(0.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes dshReactorSweep { 0% { left: -60%; } 55%, 100% { left: 135%; } }
        @keyframes dshPlasmaShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes dshRecPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.38; transform: scale(0.86); } }
      `,
        [T.scrollThumb, resolvedDark],
      )

      useEffect(() => {
        let el = document.getElementById('dsh-vw-theme-styles')
        if (!el) {
          el = document.createElement('style')
          el.id = 'dsh-vw-theme-styles'
          document.head.appendChild(el)
        }
        el.textContent = themeCss
      }, [themeCss])

      // Main Slot / Shell Overlay Arbitration
      useEffect(() => {
        if (isMainSlot) {
          window.dispatchEvent(new CustomEvent('dsh-video:main-mounted', { detail: { mounted: true } }))
          return () => window.dispatchEvent(new CustomEvent('dsh-video:main-mounted', { detail: { mounted: false } }))
        }
        const onMain = (ev) => setMainSlotActive(Boolean(ev.detail?.mounted))
        window.addEventListener('dsh-video:main-mounted', onMain)
        return () => window.removeEventListener('dsh-video:main-mounted', onMain)
      }, [isMainSlot])

      useEffect(() => {
        const handler = (ev) => {
          if (ev.detail?.mode) setMode(ev.detail.mode)
        }
        window.addEventListener('dsh-video:switch-mode', handler)
        return () => window.removeEventListener('dsh-video:switch-mode', handler)
      }, [])

      useEffect(() => {
        const onKey = (ev) => {
          if (ev.key === 'Escape') {
            setShowNewModal(false)
            setShowVoiceModal(false)
            setShowLlmModal(false)
            setShowTtsModal(false)
            setShowCodeDrawer(false)
            setShowSkinModal(false)
            setShowVendorModal(false)
            setShowProjectDrawer(false)
            setConfirmDeleteDir('')
          }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [])

      const syncLlmFormFromSummary = (cfg) => {
        if (!cfg) return
        setLlmConfig(cfg)
        setLlmForm({
          mode: cfg.mode === 'custom' ? 'custom' : 'follow-dsh',
          dshProviderId: cfg.dshProviderId || 'active',
          provider: cfg.provider || 'custom',
          format: cfg.format || 'auto',
          baseUrl: cfg.baseUrl || '',
          apiKey: cfg.mode === 'custom' && cfg.hasApiKey ? 'KEEP_EXISTING' : '',
          model: cfg.model || '',
          maxRepairRounds: Number(cfg.maxRepairRounds) || 3,
        })
      }

      const syncTtsFormFromSummary = (cfg) => {
        if (!cfg) return
        const normalized = {
          ...cfg,
          engines: Array.isArray(cfg.engines) && cfg.engines.length ? cfg.engines : DEFAULT_TTS_ENGINES_FALLBACK,
          templates: Array.isArray(cfg.templates) && cfg.templates.length ? cfg.templates : DEFAULT_TTS_TEMPLATES_FALLBACK,
        }
        setTtsConfig(normalized)
        const list = normalized.engines || []
        const idx25 = list.find((e) => e.id === 'indextts25') || {}
        const gsv = list.find((e) => e.id === 'gptvoice') || {}
        setBuiltinTtsForm({
          indextts25Endpoint: idx25.endpoint || 'http://127.0.0.1:9880',
          indexttsRootDir: idx25.rootDir || '',
          indexttsPythonBin: idx25.pythonBin || '',
          gptvoiceEndpoint: gsv.endpoint || 'http://127.0.0.1:9881',
          gptvoiceRootDir: gsv.rootDir || '',
          gptvoicePythonBin: gsv.pythonBin || '',
          gptvoiceTextLang: gsv.textLang || 'zh',
          gptvoicePromptLang: gsv.promptLang || 'zh',
        })
      }

      const activeTtsEngineObj =
        (ttsConfig?.engines || []).find((e) => e.id === ttsConfig?.activeEngineId) || {
          id: 'indextts25',
          shortName: 'IndexTTS-2.5',
          name: 'IndexTTS-2.5',
          vramBadge: '推荐 8GB+ 显存',
        }
      const activeTtsLabel = activeTtsEngineObj.shortName || activeTtsEngineObj.name || 'IndexTTS-2.5'

      const refreshState = useCallback(
        async (targetDir = activeProjectDir, opts = {}) => {
          const forceSyncForm = Boolean(opts?.syncForm)
          try {
            const q = targetDir ? `?projectDir=${encodeURIComponent(targetDir)}` : ''
            const res = await connFetch(`/api/video-workbench/state${q}`)
            const data = await res.json()
            if (!data.ok) {
              notify(data.error || '加载工作区失败', 'error')
              return null
            }
            setProjects(data.projects || [])
            setVoiceCatalog(data.voiceCatalog || [])
            const baseEmotions = ['平静', '高兴', '激昂', '温和', '自信', '严肃', '期待', '深沉', '伤心']
            const extraEmotions = Array.isArray(data.availableEmotions) ? data.availableEmotions : []
            setAvailableEmotions(Array.from(new Set([...baseEmotions, ...extraEmotions])))
            setTtsStatus(data.ttsStatus || { reachable: false, ready: false })
            if (data.hardwareProfile) setHardwareProfile(data.hardwareProfile)
            if (data.hardwarePreferences) setHardwarePreferences(data.hardwarePreferences)
            if (data.hardwarePolicy) setHardwarePolicy(data.hardwarePolicy)
            if (data.ttsConfig) syncTtsFormFromSummary(data.ttsConfig)
            if (data.llmConfig) syncLlmFormFromSummary(data.llmConfig)
            if (Array.isArray(data.avatarTemplates)) setAvatarTemplates(data.avatarTemplates)
            if (data.avatarProvider) {
              setAvatarProvider(data.avatarProvider)
              setAvatarEndpointForm({
                provider: data.avatarProvider.provider || 'auto',
                endpoint: data.avatarProvider.endpoint || '',
                apiKey: data.avatarProvider.hasApiKey ? 'KEEP_EXISTING' : '',
              })
            }
            if (Array.isArray(data.taskRuns)) {
              setTaskRuns(data.taskRuns)
              const firstId = data.taskRuns[0]?.id || data.taskRuns[0]?.runId
              if (firstId) setSelectedRunId((prev) => prev || firstId)
            }

            if (data.activeProject) {
              const ap = data.activeProject
              const isNewProjectSelection = prevProjectDirRef.current !== ap.projectDir
              prevProjectDirRef.current = ap.projectDir
              setActiveProjectDir(ap.projectDir)
              setScript(ap.script)
              setProjectAssets(ap.assets || [])
              setAssetSummary(ap.assetSummary || { image: 0, video: 0, music: 0, sfx: 0, notes: 0, hostVideo: 0, avatarBase: 0, voiceClone: 0 })
              setHasMp4(Boolean(ap.hasMp4))
              setHasSnapshot(Boolean(ap.hasSnapshot))
              setHasMasterAudio(Boolean(ap.hasMasterAudio))
              setSceneThumbs(ap.sceneThumbs || {})
              setQaReport(ap.qaReport || null)
              setBuildLog(ap.buildLog || null)
              setHistoryCount(Number(ap.historyCount) || 0)
              setScriptDirty(false)

              const isRemotionAi = ap.script?.engine === 'remotion' && ap.script?.authoringMode === 'ai-coded'
              if (isNewProjectSelection) {
                setStep3MonitorSource(ap.hasMp4 && isRemotionAi ? 'final-video' : 'html-draft')
              } else if (ap.hasMp4 && isRemotionAi && step3MonitorSource !== 'html-draft') {
                setStep3MonitorSource('final-video')
              }
              if (
                ap.hasMp4 &&
                Object.keys(ap.sceneThumbs || {}).length === 0 &&
                !thumbRequestedRef.current.has(ap.projectDir)
              ) {
                thumbRequestedRef.current.add(ap.projectDir)
                connFetch('/api/video-workbench/action', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ projectDir: ap.projectDir, action: 'extract-scene-thumbs' }),
                })
                  .then((r) => r.json())
                  .then((td) => {
                    if (td?.ok && td.sceneThumbs) setSceneThumbs(td.sceneThumbs)
                  })
                  .catch(() => {})
              }

              if (ap.script?.avatarClip) {
                setAvatarCfg((prev) => ({
                  ...prev,
                  enabled: true,
                  mode: ap.script.avatarClip.mode || prev.mode,
                  layout: ap.script.avatarLayout || ap.script.avatarClip.layout || prev.layout,
                  presetId: ap.script.avatarClip.presetId || prev.presetId,
                  sourcePath: ap.script.avatarClip.sourceVideoPath || ap.script.avatarClip.sourceImagePath || prev.sourcePath,
                }))
                if (ap.script.avatarClip.visualNotice) {
                  setAvatarVisualNotice(ap.script.avatarClip.visualNotice)
                }
              }

              if (isNewProjectSelection || forceSyncForm) {
                const rawEngine = String(ap.script?.engine || 'remotion').toLowerCase()
                const normEngine = rawEngine === 'html' || rawEngine === 'html5' ? 'html' : 'remotion'
                const BOILERPLATE_GOALS = new Set([
                  '带有文案、配音、音效、动效、音乐与字幕的完整成片',
                  '呈现具备动态视觉排版、空间运镜、粒子光效、节拍音效、配乐与配音的完整成片',
                ])
                const normalizeOutline = (val) => {
                  if (Array.isArray(val)) return val.map((x) => String(x ?? '').trim()).filter(Boolean)
                  const s = String(val ?? '').trim()
                  if (!s) return []
                  const byLines = s.split(/\r?\n+/).map((x) => x.trim().replace(/^[-\d.、\s]+/, '').trim()).filter(Boolean)
                  if (byLines.length > 1) return byLines
                  const legacy = s
                    .split(/(?<=。),|,(?=\s*(?:第\s*\d+\s*步|[\u4e00-\u9fa5A-Za-z0-9｜| ]{2,18}[：:]))/)
                    .map((x) => x.trim().replace(/^[-\d.、\s]+/, '').trim())
                    .filter(Boolean)
                  return legacy.length > 1 ? legacy : byLines
                }
                const resolveDisplayPrompt = (sc) => {
                  if (!sc || typeof sc !== 'object') return ''
                  const rawGoal = String(sc.goal || sc.userPrompt || '').trim()
                  const notes = String(sc.directorNotes || '').trim()
                  const outlineArr = normalizeOutline(sc.contentOutline)
                  const title = String(sc.displayTitle || sc.topic || sc.title || '').trim()
                  const gLabel = String(sc.genreLabel || '').trim()
                  if (rawGoal && !BOILERPLATE_GOALS.has(rawGoal)) {
                    if (/【\s*(?:作品标题|体裁|内容要点|导演备注)/.test(rawGoal) || (!notes && outlineArr.length === 0) || rawGoal.length >= 60) {
                      return rawGoal
                    }
                  }
                  if (notes || outlineArr.length > 0) {
                    const parts = []
                    if (title) parts.push(`【作品标题】${title}`)
                    if (gLabel) parts.push(`【体裁】${gLabel}`)
                    if (rawGoal && !BOILERPLATE_GOALS.has(rawGoal) && rawGoal !== title) parts.push(`【一句话】${rawGoal}`)
                    if (outlineArr.length > 0) parts.push(`【内容要点】\n${outlineArr.map((x, i) => `${i + 1}. ${x}`).join('\n')}`)
                    if (notes) parts.push(`【导演备注（仅供 AI 制作，不会出现在视频里）】\n${notes}`)
                    return parts.join('\n')
                  }
                  if (rawGoal && !BOILERPLATE_GOALS.has(rawGoal)) return rawGoal
                  return title
                }
                const hydratedOutline = normalizeOutline(ap.script?.contentOutline)
                const hydratedPrompt = resolveDisplayPrompt(ap.script)
                setDirectorForm((prev) => ({
                  ...prev,
                  topic: hydratedPrompt || prev.topic || '',
                  displayTitle: ap.script?.displayTitle || ap.script?.title || prev.displayTitle || '',
                  genre: ap.script?.genre || prev.genre || '',
                  genreLabel: ap.script?.genreLabel || prev.genreLabel || '',
                  directorNotes: ap.script?.directorNotes || prev.directorNotes || '',
                  contentOutline: hydratedOutline.length > 0 ? hydratedOutline : prev.contentOutline || [],
                  style: UNIFIED_STYLES.some((s) => s.id === ap.script?.style) ? ap.script.style : 'tech',
                  engine: normEngine,
                  creationMode: ap.script?.creationMode || 'ai-coded',
                  bgmMode: ap.script?.bgmMode || ap.script?.audioSpec?.bgmMode || ((ap.assets?.items || []).some((a) => a.role === 'music') ? 'uploaded' : 'llm-coded'),
                  narrationMode: ap.script?.narrationMode || 'tts',
                  pacingMode: ap.script?.pacingMode || 'auto',
                  durationMode: ap.script?.durationMode === 'custom' || Number(ap.script?.targetDurationSec) >= 10 ? 'custom' : 'auto',
                  targetDurationSec: Number(ap.script?.targetDurationSec) >= 10 ? Math.round(Number(ap.script.targetDurationSec)) : (prev.targetDurationSec || 120),
                  visual3dMode: ap.script?.visual3dMode || 'auto',
                  targetPlatform: ap.script?.targetPlatform || 'universal',
                  aspectRatio: ap.script?.requestedAspectRatio || ap.script?.aspectRatio || 'auto',
                  quality: ap.script?.quality || '1080p',
                  customWidth: Number(ap.script?.width) || prev.customWidth || 1080,
                  customHeight: Number(ap.script?.height) || prev.customHeight || 1920,
                  aiBadge: ap.script?.aiBadge !== undefined ? Boolean(ap.script.aiBadge) : true,
                  aiBadgeEnabled: ap.script?.aiBadgeEnabled !== undefined ? Boolean(ap.script.aiBadgeEnabled) : (ap.script?.aiBadge !== false),
                  aiBadgePosition: ap.script?.aiBadgePosition || 'top-right',
                  aiBadgeText: ap.script?.aiBadgeText || '',
                  fps: Number(ap.script?.fps) || 30,
                  voiceId: ap.script?.defaultVoiceId || 'auto',
                }))
              }

              if (!initialLoadedRef.current) {
                initialLoadedRef.current = true
                setActiveNav('warroom')
              }
            }
            return data
          } catch (err) {
            notify(`连接后端服务失败: ${err.message}`, 'error')
            return null
          }
        },
        [connFetch, activeProjectDir, notify],
      )

      const updateDirectorAndSync = useCallback(
        (patch) => {
          setDirectorForm((prev) => ({ ...prev, ...patch }))
          setScript((prev) => (prev ? { ...prev, ...patch } : prev))
          if (activeProjectDir) {
            connFetch('/api/video-workbench/action', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                projectDir: activeProjectDir,
                action: 'update-format',
                ...patch,
              }),
            }).catch(() => {})
          }
        },
        [activeProjectDir, connFetch],
      )

      useEffect(() => {
        refreshState('')
      }, [])

      useEffect(() => {
        if (!showTtsModal) return
        let cancelled = false
        ;(async () => {
          try {
            const res = await connFetch('/api/video-workbench/tts-config')
            if (!res.ok) {
              if (!cancelled && res.status === 404) setTtsBackendOutdated(true)
              return
            }
            const d = await res.json().catch(() => null)
            if (cancelled || !d?.ok) return
            setTtsBackendOutdated(false)
            if (d.config) syncTtsFormFromSummary(d.config)
            if (d.ttsStatus) setTtsStatus(d.ttsStatus)
          } catch {}
        })()
        return () => {
          cancelled = true
        }
      }, [showTtsModal, connFetch])

      const switchWorkbenchMode = (nextMode) => {
        setMode(nextMode)
        window.dispatchEvent(new CustomEvent('dsh-video:switch-mode', { detail: { mode: nextMode } }))
        if (nextMode === 'video') refreshState(activeProjectDir)
      }

      // Safe-zone preflight watcher
      useEffect(() => {
        if (!activeProjectDir) return undefined
        let cancelled = false
        const plat = directorForm.targetPlatform || script?.targetPlatform || 'universal'
        connFetch(`/api/video-workbench/safe-zone?projectDir=${encodeURIComponent(activeProjectDir)}&platform=${encodeURIComponent(plat)}`)
          .then((r) => r.json())
          .then((d) => {
            if (!cancelled && d.ok) setSafeZonePreflight(d.preflight)
          })
          .catch(() => {})
        return () => {
          cancelled = true
        }
      }, [activeProjectDir, directorForm.targetPlatform, script?.width, script?.height, script?.targetPlatform, assetVersion, connFetch])

      // Live Pipeline Tasks Poller
      const fetchTaskRuns = useCallback(async () => {
        if (!activeProjectDir) return
        try {
          const res = await connFetch(`/api/video-workbench/tasks?projectDir=${encodeURIComponent(activeProjectDir)}`)
          const d = await res.json()
          if (d.ok && Array.isArray(d.runs)) {
            setTaskRuns(d.runs)
            if (d.runs[0]?.id) setSelectedRunId((prev) => prev || d.runs[0].id)
          }
        } catch {}
      }, [activeProjectDir, connFetch])

      const activeProjectTaskRuns = useMemo(
        () => taskRuns.filter((r) => activeProjectDir && r.projectDir === activeProjectDir),
        [taskRuns, activeProjectDir],
      )

      const hasLiveTask = useMemo(
        () => activeProjectTaskRuns.some((r) => r.status === 'running' || r.status === 'paused' || r.status === 'queued'),
        [activeProjectTaskRuns],
      )

      const prevLiveRef = useRef(false)
      useEffect(() => {
        if (prevLiveRef.current && !hasLiveTask && activeProjectDir) {
          // A live pipeline just finished — reload assets, script & switch War Stage to Cinema MP4 Player if ready!
          setAssetVersion((v) => v + 1)
          refreshState(activeProjectDir).then((d) => {
            if (d?.activeProject?.hasMp4) setWarCenterTab('mp4')
          })
        }
        prevLiveRef.current = hasLiveTask
      }, [hasLiveTask, activeProjectDir, refreshState])

      useEffect(() => {
        if (!activeProjectDir || (!hasLiveTask && activeNav !== 'tasks')) return undefined
        const ms = hasLiveTask ? 900 : 3500
        const timer = setInterval(fetchTaskRuns, ms)
        return () => clearInterval(timer)
      }, [activeProjectDir, hasLiveTask, activeNav, fetchTaskRuns])

      // Teleprompter auto-scroll loop
      useEffect(() => {
        if (!teleAutoScroll || !teleBoxRef.current) return undefined
        let raf = 0
        let last = performance.now()
        const tick = (now) => {
          const dt = (now - last) / 1000
          last = now
          if (teleBoxRef.current) teleBoxRef.current.scrollTop += dt * teleScrollSpeed * 38
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
      }, [teleAutoScroll, teleScrollSpeed])

      // Async Job Poller
      const pollBackgroundJob = useCallback(
        async (jobId, { silentBusy = false } = {}) => {
          while (true) {
            await new Promise((r) => setTimeout(r, 750))
            const res = await connFetch(`/api/video-workbench/jobs?id=${encodeURIComponent(jobId)}`)
            const payload = await res.json()
            if (!payload.ok || !payload.job) throw new Error(payload.error || '任务查询失败')
            const job = payload.job
            if (!silentBusy) {
              if (job.message) setBusyLabel(job.message)
              if (Number.isFinite(Number(job.progress))) setBusyProgress(Number(job.progress))
            }
            if (job.status === 'done') return job.result || {}
            if (job.status === 'error') throw new Error(job.error || '后台任务执行失败')
          }
        },
        [connFetch],
      )

      // Monitor Seek & Audio Sync (supports both Real Rendered MP4 Timeline and HTML5 Interactive Canvas)
      const isRemotionAiCoded = Boolean(script?.engine === 'remotion' && script?.authoringMode === 'ai-coded')
      const usingFinalVideoPreview = Boolean(hasMp4 && step3MonitorSource === 'final-video')

      const seekToFrame = useCallback(
        (frame, syncAudio = true) => {
          const fps = Number(script?.fps) || 30
          const total = Math.max(1, Number(script?.totalDurationInFrames) || 300)
          const clamped = Math.max(0, Math.min(total - 1, Math.floor(frame)))
          setCurrentFrame(clamped)
          const targetSec = clamped / fps
          if (usingFinalVideoPreview && step3VideoRef.current) {
            try {
              if (Math.abs((step3VideoRef.current.currentTime || 0) - targetSec) > 0.08) {
                step3VideoRef.current.currentTime = targetSec
              }
            } catch {}
            return
          }
          if (syncAudio && stageAudioRef.current) {
            try {
              if (Math.abs((stageAudioRef.current.currentTime || 0) - targetSec) > 0.12) {
                stageAudioRef.current.currentTime = targetSec
              }
            } catch {}
          }
          const win = iframeRef.current?.contentWindow
          if (win) {
            try {
              if (typeof win.__seekToFrame === 'function') win.__seekToFrame(clamped)
              else win.postMessage({ type: 'dsh-seek', frame: clamped }, '*')
            } catch {
              win.postMessage({ type: 'dsh-seek', frame: clamped }, '*')
            }
          }
        },
        [script, usingFinalVideoPreview],
      )

      useEffect(() => {
        const previewActive = (activeNav === 'studio' && studioStep === 3) || (activeNav === 'warroom' && warCenterTab === 'preview')
        if (usingFinalVideoPreview && step3VideoRef.current && previewActive) {
          try {
            stageAudioRef.current?.pause()
          } catch {}
          const vid = step3VideoRef.current
          if (isPlaying) {
            vid.play().catch(() => setIsPlaying(false))
          } else {
            vid.pause()
          }
          return undefined
        }
        if (!isPlaying || !previewActive) {
          try {
            stageAudioRef.current?.pause()
            step3VideoRef.current?.pause()
          } catch {}
          return undefined
        }
        const fps = Number(script?.fps) || 30
        const total = Math.max(1, Number(script?.totalDurationInFrames) || 300)
        if (hasMasterAudio && stageAudioRef.current) {
          try {
            stageAudioRef.current.currentTime = Math.min((total - 1) / fps, currentFrame / fps)
            stageAudioRef.current.play().catch(() => {})
          } catch {}
        }
        let rafId = 0
        let lastTime = performance.now()
        let acc = currentFrame
        const tick = (now) => {
          const dt = (now - lastTime) / 1000
          lastTime = now
          if (hasMasterAudio && stageAudioRef.current && !stageAudioRef.current.paused) {
            acc = stageAudioRef.current.currentTime * fps
          } else {
            acc += dt * fps
          }
          if (acc >= total - 1) {
            seekToFrame(0, true)
            setIsPlaying(false)
            return
          }
          seekToFrame(acc, false)
          rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafId)
      }, [isPlaying, activeNav, studioStep, warCenterTab, script, hasMasterAudio, usingFinalVideoPreview, seekToFrame])

      // Derived Values
      const scenes = useMemo(() => script?.scenes || [], [script])
      useEffect(() => {
        if (scenes.length === 0) setSelectedSceneIdx(0)
        else if (selectedSceneIdx >= scenes.length) setSelectedSceneIdx(scenes.length - 1)
      }, [scenes, selectedSceneIdx])

      const activePlayingSceneIdx = useMemo(() => {
        const idx = scenes.findIndex((s) => {
          const sf = Number(s.startFrame || 0)
          const ef = sf + Math.max(1, Number(s.durationInFrames) || 90)
          return currentFrame >= sf && currentFrame < ef
        })
        return idx >= 0 ? idx : 0
      }, [scenes, currentFrame])

      const selectedScene = scenes[selectedSceneIdx] || null

      const specialRoleCount = useMemo(
        () => (assetSummary.hostVideo || 0) + (assetSummary.avatarBase || 0) + (assetSummary.voiceClone || 0),
        [assetSummary],
      )

      const filteredAssets = useMemo(() => {
        if (assetFilter === 'all') return projectAssets
        if (assetFilter === 'music') return projectAssets.filter((a) => a.role === 'music')
        if (assetFilter === 'special') return projectAssets.filter((a) => ['host_video', 'avatar_base', 'voice_clone'].includes(a.role))
        return projectAssets.filter((a) => a.type === assetFilter)
      }, [projectAssets, assetFilter])

      const filteredVoices = useMemo(() => {
        const q = voiceSearch.trim().toLowerCase()
        return voiceCatalog.filter((v) => {
          if (voiceGenderFilter !== 'all' && v.gender !== voiceGenderFilter) return false
          if (!q) return true
          return (
            v.name?.toLowerCase().includes(q) ||
            v.id?.toLowerCase().includes(q) ||
            v.tags?.some((t) => t.toLowerCase().includes(q)) ||
            v.description?.toLowerCase().includes(q)
          )
        })
      }, [voiceCatalog, voiceSearch, voiceGenderFilter])

      const currentTaskRun = useMemo(() => {
        if (!activeProjectTaskRuns.length) return null
        return activeProjectTaskRuns.find((r) => r.id === selectedRunId) || activeProjectTaskRuns[0]
      }, [activeProjectTaskRuns, selectedRunId])

      const mountedBgmItem = useMemo(() => {
        const up = script?.bgm?.uploadedPath || script?.bgm?.path
        if (up) {
          const found = projectAssets.find((a) => a.path === up)
          if (found) return found
        }
        return projectAssets.find((a) => a.role === 'music') || null
      }, [script, projectAssets])

      // =======================================================================
      // 6. ACTION HANDLERS (FULL PIPELINE + BINARY UPLOAD + TELEPROMPTER + LLM)
      // =======================================================================
      const handleSelectProject = async (dir) => {
        setIsPlaying(false)
        setPublishPackResult(null)
        setBgmComposePreviewUrl('')
        setSelectedRunId('')
        setShowProjectDrawer(false)
        setActiveProjectDir(dir)
        await refreshState(dir)
      }

      const handleCreateProject = async () => {
        const title = newProjectTitle.trim() || `影视作品 ${projects.length + 1}`
        setBusyLabel('正在创建新工程目录...')
        try {
          const res = await connFetch('/api/video-workbench/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              engine: directorForm.engine,
              style: directorForm.style,
              aspectRatio: directorForm.aspectRatio,
              quality: directorForm.quality,
              width: directorForm.quality === 'custom' || directorForm.aspectRatio === 'custom' ? Number(directorForm.customWidth) : undefined,
              height: directorForm.quality === 'custom' || directorForm.aspectRatio === 'custom' ? Number(directorForm.customHeight) : undefined,
              aiBadge: directorForm.aiBadgeEnabled,
              aiBadgeEnabled: directorForm.aiBadgeEnabled,
              aiBadgePosition: directorForm.aiBadgePosition || 'top-right',
              aiBadgeText: directorForm.aiBadgeText || '',
              pacingMode: directorForm.pacingMode || 'auto',
              durationMode: directorForm.durationMode || 'auto',
              targetDurationSec: directorForm.durationMode === 'custom' ? Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120))) : 0,
              targetPlatform: directorForm.targetPlatform,
              bgmMode: directorForm.bgmMode,
              creationMode: directorForm.creationMode,
              defaultVoiceId: directorForm.voiceId,
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(d.error || '新建工程失败', 'error')
            return
          }
          setShowNewModal(false)
          setNewProjectTitle('')
          setActiveProjectDir(d.projectDir)
          await refreshState(d.projectDir)
          notify(`已新建并切换到工程「${title}」`, 'success')
        } catch (err) {
          notify(`新建工程异常: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      const handleDeleteProject = async (dir) => {
        if (!dir) return
        setBusyLabel('正在删除工程目录...')
        try {
          const res = await connFetch('/api/video-workbench/projects/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectDir: dir }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(d.error || '删除失败', 'error')
            return
          }
          setConfirmDeleteDir('')
          await refreshState(dir === activeProjectDir ? '' : activeProjectDir)
          notify('工程已清理移除', 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const applyAutoBoundAssets = (autoBound) => {
        if (!autoBound || typeof autoBound !== 'object') return []
        const notes = []
        if (autoBound.bgm) {
          setDirectorForm((p) => ({ ...p, bgmMode: 'uploaded' }))
          const bpmTxt = autoBound.bgm.bpm ? ` · ${autoBound.bgm.bpm} BPM` : ''
          const dropTxt = autoBound.bgm.dropsCount ? ` · ${autoBound.bgm.dropsCount} 个高潮突降点` : ''
          notes.push(`🎵 已自动切换并绑定上传 BGM「${autoBound.bgm.name}」${bpmTxt}${dropTxt}`)
        }
        if (autoBound.avatarBase?.path) {
          setAvatarCfg((p) => ({ ...p, sourcePath: autoBound.avatarBase.path }))
          notes.push(`👤 已绑定数字人底板「${autoBound.avatarBase.name}」`)
        }
        if (autoBound.voiceClone?.path) {
          setAvatarCfg((p) => ({ ...p, voiceSamplePath: autoBound.voiceClone.path }))
          notes.push(`🎤 已绑定声音克隆样本「${autoBound.voiceClone.name}」`)
        }
        if (autoBound.hostVideo?.path) {
          setUseHostVocal(true)
          notes.push(`🎬 已启用真人出镜原声「${autoBound.hostVideo.name}」`)
        }
        return notes
      }

      // Raw Binary Streaming Upload (Zero Base64 bloat on large MP4s!)
      const handleUploadFiles = async (fileList, forcedRole = '') => {
        const files = Array.from(fileList || []).filter(Boolean)
        if (!files.length || !activeProjectDir) return
        let uploadedCount = 0
        let lastManifestItems = null
        let lastSummary = null
        const boundNotes = []
        try {
          for (let i = 0; i < files.length; i += 1) {
            const file = files[i]
            setUploadProgressState({
              current: i + 1,
              total: files.length,
              fileName: file.name,
              percent: Math.round(((i + 0.4) / files.length) * 100),
            })
            const localPath = typeof file.path === 'string' ? file.path : ''
            const q = `projectDir=${encodeURIComponent(activeProjectDir)}&fileName=${encodeURIComponent(file.name)}&role=${encodeURIComponent(forcedRole || '')}&localPath=${encodeURIComponent(localPath)}`
            let bodyPayload = file
            try {
              const ab = await file.arrayBuffer()
              bodyPayload = new Uint8Array(ab)
            } catch {}
            const res = await connFetch(`/api/video-workbench/assets/upload?${q}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/octet-stream' },
              body: bodyPayload,
            })
            const d = await res.json()
            if (!d.ok) {
              notify(`文件「${file.name}」上传失败: ${d.error}`, 'error')
            } else {
              uploadedCount += d.matchedCount || d.addedCount || d.uploadedCount || 1
              if (Array.isArray(d.manifest?.items)) lastManifestItems = d.manifest.items
              if (d.summary) lastSummary = d.summary
              boundNotes.push(...applyAutoBoundAssets(d.autoBound))
            }
          }
          if (uploadedCount > 0) {
            if (lastManifestItems) setProjectAssets(lastManifestItems)
            if (lastSummary) setAssetSummary(lastSummary)
            if (assetFilter !== 'all') setAssetFilter('all')
            setAssetVersion((v) => v + 1)
            await refreshState(activeProjectDir)
            notify(
              boundNotes.length > 0
                ? `已导入 ${uploadedCount} 个素材 · ${boundNotes[0]}`
                : `已高速流式导入 ${uploadedCount} 个素材文件`,
              'success',
            )
          }
        } catch (err) {
          notify(`上传过程中出错: ${err.message}`, 'error')
        } finally {
          setUploadProgressState(null)
        }
      }

      const handleLoadStarterPack = async () => {
        if (!activeProjectDir) return
        setBusyLabel('🎁 正在一键生成新手体验包 (3 张高清概念画 + 电影级配乐)...')
        try {
          const res = await connFetch('/api/video-workbench/assets/starter-pack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectDir: activeProjectDir }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(d.error || '生成演示素材失败', 'error')
            return
          }
          setAssetVersion((v) => v + 1)
          if (!directorForm.topic.trim()) {
            const tpl = LAUNCH_INSPIRATION_TEMPLATES[0]
            setDirectorForm((p) => ({ ...p, topic: tpl.topic, style: tpl.style }))
          }
          await refreshState(activeProjectDir)
          notify(`已装载 ${d.addedCount || 4} 份演示素材与配乐！直接点右侧「一键启动」即可出片`, 'success')
        } catch (err) {
          notify(`演示包生成异常: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      const handleImportByPath = async (forcedRole = '') => {
        if (!assetDirInput.trim() || !activeProjectDir) {
          notify('请输入本地文件夹或文件路径后再导入', 'error')
          return
        }
        setBusyLabel('正在扫描本机素材目录并检测规格...')
        try {
          const res = await connFetch('/api/video-workbench/assets/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectDir: activeProjectDir, sources: assetDirInput.trim(), role: forcedRole }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`扫描导入失败: ${d.error}`, 'error')
            return
          }
          setAssetDirInput('')
          if (Array.isArray(d.manifest?.items)) setProjectAssets(d.manifest.items)
          if (d.summary) setAssetSummary(d.summary)
          if (assetFilter !== 'all') setAssetFilter('all')
          const boundNotes = applyAutoBoundAssets(d.autoBound)
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(
            boundNotes.length > 0
              ? `已导入 ${d.importedCount ?? d.matchedCount ?? d.addedCount ?? 0} 份本地素材 · ${boundNotes[0]}`
              : `已识别导入 ${d.importedCount ?? d.matchedCount ?? d.addedCount ?? 0} 份本地素材`,
            'success',
          )
        } finally {
          setBusyLabel('')
        }
      }

      const handleDeleteAsset = async (assetId) => {
        if (!activeProjectDir || !assetId) return
        const res = await connFetch('/api/video-workbench/assets/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectDir: activeProjectDir, assetId }),
        })
        const d = await res.json()
        if (d.ok) {
          await refreshState(activeProjectDir)
          notify('素材已移除', 'info')
        }
      }

      const handleChangeAssetRole = async (assetId, newRole) => {
        if (!activeProjectDir || !assetId) return
        try {
          const res = await connFetch('/api/video-workbench/assets/role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectDir: activeProjectDir, assetId, role: newRole }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`切换角色失败: ${d.error}`, 'error')
            return
          }
          const boundNotes = applyAutoBoundAssets(d.autoBound)
          await refreshState(activeProjectDir)
          notify(boundNotes.length > 0 ? boundNotes[0] : `素材角色已标定为「${newRole}」`, 'success')
        } catch (err) {
          notify(`切换失败: ${err.message}`, 'error')
        }
      }

      const handleRunMediaCurate = async () => {
        if (!activeProjectDir) return
        setBusyLabel('✂️ 素材剪辑 Agent 正在调用 FFmpeg 智能构图裁切与调色...')
        try {
          const res = await connFetch('/api/video-workbench/assets/curate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectDir: activeProjectDir,
              aspectRatio: directorForm.aspectRatio,
              quality: directorForm.quality,
              style: directorForm.style,
              trimSeconds: Number(trimClipSec) || 0,
              clipSpeed: Number(clipSpeedMult) || 1.0,
              chromaKeyColor: avatarCfg.chromaKeyColor || '',
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`素材精修失败: ${d.error}`, 'error')
            return
          }
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(`已完成 ${d.editedCount || 0} 份素材精修 (存放于 assets/edited/)`, 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const handlePolishTopic = async () => {
        const rawPrompt = String(directorForm.topic || '').trim()
        if (!rawPrompt) {
          notify('请先在框里写一句简单想法（例如：帮我做一个墨次元漫画客户端介绍片），再点 AI 润色', 'info')
          return
        }
        if (!llmConfig?.configured) {
          setShowLlmModal(true)
          notify('请先在右上角「模型配置」连接大模型接口，才能使用 AI 润色指令', 'info')
          return
        }
        setPolishingTopic(true)
        try {
          const res = await connFetch('/api/video-workbench/polish-topic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              async: true,
              projectDir: activeProjectDir,
              rawPrompt,
              style: directorForm.style,
              aspectRatio: directorForm.aspectRatio,
              targetPlatform: directorForm.targetPlatform,
              pacingMode: directorForm.pacingMode,
              durationMode: directorForm.durationMode || 'auto',
              targetDurationSec: directorForm.durationMode === 'custom' ? Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120))) : 0,
              creationMode: directorForm.creationMode,
              narrationMode: directorForm.narrationMode,
            }),
          })
          const initD = await res.json()
          if (!initD.ok) {
            notify(`AI 润色失败: ${initD.error || '请求未成功'}`, 'error')
            return
          }
          const d = initD.jobId ? await pollBackgroundJob(initD.jobId, { silentBusy: true }) : initD
          if (!d.ok || !d.polishedTopic) {
            notify(`AI 润色失败: ${d.error || '未返回有效指令'}`, 'error')
            return
          }
          setUnpolishedTopicBackup(rawPrompt)
          const resolvedDurMode = d.durationMode === 'custom' ? 'custom' : (directorForm.durationMode || 'auto')
          const resolvedDurSec = Number(d.targetDurationSec) >= 10
            ? Math.round(Number(d.targetDurationSec))
            : (resolvedDurMode === 'custom' ? Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120))) : 0)
          setDirectorForm((p) => ({
            ...p,
            topic: d.polishedTopic,
            displayTitle: d.displayTitle || p.displayTitle,
            genre: d.genre || p.genre,
            genreLabel: d.genreLabel || p.genreLabel,
            durationMode: resolvedDurMode,
            targetDurationSec: resolvedDurSec || p.targetDurationSec || 120,
            directorNotes: d.directorNotes || '',
            contentOutline: Array.isArray(d.contentOutline) ? d.contentOutline : [],
            style: d.suggestedStyle || p.style,
          }))
          if (activeProjectDir && script) {
            try {
              await connFetch('/api/video-workbench/script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  projectDir: activeProjectDir,
                  script: {
                    ...script,
                    title: d.displayTitle || script.title,
                    topic: d.displayTitle || script.topic,
                    displayTitle: d.displayTitle || '',
                    genre: d.genre || '',
                    genreLabel: d.genreLabel || '',
                    durationMode: resolvedDurMode,
                    targetDurationSec: resolvedDurSec,
                    directorNotes: d.directorNotes || '',
                    contentOutline: Array.isArray(d.contentOutline) ? d.contentOutline : [],
                    goal: d.polishedTopic,
                  },
                  regenerateHtml: false,
                  regenerateCode: false,
                }),
              })
            } catch {}
          }
          notify(
            resolvedDurSec >= 10
              ? `✨ 已由 ${d.model || 'AI 大模型'} 按目标时长 ${d.durationLabel || `${resolvedDurSec}秒`} 润色生成专业导演指令！`
              : `✨ 已由 ${d.model || 'AI 大模型'} 润色生成专业导演指令并覆盖替换！`,
            'success',
          )
        } catch (err) {
          notify(`AI 润色请求异常: ${err.message}`, 'error')
        } finally {
          setPolishingTopic(false)
        }
      }

      const handleSaveAvatarEndpointConfig = async () => {
        try {
          const res = await connFetch('/api/video-workbench/avatar/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(avatarEndpointForm),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`保存数字人接口失败: ${d.error}`, 'error')
            return
          }
          if (d.avatarProvider) setAvatarProvider(d.avatarProvider)
          setShowAvatarEndpointCfg(false)
          notify(d.avatarProvider?.neuralReady ? '✓ 外接唇形驱动服务已保存启用' : '已切换为内置本地声波驱动/抠像引擎', 'success')
        } catch (err) {
          notify(`保存失败: ${err.message}`, 'error')
        }
      }

      const handleUpdateHardwareMode = async (nextMode, forceRefresh = false) => {
        setHardwareRefreshing(true)
        try {
          const res = await connFetch('/api/video-workbench/hardware', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lowSpecMode: nextMode || hardwarePreferences?.lowSpecMode || 'auto',
              quality: directorForm.quality || '1080p',
              fps: Number(directorForm.fps) || 30,
              forceRefresh,
            }),
          })
          const d = await res.json()
          if (d.ok) {
            if (d.hardwareProfile) setHardwareProfile(d.hardwareProfile)
            if (d.hardwarePreferences) setHardwarePreferences(d.hardwarePreferences)
            if (d.hardwarePolicy) setHardwarePolicy(d.hardwarePolicy)
            notify(`算力模式已更新：${d.hardwarePolicy?.reason || nextMode}`, 'success')
          }
        } catch (err) {
          notify(`算力检测更新失败: ${err.message}`, 'error')
        } finally {
          setHardwareRefreshing(false)
        }
      }

      // One-Click 4-Agent Collaborative Pipeline Launch
      const handleStartOneClickPipeline = async (overrideMode) => {
        if (!activeProjectDir) return
        const modeToRun = overrideMode || directorForm.creationMode || 'ai-coded'
        if (modeToRun === 'ai-coded' && !llmConfig?.configured) {
          setShowLlmModal(true)
          notify('尚未配置 AI 大模型接口，请先填入 API Key 或切换为「本地草稿预演」一键生成', 'info')
          return
        }
        setBusyLabel('🚀 正在唤醒 4 位 AI Agent 作战团队流水线...')
        try {
          const uploadedMusicAsset = projectAssets.find((a) => a.role === 'music')
          const res = await connFetch('/api/video-workbench/pipeline/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectDir: activeProjectDir,
              topic: directorForm.topic.trim() || script?.title || 'AI 影视概念短片',
              userPrompt: directorForm.topic.trim() || script?.goal || '',
              goal: directorForm.topic.trim() || script?.goal || '',
              displayTitle: directorForm.displayTitle || undefined,
              genre: directorForm.genre || undefined,
              genreLabel: directorForm.genreLabel || undefined,
              directorNotes: directorForm.directorNotes || undefined,
              contentOutline: Array.isArray(directorForm.contentOutline) && directorForm.contentOutline.length > 0 ? directorForm.contentOutline : undefined,
              mode: modeToRun,
              engine: directorForm.engine,
              style: directorForm.style,
              aspectRatio: directorForm.aspectRatio,
              quality: directorForm.quality,
              width: directorForm.quality === 'custom' || directorForm.aspectRatio === 'custom' ? Number(directorForm.customWidth) : undefined,
              height: directorForm.quality === 'custom' || directorForm.aspectRatio === 'custom' ? Number(directorForm.customHeight) : undefined,
              targetPlatform: directorForm.targetPlatform,
              bgmMode: directorForm.bgmMode,
              narrationMode: directorForm.narrationMode,
              pacingMode: directorForm.pacingMode || 'auto',
              durationMode: directorForm.durationMode || 'auto',
              targetDurationSec: directorForm.durationMode === 'custom' ? Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120))) : 0,
              visual3dMode: directorForm.visual3dMode || 'auto',
              fps: Number(directorForm.fps) || 30,
              uploadedBgmPath: script?.bgm?.uploadedPath || uploadedMusicAsset?.path || '',
              voiceId: directorForm.voiceId,
              speechTempo: Number(speechTempo) || 1.0,
              useHostVocal: Boolean(useHostVocal),
              aiBadge: Boolean(directorForm.aiBadgeEnabled),
              aiBadgeEnabled: Boolean(directorForm.aiBadgeEnabled),
              aiBadgePosition: directorForm.aiBadgePosition || 'top-right',
              aiBadgeText: directorForm.aiBadgeText || '',
              avatarEnabled: Boolean(avatarCfg.enabled),
              avatarMode: avatarCfg.mode,
              avatarLayout: avatarCfg.layout,
              avatarPresetId: avatarCfg.presetId,
              avatarSourcePath: avatarCfg.sourcePath,
              voiceSamplePath: avatarCfg.voiceSamplePath,
              avatarChromaKeyColor: avatarCfg.chromaKeyColor,
              trimSeconds: Number(trimClipSec) || 0,
              clipSpeed: Number(clipSpeedMult) || 1.0,
              aiAuthorCode: Boolean(aiAuthorCode),
              lowSpecMode: hardwarePreferences?.lowSpecMode || 'auto',
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`流水线启动失败: ${d.error}`, 'error')
            return
          }
          if (Array.isArray(d.runs)) setTaskRuns(d.runs)
          if (d.runId) setSelectedRunId(d.runId)
          setWarCenterTab('theater')
          notify('⚡ 4 位 AI Agent 已全速启动！你可在大屏直观观看实时产出与交接过程', 'success')
        } catch (err) {
          notify(`启动失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      const handleTaskControl = async (action, runId = currentTaskRun?.id, taskId = '') => {
        if (!activeProjectDir) return
        try {
          const res = await connFetch('/api/video-workbench/tasks/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, runId, projectDir: activeProjectDir, taskId }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(d.error || '控制指令执行失败', 'error')
            return
          }
          if (Array.isArray(d.runs)) setTaskRuns(d.runs)
          const map = { pause: '已暂停任务', resume: '已恢复执行', stop: '已停止任务与子进程', retry: '已发起重新执行', 'pause-all': '已全部暂停', 'stop-all': '已紧急停止全部任务' }
          notify(map[action] || '操作成功', action.includes('stop') ? 'info' : 'success')
        } catch (err) {
          notify(`任务控制异常: ${err.message}`, 'error')
        }
      }

      // Direct Local Draft & Direct AI Coding (Precision Studio Buttons)
      const handlePlanLocalDraft = async (andRender = false) => {
        if (!activeProjectDir) return
        setBusyProgress(8)
        setBusyLabel(andRender ? '正在快速生成本地草稿成片 (含配音与 MP4)...' : '正在快速构建本地导演剧本草稿...')
        try {
          const endpoint = andRender ? '/api/video-workbench/produce' : '/api/video-workbench/plan'
          const res = await connFetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              async: Boolean(andRender),
              projectDir: activeProjectDir,
              sources: assetDirInput.trim() || undefined,
              topic: directorForm.topic.trim() || script?.title || '个人品牌介绍',
              userPrompt: directorForm.topic.trim() || script?.goal || '',
              goal: directorForm.topic.trim() || script?.goal || '',
              displayTitle: directorForm.displayTitle || undefined,
              genre: directorForm.genre || undefined,
              genreLabel: directorForm.genreLabel || undefined,
              directorNotes: directorForm.directorNotes || undefined,
              contentOutline: Array.isArray(directorForm.contentOutline) && directorForm.contentOutline.length > 0 ? directorForm.contentOutline : undefined,
              style: directorForm.style,
              engine: directorForm.engine,
              aspectRatio: directorForm.aspectRatio,
              quality: directorForm.quality,
              width: directorForm.quality === 'custom' || directorForm.aspectRatio === 'custom' ? Number(directorForm.customWidth) : undefined,
              height: directorForm.quality === 'custom' || directorForm.aspectRatio === 'custom' ? Number(directorForm.customHeight) : undefined,
              aiBadge: Boolean(directorForm.aiBadgeEnabled),
              aiBadgeEnabled: Boolean(directorForm.aiBadgeEnabled),
              aiBadgePosition: directorForm.aiBadgePosition || 'top-right',
              aiBadgeText: directorForm.aiBadgeText || '',
              pacingMode: directorForm.pacingMode || 'auto',
              durationMode: directorForm.durationMode || 'auto',
              targetDurationSec: directorForm.durationMode === 'custom' ? Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120))) : 0,
              visual3dMode: directorForm.visual3dMode || 'auto',
              narrationMode: directorForm.narrationMode || 'tts',
              bgmMode: directorForm.bgmMode,
              targetPlatform: directorForm.targetPlatform,
              fps: directorForm.fps,
              voiceId: directorForm.voiceId,
            }),
          })
          const initData = await res.json()
          if (!initData.ok) {
            notify(`草稿生成失败: ${initData.error}`, 'error')
            return
          }
          const finalData = initData.jobId ? await pollBackgroundJob(initData.jobId) : initData
          setAssetVersion((v) => v + 1)
          setSelectedSceneIdx(0)
          await refreshState(activeProjectDir)
          goToStudioStep(andRender ? 4 : 3)
          notify(
            andRender
              ? `本地演练成片已输出 (${finalData.script?.width}×${finalData.script?.height})`
              : `已生成 ${finalData.sceneCount} 幕剧本草稿，请先预览`,
            'success',
          )
        } catch (err) {
          notify(`草稿生成失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
          setBusyProgress(0)
        }
      }

      const handleAiCodingProduce = async (forceDraftRef = directorForm.useDraftReference) => {
        if (!activeProjectDir) return
        if (!llmConfig?.configured) {
          setShowLlmModal(true)
          notify('请先配置您的大模型接口再启动 AI 编程创作', 'info')
          return
        }
        setBusyProgress(6)
        setBusyLabel(`大模型 (${llmConfig.model}) 正在编写动画源码与音轨并渲染...`)
        try {
          const res = await connFetch('/api/video-workbench/ai-produce', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              async: true,
              projectDir: activeProjectDir,
              sources: assetDirInput.trim() || undefined,
              topic: directorForm.topic.trim() || script?.title || '',
              userPrompt: directorForm.topic.trim() || script?.goal || '',
              goal: directorForm.topic.trim() || script?.goal || '',
              displayTitle: directorForm.displayTitle || undefined,
              genre: directorForm.genre || undefined,
              genreLabel: directorForm.genreLabel || undefined,
              directorNotes: directorForm.directorNotes || undefined,
              contentOutline: Array.isArray(directorForm.contentOutline) && directorForm.contentOutline.length > 0 ? directorForm.contentOutline : undefined,
              engine: directorForm.engine,
              aspectRatio: directorForm.aspectRatio,
              quality: directorForm.quality,
              width: directorForm.quality === 'custom' || directorForm.aspectRatio === 'custom' ? Number(directorForm.customWidth) : undefined,
              height: directorForm.quality === 'custom' || directorForm.aspectRatio === 'custom' ? Number(directorForm.customHeight) : undefined,
              aiBadge: Boolean(directorForm.aiBadgeEnabled),
              aiBadgeEnabled: Boolean(directorForm.aiBadgeEnabled),
              aiBadgePosition: directorForm.aiBadgePosition || 'top-right',
              aiBadgeText: directorForm.aiBadgeText || '',
              pacingMode: directorForm.pacingMode || 'auto',
              durationMode: directorForm.durationMode || 'auto',
              targetDurationSec: directorForm.durationMode === 'custom' ? Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120))) : 0,
              visual3dMode: directorForm.visual3dMode || 'auto',
              creationMode: directorForm.creationMode,
              bgmMode: directorForm.bgmMode,
              narrationMode: directorForm.narrationMode,
              bgmTtsPrompt: directorForm.bgmTtsPrompt,
              targetPlatform: directorForm.targetPlatform,
              useDraftReference: forceDraftRef,
              fps: directorForm.fps,
              voiceId: directorForm.voiceId,
              render: true,
            }),
          })
          const initData = await res.json()
          if (!initData.ok) {
            notify(`AI 编程任务启动失败: ${initData.error}`, 'error')
            return
          }
          const finalData = initData.jobId ? await pollBackgroundJob(initData.jobId) : initData
          setAssetVersion((v) => v + 1)
          setSelectedSceneIdx(0)
          await refreshState(activeProjectDir)
          goToStudioStep(4)
          notify(`大模型 AI 编程出片完成 (修复轮次 ${finalData.buildLog?.repairRoundsUsed ?? 0})`, 'success')
        } catch (err) {
          notify(`AI 编程出片失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
          setBusyProgress(0)
        }
      }

      // Step 3 Scene Editing, Voice Synth & Refine
      const updateSelectedScene = (patch) => {
        if (!script || !selectedScene) return
        const nextScenes = script.scenes.map((sc, idx) => (idx === selectedSceneIdx ? { ...sc, ...patch } : sc))
        setScript({ ...script, scenes: nextScenes })
        setScriptDirty(true)
      }

      const handleSaveScriptEdits = async () => {
        if (!activeProjectDir || !script) return
        setBusyLabel('正在保存剧本修改并同步源码...')
        try {
          const res = await connFetch('/api/video-workbench/script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectDir: activeProjectDir, script, regenerateCode: true }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`保存失败: ${d.error}`, 'error')
            return
          }
          setScript(d.script)
          setScriptDirty(false)
          setAssetVersion((v) => v + 1)
          notify('修改已同步至预览画面', 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const handleUpdateFormatQuick = async (nextRatio, nextQuality, nextPlatform) => {
        if (!activeProjectDir) return
        if (nextPlatform) setDirectorForm((p) => ({ ...p, targetPlatform: nextPlatform }))
        setBusyLabel('正在更新视频比例、平台安全区与画面代码...')
        try {
          const res = await connFetch('/api/video-workbench/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectDir: activeProjectDir,
              action: 'update-format',
              aspectRatio: nextRatio,
              quality: nextQuality,
              ...(nextPlatform ? { targetPlatform: nextPlatform } : {}),
            }),
          })
          const d = await res.json()
          if (d.ok) {
            setAssetVersion((v) => v + 1)
            await refreshState(activeProjectDir)
            notify(d.dimensions?.reason || '画幅与安全区基准已更新', 'success')
          }
        } finally {
          setBusyLabel('')
        }
      }

      const handleSynthesizeSceneTts = async (scene) => {
        if (!activeProjectDir || !scene) return
        setBusyLabel(`${activeTtsLabel} 正在配音「${scene.title}」...`)
        try {
          if (scriptDirty) await handleSaveScriptEdits()
          const res = await connFetch('/api/video-workbench/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectDir: activeProjectDir,
              action: 'tts-scene',
              sceneId: scene.id,
              text: scene.narration,
              emotion: scene.emotion || '平静',
              speechRate: Number(scene.speechRate) || 1.0,
              voiceId: scene.voiceId || 'auto',
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`配音失败: ${d.error}`, 'error')
            return
          }
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(`配音完成 (${d.result?.durationSec || ''}s) 并已同步时间轴`, 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const handleAiRefine = async (overrideInstruction) => {
        const finalInstruction = typeof overrideInstruction === 'string' && overrideInstruction.trim() ? overrideInstruction.trim() : refinePrompt.trim()
        if (!activeProjectDir || !finalInstruction) {
          notify('请输入你希望 AI 改哪里的具体要求', 'error')
          return
        }
        if (!llmConfig?.configured) {
          setRefinePrompt(finalInstruction)
          setShowLlmModal(true)
          notify('已为您保留指令，请先配置大模型再发起精修', 'info')
          return
        }
        setBusyProgress(10)
        setBusyLabel(`大模型正在按您的要求精修${refineScope === 'scene' ? `「${selectedScene?.title || '当前幕'}」` : '全片'}...`)
        try {
          const res = await connFetch('/api/video-workbench/ai-refine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              async: true,
              projectDir: activeProjectDir,
              sceneId: refineScope === 'scene' ? selectedScene?.id || '' : '',
              instruction: finalInstruction,
              render: true,
            }),
          })
          const initData = await res.json()
          if (!initData.ok) {
            notify(`AI 精修启动失败: ${initData.error}`, 'error')
            return
          }
          await pollBackgroundJob(initData.jobId)
          setRefinePrompt('')
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify('AI 局部精修已生效！若需恢复原版可随时点「撤回」', 'success')
        } catch (err) {
          notify(`AI 精修失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
          setBusyProgress(0)
        }
      }

      const handleRollbackVersion = async () => {
        if (!activeProjectDir) return
        setBusyLabel('正在恢复上一个保存快照...')
        try {
          const res = await connFetch('/api/video-workbench/ai-refine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectDir: activeProjectDir, rollback: true }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(d.message || d.error || '暂无可撤回的历史版本', 'info')
            return
          }
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify('已撤回至上一版本快照', 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const handleAiMasterVoice = async (sceneId = '') => {
        if (!activeProjectDir) return
        setBusyProgress(12)
        setBusyLabel(sceneId ? `正在对分镜 ${sceneId} 执行 AI 声学修音...` : '正在执行全片 AI 声学修音与响度标准化 (-14 LUFS)...')
        try {
          const res = await connFetch('/api/video-workbench/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ async: true, action: 'ai-master-voice', projectDir: activeProjectDir, sceneIds: sceneId ? [sceneId] : [], useLlm: true }),
          })
          const initData = await res.json()
          if (!initData.ok) {
            notify(`修音失败: ${initData.error}`, 'error')
            return
          }
          const finalData = initData.jobId ? await pollBackgroundJob(initData.jobId) : initData
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(`声学修音完成 (已处理 ${finalData.report?.scenesCount || 0} 幕并重混母带)`, 'success')
        } catch (err) {
          notify(`AI 修音失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
          setBusyProgress(0)
        }
      }

      const handleOpenCodeDrawer = async () => {
        if (!activeProjectDir) return
        const res = await connFetch(`/api/video-workbench/code?projectDir=${encodeURIComponent(activeProjectDir)}`)
        const d = await res.json()
        if (d.ok) {
          setCodeFiles(d.files || [])
          setSelectedCodePath((d.files || [])[0]?.path || '')
          setShowCodeDrawer(true)
        }
      }

      // Render, QA & Publish Pack
      const handleRenderMp4 = async (draft720p = false) => {
        if (!activeProjectDir) return
        if (scriptDirty) await handleSaveScriptEdits()
        setBusyProgress(6)
        setBusyLabel(draft720p ? '正在快速渲染 720P 预览视频...' : '正在渲染全高清成品 MP4 并运行音画质检...')
        try {
          const res = await connFetch('/api/video-workbench/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ async: true, projectDir: activeProjectDir, action: 'render', engine: script?.engine || directorForm.engine, draft720p }),
          })
          const initData = await res.json()
          if (!initData.ok) {
            notify(`渲染启动失败: ${initData.error}`, 'error')
            return
          }
          await pollBackgroundJob(initData.jobId)
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          goToStudioStep(4)
          notify('高清成片 MP4 导出并质检完成！', 'success')
        } catch (err) {
          notify(`渲染失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
          setBusyProgress(0)
        }
      }

      const handleRunQaOnly = async () => {
        if (!activeProjectDir) return
        setBusyLabel('正在运行 FFmpeg 黑屏检测与 -14 LUFS 响度校验...')
        try {
          const res = await connFetch('/api/video-workbench/qa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectDir: activeProjectDir }),
          })
          const d = await res.json()
          if (d.ok) {
            setQaReport(d.qa)
            notify(d.qa.passed ? '全部音画质检项目均达标 ✓' : '质检已完成，请查阅指标建议', d.qa.passed ? 'success' : 'info')
          }
        } finally {
          setBusyLabel('')
        }
      }

      const handleExportPublishPack = async (overridePlat) => {
        if (!activeProjectDir) return
        setBusyLabel('正在打包高清封面图、推荐标题、标签与合规清单...')
        try {
          const res = await connFetch('/api/video-workbench/publish-pack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectDir: activeProjectDir, platform: overridePlat || directorForm.targetPlatform || 'universal' }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`打包失败: ${d.error}`, 'error')
            return
          }
          setPublishPackResult(d)
          notify(`发布素材包已输出至 ${d.packDir}`, 'success')
        } catch (err) {
          notify(`打包失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      // 3-Mode Audio / BGM
      const handleUploadBgmFile = async (file) => {
        if (!activeProjectDir || !file) return
        setBusyLabel(`正在高速导入配乐「${file.name}」...`)
        try {
          const res = await connFetch(`/api/video-workbench/bgm/upload?projectDir=${encodeURIComponent(activeProjectDir)}&fileName=${encodeURIComponent(file.name)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: file,
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`上传 BGM 失败: ${d.error}`, 'error')
            return
          }
          setDirectorForm((p) => ({ ...p, bgmMode: 'uploaded' }))
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(`已绑定背景音乐「${d.asset?.name || file.name}」（混音时人声进入自动闪避压低）`, 'success')
        } catch (err) {
          notify(`上传 BGM 出错: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      const handleLlmComposeBgm = async () => {
        if (!activeProjectDir) return
        if (!llmConfig?.configured) {
          setShowLlmModal(true)
          notify('请先配置大模型接口，才能让 AI 编写纯代码配乐', 'info')
          return
        }
        setBusyLabel('AI 大模型正在编写纯 JS 合成器代码并生成 48kHz 配乐母带...')
        try {
          const res = await connFetch('/api/video-workbench/audio/llm-compose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectDir: activeProjectDir }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`AI 写配乐失败: ${d.error}`, 'error')
            return
          }
          setDirectorForm((p) => ({ ...p, bgmMode: 'llm-coded' }))
          setBgmComposePreviewUrl(d.previewUrl || '')
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(`AI 配乐合成完毕 (${d.relScriptPath})，可直接点击播放器试听`, 'success')
        } catch (err) {
          notify(`AI 写配乐出错: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      const handleTtsComposeBgm = async () => {
        if (!activeProjectDir) return
        setBusyLabel(`${activeTtsLabel} 正在合成沉浸式氛围音景 BGM...`)
        try {
          const res = await connFetch('/api/video-workbench/audio/tts-compose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectDir: activeProjectDir,
              promptText: directorForm.bgmTtsPrompt || script?.title || '深沉空灵氛围音景',
              voiceId: directorForm.voiceId || 'auto',
              mode: 'bgm-pad',
              durationSec: Math.min(18, Math.max(6, Number(script?.totalDurationSec) || 10)),
              emotion: '深沉',
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`配音引擎作曲失败: ${d.error}`, 'error')
            return
          }
          setDirectorForm((p) => ({ ...p, bgmMode: 'tts-engine' }))
          setBgmComposePreviewUrl(d.previewUrl || '')
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(`${activeTtsLabel} 氛围音景已绑定为主配乐`, 'success')
        } catch (err) {
          notify(`作曲失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      // Teleprompter Camera Studio (with WebAudio VU Meter + 3-2-1 Countdown + Keep/Retake Preview)
      const cleanupCamAudioMeter = () => {
        if (camVuRafRef.current) {
          cancelAnimationFrame(camVuRafRef.current)
          camVuRafRef.current = 0
        }
        try {
          camAudioCtxRef.current?.close()
        } catch {}
        camAudioCtxRef.current = null
        setCamMicLevel(0)
      }

      const startCamAudioMeter = (stream) => {
        cleanupCamAudioMeter()
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext
          if (!AudioCtx || !stream.getAudioTracks().length) return
          const ac = new AudioCtx()
          camAudioCtxRef.current = ac
          const src = ac.createMediaStreamSource(stream)
          const analyser = ac.createAnalyser()
          analyser.fftSize = 256
          src.connect(analyser)
          const buf = new Uint8Array(analyser.frequencyBinCount)
          const tick = () => {
            analyser.getByteFrequencyData(buf)
            let sum = 0
            for (let i = 0; i < buf.length; i += 1) sum += buf[i]
            const avg = sum / buf.length
            setCamMicLevel(Math.min(100, Math.round((avg / 110) * 100)))
            camVuRafRef.current = requestAnimationFrame(tick)
          }
          camVuRafRef.current = requestAnimationFrame(tick)
        } catch {}
      }

      const handleStopWebcam = () => {
        if (camCountdownTimerRef.current) {
          clearInterval(camCountdownTimerRef.current)
          camCountdownTimerRef.current = null
        }
        setTeleCountdown(0)
        if (camTimerRef.current) {
          clearInterval(camTimerRef.current)
          camTimerRef.current = null
        }
        try {
          if (camRecorderRef.current && camRecorderRef.current.state === 'recording') camRecorderRef.current.stop()
          if (camStreamRef.current) {
            camStreamRef.current.getTracks().forEach((t) => t.stop())
            camStreamRef.current = null
          }
        } catch {}
        cleanupCamAudioMeter()
        setCamStreaming(false)
        setCamRecording(false)
        setTeleAutoScroll(false)
      }

      const handleStartWebcam = async () => {
        setCamError('')
        if (!navigator.mediaDevices?.getUserMedia) {
          setCamError('当前内置窗口不支持直接调起摄像头 (MediaDevices 不可用)，请点击下方「复制浏览器地址」或「直接导入已录视频」')
          return
        }
        let deviceHint = ''
        try {
          if (navigator.mediaDevices.enumerateDevices) {
            const devs = await navigator.mediaDevices.enumerateDevices()
            const cams = devs.filter((d) => d.kind === 'videoinput').length
            const mics = devs.filter((d) => d.kind === 'audioinput').length
            if (cams === 0 && mics === 0) deviceHint = '（未检测到任何可用摄像头或麦克风设备）'
          }
        } catch {}

        const tryStream = async (constraints) => navigator.mediaDevices.getUserMedia(constraints)
        let stream = null
        let modeNote = ''
        try {
          stream = await tryStream({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            audio: { echoCancellation: true, noiseSuppression: true },
          })
        } catch (errAll) {
          // Retry relaxing resolution/facingMode first
          try {
            stream = await tryStream({ video: true, audio: true })
          } catch {
            // Try video-only if mic denied or absent
            try {
              stream = await tryStream({ video: true, audio: false })
              modeNote = '⚠ 仅摄像头画面已开启（麦克风未获权限，录制后将搭配 AI 配音/克隆声纹）'
            } catch {
              // Try audio-only teleprompter mode if camera blocked/missing
              try {
                stream = await tryStream({ video: false, audio: true })
                modeNote = '🎙 已切换为纯麦克风提词配音模式（摄像头被系统或客户端权限拦截）'
              } catch (errFinal) {
                const msg = errFinal?.message || errAll?.message || 'Permission denied'
                const isDenied = /denied|permission|notallowed/i.test(`${errAll?.name} ${msg}`)
                const humanErr = isDenied
                  ? `摄像头与麦克风权限被拦截 (${msg})${deviceHint}：\n1) DeepSeek Harness 桌面端内置浏览框架可能未授予网页摄像头权限；\n2) 请检查 Windows「设置 → 隐私和安全性 → 相机/麦克风 → 允许桌面应用访问」；\n3) 也可直接点击下方在系统浏览器打开或直接上传本机视频！`
                  : `无法开启摄像头 (${msg})${deviceHint}`
                setCamError(humanErr)
                notify(isDenied ? '摄像头被系统或 DSH 桌面端权限拦截，已提供浏览器直开与本地上传替代方案' : `摄像头打开失败: ${msg}`, 'error')
                return
              }
            }
          }
        }

        camStreamRef.current = stream
        setCamStreaming(true)
        if (modeNote) {
          setCamError(modeNote)
          notify(modeNote, 'info')
        }
        startCamAudioMeter(stream)
        setTimeout(() => {
          if (camVideoRef.current && stream.getVideoTracks().length > 0) {
            camVideoRef.current.srcObject = stream
            camVideoRef.current.play().catch(() => {})
          }
        }, 40)
      }

      const beginActualCamRecording = () => {
        if (!camStreamRef.current || typeof MediaRecorder === 'undefined') return
        camChunksRef.current = []
        const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : MediaRecorder.isTypeSupported('video/webm')
            ? 'video/webm'
            : ''
        const mr = mime ? new MediaRecorder(camStreamRef.current, { mimeType: mime }) : new MediaRecorder(camStreamRef.current)
        camRecorderRef.current = mr
        mr.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) camChunksRef.current.push(ev.data)
        }
        mr.onstop = () => {
          if (camTimerRef.current) {
            clearInterval(camTimerRef.current)
            camTimerRef.current = null
          }
          setCamRecording(false)
          setTeleAutoScroll(false)
          const blob = new Blob(camChunksRef.current, { type: mr.mimeType || 'video/webm' })
          if (blob.size < 256) return
          const url = URL.createObjectURL(blob)
          setPendingRecPreview((prev) => {
            if (prev?.url) URL.revokeObjectURL(prev.url)
            return { blob, url, fileName: `host-cam-${Date.now()}.webm` }
          })
          notify('录制结束！请下方回看效果，满意再点「确认入库」', 'info')
        }
        mr.start(300)
        setCamSeconds(0)
        setCamRecording(true)
        setTeleAutoScroll(true)
        if (teleBoxRef.current) teleBoxRef.current.scrollTop = 0
        camTimerRef.current = setInterval(() => setCamSeconds((s) => s + 1), 1000)
      }

      const handleStartCamRecordWithCountdown = () => {
        if (!camStreamRef.current || typeof MediaRecorder === 'undefined') {
          notify('请先点击「开启摄像头预演」', 'error')
          return
        }
        if (pendingRecPreview?.url) {
          URL.revokeObjectURL(pendingRecPreview.url)
          setPendingRecPreview(null)
        }
        if (camCountdownTimerRef.current) clearInterval(camCountdownTimerRef.current)
        let n = 3
        setTeleCountdown(3)
        camCountdownTimerRef.current = setInterval(() => {
          n -= 1
          if (n <= 0) {
            clearInterval(camCountdownTimerRef.current)
            camCountdownTimerRef.current = null
            setTeleCountdown(0)
            beginActualCamRecording()
          } else {
            setTeleCountdown(n)
          }
        }, 1000)
      }

      const handleStopCamRecord = () => {
        if (camCountdownTimerRef.current) {
          clearInterval(camCountdownTimerRef.current)
          camCountdownTimerRef.current = null
          setTeleCountdown(0)
          return
        }
        if (camRecorderRef.current && camRecorderRef.current.state === 'recording') {
          camRecorderRef.current.stop()
        }
      }

      const handleConfirmSaveRecording = async () => {
        if (!pendingRecPreview?.blob || !activeProjectDir) return
        setBusyLabel('📹 正在写入出镜录像至 assets/recordings/ 并测算精准时长...')
        try {
          const dataBase64 = await readFileAsBase64(pendingRecPreview.blob)
          const res = await connFetch('/api/video-workbench/assets/recording', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectDir: activeProjectDir,
              fileName: pendingRecPreview.fileName,
              role: camTargetRole,
              extractVoiceClone: Boolean(camExtractClone),
              dataBase64,
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`入库保存失败: ${d.error}`, 'error')
            return
          }
          if (pendingRecPreview.url) URL.revokeObjectURL(pendingRecPreview.url)
          setPendingRecPreview(null)
          if (camTargetRole === 'avatar_base') {
            setAvatarCfg((p) => ({ ...p, enabled: true, mode: 'cloned-human', sourcePath: d.relPath }))
          }
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(`已保存出镜录像 (${Number(d.durationSec || 0).toFixed(1)}s)${d.clonedVoice ? ` · 已同步提取声纹「${d.clonedVoice.name}」` : ''}`, 'success')
        } catch (err) {
          notify(`保存录像失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      const handleDiscardRecording = () => {
        if (pendingRecPreview?.url) URL.revokeObjectURL(pendingRecPreview.url)
        setPendingRecPreview(null)
        notify('已作废刚才那条，请准备重新拍摄', 'info')
      }

      const handleGenerateTeleprompter = async () => {
        if (!activeProjectDir) return
        setBusyLabel('📝 AI 正在生成适合自然口播的提词稿...')
        try {
          const res = await connFetch('/api/video-workbench/teleprompter/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectDir: activeProjectDir,
              topic: directorForm.topic || script?.title || '品牌与产品实战介绍',
              durationSec: 45,
              tone: directorForm.style || 'tech',
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`提词稿生成失败: ${d.error}`, 'error')
            return
          }
          setTeleLinesText(d.text || (d.lines || []).join('\n'))
          if (teleBoxRef.current) teleBoxRef.current.scrollTop = 0
          notify('口播提词稿已更新，点击「开始录制」倒数 3 秒即自动滚词', 'success')
        } finally {
          setBusyLabel('')
        }
      }

      // Digital Avatar Generation (with transparent visualNotice fallback feedback)
      const handleGenerateAvatarClip = async () => {
        if (!activeProjectDir) return
        setBusyLabel('🤖 正在合成带 Alpha 透明通道的数字人出镜视频...')
        try {
          const sourceFallback = avatarCfg.sourcePath || projectAssets.find((a) => a.role === 'avatar_base' || a.role === 'host_video')?.path || ''
          const voiceSampleFallback = avatarCfg.voiceSamplePath || projectAssets.find((a) => a.role === 'voice_clone')?.path || ''
          const res = await connFetch('/api/video-workbench/avatar/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectDir: activeProjectDir,
              avatarMode: avatarCfg.mode,
              sourceVideoPath: sourceFallback,
              voiceId: directorForm.voiceId,
              voiceSamplePath: voiceSampleFallback,
              avatarLayout: avatarCfg.layout,
              presetId: avatarCfg.presetId,
              chromaKeyColor: avatarCfg.chromaKeyColor || '',
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`数字人生成失败: ${d.error}`, 'error')
            return
          }
          setAvatarCfg((p) => ({ ...p, enabled: true }))
          if (d.visualNotice) setAvatarVisualNotice(d.visualNotice)
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(d.visualNotice ? `数字人生成完成：${d.visualNotice}` : '透明通道数字人已写入时间轴，可在第 3 步实时监看', 'success')
        } finally {
          setBusyLabel('')
        }
      }

      // Voice Library & 3-Step Clone Lab
      const handlePreviewVoice = (v) => {
        if (playingVoiceId === v.id) {
          previewAudioRef.current?.pause()
          setPlayingVoiceId('')
          return
        }
        if (previewAudioRef.current) {
          previewAudioRef.current.src = `/api/video-workbench/voices/preview?id=${encodeURIComponent(v.id)}&v=${Date.now()}`
          previewAudioRef.current.play().catch(() => {
            notify('该音色向量文件暂无原声预览，请选用后生成场景配音试听', 'info')
            setPlayingVoiceId('')
          })
          setPlayingVoiceId(v.id)
        }
      }

      const handleAssignVoice = (v) => {
        setShowVoiceModal(false)
        if (voiceModalTarget === 'global') {
          setDirectorForm((p) => ({ ...p, voiceId: v.id }))
          notify(`已将「${v.name}」设为全片主配音`, 'success')
          return
        }
        if (selectedScene) {
          updateSelectedScene({ voiceId: v.id, voiceLocked: true })
          notify(`已为当前分镜指定「${v.name}」`, 'success')
        }
      }

      const handleImportVoicePack = async () => {
        if (!voiceImportPath.trim()) {
          notify('请输入本地 .wav / .pt 音色文件路径', 'error')
          return
        }
        setBusyLabel('正在导入外部音色样本...')
        try {
          const res = await connFetch('/api/video-workbench/voices/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourcePath: voiceImportPath.trim(), name: voiceImportName.trim() || undefined, gender: voiceImportGender }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`导入失败: ${d.error}`, 'error')
            return
          }
          setVoiceCatalog(d.voiceCatalog || [])
          setVoiceImportPath('')
          setVoiceImportName('')
          notify('音色已加入专属库！', 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const handleStopMicRecord = () => {
        if (micTimerRef.current) {
          clearInterval(micTimerRef.current)
          micTimerRef.current = null
        }
        if (micVuRafRef.current) {
          cancelAnimationFrame(micVuRafRef.current)
          micVuRafRef.current = 0
        }
        try {
          micAudioCtxRef.current?.close()
        } catch {}
        micAudioCtxRef.current = null
        setMicVuLevel(0)
        try {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop()
        } catch {}
        setMicRecording(false)
      }

      const handleStartMicRecord = async () => {
        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
          notify('当前环境不支持麦克风直录，请上传本地录音音频', 'error')
          return
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          micChunksRef.current = []
          try {
            const AC = window.AudioContext || window.webkitAudioContext
            if (AC) {
              const ac = new AC()
              micAudioCtxRef.current = ac
              const an = ac.createAnalyser()
              an.fftSize = 128
              ac.createMediaStreamSource(stream).connect(an)
              const arr = new Uint8Array(an.frequencyBinCount)
              const loop = () => {
                an.getByteFrequencyData(arr)
                const avg = arr.reduce((a, b) => a + b, 0) / arr.length
                setMicVuLevel(Math.min(100, Math.round((avg / 100) * 100)))
                micVuRafRef.current = requestAnimationFrame(loop)
              }
              micVuRafRef.current = requestAnimationFrame(loop)
            }
          } catch {}

          const mr = new MediaRecorder(stream)
          mediaRecorderRef.current = mr
          mr.ondataavailable = (ev) => {
            if (ev.data && ev.data.size > 0) micChunksRef.current.push(ev.data)
          }
          mr.onstop = async () => {
            stream.getTracks().forEach((t) => t.stop())
            const blob = new Blob(micChunksRef.current, { type: mr.mimeType || 'audio/webm' })
            const b64 = await readFileAsBase64(blob)
            setRecordedB64(b64)
            setRecordedFileName(`mic-clone-${Date.now()}.webm`)
            if (!cloneVoiceName.trim()) setCloneVoiceName(`我的声线-${new Date().toTimeString().slice(0, 5).replace(':', '')}`)
            notify('录音采集完成！现在执行第 ② 步将其降噪入库', 'success')
          }
          mr.start(250)
          setMicRecording(true)
          setMicSeconds(0)
          micTimerRef.current = setInterval(() => {
            setMicSeconds((s) => {
              if (s + 1 >= 15) {
                handleStopMicRecord()
                return 15
              }
              return s + 1
            })
          }, 1000)
        } catch (err) {
          const isDenied = /denied|permission|notallowed/i.test(`${err?.name} ${err?.message}`)
          notify(
            isDenied
              ? '麦克风权限被当前桌面端或 Windows 隐私拦截，请点下方「上传本地干声音频」或先检查 Windows 隐私→麦克风权限'
              : `无法开启麦克风: ${err.message}`,
            'error',
          )
        }
      }

      const handlePickCloneFile = async (file) => {
        if (!file) return
        const b64 = await readFileAsBase64(file)
        setRecordedB64(b64)
        setRecordedFileName(file.name)
        if (!cloneVoiceName.trim()) setCloneVoiceName(file.name.replace(/\.[^.]+$/, ''))
        notify(`已载入参考人声「${file.name}」，请点第 ② 步按钮完成降噪克隆`, 'info')
      }

      const handleSubmitVoiceClone = async () => {
        if (cloneSubMode === 'path') {
          if (!voiceImportPath.trim()) {
            notify('请先填写本机音频路径', 'error')
            return
          }
          setVoiceImportName(cloneVoiceName || voiceImportName)
          setVoiceImportGender(cloneVoiceGender)
          await handleImportVoicePack()
          return
        }
        if (!recordedB64) {
          notify('请先完成第 ① 步（录制 5–12 秒清晰人声或上传本地音频）', 'error')
          return
        }
        setBusyLabel('正在用 FFmpeg 滤波、去静音、响度标准化并建档入库...')
        try {
          const res = await connFetch('/api/video-workbench/voices/clone-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: recordedB64,
              fileName: recordedFileName || 'voice-clone.webm',
              name: cloneVoiceName.trim() || '我的专属声线',
              gender: cloneVoiceGender,
              promptText: cloneVoicePrompt.trim(),
              stripSilence: true,
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`克隆入库失败: ${d.error}`, 'error')
            return
          }
          setVoiceCatalog(d.voiceCatalog || [])
          setCloneAuditionVoiceId(d.voice?.id || '')
          setRecordedB64('')
          setRecordedFileName('')
          notify(`声纹克隆入库成功！音色「${d.voice?.name}」(${d.durationSec}s) 可在下放第 ③ 步实时试听`, 'success')
        } catch (err) {
          notify(`克隆入库异常: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      const handleAuditionClonedVoice = async () => {
        const vid =
          cloneAuditionVoiceId ||
          voiceCatalog.find((v) => v.isCloned || v.id?.startsWith('clone-') || v.category === '专属声纹克隆')?.id ||
          'auto'
        setBusyLabel(`${activeTtsLabel} 正在即时合成克隆试听音频...`)
        try {
          const res = await connFetch('/api/video-workbench/voices/clone-preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voiceId: vid, text: cloneAuditionText.trim(), emotion: '温暖' }),
          })
          const d = await res.json()
          if (!d.ok || !d.audioDataUrl) {
            notify(`试听生成失败: ${d.error || '未返回音频'}`, 'error')
            return
          }
          setCloneAuditionUrl(d.audioDataUrl)
          setCloneAuditionVoiceId(d.voiceUsed || vid)
          if (previewAudioRef.current) {
            previewAudioRef.current.src = dataUrlSafe(d.audioDataUrl)
            previewAudioRef.current.play().catch(() => {})
            setPlayingVoiceId(d.voiceUsed || vid)
          }
          notify(`试听合成完毕 (${d.durationSec || ''}s)`, 'success')
        } catch (err) {
          notify(`试听异常: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      function dataUrlSafe(u) {
        return typeof u === 'string' ? u : ''
      }

      // Vendor Motion & Skin
      const handleImportVendorMotion = async () => {
        if (!activeProjectDir || !vendorSourceDir.trim()) {
          notify('请填写外部 .motion / HTML 模板目录绝对路径', 'error')
          return
        }
        setBusyLabel('🎬 正在独立无头 Chromium 容器中渲染无声动效贴片 (-an)...')
        try {
          const res = await connFetch('/api/video-workbench/vendor/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectDir: activeProjectDir,
              sourceDir: vendorSourceDir.trim(),
              name: vendorName.trim() || 'motion-overlay',
              durationSec: Number(vendorDurationSec) || 6,
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`外部模板导入失败: ${d.error}`, 'error')
            return
          }
          setShowVendorModal(false)
          setVendorSourceDir('')
          setVendorName('')
          setAssetVersion((v) => v + 1)
          await refreshState(activeProjectDir)
          notify(`动效贴片已安全转码入库：${d.asset?.path}`, 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const handleUploadSkinWallpaper = async (file) => {
        if (!file) return
        setBusyLabel(`正在应用自定义大屏壁纸「${file.name}」...`)
        try {
          const dataBase64 = await readFileAsBase64(file)
          const res = await connFetch('/api/video-workbench/skin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, dataBase64 }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`壁纸设置失败: ${d.error}`, 'error')
            return
          }
          setSkinConfig((p) => ({ ...p, id: 'custom-image', customUrl: d.url }))
          notify('自定义大屏皮肤背景已应用', 'success')
        } finally {
          setBusyLabel('')
        }
      }

      // LLM Config & Test
      const handleSelectDshProvider = (provId) => {
        const dshProv = llmConfig?.dshClient?.providers?.find((p) => p.id === provId)
        setLlmForm((p) => ({
          ...p,
          mode: 'follow-dsh',
          dshProviderId: provId,
          format: 'auto',
          model: dshProv?.models?.[0]?.id || '',
        }))
        setLlmTestResult(null)
      }

      const handleProviderTemplateChange = (tplId) => {
        const tpl = llmConfig?.templates?.find((t) => t.id === tplId)
        setLlmForm((p) => ({
          ...p,
          provider: tplId,
          format: tpl?.format || p.format,
          baseUrl: tpl?.baseUrl || p.baseUrl,
          model: tpl?.suggestedModels?.[0] || p.model,
        }))
        setLlmTestResult(null)
      }

      const handleTestLlm = async () => {
        setLlmTesting(true)
        setLlmTestResult(null)
        try {
          const res = await connFetch('/api/video-workbench/llm-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: llmForm.mode,
              dshProviderId: llmForm.dshProviderId,
              provider: llmForm.provider,
              format: llmForm.format,
              baseUrl: llmForm.baseUrl,
              apiKey: llmForm.apiKey,
              model: llmForm.model,
            }),
          })
          const d = await res.json()
          setLlmTestResult(d)
        } catch (err) {
          setLlmTestResult({ ok: false, error: err.message })
        } finally {
          setLlmTesting(false)
        }
      }

      const handleSaveLlmConfig = async () => {
        setBusyLabel('正在加密持久化大模型配置...')
        try {
          const res = await connFetch('/api/video-workbench/llm-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(llmForm),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`保存模型配置失败: ${d.error}`, 'error')
            return
          }
          if (d.config) syncLlmFormFromSummary(d.config)
          setShowLlmModal(false)
          notify(`已生效：${d.config?.label || d.config?.model || '大模型接口'}`, 'success')
        } finally {
          setBusyLabel('')
        }
      }

      // TTS Engine Config, GPT-SoVITS & Custom Model Import Handlers
      const handleSelectTtsEngine = async (engineId) => {
        setBusyLabel(`正在切换配音引擎至 ${engineId}...`)
        setTtsTestResult(null)
        try {
          const res = await connFetch('/api/video-workbench/tts-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'select', activeEngineId: engineId }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`切换配音引擎失败: ${d.error}`, 'error')
            return
          }
          if (d.config) syncTtsFormFromSummary(d.config)
          if (d.ttsStatus) setTtsStatus(d.ttsStatus)
          notify(`已切换配音引擎：${d.config?.activeEngine?.name || engineId}`, 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const handleSaveBuiltinTts = async () => {
        setBusyLabel('正在保存本地配音引擎配置...')
        try {
          const res = await connFetch('/api/video-workbench/tts-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'save',
              builtins: {
                indextts25: {
                  endpoint: builtinTtsForm.indextts25Endpoint,
                  rootDir: builtinTtsForm.indexttsRootDir,
                  pythonBin: builtinTtsForm.indexttsPythonBin,
                },
                indextts2: {
                  endpoint: builtinTtsForm.indextts25Endpoint,
                  rootDir: builtinTtsForm.indexttsRootDir,
                  pythonBin: builtinTtsForm.indexttsPythonBin,
                },
                gptvoice: {
                  endpoint: builtinTtsForm.gptvoiceEndpoint,
                  rootDir: builtinTtsForm.gptvoiceRootDir,
                  pythonBin: builtinTtsForm.gptvoicePythonBin,
                  textLang: builtinTtsForm.gptvoiceTextLang || 'zh',
                  promptLang: builtinTtsForm.gptvoicePromptLang || 'zh',
                },
              },
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`保存失败: ${d.error}`, 'error')
            return
          }
          if (d.config) syncTtsFormFromSummary(d.config)
          if (d.ttsStatus) setTtsStatus(d.ttsStatus)
          notify('内置配音引擎参数已保存（GPT-SoVITS / IndexTTS）', 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const applyTtsQuickTemplate = (tpl) => {
        const eng = tpl?.engine || {}
        setCustomTtsForm({
          id: eng.id || `custom-${Date.now().toString(36)}`,
          name: eng.name || tpl?.label || '',
          kind: eng.kind || 'openai-tts',
          vramBadge: eng.vramBadge || '自定义模型',
          endpoint: eng.endpoint || '',
          method: eng.method || 'POST',
          apiKey: '',
          model: eng.model || '',
          voice: eng.voice || eng.defaultVoice || 'default',
          responseFormat: eng.responseFormat || 'wav',
          speed: eng.speed || 1.0,
          responseType: eng.responseType || 'binary',
          responseAudioPath: eng.responseAudioPath || 'audio',
          payloadTemplateText: eng.payloadTemplate ? JSON.stringify(eng.payloadTemplate, null, 2) : '{\n  "text": "{{text}}"\n}',
          command: eng.command || '',
          argsTemplate: eng.argsTemplate || '',
          outputExt: eng.outputExt || '.wav',
        })
        setTtsTestResult(null)
        notify(`已载入模板「${tpl?.label || eng.name}」，可按需修改后点击保存启用`, 'info')
      }

      const handleSaveCustomTts = async () => {
        if (!customTtsForm.name.trim()) {
          notify('请填写自定义配音模型名称', 'error')
          return
        }
        let parsedPayload = undefined
        if (customTtsForm.kind === 'http-json') {
          try {
            parsedPayload = customTtsForm.payloadTemplateText?.trim() ? JSON.parse(customTtsForm.payloadTemplateText) : { text: '{{text}}' }
          } catch (err) {
            notify(`HTTP JSON 请求体模板不是合法 JSON: ${err.message}`, 'error')
            return
          }
        }
        setBusyLabel('正在保存并启用自定义配音模型...')
        try {
          const res = await connFetch('/api/video-workbench/tts-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add-custom',
              engine: {
                id: customTtsForm.id || undefined,
                name: customTtsForm.name.trim(),
                kind: customTtsForm.kind,
                vramBadge: customTtsForm.vramBadge.trim() || '自定义模型',
                endpoint: customTtsForm.endpoint.trim(),
                method: customTtsForm.method,
                apiKey: customTtsForm.apiKey,
                model: customTtsForm.model.trim(),
                voice: customTtsForm.voice.trim(),
                defaultVoice: customTtsForm.voice.trim(),
                responseFormat: customTtsForm.responseFormat || 'wav',
                speed: Number(customTtsForm.speed) || 1.0,
                responseType: customTtsForm.responseType || 'binary',
                responseAudioPath: customTtsForm.responseAudioPath || 'audio',
                payloadTemplate: parsedPayload,
                command: customTtsForm.command.trim(),
                argsTemplate: customTtsForm.argsTemplate.trim(),
                outputExt: customTtsForm.outputExt || '.wav',
                activate: true,
              },
            }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`添加配音模型失败: ${d.error}`, 'error')
            return
          }
          if (d.config) syncTtsFormFromSummary(d.config)
          if (d.ttsStatus) setTtsStatus(d.ttsStatus)
          setTtsModalTab('engines')
          notify(`已添加并启用配音模型：${d.config?.activeEngine?.name}`, 'success')
        } finally {
          setBusyLabel('')
        }
      }

      const handleRemoveCustomTts = async (id) => {
        setBusyLabel('正在删除自定义配音模型...')
        try {
          const res = await connFetch('/api/video-workbench/tts-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'remove-custom', id }),
          })
          const d = await res.json()
          if (d.ok && d.config) syncTtsFormFromSummary(d.config)
          if (d.ok && d.ttsStatus) setTtsStatus(d.ttsStatus)
          notify('已移除自定义配音模型', 'info')
        } finally {
          setBusyLabel('')
        }
      }

      const handleImportTtsJson = async () => {
        if (!ttsImportJsonText.trim()) {
          notify('请先粘贴或导入配音模型 JSON 配置', 'error')
          return
        }
        setBusyLabel('正在导入外部配音模型配置...')
        try {
          const res = await connFetch('/api/video-workbench/tts-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'import-json', jsonText: ttsImportJsonText }),
          })
          const d = await res.json()
          if (!d.ok) {
            notify(`导入失败: ${d.error}`, 'error')
            return
          }
          if (d.config) syncTtsFormFromSummary(d.config)
          if (d.ttsStatus) setTtsStatus(d.ttsStatus)
          setTtsImportJsonText('')
          setTtsModalTab('engines')
          notify(`已成功导入并切换至：${d.config?.activeEngine?.name}`, 'success')
        } catch (err) {
          notify(`JSON 解析失败: ${err.message}`, 'error')
        } finally {
          setBusyLabel('')
        }
      }

      const handleTestTtsEngine = async (engineId = '') => {
        setTtsTesting(true)
        setTtsTestResult(null)
        try {
          const res = await connFetch('/api/video-workbench/tts-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              engineId: engineId || ttsConfig?.activeEngineId || 'indextts25',
              voiceId: directorForm.voiceId || 'auto',
              text: '你好，这是双引擎视频工作台的实时配音引擎测试音频。',
            }),
          })
          const d = await res.json()
          setTtsTestResult(d)
          if (d.ok && d.audioDataUrl && previewAudioRef.current) {
            previewAudioRef.current.src = dataUrlSafe(d.audioDataUrl)
            previewAudioRef.current.play().catch(() => {})
          }
        } catch (err) {
          setTtsTestResult({ ok: false, error: err.message })
        } finally {
          setTtsTesting(false)
        }
      }

      // =======================================================================
      // 7. SHARED STYLE OBJECTS & ASSET URLS
      // =======================================================================
      const panelStyle = {
        background: T.bgPanel,
        border: `1px solid ${T.borderSubtle}`,
        borderRadius: '16px',
        boxShadow: T.shadowCard,
        backdropFilter: 'blur(22px) saturate(140%)',
        WebkitBackdropFilter: 'blur(22px) saturate(140%)',
      }

      const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        background: T.bgInput,
        border: `1px solid ${T.borderStrong}`,
        color: T.textPrimary,
        fontSize: '14px',
        fontFamily: 'Microsoft YaHei, PingFang SC, sans-serif',
        outline: 'none',
      }

      const goldBtnStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '11px',
        background: resolvedDark ? 'linear-gradient(135deg, #F5B942, #D97706)' : 'linear-gradient(135deg, #0F172A, #1E293B)',
        border: resolvedDark ? '1px solid rgba(255,228,160,0.42)' : '1px solid rgba(15,23,42,0.28)',
        color: resolvedDark ? '#07090F' : '#FFFFFF',
        fontSize: '13.5px',
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }

      const blueBtnStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '11px',
        background: T.accentBlue,
        border: 'none',
        color: resolvedDark ? '#03131E' : '#FFFFFF',
        fontSize: '13.5px',
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }

      const ghostBtnStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        padding: '8px 14px',
        borderRadius: '10px',
        background: resolvedDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
        border: `1px solid ${T.borderSubtle}`,
        color: T.textPrimary,
        fontSize: '13px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }

      const previewHtmlUrl = activeProjectDir
        ? `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=index.html&preview=1&v=${assetVersion}`
        : ''
      const masterAudioUrl =
        activeProjectDir && hasMasterAudio
          ? `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=output/master-audio.wav&v=${assetVersion}`
          : ''
      const mp4Url =
        activeProjectDir && hasMp4
          ? `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=output/final.mp4&v=${assetVersion}`
          : ''
      const snapshotUrl =
        activeProjectDir && hasSnapshot
          ? `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=output/snapshot-3x3.png&v=${assetVersion}`
          : ''

      const curW = Number(script?.width) || 1920
      const curH = Number(script?.height) || 1080
      const isPortraitVideo = curW < curH

      // Non-main shell overlay collapsed pill
      if (!isMainSlot && mainSlotActive) return null
      if (!isMainSlot && mode !== 'video') {
        return h(
          'div',
          { style: { position: 'fixed', top: '10px', right: '180px', zIndex: 2100 } },
          h(
            'button',
            {
              className: 'dsh-vw-btn',
              onClick: () => switchWorkbenchMode('video'),
              style: { ...goldBtnStyle, padding: '7px 16px', fontSize: '13px', borderRadius: '999px' },
            },
            h(Icon, { name: 'film', size: 15 }),
            ' 打开电影视频工坊',
          ),
        )
      }

      const hiddenInputs = h(
        'div',
        { style: { display: 'none' } },
        h('audio', { ref: stageAudioRef, src: masterAudioUrl || undefined, preload: 'auto' }),
        h('audio', { ref: previewAudioRef, onEnded: () => setPlayingVoiceId('') }),
        h('input', {
          ref: fileInputRef,
          type: 'file',
          multiple: true,
          accept: 'image/*,video/*,audio/*,.txt,.md',
          onChange: (ev) => {
            handleUploadFiles(ev.target.files)
            ev.target.value = ''
          },
        }),
        h('input', {
          ref: folderInputRef,
          type: 'file',
          multiple: true,
          webkitdirectory: 'true',
          onChange: (ev) => {
            handleUploadFiles(ev.target.files)
            ev.target.value = ''
          },
        }),
        h('input', {
          ref: bgmInputRef,
          type: 'file',
          accept: 'audio/*,.mp3,.wav,.flac,.m4a,.ogg,.aac',
          onChange: (ev) => {
            if (ev.target.files?.[0]) handleUploadBgmFile(ev.target.files[0])
            ev.target.value = ''
          },
        }),
        h('input', {
          ref: avatarBaseInputRef,
          type: 'file',
          accept: 'video/*,image/*,.mp4,.mov,.webm,.png,.jpg,.jpeg',
          onChange: (ev) => {
            if (ev.target.files?.length) handleUploadFiles(ev.target.files, 'avatar_base')
            ev.target.value = ''
          },
        }),
        h('input', {
          ref: voiceCloneInputRef,
          type: 'file',
          accept: 'audio/*,.mp3,.wav,.flac,.m4a,.ogg',
          onChange: (ev) => {
            if (ev.target.files?.length) handleUploadFiles(ev.target.files, 'voice_clone')
            ev.target.value = ''
          },
        }),
        h('input', {
          ref: skinFileInputRef,
          type: 'file',
          accept: 'image/*,.png,.jpg,.jpeg,.webp',
          onChange: (ev) => {
            if (ev.target.files?.[0]) handleUploadSkinWallpaper(ev.target.files[0])
            ev.target.value = ''
          },
        }),
        h('input', {
          ref: cloneFileInputRef,
          type: 'file',
          accept: 'audio/*,.mp3,.wav,.flac,.m4a,.ogg',
          onChange: (ev) => {
            if (ev.target.files?.[0]) handlePickCloneFile(ev.target.files[0])
            ev.target.value = ''
          },
        }),
        h('input', {
          ref: teleImportRef,
          type: 'file',
          accept: 'video/*,audio/*,.mp4,.mov,.webm,.mkv,.wav,.mp3',
          onChange: (ev) => {
            if (ev.target.files?.length) {
              handleUploadFiles(ev.target.files, camTargetRole || 'host_video')
            }
            ev.target.value = ''
          },
        }),
      )

      // =======================================================================
      // 8. TOP NAVIGATION BAR (STREAMLINED 3-MODE BAR + DSH CAPSULE)
      // =======================================================================
      const activeProjectObj = projects.find((p) => (p.projectDir || p.dir) === activeProjectDir)
      const runningCount = taskRuns.filter((r) => r.status === 'running' || r.status === 'paused').length

      const topBar = h(
        'header',
        {
          className: 'dsh-vw-topbar',
          style: {
            flexShrink: 0,
            background: T.bgSidebar,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${T.borderSubtle}`,
            position: 'relative',
            zIndex: 40,
          },
        },
        // Left: DSH <-> Video Workbench Capsule Switcher + Project Switcher Pill
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flexShrink: 0 } },
          h(
            'div',
            {
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0,
                padding: '3px',
                borderRadius: '999px',
                background: T.bgInput,
                border: `1px solid ${T.borderStrong}`,
              },
            },
            h(
              'button',
              {
                type: 'button',
                className: 'dsh-vw-btn',
                title: '返回 DeepSeek Harness 主对话界面',
                onClick: () => {
                  const hl = getHostLayout()
                  if (isMainSlot && typeof hl?.selectPanel === 'function') {
                    hl.selectPanel(null)
                  } else if (!isMainSlot) {
                    switchWorkbenchMode('chat')
                  } else {
                    notify('请点击左侧边栏返回 DeepSeek 对话', 'info')
                  }
                },
                style: { padding: '5px 11px', borderRadius: '999px', border: 'none', background: 'transparent', color: T.textSecondary, fontSize: '12.5px', fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' },
              },
              '← DeepSeek 对话',
            ),
            h(
              'span',
              {
                style: { padding: '5px 11px', borderRadius: '999px', background: T.accentGoldBg, color: T.accentGold, fontSize: '12.5px', fontWeight: 800, whiteSpace: 'nowrap' },
              },
              '🎬 AI 视频工坊',
            ),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-vw-btn',
              title: '切换或管理视频工程',
              onClick: () => setShowProjectDrawer((v) => !v),
              style: {
                ...ghostBtnStyle,
                padding: '7px 12px',
                borderColor: showProjectDrawer ? T.accentGoldBorder : T.borderSubtle,
                color: T.textPrimary,
                maxWidth: '240px',
              },
            },
            h(Icon, { name: 'folder', size: 15, color: T.accentGold }),
            h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13.5px', fontWeight: 700 } }, script?.title || activeProjectObj?.name || activeProjectObj?.title || '未命名工程'),
            h(Icon, { name: 'chevron-down', size: 14, color: T.textMuted }),
          ),
        ),

        // Center: Clean 3-Mode Navigation (`⚡ AI 作战大屏` | `🎛 分步精修工作台` | `📋 任务监控`)
        h(
          'nav',
          {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px',
              borderRadius: '999px',
              background: T.bgInput,
              border: `1px solid ${T.borderStrong}`,
            },
          },
          [
            { id: 'warroom', label: '⚡ AI 作战大屏' },
            { id: 'studio', label: '🎛 分步精修工作台' },
            { id: 'tasks', label: runningCount > 0 ? `📋 任务监控 (${runningCount})` : '📋 任务监控' },
          ].map((tab) => {
            const on = activeNav === tab.id
            const isWar = tab.id === 'warroom'
            return h(
              'button',
              {
                key: tab.id,
                type: 'button',
                className: 'dsh-vw-btn',
                onClick: () => {
                  setIsPlaying(false)
                  setActiveNav(tab.id)
                  if (tab.id === 'tasks' || tab.id === 'warroom') fetchTaskRuns()
                },
                style: {
                  padding: '6px 13px',
                  borderRadius: '999px',
                  border: `1px solid ${on ? (isWar ? T.accentBlueBorder : T.accentGoldBorder) : 'transparent'}`,
                  background: on ? (isWar ? T.accentBlueBg : T.accentGoldBg) : 'transparent',
                  color: on ? (isWar ? T.accentBlue : T.accentGold) : T.textSecondary,
                  fontSize: '13px',
                  fontWeight: on ? 800 : 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                },
              },
              tab.label,
              hasLiveTask && (tab.id === 'warroom' || tab.id === 'tasks')
                ? h('span', { className: 'dsh-vw-rec-dot', style: { width: '7px', height: '7px', borderRadius: '50%', background: T.accentBlue } })
                : null,
            )
          }),
        ),

        // Right: Hardware Guard · TTS Engine · Model Config · Skin · Theme Toggle
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 } },
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-vw-btn',
              title: '查看本机 CPU/内存/显存体检与低配电脑保护模式设置',
              onClick: () => setShowHardwareModal(true),
              style: {
                ...ghostBtnStyle,
                padding: '7px 11px',
                borderColor: hardwarePolicy?.lowSpecSafe ? T.accentGoldBorder : T.borderStrong,
                color: hardwarePolicy?.lowSpecSafe ? T.accentGold : T.accentGreen,
              },
            },
            hardwarePolicy?.lowSpecSafe
              ? '🛡 低配保护'
              : hardwareProfile?.tier === 'high'
                ? '💻 高配畅享'
                : '💻 配置均衡',
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-vw-btn',
              title: '切换 IndexTTS-2.5 / GPT-SoVITS (低显存) / Windows 原生纯CPU / 添加或导入其他配音模型',
              onClick: () => setShowTtsModal(true),
              style: {
                ...ghostBtnStyle,
                padding: '7px 12px',
                borderColor: ttsStatus.ready ? T.borderStrong : T.accentGoldBorder,
                color: ttsStatus.ready ? T.accentGreen : T.accentGold,
              },
            },
            h(Icon, { name: 'mic', size: 15 }),
            `配音: ${activeTtsLabel}`,
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-vw-btn',
              onClick: () => setShowLlmModal(true),
              style: {
                ...ghostBtnStyle,
                padding: '7px 13px',
                borderColor: llmConfig?.configured ? T.accentBlueBorder : T.accentGoldBorder,
                color: llmConfig?.configured ? T.accentBlue : T.accentGold,
              },
            },
            h(Icon, { name: 'cpu', size: 15 }),
            llmConfig?.configured ? `AI 模型: ${llmConfig.model || '已配置'}` : '配置 AI 模型',
          ),
          h(
            'button',
            { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowSkinModal(true), style: { ...ghostBtnStyle, padding: '7px 12px' } },
            h(Icon, { name: 'palette', size: 15 }),
            '皮肤',
          ),
          h(
            'button',
            { type: 'button', className: 'dsh-vw-btn', onClick: cycleThemePref, title: '点击切换：跟随 DSH / 暗色电影 / 亮色工作室', style: { ...ghostBtnStyle, padding: '7px 12px' } },
            h(Icon, { name: resolvedDark ? 'moon' : 'sun', size: 15, color: T.accentGold }),
            themePref === 'follow-dsh' ? '自动' : themePref === 'dark' ? '暗色' : '亮色',
          ),
        ),
      )

      // Slide-Out Project Reel Drawer
      const projectDrawer = showProjectDrawer
        ? h(
            'div',
            {
              onClick: () => setShowProjectDrawer(false),
              style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(4px)', zIndex: 2800 },
            },
            h(
              'aside',
              {
                onClick: (ev) => ev.stopPropagation(),
                style: {
                  width: '320px',
                  maxWidth: '90vw',
                  height: '100%',
                  background: T.bgPanelSolid,
                  borderRight: `1px solid ${T.borderStrong}`,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: T.shadowPopover,
                },
              },
              h(
                'div',
                { style: { padding: '18px 18px', borderBottom: `1px solid ${T.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                h('div', { style: { fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' } }, h(Icon, { name: 'film', size: 18, color: T.accentGold }), '我的视频工程库'),
                h(
                  'div',
                  { style: { display: 'flex', gap: '6px' } },
                  h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowNewModal(true), style: { ...goldBtnStyle, padding: '6px 12px', fontSize: '12.5px' } }, h(Icon, { name: 'plus', size: 14 }), '新建'),
                  h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowProjectDrawer(false), style: { ...ghostBtnStyle, padding: '6px 8px' } }, h(Icon, { name: 'x', size: 15 })),
                ),
              ),
              h(
                'div',
                { className: 'dsh-vw-scroll', style: { flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' } },
                projects.map((p) => {
                  const pDir = p.projectDir || p.dir
                  const pTitle = p.name || p.title || '未命名工程'
                  const isAct = pDir === activeProjectDir
                  return h(
                    'div',
                    {
                      key: pDir,
                      'data-project-title': pTitle,
                      onClick: () => handleSelectProject(pDir),
                      style: {
                        padding: '12px 14px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        background: isAct ? T.accentGoldBg : T.bgElevated,
                        border: `1px solid ${isAct ? T.accentGoldBorder : T.borderSubtle}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                      },
                    },
                    h(
                      'div',
                      { style: { minWidth: 0 } },
                      h('div', { style: { fontSize: '14px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isAct ? T.accentGold : T.textPrimary } }, pTitle),
                      h('div', { style: { fontSize: '12px', color: T.textMuted, marginTop: '3px', fontFamily: 'Consolas, monospace' } }, `${p.sceneCount || 0} 幕 · ${p.hasMp4 ? '✓ 有成片' : '制作中'}`),
                    ),
                    confirmDeleteDir === pDir
                      ? h(
                          'button',
                          {
                            type: 'button',
                            className: 'dsh-vw-btn',
                            onClick: (ev) => {
                              ev.stopPropagation()
                              handleDeleteProject(pDir)
                            },
                            style: { padding: '5px 10px', borderRadius: '8px', border: 'none', background: T.accentRed, color: '#fff', fontSize: '12px', fontWeight: 700 },
                          },
                          '确认删除',
                        )
                      : h(
                          'button',
                          {
                            type: 'button',
                            className: 'dsh-vw-btn',
                            title: '删除此工程',
                            onClick: (ev) => {
                              ev.stopPropagation()
                              setConfirmDeleteDir(pDir)
                            },
                            style: { background: 'transparent', border: 'none', color: T.textMuted, padding: '6px' },
                          },
                          h(Icon, { name: 'trash', size: 15 }),
                        ),
                  )
                }),
              ),
              h(
                'div',
                {
                  style: {
                    padding: '10px 18px',
                    borderTop: `1px solid ${T.borderSubtle}`,
                    fontSize: '12px',
                    color: T.textMuted,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                  },
                },
                h('span', null, '作者 Merziller · 交流/反馈'),
                h('span', { style: { fontFamily: 'var(--dsh-font-mono)', fontWeight: 700, color: T.textSecondary, userSelect: 'text' } }, 'QQ 1411574209'),
              ),
            ),
          )
        : null

      // =======================================================================
      // 9. VIEW 1: KINETIC AI AGENT WAR ROOM (`activeNav === 'warroom'`)
      // =======================================================================
      const visualAssetThumbs = projectAssets.filter((a) => a.type === 'image' || a.type === 'video').slice(0, 6)
      const selectedStyleMeta = UNIFIED_STYLES.find((s) => s.id === directorForm.style) || UNIFIED_STYLES[0]
      const preflightAssetOk = (assetSummary.image || 0) + (assetSummary.video || 0) > 0 || !directorForm.topic.trim() ? true : true // zero-asset can still pure-code! Wait: highlight asset readiness honestly
      const hasVisualAssets = (assetSummary.image || 0) + (assetSummary.video || 0) > 0
      const isAiMode = directorForm.creationMode !== 'local-draft'
      const aiBrainReady = !isAiMode || Boolean(llmConfig?.configured)

      const warRoomView = h(
        'div',
        {
          className: 'dsh-vw-scroll',
          style: {
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '14px 22px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          },
        },
        // --- A. TOP KINETIC THEATER STAGE (60%+ VISUAL SHOWPIECE) ---
        h(
          'section',
          {
            style: {
              ...panelStyle,
              position: 'relative',
              minHeight: '305px',
              flexShrink: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${hasLiveTask ? T.accentBlueBorder : T.borderStrong}`,
            },
          },
          h(WarRoomKineticCanvas, { active: hasLiveTask || Boolean(busyLabel), dark: resolvedDark, agents: currentTaskRun?.agents || [] }),

          // Top HUD Header inside Kinetic Stage
          h(
            'div',
            {
              style: {
                position: 'relative',
                zIndex: 4,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: `1px solid ${T.borderSubtle}`,
                background: resolvedDark ? 'rgba(6, 10, 18, 0.56)' : 'rgba(255, 255, 255, 0.65)',
              },
            },
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' } },
              h(
                'span',
                {
                  style: {
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    background: hasLiveTask ? T.accentBlueBg : hasMp4 ? T.accentGreenBg : T.bgElevated,
                    border: `1px solid ${hasLiveTask ? T.accentBlueBorder : hasMp4 ? 'rgba(52,211,153,0.4)' : T.borderSubtle}`,
                    color: hasLiveTask ? T.accentBlue : hasMp4 ? T.accentGreen : T.textSecondary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                  },
                },
                h('span', { className: hasLiveTask ? 'dsh-vw-rec-dot' : '', style: { width: '8px', height: '8px', borderRadius: '50%', background: hasLiveTask ? T.accentBlue : hasMp4 ? T.accentGreen : T.textMuted } }),
                hasLiveTask ? `4-Agent 协同生成中 · ${Math.round(Number(currentTaskRun?.progress || 0))}%` : hasMp4 ? '✓ 最新成品 MP4 已就绪' : '4-Agent 作战剧场已待命',
              ),
              h(
                'div',
                { style: { display: 'flex', gap: '14px', fontSize: '13px', color: T.textSecondary, fontFamily: 'Consolas, monospace', fontVariantNumeric: 'tabular-nums' } },
                h('span', null, `画幅: ${curW}×${curH}`),
                h('span', null, `分镜: ${scenes.length} 幕`),
                script?.totalDurationSec ? h('span', null, `片长: ${Number(script.totalDurationSec).toFixed(1)}s`) : null,
                hasLiveTask && currentTaskRun ? h('span', { style: { color: T.accentBlue } }, `已运行: ${Math.round(Number(currentTaskRun.elapsedMs || 0) / 1000)}s`) : null,
              ),
            ),
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
              h(SegmentedPills, {
                value: warCenterTab,
                onChange: setWarCenterTab,
                T,
                size: 'sm',
                options: [
                  { id: 'theater', label: '⚡ 智能体协同剧场' },
                  { id: 'mp4', label: hasMp4 ? '🎬 成片播放器 (就绪)' : '🎬 成片预览台' },
                  { id: 'preview', label: '🌐 互动分镜预览' },
                ],
              }),
              hasLiveTask
                ? h(
                    'div',
                    { style: { display: 'flex', gap: '6px' } },
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-vw-btn',
                        onClick: () => handleTaskControl(currentTaskRun?.status === 'paused' ? 'resume' : 'pause', currentTaskRun?.id),
                        style: { ...ghostBtnStyle, padding: '6px 12px', color: T.accentGold, borderColor: T.accentGoldBorder },
                      },
                      currentTaskRun?.status === 'paused' ? '▶ 恢复' : '⏸ 暂停',
                    ),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-vw-btn',
                        onClick: () => handleTaskControl('stop', currentTaskRun?.id),
                        style: { ...ghostBtnStyle, padding: '6px 12px', color: T.accentRed, borderColor: 'rgba(251,113,133,0.45)' },
                      },
                      '■ 停止',
                    ),
                  )
                : null,
            ),
          ),

          // Center Content of Stage: Theater (4 Real Agents) OR Finished MP4 Player OR Live HTML Preview
          h(
            'div',
            { style: { position: 'relative', zIndex: 4, flex: 1, padding: '14px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' } },
            warCenterTab === 'mp4'
              ? h(
                  'div',
                  { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '290px' } },
                  hasMp4
                    ? h(
                        React.Fragment,
                        null,
                        h('video', {
                          key: mp4Url,
                          src: mp4Url,
                          preload: 'auto',
                          controls: true,
                          style: { width: '100%', maxWidth: '480px', maxHeight: '268px', aspectRatio: `${curW} / ${curH}`, borderRadius: '14px', border: `1px solid ${T.borderStrong}`, background: '#000', boxShadow: '0 22px 54px rgba(0,0,0,0.65)' },
                        }),
                        h(
                          'div',
                          { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
                          h('a', { href: mp4Url, download: 'final.mp4', style: { ...goldBtnStyle, textDecoration: 'none' } }, h(Icon, { name: 'download', size: 15 }), '下载高清成品 MP4'),
                          h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => goToStudioStep(3), style: ghostBtnStyle }, '去第 3 步精细微调分镜'),
                          h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => goToStudioStep(4), style: ghostBtnStyle }, '查看质检单与一键发布包'),
                        ),
                      )
                    : h(
                        'div',
                        { style: { textAlign: 'center', color: T.textSecondary, padding: '36px' } },
                        h('div', { style: { fontSize: '16px', fontWeight: 700, marginBottom: '8px' } }, '尚未导出成片 MP4'),
                        h('div', { style: { fontSize: '13.5px', color: T.textMuted } }, '在下方写好需求点一下「一键启动出片」，成片出来后这里会自动变成影院级播放器'),
                      ),
                )
              : warCenterTab === 'preview'
                ? h(
                    'div',
                    { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '310px' } },
                    previewHtmlUrl || usingFinalVideoPreview
                      ? h(
                          React.Fragment,
                          null,
                          h(
                            'div',
                            { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' } },
                            h(
                              'div',
                              { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                              h(
                                'button',
                                {
                                  type: 'button',
                                  className: 'dsh-vw-btn',
                                  onClick: () => setIsPlaying((p) => !p),
                                  style: { ...goldBtnStyle, padding: '6px 13px', fontSize: '12.5px' },
                                },
                                h(Icon, { name: isPlaying ? 'pause' : 'play', size: 14 }),
                                isPlaying ? '暂停' : '播放预览',
                              ),
                              h(
                                'button',
                                {
                                  type: 'button',
                                  className: 'dsh-vw-btn',
                                  disabled: activePlayingSceneIdx <= 0,
                                  onClick: () => {
                                    const prevIdx = Math.max(0, activePlayingSceneIdx - 1)
                                    const sc = scenes[prevIdx]
                                    if (sc) {
                                      setSelectedSceneIdx(prevIdx)
                                      seekToFrame(Number(sc.startFrame || 0), true)
                                    }
                                  },
                                  style: { ...ghostBtnStyle, padding: '6px 10px', fontSize: '12px' },
                                },
                                '◀ 上一幕',
                              ),
                              h(
                                'button',
                                {
                                  type: 'button',
                                  className: 'dsh-vw-btn',
                                  disabled: activePlayingSceneIdx >= Math.max(0, scenes.length - 1),
                                  onClick: () => {
                                    const nextIdx = Math.min(Math.max(0, scenes.length - 1), activePlayingSceneIdx + 1)
                                    const sc = scenes[nextIdx]
                                    if (sc) {
                                      setSelectedSceneIdx(nextIdx)
                                      seekToFrame(Number(sc.startFrame || 0), true)
                                    }
                                  },
                                  style: { ...ghostBtnStyle, padding: '6px 10px', fontSize: '12px' },
                                },
                                '下一幕 ▶',
                              ),
                              hasMp4
                                ? h(SegmentedPills, {
                                    value: step3MonitorSource,
                                    onChange: (src) => {
                                      setIsPlaying(false)
                                      setStep3MonitorSource(src)
                                    },
                                    T,
                                    size: 'sm',
                                    options: [
                                      { id: 'final-video', label: '🎬 成片原画' },
                                      { id: 'html-draft', label: '⚡ HTML5 骨架' },
                                    ],
                                  })
                                : null,
                            ),
                            h(
                              'span',
                              { style: { fontSize: '12px', color: T.textMuted, fontFamily: 'Consolas, monospace' } },
                              `第 ${activePlayingSceneIdx + 1}/${Math.max(1, scenes.length)} 幕 · ${scenes[activePlayingSceneIdx]?.title || ''} · ${Math.round(currentFrame)}f / ${Number(script?.totalDurationInFrames) || 0}f`,
                            ),
                          ),
                          usingFinalVideoPreview
                            ? h('video', {
                                ref: step3VideoRef,
                                key: mp4Url,
                                src: mp4Url,
                                preload: 'metadata',
                                controls: true,
                                onTimeUpdate: (ev) => {
                                  const fps = Number(script?.fps) || 30
                                  setCurrentFrame(Math.floor((ev.currentTarget.currentTime || 0) * fps))
                                },
                                onPlay: () => setIsPlaying(true),
                                onPause: () => setIsPlaying(false),
                                style: { width: '100%', height: '270px', borderRadius: '14px', border: `1px solid ${T.borderStrong}`, background: '#000', objectFit: 'contain' },
                              })
                            : h(
                                'div',
                                { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
                                isRemotionAiCoded
                                  ? h('div', { style: { fontSize: '12px', color: T.accentGold, padding: '5px 10px', borderRadius: '8px', background: T.accentGoldBg, border: `1px solid ${T.accentGoldBorder}` } }, 'ℹ 当前显示 HTML5 骨架估算（Remotion AI 定制 TSX 真实画面请切换上方「🎬 成片原画」或点击渲染 MP4 查看）')
                                  : null,
                                h('iframe', {
                                  ref: iframeRef,
                                  src: previewHtmlUrl,
                                  onLoad: () => seekToFrame(currentFrame, false),
                                  style: { width: '100%', height: '270px', borderRadius: '14px', border: `1px solid ${T.borderStrong}`, background: '#000' },
                                }),
                              ),
                          scenes.length > 0
                            ? h(
                                'div',
                                { className: 'dsh-vw-scroll', style: { display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' } },
                                scenes.map((sc, sIdx) => {
                                  const isAct = sIdx === activePlayingSceneIdx
                                  const thumbRel = sceneThumbs[sc.id] || ''
                                  return h(
                                    'button',
                                    {
                                      key: sc.id || sIdx,
                                      type: 'button',
                                      className: 'dsh-vw-btn',
                                      onClick: () => {
                                        setSelectedSceneIdx(sIdx)
                                        seekToFrame(Number(sc.startFrame || 0), true)
                                      },
                                      style: {
                                        padding: '4px 9px',
                                        borderRadius: '8px',
                                        border: `1px solid ${isAct ? T.accentGoldBorder : T.borderSubtle}`,
                                        background: isAct ? T.accentGoldBg : T.bgElevated,
                                        color: isAct ? T.accentGold : T.textSecondary,
                                        fontSize: '12px',
                                        fontWeight: isAct ? 800 : 600,
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                      },
                                    },
                                    thumbRel ? h('img', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(thumbRel)}&v=${assetVersion}`, style: { width: '28px', height: '18px', borderRadius: '4px', objectFit: 'cover' } }) : null,
                                    `${String(sIdx + 1).padStart(2, '0')} · ${(sc.title || '').slice(0, 10)}`,
                                  )
                                }),
                              )
                            : null,
                        )
                      : h('div', { style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: T.textMuted } }, '暂无生成好的网页动画工程，请在下方一键启动生成'),
                  )
                : h(
                    React.Fragment,
                    null,
                    // 4 Real Agent Hologram Station Cards
                    h(
                      'div',
                      { className: 'dsh-vw-grid-agents' },
                      AGENT_STATION_META.map((meta, idx) => {
                        const liveAg = (currentTaskRun?.agents || []).find((a) => a.id === meta.id)
                        const st = taskStatusBadge(liveAg?.status || 'idle')
                        const isRun = liveAg?.status === 'running'
                        const pct = Math.round(Number(liveAg?.progress || (liveAg?.status === 'completed' ? 100 : 0)))
                        const liveMsg =
                          !hasLiveTask && liveAg?.status === 'completed' && meta.id === 'director' && scenes.length > 0
                            ? `策划完成：${scenes.length} 幕分镜已生成 (${curW}×${curH})`
                            : liveAg?.message || (idx === 0 ? '等待发起创作任务，将自动编写文案与分镜' : meta.role)
                        return h(
                          'div',
                          {
                            key: meta.id,
                            onClick: () => goToStudioStep(meta.stepTarget),
                            style: {
                              padding: '13px 16px',
                              borderRadius: '14px',
                              cursor: 'pointer',
                              background: resolvedDark ? 'rgba(11, 16, 29, 0.82)' : 'rgba(255, 255, 255, 0.88)',
                              border: `1.5px solid ${isRun ? meta.color : liveAg?.status === 'completed' ? 'rgba(52,211,153,0.45)' : T.borderStrong}`,
                              boxShadow: isRun ? `0 0 28px ${meta.color}33` : T.shadowCard,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              transition: 'transform 0.18s ease, border-color 0.2s ease',
                            },
                          },
                          h(
                            'div',
                            { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' } },
                            h(
                              'div',
                              { style: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 } },
                              h(
                                'div',
                                {
                                  style: {
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '11px',
                                    background: `${meta.color}20`,
                                    border: `1px solid ${meta.color}55`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  },
                                },
                                h(Icon, { name: meta.icon, size: 18, color: meta.color }),
                              ),
                              h(
                                'div',
                                { style: { minWidth: 0 } },
                                h('div', { style: { fontSize: '14.5px', fontWeight: 800, color: T.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, meta.name),
                                h('div', { style: { fontSize: '12px', color: T.textMuted, marginTop: '2px' } }, `0${idx + 1} · ${meta.id === 'audio' ? `${activeTtsLabel} · 人声闪避` : meta.role}`),
                              ),
                            ),
                            h(
                              'span',
                              { style: { padding: '3px 9px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: st.bg, color: st.color, flexShrink: 0 } },
                              st.label,
                            ),
                          ),
                          h(
                            'div',
                            { style: { fontSize: '13px', color: T.textSecondary, lineHeight: 1.5, minHeight: '40px' } },
                            liveMsg,
                          ),
                          h(
                            'div',
                            { style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' } },
                            h(
                              'div',
                              { style: { flex: 1, height: '6px', borderRadius: '99px', background: 'rgba(148,163,184,0.2)', overflow: 'hidden' } },
                              h('div', { style: { width: `${pct}%`, height: '100%', background: liveAg?.status === 'failed' ? T.accentRed : meta.color, transition: 'width 0.3s ease' } }),
                            ),
                            h('span', { style: { fontSize: '12.5px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: meta.color } }, `${pct}%`),
                          ),
                        )
                      }),
                    ),

                    // Live Output Filmstrip + Live DSP Waveform
                    h(
                      'div',
                      {
                        className: 'dsh-vw-grid-filmstrip',
                        style: {
                          padding: '12px 16px',
                          borderRadius: '13px',
                          background: resolvedDark ? 'rgba(7, 11, 21, 0.78)' : 'rgba(241, 246, 253, 0.88)',
                          border: `1px solid ${T.borderSubtle}`,
                        },
                      },
                      // Real Assets & Storyboard Filmstrip
                      h(
                        'div',
                        { style: { minWidth: 0 } },
                        h('div', { style: { fontSize: '12.5px', fontWeight: 700, color: T.textSecondary, marginBottom: '7px' } }, scenes.length ? `🎬 实时剧本与素材产出条 (${scenes.length} 幕已规划)` : '🎞 素材与实时产出胶片条'),
                        visualAssetThumbs.length > 0 || scenes.length > 0
                          ? h(
                              'div',
                              { className: 'dsh-vw-scroll', style: { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' } },
                              visualAssetThumbs.map((a) =>
                                h(
                                  'div',
                                  {
                                    key: a.id,
                                    onClick: () => goToStudioStep(1),
                                    style: { width: '76px', height: '48px', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${T.borderStrong}`, flexShrink: 0, cursor: 'pointer', background: '#05070C', position: 'relative' },
                                  },
                                  a.type === 'image'
                                    ? h('img', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(a.path)}&v=${assetVersion}`, style: { width: '100%', height: '100%', objectFit: 'cover' } })
                                    : h('video', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(a.path)}&v=${assetVersion}`, muted: true, style: { width: '100%', height: '100%', objectFit: 'cover' } }),
                                ),
                              ),
                              scenes.map((sc, idx) => {
                                const thumbRel = sceneThumbs[sc.id] || ''
                                return h(
                                  'div',
                                  {
                                    key: sc.id || idx,
                                    onClick: () => {
                                      setSelectedSceneIdx(idx)
                                      setWarCenterTab('preview')
                                      seekToFrame(Number(sc.startFrame || 0), true)
                                    },
                                    title: '点击直接在互动分镜预览中定位该幕；点右侧「去精修分镜」改写单幕',
                                    style: {
                                      padding: '5px 10px',
                                      borderRadius: '8px',
                                      background: T.bgElevated,
                                      border: `1px solid ${T.borderSubtle}`,
                                      fontSize: '12.5px',
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      maxWidth: '215px',
                                    },
                                  },
                                  thumbRel ? h('img', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(thumbRel)}&v=${assetVersion}`, style: { width: '42px', height: '28px', borderRadius: '5px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.12)' } }) : null,
                                  h(
                                    'div',
                                    { style: { minWidth: 0 } },
                                    h('div', { style: { fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: T.accentBlue } }, `${sc.id || `S0${idx + 1}`} · ${sc.title}`),
                                    h('div', { style: { fontSize: '11.5px', color: T.textMuted } }, `${Number(sc.durationSec || 3).toFixed(1)}s`),
                                  ),
                                )
                              }),
                            )
                          : h('div', { style: { fontSize: '13px', color: T.textMuted } }, '导入素材或点击下方「加载新手演示素材」后，每帧成果都会在这里实时浮现'),
                      ),

                      // Live Audio Waveform Spectrum
                      h(
                        'div',
                        { style: { minWidth: '180px' } },
                        h(
                          'div',
                          { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: hasMasterAudio || hasLiveTask ? T.accentGreen : T.textMuted, marginBottom: '4px', fontWeight: 700 } },
                          h('span', null, hasMasterAudio ? '✓ 48kHz 混音母带就绪' : hasLiveTask ? '● 音轨协同合成中' : '音频频谱待命'),
                          h('span', { style: { fontFamily: 'Consolas, monospace' } }, mountedBgmItem ? mountedBgmItem.name.slice(0, 14) : directorForm.bgmMode === 'llm-coded' ? 'AI 编写配乐' : `${activeTtsLabel} 音景`),
                        ),
                        h(AudioWaveformCanvas, { active: hasLiveTask || Boolean(busyLabel), isPlaying, dark: resolvedDark, height: 34 }),
                      ),

                      // Quick Actions into Studio / Code
                      h(
                        'div',
                        { style: { display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 } },
                        h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => goToStudioStep(3), style: { ...ghostBtnStyle, padding: '6px 12px', fontSize: '12.5px' } }, h(Icon, { name: 'sliders', size: 14 }), '去精修分镜'),
                        h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleOpenCodeDrawer, style: { ...ghostBtnStyle, padding: '6px 12px', fontSize: '12.5px' } }, h(Icon, { name: 'code', size: 14 }), '查看源码'),
                      ),
                    ),
                  ),
          ),
        ),

        // --- B. BOTTOM 3-CARD BEGINNER LAUNCH DOCK (SPACIOUS & CLEAR) ---
        h(
          'section',
          { className: 'dsh-vw-grid-dock' },

          // CARD 1: 准备创作素材 (统一上传 + 一键演示包 + 提词自拍)
          h(
            'div',
            {
              onDragOver: (ev) => {
                ev.preventDefault()
                setIsDraggingUpload(true)
              },
              onDragLeave: () => setIsDraggingUpload(false),
              onDrop: (ev) => {
                ev.preventDefault()
                setIsDraggingUpload(false)
                handleUploadFiles(ev.dataTransfer?.files)
              },
              style: {
                ...panelStyle,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                border: `1.5px dashed ${isDraggingUpload ? T.accentBlue : T.borderStrong}`,
              },
            },
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              h('div', { style: { fontSize: '16px', fontWeight: 800 } }, '1. 导入素材 / 极速备料'),
              h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => goToStudioStep(1), style: { background: 'transparent', border: 'none', color: T.accentBlue, fontSize: '13px', fontWeight: 700, cursor: 'pointer' } }, '素材库管理 →'),
            ),
            h(
              'div',
              {
                onClick: () => fileInputRef.current?.click(),
                style: {
                  padding: '16px',
                  borderRadius: '12px',
                  background: isDraggingUpload ? T.accentBlueBg : T.bgElevated,
                  border: `1px solid ${isDraggingUpload ? T.accentBlueBorder : T.borderSubtle}`,
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '7px',
                },
              },
              h(Icon, { name: 'upload', size: 22, color: T.accentBlue }),
              h('div', { style: { fontSize: '14px', fontWeight: 700 } }, '拖拽或点击上传图片、视频与 BGM 音乐'),
              h('div', { style: { fontSize: '12.5px', color: T.textMuted } }, '支持直接传输百兆 MP4，无需转码等待'),
            ),
            uploadProgressState
              ? h(
                  'div',
                  { style: { padding: '10px 12px', borderRadius: '10px', background: T.accentBlueBg, border: `1px solid ${T.accentBlueBorder}` } },
                  h('div', { style: { fontSize: '12.5px', fontWeight: 700, color: T.accentBlue } }, `正在上传 ${uploadProgressState.current}/${uploadProgressState.total} · ${uploadProgressState.fileName}`),
                )
              : null,
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' } },
              h(
                'button',
                { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleLoadStarterPack, style: { ...ghostBtnStyle, borderColor: T.accentGoldBorder, color: T.accentGold, justifyContent: 'center' } },
                h(Icon, { name: 'gift', size: 15, color: T.accentGold }),
                '一键加载演示素材',
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-vw-btn',
                  onClick: () => {
                    setShowTeleprompter(true)
                    goToStudioStep(1)
                  },
                  style: { ...ghostBtnStyle, borderColor: T.accentBlueBorder, color: T.accentBlue, justifyContent: 'center' },
                },
                h(Icon, { name: 'camera', size: 15, color: T.accentBlue }),
                '打开提词器自拍',
              ),
            ),
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: projectAssets.length > 0 ? '2px' : 'auto', paddingTop: '4px' } },
              [
                { k: '图片', v: assetSummary.image || 0, filter: 'image' },
                { k: '视频', v: assetSummary.video || 0, filter: 'video' },
                { k: '配乐', v: assetSummary.music || 0, filter: 'music' },
                { k: '人像/声', v: specialRoleCount, filter: 'special' },
              ].map((it) =>
                h(
                  'div',
                  {
                    key: it.k,
                    onClick: () => {
                      setAssetFilter(it.filter)
                      goToStudioStep(1)
                    },
                    title: `点击查看已导入的${it.k}素材`,
                    style: { padding: '8px 6px', borderRadius: '10px', background: T.bgElevated, textAlign: 'center', border: `1px solid ${it.v > 0 ? T.accentBlueBorder : T.borderSubtle}`, cursor: 'pointer' },
                  },
                  h('div', { style: { fontSize: '16px', fontWeight: 900, fontFamily: 'Consolas, monospace', color: it.v > 0 ? T.accentBlue : T.textMuted } }, it.v),
                  h('div', { style: { fontSize: '12px', color: T.textMuted, marginTop: '2px' } }, it.k),
                ),
              ),
            ),
            projectAssets.length > 0
              ? h(
                  'div',
                  {
                    className: 'dsh-vw-scroll',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      maxHeight: '116px',
                      overflowY: 'auto',
                      padding: '6px 8px',
                      borderRadius: '10px',
                      background: T.bgInput,
                      border: `1px solid ${T.borderSubtle}`,
                    },
                  },
                  projectAssets.slice(0, 12).map((a) =>
                    h(
                      'div',
                      {
                        key: a.id,
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          padding: '4px 6px',
                          borderRadius: '8px',
                          background: T.bgElevated,
                          border: `1px solid ${T.borderSubtle}`,
                          fontSize: '12px',
                        },
                      },
                      h(
                        'div',
                        {
                          onClick: () => goToStudioStep(1),
                          style: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, cursor: 'pointer', flex: 1 },
                        },
                        a.type === 'image'
                          ? h('img', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(a.thumb || a.path)}&v=${assetVersion}`, style: { width: '32px', height: '22px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 } })
                          : a.type === 'video'
                            ? a.thumb
                              ? h('img', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(a.thumb)}&v=${assetVersion}`, style: { width: '32px', height: '22px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 } })
                              : h('span', { style: { width: '32px', height: '22px', borderRadius: '4px', background: T.accentBlueBg, color: T.accentBlue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 } }, 'MP4')
                            : h('span', { style: { width: '32px', height: '22px', borderRadius: '4px', background: T.accentGoldBg, color: T.accentGold, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 } }, '🎵'),
                        h('span', { style: { fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: T.textPrimary } }, a.name || a.originalName),
                        h('span', { style: { color: T.textMuted, fontFamily: 'Consolas, monospace', flexShrink: 0, fontSize: '11px' } }, a.type === 'video' ? `视频${a.durationSec ? `·${Number(a.durationSec).toFixed(1)}s` : ''}` : a.type === 'image' ? '图片' : '音频'),
                      ),
                      h(
                        'button',
                        {
                          type: 'button',
                          className: 'dsh-vw-btn',
                          title: '移除该素材',
                          onClick: () => handleDeleteAsset(a.id),
                          style: { border: 'none', background: 'transparent', color: T.textMuted, padding: '2px 5px', fontSize: '12px' },
                        },
                        '×',
                      ),
                    ),
                  ),
                )
              : null,
          ),

          // CARD 2: 描述创意主题与画面规格 (15PX PROSE + 灵感胶囊)
          h(
            'div',
            { style: { ...panelStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '13px' } },
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
              h('div', { style: { fontSize: '16px', fontWeight: 800 } }, '2. 告诉 AI 你想做什么视频'),
              h(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-vw-btn',
                    disabled: Boolean(polishingTopic) || Boolean(busyLabel),
                    onClick: handlePolishTopic,
                    title: '只需写一句简单需求，让大模型结合你的素材一键优化成专业导演指令并覆盖替换文本框',
                    style: { ...blueBtnStyle, padding: '5px 11px', fontSize: '12.5px', borderRadius: '999px' },
                  },
                  h(Icon, { name: 'sparkles', size: 13 }),
                  polishingTopic ? 'AI 润色中...' : '✨ AI 一键润色提示词',
                ),
                unpolishedTopicBackup
                  ? h(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-vw-btn',
                        onClick: () => {
                          setDirectorForm((p) => ({ ...p, topic: unpolishedTopicBackup }))
                          setUnpolishedTopicBackup('')
                        },
                        style: { ...ghostBtnStyle, padding: '5px 10px', fontSize: '12px', borderRadius: '999px' },
                      },
                      '↩ 恢复原句',
                    )
                  : null,
                h(SegmentedPills, {
                  value: directorForm.creationMode,
                  onChange: (val) => updateDirectorAndSync({ creationMode: val }),
                  T,
                  size: 'sm',
                  options: [
                    { id: 'ai-coded', label: '🧠 大模型编码大片' },
                    { id: 'local-draft', label: '⚡ 本地极速草稿' },
                  ],
                }),
              ),
            ),
            h(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
              LAUNCH_INSPIRATION_TEMPLATES.map((tpl) =>
                h(
                  'button',
                  {
                    key: tpl.label,
                    type: 'button',
                    className: 'dsh-vw-btn',
                    onClick: () => updateDirectorAndSync({ topic: tpl.topic, style: tpl.style, aspectRatio: tpl.aspect }),
                    style: { ...ghostBtnStyle, padding: '5px 10px', fontSize: '12.5px', borderRadius: '999px' },
                  },
                  tpl.label,
                ),
              ),
            ),
            h('textarea', {
              rows: 6,
              value: directorForm.topic,
              onChange: (ev) => setDirectorForm((p) => ({ ...p, topic: ev.target.value })),
              onBlur: (ev) => {
                const v = ev.target.value.trim()
                if (v && v !== String(script?.goal || '').trim()) {
                  updateDirectorAndSync({ goal: v })
                }
              },
              placeholder: '写一句需求即可（写完可点上方「✨ AI 一键润色提示词」自动扩写为专业指令）：\n例如：帮我把这几张产品截图做成一个软件功能介绍短片，语气真诚清晰...',
              style: { ...inputStyle, fontSize: '14.5px', lineHeight: 1.65, resize: 'vertical', flex: 1, minHeight: '148px' },
            }),
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
              h(
                'div',
                null,
                h('div', { style: { fontSize: '12.5px', fontWeight: 700, color: T.textMuted, marginBottom: '5px' } }, '画面比例'),
                h(CinemaSelect, {
                  compact: true,
                  value: directorForm.aspectRatio,
                  onChange: (v) => updateDirectorAndSync({ aspectRatio: v }),
                  T,
                  options: ASPECT_RATIO_OPTIONS.map((o) => ({ value: o.id, label: `${o.icon} ${o.label}`, sub: o.sub })),
                }),
              ),
              h(
                'div',
                null,
                h('div', { style: { fontSize: '12.5px', fontWeight: 700, color: T.textMuted, marginBottom: '5px' } }, '视觉基调风格'),
                h(CinemaSelect, {
                  compact: true,
                  value: directorForm.style,
                  onChange: (v) => updateDirectorAndSync({ style: v }),
                  T,
                  options: UNIFIED_STYLES.map((s) => ({ value: s.id, label: s.label, sub: s.desc, badgeColor: s.swatch })),
                }),
              ),
              h(
                'div',
                null,
                h('div', { style: { fontSize: '12.5px', fontWeight: 700, color: T.textMuted, marginBottom: '5px' } }, '节奏适配方案'),
                h(CinemaSelect, {
                  compact: true,
                  value: directorForm.pacingMode || 'auto',
                  onChange: (v) => updateDirectorAndSync({ pacingMode: v }),
                  T,
                  options: [
                    { value: 'auto', label: '🧠 AI 依题材智能适配', sub: '自动区分教程/故事/快闪' },
                    { value: 'calm', label: '🍃 舒缓叙事 (4~7s/镜)', sub: '适合品牌故事·温情纪实' },
                    { value: 'balanced', label: '⚖️ 稳健解说 (3~5s/镜)', sub: '适合产品功能·软件演示' },
                    { value: 'dynamic', label: '⚡ 高燃踩点 (0.5~3s/镜)', sub: '适合历史史诗·音乐MV' },
                  ],
                }),
              ),
              h(
                'div',
                null,
                h('div', { style: { fontSize: '12.5px', fontWeight: 700, color: T.textMuted, marginBottom: '5px' } }, 'AI 辅助创作角标'),
                h(CinemaSelect, {
                  compact: true,
                  value: directorForm.aiBadgeEnabled ? (directorForm.aiBadgePosition || 'top-right') : 'off',
                  onChange: (v) =>
                    updateDirectorAndSync(
                      v === 'off'
                        ? { aiBadge: false, aiBadgeEnabled: false }
                        : { aiBadge: true, aiBadgeEnabled: true, aiBadgePosition: v },
                    ),
                  T,
                  options: [
                    { value: 'top-right', label: '↗ 右上角展示（推荐）', sub: '避开左上主标题文字' },
                    { value: 'top-left', label: '↖ 左上角展示', sub: '传统角标位' },
                    { value: 'bottom-right', label: '↘ 右下角展示', sub: '安全区贴底展示' },
                    { value: 'bottom-left', label: '↙ 左下角展示', sub: '左下方安全区' },
                    { value: 'off', label: '🚫 关闭不添加', sub: '隐藏角落 AI 标识' },
                  ],
                }),
              ),
            ),
            // 目标视频时长：AI 自由匹配 / 用户自定义时长（与 AI 润色强联动）
            h(
              'div',
              {
                style: {
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: T.panelMutedBg || T.surfaceSubtle || 'rgba(15,23,42,0.04)',
                  border: `1px solid ${directorForm.durationMode === 'custom' ? T.accentBlueBorder : T.borderSubtle}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                },
              },
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
                h('div', { style: { fontSize: '12.5px', fontWeight: 700, color: T.textMuted } }, '⏱ 目标视频时长（与 AI 润色/分镜强联动）'),
                h(SegmentedPills, {
                  value: directorForm.durationMode === 'custom' ? 'custom' : 'auto',
                  onChange: (dm) =>
                    updateDirectorAndSync(
                      dm === 'custom'
                        ? { durationMode: 'custom', targetDurationSec: Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120))) }
                        : { durationMode: 'auto', targetDurationSec: 0 },
                    ),
                  T,
                  size: 'sm',
                  options: [
                    { id: 'auto', label: '🧠 AI 自由匹配' },
                    { id: 'custom', label: '⏱ 自定义时长' },
                  ],
                }),
              ),
              directorForm.durationMode === 'custom'
                ? h(
                    'div',
                    { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                    [
                      { sec: 30, label: '30秒' },
                      { sec: 60, label: '1分钟' },
                      { sec: 90, label: '90秒' },
                      { sec: 120, label: '2分钟' },
                      { sec: 180, label: '3分钟' },
                      { sec: 300, label: '5分钟' },
                    ].map((preset) => {
                      const activePreset = Math.round(Number(directorForm.targetDurationSec) || 120) === preset.sec
                      return h(
                        'button',
                        {
                          key: preset.sec,
                          type: 'button',
                          className: 'dsh-vw-btn',
                          onClick: () => updateDirectorAndSync({ durationMode: 'custom', targetDurationSec: preset.sec }),
                          style: {
                            ...(activePreset ? blueBtnStyle : ghostBtnStyle),
                            padding: '3px 9px',
                            fontSize: '12px',
                            borderRadius: '999px',
                          },
                        },
                        preset.label,
                      )
                    }),
                    h('input', {
                      type: 'number',
                      min: 15,
                      max: 600,
                      step: 5,
                      value: directorForm.targetDurationSec || 120,
                      onChange: (ev) => {
                        const raw = Math.round(Number(ev.target.value) || 0)
                        setDirectorForm((p) => ({ ...p, durationMode: 'custom', targetDurationSec: raw }))
                      },
                      onBlur: (ev) => {
                        const clamped = Math.max(15, Math.min(600, Math.round(Number(ev.target.value) || 120)))
                        updateDirectorAndSync({ durationMode: 'custom', targetDurationSec: clamped })
                      },
                      style: { ...inputStyle, width: '76px', padding: '4px 8px', fontSize: '12.5px', textAlign: 'center' },
                      title: '自定义目标时长（15 ~ 600 秒）',
                    }),
                    h(
                      'span',
                      { style: { fontSize: '12px', color: T.textMuted } },
                      (() => {
                        const s = Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120)))
                        const m = Math.floor(s / 60)
                        const r = s % 60
                        const fmt = m > 0 ? `${m}分${r > 0 ? `${String(r).padStart(2, '0')}秒` : ''}` : `${s}秒`
                        return `秒（约 ${fmt} · 预计 ${Math.round(s * 4.1)} 字口播）`
                      })(),
                    ),
                  )
                : h(
                    'div',
                    { style: { fontSize: '12px', color: T.textMuted } },
                    'AI 将按题材与素材自动决定最佳成片时长（也可在文本框里直接写如“两分钟以上”自动识别）',
                  ),
            ),
            h(
              'div',
              null,
              h('div', { style: { fontSize: '12.5px', fontWeight: 700, color: T.textMuted, marginBottom: '5px' } }, '🥁 配音与卡点节奏模式 (控制是否合成 TTS 旁白)'),
              h(SegmentedPills, {
                value: directorForm.narrationMode || 'tts',
                onChange: (nm) => updateDirectorAndSync({ narrationMode: nm }),
                T,
                fullWidth: true,
                size: 'sm',
                options: [
                  { id: 'tts', label: '🗣️ AI 真人配音' },
                  { id: 'tts-beat-sync', label: '⚡ 配音+踩拍切镜' },
                  { id: 'subtitle-mv', label: '🔥 纯音乐卡点 (免TTS)' },
                ],
              }),
            ),
          ),

          // CARD 3: 发车前引擎/3D/画质/配音全量自选与一键启动出片
          h(
            'div',
            { style: { ...panelStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '11px' } },
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              h('div', { style: { fontSize: '16px', fontWeight: 800 } }, '3. 发车参数与一键出片'),
              h('span', { style: { padding: '2px 8px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 800, background: T.accentBlueBg, color: T.accentBlue, border: `1px solid ${T.accentBlueBorder}` } }, '3D · SVG 架构 · HUD · Spring'),
            ),

            // Direct Engine Switcher right on War Room!
            h(
              'div',
              null,
              h('div', { style: { fontSize: '12px', fontWeight: 700, color: T.textMuted, marginBottom: '4px' } }, '渲染底层引擎 (无需进第 2 步，直接在此自由切换)'),
              h(SegmentedPills, {
                value: directorForm.engine === 'html' || directorForm.engine === 'html5' ? 'html' : 'remotion',
                onChange: (eng) => updateDirectorAndSync({ engine: eng }),
                T,
                fullWidth: true,
                size: 'sm',
                options: [
                  { id: 'remotion', label: '⚛️ Remotion + Three.js 3D' },
                  { id: 'html', label: '🌐 HTML5 + Three.js' },
                ],
              }),
            ),

            // Direct Three.js 3D / SVG / HUD / Spring Mode + Resolution/FPS Selectors
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
              h(
                'div',
                null,
                h('div', { style: { fontSize: '12px', fontWeight: 700, color: T.textMuted, marginBottom: '4px' } }, 'Vibecoding 3D / SVG / HUD 视效'),
                h(CinemaSelect, {
                  compact: true,
                  value: directorForm.visual3dMode || 'auto',
                  onChange: (v) => updateDirectorAndSync({ visual3dMode: v }),
                  T,
                  options: [
                    { value: 'auto', label: '🪐 Opus 5.5 全开 (3D+SVG+HUD+弹簧)', sub: 'Three.js 3D + 动态SVG拓扑 + 全息HUD + 弹簧物理' },
                    { value: 'on', label: '✨ 强化 3D 线框 + 全息 HUD 遥测', sub: '全镜叠加 3D 几何矩阵与实时遥测面板' },
                    { value: 'off', label: '🖼️ 纯 2D 平面动效', sub: '关闭 Three.js 3D 与全屏 HUD 遥测层' },
                  ],
                }),
              ),
              h(
                'div',
                null,
                h('div', { style: { fontSize: '12px', fontWeight: 700, color: T.textMuted, marginBottom: '4px' } }, '成片画质与帧率'),
                h(CinemaSelect, {
                  compact: true,
                  value: `${directorForm.quality || '1080p'}:${Number(directorForm.fps) || 30}`,
                  onChange: (val) => {
                    const [q, f] = String(val || '1080p:30').split(':')
                    updateDirectorAndSync({ quality: q || '1080p', fps: Number(f) || 30 })
                  },
                  T,
                  options: [
                    { value: '1080p:30', label: '📺 1080p · 30fps', sub: '标准全高清 (推荐)' },
                    { value: '1080p:60', label: '🚀 1080p · 60fps', sub: '高帧率丝滑运动' },
                    { value: '2k:30', label: '💎 2K QHD · 30fps', sub: '2560×1440 超清' },
                    { value: '2k:60', label: '💎 2K QHD · 60fps', sub: '2K 60帧影院级' },
                    { value: '4k:30', label: '👑 4K UHD · 30fps', sub: '3840×2160 旗舰画质' },
                    { value: '720p:30', label: '⚡ 720p · 30fps', sub: '快速草稿预览' },
                  ],
                }),
              ),
            ),

            // Direct BGM Source + Voice Picker Row
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
              h(
                'div',
                null,
                h('div', { style: { fontSize: '12px', fontWeight: 700, color: T.textMuted, marginBottom: '4px' } }, '背景配乐方案'),
                h(CinemaSelect, {
                  compact: true,
                  value: directorForm.bgmMode || 'llm-coded',
                  onChange: (v) => updateDirectorAndSync({ bgmMode: v }),
                  T,
                  options: [
                    { value: 'llm-coded', label: '🎹 AI 写代码作曲', sub: '按情绪定制和弦配乐' },
                    { value: 'uploaded', label: '📁 使用已上传 BGM', sub: mountedBgmItem ? `已就绪: ${mountedBgmItem.name}` : '需在左侧上传音乐' },
                    { value: 'tts-engine', label: '🌊 TTS 氛围音景', sub: '配音模型合成环境铺底' },
                  ],
                }),
              ),
              h(
                'div',
                null,
                h('div', { style: { fontSize: '12px', fontWeight: 700, color: T.textMuted, marginBottom: '4px' } }, '主讲配音音色'),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-vw-btn',
                    onClick: () => {
                      setVoiceModalTarget('global')
                      setShowVoiceModal(true)
                    },
                    style: {
                      ...ghostBtnStyle,
                      width: '100%',
                      padding: '8px 10px',
                      justifyContent: 'space-between',
                      fontSize: '12.5px',
                      borderColor: T.borderStrong,
                      background: T.bgInput,
                    },
                  },
                  h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 700 } }, `🎙 ${voiceCatalog.find((v) => v.id === directorForm.voiceId)?.name || (directorForm.voiceId === 'auto' ? 'AI 智能匹配音色' : directorForm.voiceId)}`),
                  h('span', { style: { color: T.accentBlue, fontSize: '11.5px', fontWeight: 800, flexShrink: 0 } }, '切换/克隆'),
                ),
              ),
            ),

            // Pre-flight compact status bar
            h(
              'div',
              { style: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', borderRadius: '11px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}` } },
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', gap: '6px', flexWrap: 'wrap' } },
                h(
                  'span',
                  { onClick: () => setShowLlmModal(true), style: { display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, color: aiBrainReady ? T.accentBlue : T.accentGold } },
                  h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: aiBrainReady ? T.accentGreen : T.accentGold } }),
                  isAiMode ? (llmConfig?.configured ? `大脑: ${llmConfig.model || '已就绪'} ✓` : '点此配置 AI 模型 →') : '本地极速草稿模式 ✓',
                ),
                h(
                  'div',
                  { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } },
                  h('span', { style: { color: T.textSecondary, fontWeight: 700 } }, `配音: ${directorForm.narrationMode === 'subtitle-mv' ? '免TTS' : activeTtsLabel}`),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'dsh-vw-btn',
                      onClick: () => setShowTtsModal(true),
                      style: { padding: '2px 7px', borderRadius: '6px', border: `1px solid ${T.borderStrong}`, background: T.bgPanel, color: T.accentBlue, fontSize: '11px', fontWeight: 700 },
                    },
                    '换配音模型',
                  ),
                ),
              ),
              !hasVisualAssets && mountedBgmItem && directorForm.narrationMode !== 'subtitle-mv'
                ? h(
                    'button',
                    {
                      type: 'button',
                      className: 'dsh-vw-btn',
                      onClick: () => updateDirectorAndSync({ narrationMode: 'subtitle-mv', bgmMode: 'uploaded', pacingMode: directorForm.pacingMode === 'auto' ? 'dynamic' : directorForm.pacingMode }),
                      style: { ...ghostBtnStyle, width: '100%', padding: '4px 8px', fontSize: '11.5px', color: T.accentGold, borderColor: T.accentGoldBorder, justifyContent: 'center' },
                    },
                    '💡 已上传 BGM 且无实拍图，点此切为「纯音乐动画卡点 (免 TTS)」',
                  )
                : null,
              hardwareProfile
                ? h(
                    'div',
                    {
                      onClick: () => setShowHardwareModal(true),
                      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: hardwarePolicy?.lowSpecSafe ? T.accentGold : T.textMuted, cursor: 'pointer', paddingTop: '4px', borderTop: `1px dashed ${T.borderSubtle}` },
                    },
                    h('span', null, `${hardwarePolicy?.lowSpecSafe ? '🛡 低配保护运行中' : '💻 本机算力可用'}: ${hardwareProfile.memory?.freeGB}/${hardwareProfile.memory?.totalGB}GB 内存 · ${hardwareProfile.gpu?.primaryName?.slice(0, 22)}`),
                    h('span', { style: { color: T.accentBlue, fontWeight: 700, flexShrink: 0 } }, '详情/开关 →'),
                  )
                : null,
            ),

            // Quick Avatar Mode Switch
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } },
              h('span', { style: { fontSize: '12.5px', fontWeight: 700, color: T.textSecondary } }, '数字人口播'),
              h(SegmentedPills, {
                value: !avatarCfg.enabled ? 'off' : avatarCfg.mode,
                onChange: (val) => setAvatarCfg((p) => (val === 'off' ? { ...p, enabled: false } : { ...p, enabled: true, mode: val })),
                T,
                size: 'sm',
                options: [
                  { id: 'off', label: '关闭' },
                  { id: 'ai-human', label: 'AI 主播' },
                  { id: 'cloned-human', label: '克隆本人' },
                ],
              }),
            ),

            // HERO PLASMA LAUNCH BUTTON
            h(
              'button',
              {
                type: 'button',
                className: 'dsh-vw-btn dsh-vw-plasma-cta',
                disabled: Boolean(busyLabel) || hasLiveTask,
                onClick: () => handleStartOneClickPipeline(),
                style: {
                  marginTop: 'auto',
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '13px',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 900,
                  letterSpacing: '0.02em',
                  boxShadow: resolvedDark ? '0 10px 32px rgba(34,211,238,0.28)' : '0 10px 26px rgba(2,132,199,0.24)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                },
              },
              h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } }, h(Icon, { name: 'zap', size: 18 }), hasLiveTask ? '4-Agent 正在协同制片中...' : '一键启动 AI 全自动出片'),
              h(
                'span',
                { style: { fontSize: '12px', opacity: 0.94, fontWeight: 600 } },
                `${String(directorForm.quality || '1080p').toUpperCase()} ${Number(directorForm.fps) || 30}fps · ${directorForm.engine === 'html' || directorForm.engine === 'html5' ? 'HTML5 + Three.js' : 'Remotion + Three.js 3D'} · 自动导出 MP4`,
              ),
            ),
          ),
        ),
      )

      // =======================================================================
      // 10. VIEW 2: PRECISION STUDIO WORKBENCH (STEPS 01-04)
      // =======================================================================
      const step1Panel = h(
        'div',
        { className: 'dsh-vw-scroll', style: { flex: 1, overflowY: 'auto', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '18px' } },
        // Upload & Starter Pack Card
        h(
          'div',
          {
            onDragOver: (ev) => {
              ev.preventDefault()
              setIsDraggingUpload(true)
            },
            onDragLeave: () => setIsDraggingUpload(false),
            onDrop: (ev) => {
              ev.preventDefault()
              setIsDraggingUpload(false)
              handleUploadFiles(ev.dataTransfer?.files)
            },
            style: { ...panelStyle, padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', border: `1.5px dashed ${isDraggingUpload ? T.accentBlue : T.borderStrong}` },
          },
          h(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' } },
            h(
              'div',
              null,
              h('h2', { style: { margin: 0, fontSize: '18px', fontWeight: 800 } }, '01 · 统一素材库、BGM 与声纹采样入口'),
              h('p', { style: { margin: '4px 0 0', fontSize: '13.5px', color: T.textMuted } }, '图片、视频、背景音乐 BGM、真人出镜底板与声音样本统一在此导入管理（百兆视频直传不卡顿）'),
            ),
            h(
              'div',
              { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
              h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleLoadStarterPack, style: { ...ghostBtnStyle, borderColor: T.accentGoldBorder, color: T.accentGold } }, h(Icon, { name: 'gift', size: 15 }), '一键加载演示素材'),
              h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowVendorModal(true), style: ghostBtnStyle }, '✨ 导入外部 .motion 模板'),
              h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setStudioStep(2), style: goldBtnStyle }, '下一步：导演与配音 →'),
            ),
          ),
          h(
            'div',
            { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } },
            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => fileInputRef.current?.click(), style: blueBtnStyle }, h(Icon, { name: 'upload', size: 15 }), '选择图片 / 视频 / 音频'),
            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => folderInputRef.current?.click(), style: ghostBtnStyle }, h(Icon, { name: 'folder', size: 15 }), '整文件夹批量导入'),
            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => bgmInputRef.current?.click(), style: { ...ghostBtnStyle, borderColor: T.accentGoldBorder, color: T.accentGold } }, '🎵 导入个人 BGM 配乐'),
            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => avatarBaseInputRef.current?.click(), style: ghostBtnStyle }, '👤 导入克隆数字人底板'),
            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => voiceCloneInputRef.current?.click(), style: ghostBtnStyle }, '🎙 导入声音克隆样本'),
          ),
          h(
            'div',
            { style: { display: 'flex', gap: '8px' } },
            h('input', {
              value: assetDirInput,
              onChange: (ev) => setAssetDirInput(ev.target.value),
              placeholder: '或输入本机绝对目录/文件路径批量扫描导入...',
              style: { ...inputStyle, flex: 1 },
            }),
            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handleImportByPath(), style: ghostBtnStyle }, '本机路径扫描'),
          ),
        ),

        // Teleprompter Camera Studio
        h(
          'div',
          { style: { ...panelStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' } },
          h(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' } },
            h(
              'div',
              null,
              h('div', { style: { fontSize: '16px', fontWeight: 800 } }, '📹 内置可调速提词板 · 真人出镜 / 数字人底板拍摄棚'),
              h('div', { style: { fontSize: '13px', color: T.textMuted, marginTop: '3px' } }, '支持 AI 写口播稿、3-2-1 开拍倒计时、麦克风实时电平表、自拍镜像/提词镜像双控制，拍完即看即删'),
            ),
            h(
              'button',
              { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowTeleprompter((v) => !v), style: { ...ghostBtnStyle, borderColor: showTeleprompter ? T.accentBlueBorder : T.borderSubtle, color: showTeleprompter ? T.accentBlue : T.textPrimary } },
              showTeleprompter ? '收起拍摄棚' : '展开摄像头提词拍摄',
            ),
          ),
          showTeleprompter
            ? h(
                'div',
                { style: { display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '18px', alignItems: 'start' } },
                // Left Camera Viewfinder + Scrolling Teleprompter Overlay + Countdown + Post-Record Preview
                h(
                  'div',
                  { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                  h(
                    'div',
                    {
                      style: {
                        position: 'relative',
                        height: '330px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        background: '#05080F',
                        border: `1.5px solid ${camRecording ? '#FB7185' : T.borderStrong}`,
                      },
                    },
                    h('video', {
                      ref: camVideoRef,
                      muted: true,
                      playsInline: true,
                      style: { width: '100%', height: '100%', objectFit: 'cover', transform: camSelfieMirror ? 'scaleX(-1)' : 'none', display: camStreaming ? 'block' : 'none' },
                    }),
                    !camStreaming
                      ? h(
                          'div',
                          { style: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94A3B8', padding: '18px 22px', textAlign: 'center' } },
                          h(Icon, { name: 'camera', size: 30, color: camError ? '#FB7185' : '#22D3EE' }),
                          h('div', { style: { fontSize: '13.5px', fontWeight: 700, color: camError ? '#FCA5A5' : '#E2E8F0', whiteSpace: 'pre-line', lineHeight: 1.55, maxWidth: '460px' } }, camError || '点击右侧「开启摄像头预演」即可测试麦克风并开始拍摄'),
                          h(
                            'div',
                            { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' } },
                            h(
                              'button',
                              {
                                type: 'button',
                                className: 'dsh-vw-btn',
                                onClick: () => teleImportRef.current?.click(),
                                style: { ...goldBtnStyle, padding: '6px 12px', fontSize: '12.5px' },
                              },
                              '📁 直接上传本机已录视频/音频入库',
                            ),
                            h(
                              'button',
                              {
                                type: 'button',
                                className: 'dsh-vw-btn',
                                onClick: () => {
                                  const standUrl = /^https?:\/\/127\.0\.0\.1|^https?:\/\/localhost/i.test(window.location?.origin || '')
                                    ? window.location.origin
                                    : 'http://127.0.0.1:4399'
                                  try {
                                    navigator.clipboard?.writeText?.(standUrl)
                                  } catch {}
                                  try {
                                    window.open(standUrl, '_blank', 'noopener,noreferrer')
                                  } catch {}
                                  notify(`已打开并复制浏览器直通地址 ${standUrl}（系统 Chrome/Edge 可正常弹出摄像头授权提示）`, 'info')
                                },
                                style: { ...ghostBtnStyle, padding: '6px 12px', fontSize: '12.5px', color: '#E2E8F0', borderColor: 'rgba(148,163,184,0.35)' },
                              },
                              '🌐 在系统浏览器中打开自拍',
                            ),
                          ),
                        )
                      : null,
                    // 3-2-1 Countdown Overlay
                    teleCountdown > 0
                      ? h(
                          'div',
                          { style: { position: 'absolute', inset: 0, zIndex: 15, background: 'rgba(4,7,14,0.68)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' } },
                          h('div', { style: { fontSize: '78px', fontWeight: 900, color: '#F5B942', fontFamily: 'Consolas, monospace', lineHeight: 1 } }, teleCountdown),
                          h('div', { style: { fontSize: '15px', color: '#FFFFFF', fontWeight: 700 } }, '准备就绪，马上开始录制与自动滚词...'),
                        )
                      : null,
                    // REC Pill & Mic VU Bar
                    camRecording
                      ? h(
                          'div',
                          { style: { position: 'absolute', top: '12px', left: '12px', zIndex: 12, padding: '5px 12px', borderRadius: '999px', background: 'rgba(225,29,72,0.9)', color: '#fff', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' } },
                          h('span', { className: 'dsh-vw-rec-dot', style: { width: '8px', height: '8px', borderRadius: '50%', background: '#fff' } }),
                          `REC ${fmtSeconds(camSeconds)}`,
                        )
                      : null,
                    // Translucent Teleprompter Overlay
                    h(
                      'div',
                      {
                        ref: teleBoxRef,
                        className: 'dsh-vw-scroll',
                        style: {
                          position: 'absolute',
                          left: '14px',
                          right: '14px',
                          top: '14px',
                          maxHeight: '56%',
                          overflowY: 'auto',
                          padding: '12px 16px',
                          borderRadius: '11px',
                          background: `rgba(5, 8, 16, ${teleBgOpacity})`,
                          backdropFilter: 'blur(6px)',
                          color: '#FFFFFF',
                          fontSize: `${teleFontSize}px`,
                          lineHeight: teleLineHeight,
                          fontWeight: 700,
                          textShadow: '0 2px 8px rgba(0,0,0,0.85)',
                          transform: teleMirror ? 'scaleX(-1)' : 'none',
                          whiteSpace: 'pre-wrap',
                          zIndex: 8,
                        },
                      },
                      teleLinesText,
                    ),
                  ),

                  // Mic VU Meter Bar
                  camStreaming
                    ? h(
                        'div',
                        { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 13px', borderRadius: '10px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}` } },
                        h(Icon, { name: 'mic', size: 15, color: camMicLevel > 8 ? T.accentGreen : T.textMuted }),
                        h('span', { style: { fontSize: '12.5px', fontWeight: 700, whiteSpace: 'nowrap' } }, '麦克风收音电平'),
                        h('div', { style: { flex: 1, height: '8px', borderRadius: '99px', background: 'rgba(148,163,184,0.2)', overflow: 'hidden' } }, h('div', { style: { width: `${camMicLevel}%`, height: '100%', background: camMicLevel > 78 ? T.accentGold : T.accentGreen, transition: 'width 0.08s linear' } })),
                        h('span', { style: { fontSize: '12.5px', fontFamily: 'Consolas, monospace', width: '38px', textAlign: 'right' } }, `${camMicLevel}%`),
                      )
                    : null,

                  // Immediate Post-Record Review Card
                  pendingRecPreview
                    ? h(
                        'div',
                        { style: { padding: '14px', borderRadius: '12px', background: T.accentGoldBg, border: `1px solid ${T.accentGoldBorder}`, display: 'flex', flexDirection: 'column', gap: '10px' } },
                        h('div', { style: { fontSize: '14px', fontWeight: 800, color: T.accentGold } }, '🎬 刚才拍好了一段出镜视频，请回看确认是否入库：'),
                        h('video', { src: pendingRecPreview.url, controls: true, style: { width: '100%', maxHeight: '190px', borderRadius: '9px', background: '#000' } }),
                        h(
                          'div',
                          { style: { display: 'flex', gap: '10px' } },
                          h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleConfirmSaveRecording, style: { ...goldBtnStyle, flex: 1 } }, h(Icon, { name: 'check', size: 15 }), '✓ 满意，写入素材库'),
                          h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleDiscardRecording, style: { ...ghostBtnStyle, color: T.accentRed } }, h(Icon, { name: 'trash', size: 15 }), '作废并重拍'),
                        ),
                      )
                    : null,
                ),

                // Right Controls Column
                h(
                  'div',
                  { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                  h(
                    'div',
                    { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
                    h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleGenerateTeleprompter, style: { ...goldBtnStyle, flex: 1 } }, '✨ AI 写口播提词稿'),
                    h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setTeleAutoScroll((v) => !v), style: ghostBtnStyle }, teleAutoScroll ? '⏸ 暂停滚词' : '▶ 测试滚词'),
                  ),
                  h('textarea', {
                    rows: 5,
                    value: teleLinesText,
                    onChange: (ev) => setTeleLinesText(ev.target.value),
                    placeholder: '这里粘贴或直接让 AI 撰写你的口播提词台词...',
                    style: { ...inputStyle, fontSize: '14px', lineHeight: 1.6 },
                  }),
                  h(
                    'div',
                    { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' } },
                    h('label', null, `滚词速度 (${teleScrollSpeed.toFixed(1)}x)`, h('input', { type: 'range', min: 0.3, max: 3.0, step: 0.1, value: teleScrollSpeed, onChange: (ev) => setTeleScrollSpeed(Number(ev.target.value)), style: { width: '100%' } })),
                    h('label', null, `字体大小 (${teleFontSize}px)`, h('input', { type: 'range', min: 18, max: 42, step: 1, value: teleFontSize, onChange: (ev) => setTeleFontSize(Number(ev.target.value)), style: { width: '100%' } })),
                    h('label', null, `行距 (${teleLineHeight.toFixed(2)})`, h('input', { type: 'range', min: 1.2, max: 2.2, step: 0.05, value: teleLineHeight, onChange: (ev) => setTeleLineHeight(Number(ev.target.value)), style: { width: '100%' } })),
                    h('label', null, `词板深浅 (${Math.round(teleBgOpacity * 100)}%)`, h('input', { type: 'range', min: 0.15, max: 0.9, step: 0.05, value: teleBgOpacity, onChange: (ev) => setTeleBgOpacity(Number(ev.target.value)), style: { width: '100%' } })),
                  ),
                  h(
                    'div',
                    { style: { display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '13.5px' } },
                    h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: camSelfieMirror, onChange: (ev) => setCamSelfieMirror(ev.target.checked) }), '自拍画面左右镜像'),
                    h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: teleMirror, onChange: (ev) => setTeleMirror(ev.target.checked) }), '提词文字镜像 (分光镜专用)'),
                    h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: camExtractClone, onChange: (ev) => setCamExtractClone(ev.target.checked) }), '同步克隆我的声纹'),
                  ),
                  h(
                    'div',
                    null,
                    h('div', { style: { fontSize: '13px', fontWeight: 700, color: T.textMuted, marginBottom: '5px' } }, '录像入库角色'),
                    h(CinemaSelect, {
                      value: camTargetRole,
                      onChange: setCamTargetRole,
                      T,
                      options: [
                        { value: 'host_video', label: '真人出镜主镜头 (host_video)', sub: '直接用作视频口播与原声片源' },
                        { value: 'avatar_base', label: '克隆数字人底板 (avatar_base)', sub: '用它来合成「克隆版你自己」的数字人' },
                      ],
                    }),
                  ),
                  h(
                    'div',
                    { style: { display: 'flex', gap: '10px' } },
                    !camStreaming
                      ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleStartWebcam, style: { ...blueBtnStyle, flex: 1 } }, '开启摄像头与麦克风')
                      : h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleStopWebcam, style: ghostBtnStyle }, '关闭摄像头'),
                    camStreaming
                      ? !camRecording && teleCountdown === 0
                        ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleStartCamRecordWithCountdown, style: { ...goldBtnStyle, flex: 1 } }, '● 3 秒倒数开拍并滚词')
                        : h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleStopCamRecord, style: { ...goldBtnStyle, flex: 1, background: '#E11D48', color: '#fff' } }, teleCountdown > 0 ? '取消倒计时' : `■ 停止录制 (${camSeconds}s)`)
                      : null,
                  ),
                ),
              )
            : null,
        ),

        // Asset Grid with CinemaSelect role switches
        h(
          'div',
          { style: { ...panelStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' } },
          h(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' } },
            h(SegmentedPills, {
              value: assetFilter,
              onChange: setAssetFilter,
              T,
              accent: 'gold',
              size: 'sm',
              options: [
                { id: 'all', label: `全部 (${projectAssets.length})` },
                { id: 'image', label: `图片 (${assetSummary.image || 0})` },
                { id: 'video', label: `视频 (${assetSummary.video || 0})` },
                { id: 'music', label: `BGM 配乐 (${assetSummary.music || 0})` },
                { id: 'special', label: `出镜/数字人/声纹 (${specialRoleCount})` },
              ],
            }),
            h('span', { style: { fontSize: '12.5px', color: T.textMuted } }, '每张素材卡右下角可自由指定「通用画面 / BGM / 数字人底板 / 声纹克隆样本」'),
          ),
          filteredAssets.length === 0
            ? h('div', { style: { padding: '28px', textAlign: 'center', color: T.textMuted, fontSize: '14px' } }, '此类素材暂为空，可通过上方拖拽上传或点击「一键加载演示素材」体验。')
            : h(
                'div',
                { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' } },
                filteredAssets.map((a) =>
                  h(
                    'div',
                    { key: a.id, style: { borderRadius: '12px', overflow: 'visible', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column' } },
                    h(
                      'div',
                      { style: { height: '116px', background: '#05080F', position: 'relative', borderRadius: '11px 11px 0 0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                      a.type === 'image'
                        ? h('img', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(a.path)}&v=${assetVersion}`, style: { width: '100%', height: '100%', objectFit: 'cover' } })
                        : a.type === 'video'
                          ? a.thumb
                            ? h('img', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(a.thumb)}&v=${assetVersion}`, style: { width: '100%', height: '100%', objectFit: 'cover' } })
                            : h('video', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(a.path)}&v=${assetVersion}`, muted: true, preload: 'metadata', style: { width: '100%', height: '100%', objectFit: 'cover' } })
                          : h('span', { style: { fontSize: '30px' } }, a.role === 'music' ? '🎵' : a.role === 'voice_clone' ? '🎤' : '🔊'),
                      h(
                        'span',
                        {
                          style: {
                            position: 'absolute',
                            top: '7px',
                            left: '7px',
                            padding: '2px 7px',
                            borderRadius: '6px',
                            background: 'rgba(5, 8, 16, 0.78)',
                            border: '1px solid rgba(255,255,255,0.16)',
                            color: a.type === 'video' ? T.accentBlue : a.type === 'image' ? T.accentGreen : T.accentGold,
                            fontSize: '11px',
                            fontWeight: 800,
                          },
                        },
                        a.type === 'video' ? `🎬 视频${a.durationSec ? ` · ${Number(a.durationSec).toFixed(1)}s` : ''}` : a.type === 'image' ? '🖼️ 图片' : '🎵 音频',
                      ),
                      h(
                        'button',
                        { type: 'button', onClick: () => handleDeleteAsset(a.id), title: '移除素材', style: { position: 'absolute', top: '7px', right: '7px', width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.7)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                        h(Icon, { name: 'x', size: 13 }),
                      ),
                    ),
                    h(
                      'div',
                      { style: { padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '7px' } },
                      h('div', { style: { fontSize: '13.5px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, a.name || a.originalName),
                      h('div', { style: { fontSize: '12px', color: T.textMuted, fontFamily: 'Consolas, monospace' } }, a.width && a.height ? `${a.width}×${a.height}${a.durationSec ? ` · ${Number(a.durationSec).toFixed(1)}s` : ''}` : a.durationSec ? `${Number(a.durationSec).toFixed(1)}s` : a.type),
                      h(CinemaSelect, {
                        compact: true,
                        value: !a.role || ['general', 'hero', 'broll', 'image', 'video', 'footage', 'visual'].includes(a.role) ? 'visual' : a.role,
                        onChange: (r) => handleChangeAssetRole(a.id, r),
                        T,
                        options: [
                          { value: 'visual', label: '画面素材' },
                          { value: 'music', label: 'BGM 配乐' },
                          { value: 'host_video', label: '真人出镜视频' },
                          { value: 'avatar_base', label: '数字人底板' },
                          { value: 'voice_clone', label: '声音克隆样本' },
                          { value: 'sfx', label: '转场音效' },
                        ],
                      }),
                    ),
                  ),
                ),
              ),
        ),
      )

      const step2Panel = h(
        'div',
        { className: 'dsh-vw-scroll dsh-vw-grid-studio-2col', style: { flex: 1, overflowY: 'auto', padding: '22px 26px' } },
        // Left Column: Topic + Style + 3-Mode BGM + Collapsible Professional Params
        h(
          'div',
          { style: { ...panelStyle, padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' } },
          h('h2', { style: { margin: 0, fontSize: '18px', fontWeight: 800 } }, '02 · 导演构思、视觉风格与三重配乐'),
          h(
            'div',
            null,
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' } },
              h('label', { style: { fontSize: '13.5px', fontWeight: 700 } }, '创作主题与核心文案指令'),
              h(
                'div',
                { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } },
                h(
                  'button',
                  { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(polishingTopic) || Boolean(busyLabel), onClick: handlePolishTopic, style: { ...blueBtnStyle, padding: '4px 10px', fontSize: '12px', borderRadius: '999px' } },
                  h(Icon, { name: 'sparkles', size: 12 }),
                  polishingTopic ? 'AI 润色中...' : '✨ AI 一键润色提示词',
                ),
                unpolishedTopicBackup
                  ? h(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-vw-btn',
                        onClick: () => {
                          setDirectorForm((p) => ({ ...p, topic: unpolishedTopicBackup }))
                          setUnpolishedTopicBackup('')
                        },
                        style: { ...ghostBtnStyle, padding: '4px 9px', fontSize: '12px', borderRadius: '999px' },
                      },
                      '↩ 恢复原句',
                    )
                  : null,
              ),
            ),
            h('textarea', {
              rows: 8,
              value: directorForm.topic,
              onChange: (ev) => setDirectorForm((p) => ({ ...p, topic: ev.target.value })),
              onBlur: (ev) => {
                const v = ev.target.value.trim()
                if (v && v !== String(script?.goal || '').trim()) {
                  updateDirectorAndSync({ goal: v })
                }
              },
              placeholder: '写一句需求即可（点右上「✨ AI 一键润色提示词」可自动扩写并覆盖为专业导演指令）...',
              style: { ...inputStyle, fontSize: '14.5px', lineHeight: 1.6, resize: 'vertical', minHeight: '188px' },
            }),
          ),
          h(
            'div',
            { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
            h(
              'div',
              null,
              h('label', { style: { display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '5px' } }, '节奏适配方案'),
              h(CinemaSelect, {
                compact: true,
                value: directorForm.pacingMode || 'auto',
                onChange: (v) => setDirectorForm((p) => ({ ...p, pacingMode: v })),
                T,
                options: [
                  { value: 'auto', label: '🧠 AI 依题材智能适配' },
                  { value: 'calm', label: '🍃 舒缓叙事 (4~7s/镜)' },
                  { value: 'balanced', label: '⚖️ 稳健解说 (3~5s/镜)' },
                  { value: 'dynamic', label: '⚡ 高燃踩点 (0.5~3s/镜)' },
                ],
              }),
            ),
            h(
              'div',
              null,
              h('label', { style: { display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '5px' } }, 'AI 辅助创作角标'),
              h(CinemaSelect, {
                compact: true,
                value: directorForm.aiBadgeEnabled ? (directorForm.aiBadgePosition || 'top-right') : 'off',
                onChange: (v) =>
                  setDirectorForm((p) =>
                    v === 'off'
                      ? { ...p, aiBadge: false, aiBadgeEnabled: false }
                      : { ...p, aiBadge: true, aiBadgeEnabled: true, aiBadgePosition: v },
                  ),
                T,
                options: [
                  { value: 'top-right', label: '↗ 右上角展示（推荐）' },
                  { value: 'top-left', label: '↖ 左上角展示' },
                  { value: 'bottom-right', label: '↘ 右下角展示' },
                  { value: 'bottom-left', label: '↙ 左下角展示' },
                  { value: 'off', label: '🚫 关闭不添加' },
                ],
              }),
            ),
          ),
          // 目标视频时长：AI 自由匹配 / 用户自定义时长（Step 2 与作战大屏双向同步）
          h(
            'div',
            {
              style: {
                padding: '11px 13px',
                borderRadius: '10px',
                background: T.panelMutedBg || T.surfaceSubtle || 'rgba(15,23,42,0.04)',
                border: `1px solid ${directorForm.durationMode === 'custom' ? T.accentBlueBorder : T.borderSubtle}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              },
            },
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
              h('label', { style: { fontSize: '12.5px', fontWeight: 700, margin: 0 } }, '⏱ 目标视频时长（AI 润色与分镜策划严格按此生成）'),
              h(SegmentedPills, {
                value: directorForm.durationMode === 'custom' ? 'custom' : 'auto',
                onChange: (dm) =>
                  updateDirectorAndSync(
                    dm === 'custom'
                      ? { durationMode: 'custom', targetDurationSec: Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120))) }
                      : { durationMode: 'auto', targetDurationSec: 0 },
                  ),
                T,
                size: 'sm',
                options: [
                  { id: 'auto', label: '🧠 AI 自由匹配' },
                  { id: 'custom', label: '⏱ 自定义时长' },
                ],
              }),
            ),
            directorForm.durationMode === 'custom'
              ? h(
                  'div',
                  { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                  [
                    { sec: 30, label: '30秒' },
                    { sec: 60, label: '1分钟' },
                    { sec: 90, label: '90秒' },
                    { sec: 120, label: '2分钟' },
                    { sec: 180, label: '3分钟' },
                    { sec: 300, label: '5分钟' },
                  ].map((preset) => {
                    const activePreset = Math.round(Number(directorForm.targetDurationSec) || 120) === preset.sec
                    return h(
                      'button',
                      {
                        key: preset.sec,
                        type: 'button',
                        className: 'dsh-vw-btn',
                        onClick: () => updateDirectorAndSync({ durationMode: 'custom', targetDurationSec: preset.sec }),
                        style: {
                          ...(activePreset ? blueBtnStyle : ghostBtnStyle),
                          padding: '3px 10px',
                          fontSize: '12px',
                          borderRadius: '999px',
                        },
                      },
                      preset.label,
                    )
                  }),
                  h('input', {
                    type: 'number',
                    min: 15,
                    max: 600,
                    step: 5,
                    value: directorForm.targetDurationSec || 120,
                    onChange: (ev) => {
                      const raw = Math.round(Number(ev.target.value) || 0)
                      setDirectorForm((p) => ({ ...p, durationMode: 'custom', targetDurationSec: raw }))
                    },
                    onBlur: (ev) => {
                      const clamped = Math.max(15, Math.min(600, Math.round(Number(ev.target.value) || 120)))
                      updateDirectorAndSync({ durationMode: 'custom', targetDurationSec: clamped })
                    },
                    style: { ...inputStyle, width: '78px', padding: '4px 8px', fontSize: '12.5px', textAlign: 'center' },
                    title: '自定义目标时长（15 ~ 600 秒）',
                  }),
                  h(
                    'span',
                    { style: { fontSize: '12px', color: T.textMuted } },
                    (() => {
                      const s = Math.max(15, Math.min(600, Math.round(Number(directorForm.targetDurationSec) || 120)))
                      const m = Math.floor(s / 60)
                      const r = s % 60
                      const fmt = m > 0 ? `${m}分${r > 0 ? `${String(r).padStart(2, '0')}秒` : ''}` : `${s}秒`
                      return `秒（约 ${fmt} · 润色与分镜自动规划足量内容）`
                    })(),
                  ),
                )
              : h(
                  'div',
                  { style: { fontSize: '12px', color: T.textMuted } },
                  '由 AI 按题材复杂度与素材体量自由匹配最佳时长；若在上方指令里直接写了“两分钟以上/150秒”，也会自动识别并严格达标。',
                ),
          ),
          h(
            'div',
            null,
            h('label', { style: { display: 'block', fontSize: '13.5px', fontWeight: 700, marginBottom: '7px' } }, '电影视觉风格（统一色彩与转场基调）'),
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '8px' } },
              UNIFIED_STYLES.map((st) => {
                const on = directorForm.style === st.id
                return h(
                  'button',
                  {
                    key: st.id,
                    type: 'button',
                    className: 'dsh-vw-btn',
                    onClick: () => setDirectorForm((p) => ({ ...p, style: st.id })),
                    style: {
                      padding: '10px 12px',
                      borderRadius: '11px',
                      textAlign: 'left',
                      background: on ? T.accentGoldBg : T.bgElevated,
                      border: `1.5px solid ${on ? T.accentGoldBorder : T.borderSubtle}`,
                      color: T.textPrimary,
                    },
                  },
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13.5px', fontWeight: 800, color: on ? T.accentGold : T.textPrimary } }, h('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: st.swatch } }), st.label),
                  h('div', { style: { fontSize: '12px', color: T.textMuted, marginTop: '3px' } }, st.desc),
                )
              }),
            ),
          ),

          // 3-Mode BGM Panel
          h(
            'div',
            { style: { padding: '14px', borderRadius: '12px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '10px' } },
            h('div', { style: { fontSize: '14px', fontWeight: 800 } }, '🎵 背景音乐 BGM（混音时人声出现自动压低配乐）'),
            h(SegmentedPills, {
              value: directorForm.bgmMode,
              onChange: (m) => setDirectorForm((p) => ({ ...p, bgmMode: m })),
              T,
              fullWidth: true,
              size: 'sm',
              options: [
                { id: 'llm-coded', label: '🧠 AI 写代码作曲' },
                { id: 'uploaded', label: '📁 选用自传音乐' },
                { id: 'tts-engine', label: '🎙 TTS 氛围音景' },
              ],
            }),
            directorForm.bgmMode === 'llm-coded'
              ? h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleLlmComposeBgm, style: { ...blueBtnStyle, width: '100%' } }, '✨ 让大模型编写配乐算法并立即试听')
              : directorForm.bgmMode === 'uploaded'
                ? h(
                    'div',
                    { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                    projectAssets.filter((a) => a.type === 'audio' && a.role === 'music').length > 0
                      ? h(CinemaSelect, {
                          value: script?.bgm?.uploadedPath || projectAssets.find((a) => a.role === 'music')?.path || '',
                          onChange: (rel) => {
                            if (!script) return
                            setScript((p) => ({ ...p, bgmMode: 'uploaded', bgm: { ...(p?.bgm || {}), mode: 'uploaded', uploadedPath: rel, path: rel } }))
                            setScriptDirty(true)
                          },
                          T,
                          options: projectAssets.filter((a) => a.type === 'audio' && a.role === 'music').map((m) => ({ value: m.path, label: `🎵 ${m.name}`, sub: m.path })),
                        })
                      : h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setStudioStep(1), style: { ...ghostBtnStyle, color: T.accentGold, borderColor: T.accentGoldBorder } }, '← 前往 01 素材库导入个人 BGM'),
                  )
                : h(
                    'div',
                    { style: { display: 'flex', gap: '8px' } },
                    h('input', { value: directorForm.bgmTtsPrompt, onChange: (ev) => setDirectorForm((p) => ({ ...p, bgmTtsPrompt: ev.target.value })), placeholder: '填写氛围音景乐感描述...', style: { ...inputStyle, flex: 1 } }),
                    h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleTtsComposeBgm, style: blueBtnStyle }, '生成音景'),
                  ),
            bgmComposePreviewUrl ? h('audio', { src: bgmComposePreviewUrl, controls: true, style: { width: '100%', height: '36px' } }) : null,
            script?.bgm?.analyzed
              ? h(
                  'div',
                  { style: { fontSize: '12px', color: T.accentCyan, fontWeight: 700, padding: '6px 10px', borderRadius: '8px', background: T.accentCyanSoft, border: `1px solid ${T.accentCyanBorder}` } },
                  `🥁 已测定真实节拍：${script.bgm.bpm} BPM · 首拍 ${script.bgm.phaseSec}s · ${script.bgm.downbeats?.length || 0} 个重拍 · ${script.bgm.drops?.length || 0} 个高潮突降点`,
                )
              : null,
            h('div', { style: { fontSize: '13px', fontWeight: 800, marginTop: '4px' } }, '🥁 配音与卡点节奏模式'),
            h(SegmentedPills, {
              value: directorForm.narrationMode || 'tts',
              onChange: (nm) => setDirectorForm((p) => ({ ...p, narrationMode: nm })),
              T,
              fullWidth: true,
              size: 'sm',
              options: [
                { id: 'tts', label: '🗣️ 标准配音' },
                { id: 'tts-beat-sync', label: '⚡ 配音+踩拍切镜' },
                { id: 'subtitle-mv', label: '🔥 纯音乐卡点 MV' },
              ],
            }),
          ),

          // Collapsible Advanced Engineering Drawer (Decluttered for Beginners!)
          h(
            'div',
            { style: { borderTop: `1px solid ${T.borderSubtle}`, paddingTop: '10px' } },
            h(
              'button',
              { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowAdvancedDirector((v) => !v), style: { ...ghostBtnStyle, width: '100%', justifyContent: 'space-between' } },
              h('span', null, '⚙ 更多专业参数（渲染引擎 · 语速 · 素材裁剪与变速 · 源码作者开关）'),
              h(Icon, { name: 'chevron-down', size: 15 }),
            ),
            showAdvancedDirector
              ? h(
                  'div',
                  { style: { marginTop: '12px', padding: '14px', borderRadius: '12px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '12px' } },
                  h(
                    'div',
                    { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' } },
                    h('span', { style: { fontSize: '13.5px', fontWeight: 700 } }, '渲染底层引擎'),
                    h(SegmentedPills, {
                      value: directorForm.engine === 'html' || directorForm.engine === 'html5' ? 'html' : 'remotion',
                      onChange: (e) => updateDirectorAndSync({ engine: e }),
                      T,
                      size: 'sm',
                      options: [
                        { id: 'remotion', label: '⚛️ Remotion + Three.js 3D' },
                        { id: 'html', label: '🌐 HTML5 + Three.js' },
                      ],
                    }),
                  ),
                  h(
                    'div',
                    { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' } },
                    h('label', null, `口播语速 (${Number(speechTempo).toFixed(2)}x)`, h('input', { type: 'range', min: 0.75, max: 1.5, step: 0.05, value: speechTempo, onChange: (ev) => setSpeechTempo(Number(ev.target.value)), style: { width: '100%' } })),
                    h('label', null, `片源播放倍速 (${Number(clipSpeedMult).toFixed(2)}x)`, h('input', { type: 'range', min: 0.5, max: 2.0, step: 0.1, value: clipSpeedMult, onChange: (ev) => setClipSpeedMult(Number(ev.target.value)), style: { width: '100%' } })),
                  ),
                  h(
                    'div',
                    { style: { display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '13.5px' } },
                    h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: useHostVocal, onChange: (ev) => setUseHostVocal(ev.target.checked) }), '优先沿用真人出镜原声'),
                    h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: aiAuthorCode, onChange: (ev) => setAiAuthorCode(ev.target.checked) }), '允许大模型手写动效源码'),
                  ),
                  h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleRunMediaCurate, style: { ...ghostBtnStyle, width: '100%' } }, '✂️ 立刻执行 FFmpeg 素材智能构图与调色'),
                )
              : null,
          ),
        ),

        // Right Column: Engine/3D/Aspect/Quality/Platform + Voice & Clone + AI Digital Avatar + Execute Buttons
        h(
          'div',
          { style: { ...panelStyle, padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' } },
          h(
            'div',
            { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
            h(
              'div',
              null,
              h('label', { style: { display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '5px' } }, '渲染底层引擎'),
              h(SegmentedPills, {
                value: directorForm.engine === 'html' || directorForm.engine === 'html5' ? 'html' : 'remotion',
                onChange: (e) => updateDirectorAndSync({ engine: e }),
                T,
                fullWidth: true,
                size: 'sm',
                options: [
                  { id: 'remotion', label: '⚛️ Remotion + Three.js' },
                  { id: 'html', label: '🌐 HTML5 + Three.js' },
                ],
              }),
            ),
            h(
              'div',
              null,
              h('label', { style: { display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '5px' } }, 'Vibecoding 3D / SVG / HUD 视效'),
              h(CinemaSelect, {
                compact: true,
                value: directorForm.visual3dMode || 'auto',
                onChange: (v) => updateDirectorAndSync({ visual3dMode: v }),
                T,
                options: [
                  { value: 'auto', label: '🪐 Opus 5.5 全开 (3D+SVG+HUD+弹簧)', sub: 'Three.js 3D + 动态SVG拓扑 + 全息HUD + 弹簧物理' },
                  { value: 'on', label: '✨ 强化 3D 线框 + 全息 HUD 遥测', sub: '全镜叠加 3D 几何矩阵与实时遥测面板' },
                  { value: 'off', label: '🖼️ 纯 2D 平面动效', sub: '关闭 Three.js 3D 与全屏 HUD 遥测层' },
                ],
              }),
            ),
          ),
          h(
            'div',
            { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
            h(
              'div',
              null,
              h('label', { style: { display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '5px' } }, '画面比例'),
              h(CinemaSelect, {
                value: directorForm.aspectRatio,
                onChange: (v) => updateDirectorAndSync({ aspectRatio: v }),
                T,
                options: ASPECT_RATIO_OPTIONS.map((o) => ({ value: o.id, label: `${o.icon} ${o.label}`, sub: o.sub })),
              }),
            ),
            h(
              'div',
              null,
              h('label', { style: { display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '5px' } }, '清晰度规格'),
              h(CinemaSelect, {
                value: directorForm.quality,
                onChange: (v) => updateDirectorAndSync({ quality: v }),
                T,
                options: QUALITY_OPTIONS.map((q) => ({ value: q.id, label: q.label, sub: q.desc })),
              }),
            ),
          ),
          directorForm.aspectRatio === 'custom' || directorForm.quality === 'custom'
            ? h(
                'div',
                { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
                h('input', { type: 'number', value: directorForm.customWidth, onChange: (ev) => setDirectorForm((p) => ({ ...p, customWidth: Number(ev.target.value) })), placeholder: '自定义宽度 px', style: inputStyle }),
                h('input', { type: 'number', value: directorForm.customHeight, onChange: (ev) => setDirectorForm((p) => ({ ...p, customHeight: Number(ev.target.value) })), placeholder: '自定义高度 px', style: inputStyle }),
              )
            : null,
          h(
            'div',
            null,
            h('label', { style: { display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '5px' } }, '首发目标平台 (自动启用平台防遮挡安全区)'),
            h(CinemaSelect, {
              value: directorForm.targetPlatform,
              onChange: (v) => setDirectorForm((p) => ({ ...p, targetPlatform: v })),
              T,
              options: PLATFORM_OPTIONS.map((p) => ({ value: p.id, label: p.label, sub: p.hint })),
            }),
          ),

          // Voice & Multi-Engine TTS Selection Card (IndexTTS-2.5 / IndexTTS-2 / GPT-SoVITS / Custom Imported Models)
          h(
            'div',
            { style: { padding: '14px', borderRadius: '12px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '10px' } },
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
              h(
                'div',
                null,
                h(
                  'div',
                  { style: { fontSize: '12.5px', color: T.textMuted, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                  h('span', null, `${activeTtsLabel} 配音引擎 · ${ttsStatus.ready ? '✓ 已就绪' : '待连接'}`),
                  activeTtsEngineObj?.vramBadge ? h('span', { style: { padding: '1px 7px', borderRadius: '999px', background: T.accentBlueBg, color: T.accentBlue, fontSize: '11px', fontWeight: 700 } }, activeTtsEngineObj.vramBadge) : null,
                ),
                h('div', { style: { fontSize: '14.5px', fontWeight: 800, marginTop: '3px' } }, voiceCatalog.find((v) => v.id === directorForm.voiceId)?.name || (directorForm.voiceId === 'auto' ? 'AI 自动智能匹配音色' : directorForm.voiceId)),
              ),
              h(
                'div',
                { style: { display: 'flex', gap: '7px', flexWrap: 'wrap' } },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-vw-btn',
                    onClick: () => setShowTtsModal(true),
                    style: { ...ghostBtnStyle, borderColor: T.accentGoldBorder, color: T.accentGold },
                  },
                  '⚙ 切换/添加配音模型',
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-vw-btn',
                    onClick: () => {
                      setVoiceModalTarget('global')
                      setShowVoiceModal(true)
                    },
                    style: ghostBtnStyle,
                  },
                  h(Icon, { name: 'mic', size: 15 }),
                  '选音色 / 克隆我的声音',
                ),
              ),
            ),
            h(
              'div',
              { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' } },
              ((ttsConfig?.engines?.length ? ttsConfig.engines : [
                { id: 'indextts25', shortName: 'IndexTTS-2.5' },
                { id: 'indextts2', shortName: 'IndexTTS-2' },
                { id: 'gptvoice', shortName: 'GPT-SoVITS (低显存)' },
              ])).map((eng) => {
                const isAct = (ttsConfig?.activeEngineId || 'indextts25') === eng.id
                return h(
                  'button',
                  {
                    key: eng.id,
                    type: 'button',
                    className: 'dsh-vw-btn',
                    onClick: () => handleSelectTtsEngine(eng.id),
                    style: {
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: isAct ? 800 : 600,
                      border: `1px solid ${isAct ? T.accentBlueBorder : T.borderSubtle}`,
                      background: isAct ? T.accentBlueBg : T.bgPanel,
                      color: isAct ? T.accentBlue : T.textSecondary,
                    },
                  },
                  isAct ? `✓ ${eng.shortName || eng.name}` : (eng.shortName || eng.name),
                )
              }),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-vw-btn',
                  onClick: () => {
                    setTtsModalTab('add')
                    setShowTtsModal(true)
                  },
                  style: {
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: `1px dashed ${T.accentGoldBorder}`,
                    background: 'transparent',
                    color: T.accentGold,
                  },
                },
                '+ 添加/导入其他模型',
              ),
            ),
          ),

          // AI Digital Avatar Card (with Honest VisualNotice)
          h(
            'div',
            { style: { padding: '14px', borderRadius: '12px', background: avatarCfg.enabled ? T.accentBlueBg : T.bgElevated, border: `1px solid ${avatarCfg.enabled ? T.accentBlueBorder : T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '10px' } },
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
              h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: avatarCfg.enabled, onChange: (ev) => setAvatarCfg((p) => ({ ...p, enabled: ev.target.checked })) }), '🤖 开启数字人 / 克隆分身口播叠层'),
              h(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                h('span', { style: { fontSize: '12px', color: avatarProvider?.neuralReady ? T.accentGreen : T.textMuted, fontFamily: 'Consolas, monospace' } }, avatarProvider?.neuralReady ? `外接神经对口型 (${avatarProvider.provider})` : '内置声波口型 / 本地人像合成'),
                h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowAvatarEndpointCfg((v) => !v), style: { ...ghostBtnStyle, padding: '3px 9px', fontSize: '11.5px' } }, '⚙ 引擎配置'),
              ),
            ),
            showAvatarEndpointCfg
              ? h(
                  'div',
                  { style: { padding: '10px', borderRadius: '10px', background: T.bgPanelSolid, border: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' } },
                  h('div', { style: { color: T.textSecondary, lineHeight: 1.55 } }, '• 免外部算力模式：AI 主播按音轨声波实时驱动 SVG 眨眼/嘴型生成透明 WebM；克隆真人底板则对本人视频/写真叠加 IndexTTS-2.5 克隆声音。\n• 如需对真人人脸照片/视频做真实唇形对口型，请填写下方外接 MuseTalk / LatentSync 接口。'),
                  h(
                    'div',
                    { style: { display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px' } },
                    h('select', { value: avatarEndpointForm.provider, onChange: (ev) => setAvatarEndpointForm((p) => ({ ...p, provider: ev.target.value })), style: inputStyle }, h('option', { value: 'auto' }, 'auto'), h('option', { value: 'musetalk' }, 'MuseTalk'), h('option', { value: 'latentsync' }, 'LatentSync'), h('option', { value: 'local-composite' }, '仅本地合成')),
                    h('input', { value: avatarEndpointForm.endpoint, onChange: (ev) => setAvatarEndpointForm((p) => ({ ...p, endpoint: ev.target.value })), placeholder: '可选：外接接口地址如 http://127.0.0.1:7865', style: inputStyle }),
                  ),
                  h(
                    'div',
                    { style: { display: 'flex', gap: '6px' } },
                    h('input', { type: 'password', value: avatarEndpointForm.apiKey, onChange: (ev) => setAvatarEndpointForm((p) => ({ ...p, apiKey: ev.target.value })), placeholder: '可选：Bearer API Key（留空表示本地无鉴权）', style: { ...inputStyle, flex: 1 } }),
                    h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleSaveAvatarEndpointConfig, style: { ...blueBtnStyle, padding: '6px 12px', fontSize: '12px' } }, '保存接口'),
                  ),
                )
              : null,
            avatarCfg.enabled
              ? h(
                  React.Fragment,
                  null,
                  h(SegmentedPills, {
                    value: avatarCfg.mode,
                    onChange: (m) => setAvatarCfg((p) => ({ ...p, mode: m })),
                    T,
                    fullWidth: true,
                    size: 'sm',
                    options: [
                      { id: 'ai-human', label: '✨ 纯 AI 主播形象' },
                      { id: 'cloned-human', label: '👤 克隆真人底板' },
                    ],
                  }),
                  avatarCfg.mode === 'ai-human'
                    ? h(CinemaSelect, {
                        value: avatarCfg.presetId,
                        onChange: (id) => setAvatarCfg((p) => ({ ...p, presetId: id })),
                        T,
                        options: (avatarTemplates.length ? avatarTemplates : [{ id: 'cyber-anchor', name: '赛博科技主理人' }, { id: 'warm-mentor', name: '温暖故事讲述者' }, { id: 'tech-founder', name: '极客创始人口播' }]).map((t) => ({ value: t.id, label: t.name })),
                      })
                    : h(
                        'div',
                        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
                        h(CinemaSelect, {
                          compact: true,
                          value: avatarCfg.sourcePath,
                          onChange: (v) => setAvatarCfg((p) => ({ ...p, sourcePath: v })),
                          placeholder: '选本人出镜底板视频/人像',
                          T,
                          options: projectAssets.filter((a) => a.type === 'video' || a.type === 'image').map((a) => ({ value: a.path, label: a.name, sub: a.role === 'avatar_base' ? '★ 底板' : a.type })),
                        }),
                        h(CinemaSelect, {
                          compact: true,
                          value: avatarCfg.voiceSamplePath,
                          onChange: (v) => setAvatarCfg((p) => ({ ...p, voiceSamplePath: v })),
                          placeholder: '选声音克隆样本',
                          T,
                          options: projectAssets.filter((a) => a.role === 'voice_clone' || a.type === 'audio' || a.role === 'host_video').map((a) => ({ value: a.path, label: a.name, sub: a.role })),
                        }),
                      ),
                  h(
                    'div',
                    { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' } },
                    h(SegmentedPills, {
                      value: avatarCfg.layout,
                      onChange: (l) => setAvatarCfg((p) => ({ ...p, layout: l })),
                      T,
                      accent: 'gold',
                      size: 'sm',
                      options: [
                        { id: 'pip-br', label: '右下小窗' },
                        { id: 'pip-bl', label: '左下小窗' },
                        { id: 'fullscreen', label: '全屏口播' },
                      ],
                    }),
                    h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleGenerateAvatarClip, style: { ...blueBtnStyle, padding: '8px 14px' } }, '立即合成透明数字人'),
                  ),
                  avatarVisualNotice
                    ? h('div', { style: { fontSize: '12.5px', padding: '8px 10px', borderRadius: '8px', background: T.accentGoldBg, color: T.accentGold, border: `1px solid ${T.accentGoldBorder}` } }, `ℹ ${avatarVisualNotice}`)
                    : null,
                  script?.avatarClip?.path
                    ? h(
                        'div',
                        { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', background: T.bgPanelSolid, border: `1px solid ${T.borderSubtle}` } },
                        h('video', {
                          src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(script.avatarClip.path)}&v=${assetVersion}`,
                          autoPlay: true,
                          loop: true,
                          muted: true,
                          controls: true,
                          style: { width: '92px', height: '104px', borderRadius: '10px', background: '#050810', objectFit: 'cover', flexShrink: 0 },
                        }),
                        h(
                          'div',
                          { style: { fontSize: '12px', color: T.textSecondary, lineHeight: 1.5 } },
                          h('div', { style: { fontWeight: 700, color: T.accentGreen } }, '✓ 透明通道数字人贴片已生成'),
                          h('div', { style: { color: T.textMuted } }, `${script.avatarClip.providerUsed || 'local'} · ${script.avatarClip.pixFmt || 'yuva420p'} · ${Number(script.avatarClip.durationSec || 0).toFixed(1)}s`),
                        ),
                      )
                    : null,
                )
              : h('div', { style: { fontSize: '12.5px', color: T.textMuted } }, '开启后输出透明通道 WebM，与你的产品画面同框出镜口播（支持画中画与绿幕抠像）'),
          ),

          // Execute Actions
          h(
            'div',
            { style: { display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '6px' } },
            h(
              'button',
              { type: 'button', className: 'dsh-vw-btn dsh-vw-plasma-cta', disabled: Boolean(busyLabel), onClick: () => handleStartOneClickPipeline(), style: { padding: '13px 18px', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '15px', fontWeight: 900 } },
              '⚡ 按当前设定一键启动 4-Agent 全自动出片',
            ),
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
              h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handlePlanLocalDraft(false), style: ghostBtnStyle }, '📋 仅生成文字剧本草稿'),
              h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handlePlanLocalDraft(true), style: ghostBtnStyle }, '🎞 先出本地演练草稿片'),
            ),
            h(
              'button',
              { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleAiCodingProduce(directorForm.useDraftReference), style: { ...goldBtnStyle, width: '100%', padding: '12px' } },
              h(Icon, { name: 'sparkles', size: 16 }),
              llmConfig?.configured ? `大模型 AI 编写全套动效出片 (${llmConfig.model})` : '先配置大模型 → 启动 AI 编程创作',
            ),
          ),
        ),
      )

      const step3Panel = h(
        'div',
        { style: { flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' } },
        // Center: Cinema Monitor + Interactive Timeline
        h(
          'div',
          { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
          // Toolbar
          h(
            'div',
            { style: { padding: '10px 18px', borderBottom: `1px solid ${T.borderSubtle}`, background: T.bgPanel, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' } },
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setIsPlaying((v) => !v), style: blueBtnStyle }, h(Icon, { name: isPlaying ? 'pause' : 'play', size: 15 }), isPlaying ? '暂停' : '播放预览'),
              h('span', { style: { fontFamily: 'Consolas, monospace', fontSize: '13.5px', fontWeight: 700, padding: '6px 10px', borderRadius: '8px', background: T.bgInput } }, `${fmtTimecode(currentFrame, script?.fps)} / ${fmtTimecode(script?.totalDurationInFrames || 0, script?.fps)}`),
              hasMp4
                ? h(SegmentedPills, {
                    value: step3MonitorSource,
                    onChange: (src) => {
                      setIsPlaying(false)
                      setStep3MonitorSource(src)
                    },
                    T,
                    size: 'sm',
                    options: [
                      { id: 'final-video', label: '🎬 成片原画时间轴' },
                      { id: 'html-draft', label: '⚡ HTML5 交互骨架' },
                    ],
                  })
                : null,
              h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowSafeGuides((v) => !v), style: { ...ghostBtnStyle, color: showSafeGuides ? T.accentGold : T.textSecondary, borderColor: showSafeGuides ? T.accentGoldBorder : T.borderSubtle } }, h(Icon, { name: 'eye', size: 14 }), showSafeGuides ? '隐藏平台防遮挡线' : '显示防遮挡安全线'),
            ),
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h('div', { style: { width: '165px' } }, h(CinemaSelect, { compact: true, value: script?.aspectRatio || directorForm.aspectRatio, onChange: (r) => handleUpdateFormatQuick(r, script?.quality || directorForm.quality), T, options: ASPECT_RATIO_OPTIONS.filter((o) => o.id !== 'auto' && o.id !== 'custom').map((o) => ({ value: o.id, label: o.label })) })),
              h('div', { style: { width: '165px' } }, h(CinemaSelect, { compact: true, value: directorForm.targetPlatform, onChange: (p) => handleUpdateFormatQuick(script?.aspectRatio || '16:9', script?.quality || '1080p', p), T, options: PLATFORM_OPTIONS.map((p) => ({ value: p.id, label: p.label })) })),
              h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleOpenCodeDrawer, style: ghostBtnStyle }, h(Icon, { name: 'code', size: 14 }), '查看源码'),
            ),
          ),
          // Monitor
          h(
            'div',
            { style: { flex: 1, minHeight: 0, background: T.monitorShell, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative' } },
            h(
              'div',
              {
                style: {
                  position: 'relative',
                  height: isPortraitVideo ? '100%' : 'auto',
                  width: isPortraitVideo ? 'auto' : '100%',
                  maxWidth: isPortraitVideo ? 'none' : '820px',
                  maxHeight: '100%',
                  aspectRatio: `${curW} / ${curH}`,
                  background: '#000',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.16)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
                },
              },
              usingFinalVideoPreview
                ? h('video', {
                    ref: step3VideoRef,
                    key: mp4Url,
                    src: mp4Url,
                    preload: 'metadata',
                    controls: true,
                    onTimeUpdate: (ev) => {
                      const fps = Number(script?.fps) || 30
                      setCurrentFrame(Math.floor((ev.currentTarget.currentTime || 0) * fps))
                    },
                    onPlay: () => setIsPlaying(true),
                    onPause: () => setIsPlaying(false),
                    style: { width: '100%', height: '100%', border: 'none', display: 'block', background: '#000', objectFit: 'contain' },
                  })
                : previewHtmlUrl
                  ? h(
                      React.Fragment,
                      null,
                      h('iframe', { ref: iframeRef, src: previewHtmlUrl, style: { width: '100%', height: '100%', border: 'none', display: 'block', background: '#000' }, onLoad: () => seekToFrame(currentFrame, false) }),
                      isRemotionAiCoded
                        ? h(
                            'div',
                            { style: { position: 'absolute', top: '10px', left: '12px', right: '12px', zIndex: 14, padding: '6px 11px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.88)', border: `1px solid ${T.accentGoldBorder}`, color: '#FDE68A', fontSize: '12px', fontWeight: 700, pointerEvents: 'none' } },
                            hasMp4
                              ? 'ℹ 当前显示 HTML5 骨架稿（点击上方「🎬 成片原画时间轴」可看 Remotion AI 定制 TSX 真实画面）'
                              : 'ℹ 当前显示 HTML5 文案/节奏骨架；Remotion AI 定制 TSX 真实画面将在点击右侧「渲染 MP4」后生成成片与分镜实拍缩略图',
                          )
                        : null,
                    )
                  : h('div', { style: { color: '#94A3B8', fontSize: '14.5px', padding: '48px', textAlign: 'center' } }, '还没有生成好的动态预览，请回作战大屏点击「一键出片」或在 02 步生成草稿'),
              showSafeGuides
                ? h(
                    'div',
                    { style: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 } },
                    (safeZonePreflight?.obstructions || []).map((obs) =>
                      h(
                        'div',
                        {
                          key: obs.id,
                          style: {
                            position: 'absolute',
                            left: `${obs.x * 100}%`,
                            top: `${obs.y * 100}%`,
                            width: `${obs.w * 100}%`,
                            height: `${obs.h * 100}%`,
                            background: obs.tone === 'danger' ? 'rgba(244,63,94,0.22)' : 'rgba(245,185,66,0.16)',
                            border: `1.5px dashed ${obs.tone === 'danger' ? '#FB7185' : '#F5B942'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                        },
                        h('span', { style: { padding: '3px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '12px', fontWeight: 700 } }, `避让区 · ${obs.label}`),
                      ),
                    ),
                  )
                : null,
            ),
          ),
          // Multi-Track Timeline Strip
          h(
            'div',
            { className: 'dsh-vw-scroll', style: { height: '165px', flexShrink: 0, borderTop: `1px solid ${T.borderSubtle}`, background: T.bgSidebar, padding: '12px 18px', overflowX: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' } },
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: '620px' } },
              h('span', { style: { width: '92px', fontSize: '12px', fontWeight: 800, color: T.accentGold } }, 'V1 · 分镜轨道'),
              h(
                'div',
                { style: { flex: 1, display: 'flex', gap: '7px' } },
                scenes.map((sc, idx) => {
                  const sel = idx === selectedSceneIdx
                  const playingNow = isPlaying && idx === activePlayingSceneIdx
                  const thumbRel = sceneThumbs[sc.id] || ''
                  return h(
                    'div',
                    {
                      key: sc.id || idx,
                      onClick: () => {
                        setSelectedSceneIdx(idx)
                        setIsPlaying(false)
                        seekToFrame(sc.startFrame || 0)
                      },
                      style: {
                        flex: `${Math.max(1, Number(sc.durationSec) || 3)} 1 0`,
                        minWidth: thumbRel ? '156px' : '128px',
                        padding: '6px 10px',
                        borderRadius: '9px',
                        cursor: 'pointer',
                        background: sel ? T.accentGoldBg : playingNow ? T.accentBlueBg : T.bgElevated,
                        border: `1.5px solid ${sel ? T.accentGold : playingNow ? T.accentBlue : T.borderSubtle}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      },
                    },
                    thumbRel ? h('img', { src: `/api/video-workbench/asset?projectDir=${encodeURIComponent(activeProjectDir)}&rel=${encodeURIComponent(thumbRel)}&v=${assetVersion}`, style: { width: '48px', height: '32px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.14)' } }) : null,
                    h(
                      'div',
                      { style: { minWidth: 0 } },
                      h('div', { style: { fontSize: '12px', fontWeight: 800, color: sel ? T.accentGold : T.accentBlue } }, `${sc.id || `S0${idx + 1}`} · ${Number(sc.durationSec || 3).toFixed(1)}s`),
                      h('div', { style: { fontSize: '13px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' } }, sc.title || `第 ${idx + 1} 幕`),
                    ),
                  )
                }),
              ),
            ),
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: '620px' } },
              h('span', { style: { width: '92px', fontSize: '12px', fontWeight: 800, color: T.accentGreen } }, 'A1 · 混音配乐'),
              h(
                'div',
                { style: { flex: 1, padding: '8px 12px', borderRadius: '8px', background: T.accentGreenBg, border: `1px solid rgba(52,211,153,0.35)`, fontSize: '12.5px', color: T.accentGreen, display: 'flex', justifyContent: 'space-between' } },
                h('span', null, `🎵 配乐模式: ${script?.bgmMode || directorForm.bgmMode} (人声进入自动闪避)`),
                h('span', { style: { fontFamily: 'Consolas, monospace', fontWeight: 700 } }, hasMasterAudio ? '✓ master-audio.wav 已对齐' : '待合成混音'),
              ),
            ),
          ),
        ),

        // Right Inspector: AI Dialogue Refine + Scene Editor
        h(
          'aside',
          { className: 'dsh-vw-scroll', style: { width: '360px', flexShrink: 0, background: T.bgSidebar, borderLeft: `1px solid ${T.borderSubtle}`, padding: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' } },
          // Co-Pilot Quick Refine
          h(
            'div',
            { style: { padding: '14px', borderRadius: '13px', background: T.accentBlueBg, border: `1px solid ${T.accentBlueBorder}`, display: 'flex', flexDirection: 'column', gap: '10px' } },
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              h('span', { style: { fontSize: '13.5px', fontWeight: 800, color: T.accentBlue } }, '💬 对 AI 说（小白一键改片）'),
              historyCount > 0 ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleRollbackVersion, style: { ...ghostBtnStyle, padding: '4px 10px', fontSize: '12px' } }, h(Icon, { name: 'undo', size: 13 }), `撤回 (${historyCount})`) : null,
            ),
            h(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
              QUICK_FIX_PILLS.map((pill) =>
                h('button', { key: pill.label, type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleAiRefine(pill.prompt), style: { ...ghostBtnStyle, padding: '5px 10px', fontSize: '12px', borderRadius: '999px' } }, pill.label),
              ),
            ),
            h('textarea', {
              rows: 3,
              value: refinePrompt,
              onChange: (ev) => setRefinePrompt(ev.target.value),
              placeholder: '例如：这一幕换成更震撼的数据增长动画，加大标题字号...',
              style: { ...inputStyle, fontSize: '13.5px', resize: 'vertical' },
            }),
            h(
              'div',
              { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
              h('div', { style: { flex: 1 } }, h(CinemaSelect, { compact: true, value: refineScope, onChange: setRefineScope, T, options: [{ value: 'scene', label: `仅改当前 (${selectedScene?.id || 'S01'})` }, { value: 'global', label: '重构全片整体风格' }] })),
              h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleAiRefine(), style: blueBtnStyle }, h(Icon, { name: 'sparkles', size: 14 }), 'AI 立即改好'),
            ),
          ),

          // Scene Properties
          selectedScene
            ? h(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                h('div', { style: { fontSize: '15px', fontWeight: 800 } }, `分镜手调 · ${selectedScene.id}`),
                h('input', { value: selectedScene.title || '', onChange: (ev) => updateSelectedScene({ title: ev.target.value }), placeholder: '画面主标题', style: inputStyle }),
                h('textarea', { rows: 4, value: selectedScene.narration || '', onChange: (ev) => updateSelectedScene({ narration: ev.target.value }), placeholder: '口播旁白与高亮字幕内容', style: { ...inputStyle, resize: 'vertical', lineHeight: 1.55 } }),
                h(
                  'div',
                  { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' } },
                  h(
                    'div',
                    null,
                    h('div', { style: { fontSize: '11.5px', fontWeight: 700, color: T.textMuted, marginBottom: '4px' } }, '本幕视觉布局 (SVG架构/HUD)'),
                    h(CinemaSelect, {
                      compact: true,
                      value: selectedScene.layout || '3d-stage-opener',
                      onChange: (ly) => updateSelectedScene({ layout: ly, useBuiltinLayout: true }),
                      T,
                      options: SCENE_LAYOUT_OPTIONS,
                    }),
                  ),
                  h(
                    'div',
                    null,
                    h('div', { style: { fontSize: '11.5px', fontWeight: 700, color: T.textMuted, marginBottom: '4px' } }, '本幕 Three.js 3D 舞台'),
                    h(CinemaSelect, {
                      compact: true,
                      value: selectedScene.threePreset || 'orbital-core',
                      onChange: (tp) => updateSelectedScene({ threePreset: tp }),
                      T,
                      options: THREE_PRESET_OPTIONS,
                    }),
                  ),
                ),
                h(
                  'div',
                  { style: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '7px' } },
                  h(CinemaSelect, { compact: true, value: selectedScene.emotion || '平静', onChange: (em) => updateSelectedScene({ emotion: em }), T, options: availableEmotions.map((em) => ({ value: em, label: `🎭 ${em}` })) }),
                  h(CinemaSelect, {
                    compact: true,
                    value: String(Number(selectedScene.speechRate || 1.0).toFixed(2)),
                    onChange: (sp) => updateSelectedScene({ speechRate: Number(sp) || 1.0 }),
                    T,
                    options: [
                      { value: '0.85', label: '0.85x 舒缓' },
                      { value: '0.95', label: '0.95x 稳重' },
                      { value: '1.00', label: '1.00x 标准' },
                      { value: '1.06', label: '1.06x 明快' },
                      { value: '1.12', label: '1.12x 紧凑' },
                      { value: '1.20', label: '1.20x 极速' },
                    ],
                  }),
                  h(CinemaSelect, { compact: true, value: selectedScene.kenBurns || 'zoom-in', onChange: (kb) => updateSelectedScene({ kenBurns: kb }), T, options: MOTION_OPTIONS.map((m) => ({ value: m.value, label: m.label })) }),
                ),
                h(
                  'div',
                  { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
                  h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleSynthesizeSceneTts(selectedScene), style: ghostBtnStyle }, '🎙 重配此幕配音'),
                  h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleAiMasterVoice(selectedScene.id), style: ghostBtnStyle }, '🎛 AI 声学修音'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-vw-btn',
                    onClick: () => {
                      setVoiceModalTarget(selectedScene.id)
                      setVoiceModalTab('library')
                      setShowVoiceModal(true)
                    },
                    style: { ...ghostBtnStyle, width: '100%', justifyContent: 'space-between', fontSize: '12.5px' },
                  },
                  h('span', null, '🎤 本幕音色'),
                  h('span', { style: { color: T.accentBlue, fontWeight: 700 } }, voiceCatalog.find((v) => v.id === selectedScene.voiceId)?.name || selectedScene.voiceId || '跟随全局 →'),
                ),
                scriptDirty ? h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleSaveScriptEdits, style: { ...goldBtnStyle, width: '100%' } }, '💾 保存并刷新预演画面') : null,
                h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleRenderMp4(false), style: { ...goldBtnStyle, width: '100%', marginTop: '6px' } }, '🎬 满意了！渲染 1080P 成品 MP4 →'),
              )
            : null,
        ),
      )

      const step4Panel = h(
        'div',
        { className: 'dsh-vw-scroll', style: { flex: 1, overflowY: 'auto', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '18px' } },
        h(
          'div',
          { className: 'dsh-vw-grid-studio-2col' },
          // Final Cinema MP4 Player
          h(
            'div',
            { style: { ...panelStyle, padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' } },
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' } },
              h('h2', { style: { margin: 0, fontSize: '18px', fontWeight: 800 } }, '04 · 成片电影级播放、导出与发布包'),
              h('span', { style: { fontSize: '13px', fontFamily: 'Consolas, monospace', color: T.accentGold } }, `${curW}×${curH} · ${script?.fps || 30}fps`),
            ),
            hasMp4
              ? h('video', { key: mp4Url, src: mp4Url, preload: 'auto', controls: true, style: { width: '100%', maxHeight: '420px', aspectRatio: `${curW} / ${curH}`, borderRadius: '14px', background: '#000', border: `1px solid ${T.borderStrong}` } })
              : h('div', { style: { height: '300px', borderRadius: '14px', background: '#05080F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '15px' } }, '点击下方「渲染全高清成品 MP4」后在此即时观看与下载'),
            h(
              'div',
              { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
              h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleRenderMp4(true), style: ghostBtnStyle }, '⚡ 720P 快速审片导出'),
              h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleRenderMp4(false), style: goldBtnStyle }, '🎬 渲染高清成品 MP4'),
              hasMp4 ? h('a', { href: mp4Url, download: 'final.mp4', style: { ...blueBtnStyle, textDecoration: 'none' } }, h(Icon, { name: 'download', size: 15 }), '下载 final.mp4') : null,
              hasMp4 ? h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleExportPublishPack(), style: { ...ghostBtnStyle, borderColor: T.accentGoldBorder, color: T.accentGold } }, '📦 一键生成发布资料包') : null,
            ),
          ),

          // Plain-Chinese QA Scorecard & Frame Matrix
          h(
            'div',
            { style: { ...panelStyle, padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' } },
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              h('h3', { style: { margin: 0, fontSize: '16px', fontWeight: 800 } }, '✅ 成品音画自动化体检单'),
              h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleRunQaOnly, style: ghostBtnStyle }, '重新检测'),
            ),
            qaReport?.checks?.length
              ? qaReport.checks.map((ck, i) =>
                  h(
                    'div',
                    { key: i, style: { padding: '11px 14px', borderRadius: '11px', background: ck.passed ? T.accentGreenBg : T.accentRedBg, border: `1px solid ${ck.passed ? 'rgba(52,211,153,0.3)' : 'rgba(251,113,133,0.35)'}` } },
                    h('div', { style: { fontSize: '14px', fontWeight: 800, color: ck.passed ? T.accentGreen : T.accentRed } }, `${ck.passed ? '✓' : '✕'} ${ck.name}`),
                    h('div', { style: { fontSize: '12.5px', color: T.textSecondary, marginTop: '3px', fontFamily: 'Consolas, monospace' } }, ck.value),
                  ),
                )
              : h('div', { style: { fontSize: '13.5px', color: T.textMuted, lineHeight: 1.6 } }, '渲染成片后将自动检查：全片无黑屏、人声响度达标 (-14 LUFS)、音画完全对齐及广播色彩规格。'),
            buildLog
              ? h(
                  'div',
                  { style: { padding: '12px', borderRadius: '10px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, fontSize: '13px', color: T.textSecondary } },
                  h('div', { style: { fontWeight: 800, color: T.textPrimary, marginBottom: '4px' } }, `🤖 编译日志 (${buildLog.model || '本地引擎'})`),
                  h('div', null, `自动修复轮数: ${buildLog.repairRoundsUsed ?? 0} · 生成源码数: ${buildLog.generatedFiles?.length || 0}`),
                )
              : null,
            hasSnapshot
              ? h(
                  'div',
                  null,
                  h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowMatrixPreview((v) => !v), style: { ...ghostBtnStyle, width: '100%' } }, showMatrixPreview ? '收起九宫格关键帧检查图' : '展开九宫格关键帧检查图'),
                  showMatrixPreview ? h('img', { src: snapshotUrl, style: { width: '100%', borderRadius: '10px', marginTop: '10px', border: `1px solid ${T.borderSubtle}` } }) : null,
                )
              : null,
          ),
        ),

        publishPackResult
          ? h(
              'div',
              { style: { ...panelStyle, padding: '20px', borderColor: T.accentGoldBorder, display: 'flex', flexDirection: 'column', gap: '12px' } },
              h('div', { style: { fontSize: '16px', fontWeight: 800, color: T.accentGold } }, `📦 已导出发布资料包 (${publishPackResult.platformLabel || publishPackResult.platform})`),
              h(
                'div',
                { style: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', alignItems: 'start' } },
                publishPackResult.coverUrl ? h('img', { src: publishPackResult.coverUrl, style: { width: '100%', borderRadius: '10px', border: `1px solid ${T.borderStrong}` } }) : null,
                h(
                  'div',
                  { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                  (publishPackResult.suggestedTitles || []).map((t, idx) => h('div', { key: idx, style: { fontSize: '13.5px', padding: '8px 12px', borderRadius: '8px', background: T.bgElevated } }, t)),
                  h('div', { style: { fontSize: '13.5px', color: T.accentBlue, fontWeight: 700 } }, (publishPackResult.hashtags || []).join(' ')),
                ),
              ),
            )
          : null,
      )

      const studioWorkbenchView = h(
        'div',
        { style: { flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' } },
        // Collapsible Clean Vertical Step Rail (Only visible in Studio mode!)
        h(
          'aside',
          {
            style: {
              width: '216px',
              flexShrink: 0,
              background: T.bgSidebar,
              borderRight: `1px solid ${T.borderSubtle}`,
              padding: '18px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            },
          },
          h('div', { style: { fontSize: '12.5px', fontWeight: 800, color: T.textMuted, padding: '0 8px 6px' } }, '分步精修流程'),
          [
            { id: 1, title: '01 素材与提词拍', sub: `${projectAssets.length} 份素材` },
            { id: 2, title: '02 导演声画配乐', sub: UNIFIED_STYLES.find((s) => s.id === directorForm.style)?.label || '风格与配音' },
            { id: 3, title: '03 监看台与改片', sub: `${scenes.length} 幕分镜` },
            { id: 4, title: '04 质检导出发布', sub: hasMp4 ? '✓ MP4 就绪' : '待导出' },
          ].map((s) => {
            const on = studioStep === s.id
            return h(
              'button',
              {
                key: s.id,
                type: 'button',
                className: 'dsh-vw-btn',
                onClick: () => {
                  setIsPlaying(false)
                  setStudioStep(s.id)
                },
                style: {
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 13px',
                  borderRadius: '12px',
                  border: `1px solid ${on ? T.accentGoldBorder : 'transparent'}`,
                  background: on ? T.accentGoldBg : 'transparent',
                  color: on ? T.accentGold : T.textPrimary,
                },
              },
              h('div', { style: { fontSize: '14px', fontWeight: on ? 800 : 700 } }, s.title),
              h('div', { style: { fontSize: '12px', color: on ? T.accentGold : T.textMuted, marginTop: '3px' } }, s.sub),
            )
          }),
          h(
            'button',
            { type: 'button', className: 'dsh-vw-btn', onClick: () => setActiveNav('warroom'), style: { ...ghostBtnStyle, marginTop: 'auto', width: '100%', justifyContent: 'center' } },
            '← 返回 AI 作战大屏',
          ),
        ),
        studioStep === 1 ? step1Panel : studioStep === 2 ? step2Panel : studioStep === 3 ? step3Panel : step4Panel,
      )

      // =======================================================================
      // 11. VIEW 3: TASK MONITOR CENTER (`activeNav === 'tasks'`)
      // =======================================================================
      const filteredTaskRuns = taskRuns.filter((r) => (taskFilter === 'all' ? true : taskFilter === 'running' ? r.status === 'running' || r.status === 'paused' : r.status === taskFilter))
      const taskCenterView = h(
        'div',
        { className: 'dsh-vw-scroll', style: { flex: 1, minHeight: 0, overflowY: 'auto', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '18px' } },
        h(
          'div',
          { style: { ...panelStyle, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' } },
          h(
            'div',
            null,
            h('h2', { style: { margin: 0, fontSize: '18px', fontWeight: 800 } }, '📋 4-Agent 任务监控与子进程调度中心'),
            h('div', { style: { fontSize: '13px', color: T.textMuted, marginTop: '3px' } }, '支持任意时刻暂停、恢复、强停子进程及断点单步重试'),
          ),
          h(
            'div',
            { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } },
            h(SegmentedPills, {
              value: taskFilter,
              onChange: setTaskFilter,
              T,
              size: 'sm',
              options: [
                { id: 'all', label: `全部 (${taskRuns.length})` },
                { id: 'running', label: '进行中' },
                { id: 'completed', label: '已完成' },
                { id: 'failed', label: '异常' },
              ],
            }),
            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handleTaskControl('pause-all'), style: ghostBtnStyle }, '⏸ 全部暂停'),
            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handleTaskControl('stop-all'), style: { ...ghostBtnStyle, color: T.accentRed } }, '■ 紧急全部停止'),
            h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => handleStartOneClickPipeline(), style: goldBtnStyle }, '⚡ 新建一键任务'),
          ),
        ),

        h(
          'div',
          { className: 'dsh-vw-grid-tasks' },
          h(
            'div',
            { style: { ...panelStyle, padding: '14px', display: 'flex', flexDirection: 'column', gap: '9px' } },
            filteredTaskRuns.length === 0
              ? h('div', { style: { padding: '24px', textAlign: 'center', color: T.textMuted, fontSize: '13.5px' } }, '暂无符合条件的历史记录')
              : filteredTaskRuns.map((run) => {
                  const st = taskStatusBadge(run.status)
                  const sel = currentTaskRun?.id === run.id
                  return h(
                    'div',
                    {
                      key: run.id,
                      onClick: () => setSelectedRunId(run.id),
                      style: { padding: '12px 14px', borderRadius: '11px', cursor: 'pointer', background: sel ? T.accentBlueBg : T.bgElevated, border: `1px solid ${sel ? T.accentBlueBorder : T.borderSubtle}` },
                    },
                    h(
                      'div',
                      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } },
                      h('span', { style: { fontSize: '13.5px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, run.title || run.id),
                      h('span', { style: { fontSize: '12px', padding: '2px 8px', borderRadius: '999px', background: st.bg, color: st.color, fontWeight: 700, flexShrink: 0 } }, st.label),
                    ),
                    h('div', { style: { marginTop: '8px', height: '5px', borderRadius: '99px', background: 'rgba(148,163,184,0.2)', overflow: 'hidden' } }, h('div', { style: { width: `${Math.round(Number(run.progress || 0))}%`, height: '100%', background: st.color } })),
                    h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: T.textMuted, marginTop: '6px', fontFamily: 'Consolas, monospace' } }, h('span', null, `${Math.round(Number(run.progress || 0))}% · ${Math.round(Number(run.elapsedMs || 0) / 1000)}s`), h('span', null, run.createdAt ? new Date(run.createdAt).toLocaleTimeString('zh-CN', { hour12: false }) : '')),
                  )
                }),
          ),

          currentTaskRun
            ? h(
                'div',
                { style: { ...panelStyle, padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' } },
                h(
                  'div',
                  { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingBottom: '14px', borderBottom: `1px solid ${T.borderSubtle}` } },
                  h(
                    'div',
                    null,
                    h('div', { style: { fontSize: '17px', fontWeight: 800 } }, currentTaskRun.title || currentTaskRun.id),
                    h('div', { style: { fontSize: '12.5px', color: T.textMuted, marginTop: '3px', fontFamily: 'Consolas, monospace' } }, `进度 ${Math.round(Number(currentTaskRun.progress || 0))}% · 耗时 ${Math.round(Number(currentTaskRun.elapsedMs || 0) / 1000)}s`),
                  ),
                  h(
                    'div',
                    { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
                    currentTaskRun.status === 'paused' || currentTaskRun.status === 'queued' ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handleTaskControl('resume', currentTaskRun.id), style: blueBtnStyle }, '▶ 恢复执行') : null,
                    currentTaskRun.status === 'running' ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handleTaskControl('pause', currentTaskRun.id), style: ghostBtnStyle }, '⏸ 暂停') : null,
                    currentTaskRun.status === 'running' || currentTaskRun.status === 'paused' ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handleTaskControl('stop', currentTaskRun.id), style: { ...ghostBtnStyle, color: T.accentRed } }, '■ 停止') : null,
                    ['stopped', 'failed', 'completed'].includes(currentTaskRun.status) ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handleTaskControl('retry', currentTaskRun.id), style: goldBtnStyle }, '↻ 重新执行') : null,
                    currentTaskRun.status === 'completed' ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => goToStudioStep(4), style: ghostBtnStyle }, '查看成片 →') : null,
                  ),
                ),
                currentTaskRun.error
                  ? h('div', { style: { padding: '11px 14px', borderRadius: '10px', background: T.accentRedBg, color: T.accentRed, fontSize: '13.5px' } }, `⚠ ${translateBeginnerError(currentTaskRun.error).title}`)
                  : null,
                h(
                  'div',
                  { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                  h('div', { style: { fontSize: '14px', fontWeight: 800 } }, '分步子任务进度'),
                  (currentTaskRun.tasks || []).map((t) => {
                    const st = taskStatusBadge(t.status)
                    return h(
                      'div',
                      { key: t.id, style: { padding: '11px 14px', borderRadius: '11px', background: T.bgElevated, border: `1px solid ${t.status === 'running' ? T.accentBlueBorder : T.borderSubtle}`, display: 'grid', gridTemplateColumns: '1.2fr 140px minmax(0, 1.5fr) auto', gap: '12px', alignItems: 'center' } },
                      h('div', null, h('div', { style: { fontSize: '13.5px', fontWeight: 700 } }, t.name), h('div', { style: { fontSize: '12px', color: T.textMuted } }, t.stage)),
                      h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, h('div', { style: { flex: 1, height: '6px', borderRadius: '99px', background: 'rgba(148,163,184,0.2)', overflow: 'hidden' } }, h('div', { style: { width: `${Math.round(Number(t.progress || 0))}%`, height: '100%', background: st.color } })), h('span', { style: { fontSize: '12px', fontFamily: 'Consolas, monospace' } }, `${Math.round(Number(t.progress || 0))}%`)),
                      h('div', { style: { fontSize: '12.5px', color: T.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, t.error || t.message),
                      h('button', { type: 'button', className: 'dsh-vw-btn', disabled: currentTaskRun.status === 'running', onClick: () => handleTaskControl('retry', currentTaskRun.id, t.id), style: { ...ghostBtnStyle, padding: '5px 11px', fontSize: '12px' } }, '从此重试'),
                    )
                  }),
                ),
                h(
                  'div',
                  null,
                  h('div', { style: { fontSize: '14px', fontWeight: 800, marginBottom: '8px' } }, '实时执行日志流'),
                  h(
                    'div',
                    { className: 'dsh-vw-scroll', style: { maxHeight: '210px', overflowY: 'auto', padding: '12px 14px', borderRadius: '11px', background: '#050810', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'Consolas, monospace', fontSize: '12.5px', lineHeight: 1.65, color: '#CBD5E1' } },
                    (currentTaskRun.logs || []).slice(-50).map((lg, idx) =>
                      h('div', { key: idx, style: { color: lg.level === 'error' ? '#FB7185' : lg.level === 'warn' ? '#FBBF24' : '#CBD5E1' } }, `[${lg.ts ? new Date(lg.ts).toLocaleTimeString('zh-CN', { hour12: false }) : '--:--:--'}] [${lg.stage || 'sys'}] ${lg.message}`),
                    ),
                  ),
                ),
              )
            : h('div', { style: { ...panelStyle, padding: '44px', textAlign: 'center', color: T.textMuted, fontSize: '14.5px' } }, '点击「⚡ AI 作战大屏」下方的启动按钮后，全部任务详情会在此实时追踪。'),
        ),
      )

      // =======================================================================
      // 12. MODALS: 4-PROTOCOL LLM MODAL, 3-STEP VOICE CLONE LAB, SKIN, VENDOR
      // =======================================================================
      const modalBackdropStyle = {
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 15, 0.72)',
        backdropFilter: 'blur(8px)',
        zIndex: 3100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }

      const dshClient = llmConfig?.dshClient || { available: false, providers: [] }
      const dshActiveProv = dshClient.providers?.find((p) => p.id === (llmForm.dshProviderId === 'active' ? dshClient.defaultProviderId : llmForm.dshProviderId)) || null
      const activeTemplate = llmConfig?.templates?.find((t) => t.id === llmForm.provider)

      const llmModal = showLlmModal
        ? h(
            'div',
            { style: modalBackdropStyle, onClick: () => setShowLlmModal(false) },
            h(
              'div',
              { className: 'dsh-vw-scroll', onClick: (ev) => ev.stopPropagation(), style: { ...panelStyle, width: '720px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' } },
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                h('h3', { style: { margin: 0, fontSize: '18px', fontWeight: 800 } }, '🧠 AI 大模型接入中心 (支持 4 种原生接口协议)'),
                h('button', { type: 'button', onClick: () => setShowLlmModal(false), style: { background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' } }, h(Icon, { name: 'x', size: 18 })),
              ),
              h(SegmentedPills, {
                value: llmForm.mode,
                onChange: (m) => setLlmForm((p) => ({ ...p, mode: m })),
                T,
                fullWidth: true,
                options: [
                  { id: 'follow-dsh', label: '🔗 自动同步 DSH 客户端配置' },
                  { id: 'custom', label: '🔑 插件独立自定义接入' },
                ],
              }),
              // 4-Protocol Visual Glass Cards
              h(
                'div',
                null,
                h('div', { style: { fontSize: '13px', fontWeight: 700, color: T.textMuted, marginBottom: '8px' } }, '选择接口传输协议 (点击卡片立即切换)'),
                h(
                  'div',
                  { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' } },
                  WIRE_PROTOCOL_CARDS.map((card) => {
                    const on = llmForm.format === card.id
                    return h(
                      'button',
                      {
                        key: card.id,
                        type: 'button',
                        className: 'dsh-vw-btn',
                        onClick: () => setLlmForm((p) => ({ ...p, format: card.id })),
                        style: {
                          padding: '11px 13px',
                          borderRadius: '11px',
                          textAlign: 'left',
                          background: on ? `${card.color}1C` : T.bgElevated,
                          border: `1.5px solid ${on ? card.color : T.borderSubtle}`,
                          color: T.textPrimary,
                        },
                      },
                      h(
                        'div',
                        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' } },
                        h('span', { style: { fontSize: '13.5px', fontWeight: 800, color: on ? card.color : T.textPrimary } }, card.title),
                        h('span', { style: { fontSize: '12px', color: T.textMuted, fontFamily: 'Consolas, monospace' } }, card.path),
                      ),
                      h('div', { style: { fontSize: '12px', color: T.textMuted, marginTop: '4px' } }, card.desc),
                    )
                  }),
                ),
              ),
              llmForm.mode === 'follow-dsh'
                ? h(
                    'div',
                    { style: { padding: '14px', borderRadius: '12px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '10px' } },
                    dshClient.available
                      ? h(
                          React.Fragment,
                          null,
                          h('div', { style: { fontSize: '13px', fontWeight: 700 } }, `已读取本机 DSH 客户端配置 (默认: ${dshClient.defaultProviderId || '未设置'})`),
                          h(
                            'div',
                            { style: { display: 'flex', flexWrap: 'wrap', gap: '7px' } },
                            (dshClient.providers || []).map((prov) => {
                              const on = (llmForm.dshProviderId === 'active' ? dshClient.defaultProviderId : llmForm.dshProviderId) === prov.id
                              return h('button', { key: prov.id, type: 'button', className: 'dsh-vw-btn', onClick: () => handleSelectDshProvider(prov.id), style: { ...ghostBtnStyle, borderColor: on ? T.accentBlueBorder : T.borderSubtle, color: on ? T.accentBlue : T.textSecondary, background: on ? T.accentBlueBg : T.bgPanel } }, `${prov.displayName || prov.id}`)
                            }),
                          ),
                          h('input', { value: llmForm.model, onChange: (ev) => setLlmForm((p) => ({ ...p, model: ev.target.value })), placeholder: dshClient.defaultModelId || '留空即自动沿用 DSH 当前模型', style: inputStyle }),
                        )
                      : h('div', { style: { fontSize: '13.5px', color: T.textSecondary } }, '未检测到本机 DSH 客户端配置文件，请点击上方「🔑 插件独立自定义接入」直接填入 API 地址与密钥。'),
                  )
                : h(
                    'div',
                    { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                    h(
                      'div',
                      { style: { display: 'flex', flexWrap: 'wrap', gap: '7px' } },
                      (llmConfig?.templates || []).map((tpl) => {
                        const on = llmForm.provider === tpl.id
                        return h('button', { key: tpl.id, type: 'button', className: 'dsh-vw-btn', onClick: () => handleProviderTemplateChange(tpl.id), style: { ...ghostBtnStyle, borderColor: on ? T.accentBlueBorder : T.borderSubtle, color: on ? T.accentBlue : T.textSecondary, background: on ? T.accentBlueBg : T.bgElevated } }, tpl.id === 'custom' ? '自由填写中转/私有服务' : tpl.label.split(' ')[0])
                      }),
                    ),
                    h('input', { value: llmForm.baseUrl, onChange: (ev) => setLlmForm((p) => ({ ...p, baseUrl: ev.target.value })), placeholder: 'API 地址，例如 https://api.openai.com/v1 或中转网址', style: inputStyle }),
                    h(
                      'div',
                      { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
                      h('input', { type: 'password', value: llmForm.apiKey, onChange: (ev) => setLlmForm((p) => ({ ...p, apiKey: ev.target.value })), placeholder: llmConfig?.hasApiKey ? `已加密保存 (${llmConfig.maskedApiKey})` : '输入 API Key (sk-...)', style: inputStyle }),
                      h('input', { value: llmForm.model, onChange: (ev) => setLlmForm((p) => ({ ...p, model: ev.target.value })), placeholder: '模型 ID (可自由手输任意模型)', style: inputStyle }),
                    ),
                    (llmTestResult?.availableModels?.length || activeTemplate?.suggestedModels?.length)
                      ? h(
                          'div',
                          { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
                          (llmTestResult?.availableModels?.length ? llmTestResult.availableModels.slice(0, 14) : activeTemplate?.suggestedModels || []).map((m) =>
                            h('button', { key: m, type: 'button', className: 'dsh-vw-btn', onClick: () => setLlmForm((p) => ({ ...p, model: m })), style: { ...ghostBtnStyle, padding: '4px 10px', fontSize: '12px', fontFamily: 'Consolas, monospace' } }, m),
                          ),
                        )
                      : null,
                  ),
              h(
                'div',
                { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' } },
                h('span', { style: { fontSize: '13.5px', color: T.textSecondary } }, 'AI 编译出错时自动修复最大轮次'),
                h('div', { style: { width: '130px' } }, h(CinemaSelect, { compact: true, value: llmForm.maxRepairRounds, onChange: (v) => setLlmForm((p) => ({ ...p, maxRepairRounds: Number(v) })), T, options: [1, 2, 3, 4, 5].map((n) => ({ value: n, label: `最多 ${n} 轮` })) })),
              ),
              llmTestResult
                ? h(
                    'div',
                    { style: { padding: '11px 14px', borderRadius: '10px', fontSize: '13.5px', background: llmTestResult.ok ? T.accentGreenBg : T.accentRedBg, color: llmTestResult.ok ? T.accentGreen : T.accentRed } },
                    llmTestResult.ok ? `✓ 测试联通 (${llmTestResult.latencyMs}ms · ${llmTestResult.protocol} · ${llmTestResult.model})` : `✕ ${llmTestResult.error}`,
                  )
                : null,
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'flex-end', gap: '10px' } },
                h('button', { type: 'button', className: 'dsh-vw-btn', disabled: llmTesting, onClick: handleTestLlm, style: ghostBtnStyle }, llmTesting ? '正在探测接口...' : '测试连接并拉取模型'),
                h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleSaveLlmConfig, style: goldBtnStyle }, '保存并生效'),
              ),
            ),
          )
        : null

      const ttsConfigModal = showTtsModal
        ? h(
            'div',
            { style: modalBackdropStyle, onClick: () => setShowTtsModal(false) },
            h(
              'div',
              { className: 'dsh-vw-scroll', onClick: (ev) => ev.stopPropagation(), style: { ...panelStyle, width: '780px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' } },
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexShrink: 0 } },
                h(
                  'div',
                  null,
                  h('h3', { style: { margin: 0, fontSize: '18px', fontWeight: 800 } }, '🎙 多引擎配音中心 (IndexTTS-2.5 / 2 · GPT-SoVITS · 自定义模型)'),
                  h('div', { style: { fontSize: '12.5px', color: T.textMuted, marginTop: '3px' } }, '低显存电脑可选 GPT-SoVITS 或导入纯 CPU / 云端配音模型，自由切换不绑定单一模型'),
                ),
                h('button', { type: 'button', onClick: () => setShowTtsModal(false), style: { background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer', flexShrink: 0 } }, h(Icon, { name: 'x', size: 18 })),
              ),
              ttsBackendOutdated
                ? h(
                    'div',
                    { style: { padding: '10px 13px', borderRadius: '10px', background: T.accentAmberBg, border: `1px solid ${T.accentAmberBorder}`, color: T.accentAmber, fontSize: '12.5px', lineHeight: 1.5, flexShrink: 0 } },
                    '⚠ 检测到 DeepSeek Harness 后端仍停留在重启前旧进程，当前显示本地默认引擎列表；如需保存切换、测试发声或导入新模型，请完全退出并重启客户端后再试。',
                  )
                : null,
              h(
                'div',
                { style: { flexShrink: 0 } },
                h(SegmentedPills, {
                  value: ttsModalTab,
                  onChange: setTtsModalTab,
                  T,
                  fullWidth: true,
                  options: [
                    { id: 'engines', label: '🎛 选择与配置引擎' },
                    { id: 'add', label: '➕ 添加自定义配音模型' },
                    { id: 'import', label: '📤 JSON 导入导出' },
                  ],
                }),
              ),
              ttsModalTab === 'engines'
                ? h(
                    'div',
                    { style: { display: 'flex', flexDirection: 'column', gap: '14px', flexShrink: 0 } },
                    h(
                      'div',
                      { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flexShrink: 0 } },
                      (ttsConfig?.engines?.length ? ttsConfig.engines : DEFAULT_TTS_ENGINES_FALLBACK).map((eng) => {
                        const isAct = (ttsConfig?.activeEngineId || 'indextts25') === eng.id
                        return h(
                          'div',
                          {
                            key: eng.id,
                            onClick: () => handleSelectTtsEngine(eng.id),
                            style: {
                              padding: '13px',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              background: isAct ? T.accentBlueBg : T.bgElevated,
                              border: `1.5px solid ${isAct ? T.accentBlueBorder : T.borderSubtle}`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            },
                          },
                          h(
                            'div',
                            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' } },
                            h('span', { style: { fontSize: '14px', fontWeight: 800, color: isAct ? T.accentBlue : T.textPrimary } }, isAct ? `✓ ${eng.name}` : eng.name),
                            !eng.builtin
                              ? h(
                                  'button',
                                  {
                                    type: 'button',
                                    className: 'dsh-vw-btn',
                                    onClick: (ev) => {
                                      ev.stopPropagation()
                                      handleRemoveCustomTts(eng.id)
                                    },
                                    style: { padding: '2px 7px', borderRadius: '6px', border: 'none', background: T.accentRedBg, color: T.accentRed, fontSize: '11.5px', fontWeight: 700 },
                                  },
                                  '删除',
                                )
                              : null,
                          ),
                          h(
                            'div',
                            { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                            eng.vramBadge ? h('span', { style: { padding: '1px 7px', borderRadius: '999px', background: T.accentGoldBg, color: T.accentGold, fontSize: '11px', fontWeight: 700 } }, eng.vramBadge) : null,
                            h('span', { style: { fontSize: '11.5px', color: T.textMuted, fontFamily: 'Consolas, monospace' } }, eng.kind),
                          ),
                          eng.description ? h('div', { style: { fontSize: '12px', color: T.textSecondary, lineHeight: 1.45 } }, eng.description) : null,
                          eng.endpoint || eng.command ? h('div', { style: { fontSize: '11.5px', color: T.textMuted, fontFamily: 'Consolas, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, eng.endpoint || `${eng.command} ${eng.argsTemplate || ''}`) : null,
                        )
                      }),
                    ),
                    // Built-in GPT-SoVITS & IndexTTS Connection Configs
                    h(
                      'div',
                      { style: { padding: '14px', borderRadius: '12px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '10px' } },
                      h('div', { style: { fontSize: '13.5px', fontWeight: 800, color: T.accentGold } }, '⚡ GPT-SoVITS (低显存推荐) 与 IndexTTS 本地参数'),
                      h(
                        'div',
                        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' } },
                        h('div', null, h('div', { style: { fontSize: '12px', color: T.textMuted, marginBottom: '4px' } }, 'GPT-SoVITS API 地址 (api_v2.py)'), h('input', { value: builtinTtsForm.gptvoiceEndpoint, onChange: (ev) => setBuiltinTtsForm((p) => ({ ...p, gptvoiceEndpoint: ev.target.value })), placeholder: 'http://127.0.0.1:9881', style: inputStyle })),
                        h('div', null, h('div', { style: { fontSize: '12px', color: T.textMuted, marginBottom: '4px' } }, 'IndexTTS-2.5 / 2 HTTP 地址'), h('input', { value: builtinTtsForm.indextts25Endpoint, onChange: (ev) => setBuiltinTtsForm((p) => ({ ...p, indextts25Endpoint: ev.target.value })), placeholder: 'http://127.0.0.1:9880', style: inputStyle })),
                      ),
                      h(
                        'div',
                        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' } },
                        h('div', null, h('div', { style: { fontSize: '12px', color: T.textMuted, marginBottom: '4px' } }, '可选：GPT-SoVITS 根目录 (自动拉起)'), h('input', { value: builtinTtsForm.gptvoiceRootDir, onChange: (ev) => setBuiltinTtsForm((p) => ({ ...p, gptvoiceRootDir: ev.target.value })), placeholder: '留空则直连上方已启动的 HTTP 地址', style: inputStyle })),
                        h('div', null, h('div', { style: { fontSize: '12px', color: T.textMuted, marginBottom: '4px' } }, '可选：GPT-SoVITS Python 路径'), h('input', { value: builtinTtsForm.gptvoicePythonBin, onChange: (ev) => setBuiltinTtsForm((p) => ({ ...p, gptvoicePythonBin: ev.target.value })), placeholder: '例如 D:/GPT-SoVITS/runtime/python.exe', style: inputStyle })),
                      ),
                      h(
                        'div',
                        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' } },
                        h('div', null, h('div', { style: { fontSize: '12px', color: T.textMuted, marginBottom: '4px' } }, '可选：IndexTTS 根目录'), h('input', { value: builtinTtsForm.indexttsRootDir, onChange: (ev) => setBuiltinTtsForm((p) => ({ ...p, indexttsRootDir: ev.target.value })), placeholder: 'INDEXTTS_ROOT 覆盖路径', style: inputStyle })),
                        h('div', null, h('div', { style: { fontSize: '12px', color: T.textMuted, marginBottom: '4px' } }, '可选：IndexTTS Python 路径'), h('input', { value: builtinTtsForm.indexttsPythonBin, onChange: (ev) => setBuiltinTtsForm((p) => ({ ...p, indexttsPythonBin: ev.target.value })), placeholder: 'INDEXTTS_PYTHON 覆盖路径', style: inputStyle })),
                      ),
                      h(
                        'div',
                        { style: { display: 'flex', justifyContent: 'flex-end', gap: '9px' } },
                        h('button', { type: 'button', className: 'dsh-vw-btn', disabled: ttsTesting, onClick: () => handleTestTtsEngine(ttsConfig?.activeEngineId), style: { ...ghostBtnStyle, borderColor: T.accentBlueBorder, color: T.accentBlue } }, ttsTesting ? '正在合成测试音频...' : `🔊 试听测试 (${activeTtsLabel})`),
                        h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleSaveBuiltinTts, style: goldBtnStyle }, '保存本地接口设置'),
                      ),
                    ),
                  )
                : ttsModalTab === 'add'
                  ? h(
                      'div',
                      { style: { display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 } },
                      h('div', { style: { fontSize: '13px', fontWeight: 700, color: T.textSecondary } }, '⚡ 一键填充常用轻量化 / 第三方配音模型模板：'),
                      h(
                        'div',
                        { style: { display: 'flex', flexWrap: 'wrap', gap: '7px' } },
                        (ttsConfig?.templates?.length ? ttsConfig.templates : DEFAULT_TTS_TEMPLATES_FALLBACK).map((tpl) =>
                          h(
                            'button',
                            {
                              key: tpl.templateId,
                              type: 'button',
                              className: 'dsh-vw-btn',
                              onClick: () => applyTtsQuickTemplate(tpl),
                              style: { ...ghostBtnStyle, padding: '6px 11px', fontSize: '12.5px', borderColor: T.accentBlueBorder, color: T.accentBlue },
                            },
                            tpl.label,
                          ),
                        ),
                      ),
                      h(
                        'div',
                        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '9px' } },
                        h('input', { value: customTtsForm.name, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, name: ev.target.value })), placeholder: '模型名称 (如 Edge-TTS 纯CPU)', style: inputStyle }),
                        h('input', { value: customTtsForm.vramBadge, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, vramBadge: ev.target.value })), placeholder: '配置标识 (如 0GB纯CPU)', style: inputStyle }),
                        h(CinemaSelect, {
                          compact: true,
                          value: customTtsForm.kind,
                          onChange: (k) => setCustomTtsForm((p) => ({ ...p, kind: k })),
                          T,
                          options: [
                            { value: 'openai-tts', label: 'OpenAI /v1/audio/speech 协议' },
                            { value: 'http-json', label: '通用 HTTP JSON / GET API' },
                            { value: 'cli-command', label: '本地命令行 / Python (免HTTP)' },
                          ],
                        }),
                      ),
                      customTtsForm.kind === 'cli-command'
                        ? h(
                            'div',
                            { style: { display: 'flex', flexDirection: 'column', gap: '9px', padding: '12px', borderRadius: '11px', background: T.bgElevated } },
                            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 120px', gap: '9px' } }, h('input', { value: customTtsForm.command, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, command: ev.target.value })), placeholder: '可执行命令 (如 edge-tts 或 D:/py/python.exe)', style: inputStyle }), h('input', { value: customTtsForm.outputExt, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, outputExt: ev.target.value })), placeholder: '.wav / .mp3', style: inputStyle })),
                            h('input', { value: customTtsForm.argsTemplate, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, argsTemplate: ev.target.value })), placeholder: '参数模板，如 --text {{text}} --voice {{voice}} --write-media {{output}}', style: { ...inputStyle, fontFamily: 'Consolas, monospace' } }),
                            h('input', { value: customTtsForm.voice, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, voice: ev.target.value })), placeholder: '默认 {{voice}} 变量值 (如 zh-CN-YunxiNeural)', style: inputStyle }),
                          )
                        : customTtsForm.kind === 'openai-tts'
                          ? h(
                              'div',
                              { style: { display: 'flex', flexDirection: 'column', gap: '9px', padding: '12px', borderRadius: '11px', background: T.bgElevated } },
                              h('input', { value: customTtsForm.endpoint, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, endpoint: ev.target.value })), placeholder: '接口地址 (如 http://127.0.0.1:8080/v1/audio/speech)', style: inputStyle }),
                              h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '9px' } }, h('input', { value: customTtsForm.model, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, model: ev.target.value })), placeholder: 'model (如 kokoro / fish-speech-1.5)', style: inputStyle }), h('input', { value: customTtsForm.voice, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, voice: ev.target.value })), placeholder: 'voice (如 alloy / zf_xiaoxiao)', style: inputStyle }), h('input', { type: 'password', value: customTtsForm.apiKey, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, apiKey: ev.target.value })), placeholder: '可选 Bearer API Key', style: inputStyle })),
                            )
                          : h(
                              'div',
                              { style: { display: 'flex', flexDirection: 'column', gap: '9px', padding: '12px', borderRadius: '11px', background: T.bgElevated } },
                              h('div', { style: { display: 'grid', gridTemplateColumns: '100px 1fr 150px', gap: '9px' } }, h(CinemaSelect, { compact: true, value: customTtsForm.method, onChange: (v) => setCustomTtsForm((p) => ({ ...p, method: v })), T, options: [{ value: 'POST', label: 'POST' }, { value: 'GET', label: 'GET' }] }), h('input', { value: customTtsForm.endpoint, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, endpoint: ev.target.value })), placeholder: 'http://127.0.0.1:9882/tts', style: inputStyle }), h(CinemaSelect, { compact: true, value: customTtsForm.responseType, onChange: (v) => setCustomTtsForm((p) => ({ ...p, responseType: v })), T, options: [{ value: 'binary', label: '直接返回音频流' }, { value: 'json_base64', label: 'JSON base64' }, { value: 'json_url', label: 'JSON 音频URL' }] })),
                              h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' } }, h('input', { value: customTtsForm.responseAudioPath, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, responseAudioPath: ev.target.value })), placeholder: 'JSON 返回音频字段名 (如 data.audio)', style: inputStyle }), h('input', { type: 'password', value: customTtsForm.apiKey, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, apiKey: ev.target.value })), placeholder: '可选 Bearer API Key', style: inputStyle })),
                              h('textarea', { value: customTtsForm.payloadTemplateText, onChange: (ev) => setCustomTtsForm((p) => ({ ...p, payloadTemplateText: ev.target.value })), rows: 4, style: { ...inputStyle, fontFamily: 'Consolas, monospace', fontSize: '12.5px' }, placeholder: 'JSON 请求体模板，可用变量：{{text}} {{lang}} {{voiceName}} {{refAudio}} {{promptText}} {{speed}}' }),
                            ),
                      h(
                        'div',
                        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
                        h('span', { style: { fontSize: '12px', color: T.textMuted } }, '支持占位符：{{text}} {{output}} {{voice}} {{voiceName}} {{lang}} {{speed}} {{refAudio}} {{promptText}}'),
                        h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleSaveCustomTts, style: goldBtnStyle }, '💾 保存并启用该模型'),
                      ),
                    )
                  : h(
                      'div',
                      { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                      h('div', { style: { fontSize: '13px', color: T.textSecondary } }, '可将网上或朋友分享的配音模型配置 JSON 直接粘贴导入；也可复制下方当前配置分享：'),
                      h('textarea', { value: ttsImportJsonText, onChange: (ev) => setTtsImportJsonText(ev.target.value), rows: 6, style: { ...inputStyle, fontFamily: 'Consolas, monospace', fontSize: '12.5px' }, placeholder: '{\n  "id": "my-tts",\n  "name": "我的轻量语音模型",\n  "kind": "openai-tts",\n  "endpoint": "http://127.0.0.1:8080/v1/audio/speech",\n  "model": "kokoro",\n  "voice": "zf_xiaoxiao"\n}' }),
                      h(
                        'div',
                        { style: { display: 'flex', justifyContent: 'space-between', gap: '10px' } },
                        h(
                          'button',
                          {
                            type: 'button',
                            className: 'dsh-vw-btn',
                            onClick: () => {
                              const { apiKeyMasked, hasApiKey, ...safeCopy } = activeTtsEngineObj || {}
                              setTtsImportJsonText(JSON.stringify(safeCopy, null, 2))
                              notify('已将当前引擎结构导出到输入框（已自动脱敏剔除密钥）', 'info')
                            },
                            style: ghostBtnStyle,
                          },
                          '📥 导出当前模型到文本框',
                        ),
                        h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleImportTtsJson, style: goldBtnStyle }, '📤 一键导入并启用'),
                      ),
                    ),
              ttsTestResult
                ? h(
                    'div',
                    { style: { padding: '11px 14px', borderRadius: '10px', background: ttsTestResult.ok ? T.accentGreenBg : T.accentRedBg, color: ttsTestResult.ok ? T.accentGreen : T.accentRed, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' } },
                    h('div', null, ttsTestResult.ok ? `✓ 试听合成成功 (${ttsTestResult.provider || ttsTestResult.engine} · ${ttsTestResult.durationSec || ''}s)` : `✕ 测试失败: ${ttsTestResult.error}`),
                    ttsTestResult.audioDataUrl ? h('audio', { src: dataUrlSafe(ttsTestResult.audioDataUrl), controls: true, style: { width: '100%', height: '34px' } }) : null,
                  )
                : null,
            ),
          )
        : null

      const cloneStep = cloneAuditionVoiceId ? 3 : recordedB64 ? 2 : 1
      const voiceModal = showVoiceModal
        ? h(
            'div',
            { style: modalBackdropStyle, onClick: () => setShowVoiceModal(false) },
            h(
              'div',
              { onClick: (ev) => ev.stopPropagation(), style: { ...panelStyle, width: '740px', maxWidth: '100%', maxHeight: '88vh', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' } },
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' } },
                h('h3', { style: { margin: 0, fontSize: '18px', fontWeight: 800 } }, `🎙 ${activeTtsLabel} 音色挑选与 3 步克隆工坊`),
                h(
                  'div',
                  { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                  h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => { setShowVoiceModal(false); setShowTtsModal(true) }, style: { ...ghostBtnStyle, padding: '5px 10px', fontSize: '12px' } }, '⚙ 切换配音引擎'),
                  h('button', { type: 'button', onClick: () => setShowVoiceModal(false), style: { background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' } }, h(Icon, { name: 'x', size: 18 })),
                ),
              ),
              h(SegmentedPills, {
                value: voiceModalTab,
                onChange: setVoiceModalTab,
                T,
                fullWidth: true,
                options: [
                  { id: 'library', label: '📚 挑选本地内置音色库' },
                  { id: 'clone', label: '🧬 3 步录制/上传克隆我的声音' },
                ],
              }),
              voiceModalTab === 'clone'
                ? h(
                    'div',
                    { className: 'dsh-vw-scroll', style: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' } },
                    // Guided 3-step banner
                    h(
                      'div',
                      { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' } },
                      [
                        { n: 1, title: '① 采集 5-12 秒干净人声' },
                        { n: 2, title: '② 降噪标准化入专属库' },
                        { n: 3, title: '③ 即时试听并一键选用' },
                      ].map((st) => {
                        const on = cloneStep >= st.n
                        return h('div', { key: st.n, style: { padding: '9px 11px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, background: on ? T.accentBlueBg : T.bgElevated, border: `1px solid ${on ? T.accentBlueBorder : T.borderSubtle}`, color: on ? T.accentBlue : T.textMuted, textAlign: 'center' } }, st.title)
                      }),
                    ),
                    h(SegmentedPills, {
                      value: cloneSubMode,
                      onChange: setCloneSubMode,
                      T,
                      size: 'sm',
                      options: [
                        { id: 'mic', label: '🎤 麦克风当场录音' },
                        { id: 'file', label: '📁 选录音文件上传' },
                        { id: 'path', label: '🔗 填本地音频路径' },
                      ],
                    }),
                    cloneSubMode === 'mic'
                      ? h(
                          'div',
                          { style: { padding: '14px', borderRadius: '11px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '10px' } },
                          h(
                            'div',
                            { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' } },
                            !micRecording
                              ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleStartMicRecord, style: blueBtnStyle }, '● 开始录音 (说 5–12 秒普通话)')
                              : h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleStopMicRecord, style: { ...goldBtnStyle, background: '#E11D48', color: '#fff' } }, `■ 停止录音 (${micSeconds}s)`),
                            h('span', { style: { fontSize: '13px', color: recordedB64 ? T.accentGreen : T.textMuted } }, recordedB64 ? `✓ 已录好 (${recordedFileName})` : '找个安静环境自然读一段话效果最好'),
                          ),
                          micRecording
                            ? h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, h('span', { style: { fontSize: '12px', color: T.textMuted } }, '收音音量'), h('div', { style: { flex: 1, height: '7px', borderRadius: '99px', background: 'rgba(148,163,184,0.2)', overflow: 'hidden' } }, h('div', { style: { width: `${micVuLevel}%`, height: '100%', background: T.accentGreen } })))
                            : null,
                        )
                      : cloneSubMode === 'file'
                        ? h(
                            'div',
                            { style: { padding: '14px', borderRadius: '11px', background: T.bgElevated, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' } },
                            h('span', { style: { fontSize: '13.5px', color: recordedB64 ? T.accentGreen : T.textSecondary } }, recordedB64 ? `✓ 已载入：${recordedFileName}` : '支持 .wav / .mp3 / .flac / .m4a (建议 5–15 秒干声)'),
                            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => cloneFileInputRef.current?.click(), style: blueBtnStyle }, '选择音频文件'),
                          )
                        : h('input', { value: voiceImportPath, onChange: (ev) => setVoiceImportPath(ev.target.value), placeholder: '填写本机参考音频或索引绝对路径 (.wav/.mp3/.pt)', style: inputStyle }),

                    // Step 2: Name + Gender + Submit
                    h(
                      'div',
                      { style: { display: 'grid', gridTemplateColumns: '1.3fr auto 1.4fr', gap: '9px', alignItems: 'center' } },
                      h('input', { value: cloneVoiceName, onChange: (ev) => setCloneVoiceName(ev.target.value), placeholder: '② 给声线起名 (如 我的解说音)', style: inputStyle }),
                      h(SegmentedPills, { value: cloneVoiceGender, onChange: setCloneVoiceGender, T, size: 'sm', options: [{ id: 'female', label: '女声' }, { id: 'male', label: '男声' }] }),
                      h('input', { value: cloneVoicePrompt, onChange: (ev) => setCloneVoicePrompt(ev.target.value), placeholder: '参考台词文本 (选填)', style: inputStyle }),
                    ),
                    h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleSubmitVoiceClone, style: { ...goldBtnStyle, width: '100%' } }, '🧬 ② 一键降噪标准化并入库'),

                    // Step 3: Audition
                    h(
                      'div',
                      { style: { padding: '14px', borderRadius: '11px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '9px' } },
                      h('div', { style: { fontSize: '14px', fontWeight: 800 } }, '③ 即时试听克隆效果并选用'),
                      h(
                        'div',
                        { style: { display: 'grid', gridTemplateColumns: '0.9fr 1.6fr', gap: '9px' } },
                        h(CinemaSelect, {
                          value: cloneAuditionVoiceId || voiceCatalog.find((v) => v.isCloned || v.id?.startsWith('clone-'))?.id || '',
                          onChange: setCloneAuditionVoiceId,
                          T,
                          placeholder: '选择已克隆声线',
                          options: (voiceCatalog.filter((v) => v.isCloned || v.id?.startsWith('clone-')).length ? voiceCatalog.filter((v) => v.isCloned || v.id?.startsWith('clone-')) : voiceCatalog.slice(0, 15)).map((v) => ({ value: v.id, label: v.name })),
                        }),
                        h('input', { value: cloneAuditionText, onChange: (ev) => setCloneAuditionText(ev.target.value), placeholder: '输入一句试听台词...', style: inputStyle }),
                      ),
                      h(
                        'div',
                        { style: { display: 'flex', gap: '9px' } },
                        h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleAuditionClonedVoice, style: { ...blueBtnStyle, flex: 1 } }, `▶ 用 ${activeTtsLabel} 合成试听`),
                        h(
                          'button',
                          {
                            type: 'button',
                            className: 'dsh-vw-btn',
                            onClick: () => {
                              const picked = cloneAuditionVoiceId || voiceCatalog.find((v) => v.isCloned || v.id?.startsWith('clone-'))?.id
                              if (picked) handleAssignVoice(voiceCatalog.find((v) => v.id === picked) || { id: picked, name: picked })
                            },
                            style: ghostBtnStyle,
                          },
                          '✓ 设为当前全局音色',
                        ),
                      ),
                      cloneAuditionUrl ? h('audio', { src: cloneAuditionUrl, controls: true, style: { width: '100%', height: '36px' } }) : null,
                    ),
                  )
                : h(
                    'div',
                    { style: { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '12px' } },
                    h(
                      'div',
                      { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } },
                      h('input', { value: voiceSearch, onChange: (ev) => setVoiceSearch(ev.target.value), placeholder: '搜索音色名称或风格标签...', style: { ...inputStyle, flex: 1 } }),
                      h(SegmentedPills, { value: voiceGenderFilter, onChange: setVoiceGenderFilter, T, size: 'sm', accent: 'gold', options: [{ id: 'all', label: '全部' }, { id: 'female', label: '女声' }, { id: 'male', label: '男声' }] }),
                      h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handleAssignVoice({ id: 'auto', name: 'AI 自动匹配' }), style: blueBtnStyle }, '设为 AI 自动配'),
                    ),
                    h(
                      'div',
                      { className: 'dsh-vw-scroll', style: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '7px' } },
                      filteredVoices.slice(0, 60).map((v) => {
                        const playingThis = playingVoiceId === v.id
                        return h(
                          'div',
                          { key: v.id, style: { padding: '10px 14px', borderRadius: '10px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' } },
                          h('div', { style: { minWidth: 0 } }, h('div', { style: { fontSize: '14px', fontWeight: 700 } }, v.name || v.id), h('div', { style: { fontSize: '12.5px', color: T.textMuted } }, `${v.gender || ''} · ${(v.tags || []).slice(0, 4).join(' / ')}`)),
                          h(
                            'div',
                            { style: { display: 'flex', gap: '7px', flexShrink: 0 } },
                            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handlePreviewVoice(v), style: { ...ghostBtnStyle, padding: '6px 12px' } }, h(Icon, { name: playingThis ? 'pause' : 'play', size: 13 }), playingThis ? '停止' : '试听'),
                            h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => handleAssignVoice(v), style: { ...goldBtnStyle, padding: '6px 14px' } }, '选用'),
                          ),
                        )
                      }),
                    ),
                  ),
            ),
          )
        : null

      const skinModal = showSkinModal
        ? h(
            'div',
            { style: modalBackdropStyle, onClick: () => setShowSkinModal(false) },
            h(
              'div',
              { onClick: (ev) => ev.stopPropagation(), style: { ...panelStyle, width: '600px', maxWidth: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' } },
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                h('h3', { style: { margin: 0, fontSize: '18px', fontWeight: 800 } }, '🎨 作战大屏动态皮肤与玻璃磨砂'),
                h('button', { type: 'button', onClick: () => setShowSkinModal(false), style: { background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' } }, h(Icon, { name: 'x', size: 18 })),
              ),
              h(
                'div',
                { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '11px' } },
                SKIN_PRESETS.map((sk) => {
                  const on = skinConfig.id === sk.id
                  return h(
                    'div',
                    { key: sk.id, onClick: () => setSkinConfig((p) => ({ ...p, id: sk.id })), style: { borderRadius: '11px', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${on ? T.accentBlue : T.borderSubtle}`, background: T.bgElevated } },
                    h('div', { style: { height: '68px', background: resolvedDark ? sk.darkBg : sk.lightBg } }),
                    h('div', { style: { padding: '8px 11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 700 } }, h('span', null, sk.name), h('span', { style: { color: on ? T.accentBlue : T.textMuted } }, on ? '✓ 当前' : sk.badge)),
                  )
                }),
              ),
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '10px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}` } },
                h('span', { style: { fontSize: '13.5px', fontWeight: 700 } }, skinConfig.customUrl ? '已使用自定义壁纸背景' : '导入一张自己的高清图片作为大屏壁纸'),
                h(
                  'div',
                  { style: { display: 'flex', gap: '8px' } },
                  h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: () => skinFileInputRef.current?.click(), style: blueBtnStyle }, h(Icon, { name: 'upload', size: 14 }), '上传壁纸'),
                  skinConfig.customUrl ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setSkinConfig((p) => ({ ...p, id: 'obsidian-nebula', customUrl: '' })), style: ghostBtnStyle }, '恢复预设') : null,
                ),
              ),
              h(
                'div',
                { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px', fontWeight: 600 } },
                h('label', null, `磨砂模糊: ${skinConfig.blurPx}px`, h('input', { type: 'range', min: 0, max: 32, step: 1, value: skinConfig.blurPx, onChange: (ev) => setSkinConfig((p) => ({ ...p, blurPx: Number(ev.target.value) })), style: { width: '100%', marginTop: '6px' } })),
                h('label', null, `显色强度: ${Math.round(skinConfig.opacity * 100)}%`, h('input', { type: 'range', min: 0.25, max: 1, step: 0.05, value: skinConfig.opacity, onChange: (ev) => setSkinConfig((p) => ({ ...p, opacity: Number(ev.target.value) })), style: { width: '100%', marginTop: '6px' } })),
              ),
              h('div', { style: { display: 'flex', justifyContent: 'flex-end' } }, h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowSkinModal(false), style: goldBtnStyle }, '完成')),
            ),
          )
        : null

      const vendorModal = showVendorModal
        ? h(
            'div',
            { style: modalBackdropStyle, onClick: () => setShowVendorModal(false) },
            h(
              'div',
              { onClick: (ev) => ev.stopPropagation(), style: { ...panelStyle, width: '540px', maxWidth: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '13px' } },
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                h('h3', { style: { margin: 0, fontSize: '17px', fontWeight: 800 } }, '✨ 外部 .motion / HTML 动效隔离导入'),
                h('button', { type: 'button', onClick: () => setShowVendorModal(false), style: { background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' } }, h(Icon, { name: 'x', size: 17 })),
              ),
              h('p', { style: { margin: 0, fontSize: '13px', color: T.textSecondary, lineHeight: 1.55 } }, '在沙箱无头 Chromium 中把第三方动画工程安全渲染为无声纯画面 MP4，不会污染主项目规范。'),
              h('input', { value: vendorSourceDir, onChange: (ev) => setVendorSourceDir(ev.target.value), placeholder: '外部模板目录绝对路径 (含 index.html)', style: inputStyle }),
              h(
                'div',
                { style: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '9px' } },
                h('input', { value: vendorName, onChange: (ev) => setVendorName(ev.target.value), placeholder: '片段代号 (如 logo-reveal)', style: inputStyle }),
                h('input', { type: 'number', min: 1, max: 30, value: vendorDurationSec, onChange: (ev) => setVendorDurationSec(ev.target.value), placeholder: '时长 (秒)', style: inputStyle }),
              ),
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'flex-end', gap: '8px' } },
                h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowVendorModal(false), style: ghostBtnStyle }, '取消'),
                h('button', { type: 'button', className: 'dsh-vw-btn', disabled: Boolean(busyLabel), onClick: handleImportVendorMotion, style: goldBtnStyle }, '🎬 渲染导入'),
              ),
            ),
          )
        : null

      const hardwareModal = showHardwareModal
        ? h(
            'div',
            { style: modalBackdropStyle, onClick: () => setShowHardwareModal(false) },
            h(
              'div',
              { onClick: (ev) => ev.stopPropagation(), style: { ...panelStyle, width: '780px', maxWidth: '96vw', maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' } },
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' } },
                h(
                  'div',
                  null,
                  h('h3', { style: { margin: 0, fontSize: '18px', fontWeight: 900 } }, '💻 本机配置体检 · 硬件要求与低配电脑保护机制'),
                  h('div', { style: { fontSize: '12.5px', color: T.textMuted, marginTop: '3px' } }, '8GB 内存与核显电脑也可安全出片！如果客户端误报配置过低，可在此实测本机硬件并一键开启保护模式。'),
                ),
                h('button', { type: 'button', onClick: () => setShowHardwareModal(false), style: { background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' } }, h(Icon, { name: 'x', size: 18 })),
              ),
              hardwareProfile
                ? h(
                    'div',
                    { style: { padding: '14px 16px', borderRadius: '12px', background: hardwareProfile.canRun ? (hardwarePolicy?.lowSpecSafe ? T.accentGoldBg : T.accentGreenBg) : T.accentRedBg, border: `1px solid ${hardwareProfile.canRun ? (hardwarePolicy?.lowSpecSafe ? T.accentGoldBorder : 'rgba(52,211,153,0.4)') : T.accentRed}` } },
                    h('div', { style: { fontSize: '15px', fontWeight: 800, color: hardwareProfile.canRun ? (hardwarePolicy?.lowSpecSafe ? T.accentGold : T.accentGreen) : T.accentRed } }, hardwareProfile.verdictTitle),
                    h('div', { style: { fontSize: '13px', color: T.textSecondary, marginTop: '5px', lineHeight: 1.55 } }, hardwareProfile.verdictSummary),
                    h(
                      'div',
                      { style: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px', marginTop: '12px' } },
                      [
                        { k: 'CPU 处理器', v: `${hardwareProfile.cpu?.threads || '?'} 线程`, sub: hardwareProfile.cpu?.model || '' },
                        { k: '系统内存', v: `${hardwareProfile.memory?.freeGB || '?'} / ${hardwareProfile.memory?.totalGB || '?'} GB`, sub: hardwareProfile.checks?.ramOk ? '✓ 满足运行标准' : '⚠ 内存偏紧' },
                        { k: '显卡与显存', v: hardwareProfile.gpu?.vramGB ? `${hardwareProfile.gpu.vramGB} GB VRAM` : '核显 / 通用', sub: hardwareProfile.gpu?.primaryName || '' },
                        { k: '磁盘可用空间', v: hardwareProfile.disk?.freeGB != null ? `${hardwareProfile.disk.freeGB} GB` : '充足', sub: hardwareProfile.checks?.diskOk ? '✓ 空间充足' : '⚠ 建议清理空间' },
                      ].map((item) =>
                        h(
                          'div',
                          { key: item.k, style: { padding: '9px 10px', borderRadius: '10px', background: T.bgPanelSolid, border: `1px solid ${T.borderSubtle}` } },
                          h('div', { style: { fontSize: '11px', color: T.textMuted, fontWeight: 700 } }, item.k),
                          h('div', { style: { fontSize: '14px', fontWeight: 900, marginTop: '2px', color: T.textPrimary } }, item.v),
                          h('div', { style: { fontSize: '11px', color: T.textMuted, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.sub),
                        ),
                      ),
                    ),
                  )
                : null,
              h(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                h('div', { style: { fontSize: '13.5px', fontWeight: 800 } }, '🛡 选择低配电脑保护策略'),
                h(
                  'div',
                  { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '9px' } },
                  [
                    { id: 'auto', title: '🛡 智能自适应（推荐）', desc: '空闲内存 < 3.6GB 或 8GB/核显机器自动降并发/轻缓存护航，高配机器满血运行' },
                    { id: 'safe', title: '🪫 强制低配保护', desc: '单并发渲染 · 128MB 轻缓存 · 3D 粒子减载 · FFmpeg 限核防卡死 · 最高 1080p30' },
                    { id: 'performance', title: '🚀 全速性能模式', desc: '解除保护限流，允许 2K/4K 60fps 与多并发极速出片（推荐 16GB+ 内存）' },
                  ].map((m) => {
                    const active = (hardwarePreferences?.lowSpecMode || 'auto') === m.id
                    return h(
                      'button',
                      {
                        key: m.id,
                        type: 'button',
                        className: 'dsh-vw-btn',
                        disabled: hardwareRefreshing,
                        onClick: () => handleUpdateHardwareMode(m.id, true),
                        style: {
                          ...ghostBtnStyle,
                          whiteSpace: 'normal',
                          width: '100%',
                          minWidth: 0,
                          height: '100%',
                          boxSizing: 'border-box',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          padding: '11px 12px',
                          background: active ? T.accentBlueBg : T.bgElevated,
                          borderColor: active ? T.accentBlueBorder : T.borderSubtle,
                          color: active ? T.accentBlue : T.textPrimary,
                        },
                      },
                      h('div', { style: { fontSize: '13px', fontWeight: 800 } }, m.title),
                      h('div', { style: { fontSize: '11.5px', color: T.textMuted, lineHeight: 1.45, fontWeight: 500, marginTop: '4px', wordBreak: 'break-word' } }, m.desc),
                    )
                  }),
                ),
                hardwarePolicy
                  ? h('div', { style: { fontSize: '12px', color: T.accentBlue, padding: '8px 11px', borderRadius: '9px', background: T.accentBlueBg, border: `1px solid ${T.accentBlueBorder}` } }, `当前生效调度：${hardwarePolicy.reason} · Remotion ${hardwarePolicy.remotionConcurrency} 并发 · 缓存 ${Math.round((hardwarePolicy.offthreadVideoCacheSizeInBytes || 0) / 1048576)}MB · FFmpeg ${hardwarePolicy.ffmpegPreset}`)
                  : null,
              ),
              hardwareProfile?.ttsAdvice
                ? h(
                    'div',
                    { style: { padding: '10px 13px', borderRadius: '10px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
                    h('span', { style: { fontSize: '12.5px', color: T.textSecondary, flex: 1 } }, `🎙 配音引擎建议：${hardwareProfile.ttsAdvice}`),
                    h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => { setShowHardwareModal(false); setShowTtsModal(true) }, style: { ...ghostBtnStyle, padding: '5px 11px', fontSize: '12px', color: T.accentBlue, borderColor: T.accentBlueBorder } }, '打开配音引擎中心 →'),
                  )
                : null,
              h(
                'div',
                { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' } },
                [hardwareProfile?.requirements?.minimum, hardwareProfile?.requirements?.recommended, hardwareProfile?.requirements?.flagship].filter(Boolean).map((req) =>
                  h(
                    'div',
                    { key: req.id, style: { padding: '11px 12px', borderRadius: '11px', background: T.bgElevated, border: `1px solid ${T.borderSubtle}`, fontSize: '12px', lineHeight: 1.55 } },
                    h('div', { style: { fontWeight: 800, color: T.accentGold, marginBottom: '5px' } }, req.tierLabel),
                    h('div', null, `• CPU：${req.cpu}`),
                    h('div', null, `• 内存：${req.ram}`),
                    h('div', null, `• 显卡：${req.gpu}`),
                    h('div', null, `• 磁盘：${req.disk}`),
                    h('div', { style: { color: T.textMuted, marginTop: '3px' } }, `推荐导出：${req.recommendedRender}`),
                  ),
                ),
              ),
            ),
          )
        : null

      const newProjectModal = showNewModal
        ? h(
            'div',
            { style: modalBackdropStyle, onClick: () => setShowNewModal(false) },
            h(
              'div',
              { onClick: (ev) => ev.stopPropagation(), style: { ...panelStyle, width: '440px', maxWidth: '100%', padding: '24px' } },
              h('h3', { style: { margin: '0 0 14px', fontSize: '17px', fontWeight: 800 } }, '新建视频工程'),
              h('input', { autoFocus: true, value: newProjectTitle, onChange: (ev) => setNewProjectTitle(ev.target.value), onKeyDown: (ev) => ev.key === 'Enter' && handleCreateProject(), placeholder: '例如：夏日新品概念发布片', style: { ...inputStyle, marginBottom: '16px' } }),
              h(
                'div',
                { style: { display: 'flex', justifyContent: 'flex-end', gap: '9px' } },
                h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => setShowNewModal(false), style: ghostBtnStyle }, '取消'),
                h('button', { type: 'button', className: 'dsh-vw-btn', onClick: handleCreateProject, style: goldBtnStyle }, '创建工程'),
              ),
            ),
          )
        : null

      const activeCodeFile = codeFiles.find((f) => f.path === selectedCodePath) || codeFiles[0] || null
      const codeDrawer = showCodeDrawer
        ? h(
            'div',
            { style: modalBackdropStyle, onClick: () => setShowCodeDrawer(false) },
            h(
              'div',
              { onClick: (ev) => ev.stopPropagation(), style: { ...panelStyle, width: '900px', maxWidth: '96vw', height: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
              h(
                'div',
                { style: { padding: '16px 20px', borderBottom: `1px solid ${T.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                h('strong', { style: { fontSize: '16px' } }, '工程生成源码检视'),
                h('button', { type: 'button', onClick: () => setShowCodeDrawer(false), style: { background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' } }, h(Icon, { name: 'x', size: 18 })),
              ),
              h(
                'div',
                { style: { display: 'flex', gap: '7px', padding: '10px 16px', overflowX: 'auto', borderBottom: `1px solid ${T.borderSubtle}`, background: T.bgSidebar } },
                codeFiles.map((f) => h('button', { key: f.path, type: 'button', className: 'dsh-vw-btn', onClick: () => setSelectedCodePath(f.path), style: { ...ghostBtnStyle, fontFamily: 'Consolas, monospace', fontSize: '12.5px', borderColor: activeCodeFile?.path === f.path ? T.accentGoldBorder : T.borderSubtle, color: activeCodeFile?.path === f.path ? T.accentGold : T.textSecondary } }, f.path)),
              ),
              h('pre', { className: 'dsh-vw-scroll', style: { flex: 1, margin: 0, padding: '18px', overflow: 'auto', fontFamily: 'Consolas, monospace', fontSize: '13px', lineHeight: 1.6, color: T.textPrimary, background: T.bgInput } }, activeCodeFile ? activeCodeFile.content : '暂无源码文件'),
            ),
          )
        : null

      // =======================================================================
      // 13. ROOT WORKBENCH SHELL WITH SKIN WALLPAPER BLENDING & BEGINNER TOASTS
      // =======================================================================
      const activeSkinPreset = SKIN_PRESETS.find((s) => s.id === skinConfig.id) || SKIN_PRESETS[0]
      const skinBackdropStyle =
        skinConfig.id === 'custom-image' && skinConfig.customUrl
          ? {
              backgroundImage: `url("${skinConfig.customUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `blur(${Number(skinConfig.blurPx) || 0}px)`,
              opacity: Number(skinConfig.opacity) || 0.78,
            }
          : {
              background: resolvedDark ? activeSkinPreset.darkBg : activeSkinPreset.lightBg,
              opacity: 1,
            }

      const rootLayout = {
        ...(isMainSlot ? { width: '100%', height: '100%' } : { position: 'fixed', inset: 0, zIndex: 2000 }),
        display: 'flex',
        flexDirection: 'column',
        background: T.bgRoot,
        color: T.textPrimary,
        fontFamily: 'Microsoft YaHei, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '14px',
        overflow: 'hidden',
      }

      const parsedToastError = toast?.type === 'error' ? translateBeginnerError(toast.message) : null

      return h(
        'div',
        { className: 'dsh-vw-root', style: rootLayout },
        hiddenInputs,
        // Atmospheric Cinema Backdrop
        h('div', { 'aria-hidden': 'true', style: { position: 'absolute', inset: '-18px', zIndex: 0, pointerEvents: 'none', transition: 'opacity 0.35s ease', ...skinBackdropStyle } }),
        h(
          'div',
          { style: { position: 'relative', zIndex: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
          topBar,
          activeNav === 'warroom' ? warRoomView : activeNav === 'tasks' ? taskCenterView : studioWorkbenchView,
        ),
        // Busy Overlay Progress Pill
        busyLabel
          ? h(
              'div',
              { style: { position: 'fixed', bottom: '26px', left: '50%', transform: 'translateX(-50%)', zIndex: 3500, padding: '13px 22px', borderRadius: '999px', background: T.bgPanelSolid, border: `1.5px solid ${T.accentBlueBorder}`, boxShadow: T.shadowPopover, display: 'flex', alignItems: 'center', gap: '12px', minWidth: '300px', maxWidth: '88vw' } },
              h('span', { className: 'dsh-vw-rec-dot', style: { width: '10px', height: '10px', borderRadius: '50%', background: T.accentBlue, flexShrink: 0 } }),
              h('span', { style: { fontSize: '13.5px', fontWeight: 700, flex: 1 } }, busyLabel),
              busyProgress > 0 ? h('span', { style: { fontSize: '13px', fontFamily: 'Consolas, monospace', color: T.accentBlue, fontWeight: 800 } }, `${Math.round(busyProgress)}%`) : null,
            )
          : null,
        // Toast / Plain-Chinese Beginner Error Banner
        toast
          ? h(
              'div',
              {
                className: 'dsh-vw-popover-in',
                style: {
                  position: 'fixed',
                  bottom: '26px',
                  right: '26px',
                  zIndex: 3600,
                  maxWidth: '460px',
                  padding: '13px 18px',
                  borderRadius: '13px',
                  background: T.bgPanelSolid,
                  border: `1.5px solid ${toast.type === 'error' ? T.accentRed : toast.type === 'success' ? T.accentGreen : T.accentBlue}`,
                  boxShadow: T.shadowPopover,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                },
              },
              h(
                'div',
                { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' } },
                h('span', { style: { fontSize: '13.5px', fontWeight: 700, color: toast.type === 'error' ? T.accentRed : toast.type === 'success' ? T.accentGreen : T.textPrimary, lineHeight: 1.5 } }, parsedToastError ? parsedToastError.title : toast.message),
                h('button', { type: 'button', onClick: () => setToast(null), style: { background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer', flexShrink: 0 } }, h(Icon, { name: 'x', size: 15 })),
              ),
              parsedToastError?.action || parsedToastError?.detail
                ? h(
                    'div',
                    { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } },
                    parsedToastError.action === 'open-llm'
                      ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => { setToast(null); setShowLlmModal(true) }, style: { ...ghostBtnStyle, padding: '5px 11px', fontSize: '12.5px', color: T.accentGold, borderColor: T.accentGoldBorder } }, '去检查 AI 模型配置')
                      : null,
                    parsedToastError.action === 'load-starter'
                      ? h('button', { type: 'button', className: 'dsh-vw-btn', onClick: () => { setToast(null); handleLoadStarterPack() }, style: { ...ghostBtnStyle, padding: '5px 11px', fontSize: '12.5px', color: T.accentBlue, borderColor: T.accentBlueBorder } }, '一键加载演示素材包')
                      : null,
                    parsedToastError.detail
                      ? h('button', { type: 'button', onClick: () => setShowRawError((v) => !v), style: { background: 'transparent', border: 'none', color: T.textMuted, fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' } }, showRawError ? '收起技术细节' : '查看技术细节')
                      : null,
                  )
                : null,
              showRawError && parsedToastError?.detail
                ? h('pre', { style: { margin: 0, padding: '8px', borderRadius: '8px', background: T.bgInput, fontSize: '12px', whiteSpace: 'pre-wrap', color: T.textMuted, maxHeight: '110px', overflowY: 'auto' } }, parsedToastError.detail)
                : null,
            )
          : null,
        projectDrawer,
        hardwareModal,
        newProjectModal,
        llmModal,
        ttsConfigModal,
        voiceModal,
        skinModal,
        vendorModal,
        codeDrawer,
      )
    }

    // DSH Tool Call Inline Progress / Preview Card
    function VideoToolCallCard(props) {
      const name = props?.toolName || props?.name || props?.toolCall?.name || '视频工坊工具'
      const status = props?.status || props?.toolCall?.status || 'completed'
      const rawOut = props?.output || props?.result || props?.toolCall?.output
      let summary = ''
      try {
        const parsed = typeof rawOut === 'string' ? JSON.parse(rawOut) : rawOut
        if (parsed && typeof parsed === 'object') {
          summary = parsed.message || parsed.mp4Path || parsed.relPath || parsed.projectDir || ''
        }
      } catch {
        if (typeof rawOut === 'string') summary = rawOut.slice(0, 140)
      }
      return h(
        'div',
        {
          style: {
            padding: '12px 15px',
            borderRadius: '12px',
            background: 'rgba(13, 18, 30, 0.85)',
            border: '1px solid rgba(34, 211, 238, 0.35)',
            color: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontFamily: '"Noto Sans SC", system-ui, sans-serif',
          },
        },
        h(
          'div',
          { style: { minWidth: 0 } },
          h('div', { style: { fontSize: '13.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '7px' } }, h(Icon, { name: 'film', size: 15, color: '#22D3EE' }), name),
          summary ? h('div', { style: { fontSize: '12.5px', color: '#94A3B8', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, summary) : null,
        ),
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 } },
          h('span', { style: { fontSize: '12px', color: status === 'error' ? '#FB7185' : '#34D399', fontWeight: 700 } }, status === 'running' ? '执行中' : status === 'error' ? '异常' : '完成'),
          h(
            'button',
            {
              type: 'button',
              onClick: () => window.dispatchEvent(new CustomEvent('dsh-video:switch-mode', { detail: { mode: 'video' } })),
              style: { padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(245,185,66,0.45)', background: 'rgba(245,185,66,0.14)', color: '#F5B942', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' },
            },
            '进工坊查看',
          ),
        ),
      )
    }

    function MainVideoWorkbenchPanel() {
      return h(PanelBoundary, null, h(VideoWorkbenchApp, { isMainSlot: true, layoutService: hostLayoutSvc }))
    }

    function ToolViewCard(props) {
      return h(PanelBoundary, null, h(VideoToolCallCard, props))
    }

    return {
      name: 'dsh-video-workbench',
      inject: ['slots'],
      apply(ctx) {
        try {
          if (typeof ctx?.get === 'function') {
            const initialLayout = ctx.get('layout')
            if (initialLayout) attachHostLayout(initialLayout)
          }
        } catch {}
        if (typeof ctx?.inject === 'function') {
          try {
            ctx.inject(['layout'], (scoped) => attachHostLayout(scoped?.layout))
          } catch {}
        }
        if (typeof ctx?.slots?.inject === 'function') {
          ctx.slots.inject('main', () =>
            ctx.slots.register(
              { name: 'main', key: 'video-workbench', label: 'AI 视频工坊' },
              MainVideoWorkbenchPanel,
            ),
          )
          ctx.slots.inject('sidebar.panellist', () =>
            ctx.slots.register(
              { name: 'sidebar.panellist', id: 'video-workbench', label: 'AI 视频工坊', order: 65 },
              SidebarVideoIcon,
            ),
          )
          const videoToolKeys = [
            'produce_video',
            'plan_video_from_assets',
            'ai_create_video',
            'ai_refine_scene',
            'run_agent_pipeline',
            'video_render',
            'generate_avatar',
            'generate_speech',
          ]
          for (const toolKey of videoToolKeys) {
            ctx.slots.inject('tool.call.toolview', () =>
              ctx.slots.register(
                { name: 'tool.call.toolview', key: toolKey },
                (props) => h(ToolViewCard, { toolName: toolKey, ...(props || {}) }),
              ),
            )
          }
        } else {
          ctx.slots.register('sidebar.panellist', {
            id: 'video-workbench',
            label: 'AI 视频工坊',
            order: 65,
            render: () => h(SidebarVideoIcon),
          })
          ctx.slots.register('main', {
            key: 'video-workbench',
            render: () => h(MainVideoWorkbenchPanel),
          })
          ctx.slots.register('tool.call.toolview', {
            id: 'video-workbench-toolview',
            order: 25,
            render: (props) => h(ToolViewCard, props),
          })
        }
      },
    }
  },
})
