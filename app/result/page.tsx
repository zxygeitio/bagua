'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Reveal } from '@/components/Reveal'
import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { VerdictPanel } from '@/components/hexagram/VerdictPanel'
import { ShareDialog } from '@/components/ShareDialog'
import { ShareCard } from '@/components/ShareCard'
import { SiteShell } from '@/components/shared/SiteShell'
import { SyncIndicator } from '@/components/SyncIndicator'
import { Check, Download, RefreshCw, Share2, Star, Trash2 } from '@/components/icons'
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

const TAB_DESC: Record<Tab, string> = {
  ben: '起卦所得 · 当前',
  bian: '动爻之后 · 终局',
  hu: '中四爻成 · 过程',
  dui: '阴阳全反 · 对面',
  zong: '上下颠倒 · 换位',
}

export default function ResultPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('ben')
  const [recordId, setRecordId] = useState<string | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
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
        <main className="flex min-h-[50vh] items-center justify-center px-4 text-center">
          <div>
            <p className="font-display text-2xl">记录未成</p>
            <p className="prose-body mt-3 text-bagua-muted">所寻记录已迁去，或本不存在。</p>
            <Link href="/" className="btn-primary mt-6 inline-flex">返回首页</Link>
          </div>
        </main>
      </SiteShell>
    )
  }

  const benGua = getGuaById(record.benGuaId)
  const bianGua = record.bianGuaId ? getGuaById(record.bianGuaId) : null
  const activeGua = (() => {
    switch (activeTab) {
      case 'ben': return benGua
      case 'bian': return bianGua
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
        bian: bianGua,
        changing: record.changingLinePositions,
      })
    : null

  const changingCount = record.changingLinePositions.length

  return (
    <SiteShell eyebrow="RESULT / 判词">
      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        {/* ===== 顶部操作栏 ===== */}
        <header className="enter-up mb-8 flex flex-wrap items-center justify-between gap-3 border-b-4 border-bagua-text pb-4">
          <div>
            <p className="font-display text-[10px] tracking-[0.28em] text-bagua-muted">RESULT · 判词</p>
            <p className="mt-1 font-body text-xs text-bagua-text">{date} · {methodLabel}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <SyncIndicator />
            <IconBtn
              active={record.favorite}
              onClick={() => toggleFavorite(record.id)}
              label="收藏"
            >
              <Star className="h-4 w-4" fill={record.favorite ? 'currentColor' : 'none'} />
            </IconBtn>
            <IconBtn
              onClick={() => setShowShareCard(true)}
              label="下载卦象卡"
            >
              <Download className="h-4 w-4" />
            </IconBtn>
            <IconBtn
              onClick={() => {
                if (confirm('确定要删除这条记录吗？')) {
                  removeRecord(record.id)
                  router.push('/history')
                }
              }}
              label="删除"
              danger
            >
              <Trash2 className="h-4 w-4" />
            </IconBtn>
          </div>
        </header>

        {/* ===== 问题 / 场景 ===== */}
        {(record.question || record.scenario) && (
          <div className="enter-up stagger-1 mb-8 grid gap-3">
            {record.question && (
              <div className="border-l-4 border-bagua-primary bg-bagua-wash px-4 py-3">
                <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">问</p>
                <p className="prose-classical mt-1 text-[19px]">{record.question}</p>
              </div>
            )}
            {record.scenario && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="border-2 border-bagua-text bg-bagua-primary px-2 py-0.5 font-display tracking-widest text-bagua-surface">
                  问事
                </span>
                <span className="font-display text-sm tracking-widest text-bagua-text">
                  {SCENARIO_LABELS[record.scenario]}
                </span>
                {record.kind === 'daily' && (
                  <span className="font-body text-bagua-muted">· 今日之象</span>
                )}
                {changingCount > 0 && (
                  <span className="ml-auto font-body text-bagua-muted">
                    {changingCount} 爻动
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== 朱熹判读 ===== */}
        {reading && (
          <Reveal>
            <section className="mb-10">
              <SectionHeader index="01" title="朱熹判读" desc="本卦两动爻，以上爻为主。" />
              <VerdictPanel rule={reading.rule} verdicts={reading.verdicts} />
            </section>
          </Reveal>
        )}

        {/* ===== 笔记 ===== */}
        <Reveal delay={100}>
        <section className="enter-up stagger-3 mb-10">
          <SectionHeader
            index="02"
            title="判后笔记"
            desc="写下当下的判断，方便日后复盘。"
            action={
              <button
                type="button"
                onClick={async () => {
                  await updateNotes(record.id, noteDraft.trim())
                  setNoteSaved(true)
                  window.setTimeout(() => setNoteSaved(false), 1800)
                }}
                className={`btn-press border-2 px-3 py-1.5 font-display text-[11px] tracking-widest transition ${
                  noteSaved
                    ? 'border-bagua-text bg-bagua-text text-bagua-surface'
                    : 'border-bagua-text bg-bagua-surface hover:bg-bagua-wash'
                }`}
              >
                {noteSaved ? (
                  <>
                    <Check className="mr-1 inline h-3 w-3" />
                    已保存
                  </>
                ) : (
                  '保存备注'
                )}
              </button>
            }
          />
          <div className="paper-panel p-5">
            <textarea
              value={noteDraft}
              onChange={(event) => {
                setNoteDraft(event.target.value)
                setNoteSaved(false)
              }}
              rows={4}
              maxLength={500}
              placeholder="例如：两周后回看这次判断的变化……"
              className="w-full resize-y border-2 border-bagua-fiber bg-bagua-canvas/40 px-3 py-2 font-body text-sm leading-relaxed outline-none transition placeholder:text-bagua-muted/70 focus:border-bagua-primary"
            />
            <div className="mt-1 text-right font-mono text-[10px] text-bagua-muted">
              {noteDraft.length}/500
            </div>
          </div>
        </section>
        </Reveal>

        {/* ===== 五种卦变 ===== */}
        <Reveal delay={200}>
        <section className="enter-up stagger-4 mb-10">
          <SectionHeader
            index="03"
            title="五种卦变"
            desc="本卦、之卦、互卦、错卦、综卦。五种角度看同一时刻。"
          />
          <div className="paper-panel">
            <div className="flex overflow-x-auto border-b-4 border-bagua-text">
              {(['ben', 'bian', 'hu', 'dui', 'zong'] as Tab[]).map((tab) => {
                const active = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 whitespace-nowrap px-3 py-3 font-display text-xs tracking-widest transition ${
                      active
                        ? 'bg-bagua-primary text-bagua-surface'
                        : 'bg-bagua-surface text-bagua-muted hover:bg-bagua-wash hover:text-bagua-text'
                    }`}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                )
              })}
            </div>
            <p className="border-b-2 border-bagua-fiber bg-bagua-canvas/40 px-4 py-2 font-body text-xs text-bagua-muted">
              {TAB_DESC[activeTab]}
            </p>
            {activeGua ? (
              <div className="bg-bagua-canvas/30 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <HexagramSymbol gua={activeGua} size="lg" />
                </div>
                <h2 className="font-display text-3xl tracking-[0.1em] text-bagua-text">
                  {activeGua.name}
                </h2>
                <p className="mt-2 font-body text-sm text-bagua-muted">
                  #{activeGua.id.toString().padStart(2, '0')} / 64 · {activeGua.pronunciation} · 五行属{activeGua.wuxing}
                </p>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="font-body text-bagua-muted">
                  本次起卦无{TAB_LABELS[activeTab]}（无动爻）
                </p>
              </div>
            )}
          </div>
        </section>
        </Reveal>

        {/* ===== 卦辞 · 彖 · 象 · 现代启示 ===== */}
        {activeGua && (
          <Reveal delay={300}>
          <section className="enter-up stagger-5 mb-10 space-y-6">
            <ClassicSection index="04" title="卦辞" body={activeGua.guaci} />
            <ClassicSection index="05" title="彖传" body={activeGua.tuanZhuan} larger />
            <ClassicSection index="06" title="象传" body={activeGua.daXiangZhuan} />
            <InsightSection index="07" title="现代启示" body={activeGua.modernInsight} />
          </section>
          </Reveal>
        )}

        {/* ===== 六爻详情 ===== */}
        {activeTab === 'ben' && benGua && (
          <Reveal delay={400}>
          <section className="enter-up stagger-6 mb-10">
            <SectionHeader index="08" title="六爻详情" desc="动爻处即是变化的关键。" />
            <ol className="space-y-3">
              {[...benGua.yaos].reverse().map((yao, i) => {
                const isChanging = record.changingLinePositions.includes(yao.position)
                const isPrimary = reading?.rule.primaryPositions[0] === yao.position
                const yaoLabelYang = ['初九', '九二', '九三', '九四', '九五', '上九'][yao.position - 1]
                const yaoLabelYin = ['初六', '六二', '六三', '六四', '六五', '上六'][yao.position - 1]
                const label = yao.yinYang === 'yang' ? yaoLabelYang! : yaoLabelYin!
                return (
                  <Reveal key={yao.position} delay={i * 60} direction="left">
                  <li
                    className={`border-l-4 pl-4 transition hover:translate-x-1 ${
                      isPrimary
                        ? 'border-bagua-primary bg-bagua-wash py-3'
                        : isChanging
                          ? 'border-bagua-primary bg-bagua-wash/40 py-3'
                          : 'border-bagua-text bg-bagua-surface py-3'
                    }`}
                  >
                    <p className="flex items-center gap-2 font-display text-xs tracking-widest">
                      <span className={isChanging || isPrimary ? 'text-bagua-primary' : 'text-bagua-text'}>
                        {label}
                      </span>
                      {isChanging && (
                        <span className="border border-bagua-primary px-1.5 py-0.5 text-[10px] text-bagua-primary">
                          动爻
                        </span>
                      )}
                      {isPrimary && (
                        <span className="border border-bagua-primary bg-bagua-primary px-1.5 py-0.5 text-[10px] text-bagua-surface">
                          主占
                        </span>
                      )}
                      <span className="ml-auto text-bagua-muted">
                        {yao.yinYang === 'yang' ? '━━━ 阳' : '━ ━ 阴'}
                      </span>
                    </p>
                    <p className="prose-classical mt-1 text-[18px]">{yao.text}</p>
                    <p className="prose-body mt-1 text-sm text-bagua-muted">
                      《象》曰：{yao.xiangZhuan}
                    </p>
                  </li>
                  </Reveal>
                )
              })}
            </ol>
          </section>
          </Reveal>
        )}

        {/* ===== 底部操作 ===== */}
        <div className="enter-up mt-10 flex flex-wrap gap-3 border-t-4 border-bagua-text pt-8">
          <Link href="/divine" className="btn-primary">
            <RefreshCw className="h-4 w-4" />
            再来一卦
          </Link>
          <Link href="/history" className="btn-secondary">查看历史</Link>
          <button type="button" onClick={() => setShowShare(true)} className="btn-secondary">
            <Share2 className="h-4 w-4" />
            分享链接
          </button>
        </div>
      </main>

      {showShare && <ShareDialog recordId={record.id} onClose={() => setShowShare(false)} />}
      {showShareCard && benGua && (
        <ShareCard
          gua={benGua}
          question={record.question}
          scenario={record.scenario}
          date={date}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </SiteShell>
  )
}

function SectionHeader({
  index,
  title,
  desc,
  action,
}: {
  index: string
  title: string
  desc: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="border-2 border-bagua-text bg-bagua-primary px-2 py-0.5 font-display text-[10px] tracking-widest text-bagua-surface">
            {index}
          </span>
          <h2 className="font-display text-xl tracking-wider md:text-2xl">{title}</h2>
        </div>
        <p className="prose-body mt-1.5 text-sm text-bagua-muted">{desc}</p>
      </div>
      {action}
    </div>
  )
}

function ClassicSection({ index, title, body, larger }: { index: string; title: string; body: string; larger?: boolean }) {
  return (
    <div>
      <SectionHeader index={index} title={title} desc="" />
      <div className="border-l-4 border-bagua-text bg-bagua-surface px-5 py-4 shadow-soft">
        <p className={`prose-classical ${larger ? 'text-[20px]' : 'text-[19px]'}`}>{body}</p>
      </div>
    </div>
  )
}

function InsightSection({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div>
      <SectionHeader index={index} title={title} desc="以现代视角重读古经。" />
      <div className="border-4 border-bagua-text bg-bagua-wash px-5 py-4">
        <p className="prose-body text-bagua-text">{body}</p>
      </div>
    </div>
  )
}

function IconBtn({
  children,
  onClick,
  active,
  label,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  label: string
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`btn-press flex h-8 w-8 items-center justify-center border-4 transition ${
        danger
          ? 'border-bagua-fiber text-bagua-muted hover:border-bagua-primary hover:text-bagua-primary'
          : active
            ? 'border-bagua-text bg-bagua-primary text-bagua-surface'
            : 'border-bagua-text text-bagua-text hover:bg-bagua-wash'
      }`}
    >
      {children}
    </button>
  )
}
