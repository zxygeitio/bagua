'use client'

import { useId } from 'react'
import Link from 'next/link'

import { TRIGRAM_SYMBOLS } from '@/lib/qigua/bagua'
import type { TrigramName } from '@/lib/qigua/types'

/**
 * 先天八卦方位：上南、下北、左西、右东。
 * 这里保留中国传统罗盘的“南上”阅读方式，并在每个方位同时显示卦名、卦符与方向。
 */
const POSITIONS: Array<{
  angle: number
  trigram: TrigramName
  guaId: number
  direction: string
  element: string
}> = [
  { angle: 0, trigram: '乾', guaId: 1, direction: '南', element: '天 · 金' },
  { angle: 45, trigram: '兑', guaId: 58, direction: '东南', element: '泽 · 金' },
  { angle: 90, trigram: '离', guaId: 30, direction: '东', element: '火 · 火' },
  { angle: 135, trigram: '震', guaId: 51, direction: '东北', element: '雷 · 木' },
  { angle: 180, trigram: '坤', guaId: 2, direction: '北', element: '地 · 土' },
  { angle: 225, trigram: '巽', guaId: 57, direction: '西南', element: '风 · 木' },
  { angle: 270, trigram: '坎', guaId: 29, direction: '西', element: '水 · 水' },
  { angle: 315, trigram: '艮', guaId: 52, direction: '西北', element: '山 · 土' },
]

const polar = (center: number, radius: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: center + radius * Math.cos(rad),
    y: center + radius * Math.sin(rad),
  }
}

export function BaguaCompass() {
  const size = 420
  const center = size / 2
  const radius = 145
  const id = useId().replace(/:/g, '')
  const ids = {
    core: `compass-core-${id}`,
    scan: `compass-scan-${id}`,
    glow: `compass-glow-${id}`,
  }

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="bagua-compass w-full"
        role="img"
        aria-label="先天八卦八方位罗盘：乾南、坤北、离东、坎西"
      >
        <defs>
          <radialGradient id={ids.core} cx="50%" cy="42%" r="64%">
            <stop offset="0%" stopColor="var(--paper-surface)" />
            <stop offset="70%" stopColor="var(--paper-wash)" />
            <stop offset="100%" stopColor="var(--paper-fiber)" />
          </radialGradient>
          <linearGradient id={ids.scan} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--paper-cinnabar)" stopOpacity="0" />
            <stop offset="46%" stopColor="var(--paper-gold)" stopOpacity="0.78" />
            <stop offset="100%" stopColor="var(--paper-gold)" stopOpacity="0" />
          </linearGradient>
          <filter id={ids.glow} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="compass-orbit compass-orbit--outer" style={{ transformOrigin: `${center}px ${center}px` }}>
          <circle cx={center} cy={center} r={radius + 38} fill="none" stroke="var(--paper-gold)" strokeWidth="1" opacity="0.48" strokeDasharray="2 7" />
          <circle cx={center} cy={center} r={radius + 27} fill="none" stroke="var(--paper-fiber)" strokeWidth="1" opacity="0.42" />
        </g>
        <g className="compass-orbit compass-orbit--inner" style={{ transformOrigin: `${center}px ${center}px` }}>
          <circle cx={center} cy={center} r={radius - 28} fill="none" stroke="var(--paper-fiber)" strokeWidth="1" strokeDasharray="3 5" opacity="0.62" />
          <circle cx={center} cy={center} r={radius - 48} fill="none" stroke="var(--paper-gold)" strokeWidth="1" opacity="0.28" />
        </g>

        <circle cx={center} cy={center} r={radius + 8} fill={`url(#${ids.core})`} stroke="var(--paper-ink)" strokeWidth="1.5" opacity="0.84" />
        <circle cx={center} cy={center} r={radius - 12} fill="none" stroke="var(--paper-ink)" strokeWidth="0.8" opacity="0.32" />
        <path
          className="compass-scan"
          d={`M${center} ${center} L${center} ${center - radius - 42} A${radius + 42} ${radius + 42} 0 0 1 ${center + radius + 42} ${center} Z`}
          fill={`url(#${ids.scan})`}
          opacity="0.25"
          filter={`url(#${ids.glow})`}
        />

        <line x1={center} y1={center - radius - 19} x2={center} y2={center + radius + 19} stroke="var(--paper-cinnabar)" strokeWidth="0.8" opacity="0.28" />
        <line x1={center - radius - 19} y1={center} x2={center + radius + 19} y2={center} stroke="var(--paper-cinnabar)" strokeWidth="0.8" opacity="0.28" />

        {POSITIONS.map((position) => {
          const inner = polar(center, radius - 14, position.angle)
          const outer = polar(center, radius + 14, position.angle)
          return (
            <line
              key={`${position.trigram}-tick`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--paper-ink)"
              strokeWidth={position.angle % 90 === 0 ? 2 : 1}
              opacity={position.angle % 90 === 0 ? 0.62 : 0.35}
            />
          )
        })}

        <text x={center} y="31" textAnchor="middle" fontSize="11" fill="var(--paper-muted)" fontFamily="serif" letterSpacing="3">南 · 天</text>
        <text x={size - 20} y={center + 4} textAnchor="middle" fontSize="11" fill="var(--paper-muted)" fontFamily="serif" letterSpacing="3">东</text>
        <text x={center} y={size - 18} textAnchor="middle" fontSize="11" fill="var(--paper-muted)" fontFamily="serif" letterSpacing="3">北 · 地</text>
        <text x="20" y={center + 4} textAnchor="middle" fontSize="11" fill="var(--paper-muted)" fontFamily="serif" letterSpacing="3">西</text>

        <g className="compass-core" transform={`translate(${center} ${center})`}>
          <circle r="45" fill="var(--paper-wash)" stroke="var(--paper-ink)" strokeWidth="1.5" />
          <path d="M0 -44 C-18 -44 -27 -30 -27 -15 C-27 0 -15 14 0 14 C15 14 27 0 27 -15 C27 -30 18 -44 0 -44Z" fill="var(--paper-cinnabar)" opacity="0.9" />
          <path d="M0 44 C18 44 27 30 27 15 C27 0 15 -14 0 -14 C-15 -14 -27 0 -27 15 C-27 30 -18 44 0 44Z" fill="var(--paper-ink)" opacity="0.88" />
          <circle cy="-15" r="3.5" fill="var(--paper-surface)" />
          <circle cy="15" r="3.5" fill="var(--paper-wash)" />
        </g>
      </svg>

      {POSITIONS.map((position) => {
        const point = polar(center, radius, position.angle)
        return (
          <Link
            key={position.trigram}
            href={`/hexagrams/${position.guaId}`}
            style={{ left: `${(point.x / size) * 100}%`, top: `${(point.y / size) * 100}%` }}
            className="compass-node group absolute flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform duration-300 hover:scale-110"
            title={`${position.trigram} · ${position.direction} · ${position.element}`}
            aria-label={`${position.trigram}卦，${position.direction}，${position.element}`}
          >
            <span className="flex h-12 w-12 items-center justify-center border-2 border-bagua-text bg-bagua-surface text-2xl leading-none text-bagua-text shadow-[3px_3px_0_rgba(44,36,22,.16)] transition group-hover:-translate-y-1 group-hover:border-bagua-primary group-hover:bg-bagua-primary group-hover:text-bagua-surface">
              {TRIGRAM_SYMBOLS[position.trigram]}
            </span>
            <span className="mt-1 font-display text-[11px] tracking-[0.16em] text-bagua-text group-hover:text-bagua-primary">
              {position.trigram}
            </span>
            <span className="font-body text-[9px] text-bagua-muted">{position.direction}</span>
          </Link>
        )
      })}
    </div>
  )
}
