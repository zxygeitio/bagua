import { z } from 'zod'

import { ALL_SCENARIOS } from '@/types/iching'

/* ------------------------------------------------------------------ *
 * 基础枚举
 * ------------------------------------------------------------------ */

/** 阴阳 */
export const YinYangSchema = z.enum(['yang', 'yin'])

/** 八卦 */
export const TrigramNameSchema = z.enum(['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'])

/** 五行 */
export const WuXingSchema = z.enum(['金', '木', '水', '火', '土'])

/** 六亲 */
export const SixRelationSchema = z.enum(['父母', '兄弟', '子孙', '妻财', '官鬼'])

/** 爻位 1-6 */
export const YaoPositionSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
])

/** 当位状态 */
export const ShiStatusSchema = z.enum(['当位', '不当位', '中和'])

/** 场景 */
export const ScenarioSchema = z.enum([
  'career',
  'wealth',
  'relationship',
  'health',
  'study',
  'family',
  'decision',
  'crisis',
  'self',
])

/** 起卦方式 */
export const CastMethodSchema = z.enum(['coins', 'yarrow'])

/** 历史记录中的旧起卦方式，仅允许读取和展示 */
export const StoredCastMethodSchema = z.enum(['coins', 'yarrow', 'manual', 'meihua', 'time'])

/** 卦 ID 1-64 */
export const GuaIdSchema = z.number().int().min(1).max(64)

/* ------------------------------------------------------------------ *
 * 单爻
 * ------------------------------------------------------------------ */

/** 用九/用六通爻辞（仅乾坤两卦，v2.1.0 勘误 G1 补录） */
export const YongEntrySchema = z.object({
  label: z.union([z.literal('用九'), z.literal('用六')]),
  text: z.string().min(2, '用辞不可为空'),
  xiangZhuan: z.string().min(2, '用辞小象不可为空'),
})

export const YaoSchema = z.object({
  position: YaoPositionSchema,
  yinYang: YinYangSchema,
  text: z.string().min(2, '爻辞不可为空'),
  xiangZhuan: z.string().min(2, '小象传不可为空'),
  tianGan: z.string().length(1).optional(),
  diZhi: z.string().length(1).optional(),
  wuXing: WuXingSchema.optional(),
  sixRelations: SixRelationSchema.optional(),
  shiStatus: ShiStatusSchema.optional(),
  isChanging: z.boolean().optional(),
})

/* ------------------------------------------------------------------ *
 * InterpretationPack（§7.3）
 * ------------------------------------------------------------------ */

/** 单爻解读 */
export const LineInterpretSchema = z.object({
  position: YaoPositionSchema,
  summary: z.string().min(2),
  detail: z.string().min(2),
  advice: z.string().optional(),
})

/** 结构分析（当位/中正/承乘比应/六合） */
export const StructuralAnalysisSchema = z.object({
  dangWei: z.array(YaoPositionSchema),
  buDangWei: z.array(YaoPositionSchema),
  zhongZheng: z.array(YaoPositionSchema),
  chengYing: z.array(z.string()),
  he: z.array(
    z.object({
      position: YaoPositionSchema,
      partner: YaoPositionSchema,
      type: z.string().min(1),
    }),
  ),
})

/** 单场景解读 */
export const ScenarioInterpretationSchema = z.object({
  summary: z.string().min(2),
  judgment: z.string().min(2),
  image: z.string().min(2),
  lineInterprets: z.array(LineInterpretSchema),
  structural: StructuralAnalysisSchema,
  modernAdvice: z.string().min(2),
})

/**
 * 解读包。
 * byScenario 使用 partial record：允许分批录入，
 * 全场景覆盖由 `validateInterpretationPackCoverage` 单独校验。
 */
export const InterpretationPackSchema = z.object({
  byScenario: z.record(ScenarioSchema, ScenarioInterpretationSchema),
  overall: z.string().min(2),
  keywords: z.array(z.string()),
  advice: z.array(z.string()),
  warnings: z.array(z.string()),
})

/* ------------------------------------------------------------------ *
 * 来源元数据
 * ------------------------------------------------------------------ */

export const SourceMetadataSchema = z.object({
  primary: z.string(),
  sources: z.array(z.string()).min(1),
  confidence: z.number().min(0).max(1),
  variants: z.record(z.array(z.string())).optional(),
})

/* ------------------------------------------------------------------ *
 * 单卦
 * ------------------------------------------------------------------ */

export const GuaSchema = z.object({
  id: GuaIdSchema,
  name: z.string().min(2),
  chineseName: z.string().min(1),
  pronunciation: z.string().min(1),
  guaci: z.string().min(2, '卦辞不可为空'),
  tuanZhuan: z.string().min(2, '彖传不可为空'),
  daXiangZhuan: z.string().min(2, '大象传不可为空'),
  xiangTuan: z.string().optional(),
  wenYan: z.string().optional(),
  yaos: z.array(YaoSchema).length(6),
  yong: YongEntrySchema.optional(),
  shangGua: TrigramNameSchema,
  xiaGua: TrigramNameSchema,
  duiGua: GuaIdSchema,
  zongGua: GuaIdSchema,
  huGua: GuaIdSchema,
  guaBian: z.array(GuaIdSchema),
  wuxing: WuXingSchema,
  palace: z.number().int().min(1).max(8),
  palaceOrder: z.number().int().min(1).max(8),
  shiYao: YaoPositionSchema,
  yingYao: YaoPositionSchema,
  categoryTags: z.array(z.string()),
  keywords: z.array(z.string()).min(1),
  scenarios: z.array(ScenarioSchema).min(1),
  interpretationPack: InterpretationPackSchema,
  fuGua: GuaIdSchema.optional(),
  symbol: z.string().min(1),
  meaning: z.string().min(2),
  modernInsight: z.string().min(20, '现代启示至少20字'),
  metadata: SourceMetadataSchema,
})

/** 64 卦数组 */
export const HexagramsSchema = z.array(GuaSchema).length(64)

/* ------------------------------------------------------------------ *
 * 运行时 / 占卦结果
 * ------------------------------------------------------------------ */

export const LineSchema = z.object({
  position: YaoPositionSchema,
  yinYang: YinYangSchema,
  isChanging: z.boolean(),
  value: z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)]),
})

export const CastResultSchema = z.object({
  id: z.string().min(1),
  timestamp: z.number().int().nonnegative(),
  method: CastMethodSchema,
  question: z.string().optional(),
  scenario: ScenarioSchema.optional(),
  kind: z.enum(['cast', 'daily']).optional(),
  lines: z.array(LineSchema).length(6),
  benGuaId: GuaIdSchema,
  bianGuaId: GuaIdSchema.optional(),
  huGuaId: GuaIdSchema.optional(),
  changingLinePositions: z.array(YaoPositionSchema),
})

export const CastRecordSchema = CastResultSchema.extend({
  method: StoredCastMethodSchema,
  notes: z.string().optional(),
  favorite: z.boolean(),
})

/* ------------------------------------------------------------------ *
 * 跨字段校验
 * ------------------------------------------------------------------ */

type GuaShape = z.infer<typeof GuaSchema>

/**
 * 校验卦与卦之间的引用关系（错/综/互/之卦、爻数、爻位唯一性）。
 * Schema 只能保证单卦内部结构，引用完整性需整体校验。
 */
export function validateHexagramRelationships(hexagrams: GuaShape[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const ids = new Set(hexagrams.map((g) => g.id))

  if (ids.size !== hexagrams.length) {
    errors.push(`卦 ID 存在重复：唯一 ID ${ids.size} 个，实际 ${hexagrams.length} 条`)
  }

  for (const g of hexagrams) {
    if (!ids.has(g.duiGua)) errors.push(`卦${g.id} duiGua=${g.duiGua} 不存在`)
    if (!ids.has(g.zongGua)) errors.push(`卦${g.id} zongGua=${g.zongGua} 不存在`)
    if (!ids.has(g.huGua)) errors.push(`卦${g.id} huGua=${g.huGua} 不存在`)
    if (g.fuGua !== undefined && !ids.has(g.fuGua)) {
      errors.push(`卦${g.id} fuGua=${g.fuGua} 不存在`)
    }
    for (const gb of g.guaBian) {
      if (!ids.has(gb)) errors.push(`卦${g.id} guaBian ${gb} 不存在`)
    }

    if (g.yaos.length !== 6) {
      errors.push(`卦${g.id} 爻数 ${g.yaos.length} ≠ 6`)
    } else {
      const positions = g.yaos.map((y) => y.position).sort((a, b) => a - b)
      const expected = [1, 2, 3, 4, 5, 6]
      if (positions.some((p, i) => p !== expected[i])) {
        errors.push(`卦${g.id} 爻位不是 1-6 各一次：[${positions.join(',')}]`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * 校验解读包是否覆盖全部 9 大场景。
 */
export function validateInterpretationPackCoverage(hexagrams: GuaShape[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  for (const g of hexagrams) {
    const missing = ALL_SCENARIOS.filter((s) => g.interpretationPack.byScenario[s] === undefined)
    if (missing.length > 0) {
      errors.push(`卦${g.id} interpretationPack 缺少场景：${missing.join(', ')}`)
    }
  }

  return { valid: errors.length === 0, errors }
}
