import Link from 'next/link'

import { DailyOracle } from '@/components/hexagram/DailyOracle'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { ArrowRight, Sparkles, Leaf, Hand, Coins } from '@/components/icons'
import { SiteShell } from '@/components/shared/SiteShell'
import { getAllHexagrams, getGuaById } from '@/lib/iching'

const FEATURED = [1, 2, 11, 24, 64] // 乾、坤、泰、复、未济

const TRIGRAMS = [
  { name: '乾', symbol: '☰', desc: '天' },
  { name: '坤', symbol: '☷', desc: '地' },
  { name: '震', symbol: '☳', desc: '雷' },
  { name: '巽', symbol: '☴', desc: '风' },
  { name: '坎', symbol: '☵', desc: '水' },
  { name: '离', symbol: '☲', desc: '火' },
  { name: '艮', symbol: '☶', desc: '山' },
  { name: '兑', symbol: '☱', desc: '泽' },
] as const

const WUXING = [
  { tag: '金', gua: 1 },
  { tag: '木', gua: 3 },
  { tag: '水', gua: 5 },
  { tag: '火', gua: 30 },
  { tag: '土', gua: 2 },
] as const

const METHOD_SHORTCUTS = [
  { href: '/divine', icon: Coins, title: '快速起卦', desc: '三钱六掷 · 10 秒', recommended: true },
  { href: '/learn', icon: Leaf, title: '易学入门', desc: '八卦 · 卦辞 · 读法', recommended: false },
  { href: '/hexagrams', icon: Hand, title: '六十四卦', desc: '逐卦细读', recommended: false },
] as const

export default function HomePage() {
  const qian = getGuaById(1)
  const all = getAllHexagrams()

  return (
    <SiteShell>
      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 md:min-h-[calc(100svh-4.5rem)] md:grid-cols-[minmax(0,1fr)_auto] md:px-6 md:py-0">
          <div className="enter-up max-w-xl">
            <p className="section-kicker">周易 · 草纸刻本</p>
            <h1 className="mt-5 font-display text-5xl leading-none tracking-[0.06em] text-bagua-text md:text-7xl">
              八卦
            </h1>
            <div className="paper-rule-fade mt-6 max-w-sm" />
            <p className="prose-body mt-5 text-pretty text-bagua-muted">
              三钱成爻，梅花取数。动爻多少，决定读卦辞还是爻辞。
              这是一个面向初学者与读卦者的现代工具——保留古意，不拘仪式。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/divine" className="btn-primary">
                起卦问事
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/hexagrams" className="btn-secondary">
                六十四卦
              </Link>
              <Link href="/learn" className="btn-secondary">
                易学入门
              </Link>
            </div>
            <div className="mt-10">
              <DailyOracle />
            </div>
          </div>

          <div className="enter-up stagger-2 justify-self-center">
            <div className="hero-glyph pixel-frame bg-bagua-surface p-8 md:p-12">
              <div className="hero-glyph-mark">
                {qian ? <HexagramSymbol gua={qian} size="lg" /> : null}
                <p className="mt-6 text-center font-display text-sm tracking-[0.2em]">乾为天</p>
              </div>
            </div>
          </div>
        </section>

        {/* 快捷入口 */}
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="enter-up grid gap-3 md:grid-cols-3">
            {METHOD_SHORTCUTS.map((m, i) => {
              const Icon = m.icon
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="paper-panel enter-up group flex items-center gap-4 p-5 hover:border-bagua-text"
                >
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-4 border-bagua-text bg-bagua-wash text-bagua-text">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base tracking-wider">{m.title}</span>
                      {m.recommended && (
                        <span className="border-2 border-bagua-text bg-bagua-primary px-1.5 py-0.5 font-display text-[9px] tracking-widest text-bagua-surface">
                          推荐
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-body text-xs text-bagua-muted">{m.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-bagua-muted transition group-hover:translate-x-1 group-hover:text-bagua-primary" />
                </Link>
              )
            })}
          </div>
        </section>

        {/* 五行快速跳转 */}
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="enter-up mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl tracking-wider">五行索引</h2>
            <Link href="/hexagrams" className="font-display text-xs tracking-widest text-bagua-primary hover:underline">
              全部 64 卦 →
            </Link>
          </div>
          <div className="enter-up grid grid-cols-5 gap-2 sm:gap-3">
            {WUXING.map(({ tag, gua: id }, i) => {
              const gua = getGuaById(id)
              if (!gua) return null
              return (
                <Link
                  key={tag}
                  href={`/hexagrams/${id}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="paper-panel--quiet btn-press enter-up flex flex-col items-center gap-1 border-4 border-bagua-fiber bg-bagua-surface p-3 hover:border-bagua-text hover:bg-bagua-wash"
                >
                  <span className="font-display text-xl text-bagua-primary">{tag}</span>
                  <HexagramSymbol gua={gua} size="sm" />
                  <span className="mt-1 font-display text-[11px] tracking-widest">{gua.name}</span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 八卦方位 */}
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="enter-up mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl tracking-wider">八卦方位</h2>
            <Link href="/learn" className="font-display text-xs tracking-widest text-bagua-primary hover:underline">
              学习更多 →
            </Link>
          </div>
          <div className="enter-up grid grid-cols-4 gap-3 sm:grid-cols-8">
            {TRIGRAMS.map((t, i) => {
              const gua = getGuaById(i + 1)
              return (
                <Link
                  key={t.name}
                  href={`/hexagrams/${i + 1}`}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="btn-press enter-up flex flex-col items-center gap-1 border-4 border-bagua-fiber bg-bagua-surface p-3 hover:border-bagua-text hover:bg-bagua-wash"
                >
                  <span className="font-display text-3xl leading-none text-bagua-text">{t.symbol}</span>
                  <span className="font-display text-sm tracking-widest">{t.name}</span>
                  <span className="font-body text-[10px] text-bagua-muted">{t.desc}</span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 精选卦象 */}
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pb-16">
          <div className="enter-up mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl tracking-wider">精选卦象</h2>
            <Link href="/hexagrams" className="font-display text-xs tracking-widest text-bagua-primary hover:underline">
              查看全部 →
            </Link>
          </div>
          <div className="enter-up grid grid-cols-2 gap-3 md:grid-cols-5">
            {FEATURED.map((id, i) => {
              const gua = getGuaById(id)
              if (!gua) return null
              return (
                <Link
                  key={id}
                  href={`/hexagrams/${id}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="paper-panel enter-up group flex flex-col items-center gap-2 p-4 hover:bg-bagua-wash"
                >
                  <span className="font-display text-[10px] tracking-widest text-bagua-muted">
                    #{id.toString().padStart(2, '0')}
                  </span>
                  <HexagramSymbol gua={gua} size="md" />
                  <span className="font-display text-sm tracking-widest group-hover:text-bagua-primary">
                    {gua.name}
                  </span>
                  <span className="text-balance text-center font-body text-[11px] text-bagua-muted">
                    {gua.guaci.slice(0, 18)}…
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
