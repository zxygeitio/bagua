import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '分享',
  description: '卦象分享卡。',
}

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children
}
