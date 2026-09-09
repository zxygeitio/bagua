import { describe, expect, it } from 'vitest'

import { PAPER, WUXING, relativeLuminance } from '@/styles/theme'

/** WCAG 2.1 对比度（1–21），两色参数顺序无关 */
function contrast(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const hi = Math.max(la, lb)
  const lo = Math.min(la, lb)
  return (hi + 0.05) / (lo + 0.05)
}

const AA_NORMAL = 4.5

describe('WCAG 2.1 AA 对比度门禁（C5）', () => {
  it('正文墨色 ink 在三种纸面底色上均 ≥4.5', () => {
    for (const bg of [PAPER.canvas, PAPER.surface, PAPER.wash]) {
      expect(contrast(PAPER.ink, bg)).toBeGreaterThanOrEqual(AA_NORMAL)
    }
  })

  it('次要文字 muted 在三种纸面底色上均 ≥4.5（历史/设置页正文大量使用）', () => {
    for (const bg of [PAPER.canvas, PAPER.surface, PAPER.wash]) {
      expect(contrast(PAPER.muted, bg)).toBeGreaterThanOrEqual(AA_NORMAL)
    }
  })

  it('主题朱砂 cinnabar 作为文字色在 canvas/surface 上 ≥4.5', () => {
    expect(contrast(PAPER.cinnabar, PAPER.canvas)).toBeGreaterThanOrEqual(AA_NORMAL)
    expect(contrast(PAPER.cinnabar, PAPER.surface)).toBeGreaterThanOrEqual(AA_NORMAL)
  })

  it('朱砂按钮上以 surface 作文字色 ≥4.5（主按钮/回到顶部）', () => {
    expect(contrast(PAPER.surface, PAPER.cinnabar)).toBeGreaterThanOrEqual(AA_NORMAL)
  })

  it('五行分类文字色在 canvas 上 ≥4.5（首页/设置/卦库筛选用作小字标签）', () => {
    for (const color of Object.values(WUXING)) {
      expect(contrast(color, PAPER.canvas)).toBeGreaterThanOrEqual(AA_NORMAL)
    }
  })
})
