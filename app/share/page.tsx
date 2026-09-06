'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { getGuaById } from '@/lib/iching'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

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
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-bagua-canvas">
        <p className="font-body text-bagua-muted">加载中...</p>
      </main>
    }>
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
      <main className="flex min-h-screen items-center justify-center bg-bagua-canvas">
        <p className="font-body text-bagua-muted">加载中...</p>
      </main>
    )
  }

  if (error || !decoded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bagua-canvas">
        <div className="text-center">
          <p className="font-body text-bagua-muted">{error ?? '链接无效'}</p>
          <Link
            href="/"
            className="mt-4 inline-block font-body text-bagua-primary hover:underline"
          >
            返回首页
          </Link>
        </div>
      </main>
    )
  }

  // 计算卦 ID（阴阳转二进制：阳=1, 阴=0，自下而上）
  let benGuaId = 0
  for (let i = 0; i < 6; i++) {
    const bit = decoded.l[i]?.y === 1 ? 1 : 0
    benGuaId = (benGuaId << 1) | bit
  }
  benGuaId += 1

  const benGua = getGuaById(benGuaId)

  if (!benGua) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bagua-canvas">
        <div className="text-center">
          <p className="font-body text-bagua-muted">卦象数据无效</p>
          <Link
            href="/"
            className="mt-4 inline-block font-body text-bagua-primary hover:underline"
          >
            返回首页
          </Link>
        </div>
      </main>
    )
  }

  const date = decoded.t ? new Date(decoded.t).toLocaleString('zh-CN') : ''
  const methodMap: Record<string, string> = {
    coins: '硬币法',
    yarrow: '蓍草法',
    manual: '手动选卦',
    meihua: '梅花易数',
    time: '时间起卦',
  }
  const method = methodMap[decoded.m ?? ''] ?? '手动选卦'

  return (
    <main className="min-h-screen bg-bagua-canvas">
      <header className="glass-card sticky top-0 z-50 border-b border-bagua-border/30">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-body text-sm text-bagua-muted transition hover:text-bagua-text"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <span className="flex items-center gap-1 rounded-pill border border-bagua-secondary/20 bg-bagua-secondary/5 px-3 py-1 font-body text-xs text-bagua-secondary">
            <Sparkles className="h-3 w-3" />
            分享的卦象
          </span>
        </div>
      </header>

      <section className="container mx-auto max-w-2xl px-6 py-12">
        {decoded.q && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-pill border border-bagua-primary/20 bg-bagua-primary/5 px-4 py-1.5 font-body text-sm text-bagua-primary">
              问：{decoded.q}
            </div>
          </div>
        )}

        <div className="glass-card mb-8 rounded-card p-12 text-center">
          <div className="mb-2 font-body text-xs text-bagua-muted">
            {date} · {method}
          </div>
          <div className="my-6 flex justify-center">
            <HexagramSymbol gua={benGua} size="lg" />
          </div>
          <h1 className="font-calligraphy text-4xl font-bold text-bagua-text">
            {benGua.name}
          </h1>
          <p className="mt-2 font-body text-sm text-bagua-muted">
            #{benGua.id} / 64 · {benGua.pronunciation}
          </p>
        </div>

        <div className="glass-card rounded-card p-6">
          <h3 className="mb-3 font-display text-lg font-bold text-bagua-text">卦辞</h3>
          <p className="font-calligraphy text-xl leading-relaxed text-bagua-text">
            {benGua.guaci}
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="font-body text-sm text-bagua-muted">
            也想体验完整的易经占卜？
          </p>
          <Link
            href="/divine"
            className="mt-3 inline-flex items-center gap-2 rounded-button bg-gradient-to-r from-bagua-primary to-bagua-secondary px-6 py-3 font-body font-medium text-white shadow-soft transition hover:shadow-glow"
          >
            <Sparkles className="h-4 w-4" />
            立即起卦
          </Link>
        </div>
      </section>
    </main>
  )
}