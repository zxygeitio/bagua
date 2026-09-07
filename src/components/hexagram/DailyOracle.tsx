'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
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
  const existing = records.find((record) => record.kind === 'daily' && calendarKey(new Date(record.timestamp)) === key)

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
    <div className="pixel-frame bg-bagua-surface p-5">
      <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">今日之象 · {key}</p>
      <div className="mt-4 flex items-center gap-4">
        <HexagramSymbol gua={gua} size="sm" />
        <span>
          <span className="block font-display text-lg tracking-widest">{gua.name}</span>
          <span className="mt-1 block font-body text-xs text-bagua-muted">每天只生一象，点开按朱熹断法来读。</span>
        </span>
      </div>
      {existing ? (
        <Link href={`/result?id=${existing.id}`} className="btn-secondary mt-4">
          已存今日记录
        </Link>
      ) : (
        <button type="button" onClick={openToday} className="btn-primary mt-4">
          开启今日
        </button>
      )}
    </div>
  )
}
