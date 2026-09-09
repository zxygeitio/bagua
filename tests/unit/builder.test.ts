import { describe, it, expect } from 'vitest'
import {
  findHexagramByLines,
  buildHexagram,
  linesToGuaId,
  hasChanging,
  getChangingPositions,
  linesToBinary,
  getAllGuaIds,
  getHexagramSymbol,
} from '@/lib/qigua/builder'
import { castCoins } from '@/lib/qigua/cast/coin'
import { mulberry32 } from '@/lib/qigua/rng'

describe('卦象构建器', () => {
  it('buildHexagram 乾为天 (全阳) → ID=1', () => {
    const lines = Array.from({ length: 6 }, (_, i) => ({
      position: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
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
      position: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
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
    expect(hasChanging(lines)).toBe(lines.some((l) => l.isChanging))
  })

  it('getChangingPositions 位置正确', () => {
    const lines = castCoins(mulberry32(1))
    const positions = getChangingPositions(lines)
    positions.forEach((p) => {
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

describe('卦象符号与边界', () => {
  const mk = (yy: ('yang' | 'yin')[]) =>
    yy.map((y, i) => ({
      position: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
      yinYang: y,
      isChanging: false,
      value: (y === 'yang' ? 7 : 8) as 7 | 8,
    }))

  it('getHexagramSymbol 乾=☰☰、坤=☷☷', () => {
    expect(getHexagramSymbol(mk(Array(6).fill('yang')))).toBe('☰☰')
    expect(getHexagramSymbol(mk(Array(6).fill('yin')))).toBe('☷☷')
  })

  it('getHexagramSymbol 泰（下乾上坤）=☷☰、否（下坤上乾）=☰☷', () => {
    expect(getHexagramSymbol(mk(['yang', 'yang', 'yang', 'yin', 'yin', 'yin']))).toBe('☷☰')
    expect(getHexagramSymbol(mk(['yin', 'yin', 'yin', 'yang', 'yang', 'yang']))).toBe('☰☷')
  })

  it('getHexagramSymbol 组合卦符号逐一对应（上下卦经标准卦形核对）', () => {
    // 革=泽火革：下离[yang,yin,yang]、上兑[yang,yang,yin] → ☱☲
    expect(getHexagramSymbol(mk(['yang', 'yin', 'yang', 'yang', 'yang', 'yin']))).toBe('☱☲')
    // 益=风雷益：下震[yang,yin,yin]、上巽[yin,yang,yang] → ☴☳
    expect(getHexagramSymbol(mk(['yang', 'yin', 'yin', 'yin', 'yang', 'yang']))).toBe('☴☳')
    // 蒙=山水蒙：下坎[yin,yang,yin]、上艮[yin,yin,yang] → ☶☵
    expect(getHexagramSymbol(mk(['yin', 'yang', 'yin', 'yin', 'yin', 'yang']))).toBe('☶☵')
  })

  it('linesToGuaId 乾→1、坤→2', () => {
    expect(linesToGuaId(mk(Array(6).fill('yang')))).toBe(1)
    expect(linesToGuaId(mk(Array(6).fill('yin')))).toBe(2)
  })

  it('buildHexagram 爻数非 6 抛错', () => {
    expect(() => buildHexagram(mk(['yang', 'yang']))).toThrow('卦需要 6 爻')
  })

  it('findHexagramByLines 爻数非 6 返回 undefined', () => {
    expect(findHexagramByLines([{ yinYang: 'yang' }])).toBeUndefined()
  })
})
