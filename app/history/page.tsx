'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useHistoryStore } from '@/store/history'
import { getGuaById } from '@/lib/iching'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { ArrowLeft, Star, Trash2, Search } from 'lucide-react'

export default function HistoryPage() {
  const records = useHistoryStore(s => s.records)
  const toggleFavorite = useHistoryStore(s => s.toggleFavorite)
  const removeRecord = useHistoryStore(s => s.removeRecord)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const [query, setQuery] = useState('')

  const filtered = records
    .filter(r => filter === 'all' || r.favorite)
    .filter(r => {
      if (!query) return true
      const gua = getGuaById(r.benGuaId)
      if (!gua) return false
      const q = query.toLowerCase()
      return gua.name.includes(q) || gua.chineseName.includes(q) ||
             (r.question?.toLowerCase().includes(q) ?? false)
    })

  return (
    <main className="min-h-screen bg-bagua-canvas">
      <header className="border-b border-bagua-border/30 bg-bagua-surface/60 backdrop-blur-md">
        <div className="container mx-auto flex items-center gap-3 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-body text-sm text-bagua-muted transition hover:text-bagua-text"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </header>

      <section className="container mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-2 font-display text-3xl font-bold text-bagua-text">
          历史记录
        </h1>
        <p className="mb-6 font-body text-bagua-muted">
          共 {records.length} 条记录（{records.filter(r => r.favorite).length} 条收藏）
        </p>

        {/* 过滤 */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-card border border-bagua-border/40 bg-bagua-surface px-4 py-2 shadow-sm">
            <Search className="h-4 w-4 text-bagua-muted" />
            <input
              type="text"
              placeholder="搜索卦名或问题"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent font-body text-sm text-bagua-text outline-none placeholder:text-bagua-muted"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-full px-4 py-2 font-body text-sm transition ${
                filter === 'all'
                  ? 'bg-bagua-primary text-white'
                  : 'border border-bagua-border/40 bg-bagua-surface text-bagua-muted hover:text-bagua-text'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`rounded-full px-4 py-2 font-body text-sm transition ${
                filter === 'favorites'
                  ? 'bg-bagua-accent text-white'
                  : 'border border-bagua-border/40 bg-bagua-surface text-bagua-muted hover:text-bagua-text'
              }`}
            >
              <Star className="mr-1 inline h-3 w-3" />
              收藏
            </button>
          </div>
        </div>

        {/* 列表 */}
        {filtered.length === 0 ? (
          <div className="rounded-card border border-bagua-border/40 bg-bagua-surface p-12 text-center shadow-md">
            <p className="font-body text-bagua-muted">
              {records.length === 0 ? '暂无起卦记录' : '没有匹配的记录'}
            </p>
            <Link
              href="/divine"
              className="mt-4 inline-block font-body text-bagua-primary hover:underline"
            >
              前往起卦 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => {
              const gua = getGuaById(r.benGuaId)
              if (!gua) return null
              const date = new Date(r.timestamp).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
              return (
                <div
                  key={r.id}
                  className="group flex items-center gap-4 rounded-card border border-bagua-border/40 bg-bagua-surface p-4 shadow-sm transition hover:shadow-md"
                >
                  <Link href={`/result?id=${r.id}`} className="flex flex-1 items-center gap-4">
                    <div className="flex-shrink-0">
                      <HexagramSymbol gua={gua} size="sm" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-calligraphy text-base font-bold text-bagua-text">
                          {gua.name}
                        </span>
                        {r.changingLinePositions.length > 0 && (
                          <span className="rounded-full bg-bagua-accent/10 px-2 py-0.5 font-body text-xs text-bagua-accent">
                            {r.changingLinePositions.length} 动
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 font-body text-xs text-bagua-muted">
                        <span>{date}</span>
                        <span>·</span>
                        <span>{r.method === 'coins' ? '硬币' : r.method === 'yarrow' ? '蓍草' : '手动'}</span>
                        {r.question && (
                          <>
                            <span>·</span>
                            <span className="truncate">{r.question}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(r.id)}
                      className={`rounded-full p-2 transition ${
                        r.favorite
                          ? 'text-bagua-accent'
                          : 'text-bagua-muted opacity-0 hover:text-bagua-accent group-hover:opacity-100'
                      }`}
                    >
                      <Star className="h-4 w-4" fill={r.favorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('删除这条记录？')) removeRecord(r.id)
                      }}
                      className="rounded-full p-2 text-bagua-muted opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
