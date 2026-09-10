'use client'

import Image from 'next/image'

const METHODS = [
  {
    title: '硬币法',
    sub: '三钱六掷 · 现代首选',
    image: '/icons/shortcut-coins.webp',
    shape: 'round',
    summary: '三枚铜钱各掷一次为一爻，六掷自下而上合成一卦。',
    detail:
      '铜钱以「字」为三、「背」为二。三钱之和：6 为老阴（变动）、7 为少阳、8 为少阴、9 为老阳（变动）。动爻阴阳互换后可得之卦，简单易行且感应敏锐。',
  },
  {
    title: '揲蓍法',
    sub: '大衍之数 · 古代正典',
    image: '/icons/learn-yarrow-3d.webp',
    shape: 'square',
    summary: '大衍之数五十，其用四十有九。分而为二，挂一以象三。',
    detail:
      '《周易·系辞》所载最古老正统之法。以四十九根蓍草历经四营三变而成一爻，十八变而成一卦。过程沉潜专注，最易息心宁神、感通造化。',
  },
  {
    title: '梅花易数',
    sub: '随时随处 · 象数合一',
    image: '/icons/learn-meihua-3d.webp',
    shape: 'square',
    summary: '宋代邵雍所创。以年月日时、物象方位起卦，不拘外物。',
    detail:
      '以天干地支、时辰数字除以八取卦（乾一兑二离三震四巽五坎六艮七坤八），除以六取动爻。行住坐卧皆可起卦，见机而作，契合万物自然之机。',
  },
] as const

export function MethodCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {METHODS.map((m, i) => (
        <article
          key={m.title}
          style={{ animationDelay: `${i * 80}ms` }}
          className="paper-panel enter-up flex flex-col justify-between p-5 border-4 border-bagua-text bg-bagua-surface shadow-soft"
        >
          <div>
            <header className="flex items-center gap-4 border-b border-bagua-fiber/60 pb-4">
              <div className={`${m.shape === 'round' ? 'relic-frame-round p-0' : 'relic-frame-square p-2'} h-20 w-20 md:h-22 md:w-22 flex-shrink-0 shadow-xs transition duration-300 hover:scale-105`}>
                <Image
                  src={m.image}
                  alt={m.title}
                  width={128}
                  height={128}
                  className="antique-blend h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-display text-lg tracking-wider text-bagua-text">{m.title}</h3>
                <p className="font-body text-xs text-bagua-muted">{m.sub}</p>
              </div>
            </header>
            <p className="mt-3.5 font-display text-xs tracking-wide text-bagua-primary">{m.summary}</p>
            <p className="mt-2 font-body text-xs leading-relaxed text-bagua-muted">{m.detail}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
