'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { HexagramSymbol } from './HexagramSymbol'
import { getAllHexagrams, searchHexagrams } from '@/lib/iching'
import { Search } from 'lucide-react'

export function HexagramGrid() {
  const [query, setQuery] = useState('')
  const hexagrams = useMemo(() => {
    return query ? searchHexagrams(query) : getAllHexagrams()
  }, [query])

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 rounded-card border border-bagua-border/40 bg-bagua-surface px-4 py-3 shadow-sm">
        <Search className="h-5 w-5 text-bagua-muted" />
        <input
          type="text"
          placeholder="搜索卦名、拼音、关键词（如：乾、qian、刚健）"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-transparent font-body text-bagua-text outline-none placeholder:text-bagua-muted"
        />
      </div>

      <p className="mb-4 font-body text-sm text-bagua-muted">
        共 {hexagrams.length} 卦
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {hexagrams.map(gua => (
          <Link
            key={gua.id}
            href={`/hexagrams/${gua.id}`}
            className="group flex flex-col items-center rounded-card border border-bagua-border/30 bg-bagua-surface p-4 transition-all hover:-translate-y-1 hover:border-bagua-primary/40 hover:shadow-lg"
          >
            <div className="text-xs font-medium text-bagua-muted">
              #{gua.id}
            </div>
            <div className="my-3">
              <HexagramSymbol gua={gua} size="md" />
            </div>
            <div className="font-calligraphy text-base font-bold text-bagua-text">
              {gua.chineseName}
            </div>
            <div className="mt-1 truncate text-center font-body text-xs text-bagua-muted">
              {gua.name.replace(gua.chineseName, '')}
            </div>
          </Link>
        ))}
      </div>

      {hexagrams.length === 0 && (
        <div className="py-12 text-center font-body text-bagua-muted">
          没有找到匹配的卦象
        </div>
      )}
    </div>
  )
}
