import Link from 'next/link'
import { BookOpen, Sparkles, Compass, Layers, Hexagon, BookText } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bagua-canvas">
      {/* Header */}
      <header className="border-b border-bagua-border/30 bg-bagua-surface/60 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-bagua-primary to-bagua-accent text-white shadow-md">
              <Hexagon className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <h1 className="font-calligraphy text-xl text-bagua-text">bagua · 易经占卜</h1>
          </div>
          <Link
            href="/hexagrams"
            className="text-sm text-bagua-muted transition hover:text-bagua-text"
          >
            关于易经 →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-5xl font-bold leading-tight text-bagua-text md:text-6xl lg:text-7xl">
            古老智慧 ·{' '}
            <span className="bg-gradient-to-r from-bagua-accent to-amber-500 bg-clip-text text-transparent">
              现代体验
            </span>
          </h2>
          <p className="mt-6 font-body text-lg text-bagua-muted md:text-xl">
            探索这部千年经典的指引
            <br />
            通过互动起卦、卦辞解读与现代建议，发现属于你的答案
          </p>
        </div>

        {/* 双入口卡片 */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
          <Link
            href="/hexagrams"
            className="group relative overflow-hidden rounded-card border border-bagua-border/40 bg-bagua-surface p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-bagua-primary/10 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bagua-primary/10 text-bagua-primary">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-bagua-text">
                浏览卦象
              </h3>
              <p className="mt-3 font-body text-bagua-muted">
                探索全部 64 卦的卦辞、彖传、象传与六爻
              </p>
              <p className="mt-6 inline-flex items-center gap-1 font-body text-sm font-medium text-bagua-primary transition group-hover:gap-2">
                开始探索 →
              </p>
            </div>
          </Link>

          <Link
            href="/divine"
            className="group relative overflow-hidden rounded-card border border-bagua-border/40 bg-bagua-surface p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-bagua-secondary/10 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bagua-secondary/10 text-bagua-secondary">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-bagua-text">
                随机起卦
              </h3>
              <p className="mt-3 font-body text-bagua-muted">
                让宇宙指引你，通过三种传统起卦方式获得启示
              </p>
              <p className="mt-6 inline-flex items-center gap-1 font-body text-sm font-medium text-bagua-secondary transition group-hover:gap-2">
                起一卦 →
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 pb-20">
        <h2 className="text-center font-display text-3xl font-bold text-bagua-text">
          核心特性
        </h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Layers className="h-6 w-6" />}
            color="primary"
            title="完整卦象库"
            description="64 卦 + 384 爻 + 完整十翼（彖传、象传、文言）"
          />
          <FeatureCard
            icon={<Compass className="h-6 w-6" />}
            color="secondary"
            title="三种起卦方式"
            description="硬币法、蓍草揲占、手动选卦，满足不同场景需求"
          />
          <FeatureCard
            icon={<BookText className="h-6 w-6" />}
            color="accent"
            title="现代解读"
            description="预置 9 大场景 × 64 卦的高质量解读内容"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bagua-border/30 bg-bagua-surface/40 py-8">
        <div className="container mx-auto px-6 text-center font-body text-sm text-bagua-muted">
          <p>由 Next.js · TypeScript 构建 · 数据源于传统经典</p>
          <p className="mt-2 text-xs">
            © 2026 bagua · 仅供文化学习参考
          </p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  color,
  title,
  description,
}: {
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'accent'
  title: string
  description: string
}) {
  const colorMap = {
    primary: 'bg-bagua-primary/10 text-bagua-primary',
    secondary: 'bg-bagua-secondary/10 text-bagua-secondary',
    accent: 'bg-bagua-accent/10 text-bagua-accent',
  }
  return (
    <div className="text-center">
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-bagua-text">{title}</h3>
      <p className="mt-2 font-body text-sm text-bagua-muted">{description}</p>
    </div>
  )
}