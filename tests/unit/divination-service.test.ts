import { describe, it, expect } from 'vitest'
import { performDivination } from '@/services/divination.service'
import { mulberry32 } from '@/lib/qigua/rng'
import { getGuaById } from '@/lib/iching/data-access'
import type { Line } from '@/lib/iching'

const qianLines = (): Line[] =>
  Array.from({ length: 6 }, (_, i) => ({
    position: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
    yinYang: 'yang' as const,
    isChanging: false,
    value: 7 as const,
  }))

describe('占卜编排服务', () => {
  it('显式传入 6 爻时以传入爻为准（乾 → benGuaId=1）', async () => {
    const record = await performDivination({ method: 'coins', lines: qianLines() })
    expect(record.benGuaId).toBe(1)
    expect(record.lines).toHaveLength(6)
    expect(record.lines.every((l) => l.yinYang === 'yang')).toBe(true)
  })

  it('kind=daily 走每日一卦链路', async () => {
    const at = new Date('2026-09-09T00:00:00+08:00')
    const a = await performDivination({ method: 'coins', kind: 'daily', at })
    const b = await performDivination({ method: 'coins', kind: 'daily', at })
    expect(a.kind).toBe('daily')
    expect(b.kind).toBe('daily')
    // 同一日期的每日一卦确定性
    expect(a.benGuaId).toBe(b.benGuaId)
    expect(getGuaById(a.benGuaId)).toBeDefined()
  })

  it('默认走硬币起卦，产出完整 CastRecord 结构', async () => {
    const record = await performDivination({ method: 'coins' })
    expect(record.kind).toBe('cast')
    expect(record.id).toMatch(/^[A-Za-z0-9_-]{10}$/)
    expect(typeof record.timestamp).toBe('number')
    expect(record.method).toBe('coins')
    expect(record.favorite).toBe(false)
    expect(record.question).toBeUndefined()
    expect(record.benGuaId).toBeGreaterThanOrEqual(1)
    expect(record.benGuaId).toBeLessThanOrEqual(64)
  })

  it('变卦/互卦 ID 与变爻位一致', async () => {
    // 构造一条带变爻的爻序：初九动（乾之姤）
    const lines = qianLines()
    lines[0] = { position: 1, yinYang: 'yang', isChanging: true, value: 9 }
    const record = await performDivination({ method: 'coins', lines })
    expect(record.changingLinePositions).toEqual([1])
    // 乾初爻变 → 姤（下巽上乾）
    expect(record.bianGuaId).toBe(44)
    expect(record.huGuaId).toBeGreaterThanOrEqual(1)
  })

  it('question 与 scenario 原样透传', async () => {
    const record = await performDivination({
      method: 'coins',
      lines: qianLines(),
      question: '今天顺利吗',
      scenario: 'career',
    })
    expect(record.question).toBe('今天顺利吗')
    expect(record.scenario).toBe('career')
  })

  it('随机源注入：不同种子下 castCoins 产出合法卦 ID', async () => {
    const seen = new Set<number>()
    for (const seed of [1, 2, 3, 4, 5]) {
      const record = await performDivination({ method: 'coins', rng: mulberry32(seed) })
      seen.add(record.benGuaId)
      expect(record.benGuaId).toBeGreaterThanOrEqual(1)
      expect(record.benGuaId).toBeLessThanOrEqual(64)
    }
    expect(seen.size).toBeGreaterThanOrEqual(1)
  })
})

describe('大衍筮法入口（method=yarrow）', () => {
  it('走大衍链路，产出完整 CastRecord 且爻值均为 6/7/8/9', async () => {
    const record = await performDivination({ method: 'yarrow' })
    expect(record.method).toBe('yarrow')
    expect(record.kind).toBe('cast')
    expect(record.lines).toHaveLength(6)
    expect(record.lines.every((l) => [6, 7, 8, 9].includes(l.value))).toBe(true)
    expect(record.benGuaId).toBeGreaterThanOrEqual(1)
    expect(record.benGuaId).toBeLessThanOrEqual(64)
  })

  it('变爻阴阳与爻值一致（6 为阴动、9 为阳动）', async () => {
    for (let i = 0; i < 30; i++) {
      const record = await performDivination({ method: 'yarrow' })
      for (const line of record.lines) {
        if (line.isChanging) {
          expect([6, 9]).toContain(line.value)
          expect(line.yinYang).toBe(line.value === 9 ? 'yang' : 'yin')
        } else {
          expect([7, 8]).toContain(line.value)
        }
      }
    }
  })
})
