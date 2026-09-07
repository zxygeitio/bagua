import clsx from 'clsx'

import type { Gua, YinYang } from '@/lib/iching'
import { hexagramPixelMetrics, type HexagramSize } from '@/styles/theme'

export interface HexagramSymbolProps {
  gua: Pick<Gua, 'yaos'>
  size?: HexagramSize
  yangClassName?: string
  yinClassName?: string
  className?: string
}

/**
 * 像素格卦画：描边、间隙、缺口全部落在整数像素步长上。
 * yang = 实线，yin = 中间断开；动爻用朱砂。
 */
export function HexagramSymbol({
  gua,
  size = 'md',
  yangClassName = 'fill-bagua-text',
  yinClassName = 'fill-bagua-text',
  className,
}: HexagramSymbolProps): JSX.Element {
  const preset = hexagramPixelMetrics(size)
  const rowHeight = preset.stroke + preset.gap
  const totalHeight = rowHeight * 6 - preset.gap
  const ordered = [...gua.yaos].reverse()

  return (
    <svg
      role="img"
      aria-label="卦象符号"
      width={preset.width}
      height={totalHeight}
      viewBox={`0 0 ${preset.width} ${totalHeight}`}
      shapeRendering="crispEdges"
      className={clsx('inline-block pixelated', className)}
    >
      {ordered.map((yao: { yinYang: YinYang; isChanging?: boolean }, displayIdx: number) => {
        const y = displayIdx * rowHeight
        const isYang = yao.yinYang === 'yang'
        const fillClass = yao.isChanging ? 'fill-bagua-primary' : isYang ? yangClassName : yinClassName
        if (isYang) {
          return (
            <rect
              key={displayIdx}
              x={0}
              y={y}
              width={preset.width}
              height={preset.stroke}
              rx={preset.radius}
              className={fillClass}
            />
          )
        }
        const segWidth = (preset.width - preset.yinBreak) / 2
        return (
          <g key={displayIdx}>
            <rect x={0} y={y} width={segWidth} height={preset.stroke} rx={preset.radius} className={fillClass} />
            <rect
              x={segWidth + preset.yinBreak}
              y={y}
              width={segWidth}
              height={preset.stroke}
              rx={preset.radius}
              className={fillClass}
            />
          </g>
        )
      })}
    </svg>
  )
}
