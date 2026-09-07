import { describe, expect, it } from 'vitest'

import { buildHexagram } from '@/lib/qigua/builder'
import { castMeihua, castTime, xiantianMod6, xiantianMod8, xiantianName } from '@/lib/qigua/cast/meihua'
import { dailySeed, castDaily } from '@/lib/qigua/daily'

describe('梅花易数', () => {
  it('先天数 8 归坤、6 归坎，0 回绕为 8 与 6', () => {
    expect(xiantianMod8(8)).toBe(8)
    expect(xiantianMod8(16)).toBe(8)
    expect(xiantianMod8(0)).toBe(8)
    expect(xiantianName(1)).toBe('乾')
    expect(xiantianName(8)).toBe('坤')
    expect(xiantianMod6(6)).toBe(6)
    expect(xiantianMod6(0)).toBe(6)
  })

  it('上乾下坤动初爻，得到天地否而初爻为变', () => {
    const lines = castMeihua({ upper: 1, lower: 8, moving: 1 })
    expect(lines).toHaveLength(6)
    expect(lines[0]?.isChanging).toBe(true)
    expect(lines.slice(1).every((line) => !line.isChanging)).toBe(true)
    expect(buildHexagram(lines).gua.chineseName).toBe('否')
  })

  it('同一时刻两次时间起卦结果相同', () => {
    const at = new Date('2026-09-07T13:00:00+08:00')
    const a = castTime(at)
    const b = castTime(at)
    expect(a.map((line) => line.value)).toEqual(b.map((line) => line.value))
  })
})

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
