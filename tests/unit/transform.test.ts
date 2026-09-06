import { describe, it, expect, vi } from 'vitest'
import * as fc from 'fast-check'
import type { Line, YaoPosition, YinYang } from '@/lib/qigua/types'

// 计算式 hexagram 表：自包含，不依赖 hexagrams.json
// 64卦 ID 1-64 = 上卦二进制*8 + 下卦二进制 + 1
function computeYaos(id: number): YinYang[] {
  const upper = Math.floor((id - 1) / 8)
  const lower = (id - 1) % 8
  const ub = upper.toString(2).padStart(3, '0')
  const lb = lower.toString(2).padStart(3, '0')
  // yaos 数组顺序：初爻(下卦最低) → 上爻(上卦最高)
  return [
    lb[2] === '1' ? 'yang' : 'yin', // 初爻
    lb[1] === '1' ? 'yang' : 'yin', // 二爻
    lb[0] === '1' ? 'yang' : 'yin', // 三爻
    ub[2] === '1' ? 'yang' : 'yin', // 四爻
    ub[1] === '1' ? 'yang' : 'yin', // 五爻
    ub[0] === '1' ? 'yang' : 'yin', // 上爻
  ]
}

vi.mock('@/lib/iching/data-access', () => {
  const map = new Map<number, { id: number; yaos: { yinYang: YinYang }[] }>()
  const all: { id: number; yaos: { yinYang: YinYang }[] }[] = []
  for (let id = 1; id <= 64; id++) {
    const entry = {
      id,
      yaos: computeYaos(id).map((yinYang) => ({ yinYang })),
    }
    map.set(id, entry)
    all.push(entry)
  }
  return {
    getGuaById: (id: number) => map.get(id),
    getGuaByName: () => undefined,
    getGuaByTrigrams: () => [],
    findGuaByLines: () => undefined,
    searchHexagrams: () => [],
    getHexagramsByWuXing: () => [],
    getHexagramsByTrigram: () => [],
    getHexagramsByScenario: () => [],
    getAllHexagrams: () => all,
    selfCheck: () => ({ ok: true, issues: [] }),
  }
})

// 动态 import 必须放在 mock 之后
import { getDuiGua, getZongGua, getBianGua, getHuGua, computeTransforms } from '@/lib/qigua/cast/transform'
import { castCoins } from '@/lib/qigua/cast/coin'
import { mulberry32 } from '@/lib/qigua/rng'

// 使用与生产代码一致的模式匹配查找 ID（模拟 findGuaByLines）
const ALL_HEXAGRAMS: { id: number; yaos: { yinYang: YinYang }[] }[] = (() => {
  const list: { id: number; yaos: { yinYang: YinYang }[] }[] = []
  for (let id = 1; id <= 64; id++) {
    list.push({
      id,
      yaos: computeYaos(id).map((yinYang) => ({ yinYang })),
    })
  }
  return list
})()

function findHexagramByYaos(yaos: YinYang[]): number | undefined {
  return ALL_HEXAGRAMS.find((g) => g.yaos.every((y, i) => y.yinYang === yaos[i]))?.id
}

function linesToGuaId(lines: Line[]): number {
  const yaos = lines.map((l) => l.yinYang)
  const matched = findHexagramByYaos(yaos)
  if (matched !== undefined) return matched
  // 回退到公式
  const upper = yaos.slice(3).map(y => (y === 'yang' ? '1' : '0')).join('')
  const lower = yaos.slice(0, 3).map(y => (y === 'yang' ? '1' : '0')).join('')
  return parseInt(upper, 2) * 8 + parseInt(lower, 2) + 1
}

function buildLinesFromGua(id: number, changingPos: YaoPosition | null): Line[] {
  const yaos = computeYaos(id)
  return yaos.map((yy, i) => ({
    position: (i + 1) as YaoPosition,
    yinYang: yy,
    isChanging: changingPos === (i + 1),
    value: 7 as 6 | 7 | 8 | 9,
  }))
}

describe('卦变关系', () => {
  it('错卦对合: getDuiGua(getDuiGua(x)) === x', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 64 }), (id) => {
        return getDuiGua(getDuiGua(id)) === id
      }),
      { numRuns: 100 }
    )
  })

  it('综卦对合: getZongGua(getZongGua(x)) === x', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 64 }), (id) => {
        return getZongGua(getZongGua(id)) === id
      }),
      { numRuns: 100 }
    )
  })

  it('之卦对合: 变爻两次恢复', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const lines = castCoins(mulberry32(seed))
      const bian = getBianGua(lines)
      if (bian) {
        const originalId = linesToGuaId(lines)
        const changedPositions = lines
          .map((l, i) => (l.isChanging ? (i + 1) as YaoPosition : null))
          .filter((p): p is YaoPosition => p !== null)
        // 把 bian 的 lines 在已变位置标记为变爻（恢复）
        const reBianLines: Line[] = bian.lines.map((l, i) => ({
          ...l,
          isChanging: changedPositions.includes((i + 1) as YaoPosition),
        }))
        const reBian = getBianGua(reBianLines)
        expect(reBian).not.toBeNull()
        expect(reBian!.id).toBe(originalId)
      }
    }
  })

  it('互卦正确: getHuGua 取 2-3-4 下、3-4-5 上', () => {
    // 64卦全枚举：手动构造 → 验证互卦 ID 等同于新组合
    let mismatches = 0
    for (let id = 1; id <= 64; id++) {
      const lines = buildLinesFromGua(id, null)
      const hu = getHuGua(lines)
      const yaos = lines.map(l => l.yinYang)
      // 下卦: position 2,3,4 (index 1,2,3) → yaos[1], yaos[2], yaos[3]
      const lower = [yaos[1]!, yaos[2]!, yaos[3]!] as YinYang[]
      // 上卦: position 3,4,5 (index 2,3,4) → yaos[2], yaos[3], yaos[4]
      const upper = [yaos[2]!, yaos[3]!, yaos[4]!] as YinYang[]
      // 互卦六爻（初爻到上爻）：下卦三条 + 上卦三条
      const huYaos: YinYang[] = [...lower, ...upper]
      const expected = findHexagramByYaos(huYaos) ?? -1
      if (hu.id !== expected) mismatches++
    }
    expect(mismatches).toBe(0)
  })

  it('错卦正确: 阴阳全反', () => {
    // 64卦全枚举：手动验证
    let mismatches = 0
    for (let id = 1; id <= 64; id++) {
      const dui = getDuiGua(id)
      const yaos = computeYaos(id)
      const flipped = yaos.map(y => (y === 'yang' ? 'yin' : 'yang'))
      const expected = findHexagramByYaos(flipped) ?? -1
      if (dui !== expected) mismatches++
    }
    expect(mismatches).toBe(0)
  })

  it('综卦正确: 上下颠倒', () => {
    // 64卦全枚举
    let mismatches = 0
    for (let id = 1; id <= 64; id++) {
      const zong = getZongGua(id)
      const yaos = computeYaos(id)
      const reversed = [...yaos].reverse()
      const expected = findHexagramByYaos(reversed) ?? -1
      if (zong !== expected) mismatches++
    }
    expect(mismatches).toBe(0)
  })

  it('64×6 全枚举: 之卦 不为 null', () => {
    let nullCount = 0
    for (let id = 1; id <= 64; id++) {
      for (let pos = 1; pos <= 6; pos++) {
        const lines = buildLinesFromGua(id, pos as YaoPosition)
        const bian = getBianGua(lines)
        if (bian === null) nullCount++
      }
    }
    expect(nullCount).toBe(0)
  })

  it('computeTransforms 返回所有关系', () => {
    const lines = castCoins(mulberry32(123))
    const benGuaId = linesToGuaId(lines)
    const transforms = computeTransforms(benGuaId, lines)
    expect(transforms.ben).toBe(benGuaId)
    expect(transforms.dui).toBeGreaterThanOrEqual(1)
    expect(transforms.dui).toBeLessThanOrEqual(64)
    expect(transforms.zong).toBeGreaterThanOrEqual(1)
    expect(transforms.zong).toBeLessThanOrEqual(64)
    expect(transforms.hu).toBeGreaterThanOrEqual(1)
    expect(transforms.hu).toBeLessThanOrEqual(64)
    if (lines.some(l => l.isChanging)) {
      expect(transforms.bian).toBeDefined()
    } else {
      expect(transforms.bian).toBeUndefined()
    }
  })

  it('computeTransforms: 错卦/综卦/互卦对合', () => {
    // 综合测试：对任意卦 1-64，错卦/综卦都对合，互卦也是确定函数
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 64 }), (id) => {
        const yaos = computeYaos(id)
        const lines = yaos.map((yy, i) => ({
          position: (i + 1) as YaoPosition,
          yinYang: yy,
          isChanging: false,
          value: 7 as 6 | 7 | 8 | 9,
        }))
        const t = computeTransforms(id, lines)
        return (
          t.ben === id &&
          getDuiGua(t.dui) === id &&
          getZongGua(t.zong) === id &&
          t.hu >= 1 &&
          t.hu <= 64
        )
      }),
      { numRuns: 50 }
    )
  })
})
