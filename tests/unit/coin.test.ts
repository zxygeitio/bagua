import { describe, it, expect } from 'vitest'
import { castCoins, flipOnce } from '@/lib/qigua/cast/coin'
import { mulberry32 } from '@/lib/qigua/rng'

describe('硬币法', () => {
  it('三钱组合严格映射为 6/7/8/9', () => {
    const sequence = (values: number[]) => {
      let index = 0
      return () => values[index++] ?? 0
    }

    expect(flipOnce(sequence([0.1, 0.1, 0.1]))).toMatchObject({
      value: 6,
      yinYang: 'yin',
      isChanging: true,
    })
    expect(flipOnce(sequence([0.1, 0.1, 0.9]))).toMatchObject({
      value: 7,
      yinYang: 'yang',
      isChanging: false,
    })
    expect(flipOnce(sequence([0.1, 0.9, 0.9]))).toMatchObject({
      value: 8,
      yinYang: 'yin',
      isChanging: false,
    })
    expect(flipOnce(sequence([0.9, 0.9, 0.9]))).toMatchObject({
      value: 9,
      yinYang: 'yang',
      isChanging: true,
    })
  })

  it('flipOnce 返回未落位的合法爻', () => {
    const line = flipOnce()
    expect([6, 7, 8, 9]).toContain(line.value)
    expect(['yang', 'yin']).toContain(line.yinYang)
    expect(typeof line.isChanging).toBe('boolean')
    expect(line).not.toHaveProperty('position')
  })

  it('6 和 9 是变爻', () => {
    for (let seed = 1; seed <= 1000; seed++) {
      const rng = mulberry32(seed)
      const line = flipOnce(rng)
      if (line.value === 6 || line.value === 9) {
        expect(line.isChanging).toBe(true)
      } else {
        expect(line.isChanging).toBe(false)
      }
    }
  })

  it('castCoins 生成 6 爻', () => {
    const lines = castCoins(mulberry32(42))
    expect(lines.length).toBe(6)
    for (let i = 0; i < 6; i++) {
      expect(lines[i]?.position).toBe(i + 1)
    }
  })

  it('10000 次分布接近理论值 12.5%/37.5%/37.5%/12.5%', () => {
    const counts = { 6: 0, 7: 0, 8: 0, 9: 0 }
    for (let i = 0; i < 10000; i++) {
      const line = flipOnce(Math.random)
      counts[line.value as 6 | 7 | 8 | 9]++
    }
    expect(counts[6] / 10000).toBeCloseTo(0.125, 1)
    expect(counts[7] / 10000).toBeCloseTo(0.375, 1)
    expect(counts[8] / 10000).toBeCloseTo(0.375, 1)
    expect(counts[9] / 10000).toBeCloseTo(0.125, 1)
  })

  it('64 种卦象都能生成（基于种子）', () => {
    const seen = new Set<string>()
    for (let seed = 1; seed <= 10000 && seen.size < 64; seed++) {
      const rng = mulberry32(seed)
      const lines = castCoins(rng)
      const signature = lines.map((l) => (l.yinYang === 'yang' ? '1' : '0')).join('')
      seen.add(signature)
    }
    expect(seen.size).toBeGreaterThanOrEqual(64)
  })
})

import { flipThree } from '@/lib/qigua/cast/coin'

describe('硬币法概率属性测试（B1）', () => {
  it('40000 爻经卡方检验收敛到 2:6:6:2（R1/R4 理论分布）', () => {
    // 学术基准：docs/REFERENCES.md R4（乔宗方/姜桂芝），硬币法老阳老阴各 1/8
    const N = 40000
    const rng = mulberry32(20260909)
    const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 }
    for (let i = 0; i < N; i++) {
      const line = flipThree(rng).line
      counts[line.value!] = (counts[line.value!] ?? 0) + 1
    }
    const expected: Record<number, number> = { 6: 1 / 8, 7: 3 / 8, 8: 3 / 8, 9: 1 / 8 }
    let chi2 = 0
    for (const v of [6, 7, 8, 9]) {
      const e = N * expected[v]!
      chi2 += (counts[v]! - e) ** 2 / e
    }
    // df=3，p=0.05 临界值 7.815；种子固定则结果确定
    expect(chi2).toBeLessThan(7.815)
    // 硬币法老阳:老阴 = 1:1（与大衍法 3:1 结构不同，R4）
    const ratio = counts[9]! / counts[6]!
    expect(ratio).toBeGreaterThan(0.85)
    expect(ratio).toBeLessThan(1.15)
  })
})
