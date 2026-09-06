/**
 * 匿名用户身份 - 设备级唯一 ID
 * 使用 localStorage 持久化（用户不需要注册）
 */
const ANON_ID_KEY = 'bagua-anonymous-id'

function generateUUID(): string {
  // 简单 UUID v4 生成（无需依赖）
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(ANON_ID_KEY)
  if (!id) {
    id = generateUUID()
    localStorage.setItem(ANON_ID_KEY, id)
  }
  return id
}
