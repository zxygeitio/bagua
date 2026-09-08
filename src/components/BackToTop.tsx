'use client'

import { useEffect, useRef, useState } from 'react'

import { ArrowRight } from '@/components/icons'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const frameRef = useRef<number | null>(null)
  const scrollIdleRef = useRef<number | null>(null)

  useEffect(() => {
    let lastVisible = false
    const root = document.documentElement

    const markScrolling = () => {
      if (!root.classList.contains('is-scrolling')) root.classList.add('is-scrolling')
      if (scrollIdleRef.current !== null) window.clearTimeout(scrollIdleRef.current)
      scrollIdleRef.current = window.setTimeout(() => {
        root.classList.remove('is-scrolling')
        scrollIdleRef.current = null
      }, 120)
    }

    const update = () => {
      frameRef.current = null
      const nextVisible = window.scrollY > 600
      if (nextVisible === lastVisible) return
      lastVisible = nextVisible
      setVisible(nextVisible)
    }

    const onScroll = () => {
      markScrolling()
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      if (scrollIdleRef.current !== null) window.clearTimeout(scrollIdleRef.current)
      root.classList.remove('is-scrolling')
    }
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="btn-press fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center border-4 border-bagua-text bg-bagua-primary text-bagua-surface shadow-soft transition hover:bg-bagua-fire md:bottom-6 md:right-6"
      aria-label="回到顶部"
    >
      <ArrowRight className="h-5 w-5 -rotate-90" />
    </button>
  )
}
