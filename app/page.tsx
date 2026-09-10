import Image from 'next/image'
import Link from 'next/link'

import { BaguaCompass } from '@/components/home/BaguaCompass'
import { BaguaInteractiveExplorer } from '@/components/home/BaguaInteractiveExplorer'
import { DailyOracle } from '@/components/hexagram/DailyOracle'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { MethodShortcutCards } from '@/components/home/MethodShortcutCards'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/home/SectionHeader'
import { Wand } from '@/components/icons'
import { PaperTilt } from '@/components/shared/PaperTilt'
import { PaperParticles } from '@/components/shared/PaperParticles'
import { getGuaById } from '@/lib/iching'

const FEATURED = [
  { id: 1, phase: '元始', seal: '健', note: '纯阳自强' },
  { id: 2, phase: '厚载', seal: '顺', note: '含弘光大' },
  { id: 11, phase: '通泰', seal: '通', note: '小往大来' },
  { id: 24, phase: '复萌', seal: '生', note: '见天地心' },
  { id: 64, phase: '未穷', seal: '转', note: '生生不息' },
] as const

const RITUAL_STEPS = [
  { step: '01', title: '问事', desc: '把问题说清', icon: '/icons/ritual-ask.webp', shape: 'square' },
  { step: '02', title: '投爻', desc: '记录当下', icon: '/icons/ritual-cast-new.webp', shape: 'round' },
  { step: '03', title: '读象', desc: '看见变化', icon: '/icons/ritual-read-new.webp', shape: 'square' },
] as const

const WUXING = [
  { tag: '木', gua: 3, color: 'wood', image: '/icons/wuxing-wood.webp', badge: '/icons/wuxing-badge-wood.webp', label: '木属', desc: '生发向上', border: 'border-emerald-800/40 hover:border-emerald-700', bg: 'hover:bg-emerald-950/[0.04]', glow: 'group-hover:shadow-[0_0_14px_rgba(40,110,60,0.15)]' },
  { tag: '火', gua: 30, color: 'fire', image: '/icons/wuxing-fire.webp', badge: '/icons/wuxing-badge-fire.webp', label: '火属', desc: '炎上光明', border: 'border-rose-800/40 hover:border-rose-700', bg: 'hover:bg-rose-950/[0.04]', glow: 'group-hover:shadow-[0_0_14px_rgba(178,58,42,0.18)]' },
  { tag: '土', gua: 2, color: 'earth', image: '/icons/wuxing-earth.webp', badge: '/icons/wuxing-badge-earth.webp', label: '土属', desc: '厚德载物', border: 'border-amber-800/40 hover:border-amber-700', bg: 'hover:bg-amber-950/[0.04]', glow: 'group-hover:shadow-[0_0_14px_rgba(180,120,40,0.16)]' },
  { tag: '金', gua: 1, color: 'metal', image: '/icons/wuxing-metal.webp', badge: '/icons/wuxing-badge-metal.webp', label: '金属', desc: '刚毅决断', border: 'border-yellow-700/50 hover:border-yellow-600', bg: 'hover:bg-yellow-950/[0.04]', glow: 'group-hover:shadow-[0_0_14px_rgba(200,160,50,0.18)]' },
  { tag: '水', gua: 5, color: 'water', image: '/icons/wuxing-water.webp', badge: '/icons/wuxing-badge-water.webp', label: '水属', desc: '润下流通', border: 'border-sky-800/40 hover:border-sky-700', bg: 'hover:bg-sky-950/[0.04]', glow: 'group-hover:shadow-[0_0_14px_rgba(40,90,140,0.16)]' },
] as const

export default function HomePage() {
  return (
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
                <div className="mt-10 grid max-w-lg grid-cols-3 border-y border-bagua-fiber py-3.5">
                  {RITUAL_STEPS.map(({ step, title, desc, icon, shape }) => (
                    <div key={title} className="ritual-step flex items-center gap-3 border-r border-bagua-fiber px-3 first:pl-0 last:border-r-0">
                      <div className={`${shape === 'round' ? 'relic-frame-round p-0' : 'relic-frame-square p-1'} h-12 w-12 md:h-14 md:w-14 flex-shrink-0 shadow-2xs transition group-hover:scale-105`}>
                        <Image src={icon} alt="" width={80} height={80} className="antique-blend h-full w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-display text-[10px] tracking-[0.2em] text-bagua-primary">{step}</span>
                        <p className="font-display text-sm tracking-wider text-bagua-text">{title}</p>
                        <p className="font-body text-[10px] text-bagua-muted truncate">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={180} direction="scale">
              <div className="instrument-stage">
                <div className="instrument-label"><span>先天 · 八方位</span><span>仪器读数 / 08</span></div>
                <PaperTilt className="paper-stage" intensity={4.5}>
                  <div className="paper-stack paper-depth relative p-3 md:p-4 overflow-visible">
                    <div className="relative z-10 drop-shadow-md">
                      <BaguaCompass priority />
                    </div>
                  </div>
                </PaperTilt>
                <div className="instrument-foot"><span>乾南 / 坤北 / 离东 / 坎西</span><span className="font-display">BAGUA · 08</span></div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={520} direction="up">
            <div className="mt-12 border-t border-bagua-fiber pt-6">
              <DailyOracle />
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
            {WUXING.map(({ tag, gua: id, image, badge, label, desc, border, bg, glow }, i) => {
              const gua = getGuaById(id)
              if (!gua) return null
              return (
                <Reveal key={tag} delay={i * 80} direction="up">
                  <Link
                    href={`/hexagrams/${id}`}
                    className={`paper-panel lift group relative flex h-full flex-col items-center gap-2 overflow-hidden border-2 p-3.5 transition-all duration-300 md:p-4.5 ${border} ${bg} ${glow}`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-display text-[10px] tracking-widest text-bagua-muted">
                        五行 · {tag}
                      </span>
                      <div className="relic-frame-round h-6 w-6 sm:h-6.5 sm:w-6.5 flex-shrink-0 p-0 shadow-2xs transition duration-300 group-hover:scale-110">
                        <Image
                          src={badge}
                          alt={`五行${tag}`}
                          width={48}
                          height={48}
                          className="antique-blend h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* 五行专属高清艺术圆徽 */}
                    <div className="relic-frame-round my-2 h-18 w-18 sm:h-20 sm:w-20 flex-shrink-0 p-0 shadow-2xs transition duration-300 group-hover:scale-105">
                      <Image
                        src={image}
                        alt={`五行${tag}`}
                        width={128}
                        height={128}
                        className="antique-blend h-full w-full object-cover"
                      />
                    </div>

                    <div className="my-0.5 border border-bagua-fiber/60 bg-bagua-canvas p-1 shadow-2xs transition group-hover:border-bagua-text">
                      <HexagramSymbol gua={gua} size="sm" />
                    </div>
                    <div className="font-display text-sm tracking-widest text-bagua-text group-hover:text-bagua-primary">
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
              desc="伏羲所作：乾南坤北、离东坎西，以八方位应天地之理。"
              link={{ href: '/learn', label: '学习更多' }}
            />
          </Reveal>
          <Reveal delay={200} direction="up">
            <div className="mt-4">
              <BaguaInteractiveExplorer />
            </div>
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
            {FEATURED.map(({ id, phase, seal, note }, i) => {
              const gua = getGuaById(id)
              if (!gua) return null
              return (
                <Reveal key={id} delay={i * 100} direction="up">
                  <Link
                    href={`/hexagrams/${id}`}
                    className="paper-panel lift group relative flex h-full flex-col items-center gap-2 overflow-hidden border-2 border-bagua-text bg-bagua-surface p-5 shadow-soft transition-all hover:border-bagua-primary"
                  >
                    <div className="flex w-full items-center justify-between font-display text-[10px] tracking-widest text-bagua-muted">
                      <span>#{id.toString().padStart(2, '0')}</span>
                      <span className="border border-bagua-fiber bg-bagua-wash px-1.5 py-0.5 text-[9px] text-bagua-primary">
                        {phase}
                      </span>
                    </div>
                    <div className="my-2 border border-bagua-fiber/40 bg-bagua-canvas p-2 shadow-xs transition group-hover:scale-105 group-hover:border-bagua-text">
                      <HexagramSymbol gua={gua} size="md" />
                    </div>
                    <span className="font-display text-base tracking-widest text-bagua-text transition group-hover:text-bagua-primary">
                      {gua.name}
                    </span>
                    <span className="font-display text-[10px] tracking-wider text-bagua-primary/90">
                      {note}
                    </span>
                    <p className="text-balance text-center font-body text-[11px] leading-relaxed text-bagua-muted">
                      {gua.guaci}
                    </p>
                    <span className="absolute bottom-1 right-2 select-none font-display text-2xl font-bold text-bagua-fiber/25 transition group-hover:text-bagua-primary/20">
                      {seal}
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </section>
      </main>
  )
}
