import Link from 'next/link'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getGuaById } from '@/lib/iching'
import { ParticleField } from '@/components/visual/ParticleField'
import { Logo, ArrowRight, Sparkles, Orbit, Wand, Pulse } from '@/components/icons'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-950">
      {/* 装饰背景：深度粒子场与轨道线 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ParticleField />
        <div className="hero-orbit absolute right-[-12rem] top-24 h-[34rem] w-[34rem] rounded-full border border-gold-400/10" />
        <div className="hero-orbit hero-orbit-delayed absolute right-[-6rem] top-48 h-[22rem] w-[22rem] rounded-full border border-jade-300/10" />
        {/* 装饰八卦符号 */}
        <div className="absolute right-12 top-1/3 font-display text-[280px] leading-none text-gold-500/[0.04]">☰</div>
        <div className="absolute bottom-32 left-12 font-display text-[200px] leading-none text-gold-500/[0.04]">☵</div>
      </div>

      {/* 顶部导航 */}
      <header className="relative z-10 border-b border-ink-800/60 bg-ink-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-8 py-5">
          <Link href="/" className="group flex items-center gap-3">
            <Logo className="h-9 w-9 text-gold-400 transition group-hover:rotate-180" />
            <div className="flex flex-col">
              <span className="font-display text-base font-semibold text-ink-50">bagua</span>
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gold-400/80">I Ching · 易经</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/hexagrams" className="rounded-button px-3 py-1.5 font-body text-sm text-ink-300 transition hover:bg-ink-800/50 hover:text-ink-50">
              卦象库
            </Link>
            <Link href="/divine" className="rounded-button px-3 py-1.5 font-body text-sm text-ink-300 transition hover:bg-ink-800/50 hover:text-ink-50">
              起卦
            </Link>
            <Link href="/history" className="rounded-button px-3 py-1.5 font-body text-sm text-ink-300 transition hover:bg-ink-800/50 hover:text-ink-50">
              历史
            </Link>
            <Link href="/settings" className="rounded-button px-3 py-1.5 font-body text-sm text-ink-300 transition hover:bg-ink-800/50 hover:text-ink-50">
              设置
            </Link>
          </nav>
          <Link
            href="https://github.com/zxygeitio/bagua"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            GitHub
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-8 pt-24 pb-32 md:pt-32 md:pb-40">
        <div className="mx-auto max-w-4xl">
          {/* 徽章 */}
          <div className="animate-fade-down">
            <div className="inline-flex items-center gap-2 rounded-pill border border-gold-500/30 bg-gold-500/5 px-3.5 py-1.5 font-body text-xs text-gold-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
              周易 · 群经之首 · 文化之源
            </div>
          </div>

          {/* 主标题 */}
          <h1 className="mt-8 animate-fade-up stagger-1 font-display text-6xl font-medium leading-[1.1] text-balance text-ink-50 md:text-7xl lg:text-[88px]">
            观象玩辞
            <span className="mt-2 block">
              <span className="metallic-gold">洞见</span>
              <span className="text-ink-200">天机</span>
            </span>
          </h1>

          {/* 副标题 */}
          <p className="mt-8 max-w-2xl animate-fade-up stagger-2 font-body text-base leading-relaxed text-pretty text-ink-300 md:text-lg">
            以铜钱蓍草之方，循文王周公之义。
            <br className="hidden md:block" />
            六十四卦三百八十四爻，悉载于此；人生百事六合八方，皆可问焉。
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-start gap-3 animate-fade-up stagger-3 sm:flex-row sm:items-center">
            <Link
              href="/divine"
              className="btn-primary group inline-flex items-center gap-2 font-display text-base"
            >
              <Sparkles className="h-4 w-4" />
              起卦问事
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/hexagrams"
              className="btn-secondary inline-flex items-center gap-2 font-body text-sm"
            >
              检阅六十四卦
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 信任标识 */}
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 animate-fade-up stagger-4 font-mono text-[11px] uppercase tracking-widest text-ink-400">
            <span>数据源：维基文库通行本 · 中华书局</span>
            <span className="hidden md:inline">·</span>
            <span>三种起卦法：硬币 / 蓍草 / 手动</span>
            <span className="hidden md:inline">·</span>
            <span>云端同步已就绪</span>
          </div>
        </div>

        {/* 主卦象预览 */}
        <div className="relative mt-20 animate-fade-up stagger-5">
          <div className="grid gap-4 md:grid-cols-3">
            <FeaturedHexagram
              id={1}
              name="乾为天"
              subtitle="刚健中正"
              detail="天行健，君子以自强不息"
              hue="gold"
            />
            <FeaturedHexagram
              id={2}
              name="坤为地"
              subtitle="柔顺包容"
              detail="地势坤，君子以厚德载物"
              hue="vermilion"
              offset
            />
            <FeaturedHexagram
              id={3}
              name="水雷屯"
              subtitle="起始艰难"
              detail="云雷屯，君子以经纶"
              hue="jade"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 border-t border-ink-800/40 bg-ink-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-8 py-24">
          <div className="mb-16 max-w-2xl">
            <h2 className="font-display text-3xl font-medium text-ink-50 md:text-4xl">
              以严谨之心，还经典之貌
            </h2>
            <p className="mt-4 font-body text-ink-300">
              每字每句，皆有所本；每个爻辞，都经过四源比对与异文校对。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Orbit className="h-5 w-5" />}
              title="六十四卦 · 三百八十四爻"
              description="完整收录通行本卦辞、彖传、象传、爻辞、小象传；乾坤附《文言》。"
              hue="gold"
            />
            <FeatureCard
              icon={<Wand className="h-5 w-5" />}
              title="三种起卦法"
              description="硬币法应日常，蓍草法从古礼，手动选卦研学理。各得其所。"
              hue="jade"
            />
            <FeatureCard
              icon={<Pulse className="h-5 w-5" />}
              title="五种卦变关系"
              description="本卦、之卦、互卦、错卦、综卦，层层推演，由象达意。"
              hue="vermilion"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ink-800/40 py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-8 md:flex-row">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-6 text-gold-400" />
            <div className="font-body text-xs text-ink-400">
              <span className="text-ink-200">bagua · 易经占卜</span>
              <span className="mx-2">·</span>
              <span>© 2026</span>
            </div>
          </div>
          <p className="font-body text-xs text-ink-500">
            仅供文化学习与学术研究 · 非迷信引导
          </p>
        </div>
      </footer>
    </main>
  )
}

function FeaturedHexagram({ id, name, subtitle, detail, hue, offset = false }: {
  id: number
  name: string
  subtitle: string
  detail: string
  hue: 'gold' | 'vermilion' | 'jade'
  offset?: boolean
}) {
  const gua = getGuaById(id)
  const colorMap = {
    gold: { bg: 'bg-gold-500/10', text: 'text-gold-300', line: 'fill-gold-300', hover: 'group-hover:text-gold-300' },
    vermilion: { bg: 'bg-vermilion-500/10', text: 'text-vermilion-300', line: 'fill-vermilion-300', hover: 'group-hover:text-vermilion-300' },
    jade: { bg: 'bg-jade-500/10', text: 'text-jade-300', line: 'fill-jade-300', hover: 'group-hover:text-jade-300' },
  } as const
  const colors = colorMap[hue]
  return (
    <Link
      href={`/hexagrams/${id}`}
      className={`group glass-card card-hover relative overflow-hidden p-6 ${offset ? 'md:mt-8' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-xs text-ink-500">#{id.toString().padStart(2, '0')} / 64</div>
          <h3 className="mt-2 font-calligraphy text-2xl text-ink-50">{name}</h3>
          <p className="mt-1 font-body text-xs text-ink-400">{subtitle}</p>
        </div>
        <div className={`feature-glyph flex h-20 w-20 items-center justify-center rounded-full ${colors.bg} ring-1 ring-white/5`}>
          {gua ? <HexagramSymbol gua={gua} size="sm" yangClassName={colors.line} yinClassName="fill-ink-500" /> : null}
        </div>
      </div>
      <p className="mt-6 font-body text-sm leading-relaxed text-ink-300">{detail}</p>
      <div className={`mt-6 flex items-center gap-1.5 font-body text-xs text-ink-400 transition ${colors.hover}`}>
        查看详情
        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function FeatureCard({ icon, title, description, hue }: {
  icon: React.ReactNode
  title: string
  description: string
  hue: 'gold' | 'jade' | 'vermilion'
}) {
  const colorMap = {
    gold: { bg: 'bg-gold-500/10', text: 'text-gold-400', border: 'border-gold-500/20' },
    jade: { bg: 'bg-jade-500/10', text: 'text-jade-300', border: 'border-jade-500/20' },
    vermilion: { bg: 'bg-vermilion-500/10', text: 'text-vermilion-300', border: 'border-vermilion-500/20' },
  }
  const c = colorMap[hue]
  return (
    <div className="card-base card-hover p-8">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text} border ${c.border}`}>
        {icon}
      </div>
      <h3 className="mt-6 font-display text-lg font-medium text-ink-50">{title}</h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-ink-400">{description}</p>
    </div>
  )
}
