import type { RefObject } from 'react'
import Link from 'next/link'

import { ArrowRight, X } from '@/components/icons'

interface MethodShortcut {
  readonly href: string
  readonly Icon: React.ComponentType<{ className?: string }>
  readonly title: string
  readonly desc: string
  readonly recommended: boolean
}

interface MethodInspectorProps {
  /** 该方法在 METHOD_SHORTCUTS 中的位置(0-based) */
  index: number
  method: MethodShortcut
  closeButtonRef: RefObject<HTMLButtonElement>
  dialogRef: RefObject<HTMLElement>
  onClose: () => void
}

/**
 * 方法详情 Modal:点击入口卡片打开,展示方法的步骤说明与进入入口。
 * 焦点由父组件 HomePage 集中管理(打开聚焦关闭按钮、Escape 关闭、Tab 循环、关闭后还原焦点)。
 */
export function MethodInspector({ index, method, closeButtonRef, dialogRef, onClose }: MethodInspectorProps) {
  const Icon = method.Icon
  const details = method.href === '/divine'
    ? ['三枚铜钱，六次投掷', '自动记录阴阳与动爻', '生成本卦、变卦与纳甲排盘']
    : method.href === '/learn'
      ? ['先天方位与八卦象义', '从卦辞进入读卦方法', '按主题建立学习路径']
      : ['六十四卦完整索引', '卦辞、彖传与象传对照', '按五行与上下卦浏览']

  return (
    <div className="ritual-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="ritual-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ritual-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ritual-dialog__orbit" aria-hidden="true" />
        <button ref={closeButtonRef} type="button" className="ritual-dialog__close" onClick={onClose} aria-label="关闭详情">
          <X className="h-4 w-4" />
        </button>
        <div className="ritual-dialog__header">
          <span className="ritual-dialog__seal"><Icon className="h-8 w-8" /></span>
          <div>
            <p className="section-kicker">仪式索引 / 0{index + 1}</p>
            <h2 id="ritual-dialog-title" className="mt-2 font-display text-2xl tracking-[0.16em] text-bagua-text">{method.title}</h2>
          </div>
        </div>
        <div className="ritual-dialog__rule" />
        <p className="prose-body mt-5 text-bagua-muted">{method.desc}。把此刻的问题整理成可读的线索，再进入相应的工具或篇章。</p>
        <ol className="ritual-dialog__steps">
          {details.map((detail, step) => <li key={detail}><span>0{step + 1}</span>{detail}</li>)}
        </ol>
        <div className="mt-7 flex items-center justify-between gap-4 border-t border-bagua-fiber pt-4">
          <span className="font-display text-[10px] tracking-[0.14em] text-bagua-muted">BAGUA / ARCHIVE</span>
          <Link href={method.href} className="btn-primary" onClick={onClose}>进入{method.title}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  )
}
