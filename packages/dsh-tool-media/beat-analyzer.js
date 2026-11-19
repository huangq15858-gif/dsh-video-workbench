/**
 * Audio Beat, Downbeat & Energy-Drop Analyzer + Beat-Locked Scene/SFX Quantizer.
 * Uses FFmpeg 8kHz mono PCM decoding + onset energy-flux autocorrelation to detect
 * actual tempo (BPM), phase offset, bar downbeats, and musical energy drops on any
 * user-supplied BGM track (`.mp3`, `.wav`, `.m4a`, `.flac`, `.ogg`).
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { REPO_ROOT, resolveBinaries, runCommandRedirected } from '../shared/index.js'

/**
 * Analyze actual BPM, beat phase, bar downbeats, and structural drops from an audio file.
 */
export async function analyzeAudioBeatStructure(audioPath, opts = {}) {
  const absAudio = resolve(audioPath)
  if (!existsSync(absAudio)) {
    throw new Error(`BGM audio file not found for beat analysis: ${absAudio}`)
  }

  const minBpm = Math.max(60, Number(opts.minBpm) || 76)
  const maxBpm = Math.min(180, Number(opts.maxBpm) || 156)
  const { ffmpeg } = resolveBinaries()
  const tmpDir = join(REPO_ROOT, '.tmp')
  mkdirSync(tmpDir, { recursive: true })
  const rawPcm = join(tmpDir, `beat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.f32`)

  let samples
  const sr = 8000
  try {
    const res = await runCommandRedirected(
      ffmpeg,
      ['-y', '-v', 'error', '-i', absAudio, '-ac', '1', '-ar', String(sr), '-f', 'f32le', rawPcm],
      { timeoutMs: 45_000, signal: opts.signal },
    )
    if (res.code !== 0 || !existsSync(rawPcm)) {
      throw new Error(`FFmpeg beat decode failed: ${res.stderr || `code ${res.code}`}`)
    }
    const buf = readFileSync(rawPcm)
    samples = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.byteLength / 4))
  } finally {
    try {
      if (existsSync(rawPcm)) unlinkSync(rawPcm)
    } catch {}
  }

  const totalDurSec = Number((samples.length / sr).toFixed(4))
  if (samples.length < sr) {
    return {
      ok: true,
      analyzed: true,
      audioPath: absAudio,
      durationSec: totalDurSec,
      bpm: 112,
      beatSec: Number((60 / 112).toFixed(4)),
      phaseSec: 0,
      barOffset: 0,
      beats: [{ time: 0, strong: true, index: 0, barIndex: 0, beatInBar: 0, energy: 1 }],
      downbeats: [0],
      drops: [],
      energyCurve: [],
    }
  }

  // 20ms hop -> 50Hz RMS envelope
  const hop = 160
  const envSr = sr / hop
  const envLen = Math.floor(samples.length / hop)
  const env = new Float32Array(envLen)
  const flux = new Float32Array(envLen)

  let globalSum = 0
  for (let i = 0; i < envLen; i++) {
    let e = 0
    const off = i * hop
    for (let j = 0; j < hop; j++) {
      const s = samples[off + j]
      e += s * s
    }
    const rms = Math.sqrt(e / hop)
    env[i] = rms
    globalSum += rms
    flux[i] = i > 0 ? Math.max(0, rms - env[i - 1]) : 0
  }
  const meanEnv = envLen > 0 ? globalSum / envLen : 0.1

  // Comb autocorrelation over 1x, 2x, 4x beat lags to locate fundamental tempo
  let bestBpm = 100
  let bestScore = -1
  for (let bpm = minBpm; bpm <= maxBpm; bpm += 0.5) {
    const lag = (60 / bpm) * envSr
    let score = 0
    const limit = Math.min(envLen, Math.round(envSr * 120))
    for (let i = 0; i < limit; i++) {
      const j1 = Math.round(i + lag)
      const j2 = Math.round(i + lag * 2)
      const j4 = Math.round(i + lag * 4)
      if (j4 >= limit) break
      score += flux[i] * (flux[j1] * 0.52 + flux[j2] * 0.34 + flux[j4] * 0.24)
    }
    // Slight perceptual weighting toward modern editorial pulse center [86..132] BPM
    const centerBias = bpm >= 84 && bpm <= 134 ? 1.06 : 0.96
    const weighted = score * centerBias
    if (weighted > bestScore) {
      bestScore = weighted
      bestBpm = bpm
    }
  }

  // Fine phase offset search [0, beatSec) at 10ms resolution anchored to transient peaks
  const beatSec = 60 / bestBpm
  let phaseSec = 0
  let bestPhaseScore = -1
  for (let ph = 0; ph < beatSec; ph += 0.01) {
    let pScore = 0
    for (let t = ph; t < totalDurSec; t += beatSec) {
      const idx = Math.round(t * envSr)
      if (idx < flux.length) {
        const peak = Math.max(flux[Math.max(0, idx - 1)] || 0, flux[idx], flux[Math.min(flux.length - 1, idx + 1)] || 0)
        pScore += peak
      }
    }
    if (pScore > bestPhaseScore) {
      bestPhaseScore = pScore
      phaseSec = Number(ph.toFixed(3))
    }
  }

  // Raw beats starting from aligned phaseSec
  const rawBeats = []
  let idx = 0
  for (let t = phaseSec; t <= totalDurSec + 0.05; t += beatSec) {
    const frame = Math.min(envLen - 1, Math.max(0, Math.round(t * envSr)))
    const localFlux = Math.max(flux[Math.max(0, frame - 1)] || 0, flux[frame] || 0, flux[Math.min(envLen - 1, frame + 1)] || 0)
    const energy = Number(((env[frame] || 0) / Math.max(1e-4, meanEnv)).toFixed(3))
    rawBeats.push({
      time: Number(t.toFixed(4)),
      index: idx,
      energy,
      onset: localFlux,
    })
    idx++
  }

  // Determine strongest bar phase (0..3) so bar downbeats align to true bar-1 hits
  const modScores = [0, 0, 0, 0]
  for (const b of rawBeats) {
    modScores[b.index % 4] += b.onset * 0.7 + b.energy * 0.3
  }
  let barOffset = 0
  for (let m = 1; m < 4; m++) {
    if (modScores[m] > modScores[barOffset]) barOffset = m
  }

  // Per-2s energy bins + structural drops detection
  const energyCurve = []
  for (let sec = 0; sec + 1 < totalDurSec; sec += 2) {
    const i0 = Math.round(sec * envSr)
    const i1 = Math.min(envLen, Math.round((sec + 2) * envSr))
    if (i1 <= i0) continue
    let s = 0
    for (let k = i0; k < i1; k++) s += env[k]
    energyCurve.push({ sec, rms: Number((s / (i1 - i0)).toFixed(4)) })
  }

  const dropSet = new Set()
  const drops = []
  for (let bi = 1; bi < energyCurve.length; bi++) {
    const prev = energyCurve[bi - 1]
    const cur = energyCurve[bi]
    const jump = cur.rms / Math.max(1e-4, prev.rms)
    if (jump >= 1.24 && cur.rms >= meanEnv * 0.85) {
      // Snap drop timestamp to nearest downbeat or beat
      const target = cur.sec
      let bestBeat = rawBeats[0]
      let bestDist = Infinity
      for (const b of rawBeats) {
        const d = Math.abs(b.time - target)
        if (d < bestDist) {
          bestDist = d
          bestBeat = b
        }
      }
      if (bestBeat && !dropSet.has(bestBeat.index)) {
        dropSet.add(bestBeat.index)
        drops.push(bestBeat.time)
      }
    }
  }

  const beats = rawBeats.map((b) => {
    const beatInBar = (b.index - barOffset + 4000) % 4
    const barIndex = Math.floor((b.index - barOffset + 4) / 4)
    const strong = beatInBar === 0 || dropSet.has(b.index)
    return {
      time: b.time,
      strong,
      isDrop: dropSet.has(b.index),
      index: b.index,
      barIndex: Math.max(0, barIndex),
      beatInBar,
      energy: b.energy,
    }
  })

  const downbeats = beats.filter((b) => b.strong).map((b) => b.time)

  return {
    ok: true,
    analyzed: true,
    audioPath: absAudio,
    durationSec: totalDurSec,
    bpm: Number(bestBpm.toFixed(1)),
    beatSec: Number(beatSec.toFixed(4)),
    phaseSec,
    barOffset,
    beats,
    downbeats,
    drops,
    energyCurve,
  }
}

/**
 * Find the best matching beat/downbeat timestamp near or at/after a target time.
 */
export function snapTimeToBeatGrid(targetSec, beatMeta, { preferDownbeat = true, direction = 'forward', maxShiftSec = 1.8 } = {}) {
  const beats = Array.isArray(beatMeta?.beats) ? beatMeta.beats : []
  if (beats.length === 0) return Number(targetSec.toFixed(4))

  const pool = preferDownbeat ? beats.filter((b) => b.strong) : beats
  const searchList = pool.length > 0 ? pool : beats

  if (direction === 'nearest') {
    let best = targetSec
    let bestDiff = Infinity
    for (const b of searchList) {
      const t = typeof b === 'number' ? b : Number(b.time)
      const diff = Math.abs(t - targetSec)
      if (diff <= maxShiftSec && diff < bestDiff) {
        bestDiff = diff
        best = t
      }
    }
    return Number(best.toFixed(4))
  }

  for (const b of searchList) {
    const t = typeof b === 'number' ? b : Number(b.time)
    if (t >= targetSec - 0.04 && t - targetSec <= maxShiftSec) {
      return Number(t.toFixed(4))
    }
  }
  if (preferDownbeat) {
    return snapTimeToBeatGrid(targetSec, beatMeta, { preferDownbeat: false, direction, maxShiftSec })
  }
  return Number(targetSec.toFixed(4))
}

/**
 * Quantize scenes & subtitles cleanly to measured BGM beat timestamps.
 * - `subtitle-mv`: scene cut points align cleanly to beat/downbeat boundaries matching total duration / beatCounts.
 * - `tts-beat-sync`: preserves spoken speech duration and pads trailing silence cleanly to the next musical beat/downbeat.
 */
export function quantizeScenesToBeatGrid(scenes = [], beatMeta = {}, { mode = 'tts-beat-sync', fps = 30, targetDurationSec = 0 } = {}) {
  if (!Array.isArray(scenes) || scenes.length === 0) return []
  const beats = Array.isArray(beatMeta?.beats) && beatMeta.beats.length > 0 ? beatMeta.beats : []
  const beatStep = Number(beatMeta?.beatSec) || (60 / (Number(beatMeta?.bpm) || 112))
  const safeFps = Number(fps) > 0 ? Number(fps) : 30

  if (beats.length === 0) return scenes

  const normBeats = beats
    .map((b, i) => (typeof b === 'number' ? { time: b, strong: i % 4 === 0, index: i } : b))
    .filter((b) => Number.isFinite(Number(b?.time)))
    .sort((a, b) => a.time - b.time)

  const maxBgmDur = Number(beatMeta?.durationSec) || normBeats[normBeats.length - 1]?.time || 60
  // NEVER clamp user's targetDurationSec down to a shorter BGM file!
  // BGM loops seamlessly in FFmpeg (`-stream_loop -1`), so extend the beat grid to cover targetDurationSec.
  const capDur = targetDurationSec > 4 ? targetDurationSec : maxBgmDur
  if (normBeats.length > 0 && normBeats[normBeats.length - 1].time < capDur + 4) {
    const barOffset = Number(beatMeta?.barOffset) || 0
    let lastT = normBeats[normBeats.length - 1].time
    let nextIdx = (Number(normBeats[normBeats.length - 1].index) || normBeats.length - 1) + 1
    while (lastT < capDur + 4) {
      lastT = Number((lastT + beatStep).toFixed(4))
      normBeats.push({
        time: lastT,
        strong: (nextIdx - barOffset + 4000) % 4 === 0,
        index: nextIdx,
      })
      nextIdx++
    }
  }

  const updated = scenes.map((s) => ({ ...s }))

  if (mode === 'subtitle-mv') {
    const usableBeats = normBeats.filter((b) => b.time <= capDur + 0.1)
    const fallbackBeats = usableBeats.length >= scenes.length + 1 ? usableBeats : normBeats
    const totalAvailableBeats = Math.max(scenes.length, Math.round(capDur / beatStep))

    // Allocate beat counts honoring explicit `beatCount` hints (supports 0.5-beat blitzes) or proportional bar distribution
    const rawCounts = updated.map((sc, idx) => {
      const explicit = Number(sc.beatCount)
      if (Number.isFinite(explicit) && explicit >= 0.45) return explicit
      const hintDur = Number(sc.durationSec)
      if (Number.isFinite(hintDur) && hintDur >= 0.26 && targetDurationSec <= 0) {
        return Math.max(0.5, Number((hintDur / beatStep).toFixed(2)))
      }
      if (sc.stageSpec?.archetype === 'slash-climax' || sc.transition === 'flash-cut') return 1
      if (idx === 0 || idx === updated.length - 1) return 4
      return 3
    })

    const rawSum = rawCounts.reduce((a, b) => a + b, 0) || scenes.length
    const scale = targetDurationSec > 0 || rawSum > totalAvailableBeats ? totalAvailableBeats / rawSum : 1

    let beatCursor = 0
    let subBeatAcc = 0
    // Start scene 0 at frame 0 while syncing scene 1+ cuts strictly onto real beat or half-beat hits
    let curStartSec = 0
    for (let i = 0; i < updated.length; i++) {
      const sc = updated[i]
      const isLast = i === updated.length - 1
      const scaledRaw = rawCounts[i] * scale
      const spanBeats = scaledRaw <= 0.72 ? 0.5 : Math.max(1, Math.round(scaledRaw))

      if (spanBeats < 1) {
        subBeatAcc += spanBeats
        if (subBeatAcc >= 0.99) {
          beatCursor += Math.floor(subBeatAcc + 0.01)
          subBeatAcc = subBeatAcc - Math.floor(subBeatAcc + 0.01)
        }
      } else {
        if (i === 0 && beatMeta.phaseSec > 0.25 && beatMeta.phaseSec < beatStep * 1.2) {
          beatCursor = Math.max(1, Math.round(spanBeats) - 1)
        } else {
          beatCursor += Math.round(spanBeats)
        }
      }

      let nextBoundarySec
      if (isLast) {
        nextBoundarySec = targetDurationSec > 0
          ? Math.max(curStartSec + 1.2, Math.min(capDur, curStartSec + spanBeats * beatStep))
          : Math.min(maxBgmDur, Math.max(curStartSec + 1.5, curStartSec + spanBeats * beatStep))
      } else if (spanBeats < 1) {
        const halfSec = Math.max(0.27, spanBeats * beatStep)
        nextBoundarySec = curStartSec + halfSec
      } else {
        // Snap cut to nearest strong downbeat when span >= 4 beats to feel ultra-locked
        const candBeat = beatCursor < fallbackBeats.length ? fallbackBeats[beatCursor] : null
        let cutSec = candBeat && candBeat.time > curStartSec + 0.3 ? candBeat.time : curStartSec + spanBeats * beatStep
        if (spanBeats >= 4 && candBeat && !candBeat.strong) {
          const nearbyStrong = fallbackBeats.find((b) => b.strong && Math.abs(b.time - cutSec) <= beatStep * 1.1 && b.time > curStartSec + 0.5)
          if (nearbyStrong) {
            cutSec = nearbyStrong.time
            beatCursor = fallbackBeats.indexOf(nearbyStrong)
            subBeatAcc = 0
          }
        }
        nextBoundarySec = Math.max(curStartSec + 0.27, cutSec)
      }

      const startFrame = Math.round(curStartSec * safeFps)
      const endFrame = Math.max(startFrame + 8, Math.round(nextBoundarySec * safeFps))
      const durFrames = endFrame - startFrame
      const durSec = Number((durFrames / safeFps).toFixed(4))

      sc.startSec = Number((startFrame / safeFps).toFixed(4))
      sc.endSec = Number((endFrame / safeFps).toFixed(4))
      sc.durationSec = durSec
      sc.startFrame = startFrame
      sc.endFrame = endFrame
      sc.durationInFrames = durFrames
      sc.beatCutAligned = true

      // Align scene subtitle lines proportionally inside beat-locked scene
      const chunks = Array.isArray(sc.subChunks) && sc.subChunks.length > 0
        ? sc.subChunks
        : Array.isArray(sc.subtitles) && sc.subtitles.length > 0
          ? sc.subtitles.map((u) => u.text).filter(Boolean)
          : sc.subtitleText
            ? [sc.subtitleText]
            : sc.narration
              ? [sc.narration]
              : []

      if (chunks.length > 0) {
        const totalW = chunks.reduce((acc, c) => acc + Math.max(1, String(c).length), 0)
        let subCur = 0
        sc.subtitles = chunks.map((text, ci) => {
          const w = Math.max(1, String(text).length)
          const isLastSub = ci === chunks.length - 1
          const localEnd = isLastSub ? durSec : Math.min(durSec, Number((subCur + (durSec * w) / totalW).toFixed(3)))
          const item = {
            index: ci + 1,
            text: String(text).trim(),
            startSec: Number(subCur.toFixed(3)),
            endSec: Number(localEnd.toFixed(3)),
            startFrame: Math.floor(subCur * safeFps),
            endFrame: Math.ceil(localEnd * safeFps),
            sceneId: sc.id,
            localStartSec: Number(subCur.toFixed(3)),
            localEndSec: Number(localEnd.toFixed(3)),
            globalStartSec: Number((sc.startSec + subCur).toFixed(3)),
            globalEndSec: Number((sc.startSec + localEnd).toFixed(3)),
            globalStartFrame: startFrame + Math.floor(subCur * safeFps),
            globalEndFrame: startFrame + Math.ceil(localEnd * safeFps),
          }
          subCur = localEnd
          return item
        })
      }

      curStartSec = sc.endSec
    }
    return updated
  }

  // Mode 2: tts-beat-sync — honor TTS voice duration + pause, snap trailing boundary to next beat/downbeat
  // If user requested a specific targetDurationSec longer than raw speech, distribute musical breathing evenly
  const rawMinTotal = updated.reduce(
    (acc, sc) => acc + Math.max(Number(sc.durationSec) || 2.5, (Number(sc.voiceDurationSec) || 0) + (Number(sc.voiceLeadSec) ?? 0.28) + 0.2),
    0,
  )
  const extraPadPerScene =
    targetDurationSec > 4 && rawMinTotal > 2 && rawMinTotal < targetDurationSec * 0.96
      ? Math.min(4.2, (targetDurationSec - rawMinTotal) / Math.max(1, updated.length))
      : 0

  let cursorSec = 0
  let cursorFrame = 0
  for (let i = 0; i < updated.length; i++) {
    const sc = updated[i]
    const baseMinDur = Math.max(Number(sc.durationSec) || 2.5, (Number(sc.voiceDurationSec) || 0) + (Number(sc.voiceLeadSec) ?? 0.28) + 0.2)
    const minDur = baseMinDur + extraPadPerScene
    const minEnd = cursorSec + minDur
    const snappedEnd = i === updated.length - 1
      ? Math.max(minEnd, targetDurationSec > 4 && rawMinTotal < targetDurationSec ? Math.min(targetDurationSec, minEnd + 2.0) : minEnd)
      : snapTimeToBeatGrid(minEnd, { beats: normBeats }, { preferDownbeat: extraPadPerScene >= beatStep, direction: 'forward', maxShiftSec: beatStep * 1.45 })

    const endFrame = Math.max(cursorFrame + 18, Math.round(snappedEnd * safeFps))
    const durFrames = endFrame - cursorFrame
    const durSec = Number((durFrames / safeFps).toFixed(4))

    sc.startFrame = cursorFrame
    sc.durationInFrames = durFrames
    sc.endFrame = endFrame
    sc.startSec = Number((cursorFrame / safeFps).toFixed(4))
    sc.endSec = Number((endFrame / safeFps).toFixed(4))
    sc.durationSec = durSec
    sc.beatCutAligned = true

    if (Array.isArray(sc.subtitles)) {
      sc.subtitles = sc.subtitles.map((sub) => {
        const l0 = Number(sub.localStartSec ?? sub.startSec ?? 0)
        const l1 = Math.min(durSec, Number(sub.localEndSec ?? sub.endSec ?? durSec))
        return {
          ...sub,
          sceneId: sc.id,
          localStartSec: l0,
          localEndSec: l1,
          globalStartSec: Number((sc.startSec + l0).toFixed(3)),
          globalEndSec: Number((sc.startSec + l1).toFixed(3)),
          globalStartFrame: cursorFrame + Math.round(l0 * safeFps),
          globalEndFrame: cursorFrame + Math.round(l1 * safeFps),
        }
      })
    }

    cursorFrame = endFrame
    cursorSec = sc.endSec
  }

  return updated
}

/**
 * Align transition & impact SFX cues onto real beat timestamps inside every scene.
 */
export function choreographBeatSfxCues(scenes = [], beatMeta = {}, opts = {}) {
  const beats = Array.isArray(beatMeta?.beats) ? beatMeta.beats : []
  const drops = Array.isArray(beatMeta?.drops) ? beatMeta.drops : []
  const total = scenes.length
  const sfxPick = opts.sfxPick || ((kind) => `audio/sfx/${kind}.wav`)

  return scenes.map((sc, idx) => {
    const startSec = Number(sc.startSec || 0)
    const dur = Math.max(0.5, Number(sc.durationSec) || 4)
    const endSec = startSec + dur
    const cues = []

    const nearDrop = drops.some((dt) => Math.abs(dt - startSec) <= 0.35)
    const arch = sc.stageSpec?.archetype || ''
    const layoutStr = String(sc.layout || '')
    const blueStr = `${sc.visualBlueprint || ''} ${sc.motionNotes || ''}`
    const isAction = /slash|clash|oath|cavalry|duel/i.test(arch) || sc.transition === 'flash-cut' || sc.transition === 'slash-wipe' || /冲击|爆发|劈|闪切|撞击|跃迁/i.test(blueStr)
    const isMapOrData = /strategic-map|scroll-calligraphy|metric-dashboard|workflow-steps/i.test(`${arch} ${layoutStr}`)

    // 1. Cut-in impact right on downbeat / half-beat boundary (offsetSec = 0)
    if (idx === 0) {
      cues.push({ type: 'hit', path: sfxPick('hit'), offsetSec: 0, volume: 0.9, pan: 0 })
      cues.push({ type: 'shimmer_swell', path: sfxPick('shimmer_swell'), offsetSec: 0.02, volume: 0.72, pan: 0 })
    } else if (nearDrop || sc.transition === 'zoom-punch' || arch === 'plaque-summary' || sc.transition === 'glitch-cut') {
      cues.push({ type: sc.transition === 'glitch-cut' ? 'glitch' : 'sub_drop', path: sfxPick(sc.transition === 'glitch-cut' ? 'glitch' : 'sub_drop'), offsetSec: 0, volume: 0.94, pan: 0 })
      cues.push({ type: 'crash_cym', path: sfxPick('crash_cym'), offsetSec: 0.015, volume: 0.68, pan: 0.12 })
    } else if (isAction) {
      cues.push({ type: 'slash', path: sfxPick('slash'), offsetSec: 0, volume: 0.88, pan: idx % 2 === 0 ? -0.18 : 0.18 })
      cues.push({ type: 'hit', path: sfxPick('hit'), offsetSec: 0.01, volume: 0.82, pan: 0 })
    } else if (isMapOrData) {
      cues.push({ type: 'stamp', path: sfxPick('stamp'), offsetSec: 0, volume: 0.84, pan: 0 })
      cues.push({ type: 'flip', path: sfxPick('flip'), offsetSec: 0.02, volume: 0.62, pan: -0.1 })
    } else {
      cues.push({ type: 'whoosh', path: sfxPick('whoosh'), offsetSec: 0, volume: 0.8, pan: idx % 2 === 0 ? -0.1 : 0.1 })
      if (idx % 3 === 0) {
        cues.push({ type: 'hit', path: sfxPick('hit'), offsetSec: 0.01, volume: 0.68, pan: 0 })
      }
    }

    // 2. Snap mid-scene SFX hits directly to internal BGM beats (supports any genre)
    const internalBeats = beats
      .map((b) => (typeof b === 'number' ? { time: b, strong: true } : b))
      .filter((b) => b.time > startSec + 0.28 && b.time < endSec - 0.36)

    const preferredBeats = internalBeats.filter((b) => b.strong)
    const chosenHits = (preferredBeats.length > 0 ? preferredBeats : internalBeats).slice(0, dur >= 2.8 ? 2 : 1)
    for (let hi = 0; hi < chosenHits.length; hi++) {
      const targetBeat = chosenHits[hi]
      const relSec = Number((targetBeat.time - startSec).toFixed(3))
      const beatType = arch === 'strategic-map' ? 'stamp' : arch === 'scroll-calligraphy' ? 'flip' : isMapOrData ? 'counter' : isAction ? 'slash' : (hi % 2 === 0 ? 'pop_soft' : 'hit')
      cues.push({ type: beatType, path: sfxPick(beatType), offsetSec: relSec, volume: 0.78, pan: (idx + hi) % 2 === 0 ? 0.22 : -0.22 })
    }

    // 3. Pre-cut riser/suck leading tightly INTO the next scene's downbeat cut
    if (idx < total - 1 && dur >= 0.95) {
      const riseDur = Math.min(0.42, dur * 0.35)
      const preOff = Number(Math.max(0.22, dur - riseDur).toFixed(3))
      cues.push({
        type: idx % 2 === 0 ? 'riser' : 'suck',
        path: sfxPick(idx % 2 === 0 ? 'riser' : 'suck'),
        offsetSec: preOff,
        volume: 0.66,
        pan: 0,
        d: riseDur,
      })
    }

    return {
      ...sc,
      sfxCues: cues,
    }
  })
}
