'use client'
import { useEffect, useState } from 'react'
import { useHistoryStore } from '@/store/history'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { Cloud, CloudOff, Loader2, Check } from '@/components/icons'

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
      <span className="flex items-center gap-1 border-4 border-bagua-fiber px-2 py-1 font-display text-[10px] tracking-widest text-bagua-muted">
        <CloudOff className="h-3 w-3" />
        本地模式
      </span>
    )
  }

  const statusConfig = {
    idle: { icon: Cloud, color: 'text-bagua-muted', label: '云同步就绪' },
    syncing: { icon: Loader2, color: 'text-bagua-primary animate-spin', label: '同步中' },
    synced: { icon: Check, color: 'text-bagua-primary', label: '已同步' },
    error: { icon: CloudOff, color: 'text-red-500', label: '同步失败' },
  }
  const cfg = statusConfig[status]
  const Icon = cfg.icon

  return (
    <button
      onClick={() => loadFromCloud()}
      className="flex items-center gap-1 border-4 border-bagua-text bg-bagua-surface px-2 py-1 font-display text-[10px] tracking-widest hover:bg-bagua-wash"
      title={`点击从云端加载（${records.length} 条本地记录）`}
    >
      <Icon className={`h-3 w-3 ${cfg.color}`} />
      <span className={cfg.color}>{cfg.label}</span>
    </button>
  )
}