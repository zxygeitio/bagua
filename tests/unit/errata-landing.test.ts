import { describe, expect, it } from 'vitest'

import { getAllHexagrams, getGuaById } from '@/lib/iching/data-access'
import { HexagramsSchema } from '@/lib/iching/schemas'
import { YONG_JIU, YONG_LIU } from '@/lib/qigua/reading'

const yao = (guaId: number, position: number) => {
  const gua = getGuaById(guaId)!
  return gua.yaos.find((y) => y.position === position)!
}

describe('v2.1.0 勘误落地（依据 docs/ERRATA.md 裁决）', () => {
  it('E6：讼九二小象「归逋窜」已修正为「归而逋」并补第二句', () => {
    expect(yao(6, 2).xiangZhuan).toBe('不克讼，归而逋也。自下讼上，患至掇也。')
  })

  it('E11：大有九四小象「明辨皙」已修正为「明辨晰」', () => {
    expect(yao(14, 4).xiangZhuan).toBe('匪其彭，无咎，明辨晰也。')
  })

  it('保留裁决不动的异文未被误改（E1/E2/E3/E4/E7-E10 抽查）', () => {
    expect(getGuaById(1)!.tuanZhuan).toContain('大明终始')
    expect(getGuaById(1)!.tuanZhuan).toContain('保合太和')
    expect(yao(2, 6).xiangZhuan).toContain('龙战于野')
    expect(yao(10, 4).text).toContain('愬愬')
    expect(yao(13, 5).text).toContain('号咷')
    expect(yao(8, 1).xiangZhuan).toContain('它吉')
  })

  it('G1：乾用九/坤用六已补录，且与变占引擎常量一致', () => {
    const qian = getGuaById(1)!
    const kun = getGuaById(2)!
    expect(qian.yong).toEqual({
      label: '用九',
      text: YONG_JIU,
      xiangZhuan: '用九，天德不可为首也。',
    })
    expect(kun.yong).toEqual({
      label: '用六',
      text: YONG_LIU,
      xiangZhuan: '用六永贞，以大终也。',
    })
    expect(getGuaById(3)!.yong).toBeUndefined()
  })

  it('G2：小象第二句全量补录（24 处）', () => {
    const expectations: Array<[number, number, string]> = [
      [2, 1, '驯致其道，至坚冰也。'],
      [2, 2, '不习无不利，地道光也。'],
      [2, 3, '或从王事，知光大也。'],
      [3, 1, '以贵下贱，大得民也。'],
      [3, 2, '十年乃字，反常也。'],
      [3, 3, '君子舍之，往吝穷也。'],
      [5, 1, '利用恒，无咎；未失常也。'],
      [5, 2, '虽小有言，以终吉也。'],
      [5, 3, '自我致寇，敬慎不败也。'],
      [5, 6, '虽不当位，未大失也。'],
      [6, 1, '虽有小言，其辩明也。'],
      [7, 2, '王三锡命，怀万邦也。'],
      [7, 5, '弟子舆尸，使不当也。'],
      [7, 6, '小人勿用，必乱邦也。'],
      [8, 5, '舍逆取顺，失前禽也。邑人不诫，上使中也。'],
      [10, 3, '眇能视，不足以有明也。跛能履，不足以与行也。武人为于大君，志刚也。'],
      [9, 6, '君子征凶，有所疑也。'],
      [11, 4, '不戒以孚，中心愿也。'],
      [13, 3, '三岁不兴，安行也。'],
      [13, 4, '其吉，则困而反则也。'],
      [13, 5, '大师相遇，言相克也。'],
      [14, 5, '威如之吉，易而无备也。'],
      [15, 6, '可用行师，征邑国也。'],
      [16, 5, '恒不死，中未亡也。'],
    ]
    expect(expectations).toHaveLength(24)
    for (const [gid, pos, tail] of expectations) {
      expect(yao(gid, pos).xiangZhuan.endsWith(tail), `卦${gid} 爻${pos}`).toBe(true)
    }
  })

  it('全量数据仍通过 GuaSchema（含新增 yong 可选字段）', () => {
    const parsed = HexagramsSchema.safeParse(getAllHexagrams())
    expect(parsed.success).toBe(true)
  })
})
