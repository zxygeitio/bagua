import Link from 'next/link'
import { notFound } from 'next/navigation'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getGuaById } from '@/lib/iching'
import type { Gua } from '@/lib/iching'

interface PageProps {
  params: { id: string }
}

/** 静态生成 64 个卦象详情页 */
export function generateStaticParams(): Array<{ id: string }> {
  return Array.from({ length: 64 }, (_, i) => ({ id: String(i + 1) }))
}

const YANG_LABELS: Record<number, string> = {
  1: '初九',
  2: '九二',
  3: '九三',
  4: '九四',
  5: '九五',
  6: '上九',
}

const YIN_LABELS: Record<number, string> = {
  1: '初六',
  2: '六二',
  3: '六三',
  4: '六四',
  5: '六五',
  6: '上六',
}

export default function HexagramDetailPage({ params }: PageProps): JSX.Element {
  const id = Number.parseInt(params.id, 10)
  const gua = getGuaById(id)
  if (!gua) notFound()

  const dui = getGuaById(gua.duiGua)
  const zong = getGuaById(gua.zongGua)
  const hu = getGuaById(gua.huGua)
  // 之卦：取 guaBian 第一项（变卦中具代表性的一个）
  const zhi = gua.guaBian.length > 0 ? getGuaById(gua.guaBian[0]!) : undefined

  return (
    <main className="min-h-screen bg-bagua-canvas">
      <header className="border-b border-bagua-border/30 bg-bagua-surface/60 backdrop-blur-md">
        <div className="container mx-auto flex items-center gap-3 px-6 py-4">
          <Link
            href="/hexagrams"
            className="font-body text-sm text-bagua-muted transition hover:text-bagua-text"
          >
            ← 返回六十四卦
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-6 py-12">
        {/* 标题 */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="text-sm font-medium text-bagua-muted">第 {gua.id} 卦 / 六十四卦</div>
          <h1 className="mt-2 font-calligraphy text-5xl font-bold text-bagua-text md:text-6xl">
            {gua.name}
          </h1>
          <p className="mt-2 font-body text-bagua-muted">
            {gua.pronunciation} · 上下 {gua.shangGua}上 {gua.xiaGua}下 · 五行属{gua.wuxing}
          </p>
        </div>

        {/* 主卦象 */}
        <div className="mb-12 flex justify-center">
          <div className="rounded-card border border-bagua-border/40 bg-bagua-surface p-8 shadow-md">
            <HexagramSymbol gua={gua} size="lg" />
          </div>
        </div>

        {/* 径向关系图：本卦居中，错/综/互/之环绕 */}
        <div className="mb-12 rounded-card border border-bagua-border/40 bg-bagua-surface p-6 shadow-md md:p-8">
          <h2 className="mb-6 text-center font-display text-2xl font-bold text-bagua-text">
            卦象关系
          </h2>
          <RadialRelationDiagram
            main={gua}
            dui={dui}
            zong={zong}
            hu={hu}
            zhi={zhi}
          />
        </div>

        {/* 卦辞 */}
        <div className="mb-12 rounded-card border border-bagua-border/40 bg-bagua-surface p-8 shadow-md">
          <h2 className="mb-4 font-display text-2xl font-bold text-bagua-text">卦辞</h2>
          <p className="font-calligraphy text-xl leading-relaxed text-bagua-text">{gua.guaci}</p>
        </div>

        {/* 彖传 */}
        <div className="mb-12 rounded-card border border-bagua-border/40 bg-bagua-surface p-8 shadow-md">
          <h2 className="mb-4 font-display text-2xl font-bold text-bagua-text">彖传</h2>
          <p className="font-body leading-relaxed text-bagua-text">{gua.tuanZhuan}</p>
        </div>

        {/* 大象传 */}
        <div className="mb-12 rounded-card border border-bagua-border/40 bg-bagua-surface p-8 shadow-md">
          <h2 className="mb-4 font-display text-2xl font-bold text-bagua-text">象传</h2>
          <p className="font-calligraphy text-lg leading-relaxed text-bagua-text">
            {gua.daXiangZhuan}
          </p>
        </div>

        {/* 象传下（彖·象分篇） */}
        {gua.xiangTuan && (
          <div className="mb-12 rounded-card border border-bagua-border/40 bg-bagua-surface p-8 shadow-md">
            <h2 className="mb-4 font-display text-2xl font-bold text-bagua-text">象传下</h2>
            <p className="font-body leading-relaxed text-bagua-text">{gua.xiangTuan}</p>
          </div>
        )}

        {/* 文言（乾坤专属） */}
        {gua.wenYan && (
          <div className="mb-12 rounded-card border border-bagua-accent/40 bg-gradient-to-br from-bagua-accent/5 to-bagua-surface p-8 shadow-md">
            <h2 className="mb-4 font-display text-2xl font-bold text-bagua-accent">文言传</h2>
            <p className="font-body leading-relaxed text-bagua-text">{gua.wenYan}</p>
          </div>
        )}

        {/* 六爻 */}
        <div className="mb-12 rounded-card border border-bagua-border/40 bg-bagua-surface p-8 shadow-md">
          <h2 className="mb-6 font-display text-2xl font-bold text-bagua-text">六爻</h2>
          <div className="space-y-6">
            {[...gua.yaos].reverse().map((yao, idx) => {
              const pos = 6 - idx
              const label = yao.yinYang === 'yang' ? YANG_LABELS[pos]! : YIN_LABELS[pos]!
              return (
                <div key={yao.position} className="border-l-4 border-bagua-primary/30 pl-6">
                  <div className="mb-1 flex items-center gap-3">
                    <span className="font-display text-base font-bold text-bagua-primary">
                      {label}
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-sm tracking-widest text-bagua-muted"
                    >
                      {yao.yinYang === 'yang' ? '━━━━━' : '━━ ━━'}
                    </span>
                  </div>
                  <p className="mb-2 font-calligraphy text-lg text-bagua-text">{yao.text}</p>
                  <p className="font-body text-sm text-bagua-muted">
                    《象》曰：{yao.xiangZhuan}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 现代启示 */}
        <div className="mb-12 rounded-card border border-bagua-secondary/40 bg-gradient-to-br from-bagua-secondary/5 to-bagua-surface p-8 shadow-md">
          <h2 className="mb-4 font-display text-2xl font-bold text-bagua-secondary">现代启示</h2>
          <p className="font-body leading-relaxed text-bagua-text">{gua.modernInsight}</p>
        </div>
      </section>
    </main>
  )
}

/* ------------------------------------------------------------------ *
 * 径向关系图
 * ------------------------------------------------------------------ */

interface RadialRelationDiagramProps {
  main: Gua
  dui?: Gua
  zong?: Gua
  hu?: Gua
  zhi?: Gua
}

function RadialRelationDiagram({
  main,
  dui,
  zong,
  hu,
  zhi,
}: RadialRelationDiagramProps): JSX.Element {
  // 4 个环绕卦的位置（按 12-3-6-9 点钟排列）
  const positions = [
    { label: '错卦', sub: '阴阳相反', gua: dui, anchor: 'top' as const, line: 'v-line' },
    { label: '之卦', sub: '动爻所变', gua: zhi, anchor: 'right' as const, line: 'h-line' },
    { label: '综卦', sub: '上下反覆', gua: zong, anchor: 'bottom' as const, line: 'v-line' },
    { label: '互卦', sub: '中四爻成', gua: hu, anchor: 'left' as const, line: 'h-line' },
  ]

  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl">
      {/* 连接线 SVG 层 */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line x1="50" y1="50" x2="50" y2="8" className="stroke-bagua-primary/30" strokeWidth="0.4" />
        <line x1="50" y1="50" x2="92" y2="50" className="stroke-bagua-primary/30" strokeWidth="0.4" />
        <line x1="50" y1="50" x2="50" y2="92" className="stroke-bagua-primary/30" strokeWidth="0.4" />
        <line x1="50" y1="50" x2="8" y2="50" className="stroke-bagua-primary/30" strokeWidth="0.4" />
      </svg>

      {/* 主卦：居中 */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/1">
        <RelationCard label="本卦" sub="当前所观" gua={main} highlight />
      </div>

      {/* 4 个环绕卦：上、右、下、左 */}
      <div className="absolute left-1/2 top-2 -translate-x-1/2">
        <RelationCard label={positions[0]!.label} sub={positions[0]!.sub} gua={positions[0]!.gua} />
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <RelationCard label={positions[1]!.label} sub={positions[1]!.sub} gua={positions[1]!.gua} />
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <RelationCard label={positions[2]!.label} sub={positions[2]!.sub} gua={positions[2]!.gua} />
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <RelationCard label={positions[3]!.label} sub={positions[3]!.sub} gua={positions[3]!.gua} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 关系卦卡（可点击跳转）
 * ------------------------------------------------------------------ */

interface RelationCardProps {
  label: string
  sub: string
  gua?: Gua
  highlight?: boolean
}

function RelationCard({ label, sub, gua, highlight = false }: RelationCardProps): JSX.Element {
  if (!gua) {
    return (
      <div
        className={`flex w-24 flex-col items-center rounded-card border border-dashed border-bagua-border/40 bg-bagua-canvas/40 p-2 opacity-50 md:w-28 ${
          highlight ? 'ring-2 ring-bagua-primary/40' : ''
        }`}
      >
        <div className="text-[10px] font-medium text-bagua-muted">{label}</div>
        <div className="my-2 h-12 w-12 md:h-16 md:w-16" />
        <div className="font-calligraphy text-xs text-bagua-muted">无</div>
      </div>
    )
  }

  return (
    <Link
      href={`/hexagrams/${gua.id}`}
      className={`group flex w-24 flex-col items-center rounded-card border p-2 transition hover:-translate-y-1 md:w-28 ${
        highlight
          ? 'border-bagua-primary/60 bg-bagua-primary/5 shadow-lg ring-2 ring-bagua-primary/40'
          : 'border-bagua-border/30 bg-bagua-surface hover:border-bagua-primary/40 hover:shadow-md'
      }`}
    >
      <div className="text-[10px] font-medium text-bagua-muted">{label}</div>
      <div className="text-[9px] text-bagua-muted/70">{sub}</div>
      <div className="my-2">
        <HexagramSymbol gua={gua} size="sm" />
      </div>
      <div className="font-calligraphy text-xs font-bold text-bagua-text group-hover:text-bagua-primary">
        {gua.name}
      </div>
    </Link>
  )
}
