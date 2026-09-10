'use client'

import { TRIGRAM_SYMBOLS } from '@/lib/qigua/bagua'
import type { TrigramName } from '@/lib/qigua/types'

const WHEEL: TrigramName[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

interface TrigramWheelProps {
  value: TrigramName | null
  onChange: (name: TrigramName | null) => void
}

export function TrigramWheel({ value, onChange }: TrigramWheelProps) {
  return (
    <div
      className="flex flex-wrap gap-px border-4 border-bagua-text bg-bagua-text"
      role="group"
      aria-label="先天八卦"
    >
      {WHEEL.map((name) => {
        const active = value === name
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(active ? null : name)}
            className={`min-w-[3.5rem] flex-1 bg-bagua-canvas px-2 py-2 font-display text-xs tracking-widest ${
              active ? 'bg-bagua-primary text-bagua-surface' : 'hover:bg-bagua-surface'
            }`}
          >
            <span className="block text-base leading-none">{TRIGRAM_SYMBOLS[name]}</span>
            {name}
          </button>
        )
      })}
    </div>
  )
}
