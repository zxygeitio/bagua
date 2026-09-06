/**
 * 手动选卦起卦
 */
import type { Line, TrigramName, YaoPosition } from '../types'
import { linesFromTrigram } from '../bagua'

export function castManual(
  upper: TrigramName,
  lower: TrigramName,
  changingPosition?: YaoPosition
): Line[] {
  const upperLines = linesFromTrigram(upper)
  const lowerLines = linesFromTrigram(lower)
  const allLines: Line[] = [...lowerLines, ...upperLines].map((yy, i) => ({
    position: (i + 1) as YaoPosition,
    yinYang: yy,
    isChanging: false,
    value: yy === 'yang' ? 7 : 8,
  }))
  if (changingPosition) {
    const target = allLines[changingPosition - 1]
    if (target) {
      target.isChanging = true
      // 变爻的 value 应该是老阴/老阳（6/9）
      target.value = target.yinYang === 'yang' ? 9 : 6
      target.yinYang = target.yinYang === 'yang' ? 'yin' : 'yang'
    }
  }
  return allLines
}
