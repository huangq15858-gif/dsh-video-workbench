import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { deriveVerbalSubtitleParts, normalizeVideoStyle, resolveSafeZoneSpec, sanitizeSpokenNarration, VIDEO_STYLES } from '../shared/index.js'

export const PROMO_PLAN_VERSION = 'promo-plan/1'

export const PROMO_SHOT_RECIPES = {
  hold: {
    id: 'hold',
    label: '稳态定焦',
    layout: 'media-split-motion',
    kenBurns: 'hold',
    fromScale: 1.0,
    toScale: 1.02,
    transition: 'cut',
  },
  push_in: {
    id: 'push_in',
    label: '缓推聚焦 (≤1.25x)',
    layout: 'media-split-motion',
    kenBurns: 'zoom-in',
    fromScale: 1.0,
    toScale: 1.22,
    transition: 'iris-circle',
  },
  pull_out: {
    id: 'pull_out',
    label: '后拉全览',
    layout: '3d-stage-opener',
    kenBurns: 'zoom-out',
    fromScale: 1.24,
    toScale: 1.0,
    transition: 'light-wipe',
  },
  pan_down: {
    id: 'pan_down',
    label: '纵向俯仰摇镜',
    layout: 'media-split-motion',
    kenBurns: 'pan-down',
    fromScale: 1.12,
    toScale: 1.15,
    transition: 'slash-wipe',
  },
  pan_across: {
    id: 'pan_across',
    label: '横向平移扫镜',
    layout: 'compare-dual',
    kenBurns: 'pan-right',
    fromScale: 1.1,
    toScale: 1.12,
    transition: 'block-wipe',
  },
  face_focus: {
    id: 'face_focus',
    label: '主体特写焦点',
    layout: 'media-split-motion',
    kenBurns: 'zoom-in',
    fromScale: 1.08,
    toScale: 1.25,
    transition: 'iris-circle',
  },
  impact: {
    id: 'impact',
    label: '高能冲击卡点',
    layout: 'kinetic-impact',
    kenBurns: 'zoom-in',
    fromScale: 1.15,
    toScale: 1.0,
    transition: 'flash-cut',
  },
  freeze_end: {
    id: 'freeze_end',
    label: '终幕定格落版',
    layout: 'radial-climax',
    kenBurns: 'zoom-out',
    fromScale: 1.16,
    toScale: 1.0,
    transition: 'cut',
  },
  arch_flow: {
    id: 'arch_flow',
    label: '动态 SVG 架构拓扑',
    layout: 'svg-architecture-flow',
    kenBurns: 'zoom-in',
    fromScale: 1.0,
    toScale: 1.12,
    transition: 'iris-circle',
  },
  hud_telemetry: {
    id: 'hud_telemetry',
    label: 'HUD 遥测数据与代码流',
    layout: 'hud-telemetry-dashboard',
    kenBurns: 'zoom-in',
    fromScale: 1.0,
    toScale: 1.14,
    transition: 'slash-wipe',
  },
  spring_stage: {
    id: 'spring_stage',
    label: 'Vibecoding 节拍弹簧舞台',
    layout: 'vibecoding-spring-stage',
    kenBurns: 'zoom-in',
    fromScale: 1.02,
    toScale: 1.16,
    transition: 'zoom-punch',
  },
}

const VALID_SHOT_KINDS = Object.keys(PROMO_SHOT_RECIPES)
const VALID_SHOWCASE_LAYOUTS = new Set([
  'card-fan-opener',
  'app-focus-shot',
  'workflow-steps',
  'split-wipe-compare',
  'metric-dashboard',
  'multi-window-trio',
  '3d-stage-opener',
  'media-split-motion',
  'mosaic-pulse-wall',
  'compare-dual',
  'kinetic-impact',
  'radial-climax',
  'narrative-diorama',
  'svg-architecture-flow',
  'hud-telemetry-dashboard',
  'vibecoding-spring-stage',
])

const VALID_STAGE_ARCHETYPES = [
  'hero-numeral',
  'hero-stand',
  'oath-break',
  'cavalry-rush',
  'slash-climax',
  'duel-confront',
  'farewell-tent',
  'strategic-map',
  'scroll-calligraphy',
  'plaque-summary',
  'channel-end',
]

export const VALID_THREE_PRESETS = [
  'orbital-core',
  'cyber-terrain',
  'particle-vortex',
  'floating-monoliths',
  'chrono-helix',
  'matrix-cubes',
]

export const VALID_TRANSITIONS = [
  'cut',
  'flash-cut',
  'slash-wipe',
  'iris-circle',
  'block-wipe',
  'glitch-cut',
  'zoom-punch',
  'light-wipe',
]

const TRANSITION_ALIASES = {
  'wipe-right': 'light-wipe',
  'wipe-left': 'slash-wipe',
  wipe: 'slash-wipe',
  slide: 'light-wipe',
  fade: 'flash-cut',
  dissolve: 'flash-cut',
  pull_out: 'zoom-punch',
  push_in: 'zoom-punch',
  pan_across: 'slash-wipe',
  pan_down: 'light-wipe',
  face_focus: 'iris-circle',
  impact: 'flash-cut',
  hold: 'cut',
  freeze_end: 'cut',
}

export function normalizeTransitionKind(raw, idx = 0, isBeatNarrative = false) {
  if (idx === 0) return 'cut'
  const key = String(raw || '').trim().toLowerCase()
  if (VALID_TRANSITIONS.includes(key)) return key
  if (TRANSITION_ALIASES[key]) return TRANSITION_ALIASES[key]
  const pool = isBeatNarrative
    ? ['flash-cut', 'slash-wipe', 'zoom-punch', 'glitch-cut', 'iris-circle', 'light-wipe']
    : ['iris-circle', 'light-wipe', 'block-wipe', 'slash-wipe', 'zoom-punch']
  return pool[idx % pool.length]
}

function isRelativeAssetPath(p) {
  if (!p) return true
  const s = String(p).trim()
  if (!s) return true
  if (/^[A-Za-z]:[\\/]/.test(s) || /^https?:\/\//i.test(s) || s.startsWith('/')) return false
  return true
}

/**
 * Strictly validate a `promo-plan/1` JSON structure against hard safety invariants:
 * - max 8 non-cut transitions (up to 64 in rhythmic MV mode)
 * - min 1.5s per shot (0.26s half-beat flash cut in beat-synced narrative MV)
 * - zoom bounded within [0.95, 1.25]
 * - strictly relative asset references
 */
export const VALID_PACING_MODES = ['auto', 'calm', 'balanced', 'dynamic']

export const PACING_PROFILES = {
  calm: {
    id: 'calm',
    label: '舒缓叙事（故事/品牌/教学）',
    minDurSec: 3.8,
    maxDurSec: 7.5,
    shotsPerMin: 10,
    minShots: 6,
    maxShots: 14,
    allowHalfBeatBlitz: false,
    ruleHint: '每镜保持 4.2~7.5 秒从容留白与自然呼吸，让观众充分理解故事情绪与画面细节，切忌急促闪切。',
  },
  balanced: {
    id: 'balanced',
    label: '稳健解说（产品功能/教程/评测）',
    minDurSec: 2.8,
    maxDurSec: 5.5,
    shotsPerMin: 15,
    minShots: 10,
    maxShots: 18,
    allowHalfBeatBlitz: false,
    ruleHint: '以产品功能清晰传达为先：开场与高潮结尾可轻快收束（2.2~3.0s），功能讲解与界面实拍保持 3.2~5.5s 舒适节奏，字数适中易读、不赶语速。',
  },
  dynamic: {
    id: 'dynamic',
    label: '高燃快节奏（历史史诗/卡点 MV/快闪预告）',
    minDurSec: 0.26,
    maxDurSec: 3.6,
    shotsPerMin: 24,
    minShots: 18,
    maxShots: 36,
    allowHalfBeatBlitz: true,
    ruleHint: '高密度快节奏拆镜：常规叙事设 1.3~3.0s（2~4 拍），高潮冲击/鼓点突降(drops)/转折闪切可设 0.5 拍(0.33s) 或 1 拍(0.67s)，紧密踩准音乐节拍。',
  },
}

/**
 * Resolve concrete pacing profile from explicit `pacingMode` or intelligent topic/style classification.
 */
export function resolvePacingProfile({ topic = '', style = 'tech', narrationMode = '', hasAssets = false, pacingMode = 'auto' } = {}) {
  const req = String(pacingMode || 'auto').trim().toLowerCase()
  if (req === 'calm' || req === 'balanced' || req === 'dynamic') {
    return PACING_PROFILES[req]
  }
  const text = `${topic || ''} ${style || ''}`.trim()
  if (narrationMode === 'subtitle-mv' || /历史|霸王|史诗|演义|战役|征战|卡点|快闪|混剪|高燃|电音|\bMV\b/i.test(text)) {
    return PACING_PROFILES.dynamic
  }
  if (style === 'documentary' || style === 'warm' || /故事|品牌|温情|人物|访谈|文化|纪实|心路|成长|随笔|传记/i.test(text)) {
    return PACING_PROFILES.calm
  }
  if (hasAssets || /功能|教程|操作|演示|步骤|介绍|说明书|评测|指南|客户端|软件|工作台|开源/i.test(text)) {
    return PACING_PROFILES.balanced
  }
  return PACING_PROFILES.balanced
}

export function validatePromoPlan(plan) {
  const errors = []
  if (!plan || typeof plan !== 'object') {
    return { ok: false, errors: ['plan 对象无效'] }
  }
  const shots = Array.isArray(plan.shots) ? plan.shots : []
  if (shots.length === 0) {
    errors.push('shots 数组不能为空')
  }

  const isBeatNarrative =
    plan.mode === 'narrative-mv' ||
    Boolean(plan.beatSync) ||
    plan.narrationMode === 'tts-beat-sync' ||
    plan.narrationMode === 'subtitle-mv'
  const minDur = isBeatNarrative ? 0.26 : 1.5
  const maxTransitions = isBeatNarrative ? 64 : 8

  let nonCutTransitions = 0
  for (let i = 0; i < shots.length; i++) {
    const s = shots[i] || {}
    const dur = Number(s.durationSec)
    if (!Number.isFinite(dur) || dur < minDur) {
      errors.push(`shot[${i}] durationSec=${s.durationSec} 低于最小安全驻留时长 ${minDur}s`)
    }
    const maxScale = Math.max(Number(s.fromScale || 1), Number(s.toScale || 1))
    const minScale = Math.min(Number(s.fromScale || 1), Number(s.toScale || 1))
    if (maxScale > 1.25 || minScale < 0.95) {
      errors.push(`shot[${i}] 缩放倍率 [${minScale}, ${maxScale}] 超出安全范围 [0.95, 1.25]`)
    }
    if (s.recipe && !VALID_SHOT_KINDS.includes(s.recipe)) {
      errors.push(`shot[${i}] 未知镜头原语 recipe=${s.recipe}`)
    }
    const tr = String(s.transition || 'cut')
    if (i > 0 && tr !== 'cut') nonCutTransitions++
    for (const ref of Array.isArray(s.assetRefs) ? s.assetRefs : []) {
      if (!isRelativeAssetPath(ref)) {
        errors.push(`shot[${i}] 包含非相对素材路径 "${ref}"`)
      }
    }
  }
  if (nonCutTransitions > maxTransitions) {
    errors.push(`转场次数 (${nonCutTransitions}) 超过最大上限 ${maxTransitions} 次`)
  }

  return { ok: errors.length === 0, errors }
}

/**
 * Deterministic rule sanitizer clamping bounds and enriching missing fields into clean `promo-plan/1`.
 */
export function repairPromoPlanRules(
  rawPlan = {},
  { topic = '', style = 'tech', assetsManifest = null, existingScript = null, bgmMeta = null, narrationMode = '', pacingMode = '' } = {},
) {
  const existingScenes = Array.isArray(existingScript?.scenes) ? existingScript.scenes : []
  const mediaItems = (assetsManifest?.items || []).filter((it) => it.role !== 'music' && it.role !== 'sfx' && it.role !== 'note' && it.type !== 'audio')
  const explicitPacing = String(pacingMode || rawPlan?.pacingMode || existingScript?.pacingMode || '').trim().toLowerCase()
  const resolvedPacing = resolvePacingProfile({
    topic: topic || rawPlan?.title || existingScript?.title || '',
    style: style || rawPlan?.style || 'tech',
    narrationMode: narrationMode || existingScript?.narrationMode || '',
    hasAssets: mediaItems.length > 0,
    pacingMode: explicitPacing || (rawPlan?.mode === 'narrative-mv' ? 'dynamic' : 'auto'),
  })
  const isBeatMode =
    rawPlan?.mode === 'narrative-mv' ||
    Boolean(rawPlan?.beatSync || existingScript?.beatSync) ||
    Boolean(bgmMeta?.analyzed) ||
    narrationMode === 'subtitle-mv' ||
    narrationMode === 'tts-beat-sync' ||
    existingScript?.narrationMode === 'subtitle-mv' ||
    existingScript?.narrationMode === 'tts-beat-sync'
  const explicitSlowPacing = (explicitPacing === 'calm' || explicitPacing === 'balanced') && !isBeatMode
  const isNarrativeMv = (!explicitSlowPacing && mediaItems.length === 0 && resolvedPacing.id === 'dynamic') || isBeatMode || resolvedPacing.id === 'dynamic'
  const minDurClamp = isNarrativeMv ? 0.26 : resolvedPacing.id === 'calm' ? 2.4 : 1.5
  const defaultShotDur = resolvedPacing.id === 'calm' ? 5.2 : resolvedPacing.id === 'balanced' ? 3.8 : 2.6
  const maxTransitionsLimit = isNarrativeMv ? 64 : 8
  const candidateShots =
    Array.isArray(rawPlan?.shots) && rawPlan.shots.length > 0
      ? rawPlan.shots
      : Array.isArray(rawPlan?.scenes) && rawPlan.scenes.length > 0
        ? rawPlan.scenes
        : Array.isArray(rawPlan?.storyboard) && rawPlan.storyboard.length > 0
          ? rawPlan.storyboard
          : null

  const rawShots = candidateShots
    ? candidateShots
    : existingScenes.length > 0
      ? existingScenes.map((sc, i) => ({
          id: sc.id,
          title: sc.title,
          narration: sc.narration,
          durationSec: sc.durationSec,
          threePreset: sc.threePreset || sc?.stageSpec?.threePreset,
          stageSpec: sc.stageSpec,
          beatCount: sc.beatCount,
          accentWords: sc.accentWords,
          recipe: i === 0 ? 'pull_out' : i === existingScenes.length - 1 ? 'freeze_end' : VALID_SHOT_KINDS[(i % 5) + 1],
        }))
      : [
          { title: topic || '开场核心亮点', narration: `${topic || '项目核心价值'}，从构想到成片全面加速。`, recipe: 'pull_out', threePreset: 'orbital-core', durationSec: defaultShotDur + 0.4 },
          { title: '动态 SVG 架构拓扑', narration: '结合 Three.js 三维空间舞台与动态 SVG 架构图，让系统拓扑与数据流向一目了然。', recipe: 'arch_flow', threePreset: 'cyber-terrain', durationSec: defaultShotDur + 0.2 },
          { title: 'HUD 遥测数据与代码流', narration: '全息 HUD 遥测面板实时呈现核心性能指标与 TSX 代码执行流。', recipe: 'hud_telemetry', threePreset: 'particle-vortex', durationSec: defaultShotDur },
          { title: '节拍同步弹簧物理引擎', narration: '每一帧基于 spring 与 interpolate 物理阻尼刚度计算，紧贴音乐强弱鼓点。', recipe: 'spring_stage', threePreset: 'floating-monoliths', durationSec: defaultShotDur + 0.2 },
          { title: '全链路多智能体协同', narration: '四大智能体分工协作，一键完成从脚本、剪辑到混音与渲染。', recipe: 'impact', threePreset: 'chrono-helix', durationSec: defaultShotDur },
          { title: '立即高效交付', narration: '声画同步成片导出，直接面向全平台上线发布。', recipe: 'freeze_end', threePreset: 'matrix-cubes', durationSec: defaultShotDur },
        ]

  const cleanStyle = normalizeVideoStyle(rawPlan?.style || style || 'tech')
  const isHistoricalTopic = /历史|霸王|项羽|秦|汉|楚|三国|唐|宋|明|古风|武侠|战役|将军|帝王|演义/i.test(
    `${topic || ''} ${rawPlan?.title || ''} ${existingScript?.title || ''} ${existingScript?.goal || ''}`,
  )
  const vibecodingZeroAssetLayouts = [
    '3d-stage-opener',
    'svg-architecture-flow',
    'hud-telemetry-dashboard',
    'vibecoding-spring-stage',
    'metric-dashboard',
    'workflow-steps',
    'kinetic-impact',
    'radial-climax',
  ]

  let transitionCount = 0
  const repairedShots = rawShots.map((s, idx) => {
    const recipeKey = VALID_SHOT_KINDS.includes(s?.recipe)
      ? s.recipe
      : idx === 0
        ? 'pull_out'
        : idx === rawShots.length - 1
          ? 'freeze_end'
          : VALID_SHOT_KINDS[(idx % 6) + 1]
    const spec = PROMO_SHOT_RECIPES[recipeKey]

    const durRaw = Number(s?.durationSec || existingScenes[idx]?.durationSec || defaultShotDur)
    const durationSec = Math.max(minDurClamp, Math.min(30, Number.isFinite(durRaw) ? durRaw : defaultShotDur))
    const fromScale = Math.max(0.95, Math.min(1.25, Number(s?.fromScale || spec.fromScale)))
    const toScale = Math.max(0.95, Math.min(1.25, Number(s?.toScale || spec.toScale)))

    let transition = normalizeTransitionKind(s?.transition || spec.transition || 'iris-circle', idx, isNarrativeMv)
    if (idx === 0) {
      transition = 'cut'
    } else if (transition !== 'cut') {
      if (transitionCount >= maxTransitionsLimit) transition = 'cut'
      else transitionCount++
    }

    const rawRefs = Array.isArray(s?.assetRefs)
      ? s.assetRefs.filter(isRelativeAssetPath)
      : existingScenes[idx]?.media?.length > 0
        ? existingScenes[idx].media.map((m) => m.path).filter(Boolean)
        : mediaItems.length > 0
          ? [mediaItems[idx % mediaItems.length].path]
          : []

    const rawLayout = String(s?.layout || '').trim()
    const chosenLayout =
      VALID_SHOWCASE_LAYOUTS.has(rawLayout) && (rawLayout !== 'narrative-diorama' || isHistoricalTopic)
        ? rawLayout
        : mediaItems.length === 0
          ? isHistoricalTopic
            ? 'narrative-diorama'
            : idx === 0
              ? '3d-stage-opener'
              : idx === rawShots.length - 1
                ? 'radial-climax'
                : vibecodingZeroAssetLayouts[idx % vibecodingZeroAssetLayouts.length]
          : VALID_SHOWCASE_LAYOUTS.has(existingScenes[idx]?.layout)
            ? existingScenes[idx].layout
            : spec.layout

    const rawSubChunks = Array.isArray(s?.subChunks) && s.subChunks.length > 0
      ? s.subChunks.map((c) => sanitizeSpokenNarration(c)).filter(Boolean)
      : []
    const nextNarration = sanitizeSpokenNarration(s?.narration || existingScenes[idx]?.narration || s?.title || '') || sanitizeSpokenNarration(s?.title || '') || `第 ${idx + 1} 幕`
    const oldNarration = sanitizeSpokenNarration(existingScenes[idx]?.narration || '')
    const narrChanged = Boolean(nextNarration && oldNarration && nextNarration !== oldNarration)
    const cleanSubChunks =
      rawSubChunks.length > 0
        ? rawSubChunks
        : narrChanged || !existingScenes[idx]?.subChunks
          ? deriveVerbalSubtitleParts(nextNarration, null, '', 16)
          : existingScenes[idx]?.subChunks

    const reqThree = String(s?.threePreset || s?.stageSpec?.threePreset || existingScenes[idx]?.threePreset || '').trim()
    const chosenThreePreset = VALID_THREE_PRESETS.includes(reqThree)
      ? reqThree
      : VALID_THREE_PRESETS[idx % VALID_THREE_PRESETS.length]

    return {
      id: s?.id || existingScenes[idx]?.id || `scene-${String(idx + 1).padStart(2, '0')}`,
      title: (sanitizeSpokenNarration(s?.title || existingScenes[idx]?.title || `镜头 ${idx + 1}`) || `镜头 ${idx + 1}`).slice(0, 32),
      narration: nextNarration,
      subChunks: cleanSubChunks,
      accentWords: Array.isArray(s?.accentWords) && s.accentWords.length > 0 ? s.accentWords : existingScenes[idx]?.accentWords,
      threePreset: chosenThreePreset,
      stageSpec: s?.stageSpec ? { ...s.stageSpec, threePreset: s.stageSpec.threePreset || chosenThreePreset } : existingScenes[idx]?.stageSpec,
      beatCount: Number.isFinite(Number(s?.beatCount)) ? Number(s.beatCount) : existingScenes[idx]?.beatCount,
      visualBlueprint: String(s?.visualBlueprint || existingScenes[idx]?.visualBlueprint || '').trim() || undefined,
      motionNotes: String(s?.motionNotes || s?.visualBlueprint || existingScenes[idx]?.motionNotes || '').trim() || undefined,
      emotion: String(s?.emotion || existingScenes[idx]?.emotion || (idx === rawShots.length - 1 ? '激昂' : '平静')),
      recipe: recipeKey,
      layout: chosenLayout,
      kenBurns: spec.kenBurns,
      fromScale: Number(fromScale.toFixed(2)),
      toScale: Number(toScale.toFixed(2)),
      transition,
      highlights: Array.isArray(s?.highlights) && s.highlights.length > 0
        ? s.highlights.filter(Boolean).slice(0, 6)
        : existingScenes[idx]?.highlights || [],
      cams: Array.isArray(s?.cams) && s.cams.length > 0 ? s.cams : existingScenes[idx]?.cams,
      marks: Array.isArray(s?.marks) && s.marks.length > 0 ? s.marks : existingScenes[idx]?.marks,
      loupe: s?.loupe || existingScenes[idx]?.loupe,
      windowLayout: s?.windowLayout || existingScenes[idx]?.windowLayout,
      windowTheme: s?.windowTheme || existingScenes[idx]?.windowTheme,
      windowTitle: s?.windowTitle || existingScenes[idx]?.windowTitle,
      durationSec: Number(durationSec.toFixed(3)),
      assetRefs: rawRefs,
    }
  })

  return {
    version: PROMO_PLAN_VERSION,
    mode: isNarrativeMv ? 'narrative-mv' : 'promo-ui',
    pacingMode: resolvedPacing.id,
    beatSync: Boolean(bgmMeta?.analyzed || isNarrativeMv),
    title: String(rawPlan?.title || existingScript?.title || topic || 'Schema 创作短片').trim(),
    style: cleanStyle,
    targetPlatform: rawPlan?.targetPlatform || existingScript?.targetPlatform || 'universal',
    bpm: Math.max(70, Math.min(165, Number(bgmMeta?.bpm || rawPlan?.bpm || 112))),
    shots: repairedShots,
  }
}

/**
 * Compile `promo-plan/1` into deterministic `plan.resolved.json` schedule + `scriptData` patches.
 */
export function resolvePlanSchedule(plan, baseScript = {}) {
  const fps = Number(baseScript?.fps) || 30
  const width = Number(baseScript?.width) || 1920
  const height = Number(baseScript?.height) || 1080
  const safeZone = resolveSafeZoneSpec(width, height, plan?.targetPlatform || baseScript?.targetPlatform || 'universal')

  const minResolveDur = plan?.mode === 'narrative-mv' || plan?.beatSync ? 0.26 : 1.5
  let cursorFrame = 0
  let cursorSec = 0
  const resolvedShots = (plan?.shots || []).map((shot, idx) => {
    const durSec = Math.max(minResolveDur, Number(shot.durationSec || 4))
    const durFrames = Math.max(Math.ceil(minResolveDur * fps), Math.round(durSec * fps))
    const startFrame = cursorFrame
    const startSec = Number(cursorSec.toFixed(3))
    cursorFrame += durFrames
    cursorSec += durFrames / fps

    const baseScene = baseScript?.scenes?.[idx] || {}
    return {
      ...baseScene,
      id: shot.id || `scene-${String(idx + 1).padStart(2, '0')}`,
      index: idx + 1,
      title: shot.title,
      narration: shot.narration || baseScene.narration || shot.title,
      subChunks: Array.isArray(shot.subChunks) ? shot.subChunks : baseScene.subChunks,
      accentWords: Array.isArray(shot.accentWords) ? shot.accentWords : baseScene.accentWords,
      threePreset: shot.threePreset || shot?.stageSpec?.threePreset || baseScene.threePreset || VALID_THREE_PRESETS[idx % VALID_THREE_PRESETS.length],
      stageSpec: shot.stageSpec || baseScene.stageSpec,
      beatCount: Number.isFinite(Number(shot.beatCount)) ? Number(shot.beatCount) : baseScene.beatCount,
      visualBlueprint: shot.visualBlueprint || baseScene.visualBlueprint,
      motionNotes: shot.motionNotes || shot.visualBlueprint || baseScene.motionNotes,
      emotion: shot.emotion || baseScene.emotion || '平静',
      layout: shot.layout || 'media-split-motion',
      kenBurns: shot.kenBurns || 'zoom-in',
      transition: normalizeTransitionKind(shot.transition || 'iris-circle', idx, plan?.mode === 'narrative-mv' || Boolean(plan?.beatSync)),
      highlights: shot.highlights?.length ? shot.highlights : baseScene.highlights || [PROMO_SHOT_RECIPES[shot.recipe]?.label || shot.recipe],
      recipe: shot.recipe,
      fromScale: shot.fromScale,
      toScale: shot.toScale,
      cams: Array.isArray(shot.cams) && shot.cams.length > 0 ? shot.cams : baseScene.cams,
      marks: Array.isArray(shot.marks) && shot.marks.length > 0 ? shot.marks : baseScene.marks,
      loupe: shot.loupe || baseScene.loupe,
      windowLayout: shot.windowLayout || baseScene.windowLayout,
      windowTheme: shot.windowTheme || baseScene.windowTheme,
      windowTitle: shot.windowTitle || baseScene.windowTitle,
      explicitZeroAsset: Array.isArray(shot.assetRefs) && shot.assetRefs.length === 0,
      media:
        Array.isArray(shot.assetRefs)
          ? shot.assetRefs.map((p) => {
              const existingM = (baseScene.media || []).find((m) => m.path === p || m.originalPath === p)
              const dims = shot._mediaDimMap?.get?.(p) || {}
              return {
                ...existingM,
                path: p,
                width: Number(existingM?.width || dims.width || 0),
                height: Number(existingM?.height || dims.height || 0),
                type: /\.(mp4|mov|webm|mkv)$/i.test(p) ? 'video' : 'image',
                motion: shot.kenBurns || 'zoom-in',
              }
            })
          : baseScene.media || [],
      durationSec: Number((durFrames / fps).toFixed(4)),
      durationInFrames: durFrames,
      startFrame,
      startSec,
    }
  })

  const totalSec = Number(cursorSec.toFixed(4))
  const totalFrames = cursorFrame
  const beatStep = 60 / (Number(plan?.bpm) || 112)
  const beats = []
  for (let bt = 0, bi = 0; bt < totalSec; bt += beatStep, bi++) {
    beats.push({ time: Number(bt.toFixed(3)), strong: bi % 4 === 0 })
  }

  return {
    version: PROMO_PLAN_VERSION,
    fps,
    width,
    height,
    totalDurationSec: totalSec,
    totalDurationInFrames: totalFrames,
    safeZone,
    resolvedShots,
    beats,
  }
}

function safeExtractJson(text) {
  const s = String(text || '').trim()
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1].trim() : s
  try {
    return JSON.parse(raw)
  } catch {
    const a = raw.indexOf('{')
    const b = raw.lastIndexOf('}')
    if (a >= 0 && b > a) {
      try {
        return JSON.parse(raw.slice(a, b + 1))
      } catch {
        // Recover partial truncated shots/scenes array cleanly if relay clipped tail
        const slice = raw.slice(a)
        const shotsIdx = slice.indexOf('"shots"') >= 0 ? slice.indexOf('"shots"') : slice.indexOf('"scenes"')
        if (shotsIdx >= 0) {
          const lastObjEnd = slice.lastIndexOf('}')
          if (lastObjEnd > shotsIdx) {
            for (let cut = lastObjEnd; cut > shotsIdx; cut = slice.lastIndexOf('}', cut - 1)) {
              try {
                return JSON.parse(slice.slice(0, cut + 1) + ']}')
              } catch {}
            }
          }
        }
      }
    }
    return null
  }
}

/**
 * 4-Tier Degradation Director for `schema-plan` mode:
 * - Tier 1: Full `promo-plan/1` JSON from LLM
 * - Tier 2: Sectioned lightweight shot-recipe list from weaker LLM
 * - Tier 3: Minimal A/B/C MCQ choice token from minimal LLM
 * - Tier 4: Zero-LLM Deterministic Code Rules (guaranteed 100% pass)
 */
export async function runSchemaDirectorWithDegradation({
  projectDir,
  topic = '',
  style = 'tech',
  targetPlatform = 'universal',
  scriptData = {},
  assetsManifest = null,
  bgmMeta = null,
  narrationMode = '',
  pacingMode = '',
  callLlmChatFn = null,
  forceTierForTest = null,
}) {
  const trace = []
  let chosenPlan = null
  let degradationTier = 4
  const mediaCheck = (assetsManifest?.items || []).filter(
    (it) => it.role !== 'music' && it.role !== 'sfx' && it.role !== 'note' && it.role !== 'brand_mark' && it.type !== 'audio',
  )
  const effectivePacingMode = pacingMode || scriptData?.pacingMode || 'auto'
  const pacingProfile = resolvePacingProfile({
    topic: topic || scriptData?.title || '',
    style,
    narrationMode: narrationMode || scriptData?.narrationMode || '',
    hasAssets: mediaCheck.length > 0,
    pacingMode: effectivePacingMode,
  })

  // Tier 1: Full JSON Schema generation
  if (!forceTierForTest || forceTierForTest === 1) {
    if (typeof callLlmChatFn === 'function') {
      try {
        const mediaDimMap = new Map()
        for (const it of assetsManifest?.items || []) {
          if (it.path) mediaDimMap.set(it.path, { width: Number(it.width || 0), height: Number(it.height || 0) })
          if (it.editedPath) mediaDimMap.set(it.editedPath, { width: Number(it.editedWidth || it.width || 0), height: Number(it.editedHeight || it.height || 0) })
        }
        const mediaNames = (assetsManifest?.items || [])
          .filter((it) => it.role !== 'music' && it.role !== 'sfx' && it.role !== 'note' && it.role !== 'brand_mark' && it.type !== 'audio')
          .map((it) => it.path)
        const zeroVisualAssets = mediaNames.length === 0
        const noteSummaries = (assetsManifest?.notes || [])
          .filter((n) => n?.text)
          .map((n) => String(n.text).slice(0, 2200))
          .join('\n')
        const effectiveBgm = bgmMeta?.analyzed ? bgmMeta : scriptData?.bgm?.analyzed ? scriptData.bgm : null
        const prompt = {
          task: `生成 ${PROMO_PLAN_VERSION} 分镜配方 JSON`,
          topic: topic || scriptData?.title || '主题短片',
          goal: scriptData?.goal || '',
          productBrief: noteSummaries || undefined,
          targetPlatform,
          zeroVisualAssets,
          narrationMode: narrationMode || scriptData?.narrationMode || 'tts',
          bgmBeatAnalysis: effectiveBgm
            ? {
                bpm: effectiveBgm.bpm,
                phaseSec: effectiveBgm.phaseSec,
                beatSec: effectiveBgm.beatSec || Number((60 / (effectiveBgm.bpm || 112)).toFixed(4)),
                durationSec: effectiveBgm.durationSec,
                downbeatsSample: (effectiveBgm.downbeats || []).slice(0, 24),
                drops: effectiveBgm.drops || [],
              }
            : undefined,
          allowedRecipes: VALID_SHOT_KINDS,
          allowedLayouts: Array.from(VALID_SHOWCASE_LAYOUTS),
          ...(zeroVisualAssets ? { allowedStageArchetypes: VALID_STAGE_ARCHETYPES, allowedStageMoods: ['dawn-amber', 'crimson-war', 'indigo-night', 'ash-twilight', 'bronze-hall', 'jade-river', 'void-gold'], allowedStageSettings: ['palace-stairs', 'mountain-camp', 'city-siege', 'river-gorge', 'vast-plain'] } : {}),
          relativeAssets: mediaNames,
          scenesHint: zeroVisualAssets && scriptData?.authoringMode === 'local-draft'
            ? undefined
            : (scriptData?.scenes || []).map((s) => ({
                id: s.id,
                title: s.title,
                layout: s.layout,
                narration: s.narration,
                highlights: s.highlights,
              })),
        }
        const targetSpanSec = Number(scriptData?.totalDurationSec) || Number(effectiveBgm?.durationSec) || 60
        const approxShots = Math.round((targetSpanSec / 60) * pacingProfile.shotsPerMin)
        const desiredZeroShotsMin = Math.max(pacingProfile.minShots, Math.min(pacingProfile.maxShots - 2, approxShots - 2))
        const desiredZeroShotsMax = Math.min(pacingProfile.maxShots, desiredZeroShotsMin + (pacingProfile.id === 'dynamic' ? 6 : 4))
        const desiredUiShotsMin = Math.max(pacingProfile.minShots, Math.min(pacingProfile.maxShots - 2, approxShots - 2))
        const desiredUiShotsMax = Math.min(pacingProfile.maxShots, desiredUiShotsMin + 4)
        const isHistoricalPrompt = /历史|霸王|项羽|秦|汉|楚|三国|唐|宋|明|古风|武侠|战役|将军|帝王|演义/i.test(
          `${topic || ''} ${scriptData?.title || ''} ${scriptData?.goal || ''} ${noteSummaries || ''}`,
        )
        const pacingLabelHint = `当前选用节奏方案【${pacingProfile.label}】：${pacingProfile.ruleHint}`
        const systemPrompt = zeroVisualAssets
          ? `你是顶级音画动态导演 (AI Visual & Motion Director)，擅长 Opus 5.5 级无限制自由编程视频创作（Remotion + 原生 Three.js 3D 自由造景 + 动态矢量 SVG 创作 + 弹簧物理动画）。
当前没有任何图片/视频素材 (zeroVisualAssets=true)，全部画面将由下游 AI 主程根据你为每一幕撰写的 \`visualBlueprint\`，使用 \`<FreeformThreeStage buildScene={(api) => { ... }} />\` + 动态 \`<svg>\` **100% 从零自由编写专属代码**（\`layout\` 字段仅作为断网/离线时的保底备份）！
${pacingLabelHint}
输出严格紧凑 JSON：{ "version": "promo-plan/1", "mode": "${pacingProfile.id === 'dynamic' ? 'narrative-mv' : 'promo-ui'}", "beatSync": ${pacingProfile.id === 'dynamic' || narrationMode === 'subtitle-mv' || narrationMode === 'tts-beat-sync'}, "title": "...", "style": "cinematic|tech|emerald|energetic|documentary", "bpm": ${effectiveBgm?.bpm || (pacingProfile.id === 'calm' ? 88 : 110)}, "shots": [{ "id": "scene-01", "title": "...", "narration": "...", "accentWords": ["核心关键词"], "layout": "${isHistoricalPrompt ? 'narrative-diorama' : '3d-stage-opener|svg-architecture-flow|hud-telemetry-dashboard|vibecoding-spring-stage|metric-dashboard|workflow-steps|kinetic-impact|radial-climax'}", "threePreset": "orbital-core|cyber-terrain|particle-vortex|floating-monoliths|chrono-helix|matrix-cubes", "beatCount": ${pacingProfile.id === 'dynamic' ? 2 : 4}, "durationSec": ${pacingProfile.id === 'calm' ? 5.0 : pacingProfile.id === 'balanced' ? 3.8 : 2.0}, "transition": "${pacingProfile.id === 'calm' ? 'light-wipe' : 'slash-wipe'}", "visualBlueprint": "具体描述本镜专属的 3D 场景构建（如 3D 旋转地球跨洋飞线 / 3D 太阳系行星轨道 / 3D 芯片多层爆炸拆解 / 3D 柱状矩阵 / 3D 分子球棍 / 3D 机械齿轮等）与 2D 动态 SVG 视觉（如定制 K线/折线/雷达图 / 动态生长思维导图 / 公式推导 / 实时代码树 / 矢量插画等）及镜内弹簧物理演进", "highlights": ["要点1","要点2","要点3"]${isHistoricalPrompt ? ', "stageSpec": { "mood": "dawn-amber|crimson-war|indigo-night|ash-twilight|bronze-hall|jade-river|void-gold", "setting": "palace-stairs|mountain-camp|city-siege|river-gorge|vast-plain", "archetype": "hero-numeral|hero-stand|oath-break|cavalry-rush|slash-climax|duel-confront|farewell-tent|strategic-map|scroll-calligraphy|plaque-summary|channel-end", "heroNum": "24", "heroUnit": "岁", "bannerChar": "楚", "plaques": ["要点1","要点2"], "headline": "结尾主标题", "subheadline": "副标题" }' : ''} }] }。
核心硬性要求：
1. **贴合题材的拆镜与节奏**：拆分为 **${desiredZeroShotsMin}~${desiredZeroShotsMax} 个镜头**，${pacingProfile.ruleHint}（单镜口播长度与时长严格匹配，避免字多时长短）。
2. **零预设束缚，每个镜头写出独一无二的 \`visualBlueprint\`（下游 TSX 代码生成员直读！）**：不要受限于固定模板！请根据用户主题与本句台词，在 \`visualBlueprint\` 中自由设计最契合主题的专属 Three.js 3D 物体/轨道/空间与 2D 动态 SVG 图表/拓扑/插画动作；同时填好保底 \`layout\`（${isHistoricalPrompt ? '历史古风可用 `narrative-diorama`' : '轮换 `3d-stage-opener`、`svg-architecture-flow`、`hud-telemetry-dashboard`、`vibecoding-spring-stage`、`metric-dashboard`、`workflow-steps`、`radial-climax`'}）。
3. **绝对禁止输出任何网址 URL、参考来源标注或 Markdown 链接**（严禁 \`utm_source\` 等；除非用户明确要求展示项目仓库网址）：所有旁白与字幕纯正中文短句，\`accentWords\` 标出 1~2 个核心高亮词。
4. \`transition\` 仅允许 \`${VALID_TRANSITIONS.join(' | ')}\` 中的合法值（首镜用 \`cut\`）。`
          : `你是顶级商业与开源技术宣传片/产品介绍导演，擅长依据题材调整叙事节奏。
${pacingLabelHint}
输出严格紧凑 JSON：{ "version": "promo-plan/1", "beatSync": ${narrationMode === 'subtitle-mv' || narrationMode === 'tts-beat-sync' || pacingProfile.id === 'dynamic'}, "title": "...", "style": "tech|energetic|emerald|cinematic|documentary", "bpm": ${effectiveBgm?.bpm || (pacingProfile.id === 'calm' ? 92 : 114)}, "shots": [{ "id": "scene-01", "title": "...", "narration": "...", "subChunks": ["短句1","短句2"], "accentWords": ["亮点"], "visualBlueprint": "具体描述镜头动态构图：无截图时由 AI 主程用 FreeformThreeStage + 动态 SVG 自由编写专属 3D 场景与图表/架构；有截图时用 AppWindow+cams 局部聚焦推镜", "recipe": "push_in", "layout": "app-focus-shot|svg-architecture-flow|hud-telemetry-dashboard|vibecoding-spring-stage|workflow-steps|split-wipe-compare|metric-dashboard|multi-window-trio", "threePreset": "orbital-core|cyber-terrain|particle-vortex|floating-monoliths|chrono-helix|matrix-cubes", "windowTitle": "模块名称", "highlights": ["标签1","标签2"], "cams": [{ "t": 0, "fx": 0.5, "fy": 0.5, "z": 1.0 }, { "t": 0.55, "fx": 0.5, "fy": 0.48, "z": 1.15 }], "durationSec": ${pacingProfile.id === 'calm' ? 5.0 : pacingProfile.id === 'balanced' ? 3.8 : 2.5}, "transition": "${pacingProfile.id === 'calm' ? 'light-wipe' : 'slash-wipe'}", "assetRefs": [] }] }。
核心硬性要求：
1. **依应用场景适配节奏**：拆分为 **${desiredUiShotsMin}~${desiredUiShotsMax} 个镜头**，${pacingProfile.ruleHint} 口播文案口语自然、句式清晰。
2. **虚实交替混剪（真实截图特写 + AI 自由编写 3D/SVG 视觉）**：软件截图/实拍场景填入 exact \`relativeAssets\` 路径并配 \`app-focus-shot / split-wipe-compare / workflow-steps / multi-window-trio\`；开篇钩子、原理剖析、行业数据或结尾镜头置 \`assetRefs: []\` 并写清独具创意的 \`visualBlueprint\`（由下游 AI 主程用 \`<FreeformThreeStage>\` + 动态 \`<svg>\` 自由编写专属 3D 场景与动态图表/架构）。
3. **严禁网页参考来源注释**（\`utm_source\` 等），如主题要求展示项目自身开源 GitHub 地址请完整准确保留。\`transition\` 仅允许 ${VALID_TRANSITIONS.join('/')}。`
        const res = await callLlmChatFn({
          system: systemPrompt,
          messages: [{ role: 'user', content: JSON.stringify(prompt) }],
          temperature: zeroVisualAssets ? 0.4 : 0.28,
          maxTokens: zeroVisualAssets ? 12500 : 6500,
          timeoutMs: zeroVisualAssets ? 260_000 : 180_000,
          responseFormat: 'json',
        })
        const candidate = safeExtractJson(res?.text)
        const candShots = candidate?.shots || candidate?.scenes || candidate?.storyboard
        const hasExplicitCandidateShots = Array.isArray(candShots) && candShots.length >= 2
        const repaired = hasExplicitCandidateShots
          ? repairPromoPlanRules(candidate, { topic, style, assetsManifest, existingScript: scriptData, bgmMeta: effectiveBgm, narrationMode, pacingMode: effectivePacingMode })
          : null
        if (repaired && validatePromoPlan(repaired).ok) {
          for (const sh of repaired.shots) {
            sh._mediaDimMap = mediaDimMap
          }
          chosenPlan = repaired
          degradationTier = 1
          trace.push({ tier: 1, name: 'Full JSON Schema', ok: true })
        } else {
          trace.push({ tier: 1, name: 'Full JSON Schema', ok: false, reason: 'JSON 结构未通过约束' })
        }
      } catch (err) {
        trace.push({ tier: 1, name: 'Full JSON Schema', ok: false, reason: err?.message || String(err) })
      }
    } else {
      trace.push({ tier: 1, name: 'Full JSON Schema', ok: false, reason: '未提供 LLM 客户端' })
    }
  }

  // Tier 2: Sectioned lightweight list
  if (!chosenPlan && (!forceTierForTest || forceTierForTest <= 2) && typeof callLlmChatFn === 'function') {
    try {
      const zeroVisT2 = (assetsManifest?.items || []).filter((it) => it.role !== 'music' && it.role !== 'sfx' && it.role !== 'note' && it.type !== 'audio').length === 0
      const t2CountRange = pacingProfile.id === 'calm' ? '6~12' : pacingProfile.id === 'balanced' ? '10~16' : '22~30'
      const res = await callLlmChatFn({
        system: zeroVisT2
          ? `用 ${t2CountRange} 行紧凑列出完整叙事分镜表，节奏方案【${pacingProfile.label}】：${pacingProfile.ruleHint}。严禁附带任何网址 URL、引用来源或 Markdown 链接。每行格式：镜头标题 | 舞台类型(${VALID_STAGE_ARCHETYPES.join('/')}) | 纯中文旁白金句(含关键要点) | 镜内视觉动作(visualBlueprint)`
          : `用 ${t2CountRange} 行紧凑列出高能分镜方案，节奏方案【${pacingProfile.label}】：${pacingProfile.ruleHint}。严禁附带任何网址 URL、引用来源或 Markdown 链接。每行格式：镜头标题 | 配方(${VALID_SHOT_KINDS.join('/')}) | 旁白一句话 | 镜内视觉动作`,
        messages: [{ role: 'user', content: `主题: ${topic || scriptData?.title || 'AI短片'}\n要求: ${scriptData?.goal || ''}` }],
        temperature: 0.35,
        maxTokens: 3600,
      })
      const lines = String(res?.text || '')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.includes('|'))
      if (lines.length >= 2) {
        const shots = lines.slice(0, 36).map((l, idx) => {
          const [rawTitle, rawType, rawNarr, rawVisual] = l.split('|').map((x) => sanitizeSpokenNarration(x || ''))
          const recipe = VALID_SHOT_KINDS.find((k) => rawType?.includes(k)) || VALID_SHOT_KINDS[(idx % 6) + 1]
          const arch = VALID_STAGE_ARCHETYPES.find((a) => rawType?.includes(a)) || VALID_STAGE_ARCHETYPES[idx % VALID_STAGE_ARCHETYPES.length]
          const beatPattern = zeroVisT2 && pacingProfile.id === 'dynamic'
            ? (idx === 0 || idx === lines.length - 1 ? 4 : idx % 5 === 3 ? 1 : idx % 2 === 1 ? 2 : 3)
            : pacingProfile.id === 'calm'
              ? 6
              : 4
          const txPool = pacingProfile.id === 'calm'
            ? ['light-wipe', 'iris-circle', 'light-wipe']
            : ['flash-cut', 'slash-wipe', 'zoom-punch', 'glitch-cut', 'iris-circle', 'light-wipe']
          return {
            title: rawTitle || `镜头 ${idx + 1}`,
            narration: rawNarr || rawTitle || '',
            visualBlueprint: rawVisual || `${rawTitle || '核心视觉'}：推镜景深推进配合主题切换`,
            recipe,
            transition: idx === 0 ? 'cut' : txPool[idx % txPool.length],
            layout: zeroVisT2 ? 'narrative-diorama' : undefined,
            stageSpec: zeroVisT2
              ? {
                  mood: idx === 0 ? 'dawn-amber' : idx >= lines.length - 3 ? 'ash-twilight' : idx % 3 === 1 ? 'crimson-war' : 'indigo-night',
                  setting: idx === 0 ? 'palace-stairs' : idx >= lines.length - 3 ? 'river-gorge' : idx % 2 === 0 ? 'city-siege' : 'mountain-camp',
                  archetype: arch,
                }
              : undefined,
            beatCount: beatPattern,
            durationSec: pacingProfile.id === 'calm'
              ? 5.0
              : pacingProfile.id === 'balanced'
                ? 3.8
                : Number((beatPattern * (60 / (bgmMeta?.bpm || 90))).toFixed(2)),
          }
        })
        const effectiveBgmT2 = bgmMeta?.analyzed ? bgmMeta : scriptData?.bgm?.analyzed ? scriptData.bgm : null
        chosenPlan = repairPromoPlanRules(
          { shots, targetPlatform, pacingMode: pacingProfile.id, mode: pacingProfile.id === 'dynamic' || zeroVisT2 ? 'narrative-mv' : 'promo-ui' },
          { topic, style, assetsManifest, existingScript: scriptData, bgmMeta: effectiveBgmT2, narrationMode, pacingMode: effectivePacingMode },
        )
        degradationTier = 2
        trace.push({ tier: 2, name: 'Sectioned Prompt', ok: true })
      } else {
        trace.push({ tier: 2, name: 'Sectioned Prompt', ok: false, reason: '未返回标准分栏行' })
      }
    } catch (err) {
      trace.push({ tier: 2, name: 'Sectioned Prompt', ok: false, reason: err?.message || String(err) })
    }
  }

  // Tier 3: Ultra-simple A/B/C Multiple Choice Token for weak/tiny models
  if (!chosenPlan && (!forceTierForTest || forceTierForTest <= 3) && typeof callLlmChatFn === 'function') {
    try {
      const res = await callLlmChatFn({
        system: '只回复一个字母：A=科技锐利推拉风，B=电影稳重横移风，C=高能卡点快闪风。',
        messages: [{ role: 'user', content: `主题：${topic || scriptData?.title || '产品发布'}` }],
        temperature: 0.1,
        maxTokens: 20,
      })
      const ch = String(res?.text || '').toUpperCase().match(/\b([ABC])\b/)?.[1]
      if (ch) {
        const presetStyle = ch === 'B' ? 'cinematic' : ch === 'C' ? 'energetic' : 'tech'
        const recipeSeq =
          ch === 'B'
            ? ['pull_out', 'pan_across', 'face_focus', 'freeze_end']
            : ch === 'C'
              ? ['impact', 'push_in', 'pan_down', 'freeze_end']
              : ['pull_out', 'push_in', 'hold', 'freeze_end']
        const baseScenes = Array.isArray(scriptData?.scenes) && scriptData.scenes.length > 0 ? scriptData.scenes : null
        const shots = (baseScenes || recipeSeq).map((item, idx) => ({
          title: baseScenes ? item.title : `${topic || '重点展示'} ${idx + 1}`,
          narration: baseScenes ? item.narration : `${topic || '项目特性'} 核心解读第 ${idx + 1} 幕。`,
          recipe: recipeSeq[idx % recipeSeq.length],
          durationSec: baseScenes ? item.durationSec : pacingProfile.id === 'calm' ? 5.0 : 4.2,
        }))
        chosenPlan = repairPromoPlanRules(
          { style: presetStyle, targetPlatform, pacingMode: pacingProfile.id, shots },
          { topic, style: presetStyle, assetsManifest, existingScript: scriptData, narrationMode, pacingMode: effectivePacingMode },
        )
        degradationTier = 3
        trace.push({ tier: 3, name: `MCQ Choice (${ch})`, ok: true })
      } else {
        trace.push({ tier: 3, name: 'MCQ Choice', ok: false, reason: '模型未返回 A/B/C 单字母' })
      }
    } catch (err) {
      trace.push({ tier: 3, name: 'MCQ Choice', ok: false, reason: err?.message || String(err) })
    }
  }

  // Tier 4: Deterministic Code Rules Fallback (zero failure guarantee)
  if (!chosenPlan) {
    chosenPlan = repairPromoPlanRules(
      { targetPlatform, style, pacingMode: pacingProfile.id },
      { topic, style, assetsManifest, existingScript: scriptData, narrationMode, pacingMode: effectivePacingMode },
    )
    degradationTier = 4
    trace.push({ tier: 4, name: 'Deterministic Rule Engine Fallback', ok: true })
  }

  const validation = validatePromoPlan(chosenPlan)
  const resolved = resolvePlanSchedule(chosenPlan, { ...scriptData, targetPlatform })

  if (projectDir) {
    const absDir = resolve(projectDir)
    mkdirSync(absDir, { recursive: true })
    writeFileSync(join(absDir, 'plan.json'), JSON.stringify(chosenPlan, null, 2) + '\n', 'utf8')
    writeFileSync(join(absDir, 'plan.resolved.json'), JSON.stringify(resolved, null, 2) + '\n', 'utf8')
  }

  return {
    ok: validation.ok,
    plan: chosenPlan,
    resolved,
    degradationTier,
    tierLabel:
      degradationTier === 1
        ? 'Tier 1 · 完整 JSON Schema'
        : degradationTier === 2
          ? 'Tier 2 · 分段轻量化降级'
          : degradationTier === 3
            ? 'Tier 3 · A/B/C 选择题降级'
            : 'Tier 4 · 纯规则代码引擎兜底',
    trace,
  }
}
