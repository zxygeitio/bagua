#!/usr/bin/env tsx
/**
 * 64卦数据迁移脚本
 * 从 guaxiang.ts 提取 liuShiSiGua，转换为 GuaSchema 要求的字段结构，
 * 写入 src/lib/iching/data/hexagrams.json
 */
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// 引入原始数据源
// @ts-ignore - 自定义非标准路径
import guaxiang from '../guaxiang'

interface RawYao {
  position: number
  yinYang: 'yin' | 'yang'
  text: string
  xiangZhuan?: string
}

interface RawGua {
  id: number
  name: string
  chineseName: string
  pronunciation: string
  guaci: string
  tuanZhuan: string
  daXiangZhuan: string
  yaos: RawYao[]
  shangGua: string
  xiaGua: string
  duiGua: number
  zongGua: number
  huGua: number
  guaBian: number[]
  shiWei: { zhong: boolean; description: string }
  symbol: string
  meaning: string
  wuxing: string
}

/** 基于卦名推断的关键词 */
function inferKeywords(name: string, chineseName: string): string[] {
  const kws = new Set<string>()
  // 卦象核心词
  const coreMap: Record<string, string[]> = {
    '乾': ['刚健', '纯阳', '元始'],
    '坤': ['柔顺', '承载', '包容'],
    '屯': ['起始', '艰难', '生机'],
    '蒙': ['蒙昧', '启蒙', '教化'],
    '需': ['等待', '需待', '饮食'],
    '讼': ['争讼', '是非', '诉讼'],
    '师': ['军旅', '众众', '统率'],
    '比': ['亲比', '辅佐', '亲近'],
    '小畜': ['小畜', '蓄养', '文德'],
    '履': ['践履', '礼仪', '危行'],
    '泰': ['通泰', '亨通', '安泰'],
    '否': ['否塞', '闭塞', '阻隔'],
    '同人': ['和同', '会同', '同心'],
    '大有': ['富有', '盛大', '光明'],
    '谦': ['谦虚', '谦退', '谦下'],
    '豫': ['欢乐', '预备', '顺动'],
    '随': ['随从', '随时', '随顺'],
    '蛊': ['整治', '革新', '振民'],
    '临': ['临莅', '治理', '教化'],
    '观': ['观察', '观仰', '神道'],
    '噬嗑': ['咬合', '刑罚', '除奸'],
    '贲': ['文饰', '礼仪', '美化'],
    '剥': ['剥落', '侵蚀', '衰落'],
    '复': ['复返', '归回', '复苏'],
    '无妄': ['无妄', '纯正', '天命'],
    '大畜': ['大蓄', '包容', '畜德'],
    '颐': ['颐养', '养人', '口实'],
    '大过': ['大过', '非常', '栋梁'],
    '坎': ['险阻', '重险', '诚信'],
    '离': ['光明', '附丽', '依附'],
    '咸': ['感应', '交感', '夫妇'],
    '恒': ['恒久', '恒常', '恒心'],
    '遁': ['退避', '隐退', '远离'],
    '大壮': ['强盛', '壮盛', '威猛'],
    '晋': ['前进', '晋升', '明出'],
    '明夷': '光明伤害'.split('').join('') ? ['光明', '伤害', '韬光'] : ['光明伤害', '韬光', '晦明'],
    '家人': ['家宅', '家人', '家道'],
    '睽': ['乖违', '对立', '睽异'],
    '蹇': ['艰难', '跛足', '艰难险阻'],
    '解': ['缓解', '解脱', '赦免'],
    '损': ['减损', '损下益上', '惩忿'],
    '益': ['增益', '损上益下', '迁善'],
    '夬': ['决断', '刚决', '果决'],
    '姤': ['邂逅', '相遇', '阴生'],
    '萃': ['聚集', '萃集', '聚众'],
    '升': ['上升', '上进', '柔升'],
    '困': ['困顿', '穷困', '处困'],
    '井': ['井养', '水井', '养人'],
    '革': ['变革', '革新', '改过'],
    '鼎': ['鼎器', '鼎新', '养贤'],
    '震': ['震动', '惊雷', '警醒'],
    '艮': ['止止', '静止', '安止'],
    '渐': ['渐进', '循序渐进', '女归'],
    '归妹': ['归嫁', '婚媾', '终始'],
    '丰': ['丰大', '盛大', '丰盛'],
    '旅': ['旅行', '客居', '羁旅'],
    '巽': ['巽顺', '谦入', '风行'],
    '兑': ['喜悦', '和悦', '口舌'],
    '涣': ['涣散', '流散', '风行水上'],
    '节': ['节制', '节度', '礼节'],
    '中孚': ['诚信', '中心', '感化'],
    '小过': ['小过', '小事', '过度'],
    '既济': ['既济', '成功', '初吉终乱'],
    '未济': ['未济', '未成', '待续'],
  }
  // 兜底：直接从 chineseName 匹配
  const matched = coreMap[chineseName]
  if (matched) {
    matched.forEach((k) => kws.add(k))
  } else {
    // 未知：使用通用词
    kws.add(chineseName)
    kws.add(name)
  }
  return Array.from(kws)
}

/** 基于卦名推断分类标签 */
function inferCategoryTags(name: string, chineseName: string): string[] {
  const tags: string[] = []
  // 上下卦拆分
  const trigramMap: Record<string, string> = {
    '乾': '天', '坤': '地', '震': '雷', '巽': '风',
    '坎': '水', '离': '火', '艮': '山', '兑': '泽',
  }
  // 上卦、下卦
  const parts = chineseName.split('')
  // 推断上下卦（简化：基于 name 前半段）
  const shangMap: Record<string, string> = {
    '天': '乾', '泽': '兑', '火': '离', '雷': '震',
    '风': '巽', '水': '坎', '山': '艮', '地': '坤',
  }
  const xiaMap: Record<string, string> = {
    '天': '乾', '泽': '兑', '火': '离', '雷': '震',
    '风': '巽', '水': '坎', '山': '艮', '地': '坤',
  }
  // 取 name 的前两个字作为上卦描述
  const shang = name.substring(0, 1)
  const xia = name.substring(1, 2)
  const shangTrigram = shangMap[shang]
  const xiaTrigram = xiaMap[xia]
  if (shangTrigram) tags.push(trigramMap[shangTrigram] + '上卦')
  if (xiaTrigram) tags.push(trigramMap[xiaTrigram] + '下卦')

  tags.push(chineseName + '卦')

  // 核心性质
  const natureMap: Record<string, string[]> = {
    '乾': ['阳', '刚健'], '坤': ['阴', '柔顺'],
    '震': ['动', '奋起'], '巽': ['入', '顺'],
    '坎': ['险', '陷'], '离': ['明', '丽'],
    '艮': ['止', '静'], '兑': ['悦', '口'],
  }
  for (const tg of [shangTrigram, xiaTrigram]) {
    if (tg && natureMap[tg]) {
      natureMap[tg].forEach((n) => tags.push(n))
    }
  }
  // 去重
  return Array.from(new Set(tags))
}

/** 文本对象构造：文言传（乾、坤特有） */
const WENYAN: Record<number, string> = {
  1: '乾，元亨利贞。初九潜龙勿用，下也。见龙在田，时舍也。终日乾乾，行事也。或跃在渊，自试也。飞龙在天，上治也。亢龙有悔，穷之灾也。乾元用九，天下治也。',
  2: '坤，元亨，利牝马之贞。君子有攸往，先迷后得主，得西南得朋，乃与类行。东北丧朋，乃终有庆。安贞之吉，应地无疆。',
}

function main() {
  const raw: RawGua[] = (guaxiang as any).default ?? guaxiang

  if (!Array.isArray(raw)) {
    console.error('❌ 原始数据不是数组')
    process.exit(1)
  }

  console.log(`📥 读取到 ${raw.length} 条原始卦数据`)

  const migrated = raw.map((g) => {
    const shangGua = g.shangGua as string
    const xiaGua = g.xiaGua as string

    // 字段重组（按 GuaSchema 顺序）
    const result: Record<string, unknown> = {
      id: g.id,
      name: g.name,
      chineseName: g.chineseName,
      pronunciation: g.pronunciation,
      guaci: g.guaci,
      tuanZhuan: g.tuanZhuan,
      daXiangZhuan: g.daXiangZhuan,
      // wenYan 仅 乾、坤 有
      ...(WENYAN[g.id] ? { wenYan: WENYAN[g.id] } : {}),
      yaos: g.yaos.map((y) => ({
        position: y.position,
        yinYang: y.yinYang,
        text: y.text,
        xiangZhuan: y.xiangZhuan ?? '',
      })),
      shangGua,
      xiaGua,
      duiGua: g.duiGua,
      zongGua: g.zongGua,
      huGua: g.huGua,
      guaBian: g.guaBian,
      wuxing: g.wuxing,
      palace: 1,
      palaceOrder: ((g.id - 1) % 8) + 1,
      shiYao: 6,
      yingYao: 3,
      categoryTags: inferCategoryTags(g.name, g.chineseName),
      keywords: inferKeywords(g.name, g.chineseName),
      scenarios: ['career', 'self'],
      interpretationPack: {
        byScenario: {},
        overall: g.meaning,
        advice: [],
        warnings: [],
        keywords: [],
      },
      // fuGua 不设置（undefined 会被 JSON.stringify 跳过）
      symbol: g.symbol,
      meaning: g.meaning,
      modernInsight: g.meaning.length >= 20 ? g.meaning : g.meaning + '——结合时代背景，深入理解卦象的现代意义。',
      metadata: {
        primary: 'iching64',
        sources: ['Frank2333333/iching64'],
        confidence: 0.85,
        variants: {},
      },
    }
    return result
  })

  // 验证 ID 完整
  if (migrated.length !== 64) {
    console.error(`❌ 卦数 ${migrated.length} ≠ 64`)
    process.exit(1)
  }
  const ids = new Set(migrated.map((g) => g.id as number))
  if (ids.size !== 64) {
    console.error('❌ 卦 ID 不唯一')
    process.exit(1)
  }

  const outPath = resolve(__dirname, '../src/lib/iching/data/hexagrams.json')
  writeFileSync(outPath, JSON.stringify(migrated, null, 2), 'utf-8')
  console.log(`💾 已写入 ${outPath}`)
  console.log(`✅ 迁移完成：${migrated.length} 卦`)
}

main()