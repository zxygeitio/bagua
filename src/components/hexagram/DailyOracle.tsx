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
    <div className="paper-panel relative overflow-hidden border-4 border-bagua-text bg-bagua-surface p-6">
      {/* 装饰：右上角朱印 */}
      <span
        className="stamp absolute -right-2 -top-2 rotate-12 opacity-80"
        style={{ fontSize: 11, padding: '2px 8px' }}
      >
        每日一卦
      </span>

      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-bagua-primary" />
        <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">
          今日之象 · {key}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <div className="paper-panel--quiet flex-shrink-0 border-2 border-bagua-text bg-bagua-canvas p-3">
          <HexagramSymbol gua={gua} size="md" />
        </div>
        <div className="flex-1">
          <div className="font-display text-2xl tracking-widest text-bagua-text">{gua.name}</div>
          <p className="mt-0.5 font-body text-xs text-bagua-muted">
            #{gua.id.toString().padStart(2, '0')} / 64 · {gua.pronunciation}
          </p>
          <p className="mt-2 line-clamp-2 font-body text-xs leading-relaxed text-bagua-muted">
            {gua.guaci}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {existing ? (
          <Link href={`/result?id=${existing.id}`} className="btn-secondary flex-1">
            查看今日记录
          </Link>
        ) : (
          <button type="button" onClick={openToday} className="btn-primary flex-1 glow-pulse">
            开启今日
          </button>
        )}
        <Link href={`/hexagrams/${gua.id}`} className="btn-secondary px-4">
          全文
        </Link>
      </div>
    </div>
  )
}
