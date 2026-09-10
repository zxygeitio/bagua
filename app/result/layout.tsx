import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '占卜结果',
  description: '本卦、之卦与朱熹变占规则判读。',
}

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children
}
