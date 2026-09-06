import Link from 'next/link'
import { notFound } from 'next/navigation'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getGuaById } from '@/lib/iching'
import type { Gua } from '@/lib/iching'

import { ArrowLeft, Sparkles, BookOpen, Compass, Star } from 'lucide-react'

interface PageProps {
  params: { id: string }
}

export function generateStaticParams() {
  return Array.from({ length: 64 }, (_, i) => ({ id: String(i + 1) }))
}

const WUXING_COLOR: Record<string, string> = {
  金: 'from-amber-200/30 to-yellow-100/10',
  木: 'from-emerald-200/30 to-green-100/10',
  水: 'from-blue-200/30 to-cyan-100/10',
  火: 'from-rose-200/30 to-orange-100/10',
  土: 'from-yellow-200/30 to-stone-200/10',
}

const WUXING_HEX: Record<string, string> = {
  金: '#F59E0B',
  木: '#10B981',
  水: '#3B82F6',
  火: '#EF4444',
  土: '#A16207',
}

export default function HexagramDetailPage({ params }: PageProps) {
  const id = parseInt(params.id, 10)
  const gua = getGuaById(id)
  if (!gua) notFound()

  const dui = getGuaById(gua.duiGua)!
  const zong = getGuaById(gua.zongGua)!
  const hu = getGuaById(gua.huGua)!
  const bianId = gua.guaBian[0]
  const bian = bianId !== undefined ? getGuaById(bianId) : null

  const bgGradient = WUXING_COLOR[gua.wuxing] ?? 'from-bagua-primary/5 to-bagua-secondary/5'

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 五行背景光晕 */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-radial ${bgGradient} animate-fade-in`}
      />

      {/* 装饰：背景八卦符号 */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 opacity-[0.03]">
        <svg viewBox="0 0 200 200">
          <text x="50%" y="50%" textAnchor="middle" fontSize="180" fill="currentColor">
            {gua.symbol}
          </text>
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rotate-180 opacity-[0.03]">
        <svg viewBox="0 0 200 200">
          <text x="50%" y="50%" textAnchor="middle" fontSize="180" fill="currentColor">
            {gua.symbol}
          </text>
        </svg>
      </div>

      <div className="relative">
        {/* 顶部 */}
        <header className="glass-card sticky top-0 z-50 border-b border-bagua-border/30">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link
              href="/hexagrams"
              className="flex items-center gap-2 font-body text-sm text-bagua-muted transition hover:text-bagua-text"
            >
              <ArrowLeft className="h-4 w-4" />
              返回64卦
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-calligraphy text-base text-bagua-muted">
                #{gua.id.toString().padStart(2, '0')} / 64
              </span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            {/* 标题区 */}
            <div className="mb-12 text-center animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-pill border border-bagua-primary/20 bg-bagua-primary/5 px-4 py-1.5 font-body text-xs font-medium text-bagua-primary">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: WUXING_HEX[gua.wuxing] }}
                />
                五行属{gua.wuxing} · {gua.pronunciation}
              </div>
              <h1 className="my-6 font-calligraphy text-6xl font-bold leading-none text-bagua-text md:text-8xl animate-fade-up stagger-1">
                {gua.name}
              </h1>
              <div className="flex items-center justify-center gap-3 animate-fade-up stagger-2">
                <span className="seal text-sm">#{gua.id}</span>
                <span className="font-display text-base text-bagua-muted">
                  {gua.shangGua}上 · {gua.xiaGua}下
                </span>
              </div>
            </div>

            {/* 主卦象（大） */}
            <div className="mb-16 flex justify-center animate-fade-up stagger-3">
              <div className="glass-card card-hover rounded-card p-12">
                <HexagramSymbol gua={gua} size="lg" />
              </div>
            </div>

            {/* 关系八卦图 */}
            <div className="mb-16 animate-fade-up stagger-4">
              <h2 className="mb-8 text-center font-display text-2xl font-bold text-bagua-text">
                <Compass className="mr-2 inline h-6 w-6 text-bagua-primary" />
                卦象关系
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <RelationCard
                  label="错卦"
                  sub="阴阳全反"
                  gua={dui}
                  highlight={gua.duiGua === 2}
                />
                <RelationCard
                  label="综卦"
                  sub="上下颠倒"
                  gua={zong}
                  highlight={gua.zongGua === 2}
                />
                <RelationCard label="互卦" sub="取2-3-4与3-4-5" gua={hu} />
                <RelationCard label="之卦" sub="变爻之后" gua={bian} disabled={!bian} />
              </div>
            </div>

            {/* 三列内容布局 */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* 左：卦辞 + 彖传 */}
              <div className="space-y-6 lg:col-span-2">
                <div className="glass-card rounded-card p-8 animate-fade-up">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bagua-primary/10 text-bagua-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-bagua-text">卦辞</h3>
                  </div>
                  <p className="font-calligraphy text-2xl leading-relaxed text-bagua-text">
                    {gua.guaci}
                  </p>
                </div>

                <div className="glass-card rounded-card p-8 animate-fade-up stagger-1">
                  <h3 className="mb-4 font-display text-xl font-bold text-bagua-text">
                    <span className="seal mr-2 text-xs">彖</span>
                    彖传
                  </h3>
                  <p className="font-body leading-loose text-bagua-text">{gua.tuanZhuan}</p>
                </div>

                <div className="glass-card rounded-card p-8 animate-fade-up stagger-2">
                  <h3 className="mb-4 font-display text-xl font-bold text-bagua-text">
                    <span className="seal mr-2 text-xs">象</span>
                    象传
                  </h3>
                  <p className="font-calligraphy text-lg leading-relaxed text-bagua-text">
                    {gua.daXiangZhuan}
                  </p>
                </div>

                {gua.wenYan && (
                  <div className="glass-card rounded-card border border-bagua-accent/40 bg-gradient-to-br from-bagua-accent/10 to-bagua-surface p-8 animate-fade-up stagger-3">
                    <h3 className="mb-4 font-display text-xl font-bold text-bagua-accent">
                      <Sparkles className="mr-2 inline h-5 w-5" />
                      文言传（乾坤专属）
                    </h3>
                    <p className="font-body leading-loose text-bagua-text">{gua.wenYan}</p>
                  </div>
                )}
              </div>

              {/* 右：现代启示 */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-card sticky top-24 border border-bagua-secondary/40 bg-gradient-to-br from-bagua-secondary/10 to-bagua-surface p-8 animate-fade-up stagger-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bagua-secondary/10 text-bagua-secondary">
                      <Star className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-bagua-secondary">
                      现代启示
                    </h3>
                  </div>
                  <p className="font-body leading-loose text-bagua-text">{gua.modernInsight}</p>
                </div>
              </div>
            </div>

            {/* 六爻详情 */}
            <div className="mt-16">
              <h2 className="mb-8 text-center font-display text-3xl font-bold text-bagua-text">
                六爻详情
              </h2>
              <div className="mx-auto max-w-3xl space-y-3">
                {[...gua.yaos].reverse().map((yao, idx) => {
                  const pos = (6 - idx) as 1 | 2 | 3 | 4 | 5 | 6
                  const yaoLabelYang = ['初九', '九二', '九三', '九四', '九五', '上九']
                  const yaoLabelYin = ['初六', '六二', '六三', '六四', '六五', '上六']
                  const label =
                    yao.yinYang === 'yang' ? yaoLabelYang[pos - 1]! : yaoLabelYin[pos - 1]!
                  return (
                    <div
                      key={idx}
                      className="glass-card card-hover group rounded-card p-6"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <span className="seal text-sm">{label}</span>
                          <span className="mt-2 font-body text-xs text-bagua-muted">
                            {yao.yinYang === 'yang' ? '━━━' : '━ ━'}
                          </span>
                        </div>
                        <div className="flex-1 border-l border-bagua-border/30 pl-4">
                          <p className="mb-2 font-calligraphy text-lg leading-relaxed text-bagua-text">
                            {yao.text}
                          </p>
                          <p className="font-body text-sm leading-relaxed text-bagua-muted">
                            《象》曰：{yao.xiangZhuan}
                          </p>
                          {yao.shiStatus && (
                            <div className="mt-3 inline-flex items-center gap-1 rounded-pill bg-bagua-canvas/80 px-2.5 py-1 font-body text-xs text-bagua-muted">
                              {yao.shiStatus}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 关键词标签 */}
            <div className="mt-16 flex flex-wrap justify-center gap-2">
              {gua.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="glass-card rounded-pill px-4 py-1.5 font-body text-sm text-bagua-text animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

function RelationCard({
  label,
  sub,
  gua,
  highlight = false,
  disabled = false,
}: {
  label: string
  sub: string
  gua: Pick<Gua, 'id' | 'name' | 'yaos'> | null | undefined
  highlight?: boolean
  disabled?: boolean
}) {
  if (disabled || !gua) {
    return (
      <div className="glass-card rounded-card p-6 text-center opacity-50">
        <div className="font-body text-xs uppercase tracking-wider text-bagua-muted">{label}</div>
        <div className="my-4 flex justify-center opacity-30">
          <div className="h-20 w-16 rounded border border-dashed border-bagua-border" />
        </div>
        <div className="font-calligraphy text-sm text-bagua-muted">—</div>
        <div className="mt-1 font-body text-xs text-bagua-muted">{sub}</div>
      </div>
    )
  }
  return (
    <Link
      href={`/hexagrams/${gua.id}`}
      className={`group glass-card card-hover relative overflow-hidden rounded-card p-6 text-center ${
        highlight ? 'border-bagua-primary/60 ring-2 ring-bagua-primary/20' : ''
      }`}
    >
      <div className="font-body text-xs uppercase tracking-wider text-bagua-muted">{label}</div>
      <div className="my-4 flex justify-center transition-transform group-hover:scale-110">
        <HexagramSymbol gua={gua as Pick<Gua, 'yaos'>} size="sm" />
      </div>
      <div className="font-calligraphy text-base font-bold text-bagua-text">{gua.name}</div>
      <div className="mt-1 font-body text-xs text-bagua-muted">#{gua.id}</div>
      <div className="mt-2 font-body text-xs text-bagua-muted">{sub}</div>
    </Link>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-bagua-border/30 bg-bagua-surface/40 backdrop-blur-md">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/hexagrams" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-bagua text-white">
              <span className="font-calligraphy text-sm">卦</span>
            </div>
            <span className="font-calligraphy text-base text-bagua-text">bagua · 易经占卜</span>
          </Link>
          <p className="font-body text-xs text-bagua-muted">© 2026 · 数据源于传统经典</p>
        </div>
      </div>
    </footer>
  )
}
