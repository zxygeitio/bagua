import localFont from 'next/font/local'
import { Noto_Serif_SC } from 'next/font/google'

export const displayFont = localFont({
  src: '../../public/fonts/cubic-11.ttf',
  variable: '--font-display',
  display: 'swap',
  weight: '400',
})

export const bodyFont = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})
