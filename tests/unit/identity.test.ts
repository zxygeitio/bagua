import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { getAnonymousId } from '@/lib/supabase/identity'

describe('匿名身份', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('首次调用生成 UUID 并持久化到 localStorage', () => {
    const id = getAnonymousId()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    expect(localStorage.getItem('bagua-anonymous-id')).toBe(id)
  })

  it('二次调用返回同一 ID（设备级稳定）', () => {
    const a = getAnonymousId()
    const b = getAnonymousId()
    expect(a).toBe(b)
  })

  it('清除存储后重新生成新 ID', () => {
    const a = getAnonymousId()
    localStorage.clear()
    const b = getAnonymousId()
    expect(a).not.toBe(b)
  })

  it('crypto.randomUUID 不可用时走 Math.random fallback 仍得合法 UUID v4', () => {
    vi.stubGlobal('crypto', { randomUUID: undefined })
    localStorage.clear()
    const id = getAnonymousId()
    // UUID v4 形态：版本位 4，变体位 8/9/a/b
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(localStorage.getItem('bagua-anonymous-id')).toBe(id)
  })
})
