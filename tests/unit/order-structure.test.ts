import { describe, expect, it } from 'vitest'

import { getAllHexagrams, getGuaById } from '@/lib/iching/data-access'
import {
  XIANTIAN_TABLE,
  binaryValue,
  hexagramBinary,
  hexagramCodeTable,
  kingwenPairs,
} from '@/lib/iching/order-structure'
import { TRIGRAM_TO_BINARY } from '@/lib/qigua/bagua'

const reverseLines = (binary: string): string => [...binary].reverse().join('')
const invertLines = (binary: string): string =>
  [...binary].map((c) => (c === '1' ? '0' : '1')).join('')

describe('kingwenPairs（文王卦序 32 对配对结构）', () => {
  it('恰好 32 对、64 卦不重不漏且按文王序排列', () => {
    const pairs = kingwenPairs()
    expect(pairs).toHaveLength(32)
    const ids = pairs.flatMap((p) => [p.a.id, p.b.id])
    expect(new Set(ids).size).toBe(64)
    expect(ids).toEqual(Array.from({ length: 64 }, (_, i) => i + 1))
  })

  it('非对称卦配综卦：偶数位卦二进制 = 奇数位卦二进制倒置', () => {
    for (const p of kingwenPairs()) {
      if (p.symmetric) continue
      expect(p.type).toBe('综')
      expect(hexagramBinary(p.b)).toBe(reverseLines(hexagramBinary(p.a)))
    }
  })

  it('8 个对称卦（4 对）配错卦：偶数位卦二进制 = 奇数位卦二进制全反', () => {
    const pairs = kingwenPairs().filter((p) => p.symmetric)
    expect(pairs).toHaveLength(4)
    expect(pairs.map((p) => p.a.id)).toEqual([1, 27, 29, 61])
    expect(pairs.map((p) => p.b.id)).toEqual([2, 28, 30, 62])
    for (const p of pairs) {
      expect(p.type).toBe('错')
      expect(hexagramBinary(p.b)).toBe(invertLines(hexagramBinary(p.a)))
    }
  })
})

describe('hexagramBinary / binaryValue（六位二进制编码）', () => {
  it('乾为 111111（63）、坤为 000000（0）', () => {
    expect(hexagramBinary(getGuaById(1)!)).toBe('111111')
    expect(binaryValue('111111')).toBe(63)
    expect(hexagramBinary(getGuaById(2)!)).toBe('000000')
    expect(binaryValue('000000')).toBe(0)
  })

  it('等于下卦二进制 + 上卦二进制（下卦在前拼接）', () => {
    for (const gua of getAllHexagrams()) {
      const expected = TRIGRAM_TO_BINARY[gua.xiaGua] + TRIGRAM_TO_BINARY[gua.shangGua]
      expect(hexagramBinary(gua)).toBe(expected)
    }
  })
})

describe('hexagramCodeTable（64 卦编码总表）', () => {
  it('覆盖 64 卦、数值 0–63 各出现一次、按文王序排列', () => {
    const table = hexagramCodeTable()
    expect(table).toHaveLength(64)
    const values = table.map((row) => row.value)
    expect(new Set(values).size).toBe(64)
    expect([...values].sort((a, b) => a - b)).toEqual(Array.from({ length: 64 }, (_, i) => i))
    expect(table.map((row) => row.gua.id)).toEqual(Array.from({ length: 64 }, (_, i) => i + 1))
    expect(table.every((row) => row.binary.length === 6)).toBe(true)
  })
})

describe('XIANTIAN_TABLE（先天八卦二进制一览）', () => {
  it('8 卦齐全、二进制与数值一致、值 0–7 唯一', () => {
    expect(XIANTIAN_TABLE).toHaveLength(8)
    expect(XIANTIAN_TABLE.map((r) => r.name)).toEqual([
      '乾',
      '兑',
      '离',
      '震',
      '巽',
      '坎',
      '艮',
      '坤',
    ])
    for (const row of XIANTIAN_TABLE) {
      expect(row.binary).toBe(TRIGRAM_TO_BINARY[row.name])
      expect(row.value).toBe(Number.parseInt(row.binary, 2))
      expect(row.symbol).toBeTruthy()
      expect(row.direction).toBeTruthy()
    }
    const values = XIANTIAN_TABLE.map((r) => r.value)
    expect(new Set(values).size).toBe(8)
  })

  it('先天方位框架：乾南坤北、离东坎西', () => {
    const byName = Object.fromEntries(XIANTIAN_TABLE.map((r) => [r.name, r.direction]))
    expect(byName['乾']).toBe('南')
    expect(byName['坤']).toBe('北')
    expect(byName['离']).toBe('东')
    expect(byName['坎']).toBe('西')
  })
})
