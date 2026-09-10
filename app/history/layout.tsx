import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '历史记录',
  description: '起卦记录本地保存，配置后可云同步。',
}

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
