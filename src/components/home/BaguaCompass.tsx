'use client'

import Link from 'next/link'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getGuaById } from '@/lib/iching'
import type { TrigramName } from '@/types/iching'

/** 先天八卦方位 · 乾南坤北，离东坎西 */
const POSITIONS: { trigram: TrigramName; angle: number; label: string; desc: string }[] = [
  { trigram: '离', angle: 90, label: '离', desc: '东 · 火' },
  { trigram: '坤', angle: 180, label: '坤', desc: '南 · 地' },
  { trigram: '兑', angle: 135, label: '兑', desc: '东南 · 泽' },
  { trigram: '乾', angle: 0, label: '乾', desc: '北 · 天' },
  { trigram: '坎', angle: 270, label: '坎', desc: '西 · 水' },
  { trigram: '艮', angle: 225, label: '艮', desc: '西南 · 山' },
  { trigram: '震', angle: 45, label: '震', desc: '东北 · 雷' },
  { trigram: '巽', angle: 315, label: '巽', desc: '西北 · 风' },
]

/**
 * 先天八卦方位图（圆形布局） — 朱红为主调，鼠标可点
 * 视觉：外圈刻度 + 中圈卦名 + 内圈双鱼图
 */
export function BaguaCompass() {
  // 用于查看先天八卦序
  void getGuaById
  const radius = 145
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* 装饰圆环 */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* 三层圆环 */}
        <circle cx="200" cy="200" r="190" fill="none" stroke="var(--paper-fiber)" strokeWidth="1" opacity="0.5" />
        <circle cx="200" cy="200" r={radius + 28} fill="none" stroke="var(--paper-fiber)" strokeWidth="1" opacity="0.6" />
        <circle cx="200" cy="200" r={radius - 8} fill="none" stroke="var(--paper-ink)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
        <circle cx="200" cy="200" r="58" fill="none" stroke="var(--paper-cinnabar)" strokeWidth="2" opacity="0.7" />
        {/* 四方刻度 */}
        {[0, 90, 180, 270].map(a => (
          <line
            key={a}
            x1="200"
            y1="10"
            x2="200"
            y2="22"
            stroke="var(--paper-ink)"
            strokeWidth="1"
            transform={`rotate(${a} 200 200)`}
            opacity="0.5"
          />
        ))}
        {/* 四方字标 */}
        <text x="200" y="30" textAnchor="middle" fontSize="12" fill="var(--paper-ink)" fontFamily="serif" letterSpacing="2">北</text>
        <text x="370" y="204" textAnchor="middle" fontSize="12" fill="var(--paper-ink)" fontFamily="serif" letterSpacing="2">东</text>
        <text x="200" y="382" textAnchor="middle" fontSize="12" fill="var(--paper-ink)" fontFamily="serif" letterSpacing="2">南</text>
        <text x="30" y="204" textAnchor="middle" fontSize="12" fill="var(--paper-ink)" fontFamily="serif" letterSpacing="2">西</text>
      </svg>

      {/* 中心：太极图 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-bagua-text bg-bagua-wash shadow-soft">
          <svg viewBox="0 0 24 24" className="h-20 w-20 text-bagua-primary">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 3 C9 3 6 6 6 9 C6 12 9 15 12 15 C15 15 18 12 18 9 C18 6 15 3 12 3 Z" fill="currentColor" />
            <path d="M12 21 C15 21 18 18 18 15 C18 12 15 9 12 9 C9 9 6 12 6 15 C6 18 9 21 12 21 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <p className="mt-2 text-center font-display text-[10px] tracking-[0.4em] text-bagua-text">陰陽</p>
      </div>

      {/* 八方卦象 */}
      {POSITIONS.map((p, i) => {
        // 角度 0 = 北（上）, 90 = 东（右）, 180 = 南（下）, 270 = 西（左）
        const rad = ((p.angle - 90) * Math.PI) / 180
        const x = 200 + radius * Math.cos(rad)
        const y = 200 + radius * Math.sin(rad)
        // 找到对应的卦象 ID（先天序：1 乾, 2 兑, 3 离, 4 震, 5 巽, 6 坎, 7 艮, 8 坤）
        const guaId = (['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'] as const).indexOf(p.trigram) + 1
        const gua = getGuaById(guaId)
        return (
          <Link
            key={p.trigram}
            href={`/hexagrams/${guaId}`}
            style={{
              left: `${(x / 400) * 100}%`,
              top: `${(y / 400) * 100}%`,
              animationDelay: `${i * 60}ms`,
            }}
            className="group absolute flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center enter-up"
            title={`${p.label} · ${p.desc}`}
          >
            <span className="flex h-14 w-14 items-center justify-center border-4 border-bagua-text bg-bagua-surface font-display text-2xl leading-none text-bagua-text transition group-hover:scale-110 group-hover:bg-bagua-primary group-hover:text-bagua-surface">
              {p.label}
            </span>
            {gua && (
              <div className="mt-1 scale-[0.45] opacity-70 transition group-hover:opacity-100">
                <HexagramSymbol gua={gua} size="sm" />
              </div>
            )}
            <span className="mt-1 hidden font-display text-[9px] tracking-widest text-bagua-muted md:block">
              {p.desc.split(' · ')[1] ?? p.desc}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
