import { describe, it, expect } from 'vitest'
import { castYarrow } from '@/lib/qigua/cast/yarrow'
import { mulberry32 } from '@/lib/qigua/rng'

describe('蓍草法', () => {
  it('生成 6 爻，位置 1-6', () => {
    const lines = castYarrow(mulberry32(42))
    expect(lines.length).toBe(6)
    for (let i = 0; i < 6; i++) {
      expect(lines[i]?.position).toBe(i + 1)
    }
  })

  it('变爻标记正确', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const lines = castYarrow(mulberry32(seed))
      for (const line of lines) {
        if (line.value === 6 || line.value === 9) {
          expect(line.isChanging).toBe(true)
        } else {
          expect(line.isChanging).toBe(false)
        }
      }
    }
  })

  it('10000 次 Monte Carlo 分布接近理论值 6.25%/43.75%/31.25%/18.75%', () => {
    const counts = { 6: 0, 7: 0, 8: 0, 9: 0 }
    for (let i = 0; i < 10000; i++) {
      const lines = castYarrow(Math.random)
      for (const line of lines) {
        counts[line.value as 6 | 7 | 8 | 9]++
      }
    }
    const total = 60000
    expect(counts[6] / total).toBeCloseTo(0.0625, 1)
    expect(counts[7] / total).toBeCloseTo(0.4375, 1)
    expect(counts[8] / total).toBeCloseTo(0.3125, 1)
    expect(counts[9] / total).toBeCloseTo(0.1875, 1)
  }, 30000)
})
