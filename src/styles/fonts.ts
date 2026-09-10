import { Noto_Serif_SC } from 'next/font/google'

export const songtiFont = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-song',
  display: 'swap',
})

export const displayFont = songtiFont
export const bodyFont = songtiFont

