'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { Search, Sparkles, Star, Trash2 } from '@/components/icons'
import { SiteShell } from '@/components/shared/SiteShell'
import { SyncIndicator } from '@/components/SyncIndicator'
import { getGuaById } from '@/lib/iching'
import { useHistoryStore } from '@/store/history'

export default function HistoryPage() {
  const records = useHistoryStore((s) => s.records)
  const toggleFavorite = useHistoryStore((s) => s.toggleFavorite)
  const removeRecord = useHistoryStore((s) => s.removeRecord)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let list = records.filter((r) => filter === 'all' || r.favorite)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((r) => {
        const gua = getGuaById(r.benGuaId)
        if (!gua) return false
        return gua.name.toLowerCase().includes(q) ||
          gua.chineseName.includes(query) ||
          (r.question?.toLowerCase().includes(q) ?? false)
      })
    }
    return list
  }, [records, filter, query])

  const favoriteCount = records.filter((r) => r.favorite).length

  return (
    <SiteShell eyebrow="HISTORY / 03">
      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="enter-up font-display text-4xl tracking-[0.16em]">历史</h1>
            <p className="mt-2 font-body text-sm text-bagua-muted">
              共 {records.length} 条{favoriteCount > 0 ? ` · ${favoriteCount} 条收藏` : ''}
            </p>
          </div>
          <SyncIndicator />
        </div>

        {records.length > 0 && (
          <div className="mt-6 border-4 border-bagua-text bg-bagua-surface p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search className="h-4 w-4 text-bagua-muted" />
                <input
                  type="text"
                  placeholder="搜索卦名或问题"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="flex-1 bg-transparent font-body text-sm outline-none placeholder:text-bagua-muted"
                />
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => setFilter('all')} className={`btn-press border-4 px-3 py-1 font-display text-[11px] ${filter === 'all' ? 'border-bagua-text bg-bagua-text text-bagua-surface' : 'border-transparent text-bagua-muted'}`}>全部</button>
                <button type="button" onClick={() => setFilter('favorites')} className={`btn-press border-4 px-3 py-1 font-display text-[11px] ${filter === 'favorites' ? 'border-bagua-text bg-bagua-primary text-bagua-surface' : 'border-transparent text-bagua-muted'}`}>
                  <Star className="mr-1 inline h-3 w-3" />收藏
                </button>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="mt-10 border-4 border-bagua-text p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-bagua-muted" />
            <p className="mt-4 font-body text-bagua-muted">{records.length === 0 ? '暂无起卦记录' : '没有匹配的记录'}</p>
            <Link href="/divine" className="btn-primary mt-6">前往起卦</Link>
          </div>
        ) : (
          <ul className="mt-6 divide-y-4 divide-bagua-text border-4 border-bagua-text">
            {filtered.map((r) => {
              const gua = getGuaById(r.benGuaId)
              if (!gua) return null
              const date = new Date(r.timestamp).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
              return (
                <li key={r.id} className="flex items-center gap-3 bg-bagua-canvas p-4 hover:bg-bagua-surface">
                  <Link href={`/result?id=${r.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                    <HexagramSymbol gua={gua} size="sm" />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-display text-sm tracking-widest">
                        {gua.name}
                        {r.changingLinePositions.length > 0 ? <span className="text-[10px] text-bagua-primary">{r.changingLinePositions.length} 动</span> : null}
                      </span>
                      <span className="mt-1 block truncate font-body text-xs text-bagua-muted">
                        {date} · {r.method === 'coins' ? '硬币' : r.method === 'yarrow' ? '蓍草' : '手动'}
                        {r.question ? ` · ${r.question}` : ''}
                      </span>
                    </span>
                  </Link>
                  <button type="button" onClick={() => toggleFavorite(r.id)} className="btn-press p-2 text-bagua-muted" aria-label="收藏">
                    <Star className={`h-4 w-4 ${r.favorite ? 'fill-bagua-primary text-bagua-primary' : ''}`} />
                  </button>
                  <button type="button" onClick={() => { if (confirm('删除这条记录？')) removeRecord(r.id) }} className="btn-press p-2 text-bagua-muted" aria-label="删除">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </SiteShell>
  )
}
