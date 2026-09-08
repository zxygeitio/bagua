'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { TRIGRAM_SYMBOLS } from '@/lib/qigua/bagua'
import type { TrigramName } from '@/lib/qigua/types'

/**
 * 先天八卦方位采用传统罗盘的南上读法：乾南、坤北、离东、坎西。
 * 器物底图只提供材质；卦符、文字与链接由代码叠加，确保方位准确。
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

const polarPercent = (radius: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad),
  }
}

export function BaguaCompass({ priority = false }: { priority?: boolean }) {
  return (
    <div
      className="bagua-compass"
      role="img"
      aria-label="先天八卦八方位罗盘：乾南、坤北、离东、坎西"
    >
      <Image
        src="/textures/bronze-compass-plate.png"
        alt=""
        fill
        sizes="(max-width: 767px) 86vw, 460px"
        className="compass-plate"
        draggable={false}
        priority={priority}
      />

      <div className="compass-pixel-grain" aria-hidden="true" />
      <div className="compass-light-sweep" aria-hidden="true" />
      <div className="compass-engine-ring compass-engine-ring--outer" aria-hidden="true" />
      <div className="compass-engine-ring compass-engine-ring--inner" aria-hidden="true" />

      <span className="compass-bearing compass-bearing--south" aria-hidden="true">南</span>
      <span className="compass-bearing compass-bearing--east" aria-hidden="true">东</span>
      <span className="compass-bearing compass-bearing--north" aria-hidden="true">北</span>
      <span className="compass-bearing compass-bearing--west" aria-hidden="true">西</span>

      <div className="compass-core-wrap" aria-hidden="true">
        <div className="compass-core-halo" />
        <div className="compass-taiji-css" />
        <span className="compass-core-caption">阴阳枢机</span>
      </div>

      {POSITIONS.map((position) => {
        const point = polarPercent(35.35, position.angle)
        const style = {
          '--compass-x': `${point.x}%`,
          '--compass-y': `${point.y}%`,
        } as CSSProperties

        return (
          <Link
            key={position.trigram}
            href={`/hexagrams/${position.guaId}`}
            style={style}
            className="compass-node"
            title={`${position.trigram} · ${position.direction} · ${position.element}`}
            aria-label={`${position.trigram}卦，${position.direction}，${position.element}`}
          >
            <span className="compass-node__symbol">{TRIGRAM_SYMBOLS[position.trigram]}</span>
            <span className="compass-node__meta">
              <b>{position.trigram}</b>
              <i>{position.direction}</i>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
