/**
 * bagua SVG 图标库
 * 设计原则：
 * - 24x24 viewBox，stroke-width 1.6（更精致）
 * - strokeLinecap=round，linejoin=round
 * - 图形在 2-22 范围内，留 2px padding
 * - 同类图标风格统一
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/* ====================================================================
 * 品牌 / Logo
 * ==================================================================== */

export const Logo = (props: IconProps) => (
  <svg viewBox="0 0 24 24" shapeRendering="crispEdges" aria-hidden="true" {...props}>
    {/* 乾卦 ☰ 三阳爻 — Logo */}
    <rect x="2" y="2" width="20" height="3" fill="currentColor" />
    <rect x="2" y="10" width="20" height="3" fill="currentColor" />
    <rect x="2" y="18" width="20" height="3" fill="currentColor" />
  </svg>
)

/* ====================================================================
 * 箭头
 * ==================================================================== */

export const ArrowRight = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 12 L20 12" />
    <path d="M14 6 L20 12 L14 18" />
  </svg>
)

export const ArrowLeft = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M20 12 L4 12" />
    <path d="M10 6 L4 12 L10 18" />
  </svg>
)

export const ChevronRight = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M9 6 L15 12 L9 18" />
  </svg>
)

/* ====================================================================
 * 状态
 * ==================================================================== */

export const Star = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3.5 L14.5 9.5 L21 10.2 L16 14.5 L17.5 21 L12 17.5 L6.5 21 L8 14.5 L3 10.2 L9.5 9.5 Z" />
  </svg>
)

export const Heart = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 20.5 C7 17 3.5 13 3.5 9.5 C3.5 6.5 5.5 4.5 8 4.5 C9.5 4.5 11 5.5 12 7.5 C13 5.5 14.5 4.5 16 4.5 C18.5 4.5 20.5 6.5 20.5 9.5 C20.5 13 17 17 12 20.5 Z" />
  </svg>
)

export const Check = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M5 12.5 L10 17.5 L19 7" />
  </svg>
)

export const X = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M6 6 L18 18" />
    <path d="M18 6 L6 18" />
  </svg>
)

export const Plus = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 5 L12 19" />
    <path d="M5 12 L19 12" />
  </svg>
)

export const Minus = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M5 12 L19 12" />
  </svg>
)

export const Info = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />
    <path d="M12 11 L12 17" />
  </svg>
)

export const Question = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9 C9.5 7.5 10.5 6.5 12 6.5 C13.5 6.5 15 7.5 15 9 C15 10 14 10.7 12.8 11.3 C12 11.7 12 12.5 12 13.5" />
    <circle cx="12" cy="16.3" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

/* ====================================================================
 * 搜索 / 编辑
 * ==================================================================== */

export const Search = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16 L20.5 20.5" />
  </svg>
)

export const Filter = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 5 L21 5" />
    <path d="M6 12 L18 12" />
    <path d="M9 19 L15 19" />
  </svg>
)

export const Dots = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
)

export const Settings = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
)

export const Trash = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 7 L20 7" />
    <path d="M10 11 L10 17" />
    <path d="M14 11 L14 17" />
    <path d="M6 7 L7 20 C7 20.5 7.5 21 8 21 L16 21 C16.5 21 17 20.5 17 20 L18 7" />
    <path d="M9 7 L9 5 C9 4 9.5 3.5 10 3.5 L14 3.5 C14.5 3.5 15 4 15 5 L15 7" />
  </svg>
)

export const Trash2 = Trash

export const Edit = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M14 4 L20 10 L8 22 L3 22 L3 17 L14 4 Z" />
    <path d="M13 5 L19 11" />
  </svg>
)

export const Copy = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="8" y="8" width="13" height="13" rx="1.5" />
    <path d="M16 8 L16 5 C16 4 15.5 3.5 14.5 3.5 L5 3.5 C4 3.5 3.5 4 3.5 5 L3.5 14.5 C3.5 15.5 4 16 5 16 L8 16" />
  </svg>
)

export const Download = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 4 L12 16" />
    <path d="M7 11 L12 16 L17 11" />
    <path d="M4 20 L20 20" />
  </svg>
)

export const Upload = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 20 L12 8" />
    <path d="M7 13 L12 8 L17 13" />
    <path d="M4 4 L20 4" />
  </svg>
)

export const Share = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="6" cy="12" r="3" />
    <circle cx="17" cy="6" r="3" />
    <circle cx="17" cy="18" r="3" />
    <path d="M8.7 10.7 L14.3 7.3" />
    <path d="M8.7 13.3 L14.3 16.7" />
  </svg>
)

export const Share2 = Share

export const Link = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M10 14 a4 4 0 0 0 5.6 0 L19 10.5 a4 4 0 0 0 -5.6 -5.6 L11 7" />
    <path d="M14 10 a4 4 0 0 0 -5.6 0 L5 13.5 a4 4 0 0 0 5.6 5.6 L13 17" />
  </svg>
)

export const ExternalLink = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M14 4 L20 4 L20 10" />
    <path d="M20 4 L11 13" />
    <path d="M19 13 L19 19 C19 20 18.5 20.5 17.5 20.5 L5 20.5 C4 20.5 3.5 20 3.5 19 L3.5 6.5 C3.5 5.5 4 5 5 5 L11 5" />
  </svg>
)

export const RefreshCw = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M21 12 C21 16.5 17.5 20 13 20 C10 20 7.5 18.5 6 16" />
    <path d="M3 12 C3 7.5 6.5 4 11 4 C14 4 16.5 5.5 18 8" />
    <path d="M19 3 L19 8 L14 8" />
    <path d="M5 21 L5 16 L10 16" />
  </svg>
)

export const Refresh = RefreshCw

/* ====================================================================
 * 仪式 / 启卦
 * ==================================================================== */

/** 三钱叠放 — 钱币起卦 */
export const Coins = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {/* 上方钱币（远处，背面） */}
    <ellipse cx="9" cy="6.5" rx="5" ry="2.2" opacity="0.45" />
    {/* 中间钱币 */}
    <ellipse cx="13" cy="6.5" rx="5" ry="2.2" opacity="0.45" />
    {/* 主体钱币（椭圆 + 厚度 + 中心方孔） */}
    <ellipse cx="12" cy="12" rx="6" ry="3" />
    <path d="M6 12 L6 18 C6 19.5 8.7 21 12 21 C15.3 21 18 19.5 18 18 L18 12" />
    <rect x="10" y="14" width="4" height="3" fill="currentColor" stroke="none" opacity="0.7" />
  </svg>
)

/** 双叶 · 入门导航 */
export const Leaf = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 21 L12 11" />
    <path d="M12 11 C8 11 5 8 4.5 4" />
    <path d="M12 11 C16 11 19 8 19.5 4" />
    <path d="M5.5 6.5 C7 7.5 8.5 8.5 10 9" opacity="0.6" />
    <path d="M18.5 6.5 C17 7.5 15.5 8.5 14 9" opacity="0.6" />
  </svg>
)

/** 星花 · 仪式装饰 */
export const Sparkles = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3.5 L13.4 9.5 L19.5 11 L13.4 12.5 L12 18.5 L10.6 12.5 L4.5 11 L10.6 9.5 Z" />
    <path d="M19 3 L19.4 5 L21.5 5.5 L19.4 6 L19 8 L18.6 6 L16.5 5.5 L18.6 5 Z" />
    <circle cx="6" cy="18.5" r="0.9" fill="currentColor" stroke="none" opacity="0.55" />
    <circle cx="19" cy="17" r="0.7" fill="currentColor" stroke="none" opacity="0.45" />
  </svg>
)

/** 仪式杖 · 起卦导航 */
export const Wand = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 20 L17 7" />
    <path d="M3 21 L7 19.5 L4.5 17 Z" fill="currentColor" stroke="none" />
    <path
      d="M17 5 L18 7 L20 8 L18 9 L17 11 L16 9 L14 8 L16 7 Z"
      fill="currentColor"
      stroke="none"
    />
    <path d="M20 5 L20.5 6" opacity="0.6" />
  </svg>
)

/** 手势 · 卦库导航 */
export const Hand = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M9 11 L9 5 C9 3.9 9.9 3 11 3 C12.1 3 13 3.9 13 5 L13 12" />
    <path d="M13 9 L13 4 C13 2.9 13.9 2 15 2 C16.1 2 17 2.9 17 4 L17 11" />
    <path d="M17 9 L17 5 C17 3.9 17.9 3 19 3 C20.1 3 21 3.9 21 5 L21 12 C21 16 18 20 13 20 L11 20 C8 20 5 18 5 14 L5 11" />
  </svg>
)

/** 卦象纹样 · 列表装饰 */
export const HexagramPattern = (props: IconProps) => (
  <svg viewBox="0 0 24 24" shapeRendering="crispEdges" aria-hidden="true" {...props}>
    <rect x="3" y="3" width="18" height="3" fill="currentColor" />
    <rect x="3" y="8" width="7" height="3" fill="currentColor" />
    <rect x="14" y="8" width="7" height="3" fill="currentColor" />
    <rect x="3" y="13" width="18" height="3" fill="currentColor" />
    <rect x="3" y="18" width="7" height="3" fill="currentColor" />
    <rect x="14" y="18" width="7" height="3" fill="currentColor" />
  </svg>
)

/* ====================================================================
 * 问事场景
 * ==================================================================== */

/** 事业 · 卷轴 / 工作 */
export const Briefcase = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="3" y="7" width="18" height="13" rx="1.5" />
    <path d="M9 7 L9 5 C9 4 9.5 3.5 10.5 3.5 L13.5 3.5 C14.5 3.5 15 4 15 5 L15 7" />
    <path d="M3 13 L21 13" />
    <path d="M10 16.5 L14 16.5" />
  </svg>
)

/** 财富 · 钱包 */
export const Wallet = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 7 L18 7 L18 5 C18 4 17.5 3.5 16.5 3.5 L4.5 3.5 C3.5 3.5 3 4 3 5 Z" />
    <path d="M3 7 L3 19 C3 20 3.5 20.5 4.5 20.5 L20 20.5 C20.5 20.5 21 20 21 19.5 L21 9 C21 8 20.5 7.5 19.5 7.5 L3 7.5" />
    <circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

/** 健康 · 十字 */
export const Health = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M9 3 L15 3 L15 9 L21 9 L21 15 L15 15 L15 21 L9 21 L9 15 L3 15 L3 9 L9 9 Z" />
  </svg>
)

/** 学业 · 笔 */
export const Study = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 20 L4 17 L17 4 L20 7 L7 20 Z" />
    <path d="M14 7 L17 10" />
    <path d="M4 20 L9 20" />
  </svg>
)

/** 人际 · 双人形 */
export const People = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 19 C3 15 5 13 9 13 C13 13 15 15 15 19" />
    <path d="M14 19 C14 16 16 14 17.5 14 C19 14 21 15.5 21 18" />
  </svg>
)

/* ====================================================================
 * 五行
 * ==================================================================== */

/** 木 · 树 */
export const Wood = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 22 L12 13" />
    <path d="M12 13 C7 13 4 9 4 5 C4 4 5 3 6 4 C8 5 10 6 12 8" />
    <path d="M12 13 C17 13 20 9 20 5 C20 4 19 3 18 4 C16 5 14 6 12 8" />
    <path d="M9 22 C10 20 11 19 12 19 C13 19 14 20 15 22" />
  </svg>
)

/** 火 · 火焰 */
export const Fire = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 22 C7 22 4 19 4 15 C4 12 6 10 7.5 7.5 C7.5 9.5 9 10 10 9 C10 7 9.5 5 11 3.5 C12 5.5 14 6.5 15.5 9 C16.5 7.5 17.5 8 18 9.5 C18.5 11 19 12.5 19 14.5 C19 18.5 16 22 12 22 Z" />
    <path d="M10 18 C10 19.5 11 20 12 20 C13 20 14 19.5 14 18" opacity="0.6" />
  </svg>
)

/** 土 · 山 */
export const Earth = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M2 20 L22 20" />
    <path d="M3 20 L8 11 L12 17 L16 8 L21 20" />
    <path d="M12 17 L14 14" opacity="0.6" />
  </svg>
)

/** 金 · 鼎 / 圆方 */
export const Metal = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="0.5" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

/** 水 · 水滴 */
export const Water = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3 C8 9 5 13 5 16 C5 19.5 8 22 12 22 C16 22 19 19.5 19 16 C19 13 16 9 12 3 Z" />
    <path d="M9 15.5 C9 17 10.5 18.5 12 18.5" opacity="0.6" />
  </svg>
)

/* ====================================================================
 * 装饰 / 玄学
 * ==================================================================== */

/** 太极图 */
export const Taiji = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path
      d="M12 3 C8.5 3 6 6 6 9 C6 12 8.5 15 12 15 C15.5 15 18 12 18 9 C18 6 15.5 3 12 3 Z"
      fill="currentColor"
      stroke="none"
    />
    <path d="M12 21 C15.5 21 18 18 18 15 C18 12 15.5 9 12 9 C8.5 9 6 12 6 15 C6 18 8.5 21 12 21 Z" />
    <circle cx="12" cy="6" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="18" r="1.4" fill="currentColor" stroke="none" />
  </svg>
)

/** 印章 · 方印 */
export const Stamp = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="5" y="3" width="14" height="14" rx="0.5" />
    <rect x="7.5" y="17" width="9" height="4" />
    <path d="M3 6 L4 6" opacity="0.5" />
    <path d="M20 6 L21 6" opacity="0.5" />
  </svg>
)

/** 印章 · 圆印 */
export const CompassRose = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path
      d="M12 3 L13.5 11 L21 12 L13.5 13 L12 21 L10.5 13 L3 12 L10.5 11 Z"
      fill="currentColor"
      fillOpacity="0.25"
    />
    <path d="M3 12 L21 12 M12 3 L12 21" opacity="0.3" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
)

/* ====================================================================
 * 时空
 * ==================================================================== */

export const Calendar = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="3" y="5" width="18" height="16" rx="1.5" />
    <path d="M3 9 L21 9" />
    <path d="M8 3 L8 7 M16 3 L16 7" />
    <rect x="7" y="13" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="14" y="13" width="3" height="3" fill="currentColor" stroke="none" />
  </svg>
)

export const Clock = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7 L12 12 L15.5 14" />
  </svg>
)

export const Sun = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3 L12 5 M12 19 L12 21 M3 12 L5 12 M19 12 L21 12" />
    <path d="M5.6 5.6 L7 7 M17 17 L18.4 18.4 M5.6 18.4 L7 17 M17 7 L18.4 5.6" />
  </svg>
)

export const Moon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M20 14.5 C19 18 15.5 20.5 11.5 20.5 C6.5 20.5 2.5 16.5 2.5 11.5 C2.5 7.5 5 4 8.5 3 C7 5 6 7.5 6 10 C6 14 9 17 13 17 C15.5 17 18 16 20 14.5 Z" />
  </svg>
)

export const Tag = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 12 L11 4 L20 4 L20 13 L12 21 Z" />
    <circle cx="16" cy="8" r="1.4" fill="currentColor" stroke="none" />
  </svg>
)

/* ====================================================================
 * 云端 / 同步
 * ==================================================================== */

export const Cloud = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M7 18 L17 18 C19.2 18 21 16.2 21 14 C21 12.1 19.4 10.5 17.4 10.5 C16.9 8 14.7 6 12 6 C9.8 6 7.9 7.5 7.1 9.5 C5.4 9.8 4.2 11.3 4.2 13 C4.2 15.8 6.4 18 9.2 18" />
  </svg>
)

export const CloudOff = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 3 L21 21" />
    <path d="M5.5 9.5 C4.4 10.2 4 11.2 4 12.5 C4 15.3 6.2 17.5 9 17.5 L17 17.5 C18.5 17.5 19.8 16.8 20.5 15.8" />
    <path d="M9 5.5 C10.3 4.5 11.8 4 13.5 4 C16.2 4 18.4 6 18.9 8.5 C20.5 8.8 21.5 9.7 21.5 11" />
  </svg>
)

export const RefreshCloud = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M7 18 L17 18 C19.2 18 21 16.2 21 14 C21 12.1 19.4 10.5 17.4 10.5" />
    <path d="M3 12 A4.5 4.5 0 0 1 7.5 7.5 C8 5.7 9.6 4.5 11.5 4.5 C13.7 4.5 15.5 6.3 15.5 8.5" />
    <path d="M15.5 5 L15.5 8.5 L12 8.5" />
  </svg>
)

/* ====================================================================
 * 警告 / 提示
 * ==================================================================== */

export const Warning = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3 L21 19 L3 19 Z" />
    <path d="M12 10 L12 14" />
    <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

export const Anchor = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="6" r="2.5" />
    <path d="M12 8.5 L12 21" />
    <path d="M5 13 C5 17 8 20 12 20 C16 20 19 17 19 13" />
    <path d="M8 13 L12 16 L16 13" />
  </svg>
)

export const Pulse = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 12 L7 12 L9.5 5 L14 19 L16.5 12 L21 12" />
  </svg>
)

export const Meditation = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="6" r="2" />
    <path d="M12 8 L12 13" />
    <path d="M6 11 C8 10 16 10 18 11" />
    <path d="M6 11 L4 17 L8 17" />
    <path d="M18 11 L20 17 L16 17" />
    <path d="M8 13 L8 20 M16 13 L16 20" />
  </svg>
)

export const ListChecks = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 6 L5 8 L9 4" />
    <path d="M11 6 L21 6" />
    <path d="M3 13 L5 15 L9 11" />
    <path d="M11 13 L21 13" />
    <path d="M3 20 L5 22 L9 18" />
    <path d="M11 20 L21 20" />
  </svg>
)

/* ====================================================================
 * 旧 API 兼容（已被新设计替代）
 * ==================================================================== */

export const Compass = CompassRose
export const Orbit = CompassRose

/** 加载中 · 旋转虚线圆 */
export const Loader = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3 A9 9 0 1 1 3 12" />
    <path d="M3 12 A9 9 0 0 1 6 5.5" opacity="0.4" />
  </svg>
)

export const Loader2 = Loader

/* ====================================================================
 * 卦象专用
 * ==================================================================== */

/** 阳爻 · 实线 */
export const YangLine = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="3" y="10" width="18" height="4" fill="currentColor" stroke="none" />
  </svg>
)

/** 阴爻 · 断线 */
export const YinLine = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="3" y="10" width="7" height="4" fill="currentColor" stroke="none" />
    <rect x="14" y="10" width="7" height="4" fill="currentColor" stroke="none" />
  </svg>
)

/** 动爻 · 朱红 */
export const ChangingLine = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 10 L9 14 L15 10 L21 14" />
  </svg>
)
