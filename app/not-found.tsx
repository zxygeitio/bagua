import Link from 'next/link'

import { ArrowRight, HexagramPattern, Taiji, Wand } from '@/components/icons'

export default function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-3xl flex-col items-center justify-center px-4 py-12 text-center md:px-6">
      {/* 装饰：未济卦 #64 — 一切尚未完成 */}
      <div className="enter-up relative mb-10 flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-bagua-primary/40" />
        <div className="absolute inset-3 rounded-full border-2 border-bagua-fiber/50" />
        <div className="absolute inset-6 rounded-full border border-bagua-fiber/30" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-bagua-text bg-bagua-wash">
          <Taiji className="h-14 w-14 text-bagua-primary" />
        </div>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-2 border-bagua-text bg-bagua-canvas px-3 py-0.5 font-display text-[10px] tracking-widest text-bagua-text">
          未济 · #64
        </span>
      </div>

      <p className="section-kicker enter-up stagger-1">HTTP 404 · 失象</p>
      <h1 className="enter-up stagger-2 mt-4 font-display text-6xl tracking-[0.06em] text-bagua-text md:text-7xl">
        此页未成
      </h1>
      <div className="enter-up stagger-3 paper-rule-fade mt-5 max-w-sm" />
      <p className="prose-body enter-up stagger-4 mt-5 max-w-md text-pretty text-bagua-muted">
        火在水上，未济也。所寻之页或尚未写就，或已迁去。 退一步，或转他处，皆是行得通。
      </p>

      <div className="enter-up stagger-5 mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          <Taiji className="h-4 w-4" />
          返回首页
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/divine" className="btn-secondary">
          <Wand className="h-4 w-4" />
          起一卦
        </Link>
        <Link href="/hexagrams" className="btn-secondary">
          <HexagramPattern className="h-4 w-4" />
          64 卦
        </Link>
      </div>

      <div className="enter-up stagger-6 mt-16 grid grid-cols-3 gap-px border-4 border-bagua-text bg-bagua-text">
        <Link href="/hexagrams/1" className="bg-bagua-canvas p-4 hover:bg-bagua-wash">
          <p className="font-display text-[10px] tracking-widest text-bagua-muted">#01</p>
          <p className="mt-1 font-display text-lg tracking-widest text-bagua-text">乾为天</p>
        </Link>
        <Link href="/hexagrams/2" className="bg-bagua-canvas p-4 hover:bg-bagua-wash">
          <p className="font-display text-[10px] tracking-widest text-bagua-muted">#02</p>
          <p className="mt-1 font-display text-lg tracking-widest text-bagua-text">坤为地</p>
        </Link>
        <Link href="/hexagrams/64" className="bg-bagua-canvas p-4 hover:bg-bagua-wash">
          <p className="font-display text-[10px] tracking-widest text-bagua-muted">#64</p>
          <p className="mt-1 font-display text-lg tracking-widest text-bagua-text">火水未济</p>
        </Link>
      </div>
    </main>
  )
}
