'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, ChevronRight, Hand, Leaf, Logo, Sparkles, Wand } from '@/components/icons'
import { ParticleField } from '@/components/visual/ParticleField'
import type { Line } from '@/lib/iching'
import { performDivination } from '@/services/divination.service'
import { useHistoryStore } from '@/store/history'

type Method = 'coins' | 'yarrow' | 'manual'
type PreviewLine = Pick<Line, 'yinYang' | 'isChanging'>
type Trigram = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'

const TRIGRAMS: Trigram[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

const METHODS = [
  { value: 'coins' as const, icon: Sparkles, title: '快速起卦', desc: '硬币法 · 约 10 秒', longDesc: '适合日常快速占卜', color: 'gold' as const, recommended: true },
  { value: 'yarrow' as const, icon: Leaf, title: '蓍草揲占', desc: '传统揲四法 · 约 3 分钟', longDesc: '传统仪式 · 郑重其事', color: 'jade' as const, recommended: false },
  { value: 'manual' as const, icon: Hand, title: '手动选卦', desc: '学习模式 · 直接选择上下卦', longDesc: '适合学习研究', color: 'vermilion' as const, recommended: false },
]

export default function DivinePage() {
  const router = useRouter()
  const addRecord = useHistoryStore((state) => state.addRecord)
  const [question, setQuestion] = useState('')
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
        method,
        question: question.trim() || undefined,
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
    <main className="relative min-h-screen overflow-hidden bg-ink-950 text-ink-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ParticleField />
        <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-gold-400/[0.08]" />
        <div className="absolute bottom-[-20rem] right-[-8rem] h-[36rem] w-[36rem] rounded-full border border-jade-400/[0.06]" />
      </div>

      <header className="relative z-20 border-b border-ink-800/60 bg-ink-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="group flex items-center gap-2 font-body text-sm text-ink-300 transition hover:text-ink-50">
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" /> 返回首页
          </Link>
          <div className="flex items-center gap-2"><Logo className="h-6 w-6 text-gold-400" /><span className="font-display text-sm text-ink-200">起卦仪式</span></div>
        </div>
      </header>

      <section className="relative z-10 container mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <div className="mb-12 max-w-2xl animate-fade-up">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-400/80"><span className="h-px w-8 bg-gold-400/60" /> CAST / 01</div>
          <h1 className="font-calligraphy text-6xl font-medium leading-none text-ink-50 md:text-7xl">起卦</h1>
          <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-ink-300 md:text-base">先定其心，再观其象。把此刻真正想问的事交给六爻，结果会被保存在历史记录中。</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)]">
          <div className="space-y-8">
            <div className="glass-card rounded-card p-6 animate-fade-up stagger-1 md:p-8">
              <div className="mb-4 flex items-end justify-between gap-4">
                <label htmlFor="question" className="font-display text-lg font-medium text-ink-100">问询主题 <span className="font-body text-xs font-normal text-ink-500">可选</span></label>
                <span className="font-mono text-[10px] text-ink-500">{question.length}/120</span>
              </div>
              <textarea id="question" value={question} maxLength={120} rows={3} onChange={(event) => setQuestion(event.target.value)} placeholder="例如：近期事业发展如何？" disabled={isCasting} className="w-full resize-none rounded-button border border-ink-700/80 bg-ink-950/70 px-4 py-3 font-body text-base leading-relaxed text-ink-100 outline-none transition placeholder:text-ink-600 focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/10 disabled:cursor-not-allowed disabled:opacity-50" />
              <p className="mt-3 font-body text-xs text-ink-500">问题越具体，阅读卦辞时越容易找到对应的切面。</p>
            </div>

            <div className="animate-fade-up stagger-2">
              <div className="mb-4 flex items-end justify-between"><h2 className="font-display text-lg font-medium text-ink-100">选择起卦方式</h2><span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">METHOD</span></div>
              <div className="space-y-3">{METHODS.map((item, index) => <MethodOption key={item.value} index={index} method={item} selected={method === item.value} onClick={() => setMethod(item.value)} disabled={isCasting} />)}</div>
              {method === 'manual' && (
                <div className="mt-4 grid gap-3 rounded-button border border-vermilion-400/25 bg-vermilion-500/[0.05] p-4 sm:grid-cols-3">
                  <label className="font-body text-xs text-ink-400">上卦<select value={manualUpper} onChange={(event) => setManualUpper(event.target.value as Trigram)} disabled={isCasting} className="mt-2 w-full rounded-button border border-ink-700 bg-ink-950 px-3 py-2 font-display text-sm text-ink-100 outline-none focus:border-vermilion-300">{TRIGRAMS.map((trigram) => <option key={trigram} value={trigram}>{trigram}</option>)}</select></label>
                  <label className="font-body text-xs text-ink-400">下卦<select value={manualLower} onChange={(event) => setManualLower(event.target.value as Trigram)} disabled={isCasting} className="mt-2 w-full rounded-button border border-ink-700 bg-ink-950 px-3 py-2 font-display text-sm text-ink-100 outline-none focus:border-vermilion-300">{TRIGRAMS.map((trigram) => <option key={trigram} value={trigram}>{trigram}</option>)}</select></label>
                  <label className="font-body text-xs text-ink-400">动爻<select value={changingPosition} onChange={(event) => setChangingPosition(event.target.value)} disabled={isCasting} className="mt-2 w-full rounded-button border border-ink-700 bg-ink-950 px-3 py-2 font-display text-sm text-ink-100 outline-none focus:border-vermilion-300"><option value="">无动爻</option>{[1, 2, 3, 4, 5, 6].map((position) => <option key={position} value={position}>第 {position} 爻</option>)}</select></label>
                </div>
              )}
            </div>

            {castError && <div role="alert" className="rounded-button border border-vermilion-400/30 bg-vermilion-500/10 px-4 py-3 font-body text-sm text-vermilion-100">{castError}</div>}

            {!isCasting ? (
              <button onClick={handleCast} className="shimmer-border group relative flex w-full items-center justify-center gap-3 rounded-button border border-gold-300/50 bg-gold-500 px-6 py-4 font-display text-lg font-medium text-ink-950 shadow-gold transition hover:bg-gold-400 hover:shadow-[0_0_36px_rgba(245,158,11,0.24)] animate-fade-up stagger-3">
                <Wand className="relative z-10 h-5 w-5" /><span className="relative z-10">开始起卦</span><ChevronRight className="relative z-10 h-5 w-5 transition group-hover:translate-x-1" />
              </button>
            ) : <CastProgress method={method} progress={progress} currentLine={currentLine} castLines={castLines} />}
          </div>

          <div className="ritual-stage sticky top-24 hidden min-h-[560px] items-center justify-center lg:flex">
            <div className="ritual-ring ritual-ring-one" /><div className="ritual-ring ritual-ring-two" />
            <div className="ritual-core relative flex h-72 w-72 flex-col items-center justify-center rounded-full border border-gold-300/30 bg-ink-900/75 text-center shadow-[0_0_80px_rgba(221,179,90,0.14)] backdrop-blur-xl">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/30 bg-gold-400/10 text-gold-300">{isCasting ? <Sparkles className="h-7 w-7 animate-pulse" /> : <Logo className="h-8 w-8" />}</div>
              <div className="font-calligraphy text-3xl text-ink-50">{isCasting ? `第 ${progress || 1} 爻` : '静候一问'}</div>
              <div className="mt-3 max-w-[170px] font-body text-xs leading-relaxed text-ink-400">{isCasting ? '六爻自下而上，记录此刻的阴阳变化' : '让问题停留片刻，仪式从专注开始'}</div>
              <div className="mt-6 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-gold-400/70"><span className="h-1.5 w-1.5 rounded-full bg-jade-400" />{isCasting ? 'LIVE CAST' : 'READY'}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function MethodOption({ index, method, selected, onClick, disabled }: { index: number; method: typeof METHODS[number]; selected: boolean; onClick: () => void; disabled: boolean }) {
  const Icon = method.icon
  const colors = {
    gold: { border: 'border-gold-400/70', bg: 'bg-gold-400/[0.07]', icon: 'bg-gold-400 text-ink-950', dot: 'bg-gold-400' },
    jade: { border: 'border-jade-400/70', bg: 'bg-jade-400/[0.07]', icon: 'bg-jade-400 text-ink-950', dot: 'bg-jade-400' },
    vermilion: { border: 'border-vermilion-400/70', bg: 'bg-vermilion-400/[0.07]', icon: 'bg-vermilion-400 text-ink-950', dot: 'bg-vermilion-400' },
  }[method.color]
  return (
    <button onClick={onClick} disabled={disabled} aria-pressed={selected} className={`group relative w-full rounded-button border p-4 text-left transition-all duration-300 animate-fade-up ${selected ? `${colors.border} ${colors.bg} shadow-[0_0_24px_rgba(221,179,90,0.08)]` : 'border-ink-800/80 bg-ink-900/45 hover:border-ink-600'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} style={{ animationDelay: `${index * 100 + 200}ms` }}>
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition ${selected ? colors.icon : 'bg-ink-800 text-ink-400 group-hover:text-ink-200'}`}><Icon className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="font-display font-medium text-ink-100">{method.title}</span>{method.recommended && <span className="rounded-pill border border-gold-400/25 px-2 py-0.5 font-body text-[10px] text-gold-300">推荐</span>}</div><div className="mt-1 font-body text-sm text-ink-300">{method.desc}</div><div className="mt-0.5 font-body text-xs text-ink-500">{method.longDesc}</div></div>
        <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition ${selected ? `${colors.dot} border-transparent text-ink-950` : 'border-ink-600 text-transparent'}`}>{selected && <Check className="h-3.5 w-3.5" />}</div>
      </div>
      {selected && <div className={`absolute bottom-0 left-4 right-4 h-px ${colors.dot} opacity-60`} />}
    </button>
  )
}

function CastProgress({ method, progress, currentLine, castLines }: { method: Method; progress: number; currentLine: PreviewLine | null; castLines: PreviewLine[] }) {
  const labels = { coins: '铜钱翻转中', yarrow: '蓍草揲四中', manual: '卦象生成中' }
  const tip = method === 'yarrow' ? '每变 4 揲，求其余数。9 为老阳、6 为老阴、7 为少阳、8 为少阴。' : '三枚铜钱，依阴阳组合记录为一爻；六爻自下而上，合成完整卦象。'
  const positions = ['上爻', '五爻', '四爻', '三爻', '二爻', '初爻']
  return (
    <div className="glass-card rounded-card border border-gold-400/30 p-6 animate-fade-in md:p-8">
      <div className="mb-1 flex items-center justify-between"><div className="font-display text-xl font-medium text-gold-300">{labels[method]}</div><span className="font-mono text-[10px] tracking-widest text-ink-500">{String(progress).padStart(2, '0')} / 06</span></div>
      <div className="mb-6 font-body text-xs text-ink-500">爻线从初爻开始，逐层向上显现</div>
      <div className="space-y-2.5">{positions.map((label, displayIndex) => {
        const lineIndex = 5 - displayIndex
        const line = castLines[lineIndex]
        const isCurrent = lineIndex === progress - 1
        return <div key={label} className="flex items-center gap-3"><span className="w-10 font-mono text-[10px] text-ink-500">{label}</span><div className={`flex h-7 flex-1 items-center gap-1 ${line ? 'cast-line' : 'opacity-25'}`}>{line?.yinYang === 'yin' ? <><span className="h-2 flex-1 rounded-sm bg-jade-300/80" /><span className="h-2 flex-1 rounded-sm bg-jade-300/80" /></> : <span className="h-2 w-full rounded-sm bg-gold-300/90" />}{isCurrent && currentLine && <span className="ml-2 font-body text-[10px] text-gold-300">{currentLine.yinYang === 'yang' ? '阳' : '阴'}{currentLine.isChanging ? ' · 动' : ''}</span>}</div>{line && <Check className="h-3.5 w-3.5 flex-shrink-0 text-jade-300" />}</div>
      })}</div>
      <div className="mt-7 h-1 overflow-hidden rounded-full bg-ink-800"><div className="h-full rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-jade-300 transition-all duration-500" style={{ width: `${(progress / 6) * 100}%` }} /></div>
      <p className="mt-6 text-center font-body text-xs leading-relaxed text-ink-500">{tip}</p>
    </div>
  )
}
