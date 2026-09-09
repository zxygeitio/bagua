'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { X } from '@/components/icons'
import { SHORTCUTS } from '@/hooks/useKeyboardShortcuts'

export function KeyboardHelp() {
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    // 首次访问 5 秒后显示提示（之后记住）
    if (typeof window === 'undefined') return
    if (localStorage.getItem('bagua:shortcuts:hint') === 'dismissed') {
      setHint(false)
    } else {
      const t = setTimeout(() => setHint(true), 4000)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener('bagua:shortcuts:open', openHandler)
    return () => window.removeEventListener('bagua:shortcuts:open', openHandler)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const dismissHint = () => {
    setHint(false)
    try {
      localStorage.setItem('bagua:shortcuts:hint', 'dismissed')
    } catch {
      // ignore
    }
  }

  return (
    <>
      {hint && !open && (
        <button
          type="button"
          onClick={() => {
            dismissHint()
            setOpen(true)
          }}
          className="btn-press fixed bottom-20 left-4 z-30 hidden items-center gap-2 border-2 border-bagua-text bg-bagua-surface px-3 py-1.5 font-body text-xs tracking-widest text-bagua-text shadow-soft md:bottom-6 md:flex"
        >
          按{' '}
          <kbd className="border border-bagua-text bg-bagua-canvas px-1.5 py-0.5 font-mono">?</kbd>{' '}
          看快捷键
        </button>
      )}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="键盘快捷键"
            className="paper-panel relative max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-press absolute right-3 top-3 flex h-8 w-8 items-center justify-center border-2 border-bagua-text"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">
              KEYBOARD · 快捷键
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-wider">按两键跳转</h2>
            <p className="mt-2 font-body text-sm text-bagua-muted">
              先按{' '}
              <kbd className="border border-bagua-text bg-bagua-wash px-1.5 py-0.5 font-mono text-xs">
                g
              </kbd>
              ， 再按第二键。0.8 秒内有效。
            </p>
            <ul className="mt-5 space-y-2">
              {Object.entries(SHORTCUTS).map(([key, s]) => (
                <li
                  key={key}
                  className="flex items-center justify-between border-b border-bagua-fiber/40 py-1.5"
                >
                  <Link
                    href={s.path}
                    onClick={() => setOpen(false)}
                    className="font-body text-sm text-bagua-text hover:text-bagua-primary"
                  >
                    {s.label}
                  </Link>
                  <span className="font-mono text-xs text-bagua-muted">
                    {s.key.split(' ').map((k, i) => (
                      <span key={i}>
                        <kbd className="border border-bagua-text bg-bagua-wash px-1.5 py-0.5">
                          {k}
                        </kbd>
                        {i === 0 && ' '}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-center font-body text-xs text-bagua-muted">
              <kbd className="border border-bagua-text bg-bagua-wash px-1.5 py-0.5 font-mono">
                ?
              </kbd>{' '}
              随时打开此面板
            </p>
          </div>
        </div>
      )}
    </>
  )
}
