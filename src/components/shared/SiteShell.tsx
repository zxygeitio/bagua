'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BackToTop } from '@/components/BackToTop'
import { KeyboardHelp } from '@/components/KeyboardHelp'
import { HexagramPattern, Logo } from '@/components/icons'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

const NAV = [
  { href: '/', label: '首页' },
  { href: '/hexagrams', label: '六十四卦' },
  { href: '/divine', label: '起卦' },
  { href: '/learn', label: '入门' },
  { href: '/history', label: '历史' },
  { href: '/settings', label: '设置' },
] as const

interface SiteShellProps {
  children: React.ReactNode
  eyebrow?: string
}

export function SiteShell({ children, eyebrow }: SiteShellProps) {
  const pathname = usePathname()
  useKeyboardShortcuts()

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

      {/* Footer */}
      <footer className="relative z-[1] mt-20 border-t-4 border-bagua-text bg-bagua-surface/40 hidden md:block">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            {/* 品牌区 */}
            <div>
              <div className="flex items-center gap-2">
                <Logo className="h-6 w-6 text-bagua-primary pixelated" />
                <span className="font-display text-base tracking-[0.16em]">八卦</span>
              </div>
              <p className="prose-body mt-3 text-xs text-bagua-muted">
                周易草纸刻本 · 三钱成爻，梅花取数。
                <br />
                面向初学者与读卦者的现代工具。
              </p>
              <p className="mt-3 font-display text-[10px] tracking-[0.2em] text-bagua-muted">
                v0.2.0 · 2026
              </p>
            </div>

            {/* 导航 */}
            <div>
              <p className="font-display text-[10px] tracking-[0.28em] text-bagua-muted">导航</p>
              <ul className="mt-3 space-y-1.5">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-body text-xs text-bagua-text transition hover:text-bagua-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 资源 */}
            <div>
              <p className="font-display text-[10px] tracking-[0.28em] text-bagua-muted">学习</p>
              <ul className="mt-3 space-y-1.5">
                <li>
                  <Link href="/learn" className="font-body text-xs text-bagua-text transition hover:text-bagua-primary">
                    八卦总览
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="font-body text-xs text-bagua-text transition hover:text-bagua-primary">
                    五种起卦法
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="font-body text-xs text-bagua-text transition hover:text-bagua-primary">
                    卦辞读法
                  </Link>
                </li>
                <li>
                  <Link href="/hexagrams" className="font-body text-xs text-bagua-text transition hover:text-bagua-primary">
                    64 卦库
                  </Link>
                </li>
              </ul>
            </div>

            {/* 数据 */}
            <div>
              <p className="font-display text-[10px] tracking-[0.28em] text-bagua-muted">数据</p>
              <ul className="mt-3 space-y-1.5">
                <li className="flex items-center gap-1.5 font-body text-xs text-bagua-text">
                  <HexagramPattern className="h-3 w-3" />
                  64 卦完整数据
                </li>
                <li className="font-body text-xs text-bagua-text">5 种起卦算法</li>
                <li className="font-body text-xs text-bagua-text">5 种卦变关系</li>
                <li className="font-body text-xs text-bagua-text">384 爻 + 彖象传</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t-2 border-bagua-fiber/40 pt-5 md:flex-row md:items-center md:justify-between">
            <p className="font-body text-[11px] text-bagua-muted">
              八卦 · 仅供文化学习与学术研究
            </p>
            <p className="font-mono text-[10px] tracking-widest text-bagua-muted">
              Built with Next.js · Cloudflare Pages
            </p>
          </div>
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

      <BackToTop />
      <KeyboardHelp />
    </div>
  )
}
