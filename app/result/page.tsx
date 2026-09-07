'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { VerdictPanel } from '@/components/hexagram/VerdictPanel'
import { ShareDialog } from '@/components/ShareDialog'
import { SiteShell } from '@/components/shared/SiteShell'
import { SyncIndicator } from '@/components/SyncIndicator'
import { Check, RefreshCw, Share2, Star, Trash2 } from '@/components/icons'
import { getGuaById } from '@/lib/iching'
import { assembleReading } from '@/lib/qigua/reading'
import { CAST_METHOD_LABELS, SCENARIO_LABELS } from '@/types/iching'
import { useHistoryStore } from '@/store/history'

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
  const [noteDraft, setNoteDraft] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const records = useHistoryStore((s) => s.records)
  const toggleFavorite = useHistoryStore((s) => s.toggleFavorite)
  const removeRecord = useHistoryStore((s) => s.removeRecord)
  const updateNotes = useHistoryStore((s) => s.updateNotes)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setRecordId(params.get('id'))
    }
  }, [])

  const record = recordId ? records.find((r) => r.id === recordId) : undefined

  useEffect(() => {
    setNoteDraft(record?.notes ?? '')
    setNoteSaved(false)
  }, [record?.id, record?.notes])

  if (!record) {
    return (
      <SiteShell>
        <main className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <p className="font-body text-bagua-muted">记录不存在或已删除</p>
            <Link href="/" className="mt-4 inline-block font-display text-sm text-bagua-primary">返回首页</Link>
          </div>
        </main>
      </SiteShell>
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

  const methodLabel = CAST_METHOD_LABELS[record.method] ?? record.method
  const date = new Date(record.timestamp).toLocaleString('zh-CN')
  const reading = benGua
    ? assembleReading({
        ben: benGua,
        bian: record.bianGuaId ? getGuaById(record.bianGuaId) : null,
        changing: record.changingLinePositions,
      })
    : null

  return (
    <SiteShell eyebrow="RESULT / 判词">
      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-[11px] tracking-[0.2em] text-bagua-muted">{date} · {methodLabel}</p>
          <div className="flex items-center gap-2">
            <SyncIndicator />
            <button type="button" onClick={() => toggleFavorite(record.id)} aria-label="收藏" className="btn-press border-4 border-bagua-text p-1">
              <Star className="h-4 w-4" fill={record.favorite ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              aria-label="删除"
              onClick={() => {
                if (confirm('确定要删除这条记录吗？')) {
                  removeRecord(record.id)
                  router.push('/history')
                }
              }}
              className="btn-press border-4 border-bagua-text p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {record.question ? (
          <p className="prose-classical mt-6">问：{record.question}</p>
        ) : null}
        {record.scenario ? (
          <p className="mt-2 font-display text-[11px] tracking-[0.2em] text-bagua-primary">
            问事 · {SCENARIO_LABELS[record.scenario]}
            {record.kind === 'daily' ? ' · 今日之象' : ''}
          </p>
        ) : null}

        {reading ? (
          <div className="mt-8">
            <VerdictPanel rule={reading.rule} verdicts={reading.verdicts} />
          </div>
        ) : null}

        <div className="mt-8 border-4 border-bagua-text bg-bagua-surface p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-sm tracking-widest">本次记录</h2>
              <p className="mt-1 font-body text-xs text-bagua-muted">写下当下的判断，方便日后复盘。</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await updateNotes(record.id, noteDraft.trim())
                setNoteSaved(true)
                window.setTimeout(() => setNoteSaved(false), 1800)
              }}
              className="btn-secondary text-xs"
            >
              {noteSaved ? <Check className="h-3.5 w-3.5" /> : null}
              {noteSaved ? '已保存' : '保存备注'}
            </button>
          </div>
          <textarea
            value={noteDraft}
            onChange={(event) => {
              setNoteDraft(event.target.value)
              setNoteSaved(false)
            }}
            rows={3}
            maxLength={500}
            placeholder="例如：两周后回看这次判断的变化……"
            className="w-full resize-y border-4 border-bagua-text bg-bagua-canvas px-3 py-2 font-body text-sm leading-relaxed outline-none placeholder:text-bagua-muted"
          />
        </div>

        <div className="mt-8 border-4 border-bagua-text">
          <div className="flex overflow-x-auto border-b-4 border-bagua-text">
            {(['ben', 'bian', 'hu', 'dui', 'zong'] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 whitespace-nowrap px-4 py-3 font-display text-xs tracking-widest ${
                  activeTab === tab ? 'bg-bagua-primary text-bagua-surface' : 'bg-bagua-surface text-bagua-muted'
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
          {activeGua ? (
            <div className="bg-bagua-canvas p-8 text-center">
              <div className="mb-4 flex justify-center"><HexagramSymbol gua={activeGua} size="lg" /></div>
              <h2 className="font-display text-3xl tracking-[0.16em]">{activeGua.name}</h2>
              <p className="mt-2 font-body text-sm text-bagua-muted">#{activeGua.id} / 64 · {activeGua.pronunciation} · 五行{activeGua.wuxing}</p>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="font-body text-bagua-muted">本次起卦无{TAB_LABELS[activeTab]}（无动爻）</p>
            </div>
          )}
        </div>

        {activeGua && (
          <div className="mt-8 space-y-8">
            <section>
              <h3 className="font-display text-xs tracking-[0.28em] text-bagua-primary">卦辞</h3>
              <p className="prose-classical mt-3">{activeGua.guaci}</p>
            </section>
            <section>
              <h3 className="font-display text-xs tracking-[0.28em] text-bagua-primary">彖传</h3>
              <p className="prose-classical mt-3 text-[18px]">{activeGua.tuanZhuan}</p>
            </section>
            <section>
              <h3 className="font-display text-xs tracking-[0.28em] text-bagua-primary">象传</h3>
              <p className="prose-classical mt-3">{activeGua.daXiangZhuan}</p>
            </section>
            <section>
              <h3 className="font-display text-xs tracking-[0.28em] text-bagua-primary">现代启示</h3>
              <p className="prose-body mt-3">{activeGua.modernInsight}</p>
            </section>
          </div>
        )}

        {activeTab === 'ben' && benGua && (
          <section className="mt-10">
            <h3 className="mb-4 font-display text-sm tracking-[0.24em]">六爻详情</h3>
            <ol className="space-y-5">
              {[...benGua.yaos].map((yao) => {
                const isChanging = record.changingLinePositions.includes(yao.position)
                const isPrimary = reading?.rule.primaryPositions[0] === yao.position
                const yaoLabelYang = ['初九', '九二', '九三', '九四', '九五', '上九'][yao.position - 1]
                const yaoLabelYin = ['初六', '六二', '六三', '六四', '六五', '上六'][yao.position - 1]
                const label = yao.yinYang === 'yang' ? yaoLabelYang! : yaoLabelYin!
                return (
                  <li key={yao.position} className={`border-l-4 pl-4 ${isPrimary ? 'border-bagua-primary bg-bagua-surface' : isChanging ? 'border-bagua-primary' : 'border-bagua-text'}`}>
                    <p className="font-display text-xs tracking-widest">
                      {label}
                      {isChanging ? <span className="ml-2 text-bagua-primary">动爻</span> : null}
                      {isPrimary ? <span className="ml-2 text-bagua-primary">主占</span> : null}
                    </p>
                    <p className="prose-classical mt-1 text-[18px]">{yao.text}</p>
                    <p className="prose-body mt-1 text-sm text-bagua-muted">《象》曰：{yao.xiangZhuan}</p>
                  </li>
                )
              })}
            </ol>
          </section>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/divine" className="btn-primary">
            <RefreshCw className="h-4 w-4" />
            再来一卦
          </Link>
          <Link href="/history" className="btn-secondary">查看历史</Link>
          <button type="button" onClick={() => setShowShare(true)} className="btn-secondary">
            <Share2 className="h-4 w-4" />
            分享
          </button>
        </div>
      </main>

      {showShare && <ShareDialog recordId={record.id} onClose={() => setShowShare(false)} />}
    </SiteShell>
  )
}
