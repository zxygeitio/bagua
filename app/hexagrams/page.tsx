import { HexagramGrid } from '@/components/hexagram/HexagramGrid'
import { SiteShell } from '@/components/shared/SiteShell'

export const metadata = {
  title: '六十四卦',
}

export default function HexagramsPage() {
  return (
    <SiteShell eyebrow="HEXAGRAMS / 02">
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="enter-up font-display text-4xl tracking-[0.16em] md:text-5xl">六十四卦</h1>
        <p className="prose-body mt-3 text-bagua-muted">
          周易全经。点开一格，读卦辞、彖传、象传与六爻。
        </p>
        <div className="mt-8 enter-up stagger-2">
          <HexagramGrid />
        </div>
      </main>
    </SiteShell>
  )
}
