import { describe, it, expect } from 'vitest'
import {
  DAYAN_STALKS,
  castDayan,
  castDayanLine,
  castDayanLineWithTrace,
  dayanChange,
  remainingToValue,
} from '@/lib/qigua/cast/dayan'
import { mulberry32 } from '@/lib/qigua/rng'

describe('大衍筮法', () => {
  it('余策数严格映射为 9/8/7/6', () => {
    expect(remainingToValue(36)).toBe(9)
    expect(remainingToValue(32)).toBe(8)
    expect(remainingToValue(28)).toBe(7)
    expect(remainingToValue(24)).toBe(6)
    expect(() => remainingToValue(20)).toThrow()
    expect(() => remainingToValue(44)).toThrow()
  })

  it('第一变去 5 或 9（余 44 或 40）', () => {
    for (let seed = 1; seed <= 2000; seed++) {
      const { after, trace } = dayanChange(DAYAN_STALKS, mulberry32(seed))
      expect([44, 40]).toContain(after)
      expect(trace.remLeft + trace.remRight).toBe(trace.before - 1 - after)
      expect([4, 8]).toContain(trace.remLeft + trace.remRight)
    }
  })

  it('第二、三变去 4 或 8（归奇之和为 3 或 7）', () => {
    for (let seed = 1; seed <= 2000; seed++) {
      const rng = mulberry32(seed)
      const first = dayanChange(DAYAN_STALKS, rng)
      const second = dayanChange(first.after, rng)
      expect([3, 7]).toContain(second.trace.remLeft + second.trace.remRight)
      expect(second.after).toBe(first.after - 1 - (second.trace.remLeft + second.trace.remRight))
    }
  })

  it('三变后余策必为 36/32/28/24，爻值合法', () => {
    for (let seed = 1; seed <= 2000; seed++) {
      const { line, trace } = castDayanLineWithTrace(mulberry32(seed))
      expect([36, 32, 28, 24]).toContain(trace.remaining)
      expect(remainingToValue(trace.remaining)).toBe(line.value)
      expect(trace.changes.length).toBe(3)
      expect(trace.changes[0]?.before).toBe(49)
    }
  })

  it('6 和 9 是变爻', () => {
    for (let seed = 1; seed <= 2000; seed++) {
      const line = castDayanLine(mulberry32(seed))
      expect(line.isChanging).toBe(line.value === 6 || line.value === 9)
    }
  })

  it('castDayan 生成 6 爻且可重放', () => {
    const a = castDayan(mulberry32(42))
    const b = castDayan(mulberry32(42))
    expect(a.length).toBe(6)
    expect(a).toEqual(b)
    for (let i = 0; i < 6; i++) {
      expect(a[i]?.position).toBe(i + 1)
    }
  })

  it('非法策数抛错', () => {
    expect(() => dayanChange(50, mulberry32(1))).toThrow()
    expect(() => dayanChange(43, mulberry32(1))).toThrow()
    expect(() => dayanChange(48, mulberry32(1))).toThrow()
    expect(() => dayanChange(28, mulberry32(1))).toThrow()
    expect(() => dayanChange(24, mulberry32(1))).toThrow()
  })

  it('40000 爻分布经卡方检验收敛到 1/16、5/16、7/16、3/16（《筮仪》理论分布）', () => {
    // 学术基准：docs/REFERENCES.md R1（王晓刚/宗序平）、R3（孙涤）
    const N = 40000
    const rng = mulberry32(20260909)
    const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 }
    for (let i = 0; i < N; i++) {
      const line = castDayanLine(rng)
      counts[line.value] = (counts[line.value] ?? 0) + 1
    }
    const expected: Record<number, number> = { 6: 1 / 16, 7: 5 / 16, 8: 7 / 16, 9: 3 / 16 }
    let chi2 = 0
    for (const v of [6, 7, 8, 9]) {
      const e = N * expected[v]!
      chi2 += (counts[v]! - e) ** 2 / e
    }
    // df=3，p=0.05 临界值 7.815；种子固定则结果确定，不过即实现错误
    expect(chi2).toBeLessThan(7.815)
    // 老阳:老阴 ≈ 3:1（《易学启蒙》"阳三而阴一"，R6 蒙特卡洛 18.76%:6.25%）
    const ratio = counts[9]! / counts[6]!
    expect(ratio).toBeGreaterThan(2.5)
    expect(ratio).toBeLessThan(3.5)
  })

  it('第一变去 5 的概率约 3/4', () => {
    const N = 20000
    const rng = mulberry32(777)
    let remove5 = 0
    for (let i = 0; i < N; i++) {
      if (dayanChange(DAYAN_STALKS, rng).after === 44) remove5++
    }
    expect(remove5 / N).toBeGreaterThan(0.72)
    expect(remove5 / N).toBeLessThan(0.78)
  })
})
