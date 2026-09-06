/**
 * 云端历史 Repository - 通过 Supabase 同步
 */
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client'

export interface CloudRecord {
  clientId: string
  method: string
  question?: string
  benGuaId: number
  bianGuaId?: number
  huGuaId?: number
  changingLines: number[]
  lines: unknown[]
  notes?: string
  favorite: boolean
  timestamp: number
}

export class CloudHistoryRepository {
  private userId: string | null = null

  async ensureUser(anonymousId: string): Promise<string> {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Supabase 未配置')

    // upsert 用户
    const { data, error } = await supabase
      .from('bagua_users')
      .upsert({ anonymous_id: anonymousId }, { onConflict: 'anonymous_id' })
      .select('id')
      .single()

    if (error) throw error
    this.userId = data.id
    return data.id
  }

  async fetchAll(): Promise<CloudRecord[]> {
    const supabase = getSupabaseClient()
    if (!supabase || !this.userId) return []

    const { data, error } = await supabase
      .from('bagua_history')
      .select(
        'client_id, method, question, ben_gua_id, bian_gua_id, hu_gua_id, changing_lines, lines_data, notes, favorite, created_at',
      )
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('fetchAll failed:', error)
      return []
    }
    return data.map((r: any) => ({
      clientId: r.client_id,
      method: r.method,
      question: r.question,
      benGuaId: r.ben_gua_id,
      bianGuaId: r.bian_gua_id,
      huGuaId: r.hu_gua_id,
      changingLines: r.changing_lines,
      lines: r.lines_data,
      notes: r.notes,
      favorite: r.favorite,
      timestamp: new Date(r.created_at).getTime(),
    }))
  }

  async upsert(record: CloudRecord): Promise<void> {
    const supabase = getSupabaseClient()
    if (!supabase || !this.userId) return

    const { error } = await supabase.from('bagua_history').upsert(
      {
        user_id: this.userId,
        client_id: record.clientId,
        method: record.method,
        question: record.question,
        ben_gua_id: record.benGuaId,
        bian_gua_id: record.bianGuaId,
        hu_gua_id: record.huGuaId,
        changing_lines: record.changingLines,
        lines_data: record.lines,
        notes: record.notes,
        favorite: record.favorite,
      },
      { onConflict: 'user_id,client_id' },
    )

    if (error) console.error('upsert failed:', error)
  }

  async remove(clientId: string): Promise<void> {
    const supabase = getSupabaseClient()
    if (!supabase || !this.userId) return

    const { error } = await supabase
      .from('bagua_history')
      .delete()
      .eq('user_id', this.userId)
      .eq('client_id', clientId)

    if (error) console.error('remove failed:', error)
  }

  async syncAll(records: CloudRecord[]): Promise<void> {
    if (!isSupabaseConfigured) return
    for (const r of records) {
      await this.upsert(r)
    }
  }
}

export const cloudHistory = new CloudHistoryRepository()
