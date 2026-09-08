'use client'

import { Coins } from '@/components/icons'

const METHODS = [
  {
    title: '硬币法',
    sub: '三钱六掷',
    Icon: Coins,
    summary: '三枚铜钱各掷一次为一爻。六爻合成一卦。',
    detail:
      '铜钱以「字」为 3、「背」为 2。三钱之和：6 为老阴（动）、7 为少阳、8 为少阴、9 为老阳（动）。六爻从初爻到上爻记录，动爻阴阳互换后得之卦。',
  },
] as const

export function MethodCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {METHODS.map((m, i) => {
        const Icon = m.Icon
        return (
          <article
            key={m.title}
            style={{ animationDelay: `${i * 80}ms` }}
            className="paper-panel enter-up p-5"
          >
            <header className="flex items-start gap-3">
              <span
                aria-hidden
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-4 border-bagua-text bg-bagua-canvas text-bagua-primary"
              >
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-base tracking-wider">{m.title}</h3>
                <p className="font-body text-xs text-bagua-muted">{m.sub}</p>
              </div>
            </header>
            <p className="mt-3 font-body text-sm text-bagua-text">{m.summary}</p>
            <p className="prose-body mt-2 text-sm text-bagua-muted">{m.detail}</p>
          </article>
        )
      })}
    </div>
  )
}
