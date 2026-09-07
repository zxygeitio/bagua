import type { Metadata } from 'next'
import type { CSSProperties } from 'react'

import { bodyFont, displayFont } from '@/styles/fonts'
import { themeCssVars } from '@/styles/theme'

import './globals.css'

export const metadata: Metadata = {
  title: 'bagua · 易经占卜',
  description: '草纸像素风的易经占卜与六十四卦解读',
  icons: { icon: '/favicon.svg' },
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
