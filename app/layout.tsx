import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import localFont from 'next/font/local'
import { Noto_Serif_SC } from 'next/font/google'

import { themeCssVars } from '@/styles/theme'

import './globals.css'

const displayFont = localFont({
  src: '../public/fonts/cubic-11.ttf',
  variable: '--font-display',
  display: 'swap',
  weight: '400',
})

const bodyFont = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'bagua · 易经占卜',
  description: '草纸像素风的易经占卜与六十四卦解读',
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
      <body className="bg-bagua-canvas font-body text-bagua-text antialiased">{children}</body>
    </html>
  )
}
