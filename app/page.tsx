import Link from 'next/link'

import { BaguaCompass } from '@/components/home/BaguaCompass'
import { DailyOracle } from '@/components/hexagram/DailyOracle'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { MethodShortcutCards } from '@/components/home/MethodShortcutCards'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/home/SectionHeader'
import {
  Earth,
  Fire,
  Hand,
  Metal,
  Star,
  Water,
  Wood,
  Wand,
} from '@/components/icons'
import { SiteShell } from '@/components/shared/SiteShell'
import { PaperTilt } from '@/components/shared/PaperTilt'
import { PaperParticles } from '@/components/shared/PaperParticles'
import { getGuaById } from '@/lib/iching'

const FEATURED = [1, 2, 11, 24, 64]

const WUXING = [
  { tag: '木', gua: 3, color: 'wood', label: '木属', desc: '生发向上' },
  { tag: '火', gua: 30, color: 'fire', label: '火属', desc: '炎上光明' },
  { tag: '土', gua: 2, color: 'earth', label: '土属', desc: '厚德载物' },
  { tag: '金', gua: 1, color: 'metal', label: '金属', desc: '刚毅决断' },
  { tag: '水', gua: 5, color: 'water', label: '水属', desc: '润下流通' },
] as const

const WUXING_ICON = { wood: Wood, fire: Fire, earth: Earth, metal: Metal, water: Water } as const
const WUXING_TEXT = {
  wood: 'text-bagua-wood',
  fire: 'text-bagua-fire',
  earth: 'text-bagua-earth',
  metal: 'text-bagua-metal',
  water: 'text-bagua-water',
} as const

export default function HomePage() {
  return (
    <SiteShell>
      <main>
        {/* ========== Hero ========== */}
        <section className="paper-hero relative mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16">
          <PaperParticles />
          <div className="hero-orbit" aria-hidden="true" />
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_2fr_1fr] lg:gap-10">
            <Reveal direction="left">
              <aside className="archive-index pl-4 md:pl-5">
                <p className="font-display text-[10px] tracking-[0.34em] text-bagua-primary">ARCHIVE / 01</p>
                <p className="archive-index__title mt-4 font-display text-xs tracking-[0.2em] text-bagua-text">先天方位索引</p>
                <div className="archive-index__list mt-5 space-y-3 font-body text-xs leading-relaxed text-bagua-muted">
                  {/* 先天八卦序数(伏羲八卦次序):乾一、兑二、离三、震四、巽五、坎六、艮七、坤八 */}
                  <div className="flex items-center justify-between border-b border-bagua-fiber pb-2"><span>乾 · 南</span><span className="font-display text-[10px]">一</span></div>
                  <div className="flex items-center justify-between border-b border-bagua-fiber pb-2"><span>坤 · 北</span><span className="font-display text-[10px]">八</span></div>
                  <div className="flex items-center justify-between border-b border-bagua-fiber pb-2"><span>离 · 东</span><span className="font-display text-[10px]">三</span></div>
                  <div className="flex items-center justify-between"><span>坎 · 西</span><span className="font-display text-[10px]">六</span></div>
                </div>
                <div className="archive-index__status mt-8 border-t border-bagua-fiber pt-4">
                  <p className="font-display text-[10px] tracking-[0.2em] text-bagua-muted">记录状态</p>
                  <p className="mt-2 flex items-center gap-2 font-display text-xs text-bagua-text"><span className="status-dot" />可开始起卦</p>
                </div>
              </aside>
            </Reveal>

            <div className="hero-copy relative z-10">
              <Reveal direction="up">
                <p className="section-kicker">周易 · 草纸刻本 · 现代读法</p>
                <h1 className="mt-5 font-display text-7xl leading-[0.86] tracking-[0.08em] text-bagua-text md:text-[9rem]">八卦</h1>
                <div className="paper-rule-fade mt-6 max-w-sm" />
                <p className="prose-body mt-6 max-w-lg text-pretty text-bagua-muted">
                  让一个问题，进入天地之间。三钱成爻，以六爻记录此刻，再以卦辞读出变化的方向。
                </p>
              </Reveal>
              <Reveal delay={220} direction="up">
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/divine" className="btn-primary glow-pulse"><Wand className="h-4 w-4" />开始起卦<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></Link>
                  <span className="font-display text-[10px] tracking-[0.18em] text-bagua-muted">约 2 分钟 · 无需注册</span>
                </div>
              </Reveal>
              <Reveal delay={360} direction="up">
                <div className="mt-10 grid max-w-lg grid-cols-3 border-y border-bagua-fiber py-4">
                  {([['问事','把问题说清'],['投爻','记录当下'],['读象','看见变化']] as const).map(([title, desc], index) => (
                    <div key={title} className="ritual-step border-r border-bagua-fiber px-3 first:pl-0 last:border-r-0">
                      <span className="font-display text-[10px] tracking-[0.2em] text-bagua-primary">0{index + 1}</span>
                      <p className="mt-2 font-display text-sm tracking-wider text-bagua-text">{title}</p>
                      <p className="mt-1 font-body text-[10px] text-bagua-muted">{desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={180} direction="scale">
              <div className="instrument-stage">
                <div className="instrument-label"><span>先天 · 八方位</span><span>仪器读数 / 08</span></div>
                <PaperTilt className="paper-stage" intensity={4.5}>
                  <div className="paper-stack paper-depth p-3 md:p-4"><BaguaCompass priority /></div>
                </PaperTilt>
                <div className="instrument-foot"><span>乾南 / 坤北 / 离东 / 坎西</span><span className="font-display">BAGUA · 08</span></div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={520} direction="up">
            <div className="mt-12 grid gap-3 border-t border-bagua-fiber pt-4 md:grid-cols-[1fr_auto] md:items-center">
              <DailyOracle />
              <Link href="/hexagrams" className="draw-underline justify-self-start font-display text-xs tracking-[0.16em] text-bagua-primary md:justify-self-end">浏览六十四卦 →</Link>
            </div>
          </Reveal>
        </section>

        {/* ========== 入口卡片 ========== */}
        <section className="mx-auto max-w-6xl px-6 py-4 md:px-8">
          <MethodShortcutCards />
        </section>

        {/* ========== 五行索引 ========== */}
        <section className="mx-auto max-w-6xl px-6 py-10 md:px-8">
          <Reveal>
            <SectionHeader
              index="01"
              title="五行索引"
              desc="万物皆五行所生，卦亦不离。点击进入其代表卦。"
              link={{ href: '/hexagrams', label: '全部 64 卦' }}
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {WUXING.map(({ tag, gua: id, color, label, desc }, i) => {
              const gua = getGuaById(id)
              const Icon = WUXING_ICON[color as keyof typeof WUXING_ICON]
              const txt = WUXING_TEXT[color as keyof typeof WUXING_TEXT]
              if (!gua) return null
              return (
                <Reveal key={tag} delay={i * 80} direction="up">
                  <Link
                    href={`/hexagrams/${id}`}
                    className="paper-panel lift group flex h-full flex-col items-center gap-2 p-5"
                  >
                    <Icon className={`h-7 w-7 ${txt} transition group-hover:scale-110`} strokeWidth={1.5} />
                    <div className="font-display text-2xl tracking-widest text-bagua-text">
                      {tag}
                    </div>
                    <div className="my-1">
                      <HexagramSymbol gua={gua} size="sm" />
                    </div>
                    <div className="font-display text-sm tracking-widest">
                      {gua.name}
                    </div>
                    <p className="text-balance text-center font-body text-[10px] text-bagua-muted">
                      {label} · {desc}
                    </p>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* ========== 先天八卦方位 ========== */}
        <section className="mx-auto max-w-6xl px-6 py-10 md:px-8">
          <Reveal>
            <SectionHeader
              index="02"
              title="先天八卦方位"
              desc="伏羲所作。乾南坤北、离东坎西，八方位以应天地之理。"
              link={{ href: '/learn', label: '学习更多' }}
            />
          </Reveal>
          <Reveal delay={200} direction="scale">
            <PaperTilt className="paper-stack paper-stage">
              <div className="paper-panel paper-depth flex justify-center px-6 py-12 md:px-12 md:py-16">
                <BaguaCompass />
              </div>
            </PaperTilt>
          </Reveal>
        </section>

        {/* ========== 精选卦象 ========== */}
        <section className="mx-auto max-w-6xl px-6 py-10 pb-20 md:px-8">
          <Reveal>
            <SectionHeader
              index="03"
              title="精选卦象"
              desc="64 卦中的几个关键节点：始、终、泰、复、未济。"
              link={{ href: '/hexagrams', label: '查看全部' }}
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {FEATURED.map((id, i) => {
              const gua = getGuaById(id)
              if (!gua) return null
              return (
                <Reveal key={id} delay={i * 100} direction="up">
                  <Link
                    href={`/hexagrams/${id}`}
                    className="paper-panel lift group flex h-full flex-col items-center gap-2 p-5"
                  >
                    <div className="flex w-full items-center justify-between font-display text-[10px] tracking-widest text-bagua-muted">
                      <span>#{id.toString().padStart(2, '0')}</span>
                      {i === 0 && (
                        <Star className="h-3 w-3 fill-bagua-primary text-bagua-primary" />
                      )}
                    </div>
                    <div className="my-2 transition group-hover:scale-110">
                      <HexagramSymbol gua={gua} size="md" />
                    </div>
                    <span className="font-display text-base tracking-widest group-hover:text-bagua-primary">
                      {gua.name}
                    </span>
                    <p className="text-balance text-center font-body text-[11px] leading-relaxed text-bagua-muted">
                      {gua.guaci}
                    </p>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
