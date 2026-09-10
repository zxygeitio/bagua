'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { Sparkles } from '@/components/icons'
import { buildHexagram } from '@/lib/qigua'
import { calendarKey, castDaily } from '@/lib/qigua/daily'
import { performDivination } from '@/services/divination.service'
import { useHistoryStore } from '@/store/history'

export function DailyOracle() {
  const router = useRouter()
  const addRecord = useHistoryStore((state) => state.addRecord)
  const records = useHistoryStore((state) => state.records)

  const today = useMemo(() => new Date(), [])
  const lines = useMemo(() => castDaily(today), [today])
  const gua = useMemo(() => buildHexagram(lines).gua, [lines])
  const key = calendarKey(today)
  const existing = records.find(
    (record) => record.kind === 'daily' && calendarKey(new Date(record.timestamp)) === key,
  )

  const openToday = async () => {
    if (existing) {
      router.push(`/result?id=${existing.id}`)
      return
    }
    const record = await performDivination({
      method: 'coins',
      kind: 'daily',
      question: `${key} 今日之象`,
      lines,
    })
    await addRecord(record)
    router.push(`/result?id=${record.id}`)
  }

  return (
    <div className="paper-panel relative overflow-hidden border-4 border-bagua-text bg-bagua-surface p-5 md:p-6 shadow-soft">
      {/* 顶部状态与导航条 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bagua-fiber/50 pb-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-bagua-primary" />
          <span className="font-display text-xs tracking-[0.24em] text-bagua-primary">
            今日之象 · {key}
          </span>
          <span className="border border-bagua-primary/40 bg-bagua-wash px-1.5 py-0.5 font-display text-[10px] tracking-widest text-bagua-primary">
            每日一卦
          </span>
        </div>
        <Link
          href="/hexagrams"
          className="draw-underline font-display text-xs tracking-[0.16em] text-bagua-muted transition hover:text-bagua-primary"
        >
          浏览六十四卦 →
        </Link>
      </div>

      {/* 核心内容区 */}
      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* 左侧：卦符与卦名释义 */}
        <div className="flex items-center gap-5">
          <div className="paper-panel--quiet flex-shrink-0 border-2 border-bagua-text bg-bagua-canvas p-3 shadow-sm">
            <HexagramSymbol gua={gua} size="md" />
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl tracking-widest text-bagua-text md:text-3xl">
                {gua.name}
              </span>
              <span className="font-mono text-xs text-bagua-muted">
                #{gua.id.toString().padStart(2, '0')} · {gua.pronunciation}
              </span>
            </div>
            <p className="mt-2 max-w-xl font-body text-xs leading-relaxed text-bagua-muted md:text-sm">
              {gua.guaci}
            </p>
          </div>
        </div>

        {/* 右侧：操作区 */}
        <div className="flex flex-shrink-0 items-center gap-3">
          {existing ? (
            <Link
              href={`/result?id=${existing.id}`}
              className="btn-secondary px-5 py-2.5 text-xs font-medium"
            >
              查看今日记录
            </Link>
          ) : (
            <button
              type="button"
              onClick={openToday}
              className="btn-primary glow-pulse px-6 py-2.5 text-xs font-medium"
            >
              开启今日
            </button>
          )}
          <Link
            href={`/hexagrams/${gua.id}`}
            className="btn-secondary px-4 py-2.5 text-xs font-medium"
          >
            全文
          </Link>
        </div>
      </div>
    </div>
  )
}
