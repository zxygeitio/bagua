import { describe, it, expect } from 'vitest'
import { castCoins, flipOnce } from '@/lib/qigua/cast/coin'
import { mulberry32 } from '@/lib/qigua/rng'

describe('硬币法', () => {
  it('flipOnce 返回合法的 Line', () => {
    const line = flipOnce()
    expect([6, 7, 8, 9]).toContain(line.value)
    expect(['yang', 'yin']).toContain(line.yinYang)
    expect(typeof line.isChanging).toBe('boolean')
  })

  it('6 和 9 是变爻', () => {
    for (let seed = 1; seed <= 1000; seed++) {
      const rng = mulberry32(seed)
      const line = flipOnce(rng)
      if (line.value === 6 || line.value === 9) {
        expect(line.isChanging).toBe(true)
      } else {
        expect(line.isChanging).toBe(false)
      }
    }
  })

  it('castCoins 生成 6 爻', () => {
    const lines = castCoins(mulberry32(42))
    expect(lines.length).toBe(6)
    for (let i = 0; i < 6; i++) {
      expect(lines[i]?.position).toBe(i + 1)
    }
  })

  it('10000 次分布接近理论值 12.5%/37.5%/37.5%/12.5%', () => {
    const counts = { 6: 0, 7: 0, 8: 0, 9: 0 }
    for (let i = 0; i < 10000; i++) {
      const line = flipOnce(Math.random)
      counts[line.value as 6 | 7 | 8 | 9]++
    }
    expect(counts[6] / 10000).toBeCloseTo(0.125, 1)
    expect(counts[7] / 10000).toBeCloseTo(0.375, 1)
    expect(counts[8] / 10000).toBeCloseTo(0.375, 1)
    expect(counts[9] / 10000).toBeCloseTo(0.125, 1)
  })

  it('64 种卦象都能生成（基于种子）', () => {
    const seen = new Set<string>()
    for (let seed = 1; seed <= 10000 && seen.size < 64; seed++) {
      const rng = mulberry32(seed)
      const lines = castCoins(rng)
      const signature = lines.map(l => l.yinYang === 'yang' ? '1' : '0').join('')
      seen.add(signature)
    }
    expect(seen.size).toBeGreaterThanOrEqual(64)
  })
})
