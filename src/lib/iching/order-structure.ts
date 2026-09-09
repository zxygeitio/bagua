/**
 * 卦序结构（v2.0.0 学术深化版 · 卦序结构页的纯逻辑层）
 *
 * 学术依据（docs/REFERENCES.md）：
 *  - R8（Knuth, TAOCP Vol.4 4B §7.2.1.7）：文王序中奇数卦之后紧随其综卦
 *    （上下颠倒）；颠倒不变的 8 个对称卦与其错卦（阴阳全反）配对。
 *  - R14 / 《说卦传》：先天（伏羲）卦位以乾南坤北为框架，八卦取象
 *    「天地定位，山泽通气，雷风相薄，水火不相射」。
 *
 * 二进制编码约定与 src/lib/qigua/bagua.ts 一致：初爻为最高位、自下而上读，
 * 六位二进制串与上下两个三爻组拼接（下卦在前）。
 */

import { getAllHexagrams, getGuaById } from './data-access'
import type { Gua } from './types'
import { TRIGRAM_SYMBOLS, TRIGRAM_TO_BINARY, TRIGRAM_VALUE } from '@/lib/qigua/bagua'
import type { TrigramName } from '@/types/iching'

export type PairType = '综' | '错'

export interface KingwenPair {
  /** 配对中的奇数位卦（文王序 1、3、5…63） */
  a: Gua
  /** 配对中的偶数位卦（文王序 2、4、6…64） */
  b: Gua
  type: PairType
  /** 颠倒不变（对称）卦：乾坤、颐大过、坎离、中孚小过 */
  symmetric: boolean
}

/** 爻数组（按 position 升序）→ 'yang'/'yin' 串 */
function linesOf(gua: Gua): ('yang' | 'yin')[] {
  return [...gua.yaos].sort((x, y) => x.position - y.position).map((y) => y.yinYang)
}

const sameLines = (a: ('yang' | 'yin')[], b: ('yang' | 'yin')[]): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i])

/**
 * 文王卦序 32 对配对结构。
 * 与 tests/unit/kingwen-order.test.ts 同一判定口径：非对称卦配综卦、
 * 8 个对称卦配错卦；结果按文王序原顺序排列，不重不漏 64 卦。
 */
export function kingwenPairs(): KingwenPair[] {
  const pairs: KingwenPair[] = []
  for (let n = 1; n <= 63; n += 2) {
    const a = getGuaById(n)
    const b = getGuaById(n + 1)
    if (!a || !b) continue
    const la = linesOf(a)
    const lb = linesOf(b)
    const symmetric = sameLines(la, [...la].reverse())
    const type: PairType = symmetric ? '错' : '综'
    pairs.push({ a, b, type, symmetric })
  }
  return pairs
}

/** 六爻 → 六位二进制串（初爻为最高位，自下而上） */
export function hexagramBinary(gua: Gua): string {
  return linesOf(gua)
    .map((y) => (y === 'yang' ? '1' : '0'))
    .join('')
}

/** 六位二进制串 → 数值（0–63） */
export function binaryValue(binary: string): number {
  return Number.parseInt(binary, 2)
}

/**
 * 先天八卦二进制一览：卦名、符号、三位二进制（初爻高位）、数值（0–7）。
 * 顺序按先天数（乾一兑二离三震四巽五坎六艮七坤八）。
 */
export const XIANTIAN_TABLE: Array<{
  name: TrigramName
  symbol: string
  binary: string
  value: number
  direction: string
}> = [
  {
    name: '乾',
    symbol: TRIGRAM_SYMBOLS['乾'],
    binary: TRIGRAM_TO_BINARY['乾'],
    value: TRIGRAM_VALUE['乾'],
    direction: '南',
  },
  {
    name: '兑',
    symbol: TRIGRAM_SYMBOLS['兑'],
    binary: TRIGRAM_TO_BINARY['兑'],
    value: TRIGRAM_VALUE['兑'],
    direction: '东南',
  },
  {
    name: '离',
    symbol: TRIGRAM_SYMBOLS['离'],
    binary: TRIGRAM_TO_BINARY['离'],
    value: TRIGRAM_VALUE['离'],
    direction: '东',
  },
  {
    name: '震',
    symbol: TRIGRAM_SYMBOLS['震'],
    binary: TRIGRAM_TO_BINARY['震'],
    value: TRIGRAM_VALUE['震'],
    direction: '东北',
  },
  {
    name: '巽',
    symbol: TRIGRAM_SYMBOLS['巽'],
    binary: TRIGRAM_TO_BINARY['巽'],
    value: TRIGRAM_VALUE['巽'],
    direction: '西南',
  },
  {
    name: '坎',
    symbol: TRIGRAM_SYMBOLS['坎'],
    binary: TRIGRAM_TO_BINARY['坎'],
    value: TRIGRAM_VALUE['坎'],
    direction: '西',
  },
  {
    name: '艮',
    symbol: TRIGRAM_SYMBOLS['艮'],
    binary: TRIGRAM_TO_BINARY['艮'],
    value: TRIGRAM_VALUE['艮'],
    direction: '西北',
  },
  {
    name: '坤',
    symbol: TRIGRAM_SYMBOLS['坤'],
    binary: TRIGRAM_TO_BINARY['坤'],
    value: TRIGRAM_VALUE['坤'],
    direction: '北',
  },
]

/** 全部 64 卦按文王序返回，附二进制编码与数值（供编码总表使用） */
export function hexagramCodeTable(): Array<{
  gua: Gua
  binary: string
  value: number
}> {
  return getAllHexagrams().map((gua) => {
    const binary = hexagramBinary(gua)
    return { gua, binary, value: binaryValue(binary) }
  })
}
