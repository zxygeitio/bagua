'use client'

import { useEffect, useRef, useState } from 'react'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { X, Download } from '@/components/icons'
import { getGuaById, type Gua } from '@/lib/iching'
import { SCENARIO_LABELS, type Scenario } from '@/types/iching'
import { hexagramPixelMetrics, type HexagramSize } from '@/styles/theme'

interface ShareCardProps {
  gua: Gua
  question?: string
  scenario?: Scenario
  date: string
  onClose?: () => void
}

interface ShareCardCanvasProps {
  gua: Gua
  question?: string
  scenario?: Scenario
  date: string
}

/**
 * 卦象分享卡 — 800x1000 像素图
 * 视觉：草纸底 + 乾卦方框 + 卦辞 + 现代启示
 * 用途：用户可下载 PNG 分享到社交媒体
 */
export function ShareCard({ gua, question, scenario, date, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rendering, setRendering] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleDownload = async () => {
    if (!cardRef.current) return
    setRendering(true)
    try {
      const svgString = await renderCardToSvg(gua, question, scenario, date)
      const blob = await svgToPng(svgString, 800, 1000)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bagua-${gua.id}-${gua.name}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setDownloaded(true)
    } catch (e) {
      console.error('生成图片失败:', e)
      alert('生成图片失败，请重试')
    } finally {
      setRendering(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto bg-bagua-canvas"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center border-2 border-bagua-text bg-bagua-surface hover:bg-bagua-wash"
          aria-label="关闭"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-5">
          <p className="mb-3 text-center font-display text-[10px] tracking-[0.28em] text-bagua-primary">
            SHARE CARD · 卦象卡
          </p>

          {/* 卡片预览 — 800x1000 等比缩放 */}
          <div
            ref={cardRef}
            className="mx-auto w-full"
            style={{ maxWidth: 480, aspectRatio: '4 / 5' }}
          >
            <ShareCardCanvas gua={gua} question={question} scenario={scenario} date={date} />
          </div>

          <p className="mt-3 text-center font-body text-xs text-bagua-muted">
            草纸像素风 · 800 × 1000 PNG
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleDownload}
              disabled={rendering}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {rendering ? '生成中…' : downloaded ? '已下载' : '下载卦象卡'}
            </button>
            <button onClick={onClose} className="btn-secondary">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** 卡片画布 — 实际显示 + 截屏时复用 */
function ShareCardCanvas({
  gua,
  question,
  scenario,
  date,
}: ShareCardCanvasProps) {
  return (
    <svg
      viewBox="0 0 800 1000"
      className="h-full w-full"
      style={{
        backgroundColor: '#E7D3A4',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.62 0 0 0 0 0.48 0 0 0 0 0.28 0 0 0 0 0.055 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23f)'/%3E%3C/svg%3E\")",
      }}
    >
      {/* 边框 */}
      <rect x="20" y="20" width="760" height="960" fill="none" stroke="#2C2416" strokeWidth="6" />
      <rect x="32" y="32" width="736" height="936" fill="none" stroke="#2C2416" strokeWidth="2" opacity="0.4" />

      {/* 顶部 — 站点标识 + 卦象 ID */}
      <text x="400" y="90" textAnchor="middle" fontSize="20" fill="#B23A2A" fontFamily="serif" letterSpacing="6">
        周 易 · 草 纸 刻 本
      </text>
      <line x1="100" y1="110" x2="700" y2="110" stroke="#2C2416" strokeWidth="1.5" opacity="0.5" />

      {/* 卦象本体 */}
      <g transform="translate(400 270)">
        <HexagramSvg gua={gua} size="lg" />
      </g>

      <text x="400" y="380" textAnchor="middle" fontSize="48" fill="#2C2416" fontFamily="serif" fontWeight="500" letterSpacing="8">
        {gua.name}
      </text>
      <text x="400" y="410" textAnchor="middle" fontSize="14" fill="#6E5A3C" fontFamily="serif" letterSpacing="3">
        {gua.pronunciation} · #{gua.id.toString().padStart(2, '0')} / 64 · {gua.shangGua}上{gua.xiaGua}下 · 五行{gua.wuxing}
      </text>

      <line x1="100" y1="450" x2="700" y2="450" stroke="#2C2416" strokeWidth="1.5" opacity="0.5" />

      {/* 卦辞 */}
      <text x="80" y="500" fontSize="14" fill="#B23A2A" fontFamily="serif" letterSpacing="3">
        卦 辞
      </text>
      <foreignObject x="80" y="510" width="640" height="80">
        <div
          style={{
            fontFamily: 'serif, "Noto Serif SC", "Songti SC"',
            fontSize: '26px',
            lineHeight: '1.7',
            color: '#2C2416',
            textAlign: 'center',
          }}
        >
          {gua.guaci}
        </div>
      </foreignObject>

      {/* 问题 */}
      {question && (
        <>
          <line x1="100" y1="610" x2="700" y2="610" stroke="#2C2416" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
          <text x="80" y="655" fontSize="14" fill="#B23A2A" fontFamily="serif" letterSpacing="3">
            问
          </text>
          <foreignObject x="80" y="665" width="640" height="80">
            <div
              style={{
                fontFamily: 'serif, "Noto Serif SC", "Songti SC"',
                fontSize: '20px',
                lineHeight: '1.6',
                color: '#6E5A3C',
                textAlign: 'center',
              }}
            >
              {question}
            </div>
          </foreignObject>
        </>
      )}

      {/* 现代启示 */}
      <line x1="100" y1="780" x2="700" y2="780" stroke="#2C2416" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
      <text x="80" y="820" fontSize="14" fill="#B23A2A" fontFamily="serif" letterSpacing="3">
        现 代 启 示
      </text>
      <foreignObject x="80" y="830" width="640" height="90">
        <div
          style={{
            fontFamily: 'sans-serif, "Noto Sans SC"',
            fontSize: '14px',
            lineHeight: '1.7',
            color: '#2C2416',
            textAlign: 'center',
          }}
        >
          {gua.modernInsight.slice(0, 80)}
          {gua.modernInsight.length > 80 ? '…' : ''}
        </div>
      </foreignObject>

      {/* 底部 — 日期 + 站点 */}
      <line x1="100" y1="930" x2="700" y2="930" stroke="#2C2416" strokeWidth="1.5" opacity="0.5" />
      <text x="80" y="955" fontSize="11" fill="#6E5A3C" fontFamily="sans-serif" letterSpacing="2">
        {scenario ? SCENARIO_LABELS[scenario] : '起卦'} · {date}
      </text>
      <text x="720" y="955" textAnchor="end" fontSize="11" fill="#B23A2A" fontFamily="serif" letterSpacing="2">
        bagua.pages.dev
      </text>
    </svg>
  )
}

/** 卡片专用 HexagramSymbol（外层无 wrapper 避免干扰） */
function HexagramSvg({ gua, size = 'md' }: { gua: Pick<Gua, 'yaos'>; size: HexagramSize }) {
  const preset = hexagramPixelMetrics(size)
  const rowHeight = preset.stroke + preset.gap
  const totalHeight = rowHeight * 6 - preset.gap
  const ordered = [...gua.yaos].reverse()

  return (
    <svg
      width={preset.width}
      height={totalHeight}
      viewBox={`0 0 ${preset.width} ${totalHeight}`}
      style={{ shapeRendering: 'crispEdges', overflow: 'visible' }}
      x={-preset.width / 2}
      y={-totalHeight / 2}
    >
      {ordered.map((yao, i) => {
        const y = i * rowHeight
        const isYang = yao.yinYang === 'yang'
        const fill = yao.isChanging ? '#B23A2A' : '#2C2416'
        if (isYang) {
          return (
            <rect
              key={i}
              x={0}
              y={y}
              width={preset.width}
              height={preset.stroke}
              fill={fill}
            />
          )
        }
        const segWidth = (preset.width - preset.yinBreak) / 2
        return (
          <g key={i}>
            <rect x={0} y={y} width={segWidth} height={preset.stroke} fill={fill} />
            <rect x={segWidth + preset.yinBreak} y={y} width={segWidth} height={preset.stroke} fill={fill} />
          </g>
        )
      })}
    </svg>
  )
}

/** 将卡片 SVG 字符串渲染为 PNG Blob */
async function svgToPng(svgString: string, width: number, height: number): Promise<Blob> {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法创建 canvas 上下文'))
        return
      }
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      canvas.toBlob((b) => {
        if (b) resolve(b)
        else reject(new Error('toBlob 失败'))
      }, 'image/png')
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    img.src = url
  })
}

async function renderCardToSvg(
  gua: Gua,
  question: string | undefined,
  scenario: Scenario | undefined,
  date: string,
): Promise<string> {
  // 用 dataURL 注入图片以保证 SVG 可独立渲染
  const bgDataUrl = await getBgDataUrl()
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <pattern id="paper" width="180" height="180" patternUnits="userSpaceOnUse">
      <image href="${bgDataUrl}" width="180" height="180" />
    </pattern>
  </defs>
  <rect width="800" height="1000" fill="#E7D3A4" />
  <rect width="800" height="1000" fill="url(#paper)" opacity="0.55" />
  ${buildCardInner(gua, question, scenario, date)}
</svg>`
}

function buildCardInner(
  gua: Gua,
  question: string | undefined,
  scenario: Scenario | undefined,
  date: string,
): string {
  const preset = hexagramPixelMetrics('lg')
  const rowHeight = preset.stroke + preset.gap
  const totalHeight = rowHeight * 6 - preset.gap
  const yaoSvg = [...gua.yaos].reverse()
    .map((yao, i) => {
      const y = i * rowHeight
      const isYang = yao.yinYang === 'yang'
      const fill = yao.isChanging ? '#B23A2A' : '#2C2416'
      if (isYang) {
        return `<rect x="${400 - preset.width / 2}" y="${260 - totalHeight / 2 + y}" width="${preset.width}" height="${preset.stroke}" fill="${fill}" />`
      }
      const segWidth = (preset.width - preset.yinBreak) / 2
      const xStart = 400 - preset.width / 2
      return `
        <rect x="${xStart}" y="${260 - totalHeight / 2 + y}" width="${segWidth}" height="${preset.stroke}" fill="${fill}" />
        <rect x="${xStart + segWidth + preset.yinBreak}" y="${260 - totalHeight / 2 + y}" width="${segWidth}" height="${preset.stroke}" fill="${fill}" />
      `
    })
    .join('')

  const modernSnippet = gua.modernInsight.slice(0, 80) + (gua.modernInsight.length > 80 ? '…' : '')
  const questionLine = question
    ? `
      <line x1="100" y1="610" x2="700" y2="610" stroke="#2C2416" stroke-width="1" stroke-dasharray="4 4" opacity="0.3" />
      <text x="80" y="655" font-size="14" fill="#B23A2A" font-family="serif" letter-spacing="3">问</text>
      <foreignObject x="100" y="660" width="600" height="80">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:serif; font-size:20px; line-height:1.6; color:#6E5A3C; text-align:center;">
          ${escapeXml(question)}
        </div>
      </foreignObject>
    `
    : ''

  return `
    <rect x="20" y="20" width="760" height="960" fill="none" stroke="#2C2416" stroke-width="6" />
    <rect x="32" y="32" width="736" height="936" fill="none" stroke="#2C2416" stroke-width="2" opacity="0.4" />
    <text x="400" y="90" text-anchor="middle" font-size="20" fill="#B23A2A" font-family="serif" letter-spacing="6">周 易 · 草 纸 刻 本</text>
    <line x1="100" y1="110" x2="700" y2="110" stroke="#2C2416" stroke-width="1.5" opacity="0.5" />
    ${yaoSvg}
    <text x="400" y="380" text-anchor="middle" font-size="48" fill="#2C2416" font-family="serif" letter-spacing="8">${gua.name}</text>
    <text x="400" y="410" text-anchor="middle" font-size="14" fill="#6E5A3C" font-family="serif" letter-spacing="3">${gua.pronunciation} · #${gua.id.toString().padStart(2, '0')} / 64 · ${gua.shangGua}上${gua.xiaGua}下 · 五行${gua.wuxing}</text>
    <line x1="100" y1="450" x2="700" y2="450" stroke="#2C2416" stroke-width="1.5" opacity="0.5" />
    <text x="80" y="500" font-size="14" fill="#B23A2A" font-family="serif" letter-spacing="3">卦 辞</text>
    <foreignObject x="100" y="510" width="600" height="80">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:serif; font-size:26px; line-height:1.7; color:#2C2416; text-align:center;">${escapeXml(gua.guaci)}</div>
    </foreignObject>
    ${questionLine}
    <line x1="100" y1="780" x2="700" y2="780" stroke="#2C2416" stroke-width="1" stroke-dasharray="4 4" opacity="0.3" />
    <text x="80" y="820" font-size="14" fill="#B23A2A" font-family="serif" letter-spacing="3">现 代 启 示</text>
    <foreignObject x="100" y="830" width="600" height="90">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:14px; line-height:1.7; color:#2C2416; text-align:center;">${escapeXml(modernSnippet)}</div>
    </foreignObject>
    <line x1="100" y1="930" x2="700" y2="930" stroke="#2C2416" stroke-width="1.5" opacity="0.5" />
    <text x="80" y="955" font-size="11" fill="#6E5A3C" font-family="sans-serif" letter-spacing="2">${scenario ? SCENARIO_LABELS[scenario] : '起卦'} · ${escapeXml(date)}</text>
    <text x="720" y="955" text-anchor="end" font-size="11" fill="#B23A2A" font-family="serif" letter-spacing="2">bagua.pages.dev</text>
  `
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

let _bgDataUrl: string | null = null
async function getBgDataUrl(): Promise<string> {
  if (_bgDataUrl) return _bgDataUrl
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.62 0 0 0 0 0.48 0 0 0 0 0.28 0 0 0 0.055 0"/></filter><rect width="180" height="180" filter="url(%23f)"/></svg>`
  _bgDataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`
  return _bgDataUrl
}

// 占位以防 tree-shake
void getGuaById
