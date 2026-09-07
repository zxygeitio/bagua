'use client'

import { useCallback, useEffect, useRef } from 'react'

import { useReducedMotion } from '@/components/shared/useReducedMotion'

interface PaperTiltProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

/**
 * A small, pointer-gated paper interaction. The transform is written directly
 * to the host element so pointer movement does not re-render the page.
 */
export function PaperTilt({ children, className = '', intensity = 5 }: PaperTiltProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const reducedMotion = useReducedMotion()

  const reset = useCallback(() => {
    const host = hostRef.current
    if (!host) return
    host.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)'
  }, [])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const updateTransform = useCallback(() => {
    frameRef.current = null
    const host = hostRef.current
    if (!host || reducedMotion) return
    const { x, y } = targetRef.current
    host.style.transform = `perspective(900px) rotateX(${y.toFixed(2)}deg) rotateY(${x.toFixed(2)}deg) translate3d(0, 0, 0)`
  }, [reducedMotion])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const host = hostRef.current
    if (!host) return
    const rect = host.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    targetRef.current = {
      x: Math.max(-1, Math.min(1, x)) * intensity,
      y: Math.max(-1, Math.min(1, -y)) * intensity,
    }
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(updateTransform)
  }

  const handlePointerLeave = () => {
    targetRef.current = { x: 0, y: 0 }
    reset()
  }

  return (
    <div
      ref={hostRef}
      className={`paper-tilt ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  )
}
