'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useHistoryStore } from '@/store/history'
import { getGuaById } from '@/lib/iching'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { SyncIndicator } from '@/components/SyncIndicator'
import { ArrowLeft, Star, Trash2, Search, Sparkles } from 'lucide-react'

export default function HistoryPage() {
  const records = useHistoryStore(s => s.records)
  const toggleFavorite = useHistoryStore(s => s.toggleFavorite)
  const removeRecord = useHistoryStore(s => s.removeRecord)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let list = records.filter(r => filter === 'all' || r.favorite)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(r => {
        const gua = getGuaById(r.benGuaId)
        if (!gua) return false
        return gua.name.toLowerCase().includes(q) ||
          gua.chineseName.includes(query) ||
          (r.question?.toLowerCase().includes(q) ?? false)
      })
    }
    return list
  }, [records, filter, query])

  const favoriteCount = records.filter(r => r.favorite).length

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-bagua-accent/5 blur-3xl" />
      </div>

      <header className="glass-card sticky top-0 z-50 border-b border-bagua-border/30">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-body text-sm text-bagua-muted transition hover:text-bagua-text">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-center gap-3">
            <SyncIndicator />
            <span className="seal text-sm">历史</span>
          </div>
        </div>
      </header>

      <section className="container relative mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-calligraphy text-4xl font-bold text-bagua-text">历史记录</h1>
          <p className="mt-2 font-body text-bagua-muted">
            共 <span className="font-semibold text-bagua-text">{records.length}</span> 条
            {favoriteCount > 0 && <> · <span className="font-semibold text-bagua-accent">{favoriteCount}</span> 条收藏</>}
          </p>
        </div>

        {/* 过滤工具栏 */}
        {records.length > 0 && (
          <div className="glass-card mb-6 rounded-card p-4 animate-fade-up stagger-1">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-4 w-4 text-bagua-muted" />
                <input
                  type="text"
                  placeholder="搜索卦名或问题"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 bg-transparent font-body text-sm text-bagua-text outline-none placeholder:text-bagua-muted"
                />
              </div>
              <div className="flex gap-1 rounded-pill border border-bagua-border/30 bg-bagua-canvas/50 p-1">
                <button onClick={() => setFilter('all')} className={`rounded-pill px-4 py-1.5 font-body text-xs transition ${filter === 'all' ? 'bg-bagua-text text-bagua-canvas shadow-sm' : 'text-bagua-muted hover:text-bagua-text'}`}>
                  全部
                </button>
                <button onClick={() => setFilter('favorites')} className={`rounded-pill px-4 py-1.5 font-body text-xs transition ${filter === 'favorites' ? 'bg-bagua-accent text-white shadow-sm' : 'text-bagua-muted hover:text-bagua-text'}`}>
                  <Star className="mr-1 inline h-3 w-3" />
                  收藏
                </button>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="glass-card rounded-card p-16 text-center animate-fade-up stagger-2">
            <Sparkles className="mx-auto h-12 w-12 text-bagua-muted/50" />
            <p className="mt-4 font-body text-bagua-muted">
              {records.length === 0 ? '暂无起卦记录' : '没有匹配的记录'}
            </p>
            <Link href="/divine" className="mt-6 inline-flex items-center gap-2 rounded-button bg-bagua-primary px-5 py-2.5 font-body font-medium text-white transition hover:bg-bagua-primary/90">
              前往起卦 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r, idx) => {
              const gua = getGuaById(r.benGuaId)
              if (!gua) return null
              const date = new Date(r.timestamp).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
              return (
                <div
                  key={r.id}
                  className="group glass-card card-hover flex items-center gap-4 rounded-card p-5 animate-fade-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <Link href={`/result?id=${r.id}`} className="flex flex-1 items-center gap-4">
                    <div className="flex-shrink-0 rounded-card bg-bagua-canvas/50 p-3">
                      <HexagramSymbol gua={gua} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-calligraphy text-lg font-bold text-bagua-text">{gua.name}</span>
                        {r.changingLinePositions.length > 0 && (
                          <span className="rounded-pill bg-bagua-accent/10 px-2 py-0.5 font-body text-xs text-bagua-accent">
                            {r.changingLinePositions.length} 动
                          </span>
                        )}
                        {r.favorite && (
                          <Star className="h-3.5 w-3.5 fill-bagua-accent text-bagua-accent" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 truncate font-body text-xs text-bagua-muted">
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
                  <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => toggleFavorite(r.id)} className="rounded-full p-2 text-bagua-muted transition hover:bg-bagua-canvas hover:text-bagua-accent">
                      <Star className={`h-4 w-4 ${r.favorite ? 'fill-bagua-accent text-bagua-accent' : ''}`} />
                    </button>
                    <button onClick={() => { if (confirm('删除这条记录？')) removeRecord(r.id) }} className="rounded-full p-2 text-bagua-muted transition hover:bg-bagua-canvas hover:text-red-500">
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
