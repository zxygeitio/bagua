'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { HexagramSymbol } from './HexagramSymbol'
import { getAllHexagrams, searchHexagrams } from '@/lib/iching'
import { Search, Sparkles } from 'lucide-react'

type SortMode = 'id' | 'wuxing' | 'trigram'

const SORT_LABELS: Record<SortMode, string> = {
  id: '按编号',
  wuxing: '按五行',
  trigram: '按上下卦',
}

export function HexagramGrid() {
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('id')
  const [wuxingFilter, setWuxingFilter] = useState<string | null>(null)

  const hexagrams = useMemo(() => {
    let list = query ? searchHexagrams(query) : getAllHexagrams()
    if (wuxingFilter) list = list.filter(g => g.wuxing === wuxingFilter)
    if (sortMode === 'wuxing') list = [...list].sort((a, b) => a.wuxing.localeCompare(b.wuxing))
    if (sortMode === 'trigram') list = [...list].sort((a, b) => {
      const cmp = a.shangGua.localeCompare(b.shangGua)
      return cmp !== 0 ? cmp : a.xiaGua.localeCompare(b.xiaGua)
    })
    return list
  }, [query, sortMode, wuxingFilter])

  const wuxingOptions = ['金', '木', '水', '火', '土']

  return (
    <div>
      {/* 工具栏 */}
      <div className="glass-card mb-8 rounded-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* 搜索 */}
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="h-4 w-4 text-bagua-muted" />
            <input
              type="text"
              placeholder="搜索卦名、拼音、关键词"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent font-body text-sm text-bagua-text outline-none placeholder:text-bagua-muted"
            />
          </div>

          {/* 排序 */}
          <div className="flex items-center gap-1 rounded-pill border border-bagua-border/30 bg-bagua-canvas/50 p-1">
            {(Object.keys(SORT_LABELS) as SortMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setSortMode(mode)}
                className={`rounded-pill px-3 py-1.5 font-body text-xs transition ${
                  sortMode === mode
                    ? 'bg-bagua-text text-bagua-canvas shadow-sm'
                    : 'text-bagua-muted hover:text-bagua-text'
                }`}
              >
                {SORT_LABELS[mode]}
              </button>
            ))}
          </div>

          {/* 五行筛选 */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-body text-xs text-bagua-muted">五行:</span>
            {wuxingOptions.map(wx => (
              <button
                key={wx}
                onClick={() => setWuxingFilter(wuxingFilter === wx ? null : wx)}
                className={`rounded-pill px-2.5 py-1 font-body text-xs transition ${
                  wuxingFilter === wx
                    ? 'bg-bagua-primary text-white shadow-sm'
                    : 'border border-bagua-border/30 text-bagua-muted hover:text-bagua-primary'
                }`}
              >
                {wx}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 计数 */}
      <div className="mb-6 flex items-center justify-between">
        <p className="font-body text-sm text-bagua-muted">
          共 <span className="font-semibold text-bagua-text">{hexagrams.length}</span> 卦
        </p>
        {hexagrams.length > 0 && (
          <p className="flex items-center gap-1 font-body text-xs text-bagua-accent">
            <Sparkles className="h-3 w-3" />
            点击进入详情
          </p>
        )}
      </div>

      {/* 网格 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {hexagrams.map((gua, idx) => (
          <Link
            key={gua.id}
            href={`/hexagrams/${gua.id}`}
            className="group glass-card card-hover relative flex flex-col items-center overflow-hidden rounded-card border border-transparent p-4 animate-fade-up"
            style={{ animationDelay: `${Math.min(idx * 15, 800)}ms` }}
          >
            {/* 编号 */}
            <div className="absolute right-3 top-3 font-body text-xs font-medium text-bagua-muted transition group-hover:text-bagua-primary">
              #{gua.id.toString().padStart(2, '0')}
            </div>
            {/* 五行指示点 */}
            <div
              className="absolute left-3 top-3 h-2 w-2 rounded-full"
              style={{
                backgroundColor: {
                  金: '#F59E0B',
                  木: '#10B981',
                  水: '#3B82F6',
                  火: '#EF4444',
                  土: '#A16207',
                }[gua.wuxing] || '#9CA3AF',
              }}
              title={`五行属${gua.wuxing}`}
            />
            {/* 卦象 */}
            <div className="my-3 transition-transform group-hover:scale-110">
              <HexagramSymbol gua={gua} size="md" />
            </div>
            {/* 卦名 */}
            <div className="font-calligraphy text-lg font-bold text-bagua-text">
              {gua.chineseName}
            </div>
            <div className="mt-1 truncate text-center font-body text-xs text-bagua-muted">
              {gua.name.replace(gua.chineseName, '')}
            </div>
          </Link>
        ))}
      </div>

      {hexagrams.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-body text-bagua-muted">没有找到匹配的卦象</p>
          <button
            onClick={() => { setQuery(''); setWuxingFilter(null) }}
            className="mt-4 font-body text-sm text-bagua-primary hover:underline"
          >
            清除筛选
          </button>
        </div>
      )}
    </div>
  )
}
