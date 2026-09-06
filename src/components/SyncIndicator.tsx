'use client'
import { useEffect, useState } from 'react'
import { useHistoryStore } from '@/store/history'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { Cloud, CloudOff, Loader2, Check } from 'lucide-react'

export function SyncIndicator() {
  const status = useHistoryStore(s => s.cloudSyncStatus)
  const loadFromCloud = useHistoryStore(s => s.loadFromCloud)
  const records = useHistoryStore(s => s.records)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 首次挂载时从云端加载（如果已配置）
    if (isSupabaseConfigured && records.length === 0) {
      loadFromCloud().catch(console.error)
    }
  }, [loadFromCloud, records.length])

  if (!mounted || !isSupabaseConfigured) {
    return (
      <span className="flex items-center gap-1 rounded-pill border border-bagua-border/30 bg-bagua-canvas/50 px-2 py-1 font-body text-xs text-bagua-muted">
        <CloudOff className="h-3 w-3" />
        本地模式
      </span>
    )
  }

  const statusConfig = {
    idle: { icon: Cloud, color: 'text-bagua-muted', label: '云同步就绪' },
    syncing: { icon: Loader2, color: 'text-bagua-primary animate-spin', label: '同步中' },
    synced: { icon: Check, color: 'text-bagua-secondary', label: '已同步' },
    error: { icon: CloudOff, color: 'text-red-500', label: '同步失败' },
  }
  const cfg = statusConfig[status]
  const Icon = cfg.icon

  return (
    <button
      onClick={() => loadFromCloud()}
      className="flex items-center gap-1 rounded-pill border border-bagua-secondary/20 bg-bagua-secondary/5 px-2 py-1 font-body text-xs transition hover:bg-bagua-secondary/10"
      title={`点击从云端加载（${records.length} 条本地记录）`}
    >
      <Icon className={`h-3 w-3 ${cfg.color}`} />
      <span className={cfg.color}>{cfg.label}</span>
    </button>
  )
}