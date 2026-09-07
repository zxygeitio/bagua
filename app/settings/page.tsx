'use client'

import { useEffect, useState } from 'react'

import { SiteShell } from '@/components/shared/SiteShell'

type CastMethod = 'coins' | 'yarrow' | 'manual' | 'meihua' | 'time'

export default function SettingsPage() {
  const [defaultMethod, setDefaultMethod] = useState<CastMethod>('coins')
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bagua-settings') ?? '{}') as {
        defaultMethod?: CastMethod
        showAnimation?: boolean
      }
      if (saved.defaultMethod) setDefaultMethod(saved.defaultMethod)
      if (typeof saved.showAnimation === 'boolean') setShowAnimation(saved.showAnimation)
    } catch {
      // Ignore malformed local settings and keep the defaults.
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('bagua-settings', JSON.stringify({ defaultMethod, showAnimation }))
  }, [defaultMethod, showAnimation])

  return (
    <SiteShell eyebrow="SETTINGS / 04">
      <main className="mx-auto max-w-2xl px-4 py-8 md:px-6">
        <h1 className="enter-up font-display text-4xl tracking-[0.16em]">设置</h1>

        <section className="mt-8 border-4 border-bagua-text bg-bagua-surface p-5">
          <h2 className="font-display text-sm tracking-widest">默认起卦方式</h2>
          <div className="mt-4 space-y-2">
            {(
              [
                { value: 'coins' as const, label: '铜钱', desc: '三钱六掷' },
                { value: 'meihua' as const, label: '梅花', desc: '以数字或字起卦' },
                { value: 'time' as const, label: '此刻', desc: '年日月时入先天数' },
                { value: 'yarrow' as const, label: '蓍草', desc: '大衍揲占' },
                { value: 'manual' as const, label: '排卦', desc: '自选上下卦' },
              ]
            ).map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 border-4 p-3 ${
                  defaultMethod === opt.value ? 'border-bagua-text bg-bagua-canvas' : 'border-bagua-fiber'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={opt.value}
                  checked={defaultMethod === opt.value}
                  onChange={() => setDefaultMethod(opt.value)}
                  className="accent-bagua-primary"
                />
                <span>
                  <span className="block font-display text-sm tracking-widest">{opt.label}</span>
                  <span className="font-body text-xs text-bagua-muted">{opt.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-6 border-4 border-bagua-text bg-bagua-surface p-5">
          <h2 className="font-display text-sm tracking-widest">动画效果</h2>
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={showAnimation}
              onChange={(event) => setShowAnimation(event.target.checked)}
              className="h-4 w-4 accent-bagua-primary"
            />
            <span className="font-body">启用起卦仪式动画</span>
          </label>
          <p className="mt-2 font-body text-xs text-bagua-muted">关闭后可加快起卦速度。系统「减少动态效果」也会关闭爻线动画。</p>
        </section>

        <section className="mt-6 border-4 border-bagua-text bg-bagua-surface p-5">
          <h2 className="font-display text-sm tracking-widest">关于</h2>
          <div className="mt-3 space-y-1 font-body text-sm text-bagua-muted">
            <p>版本：v0.1.0</p>
            <p>技术栈：Next.js 14 + TypeScript + Tailwind CSS</p>
            <p>数据：64 卦经典 + 现代解读</p>
          </div>
        </section>

        <section className="mt-6 border-4 border-bagua-text bg-bagua-surface p-5">
          <h2 className="font-display text-sm tracking-widest">数据管理</h2>
          <p className="prose-body mt-3 text-sm text-bagua-muted">
            起卦记录默认保存在本机，并在云同步可用时自动上传。
          </p>
          <button
            type="button"
            onClick={() => {
              if (confirm('确定清空本机设置吗？起卦记录不会被删除。')) {
                localStorage.removeItem('bagua-settings')
                setDefaultMethod('coins')
                setShowAnimation(true)
              }
            }}
            className="btn-secondary mt-4"
          >
            恢复默认设置
          </button>
        </section>
      </main>
    </SiteShell>
  )
}
