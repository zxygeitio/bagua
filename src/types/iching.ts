/**
 * 易经核心类型枚举
 * 参考: docs/superpowers/specs/2026-09-06-bagua-yijing-app-design.md §7
 */

/** 阴阳 */
export type YinYang = 'yang' | 'yin'

/** 八卦名 */
export type TrigramName = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'

/** 五行 */
export type WuXing = '金' | '木' | '水' | '火' | '土'

/** 六亲 */
export type SixRelation = '父母' | '兄弟' | '子孙' | '妻财' | '官鬼'

/** 爻位（自下而上 1-6） */
export type YaoPosition = 1 | 2 | 3 | 4 | 5 | 6

/** 爻的当位状态 */
export type ShiStatus = '当位' | '不当位' | '中和'

/** 应用场景 */
export type Scenario =
  | 'career'
  | 'wealth'
  | 'relationship'
  | 'health'
  | 'study'
  | 'family'
  | 'decision'
  | 'crisis'
  | 'self'

/** 起卦方式 */
export type CastMethod = 'coins'

/** 已下线但需要继续读取的历史起卦方式 */
export type LegacyCastMethod = 'yarrow' | 'manual' | 'meihua' | 'time'

/** 持久化记录允许的起卦方式，包含历史数据 */
export type StoredCastMethod = CastMethod | LegacyCastMethod

/** 所有场景（用于遍历与全覆盖校验） */
export const ALL_SCENARIOS: Scenario[] = [
  'career',
  'wealth',
  'relationship',
  'health',
  'study',
  'family',
  'decision',
  'crisis',
  'self',
]

/** 场景中文标签 */
export const SCENARIO_LABELS: Record<Scenario, string> = {
  career: '事业',
  wealth: '财富',
  relationship: '感情',
  health: '健康',
  study: '学业',
  family: '家庭',
  decision: '抉择',
  crisis: '困境',
  self: '自我',
}

/** 八卦名列表（先天序: 乾兑离震巽坎艮坤） */
export const ALL_TRIGRAMS: TrigramName[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

/** 五行列表 */
export const ALL_WUXING: WuXing[] = ['金', '木', '水', '火', '土']

/** 六亲列表 */
export const ALL_SIX_RELATIONS: SixRelation[] = ['父母', '兄弟', '子孙', '妻财', '官鬼']

/** 爻位列表 */
export const ALL_YAO_POSITIONS: YaoPosition[] = [1, 2, 3, 4, 5, 6]

/** 起卦方式中文标签，历史方式仅用于展示旧记录 */
export const CAST_METHOD_LABELS: Record<StoredCastMethod, string> = {
  coins: '铜钱起卦',
  yarrow: '蓍草起卦（历史）',
  manual: '手动排卦（历史）',
  meihua: '梅花易数（历史）',
  time: '时间起卦（历史）',
}
