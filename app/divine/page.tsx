'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { PixelCoins } from '@/components/cast/PixelCoins'
import { YaoStack } from '@/components/hexagram/YaoStack'
import { ChevronRight, Hand, Leaf, Sparkles, Wand } from '@/components/icons'
import { SiteShell } from '@/components/shared/SiteShell'
import { useReducedMotion } from '@/components/shared/useReducedMotion'
import type { Line } from '@/lib/iching'
import { ALL_SCENARIOS, SCENARIO_LABELS, type Scenario } from '@/types/iching'
import { flipThree, type CoinFace } from '@/lib/qigua/cast/coin'
import { motionDuration } from '@/styles/theme'
import { performDivination } from '@/services/divination.service'
import { useHistoryStore } from '@/store/history'

type Method = 'coins' | 'yarrow' | 'manual' | 'meihua' | 'time'
type Trigram = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'

const TRIGRAMS: Trigram[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
const METHODS: { value: Method; title: string; desc: string }[] = [
  { value: 'coins', title: '铜钱', desc: '三钱六掷，亲手成爻' },
  { value: 'meihua', title: '梅花', desc: '以数字或字起卦' },
  { value: 'time', title: '此刻', desc: '年日月时入先天数' },
  { value: 'yarrow', title: '蓍草', desc: '大衍之数，郑重其事' },
  { value: 'manual', title: '排卦', desc: '自选上下卦与动爻' },
]

export default function DivinePage() {
  const router = useRouter()
  const addRecord = useHistoryStore((state) => state.addRecord)
  const reduceMotion = useReducedMotion()
  const [question, setQuestion] = useState('')
  const [scenario, setScenario] = useState<Scenario | undefined>()
  const [method, setMethod] = useState<Method>('coins')
  const [manualUpper, setManualUpper] = useState<Trigram>('乾')
  const [manualLower, setManualLower] = useState<Trigram>('坤')
  const [changingPosition, setChangingPosition] = useState('')
  const [meihuaText, setMeihuaText] = useState('')
  const [isCasting, setIsCasting] = useState(false)
  const [castLines, setCastLines] = useState<Line[]>([])
  const [coins, setCoins] = useState<CoinFace[]>([3, 2, 3])
  const [tossing, setTossing] = useState(false)
  const [castError, setCastError] = useState('')

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bagua-settings') ?? '{}') as { defaultMethod?: Method }
      if (saved.defaultMethod) setMethod(saved.defaultMethod)
    } catch {
      // Keep defaults.
    }
  }, [])

  const finish = async (lines?: Line[], override?: Method) => {
    setIsCasting(true)
    setCastError('')
    try {
      const record = await performDivination({
        method: override ?? method,
        question: question.trim() || undefined,
        scenario,
        lines,
        meihuaText,
        manualUpper: method === 'manual' ? manualUpper : undefined,
        manualLower: method === 'manual' ? manualLower : undefined,
        changingPosition: method === 'manual' && changingPosition ? Number(changingPosition) as 1 | 2 | 3 | 4 | 5 | 6 : undefined,
      })
      await addRecord(record)
      router.push(`/result?id=${record.id}`)
    } catch (error) {
      console.error(error)
      setCastError('起卦暂时未完成，请稍后再试。')
      setIsCasting(false)
    }
  }

  const tossNext = async () => {
    if (tossing || castLines.length >= 6) return
    setTossing(true)
    const wait = reduceMotion ? 0 : motionDuration('yaoReveal', false)
    const result = flipThree()
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait))
    const nextLine = { ...result.line, position: (castLines.length + 1) as 1 | 2 | 3 | 4 | 5 | 6 }
    const next = [...castLines, nextLine]
    setCoins(result.coins)
    setCastLines(next)
    setTossing(false)
    if (next.length === 6) await finish(next, 'coins')
  }

  return (
    <SiteShell eyebrow="CAST / 起卦">
      <main className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_18rem] md:px-6">
        <div>
          <h1 className="enter-up font-display text-4xl tracking-[0.08em] md:text-5xl">起卦</h1>
          <p className="prose-body mt-4 text-bagua-muted">先问一事，再选一法。铜钱可一爻一掷，梅花以数取象。</p>

          <div className="mt-6 flex flex-wrap gap-1">
            {ALL_SCENARIOS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setScenario(scenario === item ? undefined : item)}
                className={`btn-press border-4 px-2 py-1 font-display text-[11px] tracking-widest ${
                  scenario === item ? 'border-bagua-text bg-bagua-primary text-bagua-surface' : 'border-bagua-fiber'
                }`}
              >
                {SCENARIO_LABELS[item]}
              </button>
            ))}
          </div>

          <label htmlFor="question" className="mt-6 block font-display text-xs tracking-[0.2em]">
            问询 <span className="text-bagua-muted">可选</span>
          </label>
          <textarea
            id="question"
            value={question}
            maxLength={120}
            rows={2}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="把真正想问的那一句写下。"
            disabled={isCasting}
            className="mt-2 w-full resize-none border-4 border-bagua-text bg-bagua-surface px-3 py-2 font-body outline-none disabled:opacity-50"
          />

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {METHODS.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={method === item.value}
                onClick={() => { setMethod(item.value); setCastLines([]); }}
                disabled={isCasting}
                className={`btn-press border-4 p-3 text-left ${method === item.value ? 'border-bagua-text bg-bagua-surface' : 'border-bagua-fiber'}`}
              >
                <span className="block font-display text-sm tracking-widest">{item.title}</span>
                <span className="mt-1 block font-body text-xs text-bagua-muted">{item.desc}</span>
              </button>
            ))}
          </div>

          {method === 'manual' && (
            <div className="mt-4 grid gap-3 border-4 border-bagua-text bg-bagua-surface p-4 sm:grid-cols-3">
              <label className="font-body text-xs text-bagua-muted">
                上卦
                <select value={manualUpper} onChange={(event) => setManualUpper(event.target.value as Trigram)} className="mt-2 w-full border-4 border-bagua-text bg-bagua-canvas px-2 py-2 font-display">
                  {TRIGRAMS.map((trigram) => <option key={trigram} value={trigram}>{trigram}</option>)}
                </select>
              </label>
              <label className="font-body text-xs text-bagua-muted">
                下卦
                <select value={manualLower} onChange={(event) => setManualLower(event.target.value as Trigram)} className="mt-2 w-full border-4 border-bagua-text bg-bagua-canvas px-2 py-2 font-display">
                  {TRIGRAMS.map((trigram) => <option key={trigram} value={trigram}>{trigram}</option>)}
                </select>
              </label>
              <label className="font-body text-xs text-bagua-muted">
                动爻
                <select value={changingPosition} onChange={(event) => setChangingPosition(event.target.value)} className="mt-2 w-full border-4 border-bagua-text bg-bagua-canvas px-2 py-2 font-display">
                  <option value="">无动爻</option>
                  {[1, 2, 3, 4, 5, 6].map((position) => <option key={position} value={position}>第 {position} 爻</option>)}
                </select>
              </label>
            </div>
          )}

          {method === 'meihua' && (
            <label className="mt-4 block font-body text-xs text-bagua-muted">
              数字或字句
              <input
                value={meihuaText}
                onChange={(event) => setMeihuaText(event.target.value)}
                placeholder="如 384，或一句忽然想到的话"
                className="mt-2 w-full border-4 border-bagua-text bg-bagua-surface px-3 py-2 font-body outline-none"
              />
            </label>
          )}

          {castError ? <p role="alert" className="mt-4 border-4 border-bagua-primary px-3 py-2 text-sm text-bagua-primary">{castError}</p> : null}

          {method === 'coins' ? (
            <div className="mt-8 border-4 border-bagua-text bg-bagua-surface p-5">
              <div className="mb-5 flex items-center justify-between font-display text-xs tracking-[0.2em]">
                <span>第 {Math.min(castLines.length + 1, 6)} 爻 · 自下而上</span>
                <span>{String(castLines.length).padStart(2, '0')} / 06</span>
              </div>
              <PixelCoins coins={coins} tossing={tossing} />
              <div className="mt-6">
                <YaoStack lines={castLines} currentIndex={castLines.length - 1} />
              </div>
              <button type="button" onClick={tossNext} disabled={isCasting || tossing} className="btn-primary mt-6 w-full">
                <Sparkles className="h-4 w-4" />
                {castLines.length >= 6 ? '成卦' : `投第 ${castLines.length + 1} 爻`}
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => finish()} disabled={isCasting} className="btn-primary mt-8 w-full">
              {method === 'meihua' ? <Leaf className="h-5 w-5" /> : method === 'manual' ? <Hand className="h-5 w-5" /> : <Wand className="h-5 w-5" />}
              {isCasting ? '起卦中' : '开始起卦'}
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        <aside className="pixel-frame hidden bg-bagua-surface p-6 lg:block">
          <p className="font-display text-xs tracking-[0.28em] text-bagua-primary">
            {method === 'coins' ? '三钱成爻' : method === 'meihua' ? '梅花取数' : '静候一问'}
          </p>
          <p className="prose-body mt-4 text-sm text-bagua-muted">
            动爻多少，决定读卦辞还是爻辞。这是朱熹的断法，成卦后会写在判词里。
          </p>
        </aside>
      </main>
    </SiteShell>
  )
}
