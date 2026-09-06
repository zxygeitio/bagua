import clsx from 'clsx'

import type { Gua, YinYang } from '@/lib/iching'

export interface HexagramSymbolProps {
  /** 完整卦象对象（仅使用 yaos 字段） */
  gua: Pick<Gua, 'yaos'>
  /** 尺寸预设 */
  size?: 'sm' | 'md' | 'lg'
  /** 爻的阴阳色彩 */
  yangClassName?: string
  yinClassName?: string
  className?: string
}

interface SizePreset {
  width: number
  stroke: number
  gap: number
  radius: number
}

const SIZE_PRESETS: Record<NonNullable<HexagramSymbolProps['size']>, SizePreset> = {
  sm: { width: 56, stroke: 4, gap: 2, radius: 1 },
  md: { width: 96, stroke: 6, gap: 3, radius: 1.5 },
  lg: { width: 160, stroke: 10, gap: 4, radius: 2 },
}

/**
 * 卦象符号 - SVG 渲染六爻（自上而下显示）
 * yang = 实线 ━━━，yin = 断线 ━  ━
 */
export function HexagramSymbol({
  gua,
  size = 'md',
  yangClassName = 'fill-bagua-primary',
  yinClassName = 'fill-bagua-muted',
  className,
}: HexagramSymbolProps): JSX.Element {
  const preset = SIZE_PRESETS[size]
  const rowHeight = preset.stroke + preset.gap
  const totalHeight = rowHeight * 6 - preset.gap

  // yaos[0] 在数据中为初爻（position=1），显示时需自上而下排列
  const ordered = [...gua.yaos].reverse()

  return (
    <svg
      role="img"
      aria-label="卦象符号"
      width={preset.width}
      height={totalHeight}
      viewBox={`0 0 ${preset.width} ${totalHeight}`}
      className={clsx('inline-block', className)}
    >
      {ordered.map((yao: { yinYang: YinYang }, displayIdx: number) => {
        const y = displayIdx * rowHeight
        const isYang = yao.yinYang === 'yang'
        const x1 = preset.radius
        const x2 = preset.width - preset.radius
        if (isYang) {
          return (
            <rect
              key={displayIdx}
              x={x1}
              y={y}
              width={x2 - x1}
              height={preset.stroke}
              rx={preset.radius}
              className={yangClassName}
            />
          )
        }
        const segWidth = (x2 - x1 - preset.stroke) / 2
        return (
          <g key={displayIdx}>
            <rect
              x={x1}
              y={y}
              width={segWidth}
              height={preset.stroke}
              rx={preset.radius}
              className={yinClassName}
            />
            <rect
              x={x1 + segWidth + preset.stroke}
              y={y}
              width={segWidth}
              height={preset.stroke}
              rx={preset.radius}
              className={yinClassName}
            />
          </g>
        )
      })}
    </svg>
  )
}
