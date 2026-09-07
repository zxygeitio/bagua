import Link from 'next/link'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { ArrowRight } from '@/components/icons'
import { SiteShell } from '@/components/shared/SiteShell'
import { getGuaById } from '@/lib/iching'

export default function HomePage() {
  const qian = getGuaById(1)

  return (
    <SiteShell>
      <main>
        <section className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:px-6 md:py-0">
          <div className="enter-up max-w-xl">
            <p className="font-display text-[11px] tracking-[0.32em] text-bagua-primary">周易 · 草纸刻本</p>
            <h1 className="mt-5 font-display text-5xl leading-none tracking-[0.12em] text-bagua-text md:text-7xl">
              八卦
            </h1>
            <p className="prose-body mt-6 text-pretty text-bagua-muted">
              以铜钱蓍草之方，循文王周公之义。六十四卦，三百八十四爻，问一事，观一象。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/divine" className="btn-primary">
                起卦问事
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/hexagrams" className="btn-secondary">
                六十四卦
              </Link>
            </div>
            <ul className="mt-12 space-y-2 font-display text-xs tracking-[0.16em] text-bagua-muted">
              <li>硬币 · 蓍草 · 手动</li>
              <li>本卦 · 之卦 · 互卦 · 错卦 · 综卦</li>
              <li>通行本经文 · 现代启示</li>
            </ul>
          </div>

          <div className="enter-up stagger-2 justify-self-center">
            <div className="pixel-frame bg-bagua-surface p-8 md:p-12">
              {qian ? <HexagramSymbol gua={qian} size="lg" /> : null}
              <p className="mt-6 text-center font-display text-sm tracking-[0.2em]">乾为天</p>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
