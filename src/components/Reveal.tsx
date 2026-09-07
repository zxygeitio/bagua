'use client'

import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'none'

interface RevealProps {
  children: React.ReactNode
  /** 触发动画的延迟（ms） */
  delay?: number
  /** 动画方向 */
  direction?: Direction
  /** 触发阈值（0-1） */
  threshold?: number
  /** 仅动画一次 */
  once?: boolean
  className?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * Scroll-triggered reveal animation
 * 使用 IntersectionObserver，元素进入视口时播放
 */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  threshold = 0.15,
  once = true,
  className,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true)
            if (once) obs.disconnect()
          } else if (!once) {
            setShown(false)
          }
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [once, threshold])

  const Component = Tag as 'div'

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ transitionDelay: `${delay}ms` }}
      className={clsx(
        'reveal',
        direction !== 'none' && `reveal-${direction}`,
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
  direction = 'up',
  className,
}: {
  children: React.ReactNode
  step?: number
  start?: number
  direction?: Direction
  className?: string
}) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <Reveal key={i} delay={start + i * step} direction={direction}>
              {child}
            </Reveal>
          ))
        : children}
    </div>
  )
}
