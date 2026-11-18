import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * Distilled Shotcraft Primitives & LLM Skills Prompt Builder
 *
 * Incorporates engineering patterns and component abstractions adapted cleanly under open-source
 * permissive licenses from:
 * - Vincentwei1021/video-shotcraft (Apache-2.0): PageCam, ClipCard, DigitRoll, FlashCut, ShotCaption
 * - remotion-dev/skills (MIT/Apache-2.0): Frame-deterministic Remotion animation & TypeScript best practices
 * - heygen-com/hyperframes (Apache-2.0): Deterministic seekable HTML5/GSAP composition standards
 */

export const SHOTCRAFT_TSX_SOURCE = `/**
 * @dsh-video/shotcraft — Reusable Remotion + Three.js 3D Vibecoding Motion Primitives
 * Adapted from Apache-2.0 open-source video-shotcraft, @remotion/three & remotion-dev/skills patterns.
 * Strictly driven by useCurrentFrame() + spring() + interpolate() + THREE — zero CSS transition / keyframes.
 */
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import * as THREE from 'three'
import { ThreeCanvas } from '@remotion/three'

export { THREE, ThreeCanvas }

export const FONT_SANS = "'Noto Sans SC', 'Source Han Sans SC', 'PingFang SC', 'HarmonyOS Sans SC', sans-serif"
export const FONT_SERIF = "'Source Han Serif SC Heavy', 'Noto Serif SC', 'Noto Sans SC', serif"
export const FONT_MONO = "'JetBrains Mono', 'Cascadia Mono', 'Liberation Mono', ui-monospace, monospace"

export interface PageCamProps {
  children: React.ReactNode
  startFrame?: number
  durationFrames?: number
  fromScale?: number
  toScale?: number
  fromX?: number
  toX?: number
  fromY?: number
  toY?: number
  tiltDeg?: number
}

export const PageCam: React.FC<PageCamProps> = ({
  children,
  startFrame = 0,
  durationFrames = 90,
  fromScale = 1.06,
  toScale = 1.0,
  fromX = 0,
  toX = 0,
  fromY = 18,
  toY = 0,
  tiltDeg = 0,
}) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationFrames)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const eased = 1 - Math.pow(1 - progress, 3)
  const scale = fromScale + (toScale - fromScale) * eased
  const x = fromX + (toX - fromX) * eased
  const y = fromY + (toY - fromY) * eased
  const tilt = tiltDeg * (1 - eased)

  return (
    <AbsoluteFill
      style={{
        transform: \`perspective(1400px) translate3d(\${x}px, \${y}px, 0) scale(\${scale}) rotateX(\${tilt}deg)\`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </AbsoluteFill>
  )
}

export interface ClipCardProps {
  children: React.ReactNode
  delay?: number
  fromY?: number
  tiltDeg?: number
  accentColor?: string
  bg?: string
  borderColor?: string
  padding?: number | string
  borderRadius?: number
  style?: React.CSSProperties
}

export const ClipCard: React.FC<ClipCardProps> = ({
  children,
  delay = 0,
  fromY = 36,
  tiltDeg = -2,
  accentColor = '#38BDF8',
  bg = 'rgba(15, 23, 42, 0.78)',
  borderColor = 'rgba(255, 255, 255, 0.14)',
  padding = 28,
  borderRadius = 20,
  style = {},
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 150, mass: 0.9 },
  })
  const y = interpolate(spr, [0, 1], [fromY, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const opacity = interpolate(spr, [0, 0.35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const rot = interpolate(spr, [0, 1], [tiltDeg, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scale = interpolate(spr, [0, 1], [0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        background: bg,
        border: \`1px solid \${borderColor}\`,
        borderRadius,
        padding,
        boxShadow: \`0 24px 64px rgba(0, 0, 0, 0.45), 0 0 0 1px \${accentColor}22 inset\`,
        opacity,
        transform: \`translate3d(0, \${y}px, 0) scale(\${scale}) rotate(\${rot}deg)\`,
        fontFamily: FONT_SANS,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface DigitRollProps {
  from?: number
  to: number
  startFrame?: number
  durationFrames?: number
  prefix?: string
  suffix?: string
  decimals?: number
  color?: string
  fontSize?: number
  style?: React.CSSProperties
}

export const DigitRoll: React.FC<DigitRollProps> = ({
  from = 0,
  to,
  startFrame = 4,
  durationFrames = 36,
  prefix = '',
  suffix = '',
  decimals = 0,
  color = '#F8FAFC',
  fontSize = 68,
  style = {},
}) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationFrames)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const eased = 1 - Math.pow(1 - progress, 4)
  const val = from + (to - from) * eased
  const formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-US')

  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontWeight: 800,
        fontSize,
        color,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

export interface FlashCutProps {
  atFrame?: number
  durationFrames?: number
  color?: string
  mode?: 'flash' | 'wipe' | 'iris'
}

export const FlashCut: React.FC<FlashCutProps> = ({
  atFrame = 0,
  durationFrames = 10,
  color = '#FFFFFF',
  mode = 'flash',
}) => {
  const frame = useCurrentFrame()
  const local = frame - atFrame
  if (local < 0 || local > durationFrames) return null

  const t = local / Math.max(1, durationFrames)
  if (mode === 'wipe') {
    const x = interpolate(t, [0, 0.5, 1], [-100, 0, 100], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    return (
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: \`linear-gradient(90deg, transparent, \${color}CC, transparent)\`,
          transform: \`translateX(\${x}%)\`,
          zIndex: 80,
        }}
      />
    )
  }

  const opacity = t < 0.25 ? t / 0.25 : 1 - (t - 0.25) / 0.75
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundColor: color,
        opacity: Math.max(0, Math.min(0.65, opacity * 0.65)),
        zIndex: 80,
      }}
    />
  )
}

export interface SubtitleCue {
  index?: number
  text: string
  startFrame: number
  endFrame: number
}

export interface ShotCaptionProps {
  subtitles?: SubtitleCue[]
  frameOffset?: number
  accentColor?: string
  isPortrait?: boolean
  bottomPx?: number
}

export const ShotCaption: React.FC<ShotCaptionProps> = ({
  subtitles = [],
  frameOffset = 0,
  accentColor = '#38BDF8',
  isPortrait = false,
  bottomPx,
}) => {
  const frame = useCurrentFrame()
  const { height } = useVideoConfig()
  const globalFrame = frame + frameOffset
  const active = subtitles.find((s) => globalFrame >= s.startFrame && globalFrame <= s.endFrame)
  if (!active || !active.text) return null

  const enter = interpolate(globalFrame, [active.startFrame, active.startFrame + 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const resolvedBottom =
    typeof bottomPx === 'number' && bottomPx > 0
      ? bottomPx
      : isPortrait
        ? Math.round(height * 0.22)
        : Math.round(height * 0.13)

  return (
    <div
      style={{
        position: 'absolute',
        left: '6%',
        right: '6%',
        bottom: resolvedBottom,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 60,
        opacity: enter,
        transform: \`translateY(\${(1 - enter) * 8}px)\`,
      }}
    >
      <div
        style={{
          maxWidth: isPortrait ? '92%' : '76%',
          padding: isPortrait ? '12px 22px' : '11px 28px',
          borderRadius: 14,
          background: 'rgba(8, 12, 20, 0.84)',
          border: \`1px solid \${accentColor}55\`,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          color: '#F8FAFC',
          fontFamily: FONT_SANS,
          fontSize: isPortrait ? 34 : 30,
          fontWeight: 700,
          lineHeight: 1.35,
          textAlign: 'center',
          letterSpacing: '0.02em',
        }}
      >
        {active.text}
      </div>
    </div>
  )
}

export interface AIBadgeProps {
  visible?: boolean
  text?: string
  accentColor?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | string
}

export const AIBadge: React.FC<AIBadgeProps> = ({
  visible = true,
  text = 'AI 辅助创作',
  accentColor = '#38BDF8',
  position = 'top-right',
}) => {
  const { width, height } = useVideoConfig()
  const isPortrait = width < height
  if (!visible) return null
  const topPx = isPortrait ? Math.round(height * 0.088) : 22
  const bottomPx = isPortrait ? Math.round(height * 0.20) : 28
  const sidePx = 26
  const posKey = String(position || 'top-right').toLowerCase()
  const posStyle: React.CSSProperties =
    posKey === 'top-left'
      ? { top: topPx, left: sidePx }
      : posKey === 'bottom-left'
        ? { bottom: bottomPx, left: sidePx }
        : posKey === 'bottom-right'
          ? { bottom: bottomPx, right: sidePx }
          : { top: topPx, right: sidePx }
  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
        zIndex: 70,
        padding: isPortrait ? '4px 11px' : '5px 13px',
        borderRadius: 999,
        background: 'rgba(10, 14, 24, 0.72)',
        border: \`1px solid \${accentColor}55\`,
        color: '#E2E8F0',
        fontFamily: FONT_SANS,
        fontSize: isPortrait ? 13 : 15,
        fontWeight: 600,
        letterSpacing: '0.03em',
        backdropFilter: 'blur(6px)',
      }}
    >
      {text}
    </div>
  )
}

export interface HotspotMarkItem {
  fx?: number
  fy?: number
  fw?: number
  fh?: number
  x?: number
  y?: number
  w?: number
  h?: number
  style?: string
  label?: string
  tone?: 'accent' | 'gold'
  shape?: 'box' | 'ring'
  startFrame?: number
}

export interface CamKeyframe {
  t: number
  fx: number
  fy: number
  z: number
}

export const AppWindow: React.FC<{
  title?: string
  kicker?: string
  brandMark?: string
  accentColor?: string
  goldColor?: string
  theme?: 'dark' | 'light'
  style?: React.CSSProperties
  children?: React.ReactNode
}> = ({
  title = '',
  kicker = '',
  brandMark = '',
  accentColor = '#45D1B2',
  goldColor = '#F6BA6F',
  theme = 'dark',
  style = {},
  children,
}) => {
  const isLight = theme === 'light'
  const cleanLogo = brandMark ? brandMark.replace(/^\\.?[\\\\/]+/, '').replace(/\\\\/g, '/') : ''
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 18,
        overflow: 'hidden',
        background: isLight ? '#F8FAFC' : '#0B1514',
        border: \`1.5px solid \${accentColor}55\`,
        boxShadow: \`0 32px 84px rgba(0,0,0,0.62), 0 0 0 1px rgba(255,255,255,0.08) inset\`,
        ...style,
      }}
    >
      <div
        style={{
          height: 40,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isLight ? 'rgba(226,232,240,0.92)' : 'rgba(13,26,25,0.95)',
          borderBottom: isLight ? '1px solid rgba(15,23,42,0.1)' : \`1px solid \${accentColor}26\`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 7 }}>
            <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FF5F56' }} />
            <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FFBD2E' }} />
            <span style={{ width: 11, height: 11, borderRadius: 99, background: '#27C93F' }} />
          </div>
          {cleanLogo ? (
            <Img src={staticFile(cleanLogo)} style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover', marginLeft: 4 }} />
          ) : null}
          {title ? (
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 14,
                fontWeight: 700,
                color: isLight ? '#0F172A' : '#E2E8F0',
                letterSpacing: '0.02em',
              }}
            >
              {title}
            </span>
          ) : null}
        </div>
        {kicker ? (
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12,
              fontWeight: 700,
              color: goldColor,
              padding: '3px 10px',
              borderRadius: 999,
              background: isLight ? 'rgba(15,23,42,0.07)' : \`rgba(255,255,255,0.06)\`,
            }}
          >
            {kicker}
          </span>
        ) : null}
      </div>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', background: isLight ? '#FFFFFF' : '#081110' }}>
        {children}
      </div>
    </div>
  )
}

export const HotspotMark: React.FC<{
  item: HotspotMarkItem
  accentColor?: string
  goldColor?: string
}> = ({ item, accentColor = '#45D1B2', goldColor = '#F6BA6F' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const startF = Math.max(0, Number(item.startFrame || 6))
  const sp = spring({ frame: Math.max(0, frame - startF), fps, config: { damping: 14, stiffness: 200 } })
  if (frame < startF) return null
  const col = item.tone === 'gold' ? goldColor : accentColor
  const pulse = 0.72 + 0.28 * Math.sin((frame - startF) * 0.22)
  const wPct = Math.max(3, Number(item.fw ?? item.w ?? 0.18) * 100)
  const hPct = Math.max(3, Number(item.fh ?? item.h ?? 0.12) * 100)
  const rawL = item.fx == null && item.x != null ? Number(item.x) * 100 : Number(item.fx ?? 0.5) * 100 - wPct / 2
  const rawT = item.fy == null && item.y != null ? Number(item.y) * 100 : Number(item.fy ?? 0.5) * 100 - hPct / 2
  const lPct = Math.max(0, Math.min(100 - wPct, rawL))
  const tPct = Math.max(0, Math.min(100 - hPct, rawT))
  const placeBelow = tPct < 14
  return (
    <div
      style={{
        position: 'absolute',
        left: \`\${lPct.toFixed(2)}%\`,
        top: \`\${tPct.toFixed(2)}%\`,
        width: \`\${wPct.toFixed(2)}%\`,
        height: \`\${hPct.toFixed(2)}%\`,
        borderRadius: item.shape === 'ring' ? 999 : 12,
        border: \`2.5px solid \${col}\`,
        boxShadow: \`0 0 0 4px rgba(0,0,0,0.35), 0 0 24px \${col}88\`,
        opacity: interpolate(sp, [0, 1], [0, pulse]),
        transform: \`scale(\${interpolate(sp, [0, 1], [1.18, 1])})\`,
        pointerEvents: 'none',
        zIndex: 15,
      }}
    >
      {item.label ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            ...(placeBelow ? { top: 'calc(100% + 8px)' } : { bottom: 'calc(100% + 8px)' }),
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            padding: '5px 12px',
            borderRadius: 999,
            background: 'rgba(6, 14, 14, 0.92)',
            border: \`1.5px solid \${col}\`,
            color: '#F8FAFC',
            fontFamily: FONT_SANS,
            fontSize: 16,
            fontWeight: 800,
            boxShadow: '0 8px 20px rgba(0,0,0,0.55)',
          }}
        >
          {item.label}
        </div>
      ) : null}
    </div>
  )
}

export const FocusShot: React.FC<{
  src: string
  cams?: CamKeyframe[]
  marks?: HotspotMarkItem[]
  mediaWidth?: number
  mediaHeight?: number
  fitMode?: 'contain' | 'cover'
  accentColor?: string
  goldColor?: string
}> = ({
  src,
  cams = [],
  marks = [],
  mediaWidth = 0,
  mediaHeight = 0,
  fitMode = 'contain',
  accentColor = '#45D1B2',
  goldColor = '#F6BA6F',
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const cleanRel = String(src || '').replace(/^\\.?[\\\\/]+/, '').replace(/\\\\/g, '/')
  const p = Math.min(1, frame / Math.max(1, durationInFrames - 1))
  const normKey = (rawKey: any, idx: number, totalLen: number) => {
    const r = rawKey || {}
    const tVal = Number.isFinite(Number(r.t))
      ? Number(r.t)
      : Number.isFinite(Number(r.at))
        ? Number(r.at)
        : idx / Math.max(1, totalLen - 1)
    const fxVal = Number.isFinite(Number(r.fx))
      ? Number(r.fx)
      : Number.isFinite(Number(r.x))
        ? Number(r.x)
        : 0.5
    const fyVal = Number.isFinite(Number(r.fy))
      ? Number(r.fy)
      : Number.isFinite(Number(r.y))
        ? Number(r.y)
        : 0.5
    const zVal = Number.isFinite(Number(r.z))
      ? Number(r.z)
      : Number.isFinite(Number(r.s))
        ? Number(r.s)
        : 1.0
    return { t: tVal, fx: fxVal, fy: fyVal, z: Math.max(0.5, zVal) }
  }
  const rawArr = Array.isArray(cams) ? cams.map((k, ki) => normKey(k, ki, cams.length)) : []
  const keys = rawArr.length >= 2
    ? [...rawArr].sort((a, b) => a.t - b.t)
    : rawArr.length === 1
      ? [rawArr[0], { ...rawArr[0], t: 1 }]
      : [{ t: 0, fx: 0.5, fy: 0.5, z: 1.0 }, { t: 1, fx: 0.5, fy: 0.5, z: 1.06 }]

  let fx = keys[0].fx
  let fy = keys[0].fy
  let z = keys[0].z
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (p >= a.t && p <= b.t) {
      const local = (p - a.t) / Math.max(0.001, b.t - a.t)
      const ease = local * local * (3 - 2 * local)
      fx = a.fx + (b.fx - a.fx) * ease
      fy = a.fy + (b.fy - a.fy) * ease
      z = a.z + (b.z - a.z) * ease
      break
    }
    if (p > b.t) {
      fx = b.fx; fy = b.fy; z = b.z
    }
  }
  const tx = Math.max(1 - z, Math.min(0, 0.5 - fx * z)) * 100
  const ty = Math.max(1 - z, Math.min(0, 0.5 - fy * z)) * 100
  const isVid = /\\.(mp4|mov|webm|mkv)$/i.test(cleanRel)
  const hasAspect = Number(mediaWidth) > 0 && Number(mediaHeight) > 0
  const stageStyle: React.CSSProperties = hasAspect
    ? {
        position: 'relative',
        aspectRatio: \`\${Number(mediaWidth)} / \${Number(mediaHeight)}\`,
        maxWidth: '100%',
        maxHeight: '100%',
        height: '100%',
        width: 'auto',
        margin: 'auto',
        transformOrigin: '0 0',
        transform: \`translate(\${tx.toFixed(3)}%, \${ty.toFixed(3)}%) scale(\${z.toFixed(4)})\`,
      }
    : {
        position: 'relative',
        width: '100%',
        height: '100%',
        transformOrigin: '0 0',
        transform: \`translate(\${tx.toFixed(3)}%, \${ty.toFixed(3)}%) scale(\${z.toFixed(4)})\`,
      }
  const imgFit = hasAspect ? 'fill' : fitMode

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={stageStyle}>
        {cleanRel ? (
          isVid ? (
            <OffthreadVideo src={staticFile(cleanRel)} style={{ width: '100%', height: '100%', objectFit: imgFit }} muted />
          ) : (
            <Img src={staticFile(cleanRel)} style={{ width: '100%', height: '100%', objectFit: imgFit }} />
          )
        ) : null}
        {(marks || []).map((m, mi) => (
          <HotspotMark key={mi} item={m} accentColor={accentColor} goldColor={goldColor} />
        ))}
      </div>
    </div>
  )
}

export const WorkflowBar: React.FC<{
  steps?: string[]
  activeStep?: number
  sectionLabel?: string
  accentColor?: string
  goldColor?: string
}> = ({ steps = [], activeStep = 0, sectionLabel = '', accentColor = '#45D1B2', goldColor = '#F6BA6F' }) => {
  const { width, height } = useVideoConfig()
  const isPortrait = width < height
  if (!steps.length && !sectionLabel) return null
  return (
    <div
      style={{
        position: 'absolute',
        top: isPortrait ? Math.round(height * 0.042) : 22,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: isPortrait ? 6 : 10,
        padding: isPortrait ? '6px 14px' : '7px 18px',
        borderRadius: 999,
        background: 'rgba(8, 16, 15, 0.82)',
        border: \`1px solid \${accentColor}44\`,
        boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
        zIndex: 68,
        pointerEvents: 'none',
      }}
    >
      {steps.map((st, si) => {
        const isActive = si === activeStep
        const isDone = si < activeStep
        return (
          <div key={si} style={{ display: 'flex', alignItems: 'center', gap: isPortrait ? 6 : 8 }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 999,
                background: isActive ? \`linear-gradient(90deg, \${accentColor}, \${goldColor})\` : isDone ? \`\${accentColor}24\` : 'transparent',
                color: isActive ? '#061211' : isDone ? accentColor : '#94A3B8',
                fontFamily: FONT_SANS,
                fontSize: isPortrait ? 14 : 15,
                fontWeight: isActive ? 900 : 700,
              }}
            >
              {st}
            </span>
            {si < steps.length - 1 ? <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 13 }}>›</span> : null}
          </div>
        )
      })}
      {sectionLabel ? (
        <span style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: goldColor, marginLeft: steps.length ? 8 : 0 }}>
          {sectionLabel}
        </span>
      ) : null}
    </div>
  )
}

export const BeforeAfterWipe: React.FC<{
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
  accentColor?: string
  goldColor?: string
}> = ({ beforeSrc, afterSrc, beforeLabel = 'MODE A', afterLabel = 'MODE B', accentColor = '#45D1B2', goldColor = '#F6BA6F' }) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const p = Math.min(1, frame / Math.max(1, durationInFrames - 1))
  const split = 0.5 + 0.34 * Math.sin(p * Math.PI * 2 - Math.PI / 2)
  const bRel = String(beforeSrc || '').replace(/^\\.?[\\\\/]+/, '').replace(/\\\\/g, '/')
  const aRel = String(afterSrc || '').replace(/^\\.?[\\\\/]+/, '').replace(/\\\\/g, '/')
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#07100F' }}>
      {bRel ? <Img src={staticFile(bRel)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} /> : null}
      {aRel ? (
        <div style={{ position: 'absolute', inset: 0, clipPath: \`inset(0 0 0 \${(split * 100).toFixed(2)}%)\` }}>
          <Img src={staticFile(aRel)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: \`\${(split * 100).toFixed(2)}%\`,
          width: 3,
          background: \`linear-gradient(180deg, \${accentColor}, \${goldColor})\`,
          boxShadow: \`0 0 18px \${accentColor}\`,
          transform: 'translateX(-1.5px)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 36,
            height: 36,
            borderRadius: 999,
            background: '#081312',
            border: \`2px solid \${goldColor}\`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F8FAFC',
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 900,
          }}
        >
          ⇆
        </div>
      </div>
      <div style={{ position: 'absolute', top: 18, left: 18, padding: '6px 14px', borderRadius: 999, background: 'rgba(6,14,14,0.88)', border: \`1px solid \${accentColor}88\`, color: accentColor, fontFamily: FONT_SANS, fontSize: 16, fontWeight: 800, zIndex: 12 }}>
        {beforeLabel}
      </div>
      <div style={{ position: 'absolute', top: 18, right: 18, padding: '6px 14px', borderRadius: 999, background: 'rgba(6,14,14,0.88)', border: \`1px solid \${goldColor}88\`, color: goldColor, fontFamily: FONT_SANS, fontSize: 16, fontWeight: 800, zIndex: 12 }}>
        {afterLabel}
      </div>
    </div>
  )
}

export const MetricPanel: React.FC<{
  label: string
  value: number
  suffix?: string
  subLabel?: string
  gridCount?: number
  accentColor?: string
  goldColor?: string
}> = ({ label, value, suffix = '', subLabel = '', gridCount = 20, accentColor = '#45D1B2', goldColor = '#F6BA6F' }) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const p = interpolate(frame, [6, Math.min(durationInFrames - 8, 52)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const eased = 1 - Math.pow(1 - p, 3)
  const lit = Math.round(eased * gridCount)
  return (
    <div style={{ background: 'rgba(10, 22, 21, 0.88)', border: \`1.5px solid \${accentColor}44\`, borderRadius: 20, padding: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: 20, fontWeight: 800, color: '#E2E8F0' }}>{label}</span>
        {subLabel ? <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: goldColor, fontWeight: 700 }}>{subLabel}</span> : null}
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 56, fontWeight: 900, color: accentColor, lineHeight: 1.05 }}>
        <DigitRoll from={0} to={value} suffix={suffix} startFrame={6} durationFrames={46} color={accentColor} fontSize={56} />
      </div>
      <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: \`\${(eased * 100).toFixed(1)}%\`, background: \`linear-gradient(90deg, \${accentColor}, \${goldColor})\` }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
        {Array.from({ length: gridCount }, (_, gi) => (
          <div
            key={gi}
            style={{
              height: 14,
              borderRadius: 4,
              background: gi < lit ? (gi % 4 === 0 ? goldColor : accentColor) : 'rgba(255,255,255,0.08)',
              opacity: gi < lit ? 0.92 : 0.45,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export interface EndNoticeProps {
  text?: string
  accentColor?: string
  tailSeconds?: number
}

export const EndNotice: React.FC<EndNoticeProps> = ({
  text = '本片画面与配乐由 DeepSeek Harness AI 编程辅助生成 · 语音由 IndexTTS-2.5 合成',
  accentColor = '#38BDF8',
  tailSeconds = 2.2,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames, width, height } = useVideoConfig()
  const tailFrames = Math.max(12, Math.round(fps * tailSeconds))
  const startF = Math.max(0, durationInFrames - tailFrames)
  if (frame < startF) return null

  const alpha = interpolate(frame, [startF, startF + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const isPortrait = width < height

  return (
    <div
      style={{
        position: 'absolute',
        left: '6%',
        right: '6%',
        bottom: isPortrait ? Math.round(height * 0.20) : Math.round(height * 0.036),
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: alpha,
        zIndex: 75,
      }}
    >
      <div
        style={{
          padding: isPortrait ? '4px 14px' : '5px 16px',
          borderRadius: 999,
          background: 'rgba(6, 10, 18, 0.84)',
          border: \`1px solid \${accentColor}44\`,
          color: '#CBD5E1',
          fontFamily: FONT_SANS,
          fontSize: isPortrait ? 13 : 14,
          fontWeight: 600,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          maxWidth: '92%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </div>
  )
}

export interface AvatarOverlayProps {
  clipPath?: string
  layout?: 'fullscreen' | 'pip-bl' | 'pip-br' | 'off' | string
  accentColor?: string
  muted?: boolean
}

export const AvatarOverlay: React.FC<AvatarOverlayProps> = ({
  clipPath,
  layout = 'pip-br',
  accentColor = '#22D3EE',
  muted = true,
}) => {
  const { width, height } = useVideoConfig()
  if (!clipPath || layout === 'off') return null
  const isPortrait = width < height
  const cleanRel = String(clipPath).replace(/^\\.?[\\\\/]+/, '').replace(/\\\\/g, '/')

  if (layout === 'fullscreen') {
    return (
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 25, justifyContent: 'flex-end', alignItems: 'center' }}>
        <OffthreadVideo
          src={staticFile(cleanRel)}
          transparent
          muted={muted}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </AbsoluteFill>
    )
  }

  const boxWidth = isPortrait ? Math.round(width * 0.34) : Math.round(width * 0.22)
  const boxHeight = Math.round(boxWidth * 1.125)
  const sidePx = isPortrait ? 28 : 42
  const bottomPx = isPortrait ? Math.round(height * 0.25) : 96

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottomPx,
        left: layout === 'pip-bl' ? sidePx : undefined,
        right: layout === 'pip-bl' ? undefined : sidePx,
        width: boxWidth,
        height: boxHeight,
        borderRadius: 20,
        overflow: 'hidden',
        border: \`1.5px solid \${accentColor}55\`,
        background: 'rgba(6, 10, 18, 0.28)',
        boxShadow: \`0 18px 46px rgba(0,0,0,0.55), 0 0 24px \${accentColor}22\`,
        pointerEvents: 'none',
        zIndex: 35,
      }}
    >
      <OffthreadVideo
        src={staticFile(cleanRel)}
        transparent
        muted={muted}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}

// =========================================================================
// Universal Beat-Sync, Camera, Vector-Path & Transition Primitives
// Usable across ANY genre: product UI, science/math, brand ads, story MV.
// =========================================================================

const easeOutFast = Easing.bezier(0.22, 1, 0.36, 1)

export function computeBeatPulse(absTimeSec: number, beats: any[] = []): { pulse: number; strongPulse: number; isHitFrame: boolean } {
  if (!Array.isArray(beats) || beats.length === 0) return { pulse: 0, strongPulse: 0, isHitFrame: false }
  let pulse = 0
  let strongPulse = 0
  let isHitFrame = false
  for (let i = 0; i < beats.length; i++) {
    const raw = beats[i]
    const bt = typeof raw === 'number' ? raw : Number(raw?.time)
    if (!Number.isFinite(bt)) continue
    const dt = absTimeSec - bt
    if (dt >= -0.017 && dt < 0.35) {
      const c = Math.max(0, dt)
      const val = Math.exp(-c * 10.5)
      if (val > pulse) pulse = val
      const strong = typeof raw === 'object' ? Boolean(raw?.strong) : i % 4 === 0
      if (strong && val > strongPulse) strongPulse = val
      if (c < 0.065) isHitFrame = true
    }
  }
  return { pulse, strongPulse, isHitFrame }
}

const TX_BLOCK_CELLS = Array.from({ length: 24 }, (_, idx) => ({
  col: idx % 6,
  row: Math.floor(idx / 6),
  delay: (idx * 3) % 6,
}))

export interface SceneTransitionOverlayProps {
  txKind?: string
  localFrame: number
  dur: number
  accentColor?: string
  goldColor?: string
  bgColor?: string
}

export const SceneTransitionOverlay: React.FC<SceneTransitionOverlayProps> = ({
  txKind = 'cut',
  localFrame,
  dur,
  accentColor = '#38BDF8',
  goldColor = '#F59E0B',
  bgColor = '#070B16',
}) => {
  const { width, height } = useVideoConfig()
  const safeDur = Math.max(8, dur)
  if (!txKind || txKind === 'cut') return null
  const inEnd = Math.min(16, Math.max(6, Math.round(safeDur * 0.45)))
  const outStart = Math.max(inEnd, safeDur - 5)
  if (localFrame > inEnd && localFrame < outStart) return null

  const enterT = interpolate(localFrame, [0, inEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOutFast })
  const exitFlash = localFrame >= outStart ? interpolate(localFrame, [outStart, safeDur], [0, 0.36], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0
  const maxDim = Math.max(width, height)

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 28 }}>
      {txKind === 'flash-cut' && localFrame < Math.min(9, inEnd) ? (
        <AbsoluteFill
          style={{
            background: \`radial-gradient(circle at center, #FFFFFF 0%, \${goldColor}88 45%, transparent 80%)\`,
            opacity: interpolate(localFrame, [0, Math.min(9, inEnd)], [0.88, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        />
      ) : null}

      {txKind === 'slash-wipe' && localFrame < inEnd ? (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: -height * 0.3,
              bottom: -height * 0.3,
              width: Math.round(width * 0.32),
              left: interpolate(enterT, [0, 1], [-width * 0.45, width * 1.28]),
              transform: 'skewX(-24deg)',
              background: \`linear-gradient(90deg, transparent 0%, \${accentColor}AA 42%, #FFFBEB 50%, \${goldColor}AA 58%, transparent 100%)\`,
              opacity: interpolate(enterT, [0, 0.25, 1], [0.95, 0.85, 0]),
            }}
          />
        </AbsoluteFill>
      ) : null}

      {txKind === 'zoom-punch' && localFrame < inEnd ? (
        <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
          <circle
            cx={width / 2}
            cy={height / 2}
            r={interpolate(enterT, [0, 1], [maxDim * 0.08, maxDim * 0.78])}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={interpolate(enterT, [0, 1], [34, 2])}
            opacity={interpolate(enterT, [0, 0.7, 1], [0.9, 0.5, 0])}
          />
          <circle
            cx={width / 2}
            cy={height / 2}
            r={interpolate(enterT, [0, 1], [maxDim * 0.02, maxDim * 0.62])}
            fill="none"
            stroke={goldColor}
            strokeWidth={interpolate(enterT, [0, 1], [18, 1])}
            opacity={interpolate(enterT, [0, 0.75, 1], [0.85, 0.4, 0])}
          />
        </svg>
      ) : null}

      {txKind === 'iris-circle' && localFrame < inEnd ? (
        <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
          <circle
            cx={width / 2}
            cy={height / 2}
            r={interpolate(enterT, [0, 1], [50, maxDim * 0.72])}
            fill="none"
            stroke={accentColor}
            strokeWidth={interpolate(enterT, [0, 1], [26, 2])}
            opacity={interpolate(enterT, [0, 0.7, 1], [0.92, 0.6, 0])}
          />
          <circle
            cx={width / 2}
            cy={height / 2}
            r={interpolate(enterT, [0, 1], [10, maxDim * 0.62])}
            fill="none"
            stroke={goldColor}
            strokeWidth={interpolate(enterT, [0, 1], [14, 1])}
            opacity={interpolate(enterT, [0, 0.65, 1], [0.85, 0.45, 0])}
          />
        </svg>
      ) : null}

      {txKind === 'block-wipe' && localFrame < Math.min(14, inEnd) ? (
        <AbsoluteFill>
          {TX_BLOCK_CELLS.map((cell, bi) => {
            const p = interpolate(localFrame - cell.delay, [0, 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            if (p <= 0.01) return null
            const cw = width / 6
            const ch = height / 4
            return (
              <div
                key={bi}
                style={{
                  position: 'absolute',
                  left: cell.col * cw,
                  top: cell.row * ch,
                  width: cw + 2,
                  height: ch + 2,
                  background: bi % 3 === 0 ? accentColor : bgColor,
                  opacity: p * 0.85,
                  transform: \`scale(\${p})\`,
                }}
              />
            )
          })}
        </AbsoluteFill>
      ) : null}

      {txKind === 'glitch-cut' && localFrame < Math.min(10, inEnd) ? (
        <AbsoluteFill style={{ opacity: interpolate(localFrame, [0, Math.min(10, inEnd)], [0.88, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <div style={{ position: 'absolute', top: '24%', left: 0, right: 0, height: 42, background: 'linear-gradient(90deg, rgba(255,40,90,0.55), transparent, rgba(0,235,255,0.55))' }} />
          <div style={{ position: 'absolute', top: '52%', left: 0, right: 0, height: 18, background: \`\${goldColor}88\` }} />
          <div style={{ position: 'absolute', top: '71%', left: 0, right: 0, height: 28, background: \`\${accentColor}77\` }} />
        </AbsoluteFill>
      ) : null}

      {txKind === 'light-wipe' && localFrame < inEnd ? (
        <div
          style={{
            position: 'absolute',
            top: -120,
            bottom: -120,
            width: Math.round(width * 0.2),
            left: interpolate(enterT, [0, 1], [-width * 0.28, width * 1.15]),
            transform: 'skewX(-18deg)',
            background: \`linear-gradient(90deg, transparent, rgba(255,255,255,0.34), \${accentColor}66, transparent)\`,
          }}
        />
      ) : null}

      {exitFlash > 0 ? <AbsoluteFill style={{ backgroundColor: accentColor, opacity: exitFlash }} /> : null}
    </AbsoluteFill>
  )
}

export const CameraRig: React.FC<{
  children: React.ReactNode
  zoomFrom?: number
  zoomTo?: number
  panXFrom?: number
  panXTo?: number
  panYFrom?: number
  panYTo?: number
  beatPulse?: number
  cutKickPx?: number
}> = ({ children, zoomFrom = 1.0, zoomTo = 1.06, panXFrom = 0, panXTo = 0, panYFrom = 0, panYTo = 0, beatPulse = 0, cutKickPx = 0 }) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const p = Math.min(1, frame / Math.max(1, durationInFrames - 1))
  const eased = easeOutFast(p)
  const sc = zoomFrom + (zoomTo - zoomFrom) * eased + beatPulse * 0.022
  const dx = panXFrom + (panXTo - panXFrom) * eased + (frame < 7 ? Math.sin(frame * 3.8) * (7 - frame) * (cutKickPx || 0) : 0)
  const dy = panYFrom + (panYTo - panYFrom) * eased + (frame < 7 ? Math.cos(frame * 4.4) * (7 - frame) * (cutKickPx || 0) * 0.8 : 0)
  return (
    <AbsoluteFill style={{ transform: \`translate3d(\${dx.toFixed(1)}px, \${dy.toFixed(1)}px, 0) scale(\${sc.toFixed(4)})\`, transformOrigin: 'center center' }}>
      {children}
    </AbsoluteFill>
  )
}

export const AnimatedRoutePath: React.FC<{
  d: string
  progress: number
  lengthApprox?: number
  strokeColor?: string
  glowColor?: string
  strokeWidth?: number
}> = ({ d, progress, lengthApprox = 900, strokeColor = '#F59E0B', glowColor = '#FEF3C7', strokeWidth = 6 }) => {
  const p = Math.max(0, Math.min(1, progress))
  return (
    <g>
      <path d={d} fill="none" stroke={strokeColor} strokeWidth={strokeWidth * 2.4} strokeLinecap="round" strokeDasharray={lengthApprox} strokeDashoffset={lengthApprox * (1 - p)} opacity={0.22} />
      <path d={d} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={lengthApprox} strokeDashoffset={lengthApprox * (1 - p)} opacity={0.96} />
      <path d={d} fill="none" stroke={glowColor} strokeWidth={Math.max(2, strokeWidth * 0.38)} strokeLinecap="round" strokeDasharray={lengthApprox} strokeDashoffset={lengthApprox * (1 - p)} opacity={0.9} />
    </g>
  )
}

export const ParallaxHorizon: React.FC<{
  bgTop?: string
  bgBot?: string
  gridColor?: string
  accentColor?: string
  starCount?: number
  driftSpeed?: number
}> = ({ bgTop = '#070A12', bgBot = '#171C2E', gridColor = '#F59E0B', accentColor = '#38BDF8', starCount = 26, driftSpeed = 1 }) => {
  const frame = useCurrentFrame()
  const driftX = (frame * 1.4 * driftSpeed) % 120
  return (
    <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="ph-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bgTop} />
          <stop offset="100%" stopColor={bgBot} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#ph-sky)" />
      {Array.from({ length: 18 }, (_, i) => (
        <line key={\`v-\${i}\`} x1={i * 120 - driftX} y1={0} x2={i * 120 - driftX} y2={1080} stroke={gridColor} strokeWidth={1} opacity={0.07} />
      ))}
      {Array.from({ length: 10 }, (_, j) => (
        <line key={\`h-\${j}\`} x1={0} y1={j * 110 + ((frame * 0.6 * driftSpeed) % 110)} x2={1920} y2={j * 110 + ((frame * 0.6 * driftSpeed) % 110)} stroke={accentColor} strokeWidth={1} opacity={0.06} />
      ))}
      {Array.from({ length: starCount }, (_, si) => {
        const x = ((si * 317 + frame * (0.4 + (si % 3) * 0.35) * driftSpeed) % 1920)
        const y = ((si * 173 + frame * 0.15) % 980)
        const r = 1.4 + (si % 4) * 0.8
        const op = 0.25 + 0.35 * Math.abs(Math.sin(frame * 0.08 + si))
        return <circle key={\`st-\${si}\`} cx={x} cy={y} r={r} fill={si % 3 === 0 ? accentColor : gridColor} opacity={op} />
      })}
    </svg>
  )
}

export type ThreeStagePreset =
  | 'orbital-core'
  | 'cyber-terrain'
  | 'particle-vortex'
  | 'floating-monoliths'
  | 'chrono-helix'
  | 'matrix-cubes'
  | 'auto'

export const THREE_STAGE_PRESETS: ThreeStagePreset[] = [
  'orbital-core',
  'cyber-terrain',
  'particle-vortex',
  'floating-monoliths',
  'chrono-helix',
  'matrix-cubes',
]

export interface ThreeCyberStageProps {
  preset?: ThreeStagePreset | string
  primaryColor?: string
  secondaryColor?: string
  bgColor?: string
  beatPulse?: number
  cameraSpeed?: number
  opacity?: number
  seed?: number
  wireframe?: boolean
  style?: React.CSSProperties
}

function detRand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123
  return x - Math.floor(x)
}

/**
 * Opus 5.5 Vibecoding 3D Spatial Engine powered by Three.js (\`THREE.Scene\`, \`THREE.PerspectiveCamera\`,
 * \`THREE.IcosahedronGeometry\`, \`THREE.TorusGeometry\`, \`THREE.BoxGeometry\`, \`THREE.OctahedronGeometry\`,
 * \`THREE.Matrix4\`, \`THREE.Vector3\`, \`THREE.Color\`).
 * Synchronously driven by \`useCurrentFrame()\` with zero delayRender deadlock and 100% deterministic frame capture.
 */
export const ThreeCyberStage: React.FC<ThreeCyberStageProps> = ({
  preset = 'auto',
  primaryColor = '#38BDF8',
  secondaryColor = '#F59E0B',
  bgColor = 'transparent',
  beatPulse = 0,
  cameraSpeed = 1,
  opacity = 0.88,
  seed = 1,
  wireframe = true,
  style = {},
}) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const resolvedPreset: ThreeStagePreset =
    preset && preset !== 'auto' && THREE_STAGE_PRESETS.includes(preset as ThreeStagePreset)
      ? (preset as ThreeStagePreset)
      : THREE_STAGE_PRESETS[Math.abs(Math.round(seed)) % THREE_STAGE_PRESETS.length]

  const renderThreeFrame = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = width || 1920
    const h = height || 1080
    if (canvas.width !== w) canvas.width = w
    if (canvas.height !== h) canvas.height = h

    ctx.clearRect(0, 0, w, h)
    if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, w, h)
    }

    const t = (frame / Math.max(1, fps || 30)) * cameraSpeed
    const bp = Math.max(0, Math.min(1.5, Number(beatPulse) || 0))
    const colA = new THREE.Color(primaryColor || '#38BDF8')
    const colB = new THREE.Color(secondaryColor || '#F59E0B')
    const rgbA = \`\${Math.round(colA.r * 255)}, \${Math.round(colA.g * 255)}, \${Math.round(colA.b * 255)}\`
    const rgbB = \`\${Math.round(colB.r * 255)}, \${Math.round(colB.g * 255)}, \${Math.round(colB.b * 255)}\`

    // 1. Setup Three.js PerspectiveCamera & Scene
    const fov = 52 - bp * 3.5
    const camera = new THREE.PerspectiveCamera(fov, w / h, 0.1, 160)
    const scene = new THREE.Scene()

    if (resolvedPreset === 'cyber-terrain') {
      camera.position.set(Math.sin(t * 0.45) * 1.4, 2.5 + Math.cos(t * 0.35) * 0.35, 9.2)
      camera.lookAt(0, 0.3, -12)
      camera.rotation.z = Math.sin(t * 0.3) * 0.04
    } else if (resolvedPreset === 'chrono-helix') {
      camera.position.set(Math.sin(t * 0.6) * 0.85, Math.cos(t * 0.5) * 0.65, 8.5)
      camera.lookAt(Math.sin(t * 0.3) * 0.3, 0, -18)
      camera.rotation.z = t * 0.18
    } else if (resolvedPreset === 'matrix-cubes') {
      camera.position.set(Math.sin(t * 0.38) * 6.8, 5.2 + Math.sin(t * 0.5) * 0.6, Math.cos(t * 0.38) * 7.8 + 2.5)
      camera.lookAt(0, -0.4, 0)
    } else {
      const orbitAngle = t * 0.32 + seed * 0.7
      const radius = 8.4 - bp * 0.45
      camera.position.set(
        Math.sin(orbitAngle) * radius * 0.55,
        Math.sin(t * 0.42 + seed) * 1.65 + 0.6,
        Math.cos(orbitAngle) * radius,
      )
      camera.lookAt(0, 0, 0)
      camera.rotation.z = Math.sin(t * 0.25) * 0.035
    }

    camera.updateMatrixWorld(true)
    camera.updateProjectionMatrix()
    const viewProj = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    const lightDir = new THREE.Vector3(0.55, 0.78, 0.65).normalize()

    const projectVec = (v: THREE.Vector3): { x: number; y: number; z: number; visible: boolean } => {
      const p = v.clone().applyMatrix4(viewProj)
      if (p.z < -1 || p.z > 1) {
        return { x: 0, y: 0, z: p.z, visible: false }
      }
      return {
        x: (p.x * 0.5 + 0.5) * w,
        y: (-p.y * 0.5 + 0.5) * h,
        z: p.z,
        visible: true,
      }
    }

    interface DrawFace {
      pts: Array<{ x: number; y: number }>
      depth: number
      fill: string
      stroke: string
      lineWidth: number
    }
    const drawQueue: DrawFace[] = []

    const pushGeometryToQueue = (
      geom: THREE.BufferGeometry,
      meshMatrix: THREE.Matrix4,
      useSecondary: boolean,
      faceAlphaScale = 0.22,
      strokeAlphaScale = 0.78,
      lineW = 1.4,
    ) => {
      const posAttr = geom.getAttribute('position')
      if (!posAttr) return
      const indexAttr = geom.getIndex()
      const triCount = indexAttr ? Math.floor(indexAttr.count / 3) : Math.floor(posAttr.count / 3)
      const vA = new THREE.Vector3()
      const vB = new THREE.Vector3()
      const vC = new THREE.Vector3()
      const edge1 = new THREE.Vector3()
      const edge2 = new THREE.Vector3()
      const normal = new THREE.Vector3()
      const rgb = useSecondary ? rgbB : rgbA

      for (let i = 0; i < triCount; i++) {
        const i0 = indexAttr ? indexAttr.getX(i * 3) : i * 3
        const i1 = indexAttr ? indexAttr.getX(i * 3 + 1) : i * 3 + 1
        const i2 = indexAttr ? indexAttr.getX(i * 3 + 2) : i * 3 + 2
        vA.fromBufferAttribute(posAttr, i0).applyMatrix4(meshMatrix)
        vB.fromBufferAttribute(posAttr, i1).applyMatrix4(meshMatrix)
        vC.fromBufferAttribute(posAttr, i2).applyMatrix4(meshMatrix)

        const pA = projectVec(vA)
        const pB = projectVec(vB)
        const pC = projectVec(vC)
        if (!pA.visible || !pB.visible || !pC.visible) continue

        edge1.subVectors(vB, vA)
        edge2.subVectors(vC, vA)
        normal.crossVectors(edge1, edge2).normalize()
        const lit = Math.max(0.15, Math.abs(normal.dot(lightDir)))
        const depth = (pA.z + pB.z + pC.z) / 3
        const fAlpha = Math.min(0.65, faceAlphaScale * (0.45 + lit * 0.85) + bp * 0.08)
        const sAlpha = Math.min(0.96, strokeAlphaScale * (0.55 + lit * 0.5) + bp * 0.14)

        drawQueue.push({
          pts: [
            { x: pA.x, y: pA.y },
            { x: pB.x, y: pB.y },
            { x: pC.x, y: pC.y },
          ],
          depth,
          fill: \`rgba(\${rgb}, \${fAlpha.toFixed(3)})\`,
          stroke: wireframe ? \`rgba(\${rgb}, \${sAlpha.toFixed(3)})\` : 'transparent',
          lineWidth: lineW,
        })
      }
      geom.dispose()
    }

    // Ambient volumetric center glow
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.48, 20, w * 0.5, h * 0.48, Math.max(w, h) * 0.52)
    grad.addColorStop(0, \`rgba(\${rgbA}, \${(0.16 + bp * 0.09).toFixed(3)})\`)
    grad.addColorStop(0.45, \`rgba(\${rgbB}, \${(0.07 + bp * 0.04).toFixed(3)})\`)
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // 2. Build Preset-Specific 3D Meshes & Lines via Three.js
    if (resolvedPreset === 'orbital-core') {
      const coreScale = 1 + bp * 0.24 + Math.sin(t * 2.4) * 0.06
      const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.85, 1))
      coreMesh.rotation.set(t * 0.55, t * 0.78, t * 0.32)
      coreMesh.scale.setScalar(coreScale)
      coreMesh.updateMatrixWorld(true)
      scene.add(coreMesh)
      pushGeometryToQueue(coreMesh.geometry, coreMesh.matrixWorld, false, 0.2, 0.86, 1.7)

      const innerMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.08, 0))
      innerMesh.rotation.set(-t * 0.9, t * 0.5, -t * 0.6)
      innerMesh.scale.setScalar(1 + bp * 0.32)
      innerMesh.updateMatrixWorld(true)
      pushGeometryToQueue(innerMesh.geometry, innerMesh.matrixWorld, true, 0.34, 0.92, 1.9)

      const ringRadii = [2.95, 3.85, 4.75]
      ringRadii.forEach((rad, ri) => {
        const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.035 + ri * 0.008, 6, 40))
        ringMesh.rotation.set(
          0.95 + ri * 0.52 + t * (ri % 2 === 0 ? 0.42 : -0.36),
          t * (0.3 + ri * 0.14),
          ri * 0.7,
        )
        ringMesh.scale.setScalar(1 + bp * 0.08)
        ringMesh.updateMatrixWorld(true)
        pushGeometryToQueue(ringMesh.geometry, ringMesh.matrixWorld, ri % 2 === 1, 0.14, 0.72, 1.2)
      })

      for (let si = 0; si < 10; si++) {
        const ang = (si / 10) * Math.PI * 2 + t * (0.65 + (si % 3) * 0.15)
        const r = 3.2 + (si % 3) * 0.95
        const sat = new THREE.Mesh(new THREE.OctahedronGeometry(0.18 + (si % 2) * 0.07, 0))
        sat.position.set(Math.cos(ang) * r, Math.sin(ang * 1.5 + si) * 1.25, Math.sin(ang) * r)
        sat.rotation.set(t * 1.5 + si, t * 1.2, 0)
        sat.updateMatrixWorld(true)
        pushGeometryToQueue(sat.geometry, sat.matrixWorld, si % 2 === 0, 0.38, 0.9, 1.3)
      }
    } else if (resolvedPreset === 'cyber-terrain') {
      // 3D Procedural Wireframe Canyon Grid + Horizon Sun Portal + Monoliths
      const cols = 22
      const rows = 16
      const spacingX = 0.95
      const spacingZ = 1.05
      const zScroll = (t * 2.8) % spacingZ
      ctx.lineWidth = 1.25
      for (let rz = 0; rz < rows - 1; rz++) {
        const z0 = 4.5 - rz * spacingZ + zScroll
        const z1 = 4.5 - (rz + 1) * spacingZ + zScroll
        const depthFade = Math.max(0.08, Math.min(0.85, 1 - rz / rows))
        for (let cx = 0; cx < cols - 1; cx++) {
          const x0 = (cx - (cols - 1) / 2) * spacingX
          const x1 = (cx + 1 - (cols - 1) / 2) * spacingX
          const canyon0 = Math.pow(Math.min(1, Math.abs(x0) / 3.2), 1.6) * 2.3
          const canyon1 = Math.pow(Math.min(1, Math.abs(x1) / 3.2), 1.6) * 2.3
          const wave00 = Math.sin(x0 * 0.65 + (rz - t * 2.8) * 0.45) * 0.42 + bp * 0.28 * Math.cos(x0)
          const wave10 = Math.sin(x1 * 0.65 + (rz - t * 2.8) * 0.45) * 0.42 + bp * 0.28 * Math.cos(x1)
          const wave01 = Math.sin(x0 * 0.65 + (rz + 1 - t * 2.8) * 0.45) * 0.42
          const y00 = -1.75 + canyon0 + wave00
          const y10 = -1.75 + canyon1 + wave10
          const y01 = -1.75 + canyon0 + wave01

          const p00 = projectVec(new THREE.Vector3(x0, y00, z0))
          const p10 = projectVec(new THREE.Vector3(x1, y10, z0))
          const p01 = projectVec(new THREE.Vector3(x0, y01, z1))
          if (p00.visible && p10.visible) {
            ctx.strokeStyle = Math.abs(x0) < 2.2 ? \`rgba(\${rgbB}, \${(depthFade * 0.62).toFixed(3)})\` : \`rgba(\${rgbA}, \${(depthFade * 0.58).toFixed(3)})\`
            ctx.beginPath()
            ctx.moveTo(p00.x, p00.y)
            ctx.lineTo(p10.x, p10.y)
            if (p01.visible) ctx.lineTo(p01.x, p01.y)
            ctx.stroke()
          }
        }
      }

      const sunCore = new THREE.Mesh(new THREE.IcosahedronGeometry(2.3, 1))
      sunCore.position.set(0, 1.85, -10.5)
      sunCore.rotation.set(t * 0.25, t * 0.45, 0)
      sunCore.scale.setScalar(1 + bp * 0.2)
      sunCore.updateMatrixWorld(true)
      pushGeometryToQueue(sunCore.geometry, sunCore.matrixWorld, true, 0.25, 0.88, 1.6)

      const sunRing = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.05, 6, 36))
      sunRing.position.set(0, 1.85, -10.5)
      sunRing.rotation.set(0.35, t * 0.3, t * 0.5)
      sunRing.updateMatrixWorld(true)
      pushGeometryToQueue(sunRing.geometry, sunRing.matrixWorld, false, 0.18, 0.82, 1.4)
    } else if (resolvedPreset === 'floating-monoliths') {
      for (let mi = 0; mi < 9; mi++) {
        const spread = (mi - 4) * 1.55
        const zPos = -Math.abs(mi - 4) * 0.85 - 0.5 + Math.sin(t * 0.9 + mi) * 0.45
        const yPos = Math.sin(t * 1.15 + mi * 0.8) * 0.42
        const slab = new THREE.Mesh(new THREE.BoxGeometry(0.92, 2.55 + (mi % 3) * 0.45, 0.24))
        slab.position.set(spread, yPos, zPos)
        slab.rotation.set(Math.sin(t * 0.6 + mi) * 0.14, -spread * 0.12 + Math.cos(t * 0.5 + mi) * 0.22, 0)
        slab.scale.setScalar(1 + bp * 0.12)
        slab.updateMatrixWorld(true)
        pushGeometryToQueue(slab.geometry, slab.matrixWorld, mi % 2 === 1, 0.24, 0.85, 1.5)
      }
    } else if (resolvedPreset === 'chrono-helix') {
      const tunnelCount = 12
      const zSpan = 22
      for (let ti = 0; ti < tunnelCount; ti++) {
        const rawZ = ((ti * (zSpan / tunnelCount) + t * 3.8) % zSpan) - zSpan + 6.5
        const portal = new THREE.Mesh(new THREE.TorusGeometry(2.85 + (ti % 2) * 0.35, 0.045, 6, 8))
        portal.position.set(Math.sin(rawZ * 0.15 + t) * 0.3, Math.cos(rawZ * 0.15 + t) * 0.22, rawZ)
        portal.rotation.set(0, 0, ti * 0.35 + t * 0.45)
        portal.scale.setScalar(1 + bp * 0.15)
        portal.updateMatrixWorld(true)
        pushGeometryToQueue(portal.geometry, portal.matrixWorld, ti % 2 === 0, 0.16, 0.8, 1.5)
      }
      // Double Helix DNA / Timeline Strands
      const strandPtsA: Array<{ x: number; y: number; visible: boolean }> = []
      const strandPtsB: Array<{ x: number; y: number; visible: boolean }> = []
      for (let hi = 0; hi < 44; hi++) {
        const hz = 5.5 - hi * 0.48
        const hang = hi * 0.38 - t * 2.4
        const rad = 1.65 + bp * 0.22
        const p1 = projectVec(new THREE.Vector3(Math.cos(hang) * rad, Math.sin(hang) * rad, hz))
        const p2 = projectVec(new THREE.Vector3(Math.cos(hang + Math.PI) * rad, Math.sin(hang + Math.PI) * rad, hz))
        strandPtsA.push(p1)
        strandPtsB.push(p2)
        if (hi % 2 === 0 && p1.visible && p2.visible) {
          ctx.strokeStyle = \`rgba(\${rgbB}, 0.42)\`
          ctx.lineWidth = 1.3
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
      ;[strandPtsA, strandPtsB].forEach((pts, si) => {
        ctx.strokeStyle = si === 0 ? \`rgba(\${rgbA}, 0.85)\` : \`rgba(\${rgbB}, 0.85)\`
        ctx.lineWidth = 2.4
        ctx.beginPath()
        let started = false
        for (const pt of pts) {
          if (!pt.visible) continue
          if (!started) {
            ctx.moveTo(pt.x, pt.y)
            started = true
          } else {
            ctx.lineTo(pt.x, pt.y)
          }
        }
        ctx.stroke()
      })
    } else if (resolvedPreset === 'matrix-cubes') {
      const gxCount = 6
      const gzCount = 5
      for (let gx = 0; gx < gxCount; gx++) {
        for (let gz = 0; gz < gzCount; gz++) {
          const wx = (gx - (gxCount - 1) / 2) * 1.35
          const wz = (gz - (gzCount - 1) / 2) * 1.35
          const dist = Math.sqrt(wx * wx + wz * wz)
          const waveH = 0.75 + (Math.sin(dist * 0.95 - t * 3.1) * 0.5 + 0.5) * 1.65 + bp * 0.55
          const cube = new THREE.Mesh(new THREE.BoxGeometry(0.76, waveH, 0.76))
          cube.position.set(wx, waveH * 0.5 - 1.5, wz)
          cube.updateMatrixWorld(true)
          pushGeometryToQueue(cube.geometry, cube.matrixWorld, (gx + gz) % 2 === 1, 0.25, 0.84, 1.35)
        }
      }
    } else {
      // 'particle-vortex': Central Singularity + 3D Neural Constellation & Spiral Arms
      const sing = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 0))
      sing.rotation.set(t * 0.8, -t * 1.1, t * 0.4)
      sing.scale.setScalar(1 + bp * 0.3)
      sing.updateMatrixWorld(true)
      pushGeometryToQueue(sing.geometry, sing.matrixWorld, true, 0.28, 0.9, 1.8)

      const outerCage = new THREE.Mesh(new THREE.IcosahedronGeometry(2.85, 1))
      outerCage.rotation.set(-t * 0.32, t * 0.44, 0)
      outerCage.updateMatrixWorld(true)
      pushGeometryToQueue(outerCage.geometry, outerCage.matrixWorld, false, 0.08, 0.55, 1.15)
    }

    // 3. Depth-Sort & Paint All 3D Polygons (Painter's Algorithm back-to-front)
    drawQueue.sort((a, b) => b.depth - a.depth)
    for (const face of drawQueue) {
      ctx.beginPath()
      ctx.moveTo(face.pts[0].x, face.pts[0].y)
      ctx.lineTo(face.pts[1].x, face.pts[1].y)
      ctx.lineTo(face.pts[2].x, face.pts[2].y)
      ctx.closePath()
      ctx.fillStyle = face.fill
      ctx.fill()
      if (face.stroke !== 'transparent') {
        ctx.strokeStyle = face.stroke
        ctx.lineWidth = face.lineWidth
        ctx.stroke()
      }
    }

    // 4. 3D Starfield / Neural Vortex Particles & Synaptic Connections
    const pCount = resolvedPreset === 'particle-vortex' ? 110 : 56
    const projNodes: Array<{ x: number; y: number; z: number; r: number; isGold: boolean }> = []
    for (let pi = 0; pi < pCount; pi++) {
      const r1 = detRand(pi * 3.1 + seed)
      const r2 = detRand(pi * 7.3 + seed)
      const r3 = detRand(pi * 13.7 + seed)
      const armAngle = r1 * Math.PI * 2 + t * (0.35 + r2 * 0.45) + (resolvedPreset === 'particle-vortex' ? r3 * 4.2 : 0)
      const radius = (resolvedPreset === 'particle-vortex' ? 1.4 : 2.2) + r3 * 6.2
      const vy = (r2 - 0.5) * 5.2 + Math.sin(t * 0.9 + pi) * 0.35
      const worldPt = new THREE.Vector3(Math.cos(armAngle) * radius, vy, Math.sin(armAngle) * radius)
      const pr = projectVec(worldPt)
      if (!pr.visible) continue
      const depthScale = Math.max(0.3, Math.min(2.2, (1 - pr.z) * 1.4))
      projNodes.push({
        x: pr.x,
        y: pr.y,
        z: pr.z,
        r: (1.5 + (pi % 3) * 1.1 + bp * 1.2) * depthScale,
        isGold: pi % 3 === 0,
      })
    }

    if (resolvedPreset === 'particle-vortex' || resolvedPreset === 'orbital-core') {
      const maxDistSq = Math.pow(w * 0.095, 2)
      ctx.lineWidth = 1.0
      for (let i = 0; i < projNodes.length; i++) {
        let links = 0
        for (let j = i + 1; j < projNodes.length && links < 3; j++) {
          const dx = projNodes[i].x - projNodes[j].x
          const dy = projNodes[i].y - projNodes[j].y
          const dSq = dx * dx + dy * dy
          if (dSq < maxDistSq) {
            const alpha = (1 - dSq / maxDistSq) * (0.28 + bp * 0.18)
            ctx.strokeStyle = projNodes[i].isGold ? \`rgba(\${rgbB}, \${alpha.toFixed(3)})\` : \`rgba(\${rgbA}, \${alpha.toFixed(3)})\`
            ctx.beginPath()
            ctx.moveTo(projNodes[i].x, projNodes[i].y)
            ctx.lineTo(projNodes[j].x, projNodes[j].y)
            ctx.stroke()
            links++
          }
        }
      }
    }

    for (const nd of projNodes) {
      const rgb = nd.isGold ? rgbB : rgbA
      ctx.fillStyle = \`rgba(\${rgb}, 0.85)\`
      ctx.beginPath()
      ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  useLayoutEffect(() => {
    renderThreeFrame()
  }, [frame, fps, width, height, resolvedPreset, primaryColor, secondaryColor, bgColor, beatPulse, cameraSpeed, seed, wireframe])

  useEffect(() => {
    renderThreeFrame()
  }, [frame, resolvedPreset])

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, ...style }}>
      <canvas
        ref={canvasRef}
        width={width || 1920}
        height={height || 1080}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </AbsoluteFill>
  )
}
`

export function writeShotcraftRemotionLib(projectDir) {
  const absDir = resolve(projectDir)
  const libDir = join(absDir, 'src', 'lib')
  mkdirSync(libDir, { recursive: true })
  const outPath = join(libDir, 'shotcraft.tsx')
  writeFileSync(outPath, SHOTCRAFT_TSX_SOURCE, 'utf8')
  return outPath
}

export function buildDirectorPromptPackage({
  topic,
  userPrompt,
  aspectRatio,
  quality,
  width,
  height,
  targetEngine,
  assets = [],
  draftScript = null,
  bgmMeta = null,
  narrationMode = 'tts',
  pacingMode = 'auto',
}) {
  const zeroVisualAssets = !Array.isArray(assets) || assets.length === 0
  const normPacing = ['calm', 'balanced', 'dynamic'].includes(String(pacingMode || '').toLowerCase())
    ? String(pacingMode).toLowerCase()
    : narrationMode === 'subtitle-mv' || /历史|霸王|史诗|演义|战役|卡点|快闪|混剪|高燃|\bMV\b/i.test(`${topic || ''} ${userPrompt || ''}`)
      ? 'dynamic'
      : /故事|品牌|温情|人物|访谈|纪实|心路|传记|文化/i.test(`${topic || ''} ${userPrompt || ''}`)
        ? 'calm'
        : zeroVisualAssets && narrationMode !== 'tts'
          ? 'dynamic'
          : 'balanced'
  const zeroPacingSpec =
    normPacing === 'calm'
      ? { label: '沉稳叙事', shotRange: '8~14', durRule: '每镜保持 4.2~7.5 秒从容留白与自然呼吸，让观众充分理解故事细节，严禁急促闪切' }
      : normPacing === 'dynamic'
        ? { label: '高燃快节奏', shotRange: '22~38', durRule: '常规镜 2~4 拍（1.3~2.8s），高潮冲击/突降点(drops)/转折闪切可设 0.5 拍或 1 拍（beatCount: 0.5 或 1，transition 设为 "flash-cut" | "zoom-punch" | "slash-wipe" | "glitch-cut"），严禁出现 >4.5 秒的呆板静止镜' }
        : { label: '稳健解说', shotRange: '10~18', durRule: '以信息清晰传达为先：开场与收尾 2.2~3.2s，核心原理/功能讲解保持 3.2~5.5s 舒适节奏，不赶语速、每句口播从容说完' }
  const beatInfoText = bgmMeta?.analyzed
    ? `实测音乐节奏：BPM=${bgmMeta.bpm}，首拍偏移 phaseSec=${bgmMeta.phaseSec}s，单拍=${bgmMeta.beatSec}s，音乐总长=${bgmMeta.durationSec}s，高潮突降点 drops=${JSON.stringify((bgmMeta.drops || []).slice(0, 10))}。请让分镜数与每镜 beatCount（1/2/4/8 拍）贴合音乐起承转合！`
    : ''
  const system = zeroVisualAssets
    ? `你是顶级全题材动态视觉导演兼音画卡点总监 (AI Dynamic Visual & Beat-Sync Director)，精通人物传记/历史史诗、软件原理/架构科普、产品商业发布、数据科学图解、抽象律动短片。
当前没有任何现成图片/视频素材 (zeroVisualAssets=true)，全部画面由 AI Remotion TSX 代码生成与内置 SVG 矢量舞台联合绘制，禁止编造任何 \`assets/xxx.png\` 文件名或软件窗口占位图！
${beatInfoText}

必须遵循以下规范：
1. 你只输出严格的 JSON 对象，不要包含额外 Markdown 文字。
2. **依题材适配节奏（${zeroPacingSpec.label}）**：根据主题语境与音乐起承转合拆分为 **${zeroPacingSpec.shotRange} 个镜头**！${zeroPacingSpec.durRule}；narrationMode=${narrationMode}：
   - 若用户指定第二人称（如"你"）或科普/叙事人称，全篇严格统一；单句字幕 <= 18 字，充满具体时间节点、实体细节、金句或客观指标，杜绝空洞废话！accentWords 标出 1~2 个亮点金色词汇；
   - narration 与 subChunks 逐字一致，严禁空洞套话！
3. 每镜必须携带完整 \`visualBlueprint\`（下游逐镜 TSX 程序员直读：具体描述 3D Three.js 空间镜头 + SVG 角色/器械/图表/地图/符号结构与镜内中段动作变化）、\`threePreset\`（Three.js 3D 空间舞台预设："orbital-core" | "cyber-terrain" | "particle-vortex" | "floating-monoliths" | "chrono-helix" | "matrix-cubes"）、\`layout: "narrative-diorama"\` 与精雕 \`stageSpec\`：
   - mood: "dawn-amber" | "crimson-war" | "indigo-night" | "ash-twilight" | "bronze-hall" | "jade-river" | "void-gold"
   - setting: "palace-stairs" | "mountain-camp" | "city-siege" | "river-gorge" | "vast-plain"
   - archetype: "hero-numeral" | "hero-stand" | "oath-break" | "cavalry-rush" | "slash-climax" | "duel-confront" | "farewell-tent" | "strategic-map" | "scroll-calligraphy" | "plaque-summary" | "channel-end"
   - threePreset: "orbital-core" | "cyber-terrain" | "particle-vortex" | "floating-monoliths" | "chrono-helix" | "matrix-cubes"
   - transition 仅允许: "cut" | "flash-cut" | "slash-wipe" | "iris-circle" | "block-wipe" | "glitch-cut" | "zoom-punch" | "light-wipe"（禁止填入配方名）
   - 可选精致参数：heroNum/heroUnit（开篇核心数值）、bannerChar（旗帜/核心字）、calligraphy（1~3列竖排古典引文）+ sealText（朱红篆章）、strategic-map 专属 zones/routes/stamps（印章字如"破"/"胜"/"围"/"霸"）、plaque-summary 专属 plaques（4~7枚总结匾额词）。
4. 每个分镜搭配精确落拍的 sfxCues，可在 0.00s 放置 "hit"/"sub_drop"/"slash"/"stamp"/"whoosh" 等音效。`
    : `你是顶级电影动态视觉导演兼音画编曲总监 (AI Director & Sound Designer)。
你的职责不是套模板，而是针对用户提供的主题与真实素材，构思极具大厂发布会/电影预告片质感的视频蓝图与定制合成音乐音效方案。
${beatInfoText}

必须遵循以下规范：
1. 你只输出严格的 JSON 对象，不要包含额外 Markdown 解释文字。
2. **口播稿 (narration) 与屏幕底部字幕 (subtitleText / subChunks) 严格逐字一致！标题卡片另行提炼！**
   - narration: 自然流畅口语表达，单镜 **10-28 字**为主，节奏明快，适合 3.5-6.5 秒快速切镜。如果素材丰富，优先拆分为 **8-16 个紧凑短镜**，避免 10 秒超长呆板大段独白！
   - subChunks: 必须与 narration 的实际读音一字不差地按语意/标点拆分为 1-3 段屏幕单行字幕（每段 6-16 字），严禁改写或替换口播用词；视觉关键词标语请放在 title / highlights / tag 中！
3. **产品截图/UI 软件宣传片禁止把截图放在黑遮罩后面模糊背景！** 应使用 AppWindow (shotType: "app-focus-shot" | "split-wipe-compare" | "metric-dashboard" | "multi-window-trio" | "workflow-steps" | "card-fan-opener"):
   - cams: 归一化镜头推拉序列 [{ t: 0, fx: 0.5, fy: 0.5, z: 1.0 }, { t: 1, fx: 0.28, fy: 0.36, z: 1.65 }]，精确放大软件 UI 局部细节；
   - marks: 截图内部归一化坐标高亮标注框 [{ fx: 0.25, fy: 0.35, fw: 0.22, fh: 0.14, label: "一键AI拆分镜", tone: "gold", startFrame: 10 }]！
4. 画面布局与镜头语言必须根据画幅比例 (${aspectRatio}, ${width}x${height}) 量身定制：
   - 竖屏 (9:16 / 3:4): 采用上下构图、中心主体聚焦、大字号大数字、安全边距避开底部 12% 区域。
   - 横屏 (16:9): 采用全清 AppWindow 推镜聚焦、A/B 擦除对比、三主题并排窗或双轨数据仪表台。
5. 为整部作品编曲：生成 audioSpec，包含：
   - mood: "tech" | "energetic" | "cinematic" | "warm" | "emerald"
   - bpm: 整数 (88-136)
   - drumDensity: 0.0 - 1.0
   - leadStyle: "pluck" | "epiano" | "glock" | "pad-only"
   - padCutoff: 800 - 3200
   - chords: 4组和弦进度，格式为 [[rootMidi, [m1, m2, m3, m4]], ...]，例如 [[38,[62,65,69,72]],[43,[62,65,71,74]],[36,[64,67,71,74]],[45,[64,69,72,76]]]
6. 每个分镜设计 2-5 个精密时间点音效 (sfxCues)，既可使用内置类型 ("hit","whoosh","swoosh","flip","lock","pop_soft","tick_burst","shimmer_swell","glitch","pop","thud","card","sparkle","chime","riser","sub_drop","crash_cym","counter","typing","stamp")，也可使用 "synth_sfx" 参数化实时合成：
   { "type": "synth_sfx", "offsetSec": 0.15, "volume": 0.55, "pan": -0.3, "freqStart": 920, "freqEnd": 180, "durationMs": 320, "q": 1.4, "wave": "saw" }。
7. 若用户已有参考草稿 (draftScript)，请充分吸收已定稿的分镜数与叙事脉络，但在视觉动效、镜头创意、文案锐度和音效配乐上做电影级跃升。`

  const assetSummary = (assets || []).map((a) => ({
    id: a.id,
    kind: a.kind,
    role: a.role,
    path: a.path,
    width: a.width || null,
    height: a.height || null,
    durationSec: a.durationSec || null,
    name: a.name,
  }))

  const draftSummary = draftScript
    ? {
        title: draftScript.title,
        sceneCount: Array.isArray(draftScript.scenes) ? draftScript.scenes.length : 0,
        scenes: (draftScript.scenes || []).map((s) => ({
          id: s.id,
          title: s.title,
          narration: s.narration,
          emotion: s.emotion,
          assetPaths: s.assetPaths || [],
          durationSec: s.durationSec,
        })),
      }
    : null

  const user = JSON.stringify(
    {
      task: '请生成 promo-plan/1 创作蓝图 JSON',
      topic,
      userPrompt: userPrompt || topic,
      targetEngine,
      format: { aspectRatio, quality, width, height },
      availableAssets: assetSummary,
      bgmBeatAnalysis: bgmMeta?.analyzed
        ? {
            bpm: bgmMeta.bpm,
            phaseSec: bgmMeta.phaseSec,
            durationSec: bgmMeta.durationSec,
            downbeats: (bgmMeta.downbeats || []).slice(0, 28),
            drops: bgmMeta.drops || [],
          }
        : undefined,
      narrationMode,
      confirmedDraftReference: draftSummary,
      requiredOutputSchema: {
        title: 'string (作品主标题)',
        style: 'emerald | cyber | cinema | editorial | luxury | minimal',
        workflowSteps: ['例如: 原文', '分镜', '资产', '成图', '导出'],
        theme: {
          bgPrimary: '#hex',
          bgSecondary: '#hex',
          textPrimary: '#hex',
          textMuted: '#hex',
          accentPrimary: '#hex',
          accentSecondary: '#hex',
        },
        audioSpec: {
          mood: 'emerald | tech | energetic | cinematic | warm',
          bpm: 100,
          drumDensity: 0.7,
          leadStyle: 'pluck | epiano | glock | pad-only',
          padCutoff: 1900,
          volume: 0.24,
          chords: '[[rootMidi,[m1,m2,m3,m4]], ...] x4',
        },
        scenes: [
          {
            id: 'scene-01',
            title: 'string',
            shotType: 'card-fan-opener | workflow-steps | app-focus-shot | split-wipe-compare | metric-dashboard | multi-window-trio | hero-title | bento-grid | closing-cta',
            emotion: '激昂 | 平静 | 自信 | 温暖 | 科技感',
            role: 'narrator | tech | energetic | calm',
            narration: '口播文案 (自然短句)...',
            subChunks: ['精简屏幕字幕1', '核心卖点2'],
            headline: '画面主大字标题 (短小震撼)',
            kicker: '上方小英文标签',
            hudStep: 0,
            cams: [{ t: 0, fx: 0.5, fy: 0.5, z: 1.0 }, { t: 1, fx: 0.35, fy: 0.4, z: 1.5 }],
            marks: [{ fx: 0.35, fy: 0.4, fw: 0.22, fh: 0.14, label: '重点区域说明', tone: 'gold', startFrame: 8 }],
            metrics: [{ label: '指标名', value: 100, suffix: '%' }],
            assetPaths: ['assets/xxx'],
            motionNotes: '详述该镜头动画时序与交互重点',
            sfxCues: [
              { type: 'riser | whoosh | flip | lock | tick_burst | shimmer_swell | impact | synth_sfx ...', offsetSec: 0, volume: 0.55, pan: 0 },
            ],
          },
        ],
      },
    },
    null,
    2,
  )

  return { system, user }
}

export function buildRemotionCoderSkillsPrompt({
  plan,
  timingContract,
  width,
  height,
  aspectRatio,
}) {
  const isPortrait = width < height
  const system = `你是顶尖 Remotion (v4) 资深创意前端程序员。
你的任务是根据导演规划与锁定音频时间轴 (timingContract)，编写可直接通过 TypeScript strict 编译与自动化视觉质检的高水准定制视频代码！

=== REMOTION 严苛工程铁律 (违背任何一条都会被 linter 拒绝重修!) ===
1. 必须仅生成如下 3 个文件，使用 JSON 输出格式 { "files": { "src/theme.ts": "...", "src/scenes/Scenes.tsx": "...", "src/VideoComposition.tsx": "..." } }。
2. 禁止出现任何 CSS transition 或 CSS @keyframes 语法（即使在注释里也不允许出现 "transition:" 或 "@keyframes" 字样！）。一切动画必须通过 useCurrentFrame() + interpolate(..., { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) + spring() 逐帧数学计算。
3. 禁止使用 Math.random()，如需随机数必须从 'remotion' 导入 random(seed)。
4. 禁止使用 Node 内置模块 (fs/path/child_process)、eval、new Function、外部网络字体/CDN 脚本链接或本地盘符路径。
5. 商业版权字体安全铁律：禁止声明或使用微软雅黑 (Microsoft YaHei)、宋体 (SimSun)、黑体 (SimHei) 等受限商业字体！必须使用系统随包分发的 SIL OFL 开源商用字体栈：\`FONT_SANS\` ('Noto Sans SC', sans-serif) 与 \`FONT_MONO\` ('JetBrains Mono', monospace)。
6. 可从 '../lib/shotcraft'（在 src/scenes/Scenes.tsx 中）或 './lib/shotcraft'（在 src/VideoComposition.tsx 中）导入已提供的 Remotion + Three.js 3D Vibecoding 组件：
   - ThreeCyberStage, THREE, ThreeCanvas, THREE_STAGE_PRESETS, PageCam, ClipCard, DigitRoll, FlashCut, ShotCaption, AIBadge, EndNotice, AvatarOverlay, AppWindow, HotspotMark, FocusShot, WorkflowBar, BeforeAfterWipe, MetricPanel, FONT_SANS, FONT_MONO, FONT_SERIF
   - 推荐在每个分镜底层挂载 \`<ThreeCyberStage preset={scene.threePreset || 'orbital-core'} primaryColor={...} secondaryColor={...} beatPulse={...} seed={idx + 1} />\`（预设支持 'orbital-core' | 'cyber-terrain' | 'particle-vortex' | 'floating-monoliths' | 'chrono-helix' | 'matrix-cubes'），为画面赋予 Opus 5.5 级 Three.js 3D 透视景深、星环陀螺仪、赛博山谷网格与时空螺旋隧道！
   还可从 './lib/narrative-diorama'（或 '../lib/narrative-diorama'）导入无素材纯叙事 SVG 动画舞台组件：
   - NarrativeDioramaStage, HeroWarriorFigure, StrategicMapStage, SlashBurstOverlay, CalligraphyColumnPanel, MOOD_PRESETS, computeBeatSignal（当场景没有截图素材 publicAssetFiles 为空或 layout === 'narrative-diorama' 时，优先用自定义内联 &lt;svg&gt; 动画与舞台原语联动演绎，严禁臆造假 staticFile('assets/...') 路径！同时严禁把 Sequence 的 durationInFrames 硬钳到 >=30，必须使用 Math.max(8, Number(s.durationInFrames)) 支持急速踩拍切镜！）。
7. 合规与数字人叠层铁律：src/VideoComposition.tsx 必须在合成器最外层强制挂载 <AIBadge visible={true} /> 与末尾 <EndNotice />；当 script.json 中存在 avatarClip.path 且 avatarLayout !== 'off' 时，必须渲染 <AvatarOverlay clipPath={scriptData.avatarClip.path} layout={scriptData.avatarLayout || 'pip-br'} />（使用 transparent 透明通道合成）；字幕 <ShotCaption bottomPx={...} /> 必须遵循目标平台安全区留白（竖屏底部至少留白 22%）。
8. 如需使用本地素材图片/视频（如 public/...），必须使用 staticFile('相对路径')（去掉前导 public/），使用 <Img src={staticFile(...)} />。
9. 音轨对齐铁律：src/VideoComposition.tsx 必须导出命名组件 VideoComposition，并在最外层挂载：
   <Audio src={staticFile('master-audio.wav')} />
   且每个 <Sequence from={s.startFrame} durationInFrames={s.durationInFrames}> 的起始帧与帧数必须严格使用 timingContract 里的 exact integers！
10. 画面布局契合当前分辨率 ${width}x${height} (${aspectRatio}, ${isPortrait ? '竖屏移动端构图，字号要大、右侧互动栏 16% 与底部 22% 安全区严格避让' : '横屏影院构图'})：禁止溢出裁切，前景字幕留有 ShotCaption 安全位置。`

  const user = JSON.stringify(
    {
      task: '生成定制 Remotion TSX 代码文件 (严格 JSON { "files": { ... } })',
      canvas: { width, height, aspectRatio, fps: timingContract.fps, totalDurationInFrames: timingContract.totalDurationInFrames },
      aiBadge: Boolean(timingContract.aiBadge),
      narrationMode: timingContract.narrationMode || 'tts',
      subtitleStyle: timingContract.subtitleStyle || 'pill',
      bgmBeats: timingContract.bgmBeats || undefined,
      theme: plan.theme,
      timingContract: timingContract.scenes.map((s, i) => ({
        id: s.id,
        index: s.index,
        title: s.title,
        layout: plan.scenes?.[i]?.layout || 'hero-title',
        threePreset: plan.scenes?.[i]?.threePreset || plan.scenes?.[i]?.stageSpec?.threePreset || undefined,
        stageSpec: plan.scenes?.[i]?.stageSpec || undefined,
        accentWords: plan.scenes?.[i]?.accentWords || undefined,
        startFrame: s.startFrame,
        durationInFrames: s.durationInFrames,
        durationSec: s.durationSec,
        shotType: plan.scenes?.[i]?.shotType || 'hero-title',
        headline: plan.scenes?.[i]?.headline || s.title,
        kicker: plan.scenes?.[i]?.kicker || `SCENE 0${i + 1}`,
        metrics: plan.scenes?.[i]?.metrics || [],
        motionNotes: plan.scenes?.[i]?.motionNotes || s.visualPrompt || '',
        publicAssetFiles: s.publicAssetFiles || [],
        subtitles: s.subtitles || [],
      })),
    },
    null,
    2,
  )

  return { system, user }
}

/**
 * Modular Genre-Agnostic Batch Coder Prompt:
 * Produces `src/scenes/BatchNN.tsx` exporting `BATCH_NN_SCENES: Record<string, React.FC<CustomSceneProps>>`,
 * where EVERY scene receives genuine custom TSX/SVG/UI/motion choreography driven by useCurrentFrame().
 */
export function buildBatchedRemotionScenesPrompt({
  batchIndex,
  totalBatches,
  batchScenes,
  totalScenes,
  width,
  height,
  fps = 30,
  aspectRatio = '16:9',
  theme = {},
  topic = '',
  style = 'cinematic',
  bgmMeta = null,
}) {
  const isPortrait = width < height
  const pad = String(batchIndex + 1).padStart(2, '0')
  const filePath = `src/scenes/Batch${pad}.tsx`
  const exportName = `BATCH_${pad}_SCENES`

  const system = `你是全球顶尖的 Opus 5.5 Vibecoding 视频动效创意主程（精通 Remotion v4 + Three.js 3D 空间渲染 + 动态矢量 SVG 架构与高密度节拍视觉）。
你的核心使命：不是套用枯燥的静态模板卡片，而是为本批次的每一个分镜，用 **Three.js 3D 空间舞台 (\`<ThreeCyberStage />\`) + 纯 React + 多层内联动态 <svg> + 逐帧弹簧/插值数学计算**，编写**各具特色、帧帧流畅变化、具有强烈 3D 空间纵深感、直击题材灵魂**的定制动画组件！

=== 适用全题材 Opus 5.5 Vibecoding 动态视觉指南（按每个分镜自身场景自适应 · 当前画布 ${width}x${height} ${isPortrait ? '竖屏短视频构图' : '横屏影院构图'}） ===
1. **Three.js 3D 空间纵深层 (强烈推荐每个分镜挂载)**：
   - 可直接调用 \`<ThreeCyberStage preset={scene.threePreset || 'orbital-core'} primaryColor={...} secondaryColor={...} beatPulse={pulse} opacity={0.72} seed={idx + 1} />\` 作为 3D 透视空间层！
   - 6 种内置 Three.js 3D 预设按分镜语义自由选用：
     * \`'orbital-core'\`: 3D 量子二十面体核心 + 三轴陀螺仪星环 + 轨道卫星（适合 AI 核心、系统枢杻、开篇高能亮相）
     * \`'cyber-terrain'\`: 3D 赛博等高线山谷网格 + 远方日冕门户飞越（适合宏大征途、技术底座、全景推进）
     * \`'particle-vortex'\`: 3D 双旋臂星云漩涡 + 神经网络突触拓扑连线（适合大模型推理、数据洪流、思维碰撞）
     * \`'floating-monoliths'\`: 3D 空间悬浮晶碑矩阵环绕（适合多模块架构、诸侯并起、多维特性展示）
     * \`'chrono-helix'\`: 3D 时空双螺旋隧道穿梭（适合历史纪年演进、决战冲锋、工作流管道）
     * \`'matrix-cubes'\`: 3D 算力矩阵立方体波浪起伏（适合性能跑分、并发吞吐、规模化对比）
2. **有截图/实拍素材时 (publicAssetFiles 非空)**：请优先在 \`<ThreeCyberStage opacity={0.55} ... />\` 之上，通过 \`<AppWindow title={scene.title} kicker="DSH WORKBENCH" style={{ width: '100%', height: ${isPortrait ? 720 : 680} }}><FocusShot src={scene.publicAssetFiles?.[0] || scene.assetPaths?.[0] || scene.media?.[0]?.path} cams={scene.cams} marks={scene.marks} /></AppWindow>\`（或者 \`<BeforeAfterWipe>\`、3D 悬浮卡片、多窗口并排等配合外框动态标题与指标）高清呈现真实画面，禁止把文字盖住截图主体，更禁止自己在组件里画占位假框替代截图！严禁虚构不存在的 staticFile 路径！
3. **纯代码/无外部素材时 (publicAssetFiles 为空 —— 涵盖历史人物/建筑史诗、软件原理/架构拓扑图解、数据图表、产品发布会概念视觉、文字动能 MV)**：
   - **禁止**把所有分镜写成一模一样的单个背景模板调用！你必须在每个分镜中结合 \`<ThreeCyberStage />\` 3D 空间层 + 手写富有个性的**多层次内联 <svg viewBox="0 0 ${width} ${height}"> 动态前景/中景场景**（严格匹配画布 ${width}x${height}；${isPortrait ? '竖屏采用上下分栏强冲击构图，主视觉与大数字放在居中上部，留出右下侧互动与底部字幕空间' : '横屏采用景深错落全景构图'}！可搭配 \`ParallaxHorizon\` / \`CameraRig\` / \`AnimatedRoutePath\` / \`MetricPanel\` / \`DigitRoll\` / \`ClipCard\` 等组件拼装，在前景绘制独属于本镜具体剧情/技术架构的动态 SVG 节点、关节挥动、数据脉冲连线、柱状增长图、实时波纹、大字号动能标题与粒子！）
   - **反静止僵硬法则**：每一个分镜从 progress=0 到 progress=1 必须具备肉眼可见的连续演进：
     * 相机动势：\`CameraRig\` 或外层 \`transform\` 持续缓推/平移 + 在节奏点 \`pulse\` 触发微微冲击缩放与震动；
     * 中段形态变化：例如前半拍立势/起笔/构架展开 -> 节拍命中时脉冲连线贯通/框选高亮/数值跃迁；
     * 前景粒子/波纹/飘带/光线随 \`localFrame\` 持续流动画出。
   - **安全留白与尾帧明度法则**：屏幕底部 \`${isPortrait ? 420 : 165}px\` 区域（Y > ${isPortrait ? Math.round(height - 460) : Math.round(height - 170)}）由外部主合成器绘制字幕与进度条，${isPortrait ? '顶部 Y < 220px 为平台状态栏与可配置 AI 标识安全区（严禁把标题或 Kicker 卡片放到 Y < 225px 造成角落遮挡），右侧 X > 910（Y > 680 时）保留平台点赞栏安全区，' : ''}画中主文字/重要视觉主体务必布局在 \`Y = ${isPortrait ? '225 ~ 1410' : '80 ~ 860'}\` 安全区以内！禁止自行额外重复渲染底部大字幕条、AiBadge 或 Audio！最后一个分镜严禁渐变黑屏收尾，务必保持亮色文字/光效清晰直至片尾最后一帧！

=== 绝对不允许触犯的工程红线（触发即被沙箱打回！） ===
1. 输出严格 JSON 对象（禁止外层包裹解释文字）：
   { "files": { "${filePath}": "<完整 TypeScript JSX 代码>" } }
2. 文件路径严格为 \`${filePath}\`，且末尾必须精确导出字典：
   \`\`\`ts
   export interface CustomSceneProps { scene: any; idx: number; total: number; beats: any[]; }
   export const ${exportName}: Record<string, React.FC<CustomSceneProps>> = {
     ${batchScenes.map((s) => `'${s.id}': Scene_${String(s.id).replace(/[^a-zA-Z0-9]/g, '_')}`).join(',\n     ')}
   };
   \`\`\`
   注意键名必须与 batchScenes 中的 \`id\` 逐字完全一致！
3. **严禁出现 \`Math.random(\`、\`@keyframes\`、CSS \`animation:\`、以及英文单词 transition 后跟冒号的语法（即使在注释、类型接口或变量说明中也绝对不能出现 \`transition\` 后紧跟 \`:\`！）**
4. 严禁使用 Node 内置模块、\`eval\`、\`new Function\`、外网 URL、本地盘符、受限商业字体（微软雅黑/宋体/黑体等）。必须仅使用 \`FONT_SANS\` / \`FONT_SERIF\` / \`FONT_MONO\`。
5. **每个 <defs> 里的渐变/滤镜/ClipPath ID 必须附带 \`\${idx}\` 或场景唯一后缀**（如 \`id={\`bg-\${idx}\`}\`），防止多场景同时挂载时 SVG ID 冲突。
6. **TypeScript strict 零错误要求**：
   - 必须为 \`.map\` / 回调参数与对象字典标注明确类型（如 \`(pt: number, i: number)\`、\`const pal: any = MOOD_PRESETS[...]\`）；
   - 若需要使用 \`staticFile\`，只可传入 \`publicAssetFiles\` 里明确存在的文件；不要 import 用不到的变量。
   - 可用的稳定导入路径与符号（不要臆造其它不存在的导出！）：
     * \`from 'remotion'\`: \`AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig\`
     * \`from '../lib/shotcraft'\`: \`ThreeCyberStage, THREE, ThreeCanvas, THREE_STAGE_PRESETS, CameraRig, AnimatedRoutePath, ParallaxHorizon, AppWindow, FocusShot, BeforeAfterWipe, MetricPanel, DigitRoll, ClipCard, PageCam, computeBeatPulse, FONT_SANS, FONT_MONO, FONT_SERIF\`
     * \`from '../lib/narrative-diorama'\`: \`NarrativeDioramaStage, HeroWarriorFigure, StrategicMapStage, SlashBurstOverlay, CalligraphyColumnPanel, MOOD_PRESETS, computeBeatSignal\``

  const user = JSON.stringify(
    {
      task: `请编写模块 ${filePath}（第 ${batchIndex + 1}/${totalBatches} 批，共 ${batchScenes.length} 镜 / 全片 ${totalScenes} 镜）`,
      topic,
      style,
      canvas: { width, height, fps, aspectRatio },
      themePalette: theme,
      bgmSummary: bgmMeta?.analyzed
        ? { bpm: bgmMeta.bpm, beatSec: bgmMeta.beatSec, drops: (bgmMeta.drops || []).slice(0, 8) }
        : undefined,
      scenes: batchScenes.map((s) => ({
        id: s.id,
        index: s.index,
        title: s.title,
        headline: s.headline || s.title,
        narration: s.narration,
        accentWords: s.accentWords || [],
        highlights: s.highlights || [],
        visualBlueprint: s.visualBlueprint || s.motionNotes || s.visualPrompt || s.title,
        layout: s.layout,
        threePreset: s.threePreset || s.stageSpec?.threePreset || undefined,
        txKind: s.transition || 'cut',
        durationSec: s.durationSec,
        durationInFrames: s.durationInFrames,
        startSec: s.startSec,
        stageSpec: s.stageSpec || undefined,
        metrics: s.metrics?.length ? s.metrics : undefined,
        cams: s.cams?.length ? s.cams : undefined,
        marks: s.marks?.length ? s.marks : undefined,
        publicAssetFiles: Array.isArray(s.media) && s.media.length > 0
          ? s.media.map((m) => String(m?.path || '').replace(/^\/+/, '').replace(/\\/g, '/')).filter(Boolean)
          : Array.isArray(s.assetPaths)
            ? s.assetPaths.map((p) => String(p || '').replace(/^\/+/, '').replace(/\\/g, '/')).filter(Boolean)
            : [],
      })),
    },
    null,
    2,
  )

  return { system, user, filePath, exportName }
}

export function buildHtmlCoderSkillsPrompt({
  plan,
  timingContract,
  width,
  height,
  aspectRatio,
}) {
  const system = `你是精通 HyperFrames HTML5/Canvas + GSAP 帧级视频渲染的创意编程专家。
你需要生成一个完全自包含、纯离线零外链、支持 Chromium CDP 逐帧精确 seek 的单个 HTML 文件！

=== HYPERFRAMES 确定性逐帧铁律 (违背会被拒绝重修!) ===
1. 输出严格 JSON：{ "files": { "index.html": "<!doctype html>..." } }。
2. 画布固定为 ${width}x${height} (${aspectRatio})，body/stage margin:0 overflow:hidden；商业字体合规铁律：必须通过 @font-face 加载 'fonts/NotoSansSC-VF.woff2'，使用 'Noto Sans SC', sans-serif 与 'JetBrains Mono', monospace，严禁声明 Microsoft YaHei / SimSun / SimHei 等受限商业字体！
3. 严禁引用任何外部 http/https CDN (GSAP、字体、图片、SVG 外部链接全部禁止！)，若需使用素材，使用相对路径（如 assets/...）。
4. 严禁出现无限自主驱动动画（不可用 CSS @keyframes、不可在 requestAnimationFrame 内自行推进主时间轴，不可使用 Math.random() 造成前后帧不一致，请使用确定性伪随机函数）。
5. 必须内嵌 <script id="dsh-script-data" type="application/json">PLACEHOLDER</script>（注意请保留该 script 标签占位符或完整嵌入数据，系统会自动写回最新脚本）。
6. 必须保留合成器级强制合规叠层：右上/左上 #ai-badge（「AI 辅助创作」）及片尾最后 2 秒展示 #end-notice，且字幕条 bottom 必须避让目标平台安全区（竖屏 ≥ 22% 高度，横屏 ≥ 13% 高度）；若 script.json 包含 avatarClip.path，需保留 <video id="avatar-overlay-video" muted playsinline> 透明通道画中画/全屏叠层并在 window.__seekToFrame 内按 frame / fps 精确同步 currentTime。
7. 必须向全局暴露确定性 seek 接口：
   window.__totalFrames = <totalDurationInFrames>;
   window.__seekToFrame = function(frameIndex) { ... };
   调用 window.__seekToFrame(f) 时必须立刻、同步地将整个 DOM + Canvas（含多镜头粒子/光晕/3D透视变换/数字滚动/转场闪白/双语或中文字幕/音频节拍律动条）渲染至精确的第 f 帧状态！
8. 必须为每个分镜保留对应的 <template id="scene-01">...</template> 或 <section data-scene-id="scene-01"> 元素以配合系统场景覆盖率检测，同时确保多镜头视觉极具大片质感（背景景深光斑、暗角、胶片微噪点、网格/曲线、弹性缩放、清晰字幕条）。`

  const user = JSON.stringify(
    {
      task: '生成 HyperFrames 逐帧可控完整 index.html (严格 JSON { "files": { "index.html": "..." } })',
      canvas: { width, height, aspectRatio, fps: timingContract.fps, totalDurationInFrames: timingContract.totalDurationInFrames },
      aiBadge: Boolean(timingContract.aiBadge),
      theme: plan.theme,
      scenes: timingContract.scenes.map((s, i) => ({
        id: s.id,
        index: s.index,
        title: s.title,
        startFrame: s.startFrame,
        durationInFrames: s.durationInFrames,
        durationSec: s.durationSec,
        shotType: plan.scenes?.[i]?.shotType || 'hero-title',
        headline: plan.scenes?.[i]?.headline || s.title,
        kicker: plan.scenes?.[i]?.kicker || `SCENE 0${i + 1}`,
        metrics: plan.scenes?.[i]?.metrics || [],
        motionNotes: plan.scenes?.[i]?.motionNotes || s.visualPrompt || '',
        assetPaths: s.assetPaths || [],
        subtitles: s.subtitles || [],
      })),
    },
    null,
    2,
  )

  return { system, user }
}
