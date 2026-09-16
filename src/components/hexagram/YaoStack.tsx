import { useReducedMotion } from '@/components/shared/useReducedMotion'

export interface YaoPreview {
  yinYang: 'yang' | 'yin'
  isChanging?: boolean
}

interface YaoStackProps {
  lines: YaoPreview[]
  currentIndex?: number
}

/**
 * 六爻动画条：CSS-only。
 * `.yao-pixel` 在 globals.css 的 @layer 块里已经绑定了 yaoReveal 关键帧动画
 * （scaleX 0.15→1, opacity 0→1, steps(4)），所以这里不需要再叠一层 framer-motion。
 * `prefers-reduced-motion` 由 globals.css 的 reduced-motion 媒体查询自动抹平。
 */
export function YaoStack({ lines, currentIndex }: YaoStackProps) {
  const reduceMotion = useReducedMotion()
  const labels = ['上爻', '五爻', '四爻', '三爻', '二爻', '初爻']

  return (
    <ol className="space-y-2" aria-label="六爻展开">
      {labels.map((label, displayIndex) => {
        const lineIndex = 5 - displayIndex
        const line = lines[lineIndex]
        const isCurrent = currentIndex === lineIndex
        return (
          <li key={label} className="flex items-center gap-3">
            <span className="w-10 font-display text-[10px] tracking-widest text-bagua-muted">
              {label}
            </span>
            {line ? (
              <div
                className={`yao-pixel flex-1 ${line.yinYang === 'yin' ? 'is-yin' : 'is-yang'} ${line.isChanging ? 'is-changing' : ''}`}
                style={reduceMotion ? { animation: 'none', opacity: 1, transform: 'none' } : undefined}
              >
                {line.yinYang === 'yin' ? (
                  <>
                    <span />
                    <span />
                  </>
                ) : (
                  <span />
                )}
              </div>
            ) : (
              <div className="h-1 flex-1 bg-bagua-fiber/40" />
            )}
            {isCurrent ? (
              <span className="font-display text-[10px] text-bagua-primary">
                {line?.yinYang === 'yang' ? '阳' : '阴'}
                {line?.isChanging ? ' · 动' : ''}
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}