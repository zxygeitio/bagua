import Image from 'next/image'
import { HexagramGrid } from '@/components/hexagram/HexagramGrid'

export const metadata = {
  title: '六十四卦',
}

export default function HexagramsPage() {
  return (
    <SiteShell eyebrow="HEXAGRAMS / 02">
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="enter-up mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl tracking-[0.16em] md:text-5xl">六十四卦</h1>
            <p className="prose-body mt-3 text-bagua-muted">
              周易全经。点开一格，读卦辞、彖传、象传与六爻。
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3.5 border-4 border-bagua-text bg-bagua-surface p-3.5 shadow-soft">
            <div className="relic-frame-round h-16 w-16 md:h-18 md:w-18 flex-shrink-0 p-0 shadow-xs">
              <Image
                src="/icons/hexagrams-hero-3d.webp"
                alt="浑天仪八卦天盘"
                width={112}
                height={112}
                className="antique-blend h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <p className="font-display text-xs tracking-wider text-bagua-primary">浑天星历 · 六十四卦经</p>
              <p className="font-mono text-[10px] text-bagua-muted">八宫周转 · 六十四卦立体总览</p>
            </div>
          </div>
        </div>
        <div className="mt-8 enter-up stagger-2">
          <HexagramGrid />
        </div>
      </main>
    </SiteShell>
  )
}
