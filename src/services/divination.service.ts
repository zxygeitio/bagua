/**
 * 占卜编排服务
 */
import { nanoid } from 'nanoid'
import type { CastMethod, CastRecord, Line, Scenario } from '@/lib/iching'
import { castCoins, castYarrow, castManual, computeTransforms, castMeihuaFromText, castTime } from '@/lib/qigua/cast'
import { castDaily } from '@/lib/qigua/daily'
import { buildHexagram } from '@/lib/qigua'
import type { TrigramName, YaoPosition } from '@/lib/qigua/types'

interface PerformOptions {
  method: CastMethod
  question?: string
  scenario?: Scenario
  kind?: 'cast' | 'daily'
  lines?: Line[]
  manualUpper?: TrigramName
  manualLower?: TrigramName
  changingPosition?: YaoPosition
  meihuaText?: string
  at?: Date
}

export async function performDivination(options: PerformOptions): Promise<CastRecord> {
  let lines: Line[]
  if (options.lines && options.lines.length === 6) {
    lines = options.lines
  } else if (options.kind === 'daily') {
    lines = castDaily(options.at)
  } else {
    switch (options.method) {
      case 'yarrow':
        lines = castYarrow()
        break
      case 'manual':
        lines = castManual(
          options.manualUpper ?? '乾',
          options.manualLower ?? '乾',
          options.changingPosition,
        )
        break
      case 'meihua':
        lines = castMeihuaFromText(options.meihuaText ?? options.question ?? '')
        break
      case 'time':
        lines = castTime(options.at ?? new Date())
        break
      default:
        lines = castCoins()
    }
  }

  const { id: benGuaId } = buildHexagram(lines)
  const transforms = computeTransforms(benGuaId, lines)

  return {
    id: nanoid(10),
    timestamp: Date.now(),
    method: options.method,
    question: options.question,
    scenario: options.scenario,
    kind: options.kind ?? 'cast',
    lines,
    benGuaId,
    bianGuaId: transforms.bian,
    huGuaId: transforms.hu,
    changingLinePositions: lines.filter((line) => line.isChanging).map((line) => line.position),
    favorite: false,
  }
}
