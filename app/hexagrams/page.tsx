import Link from 'next/link'
import { HexagramGrid } from '@/components/hexagram/HexagramGrid'

export const metadata = {
  title: '64卦 · bagua',
}

export default function HexagramsPage() {
  return (
    <main className="min-h-screen bg-bagua-canvas">
      <header className="border-b border-bagua-border/30 bg-bagua-surface/60 backdrop-blur-md">
        <div className="container mx-auto flex items-center gap-3 px-6 py-4">
          <Link
            href="/"
            className="font-body text-sm text-bagua-muted transition hover:text-bagua-text"
          >
            ← 返回首页
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-bagua-text">
            六十四卦
          </h1>
          <p className="mt-2 font-body text-bagua-muted">
            周易全经 · 每卦含卦辞、彖传、象传、六爻爻辞
          </p>
        </div>

        <HexagramGrid />
      </section>
    </main>
  )
}
