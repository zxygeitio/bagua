'use client'

import { useEffect, useState } from 'react'

import { ArrowRight } from '@/components/icons'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
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
