/**
 * 蓍草揲占法（大衍之数，修正版）
 *
 * 规则（按《周易本义·筮仪》）：
 *  - 大衍之数五十，其用四十有九（扣除太极一根为不变之象）
 *  - 每爻 18 变（3 次"分二、挂一、揲四、归奇"）
 *  - 挂一取自右堆，再左右揲四归奇：
 *      第一变（49 根）归奇数为 5 或 9
 *      第二、三变归奇数为 4 或 8
 *  - 余数 → 爻类型（过揲之数 ÷ 4）：
 *      36 = 老阳 (9) ⚊→⚋ 变爻
 *      32 = 少阳 (7) ⚊ 不变
 *      28 = 少阴 (8) ⚋ 不变
 *      24 = 老阴 (6) ⚋→⚊ 变爻
 *
 *  真实概率分布（理论）：
 *  - 少阳 7/16 = 43.75%
 *  - 少阴 5/16 = 31.25%
 *  - 老阳 3/16 = 18.75%
 *  - 老阴 1/16 = 6.25%
 */
import type { Line, StalksRemaining } from '../types'
import { randomInt } from '../rng'

/** 归奇数的合法取值：第一变为 5/9，第二三变为 4/8 */
function legalQi(stalks: number): [number, number] {
  return stalks % 4 === 1 ? [5, 9] : [4, 8]
}

/**
 * 枚举合法的分堆点（左堆大小）。
 * 挂一取自右堆，故左右两堆揲四后 l + r = stalks - 1，
 * 归奇数 = leftRem + rightRem + 1 必落在 legalQi 内。
 */
function getLegalSplits(stalks: number): number[] {
  const [a, b] = legalQi(stalks)
  const legal: number[] = []
  for (let l = 1; l <= stalks - 2; l++) {
    const r = stalks - 1 - l
    const lr = l % 4 || 4
    const rr = r % 4 || 4
    const qi = lr + rr + 1
    if (qi === a || qi === b) {
      legal.push(l)
    }
  }
  return legal
}

/** 单次"分二、挂一、揲四、归奇" - 约束版 */
function oneChange(stalks: number, rng: () => number): number {
  const splits = getLegalSplits(stalks)
  if (splits.length === 0) {
    throw new Error(`蓍草法无法在 ${stalks} 根时找到合法分堆点`)
  }
  const left = splits[randomInt(rng, 0, splits.length - 1)]!
  const right = stalks - 1 - left
  const leftRem = left % 4 || 4
  const rightRem = right % 4 || 4
  return stalks - leftRem - rightRem - 1
}

/** 一次 18 变（三次一变） */
function castOneYao(rng: () => number): StalksRemaining {
  let stalks = 49
  for (let i = 0; i < 3; i++) {
    stalks = oneChange(stalks, rng)
  }
  if (stalks !== 24 && stalks !== 28 && stalks !== 32 && stalks !== 36) {
    throw new Error(`Invalid yarrow stalks remaining: ${stalks} (expected 24/28/32/36)`)
  }
  return stalks as StalksRemaining
}

function createLine(stalks: StalksRemaining, position: 1|2|3|4|5|6): Line {
  switch (stalks) {
    case 36:
      return { position, yinYang: 'yang', isChanging: true, value: 9 }
    case 32:
      return { position, yinYang: 'yang', isChanging: false, value: 7 }
    case 28:
      return { position, yinYang: 'yin', isChanging: false, value: 8 }
    case 24:
      return { position, yinYang: 'yin', isChanging: true, value: 6 }
  }
}

/** 完整起卦：6 爻（初爻到上爻） */
export function castYarrow(rng: () => number = Math.random): Line[] {
  const lines: Line[] = []
  for (let i = 0; i < 6; i++) {
    const stalks = castOneYao(rng)
    lines.push(createLine(stalks, (i + 1) as 1|2|3|4|5|6))
  }
  return lines
}

export { getLegalSplits }
