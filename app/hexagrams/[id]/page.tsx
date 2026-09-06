import Link from 'next/link'
import { notFound } from 'next/navigation'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getGuaById } from '@/lib/iching'
import type { Gua } from '@/lib/iching'

import { ArrowLeft, Share2, Star, Compass, Layers } from '@/components/icons'

interface PageProps {
  params: { id: string }
}

export function generateStaticParams() {
  return Array.from({ length: 64 }, (_, i) => ({ id: String(i + 1) }))
}

/**
 * 五行主题色系（金/木/水/火/土） - 预先定义避免 Tailwind JIT 无法扫描动态拼接的 class。
 * 同步在 tailwind.config.ts 的 safelist 中列出对应 from-*-500/8 类名。
 */
const WUXING_THEME: Record<
  string,
  {
    bg: string
    text: string
    border: string
    label: string
    fromClass: string
  }
> = {
  金: {
    bg: 'bg-gold-500/10',
    text: 'text-gold-400',
    border: 'border-gold-500/20',
    label: '金',
    fromClass: 'from-gold-500/8',
  },
  木: {
    bg: 'bg-jade-500/10',
    text: 'text-jade-300',
    border: 'border-jade-500/20',
    label: '木',
    fromClass: 'from-jade-500/8',
  },
  水: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-300',
    border: 'border-indigo-500/20',
    label: '水',
    fromClass: 'from-indigo-500/8',
  },
  火: {
    bg: 'bg-vermilion-500/10',
    text: 'text-vermilion-300',
    border: 'border-vermilion-500/20',
    label: '火',
    fromClass: 'from-vermilion-500/8',
  },
  土: {
    bg: 'bg-amber-700/10',
    text: 'text-amber-500',
    border: 'border-amber-700/20',
    label: '土',
    fromClass: 'from-amber-700/8',
  },
}

const DEFAULT_THEME = WUXING_THEME['金']!

const RELATION_DESCS = {
  dui: '阴阳全反',
  zong: '上下颠倒',
  hu: '中四爻成',
  bian: '变爻之后',
} as const

export default function HexagramDetailPage({ params }: PageProps) {
  const id = parseInt(params.id, 10)
  const gua = getGuaById(id)
  if (!gua) notFound()

  const wx = WUXING_THEME[gua.wuxing] ?? DEFAULT_THEME
  const dui = getGuaById(gua.duiGua)
  const zong = getGuaById(gua.zongGua)
  const hu = getGuaById(gua.huGua)
  const bianFirstId = gua.guaBian[0]
  const bian = bianFirstId !== undefined ? getGuaById(bianFirstId) : null

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-950 text-ink-100">
      {/* 五行主题背景 */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-radial ${wx.fromClass} via-transparent to-transparent`}
      />

      {/* 装饰八卦符号 */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] opacity-[0.04]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            fontSize="180"
            fill="currentColor"
            className="text-gold-500"
          >
            {gua.symbol}
          </text>
        </svg>
      </div>

      {/* 顶部 */}
      <header className="relative z-10 border-b border-ink-800/60 bg-ink-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-8 py-4">
          <Link
            href="/hexagrams"
            className="group flex items-center gap-2 font-body text-sm text-ink-300 transition hover:text-ink-50"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            返回卦象库
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-ink-500">
              #{gua.id.toString().padStart(2, '0')} / 64
            </span>
            <button
              type="button"
              aria-label="收藏"
              className="rounded-full p-2 text-ink-400 transition hover:bg-ink-800/50 hover:text-gold-400"
            >
              <Star className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="分享"
              className="rounded-full p-2 text-ink-400 transition hover:bg-ink-800/50 hover:text-ink-50"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <article className="relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-8 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            {/* 分类徽章 */}
            <div className="flex flex-wrap items-center gap-3 animate-fade-down">
              <div
                className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 font-body text-xs ${wx.bg} ${wx.text} ${wx.border}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                五行属{wx.label}
              </div>
              <div className="tag">
                {gua.shangGua}上 · {gua.xiaGua}下
              </div>
              <div className="tag">
                京房八宫 · 第{gua.palace}宫
              </div>
            </div>

            {/* 卦名 */}
            <h1 className="mt-8 animate-fade-up font-calligraphy text-7xl font-medium leading-none text-ink-50 stagger-1 md:text-9xl">
              {gua.name}
            </h1>
            <p className="mt-4 animate-fade-up font-display text-2xl font-light text-ink-300 stagger-2">
              {gua.pronunciation}
            </p>

            {/* 印章 */}
            <div className="mt-8 animate-fade-up stagger-3">
              <span className="seal">第 {gua.id} 卦</span>
            </div>

            {/* 主卦象 */}
            <div className="mt-16 flex justify-center animate-scale-in stagger-4">
              <div className="card-gold p-16">
                <HexagramSymbol gua={gua} size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* 卦辞解读 */}
        <section className="container mx-auto max-w-5xl px-8 pb-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 主内容 */}
            <div className="space-y-6 lg:col-span-2">
              <ContentBlock label="卦辞" variant="primary" delay={0}>
                <p className="font-calligraphy text-2xl leading-loose text-pretty">
                  {gua.guaci}
                </p>
              </ContentBlock>

              <ContentBlock label="彖传" variant="muted" delay={1}>
                <p className="font-body text-base leading-loose text-pretty text-ink-300">
                  {gua.tuanZhuan}
                </p>
              </ContentBlock>

              <ContentBlock label="象传" variant="muted" delay={2}>
                <p className="font-calligraphy text-lg leading-loose text-pretty text-ink-200">
                  {gua.daXiangZhuan}
                </p>
              </ContentBlock>

              {gua.wenYan && (
                <ContentBlock label="文言" variant="gold" delay={3}>
                  <p className="font-body text-sm leading-loose text-pretty text-ink-300">
                    {gua.wenYan}
                  </p>
                </ContentBlock>
              )}

              <ContentBlock label="现代启示" variant="vermilion" delay={4}>
                <p className="font-body text-base leading-loose text-pretty text-ink-200">
                  {gua.modernInsight}
                </p>
              </ContentBlock>
            </div>

            {/* 侧栏：卦象关系 */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <h3 className="flex items-center gap-2 font-display text-base font-medium text-ink-200">
                  <Compass className="h-4 w-4 text-gold-400" />
                  卦象关系
                </h3>
                <RelationMini label="错卦" sub={RELATION_DESCS.dui} gua={dui} />
                <RelationMini label="综卦" sub={RELATION_DESCS.zong} gua={zong} />
                <RelationMini label="互卦" sub={RELATION_DESCS.hu} gua={hu} />
                <RelationMini
                  label="之卦"
                  sub={RELATION_DESCS.bian}
                  gua={bian}
                  disabled={!bian}
                />
              </div>
            </aside>
          </div>
        </section>

        {/* 六爻详情 */}
        <section className="container mx-auto max-w-4xl px-8 pb-20">
          <h2 className="mb-8 flex items-center gap-3 font-display text-2xl font-medium text-ink-50">
            <Layers className="h-5 w-5 text-gold-400" />
            六爻详情
            <span className="ml-auto font-mono text-xs text-ink-500">初爻 → 上爻</span>
          </h2>
          <div className="space-y-3">
            {[...gua.yaos].reverse().map((yao, idx) => {
              const pos = (6 - idx) as 1 | 2 | 3 | 4 | 5 | 6
              const yaoLabelYang = ['初九', '九二', '九三', '九四', '九五', '上九']
              const yaoLabelYin = ['初六', '六二', '六三', '六四', '六五', '上六']
              const label =
                yao.yinYang === 'yang' ? yaoLabelYang[pos - 1]! : yaoLabelYin[pos - 1]!
              return (
                <div
                  key={idx}
                  className="card-base card-hover p-5"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="seal text-xs">{label}</span>
                    <span className="font-mono text-xs text-ink-500">
                      {yao.yinYang === 'yang' ? '阳爻 ━━━' : '阴爻 ━ ━'}
                    </span>
                  </div>
                  <p className="mt-3 font-calligraphy text-lg leading-relaxed text-ink-50">
                    {yao.text}
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink-400">
                    《象》曰：{yao.xiangZhuan}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 关键词 */}
        <section className="container mx-auto max-w-4xl px-8 pb-24">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {gua.keywords.map((kw, i) => (
              <span
                key={kw}
                className="tag animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {kw}
              </span>
            ))}
          </div>
        </section>
      </article>
    </main>
  )
}

interface ContentBlockProps {
  label: string
  children: React.ReactNode
  variant: 'primary' | 'gold' | 'vermilion' | 'muted'
  delay: number
}

function ContentBlock({ label, children, variant, delay }: ContentBlockProps) {
  const variants: Record<ContentBlockProps['variant'], string> = {
    primary: 'card-base border-gold-500/30',
    gold: 'card-gold',
    vermilion: 'card-base border-vermilion-500/30',
    muted: 'card-base',
  }
  return (
    <div
      className={`p-8 animate-fade-up ${variants[variant]}`}
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-medium uppercase tracking-widest text-gold-400">
        {label}
      </h3>
      {children}
    </div>
  )
}

interface RelationMiniProps {
  label: string
  sub: string
  gua: Pick<Gua, 'id' | 'name' | 'symbol'> | null | undefined
  disabled?: boolean
}

function RelationMini({ label, sub, gua, disabled }: RelationMiniProps) {
  if (disabled || !gua) {
    return (
      <div className="card-base p-4 opacity-40">
        <div className="font-body text-xs text-ink-500">{label}</div>
        <div className="mt-1 font-display text-base text-ink-600">—</div>
        <div className="mt-1 font-body text-xs text-ink-600">{sub}</div>
      </div>
    )
  }
  const symbolChar = gua.symbol?.[0] ?? '☰'
  return (
    <Link
      href={`/hexagrams/${gua.id}`}
      className="card-base card-hover group block p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-body text-xs text-ink-500">{label}</div>
          <div className="mt-1 font-display text-base text-ink-100 group-hover:text-gold-400">
            {gua.name}
          </div>
        </div>
        <div className="text-2xl font-display text-gold-500/60 group-hover:text-gold-400">
          {symbolChar}
        </div>
      </div>
      <div className="mt-2 font-body text-xs text-ink-600">
        #{gua.id} · {sub}
      </div>
    </Link>
  )
}