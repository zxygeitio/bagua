import { describe, it, expect } from 'vitest'
import {
  TRIGRAMS,
  TRIGRAM_SYMBOLS,
  BINARY_TO_TRIGRAM,
  TRIGRAM_TO_BINARY,
  TRIGRAM_VALUE,
  VALUE_TO_TRIGRAM,
  TRIGRAM_WUXING,
  trigramFromLines,
  linesFromTrigram,
  binaryToTrigram,
} from '@/lib/qigua/bagua'
import type { TrigramName } from '@/lib/qigua/types'

describe('八卦编码系统', () => {
  it('TRIGRAMS 恰好八卦且去重', () => {
    expect(TRIGRAMS).toHaveLength(8)
    expect(new Set(TRIGRAMS).size).toBe(8)
    expect(TRIGRAMS).toEqual(['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'])
  })

  it('TRIGRAM_SYMBOLS 八符号齐全且互不相同', () => {
    const symbols = TRIGRAMS.map((n) => TRIGRAM_SYMBOLS[n])
    expect(symbols).toEqual(['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'])
    expect(new Set(symbols).size).toBe(8)
  })

  it('二进制映射双向一致（乾111…坤000）', () => {
    expect(BINARY_TO_TRIGRAM['111']).toBe('乾')
    expect(BINARY_TO_TRIGRAM['000']).toBe('坤')
    for (const [bin, name] of Object.entries(BINARY_TO_TRIGRAM)) {
      expect(TRIGRAM_TO_BINARY[name as TrigramName]).toBe(bin)
    }
    expect(Object.keys(BINARY_TO_TRIGRAM)).toHaveLength(8)
  })

  it('数值映射 0-7 与二进制一致（初爻为高位：parseInt(binary,2)=value）', () => {
    // 约定：乾=7、兑=6、离=5、震=4、巽=3、坎=2、艮=1、坤=0（8-先天卦数）
    expect(TRIGRAM_VALUE['乾']).toBe(7)
    expect(TRIGRAM_VALUE['坤']).toBe(0)
    for (const name of TRIGRAMS) {
      const v = TRIGRAM_VALUE[name]
      expect(VALUE_TO_TRIGRAM[v]).toBe(name)
      expect(parseInt(TRIGRAM_TO_BINARY[name], 2)).toBe(v)
    }
  })

  it('五行映射合《说卦传》第五章体系（乾兑金、震巽木、坎水、离火、艮坤土）', () => {
    expect(TRIGRAM_WUXING['乾']).toBe('金')
    expect(TRIGRAM_WUXING['兑']).toBe('金')
    expect(TRIGRAM_WUXING['离']).toBe('火')
    expect(TRIGRAM_WUXING['震']).toBe('木')
    expect(TRIGRAM_WUXING['巽']).toBe('木')
    expect(TRIGRAM_WUXING['坎']).toBe('水')
    expect(TRIGRAM_WUXING['艮']).toBe('土')
    expect(TRIGRAM_WUXING['坤']).toBe('土')
  })

  it('trigramFromLines / linesFromTrigram 八卦全量往返一致', () => {
    for (const name of TRIGRAMS) {
      const lines = linesFromTrigram(name)
      expect(lines).toHaveLength(3)
      expect(trigramFromLines(lines)).toBe(name)
    }
  })

  it('trigramFromLines 非 3 爻返回 null', () => {
    expect(trigramFromLines([])).toBeNull()
    expect(trigramFromLines(['yang', 'yang'])).toBeNull()
    expect(trigramFromLines(['yang', 'yang', 'yang', 'yang'])).toBeNull()
  })

  it('trigramFromLines 阴阳转二进制正确（兑=阳阳阴=110、巽=阴阳阳=011）', () => {
    expect(trigramFromLines(['yang', 'yang', 'yin'])).toBe('兑')
    expect(trigramFromLines(['yin', 'yang', 'yang'])).toBe('巽')
    expect(trigramFromLines(['yang', 'yin', 'yang'])).toBe('离')
    expect(trigramFromLines(['yang', 'yin', 'yin'])).toBe('震')
    expect(trigramFromLines(['yin', 'yang', 'yin'])).toBe('坎')
    expect(trigramFromLines(['yin', 'yin', 'yang'])).toBe('艮')
    expect(trigramFromLines(['yin', 'yin', 'yin'])).toBe('坤')
  })

  it('binaryToTrigram 合法输入全覆盖', () => {
    for (const name of TRIGRAMS) {
      expect(binaryToTrigram(TRIGRAM_TO_BINARY[name])).toBe(name)
    }
  })

  it('binaryToTrigram 非法输入返回 null', () => {
    expect(binaryToTrigram('')).toBeNull()
    expect(binaryToTrigram('11')).toBeNull()
    expect(binaryToTrigram('1111')).toBeNull()
    expect(binaryToTrigram('abc')).toBeNull()
    expect(binaryToTrigram('01x')).toBeNull()
  })
})
