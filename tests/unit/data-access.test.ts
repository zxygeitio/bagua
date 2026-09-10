import { describe, it, expect } from 'vitest'
import {
  getGuaById,
  getGuaByName,
  getGuaByTrigrams,
  findGuaByLines,
  searchHexagrams,
  getHexagramsByWuXing,
  getHexagramsByTrigram,
  getHexagramsByScenario,
  getAllHexagrams,
  selfCheck,
} from '@/lib/iching/data-access'

describe('64卦数据访问层', () => {
  it('getGuaById 边界：1=乾为天、64=未济、越界 undefined', () => {
    expect(getGuaById(1)?.name).toBe('乾为天')
    expect(getGuaById(64)?.chineseName).toBe('未济')
    expect(getGuaById(0)).toBeUndefined()
    expect(getGuaById(65)).toBeUndefined()
  })

  it('getGuaByName 支持简称与全称', () => {
    expect(getGuaByName('乾')?.id).toBe(1)
    expect(getGuaByName('乾为天')?.id).toBe(1)
    expect(getGuaByName('不存在的卦')).toBeUndefined()
  })

  it('getGuaByTrigrams 上乾下乾得乾，未知组合得空数组', () => {
    const qian = getGuaByTrigrams('乾', '乾')
    expect(qian).toHaveLength(1)
    expect(qian[0]!.id).toBe(1)
    expect(getGuaByTrigrams('无', '无')).toEqual([])
  })

  it('findGuaByLines 初爻到上爻匹配，非 6 爻返回 undefined', () => {
    const allYang = Array.from({ length: 6 }, () => ({ yinYang: 'yang' as const }))
    expect(findGuaByLines(allYang)?.id).toBe(1)
    // 泰：下乾上坤（初二三阳、四五上阴）
    const tai = [
      ...allYang.slice(0, 3),
      ...Array.from({ length: 3 }, () => ({ yinYang: 'yin' as const })),
    ]
    expect(findGuaByLines(tai)?.name).toBe('地天泰')
    expect(findGuaByLines(allYang.slice(0, 5))).toBeUndefined()
  })

  it('searchHexagrams 空串返回空，中文名/关键词可命中', () => {
    expect(searchHexagrams('')).toEqual([])
    expect(searchHexagrams('  ')).toEqual([])
    const byName = searchHexagrams('乾')
    expect(byName.length).toBeGreaterThanOrEqual(1)
    expect(byName.some((g) => g.id === 1)).toBe(true)
    // 大小写不敏感（拼音）
    const byPinyin = searchHexagrams('QIAN')
    expect(byPinyin.some((g) => g.id === 1)).toBe(true)
  })

  it('getHexagramsByWuXing 金卦包含乾兑', () => {
    const metal = getHexagramsByWuXing('金')
    expect(metal.some((g) => g.id === 1)).toBe(true) // 乾为天
    expect(getHexagramsByWuXing('不存在')).toEqual([])
  })

  it('getHexagramsByTrigram 上/下卦位筛选互异', () => {
    const upperQian = getHexagramsByTrigram('乾', 'upper')
    const lowerQian = getHexagramsByTrigram('乾', 'lower')
    expect(upperQian.length).toBeGreaterThanOrEqual(8)
    expect(lowerQian.length).toBeGreaterThanOrEqual(8)
    // 泰（下乾上坤）不在上乾集合、在乾上卦为天？
    expect(upperQian.some((g) => g.id === 11)).toBe(false) // 泰上卦为坤
    expect(lowerQian.some((g) => g.id === 11)).toBe(true) // 泰下卦为乾
  })

  it('getHexagramsByScenario 场景筛选有效', () => {
    const career = getHexagramsByScenario('career')
    expect(career.length).toBeGreaterThanOrEqual(1)
    expect(getHexagramsByScenario('不存在的场景' as never)).toEqual([])
  })

  it('getAllHexagrams 恒为 64 卦', () => {
    expect(getAllHexagrams()).toHaveLength(64)
  })

  it('selfCheck 数据完整性（64 卦 + 错卦对合）', () => {
    const { ok, issues } = selfCheck()
    expect(ok).toBe(true)
    expect(issues).toEqual([])
  })
})
