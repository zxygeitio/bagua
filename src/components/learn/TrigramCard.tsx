'use client'

import { useState } from 'react'

const TRIGRAMS = [
  { name: '乾', symbol: '☰', element: '金', nature: '天', virtue: '健', family: '父', direction: '西北', desc: '刚健中正，自强不息。' },
  { name: '兑', symbol: '☱', element: '金', nature: '泽', virtue: '悦', family: '少女', direction: '西', desc: '柔悦和乐，言辞悦人。' },
  { name: '离', symbol: '☲', element: '火', nature: '火', virtue: '丽', family: '中女', direction: '南', desc: '光明附着，文明以止。' },
  { name: '震', symbol: '☳', element: '木', nature: '雷', virtue: '动', family: '长男', direction: '东', desc: '震动奋起，临危不乱。' },
  { name: '巽', symbol: '☴', element: '木', nature: '风', virtue: '入', family: '长女', direction: '东南', desc: '柔顺谦逊，无所不入。' },
  { name: '坎', symbol: '☵', element: '水', nature: '水', virtue: '陷', family: '中男', direction: '北', desc: '重险艰难，行险而顺。' },
  { name: '艮', symbol: '☶', element: '土', nature: '山', virtue: '止', family: '少男', direction: '东北', desc: '止于至善，宁静致远。' },
  { name: '坤', symbol: '☷', element: '土', nature: '地', virtue: '顺', family: '母', direction: '西南', desc: '柔顺包容，厚德载物。' },
] as const

export function TrigramOverview() {
  const [active, setActive] = useState<(typeof TRIGRAMS)[number] | null>(null)

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">
        {TRIGRAMS.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setActive(active?.name === t.name ? null : t)}
            style={{ animationDelay: `${i * 60}ms` }}
            className={`btn-press enter-up flex flex-col items-center gap-1 border-4 p-3 transition ${
              active?.name === t.name
                ? 'border-bagua-text bg-bagua-primary text-bagua-surface'
                : 'border-bagua-fiber bg-bagua-surface hover:border-bagua-text hover:bg-bagua-wash'
            }`}
          >
            <span className="font-display text-2xl leading-none">{t.symbol}</span>
            <span className="font-display text-xs tracking-widest">{t.name}</span>
            <span className="font-body text-[10px] opacity-70">{t.nature}</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="paper-panel mt-6 grid gap-4 p-6 md:grid-cols-[auto,1fr] md:gap-8">
          <div className="flex h-28 w-28 items-center justify-center self-center border-4 border-bagua-text bg-bagua-wash font-display text-6xl leading-none">
            {active.symbol}
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <h3 className="font-display text-3xl tracking-wider">{active.name}</h3>
              <span className="font-body text-sm text-bagua-muted">{active.nature}</span>
            </div>
            <p className="prose-classical mt-2 text-[17px]">{active.desc}</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-body text-xs sm:grid-cols-4">
              <Field label="五行" value={active.element} />
              <Field label="卦德" value={active.virtue} />
              <Field label="六亲" value={active.family} />
              <Field label="方位" value={active.direction} />
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-display text-[10px] tracking-widest text-bagua-muted">{label}</dt>
      <dd className="mt-0.5 font-display text-sm text-bagua-text">{value}</dd>
    </div>
  )
}
