'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, ChevronRight, Hand, Leaf, Logo, Sparkles, Wand, Coins } from '@/components/icons'
import type { Line, Scenario } from '@/lib/iching'
import { performDivination } from '@/services/divination.service'
import { useHistoryStore } from '@/store/history'
import { SiteShell } from '@/components/shared/SiteShell'

type Method = 'coins' | 'yarrow' | 'manual' | 'meihua' | 'time'
type PreviewLine = Pick<Line, 'yinYang' | 'isChanging'>
type Trigram = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'

const TRIGRAMS: Trigram[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

const METHODS = [
  { value: 'coins' as const, icon: Coins, title: '快速起卦', desc: '硬币法 · 约 10 秒', longDesc: '适合日常快速占卜', recommended: true },
  { value: 'yarrow' as const, icon: Leaf, title: '蓍草揲占', desc: '传统揲四法 · 约 3 分钟', longDesc: '传统仪式 · 郑重其事', recommended: false },
  { value: 'meihua' as const, icon: Sparkles, title: '梅花易数', desc: '以时辰或数字起卦', longDesc: '数字起卦 · 一念成爻', recommended: false },
  { value: 'time' as const, icon: Wand, title: '此刻之象', desc: '年⽉⽇时成卦', longDesc: '当下即卦 · 顺天应人', recommended: false },
  { value: 'manual' as const, icon: Hand, title: '手动选卦', desc: '学习模式 · 直接选择', longDesc: '适合学习研究', recommended: false },
]

const QUESTION_HINTS: { tag: string; hint: string; scenario: Scenario }[] = [
  { tag: '事业', hint: '近期事业发展如何？', scenario: 'career' },
  { tag: '感情', hint: '此段关系走向如何？', scenario: 'relationship' },
  { tag: '财运', hint: '近期财运与投资判断？', scenario: 'wealth' },
  { tag: '健康', hint: '身体调养与作息？', scenario: 'health' },
  { tag: '学业', hint: '学习进度与方法？', scenario: 'study' },
  { tag: '人际', hint: '某段人际如何相处？', scenario: 'family' },
]

export default function DivinePage() {
  const router = useRouter()
  const addRecord = useHistoryStore((state) => state.addRecord)
  const [question, setQuestion] = useState('')
  const [scenario, setScenario] = useState<Scenario | undefined>(undefined)
  const [method, setMethod] = useState<Method>('coins')
  const [manualUpper, setManualUpper] = useState<Trigram>('乾')
  const [manualLower, setManualLower] = useState<Trigram>('坤')
  const [changingPosition, setChangingPosition] = useState('')
  const [isCasting, setIsCasting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentLine, setCurrentLine] = useState<PreviewLine | null>(null)
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
    setCurrentLine(null)
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
        method: method as 'coins' | 'yarrow' | 'manual' | 'meihua' | 'time',
        question: question.trim() || undefined,
        scenario,
        manualUpper: method === 'manual' ? manualUpper : undefined,
        manualLower: method === 'manual' ? manualLower : undefined,
        changingPosition: method === 'manual' && changingPosition ? Number(changingPosition) as 1 | 2 | 3 | 4 | 5 | 6 : undefined,
      })
      for (let index = 0; index < record.lines.length; index += 1) {
        const line = record.lines[index]
        if (!line) continue
        if (showAnimation) await new Promise((resolve) => setTimeout(resolve, method === 'yarrow' ? 800 : 500))
        const preview = { yinYang: line.yinYang, isChanging: line.isChanging }
        setCurrentLine(preview)
        setCastLines((previous) => [...previous, preview])
        setProgress(index + 1)
      }
      await addRecord(record)
      router.push(`/result?id=${record.id}`)
    } catch (error) {
      console.error(error)
      setCastError('起卦暂时未完成，请稍后再试。你的问题不会被保存。')
      setIsCasting(false)
      setCurrentLine(null)
    }
  }

  return (
    <SiteShell eyebrow="CAST / 01">
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="enter-up mb-10 max-w-2xl">
          <h1 className="font-display text-5xl leading-none tracking-[0.06em] md:text-6xl">起卦</h1>
          <p className="prose-body mt-4 text-bagua-muted">
            先定其心，再观其象。把此刻真正想问的事交给六爻，结果会被保存在历史记录中。
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-8">
            <div className="paper-panel enter-up stagger-1 p-6 md:p-8">
              <div className="mb-3 flex items-end justify-between gap-4">
                <label htmlFor="question" className="font-display text-lg tracking-wider">
                  问询主题 <span className="font-body text-xs font-normal text-bagua-muted">可选</span>
                </label>
                <span className="font-display text-[10px] tracking-widest text-bagua-muted">
                  {question.length}/120
                </span>
              </div>
              <textarea
                id="question"
                value={question}
                maxLength={120}
                rows={3}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="例如：近期事业发展如何？"
                disabled={isCasting}
                className="field-control w-full resize-none px-4 py-3 font-body text-base leading-relaxed disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-4">
                <p className="mb-2 font-display text-[11px] tracking-[0.24em] text-bagua-muted">
                  或从下方选个切面
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUESTION_HINTS.map((q) => (
                    <button
                      key={q.tag}
                      type="button"
                      onClick={() => {
                        setQuestion(q.hint)
                        setScenario(q.scenario)
                      }}
                      disabled={isCasting}
                      className={`btn-press border-4 px-2.5 py-1 font-display text-[11px] tracking-widest disabled:opacity-40 ${
                        scenario === q.scenario
                          ? 'border-bagua-text bg-bagua-primary text-bagua-surface'
                          : 'border-bagua-fiber bg-bagua-canvas text-bagua-text hover:border-bagua-text hover:bg-bagua-wash'
                      }`}
                    >
                      {q.tag}
                    </button>
                  ))}
                </div>
                <p className="mt-3 font-body text-xs text-bagua-muted">
                  问题越具体，阅读卦辞时越容易找到对应的切面。
                </p>
              </div>
            </div>

            <div className="enter-up stagger-2">
              <div className="mb-4 flex items-end justify-between">
                <h2 className="font-display text-lg tracking-wider">选择起卦方式</h2>
                <span className="font-display text-[10px] tracking-widest text-bagua-muted">METHOD</span>
              </div>
              <div className="space-y-3">
                {METHODS.map((item, index) => (
                  <MethodOption
                    key={item.value}
                    index={index}
                    method={item}
                    selected={method === item.value}
                    onClick={() => setMethod(item.value)}
                    disabled={isCasting}
                  />
                ))}
              </div>
              {method === 'manual' && (
                <div className="paper-panel mt-4 grid gap-3 border-4 border-bagua-text p-4 sm:grid-cols-3">
                  <label className="font-body text-xs text-bagua-muted">
                    上卦
                    <select
                      value={manualUpper}
                      onChange={(event) => setManualUpper(event.target.value as Trigram)}
                      disabled={isCasting}
                      className="field-control mt-2 px-3 py-2 font-display text-sm"
                    >
                      {TRIGRAMS.map((trigram) => (
                        <option key={trigram} value={trigram}>{trigram}</option>
                      ))}
                    </select>
                  </label>
                  <label className="font-body text-xs text-bagua-muted">
                    下卦
                    <select
                      value={manualLower}
                      onChange={(event) => setManualLower(event.target.value as Trigram)}
                      disabled={isCasting}
                      className="field-control mt-2 px-3 py-2 font-display text-sm"
                    >
                      {TRIGRAMS.map((trigram) => (
                        <option key={trigram} value={trigram}>{trigram}</option>
                      ))}
                    </select>
                  </label>
                  <label className="font-body text-xs text-bagua-muted">
                    动爻
                    <select
                      value={changingPosition}
                      onChange={(event) => setChangingPosition(event.target.value)}
                      disabled={isCasting}
                      className="field-control mt-2 px-3 py-2 font-display text-sm"
                    >
                      <option value="">无动爻</option>
                      {[1, 2, 3, 4, 5, 6].map((position) => (
                        <option key={position} value={position}>第 {position} 爻</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>

            {castError && (
              <div role="alert" className="border-4 border-bagua-primary bg-bagua-primary/10 px-4 py-3 font-body text-sm text-bagua-text">
                {castError}
              </div>
            )}

            {!isCasting ? (
              <button
                onClick={handleCast}
                className="btn-primary enter-up stagger-3 w-full group"
              >
                <Wand className="h-4 w-4" />
                <span>开始起卦</span>
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            ) : (
              <CastProgress method={method} progress={progress} currentLine={currentLine} castLines={castLines} />
            )}
          </div>

          <aside className="paper-panel enter-up stagger-2 hidden self-start p-6 lg:block">
            <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">仪式提示</p>
            <h3 className="mt-2 font-display text-lg tracking-wider">静候一问</h3>
            <div className="mt-5 space-y-5 font-body text-sm leading-relaxed text-bagua-text">
              <Step n="1" title="定心">杂念放下，专注意图。</Step>
              <Step n="2" title="起问">默念你所问之事，让问题完整。</Step>
              <Step n="3" title="投爻">三钱六掷，或揲四求余。</Step>
              <Step n="4" title="读象">动爻多少，决定读卦辞还是爻辞。</Step>
            </div>
            <div className="mt-6 border-t-4 border-bagua-fiber pt-4">
              <p className="font-display text-[10px] tracking-[0.28em] text-bagua-muted">LIVE</p>
              <div className="mt-2 flex items-center gap-2 font-display text-xs tracking-widest text-bagua-primary">
                <span className="inline-block h-2 w-2 bg-bagua-primary" /> READY
              </div>
            </div>
          </aside>
        </div>
      </main>
    </SiteShell>
  )
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center border-4 border-bagua-text bg-bagua-primary font-display text-xs text-bagua-surface">
        {n}
      </span>
      <div>
        <p className="font-display text-sm tracking-wider text-bagua-primary">{title}</p>
        <p className="mt-1 text-bagua-muted">{children}</p>
      </div>
    </div>
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
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      style={{ animationDelay: `${index * 80 + 200}ms` }}
      className={`btn-press group relative flex w-full items-center gap-4 border-4 p-4 text-left transition enter-up ${
        selected
          ? 'border-bagua-text bg-bagua-wash shadow-soft'
          : 'border-bagua-fiber bg-bagua-surface hover:border-bagua-text'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center border-4 border-bagua-text transition ${
          selected ? 'bg-bagua-primary text-bagua-surface' : 'bg-bagua-canvas text-bagua-text group-hover:bg-bagua-wash'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-base tracking-wider">{method.title}</span>
          {method.recommended && (
            <span className="border-2 border-bagua-text bg-bagua-primary px-1.5 py-0.5 font-display text-[9px] tracking-widest text-bagua-surface">
              推荐
            </span>
          )}
        </div>
        <div className="mt-1 font-body text-sm text-bagua-text">{method.desc}</div>
        <div className="mt-0.5 font-body text-xs text-bagua-muted">{method.longDesc}</div>
      </div>
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border-4 border-bagua-text transition ${
          selected ? 'bg-bagua-primary text-bagua-surface' : 'bg-bagua-canvas text-transparent'
        }`}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  )
}

function CastProgress({
  method,
  progress,
  currentLine,
  castLines,
}: {
  method: Method
  progress: number
  currentLine: PreviewLine | null
  castLines: PreviewLine[]
}) {
  const labels: Record<Method, string> = {
    coins: '铜钱翻转中',
    yarrow: '蓍草揲四中',
    manual: '卦象生成中',
    meihua: '以数成卦中',
    time: '此刻成卦中',
  }
  const tip =
    method === 'yarrow'
      ? '每变 4 揲，求其余数。9 为老阳、6 为老阴、7 为少阳、8 为少阴。'
      : method === 'meihua'
        ? '以时辰或数字起卦，一念成爻。'
        : method === 'time'
          ? '年⽉⽇时入先天数，自动成卦。'
          : '三枚铜钱，依阴阳组合记录为一爻；六爻自下而上，合成完整卦象。'
  const positions = ['上爻', '五爻', '四爻', '三爻', '二爻', '初爻']

  return (
    <div className="paper-panel enter-up border-4 border-bagua-primary p-6 md:p-8">
      <div className="mb-1 flex items-center justify-between">
        <div className="font-display text-xl tracking-wider text-bagua-primary">{labels[method]}</div>
        <span className="font-display text-[10px] tracking-widest text-bagua-muted">
          {String(progress).padStart(2, '0')} / 06
        </span>
      </div>
      <div className="mb-6 font-body text-xs text-bagua-muted">爻线从初爻开始，逐层向上显现</div>
      <div className="space-y-2.5">
        {positions.map((label, displayIndex) => {
          const lineIndex = 5 - displayIndex
          const line = castLines[lineIndex]
          const isCurrent = lineIndex === progress - 1
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="w-10 font-display text-[10px] text-bagua-muted">{label}</span>
              <div
                className={`flex h-7 flex-1 items-center gap-1 ${line ? 'cast-line' : 'opacity-25'}`}
              >
                {line?.yinYang === 'yin' ? (
                  <>
                    <span className="h-2 flex-1 bg-bagua-text" />
                    <span className="h-2 flex-1 bg-bagua-text" />
                  </>
                ) : (
                  <span className={`h-2 w-full ${line?.isChanging ? 'bg-bagua-primary' : 'bg-bagua-text'}`} />
                )}
                {isCurrent && currentLine && (
                  <span className="ml-2 font-display text-[10px] text-bagua-primary">
                    {currentLine.yinYang === 'yang' ? '阳' : '阴'}
                    {currentLine.isChanging ? ' · 动' : ''}
                  </span>
                )}
              </div>
              {line && <Check className="h-3.5 w-3.5 flex-shrink-0 text-bagua-primary" />}
            </div>
          )
        })}
      </div>
      <div className="mt-7 h-1 overflow-hidden bg-bagua-fiber">
        <div
          className="h-full bg-bagua-primary transition-all duration-500"
          style={{ width: `${(progress / 6) * 100}%` }}
        />
      </div>
      <p className="mt-6 text-center font-body text-xs leading-relaxed text-bagua-muted">{tip}</p>
    </div>
  )
}
