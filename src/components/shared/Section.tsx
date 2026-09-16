import type { ReactNode } from 'react'
import Link from 'next/link'

type SectionIcon = React.ComponentType<{ className?: string; strokeWidth?: number }>

export interface SectionProps {
  /** 序号徽章（如 "01"、"01.5"、"GUA 03 / 64"） */
  index?: string
  /** 节段主标题 */
  title: string
  /** 标题下方的副描述 */
  desc?: string
  /** 标题左侧可选图标（settings 风格） */
  Icon?: SectionIcon
  /** 图标附加 class（颜色等） */
  iconClassName?: string
  /** 右上角可选跳转链接（"查看全部" 等） */
  link?: { href: string; label: string }
  /** 标题前可选 kicker（如 learn 页 "SECTION" 标） */
  kicker?: string
  /** 节段主体内容 */
  children: ReactNode
}

/**
 * 统一的节段容器：可选图标 / 序号 / 标题 / 描述 / 跳转链接 / 节段正文。
 * 用于 /learn、/history、/settings 的节段标题，统一视觉与代码。
 */
export function Section({
  index,
  title,
  desc,
  Icon,
  iconClassName,
  link,
  kicker,
  children,
}: SectionProps) {
  return (
    <section className="enter-up mb-10">
      <header className="mb-4 flex items-end justify-between gap-4 border-b-4 border-bagua-text pb-2">
        <div className="flex min-w-0 items-center gap-3">
          {Icon ? (
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border-4 border-bagua-text bg-bagua-primary text-bagua-surface">
              <Icon
                className={`h-4 w-4 ${iconClassName ?? 'text-bagua-surface'}`}
                strokeWidth={1.8}
              />
            </span>
          ) : kicker ? (
            <span className="font-display text-[11px] tracking-[0.28em] text-bagua-primary">
              {kicker}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              {index ? (
                <span className="font-display text-[10px] tracking-[0.28em] text-bagua-muted">
                  {index}
                </span>
              ) : null}
              <h2 className="font-display text-xl tracking-wider md:text-2xl">{title}</h2>
            </div>
            {desc ? (
              <p className="mt-1 font-body text-xs text-bagua-muted">{desc}</p>
            ) : null}
          </div>
        </div>
        {link ? (
          <Link
            href={link.href}
            className="flex-shrink-0 font-display text-xs tracking-widest text-bagua-primary hover:underline"
          >
            {link.label} →
          </Link>
        ) : null}
      </header>
      {children}
    </section>
  )
}