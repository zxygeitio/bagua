'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { YaoStack } from '@/components/hexagram/YaoStack'
import { Check, ChevronRight, Hand, Leaf, Sparkles, Wand } from '@/components/icons'
import { SiteShell } from '@/components/shared/SiteShell'
import { useReducedMotion } from '@/components/shared/useReducedMotion'
import type { Line } from '@/lib/iching'
import { performDivination } from '@/services/divination.service'
import { useHistoryStore } from '@/store/history'
import { motionDuration } from '@/styles/theme'

type Method = 'coins' | 'yarrow' | 'manual'
type PreviewLine = Pick<Line, 'yinYang' | 'isChanging'>
type Trigram = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'

const TRIGRAMS: Trigram[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

const METHODS = [
  { value: 'coins' as const, icon: Sparkles, title: '快速起卦', desc: '硬币法 · 约 10 秒', longDesc: '适合日常快速占卜', recommended: true },
  { value: 'yarrow' as const, icon: Leaf, title: '蓍草揲占', desc: '传统揲四法 · 约 3 分钟', longDesc: '传统仪式 · 郑重其事', recommended: false },
  { value: 'manual' as const, icon: Hand, title: '手动选卦', desc: '学习模式 · 直接选择上下卦', longDesc: '适合学习研究', recommended: false },
]

export default function DivinePage() {
  const router = useRouter()
  const addRecord = useHistoryStore((state) => state.addRecord)
  const reduceMotion = useReducedMotion()
  const [question, setQuestion] = useState('')
  const [method, setMethod] = useState<Method>('coins')
  const [manualUpper, setManualUpper] = useState<Trigram>('乾')
  const [manualLower, setManualLower] = useState<Trigram>('坤')
  const [changingPosition, setChangingPosition] = useState('')
  const [isCasting, setIsCasting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [castLines, setCastLines] = useState<PreviewLine[]>([])
  const [castError, setCastError] = useState('')

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bagua-settings') ?? '{}') as { defaultMethod?: Method }
      if (saved.defaultMethod) setMethod(saved.defaultMethod)
    } catch {
      // Keep defaults when local settings are unavailable.
    }
  }, [])

  const handleCast = async () => {
    setIsCasting(true)
    setProgress(0)
    setCastLines([])
    setCastError('')
    let showAnimation = true
    try {
      const saved = JSON.parse(localStorage.getItem('bagua-settings') ?? '{}') as { showAnimation?: boolean }
      showAnimation = saved.showAnimation !== false
    } catch {
      // Animation is enabled by default.
    }

    try {
      const record = await performDivination({
        method,
        question: question.trim() || undefined,
        manualUpper: method === 'manual' ? manualUpper : undefined,
        manualLower: method === 'manual' ? manualLower : undefined,
        changingPosition: method === 'manual' && changingPosition ? Number(changingPosition) as 1 | 2 | 3 | 4 | 5 | 6 : undefined,
      })
      const step = showAnimation && !reduceMotion ? motionDuration('yaoReveal', false) + 140 : 0
      for (let index = 0; index < record.lines.length; index += 1) {
        const line = record.lines[index]
        if (!line) continue
        if (step > 0) await new Promise((resolve) => setTimeout(resolve, step))
        const preview = { yinYang: line.yinYang, isChanging: line.isChanging }
        setCastLines((previous) => [...previous, preview])
        setProgress(index + 1)
      }
      await addRecord(record)
      router.push(`/result?id=${record.id}`)
    } catch (error) {
      console.error(error)
      setCastError('起卦暂时未完成，请稍后再试。你的问题不会被保存。')
      setIsCasting(false)
    }
  }

  return (
    <SiteShell eyebrow="CAST / 01">
      <main className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_20rem] md:px-6">
        <div>
          <h1 className="enter-up font-display text-5xl tracking-[0.16em] md:text-6xl">起卦</h1>
          <p className="prose-body mt-4 text-bagua-muted">先定其心，再观其象。六爻自下而上，结果会写入历史。</p>

          <div className="enter-up stagger-1 mt-8">
            <label htmlFor="question" className="font-display text-xs tracking-[0.2em]">
              问询主题 <span className="text-bagua-muted">可选</span>
            </label>
            <textarea
              id="question"
              value={question}
              maxLength={120}
              rows={3}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="例如：近期事业发展如何？"
              disabled={isCasting}
              className="mt-2 w-full resize-none border-4 border-bagua-text bg-bagua-surface px-3 py-2 font-body text-base leading-relaxed outline-none placeholder:text-bagua-muted disabled:opacity-50"
            />
            <p className="mt-2 text-right font-display text-[10px] text-bagua-muted">{question.length}/120</p>
          </div>

          <div className="enter-up stagger-2 mt-8 space-y-2">
            {METHODS.map((item) => {
              const Icon = item.icon
              const selected = method === item.value
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMethod(item.value)}
                  disabled={isCasting}
                  aria-pressed={selected}
                  className={`btn-press flex w-full items-center gap-3 border-4 p-3 text-left ${
                    selected ? 'border-bagua-text bg-bagua-surface' : 'border-bagua-fiber bg-transparent'
                  } disabled:opacity-50`}
                >
                  <Icon className="h-5 w-5 text-bagua-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-display text-sm tracking-widest">
                      {item.title}
                      {item.recommended ? <span className="text-[10px] text-bagua-primary">主用</span> : null}
                    </span>
                    <span className="mt-1 block font-body text-xs text-bagua-muted">{item.desc} · {item.longDesc}</span>
                  </span>
                  {selected ? <Check className="h-4 w-4 text-bagua-primary" /> : null}
                </button>
              )
            })}
          </div>

          {method === 'manual' && (
            <div className="mt-4 grid gap-3 border-4 border-bagua-text bg-bagua-surface p-4 sm:grid-cols-3">
              <label className="font-body text-xs text-bagua-muted">
                上卦
                <select value={manualUpper} onChange={(event) => setManualUpper(event.target.value as Trigram)} disabled={isCasting} className="mt-2 w-full border-4 border-bagua-text bg-bagua-canvas px-2 py-2 font-display text-sm outline-none">
                  {TRIGRAMS.map((trigram) => <option key={trigram} value={trigram}>{trigram}</option>)}
                </select>
              </label>
              <label className="font-body text-xs text-bagua-muted">
                下卦
                <select value={manualLower} onChange={(event) => setManualLower(event.target.value as Trigram)} disabled={isCasting} className="mt-2 w-full border-4 border-bagua-text bg-bagua-canvas px-2 py-2 font-display text-sm outline-none">
                  {TRIGRAMS.map((trigram) => <option key={trigram} value={trigram}>{trigram}</option>)}
                </select>
              </label>
              <label className="font-body text-xs text-bagua-muted">
                动爻
                <select value={changingPosition} onChange={(event) => setChangingPosition(event.target.value)} disabled={isCasting} className="mt-2 w-full border-4 border-bagua-text bg-bagua-canvas px-2 py-2 font-display text-sm outline-none">
                  <option value="">无动爻</option>
                  {[1, 2, 3, 4, 5, 6].map((position) => <option key={position} value={position}>第 {position} 爻</option>)}
                </select>
              </label>
            </div>
          )}

          {castError ? (
            <p role="alert" className="mt-4 border-4 border-bagua-primary bg-bagua-surface px-3 py-2 font-body text-sm text-bagua-primary">{castError}</p>
          ) : null}

          {!isCasting ? (
            <button type="button" onClick={handleCast} className="btn-primary mt-8 w-full">
              <Wand className="h-5 w-5" />
              开始起卦
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <div className="mt-8 border-4 border-bagua-text bg-bagua-surface p-5">
              <div className="mb-4 flex items-center justify-between font-display text-xs tracking-[0.2em]">
                <span>{method === 'yarrow' ? '蓍草揲四中' : method === 'manual' ? '卦象生成中' : '铜钱翻转中'}</span>
                <span>{String(progress).padStart(2, '0')} / 06</span>
              </div>
              <YaoStack lines={castLines} currentIndex={progress - 1} />
            </div>
          )}
        </div>

        <aside className="pixel-frame hidden bg-bagua-surface p-8 lg:block">
          <p className="font-display text-xs tracking-[0.28em] text-bagua-primary">{isCasting ? `第 ${progress || 1} 爻` : '静候一问'}</p>
          <p className="prose-body mt-4 text-sm text-bagua-muted">
            {isCasting ? '六爻自下而上，记录此刻的阴阳变化。' : '让问题停留片刻，仪式从专注开始。'}
          </p>
        </aside>
      </main>
    </SiteShell>
  )
}
