import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '设置',
  description: '动画开关与云同步配置。',
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
