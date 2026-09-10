import { createClient, SupabaseClient } from '@supabase/supabase-js'

import { getAnonymousId } from './identity'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * 身份头：Supabase (PostgREST) 会把请求头暴露为
 * `request.header.x-anonymous-id` GUC，供 RLS 策略读取（见 supabase/schema.sql）。
 */
function identityHeaders(): Record<string, string> {
  const anonymousId = typeof window === 'undefined' ? '' : getAnonymousId()
  return anonymousId ? { 'x-anonymous-id': anonymousId } : {}
}

/**
 * 检测是否有真实 Supabase 配置
 */
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('你的') &&
    !SUPABASE_ANON_KEY.includes('你的'),
)

/**
 * 获取 Supabase 客户端（如果未配置，返回 null 使用 mock）
 */
let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false }, // 匿名模式不需要 session
      global: { headers: identityHeaders() },
    })
  }
  return _client
}

export const supabase = getSupabaseClient()
