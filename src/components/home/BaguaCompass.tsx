'use client'

import Link from 'next/link'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getGuaById } from '@/lib/iching'

/**
 * 先天八卦方位 · 乾南（内圈居中下） / 坤北（内圈居中上） / 离东（右） / 坎西（左）
 * 为视觉清晰，仅取四正卦环绕中心太极
 */
const POSITIONS: { guaId: number; angle: number; label: string; desc: string }[] = [
  { guaId: 1, angle: 0, label: '乾', desc: '南 · 天' },     // 顶部 = 先天南
  { guaId: 2, angle: 180, label: '坤', desc: '北 · 地' },   // 底部 = 先天北
  { guaId: 30, angle: 90, label: '离', desc: '东 · 火' },   // 右
  { guaId: 5, angle: 270, label: '坎', desc: '西 · 水' },   // 左
]

/**
 * 先天八卦方位图（精简版 · 仅四正卦）
 * 视觉：单层圆环 + 四正卦 + 中心太极
 */
export function BaguaCompass() {
  const size = 360
  const center = size / 2
  const radius = 130

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
        {/* 装饰双圆 · 慢速旋转（外环） */}
        <g
          style={{
            transformOrigin: `${center}px ${center}px`,
            transformBox: 'fill-box',
            animation: 'spin-slow 60s linear infinite',
          }}
        >
          <circle
            cx={center}
            cy={center}
            r={radius + 30}
            fill="none"
            stroke="var(--paper-fiber)"
            strokeWidth="1"
            opacity="0.4"
            strokeDasharray="2 6"
          />
        </g>
        <g
          style={{
            transformOrigin: `${center}px ${center}px`,
            transformBox: 'fill-box',
            animation: 'spin-slow-reverse 80s linear infinite',
          }}
        >
          <circle
            cx={center}
            cy={center}
            r={radius - 30}
            fill="none"
            stroke="var(--paper-fiber)"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />
        </g>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--paper-ink)"
          strokeWidth="1.5"
          opacity="0.7"
        />

        {/* 四正位刻度线 */}
        {[0, 90, 180, 270].map((a) => (
          <line
            key={a}
            x1={center + (radius - 8) * Math.cos(((a - 90) * Math.PI) / 180)}
            y1={center + (radius - 8) * Math.sin(((a - 90) * Math.PI) / 180)}
            x2={center + (radius + 8) * Math.cos(((a - 90) * Math.PI) / 180)}
            y2={center + (radius + 8) * Math.sin(((a - 90) * Math.PI) / 180)}
            stroke="var(--paper-ink)"
            strokeWidth="1.5"
            opacity="0.6"
          />
        ))}

        {/* 四方字标（位于外圆外） */}
        <text x={center} y="22" textAnchor="middle" fontSize="11" fill="var(--paper-muted)" fontFamily="serif" letterSpacing="2">南</text>
        <text x={size - 18} y={center + 4} textAnchor="middle" fontSize="11" fill="var(--paper-muted)" fontFamily="serif" letterSpacing="2">东</text>
        <text x={center} y={size - 10} textAnchor="middle" fontSize="11" fill="var(--paper-muted)" fontFamily="serif" letterSpacing="2">北</text>
        <text x="18" y={center + 4} textAnchor="middle" fontSize="11" fill="var(--paper-muted)" fontFamily="serif" letterSpacing="2">西</text>
      </svg>

      {/* 四正卦：HTML 浮层（保证文本清晰 + 完美对齐） */}
      {POSITIONS.map((p) => {
        const rad = ((p.angle - 90) * Math.PI) / 180
        const xPct = ((center + radius * Math.cos(rad)) / size) * 100
        const yPct = ((center + radius * Math.sin(rad)) / size) * 100
        const gua = getGuaById(p.guaId)
        return (
          <Link
            key={p.guaId}
            href={`/hexagrams/${p.guaId}`}
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
            className="group absolute flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform duration-300 hover:scale-110"
            title={p.desc}
          >
            <span className="flex h-12 w-12 items-center justify-center border-4 border-bagua-text bg-bagua-surface font-display text-xl leading-none text-bagua-text transition group-hover:rotate-6 group-hover:bg-bagua-primary group-hover:text-bagua-surface">
              {p.label}
            </span>
            {gua && (
              <div className="mt-1.5 flex h-4 w-12 items-center justify-center">
                <HexagramSymbol gua={gua} size="sm" />
              </div>
            )}
          </Link>
        )
      })}

      {/* 中心太极 · 浮动 + 旋转 */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          animation: 'float-y 6s ease-in-out infinite',
        }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-bagua-text bg-bagua-wash shadow-soft">
          <svg viewBox="0 0 24 24" className="h-14 w-14 text-bagua-primary">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1" />
            <path
              d="M12 3 C8.5 3 6 6 6 9 C6 12 8.5 15 12 15 C15.5 15 18 12 18 9 C18 6 15.5 3 12 3 Z"
              fill="currentColor"
            />
            <path
              d="M12 21 C15.5 21 18 18 18 15 C18 12 15.5 9 12 9 C8.5 9 6 12 6 15 C6 18 8.5 21 12 21 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="12" cy="6" r="1.2" fill="currentColor" />
            <circle cx="12" cy="18" r="1.2" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  )
}
