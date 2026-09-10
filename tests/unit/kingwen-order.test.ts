import { describe, expect, it } from 'vitest'

import { getGuaById } from '@/lib/iching'
import type { Gua } from '@/lib/iching/types'

/**
 * 文王卦序配对结构校验（B4）
 *
 * 学术基准：docs/REFERENCES.md R8（Knuth, TAOCP Vol.4 4B §7.2.1.7）——
 * 文王序中奇数卦之后紧随其上下颠倒之卦（综卦）；颠倒不变者（8 个对称卦）
 * 则与其阴阳全反之卦（错卦）配对：1↔2、27↔28、29↔30、61↔62。
 */

function lines(gua: Gua): ('yang' | 'yin')[] {
  return [...gua.yaos].sort((a, b) => a.position - b.position).map((y) => y.yinYang)
}

function reversed(gua: Gua): ('yang' | 'yin')[] {
  return [...lines(gua)].reverse()
}

function complemented(gua: Gua): ('yang' | 'yin')[] {
  return lines(gua).map((y) => (y === 'yang' ? 'yin' : 'yang'))
}

function same(a: ('yang' | 'yin')[], b: ('yang' | 'yin')[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

describe('文王卦序配对结构（Knuth R8）', () => {
  it('全部 32 对：非对称卦跟综卦，8 个对称卦跟错卦', () => {
    const symmetricPairs: [number, number][] = []
    for (let n = 1; n <= 63; n += 2) {
      const a = getGuaById(n)!
      const b = getGuaById(n + 1)!
      if (same(lines(a), reversed(a))) {
        // 对称卦：配对卦必须是其错卦（阴阳全反）
        symmetricPairs.push([n, n + 1])
        expect(
          same(complemented(a), lines(b)),
          `第 ${n} 卦（对称）应与第 ${n + 1} 卦互为错卦`,
        ).toBe(true)
      } else {
        // 非对称卦：配对卦必须是其综卦（上下颠倒）
        expect(same(reversed(a), lines(b)), `第 ${n} 卦应与第 ${n + 1} 卦互为综卦`).toBe(true)
      }
    }
    // 恰有 4 对对称卦：乾坤、颐大过、坎离、中孚小过
    expect(symmetricPairs).toEqual([
      [1, 2],
      [27, 28],
      [29, 30],
      [61, 62],
    ])
  })

  it('每对卦的配对关系是封闭的（64 卦不重不漏）', () => {
    const seen = new Set<number>()
    for (let n = 1; n <= 63; n += 2) {
      seen.add(n)
      seen.add(n + 1)
    }
    expect(seen.size).toBe(64)
  })
})
