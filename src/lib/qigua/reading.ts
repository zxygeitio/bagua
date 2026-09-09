/**
 * 朱熹《易学启蒙》变爻断法。
 * 按动爻数量决定读本卦还是之卦、读卦辞还是爻辞。
 */
import type { Gua } from '@/lib/iching/types'
import type { YaoPosition } from './types'

export const YONG_JIU = '见群龙无首，吉。'
export const YONG_LIU = '利永贞。'

export type ReadingId =
  | 'ben-guaci'
  | 'ben-yao'
  | 'ben-and-bian'
  | 'bian-yao'
  | 'bian-guaci'
  | 'yong'

export interface ChangingRule {
  id: ReadingId
  count: number
  title: string
  explain: string
  /** 规则出处（UI 标注用） */
  sourceRef: string
  /** 主读爻位，靠前的为主 */
  primaryPositions: YaoPosition[]
  target: 'ben' | 'bian' | 'both' | 'yong'
}

export interface Verdict {
  label: string
  text: string
  source: string
  position?: YaoPosition
  primary: boolean
}

const YAO_LABEL_YANG = ['初九', '九二', '九三', '九四', '九五', '上九'] as const
const YAO_LABEL_YIN = ['初六', '六二', '六三', '六四', '六五', '上六'] as const

/** 变占规则统一出处：朱熹《易学启蒙·考变占》（docs/REFERENCES.md R15） */
const SOURCE_REF = '朱熹《易学启蒙·考变占》'

export function yaoLabel(position: YaoPosition, yinYang: 'yang' | 'yin'): string {
  return yinYang === 'yang' ? YAO_LABEL_YANG[position - 1]! : YAO_LABEL_YIN[position - 1]!
}

function asPositions(values: number[]): YaoPosition[] {
  return values.filter((value): value is YaoPosition => value >= 1 && value <= 6)
}

export function changingRule(changing: readonly YaoPosition[], benGuaId?: number): ChangingRule {
  const unique = [...new Set(changing)].sort((a, b) => a - b)
  const count = unique.length
  const unchanged = asPositions(
    [1, 2, 3, 4, 5, 6].filter((pos) => !unique.includes(pos as YaoPosition)),
  )

  if (count === 0) {
    return {
      id: 'ben-guaci',
      count,
      title: '静卦',
      explain: '六爻皆静，以本卦卦辞为占。',
      sourceRef: SOURCE_REF,
      primaryPositions: [],
      target: 'ben',
    }
  }
  if (count === 1) {
    return {
      id: 'ben-yao',
      count,
      title: '一爻动',
      explain: '以本卦动爻爻辞为占。',
      sourceRef: SOURCE_REF,
      primaryPositions: [unique[0]!],
      target: 'ben',
    }
  }
  if (count === 2) {
    const [lower, upper] = unique
    return {
      id: 'ben-yao',
      count,
      title: '二爻动',
      explain: '读本卦两动爻，以上爻为主。',
      sourceRef: SOURCE_REF,
      primaryPositions: [upper!, lower!],
      target: 'ben',
    }
  }
  if (count === 3) {
    // 《易学启蒙·考变占》："三爻变，则占本卦及之卦之彖辞，而以本卦为贞，之卦为悔。
    // 前十卦主贞，后十卦主悔。"——三爻动共二十种情形，其中十种初爻亦动
    // 为"前十卦"（以本卦为主），十种初爻静为"后十卦"（以之卦为主）。
    const benPrimary = unique.includes(1)
    return {
      id: 'ben-and-bian',
      count,
      title: benPrimary ? '三爻动 · 前十卦主贞' : '三爻动 · 后十卦主悔',
      explain: benPrimary
        ? '本卦为贞，之卦为悔，兼看两卦卦辞；初爻亦动，属前十卦，以本卦为主。'
        : '本卦为贞，之卦为悔，兼看两卦卦辞；初爻静，属后十卦，以之卦为主。',
      sourceRef: SOURCE_REF,
      primaryPositions: [],
      target: 'both',
    }
  }
  if (count === 4) {
    const [lower, upper] = unchanged
    return {
      id: 'bian-yao',
      count,
      title: '四爻动',
      explain: '用之卦两不变爻，以下爻为主。',
      sourceRef: SOURCE_REF,
      primaryPositions: asPositions([lower ?? 0, upper ?? 0]),
      target: 'bian',
    }
  }
  if (count === 5) {
    return {
      id: 'bian-yao',
      count,
      title: '五爻动',
      explain: '用之卦中唯一不变之爻。',
      sourceRef: SOURCE_REF,
      primaryPositions: unchanged,
      target: 'bian',
    }
  }

  if (benGuaId === 1 || benGuaId === 2) {
    return {
      id: 'yong',
      count,
      title: benGuaId === 1 ? '用九' : '用六',
      explain: benGuaId === 1 ? '乾卦六爻皆变，以用九为占。' : '坤卦六爻皆变，以用六为占。',
      sourceRef: SOURCE_REF,
      primaryPositions: [],
      target: 'yong',
    }
  }
  return {
    id: 'bian-guaci',
    count,
    title: '六爻皆变',
    explain: '不以本卦为占，专看之卦卦辞。',
    sourceRef: SOURCE_REF,
    primaryPositions: [],
    target: 'bian',
  }
}

export function assembleReading(input: {
  ben: Gua
  bian?: Gua | null
  changing: readonly YaoPosition[]
}): { rule: ChangingRule; verdicts: Verdict[] } {
  const rule = changingRule(input.changing, input.ben.id)
  const host = rule.target === 'bian' ? (input.bian ?? input.ben) : input.ben

  if (rule.id === 'yong') {
    const isQian = input.ben.id === 1
    return {
      rule,
      verdicts: [
        {
          label: isQian ? '用九' : '用六',
          text: isQian ? YONG_JIU : YONG_LIU,
          source: input.ben.name,
          primary: true,
        },
      ],
    }
  }

  if (rule.id === 'ben-guaci') {
    return {
      rule,
      verdicts: [
        { label: '本卦卦辞', text: input.ben.guaci, source: input.ben.name, primary: true },
      ],
    }
  }

  if (rule.id === 'bian-guaci') {
    const gua = input.bian ?? input.ben
    return {
      rule,
      verdicts: [{ label: '之卦卦辞', text: gua.guaci, source: gua.name, primary: true }],
    }
  }

  if (rule.id === 'ben-and-bian') {
    // 前十卦主贞（初爻动→本卦为主），后十卦主悔（初爻静→之卦为主）
    const benPrimary = input.changing.includes(1)
    const verdicts: Verdict[] = [
      {
        label: '贞 · 本卦卦辞',
        text: input.ben.guaci,
        source: input.ben.name,
        primary: benPrimary,
      },
    ]
    if (input.bian) {
      verdicts.push({
        label: '悔 · 之卦卦辞',
        text: input.bian.guaci,
        source: input.bian.name,
        primary: !benPrimary,
      })
    }
    return { rule, verdicts }
  }

  const verdicts: Verdict[] = rule.primaryPositions.map((position, index) => {
    const yao = host.yaos.find((item) => item.position === position)
    return {
      label: yao ? yaoLabel(position, yao.yinYang) : `第${position}爻`,
      text: yao?.text ?? '',
      source: host.name,
      position,
      primary: index === 0,
    }
  })
  return { rule, verdicts }
}
