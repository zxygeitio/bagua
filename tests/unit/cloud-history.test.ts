import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * 用 Proxy 造一个可任意链式调用、终值可指定的 Supabase 假客户端。
 * from() 按表名返回独立链，链上任何方法调用都返回链自身，且链是 thenable。
 */
function makeChain(result: { data?: unknown; error?: unknown }) {
  const promise = Promise.resolve(result)
  const proxy: any = new Proxy(
    {},
    {
      get(_t, prop) {
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
          return (promise as any)[prop].bind(promise)
        }
        return () => proxy
      },
    },
  )
  return proxy
}

const tableResults: Record<string, { data?: unknown; error?: unknown }> = {}
const fromSpy = vi.fn((table: string) => makeChain(tableResults[table] ?? {}))

vi.mock('@/lib/supabase/client', () => {
  const state = { client: null as unknown }
  return {
    getSupabaseClient: () => state.client,
    isSupabaseConfigured: true,
    __state: state,
  }
})

import { CloudHistoryRepository } from '@/repositories'
import * as clientMod from '@/lib/supabase/client'
const __state = (clientMod as any).__state as { client: unknown }

describe('云端历史 Repository', () => {
  let repo: CloudHistoryRepository

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    repo = new CloudHistoryRepository()
    // 默认挂一个可用假客户端
    __state.client = { from: fromSpy } as any
    Object.keys(tableResults).forEach((k) => delete tableResults[k])
  })

  it('未配置 Supabase 时 ensureUser 抛错、其余操作静默降级', async () => {
    __state.client = null
    await expect(repo.ensureUser('anon-1')).rejects.toThrow('Supabase 未配置')
    await expect(repo.fetchAll()).resolves.toEqual([])
    await expect(repo.upsert({} as never)).resolves.toBeUndefined()
    await expect(repo.remove('x')).resolves.toBeUndefined()
    await expect(repo.syncAll([])).resolves.toBeUndefined()
  })

  it('ensureUser upsert 成功后返回用户 ID 并记住会话', async () => {
    tableResults['bagua_users'] = { data: { id: 'user-42' }, error: null }
    await expect(repo.ensureUser('anon-1')).resolves.toBe('user-42')
  })

  it('ensureUser 出错时抛出原始 error', async () => {
    tableResults['bagua_users'] = { data: null, error: { message: 'boom' } }
    await expect(repo.ensureUser('anon-1')).rejects.toEqual({ message: 'boom' })
  })

  it('未登录（无 userId）时 fetchAll 返回空数组', async () => {
    tableResults['bagua_history'] = { data: [{ client_id: 'c1' }], error: null }
    await expect(repo.fetchAll()).resolves.toEqual([])
  })

  it('fetchAll 成功时做蛇形→驼峰字段映射与时间戳转换', async () => {
    tableResults['bagua_users'] = { data: { id: 'user-42' }, error: null }
    await repo.ensureUser('anon-1')
    const iso = '2026-09-09T08:00:00.000Z'
    tableResults['bagua_history'] = {
      data: [
        {
          client_id: 'c1',
          method: 'coins',
          question: 'q',
          ben_gua_id: 1,
          bian_gua_id: 44,
          hu_gua_id: 2,
          changing_lines: [1],
          lines_data: [],
          notes: 'n',
          favorite: true,
          created_at: iso,
        },
      ],
      error: null,
    }
    const rows = await repo.fetchAll()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      clientId: 'c1',
      method: 'coins',
      benGuaId: 1,
      bianGuaId: 44,
      favorite: true,
      timestamp: new Date(iso).getTime(),
    })
  })

  it('fetchAll 出错时返回空数组并记录日志', async () => {
    tableResults['bagua_users'] = { data: { id: 'user-42' }, error: null }
    await repo.ensureUser('anon-1')
    tableResults['bagua_history'] = { data: null, error: { message: 'db down' } }
    await expect(repo.fetchAll()).resolves.toEqual([])
    expect(console.error).toHaveBeenCalled()
  })

  it('upsert 成功/失败均不抛错（失败仅记日志）', async () => {
    tableResults['bagua_users'] = { data: { id: 'user-42' }, error: null }
    await repo.ensureUser('anon-1')
    tableResults['bagua_history'] = { error: null }
    const record = {
      clientId: 'c1',
      method: 'coins',
      benGuaId: 1,
      changingLines: [],
      lines: [],
      favorite: false,
      timestamp: 0,
    }
    await expect(repo.upsert(record)).resolves.toBeUndefined()
    tableResults['bagua_history'] = { error: { message: 'conflict' } }
    await expect(repo.upsert(record)).resolves.toBeUndefined()
    expect(console.error).toHaveBeenCalled()
  })

  it('remove 不抛错', async () => {
    tableResults['bagua_users'] = { data: { id: 'user-42' }, error: null }
    await repo.ensureUser('anon-1')
    await expect(repo.remove('c1')).resolves.toBeUndefined()
  })

  it('syncAll 逐条上送所有记录', async () => {
    tableResults['bagua_users'] = { data: { id: 'user-42' }, error: null }
    await repo.ensureUser('anon-1')
    tableResults['bagua_history'] = { error: null }
    const records = [1, 2, 3].map((i) => ({
      clientId: `c${i}`,
      method: 'coins',
      benGuaId: i,
      changingLines: [],
      lines: [],
      favorite: false,
      timestamp: 0,
    }))
    await repo.syncAll(records)
    // from 调用次数：ensureUser 1 次 + upsert 3 次
    expect(fromSpy.mock.calls.filter((c) => c[0] === 'bagua_history')).toHaveLength(3)
  })
})
