'use client'
import { useState } from 'react'
import { useHistoryStore } from '@/store/history'
import { X, Copy, Check, Link as LinkIcon } from '@/components/icons'

export function ShareDialog({ recordId, onClose }: { recordId: string; onClose: () => void }) {
  const records = useHistoryStore(s => s.records)
  const record = records.find(r => r.id === recordId)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const generateShareLink = () => {
    // 由于是静态部署，分享链接存储在 URL 的 data 中
    const data = {
      m: record?.method,
      q: record?.question,
      l: record?.lines.map((l) => ({ p: l.position, y: l.yinYang === 'yang' ? 1 : 0, c: l.isChanging ? 1 : 0 })),
      t: record?.timestamp,
    }
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))))
    const url = `${window.location.origin}/share?d=${encoded}`
    setShareUrl(url)
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="glass-card relative max-w-md rounded-card p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-bagua-muted transition hover:bg-bagua-canvas"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="mb-2 font-display text-xl font-bold text-bagua-text">分享起卦</h3>
        <p className="mb-6 font-body text-sm text-bagua-muted">
          生成只读链接，对方打开即可查看你的卦象
        </p>

        {shareUrl ? (
          <div>
            <div className="mb-4 flex items-center gap-2 rounded-card border border-bagua-border/40 bg-bagua-canvas/50 p-3">
              <LinkIcon className="h-4 w-4 flex-shrink-0 text-bagua-muted" />
              <input
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent font-body text-xs text-bagua-text outline-none"
                onClick={e => (e.target as HTMLInputElement).select()}
              />
            </div>
            <button
              onClick={handleCopy}
              className="flex w-full items-center justify-center gap-2 rounded-button bg-bagua-primary px-4 py-3 font-body font-medium text-white transition hover:bg-bagua-primary/90"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? '已复制' : '复制链接'}
            </button>
            <p className="mt-3 text-center font-body text-xs text-bagua-muted">
              链接包含完整卦象数据，无需后端
            </p>
          </div>
        ) : (
          <button
            onClick={generateShareLink}
            className="flex w-full items-center justify-center gap-2 rounded-button bg-bagua-secondary px-4 py-3 font-body font-medium text-white transition hover:bg-bagua-secondary/90"
          >
            <LinkIcon className="h-4 w-4" />
            生成分享链接
          </button>
        )}
      </div>
    </div>
  )
}