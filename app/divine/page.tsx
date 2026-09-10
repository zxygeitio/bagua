'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, Coins, Wand } from '@/components/icons'
import type { Line, Scenario } from '@/lib/iching'
import { performDivination } from '@/services/divination.service'
import { useHistoryStore } from '@/store/history'
import { PaperTilt } from '@/components/shared/PaperTilt'
import { PaperParticles } from '@/components/shared/PaperParticles'

type PreviewLine = Pick<Line, 'yinYang' | 'isChanging'>

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
  const method = 'coins' as const
  const [question, setQuestion] = useState('')
  const [scenario, setScenario] = useState<Scenario | undefined>(undefined)
  const [isCasting, setIsCasting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentLine, setCurrentLine] = useState<PreviewLine | null>(null)
  const [castLines, setCastLines] = useState<PreviewLine[]>([])
  const [castError, setCastError] = useState('')

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
        method,
        question: question.trim() || undefined,
        scenario,
      })
      for (let index = 0; index < record.lines.length; index += 1) {
        const line = record.lines[index]
        if (!line) continue
        if (showAnimation) await new Promise((resolve) => setTimeout(resolve, 500))
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
    <main className="paper-hero relative mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <PaperParticles />
        <div className="enter-up mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl leading-none tracking-[0.06em] md:text-6xl">起卦</h1>
            <p className="prose-body mt-4 text-bagua-muted">
              先定其心，再观其象。把此刻真正想问的事交给六爻，结果会被保存在历史记录中。
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3.5 border-4 border-bagua-text bg-bagua-surface p-3.5 shadow-soft">
            <div className="relic-frame-square h-16 w-16 md:h-18 md:w-18 flex-shrink-0 p-1.5 shadow-xs">
              <Image src="/icons/divine-hero-3d.webp" alt="三钱起卦宝炉" width={112} height={112} className="antique-blend h-full w-full object-contain" priority />
            </div>
            <div>
              <p className="font-display text-xs tracking-wider text-bagua-primary">三钱法 · 灵应卦炉</p>
              <p className="font-mono text-[10px] text-bagua-muted">两阴一阳为少阳 · 纯阳为老阳</p>
            </div>
          </div>
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
                <h2 className="font-display text-lg tracking-wider">起卦方式</h2>
              </div>
              <div className="flex items-center gap-4 border-4 border-bagua-text bg-bagua-wash p-4 shadow-soft">
                <span className="relic-frame-round h-16 w-16 md:h-18 md:w-18 flex-shrink-0 p-0 shadow-xs">
                  <Image src="/icons/shortcut-coins.webp" alt="硬币法" width={112} height={112} className="antique-blend h-full w-full object-contain" />
                </span>
                <div>
                  <p className="font-display text-base tracking-wider">硬币法 · 三钱六掷</p>
                  <p className="mt-1 font-body text-xs text-bagua-muted">当前唯一正式起卦方式，六爻自下而上记录。</p>
                </div>
              </div>
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
              <CastProgress progress={progress} currentLine={currentLine} castLines={castLines} />
            )}
          </div>

          <aside className="space-y-4">
            <h2 className="font-display text-xs tracking-[0.28em] text-bagua-muted">起卦步骤</h2>
            <div className="space-y-3">
              <Step n="1" title="定心" icon="/icons/ritual-ask.webp" shape="square">杂念放下，专注意图。</Step>
              <Step n="2" title="起问" icon="/icons/shortcut-learn.webp" shape="square">默念你所问之事，让问题完整。</Step>
              <Step n="3" title="投爻" icon="/icons/ritual-cast-new.webp" shape="round">三钱六掷，六爻自下而上记录。</Step>
              <Step n="4" title="读象" icon="/icons/ritual-read-new.webp" shape="square">动爻多少，决定读卦辞还是爻辞。</Step>
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
  )
}

function Step({ n, title, icon, shape = 'square', children }: { n: string; title: string; icon?: string; shape?: 'round' | 'square'; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      {icon ? (
        <div className={`${shape === 'round' ? 'relic-frame-round p-0' : 'relic-frame-square p-1'} h-11 w-11 flex-shrink-0 shadow-2xs`}>
          <Image src={icon} alt="" width={88} height={88} className="antique-blend h-full w-full object-contain" />
        </div>
      ) : (
        <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center border-4 border-bagua-text bg-bagua-primary font-display text-xs text-bagua-surface">
          {n}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-display text-xs tracking-wider text-bagua-primary">{n}. {title}</p>
        <p className="mt-0.5 text-xs text-bagua-muted">{children}</p>
      </div>
    </div>
  )
}

function CastProgress({
  progress,
  currentLine,
  castLines,
}: {
  progress: number
  currentLine: PreviewLine | null
  castLines: PreviewLine[]
}) {
  const tip = '三枚铜钱，依阴阳组合记录为一爻；六爻自下而上，合成完整卦象。'
  const positions = ['上爻', '五爻', '四爻', '三爻', '二爻', '初爻']

  return (
    <PaperTilt className="paper-stack paper-stage enter-up" intensity={3.5}>
      <span className="paper-stage-shadow" aria-hidden="true" />
      <div className="paper-panel paper-depth border-4 border-bagua-primary p-6 md:p-8">
        <div className="mb-1 flex items-center justify-between">
          <div className="font-display text-xl tracking-wider text-bagua-primary">铜钱翻转中</div>
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
            className="h-full w-full origin-left bg-bagua-primary transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${progress / 6})` }}
          />
        </div>
        <p className="mt-6 text-center font-body text-xs leading-relaxed text-bagua-muted">{tip}</p>
      </div>
    </PaperTilt>
  )
}
