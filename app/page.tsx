'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

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
  X,
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
  const [activeMethod, setActiveMethod] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const activeShortcut = activeMethod === null ? null : METHOD_SHORTCUTS[activeMethod]

  useEffect(() => {
    if (activeMethod === null) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMethod(null)
    }

    document.addEventListener('keydown', closeOnEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [activeMethod])

  return (
    <SiteShell>
      <main>
        {/* ========== Hero ========== */}
        <section className="paper-hero relative mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16">
          <PaperParticles />
          <div className="hero-orbit" aria-hidden="true" />
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_2fr_1fr] lg:gap-10">
            <Reveal direction="left">
              <aside className="archive-index border-l-2 border-bagua-primary/60 pl-4 md:pl-5">
                <p className="font-display text-[10px] tracking-[0.34em] text-bagua-primary">ARCHIVE / 01</p>
                <p className="archive-index__title mt-4 font-display text-xs tracking-[0.2em] text-bagua-text">先天方位索引</p>
                <div className="archive-index__list mt-5 space-y-3 font-body text-xs leading-relaxed text-bagua-muted">
                  <div className="flex items-center justify-between border-b border-bagua-fiber pb-2"><span>乾 · 南</span><span className="font-display text-[10px]">01 / 08</span></div>
                  <div className="flex items-center justify-between border-b border-bagua-fiber pb-2"><span>坤 · 北</span><span className="font-display text-[10px]">02 / 08</span></div>
                  <div className="flex items-center justify-between border-b border-bagua-fiber pb-2"><span>离 · 东</span><span className="font-display text-[10px]">03 / 08</span></div>
                  <div className="flex items-center justify-between"><span>坎 · 西</span><span className="font-display text-[10px]">04 / 08</span></div>
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
                  <Link href="/divine" className="btn-primary glow-pulse"><Wand className="h-4 w-4" />开始起卦<ArrowRight className="h-4 w-4" /></Link>
                  <span className="font-display text-[10px] tracking-[0.18em] text-bagua-muted">约 2 分钟 · 无需注册</span>
                </div>
              </Reveal>
              <Reveal delay={360} direction="up">
                <div className="mt-10 grid max-w-lg grid-cols-3 border-y border-bagua-fiber py-4">
                  {[['问事','把问题说清'],['投爻','记录当下'],['读象','看见变化']].map(([title, desc], index) => (
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
                  <div className="paper-stack paper-depth p-3 md:p-4"><BaguaCompass /></div>
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
          <Reveal>
            <div className="grid gap-3 md:grid-cols-3">
              {METHOD_SHORTCUTS.map((m, i) => {
                const Icon = m.Icon
                return (
                  <Reveal key={m.href} delay={i * 100} direction="up">
                    <button
                      type="button"
                      onClick={() => setActiveMethod(i)}
                      className="ritual-card paper-panel group flex w-full items-center gap-4 p-5 text-left"
                      aria-haspopup="dialog"
                      aria-label={`查看${m.title}详情`}
                    >
                      <span className="ritual-card__seal flex h-12 w-12 flex-shrink-0 items-center justify-center text-bagua-primary">
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
                      <span className="ritual-card__open font-display text-[10px] tracking-[0.16em] text-bagua-muted">阅览</span>
                    </button>
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
      {activeShortcut ? (
        <MethodInspector
          method={activeShortcut}
          closeButtonRef={closeButtonRef}
          onClose={() => setActiveMethod(null)}
        />
      ) : null}
    </SiteShell>
  )
}

function MethodInspector({
  method,
  closeButtonRef,
  onClose,
}: {
  method: (typeof METHOD_SHORTCUTS)[number]
  closeButtonRef: RefObject<HTMLButtonElement>
  onClose: () => void
}) {
  const Icon = method.Icon
  const details = method.href === '/divine'
    ? ['三枚铜钱，六次投掷', '自动记录阴阳与动爻', '生成本卦、变卦与纳甲排盘']
    : method.href === '/learn'
      ? ['先天方位与八卦象义', '从卦辞进入读卦方法', '按主题建立学习路径']
      : ['六十四卦完整索引', '卦辞、彖传与象传对照', '按五行与上下卦浏览']

  return (
    <div className="ritual-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="ritual-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ritual-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ritual-dialog__orbit" aria-hidden="true" />
        <button ref={closeButtonRef} type="button" className="ritual-dialog__close" onClick={onClose} aria-label="关闭详情">
          <X className="h-4 w-4" />
        </button>
        <div className="ritual-dialog__header">
          <span className="ritual-dialog__seal"><Icon className="h-8 w-8" /></span>
          <div>
            <p className="section-kicker">仪式索引 / 0{METHOD_SHORTCUTS.indexOf(method) + 1}</p>
            <h2 id="ritual-dialog-title" className="mt-2 font-display text-2xl tracking-[0.16em] text-bagua-text">{method.title}</h2>
          </div>
        </div>
        <div className="ritual-dialog__rule" />
        <p className="prose-body mt-5 text-bagua-muted">{method.desc}。把此刻的问题整理成可读的线索，再进入相应的工具或篇章。</p>
        <ol className="ritual-dialog__steps">
          {details.map((detail, index) => <li key={detail}><span>0{index + 1}</span>{detail}</li>)}
        </ol>
        <div className="mt-7 flex items-center justify-between gap-4 border-t border-bagua-fiber pt-4">
          <span className="font-display text-[10px] tracking-[0.14em] text-bagua-muted">BAGUA / ARCHIVE</span>
          <Link href={method.href} className="btn-primary" onClick={onClose}>进入{method.title}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
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
