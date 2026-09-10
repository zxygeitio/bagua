import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '起卦',
  description: '硬币法与大衍筮法：自下而上记录六爻。',
}

export default function DivineLayout({ children }: { children: React.ReactNode }) {
  return children
}
