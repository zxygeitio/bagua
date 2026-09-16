'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'

import { TRIGRAM_SYMBOLS } from '@/lib/qigua/bagua'
import type { TrigramName } from '@/lib/qigua/types'

interface BaguaPosition {
  trigram: TrigramName
  guaId: number
  direction: string
  element: string
  x: number
  y: number
}

const POSITIONS: readonly BaguaPosition[] = [
  { trigram: '乾', guaId: 1, direction: '南', element: '天 · 金', x: 49.94, y: 15.14 },
  { trigram: '兑', guaId: 58, direction: '东南', element: '泽 · 金', x: 74.14, y: 25.30 },
  { trigram: '离', guaId: 30, direction: '东', element: '火 · 火', x: 83.69, y: 49.32 },
  { trigram: '震', guaId: 51, direction: '东北', element: '雷 · 木', x: 74.08, y: 73.26 },
  { trigram: '坤', guaId: 2, direction: '北', element: '地 · 土', x: 49.92, y: 83.19 },
  { trigram: '巽', guaId: 57, direction: '西南', element: '风 · 木', x: 25.76, y: 73.24 },
  { trigram: '坎', guaId: 29, direction: '西', element: '水 · 水', x: 16.02, y: 49.31 },
  { trigram: '艮', guaId: 52, direction: '西北', element: '山 · 土', x: 25.71, y: 25.38 },
] as const

/**
 * 客户端版本：节点使用 `<button>` 以支持 hover 预览 + active 状态。
 * 适用于需要交互选中态的场景（如 `BaguaInteractiveExplorer`）。
 *
 * 首屏 LCP 路径请使用纯 server `BaguaCompass`。
 */
export function BaguaCompassInteractive({
  activeTrigram,
  onSelectTrigram,
}: {
  activeTrigram?: TrigramName | null
  onSelectTrigram?: (trigram: TrigramName) => void
}) {
  return (
    <nav
      className="bagua-compass"
      aria-label="先天八卦方位索引：乾南、坤北、离东、坎西"
    >
      <Image
        src="/textures/bronze-compass-plate.webp"
        alt=""
        fill
        sizes="(max-width: 767px) 86vw, 460px"
        className="compass-plate"
        draggable={false}
      />

      <div className="compass-pixel-grain" aria-hidden="true" />
      <div className="compass-light-sweep" aria-hidden="true" />
      <div className="compass-engine-ring compass-engine-ring--outer" aria-hidden="true" />
      <div className="compass-engine-ring compass-engine-ring--inner" aria-hidden="true" />

      <span className="compass-bearing compass-bearing--south" aria-hidden="true">
        南
      </span>
      <span className="compass-bearing compass-bearing--east" aria-hidden="true">
        东
      </span>
      <span className="compass-bearing compass-bearing--north" aria-hidden="true">
        北
      </span>
      <span className="compass-bearing compass-bearing--west" aria-hidden="true">
        西
      </span>

      <div className="compass-core-wrap" aria-hidden="true">
        <div className="compass-core-halo" />
        <div className="compass-taiji-css" />
      </div>

      {POSITIONS.map((position) => {
        const style = {
          '--compass-x': `${position.x}%`,
          '--compass-y': `${position.y}%`,
        } as CSSProperties
        const isActive = activeTrigram === position.trigram
        const label = `${position.trigram}卦 · 方位${position.direction} · ${position.element}`
        return (
          <button
            key={position.trigram}
            type="button"
            style={style}
            data-active={isActive ? 'true' : undefined}
            onClick={() => onSelectTrigram?.(position.trigram)}
            onMouseEnter={() => onSelectTrigram?.(position.trigram)}
            title={label}
            aria-label={label}
            aria-pressed={isActive}
            className="compass-node"
          >
            <span className="compass-node__symbol" aria-hidden="true">
              {TRIGRAM_SYMBOLS[position.trigram]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}