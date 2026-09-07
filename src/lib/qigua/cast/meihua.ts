/**
 * 梅花易数 / 时间起卦
 * 先天数：乾1 兑2 离3 震4 巽5 坎6 艮7 坤8
 */
import { linesFromTrigram } from '../bagua'
import type { Line, TrigramName, YaoPosition } from '../types'

export const XIANTIAN_ORDER: TrigramName[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

export function xiantianMod8(value: number): number {
  const remainder = Math.abs(Math.trunc(value)) % 8
  return remainder === 0 ? 8 : remainder
}

export function xiantianMod6(value: number): YaoPosition {
  const remainder = Math.abs(Math.trunc(value)) % 6
  return (remainder === 0 ? 6 : remainder) as YaoPosition
}

export function xiantianName(value: number): TrigramName {
  return XIANTIAN_ORDER[xiantianMod8(value) - 1]!
}

export function trigramsToLines(upper: TrigramName, lower: TrigramName, moving: YaoPosition): Line[] {
  const yinYangs = [...linesFromTrigram(lower), ...linesFromTrigram(upper)]
  return yinYangs.map((yinYang, index) => {
    const position = (index + 1) as YaoPosition
    const isChanging = position === moving
    const value = yinYang === 'yang' ? (isChanging ? 9 : 7) : isChanging ? 6 : 8
    return { position, yinYang, isChanging, value }
  })
}

export function castMeihua(input: { upper: number; lower: number; moving: number }): Line[] {
  return trigramsToLines(xiantianName(input.upper), xiantianName(input.lower), xiantianMod6(input.moving))
}

export function numbersFromText(text: string): { upper: number; lower: number; moving: number } {
  const chars = [...text.trim()].filter((char) => char.trim().length > 0)
  if (chars.length === 0) {
    return numbersFromDate(new Date())
  }
  const mid = Math.max(1, Math.floor(chars.length / 2))
  const upper = chars.slice(0, mid).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const lower = chars.slice(mid).reduce((sum, char) => sum + char.charCodeAt(0), 0) || upper
  return { upper, lower, moving: upper + lower }
}

export function numbersFromDate(date: Date): { upper: number; lower: number; moving: number } {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hourBranch = Math.floor(((date.getHours() + 1) % 24) / 2) + 1
  const upper = year + month + day
  const lower = upper + hourBranch
  return { upper, lower, moving: lower }
}

export function castMeihuaFromText(text: string): Line[] {
  return castMeihua(numbersFromText(text))
}

export function castTime(date: Date = new Date()): Line[] {
  return castMeihua(numbersFromDate(date))
}
