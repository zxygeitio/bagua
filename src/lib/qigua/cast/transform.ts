/**
 * 卦变关系推导（核心算法）
 *
 * 5种卦变：
 *  - 本卦 (ben):   起卦得到的原卦
 *  - 之卦 (bian):  变爻后形成的新卦
 *  - 互卦 (hu):    取 2-3-4 为下，3-4-5 为上
 *  - 错卦 (dui):   阴阳全反
 *  - 综卦 (zong):  上下颠倒（爻位倒序）
 *
 * 数学不变量（必测）：
 *  - getDuiGua(getDuiGua(x)) === x  （对合）
 *  - getZongGua(getZongGua(x)) === x （对合）
 *  - getBianGua(getBianGua(lines)) === ben  （之卦对合）
 */
import type { Line, YaoPosition, YinYang } from '../types'
import { getGuaById, getAllHexagrams } from '@/lib/iching/data-access'

/** 单卦 → 6 爻阴阳数组（初爻到上爻） */
function linesToYinYang(lines: { yinYang: YinYang }[]): YinYang[] {
  return lines.map((l) => l.yinYang)
}

/** 6 爻阴阳数组 → 卦 ID（按阴阳爻模式匹配） */
function yinYangToGuaId(yaos: YinYang[]): number {
  if (yaos.length !== 6) throw new Error('卦需要 6 爻')
  const all = getAllHexagrams()
  const found = all.find((g) => g.yaos.every((y, i) => y.yinYang === yaos[i]))
  if (!found) throw new Error('未找到匹配的卦')
  return found.id
}

/** 之卦：本卦 + 变爻 → 新卦 */
export function getBianGua(lines: Line[]): { id: number; lines: Line[] } | null {
  const newYinYang: YinYang[] = lines.map((l) =>
    l.isChanging ? (l.yinYang === 'yang' ? 'yin' : 'yang') : l.yinYang,
  )
  const id = yinYangToGuaId(newYinYang)
  const newLines: Line[] = newYinYang.map((yy, i) => ({
    position: (i + 1) as YaoPosition,
    yinYang: yy,
    isChanging: false,
    value: yy === 'yang' ? 7 : 8,
  }))
  return { id, lines: newLines }
}

/** 互卦：取 2-3-4 为下，3-4-5 为上 */
export function getHuGua(lines: Line[]): { id: number; lines: Line[] } {
  if (lines.length !== 6) throw new Error('互卦需要 6 爻')
  const lower: Line[] = [lines[1]!, lines[2]!, lines[3]!] // position 2,3,4
  const upper: Line[] = [lines[2]!, lines[3]!, lines[4]!] // position 3,4,5
  const huYaos: Line[] = [...lower, ...upper]
  const id = yinYangToGuaId(huYaos.map((l) => l.yinYang))
  return { id, lines: huYaos }
}

/** 错卦：阴阳全反 */
export function getDuiGua(hexagramId: number): number {
  const gua = getGuaById(hexagramId)
  if (!gua) throw new Error(`卦 ${hexagramId} 不存在`)
  const flipped: YinYang[] = gua.yaos.map((y) => (y.yinYang === 'yang' ? 'yin' : 'yang'))
  return yinYangToGuaId(flipped)
}

/** 综卦：上下颠倒 */
export function getZongGua(hexagramId: number): number {
  const gua = getGuaById(hexagramId)
  if (!gua) throw new Error(`卦 ${hexagramId} 不存在`)
  const reversed: YinYang[] = [...gua.yaos].reverse().map((y) => y.yinYang)
  return yinYangToGuaId(reversed)
}

/** 综合卦变：一次返回所有 5 种关系 */
export interface HexagramTransforms {
  ben: number
  bian?: number
  hu: number
  dui: number
  zong: number
}

export function computeTransforms(benGuaId: number, lines: Line[]): HexagramTransforms {
  const result: HexagramTransforms = {
    ben: benGuaId,
    hu: getHuGua(lines).id,
    dui: getDuiGua(benGuaId),
    zong: getZongGua(benGuaId),
  }
  if (lines.some((l) => l.isChanging)) {
    const bian = getBianGua(lines)
    if (bian) result.bian = bian.id
  }
  return result
}
