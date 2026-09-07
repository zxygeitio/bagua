import type { Metadata } from 'next'

import { MethodCards } from '@/components/learn/MethodCards'
import { ReadingGuide } from '@/components/learn/ReadingGuide'
import { TrigramOverview } from '@/components/learn/TrigramCard'
import { SiteShell } from '@/components/shared/SiteShell'

export const metadata: Metadata = {
  title: '易学入门 · bagua',
  description: '八卦总览、五种起卦法、易经阅读法与常见概念。',
}

export default function LearnPage() {
  return (
    <SiteShell eyebrow="LEARN / 03">
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <header className="enter-up">
          <h1 className="font-display text-5xl tracking-[0.06em] md:text-6xl">易学入门</h1>
          <p className="prose-body mt-4 max-w-2xl text-bagua-muted">
            这里集中了起卦前需要知道的事。先把八卦与起卦方法看一遍，再去起卦，会更顺手。
          </p>
        </header>

        <Section index="01" title="八卦总览" intro="卦象的基础是八卦。下表为每一卦的取象与卦德，点击可展开详细。">
          <TrigramOverview />
        </Section>

        <Section index="02" title="五种起卦法" intro="不同方法对应不同的郑重程度。日常多以硬币法或时间起卦；想要郑重其事，可用蓍草法。">
          <MethodCards />
        </Section>

        <Section index="03" title="卦怎么读" intro="卦辞为体，爻辞为用；动爻处即是问题的关键。以下是常用的五步读卦法。">
          <ReadingGuide />
        </Section>

        <Section index="04" title="常见概念" intro="以下名词在阅读卦辞时常出现，记住它们能在不解之处少卡一些。">
          <div className="grid gap-3 sm:grid-cols-2">
            {GLOSSARY.map((g) => (
              <div key={g.term} className="paper-panel--quiet border-4 border-bagua-fiber bg-bagua-surface p-4">
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
    </SiteShell>
  )
}

function Section({
  index,
  title,
  intro,
  children,
}: {
  index: string
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <section className="enter-up mt-14">
      <div className="mb-6 flex items-end gap-4 border-b-4 border-bagua-text pb-3">
        <span className="font-display text-[11px] tracking-[0.28em] text-bagua-primary">SECTION</span>
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
  { term: '互卦', pinyin: 'hù guà', def: '取本卦二三四爻为下、三四五爻为上合成之卦，代表问题的发展过程。' },
  { term: '错卦', pinyin: 'cuò guà', def: '将本卦六爻阴阳全反而得之卦，代表问题的另一面对照。' },
  { term: '综卦', pinyin: 'zōng guà', def: '将本卦上下颠倒而得之卦，代表换位思考后看到的样子。' },
  { term: '动爻', pinyin: 'dòng yáo', def: '老阳（9）或老阴（6）之爻，阴阳将会互换，是卦象变化的关键。' },
  { term: '用神', pinyin: 'yòng shén', def: '所占之事对应的六亲爻位，是断卦的主要观察对象。' },
  { term: '六亲', pinyin: 'liù qīn', def: '父母、兄弟、子孙、妻财、官鬼五种爻位关系，对应不同问题的关注点。' },
  { term: '卦德', pinyin: 'guà dé', def: '每卦的精神特质，如乾健、坤顺、震动、巽入。' },
  { term: '五行', pinyin: 'wǔ xíng', def: '金木水火土五种气的运动，决定卦象之间的生克关系。' },
]
