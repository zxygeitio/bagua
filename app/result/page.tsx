'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useHistoryStore } from '@/store/history'
import { getGuaById } from '@/lib/iching'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { SyncIndicator } from '@/components/SyncIndicator'
import { ShareDialog } from '@/components/ShareDialog'
import { ArrowLeft, Star, Trash2, Share2, RefreshCw, Sparkles } from 'lucide-react'

type Tab = 'ben' | 'bian' | 'hu' | 'dui' | 'zong'

const TAB_LABELS: Record<Tab, string> = {
  ben: '本卦',
  bian: '之卦',
  hu: '互卦',
  dui: '错卦',
  zong: '综卦',
}

export default function ResultPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('ben')
  const [recordId, setRecordId] = useState<string | null>(null)
  const [showShare, setShowShare] = useState(false)
  const records = useHistoryStore(s => s.records)
  const toggleFavorite = useHistoryStore(s => s.toggleFavorite)
  const removeRecord = useHistoryStore(s => s.removeRecord)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setRecordId(params.get('id'))
    }
  }, [])

  const record = recordId ? records.find(r => r.id === recordId) : undefined

  if (!record) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bagua-canvas">
        <div className="text-center">
          <p className="font-body text-bagua-muted">记录不存在或已删除</p>
          <Link href="/" className="mt-4 inline-block font-body text-bagua-primary hover:underline">
            返回首页
          </Link>
        </div>
      </main>
    )
  }

  const benGua = getGuaById(record.benGuaId)
  const activeGua = (() => {
    switch (activeTab) {
      case 'ben': return benGua
      case 'bian': return record.bianGuaId ? getGuaById(record.bianGuaId) : null
      case 'hu': return record.huGuaId ? getGuaById(record.huGuaId) : null
      case 'dui': return benGua ? getGuaById(benGua.duiGua) : null
      case 'zong': return benGua ? getGuaById(benGua.zongGua) : null
    }
  })()

  const methodLabel = record.method === 'coins' ? '硬币法' : record.method === 'yarrow' ? '蓍草法' : '手动选卦'
  const date = new Date(record.timestamp).toLocaleString('zh-CN')

  return (
    <main className="min-h-screen bg-bagua-canvas">
      <header className="border-b border-bagua-border/30 bg-bagua-surface/60 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-body text-sm text-bagua-muted transition hover:text-bagua-text">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-center gap-2">
            <SyncIndicator />
            <span className="hidden font-body text-xs text-bagua-muted md:inline">
              {date} · {methodLabel}
            </span>
            <button
              onClick={() => toggleFavorite(record.id)}
              className={`rounded-full p-2 transition ${record.favorite ? 'bg-bagua-accent/10 text-bagua-accent' : 'text-bagua-muted hover:bg-bagua-border/30'}`}
            >
              <Star className="h-5 w-5" fill={record.favorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => {
                if (confirm('确定要删除这条记录吗？')) {
                  removeRecord(record.id)
                  router.push('/history')
                }
              }}
              className="rounded-full p-2 text-bagua-muted transition hover:bg-bagua-border/30 hover:text-red-500"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <section className="container mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 text-center">
          <p className="font-body text-sm text-bagua-muted">{date} · {methodLabel}</p>
          {record.question && <p className="mt-2 font-calligraphy text-lg text-bagua-text">问：{record.question}</p>}
        </div>

        <div className="mb-8 rounded-card border border-bagua-border/40 bg-bagua-surface shadow-md">
          <div className="flex overflow-x-auto border-b border-bagua-border/30">
            {(['ben', 'bian', 'hu', 'dui', 'zong'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 whitespace-nowrap px-6 py-3 font-display text-sm font-medium transition ${activeTab === tab ? 'border-b-2 border-bagua-primary text-bagua-primary' : 'text-bagua-muted hover:text-bagua-text'}`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
          {activeGua ? (
            <div className="p-8 text-center">
              <div className="mb-4 flex justify-center"><HexagramSymbol gua={activeGua} size="lg" /></div>
              <h2 className="font-calligraphy text-3xl font-bold text-bagua-text">{activeGua.name}</h2>
              <p className="mt-2 font-body text-sm text-bagua-muted">#{activeGua.id} / 64 · {activeGua.pronunciation} · 五行属{activeGua.wuxing}</p>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="font-body text-bagua-muted">本次起卦无{TAB_LABELS[activeTab]}（无动爻）</p>
            </div>
          )}
        </div>

        {activeGua && (
          <div className="space-y-6">
            <div className="rounded-card border border-bagua-border/40 bg-bagua-surface p-6 shadow-md">
              <h3 className="mb-3 font-display text-lg font-bold text-bagua-text">卦辞</h3>
              <p className="font-calligraphy text-xl text-bagua-text">{activeGua.guaci}</p>
            </div>
            <div className="rounded-card border border-bagua-border/40 bg-bagua-surface p-6 shadow-md">
              <h3 className="mb-3 font-display text-lg font-bold text-bagua-text">彖传</h3>
              <p className="font-body leading-relaxed text-bagua-text">{activeGua.tuanZhuan}</p>
            </div>
            <div className="rounded-card border border-bagua-border/40 bg-bagua-surface p-6 shadow-md">
              <h3 className="mb-3 font-display text-lg font-bold text-bagua-text">象传</h3>
              <p className="font-calligraphy text-lg text-bagua-text">{activeGua.daXiangZhuan}</p>
            </div>
            <div className="rounded-card border border-bagua-secondary/40 bg-gradient-to-br from-bagua-secondary/5 to-bagua-surface p-6 shadow-md">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-bagua-secondary">
                <Sparkles className="h-5 w-5" />
                现代启示
              </h3>
              <p className="font-body leading-relaxed text-bagua-text">{activeGua.modernInsight}</p>
            </div>
          </div>
        )}

        {activeTab === 'ben' && benGua && (
          <div className="mt-6 rounded-card border border-bagua-border/40 bg-bagua-surface p-6 shadow-md">
            <h3 className="mb-4 font-display text-lg font-bold text-bagua-text">六爻详情</h3>
            <div className="space-y-4">
              {[...benGua.yaos].reverse().map((yao, idx) => {
                const pos = (6 - idx) as 1 | 2 | 3 | 4 | 5 | 6
                const isChanging = record.changingLinePositions.includes(pos)
                const yaoLabelYang = ['初九', '九二', '九三', '九四', '九五', '上九'][pos - 1]
                const yaoLabelYin = ['初六', '六二', '六三', '六四', '六五', '上六'][pos - 1]
                const label = yao.yinYang === 'yang' ? yaoLabelYang! : yaoLabelYin!
                return (
                  <div key={idx} className={`rounded-card border-l-4 pl-4 ${isChanging ? 'border-l-bagua-accent bg-bagua-accent/5' : 'border-l-bagua-border/40'}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`font-display text-base font-bold ${isChanging ? 'text-bagua-accent' : 'text-bagua-primary'}`}>{label}</span>
                      {isChanging && (<span className="rounded-full bg-bagua-accent/10 px-2 py-0.5 font-body text-xs text-bagua-accent">动爻</span>)}
                      <span className="font-body text-sm text-bagua-muted">{yao.yinYang === 'yang' ? '━━━' : '━ ━'}</span>
                    </div>
                    <p className="mb-1 font-calligraphy text-lg text-bagua-text">{yao.text}</p>
                    <p className="font-body text-sm text-bagua-muted">《象》曰：{yao.xiangZhuan}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/divine" className="inline-flex items-center gap-2 rounded-button border border-bagua-primary bg-bagua-primary px-6 py-3 font-body font-medium text-white transition hover:bg-bagua-primary/90">
            <RefreshCw className="h-4 w-4" />
            再来一卦
          </Link>
          <Link href="/history" className="inline-flex items-center gap-2 rounded-button border border-bagua-border/40 bg-bagua-surface px-6 py-3 font-body font-medium text-bagua-text transition hover:bg-bagua-border/30">
            查看历史
          </Link>
          <button
            onClick={() => setShowShare(true)}
            className="inline-flex items-center gap-2 rounded-button border border-bagua-border/40 bg-bagua-surface px-6 py-3 font-body font-medium text-bagua-text transition hover:bg-bagua-border/30"
          >
            <Share2 className="h-4 w-4" />
            分享
          </button>
        </div>
      </section>

      {showShare && (
        <ShareDialog recordId={record.id} onClose={() => setShowShare(false)} />
      )}
    </main>
  )
}
