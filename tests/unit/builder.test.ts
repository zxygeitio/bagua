import { describe, it, expect } from 'vitest'
import { findHexagramByLines, buildHexagram, linesToGuaId, hasChanging, getChangingPositions, linesToBinary, getAllGuaIds } from '@/lib/qigua/builder'
import { castCoins } from '@/lib/qigua/cast/coin'
import { mulberry32 } from '@/lib/qigua/rng'

describe('卦象构建器', () => {
  it('buildHexagram 乾为天 (全阳) → ID=1', () => {
    const lines = Array.from({ length: 6 }, (_, i) => ({
      position: (i + 1) as 1|2|3|4|5|6,
      yinYang: 'yang' as const,
      isChanging: false,
      value: 7 as const,
    }))
    const { gua, id } = buildHexagram(lines)
    expect(id).toBe(1)
    expect(gua.name).toContain('乾')
  })

  it('buildHexagram 坤为地 (全阴) → ID=2', () => {
    const lines = Array.from({ length: 6 }, (_, i) => ({
      position: (i + 1) as 1|2|3|4|5|6,
      yinYang: 'yin' as const,
      isChanging: false,
      value: 8 as const,
    }))
    const { gua, id } = buildHexagram(lines)
    expect(id).toBe(2)
    expect(gua.name).toContain('坤')
  })

  it('hasChanging 检测变爻', () => {
    const lines = castCoins(mulberry32(1))
    expect(typeof hasChanging(lines)).toBe('boolean')
    expect(hasChanging(lines)).toBe(lines.some(l => l.isChanging))
  })

  it('getChangingPositions 位置正确', () => {
    const lines = castCoins(mulberry32(1))
    const positions = getChangingPositions(lines)
    positions.forEach(p => {
      expect(lines[p - 1]?.isChanging).toBe(true)
    })
  })

  it('linesToBinary 6位字符串', () => {
    const lines = castCoins(mulberry32(1))
    const binary = linesToBinary(lines)
    expect(binary).toHaveLength(6)
    expect(binary).toMatch(/^[01]{6}$/)
  })

  it('getAllGuaIds 返回 1-64', () => {
    const ids = getAllGuaIds()
    expect(ids).toHaveLength(64)
    expect(ids[0]).toBe(1)
    expect(ids[63]).toBe(64)
  })

  it('findHexagramByLines 通过阴阳爻匹配查找卦', () => {
    const yangLines = Array.from({ length: 6 }, () => ({ yinYang: 'yang' as const }))
    const gua = findHexagramByLines(yangLines)
    expect(gua?.id).toBe(1)
  })
})
