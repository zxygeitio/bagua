/**
 * 硬币起卦法（最常用）
 *
 * 规则：
 *  - 投 3 枚硬币（字=正面=3，背=反面=2）
 *  - 总和 6 = 老阴 (8 → 阳) ⚋→⚊ 变爻
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

function flip(rng: () => number): 2 | 3 {
  // 2 = 背（反面），3 = 字（正面）
  return randomInt(rng, 0, 1) === 0 ? 2 : 3
}

function createLine(sum: number): Line {
  const position = 0 // 占位，由调用方设置
  switch (sum) {
    case 6:
      return { position: 1, yinYang: 'yin', isChanging: true, value: 6 }
    case 7:
      return { position: 1, yinYang: 'yang', isChanging: false, value: 7 }
    case 8:
      return { position: 1, yinYang: 'yin', isChanging: false, value: 8 }
    case 9:
      return { position: 1, yinYang: 'yang', isChanging: true, value: 9 }
    default:
      throw new Error(`Invalid coin sum: ${sum}`)
  }
}

export type CoinFace = 2 | 3

export function flipThree(rng: () => number = Math.random): { coins: CoinFace[]; line: Line } {
  const coins: CoinFace[] = [flip(rng), flip(rng), flip(rng)]
  const sum = coins.reduce((total, face) => total + face, 0)
  return { coins, line: createLine(sum) }
}

/** 投一次（3 枚硬币） */
export function flipOnce(rng: () => number = Math.random): Line {
  return flipThree(rng).line
}

/** 完整起卦：6 爻（初爻到上爻） */
export function castCoins(rng: () => number = Math.random): Line[] {
  const lines: Line[] = []
  for (let i = 0; i < 6; i++) {
    const line = flipOnce(rng)
    line.position = (i + 1) as 1 | 2 | 3 | 4 | 5 | 6
    lines.push(line)
  }
  return lines
}
