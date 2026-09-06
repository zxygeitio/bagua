'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CastRecord } from '@/lib/iching'

interface HistoryState {
  records: CastRecord[]
  addRecord: (record: CastRecord) => void
  removeRecord: (id: string) => void
  toggleFavorite: (id: string) => void
  updateNotes: (id: string, notes: string) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) => set(s => ({ records: [record, ...s.records].slice(0, 100) })),
      removeRecord: (id) => set(s => ({ records: s.records.filter(r => r.id !== id) })),
      toggleFavorite: (id) => set(s => ({
        records: s.records.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r)
      })),
      updateNotes: (id, notes) => set(s => ({
        records: s.records.map(r => r.id === id ? { ...r, notes } : r)
      })),
    }),
    {
      name: 'bagua-history',
      version: 1,
    }
  )
)
