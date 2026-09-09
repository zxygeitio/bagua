'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { SyncIndicator } from '@/components/SyncIndicator'
import {
  Anchor,
  Cloud,
  CloudOff,
  Coins,
  Heart,
  HexagramPattern,
  Info,
  Question,
  RefreshCw,
  Sparkles,
  Trash2,
  Wand,
} from '@/components/icons'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { useHistoryStore } from '@/store/history'
import pkg from '../../package.json'

export default function SettingsPage() {
  const [showAnimation, setShowAnimation] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<string | null>(null)
  const records = useHistoryStore((s) => s.records)
  const syncToCloud = useHistoryStore((s) => s.syncToCloud)
  const loadFromCloud = useHistoryStore((s) => s.loadFromCloud)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bagua-settings') ?? '{}') as {
        showAnimation?: boolean
      }
      if (typeof saved.showAnimation === 'boolean') setShowAnimation(saved.showAnimation)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('bagua-settings', JSON.stringify({ showAnimation }))
  }, [showAnimation])

  const handleSync = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      await syncToCloud()
      setSyncResult(`已同步 ${records.length} 条记录`)
    } catch {
      setSyncResult('同步失败，请稍后重试')
    } finally {
      setSyncing(false)
    }
  }

  const handlePull = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      await loadFromCloud()
      setSyncResult('已从云端拉取最新记录')
    } catch {
      setSyncResult('拉取失败，请稍后重试')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <header className="enter-up mb-10">
        <p className="section-kicker">系统设置</p>
        <h1 className="mt-4 font-display text-5xl tracking-[0.06em]">设置</h1>
        <p className="prose-body mt-3 text-bagua-muted">
          个性化起卦习惯、管理云同步、了解版本信息。
        </p>
      </header>

      {/* 起卦方式 */}
      <Section index="01" Icon={Coins} title="起卦方式" desc="起卦页支持硬币法与大衍筮法。">
        <div className="flex items-center gap-4 border-4 border-bagua-text bg-bagua-wash p-4 shadow-soft">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border-4 border-bagua-text bg-bagua-primary text-bagua-surface">
            <Coins className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-base tracking-wider">铜钱 · 三钱六掷</p>
            <p className="mt-1 font-body text-xs text-bagua-muted">
              6 老阴、7 少阳、8 少阴、9 老阳；六爻自下而上记录。另可在起卦页切换大衍筮法。
            </p>
          </div>
        </div>
      </Section>

      {/* 动画 */}
      <Section index="02" Icon={Sparkles} title="仪式动画" desc="关闭可加快起卦节奏。">
        <label className="flex cursor-pointer items-center gap-3 border-4 border-bagua-fiber bg-bagua-surface p-4">
          <span
            className={`flex h-7 w-12 flex-shrink-0 items-center border-4 border-bagua-text px-0.5 transition ${
              showAnimation ? 'bg-bagua-primary' : 'bg-bagua-canvas'
            }`}
          >
            <span
              className={`block h-4 w-4 bg-bagua-surface transition ${
                showAnimation ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </span>
          <input
            type="checkbox"
            checked={showAnimation}
            onChange={(e) => setShowAnimation(e.target.checked)}
            className="sr-only"
          />
          <div className="flex-1">
            <p className="font-display text-sm tracking-wider">启用起卦仪式动画</p>
            <p className="font-body text-xs text-bagua-muted">
              六爻逐爻显现，跟随动爻节奏。系统「减少动态效果」也会自动关闭。
            </p>
          </div>
        </label>
      </Section>

      {/* 云同步 */}
      <Section
        index="03"
        Icon={isSupabaseConfigured ? Cloud : CloudOff}
        title="云同步"
        desc={isSupabaseConfigured ? '已连接 Supabase' : '未配置云端，本地保存'}
        iconClassName={isSupabaseConfigured ? 'text-bagua-primary' : 'text-bagua-muted'}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3 border-4 border-bagua-fiber bg-bagua-canvas/60 p-3">
            <SyncIndicator />
            <span className="font-body text-sm text-bagua-muted">
              本机 {records.length} 条 · {isSupabaseConfigured ? '可同步' : '仅本地'}
            </span>
          </div>
          {isSupabaseConfigured && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="btn-press flex items-center justify-center gap-2 border-4 border-bagua-text bg-bagua-primary px-4 py-3 font-display text-sm tracking-widest text-bagua-surface disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                推送到云端
              </button>
              <button
                onClick={handlePull}
                disabled={syncing}
                className="btn-press flex items-center justify-center gap-2 border-4 border-bagua-text bg-bagua-surface px-4 py-3 font-display text-sm tracking-widest disabled:opacity-50"
              >
                <Cloud className="h-4 w-4" />
                从云端拉取
              </button>
            </div>
          )}
          {syncResult && (
            <p className="border-2 border-bagua-fiber bg-bagua-wash px-3 py-2 font-body text-xs text-bagua-text">
              {syncResult}
            </p>
          )}
          <details className="border-2 border-bagua-fiber bg-bagua-canvas/40 p-3">
            <summary className="flex cursor-pointer items-center gap-2 font-display text-xs tracking-widest text-bagua-muted">
              <Question className="h-3 w-3" />
              云同步如何工作？
            </summary>
            <div className="prose-body mt-3 text-xs text-bagua-muted">
              <p>
                每个设备会生成一个匿名 UUID（仅存于本机 localStorage）。 云端只保存你的 UUID
                与起卦记录，<strong className="text-bagua-text">不收集任何个人信息</strong>。
                换设备会换 UUID，历史不互通——这是隐私优先的设计。
              </p>
            </div>
          </details>
        </div>
      </Section>

      {/* 数据管理 */}
      <Section index="04" Icon={Trash2} title="数据管理" desc="清空本机设置或导出记录。">
        <div className="space-y-2">
          <button
            onClick={() => {
              if (confirm('确定清空本机设置吗？起卦记录不会被删除。')) {
                localStorage.removeItem('bagua-settings')
                setShowAnimation(true)
              }
            }}
            className="btn-secondary w-full"
          >
            恢复默认设置
          </button>
          <button
            onClick={() => {
              if (confirm('确定清空本机所有起卦记录吗？此操作不可恢复。')) {
                localStorage.removeItem('bagua-history')
                window.location.reload()
              }
            }}
            className="btn-press w-full border-4 border-bagua-fiber bg-bagua-canvas px-4 py-3 font-display text-sm tracking-widest text-bagua-muted hover:border-bagua-primary hover:text-bagua-primary"
          >
            清空本机起卦记录
          </button>
        </div>
      </Section>

      {/* 关于 */}
      <Section index="05" Icon={Info} title="关于" desc="版本与数据说明。">
        <dl className="space-y-3 font-body text-sm">
          <Row label="版本" value={`v${pkg.version}`} />
          <Row label="技术栈" value="Next.js 14 · TypeScript · Tailwind" />
          <Row label="数据" value="64 卦经典 + 现代解读" />
          <Row label="起卦法" value="铜钱三钱六掷 / 大衍筮法" />
          <Row label="部署" value="Cloudflare Pages" />
          <Row label="后端" value={isSupabaseConfigured ? 'Supabase (已连接)' : '未启用'} />
        </dl>
        <p className="mt-4 border-4 border-bagua-fiber bg-bagua-wash p-3 font-body text-xs leading-relaxed text-bagua-text">
          免责声明：本工具用于传统文化学习与个人参考，卦象内容不构成医疗、法律、财务或其他专业建议。云同步为可选功能，起卦记录默认仅保存在你的浏览器本地。
        </p>
      </Section>

      {/* 快速链接 */}
      <Section index="06" Icon={Anchor} title="相关链接" desc="学习资源与导航。">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Link href="/learn" className="btn-secondary flex items-center gap-2 text-xs">
            <Heart className="h-3.5 w-3.5" />
            易学入门
          </Link>
          <Link href="/hexagrams" className="btn-secondary flex items-center gap-2 text-xs">
            <HexagramPattern className="h-3.5 w-3.5" />
            六十四卦
          </Link>
          <Link href="/divine" className="btn-secondary flex items-center gap-2 text-xs">
            <Wand className="h-3.5 w-3.5" />
            起卦
          </Link>
        </div>
      </Section>

      <p className="enter-up mt-12 border-t-4 border-bagua-fiber pt-6 text-center font-body text-xs text-bagua-muted">
        八卦 · 仅供文化学习与学术研究
      </p>
    </main>
  )
}

function Section({
  index,
  Icon,
  title,
  desc,
  iconClassName,
  children,
}: {
  index: string
  Icon: typeof Coins
  title: string
  desc: string
  iconClassName?: string
  children: React.ReactNode
}) {
  return (
    <section className="enter-up mb-10">
      <div className="mb-4 flex items-center gap-3 border-b-4 border-bagua-text pb-2">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border-4 border-bagua-text bg-bagua-primary text-bagua-surface">
          <Icon className={`h-4 w-4 ${iconClassName ?? 'text-bagua-surface'}`} strokeWidth={1.8} />
        </span>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[10px] tracking-[0.28em] text-bagua-muted">
              {index}
            </span>
            <h2 className="font-display text-xl tracking-wider">{title}</h2>
          </div>
          <p className="font-body text-xs text-bagua-muted">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b-2 border-bagua-fiber/40 pb-2 last:border-b-0">
      <dt className="w-20 flex-shrink-0 font-display text-[10px] tracking-[0.2em] text-bagua-muted">
        {label}
      </dt>
      <dd className="flex-1 font-body text-sm text-bagua-text">{value}</dd>
    </div>
  )
}
