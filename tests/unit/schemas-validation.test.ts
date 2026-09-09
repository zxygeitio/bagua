import { describe, it, expect } from 'vitest'
import { getAllHexagrams } from '@/lib/iching/data-access'
import {
  validateHexagramRelationships,
  validateInterpretationPackCoverage,
} from '@/lib/iching/schemas'
import type { Gua } from '@/lib/iching/types'

/** 可变数组形态（getAllHexagrams 返回 readonly） */
function allGua(): Gua[] {
  return [...getAllHexagrams()]
}

/** 深拷贝首卦做破坏性注入，避免污染模块级共享数据 */
function cloneFirstGua(): Gua {
  const first = getAllHexagrams()[0]
  if (!first) throw new Error('fixture 缺失：首卦不存在')
  return structuredClone(first)
}

describe('validateHexagramRelationships 卦间引用完整性', () => {
  it('真实 64 卦数据全部通过', () => {
    const { valid, errors } = validateHexagramRelationships(allGua())
    expect(valid).toBe(true)
    expect(errors).toEqual([])
  })

  it('卦 ID 重复被检出', () => {
    const result = validateHexagramRelationships([...allGua(), cloneFirstGua()])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('重复'))).toBe(true)
  })

  it('错/综/互/之卦引用不存在时逐项报错', () => {
    const g = cloneFirstGua()
    g.duiGua = 999
    g.zongGua = 998
    g.huGua = 997
    g.guaBian = [996]
    const result = validateHexagramRelationships([g])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('duiGua=999'))).toBe(true)
    expect(result.errors.some((e) => e.includes('zongGua=998'))).toBe(true)
    expect(result.errors.some((e) => e.includes('huGua=997'))).toBe(true)
    expect(result.errors.some((e) => e.includes('guaBian 996'))).toBe(true)
  })

  it('fuGua 可选：缺失不报错，给出但不存在的才报错', () => {
    // 在完整数据宇宙里替换首卦，否则其余引用会因「宇宙里只有一卦」而误报
    const withoutFu = allGua().map((g, i) => {
      if (i !== 0) return g
      const c = structuredClone(g)
      delete c.fuGua
      return c
    })
    expect(validateHexagramRelationships(withoutFu).valid).toBe(true)

    const withBadFu = allGua().map((g, i) => {
      if (i !== 0) return g
      const c = structuredClone(g)
      c.fuGua = 995
      return c
    })
    expect(
      validateHexagramRelationships(withBadFu).errors.some((e) => e.includes('fuGua=995')),
    ).toBe(true)
  })

  it('爻数不足 6 与爻位不连续分别报错', () => {
    const g = cloneFirstGua()
    g.yaos = g.yaos.slice(0, 5)
    const r1 = validateHexagramRelationships([g])
    expect(r1.errors.some((e) => e.includes('爻数'))).toBe(true)

    const g2 = cloneFirstGua()
    g2.yaos = g2.yaos.map((y: (typeof g2.yaos)[number], i: number) => ({
      ...y,
      position: (i === 0 ? 2 : i + 1) as 2,
    }))
    const r2 = validateHexagramRelationships([g2])
    expect(r2.errors.some((e) => e.includes('爻位不是 1-6 各一次'))).toBe(true)
  })
})

describe('validateInterpretationPackCoverage 解读包场景覆盖', () => {
  /** 最小合法场景解读对象（满足 ScenarioInterpretationSchema 形状即可，校验函数只读键） */
  const emptyScenario = {
    summary: '总',
    judgment: '判',
    image: '象',
    lineInterprets: [],
    structural: { dangWei: [], buDangWei: [], zhongZheng: [], chengYing: [], he: [] },
    modernAdvice: '策',
  }

  function guaWithAllScenarios(): Gua {
    const g = cloneFirstGua()
    const byScenario: Record<string, typeof emptyScenario> = {}
    for (const s of [
      'career',
      'wealth',
      'relationship',
      'health',
      'study',
      'family',
      'decision',
      'crisis',
      'self',
    ]) {
      byScenario[s] = { ...emptyScenario }
    }
    g.interpretationPack.byScenario = byScenario as never
    return g
  }

  it('九大场景全覆盖的卦通过校验', () => {
    const result = validateInterpretationPackCoverage([guaWithAllScenarios()])
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('缺失场景按卦列出缺口', () => {
    const g = guaWithAllScenarios()
    delete (g.interpretationPack.byScenario as Record<string, unknown>).career
    const result = validateInterpretationPackCoverage([g])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('career'))).toBe(true)
  })

  it('现状快照：真实数据 byScenario 尚未录入，校验如实报告 64 卦缺口', () => {
    const { valid, errors } = validateInterpretationPackCoverage(allGua())
    expect(valid).toBe(false)
    expect(errors).toHaveLength(64)
    expect(errors[0] ?? '').toContain('career')
  })
})
