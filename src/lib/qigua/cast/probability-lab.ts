/**
 * 概率实验室（v2.0.0 学术深化版 · 硬币法 vs 大衍法蒙特卡洛对比的纯逻辑层）
 *
 * 学术依据（docs/REFERENCES.md）：
 *  - R1 王晓刚/宗序平、R3 孙涤、R6 唐毅：大衍筮法单爻分布
 *    P(6,7,8,9) = 1/16、5/16、7/16、3/16；
 *  - R3 孙涤：两法「阳三而阴一」之别——大衍老阳:老阴 ≈ 3:1（阳三而阴一），
 *    硬币法老阳:老阴 = 1:1（对称）；
 *  - 两法相同的不变量：每爻变爻概率均为 1/4、阳爻概率均为 1/2，
 *    故静卦率与期望动爻数相同——差异只在「阳变/阴变」的结构上。
 *
 * 全部函数为纯函数：蒙特卡洛以注入的 rng 驱动（mulberry32 种子化），
 * 同一种子结果可重放，供静态构建时生成确定数据与单测断言。
 */
import { castDayanLine } from './dayan'
import { flipOnce } from './coin'

export type LineMethod = 'coin' | 'dayan'

export type LineValue = 6 | 7 | 8 | 9

export const LINE_VALUES: readonly LineValue[] = [6, 7, 8, 9] as const

/** 理论分布（单爻 P(6)、P(7)、P(8)、P(9)） */
export const THEORY: Record<LineMethod, Record<LineValue, number>> = {
  coin: { 6: 1 / 8, 7: 3 / 8, 8: 3 / 8, 9: 1 / 8 },
  dayan: { 6: 1 / 16, 7: 5 / 16, 8: 7 / 16, 9: 3 / 16 },
}

/** 卡方检验临界值：df=3、α=0.05 */
export const CHI2_CRITICAL_DF3_005 = 7.815

export interface LineDistribution {
  method: LineMethod
  /** 模拟爻数 */
  trials: number
  /** 各爻值观测计数 */
  counts: Record<LineValue, number>
  /** 各爻值观测频率 */
  frequencies: Record<LineValue, number>
  /** 与理论分布的卡方统计量（df=3） */
  chi2: number
  /** 卡方检验是否通过（α=0.05） */
  chi2Pass: boolean
}

function assertPositiveTrials(trials: number): void {
  if (!Number.isInteger(trials) || trials <= 0) {
    throw new RangeError('trials 必须是正整数')
  }
}

/** 蒙特卡洛模拟单爻分布（rng 注入，同种子可重放） */
export function simulateLineDistribution(
  method: LineMethod,
  trials: number,
  rng: () => number,
): LineDistribution {
  assertPositiveTrials(trials)
  const counts: Record<LineValue, number> = { 6: 0, 7: 0, 8: 0, 9: 0 }
  for (let i = 0; i < trials; i++) {
    const line = method === 'coin' ? flipOnce(rng) : castDayanLine(rng)
    counts[line.value] += 1
  }
  const frequencies = { ...counts }
  for (const v of LINE_VALUES) frequencies[v] = counts[v] / trials
  const chi2 = chiSquareAgainstTheory(method, counts, trials)
  return {
    method,
    trials,
    counts,
    frequencies,
    chi2,
    chi2Pass: chi2 < CHI2_CRITICAL_DF3_005,
  }
}

/** 观测计数 → 对理论分布的卡方统计量（df = 4 类 - 1 = 3） */
export function chiSquareAgainstTheory(
  method: LineMethod,
  counts: Record<LineValue, number>,
  trials: number,
): number {
  assertPositiveTrials(trials)
  let chi2 = 0
  for (const v of LINE_VALUES) {
    const expected = THEORY[method][v] * trials
    chi2 += (counts[v] - expected) ** 2 / expected
  }
  return chi2
}

/**
 * 结构对比：变爻的阴阳结构（「阳三而阴一」指标）
 *  - movingYangRate = P(9)（老阳率）、movingYinRate = P(6)（老阴率）
 *  - ratio = P(9) : P(6)（大衍理论 3:1；硬币理论 1:1）
 */
export interface MovingStructure {
  movingYangRate: number
  movingYinRate: number
  /** 老阳:老阴 观测比（老阴计数为 0 时返回 null） */
  ratio: number | null
}

export function movingStructure(dist: LineDistribution): MovingStructure {
  const movingYangRate = dist.frequencies[9]
  const movingYinRate = dist.frequencies[6]
  const ratio = dist.counts[6] === 0 ? null : Number((dist.counts[9] / dist.counts[6]).toFixed(2))
  return { movingYangRate, movingYinRate, ratio }
}

/**
 * 全卦层面不变量（由单爻分布解析推出，无需模拟）：
 *  - 每爻变爻概率 pMoving、阳爻概率 pYang
 *  - 静卦率 P(六爻皆不变) = (1 - pMoving)^6
 *  - 期望动爻数 = 6 × pMoving
 *  两法在这三项上理论值相同（差异只在阳变/阴变结构）。
 */
export interface HexagramInvariant {
  pMovingPerLine: number
  /** 起得本卦（变爻翻转前）的阳爻概率 */
  pYangPerLine: number
  staticHexagramRate: number
  expectedMovingLines: number
}

export function hexagramInvariant(method: LineMethod): HexagramInvariant {
  const t = THEORY[method]
  const pMovingPerLine = t[6] + t[9]
  const pYangPerLine = t[7] + t[9]
  return {
    pMovingPerLine,
    pYangPerLine,
    staticHexagramRate: Math.pow(1 - pMovingPerLine, 6),
    expectedMovingLines: 6 * pMovingPerLine,
  }
}

/** 观测频率与理论值之差（供页面标注偏差用） */
export function deviationFromTheory(dist: LineDistribution): Record<LineValue, number> {
  const t = THEORY[dist.method]
  const dev = { 6: 0, 7: 0, 8: 0, 9: 0 } as Record<LineValue, number>
  for (const v of LINE_VALUES) dev[v] = dist.frequencies[v] - t[v]
  return dev
}
