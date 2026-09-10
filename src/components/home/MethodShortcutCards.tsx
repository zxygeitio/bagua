'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import Image from 'next/image'

import { MethodInspector } from '@/components/home/MethodInspector'
import { Reveal } from '@/components/Reveal'
import { Coins, Hand, Leaf } from '@/components/icons'

interface ShortcutItem {
  readonly href: string
  readonly Icon: React.ComponentType<{ className?: string }>
  readonly image: string
  readonly title: string
  readonly desc: string
  readonly recommended: boolean
  readonly shape: 'round' | 'square'
}

const SHORTCUTS: ReadonlyArray<ShortcutItem> = [
  { href: '/divine', Icon: Coins, image: '/icons/shortcut-coins.webp', title: '快速起卦', desc: '三钱六掷 · 10 秒', recommended: true, shape: 'round' },
  { href: '/learn', Icon: Leaf, image: '/icons/shortcut-learn.webp', title: '易学入门', desc: '八卦 · 卦辞 · 读法', recommended: false, shape: 'square' },
  { href: '/hexagrams', Icon: Hand, image: '/icons/shortcut-hexagrams.webp', title: '六十四卦', desc: '逐卦细读', recommended: false, shape: 'square' },
] as const

/**
 * 入口卡片组:3 张仪式方法卡片,点击打开 MethodInspector Modal。
 * Modal 状态、焦点管理、键盘交互均封装在此客户端组件内,
 * 父级 page.tsx 保持为 Server Component,首屏 HTML 直接静态化。
 */
export function MethodShortcutCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (activeIndex === null) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setActiveIndex(null)
      }
    }

    // Focus trap: Tab/Shift+Tab 在 dialog 内循环
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!
      const active = document.activeElement
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('keydown', trapFocus)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const triggerRef = triggerRefs.current[activeIndex] ?? null
    requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('keydown', trapFocus)
      document.body.style.overflow = previousOverflow
      // 关闭后把焦点还给原触发按钮
      triggerRef?.focus()
    }
  }, [activeIndex])

  const activeShortcut = activeIndex === null ? null : (SHORTCUTS[activeIndex] ?? null)

  return (
    <>
      <Reveal>
        <div className="grid gap-3 md:grid-cols-3">
          {SHORTCUTS.map((m, i) => {
            const Icon = m.Icon
            return (
              <Reveal key={m.href} delay={i * 100} direction="up">
                <button
                  type="button"
                  ref={(element) => {
                    triggerRefs.current[i] = element
                  }}
                  onClick={() => setActiveIndex(i)}
                  className="ritual-card paper-panel group flex w-full items-center gap-4 p-5 text-left"
                  aria-haspopup="dialog"
                  aria-label={`查看${m.title}详情`}
                >
                  <span className={`ritual-card__seal ${m.shape === 'round' ? 'relic-frame-round p-0' : 'relic-frame-square p-1.5'} h-16 w-16 md:h-18 md:w-18 flex-shrink-0 shadow-2xs transition duration-300 group-hover:scale-105`}>
                    <Image
                      src={m.image}
                      alt=""
                      width={112}
                      height={112}
                      className="antique-blend h-full w-full object-contain pointer-events-none"
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base tracking-wider">{m.title}</span>
                      {m.recommended && (
                        <span className="border-2 border-bagua-text bg-bagua-primary px-1.5 py-0.5 font-display text-[9px] tracking-widest text-bagua-surface">
                          推荐
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-body text-xs text-bagua-muted">{m.desc}</p>
                  </div>
                  <span className="ritual-card__open font-display text-[10px] tracking-[0.16em] text-bagua-muted">
                    阅览
                  </span>
                </button>
              </Reveal>
            )
          })}
        </div>
      </Reveal>
      {activeShortcut ? (
        <MethodInspector
          index={activeIndex ?? 0}
          method={activeShortcut}
          closeButtonRef={closeButtonRef as RefObject<HTMLButtonElement>}
          dialogRef={dialogRef as RefObject<HTMLElement>}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </>
  )
}
