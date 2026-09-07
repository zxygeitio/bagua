'use client'

import { motion } from 'framer-motion'

import { useReducedMotion } from '@/components/shared/useReducedMotion'
import { motionDuration } from '@/styles/theme'

export interface YaoPreview {
  yinYang: 'yang' | 'yin'
  isChanging?: boolean
}

interface YaoStackProps {
  lines: YaoPreview[]
  currentIndex?: number
}

export function YaoStack({ lines, currentIndex }: YaoStackProps) {
  const reduceMotion = useReducedMotion()
  const duration = motionDuration('yaoReveal', reduceMotion) / 1000
  const labels = ['上爻', '五爻', '四爻', '三爻', '二爻', '初爻']

  return (
    <ol className="space-y-2" aria-label="六爻展开">
      {labels.map((label, displayIndex) => {
        const lineIndex = 5 - displayIndex
        const line = lines[lineIndex]
        const isCurrent = currentIndex === lineIndex
        return (
          <li key={label} className="flex items-center gap-3">
            <span className="w-10 font-display text-[10px] tracking-widest text-bagua-muted">{label}</span>
            {line ? (
              <motion.div
                className={`yao-pixel flex-1 ${line.yinYang === 'yin' ? 'is-yin' : 'is-yang'} ${line.isChanging ? 'is-changing' : ''}`}
                initial={reduceMotion ? false : { scaleX: 0.15, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration, ease: 'linear' }}
              >
                {line.yinYang === 'yin' ? <><span /><span /></> : <span />}
              </motion.div>
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
