'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Logo } from '@/components/icons'

const NAV = [
  { href: '/', label: '首页' },
  { href: '/hexagrams', label: '六十四卦' },
  { href: '/divine', label: '起卦' },
  { href: '/history', label: '历史' },
  { href: '/settings', label: '设置' },
] as const

interface SiteShellProps {
  children: React.ReactNode
  eyebrow?: string
}

export function SiteShell({ children, eyebrow }: SiteShellProps) {
  const pathname = usePathname()

  return (
    <div className="paper-root">
      <div className="pixel-grid" aria-hidden="true" />
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-bagua-text">
            <Logo className="h-7 w-7 text-bagua-primary pixelated" />
            <span className="font-display text-sm tracking-[0.14em]">八卦</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
            {NAV.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} data-active={active} className="nav-link">
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      {eyebrow ? (
        <p className="mx-auto max-w-6xl px-4 pt-6 font-display text-[11px] tracking-[0.28em] text-bagua-muted md:px-6">
          {eyebrow}
        </p>
      ) : null}
      <div className="relative z-[1] pb-20 md:pb-0">{children}</div>
      <footer className="relative z-[1] mt-16 hidden border-t-4 border-bagua-text md:block">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 font-body text-xs text-bagua-muted md:flex-row md:items-center md:justify-between md:px-6">
          <span>八卦 · 易经占卜</span>
          <span>仅供文化学习与学术研究</span>
        </div>
      </footer>
      <nav className="pixel-dock md:hidden" aria-label="移动导航">
        {NAV.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} data-active={active} className="nav-link">
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
