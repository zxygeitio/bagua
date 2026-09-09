'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useHistoryStore } from '@/store/history'
import { CAST_METHOD_LABELS } from '@/types/iching'
import { getGuaById, type Scenario } from '@/lib/iching'
import { SCENARIO_LABELS } from '@/types/iching'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { SyncIndicator } from '@/components/SyncIndicator'
import { ArrowLeft, Star, Trash2, Search, Sparkles, Calendar, ListChecks } from '@/components/icons'

type View = 'list' | 'calendar'
type Filter = 'all' | 'favorites' | 'today' | 'week' | 'month'

const FILTER_LABELS: Record<Filter, string> = {
  all: '全部',
  favorites: '收藏',
  today: '今日',
  week: '本周',
  month: '本月',
}

const SCENARIO_OPTIONS: Scenario[] = [
  'career',
  'wealth',
  'relationship',
  'health',
  'study',
  'family',
]

export default function HistoryPage() {
  const records = useHistoryStore((s) => s.records)
  const toggleFavorite = useHistoryStore((s) => s.toggleFavorite)
  const removeRecord = useHistoryStore((s) => s.removeRecord)

  const [view, setView] = useState<View>('list')
  const [filter, setFilter] = useState<Filter>('all')
  const [scenarioFilter, setScenarioFilter] = useState<Scenario | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    let list = records.filter((r) => {
      if (filter === 'favorites' && !r.favorite) return false
      if (filter === 'today' && now - r.timestamp >= oneDay) return false
      if (filter === 'week' && now - r.timestamp >= 7 * oneDay) return false
      if (filter === 'month' && now - r.timestamp >= 30 * oneDay) return false
      if (scenarioFilter && r.scenario !== scenarioFilter) return false
      return true
    })
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((r) => {
        const gua = getGuaById(r.benGuaId)
        if (!gua) return false
        return (
          gua.name.toLowerCase().includes(q) ||
          gua.chineseName.includes(query) ||
          (r.question?.toLowerCase().includes(q) ?? false) ||
          (r.notes?.toLowerCase().includes(q) ?? false)
        )
      })
    }
    return list
  }, [records, filter, query, scenarioFilter])

  // 统计
  const stats = useMemo(() => {
    const total = records.length
    const favorites = records.filter((r) => r.favorite).length
    const changing = records.filter((r) => r.changingLinePositions.length > 0).length
    const benIds = new Set(records.map((r) => r.benGuaId))
    return { total, favorites, changing, unique: benIds.size }
  }, [records])

  // 按日期分组（用于日历视图）
  const byDay = useMemo(() => {
    const map = new Map<string, typeof records>()
    for (const r of filtered) {
      const d = new Date(r.timestamp)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const arr = map.get(key) ?? []
      arr.push(r)
      map.set(key, arr)
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  const favoriteCount = records.filter((r) => r.favorite).length

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <div className="enter-up mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl tracking-[0.06em]">历史记录</h1>
          <p className="prose-body mt-2 text-bagua-muted">
            共 <span className="text-bagua-text">{stats.total}</span> 条
            {stats.favorites > 0 && (
              <>
                {' '}
                · <span className="text-bagua-primary">{stats.favorites}</span> 条收藏
              </>
            )}
            {stats.changing > 0 && (
              <>
                {' '}
                · <span className="text-bagua-text">{stats.changing}</span> 条有动爻
              </>
            )}
            {stats.unique > 0 && (
              <>
                {' '}
                · 涉及 <span className="text-bagua-text">{stats.unique}</span> 卦
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SyncIndicator />
        </div>
      </div>

      {/* 数据洞察卡片 */}
      {records.length > 0 && (
        <div className="paper-panel enter-up stagger-1 mb-6 grid grid-cols-2 gap-px border-4 border-bagua-text bg-bagua-text md:grid-cols-4">
          <Stat label="总起卦" value={stats.total} />
          <Stat label="收藏" value={stats.favorites} />
          <Stat label="动爻卦" value={stats.changing} />
          <Stat label="涉及卦数" value={stats.unique} />
        </div>
      )}

      {records.length > 0 && (
        <div className="enter-up stagger-2 mb-6 space-y-3">
          <div className="paper-panel--quiet border-4 border-bagua-fiber bg-bagua-surface p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search className="h-4 w-4 text-bagua-muted" />
                <input
                  type="text"
                  placeholder="搜索卦名、中文名、问题或备注"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent font-body text-sm text-bagua-text outline-none placeholder:text-bagua-muted"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto">
                {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`btn-press flex-shrink-0 border-4 px-3 py-1 font-display text-[11px] tracking-widest ${
                      filter === f
                        ? 'border-bagua-text bg-bagua-primary text-bagua-surface'
                        : 'border-transparent text-bagua-muted hover:border-bagua-text'
                    }`}
                  >
                    {FILTER_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1 border-t-2 border-bagua-fiber/40 pt-2">
              <span className="px-2 font-display text-[10px] tracking-widest text-bagua-muted">
                问事
              </span>
              <button
                onClick={() => setScenarioFilter(null)}
                className={`btn-press border-4 px-2 py-0.5 font-display text-[10px] ${
                  scenarioFilter === null
                    ? 'border-bagua-text bg-bagua-text text-bagua-surface'
                    : 'border-transparent text-bagua-muted hover:border-bagua-text'
                }`}
              >
                全部
              </button>
              {SCENARIO_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setScenarioFilter(scenarioFilter === s ? null : s)}
                  className={`btn-press border-4 px-2 py-0.5 font-display text-[10px] ${
                    scenarioFilter === s
                      ? 'border-bagua-text bg-bagua-text text-bagua-surface'
                      : 'border-transparent text-bagua-muted hover:border-bagua-text'
                  }`}
                >
                  {SCENARIO_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-1">
            <button
              onClick={() => setView('list')}
              className={`btn-press border-4 px-3 py-1 font-display text-[11px] tracking-widest ${
                view === 'list'
                  ? 'border-bagua-text bg-bagua-text text-bagua-surface'
                  : 'border-transparent text-bagua-muted hover:border-bagua-text'
              }`}
            >
              <ListChecks className="mr-1 inline h-3 w-3" />
              列表
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`btn-press border-4 px-3 py-1 font-display text-[11px] tracking-widest ${
                view === 'calendar'
                  ? 'border-bagua-text bg-bagua-text text-bagua-surface'
                  : 'border-transparent text-bagua-muted hover:border-bagua-text'
              }`}
            >
              <Calendar className="mr-1 inline h-3 w-3" />
              日历
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="paper-panel enter-up stagger-3 p-12 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-bagua-muted" />
          <p className="mt-4 font-body text-bagua-muted">
            {records.length === 0 ? '暂无起卦记录' : '没有匹配的记录'}
          </p>
          <Link href="/divine" className="btn-primary mt-6">
            前往起卦 →
          </Link>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-3">
          {filtered.map((r, idx) => {
            const gua = getGuaById(r.benGuaId)
            if (!gua) return null
            return (
              <HistoryRow
                key={r.id}
                r={r}
                gua={gua}
                idx={idx}
                onToggle={() => toggleFavorite(r.id)}
                onRemove={() => {
                  if (confirm('删除这条记录？')) removeRecord(r.id)
                }}
              />
            )
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {byDay.map(([day, items]) => (
            <section key={day}>
              <header className="mb-2 flex items-baseline gap-3 border-b-4 border-bagua-fiber pb-1">
                <span className="font-display text-sm tracking-widest text-bagua-primary">
                  {day}
                </span>
                <span className="font-body text-xs text-bagua-muted">{items.length} 条</span>
              </header>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.map((r) => {
                  const gua = getGuaById(r.benGuaId)
                  if (!gua) return null
                  return (
                    <Link
                      key={r.id}
                      href={`/result?id=${r.id}`}
                      prefetch={false}
                      className="btn-press flex items-center gap-3 border-4 border-bagua-fiber bg-bagua-surface p-3 hover:border-bagua-text hover:bg-bagua-wash"
                    >
                      <HexagramSymbol gua={gua} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm tracking-widest">{gua.name}</span>
                          {r.favorite && (
                            <Star className="h-3 w-3 fill-bagua-primary text-bagua-primary" />
                          )}
                        </div>
                        <div className="truncate font-body text-xs text-bagua-muted">
                          {new Date(r.timestamp).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {r.question && <> · {r.question}</>}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-bagua-canvas p-4 text-center">
      <div className="font-display text-3xl tracking-wider text-bagua-text">{value}</div>
      <div className="mt-1 font-display text-[10px] tracking-widest text-bagua-muted">{label}</div>
    </div>
  )
}

function HistoryRow({
  r,
  gua,
  idx,
  onToggle,
  onRemove,
}: {
  r: ReturnType<typeof useHistoryStore.getState>['records'][number]
  gua: NonNullable<ReturnType<typeof getGuaById>>
  idx: number
  onToggle: () => void
  onRemove: () => void
}) {
  const date = new Date(r.timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  const changing = r.changingLinePositions.length
  return (
    <div
      style={{ animationDelay: `${idx * 50}ms` }}
      className="paper-panel enter-up group flex items-center gap-4 p-4 cv-auto cis-xs"
    >
      <Link
        href={`/result?id=${r.id}`}
        prefetch={false}
        className="flex flex-1 items-center gap-4 min-w-0"
      >
        <div className="flex-shrink-0 border-4 border-bagua-fiber bg-bagua-canvas p-2">
          <HexagramSymbol gua={gua} size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-display text-lg tracking-wider">{gua.name}</span>
            {changing > 0 && (
              <span className="border-2 border-bagua-text bg-bagua-primary px-1.5 py-0.5 font-display text-[10px] tracking-widest text-bagua-surface">
                {changing} 动
              </span>
            )}
            {r.scenario && (
              <span className="border-2 border-bagua-fiber px-1.5 py-0.5 font-display text-[10px] tracking-widest text-bagua-text">
                {SCENARIO_LABELS[r.scenario]}
              </span>
            )}
            {r.favorite && <Star className="h-3.5 w-3.5 fill-bagua-primary text-bagua-primary" />}
          </div>
          <div className="flex items-center gap-2 truncate font-body text-xs text-bagua-muted">
            <span>{date}</span>
            <span>·</span>
            <span>{CAST_METHOD_LABELS[r.method] ?? '历史起卦'}</span>
            {r.question && (
              <>
                <span>·</span>
                <span className="truncate">{r.question}</span>
              </>
            )}
          </div>
          {r.notes && (
            <p className="mt-2 truncate font-body text-xs italic text-bagua-muted">
              备注：{r.notes}
            </p>
          )}
        </div>
      </Link>
      <div className="flex items-center gap-1 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
        <button
          onClick={onToggle}
          aria-label={r.favorite ? '取消收藏' : '收藏'}
          aria-pressed={r.favorite}
          className="btn-press flex h-8 w-8 items-center justify-center text-bagua-muted hover:text-bagua-primary"
        >
          <Star
            className={`h-4 w-4 ${r.favorite ? 'fill-bagua-primary text-bagua-primary' : ''}`}
          />
        </button>
        <button
          onClick={onRemove}
          aria-label="删除此记录"
          className="btn-press flex h-8 w-8 items-center justify-center text-bagua-muted hover:text-bagua-primary"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
