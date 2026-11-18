import {
  copyFileSync,
  existsSync,
  mkdirSync,
  openSync,
  readSync,
  closeSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, extname, isAbsolute, join, resolve } from 'node:path'
import {
  loadEnv,
  PACKAGE_ROOT,
  probeAudioDuration,
  readScriptJson,
  REPO_ROOT,
  resolveBinaries,
  resolveEnvPath,
  runCommandRedirected,
  writeScriptJson,
} from '../shared/index.js'

const VOICE_FILENAME_PRESETS = {
  '女主播': {
    id: 'indextts-female-anchor',
    name: '知性女主播 (IndexTTS-2.5)',
    category: 'IndexTTS-2.5 内置',
    ageGroup: 'adult',
    gender: 'female',
    tags: ['女主播', '新闻', '科技', '商业', '科普', '清晰', '现代', '产品'],
    emotions: ['平静', '高兴'],
    roles: ['narrator', 'host', 'anchor', 'female'],
  },
  '无底噪': {
    id: 'indextts-clean-studio',
    name: '纯净无底噪旁白 (IndexTTS-2.5)',
    category: 'IndexTTS-2.5 内置',
    ageGroup: 'adult',
    gender: 'neutral',
    tags: ['无底噪', '旁白', '教程', '通用', '演示', '客观', '技术'],
    emotions: ['平静'],
    roles: ['narrator', 'instructor', 'system'],
  },
  '苏瑶': {
    id: 'indextts-suyao',
    name: '苏瑶·温婉叙事女声 (IndexTTS-2.5)',
    category: 'IndexTTS-2.5 内置',
    ageGroup: 'youth',
    gender: 'female',
    tags: ['苏瑶', '温婉', '故事', '人文', '治愈', '情感', '动漫', '文学'],
    emotions: ['平静', '高兴', '伤心', '害怕'],
    roles: ['female', 'storyteller', 'narrator', 'heroine'],
  },
  '评书': {
    id: 'indextts-pingshu',
    name: '传统评书·激昂说书人 (IndexTTS-2.5)',
    category: 'IndexTTS-2.5 内置',
    ageGroup: 'middle-aged',
    gender: 'male',
    tags: ['评书', '历史', '悬疑', '故事', '激昂', '国风', '传奇', '开场'],
    emotions: ['高兴', '生气', '害怕', '平静'],
    roles: ['storyteller', 'male', 'historian'],
  },
}

function slugifyId(str) {
  const base = String(str || 'voice')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || `voice-${Date.now()}`
}

/**
 * Ultra-fast WAV duration reader (reads only the first 128 bytes of the file header)
 * so scanning 200+ WAV files in a multi-folder voice pack takes < 30ms.
 */
export function fastReadWavDurationSec(filePath) {
  try {
    const st = statSync(filePath)
    if (st.size < 44) return null
    const fd = openSync(filePath, 'r')
    const header = Buffer.alloc(Math.min(256, st.size))
    readSync(fd, header, 0, header.length, 0)
    closeSync(fd)
    if (header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WAVE') {
      return null
    }
    let offset = 12
    let byteRate = 0
    while (offset + 8 <= header.length) {
      const chunkId = header.toString('ascii', offset, offset + 4)
      const chunkSize = header.readUInt32LE(offset + 4)
      if (chunkId === 'fmt ' && offset + 20 <= header.length) {
        byteRate = header.readUInt32LE(offset + 16)
        break
      }
      offset += 8 + chunkSize + (chunkSize % 2)
    }
    if (byteRate > 0) {
      return Number(((st.size - 44) / byteRate).toFixed(2))
    }
  } catch {}
  return null
}

/**
 * Smart metadata parser tailored for structured Chinese voice pack directories
 * such as `<VOICE_PACK_ROOT>/不同年龄人群音色/{中年-男声, 孩童, 热门音色, 老年}/*.wav`.
 */
export function inferVoiceMetadataFromPath(filePath, categoryHint = '') {
  const ext = extname(filePath).toLowerCase()
  const rawStem = basename(filePath, ext)
  const parentName = categoryHint || basename(dirname(filePath))

  // Clean leading numeric timestamp (`1717752345764-老妇叫卖试听` -> `老妇叫卖`)
  const cleanedName = rawStem
    .replace(/^\d{8,}-/, '')
    .replace(/试听$/g, '')
    .trim()

  const combined = `${parentName} ${cleanedName}`

  // 1. Category determination
  let category = parentName || '本地音色'
  if (category === 'voices') category = 'IndexTTS-2.5 内置'

  // 2. Gender inference
  let gender = 'neutral'
  const femaleKeywords = /(女|姐|妹|娘|妃|后|姑|妈|奶|萝莉|佳佳|璐|雯|姝|甜|琴|娇|媚|狐|花魁|冰淇淋|颜姐|巧克力|小西|师太|老妇|老鸨|婶)/
  const maleKeywords = /(男|叔|哥|爷|公公|军士|大当家|小伙|霸总|侠客|书童|帝王|掌门|白马|少年侠|小帅|小石头|球球|智峻|沈磊|周野芒|袁野)/
  if (parentName.includes('男') || cleanedName.startsWith('男-') || cleanedName.includes('（男')) {
    gender = 'male'
  } else if (parentName.includes('女') || cleanedName.startsWith('女-') || cleanedName.includes('（女')) {
    gender = 'female'
  } else if (femaleKeywords.test(combined) && !maleKeywords.test(combined)) {
    gender = 'female'
  } else if (maleKeywords.test(combined)) {
    gender = 'male'
  }

  // 3. Age group inference
  let ageGroup = 'adult'
  if (/(孩童|儿童|\d+-\d+岁|\d+岁|小男孩|小女孩|小孩|书童|奶声|奶凶|稚嫩|萝莉)/.test(combined)) {
    ageGroup = 'child'
  } else if (/(老年|老妇|奶奶|太后|师太|长老|沧桑|老年嗓|老年音|老顽童)/.test(combined)) {
    ageGroup = 'elderly'
  } else if (/(中年|中老年|45岁|大叔|青叔|婶)/.test(combined)) {
    ageGroup = 'middle-aged'
  } else if (/(青年|少年|少女|小哥|小姐|师妹|师姐|学霸|学堂)/.test(combined)) {
    ageGroup = 'youth'
  }

  // 4. Tokenize descriptive tags from folder + filename
  const rawTokens = cleanedName
    .split(/[-—_、，,\s（）()\[\]【】！!]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== '中文' && s !== '1' && s !== '2')

  const tagSet = new Set([category, ...rawTokens])
  if (gender === 'male') tagSet.add('男声')
  if (gender === 'female') tagSet.add('女声')
  if (ageGroup === 'child') tagSet.add('少儿')
  if (ageGroup === 'elderly') tagSet.add('老年')
  if (ageGroup === 'middle-aged') tagSet.add('中年')
  if (ageGroup === 'youth') tagSet.add('青年')

  // Semantic domain enrichment for AI voice matcher
  if (/(纪录|专题|宣传片|党政|旁白)/.test(combined)) {
    tagSet.add('纪录片')
    tagSet.add('旁白')
    tagSet.add('宣传片')
  }
  if (/(解说|up主|主播|带货|播报)/.test(combined)) {
    tagSet.add('解说')
    tagSet.add('短视频')
    tagSet.add('主播')
  }
  if (/(故事|有声书|文学|独白|娓娓道来)/.test(combined)) {
    tagSet.add('故事')
    tagSet.add('有声书')
    tagSet.add('叙事')
  }
  if (/(侠|公公|太后|妃|掌门|师叔|师妹|师姐|古板|长老|花魁)/.test(combined)) {
    tagSet.add('古风')
    tagSet.add('角色配音')
    tagSet.add('剧情')
  }

  // 5. Emotions & Roles inference
  const emotions = ['平静']
  if (/(活泼|热情|开朗|甜美|可爱|阳光|欢快|有趣)/.test(combined)) emotions.push('高兴')
  if (/(哀|伤|虚弱|沧桑|深沉|低沉)/.test(combined)) emotions.push('伤心')
  if (/(凶狠|嚣张|恶毒|阴狠|傲慢|刻薄|作威作福|毒舌|霸总|威严)/.test(combined)) emotions.push('生气')
  if (/(求饶|害怕|病娇)/.test(combined)) emotions.push('害怕')
  if (emotions.length === 1) emotions.push('高兴')

  const roles = []
  if (/(旁白|解说|专题|纪录|文学|有声书|讲述)/.test(combined)) roles.push('narrator', 'documentary')
  if (/(主播|up主|播报|带货)/.test(combined)) roles.push('host', 'anchor')
  if (/(故事|有声书|独白)/.test(combined)) roles.push('storyteller')
  if (ageGroup === 'child') roles.push('child')
  if (ageGroup === 'elderly') roles.push('elder')
  roles.push(gender === 'female' ? 'female' : gender === 'male' ? 'male' : 'narrator')

  const durationSec = ext === '.wav' ? fastReadWavDurationSec(filePath) : null

  return {
    id: `pack-${slugifyId(`${category}-${cleanedName}`)}`,
    name: cleanedName,
    category,
    ageGroup,
    gender,
    tags: Array.from(tagSet),
    emotions: Array.from(new Set(emotions)),
    roles: Array.from(new Set(roles)),
    durationSec,
  }
}

export function getVoicePacksDir() {
  loadEnv()
  const dir = resolveEnvPath('VOICE_PACKS_DIR', './voice-packs')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  if (REPO_ROOT !== PACKAGE_ROOT) {
    const pkgEx = join(PACKAGE_ROOT, 'voice-packs', 'catalog.example.json')
    const dstEx = join(dir, 'catalog.example.json')
    if (existsSync(pkgEx) && !existsSync(dstEx)) {
      try {
        copyFileSync(pkgEx, dstEx)
      } catch {}
    }
  }
  return dir
}

function expandEnvPlaceholders(str) {
  if (!str || typeof str !== 'string') return ''
  return str.replace(/\$\{([A-Z0-9_]+)\}/g, (_, key) => process.env[key] || '')
}

/**
 * Discover emotion reference WAV files from INDEXTTS_ROOT/情感参考 and EXTRA_VOICE_SCAN_DIRS.
 */
export function discoverEmotionReferences() {
  loadEnv()
  const emoMap = {}
  const candidateDirs = []
  const idxRoot = resolveEnvPath('INDEXTTS_ROOT', '')
  if (idxRoot && existsSync(join(idxRoot, '情感参考'))) {
    candidateDirs.push(join(idxRoot, '情感参考'))
  }
  const extraRaw = process.env.EXTRA_VOICE_SCAN_DIRS || ''
  for (const part of extraRaw.split(';').map((s) => s.trim()).filter(Boolean)) {
    const abs = isAbsolute(part) ? part : resolve(REPO_ROOT, part)
    if (existsSync(abs) && (basename(abs).includes('情感') || existsSync(join(abs, '平静.wav')))) {
      candidateDirs.push(abs)
    }
  }
  for (const emoDir of candidateDirs) {
    if (!existsSync(emoDir) || !statSync(emoDir).isDirectory()) continue
    for (const entry of readdirSync(emoDir)) {
      const ext = extname(entry).toLowerCase()
      if (['.wav', '.mp3', '.flac'].includes(ext)) {
        const label = basename(entry, ext)
        if (!emoMap[label]) emoMap[label] = join(emoDir, entry)
      }
    }
  }
  return emoMap
}

/**
 * Recursively scan a directory (up to depth 4) for `.wav`/`.mp3`/`.flac`/`.pt` and `voices.json`/`manifest.json`.
 */
function scanDirectoryRecursive(dir, registerEntry, depth = 0, maxDepth = 4) {
  if (depth > maxDepth || !existsSync(dir)) return
  let st
  try {
    st = statSync(dir)
  } catch {
    return
  }
  if (!st.isDirectory()) return

  const dirBaseName = basename(dir)
  if (dirBaseName === '情感参考' || dirBaseName === 'node_modules' || dirBaseName.startsWith('.')) {
    return
  }

  let entries = []
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    let itemStat
    try {
      itemStat = statSync(fullPath)
    } catch {
      continue
    }

    if (itemStat.isDirectory()) {
      scanDirectoryRecursive(fullPath, registerEntry, depth + 1, maxDepth)
      continue
    }

    const ext = extname(entry).toLowerCase()
    const stem = basename(entry, ext)

    // 1. Check `voices.json` or `manifest.json`
    if (entry === 'voices.json' || entry === 'manifest.json') {
      try {
        const json = JSON.parse(readFileSync(fullPath, 'utf8'))
        if (Array.isArray(json.voices)) {
          for (const v of json.voices) {
            const refRel = v.refAudio || v.refPath || ''
            const refAbs = refRel ? resolve(dir, refRel) : ''
            registerEntry({
              ...v,
              id: v.id || `pack-${slugifyId(v.name)}`,
              category: v.category || json.packName || dirBaseName,
              refPath: refAbs,
              source: 'discovered-manifest',
            })
          }
        } else if (typeof json === 'object' && json !== null) {
          for (const [k, val] of Object.entries(json)) {
            if (!val || typeof val !== 'object' || !val.ref_audio) continue
            let refAbs = resolve(dir, val.ref_audio)
            if (!existsSync(refAbs)) {
              refAbs = resolve(dirname(dir), val.ref_audio)
            }
            const isMale = k.toUpperCase().startsWith('M') || String(val.ref_audio).includes('male')
            registerEntry({
              id: `discovered-${slugifyId(k)}`,
              name: isMale ? `纪录片沉稳男声 (${k})` : `叙事温婉女声 (${k})`,
              category: '纪录片与旁白',
              ageGroup: 'adult',
              engine: 'indextts25',
              gender: isMale ? 'male' : 'female',
              tags: isMale
                ? ['纪录片', '沉稳', '浑厚', '历史', '文化', '宣传片', '大气', '男声']
                : ['叙事', '纪录片', '故事', '清亮', '人文', '女声'],
              emotions: ['平静', '高兴', '伤心'],
              roles: isMale ? ['narrator', 'male', 'documentary'] : ['narrator', 'female', 'storyteller'],
              promptText: val.prompt_text || '',
              refPath: refAbs,
              durationSec: extname(refAbs).toLowerCase() === '.wav' ? fastReadWavDurationSec(refAbs) : null,
              source: 'discovered-voices-json',
            })
          }
        }
      } catch {}
      continue
    }

    // 2. Audio / Speaker Tensor files (`.wav`, `.mp3`, `.flac`, `.pt`) — ignore `.url`, `.txt`, etc.
    if (['.pt', '.wav', '.mp3', '.flac'].includes(ext)) {
      let effectivePath = fullPath
      if (ext === '.pt') {
        const siblingAudio = ['.wav', '.mp3', '.flac']
          .map((audioExt) => fullPath.replace(/\.pt$/i, audioExt))
          .find((cand) => existsSync(cand))
        if (siblingAudio) effectivePath = siblingAudio
      }
      const effExt = extname(effectivePath).toLowerCase()
      const preset = VOICE_FILENAME_PRESETS[stem]
      if (preset) {
        registerEntry({
          ...preset,
          engine: effExt === '.pt' ? 'indextts2' : 'indextts25',
          refPath: effectivePath,
          durationSec: effExt === '.wav' ? fastReadWavDurationSec(effectivePath) : preset.durationSec ?? null,
          source: 'discovered-local',
        })
      } else {
        const inferred = inferVoiceMetadataFromPath(effectivePath, dirBaseName)
        registerEntry({
          ...inferred,
          engine: effExt === '.pt' ? 'indextts2' : 'indextts25',
          refPath: effectivePath,
          source: 'discovered-voice-pack',
        })
      }
    }
  }
}

/**
 * Load user-saved catalog (`voice-packs/catalog.json`) + template + auto-discovered local voices
 * (including multi-level directories configured in `EXTRA_VOICE_SCAN_DIRS`).
 */
export function getVoiceCatalog() {
  loadEnv()
  const packsDir = getVoicePacksDir()
  const catalogPath = join(packsDir, 'catalog.json')
  const examplePath = join(packsDir, 'catalog.example.json')
  const idxRoot = resolveEnvPath('INDEXTTS_ROOT', '')
  const hasInferV25 = Boolean(idxRoot && existsSync(join(idxRoot, 'indextts', 'infer_v2_5.py')))
  const supportsLegacyPt =
    String(process.env.DEFAULT_TTS_ENGINE || 'indextts25').trim().toLowerCase() === 'indextts2' && !hasInferV25

  const byId = new Map()

  const registerEntry = (raw) => {
    if (!raw || !raw.id) return
    const expandedRef = expandEnvPlaceholders(raw.refPath || raw.refAudio || '')
    let resolvedRef = expandedRef
      ? isAbsolute(expandedRef)
        ? expandedRef
        : resolve(REPO_ROOT, expandedRef)
      : ''
    if (resolvedRef && resolvedRef.toLowerCase().endsWith('.pt')) {
      const siblingAudio = ['.wav', '.mp3', '.flac']
        .map((audioExt) => resolvedRef.replace(/\.pt$/i, audioExt))
        .find((cand) => existsSync(cand))
      if (siblingAudio) resolvedRef = siblingAudio
    }
    const resolvedExt = extname(resolvedRef || '').toLowerCase()
    const isLegacyPt = resolvedExt === '.pt'
    const isAudioSample = ['.wav', '.mp3', '.flac'].includes(resolvedExt)
    const fileExists = Boolean(resolvedRef && existsSync(resolvedRef))
    byId.set(raw.id, {
      id: raw.id,
      name: raw.name || raw.id,
      category: raw.category || '默认分类',
      ageGroup: raw.ageGroup || 'adult',
      engine: raw.engine || (isLegacyPt ? 'indextts2' : 'indextts25'),
      gender: raw.gender || 'neutral',
      language: raw.language || 'zh-CN',
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      emotions: Array.isArray(raw.emotions) ? raw.emotions : ['平静'],
      roles: Array.isArray(raw.roles) ? raw.roles : ['narrator'],
      promptText: raw.promptText || '',
      refPath: raw.refPath || raw.refAudio || '',
      resolvedRefPath: resolvedRef,
      available: fileExists && (!isLegacyPt || supportsLegacyPt),
      isLegacyPt,
      isAudioSample,
      requiresWav: isLegacyPt && !supportsLegacyPt,
      durationSec: raw.durationSec ?? (resolvedExt === '.wav' && fileExists ? fastReadWavDurationSec(resolvedRef) : null),
      source: raw.source || 'catalog',
    })
  }

  if (existsSync(examplePath)) {
    try {
      const parsed = JSON.parse(readFileSync(examplePath, 'utf8'))
      for (const v of parsed.voices || []) {
        registerEntry({ ...v, category: v.category || 'IndexTTS-2.5 内置' })
      }
    } catch {}
  }

  if (existsSync(catalogPath)) {
    try {
      const parsed = JSON.parse(readFileSync(catalogPath, 'utf8'))
      for (const v of parsed.voices || []) registerEntry(v)
    } catch {}
  }

  const scanDirs = new Set()
  if (idxRoot && existsSync(join(idxRoot, 'voices'))) {
    scanDirs.add(join(idxRoot, 'voices'))
  }
  const extraRaw = process.env.EXTRA_VOICE_SCAN_DIRS || ''
  for (const part of extraRaw.split(';').map((s) => s.trim()).filter(Boolean)) {
    const abs = isAbsolute(part) ? part : resolve(REPO_ROOT, part)
    if (existsSync(abs)) scanDirs.add(abs)
  }

  for (const dir of scanDirs) {
    scanDirectoryRecursive(dir, registerEntry, 0, 4)
  }

  const defaultRef = resolveEnvPath('DEFAULT_REF_AUDIO', '')
  if (defaultRef && existsSync(defaultRef)) {
    registerEntry({
      id: 'default-ref-voice',
      name: '默认参考音色 (Default Ref)',
      category: '默认参考',
      ageGroup: 'adult',
      engine: 'indextts2',
      gender: 'neutral',
      tags: ['默认', '参考音色', '通用', '对话'],
      emotions: ['平静', '高兴'],
      roles: ['narrator', 'character'],
      promptText: process.env.DEFAULT_REF_TEXT || '',
      refPath: defaultRef,
      durationSec: fastReadWavDurationSec(defaultRef),
      source: 'env-default',
    })
  }

  const voices = Array.from(byId.values())
  const categories = {}
  for (const v of voices) {
    const cat = v.category || '未分类'
    categories[cat] = (categories[cat] || 0) + 1
  }

  const emotionReferences = discoverEmotionReferences()
  return {
    voices,
    categories,
    emotionReferences,
    catalogPath,
  }
}

/**
 * Save user-imported voice entries into `voice-packs/catalog.json`.
 */
function saveUserVoicesToCatalog(newEntries) {
  const packsDir = getVoicePacksDir()
  const catalogPath = join(packsDir, 'catalog.json')
  let existing = { version: '1.0.0', updatedAt: new Date().toISOString(), voices: [] }
  if (existsSync(catalogPath)) {
    try {
      existing = JSON.parse(readFileSync(catalogPath, 'utf8'))
      if (!Array.isArray(existing.voices)) existing.voices = []
    } catch {}
  }

  const map = new Map(existing.voices.map((v) => [v.id, v]))
  for (const item of newEntries) {
    map.set(item.id, item)
  }
  existing.updatedAt = new Date().toISOString()
  existing.voices = Array.from(map.values())
  writeFileSync(catalogPath, JSON.stringify(existing, null, 2) + '\n', 'utf8')
  return catalogPath
}

/**
 * Import a custom voice pack from a single audio/.pt file, a multi-level directory,
 * or a `.zip` archive.
 */
export async function importVoicePack(options = {}) {
  const {
    sourcePath,
    id,
    name,
    category = '',
    gender = '',
    engine = 'indextts25',
    tags = [],
    emotions = ['平静', '高兴'],
    roles = ['narrator'],
    promptText = '',
    copyToVoicePacks,
  } = options

  if (!sourcePath) {
    throw new Error('sourcePath is required to import a voice pack.')
  }
  const absSource = isAbsolute(sourcePath) ? sourcePath : resolve(REPO_ROOT, sourcePath)
  if (!existsSync(absSource)) {
    throw new Error(`Voice pack source path does not exist: ${absSource}`)
  }

  const packsDir = getVoicePacksDir()
  const importedRoot = join(packsDir, 'imported')
  mkdirSync(importedRoot, { recursive: true })

  const stat = statSync(absSource)
  const importedVoices = []

  // Case 1: `.zip` archive -> extract into `voice-packs/imported/<packName>`
  let targetDir = null
  let shouldCopyFiles = Boolean(copyToVoicePacks)
  if (stat.isFile() && extname(absSource).toLowerCase() === '.zip') {
    const packSlug = slugifyId(basename(absSource, '.zip'))
    targetDir = join(importedRoot, packSlug)
    mkdirSync(targetDir, { recursive: true })
    if (process.platform === 'win32') {
      await runCommandRedirected('powershell.exe', [
        '-NoProfile',
        '-Command',
        `Expand-Archive -Path '${absSource.replace(/'/g, "''")}' -DestinationPath '${targetDir.replace(/'/g, "''")}' -Force`,
      ])
    } else {
      await runCommandRedirected('unzip', ['-o', absSource, '-d', targetDir])
    }
  } else if (stat.isDirectory()) {
    targetDir = absSource
    // For existing local directories (e.g. multi-folder WAV voice packs), reference in-place by default
    shouldCopyFiles = copyToVoicePacks === true
  } else {
    shouldCopyFiles = copyToVoicePacks !== false
  }

  // Case 2: Directory (multi-level recursive scan supporting both manifest.json and categorized WAV folders)
  if (targetDir) {
    scanDirectoryRecursive(
      targetDir,
      (entry) => {
        let finalRef = entry.refPath
        if (shouldCopyFiles && finalRef && existsSync(finalRef) && !finalRef.startsWith(importedRoot)) {
          const destDir = join(importedRoot, entry.id)
          mkdirSync(destDir, { recursive: true })
          const destFile = join(destDir, basename(finalRef))
          copyFileSync(finalRef, destFile)
          finalRef = destFile
        }
        importedVoices.push({
          ...entry,
          category: category || entry.category || basename(targetDir),
          gender: gender || entry.gender || 'neutral',
          engine: engine || entry.engine || 'indextts2',
          promptText: promptText || entry.promptText || '',
          refPath: finalRef,
          source: 'user-imported-pack',
          importedAt: new Date().toISOString(),
        })
      },
      0,
      4,
    )
  } else {
    // Case 3: Single `.wav` / `.mp3` / `.flac` / `.pt` file
    const ext = extname(absSource).toLowerCase()
    const inferred = inferVoiceMetadataFromPath(absSource, category || '自定义音色')
    const voiceId = id ? slugifyId(id) : name ? slugifyId(`custom-${name}`) : inferred.id
    let finalRef = absSource
    if (shouldCopyFiles) {
      const destDir = join(importedRoot, voiceId)
      mkdirSync(destDir, { recursive: true })
      finalRef = join(destDir, basename(absSource))
      if (resolve(absSource) !== resolve(finalRef)) {
        copyFileSync(absSource, finalRef)
      }
    }
    let durationSec = inferred.durationSec
    if (durationSec === null && ext !== '.pt') {
      try {
        const probe = await probeAudioDuration(finalRef, 30)
        durationSec = probe.durationSec
      } catch {}
    }
    const userTags =
      typeof tags === 'string'
        ? tags.split(/[,，\s]+/).filter(Boolean)
        : Array.isArray(tags) && tags.length > 0
          ? tags
          : []

    importedVoices.push({
      id: voiceId,
      name: name || inferred.name,
      category: category || '自定义导入',
      ageGroup: inferred.ageGroup,
      engine,
      gender: gender || inferred.gender,
      tags: Array.from(new Set([...userTags, ...inferred.tags])),
      emotions: Array.isArray(emotions) && emotions.length > 0 ? emotions : inferred.emotions,
      roles: Array.isArray(roles) && roles.length > 0 ? roles : inferred.roles,
      promptText,
      refPath: finalRef,
      durationSec,
      source: 'user-imported-file',
      importedAt: new Date().toISOString(),
    })
  }

  if (importedVoices.length === 0) {
    throw new Error(`No valid audio (.wav/.mp3/.flac) or IndexTTS (.pt) files found in: ${absSource}`)
  }

  const catalogPath = saveUserVoicesToCatalog(importedVoices)
  const categoryBreakdown = {}
  for (const v of importedVoices) {
    categoryBreakdown[v.category] = (categoryBreakdown[v.category] || 0) + 1
  }

  return {
    importedCount: importedVoices.length,
    categoryBreakdown,
    importedVoices: importedVoices.slice(0, 30),
    totalPersistedInCatalog: importedVoices.length,
    catalogPath,
  }
}

/**
 * AI Voice Auto-Matcher + User Manual Override Selector.
 * Scores all catalog voices (including categorized local & imported voice packs)
 * against scene text, emotion, role, age group, and project audience/goal.
 */
export function matchVoiceForScene(scene = {}, projectMeta = {}, catalogVoices = null, explicitVoiceId = '') {
  const { voices, emotionReferences } = catalogVoices
    ? { voices: catalogVoices, emotionReferences: discoverEmotionReferences() }
    : getVoiceCatalog()

  if (!voices || voices.length === 0) {
    throw new Error('Voice catalog is empty. Please import a voice pack or check INDEXTTS_ROOT in .env.')
  }

  // 1. Check if user explicitly specified a voiceId or voice name
  const requestedId =
    explicitVoiceId && explicitVoiceId !== 'auto'
      ? explicitVoiceId
      : scene.voiceLocked && scene.voiceId && scene.voiceId !== 'auto'
        ? scene.voiceId
        : projectMeta.voiceMode === 'manual' && projectMeta.defaultVoiceId && projectMeta.defaultVoiceId !== 'auto'
          ? projectMeta.defaultVoiceId
          : scene.voiceId && scene.voiceId !== 'auto'
            ? scene.voiceId
            : ''

  if (requestedId) {
    const kw = requestedId.toLowerCase()
    const manualHit =
      voices.find((v) => v.id === requestedId || v.name === requestedId) ||
      voices.find((v) => v.id.toLowerCase().includes(kw) || v.name.toLowerCase().includes(kw))
    if (manualHit) {
      const emoAudio = emotionReferences[scene.emotion] || emotionReferences['平静'] || ''
      return {
        voice: manualHit,
        emotionAudio: emoAudio,
        mode: 'manual',
        score: 100,
        reason: `用户指定音色: [${manualHit.category}] ${manualHit.name} (${manualHit.id})`,
      }
    }
  }

  // 2. AI Auto-Matching across all discovered & imported voice packs
  const contextText = [
    scene.title || '',
    scene.narration || scene.text || '',
    scene.visualPrompt || '',
    scene.role || '',
    projectMeta.title || '',
    projectMeta.audience || '',
    projectMeta.goal || '',
  ]
    .join(' ')
    .toLowerCase()

  const sceneEmotion = (scene.emotion || '平静').trim()
  const sceneRole = (scene.role || 'narrator').trim().toLowerCase()

  // Detect age / style hints from context
  const wantsChild = /(孩童|儿童|少儿|小孩|男孩|女孩|宝宝|童年|小学|幼稚園|child|kid)/.test(contextText)
  const wantsElderly = /(老年|老者|老爷爷|老奶奶|长老|太后|师太|岁月|沧桑|古稀|elder)/.test(contextText)
  const wantsYouth = /(青年|少年|少女|up主|短视频|青春|学霸|师妹|师姐|侠客)/.test(contextText)
  const isTechOrBiz = /(科技|架构|系统|代码|数据|引擎|产品|工作台|商业|ai|remotion|gsap|dsh)/.test(contextText)
  const isTutorialOrGuide = /(教程|教学|实战|操作|指南|工作台|插件|功能板块|交互|流程|配置|使用|演示)/.test(contextText)
  const isEpicOrDoc = /(历史|千年|戈壁|山河|传奇|史诗|文明|纪录|宣传片|风云|百慕大|悬疑|专题|党政)/.test(contextText)
  const isWarmOrStory = /(故事|温暖|心灵|情感|夜晚|微光|漫步|治愈|回忆|文学|有声书)/.test(contextText)
  const primaryAnchorId = String(projectMeta?._primaryVoiceId || '').trim()
  const isStandardHostScene = !sceneRole || ['narrator', 'host', 'instructor', 'default'].includes(sceneRole)

  const scored = voices.map((v) => {
    let score = 45
    const reasons = []

    if (v.available) {
      score += 15
    } else {
      // Never pick `.pt`-only legacy tensors or missing files over verified zero-shot WAVs
      score -= v.requiresWav ? 75 : 55
    }
    if (v.isAudioSample && v.durationSec >= 3.5 && v.durationSec <= 12.5) {
      score += 12
      reasons.push(`黄金参考时长(${v.durationSec}s)`)
    }
    if (v.source === 'env-default' && voices.some((x) => x.available && x.isAudioSample && x.source !== 'env-default')) {
      score -= 22
    }

    // Age group alignment (crucial when child/elderly voices are in catalog!)
    if (wantsChild) {
      if (v.ageGroup === 'child') {
        score += 30
        reasons.push('少儿角色年龄契合')
      } else {
        score -= 15
      }
    } else if (wantsElderly) {
      if (v.ageGroup === 'elderly') {
        score += 30
        reasons.push('长者沧桑声线契合')
      } else {
        score -= 10
      }
    } else {
      // Standard narrator/host scenes shouldn't accidentally pick a 4-year-old child or extreme character voice
      if (v.ageGroup === 'child') score -= 22
      if (v.ageGroup === 'elderly') score -= 12
    }

    if (wantsYouth && v.ageGroup === 'youth') {
      score += 14
      reasons.push('青年活力声线')
    }

    // Penalize extreme villain/comic/domain-mismatch character archetypes on normal narration unless requested
    if (/(太监|流氓|恶毒|病娇|叫卖|老鸨|狐狸精)/.test(v.name) && !/(反派|太监|流氓|叫卖|剧情)/.test(contextText)) {
      score -= 25
    }
    if (/(党政|动物|野史|古代帝王)/.test(v.name) && !/(党政|政务|动物|古代帝王)/.test(contextText)) {
      score -= 24
    }
    if (primaryAnchorId && v.id === primaryAnchorId && isStandardHostScene) {
      score += 24
      reasons.push('全片主讲连贯音色')
    }

    // Role & gender alignment
    if (v.roles && v.roles.some((r) => r.toLowerCase() === sceneRole)) {
      score += 12
      reasons.push(`角色契合(${sceneRole})`)
    }
    if ((sceneRole.includes('female') || sceneRole.includes('女')) && v.gender === 'female') {
      score += 18
      reasons.push('女性声线')
    } else if ((sceneRole.includes('male') || sceneRole.includes('男')) && v.gender === 'male') {
      score += 18
      reasons.push('男性声线')
    }

    // Emotion affinity
    if (Array.isArray(v.emotions) && v.emotions.includes(sceneEmotion)) {
      score += 8
      reasons.push(`情绪支持(${sceneEmotion})`)
    }

    // Tag keyword matching against scene + project context
    const matchedTags = (v.tags || []).filter(
      (tag) => tag.length >= 2 && contextText.includes(String(tag).toLowerCase()),
    )
    if (matchedTags.length > 0) {
      score += Math.min(28, matchedTags.length * 9)
      reasons.push(`标签命中(${matchedTags.slice(0, 3).join('/')})`)
    }

    if (isTutorialOrGuide && (v.tags?.some((t) => ['解说', '主播', '旁白', '无底噪', '温柔', '清晰'].includes(t)) || /(专业解说|温柔青年|温柔女青年|解说青年|女主播)/.test(v.name))) {
      score += 16
      reasons.push('教程实战讲解语境')
    }
    if (isTechOrBiz && v.tags?.some((t) => ['女主播', '科技', '无底噪', '商业', '专业感', '专业解说', '解说', '宣传片'].includes(t))) {
      score += 15
      reasons.push('科技/专业解说语境')
    }
    if (/(专业解说|纪录片宣传片|广播|旁白|宣传|广告感)/.test(v.name)) {
      score += 14
      reasons.push('广播级解说音色')
    }
    if (isEpicOrDoc && v.tags?.some((t) => ['纪录片', '评书', '历史', '沉稳', '浑厚', '宣传片', '专题'].includes(t))) {
      score += 18
      reasons.push('宏大纪录/历史叙事语境')
    }
    if (isWarmOrStory && v.tags?.some((t) => ['苏瑶', '温婉', '故事', '治愈', '人文', '温柔', '有声书', '文学'].includes(t))) {
      score += 16
      reasons.push('人文情感叙事语境')
    }

    return {
      voice: v,
      score: Math.max(1, Math.min(99, score)),
      reasons,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]
  const emoAudio = emotionReferences[sceneEmotion] || ''
  const reasonSummary =
    best.reasons.length > 0 ? best.reasons.join(' + ') : '综合语境最优音色'

  return {
    voice: best.voice,
    emotionAudio: emoAudio,
    mode: 'auto',
    score: best.score,
    reason: `AI 自动匹配: [${best.voice.category}] ${best.voice.name} [匹配度 ${best.score}% — ${reasonSummary}]`,
  }
}

/**
 * Find the closest real WAV/audio voice matching a requested (possibly legacy `.pt`) voice profile.
 */
export function findBestAvailableWavVoice(voices = [], hintVoice = {}) {
  const wavPool = (voices || []).filter(
    (v) => v && v.available && v.isAudioSample && existsSync(v.resolvedRefPath || ''),
  )
  if (wavPool.length === 0) return null
  const wantGender = hintVoice?.gender || ''
  const wantTags = new Set((hintVoice?.tags || []).map((t) => String(t).toLowerCase()))
  const scored = wavPool
    .filter((v) => v.source !== 'env-default' || wavPool.length === 1)
    .map((v) => {
      let s = 30
      if (wantGender && wantGender !== 'neutral') {
        if (v.gender === wantGender) s += 30
        else if (v.gender !== 'neutral') s -= 20
      }
      if (v.ageGroup !== 'child' && v.ageGroup !== 'elderly') s += 10
      if (v.durationSec >= 4.0 && v.durationSec <= 12.0) s += 12
      if (/(专业解说|纪录片宣传片|旁白|故事|解说|沉稳|温柔)/.test(v.name)) s += 14
      for (const t of v.tags || []) {
        if (wantTags.has(String(t).toLowerCase())) s += 10
      }
      return { voice: v, score: s }
    })
  scored.sort((a, b) => b.score - a.score)
  return scored[0]?.voice || wavPool[0]
}

/**
 * Run AI voice matching (or apply manual overrides) across all scenes in `script.json`.
 */
export function matchAllScenesInScript(projectOrFile, options = {}) {
  const { data } = readScriptJson(projectOrFile)
  const { voices } = getVoiceCatalog()
  const forceAuto = Boolean(options.forceAuto)
  const globalVoiceId = options.voiceId || ''

  if (globalVoiceId) {
    data.defaultVoiceId = globalVoiceId
    data.voiceMode = globalVoiceId === 'auto' ? 'auto' : 'manual'
  }

  let primaryAnchorId = ''
  if (data.voiceMode !== 'manual' && (!globalVoiceId || globalVoiceId === 'auto')) {
    try {
      const sampleText = (data.scenes || []).slice(0, 6).map((s) => `${s.title || ''} ${s.narration || ''}`).join(' ')
      const anchorMatch = matchVoiceForScene(
        { title: data.title || '', narration: sampleText, role: 'narrator', emotion: '平静' },
        { ...data, _primaryVoiceId: '' },
        voices,
        '',
      )
      primaryAnchorId = anchorMatch?.voice?.id || ''
    } catch {}
  }

  const results = []
  data.scenes = (data.scenes || []).map((scene) => {
    const effectiveScene = forceAuto ? { ...scene, voiceId: 'auto', voiceLocked: false } : scene
    const matched = matchVoiceForScene(
      effectiveScene,
      { ...data, _primaryVoiceId: primaryAnchorId },
      voices,
      globalVoiceId,
    )
    const updated = {
      ...scene,
      voiceId: matched.voice.id,
      voiceName: matched.voice.name,
      voiceCategory: matched.voice.category,
      voiceLocked: matched.mode === 'manual' ? true : Boolean(scene.voiceLocked && !forceAuto),
      voiceMatchReason: matched.reason,
    }
    results.push({
      sceneId: updated.id,
      title: updated.title,
      voiceId: updated.voiceId,
      voiceName: updated.voiceName,
      category: updated.voiceCategory,
      mode: matched.mode,
      score: matched.score,
      reason: matched.reason,
    })
    return updated
  })

  const saved = writeScriptJson(projectOrFile, data)
  return {
    scriptPath: saved.scriptPath,
    voiceMode: saved.data.voiceMode,
    defaultVoiceId: saved.data.defaultVoiceId,
    matches: results,
  }
}

/**
 * Decode recorded microphone WebM/WAV or uploaded local audio binary, strip silence/rumble,
 * loudness-normalize to clean 24kHz mono WAV via FFmpeg, and register as a zero-shot clone voice pack.
 */
export async function cloneRecordedVoice({
  audioBase64,
  fileName = 'recorded-voice.webm',
  name = '',
  gender = 'female',
  tags = [],
  emotions = ['平静', '高兴', '激动'],
  roles = ['narrator'],
  promptText = '',
  stripSilence = true,
}) {
  const cleanB64 = String(audioBase64 || '').replace(/^data:[^;]+;base64,/, '').trim()
  if (!cleanB64) {
    throw new Error('录音或音频文件二进制内容为空，无法克隆声纹')
  }

  const packsDir = getVoicePacksDir()
  const tmpDir = join(packsDir, 'imported', '.tmp-clone')
  mkdirSync(tmpDir, { recursive: true })

  const safeSlug = String(name || 'my-voice')
    .trim()
    .replace(/[^\w\u4e00-\u9fff-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-voice'
  const stamp = Date.now()
  const rawExt = extname(String(fileName || 'mic.webm')).toLowerCase() || '.webm'
  const rawInputPath = join(tmpDir, `${safeSlug}-${stamp}${rawExt}`)
  const normalizedWav = join(tmpDir, `${safeSlug}-${stamp}-clean.wav`)

  writeFileSync(rawInputPath, Buffer.from(cleanB64, 'base64'))

  const { ffmpeg } = resolveBinaries()
  const baseFilter = 'highpass=f=80,loudnorm=I=-16:TP=-1.5:LRA=9'
  const trimFilter = stripSilence
    ? `${baseFilter},silenceremove=start_periods=1:start_threshold=-42dB:detection=peak`
    : baseFilter

  let convRes = await runCommandRedirected(
    ffmpeg,
    ['-y', '-i', rawInputPath, '-t', '16', '-ac', '1', '-ar', '24000', '-af', trimFilter, normalizedWav],
    { timeoutMs: 30_000 },
  )
  let probe = existsSync(normalizedWav) ? await probeAudioDuration(normalizedWav).catch(() => ({ durationSec: 0 })) : { durationSec: 0 }

  // If aggressive silence gate trimmed soft microphone audio below 0.5s, fallback cleanly without silence removal
  if (convRes.code !== 0 || probe.durationSec < 0.5) {
    convRes = await runCommandRedirected(
      ffmpeg,
      ['-y', '-i', rawInputPath, '-t', '16', '-ac', '1', '-ar', '24000', '-af', baseFilter, normalizedWav],
      { timeoutMs: 30_000 },
    )
    probe = existsSync(normalizedWav) ? await probeAudioDuration(normalizedWav).catch(() => ({ durationSec: 0 })) : { durationSec: 0 }
  }

  if (convRes.code !== 0 || !existsSync(normalizedWav) || probe.durationSec < 0.35) {
    try { rmSync(rawInputPath, { force: true }) } catch {}
    throw new Error(`克隆人声预处理失败 (有效发音时长 ${(probe.durationSec || 0).toFixed(2)}s 太短): ${convRes.stderr}`)
  }

  try {
    const imported = await importVoicePack({
      sourcePath: normalizedWav,
      id: `clone-${safeSlug}-${stamp}`,
      name: String(name || `我的声音克隆 (${safeSlug})`).trim(),
      category: '专属声纹克隆',
      gender: gender === 'male' ? 'male' : 'female',
      engine: 'indextts25',
      tags: ['我的声音', '零样本克隆', '自定义音色', ...(Array.isArray(tags) ? tags : [])],
      emotions,
      roles,
      promptText,
      copyToVoicePacks: true,
    })

    return {
      ok: true,
      voice: imported.importedVoices?.[0] || imported.voices?.[0] || null,
      durationSec: Number(probe.durationSec.toFixed(2)),
      normalizedSampleRate: 24000,
    }
  } finally {
    try { rmSync(rawInputPath, { force: true }) } catch {}
    try { rmSync(normalizedWav, { force: true }) } catch {}
  }
}
