import Link from 'next/link'
import { BookOpen, Sparkles, Compass, Layers, Hexagon, BookText, Github } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 装饰背景 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-bagua-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-bagua-secondary/5 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-bagua-accent/5 blur-3xl" />
      </div>

      {/* 头部 */}
      <header className="glass-card sticky top-0 z-50 border-b border-bagua-border/30">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-bagua opacity-20 blur-md" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-bagua text-white shadow-glow">
                <Hexagon className="h-5 w-5" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="font-calligraphy text-xl text-bagua-text transition group-hover:text-bagua-primary">
              bagua · 易经占卜
            </h1>
          </Link>
          <a
            href="https://github.com/zxygeitio/bagua"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-body text-sm text-bagua-muted transition hover:text-bagua-text"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">源码</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="container relative mx-auto px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-bagua-primary/20 bg-bagua-primary/5 px-4 py-1.5 font-body text-xs font-medium text-bagua-primary">
              <Sparkles className="h-3.5 w-3.5" />
              千年智慧 · 现代演绎
            </div>
          </div>
          <h2 className="animate-fade-up stagger-1 font-display text-5xl font-bold leading-tight text-balance text-bagua-text md:text-6xl lg:text-7xl">
            古老智慧 ·{' '}
            <span className="text-gradient">现代体验</span>
          </h2>
          <p className="animate-fade-up stagger-2 mx-auto mt-8 max-w-2xl text-pretty font-body text-lg leading-relaxed text-bagua-muted md:text-xl">
            探索这部千年经典的指引
            <br className="hidden md:block" />
            通过互动起卦、卦辞解读与现代建议，发现属于你的答案
          </p>
        </div>

        {/* 双入口卡片 */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-8 md:grid-cols-2">
          <Link
            href="/hexagrams"
            className="group glass-card card-hover relative overflow-hidden rounded-card p-10"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-bagua-primary/10 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12" />
            <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-bagua-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bagua-primary/10 text-bagua-primary shadow-soft transition group-hover:scale-110 group-hover:bg-bagua-primary group-hover:text-white">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="font-display text-3xl font-bold text-bagua-text">
                浏览卦象
              </h3>
              <p className="mt-4 font-body leading-relaxed text-bagua-muted">
                探索全部 64 卦的卦辞、彖传、象传与六爻爻辞
              </p>
              <p className="mt-8 inline-flex items-center gap-2 font-body text-sm font-medium text-bagua-primary transition group-hover:gap-3">
                开始探索
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </p>
            </div>
          </Link>

          <Link
            href="/divine"
            className="group glass-card card-hover relative overflow-hidden rounded-card p-10"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-bagua-secondary/10 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12" />
            <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-bagua-secondary/5 blur-2xl transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bagua-secondary/10 text-bagua-secondary shadow-soft transition group-hover:scale-110 group-hover:bg-bagua-secondary group-hover:text-white">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="font-display text-3xl font-bold text-bagua-text">
                随机起卦
              </h3>
              <p className="mt-4 font-body leading-relaxed text-bagua-muted">
                让宇宙指引你，通过三种传统起卦方式获得启示
              </p>
              <p className="mt-8 inline-flex items-center gap-2 font-body text-sm font-medium text-bagua-secondary transition group-hover:gap-3">
                起一卦
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container relative mx-auto px-6 pb-20">
        <div className="mb-16 text-center">
          <h2 className="font-display text-4xl font-bold text-bagua-text">核心特性</h2>
          <p className="mt-3 font-body text-bagua-muted">精心打磨每一处细节</p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Layers className="h-6 w-6" />}
            color="primary"
            title="完整卦象库"
            description="64 卦 + 384 爻 + 完整十翼（彖传、象传、文言）"
            delay={0}
          />
          <FeatureCard
            icon={<Compass className="h-6 w-6" />}
            color="secondary"
            title="三种起卦方式"
            description="硬币法、蓍草揲占、手动选卦，满足不同场景需求"
            delay={1}
          />
          <FeatureCard
            icon={<BookText className="h-6 w-6" />}
            color="accent"
            title="现代解读"
            description="预置 9 大场景 × 64 卦的高质量解读内容"
            delay={2}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bagua-border/30 bg-bagua-surface/40 backdrop-blur-md">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-bagua text-white">
                <Hexagon className="h-4 w-4" />
              </div>
              <span className="font-calligraphy text-base text-bagua-text">bagua · 易经占卜</span>
            </div>
            <p className="font-body text-xs text-bagua-muted">
              由 Next.js · TypeScript 构建 · 数据源于传统经典 · © 2026
            </p>
          </div>
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
  delay,
}: {
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'accent'
  title: string
  description: string
  delay: number
}) {
  const colorMap = {
    primary: {
      bg: 'bg-bagua-primary/10',
      text: 'text-bagua-primary',
      border: 'border-bagua-primary/20',
      hover: 'group-hover:bg-bagua-primary',
      hoverText: 'group-hover:text-white',
    },
    secondary: {
      bg: 'bg-bagua-secondary/10',
      text: 'text-bagua-secondary',
      border: 'border-bagua-secondary/20',
      hover: 'group-hover:bg-bagua-secondary',
      hoverText: 'group-hover:text-white',
    },
    accent: {
      bg: 'bg-bagua-accent/10',
      text: 'text-bagua-accent',
      border: 'border-bagua-accent/20',
      hover: 'group-hover:bg-bagua-accent',
      hoverText: 'group-hover:text-white',
    },
  }
  const colors = colorMap[color]
  return (
    <div
      className="group glass-card card-hover relative overflow-hidden rounded-card border border-transparent p-8 text-center animate-fade-up"
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <div className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} ${colors.text} transition-all duration-300 ${colors.hover} ${colors.hoverText}`}>
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-bagua-text">{title}</h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-bagua-muted">{description}</p>
    </div>
  )
}