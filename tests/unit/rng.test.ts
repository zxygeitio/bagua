import { describe, it, expect } from 'vitest'
import { mulberry32, seedFromString, randomSeed, randomInt } from '@/lib/qigua/rng'

describe('可重放随机数生成器', () => {
  it('mulberry32 同种子序列完全一致（可重放性）', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    const seqA = Array.from({ length: 10 }, () => a())
    const seqB = Array.from({ length: 10 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('mulberry32 不同种子序列不同', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    const seqA = Array.from({ length: 10 }, () => a())
    const seqB = Array.from({ length: 10 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })

  it('mulberry32 输出落在 [0, 1)', () => {
    const rng = mulberry32(7)
    for (let i = 0; i < 100; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('mulberry32 种子 0 与负种子可正常初始化', () => {
    const a = mulberry32(0)
    const b = mulberry32(-1)
    expect(a()).toBeGreaterThanOrEqual(0)
    expect(b()).toBeGreaterThanOrEqual(0)
  })

  it('seedFromString 确定性：同串同种子', () => {
    expect(seedFromString('乾为天')).toBe(seedFromString('乾为天'))
    expect(seedFromString('')).toBe(seedFromString(''))
  })

  it('seedFromString 异串大概率异种子，且输出为无符号 32 位整数', () => {
    const s1 = seedFromString('乾')
    const s2 = seedFromString('坤')
    expect(s1).not.toBe(s2)
    expect(Number.isInteger(s1)).toBe(true)
    expect(s1).toBeGreaterThanOrEqual(0)
    expect(s1).toBeLessThanOrEqual(0xffffffff)
  })

  it('randomSeed 输出无符号 32 位整数', () => {
    for (let i = 0; i < 10; i++) {
      const s = randomSeed()
      expect(Number.isInteger(s)).toBe(true)
      expect(s).toBeGreaterThanOrEqual(0)
      expect(s).toBeLessThanOrEqual(0xffffffff)
    }
  })

  it('randomInt 闭区间 [min, max] 且为整数', () => {
    const rng = mulberry32(99)
    const seen = new Set<number>()
    for (let i = 0; i < 200; i++) {
      const v = randomInt(rng, 6, 9)
      expect(Number.isInteger(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(6)
      expect(v).toBeLessThanOrEqual(9)
      seen.add(v)
    }
    // 200 次抽样应覆盖 6/7/8/9 全值域
    expect(seen).toEqual(new Set([6, 7, 8, 9]))
  })
})
