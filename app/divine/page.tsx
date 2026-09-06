'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronRight, Leaf, Hand } from 'lucide-react'
import { performDivination } from '@/services/divination.service'
import { useHistoryStore } from '@/store/history'

export default function DivinePage() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [method, setMethod] = useState<'coins' | 'yarrow' | 'manual'>('coins')
  const [isCasting, setIsCasting] = useState(false)
  const [progress, setProgress] = useState(0)
  const addRecord = useHistoryStore(s => s.addRecord)

  const handleCast = async () => {
    setIsCasting(true)
    setProgress(0)

    // 仪式动画进度
    const totalSteps = 6
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(r => setTimeout(r, method === 'yarrow' ? 800 : 400))
      setProgress(i)
    }

    try {
      const record = await performDivination({ method, question })
      addRecord(record)
      router.push(`/result/${record.id}`)
    } catch (e) {
      console.error(e)
      setIsCasting(false)
    }
  }

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

      <section className="container mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-8 text-center font-display text-4xl font-bold text-bagua-text">
          起卦
        </h1>

        {/* 问询主题 */}
        <div className="mb-8 rounded-card border border-bagua-border/40 bg-bagua-surface p-6 shadow-md">
          <label className="mb-2 block font-body text-sm font-medium text-bagua-text">
            问询主题（可选）
          </label>
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="例如：近期事业发展如何"
            disabled={isCasting}
            className="w-full bg-transparent font-body text-lg text-bagua-text outline-none placeholder:text-bagua-muted"
          />
        </div>

        {/* 起卦方式 */}
        <div className="mb-8 rounded-card border border-bagua-border/40 bg-bagua-surface p-6 shadow-md">
          <h2 className="mb-4 font-display text-lg font-bold text-bagua-text">
            选择起卦方式
          </h2>

          <div className="space-y-3">
            <MethodOption
              icon={<Sparkles className="h-5 w-5" />}
              title="快速起卦"
              description="硬币法 · 约 10 秒"
              selected={method === 'coins'}
              onClick={() => setMethod('coins')}
              disabled={isCasting}
              primary
            />
            <MethodOption
              icon={<Leaf className="h-5 w-5" />}
              title="蓍草揲占"
              description="传统揲四法 · 约 3 分钟"
              selected={method === 'yarrow'}
              onClick={() => setMethod('yarrow')}
              disabled={isCasting}
            />
            <MethodOption
              icon={<Hand className="h-5 w-5" />}
              title="手动选卦"
              description="学习模式 · 直接选择上下卦"
              selected={method === 'manual'}
              onClick={() => setMethod('manual')}
              disabled={isCasting}
            />
          </div>
        </div>

        {/* 起卦按钮 / 进度 */}
        {!isCasting ? (
          <button
            onClick={handleCast}
            className="group flex w-full items-center justify-center gap-2 rounded-button bg-gradient-to-r from-bagua-secondary to-emerald-500 px-8 py-5 font-display text-xl font-bold text-white shadow-lg transition hover:shadow-xl"
          >
            <Sparkles className="h-6 w-6" />
            开始起卦
            <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        ) : (
          <div className="rounded-card border border-bagua-secondary/40 bg-bagua-surface p-8 shadow-md">
            <div className="mb-3 text-center font-display text-lg font-bold text-bagua-text">
              {method === 'yarrow' ? '蓍草揲占中...' : method === 'manual' ? '选择卦象中...' : '铜钱翻转中...'}
            </div>
            <div className="mb-2 flex justify-between font-body text-sm text-bagua-muted">
              <span>第 {progress} 爻 / 6</span>
              <span>{Math.round((progress / 6) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bagua-border/30">
              <div
                className="h-full bg-gradient-to-r from-bagua-secondary to-emerald-500 transition-all duration-500"
                style={{ width: `${(progress / 6) * 100}%` }}
              />
            </div>
            <p className="mt-4 text-center font-body text-xs text-bagua-muted">
              请静心片刻 · 让宇宙指引你
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function MethodOption({
  icon,
  title,
  description,
  selected,
  onClick,
  disabled,
  primary = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  selected: boolean
  onClick: () => void
  disabled: boolean
  primary?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-4 rounded-card border p-4 text-left transition ${
        selected
          ? primary
            ? 'border-bagua-secondary bg-bagua-secondary/5 shadow-md'
            : 'border-bagua-primary bg-bagua-primary/5 shadow-md'
          : 'border-bagua-border/30 bg-bagua-surface hover:border-bagua-primary/40'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
        selected
          ? primary
            ? 'bg-bagua-secondary text-white'
            : 'bg-bagua-primary text-white'
          : 'bg-bagua-border/30 text-bagua-muted'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-display font-bold text-bagua-text">{title}</div>
        <div className="font-body text-sm text-bagua-muted">{description}</div>
      </div>
      <div className={`h-5 w-5 rounded-full border-2 ${selected ? 'border-bagua-secondary bg-bagua-secondary' : 'border-bagua-border'}`} />
    </button>
  )
}
