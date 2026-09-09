import { describe, expect, it } from 'vitest'

import { mulberry32 } from '@/lib/qigua/rng'
import {
  CHI2_CRITICAL_DF3_005,
  LINE_VALUES,
  THEORY,
  deviationFromTheory,
  hexagramInvariant,
  movingStructure,
  simulateLineDistribution,
} from '@/lib/qigua/cast/probability-lab'

const TRIALS = 40_000
const SEED = 20260909

describe('THEORY（理论分布）', () => {
  it('两法四类概率各自和为 1', () => {
    for (const method of ['coin', 'dayan'] as const) {
      const total = LINE_VALUES.reduce((s, v) => s + THEORY[method][v], 0)
      expect(total).toBeCloseTo(1, 12)
    }
  })

  it('大衍理论 = 1/16、5/16、7/16、3/16（R1/R3/R6）', () => {
    expect(THEORY.dayan[6]).toBeCloseTo(1 / 16, 12)
    expect(THEORY.dayan[7]).toBeCloseTo(5 / 16, 12)
    expect(THEORY.dayan[8]).toBeCloseTo(7 / 16, 12)
    expect(THEORY.dayan[9]).toBeCloseTo(3 / 16, 12)
  })

  it('硬币理论 = 1/8、3/8、3/8、1/8', () => {
    expect(THEORY.coin[6]).toBeCloseTo(1 / 8, 12)
    expect(THEORY.coin[7]).toBeCloseTo(3 / 8, 12)
    expect(THEORY.coin[8]).toBeCloseTo(3 / 8, 12)
    expect(THEORY.coin[9]).toBeCloseTo(1 / 8, 12)
  })
})

describe('simulateLineDistribution（蒙特卡洛，种子可重放）', () => {
  it('拒绝非正整数模拟次数', () => {
    expect(() => simulateLineDistribution('coin', 0, mulberry32(SEED))).toThrow(
      'trials 必须是正整数',
    )
    expect(() => simulateLineDistribution('dayan', 1.5, mulberry32(SEED))).toThrow(
      'trials 必须是正整数',
    )
  })

  it('同种子两次模拟结果完全一致（可重放）', () => {
    const a = simulateLineDistribution('dayan', 2000, mulberry32(SEED))
    const b = simulateLineDistribution('dayan', 2000, mulberry32(SEED))
    expect(a.counts).toEqual(b.counts)
    expect(a.chi2).toBe(b.chi2)
  })

  it('计数总和等于模拟爻数', () => {
    for (const method of ['coin', 'dayan'] as const) {
      const dist = simulateLineDistribution(method, 5000, mulberry32(SEED))
      const total = LINE_VALUES.reduce((s, v) => s + dist.counts[v], 0)
      expect(total).toBe(5000)
    }
  })

  it('40000 爻两法均通过卡方检验（df=3，α=0.05）', () => {
    const coin = simulateLineDistribution('coin', TRIALS, mulberry32(SEED))
    const dayan = simulateLineDistribution('dayan', TRIALS, mulberry32(SEED))
    expect(coin.chi2Pass).toBe(true)
    expect(dayan.chi2Pass).toBe(true)
    expect(coin.chi2).toBeLessThan(CHI2_CRITICAL_DF3_005)
    expect(dayan.chi2).toBeLessThan(CHI2_CRITICAL_DF3_005)
  })

  it('观测频率偏差均小于 1%', () => {
    for (const method of ['coin', 'dayan'] as const) {
      const dist = simulateLineDistribution(method, TRIALS, mulberry32(SEED))
      const dev = deviationFromTheory(dist)
      for (const v of LINE_VALUES) expect(Math.abs(dev[v])).toBeLessThan(0.01)
    }
  })
})

describe('movingStructure（阳三而阴一）', () => {
  it('大衍老阳:老阴观测比接近 3:1、硬币接近 1:1', () => {
    const dayan = simulateLineDistribution('dayan', TRIALS, mulberry32(SEED))
    const coin = simulateLineDistribution('coin', TRIALS, mulberry32(SEED))
    const d = movingStructure(dayan)
    const c = movingStructure(coin)
    expect(d.ratio).not.toBeNull()
    expect(d.ratio!).toBeGreaterThan(2.5)
    expect(d.ratio!).toBeLessThan(3.5)
    expect(c.ratio).not.toBeNull()
    expect(c.ratio!).toBeGreaterThan(0.75)
    expect(c.ratio!).toBeLessThan(1.35)
  })
})

describe('hexagramInvariant（全卦层面不变量，解析推出）', () => {
  it('两法每爻变爻率均为 1/4、阳爻率均为 1/2', () => {
    for (const method of ['coin', 'dayan'] as const) {
      const inv = hexagramInvariant(method)
      expect(inv.pMovingPerLine).toBeCloseTo(0.25, 12)
      expect(inv.pYangPerLine).toBeCloseTo(0.5, 12)
    }
  })

  it('静卦率 (3/4)^6 ≈ 0.1780、期望动爻数 1.5（两法相同）', () => {
    for (const method of ['coin', 'dayan'] as const) {
      const inv = hexagramInvariant(method)
      expect(inv.staticHexagramRate).toBeCloseTo(Math.pow(0.75, 6), 12)
      expect(inv.staticHexagramRate).toBeCloseTo(0.178, 3)
      expect(inv.expectedMovingLines).toBeCloseTo(1.5, 12)
    }
  })
})
