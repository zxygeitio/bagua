import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ __mock: 'supabase-client' })),
}))

const { createClient } = await import('@supabase/supabase-js')

/** client.ts 的 isSupabaseConfigured / supabase 单例在模块加载时求值，须重置模块按环境分别加载 */
async function loadClientModule() {
  vi.resetModules()
  vi.clearAllMocks()
  return await import('@/lib/supabase/client')
}

describe('Supabase 客户端工厂', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('未配置环境变量时 isSupabaseConfigured=false 且返回 null', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')
    const { isSupabaseConfigured, getSupabaseClient } = await loadClientModule()
    expect(isSupabaseConfigured).toBe(false)
    expect(getSupabaseClient()).toBeNull()
    expect(createClient).not.toHaveBeenCalled()
  })

  it('配置完整时返回单例客户端', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
    const { isSupabaseConfigured, getSupabaseClient } = await loadClientModule()
    expect(isSupabaseConfigured).toBe(true)
    const c1 = getSupabaseClient()
    const c2 = getSupabaseClient()
    expect(c1).toBe(c2)
    expect(createClient).toHaveBeenCalledTimes(1)
  })

  it('占位符「你的」视为未配置', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://你的项目.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '你的密钥')
    const { isSupabaseConfigured, getSupabaseClient } = await loadClientModule()
    expect(isSupabaseConfigured).toBe(false)
    expect(getSupabaseClient()).toBeNull()
  })

  it('仅配置 URL 未配置 KEY 视为未配置', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')
    const { isSupabaseConfigured } = await loadClientModule()
    expect(isSupabaseConfigured).toBe(false)
  })
})
