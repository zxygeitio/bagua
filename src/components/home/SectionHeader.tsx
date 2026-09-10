import Link from 'next/link'

interface SectionHeaderProps {
  index: string
  title: string
  desc: string
  link?: { href: string; label: string }
}

/**
 * 节段标题:序号徽章 + 标题 + 描述 + 可选右侧跳转链接。
 * 右侧链接与描述基线对齐(items-end)。
 */
export function SectionHeader({ index, title, desc, link }: SectionHeaderProps) {
  return (
    <div className="enter-up mb-5 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="border-2 border-bagua-text bg-bagua-primary px-2 py-0.5 font-display text-[10px] tracking-widest text-bagua-surface">
            {index}
          </span>
          <h2 className="font-display text-2xl tracking-wider md:text-3xl">
            {title}
          </h2>
        </div>
        <p className="mt-2 max-w-xl font-body text-xs text-bagua-muted md:text-sm">{desc}</p>
      </div>
      {link && (
        <Link
          href={link.href}
          className="font-display text-xs tracking-widest text-bagua-primary hover:underline flex-shrink-0"
        >
          {link.label} →
        </Link>
      )}
    </div>
  )
}
