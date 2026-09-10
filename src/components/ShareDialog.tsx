'use client'
import { useEffect, useState } from 'react'
import { useHistoryStore } from '@/store/history'
import { X, Copy, Check, Link as LinkIcon } from '@/components/icons'

export function ShareDialog({ recordId, onClose }: { recordId: string; onClose: () => void }) {
  const records = useHistoryStore((s) => s.records)
  const record = records.find((r) => r.id === recordId)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const generateShareLink = () => {
    // 由于是静态部署，分享链接存储在 URL 的 data 中
    const data = {
      m: record?.method,
      q: record?.question,
      l: record?.lines.map((l) => ({
        p: l.position,
        y: l.yinYang === 'yang' ? 1 : 0,
        c: l.isChanging ? 1 : 0,
      })),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bagua-text/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="分享起卦"
        className="relative max-w-md border-4 border-bagua-text bg-bagua-surface p-6 shadow-pixel"
      >
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-3 top-3 border-4 border-transparent p-1 text-bagua-muted hover:border-bagua-text"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="mb-2 font-display text-xl tracking-widest text-bagua-text">分享起卦</h3>
        <p className="mb-6 font-body text-sm text-bagua-muted">
          生成只读链接，对方打开即可查看你的卦象
        </p>

        {shareUrl ? (
          <div>
            <div className="mb-4 flex items-center gap-2 border-4 border-bagua-text bg-bagua-canvas p-3">
              <LinkIcon className="h-4 w-4 flex-shrink-0 text-bagua-muted" />
              <input
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent font-body text-xs text-bagua-text outline-none"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
            <button onClick={handleCopy} className="btn-primary w-full">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? '已复制' : '复制链接'}
            </button>
            <p className="mt-3 text-center font-body text-xs text-bagua-muted">
              链接包含完整卦象数据，无需后端
            </p>
          </div>
        ) : (
          <button onClick={generateShareLink} className="btn-primary w-full">
            <LinkIcon className="h-4 w-4" />
            生成分享链接
          </button>
        )}
      </div>
    </div>
  )
}
