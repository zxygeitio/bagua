'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { HexagramSymbol } from './HexagramSymbol'
import { TrigramWheel } from './TrigramWheel'
import { Search } from '@/components/icons'
import { getAllHexagrams, searchHexagrams } from '@/lib/iching'
import type { TrigramName } from '@/lib/qigua/types'

type SortMode = 'id' | 'wuxing' | 'trigram'

const SORT_LABELS: Record<SortMode, string> = {
  id: '卦序',
  wuxing: '五行',
  trigram: '上下卦',
}

export function HexagramGrid() {
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('id')
  const [wuxingFilter, setWuxingFilter] = useState<string | null>(null)
  const [trigram, setTrigram] = useState<TrigramName | null>(null)

  const hexagrams = useMemo(() => {
    let list = query ? searchHexagrams(query) : getAllHexagrams()
    if (wuxingFilter) list = list.filter((g) => g.wuxing === wuxingFilter)
    if (trigram) list = list.filter((g) => g.shangGua === trigram || g.xiaGua === trigram)
    if (sortMode === 'wuxing') list = [...list].sort((a, b) => a.wuxing.localeCompare(b.wuxing))
    if (sortMode === 'trigram') {
      list = [...list].sort((a, b) => {
        const cmp = a.shangGua.localeCompare(b.shangGua)
        return cmp !== 0 ? cmp : a.xiaGua.localeCompare(b.xiaGua)
      })
    }
    return list
  }, [query, sortMode, wuxingFilter, trigram])

  const wuxingOptions = ['金', '木', '水', '火', '土']

  return (
    <div>
      <div className="mb-4">
        <TrigramWheel value={trigram} onChange={setTrigram} />
      </div>
      <div className="paper-panel mb-8 p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 px-2">
            <Search className="h-4 w-4 text-bagua-muted" />
            <input
              type="text"
              placeholder="搜索卦名、拼音、关键词"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="flex-1 bg-transparent font-body text-sm text-bagua-text outline-none placeholder:text-bagua-muted"
            />
          </div>
          <div className="flex items-center gap-1">
            {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
                className={`btn-press border-4 px-3 py-1 font-display text-[11px] tracking-widest ${
                  sortMode === mode
                    ? 'border-bagua-text bg-bagua-primary text-bagua-surface'
                    : 'border-transparent text-bagua-muted hover:border-bagua-text'
                }`}
              >
                {SORT_LABELS[mode]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {wuxingOptions.map((wx) => (
              <button
                key={wx}
                type="button"
                onClick={() => setWuxingFilter(wuxingFilter === wx ? null : wx)}
                className={`btn-press border-4 px-2 py-1 font-display text-[11px] ${
                  wuxingFilter === wx
                    ? 'border-bagua-text bg-bagua-text text-bagua-surface'
                    : 'border-transparent text-bagua-muted hover:border-bagua-text'
                }`}
              >
                {wx}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4 font-body text-sm text-bagua-muted">
        共 <span className="text-bagua-text">{hexagrams.length}</span> 卦
      </p>

      <div className="grid grid-cols-4 gap-px border-4 border-bagua-text bg-bagua-text sm:grid-cols-8">
        {hexagrams.map((gua) => (
          <Link
            key={gua.id}
            href={`/hexagrams/${gua.id}`}
            prefetch={false}
            className="group flex flex-col items-center bg-bagua-canvas px-2 py-3 transition hover:bg-bagua-surface cv-auto cis-xs"
          >
            <span className="font-display text-[10px] text-bagua-muted">
              {gua.id.toString().padStart(2, '0')}
            </span>
            <div className="my-2">
              <HexagramSymbol gua={gua} size="sm" />
            </div>
            <span className="font-display text-xs tracking-widest group-hover:text-bagua-primary">
              {gua.chineseName}
            </span>
          </Link>
        ))}
      </div>

      {hexagrams.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-body text-bagua-muted">没有找到匹配的卦象</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setWuxingFilter(null)
            }}
            className="mt-4 font-display text-sm text-bagua-primary"
          >
            清除筛选
          </button>
        </div>
      )}
    </div>
  )
}
