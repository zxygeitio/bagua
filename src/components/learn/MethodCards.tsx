'use client'

import { Coins, Hand, Leaf, Sparkles, Wand } from '@/components/icons'

const METHODS = [
  {
    title: '硬币法',
    sub: '三钱六掷',
    Icon: Coins,
    summary: '三枚铜钱各掷一次为一爻。六爻合成一卦。',
    detail:
      '铜钱以「字」为 3、「背」为 2。三钱之和：6 为老阴（动）、7 为少阳、8 为少阴、9 为老阳（动）。动爻阴阳互换，得之卦。',
  },
  {
    title: '蓍草法',
    sub: '大衍揲占',
    Icon: Leaf,
    summary: '以 49 根蓍草经 18 变求一爻，仪式最郑重。',
    detail:
      '大衍之数五十，其用四十有九。每爻经「分二、挂一、揲四、归奇」三变，共 18 变后归余数。36 → 老阴、32 → 少阳、28 → 少阴、24 → 老阳。',
  },
  {
    title: '梅花易数',
    sub: '一念成卦',
    Icon: Sparkles,
    summary: '以时辰或所见数字、字数为象起卦。',
    detail:
      '取任意两个三位数以下数字，以上数为上卦、下数为下卦、两数之和取动爻。一念所得，皆可入卦。',
  },
  {
    title: '时间起卦',
    sub: '年⽉⽇时',
    Icon: Wand,
    summary: '以问卦之年月日时入先天数，得卦象。',
    detail:
      '年⽉⽇之和取上卦，年⽉⽇时之和取下卦，总和取动爻。数字过九则取个位。此法无需铜钱蓍草。',
  },
  {
    title: '手动选卦',
    sub: '学习模式',
    Icon: Hand,
    summary: '直接选择上下卦与动爻位置，适合初学。',
    detail:
      '不依赖随机，专为研究卦辞、爻辞与卦变关系而设。选定上下卦后，可挑一爻为动，以观之卦。',
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
