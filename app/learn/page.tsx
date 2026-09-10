import Link from 'next/link'

import type { Metadata } from 'next'

import { HexagramMandala } from '@/components/learn/HexagramMandala'
import { MethodCards } from '@/components/learn/MethodCards'
import { ReadingGuide } from '@/components/learn/ReadingGuide'
import { TrigramOverview } from '@/components/learn/TrigramCard'

export const metadata: Metadata = {
  title: '易学入门',
  description: '八卦总览、硬币法与大衍筮法、易经阅读法、参考文献与常见概念。',
}

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <header className="enter-up">
        <h1 className="font-display text-5xl tracking-[0.06em] md:text-6xl">易学入门</h1>
        <p className="prose-body mt-4 max-w-2xl text-bagua-muted">
          这里集中了起卦前需要知道的事。先把八卦与两种起卦规则看一遍，再去起卦，会更顺手。
        </p>
      </header>

      <Section
        index="01"
        title="八卦总览"
        intro="卦象的基础是八卦。下表取象、卦德、六亲出《说卦传》；方位为后天（文王）卦位，先天（伏羲）卦位见首页罗盘。点击可展开详细。"
      >
        <TrigramOverview />
      </Section>

        <Section index="01.5" title="璇玑六十四卦圆图" intro="邵雍《皇极经世》周天六十四卦圆图。按上卦分八区，统摄周天象数。悬停星位感应卦象，亦可切换八宫体悟万物生克。">
          <div className="flex justify-center">
            <HexagramMandala />
          </div>
        </Section>

        <Section index="02" title="起卦三种法门" intro="周易起卦，法由心生。既有最便行之三钱法，亦有古雅之揲蓍法，更有应物观象之梅花易数。">
          <MethodCards />
        </Section>

      <Section
        index="02"
        title="硬币起卦法"
        intro="三枚铜钱六掷，六爻自下而上记录；6 与 9 为动爻。"
      >
        <MethodCards />
      </Section>

      <Section
        index="02.5"
        title="概率实验室"
        intro="硬币法与大衍筮法的单爻分布不同，但全卦层面静卦率与期望动爻数完全一致——分歧只在「阳三而阴一」。"
      >
        <Link
          href="/learn/lab"
          className="paper-panel group flex items-center justify-between gap-4 border-4 border-bagua-fiber bg-bagua-surface p-5 transition-colors hover:border-bagua-primary"
        >
          <span className="prose-body text-sm text-bagua-text">
            进入<span className="font-display text-bagua-primary">概率实验室</span>
            ：蒙特卡洛对比、卡方检验与老阳老阴结构分析。
          </span>
          <span
            aria-hidden="true"
            className="font-display text-2xl text-bagua-primary transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </Section>

      <Section
        id="references"
        index="02.6"
        title="参考文献"
        intro="以下资料用于支撑本项目的起卦程序、概率分布与卦序说明。"
      >
        <div className="grid gap-3">
          {REFERENCES.map((reference) => (
            <article
              key={reference.id}
              className="border-l-4 border-bagua-primary bg-bagua-surface px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-xs tracking-widest text-bagua-primary">
                  {reference.id}
                </span>
                <h3 className="font-display text-sm tracking-wider text-bagua-text">
                  {reference.title}
                </h3>
              </div>
              <p className="prose-body mt-2 text-sm text-bagua-muted">{reference.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        index="03"
        title="卦怎么读"
        intro="卦辞为体，爻辞为用；动爻处即是问题的关键。以下为常用五步读卦法，其中「取用神」「看旺衰」属后世纳甲断法（京房体系），非《周易》本经读法。"
      >
        <ReadingGuide />
      </Section>

      <Section
        index="04"
        title="常见概念"
        intro="以下名词在阅读卦辞时常出现，记住它们能在不解之处少卡一些。"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {GLOSSARY.map((g) => (
            <div
              key={g.term}
              className="paper-panel--quiet border-4 border-bagua-fiber bg-bagua-surface p-4"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-base text-bagua-primary">{g.term}</span>
                <span className="font-body text-xs text-bagua-muted">{g.pinyin}</span>
              </div>
              <p className="prose-body mt-2 text-sm text-bagua-text">{g.def}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}

function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id?: string
  index: string
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="enter-up mt-14 cv-auto cis-s">
      <div className="mb-6 flex items-end gap-4 border-b-4 border-bagua-text pb-3">
        <span className="font-display text-[11px] tracking-[0.28em] text-bagua-primary">
          SECTION
        </span>
        <span className="font-display text-lg text-bagua-text">{index}</span>
        <h2 className="font-display text-2xl tracking-wider">{title}</h2>
      </div>
      <p className="prose-body mb-6 text-bagua-muted">{intro}</p>
      {children}
    </section>
  )
}

const GLOSSARY = [
  { term: '本卦', pinyin: 'běn guà', def: '起卦所得之卦，代表问题的起始状态。' },
  { term: '之卦', pinyin: 'zhī guà', def: '动爻变化后形成之卦，代表问题的终局或变化方向。' },
  {
    term: '互卦',
    pinyin: 'hù guà',
    def: '取本卦二三四爻为下、三四五爻为上合成之卦，代表问题的发展过程。',
  },
  { term: '错卦', pinyin: 'cuò guà', def: '将本卦六爻阴阳全反而得之卦，代表问题的另一面对照。' },
  { term: '综卦', pinyin: 'zōng guà', def: '将本卦上下颠倒而得之卦，代表换位思考后看到的样子。' },
  {
    term: '动爻',
    pinyin: 'dòng yáo',
    def: '老阳（9）或老阴（6）之爻，阴阳将会互换，是卦象变化的关键。',
  },
  { term: '用神', pinyin: 'yòng shén', def: '所占之事对应的六亲爻位，是断卦的主要观察对象。' },
  {
    term: '六亲',
    pinyin: 'liù qīn',
    def: '父母、兄弟、子孙、妻财、官鬼五种爻位关系，对应不同问题的关注点。',
  },
  { term: '卦德', pinyin: 'guà dé', def: '每卦的精神特质，如乾健、坤顺、震动、巽入。' },
  { term: '五行', pinyin: 'wǔ xíng', def: '金木水火土五种气的运动，决定卦象之间的生克关系。' },
]

const REFERENCES = [
  {
    id: 'R1',
    title: '王晓刚、宗序平：《基于正态近似法的〈周易本义·筮仪〉概率分析》',
    body: '大衍筮法 6/7/8/9 的理论概率为 1/16、5/16、7/16、3/16。',
  },
  {
    id: 'R3',
    title: '孙涤：《解析大衍筮法及易卦的蓍占概率》',
    body: '从三变决策树推导大衍法的 1:5:7:3 分布，并讨论其与硬币法的差异。',
  },
  {
    id: 'R6',
    title: '唐毅：《〈易经〉六十四卦的蒙特卡洛模拟》',
    body: '以蒙特卡洛方法复核老阳约 18.75%、老阴约 6.25% 的 3:1 结构。',
  },
  {
    id: 'R15',
    title: '朱熹：《周易本义·筮仪》',
    body: '本项目大衍筮法的分二、挂一、揲四、归奇及三变成爻程序依据。',
  },
  {
    id: 'R8',
    title: 'Knuth：《The Art of Computer Programming》Vol. 4B',
    body: '用于六十四卦文王序配对结构（综卦与错卦）的说明。',
  },
]
