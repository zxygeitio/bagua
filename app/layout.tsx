import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'bagua · 易经占卜',
  description: '基于易经八卦的现代化占卜与解读体验',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body className="bg-bagua-canvas text-bagua-text antialiased">{children}</body>
    </html>
  );
}
