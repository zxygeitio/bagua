/**
 * 硬币起卦法（文王三钱法）
 *
 * 规则：
 *  - 投 3 枚硬币（字=正面=3，背=反面=2）
 *  - 六爻按初爻到上爻（自下而上）记录
 *  - 总和 6 = 老阴 ⚋→⚊ 变爻
 *  - 总和 7 = 少阳 ⚊ (阳爻，不变)
 *  - 总和 8 = 少阴 ⚋ (阴爻，不变)
 *  - 总和 9 = 老阳 (7 → 阴) ⚊→⚋ 变爻
 *
 * 概率分布（每爻）：
 *  - 6 = 1/8 = 12.5%
 *  - 7 = 3/8 = 37.5%
 *  - 8 = 3/8 = 37.5%
 *  - 9 = 1/8 = 12.5%
 */
import type { Line } from '../types'
import { randomInt } from '../rng'

type UnpositionedLine = Omit<Line, 'position'>

function flip(rng: () => number): 2 | 3 {
  // 2 = 背（反面），3 = 字（正面）
  return randomInt(rng, 0, 1) === 0 ? 2 : 3
}

function createLine(sum: number): UnpositionedLine {
  switch (sum) {
    case 6:
      return { yinYang: 'yin', isChanging: true, value: 6 }
    case 7:
      return { yinYang: 'yang', isChanging: false, value: 7 }
    case 8:
      return { yinYang: 'yin', isChanging: false, value: 8 }
    case 9:
      return { yinYang: 'yang', isChanging: true, value: 9 }
    default:
      throw new Error(`Invalid coin sum: ${sum}`)
  }
}

export type CoinFace = 2 | 3

export function flipThree(rng: () => number = Math.random): { coins: CoinFace[]; line: UnpositionedLine } {
  const coins: CoinFace[] = [flip(rng), flip(rng), flip(rng)]
  const sum = coins.reduce((total, face) => total + face, 0)
  return { coins, line: createLine(sum) }
}

/** 投一次（3 枚硬币） */
export function flipOnce(rng: () => number = Math.random): UnpositionedLine {
  return flipThree(rng).line
}

/** 完整起卦：6 爻（初爻到上爻） */
export function castCoins(rng: () => number = Math.random): Line[] {
  const lines: Line[] = []
  for (let i = 0; i < 6; i++) {
    const line = flipOnce(rng)
    lines.push({ ...line, position: (i + 1) as Line['position'] })
  }
  return lines
}
