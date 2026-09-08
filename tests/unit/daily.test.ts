import { describe, expect, it } from 'vitest'

import { dailySeed, castDaily } from '@/lib/qigua/daily'

describe('每日一卦', () => {
  it('同一天种子稳定，不同天不同', () => {
    const a = dailySeed(new Date(2026, 8, 7, 1))
    const b = dailySeed(new Date(2026, 8, 7, 23))
    const c = dailySeed(new Date(2026, 8, 8, 1))
    expect(a).toBe(b)
    expect(a).not.toBe(c)
    expect(castDaily(new Date('2026-09-07T08:00:00Z'))).toHaveLength(6)
  })
})
