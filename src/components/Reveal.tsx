'use client'

import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'none'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  direction?: Direction
  threshold?: number
  once?: boolean
  className?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * Scroll-triggered reveal animation
 * SSR-safe：服务端渲染时默认显示，避免 SEO/截图/JS 失败时内容空白
 * Hydration 后才决定是否需要隐藏动画
 */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  threshold = 0.1,
  once = true,
  className,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  // 关键：初始 true 防止闪烁。Hydration 后若元素在视口外则设为 false（隐藏）
  const [initialized, setInitialized] = useState(true)
  const [shown, setShown] = useState(true)
  const triggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    // 客户端 hydration 后立即检查元素位置
    const rect = el.getBoundingClientRect()
    const viewportH = window.innerHeight || document.documentElement.clientHeight
    const isAlreadyVisible = rect.top < viewportH && rect.bottom > 0

    if (isAlreadyVisible) {
      // 元素在初始视口内，无需动画
      triggered.current = true
      return
    }

    // 元素在视口外，先标为 "init"（隐藏），等进入时再显示
    setInitialized(false)
    setShown(false)

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !triggered.current) {
            triggered.current = true
            // 延迟一帧让浏览器先把 opacity:0 应用上
            requestAnimationFrame(() => {
              setShown(true)
            })
            if (once) obs.disconnect()
          }
        }
      },
      { threshold, rootMargin: '50px' },
    )
    obs.observe(el)

    // 兜底：3 秒后无论如何都显示
    const fallback = window.setTimeout(() => {
      if (!triggered.current) {
        triggered.current = true
        setShown(true)
      }
    }, 3000)

    return () => {
      obs.disconnect()
      window.clearTimeout(fallback)
    }
  }, [once, threshold])

  const Component = Tag as 'div'

  // SSR 与首屏：默认 reveal-base（可见）
  // Hydration 后位于视口外：reveal-base reveal-init reveal-{dir}（隐藏 + 准备动画）
  // 进入视口：reveal-base reveal-shown（显示）
  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ transitionDelay: `${delay}ms` }}
      className={clsx(
        'reveal-base',
        !initialized && 'reveal-init',
        direction !== 'none' && !initialized && `reveal-${direction}`,
        shown && 'reveal-shown',
        className,
      )}
    >
      {children}
    </Component>
  )
}

/** 在同一容器内对子元素做错开动画 */
export function RevealStagger({
  children,
  step = 80,
  start = 0,
  className,
}: {
  children: React.ReactNode
  step?: number
  start?: number
  className?: string
}) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <Reveal key={i} delay={start + i * step}>
              {child}
            </Reveal>
          ))
        : children}
    </div>
  )
}
