import localFont from 'next/font/local'
import { Noto_Serif_SC } from 'next/font/google'

export const displayFont = localFont({
  src: './fonts/cubic-11.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '400',
})

export const bodyFont = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'optional',
  preload: false,
})
