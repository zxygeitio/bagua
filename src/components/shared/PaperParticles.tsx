const PARTICLES = [
  { x: '8%', y: '18%', size: 5, delay: '-1.2s', duration: '7.5s', rotate: '-18deg' },
  { x: '18%', y: '72%', size: 3, delay: '-4.8s', duration: '9s', rotate: '22deg' },
  { x: '34%', y: '12%', size: 4, delay: '-2.4s', duration: '8.2s', rotate: '8deg' },
  { x: '53%', y: '84%', size: 6, delay: '-6.1s', duration: '10.5s', rotate: '-32deg' },
  { x: '66%', y: '24%', size: 3, delay: '-3.2s', duration: '8.8s', rotate: '16deg' },
  { x: '78%', y: '68%', size: 5, delay: '-7.4s', duration: '11s', rotate: '-12deg' },
  { x: '91%', y: '34%', size: 3, delay: '-5.2s', duration: '7.8s', rotate: '28deg' },
] as const

export function PaperParticles() {
  return (
    <div className="paper-particles" aria-hidden="true">
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="paper-particle"
          style={
            {
              '--particle-x': particle.x,
              '--particle-y': particle.y,
              '--particle-size': `${particle.size}px`,
              '--particle-delay': particle.delay,
              '--particle-duration': particle.duration,
              '--particle-rotate': particle.rotate,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
