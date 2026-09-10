/**
 * 大衍筮法（蓍草法）模拟器
 *
 * 依据朱熹《周易本义·筮仪》的通行程序（每变皆挂一）：
 *  - 大衍之数五十，其用四十有九
 *  - 每变：分二 → 挂一（取右一策） → 揲四 → 归奇于扐
 *  - 三变得一爻，十八变成一卦；六爻自初爻至上爻（自下而上）
 *
 * 数学结构（本模拟器按常用的“四种归奇组合等概率”模型模拟）：
 *  - 第一变：挂一后总数 48（四的倍数），归奇之和为 4 或 8，
 *    即第一变去 5（概率 3/4）或 9（概率 1/4），余 44 或 40
 *  - 第二、三变：挂一后总数 ≡ 3 (mod 4)，归奇之和为 3 或 7，
 *    即各去 4 或 8（概率各 1/2）
 *  - 三变后余策 36/32/28/24，除以四得 9/8/7/6：
 *      36 → 9 老阳 ⚊→⚋ 变爻（概率 3/16）
 *      32 → 8 少阴 ⚋（概率 7/16）
 *      28 → 7 少阳 ⚊（概率 5/16）
 *      24 → 6 老阴 ⚋→⚊ 变爻（概率 1/16）
 *  - 老阳:老阴 ≈ 3:1，与《易学启蒙》"阳三而阴一"及蒙特卡洛研究一致
 *
 * 学术出处见 docs/REFERENCES.md（R1 王晓刚/宗序平、R3 孙涤、R6 唐毅、R15《周易本义》）
 */
import type { Line } from '../types'
import { randomInt } from '../rng'

type UnpositionedLine = Omit<Line, 'position'>

/** 大衍之数五十，其用四十有九 */
export const DAYAN_STALKS = 49

/** 一变的揲算轨迹（用于 UI 逐步演示与测试断言） */
export interface DayanChangeTrace {
  /** 本变开始时的策数（49 / 44 / 40 / 36 / 32） */
  before: number
  /** 分二后左手策数 */
  left: number
  /** 分二后右手策数（挂一之前） */
  right: number
  /** 左堆揲四归奇数（1-4） */
  remLeft: number
  /** 右堆（挂一后）揲四归奇数（1-4） */
  remRight: number
  /** 本变结束时的余策数 */
  after: number
}

/** 一爻的三变轨迹 */
export interface DayanLineTrace {
  changes: [DayanChangeTrace, DayanChangeTrace, DayanChangeTrace]
  /** 三变后余策数：36 / 32 / 28 / 24 */
  remaining: number
}

/**
 * 执行一变：分二 → 挂一 → 揲四 → 归奇
 * 返回余策数与轨迹；分堆的概率模型在函数内部显式固定为等概率余数类。
 */
export function dayanChange(
  stalks: number,
  rng: () => number,
): { after: number; trace: DayanChangeTrace } {
  // 正常三变链路中可能出现的“本变开始”策数只有 49、44、40、36、32。
  // 28 是第三变结束后的结果，不能再次作为同一爻的输入；48 也不是合法状态。
  if (![DAYAN_STALKS, 44, 40, 36, 32].includes(stalks)) {
    throw new Error(`Invalid stalk count: ${stalks}`)
  }
  // 分二 → 挂一 → 揲四归奇。
  // 采样模型：四个归奇组合（决定左余数 1/2/3/4）先等概率抽取，
  // 再在该余数类内均匀取分二点。这与《筮仪》通行推导的
  // "四种归奇组合等概率"假设一致（docs/REFERENCES.md R1/R3），
  // 从而得到严格的 6/7/8/9 = 1/16、5/16、7/16、3/16。
  // 若改为对分二点整体均匀采样，四组合概率会出现 22/43 之类的
  // 轻微系统偏差，偏离文献基准，故不采用。
  const remLeft = randomInt(rng, 1, 4) as 1 | 2 | 3 | 4
  // 与 remLeft 同余类的合法分二点：left ∈ [1, stalks-1] 且 left ≡ remLeft (mod 4)
  const min = Math.ceil((1 - remLeft) / 4) * 4 + remLeft
  const max = Math.floor((stalks - 1 - remLeft) / 4) * 4 + remLeft
  const left = min + 4 * randomInt(rng, 0, Math.floor((max - min) / 4))
  const rightBeforeGua = stalks - left
  // 挂一：从右堆取一策挂于左手小指
  const right = rightBeforeGua - 1
  // 揲四归奇：余 0 记为 4（右堆由挂一后的总数与 remLeft 共同决定）
  const remRight = right % 4 === 0 ? 4 : right % 4
  const after = stalks - 1 - remLeft - remRight
  return {
    after,
    trace: { before: stalks, left, right: rightBeforeGua, remLeft, remRight, after },
  }
}

/** 余策数 → 爻值（6/7/8/9） */
export function remainingToValue(remaining: number): 6 | 7 | 8 | 9 {
  switch (remaining) {
    case 36:
      return 9
    case 32:
      return 8
    case 28:
      return 7
    case 24:
      return 6
    default:
      throw new Error(`Invalid remaining stalks: ${remaining}`)
  }
}

function createLine(value: 6 | 7 | 8 | 9): UnpositionedLine {
  switch (value) {
    case 6:
      return { yinYang: 'yin', isChanging: true, value: 6 }
    case 7:
      return { yinYang: 'yang', isChanging: false, value: 7 }
    case 8:
      return { yinYang: 'yin', isChanging: false, value: 8 }
    case 9:
      return { yinYang: 'yang', isChanging: true, value: 9 }
  }
}

/** 三变得一爻（含轨迹） */
export function castDayanLineWithTrace(rng: () => number = Math.random): {
  line: UnpositionedLine
  trace: DayanLineTrace
} {
  const traces: DayanChangeTrace[] = []
  let stalks = DAYAN_STALKS
  for (let i = 0; i < 3; i++) {
    const { after, trace } = dayanChange(stalks, rng)
    traces.push(trace)
    stalks = after
  }
  const value = remainingToValue(stalks)
  return {
    line: createLine(value),
    trace: { changes: traces as DayanLineTrace['changes'], remaining: stalks },
  }
}

/** 三变得一爻 */
export function castDayanLine(rng: () => number = Math.random): UnpositionedLine {
  return castDayanLineWithTrace(rng).line
}

/** 完整大衍起卦：十八变得六爻（初爻到上爻） */
export function castDayan(rng: () => number = Math.random): Line[] {
  const lines: Line[] = []
  for (let i = 0; i < 6; i++) {
    const line = castDayanLine(rng)
    lines.push({ ...line, position: (i + 1) as Line['position'] })
  }
  return lines
}
