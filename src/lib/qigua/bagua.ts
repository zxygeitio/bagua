/**
 * 八卦编码系统
 *
 * 约定：
 *  - 爻数组从下到上为 position 1→6
 *  - 阳 = 'yang' = 1（实线 ━━━━）
 *  - 阴 = 'yin'  = 0（断线 ━ ━）
 *  - 八卦符号：乾☰、兑☱、离☲、震☳、巽☴、坎☵、艮☶、坤☷
 *  - 八卦二进制（从下到上）：乾111=7、兑011=6、离101=5、震001=4、
 *                            巽110=3、坎010=2、艮100=1、坤000=0
 */
import type { TrigramName, YinYang, WuXing } from './types'

export const TRIGRAMS: TrigramName[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

export const TRIGRAM_SYMBOLS: Record<TrigramName, string> = {
  '乾': '☰', '兑': '☱', '离': '☲', '震': '☳',
  '巽': '☴', '坎': '☵', '艮': '☶', '坤': '☷',
}

// 二进制值 → 卦名（高位是上爻）
export const BINARY_TO_TRIGRAM: Record<string, TrigramName> = {
  '111': '乾', '011': '兑', '101': '离', '001': '震',
  '110': '巽', '010': '坎', '100': '艮', '000': '坤',
}

// 卦名 → 二进制值（用作反查）
export const TRIGRAM_TO_BINARY: Record<TrigramName, string> = {
  '乾': '111', '兑': '011', '离': '101', '震': '001',
  '巽': '110', '坎': '010', '艮': '100', '坤': '000',
}

// 卦名 → 数值（用于构建64卦）
export const TRIGRAM_VALUE: Record<TrigramName, number> = {
  '乾': 7, '兑': 6, '离': 5, '震': 4,
  '巽': 3, '坎': 2, '艮': 1, '坤': 0,
}

// 数值 → 卦名（反查）
export const VALUE_TO_TRIGRAM: Record<number, TrigramName> = {
  7: '乾', 6: '兑', 5: '离', 4: '震',
  3: '巽', 2: '坎', 1: '艮', 0: '坤',
}

// 八卦 → 五行
export const TRIGRAM_WUXING: Record<TrigramName, WuXing> = {
  '乾': '金', '兑': '金',
  '离': '火',
  '震': '木', '巽': '木',
  '坎': '水',
  '艮': '土', '坤': '土',
}

/** 3 爻数组（初爻到上爻） → 卦名 */
export function trigramFromLines(lines: YinYang[]): TrigramName | null {
  if (lines.length !== 3) return null
  const binary = lines.map(y => y === 'yang' ? '1' : '0').join('')
  return BINARY_TO_TRIGRAM[binary] ?? null
}

/** 卦名 → 3 爻数组（初爻到上爻） */
export function linesFromTrigram(name: TrigramName): YinYang[] {
  const binary = TRIGRAM_TO_BINARY[name]
  return binary.split('').map(b => b === '1' ? 'yang' : 'yin') as YinYang[]
}

/** 二进制字符串 → 卦名 */
export function binaryToTrigram(binary: string): TrigramName | null {
  if (binary.length !== 3 || !/^[01]{3}$/.test(binary)) return null
  return BINARY_TO_TRIGRAM[binary] ?? null
}
