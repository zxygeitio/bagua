import Link from 'next/link'

import { BaguaCompass } from '@/components/home/BaguaCompass'
import { DailyOracle } from '@/components/hexagram/DailyOracle'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import {
  ArrowRight,
  Coins,
  Earth,
  Fire,
  Hand,
  Heart,
  HexagramPattern,
  Leaf,
  Metal,
  Sparkles,
  Star,
  Taiji,
  Water,
  Wood,
  Wand,
} from '@/components/icons'
import { SiteShell } from '@/components/shared/SiteShell'
import { getAllHexagrams, getGuaById } from '@/lib/iching'

const FEATURED = [1, 2, 11, 24, 64]

const WUXING = [
  { tag: '金', gua: 1, color: 'metal', label: '金属', desc: '刚毅决断' },
  { tag: '木', gua: 3, color: 'wood', label: '木属', desc: '生发向上' },
  { tag: '水', gua: 5, color: 'water', label: '水属', desc: '润下流通' },
  { tag: '火', gua: 30, color: 'fire', label: '火属', desc: '炎上光明' },
  { tag: '土', gua: 2, color: 'earth', label: '土属', desc: '厚德载物' },
] as const

const WUXING_ICON = { wood: Wood, fire: Fire, earth: Earth, metal: Metal, water: Water } as const
const WUXING_TEXT = {
  wood: 'text-bagua-wood',
  fire: 'text-bagua-fire',
  earth: 'text-bagua-earth',
  metal: 'text-bagua-metal',
  water: 'text-bagua-water',
} as const

const METHOD_SHORTCUTS = [
  { href: '/divine', Icon: Coins, title: '快速起卦', desc: '三钱六掷 · 10 秒', recommended: true },
  { href: '/learn', Icon: Leaf, title: '易学入门', desc: '八卦 · 卦辞 · 读法', recommended: false },
  { href: '/hexagrams', Icon: Hand, title: '六十四卦', desc: '逐卦细读', recommended: false },
] as const

const SCENARIO_CARDS = [
  { tag: '事业', Icon: Hand, color: 'text-bagua-wood', hint: '项目 / 求职 / 决策' },
  { tag: '感情', Icon: Heart, color: 'text-bagua-fire', hint: '相处 / 抉择 / 复合' },
  { tag: '财运', Icon: Metal, color: 'text-bagua-metal', hint: '投资 / 决策 / 风险' },
  { tag: '健康', Icon: Leaf, color: 'text-bagua-wood', hint: '作息 / 调养 / 心态' },
  { tag: '学业', Icon: Sparkles, color: 'text-bagua-water', hint: '方向 / 节奏 / 考试' },
  { tag: '人际', Icon: Taiji, color: 'text-bagua-earth', hint: '合作 / 化解 / 边界' },
] as const

export default function HomePage() {
  const qian = getGuaById(1)
  const all = getAllHexagrams()
  void all // 当前不用

  return (
    <SiteShell>
      <main>
        {/* ========== Hero ========== */}
        <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-10 md:min-h-[calc(100svh-4.5rem)] md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:px-6 md:py-0">
          {/* 背景：朱印装饰 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-20 h-72 w-72 rounded-full border-4 border-bagua-primary/15" />
            <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full border-2 border-bagua-fiber/40" />
            <div className="absolute right-1/4 top-10 text-[18rem] font-display leading-none text-bagua-primary/5 select-none">
              卜
            </div>
          </div>

          <div className="enter-up relative max-w-xl">
            <p className="section-kicker">周易 · 草纸刻本</p>
            <h1 className="mt-5 font-display text-6xl leading-none tracking-[0.06em] text-bagua-text md:text-[7.5rem]">
              八卦
            </h1>
            <div className="paper-rule-fade mt-6 max-w-sm" />
            <p className="prose-body mt-5 text-pretty text-bagua-muted">
              三钱成爻，梅花取数。动爻多少，决定读卦辞还是爻辞。
              这是一个面向初学者与读卦者的现代工具——保留古意，不拘仪式。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/divine" className="btn-primary">
                <Wand className="h-4 w-4" />
                起卦问事
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/hexagrams" className="btn-secondary">
                <HexagramPattern className="h-4 w-4" />
                六十四卦
              </Link>
              <Link href="/learn" className="btn-secondary">
                <Book className="h-4 w-4" />
                易学入门
              </Link>
            </div>

            {/* 场景直达 */}
            <div className="mt-8">
              <p className="mb-2 font-display text-[10px] tracking-[0.28em] text-bagua-muted">
                或从问事起 —
              </p>
              <div className="flex flex-wrap gap-2">
                {SCENARIO_CARDS.map((s) => {
                  const Icon = s.Icon
                  return (
                    <Link
                      key={s.tag}
                      href="/divine"
                      className="btn-press group flex items-center gap-2 border-4 border-bagua-fiber bg-bagua-surface px-3 py-1.5 hover:border-bagua-text hover:bg-bagua-wash"
                    >
                      <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                      <span className="font-display text-xs tracking-widest">{s.tag}</span>
                      <span className="hidden font-body text-[10px] text-bagua-muted md:inline">
                        {s.hint}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="mt-8">
              <DailyOracle />
            </div>
          </div>

          {/* 右侧：太极图 + 四正卦 */}
          <div className="enter-up stagger-2 relative hidden justify-self-center md:flex md:items-center md:justify-center">
            <div className="relative h-[24rem] w-[24rem]">
              <TaijiMandala />
            </div>
          </div>
        </section>

        {/* ========== 入口卡片 ========== */}
        <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div className="enter-up grid gap-3 md:grid-cols-3">
            {METHOD_SHORTCUTS.map((m, i) => {
              const Icon = m.Icon
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="paper-panel enter-up group flex items-center gap-4 p-5 hover:border-bagua-text"
                >
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-4 border-bagua-text bg-bagua-wash text-bagua-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base tracking-wider">{m.title}</span>
                      {m.recommended && (
                        <span className="border-2 border-bagua-text bg-bagua-primary px-1.5 py-0.5 font-display text-[9px] tracking-widest text-bagua-surface">
                          推荐
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-body text-xs text-bagua-muted">{m.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-bagua-muted transition group-hover:translate-x-1 group-hover:text-bagua-primary" />
                </Link>
              )
            })}
          </div>
        </section>

        {/* ========== 五行索引 ========== */}
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="enter-up mb-4 flex items-end justify-between">
            <div>
              <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">
                SECTION / 02
              </p>
              <h2 className="mt-1 font-display text-3xl tracking-wider">五行索引</h2>
              <p className="mt-1 font-body text-sm text-bagua-muted">
                万物皆五行所生，卦亦不离。点击进入其代表卦。
              </p>
            </div>
            <Link
              href="/hexagrams"
              className="font-display text-xs tracking-widest text-bagua-primary hover:underline"
            >
              全部 64 卦 →
            </Link>
          </div>
          <div className="enter-up grid grid-cols-2 gap-3 sm:grid-cols-5">
            {WUXING.map(({ tag, gua: id, color, label, desc }, i) => {
              const gua = getGuaById(id)
              const Icon = WUXING_ICON[color as keyof typeof WUXING_ICON]
              const txt = WUXING_TEXT[color as keyof typeof WUXING_TEXT]
              if (!gua) return null
              return (
                <Link
                  key={tag}
                  href={`/hexagrams/${id}`}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="paper-panel enter-up group flex flex-col items-center gap-2 p-5 hover:border-bagua-text"
                >
                  <Icon className={`h-8 w-8 ${txt}`} strokeWidth={1.5} />
                  <div className="mt-1 font-display text-2xl tracking-widest text-bagua-text">
                    {tag}
                  </div>
                  <HexagramSymbol gua={gua} size="sm" />
                  <div className="font-display text-sm tracking-widest">{gua.name}</div>
                  <p className="text-balance text-center font-body text-[10px] text-bagua-muted">
                    {label} · {desc}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ========== 先天八卦方位 ========== */}
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="enter-up mb-4 flex items-end justify-between">
            <div>
              <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">
                SECTION / 03
              </p>
              <h2 className="mt-1 font-display text-3xl tracking-wider">先天八卦方位</h2>
              <p className="mt-1 font-body text-sm text-bagua-muted">
                伏羲所作，乾南坤北、离东坎西。八方位以应天地之理。
              </p>
            </div>
            <Link href="/learn" className="font-display text-xs tracking-widest text-bagua-primary hover:underline">
              学习更多 →
            </Link>
          </div>
          <div className="enter-up paper-panel flex justify-center p-8 md:p-12">
            <BaguaCompass />
          </div>
        </section>

        {/* ========== 精选卦象 ========== */}
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:pb-20">
          <div className="enter-up mb-4 flex items-end justify-between">
            <div>
              <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">
                SECTION / 04
              </p>
              <h2 className="mt-1 font-display text-3xl tracking-wider">精选卦象</h2>
              <p className="mt-1 font-body text-sm text-bagua-muted">
                64 卦中的几个关键节点：始、终、泰、复、未济。
              </p>
            </div>
            <Link
              href="/hexagrams"
              className="font-display text-xs tracking-widest text-bagua-primary hover:underline"
            >
              查看全部 →
            </Link>
          </div>
          <div className="enter-up grid grid-cols-2 gap-3 md:grid-cols-5">
            {FEATURED.map((id, i) => {
              const gua = getGuaById(id)
              if (!gua) return null
              return (
                <Link
                  key={id}
                  href={`/hexagrams/${id}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="paper-panel enter-up group flex flex-col items-center gap-2 p-5 hover:bg-bagua-wash"
                >
                  <div className="flex w-full items-center justify-between font-display text-[10px] tracking-widest text-bagua-muted">
                    <span>#{id.toString().padStart(2, '0')}</span>
                    {i === 0 && <Star className="h-3 w-3 fill-bagua-primary text-bagua-primary" />}
                  </div>
                  <div className="my-2 transition group-hover:scale-110">
                    <HexagramSymbol gua={gua} size="md" />
                  </div>
                  <span className="font-display text-base tracking-widest group-hover:text-bagua-primary">
                    {gua.name}
                  </span>
                  <p className="text-balance text-center font-body text-[11px] leading-relaxed text-bagua-muted">
                    {gua.guaci}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </SiteShell>
  )
}

function TaijiMandala() {
  return (
    <div className="relative h-full w-full">
      {/* 三层装饰圆 */}
      <div className="absolute inset-0 rounded-full border-4 border-bagua-primary/40" />
      <div className="absolute inset-3 rounded-full border-2 border-bagua-fiber/60" />
      <div className="absolute inset-6 rounded-full border border-bagua-fiber/30" />

      {/* 四正卦 — 上下左右 */}
      <CornerSymbol gua={getGuaById(1)!} pos="top" label="乾" desc="天 · 健" />
      <CornerSymbol gua={getGuaById(2)!} pos="bottom" label="坤" desc="地 · 顺" />
      <CornerSymbol gua={getGuaById(30)!} pos="right" label="离" desc="火 · 丽" />
      <CornerSymbol gua={getGuaById(5)!} pos="left" label="坎" desc="水 · 陷" />

      {/* 中心太极 */}
      <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-bagua-text bg-bagua-wash shadow-[4px_4px_0_rgba(44,36,22,0.18)]">
        <svg viewBox="0 0 24 24" className="h-24 w-24 text-bagua-primary">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M12 2 C8 2 5 5.5 5 10 C5 14.5 8 18 12 18 C16 18 19 14.5 19 10 C19 5.5 16 2 12 2 Z" fill="currentColor" />
          <path d="M12 22 C16 22 19 18.5 19 14 C19 9.5 16 6 12 6 C8 6 5 9.5 5 14 C5 18.5 8 22 12 22 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* 四隅装饰字 */}
      <span className="absolute left-4 top-4 font-display text-[10px] tracking-widest text-bagua-muted/60">東</span>
      <span className="absolute right-4 top-4 font-display text-[10px] tracking-widest text-bagua-muted/60">西</span>
      <span className="absolute left-4 bottom-4 font-display text-[10px] tracking-widest text-bagua-muted/60">北</span>
      <span className="absolute right-4 bottom-4 font-display text-[10px] tracking-widest text-bagua-muted/60">南</span>
    </div>
  )
}

function CornerSymbol({
  gua,
  pos,
  label,
  desc,
}: {
  gua: NonNullable<ReturnType<typeof getGuaById>>
  pos: 'top' | 'bottom' | 'left' | 'right'
  label: string
  desc: string
}) {
  const posClass: Record<typeof pos, string> = {
    top: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/3',
    bottom: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/3',
    left: 'left-0 top-1/2 -translate-x-1/3 -translate-y-1/2',
    right: 'right-0 top-1/2 translate-x-1/3 -translate-y-1/2',
  }
  return (
    <div
      className={`absolute flex h-20 w-20 flex-col items-center justify-center border-4 border-bagua-text bg-bagua-surface p-2 ${posClass[pos]}`}
    >
      <span className="font-display text-xl leading-none text-bagua-primary">{label}</span>
      <div className="my-1">
        <HexagramSymbol gua={gua} size="sm" />
      </div>
      <span className="font-display text-[9px] tracking-widest text-bagua-muted">{desc}</span>
    </div>
  )
}

// 占位 import 以确保 tree-shake 不掉 Book
import { Book } from '@/components/icons'
void Book
