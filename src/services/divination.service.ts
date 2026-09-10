/**
 * 占卜编排服务
 */
import { nanoid } from 'nanoid'
import type { CastMethod, CastRecord, Line, Scenario } from '@/lib/iching'
import { castCoins, castDayan, computeTransforms } from '@/lib/qigua/cast'
import { castDaily } from '@/lib/qigua/daily'
import { buildHexagram } from '@/lib/qigua'

interface PerformOptions {
  method: CastMethod
  question?: string
  scenario?: Scenario
  kind?: 'cast' | 'daily'
  lines?: Line[]
  at?: Date
  /** 测试或可重放场景使用；默认采用 Math.random。 */
  rng?: () => number
}

export async function performDivination(options: PerformOptions): Promise<CastRecord> {
  let lines: Line[]
  const rng = options.rng ?? Math.random
  if (options.lines && options.lines.length === 6) {
    lines = options.lines
  } else if (options.kind === 'daily') {
    lines = castDaily(options.at)
  } else {
    lines = options.method === 'yarrow' ? castDayan(rng) : castCoins(rng)
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
