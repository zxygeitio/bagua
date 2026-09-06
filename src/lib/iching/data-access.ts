/**
 * 64卦数据访问层 - 纯函数，无外部依赖
 */
import hexagramsData from './data/hexagrams.json'
import type { Scenario } from '@/types/iching'
import type { Gua } from './types'

// 全局缓存（避免重复访问大数组）
const HEXAGRAM_MAP = new Map<number, Gua>()
const NAME_MAP = new Map<string, Gua>()
const TRIGRAM_INDEX = new Map<string, Gua[]>()

// 初始化索引
for (const g of hexagramsData as Gua[]) {
  HEXAGRAM_MAP.set(g.id, g)
  NAME_MAP.set(g.chineseName, g)
  NAME_MAP.set(g.name, g)
  const key = `${g.shangGua}-${g.xiaGua}`
  const existing = TRIGRAM_INDEX.get(key)
  if (existing) {
    existing.push(g)
  } else {
    TRIGRAM_INDEX.set(key, [g])
  }
}

/** 按 ID 获取卦（1-64） */
export function getGuaById(id: number): Gua | undefined {
  return HEXAGRAM_MAP.get(id)
}

/** 按卦名获取（支持"乾"或"乾为天"） */
export function getGuaByName(name: string): Gua | undefined {
  return NAME_MAP.get(name)
}

/** 按上下卦组合获取卦（64种组合中有些重复，需返回多个） */
export function getGuaByTrigrams(upper: string, lower: string): Gua[] {
  return TRIGRAM_INDEX.get(`${upper}-${lower}`) ?? []
}

/** 按阴阳爻模式匹配查找卦（初爻到上爻顺序） */
export function findGuaByLines(yaos: { yinYang: 'yang' | 'yin' }[]): Gua | undefined {
  if (yaos.length !== 6) return undefined
  return (hexagramsData as Gua[]).find((g) =>
    g.yaos.every((y, i) => y.yinYang === yaos[i]!.yinYang),
  )
}

/** 搜索卦（按名称/拼音/关键词） */
export function searchHexagrams(query: string): Gua[] {
  if (!query) return []
  const q = query.toLowerCase().trim()
  return (hexagramsData as Gua[]).filter(
    (g) =>
      g.name.includes(q) ||
      g.chineseName.includes(q) ||
      g.pronunciation.toLowerCase().includes(q) ||
      g.keywords.some((k) => k.includes(q)) ||
      g.categoryTags.some((t) => t.includes(q)),
  )
}

/** 按五行筛选 */
export function getHexagramsByWuXing(wuxing: string): Gua[] {
  return (hexagramsData as Gua[]).filter((g) => g.wuxing === wuxing)
}

/** 按上卦或下卦筛选 */
export function getHexagramsByTrigram(trigram: string, position: 'upper' | 'lower'): Gua[] {
  return (hexagramsData as Gua[]).filter((g) =>
    position === 'upper' ? g.shangGua === trigram : g.xiaGua === trigram,
  )
}

/** 按场景筛选 */
export function getHexagramsByScenario(scenario: string): Gua[] {
  const typed = scenario as Scenario
  return (hexagramsData as Gua[]).filter((g) => g.scenarios.includes(typed))
}

/** 获取所有卦（不可变引用） */
export function getAllHexagrams(): readonly Gua[] {
  return hexagramsData as Gua[]
}

/** 数据完整性自检（启动时调用） */
export function selfCheck(): { ok: boolean; issues: string[] } {
  const issues: string[] = []
  const all = getAllHexagrams()
  if (all.length !== 64) issues.push(`卦数 ${all.length} ≠ 64`)
  for (const g of all) {
    const dui = HEXAGRAM_MAP.get(g.duiGua)
    if (!dui) issues.push(`卦${g.id} duiGua ${g.duiGua} 不存在`)
    if (dui && dui.duiGua !== g.id) issues.push(`卦${g.id} 错卦对合失败`)
  }
  return { ok: issues.length === 0, issues }
}
