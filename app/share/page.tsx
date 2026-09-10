'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { ArrowRight, HexagramPattern, Sparkles, Taiji } from '@/components/icons'
import { getGuaById } from '@/lib/iching'

interface SharedLine {
  p: number
  y: number
  c: number
}

interface SharedData {
  m?: string
  q?: string
  l: SharedLine[]
  t?: number
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] items-center justify-center">
          <p className="font-body text-bagua-muted">加载中...</p>
        </main>
      }
    >
      <SharePageInner />
    </Suspense>
  )
}

function SharePageInner() {
  const searchParams = useSearchParams()
  const [decoded, setDecoded] = useState<SharedData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const d = searchParams.get('d')
    if (!d) {
      setError('链接无效：缺少分享数据')
      return
    }
    try {
      const json = decodeURIComponent(escape(atob(d)))
      const parsed = JSON.parse(json) as SharedData
      if (!parsed || !Array.isArray(parsed.l)) {
        setError('链接数据格式错误')
        return
      }
      setDecoded(parsed)
    } catch (e) {
      console.error('解码失败:', e)
      setError('链接解码失败，可能已损坏')
    }
  }, [searchParams])

  if (!mounted) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="font-body text-bagua-muted">加载中...</p>
      </main>
    )
  }

  if (error || !decoded) {
    return <ErrorState message={error ?? '链接无效'} />
  }

  let benGuaId = 0
  for (let i = 0; i < 6; i++) {
    const bit = decoded.l[i]?.y === 1 ? 1 : 0
    benGuaId = (benGuaId << 1) | bit
  }
  benGuaId += 1

  const benGua = getGuaById(benGuaId)

  if (!benGua) {
    return <ErrorState message="卦象数据无效" />
  }

  const date = decoded.t ? new Date(decoded.t).toLocaleString('zh-CN') : ''
  const methodMap: Record<string, string> = {
    coins: '硬币法',
    yarrow: '大衍筮法',
    manual: '手动选卦（历史）',
    meihua: '梅花易数（历史）',
    time: '时间起卦（历史）',
  }
  const method = methodMap[decoded.m ?? ''] ?? '历史起卦'

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
      {/* 顶部装饰：太极 + 卦象 */}
      <div className="enter-up mb-10 flex flex-col items-center text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-bagua-primary/40" />
          <div className="absolute inset-2 rounded-full border-2 border-bagua-fiber/60" />
          <Taiji className="relative h-14 w-14 text-bagua-primary" />
        </div>
        <p className="section-kicker">他人分享的起卦</p>
        <h1 className="mt-3 font-display text-4xl tracking-[0.06em] md:text-5xl">观象</h1>
        <p className="prose-body mt-3 text-bagua-muted">
          受人之卦，先静心，次读象。一念入，方得解。
        </p>
      </div>

      {decoded.q && (
        <div className="enter-up stagger-1 paper-panel mb-6 p-5">
          <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">问</p>
          <p className="prose-classical mt-2 text-[19px]">{decoded.q}</p>
        </div>
      )}

      {/* 卦象主体 */}
      <div className="enter-up stagger-2 paper-panel pixel-frame relative overflow-hidden p-10 text-center md:p-14">
        {/* 装饰圆环 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full border-4 border-bagua-primary/20" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full border-4 border-bagua-fiber/30" />
        </div>

        <div className="relative">
          <p className="font-display text-[10px] tracking-[0.28em] text-bagua-muted">
            {date} · {method}
          </p>
          <div className="my-6 flex justify-center">
            <div className="paper-panel--quiet border-4 border-bagua-text bg-bagua-canvas p-4">
              <HexagramSymbol gua={benGua} size="lg" />
            </div>
          </div>
          <h2 className="font-display text-4xl tracking-[0.1em] text-bagua-text">{benGua.name}</h2>
          <p className="mt-2 font-body text-sm tracking-widest text-bagua-muted">
            #{benGua.id.toString().padStart(2, '0')} / 64 · {benGua.pronunciation} · 五行属
            {benGua.wuxing}
          </p>
        </div>
      </div>

      {/* 卦辞 */}
      <div className="enter-up stagger-3 paper-panel mt-6 p-6">
        <h3 className="mb-3 font-display text-xs tracking-[0.28em] text-bagua-primary">卦辞</h3>
        <p className="prose-classical text-[19px]">{benGua.guaci}</p>
      </div>

      {/* 现代启示 */}
      <div className="enter-up stagger-4 paper-panel mt-6 p-6">
        <h3 className="mb-3 flex items-center gap-2 font-display text-xs tracking-[0.28em] text-bagua-primary">
          <Sparkles className="h-4 w-4" />
          现代启示
        </h3>
        <p className="prose-body">{benGua.modernInsight}</p>
      </div>

      {/* CTA */}
      <div className="enter-up stagger-5 mt-10 flex flex-col items-center gap-4">
        <p className="font-display text-[10px] tracking-[0.28em] text-bagua-muted">
          — 起一卦，问己心 —
        </p>
        <Link href="/divine" className="btn-primary">
          <HexagramPattern className="h-4 w-4" />
          立即起卦
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/hexagrams/${benGua.id}`}
          className="font-display text-xs tracking-widest text-bagua-primary hover:underline"
        >
          查看 {benGua.name} 全文解读 →
        </Link>
      </div>
    </main>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-bagua-primary/30" />
        <span className="font-display text-3xl text-bagua-primary">卦</span>
      </div>
      <p className="font-body text-lg text-bagua-text">{message}</p>
      <p className="prose-body mt-2 text-sm text-bagua-muted">链接可能已损坏或格式不兼容。</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-secondary">
          返回首页
        </Link>
        <Link href="/divine" className="btn-primary">
          立即起卦
        </Link>
      </div>
    </main>
  )
}
