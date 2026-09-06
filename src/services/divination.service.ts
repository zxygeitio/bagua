/**
 * 占卜编排服务
 */
import { nanoid } from 'nanoid'
import type { CastMethod, CastRecord, Line } from '@/lib/iching'
import { castCoins, castYarrow, castManual, computeTransforms } from '@/lib/qigua/cast'
import { buildHexagram } from '@/lib/qigua'
import type { TrigramName, YaoPosition } from '@/lib/qigua/types'

interface PerformOptions {
  method: CastMethod
  question?: string
  manualUpper?: TrigramName
  manualLower?: TrigramName
  changingPosition?: YaoPosition
}

export async function performDivination(options: PerformOptions): Promise<CastRecord> {
  let lines: Line[]
  switch (options.method) {
    case 'coins':
      lines = castCoins()
      break
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
    default:
      lines = castCoins()
  }

  const { id: benGuaId } = buildHexagram(lines)
  const transforms = computeTransforms(benGuaId, lines)

  return {
    id: nanoid(10),
    timestamp: Date.now(),
    method: options.method,
    question: options.question,
    lines,
    benGuaId,
    bianGuaId: transforms.bian,
    huGuaId: transforms.hu,
    changingLinePositions: lines.filter(l => l.isChanging).map(l => l.position),
    favorite: false,
  }
}
