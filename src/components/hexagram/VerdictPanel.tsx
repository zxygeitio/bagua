import type { Verdict } from '@/lib/qigua/reading'
import type { ChangingRule } from '@/lib/qigua/reading'

interface VerdictPanelProps {
  rule: ChangingRule
  verdicts: Verdict[]
}

export function VerdictPanel({ rule, verdicts }: VerdictPanelProps) {
  return (
    <section className="pixel-frame bg-bagua-surface p-5 md:p-7">
      <p className="font-display text-[10px] tracking-[0.28em] text-bagua-primary">
        朱熹断法 · {rule.title} · {rule.count} 动
      </p>
      <p className="mt-2 font-body text-sm text-bagua-muted">{rule.explain}</p>
      <ol className="mt-6 space-y-5">
        {verdicts.map((verdict) => (
          <li key={`${verdict.label}-${verdict.position ?? 'g'}`} className={verdict.primary ? '' : 'opacity-70'}>
            <p className="font-display text-[11px] tracking-[0.2em] text-bagua-primary">
              {verdict.primary ? '主占' : '次看'} · {verdict.label}
            </p>
            <p className="prose-classical mt-2">{verdict.text}</p>
            <p className="mt-1 font-body text-xs text-bagua-muted">{verdict.source}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
