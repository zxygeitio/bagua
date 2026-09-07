import { describe, expect, it } from 'vitest'

import {
  MOTION,
  PAPER,
  PIXEL,
  TYPE_ROLES,
  hexagramPixelMetrics,
  motionDuration,
  relativeLuminance,
  snapToPixel,
  themeCssVars,
} from '@/styles/theme'

describe('草纸像素主题', () => {
  it('纸面亮度明显高于旧的近黑博物馆底', () => {
    const paper = relativeLuminance(PAPER.canvas)
    const museumBlack = relativeLuminance('#08080A')
    expect(paper).toBeGreaterThan(0.45)
    expect(paper).toBeGreaterThan(museumBlack * 40)
    expect(PAPER.canvas.toLowerCase()).not.toBe('#08080a')
  })

  it('像素网格与卦画描边都落在整数像素步长上', () => {
    expect(Number.isInteger(PIXEL.step)).toBe(true)
    expect(PIXEL.step).toBeGreaterThan(0)
    expect(PIXEL.stroke % PIXEL.step).toBe(0)
    expect(PIXEL.gap % PIXEL.step).toBe(0)

    for (const size of ['sm', 'md', 'lg'] as const) {
      const metrics = hexagramPixelMetrics(size)
      expect(metrics.width % PIXEL.step).toBe(0)
      expect(metrics.stroke % PIXEL.step).toBe(0)
      expect(metrics.gap % PIXEL.step).toBe(0)
      expect(metrics.yinBreak % PIXEL.step).toBe(0)
      expect(metrics.radius).toBe(0)
    }

    expect(snapToPixel(7.4)).toBe(8)
    expect(snapToPixel(5)).toBe(4)
  })

  it('标题、正文、经文三种排版角色彼此不同', () => {
    expect(TYPE_ROLES.display.family).not.toBe(TYPE_ROLES.body.family)
    expect(TYPE_ROLES.classical.lineHeight).toBeGreaterThan(TYPE_ROLES.body.lineHeight)
    expect(TYPE_ROLES.classical.letterSpacingEm).toBeGreaterThan(TYPE_ROLES.body.letterSpacingEm)
    expect(TYPE_ROLES.body.maxMeasureCh).toBeGreaterThanOrEqual(32)
    expect(TYPE_ROLES.classical.maxMeasureCh).toBeLessThanOrEqual(40)
  })

  it('减弱动效时时长归零，正常时使用出荷时长', () => {
    expect(motionDuration('entrance', true)).toBe(0)
    expect(motionDuration('yaoReveal', true)).toBe(0)
    expect(motionDuration('press', true)).toBe(0)
    expect(motionDuration('entrance', false)).toBe(MOTION.entrance)
    expect(motionDuration('yaoReveal', false)).toBe(MOTION.yaoReveal)
    expect(motionDuration('press', false)).toBe(MOTION.press)
    expect(MOTION.entrance).toBeGreaterThan(0)
  })

  it('CSS 变量由同一套出荷数据生成', () => {
    const vars = themeCssVars()
    expect(vars['--paper-canvas']).toBe(PAPER.canvas)
    expect(vars['--paper-ink']).toBe(PAPER.ink)
    expect(vars['--paper-cinnabar']).toBe(PAPER.cinnabar)
    expect(vars['--pixel-step']).toBe(`${PIXEL.step}px`)
    expect(vars['--type-body-leading']).toBe(String(TYPE_ROLES.body.lineHeight))
    expect(vars['--type-classical-leading']).toBe(String(TYPE_ROLES.classical.lineHeight))
  })
})
