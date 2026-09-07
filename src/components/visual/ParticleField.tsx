'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  z: number
  size: number
  alpha: number
  drift: number
  phase: number
}

/** Lightweight depth field used as an atmospheric layer on the landing page. */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0.5, y: 0.45 }
    const particles: Particle[] = []
    let frame = 0
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = reduceMotion ? 38 : Math.min(110, Math.max(55, Math.floor((width * height) / 15000)))
      particles.length = 0
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          z: 0.25 + Math.random() * 0.75,
          size: 0.55 + Math.random() * 1.45,
          alpha: 0.16 + Math.random() * 0.48,
          drift: (Math.random() - 0.5) * 0.00018,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer.x = event.clientX / Math.max(window.innerWidth, 1)
      pointer.y = event.clientY / Math.max(window.innerHeight, 1)
    }

    const render = () => {
      context.clearRect(0, 0, width, height)
      const time = frame * 0.012
      for (const particle of particles) {
        if (!reduceMotion) {
          particle.y -= particle.drift
          if (particle.y < -0.04) particle.y = 1.04
          if (particle.y > 1.04) particle.y = -0.04
        }
        const depth = particle.z
        const x = particle.x * width + (pointer.x - 0.5) * depth * 18
        const y = particle.y * height + (pointer.y - 0.45) * depth * 12
        const pulse = reduceMotion ? 1 : 0.78 + Math.sin(time + particle.phase) * 0.22
        const radius = particle.size * (0.7 + depth * 0.75)
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(221, 179, 90, ${particle.alpha * depth * pulse})`
        context.fill()
      }
      if (!reduceMotion) {
        frame += 1
        raf = requestAnimationFrame(render)
      }
    }

    resize()
    render()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="particle-field pointer-events-none absolute inset-0 h-full w-full" />
}
