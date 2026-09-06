'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronRight, Leaf, Hand } from 'lucide-react'
import { performDivination } from '@/services/divination.service'
import { useHistoryStore } from '@/store/history'

type Method = 'coins' | 'yarrow' | 'manual'

const METHODS = [
  {
    value: 'coins' as const,
    icon: Sparkles,
    title: '快速起卦',
    desc: '硬币法 · 约 10 秒',
    longDesc: '适合日常快速占卜',
    color: 'secondary' as const,
    recommended: true,
  },
  {
    value: 'yarrow' as const,
    icon: Leaf,
    title: '蓍草揲占',
    desc: '传统揲四法 · 约 3 分钟',
    longDesc: '传统仪式 · 郑重其事',
    color: 'accent' as const,
    recommended: false,
  },
  {
    value: 'manual' as const,
    icon: Hand,
    title: '手动选卦',
    desc: '学习模式 · 直接选择上下卦',
    longDesc: '适合学习研究',
    color: 'primary' as const,
    recommended: false,
  },
]

export default function DivinePage() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [method, setMethod] = useState<Method>('coins')
  const [isCasting, setIsCasting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentLine, setCurrentLine] = useState<{ yinYang: 'yang' | 'yin', isChanging: boolean } | null>(null)
  const addRecord = useHistoryStore(s => s.addRecord)

  const handleCast = async () => {
    setIsCasting(true)
    setProgress(0)
    setCurrentLine(null)

    const totalSteps = 6
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(r => setTimeout(r, method === 'yarrow' ? 800 : 500))
      setProgress(i)
    }

    try {
      const record = await performDivination({ method, question })
      addRecord(record)
      router.push(`/result?id=${record.id}`)
    } catch (e) {
      console.error(e)
      setIsCasting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 装饰背景 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-bagua-secondary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-bagua-accent/5 blur-3xl" />
      </div>

      <header className="glass-card sticky top-0 z-50 border-b border-bagua-border/30">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-body text-sm text-bagua-muted transition hover:text-bagua-text">
            ← 返回首页
          </Link>
          <span className="seal text-sm">起卦</span>
        </div>
      </header>

      <section className="container relative mx-auto max-w-3xl px-6 py-12 md:py-20">
        <div className="mb-12 text-center animate-fade-up">
          <h1 className="font-calligraphy text-5xl font-bold text-bagua-text md:text-6xl">起卦</h1>
          <p className="mt-4 font-body text-bagua-muted">静心片刻 · 让宇宙指引你</p>
        </div>

        {/* 问询主题 */}
        <div className="glass-card mb-8 rounded-card p-6 animate-fade-up stagger-1">
          <label className="mb-2 block font-body text-sm font-medium text-bagua-text">
            问询主题 <span className="text-bagua-muted">（可选）</span>
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

        {/* 起卦方式选择 */}
        <div className="mb-8 animate-fade-up stagger-2">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-bagua-text">
            <span className="seal text-xs">选</span>
            选择起卦方式
          </h2>
          <div className="space-y-3">
            {METHODS.map((m, i) => (
              <MethodOption
                key={m.value}
                index={i}
                method={m}
                selected={method === m.value}
                onClick={() => setMethod(m.value)}
                disabled={isCasting}
              />
            ))}
          </div>
        </div>

        {/* 起卦按钮 / 进度 */}
        {!isCasting ? (
          <button
            onClick={handleCast}
            className="group relative w-full overflow-hidden rounded-card bg-gradient-to-r from-bagua-secondary to-emerald-500 px-8 py-6 font-display text-2xl font-bold text-white shadow-jade transition hover:shadow-2xl animate-fade-up stagger-3"
          >
            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-0" />
            <span className="relative flex items-center justify-center gap-3">
              <Sparkles className="h-7 w-7" />
              开始起卦
              <ChevronRight className="h-6 w-6 transition group-hover:translate-x-1" />
            </span>
          </button>
        ) : (
          <CastProgress
            method={method}
            progress={progress}
            currentLine={currentLine}
          />
        )}
      </section>
    </main>
  )
}

function MethodOption({
  index,
  method,
  selected,
  onClick,
  disabled,
}: {
  index: number
  method: typeof METHODS[number]
  selected: boolean
  onClick: () => void
  disabled: boolean
}) {
  const Icon = method.icon
  const colorClasses = {
    secondary: {
      ring: 'border-bagua-secondary ring-2 ring-bagua-secondary/30',
      bg: 'bg-bagua-secondary/5',
      icon: 'bg-bagua-secondary text-white',
      dot: 'bg-bagua-secondary',
    },
    accent: {
      ring: 'border-bagua-accent ring-2 ring-bagua-accent/30',
      bg: 'bg-bagua-accent/5',
      icon: 'bg-bagua-accent text-white',
      dot: 'bg-bagua-accent',
    },
    primary: {
      ring: 'border-bagua-primary ring-2 ring-bagua-primary/30',
      bg: 'bg-bagua-primary/5',
      icon: 'bg-bagua-primary text-white',
      dot: 'bg-bagua-primary',
    },
  }[method.color]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full overflow-hidden rounded-card border p-5 text-left transition-all animate-fade-up ${
        selected ? `${colorClasses.ring} ${colorClasses.bg}` : 'glass-card border-transparent hover:border-bagua-border/50'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      style={{ animationDelay: `${index * 100 + 200}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition ${
          selected ? colorClasses.icon : 'bg-bagua-canvas text-bagua-muted'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-bagua-text">{method.title}</span>
            {method.recommended && (
              <span className="rounded-pill bg-bagua-secondary/10 px-2 py-0.5 font-body text-xs text-bagua-secondary">
                推荐
              </span>
            )}
          </div>
          <div className="font-body text-sm text-bagua-muted">{method.desc}</div>
          <div className="mt-0.5 font-body text-xs text-bagua-muted">{method.longDesc}</div>
        </div>
        <div className={`h-5 w-5 rounded-full border-2 transition ${
          selected ? `${colorClasses.dot} border-transparent` : 'border-bagua-border'
        }`}>
          {selected && <div className="h-full w-full rounded-full bg-current p-1.5" />}
        </div>
      </div>
    </button>
  )
}

function CastProgress({
  method,
  progress,
  currentLine,
}: {
  method: Method
  progress: number
  currentLine: { yinYang: 'yang' | 'yin'; isChanging: boolean } | null
}) {
  const labels = {
    coins: '铜钱翻转中',
    yarrow: '蓍草揲四中',
    manual: '卦象生成中',
  }
  const tip = method === 'yarrow'
    ? '每变 4 揲，求其余数。9 为老阳、6 为老阴、7 为少阳、8 为少阴。'
    : '三枚铜钱，2 正 1 反为少阳、3 反为少阴、3 正为老阳、2 反 1 正为老阴。'

  return (
    <div className="glass-card rounded-card border-2 border-bagua-secondary/40 p-8 animate-fade-in">
      <div className="mb-2 text-center font-calligraphy text-2xl font-bold text-bagua-secondary">
        {labels[method]}...
      </div>
      <div className="mb-6 text-center font-body text-sm text-bagua-muted">
        第 {progress} 爻 / 6 · 共 6 爻成一卦
      </div>

      {/* 进度条 */}
      <div className="mb-8 flex gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              i < progress ? 'bg-gradient-to-r from-bagua-secondary to-emerald-400' : 'bg-bagua-canvas'
            }`}
          />
        ))}
      </div>

      {/* 当前爻预览 */}
      <div className="mb-6 flex justify-center">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-bagua-secondary to-emerald-400 text-white shadow-glow animate-pulse`}>
          <span className="font-calligraphy text-2xl">{progress}</span>
        </div>
      </div>

      <p className="text-center font-body text-xs leading-relaxed text-bagua-muted">
        {tip}
      </p>
    </div>
  )
}