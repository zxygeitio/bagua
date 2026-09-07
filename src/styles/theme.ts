/**
 * 出荷视觉系统：草纸底 + 像素格 + 三种中文排版角色 + 动效时长。
 * 页面通过 CSS 变量消费这份数据，测试直接导入同一模块。
 */

export const PAPER = {
  canvas: '#E7D3A4',
  surface: '#F3E6C4',
  fiber: '#C9A56A',
  ink: '#2C2416',
  muted: '#6E5A3C',
  cinnabar: '#B23A2A',
  rule: '#2C2416',
  wash: '#DCC59A',
} as const

/**
 * 五行配色 — 各家互不相同，与纸本主调和谐
 *  木 青  火 朱  土 沙  金 月白  水 墨
 */
export const WUXING = {
  wood: '#3F7A3A',   // 草青
  fire: '#B23A2A',   // 朱砂 (与 primary 一致)
  earth: '#B8893A',  // 黄沙
  metal: '#A8A092',  // 月白
  water: '#1F4F6B',  // 墨青
} as const

export const PIXEL = {
  step: 4,
  stroke: 4,
  gap: 4,
} as const

export const TYPE_ROLES = {
  display: {
    family: 'var(--font-display), "Cubic 11", ui-monospace, monospace',
    sizePx: 40,
    lineHeight: 1.2,
    letterSpacingEm: 0.08,
    maxMeasureCh: 16,
  },
  body: {
    family: 'var(--font-body), "Noto Serif SC", "Songti SC", serif',
    sizePx: 16,
    lineHeight: 1.75,
    letterSpacingEm: 0.02,
    maxMeasureCh: 42,
  },
  classical: {
    family: 'var(--font-classical), "Noto Serif SC", "Songti SC", serif',
    sizePx: 20,
    lineHeight: 2.05,
    letterSpacingEm: 0.12,
    maxMeasureCh: 32,
  },
} as const

export const MOTION = {
  entrance: 520,
  yaoReveal: 360,
  press: 90,
} as const

export type MotionName = keyof typeof MOTION
export type HexagramSize = 'sm' | 'md' | 'lg'

export interface HexagramPixelMetrics {
  width: number
  stroke: number
  gap: number
  yinBreak: number
  radius: 0
}

export function relativeLuminance(hex: string): number {
  const normalized = hex.replace('#', '').trim()
  if (normalized.length !== 6) {
    throw new Error(`expected 6-digit hex color, got ${hex}`)
  }
  const channel = (offset: number) => {
    const value = Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  const r = channel(0)
  const g = channel(2)
  const b = channel(4)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function snapToPixel(value: number, step: number = PIXEL.step): number {
  return Math.round(value / step) * step
}

export function hexagramPixelMetrics(size: HexagramSize): HexagramPixelMetrics {
  const columns = size === 'sm' ? 14 : size === 'md' ? 22 : 36
  const stroke = size === 'lg' ? PIXEL.step * 2 : PIXEL.step
  return {
    width: columns * PIXEL.step,
    stroke,
    gap: PIXEL.step,
    yinBreak: PIXEL.step * (size === 'sm' ? 1 : 2),
    radius: 0,
  }
}

export function motionDuration(name: MotionName, reduceMotion: boolean): number {
  if (reduceMotion) return 0
  return MOTION[name]
}

export function themeCssVars(): Record<string, string> {
  return {
    '--paper-canvas': PAPER.canvas,
    '--paper-surface': PAPER.surface,
    '--paper-fiber': PAPER.fiber,
    '--paper-ink': PAPER.ink,
    '--paper-muted': PAPER.muted,
    '--paper-cinnabar': PAPER.cinnabar,
    '--paper-rule': PAPER.rule,
    '--paper-wash': PAPER.wash,
    '--wuxing-wood': WUXING.wood,
    '--wuxing-fire': WUXING.fire,
    '--wuxing-earth': WUXING.earth,
    '--wuxing-metal': WUXING.metal,
    '--wuxing-water': WUXING.water,
    '--pixel-step': `${PIXEL.step}px`,
    '--type-display-size': `${TYPE_ROLES.display.sizePx}px`,
    '--type-body-size': `${TYPE_ROLES.body.sizePx}px`,
    '--type-classical-size': `${TYPE_ROLES.classical.sizePx}px`,
    '--type-display-leading': String(TYPE_ROLES.display.lineHeight),
    '--type-body-leading': String(TYPE_ROLES.body.lineHeight),
    '--type-classical-leading': String(TYPE_ROLES.classical.lineHeight),
    '--type-display-tracking': `${TYPE_ROLES.display.letterSpacingEm}em`,
    '--type-body-tracking': `${TYPE_ROLES.body.letterSpacingEm}em`,
    '--type-classical-tracking': `${TYPE_ROLES.classical.letterSpacingEm}em`,
    '--type-body-measure': `${TYPE_ROLES.body.maxMeasureCh}ch`,
    '--type-classical-measure': `${TYPE_ROLES.classical.maxMeasureCh}ch`,
    '--motion-entrance': `${MOTION.entrance}ms`,
    '--motion-yao': `${MOTION.yaoReveal}ms`,
    '--motion-press': `${MOTION.press}ms`,
  }
}
