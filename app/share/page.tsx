'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { SiteShell } from '@/components/shared/SiteShell'
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
    <Suspense fallback={
      <SiteShell>
        <main className="flex min-h-[50vh] items-center justify-center">
          <p className="font-body text-bagua-muted">加载中...</p>
        </main>
      </SiteShell>
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
      <SiteShell>
        <main className="flex min-h-[50vh] items-center justify-center">
          <p className="font-body text-bagua-muted">加载中...</p>
        </main>
      </SiteShell>
    )
  }

  if (error || !decoded) {
    return (
      <SiteShell>
        <main className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <p className="font-body text-bagua-muted">{error ?? '链接无效'}</p>
            <Link href="/" className="mt-4 inline-block font-display text-sm text-bagua-primary">返回首页</Link>
          </div>
        </main>
      </SiteShell>
    )
  }

  let benGuaId = 0
  for (let i = 0; i < 6; i++) {
    const bit = decoded.l[i]?.y === 1 ? 1 : 0
    benGuaId = (benGuaId << 1) | bit
  }
  benGuaId += 1

  const benGua = getGuaById(benGuaId)

  if (!benGua) {
    return (
      <SiteShell>
        <main className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <p className="font-body text-bagua-muted">卦象数据无效</p>
            <Link href="/" className="mt-4 inline-block font-display text-sm text-bagua-primary">返回首页</Link>
          </div>
        </main>
      </SiteShell>
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
    <SiteShell eyebrow="SHARE / 只读">
      <main className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        {decoded.q ? <p className="prose-classical">问：{decoded.q}</p> : null}
        <div className="pixel-frame mt-8 bg-bagua-surface p-10 text-center">
          <p className="font-display text-[11px] tracking-[0.2em] text-bagua-muted">{date} · {method}</p>
          <div className="my-6 flex justify-center">
            <HexagramSymbol gua={benGua} size="lg" />
          </div>
          <h1 className="font-display text-3xl tracking-[0.16em]">{benGua.name}</h1>
        </div>
        <section className="mt-8">
          <h2 className="font-display text-xs tracking-[0.28em] text-bagua-primary">卦辞</h2>
          <p className="prose-classical mt-3">{benGua.guaci}</p>
        </section>
        <div className="mt-10 text-center">
          <Link href="/divine" className="btn-primary">立即起卦</Link>
        </div>
      </main>
    </SiteShell>
  )
}
