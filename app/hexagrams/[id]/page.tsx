import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getGuaById } from '@/lib/iching'
import type { Gua } from '@/lib/iching'

const WUXING_IMAGE: Record<string, string> = {
  金: '/icons/wuxing-metal.webp',
  木: '/icons/wuxing-wood.webp',
  水: '/icons/wuxing-water.webp',
  火: '/icons/wuxing-fire.webp',
  土: '/icons/wuxing-earth.webp',
}

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
      ...new Set([
        gua.name,
        gua.chineseName,
        gua.pronunciation,
        '易经',
        '六十四卦',
        ...gua.keywords,
      ]),
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

  const wuxingImg = WUXING_IMAGE[gua.wuxing]

  return (
    <SiteShell eyebrow={`GUA ${gua.id.toString().padStart(2, '0')} / 64`}>
      <article className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="enter-up">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-[11px] tracking-[0.28em] text-bagua-muted">
                {gua.shangGua}上 · {gua.xiaGua}下 · 五行{gua.wuxing}
              </span>
              {wuxingImg ? (
                <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border-2 border-bagua-text/70 bg-bagua-canvas p-0.5 shadow-2xs">
                  <Image
                    src={wuxingImg}
                    alt={`五行 · ${gua.wuxing}`}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
            <h1 className="mt-3 font-display text-4xl tracking-[0.12em] md:text-6xl">{gua.name}</h1>
            <p className="mt-2 font-body text-sm tracking-[0.18em] text-bagua-muted">{gua.pronunciation}</p>
          </div>
        ) : null}
      </section>

      <div className="mt-12 flex flex-wrap gap-2">
        {gua.keywords.map((keyword) => (
          <span
            key={keyword}
            className="border-4 border-bagua-text px-2 py-1 font-display text-[11px] tracking-widest"
          >
            {keyword}
          </span>
        ))}
      </div>
    </article>
  )
}

interface RelationMiniProps {
  label: string
  sub: string
  gua: Pick<Gua, 'id' | 'name' | 'wuxing'> | null | undefined
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
  const wuxingImg = WUXING_IMAGE[gua.wuxing]
  return (
    <Link
      href={`/hexagrams/${gua.id}`}
      className="btn-press flex items-center justify-between border-4 border-bagua-text bg-bagua-surface p-3 hover:bg-bagua-wash"
    >
      <div>
        <div className="font-display text-[10px] tracking-widest text-bagua-primary">{label}</div>
        <div className="mt-1 font-display text-sm tracking-widest">{gua.name}</div>
        <div className="mt-1 font-body text-xs text-bagua-muted">
          #{gua.id} · {sub}
        </div>
      </div>
      {wuxingImg ? (
        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-bagua-text/60 bg-bagua-canvas p-0.5 shadow-2xs">
          <Image
            src={wuxingImg}
            alt={gua.wuxing}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
    </Link>
  )
}
