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
  <svg {...baseProps} {...props}>
    {/* 八卦变形 logo：上下双横 + 中间 8 字纹 */}
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M4 9 L20 9 M4 15 L20 15" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M12 14.5 L12 18" />
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
    <path d="M12 3 L13.5 9 L19.5 10.5 L13.5 12 L12 18 L10.5 12 L4.5 10.5 L10.5 9 Z" />
    <path d="M19 3 L19.5 5 L21.5 5.5 L19.5 6 L19 8 L18.5 6 L16.5 5.5 L18.5 5 Z" />
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
    <ellipse cx="8" cy="7" rx="5" ry="3" />
    <path d="M3 7 L3 17 C3 18.66 5.24 20 8 20 C10.76 20 13 18.66 13 17 L13 7" />
    <path d="M13 11 C13 12.66 15.24 14 18 14 C20.76 14 23 12.66 23 11" />
    <path d="M21 6 C21 4.34 18.76 3 16 3 C13.24 3 11 4.34 11 6 L11 11 C11 9.34 13.24 8 16 8" />
  </svg>
)

export const Leaf = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M3 21 L3 13 C3 7 7 3 13 3 C19 3 21 7 21 13 C21 17 17 21 13 21 Z" />
    <path d="M3 21 L15 9" />
  </svg>
)

export const Hand = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M6 11 L6 6 C6 4.34 7.34 3 9 3 C10.66 3 12 4.34 12 6 L12 11" />
    <path d="M12 9 L12 4 C12 2.89 12.89 2 14 2 C15.11 2 16 2.89 16 4 L16 11" />
    <path d="M16 9 L16 5 C16 3.89 16.89 3 18 3 C19.11 3 20 3.89 20 5 L20 11" />
    <path d="M20 9 L20 11 C20 15 17 19 13 19 L11 19 C8 19 6 17 6 14" />
  </svg>
)

export const Star = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 21 L12 16.5 L5.5 21 L8 13.5 L2 9 L9.5 9 Z" />
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
    <path d="M5 19 L16.5 7.5" />
    <path d="M4 20 L7 19 L5 17 Z" fill="currentColor" stroke="none" />
    <path d="M17.5 3.5 L18 5.5 L20 6 L18 6.5 L17.5 8.5 L17 6.5 L15 6 L17 5.5 Z" />
    <path d="M13 3 L13.5 4.5 M21 10 L19.5 10.5" opacity="0.65" />
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
