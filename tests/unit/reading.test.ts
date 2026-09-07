import { describe, expect, it } from 'vitest'

import { getGuaById } from '@/lib/iching'
import {
  YONG_JIU,
  YONG_LIU,
  assembleReading,
  changingRule,
} from '@/lib/qigua/reading'

describe('朱熹变爻断法', () => {
  it('0 动：用本卦卦辞', () => {
    const rule = changingRule([])
    expect(rule.id).toBe('ben-guaci')
    expect(rule.primaryPositions).toEqual([])
    const ben = getGuaById(1)!
    const reading = assembleReading({ ben, changing: [] })
    expect(reading.verdicts[0]?.text).toBe(ben.guaci)
  })

  it('1 动：用该爻爻辞', () => {
    const rule = changingRule([2])
    expect(rule.id).toBe('ben-yao')
    expect(rule.primaryPositions).toEqual([2])
    const ben = getGuaById(1)!
    const reading = assembleReading({ ben, changing: [2] })
    expect(reading.verdicts[0]?.text).toBe('见龙在田，利见大人。')
  })

  it('2 动：读两爻，以上爻为主', () => {
    const rule = changingRule([1, 5])
    expect(rule.id).toBe('ben-yao')
    expect(rule.primaryPositions).toEqual([5, 1])
    expect(rule.primaryPositions[0]).toBe(5)
  })

  it('3 动：本卦为贞、之卦为悔', () => {
    const rule = changingRule([1, 2, 3])
    expect(rule.id).toBe('ben-and-bian')
    const ben = getGuaById(1)!
    const bian = getGuaById(10)!
    const reading = assembleReading({ ben, bian, changing: [1, 2, 3] })
    expect(reading.verdicts.map((item) => item.text)).toEqual([ben.guaci, bian.guaci])
  })

  it('4 动：用之卦两不变爻，以下爻为主', () => {
    const rule = changingRule([3, 4, 5, 6])
    expect(rule.id).toBe('bian-yao')
    expect(rule.primaryPositions).toEqual([1, 2])
  })

  it('5 动：用之卦唯一不变爻', () => {
    const rule = changingRule([1, 2, 3, 4, 5])
    expect(rule.id).toBe('bian-yao')
    expect(rule.primaryPositions).toEqual([6])
  })

  it('6 动乾用九、坤用六，其余用之卦卦辞', () => {
    expect(changingRule([1, 2, 3, 4, 5, 6], 1).id).toBe('yong')
    expect(assembleReading({ ben: getGuaById(1)!, changing: [1, 2, 3, 4, 5, 6] }).verdicts[0]?.text).toBe(YONG_JIU)
    expect(assembleReading({ ben: getGuaById(2)!, changing: [1, 2, 3, 4, 5, 6] }).verdicts[0]?.text).toBe(YONG_LIU)
    const other = assembleReading({
      ben: getGuaById(3)!,
      bian: getGuaById(4),
      changing: [1, 2, 3, 4, 5, 6],
    })
    expect(other.rule.id).toBe('bian-guaci')
    expect(other.verdicts[0]?.text).toBe(getGuaById(4)!.guaci)
  })
})
