'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CastMethod, CastRecord, Line, YaoPosition } from '@/lib/iching'
import { cloudHistory, CloudRecord } from '@/repositories/CloudHistoryRepository'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { getAnonymousId } from '@/lib/supabase/identity'

interface HistoryState {
  records: CastRecord[]
  cloudSyncEnabled: boolean
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error'
  addRecord: (record: CastRecord) => Promise<void>
  removeRecord: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  updateNotes: (id: string, notes: string) => Promise<void>
  syncToCloud: () => Promise<void>
  loadFromCloud: () => Promise<void>
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: [],
      cloudSyncEnabled: isSupabaseConfigured,
      cloudSyncStatus: 'idle',

      addRecord: async (record) => {
        set((s) => ({ records: [record, ...s.records].slice(0, 100) }))
        // 后台云同步
        if (isSupabaseConfigured && get().cloudSyncEnabled) {
          get().syncToCloud().catch(console.error)
        }
      },

      removeRecord: async (id) => {
        set((s) => ({ records: s.records.filter((r) => r.id !== id) }))
        if (isSupabaseConfigured && get().cloudSyncEnabled) {
          cloudHistory.remove(id).catch(console.error)
        }
      },

      toggleFavorite: async (id) => {
        set((s) => ({
          records: s.records.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)),
        }))
        if (isSupabaseConfigured && get().cloudSyncEnabled) {
          get().syncToCloud().catch(console.error)
        }
      },

      updateNotes: async (id, notes) => {
        set((s) => ({
          records: s.records.map((r) => (r.id === id ? { ...r, notes } : r)),
        }))
        if (isSupabaseConfigured && get().cloudSyncEnabled) {
          get().syncToCloud().catch(console.error)
        }
      },

      syncToCloud: async () => {
        if (!isSupabaseConfigured) return
        set({ cloudSyncStatus: 'syncing' })
        try {
          const anonId = getAnonymousId()
          await cloudHistory.ensureUser(anonId)
          for (const r of get().records) {
            await cloudHistory.upsert({
              clientId: r.id,
              method: r.method,
              question: r.question,
              benGuaId: r.benGuaId,
              bianGuaId: r.bianGuaId,
              huGuaId: r.huGuaId,
              changingLines: r.changingLinePositions,
              lines: r.lines,
              notes: r.notes,
              favorite: r.favorite,
              timestamp: r.timestamp,
            })
          }
          set({ cloudSyncStatus: 'synced' })
        } catch (e) {
          console.error('云同步失败:', e)
          set({ cloudSyncStatus: 'error' })
        }
      },

      loadFromCloud: async () => {
        if (!isSupabaseConfigured) return
        set({ cloudSyncStatus: 'syncing' })
        try {
          const anonId = getAnonymousId()
          await cloudHistory.ensureUser(anonId)
          const cloudRecords = await cloudHistory.fetchAll()
          // 合并：本地 + 云端（云端为权威）
          const localRecords = get().records
          const merged = new Map<string, CastRecord>()

          // 优先用云端
          for (const cr of cloudRecords) {
            merged.set(cr.clientId, {
              id: cr.clientId,
              timestamp: cr.timestamp,
              method: cr.method as CastMethod,
              question: cr.question,
              lines: cr.lines as Line[],
              benGuaId: cr.benGuaId,
              bianGuaId: cr.bianGuaId,
              huGuaId: cr.huGuaId,
              changingLinePositions: cr.changingLines as YaoPosition[],
              notes: cr.notes,
              favorite: cr.favorite,
            })
          }
          // 补充本地独有
          for (const lr of localRecords) {
            if (!merged.has(lr.id)) merged.set(lr.id, lr)
          }

          const sorted = Array.from(merged.values())
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 100)

          set({ records: sorted, cloudSyncStatus: 'synced' })
        } catch (e) {
          console.error('云端加载失败:', e)
          set({ cloudSyncStatus: 'error' })
        }
      },
    }),
    {
      name: 'bagua-history',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted) => persisted as HistoryState,
    },
  ),
)
