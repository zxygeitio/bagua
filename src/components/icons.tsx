/**
 * bagua SVG 图标库 - 双线风格
 * 所有图标 24x24 viewBox, stroke-width 1.5, currentColor
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const Logo = (props: IconProps) => (
  <svg viewBox="0 0 24 24" shapeRendering="crispEdges" aria-hidden="true" {...props}>
    {/* 乾卦 ☰ 三阳爻 — Logo */}
    <rect x="2" y="2" width="20" height="3" fill="currentColor" />
    <rect x="2" y="10" width="20" height="3" fill="currentColor" />
    <rect x="2" y="18" width="20" height="3" fill="currentColor" />
  </svg>
)

export const ArrowRight = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M5 12 L19 12" />
    <path d="M13 6 L19 12 L13 18" />
  </svg>
)

export const ArrowLeft = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M19 12 L5 12" />
    <path d="M11 6 L5 12 L11 18" />
  </svg>
)

export const Sparkles = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {/* 梅花形 — 主瓣四片 + 两点散瓣 */}
    <path d="M12 3 L13.4 9.6 L20 11 L13.4 12.4 L12 19 L10.6 12.4 L4 11 L10.6 9.6 Z" />
    <path d="M19 3 L19.5 5 L21.5 5.5 L19.5 6 L19 8 L18.5 6 L16.5 5.5 L18.5 5 Z" />
    <circle cx="6" cy="18" r="0.8" fill="currentColor" stroke="none" opacity="0.6" />
    <circle cx="20" cy="16" r="0.6" fill="currentColor" stroke="none" opacity="0.5" />
  </svg>
)

export const Layers = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3 L21 8 L12 13 L3 8 Z" />
    <path d="M3 12 L12 17 L21 12" />
    <path d="M3 16 L12 21 L21 16" />
  </svg>
)

export const Compass = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3 L13 11 L21 12 L13 13 L12 21 L11 13 L3 12 L11 11 Z" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

export const BookText = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 4 L4 20 L11 19 L13 20 L20 19 L20 4 L13 5 L11 4 Z" />
    <path d="M11 4 L11 19" />
    <path d="M7 8 L9 8 M7 11 L9 11 M7 14 L9 14" />
  </svg>
)

export const BookOpen = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 5 L5 5 C4.45 5 4 5.45 4 6 L4 19 C4 19.55 4.45 20 5 20 L12 20" />
    <path d="M12 5 L19 5 C19.55 5 20 5.45 20 6 L20 19 C20 19.55 19.55 20 19 20 L12 20" />
    <path d="M12 5 L12 20" />
    <path d="M7 9 L10 9 M7 12 L10 12" />
    <path d="M14 9 L17 9 M14 12 L17 12" />
  </svg>
)

export const Coins = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {/* 三枚铜钱叠放：后 / 中 / 前 */}
    <ellipse cx="9" cy="6" rx="5" ry="2.4" opacity="0.45" />
    <ellipse cx="15" cy="6" rx="5" ry="2.4" opacity="0.45" />
    <rect x="4" y="6" width="10" height="2.4" opacity="0.45" />
    <rect x="10" y="6" width="10" height="2.4" opacity="0.45" />
    <ellipse cx="12" cy="11" rx="6" ry="3" />
    <path d="M6 11 L6 19 C6 20.66 8.69 22 12 22 C15.31 22 18 20.66 18 19 L18 11" />
    <rect x="9.5" y="15" width="5" height="2" fill="currentColor" stroke="none" opacity="0.85" />
  </svg>
)

export const Leaf = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {/* 一茎两叶 — 取蓍草细叶之意 */}
    <path d="M12 22 L12 13" />
    <path d="M12 13 C7 13 4 9 4 5 C4 4 5 3 6 4 C8 6 10 7 12 9" />
    <path d="M12 13 C17 13 20 9 20 5 C20 4 19 3 18 4 C16 6 14 7 12 9" />
    <path d="M7 7 C8 8 9 9 10 10" opacity="0.6" />
    <path d="M17 7 C16 8 15 9 14 10" opacity="0.6" />
  </svg>
)

export const Hand = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {/* 选/择之手 — 食指上扬，余指合拢 */}
    <path d="M9 11 L9 5 C9 3.9 9.9 3 11 3 C12.1 3 13 3.9 13 5 L13 12" />
    <path d="M13 9 L13 4 C13 2.9 13.9 2 15 2 C16.1 2 17 2.9 17 4 L17 11" />
    <path d="M17 9 L17 5 C17 3.9 17.9 3 19 3 C20.1 3 21 3.9 21 5 L21 12" />
    <path d="M9 12 L9 14" />
    <path d="M21 12 C21 17 17.5 20 13 20 L11 20 C8 20 5 18 5 14 L5 11" />
  </svg>
)

export const Star = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 2.5 L14.6 9 L21.5 9.3 L16.2 13.4 L18.3 20 L12 16 L5.7 20 L7.8 13.4 L2.5 9.3 L9.4 9 Z" />
  </svg>
)

export const Share = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 12 L4 19 C4 20.1 4.9 21 6 21 L18 21 C19.1 21 20 20.1 20 19 L20 12" />
    <path d="M16 6 L12 2 L8 6" />
    <path d="M12 2 L12 15" />
  </svg>
)

export const Share2 = Share

export const Trash = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 6 L21 6" />
    <path d="M5 6 L5 20 C5 21.1 5.9 22 7 22 L17 22 C18.1 22 19 21.1 19 20 L19 6" />
    <path d="M8 6 L8 4 C8 2.89 8.89 2 10 2 L14 2 C15.11 2 16 2.89 16 4 L16 6" />
    <path d="M10 11 L10 17 M14 11 L14 17" />
  </svg>
)

export const Trash2 = Trash

export const Search = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M16 16 L21 21" />
  </svg>
)

export const Settings = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12 L21 12 M3 12 L5 12" />
    <path d="M12 3 L12 5 M12 19 L12 21" />
    <path d="M5.6 5.6 L7 7 M17 17 L18.4 18.4 M5.6 18.4 L7 17 M17 7 L18.4 5.6" />
  </svg>
)

export const Copy = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M4 16 L4 6 C4 4.89 4.89 4 6 4 L16 4" />
  </svg>
)

export const Check = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M5 12 L10 17 L19 7" />
  </svg>
)

export const X = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M6 6 L18 18 M18 6 L6 18" />
  </svg>
)

export const Refresh = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M21 12 C21 16.97 16.97 21 12 21 C9.07 21 6.5 19.36 5 17" />
    <path d="M3 12 C3 7.03 7.03 3 12 3 C14.93 3 17.5 4.64 19 7" />
    <path d="M19 3 L19 7 L15 7 M5 21 L5 17 L9 17" />
  </svg>
)

export const RefreshCw = Refresh

export const ChevronRight = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M9 6 L15 12 L9 18" />
  </svg>
)

export const Cloud = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M7 18 L17 18 C19.21 18 21 16.21 21 14 C21 12.06 19.39 10.49 17.43 10.5 C16.94 7.97 14.71 6 12 6 C9.79 6 7.86 7.51 7.13 9.51 C5.43 9.85 4.16 11.31 4.16 13 C4.16 15.76 6.4 18 9.16 18" />
  </svg>
)

export const CloudOff = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 3 L21 21" />
    <path d="M5.5 9.51 C4.4 10.16 4 11.16 4 12.5 C4 15.26 6.24 17.5 9 17.5 L17 17.5 C18.5 17.5 19.81 16.83 20.5 15.76" />
    <path d="M9 5.5 C10.27 4.5 11.84 4 13.5 4 C16.21 4 18.44 5.97 18.93 8.5 C20.45 8.79 21.5 9.71 21.5 11" />
  </svg>
)

export const Loader = (props: IconProps) => (
  <svg {...baseProps} {...props} className={`animate-spin ${props.className || ''}`}>
    <path d="M12 3 L12 6 M12 18 L12 21 M3 12 L6 12 M18 12 L21 12" />
    <path d="M5.6 5.6 L7.7 7.7 M16.3 16.3 L18.4 18.4 M5.6 18.4 L7.7 16.3 M16.3 7.7 L18.4 5.6" opacity="0.3" />
  </svg>
)

export const Loader2 = Loader

export const Hexagon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3 L21 8 L21 16 L12 21 L3 16 L3 8 Z" />
    <path d="M12 8 L16 10.5 L16 14 L12 16.5 L8 14 L8 10.5 Z" />
  </svg>
)

export const Link = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M10 13.5 L13.5 17 C15 18.5 17.5 18.5 19 17 L21 15 C22.5 13.5 22.5 11 21 9.5 L18 6.5" />
    <path d="M14 10.5 L10.5 7 C9 5.5 6.5 5.5 5 7 L3 9 C1.5 10.5 1.5 13 3 14.5 L6 17.5" />
    <path d="M8.5 15.5 L15.5 8.5" />
  </svg>
)

export const LinkIcon = Link

export const Github = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M9 19 C4 20.5 4 16.5 2 16 M16 22 L16 18.13 C16.04 17.43 15.89 16.73 15.58 16.1 C18.16 15.74 20 14.13 20 11 C20.05 9.91 19.71 8.84 19.04 7.97 C19.33 6.96 19.3 5.89 18.95 4.9 C18.95 4.9 17.93 4.61 16 6.04 C14.06 5.55 12 5.55 10.06 6.04 C8.13 4.61 7.11 4.9 7.11 4.9 C6.76 5.89 6.73 6.96 7.02 7.97 C6.35 8.84 6.01 9.91 6.06 11 C6.06 14.13 7.9 15.74 10.48 16.1 C10.17 16.73 10.02 17.43 10.06 18.13 L10.06 22" />
  </svg>
)

export const Tao = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {/* 太极图 */}
    <path d="M12 4 C7.58 4 4 7.58 4 12 C4 16.42 7.58 20 12 20 C16.42 20 20 16.42 20 12 C20 7.58 16.42 4 12 4 Z" />
    <path d="M12 4 C14.21 4 16 6.79 16 10 C16 10 12 10 12 12 C12 12 16 12 16 14 C16 17.21 14.21 20 12 20" fill="currentColor" fillOpacity="0.3" />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
  </svg>
)

export const HexagramPattern = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {/* 64 卦网格图案 */}
    <rect x="3" y="3" width="4" height="4" />
    <rect x="10" y="3" width="4" height="4" />
    <rect x="17" y="3" width="4" height="4" />
    <rect x="3" y="10" width="4" height="4" />
    <rect x="10" y="10" width="4" height="4" />
    <rect x="17" y="10" width="4" height="4" />
    <rect x="3" y="17" width="4" height="4" />
    <rect x="10" y="17" width="4" height="4" />
    <rect x="17" y="17" width="4" height="4" />
  </svg>
)

/** Orbital ring used for the depth/constellation visual language. */
export const Orbit = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-25 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(25 12 12)" opacity="0.55" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="19.6" cy="8.7" r="1" fill="currentColor" stroke="none" />
  </svg>
)

/** Ritual wand / spark icon for the guided casting action. */
export const Wand = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 20 L17 7" />
    <path d="M3 21 L7 19 L5 15 Z" fill="currentColor" stroke="none" />
    <path d="M18 3 L18.5 5 L20.5 5.5 L18.5 6 L18 8 L17.5 6 L15.5 5.5 L17.5 5 Z" />
    <path d="M14 4 L14.5 5.5 M21 11 L19.5 11.5" opacity="0.65" />
  </svg>
)

/** Pulse mark for the live interpretation / changing-line feature. */
export const Pulse = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 12 H7 L9.5 5 L14 19 L16.5 12 H21" />
    <circle cx="9.5" cy="5" r="1" fill="currentColor" stroke="none" />
    <circle cx="14" cy="19" r="1" fill="currentColor" stroke="none" />
  </svg>
)

/** Calendar grid mark for the date-grouped history view. */
export const Calendar = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="3" y="5" width="18" height="16" rx="1" />
    <path d="M3 9 L21 9" />
    <path d="M8 3 L8 7 M16 3 L16 7" />
    <rect x="7" y="13" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="14" y="13" width="3" height="3" fill="currentColor" stroke="none" />
  </svg>
)

/** Checklist rows for the list view toggle. */
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

/** Horizontal dots used in compact menus. */
export const Dots = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
)

/** Filter / sort funnel used in toolbars. */
export const Filter = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 5 L21 5 L14 13 L14 20 L10 18 L10 13 Z" />
  </svg>
)

/* ------------------------------------------------------------------ *
 * 五行图标 — 每个独立动效与造型
 * ------------------------------------------------------------------ */

/** 木 · Tree/wood — 主生发，向上展开 */
export const Wood = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {/* 树 — 根、茎、叶 */}
    <path d="M12 22 L12 14" />
    <path d="M8 22 C9 20 10 19 12 19 C14 19 15 20 16 22" />
    <path d="M12 14 C7 14 4 10 4 6 C4 4.5 5 3.5 6.5 4 C9 5 11 6 12 8" />
    <path d="M12 14 C17 14 20 10 20 6 C20 4.5 19 3.5 17.5 4 C15 5 13 6 12 8" />
    <path d="M6 6 L8 5 M18 6 L16 5" opacity="0.7" />
  </svg>
)

/** 火 · Fire — 炎上，外焰两尖 */
export const Fire = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 22 C7 22 4 19 4 15 C4 11 6.5 9.5 8 7 C8 9 9 10 10.5 9 C11 7 10.5 5 12.5 3 C13 6 15.5 6.5 17 9.5 C18 8 19 9 19.5 10.5 C20 12 20.5 14 20 16 C19 19.5 16 22 12 22 Z" />
    <path d="M9.5 17 C10 19 11 19.5 12 19.5 C13 19.5 14 19 14.5 17" opacity="0.7" />
  </svg>
)

/** 土 · Earth — 厚德，承托山形 */
export const Earth = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {/* 山形为主，下接土地 */}
    <path d="M2 20 L22 20" />
    <path d="M3 20 L8 11 L11 16 L15 7 L22 20" />
    <path d="M2 8 C6 6 9 7 12 5 C15 3 18 4 22 6" opacity="0.55" />
    <path d="M11 16 L13 13" opacity="0.6" />
  </svg>
)

/** 金 · Metal — 刚毅，方圆中含 */
export const Metal = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="1" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
)

/** 水 · Water — 润下，水滴与波 */
export const Water = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3 C8 9 5 13 5 16 C5 19.5 8 22 12 22 C16 22 19 19.5 19 16 C19 13 16 9 12 3 Z" />
    <path d="M9 15 C9.5 17 10.5 18 12 18.5" opacity="0.6" />
    <path d="M3 5 C5 4 7 5 9 4" opacity="0.5" />
    <path d="M15 4 C17 5 19 4 21 5" opacity="0.5" />
  </svg>
)

/** 太极图 · Taiji — 双鱼图 */
export const Taiji = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3 C9 3 6 6 6 9 C6 12 9 15 12 15 C15 15 18 12 18 9 C18 6 15 3 12 3 Z" fill="currentColor" stroke="currentColor" />
    <path d="M12 21 C15 21 18 18 18 15 C18 12 15 9 12 9 C9 9 6 12 6 15 C6 18 9 21 12 21 Z" />
    <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

/** 罗盘 · Compass rose — 装饰用 */
export const CompassRose = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3 L13.5 11 L21 12 L13.5 13 L12 21 L10.5 13 L3 12 L10.5 11 Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M3 12 L21 12 M12 3 L12 21" opacity="0.4" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

/* ------------------------------------------------------------------ *
 * 工具图标
 * ------------------------------------------------------------------ */

/** 下载 */
export const Download = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3 L12 15" />
    <path d="M7 10 L12 15 L17 10" />
    <path d="M3 20 L21 20" />
  </svg>
)

/** 上传 */
export const Upload = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 15 L12 3" />
    <path d="M7 8 L12 3 L17 8" />
    <path d="M3 20 L21 20" />
  </svg>
)

/** 信息 */
export const Info = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8 L12 8.5" />
    <path d="M12 11 L12 16" />
  </svg>
)

/** 警告 */
export const Warning = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3 L21 19 L3 19 Z" />
    <path d="M12 10 L12 14" />
    <path d="M12 16.5 L12 17" />
  </svg>
)

/** 问号 */
export const Question = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9 C9 7 10.5 6 12 6 C13.5 6 15 7 15 9 C15 10.5 13.5 11 12 11.5 L12 13" />
    <path d="M12 16 L12 16.5" />
  </svg>
)

/** 居所/House */
export const Home = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 11 L12 3 L21 11" />
    <path d="M5 10 L5 20 L19 20 L19 10" />
    <path d="M10 20 L10 14 L14 14 L14 20" />
  </svg>
)

/** 书/Book（细长） */
export const Book = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 4 L4 20 L11 19 L13 20 L20 19 L20 4 L13 5 L11 4 Z" />
    <path d="M11 4 L11 19" />
  </svg>
)

/** 心（感情/自我） */
export const Heart = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 20 C7 17 3 13 3 9 C3 6 5 4 7.5 4 C9.5 4 11 5 12 7 C13 5 14.5 4 16.5 4 C19 4 21 6 21 9 C21 13 17 17 12 20 Z" />
  </svg>
)

/** 事业/工作（公文包） */
export const Briefcase = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <rect x="3" y="7" width="18" height="13" rx="1" />
    <path d="M9 7 L9 5 C9 4 9.5 3.5 10.5 3.5 L13.5 3.5 C14.5 3.5 15 4 15 5 L15 7" />
    <path d="M3 13 L21 13" />
  </svg>
)

/** 财富/钱袋 */
export const Wallet = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 7 L18 7 L18 5 C18 4 17.5 3.5 16.5 3.5 L4.5 3.5 C3.5 3.5 3 4 3 5 Z" />
    <path d="M3 7 L3 19 C3 20 3.5 20.5 4.5 20.5 L20 20.5 C20.5 20.5 21 20 21 19.5 L21 9 C21 8 20.5 7.5 19.5 7.5 L3 7.5" />
    <circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

/** 健康/十字 */
export const Health = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M9 3 L15 3 L15 9 L21 9 L21 15 L15 15 L15 21 L9 21 L9 15 L3 15 L3 9 L9 9 Z" />
  </svg>
)

/** 学问/笔 */
export const Study = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 20 L4 17 L17 4 L20 7 L7 20 Z" />
    <path d="M14 7 L17 10" />
    <path d="M4 20 L8 20" />
  </svg>
)

/** 人际/双人形 */
export const People = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 19 C3 15 5 13 9 13 C13 13 15 15 15 19" />
    <path d="M14 19 C14 16 16 14 17.5 14 C19 14 21 15.5 21 18" />
  </svg>
)

/* ------------------------------------------------------------------ *
 * 卦象专用
 * ------------------------------------------------------------------ */

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

/** 动爻（朱红） */
export const ChangingLine = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 10 L9 14 L15 10 L21 14" stroke="currentColor" strokeWidth="3" />
  </svg>
)

/** 加号（用于新建/添加） */
export const Plus = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 4 L12 20" />
    <path d="M4 12 L20 12" />
  </svg>
)

/** 减号 */
export const Minus = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 12 L20 12" />
  </svg>
)

/** 外部链接 */
export const ExternalLink = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M14 4 L20 4 L20 10" />
    <path d="M20 4 L11 13" />
    <path d="M19 13 L19 19 C19 20 18.5 20.5 17.5 20.5 L5 20.5 C4 20.5 3.5 20 3.5 19 L3.5 6.5 C3.5 5.5 4 5 5 5 L11 5" />
  </svg>
)

/** 链接/锚 */
export const Anchor = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="6" r="2.5" />
    <path d="M12 8.5 L12 21" />
    <path d="M5 13 C5 17 8 20 12 20 C16 20 19 17 19 13" />
    <path d="M8 13 L12 16 L16 13" />
  </svg>
)

/** 月亮（夜/深夜） */
export const Moon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M20 14 C19 18 15 21 11 21 C6 21 2 17 2 12 C2 8 5 4 9 3 C7 5 6 8 6 11 C6 15 9 18 13 18 C16 18 18 16 20 14 Z" />
  </svg>
)

/** 太阳 */
export const Sun = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3 L12 5 M12 19 L12 21 M3 12 L5 12 M19 12 L21 12" />
    <path d="M5.6 5.6 L7 7 M17 17 L18.4 18.4 M5.6 18.4 L7 17 M17 7 L18.4 5.6" />
  </svg>
)

/** 时辰/钟 */
export const Clock = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7 L12 12 L16 14" />
  </svg>
)

/** 标签 */
export const Tag = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 12 L11 4 L20 4 L20 13 L12 21 Z" />
    <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

/** 静/冥想（用于仪式感） */
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
