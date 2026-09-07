import Link from 'next/link'

import { BaguaCompass } from '@/components/home/BaguaCompass'
import { DailyOracle } from '@/components/hexagram/DailyOracle'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { Reveal } from '@/components/Reveal'
import {
  ArrowRight,
  Coins,
  Earth,
  Fire,
  Hand,
  Heart,
  Leaf,
  Metal,
  Sparkles,
  Star,
  Taiji,
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

const METHOD_SHORTCUTS = [
  { href: '/divine', Icon: Coins, title: '快速起卦', desc: '三钱六掷 · 10 秒', recommended: true },
  { href: '/learn', Icon: Leaf, title: '易学入门', desc: '八卦 · 卦辞 · 读法', recommended: false },
  { href: '/hexagrams', Icon: Hand, title: '六十四卦', desc: '逐卦细读', recommended: false },
] as const

const SCENARIO_CARDS = [
  { tag: '事业', Icon: Hand, hint: '项目 / 求职 / 决策' },
  { tag: '感情', Icon: Heart, hint: '相处 / 抉择 / 复合' },
  { tag: '财运', Icon: Metal, hint: '投资 / 决策 / 风险' },
  { tag: '健康', Icon: Leaf, hint: '作息 / 调养 / 心态' },
  { tag: '学业', Icon: Sparkles, hint: '方向 / 节奏 / 考试' },
  { tag: '人际', Icon: Taiji, hint: '合作 / 化解 / 边界' },
] as const

export default function HomePage() {
  return (
    <SiteShell>
      <main>
        {/* ========== Hero ========== */}
        <section className="paper-hero relative mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-20">
          <PaperParticles />
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            {/* 左：标题 + CTA */}
            <div>
              <Reveal direction="left">
                <p className="section-kicker">周易 · 草纸刻本</p>
                <h1 className="mt-5 font-display text-7xl leading-none tracking-[0.06em] text-bagua-text md:text-[8rem]">
                  八卦
                </h1>
              </Reveal>
              <Reveal delay={150} direction="left">
                <div className="paper-rule-fade mt-5 max-w-xs" />
                <p className="prose-body mt-6 max-w-md text-pretty text-bagua-muted">
                  三钱成爻，梅花取数。动爻多少，决定读卦辞还是爻辞。
                  一个面向初学者与读卦者的现代工具——保留古意，不拘仪式。
                </p>
              </Reveal>

              <Reveal delay={300} direction="up">
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/divine" className="btn-primary glow-pulse">
                    <Wand className="h-4 w-4" />
                    起卦问事
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/hexagrams" className="btn-secondary draw-underline">
                    六十四卦
                  </Link>
                  <Link href="/learn" className="btn-secondary draw-underline">
                    易学入门
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={450} direction="up">
                <div className="mt-7">
                  <p className="mb-2 font-display text-[10px] tracking-[0.28em] text-bagua-muted">
                    或从问事起
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SCENARIO_CARDS.map((s) => {
                      const Icon = s.Icon
                      return (
                        <Link
                          key={s.tag}
                          href="/divine"
                          className="btn-press group flex items-center gap-2 border-2 border-bagua-fiber bg-bagua-surface px-3 py-1.5 hover:border-bagua-text hover:bg-bagua-wash"
                        >
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center border-2 border-bagua-text bg-bagua-canvas text-bagua-primary transition group-hover:bg-bagua-primary group-hover:text-bagua-surface">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="font-display text-sm tracking-widest text-bagua-text">
                            {s.tag}
                          </span>
                          <span className="hidden font-body text-[10px] text-bagua-muted md:inline">
                            {s.hint}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* 右：太极曼陀罗 */}
            <Reveal delay={200} direction="scale">
              <PaperTilt className="paper-stage hidden justify-self-center md:block" intensity={4.5}>
                <div className="paper-stack paper-depth p-4">
                  <BaguaCompass />
                </div>
              </PaperTilt>
            </Reveal>
          </div>

          {/* Daily Oracle — 全宽 */}
          <Reveal delay={600} direction="up">
            <div className="mt-12 max-w-2xl">
              <DailyOracle />
            </div>
          </Reveal>
        </section>

        {/* ========== 入口卡片 ========== */}
        <section className="mx-auto max-w-6xl px-6 py-4 md:px-8">
          <Reveal>
            <div className="grid gap-3 md:grid-cols-3">
              {METHOD_SHORTCUTS.map((m, i) => {
                const Icon = m.Icon
                return (
                  <Reveal key={m.href} delay={i * 100} direction="up">
                    <Link
                      href={m.href}
                      className="paper-panel lift group flex items-center gap-4 p-5"
                    >
                      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-4 border-bagua-text bg-bagua-wash text-bagua-primary transition group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-base tracking-wider">
                            {m.title}
                          </span>
                          {m.recommended && (
                            <span className="border-2 border-bagua-text bg-bagua-primary px-1.5 py-0.5 font-display text-[9px] tracking-widest text-bagua-surface">
                              推荐
                            </span>
                          )}
                        </div>
                        <p className="mt-1 font-body text-xs text-bagua-muted">
                          {m.desc}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-bagua-muted transition group-hover:translate-x-1 group-hover:text-bagua-primary" />
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </Reveal>
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

function SectionHeader({
  index,
  title,
  desc,
  link,
}: {
  index: string
  title: string
  desc: string
  link?: { href: string; label: string }
}) {
  return (
    <div className="enter-up mb-5 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="border-2 border-bagua-text bg-bagua-primary px-2 py-0.5 font-display text-[10px] tracking-widest text-bagua-surface">
            {index}
          </span>
          <h2 className="font-display text-2xl tracking-wider md:text-3xl">
            {title}
          </h2>
        </div>
        <p className="prose-body mt-2 text-bagua-muted">{desc}</p>
      </div>
      {link && (
        <Link
          href={link.href}
          className="font-display text-xs tracking-widest text-bagua-primary hover:underline flex-shrink-0"
        >
          {link.label} →
        </Link>
      )}
    </div>
  )
}
