/**
 * 从 Line[] 构建卦象 ID 和相关计算
 */
import type { Line } from './types'
import type { Gua } from '@/lib/iching/types'
import { getAllHexagrams } from '@/lib/iching/data-access'
import { trigramFromLines, TRIGRAM_SYMBOLS } from './bagua'

/** 6 爻阴阳数组 → 卦对象（通过匹配查找） */
export function findHexagramByLines(yaos: { yinYang: 'yang' | 'yin' }[]): Gua | undefined {
  if (yaos.length !== 6) return undefined
  const all = getAllHexagrams()
  return all.find((g) => g.yaos.every((y, i) => y.yinYang === yaos[i]!.yinYang))
}

/** 6 爻 → 卦对象（推荐用法） */
export function buildHexagram(lines: Line[]) {
  if (lines.length !== 6) throw new Error('卦需要 6 爻')
  const gua = findHexagramByLines(lines)
  if (!gua) throw new Error('无法构建卦象：爻位与已知卦不符')
  return { gua, id: gua.id }
}

/** 6 爻 → 卦 ID（保留 API） */
export function linesToGuaId(lines: Line[]): number {
  return buildHexagram(lines).id
}

/** 检查是否有变爻 */
export function hasChanging(lines: Line[]): boolean {
  return lines.some((l) => l.isChanging)
}

/** 获取变爻位置列表 */
export function getChangingPositions(lines: Line[]): number[] {
  return lines.filter((l) => l.isChanging).map((l) => l.position)
}

/** 卦象符号（Unicode） */
export function getHexagramSymbol(lines: Line[]): string {
  // 上卦符号 + 下卦符号
  const upperSymbol = getTrigramSymbol(lines.slice(3, 6))
  const lowerSymbol = getTrigramSymbol(lines.slice(0, 3))
  return upperSymbol + lowerSymbol
}

function getTrigramSymbol(lines: Line[]): string {
  // 统一走八卦编码系统（初爻为高位，从下到上），与 bagua.ts 单一事实源
  const trigram = trigramFromLines(lines.map((l) => l.yinYang))
  return trigram ? TRIGRAM_SYMBOLS[trigram] : '?'
}

/** 卦象二进制字符串（初爻到上爻） */
export function linesToBinary(lines: Line[]): string {
  return lines.map((l) => (l.yinYang === 'yang' ? '1' : '0')).join('')
}

/** 64卦所有 ID 列表 */
export function getAllGuaIds(): number[] {
  return Array.from({ length: 64 }, (_, i) => i + 1)
}
