'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SHORTCUTS: Record<string, { key: string; path: string; label: string; alt?: boolean }> = {
  home: { key: 'g h', path: '/', label: '首页' },
  hexagrams: { key: 'g x', path: '/hexagrams', label: '六十四卦' },
  divine: { key: 'g d', path: '/divine', label: '起卦' },
  learn: { key: 'g l', path: '/learn', label: '入门' },
  history: { key: 'g y', path: '/history', label: '历史' },
  settings: { key: 'g s', path: '/settings', label: '设置' },
}

/**
 * 全局键盘快捷键
 * - g h → 回家
 * - g x → 64 卦
 * - g d → 起卦
 * - g l → 入门
 * - g y → 历史
 * - g s → 设置
 * - ? → 显示快捷键帮助
 */
export function useKeyboardShortcuts() {
  const router = useRouter()
  useEffect(() => {
    let buffer: string[] = []
    let timer: ReturnType<typeof setTimeout> | null = null

    const flush = () => {
      buffer = []
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    const onKey = (e: KeyboardEvent) => {
      // 忽略在输入框 / textarea 中的按键
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // ? 打开帮助
      if (e.key === '?' && !buffer.length) {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('bagua:shortcuts:open'))
        return
      }

      // g 开头触发 goto
      if (buffer.length === 0 && e.key.toLowerCase() === 'g') {
        buffer = ['g']
        timer = setTimeout(flush, 800)
        return
      }

      // 第 2 键
      if (buffer.length === 1) {
        buffer.push(e.key.toLowerCase())
        const combo = buffer.join(' ')
        for (const s of Object.values(SHORTCUTS)) {
          if (s.key === combo) {
            e.preventDefault()
            router.push(s.path)
            break
          }
        }
        flush()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      flush()
    }
  }, [router])
}

export { SHORTCUTS }
