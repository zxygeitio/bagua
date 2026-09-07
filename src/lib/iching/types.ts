import type { z } from 'zod'

import type { CastMethod, Scenario, YaoPosition, YinYang } from '@/types/iching'

import type {
  CastRecordSchema,
  CastResultSchema,
  GuaSchema,
  HexagramsSchema,
  InterpretationPackSchema,
  LineInterpretSchema,
  LineSchema,
  ScenarioInterpretationSchema,
  SourceMetadataSchema,
  StructuralAnalysisSchema,
  YaoSchema,
} from './schemas'

/* ------------------------------------------------------------------ *
 * Schema 推导类型（单一真源：schemas.ts）
 * ------------------------------------------------------------------ */

export type Yao = z.infer<typeof YaoSchema>
export type Gua = z.infer<typeof GuaSchema>
export type Hexagrams = z.infer<typeof HexagramsSchema>

export type LineInterpret = z.infer<typeof LineInterpretSchema>
export type StructuralAnalysis = z.infer<typeof StructuralAnalysisSchema>
export type ScenarioInterpretation = z.infer<typeof ScenarioInterpretationSchema>
export type InterpretationPack = z.infer<typeof InterpretationPackSchema>
export type SourceMetadata = z.infer<typeof SourceMetadataSchema>

/* ------------------------------------------------------------------ *
 * 运行时类型（占卦流程）
 * ------------------------------------------------------------------ */

/** 单爻的运行时表示 */
export interface Line {
  position: YaoPosition
  yinYang: YinYang
  isChanging: boolean
  /** 蓍草/硬币原始值：6 老阴 / 7 少阳 / 8 少阴 / 9 老阳 */
  value: 6 | 7 | 8 | 9
}

/** 一次起卦的结果 */
export interface CastResult {
  id: string
  timestamp: number
  method: CastMethod
  question?: string
  scenario?: Scenario
  kind?: 'cast' | 'daily'
  lines: Line[]
  benGuaId: number
  bianGuaId?: number
  huGuaId?: number
  changingLinePositions: YaoPosition[]
}

/** 持久化的历史记录 */
export interface CastRecord extends CastResult {
  notes?: string
  favorite: boolean
}

/** Schema 推导版本（用于解析外部/持久化数据后的校验） */
export type LineParsed = z.infer<typeof LineSchema>
export type CastResultParsed = z.infer<typeof CastResultSchema>
export type CastRecordParsed = z.infer<typeof CastRecordSchema>

/* ------------------------------------------------------------------ *
 * 便捷重导出
 * ------------------------------------------------------------------ */

export type {
  CastMethod,
  Scenario,
  ShiStatus,
  SixRelation,
  TrigramName,
  WuXing,
  YaoPosition,
  YinYang,
} from '@/types/iching'
