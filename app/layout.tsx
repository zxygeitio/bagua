import type { Metadata, Viewport } from 'next'
import type { CSSProperties } from 'react'

import { bodyFont, displayFont } from '@/styles/fonts'
import { themeCssVars } from '@/styles/theme'
import { SiteShell } from '@/components/shared/SiteShell'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '八卦 · 易经占卜',
    template: '%s · bagua',
  },
  description: '周易草纸刻本 · 硬币法与大衍筮法，六爻自下而上。一个面向初学者与读卦者的现代工具。',
  applicationName: '八卦',
  keywords: ['易经', '占卜', '八卦', '六十四卦', '周易', '硬币起卦', '大衍筮法', 'I Ching'],
  authors: [{ name: 'bagua' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '八卦',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#A33222',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="zh-CN"
      data-theme="paper"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      style={themeCssVars() as CSSProperties}
    >
      <body className={`${bodyFont.className} bg-bagua-canvas text-bagua-text antialiased`}>
        {/* 纸质背景固定合成层：视口大小一次性栅格化，滚动零重绘 */}
        <div className="paper-canvas-bg" aria-hidden="true" />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
