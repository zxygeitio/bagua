'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BaguaCompass } from '@/components/home/BaguaCompass'
import { TRIGRAM_SYMBOLS } from '@/lib/qigua/bagua'
import type { TrigramName } from '@/lib/qigua/types'

interface TrigramDetail {
  name: TrigramName
  pinyin: string
  symbol: string
  order: string
  nature: string
  element: string
  direction: string
  family: string
  virtue: string
  bodyPart: string
  xiangci: string
  desc: string
  pureGuaId: number
  pureGuaName: string
  lines: [string, string, string] // [上爻, 中爻, 初爻]
}

const TRIGRAM_DETAILS: Record<TrigramName, TrigramDetail> = {
  乾: {
    name: '乾',
    pinyin: 'qián',
    symbol: '☰',
    order: '伏羲次序 · 第一',
    nature: '天',
    element: '金',
    direction: '正南',
    family: '父',
    virtue: '健（刚健不息）',
    bodyPart: '首',
    xiangci: '天行健，君子以自强不息。',
    desc: '纯阳刚劲，健而不息。象征天宇高远、化育万物、君临天下之尊。',
    pureGuaId: 1,
    pureGuaName: '乾为天',
    lines: ['上爻 · 纯阳 ⚊', '中爻 · 纯阳 ⚊', '初爻 · 纯阳 ⚊'],
  },
  兑: {
    name: '兑',
    pinyin: 'duì',
    symbol: '☱',
    order: '伏羲次序 · 第二',
    nature: '泽',
    element: '金',
    direction: '东南',
    family: '少女',
    virtue: '悦（和悦欣喜）',
    bodyPart: '口',
    xiangci: '丽泽，兑；君子以朋友讲习。',
    desc: '汪洋大泽，滋润万物。象征欢悦交流、朋友相辅相成、润泽心田。',
    pureGuaId: 58,
    pureGuaName: '兑为泽',
    lines: ['上爻 · 阴虚 ⚋', '中爻 · 阳实 ⚊', '初爻 · 阳实 ⚊'],
  },
  离: {
    name: '离',
    pinyin: 'lí',
    symbol: '☲',
    order: '伏羲次序 · 第三',
    nature: '火',
    element: '火',
    direction: '正东',
    family: '中女',
    virtue: '丽（光明附丽）',
    bodyPart: '目',
    xiangci: '明两作，离；大人以继明照于四方。',
    desc: '如日光普照、薪火相传。外刚内柔，象征文明礼乐、附丽光明。',
    pureGuaId: 30,
    pureGuaName: '离为火',
    lines: ['上爻 · 阳实 ⚊', '中爻 · 阴虚 ⚋', '初爻 · 阳实 ⚊'],
  },
  震: {
    name: '震',
    pinyin: 'zhèn',
    symbol: '☳',
    order: '伏羲次序 · 第四',
    nature: '雷',
    element: '木',
    direction: '东北',
    family: '长男',
    virtue: '动（奋起震动）',
    bodyPart: '足',
    xiangci: '洊雷，震；君子以恐惧修省。',
    desc: '春雷发越，震醒蛰伏。象征生机勃发、戒慎恐惧以立德行。',
    pureGuaId: 51,
    pureGuaName: '震为雷',
    lines: ['上爻 · 阴虚 ⚋', '中爻 · 阴虚 ⚋', '初爻 · 一阳初动 ⚊'],
  },
  巽: {
    name: '巽',
    pinyin: 'xùn',
    symbol: '☴',
    order: '伏羲次序 · 第五',
    nature: '风',
    element: '木',
    direction: '西南',
    family: '长女',
    virtue: '入（顺逊渗透）',
    bodyPart: '股',
    xiangci: '随风，巽；君子以申命行事。',
    desc: '如春风化雨，无孔不入。象征温和谦逊、顺应天地法则而潜移默化。',
    pureGuaId: 57,
    pureGuaName: '巽为风',
    lines: ['上爻 · 阳实 ⚊', '中爻 · 阳实 ⚊', '初爻 · 一阴潜入 ⚋'],
  },
  坎: {
    name: '坎',
    pinyin: 'kǎn',
    symbol: '☵',
    order: '伏羲次序 · 第六',
    nature: '水',
    element: '水',
    direction: '正西',
    family: '中男',
    virtue: '陷（险难笃定）',
    bodyPart: '耳',
    xiangci: '水洊至，习坎；君子以常德行，习教事。',
    desc: '大河奔流，险中求通。外柔内刚，象征内藏实德、临危不乱之定力。',
    pureGuaId: 29,
    pureGuaName: '坎为水',
    lines: ['上爻 · 阴虚 ⚋', '中爻 · 一阳在内 ⚊', '初爻 · 阴虚 ⚋'],
  },
  艮: {
    name: '艮',
    pinyin: 'gèn',
    symbol: '☶',
    order: '伏羲次序 · 第七',
    nature: '山',
    element: '土',
    direction: '西北',
    family: '少男',
    virtue: '止（安止守静）',
    bodyPart: '手',
    xiangci: '兼山，艮；君子以思不出其位。',
    desc: '高山耸峙，安重不迁。象征静止反思、动静有常、各得其所。',
    pureGuaId: 52,
    pureGuaName: '艮为山',
    lines: ['上爻 · 一阳当顶 ⚊', '中爻 · 阴虚 ⚋', '初爻 · 阴虚 ⚋'],
  },
  坤: {
    name: '坤',
    pinyin: 'kūn',
    symbol: '☷',
    order: '伏羲次序 · 第八',
    nature: '地',
    element: '土',
    direction: '正北',
    family: '母',
    virtue: '顺（含弘光大）',
    bodyPart: '腹',
    xiangci: '地势坤，君子以厚德载物。',
    desc: '纯阴博大，载育群生。象征宽厚包容、顺应天时、厚积薄发之德。',
    pureGuaId: 2,
    pureGuaName: '坤为地',
    lines: ['上爻 · 纯阴 ⚋', '中爻 · 纯阴 ⚋', '初爻 · 纯阴 ⚋'],
  },
}

const ORDERED_TRIGRAMS: TrigramName[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

export function BaguaInteractiveExplorer() {
  const [selected, setSelected] = useState<TrigramName>('乾')
  const detail = TRIGRAM_DETAILS[selected]

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
      {/* 左侧：先天八卦罗盘本体 */}
      <div className="paper-panel relative flex flex-col justify-between border-4 border-bagua-text bg-bagua-surface p-5 md:p-6 shadow-soft">
        {/* 顶部档案元数据 */}
        <div className="flex items-center justify-between border-b border-bagua-fiber pb-3">
          <span className="font-display text-xs tracking-[0.24em] text-bagua-primary">
            先天八卦 · 伏羲八方位
          </span>
          <span className="border border-bagua-fiber bg-bagua-canvas px-2 py-0.5 font-mono text-[11px] text-bagua-muted">
            当前选中 · {selected}卦
          </span>
        </div>

        {/* 中央罗盘展示区 */}
        <div className="my-auto flex items-center justify-center py-4">
          <div className="w-full max-w-[430px]">
            <BaguaCompass
              activeTrigram={selected}
              onSelectTrigram={(name) => setSelected(name)}
            />
          </div>
        </div>

        {/* 底部快速选择条 */}
        <div className="border-t border-bagua-fiber pt-4">
          <div className="flex items-center justify-between border-2 border-bagua-text bg-bagua-surface p-1 shadow-2xs">
            {ORDERED_TRIGRAMS.map((t) => {
              const isActive = selected === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelected(t)}
                  className={`flex flex-1 flex-col items-center py-1.5 transition ${
                    isActive
                      ? 'bg-bagua-primary text-bagua-surface font-semibold shadow-xs'
                      : 'text-bagua-text hover:bg-bagua-wash'
                  }`}
                  title={`${t}卦 (${TRIGRAM_SYMBOLS[t]})`}
                >
                  <span className="font-display text-sm leading-none">{TRIGRAM_SYMBOLS[t]}</span>
                  <span className="mt-0.5 font-display text-[11px]">{t}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 右侧：经典古籍立轴样式的解读卡 */}
      <div className="paper-panel relative flex flex-col justify-between border-4 border-bagua-text bg-bagua-surface p-5 md:p-6 shadow-soft">
        <div>
          {/* 顶部档案元数据 */}
          <div className="flex items-center justify-between border-b border-bagua-fiber pb-3">
            <span className="font-display text-xs tracking-[0.24em] text-bagua-primary">
              {detail.order}
            </span>
            <span className="border border-bagua-fiber bg-bagua-canvas px-2 py-0.5 font-mono text-[11px] text-bagua-muted">
              先天方位 · {detail.direction}
            </span>
          </div>

        {/* 卦象标题与大符号 */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <h3 className="font-display text-3xl tracking-widest text-bagua-text md:text-4xl">
                {detail.name}
              </h3>
              <span className="font-mono text-xs text-bagua-muted">/{detail.pinyin}/</span>
              <span className="border-l border-bagua-fiber pl-3 font-display text-base tracking-wider text-bagua-primary">
                象 · {detail.nature}
              </span>
            </div>
            <p className="mt-2 font-display text-xs tracking-wider text-bagua-muted">
              卦德：{detail.virtue}
            </p>
          </div>

          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center border-2 border-bagua-text bg-bagua-canvas font-display text-4xl text-bagua-text shadow-sm">
            {detail.symbol}
          </div>
        </div>

        {/* 象辞名句 */}
        <div className="mt-5 border-l-2 border-bagua-primary bg-bagua-wash/60 p-3">
          <p className="font-display text-[10px] text-bagua-muted">《易·大象传》</p>
          <p className="mt-1 font-body text-xs leading-relaxed text-bagua-text md:text-sm">
            「{detail.xiangci}」
          </p>
        </div>

        {/* 象义解读 */}
        <p className="mt-3 font-body text-xs leading-relaxed text-bagua-muted md:text-sm">
          {detail.desc}
        </p>

        {/* 属性网格 */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-y border-bagua-fiber py-3 sm:grid-cols-4 font-body text-xs">
          <div className="border-r border-bagua-fiber pr-2">
            <span className="text-bagua-muted">五行</span>
            <p className="mt-0.5 font-display text-bagua-text">{detail.element}</p>
          </div>
          <div className="border-r border-bagua-fiber px-2 sm:border-r">
            <span className="text-bagua-muted">六亲</span>
            <p className="mt-0.5 font-display text-bagua-text">{detail.family}</p>
          </div>
          <div className="border-r border-bagua-fiber px-2 sm:border-r">
            <span className="text-bagua-muted">身体</span>
            <p className="mt-0.5 font-display text-bagua-text">{detail.bodyPart}</p>
          </div>
          <div className="pl-2">
            <span className="text-bagua-muted">重卦代表</span>
            <p className="mt-0.5 font-display text-bagua-primary">{detail.pureGuaName}</p>
          </div>
        </div>

        {/* 三爻结构 */}
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-bagua-muted">
          {detail.lines.map((line, idx) => (
            <span key={idx} className="border border-bagua-fiber bg-bagua-canvas px-1.5 py-0.5">
              {line}
            </span>
          ))}
        </div>

        </div>

        {/* 底部行动入口 */}
        <div className="mt-5 flex items-center justify-between border-t border-bagua-fiber pt-4">
          <span className="font-body text-xs text-bagua-muted">
            八卦相重为六十四卦
          </span>
          <Link
            href={`/hexagrams/${detail.pureGuaId}`}
            className="btn-primary glow-pulse text-xs px-4 py-2"
          >
            研读【{detail.pureGuaName}】详解 →
          </Link>
        </div>
      </div>
    </div>
  )
}