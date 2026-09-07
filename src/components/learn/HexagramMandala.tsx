'use client'

import { useMemo, useState } from 'react'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getAllHexagrams } from '@/lib/iching'
import type { TrigramName } from '@/types/iching'

/** 文王八卦序：上卦为方位（先天八卦序：乾兑离震巽坎艮坤 → 1-8） */
const UPPER_TRIGRAMS: TrigramName[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

const POSITIONS: { angle: number; trigram: TrigramName; label: string }[] = [
  { angle: 0, trigram: '乾', label: '南' },
  { angle: 45, trigram: '兑', label: '东南' },
  { angle: 90, trigram: '离', label: '东' },
  { angle: 135, trigram: '震', label: '东北' },
  { angle: 180, trigram: '巽', label: '北' },
  { angle: 225, trigram: '坎', label: '西北' },
  { angle: 270, trigram: '艮', label: '西' },
  { angle: 315, trigram: '坤', label: '西南' },
]

/**
 * 64 卦曼陀罗 · 按上卦分 8 区
 * 视觉：圆盘 + 8 个上卦分块（每块 8 卦）
 * 交互：hover 卦象显示卦名 + 上卦
 */
export function HexagramMandala() {
  const [hover, setHover] = useState<number | null>(null)
  const allHexagrams = useMemo(() => getAllHexagrams(), [])

  // 按上卦分组
  const grouped = useMemo(() => {
    const map: Record<TrigramName, typeof allHexagrams[number][]> = {
      乾: [], 兑: [], 离: [], 震: [], 巽: [], 坎: [], 艮: [], 坤: [],
    }
    for (const g of allHexagrams) {
      if (g.shangGua in map) {
        map[g.shangGua as TrigramName].push(g)
      }
    }
    return map
  }, [allHexagrams])

  const size = 600
  const center = size / 2
  const sectionRadius = 240
  const innerRadius = 90
  const hexRadius = (sectionRadius + innerRadius) / 2

  // 计算每个 hexagram 的位置（更宽分布）
  const placedHexagrams: Array<{ gua: typeof allHexagrams[number]; x: number; y: number }> = []
  POSITIONS.forEach((p) => {
    const guas = grouped[p.trigram]
    guas.forEach((g, j) => {
      // 段内分布：8 个卦，从 -20° 到 +20° 均匀分布
      const segAngle = p.angle - 20 + (40 / 7) * j
      const rad = ((segAngle - 90) * Math.PI) / 180
      const x = center + hexRadius * Math.cos(rad)
      const y = center + hexRadius * Math.sin(rad)
      placedHexagrams.push({ gua: g, x, y })
    })
  })

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 640 }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
        {/* 背景圆 */}
        <circle cx={center} cy={center} r={sectionRadius + 30} fill="var(--paper-surface)" />
        <circle cx={center} cy={center} r={sectionRadius} fill="none" stroke="var(--paper-fiber)" strokeWidth="2" />
        <circle cx={center} cy={center} r={innerRadius} fill="var(--paper-canvas)" stroke="var(--paper-ink)" strokeWidth="2" />

        {/* 8 个分隔线 */}
        {POSITIONS.map((p, i) => {
          const rad = ((p.angle - 90) * Math.PI) / 180
          const x1 = center + innerRadius * Math.cos(rad)
          const y1 = center + innerRadius * Math.sin(rad)
          const x2 = center + sectionRadius * Math.cos(rad)
          const y2 = center + sectionRadius * Math.sin(rad)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--paper-fiber)"
              strokeWidth="1"
              opacity="0.5"
            />
          )
        })}

        {/* 中心太极图 */}
        <g transform={`translate(${center} ${center})`}>
          <circle r="50" fill="var(--paper-wash)" stroke="var(--paper-ink)" strokeWidth="2" />
          <path d="M0 -45 C-15 -45 -25 -30 -25 -15 C-25 0 -15 15 0 15 C15 15 25 0 25 -15 C25 -30 15 -45 0 -45 Z" fill="var(--paper-cinnabar)" />
          <path d="M0 45 C15 45 25 30 25 15 C25 0 15 -15 0 -15 C-15 -15 -25 0 -25 15 C-25 30 -15 45 0 45 Z" fill="none" stroke="var(--paper-ink)" strokeWidth="1.5" />
          <circle cx="0" cy="-22" r="3" fill="var(--paper-cinnabar)" />
          <circle cx="0" cy="22" r="3" fill="var(--paper-ink)" />
          <text y="75" textAnchor="middle" fontSize="9" fill="var(--paper-ink)" fontFamily="serif" letterSpacing="3">64 卦</text>
        </g>

        {/* 8 个上卦分块标签（外侧） */}
        {POSITIONS.map((p) => {
          const rad = ((p.angle - 90) * Math.PI) / 180
          const labelRadius = sectionRadius + 18
          const x = center + labelRadius * Math.cos(rad)
          const y = center + labelRadius * Math.sin(rad)
          return (
            <g key={p.trigram} transform={`translate(${x} ${y})`}>
              <text textAnchor="middle" fontSize="16" fill="var(--paper-ink)" fontFamily="serif" fontWeight="500">
                {p.trigram}
              </text>
              <text y="14" textAnchor="middle" fontSize="9" fill="var(--paper-muted)" fontFamily="serif" letterSpacing="2">
                {p.label}
              </text>
            </g>
          )
        })}

        {/* 64 卦象（按上卦分 8 段 · 8 段 × 8 卦 = 64） */}
        {placedHexagrams.map(({ gua, x, y }) => {
          const isHover = hover === gua.id
          return (
            <a
              key={gua.id}
              href={`/hexagrams/${gua.id}`}
              onMouseEnter={() => setHover(gua.id)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            >
              <g transform={`translate(${x} ${y}) scale(${isHover ? 1.8 : 1})`} style={{ transition: 'transform 200ms' }}>
                <HexagramMini gua={gua} highlighted={isHover} />
              </g>
            </a>
          )
        })}
      </svg>

      {/* 悬停提示 */}
      {hover && (
        <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 border-2 border-bagua-text bg-bagua-canvas px-3 py-1 font-display text-sm tracking-widest text-bagua-text shadow-soft">
          #{hover.toString().padStart(2, '0')} · {allHexagrams.find(g => g.id === hover)?.name ?? ''}
        </div>
      )}
    </div>
  )
}

/** 迷你卦象（更大尺寸） */
function HexagramMini({ gua, highlighted }: { gua: { yaos: { yinYang: 'yang' | 'yin' }[] }; highlighted: boolean }) {
  const lines = [...gua.yaos].reverse()
  return (
    <g>
      {highlighted && <circle r="18" fill="var(--paper-cinnabar)" opacity="0.18" />}
      {lines.map((yao, i) => {
        const y = -13 + i * 4.5
        if (yao.yinYang === 'yang') {
          return <rect key={i} x={-10} y={y} width={20} height={3} fill="var(--paper-ink)" />
        }
        return (
          <g key={i}>
            <rect x={-10} y={y} width={8} height={3} fill="var(--paper-ink)" />
            <rect x={2} y={y} width={8} height={3} fill="var(--paper-ink)" />
          </g>
        )
      })}
    </g>
  )
}
