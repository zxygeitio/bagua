'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings as SettingsIcon } from '@/components/icons'

export default function SettingsPage() {
  const [defaultMethod, setDefaultMethod] = useState<'coins' | 'yarrow' | 'manual'>('coins')
  const [showAnimation, setShowAnimation] = useState(true)

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-bagua-primary/5 blur-3xl" />
      </div>

      <header className="glass-card sticky top-0 z-50 border-b border-bagua-border/30">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-body text-sm text-bagua-muted transition hover:text-bagua-text">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <span className="seal text-sm">设置</span>
        </div>
      </header>

      <section className="container relative mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3 animate-fade-up">
          <SettingsIcon className="h-7 w-7 text-bagua-primary" />
          <h1 className="font-calligraphy text-4xl font-bold text-bagua-text">设置</h1>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-card p-6 animate-fade-up stagger-1">
            <h2 className="mb-4 font-display text-lg font-bold text-bagua-text">默认起卦方式</h2>
            <div className="space-y-2">
              {[
                { value: 'coins', label: '快速起卦', desc: '硬币法 · 约 10 秒' },
                { value: 'yarrow', label: '蓍草揲占', desc: '传统揲四法 · 约 3 分钟' },
                { value: 'manual', label: '手动选卦', desc: '学习模式' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-card border p-3 transition ${
                    defaultMethod === opt.value ? 'border-bagua-primary bg-bagua-primary/5 ring-2 ring-bagua-primary/20' : 'border-bagua-border/30 hover:border-bagua-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={opt.value}
                    checked={defaultMethod === opt.value}
                    onChange={() => setDefaultMethod(opt.value as any)}
                    className="accent-bagua-primary"
                  />
                  <div>
                    <div className="font-display font-medium text-bagua-text">{opt.label}</div>
                    <div className="font-body text-xs text-bagua-muted">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-card p-6 animate-fade-up stagger-2">
            <h2 className="mb-4 font-display text-lg font-bold text-bagua-text">动画效果</h2>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={showAnimation}
                onChange={e => setShowAnimation(e.target.checked)}
                className="h-5 w-5 accent-bagua-primary"
              />
              <span className="font-body text-bagua-text">启用起卦仪式动画</span>
            </label>
            <p className="mt-2 font-body text-xs text-bagua-muted">关闭后可加快起卦速度</p>
          </div>

          <div className="glass-card rounded-card p-6 animate-fade-up stagger-3">
            <h2 className="mb-4 font-display text-lg font-bold text-bagua-text">关于</h2>
            <div className="space-y-1 font-body text-sm text-bagua-muted">
              <p>版本：<span className="font-semibold text-bagua-text">v0.1.0</span></p>
              <p>技术栈：Next.js 14 + TypeScript + Tailwind CSS</p>
              <p>数据：64 卦经典 + 现代解读</p>
              <p className="mt-3 text-xs">© 2026 bagua · 仅供文化学习参考</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
