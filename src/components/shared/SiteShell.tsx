'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BackToTop } from '@/components/BackToTop'
import { KeyboardHelp } from '@/components/KeyboardHelp'
import { Clock, CompassRose, HexagramPattern, Leaf, Logo, Settings, Wand } from '@/components/icons'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

const NAV = [
  { href: '/', label: '首页', Icon: CompassRose },
  { href: '/hexagrams', label: '六十四卦', Icon: HexagramPattern },
  { href: '/divine', label: '起卦', Icon: Wand },
  { href: '/learn', label: '入门', Icon: Leaf },
  { href: '/history', label: '历史', Icon: Clock },
  { href: '/settings', label: '设置', Icon: Settings },
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
          <Link href="/" className="flex items-center gap-2.5 text-bagua-text group">
            <div className="relic-frame-square relative h-8 w-8 md:h-9 md:w-9 flex-shrink-0 p-0.5 shadow-2xs transition group-hover:scale-105 group-hover:border-bagua-primary">
              <Image
                src="/icons/brand-logo-3d.webp"
                alt="八卦"
                width={72}
                height={72}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <span className="font-display text-sm tracking-[0.14em]">八卦</span>
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex items-center gap-1" aria-label="主导航">
              {NAV.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <Link key={item.href} href={item.href} data-active={active} className="nav-link">
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('bagua:shortcuts:open'))}
              className="btn-press flex h-7 w-7 items-center justify-center border border-bagua-fiber/80 bg-bagua-surface/70 font-mono text-xs text-bagua-muted transition hover:border-bagua-text hover:bg-bagua-wash hover:text-bagua-text"
              title="快捷键指南 (按 ?)"
              aria-label="快捷键指南"
            >
              ?
            </button>
          </div>
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
              <div className="flex items-center gap-2.5">
                <div className="relic-frame-square relative h-8 w-8 md:h-9 md:w-9 flex-shrink-0 p-0.5 shadow-2xs">
                  <Image
                    src="/icons/brand-logo-3d.webp"
                    alt="八卦"
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="font-display text-base tracking-[0.16em]">八卦</span>
              </div>
              <p className="prose-body mt-3 text-xs text-bagua-muted">
                周易草纸刻本 · 三钱成爻，六爻自下而上。
                <br />
                面向初学者与读卦者的现代工具。
              </p>
              <p className="mt-3 font-display text-[10px] tracking-[0.2em] text-bagua-muted">
                v2.3.0 · 2026
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
                    硬币起卦法
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
                <li className="font-body text-xs text-bagua-text">硬币六爻起卦</li>
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
          const Icon = item.Icon
          return (
            <Link key={item.href} href={item.href} data-active={active} className="nav-link">
              <Icon className="nav-link__icon" aria-hidden="true" />
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
