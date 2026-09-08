import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { SiteShell } from '@/components/shared/SiteShell'
import { getGuaById } from '@/lib/iching'
import type { Gua } from '@/lib/iching'

interface PageProps {
  params: { id: string }
}

export function generateStaticParams() {
  return Array.from({ length: 64 }, (_, i) => ({ id: String(i + 1) }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const gua = getGuaById(parseInt(params.id, 10))
  if (!gua) return { title: '卦象不存在' }

  return {
    title: `${gua.name}（第${gua.id}卦）`,
    description: `${gua.name}（${gua.pronunciation}）卦辞：${gua.guaci} 了解卦象、彖传、象传与六爻爻辞。`,
    keywords: [
      ...new Set([gua.name, gua.chineseName, gua.pronunciation, '易经', '六十四卦', ...gua.keywords]),
    ],
  }
}

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

  const dui = getGuaById(gua.duiGua)
  const zong = getGuaById(gua.zongGua)
  const hu = getGuaById(gua.huGua)
  const bianFirstId = gua.guaBian[0]
  const bian = bianFirstId !== undefined ? getGuaById(bianFirstId) : null

  return (
    <SiteShell eyebrow={`GUA ${gua.id.toString().padStart(2, '0')} / 64`}>
      <article className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="enter-up">
            <p className="font-display text-[11px] tracking-[0.28em] text-bagua-muted">
              {gua.shangGua}上 · {gua.xiaGua}下 · 五行{gua.wuxing}
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-[0.12em] md:text-6xl">{gua.name}</h1>
            <p className="mt-2 font-body text-sm tracking-[0.18em] text-bagua-muted">{gua.pronunciation}</p>
          </div>
          <div className="enter-up stagger-2 pixel-frame bg-bagua-surface p-6">
            <HexagramSymbol gua={gua} size="lg" />
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="space-y-10">
            <section className="enter-up">
              <h2 className="font-display text-xs tracking-[0.28em] text-bagua-primary">卦辞</h2>
              <p className="prose-classical mt-3 text-pretty">{gua.guaci}</p>
            </section>
            <section>
              <h2 className="font-display text-xs tracking-[0.28em] text-bagua-primary">彖传</h2>
              <p className="prose-classical mt-3 text-pretty text-[18px]">{gua.tuanZhuan}</p>
            </section>
            <section>
              <h2 className="font-display text-xs tracking-[0.28em] text-bagua-primary">象传</h2>
              <p className="prose-classical mt-3 text-pretty">{gua.daXiangZhuan}</p>
            </section>
            {gua.wenYan ? (
              <section>
                <h2 className="font-display text-xs tracking-[0.28em] text-bagua-primary">文言</h2>
                <p className="prose-body mt-3 text-pretty">{gua.wenYan}</p>
              </section>
            ) : null}
            <section>
              <h2 className="font-display text-xs tracking-[0.28em] text-bagua-primary">现代启示</h2>
              <p className="prose-body mt-3 text-pretty">{gua.modernInsight}</p>
            </section>
          </div>

          <aside className="space-y-3">
            <h2 className="font-display text-xs tracking-[0.28em] text-bagua-muted">卦变</h2>
            <RelationMini label="错卦" sub={RELATION_DESCS.dui} gua={dui} />
            <RelationMini label="综卦" sub={RELATION_DESCS.zong} gua={zong} />
            <RelationMini label="互卦" sub={RELATION_DESCS.hu} gua={hu} />
            <RelationMini label="之卦" sub={RELATION_DESCS.bian} gua={bian} disabled={!bian} />
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 font-display text-sm tracking-[0.24em]">六爻 · 初爻至上爻</h2>
          <ol className="space-y-6">
            {[...gua.yaos].map((yao) => {
              const yaoLabelYang = ['初九', '九二', '九三', '九四', '九五', '上九']
              const yaoLabelYin = ['初六', '六二', '六三', '六四', '六五', '上六']
              const label = yao.yinYang === 'yang' ? yaoLabelYang[yao.position - 1]! : yaoLabelYin[yao.position - 1]!
              return (
                <li key={yao.position} className="border-l-4 border-bagua-text pl-4">
                  <p className="font-display text-xs tracking-[0.2em] text-bagua-primary">
                    {label}
                    <span className="ml-2 text-bagua-muted">{yao.yinYang === 'yang' ? '阳' : '阴'}</span>
                  </p>
                  <p className="prose-classical mt-2 text-[18px]">{yao.text}</p>
                  <p className="prose-body mt-1 text-sm text-bagua-muted">《象》曰：{yao.xiangZhuan}</p>
                </li>
              )
            })}
          </ol>
        </section>

        <div className="mt-12 flex flex-wrap gap-2">
          {gua.keywords.map((keyword) => (
            <span key={keyword} className="border-4 border-bagua-text px-2 py-1 font-display text-[11px] tracking-widest">
              {keyword}
            </span>
          ))}
        </div>
      </article>
    </SiteShell>
  )
}

interface RelationMiniProps {
  label: string
  sub: string
  gua: Pick<Gua, 'id' | 'name'> | null | undefined
  disabled?: boolean
}

function RelationMini({ label, sub, gua, disabled }: RelationMiniProps) {
  if (disabled || !gua) {
    return (
      <div className="border-4 border-bagua-fiber p-3 opacity-50">
        <div className="font-display text-[10px] tracking-widest text-bagua-muted">{label}</div>
        <div className="mt-1 font-body text-sm">—</div>
      </div>
    )
  }
  return (
    <Link href={`/hexagrams/${gua.id}`} className="btn-press block border-4 border-bagua-text bg-bagua-surface p-3 hover:bg-bagua-wash">
      <div className="font-display text-[10px] tracking-widest text-bagua-primary">{label}</div>
      <div className="mt-1 font-display text-sm tracking-widest">{gua.name}</div>
      <div className="mt-1 font-body text-xs text-bagua-muted">#{gua.id} · {sub}</div>
    </Link>
  )
}
