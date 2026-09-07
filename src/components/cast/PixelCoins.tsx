'use client'

import type { CoinFace } from '@/lib/qigua/cast/coin'

interface PixelCoinsProps {
  coins: CoinFace[]
  tossing?: boolean
}

export function PixelCoins({ coins, tossing = false }: PixelCoinsProps) {
  return (
    <div className="flex justify-center gap-3" aria-label="三枚铜钱">
      {coins.map((face, index) => (
        <div
          key={`${index}-${face}-${tossing ? 't' : 's'}`}
          className={`pixel-coin ${face === 3 ? 'is-zi' : 'is-bei'} ${tossing ? 'is-toss' : ''}`}
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <span>{face === 3 ? '字' : '背'}</span>
        </div>
      ))}
    </div>
  )
}
