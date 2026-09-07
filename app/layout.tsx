import type { Metadata, Viewport } from 'next'
import type { CSSProperties } from 'react'

import { bodyFont, displayFont } from '@/styles/fonts'
import { themeCssVars } from '@/styles/theme'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '八卦 · 易经占卜',
    template: '%s · bagua',
  },
  description: '周易草纸刻本 · 三钱成爻，梅花取数。一个面向初学者与读卦者的现代工具。',
  applicationName: '八卦',
  keywords: ['易经', '占卜', '八卦', '六十四卦', '周易', '起卦', '蓍草', '梅花易数', 'I Ching'],
  authors: [{ name: 'bagua' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
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
  themeColor: '#B23A2A',
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
      <body className={`${bodyFont.className} bg-bagua-canvas text-bagua-text antialiased`}>{children}</body>
    </html>
  )
}
