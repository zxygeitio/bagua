/**
 * 占卜编排服务
 */
import { nanoid } from 'nanoid'
import type { CastMethod, CastRecord, Line, Scenario } from '@/lib/iching'
import { castCoins, computeTransforms } from '@/lib/qigua/cast'
import { castDaily } from '@/lib/qigua/daily'
import { buildHexagram } from '@/lib/qigua'

interface PerformOptions {
  method: CastMethod
  question?: string
  scenario?: Scenario
  kind?: 'cast' | 'daily'
  lines?: Line[]
  at?: Date
}

export async function performDivination(options: PerformOptions): Promise<CastRecord> {
  let lines: Line[]
  if (options.lines && options.lines.length === 6) {
    lines = options.lines
  } else if (options.kind === 'daily') {
    lines = castDaily(options.at)
  } else {
    lines = castCoins()
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
