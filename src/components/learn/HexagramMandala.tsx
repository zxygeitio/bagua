'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getAllHexagrams } from '@/lib/iching/data-access'
import type { TrigramName } from '@/types/iching'
import type { Gua } from '@/lib/iching/types'

/** 先天八卦方位与天象属性（上南下北，左西右东） */
const PALACES: {
  trigram: TrigramName
  symbol: string
  nature: string
  label: string
  element: string
  direction: string
  virtue: string
  angle: number
}[] = [
  { trigram: '乾', symbol: '☰', nature: '天', label: '正南 · 天', element: '金', direction: '正南', virtue: '刚健', angle: 0 },
  { trigram: '兑', symbol: '☱', nature: '泽', label: '东南 · 泽', element: '金', direction: '东南', virtue: '和悦', angle: 45 },
  { trigram: '离', symbol: '☲', nature: '火', label: '正东 · 火', element: '火', direction: '正东', virtue: '光明', angle: 90 },
  { trigram: '震', symbol: '☳', nature: '雷', label: '东北 · 雷', element: '木', direction: '东北', virtue: '奋动', angle: 135 },
  { trigram: '坤', symbol: '☷', nature: '地', label: '正北 · 地', element: '土', direction: '正北', virtue: '柔顺', angle: 180 },
  { trigram: '艮', symbol: '☶', nature: '山', label: '西北 · 山', element: '土', direction: '西北', virtue: '笃止', angle: 225 },
  { trigram: '坎', symbol: '☵', nature: '水', label: '正西 · 水', element: '水', direction: '正西', virtue: '深陷', angle: 270 },
  { trigram: '巽', symbol: '☴', nature: '风', label: '西南 · 风', element: '木', direction: '西南', virtue: '顺入', angle: 315 },
]

export function HexagramMandala() {
  const allHexagrams = useMemo(() => getAllHexagrams(), [])
  const [selectedPalace, setSelectedPalace] = useState<TrigramName | 'ALL'>('ALL')
  const [hoverPalace, setHoverPalace] = useState<TrigramName | null>(null)
  const [hoverGuaId, setHoverGuaId] = useState<number | null>(1)
  const [showAllNames, setShowAllNames] = useState(true)

  const effectivePalace = selectedPalace !== 'ALL' ? selectedPalace : hoverPalace

  // 先天八卦下卦次序（乾一、兑二、离三、震四、巽五、坎六、艮七、坤八）
  const trigramOrder: Record<string, number> = useMemo(
    () => ({ 乾: 1, 兑: 2, 离: 3, 震: 4, 巽: 5, 坎: 6, 艮: 7, 坤: 8 }),
    [],
  )

  // 按上卦归纳八宫，并按先天八卦下卦顺序排序，使宫内卦象秩序井然
  const grouped = useMemo(() => {
    const map: Record<TrigramName, Gua[]> = {
      乾: [], 兑: [], 离: [], 震: [], 巽: [], 坎: [], 艮: [], 坤: [],
    }
    for (const g of allHexagrams) {
      if (g.shangGua in map) {
        map[g.shangGua as TrigramName].push(g)
      }
    }
    for (const key of Object.keys(map) as TrigramName[]) {
      map[key].sort((a, b) => (trigramOrder[a.xiaGua] ?? 0) - (trigramOrder[b.xiaGua] ?? 0))
    }
    return map
  }, [allHexagrams, trigramOrder])

  const size = 720
  const center = size / 2 // 360
  const hexRadius = 196
  const textRadius = 224
  const labelRadius = 278
  const innerRadius = 138
  const calloutRadius = 116

  // 计算每个卦在天盘圆周上的精确几何坐标、铭刻角度与刻度
  const placedHexagrams = useMemo(() => {
    const list: Array<{
      gua: Gua
      x: number
      y: number
      nameX: number
      nameY: number
      textRot: number
      tickX1: number
      tickY1: number
      tickX2: number
      tickY2: number
      calloutX: number
      calloutY: number
      angle: number
      palace: TrigramName
    }> = []

    PALACES.forEach((p) => {
      const guas = grouped[p.trigram]
      guas.forEach((g, j) => {
        // 每个八卦区间跨越 45 度，8 卦在其内均匀排布（-18° 到 +18°）
        const segAngle = p.angle - 18 + (36 / 7) * j
        const rad = ((segAngle - 90) * Math.PI) / 180
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)

        const x = center + hexRadius * cos
        const y = center + hexRadius * sin

        const nameX = center + textRadius * cos
        const nameY = center + textRadius * sin

        // 根据所在象限平滑微调文字旋转角度，确保全周天卦名端正可读，绝不倒悬
        const isBottom = segAngle > 90 && segAngle < 270
        const textRot = isBottom ? segAngle + 180 : segAngle

        const tickX1 = center + 188 * cos
        const tickY1 = center + 188 * sin
        const tickX2 = center + 204 * cos
        const tickY2 = center + 204 * sin

        const calloutX = center + calloutRadius * cos
        const calloutY = center + calloutRadius * sin

        list.push({
          gua: g,
          x,
          y,
          nameX,
          nameY,
          textRot,
          tickX1,
          tickY1,
          tickX2,
          tickY2,
          calloutX,
          calloutY,
          angle: segAngle,
          palace: p.trigram,
        })
      })
    })
    return list
  }, [grouped, center, hexRadius, textRadius, calloutRadius])

  // 当前激活或悬停预览宫位的 45 度金光扇面路径
  const activeSectorPath = useMemo(() => {
    if (!effectivePalace) return null
    const pal = PALACES.find((p) => p.trigram === effectivePalace)
    if (!pal) return null

    const startAngle = pal.angle - 22.5
    const endAngle = pal.angle + 22.5
    const rOuter = 248
    const rInner = 132

    const radStart = ((startAngle - 90) * Math.PI) / 180
    const radEnd = ((endAngle - 90) * Math.PI) / 180

    const xO1 = center + rOuter * Math.cos(radStart)
    const yO1 = center + rOuter * Math.sin(radStart)
    const xO2 = center + rOuter * Math.cos(radEnd)
    const yO2 = center + rOuter * Math.sin(radEnd)

    const xI2 = center + rInner * Math.cos(radEnd)
    const yI2 = center + rInner * Math.sin(radEnd)
    const xI1 = center + rInner * Math.cos(radStart)
    const yI1 = center + rInner * Math.sin(radStart)

    return `M ${xO1} ${yO1} A ${rOuter} ${rOuter} 0 0 1 ${xO2} ${yO2} L ${xI2} ${yI2} A ${rInner} ${rInner} 0 0 0 ${xI1} ${yI1} Z`
  }, [effectivePalace, center])

  // 当前正在检视的卦象
  const currentGua = useMemo(() => {
    if (hoverGuaId) {
      return allHexagrams.find((g) => g.id === hoverGuaId) ?? allHexagrams[0]
    }
    return allHexagrams[0]
  }, [hoverGuaId, allHexagrams])

  // 当前选中的八宫卦群
  const palaceGuaList = useMemo(() => {
    if (selectedPalace === 'ALL') return null
    return grouped[selectedPalace] ?? null
  }, [selectedPalace, grouped])

  const hoveredHexData = useMemo(() => {
    return placedHexagrams.find((p) => p.gua.id === hoverGuaId) ?? null
  }, [placedHexagrams, hoverGuaId])

  return (
    <div className="paper-panel w-full border-4 border-bagua-text bg-bagua-surface p-5 md:p-8 shadow-soft">
      {/* 顶部标题栏与八宫筛选条 */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rotate-45 bg-bagua-primary" />
          <h3 className="font-display text-xl tracking-[0.2em] md:text-2xl text-bagua-text">
            璇玑天盘 · 六十四卦圆图
          </h3>
          <span className="h-2.5 w-2.5 rotate-45 bg-bagua-primary" />
        </div>
        <p className="mt-2 font-body text-xs text-bagua-muted max-w-xl">
          宋代邵雍《皇极经世》圆图象数。外围八卦令牌主宰八方，内圈六十四卦星轨周流不息。
        </p>

        {/* 八宫快捷切换标签 */}
        <div className="mt-5 flex flex-wrap justify-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedPalace('ALL')
              setHoverGuaId(1)
            }}
            className={`btn-press px-3 py-1 font-display text-xs tracking-wider transition border-2 ${
              selectedPalace === 'ALL'
                ? 'border-bagua-text bg-bagua-primary text-bagua-surface'
                : 'border-bagua-fiber bg-bagua-canvas text-bagua-muted hover:border-bagua-text hover:text-bagua-text'
            }`}
          >
            周天全览 (64)
          </button>
          {PALACES.map((p) => (
            <button
              key={p.trigram}
              type="button"
              onClick={() => {
                setSelectedPalace((prev) => {
                  if (prev === p.trigram) return 'ALL'
                  const first = grouped[p.trigram][0]
                  if (first) setHoverGuaId(first.id)
                  return p.trigram
                })
              }}
              onMouseEnter={() => setHoverPalace(p.trigram)}
              onMouseLeave={() => setHoverPalace(null)}
              className={`btn-press px-2.5 py-1 font-display text-xs tracking-wider transition border-2 ${
                selectedPalace === p.trigram
                  ? 'border-bagua-text bg-bagua-primary text-bagua-surface'
                  : 'border-bagua-fiber bg-bagua-canvas text-bagua-muted hover:border-bagua-text hover:text-bagua-text'
              }`}
            >
              {p.symbol} {p.trigram}宫 · {p.element}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowAllNames((prev) => !prev)}
            className="btn-press border-2 border-bagua-fiber bg-bagua-surface/80 px-2.5 py-1 font-display text-[11px] text-bagua-muted hover:border-bagua-text hover:text-bagua-text"
            title="切换六十四卦周天卦名常驻显隐"
          >
            {showAllNames ? '全卦名 · 显' : '全卦名 · 隐'}
          </button>
        </div>
      </div>

      {/* 核心天盘区域：3D 青铜浑仪圆盘底座 + 高精度交互天盘 */}
      <div className="relative mx-auto mt-6 w-full max-w-[680px]">
        {/* 3D 青铜浑天仪天盘底座：居中完整嵌套 */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative h-[93%] w-[93%] overflow-hidden rounded-full border-4 border-bagua-text/80 shadow-pixel">
            <Image
              src="/icons/mandala-plate-3d.webp"
              alt="璇玑天盘底座"
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              className="antique-blend object-cover opacity-85"
              priority
            />
            {/* 纸本微光层 */}
            <div className="absolute inset-0 bg-radial from-transparent via-bagua-canvas/20 to-bagua-surface/65 mix-blend-color-burn" />
          </div>
        </div>

        {/* 交互 SVG 矢量层 */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="relative z-10 w-full select-none"
          style={{ touchAction: 'manipulation' }}
        >
          <defs>
            {/* 悬停朱砂发光滤镜 */}
            <filter id="cinnabarGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--paper-cinnabar)" floodOpacity="0.85" />
            </filter>
            {/* 金石微光滤镜 */}
            <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--paper-primary)" floodOpacity="0.65" />
            </filter>
            {/* 令牌立体金石阴影 */}
            <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(44, 36, 22, 0.35)" />
            </filter>
            <filter id="badgeActiveShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="rgba(178, 58, 42, 0.55)" />
            </filter>
          </defs>

          {/* 外圈经纬与天度辅助环 */}
          <circle cx={center} cy={center} r={342} fill="none" stroke="var(--paper-text)" strokeWidth="2" strokeOpacity="0.4" />
          <circle cx={center} cy={center} r={330} fill="none" stroke="var(--paper-text)" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
          <circle cx={center} cy={center} r={labelRadius} fill="none" stroke="var(--paper-text)" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 4" />
          <circle cx={center} cy={center} r={242} fill="none" stroke="var(--paper-primary)" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="3 2" />
          <circle cx={center} cy={center} r={hexRadius} fill="none" stroke="var(--paper-cinnabar)" strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="var(--paper-text)" strokeWidth="1" strokeOpacity="0.3" />
          <circle cx={center} cy={center} r={74} fill="none" stroke="var(--paper-primary)" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="2 2" />

          {/* 八宫辐射分界经线 */}
          {PALACES.map((p, i) => {
            const rad = ((p.angle - 90) * Math.PI) / 180
            const x1 = center + 55 * Math.cos(rad)
            const y1 = center + 55 * Math.sin(rad)
            const x2 = center + 242 * Math.cos(rad)
            const y2 = center + 242 * Math.sin(rad)
            const isPalaceActive = !effectivePalace || effectivePalace === p.trigram
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isPalaceActive ? 'var(--paper-cinnabar)' : 'var(--paper-text)'}
                  strokeWidth={isPalaceActive ? 1.5 : 1}
                  strokeOpacity={isPalaceActive ? 0.75 : 0.22}
                  strokeDasharray="4 3"
                />
              </g>
            )
          })}

          {/* 激活/悬停宫位高亮天区扇面（半透明金石朱晕） */}
          {activeSectorPath && (
            <path
              d={activeSectorPath}
              fill="var(--paper-primary)"
              fillOpacity="0.14"
              stroke="var(--paper-cinnabar)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              strokeOpacity="0.65"
              className="transition-all duration-300 pointer-events-none"
            />
          )}

          {/* 64 卦周天星宿刻度短线 */}
          {placedHexagrams.map(({ gua, tickX1, tickY1, tickX2, tickY2, palace }) => {
            const isPalaceActive = !effectivePalace || effectivePalace === palace
            return (
              <line
                key={`tick-${gua.id}`}
                x1={tickX1}
                y1={tickY1}
                x2={tickX2}
                y2={tickY2}
                stroke={isPalaceActive ? 'var(--paper-text)' : 'var(--paper-fiber)'}
                strokeWidth={hoverGuaId === gua.id ? 2 : 1}
                strokeOpacity={isPalaceActive ? (hoverGuaId === gua.id ? 0.9 : 0.45) : 0.15}
              />
            )
          })}

          {/* 司南定星虚线引轨（从太极核心指向当前感应星宿） */}
          {hoveredHexData && (
            <g className="pointer-events-none transition-all duration-200">
              <line
                x1={center + 48 * Math.cos(((hoveredHexData.angle - 90) * Math.PI) / 180)}
                y1={center + 48 * Math.sin(((hoveredHexData.angle - 90) * Math.PI) / 180)}
                x2={hoveredHexData.x}
                y2={hoveredHexData.y}
                stroke="var(--paper-cinnabar)"
                strokeWidth="1.2"
                strokeOpacity="0.6"
                strokeDasharray="4 2"
              />
              <circle
                cx={center + 48 * Math.cos(((hoveredHexData.angle - 90) * Math.PI) / 180)}
                cy={center + 48 * Math.sin(((hoveredHexData.angle - 90) * Math.PI) / 180)}
                r="2"
                fill="var(--paper-cinnabar)"
              />
            </g>
          )}

          {/* 周天六十四卦铭刻环（径向排布全卦名，带防遮挡宣纸底描金边，自适应端正旋转） */}
          {placedHexagrams.map(({ gua, nameX, nameY, textRot, palace }) => {
            const isHovered = hoverGuaId === gua.id
            const isPalaceActive = !effectivePalace || effectivePalace === palace
            const isPalaceSelected = effectivePalace === palace
            const opacity = isHovered ? 1 : isPalaceSelected ? 1 : effectivePalace ? 0.25 : 0.85
            const fill = isHovered
              ? 'var(--paper-cinnabar)'
              : isPalaceSelected
                ? 'var(--paper-cinnabar)'
                : 'var(--paper-text)'

            return (
              <text
                key={`name-${gua.id}`}
                x={nameX}
                y={nameY}
                transform={`rotate(${textRot} ${nameX} ${nameY})`}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isHovered ? 11 : isPalaceSelected ? 10.5 : 9}
                fontWeight={isHovered || isPalaceSelected ? '700' : '500'}
                fontFamily="serif"
                fill={fill}
                stroke="var(--paper-surface)"
                strokeWidth={isHovered ? 2.8 : 2.2}
                strokeOpacity="0.95"
                paintOrder="stroke fill"
                opacity={showAllNames || isHovered || isPalaceSelected ? opacity : 0}
                className="cursor-pointer transition-all duration-150 select-none"
                onMouseEnter={() => setHoverGuaId(gua.id)}
                onClick={() => setHoverGuaId(gua.id)}
              >
                {gua.chineseName}
              </text>
            )
          })}

          {/* 64 卦星位节点交互 */}
          {placedHexagrams.map(({ gua, x, y, palace }) => {
            const isHovered = hoverGuaId === gua.id
            const isInPalace = !effectivePalace || effectivePalace === palace
            const isPalaceSelected = effectivePalace === palace
            const opacity = isInPalace ? 1 : 0.22

            return (
              <g
                key={gua.id}
                transform={`translate(${x} ${y})`}
                onMouseEnter={() => setHoverGuaId(gua.id)}
                onClick={() => setHoverGuaId(gua.id)}
                className="cursor-pointer"
                opacity={opacity}
              >
                {/* 悬停光环与脉冲圈 */}
                {isHovered && (
                  <>
                    <circle r="16" fill="var(--paper-cinnabar)" opacity="0.35" filter="url(#cinnabarGlow)" />
                    <circle r="11" fill="none" stroke="var(--paper-cinnabar)" strokeWidth="1.5" strokeDasharray="3 2" />
                  </>
                )}

                {/* 激活宫位中的卦点外金石星圈 */}
                {isPalaceSelected && !isHovered && (
                  <circle r="7" fill="none" stroke="var(--paper-cinnabar)" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.75" />
                )}

                {/* 铜铆钉金石节点 */}
                <circle
                  r={isHovered ? 6 : isPalaceSelected ? 4.8 : 4}
                  fill={isHovered || isPalaceSelected ? 'var(--paper-cinnabar)' : 'var(--paper-surface)'}
                  stroke={isHovered ? 'var(--paper-canvas)' : isPalaceSelected ? 'var(--paper-surface)' : 'var(--paper-text)'}
                  strokeWidth={isHovered ? 2 : 1.5}
                  className="transition duration-150"
                />
              </g>
            )
          })}

          {/* 悬停星位实时浮现的「卦位金石铭牌（含六爻卦画）」 */}
          {hoveredHexData && (
            <g className="pointer-events-none transition-all duration-150">
              {/* 连结星位与浮标的星芒引线 */}
              <line
                x1={hoveredHexData.x}
                y1={hoveredHexData.y}
                x2={hoveredHexData.calloutX}
                y2={hoveredHexData.calloutY}
                stroke="var(--paper-cinnabar)"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                strokeOpacity="0.8"
              />
              {/* 浮标铭牌底框 */}
              <g transform={`translate(${hoveredHexData.calloutX} ${hoveredHexData.calloutY})`}>
                <rect
                  x="-46"
                  y="-22"
                  width="92"
                  height="44"
                  rx="5"
                  fill="var(--paper-surface)"
                  stroke="var(--paper-cinnabar)"
                  strokeWidth="1.5"
                  filter="url(#cinnabarGlow)"
                />
                <rect
                  x="-43"
                  y="-19"
                  width="86"
                  height="38"
                  rx="3"
                  fill="none"
                  stroke="rgba(178, 58, 42, 0.35)"
                  strokeWidth="1"
                />
                {/* 卦序与卦名 */}
                <text
                  textAnchor="middle"
                  y="-7"
                  fontSize="12"
                  fontWeight="700"
                  fill="var(--paper-text)"
                  fontFamily="serif"
                >
                  #{hoveredHexData.gua.id} {hoveredHexData.gua.name}
                </text>
                {/* 六爻微缩卦符 */}
                <g transform="translate(0, 4)">
                  {hoveredHexData.gua.yaos.map((yao, idx) => {
                    const lineY = 4 - idx * 2.2
                    return yao.yinYang === 'yang' ? (
                      <line
                        key={idx}
                        x1="-10"
                        y1={lineY}
                        x2="10"
                        y2={lineY}
                        stroke="var(--paper-cinnabar)"
                        strokeWidth="1.4"
                      />
                    ) : (
                      <g key={idx}>
                        <line
                          x1="-10"
                          y1={lineY}
                          x2="-2"
                          y2={lineY}
                          stroke="var(--paper-cinnabar)"
                          strokeWidth="1.4"
                        />
                        <line
                          x1="2"
                          y1={lineY}
                          x2="10"
                          y2={lineY}
                          stroke="var(--paper-cinnabar)"
                          strokeWidth="1.4"
                        />
                      </g>
                    )
                  })}
                </g>
                {/* 上下卦名与五行 */}
                <text
                  textAnchor="middle"
                  y="15"
                  fontSize="8.5"
                  fontWeight="500"
                  fill="var(--paper-cinnabar)"
                  fontFamily="serif"
                >
                  上{hoveredHexData.gua.shangGua} · 下{hoveredHexData.gua.xiaGua}
                </text>
              </g>
            </g>
          )}

          {/* 八方外围「先天八卦浑天金徽」圆盘令牌（圆盘内嵌圆章，气脉贯通） */}
          {PALACES.map((p) => {
            const rad = ((p.angle - 90) * Math.PI) / 180
            const x = center + labelRadius * Math.cos(rad)
            const y = center + labelRadius * Math.sin(rad)
            const isSelected = selectedPalace === p.trigram
            const isHovered = hoverPalace === p.trigram
            const isMatch = !effectivePalace || effectivePalace === p.trigram

            return (
              <g
                key={p.trigram}
                transform={`translate(${x} ${y})`}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedPalace((prev) => {
                    if (prev === p.trigram) return 'ALL'
                    const first = grouped[p.trigram][0]
                    if (first) setHoverGuaId(first.id)
                    return p.trigram
                  })
                }}
                onMouseEnter={() => setHoverPalace(p.trigram)}
                onMouseLeave={() => setHoverPalace(null)}
              >
                {/* 选中与悬停时的朱砂外轮光环 */}
                {(isSelected || isHovered) && (
                  <>
                    <circle
                      r="35"
                      fill="none"
                      stroke="var(--paper-cinnabar)"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity={isSelected ? 0.85 : 0.55}
                    />
                    <circle
                      r="31"
                      fill="var(--paper-cinnabar)"
                      opacity={isSelected ? 0.2 : 0.1}
                      filter="url(#cinnabarGlow)"
                    />
                  </>
                )}

                {/* 常驻微弱天道定位环 */}
                {!isSelected && !isHovered && isMatch && (
                  <circle
                    r="31"
                    fill="none"
                    stroke="var(--paper-primary)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.35"
                  />
                )}

                {/* 圆形徽章底盘 - 外圈金石厚缘 */}
                <circle
                  r="28"
                  fill={isSelected ? 'var(--paper-surface)' : isMatch ? 'var(--paper-surface)' : 'var(--paper-canvas)'}
                  stroke={isSelected ? 'var(--paper-cinnabar)' : isMatch ? 'var(--paper-text)' : 'var(--paper-fiber)'}
                  strokeWidth={isSelected ? 2.5 : 2}
                  filter={isSelected ? 'url(#badgeActiveShadow)' : 'url(#badgeShadow)'}
                  className="transition duration-200"
                />

                {/* 圆形徽章内圈金弦纹 / 朱弦纹 */}
                <circle
                  r="24"
                  fill={isSelected ? 'rgba(178, 58, 42, 0.08)' : isMatch ? 'rgba(221, 172, 82, 0.08)' : 'transparent'}
                  stroke={isSelected ? 'var(--paper-cinnabar)' : isMatch ? 'rgba(221, 172, 82, 0.75)' : 'rgba(44, 36, 22, 0.25)'}
                  strokeWidth="1"
                />

                {/* 同心仿宋连珠微纹 */}
                <circle
                  r="22"
                  fill="none"
                  stroke={isSelected ? 'var(--paper-cinnabar)' : 'var(--paper-fiber)'}
                  strokeWidth="0.6"
                  strokeDasharray="1.5 2"
                  opacity={isSelected ? 0.6 : 0.35}
                />

                {/* 顶部定位金珠 */}
                <circle
                  cx="0"
                  cy="-20"
                  r="1.5"
                  fill={isSelected ? 'var(--paper-cinnabar)' : 'var(--paper-primary)'}
                  opacity={isSelected ? 0.9 : 0.6}
                />

                {/* 先天八卦原象符号 */}
                <text
                  textAnchor="middle"
                  y="-6"
                  fontSize="18"
                  fontWeight="bold"
                  fill={isSelected ? 'var(--paper-cinnabar)' : isMatch ? 'var(--paper-primary)' : 'var(--paper-text)'}
                  fontFamily="serif"
                >
                  {p.symbol}
                </text>

                {/* 卦名与天象 */}
                <text
                  textAnchor="middle"
                  y="6.5"
                  fontSize="10"
                  fontWeight="700"
                  fill={isSelected ? 'var(--paper-cinnabar)' : 'var(--paper-text)'}
                  fontFamily="serif"
                  letterSpacing="0.5"
                >
                  {p.trigram} · {p.nature}
                </text>

                {/* 方位与五行 */}
                <text
                  textAnchor="middle"
                  y="16"
                  fontSize="8"
                  fontWeight="500"
                  fill={isSelected ? 'var(--paper-cinnabar)' : 'var(--paper-muted)'}
                  fontFamily="serif"
                >
                  {p.direction} · {p.element}
                </text>
              </g>
            )
          })}

          {/* 完美的几何数学太极两仪核心 */}
          <g
            transform={`translate(${center} ${center})`}
            className="cursor-pointer"
            onClick={() => setSelectedPalace('ALL')}
          >
            {/* 太极外围金石经纬环 */}
            <circle r="48" fill="var(--paper-surface)" stroke="var(--paper-text)" strokeWidth="2.5" />
            <circle r="43" fill="var(--paper-canvas)" stroke="var(--paper-text)" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />

            {/* 严格几何太极 S 曲线 */}
            <g>
              {/* 阳半场（白） */}
              <circle r="38" fill="var(--paper-surface)" />
              {/* 阴半场（朱砂黑） */}
              <path
                d="M 0,-38 A 38,38 0 0,1 0,38 A 19,19 0 0,1 0,0 A 19,19 0 0,0 0,-38 Z"
                fill="var(--paper-cinnabar)"
              />
              {/* 阴阳双鱼眼：阳中有阴，阴中有阳 */}
              <circle cx="0" cy="-19" r="6" fill="var(--paper-surface)" />
              <circle cx="0" cy="19" r="6" fill="var(--paper-cinnabar)" />
            </g>

            {/* 外围金石回纹 */}
            <circle r="38" fill="none" stroke="var(--paper-text)" strokeWidth="1.5" />

            {/* 四象天极定位金标 */}
            <circle cx="0" cy="-45.5" r="1.5" fill="var(--paper-primary)" />
            <circle cx="0" cy="45.5" r="1.5" fill="var(--paper-primary)" />
            <circle cx="-45.5" cy="0" r="1.5" fill="var(--paper-primary)" />
            <circle cx="45.5" cy="0" r="1.5" fill="var(--paper-primary)" />
          </g>
        </svg>
      </div>

      {/* 卦象动态检视台 (实时同步当前悬停/选中的卦象) */}
      {currentGua && (
        <div className="mt-8 border-4 border-bagua-text bg-bagua-wash/80 p-5 shadow-2xs transition">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            {/* 卦象名称与卦符 */}
            <div className="flex items-center gap-4">
              <div className="relic-frame-square relative flex h-16 w-16 flex-shrink-0 items-center justify-center p-2.5 shadow-xs">
                <HexagramSymbol gua={currentGua} size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xs tracking-widest text-bagua-primary">
                    第 {currentGua.id.toString().padStart(2, '0')} 卦
                  </span>
                  <span className="border border-bagua-text/40 bg-bagua-canvas px-1.5 py-0.5 font-display text-[10px] text-bagua-muted">
                    五行 · {currentGua.wuxing}
                  </span>
                  <span className="border border-bagua-text/40 bg-bagua-canvas px-1.5 py-0.5 font-display text-[10px] text-bagua-primary">
                    {currentGua.shangGua}宫
                  </span>
                </div>
                <h4 className="mt-1 font-display text-2xl tracking-[0.14em] text-bagua-text">
                  {currentGua.name}
                  <span className="ml-2 font-body text-xs text-bagua-muted">({currentGua.pronunciation})</span>
                </h4>
                <p className="mt-0.5 font-body text-xs text-bagua-muted">
                  上{currentGua.shangGua} · 下{currentGua.xiaGua}
                  {currentGua.daXiangZhuan ? ` · “${currentGua.daXiangZhuan.slice(0, 24)}”` : ''}
                </p>
              </div>
            </div>

            {/* 卦辞名句摘录与直达按钮 */}
            <div className="flex flex-col md:items-end gap-3">
              <p className="font-body text-xs leading-relaxed text-bagua-text max-w-md italic">
                “{currentGua.guaci.slice(0, 52)}{currentGua.guaci.length > 52 ? '…' : ''}”
              </p>
              <Link
                href={`/hexagrams/${currentGua.id}`}
                className="btn-press inline-flex items-center gap-1.5 border-2 border-bagua-text bg-bagua-primary px-4 py-1.5 font-display text-xs tracking-widest text-bagua-surface hover:bg-bagua-text transition shadow-xs"
              >
                <span>阅读《{currentGua.name}》完整爻辞</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 八宫卦群展开列表（当用户选择特定宫位时显示该宫所有 8 卦） */}
      {palaceGuaList && (
        <div className="mt-6 border-t-2 border-bagua-fiber/50 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-xs tracking-widest text-bagua-muted">
              {selectedPalace}宫所摄八卦（上卦为{selectedPalace}）：
            </span>
            <span className="font-body text-xs text-bagua-muted">共 8 卦</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-8">
            {palaceGuaList.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setHoverGuaId(g.id)}
                className={`btn-press flex flex-col items-center gap-1.5 border-2 p-2.5 transition text-center ${
                  hoverGuaId === g.id
                    ? 'border-bagua-text bg-bagua-primary text-bagua-surface shadow-xs'
                    : 'border-bagua-fiber bg-bagua-surface hover:border-bagua-text text-bagua-text'
                }`}
              >
                <span className="font-display text-[10px] opacity-75">#{g.id.toString().padStart(2, '0')}</span>
                <span className="font-display text-xs tracking-wider">{g.name}</span>
                <span className="font-body text-[10px] opacity-70">下{g.xiaGua}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
