'use client'

import { useState } from 'react'

const STEPS = [
  {
    n: '壹',
    title: '看卦象',
    body: '先定上下卦与卦名。本卦为何，决定了问题落在大局中的位置。',
    hint: '64 卦皆是 8 卦两两相叠而成；上下卦合读，明体用关系。',
  },
  {
    n: '贰',
    title: '数动爻',
    body: '六爻中动爻为变化所在。无动爻读卦辞，一爻动读爻辞。',
    hint: '动爻少则读本卦；动爻多则参考之卦、互卦。',
  },
  {
    n: '叁',
    title: '取用神',
    body: '所占之事对应六亲：父母、兄弟、子孙、妻财、官鬼。',
    hint: '问事业看官鬼；问财看妻财；问家宅看父母。',
  },
  {
    n: '肆',
    title: '看旺衰',
    body: '用神得月建日辰生扶为旺，受克泄为衰。旺则吉，衰则凶。',
    hint: '五行有时令旺衰：春木旺、夏火旺、秋金旺、冬水旺、四季土旺。',
  },
  {
    n: '伍',
    title: '参看变卦',
    body: '本卦为始，之卦为终；互卦为过程，错综为另一面对照。',
    hint: '错卦提示另一视角；综卦提示换位思考。',
  },
] as const

export function ReadingGuide() {
  const [open, setOpen] = useState<number>(0)
  return (
    <ol className="space-y-3">
      {STEPS.map((s, i) => {
        const isOpen = open === i
        return (
          <li
            key={s.n}
            className={`border-4 transition ${
              isOpen ? 'border-bagua-text bg-bagua-wash' : 'border-bagua-fiber bg-bagua-surface'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center gap-4 px-4 py-3 text-left"
            >
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center border-4 border-bagua-text font-display text-base ${
                  isOpen ? 'bg-bagua-primary text-bagua-surface' : 'bg-bagua-canvas text-bagua-text'
                }`}
              >
                {s.n}
              </span>
              <div className="flex-1">
                <div className="font-display text-base tracking-wider">{s.title}</div>
                <div className="mt-0.5 font-body text-sm text-bagua-muted">{s.body}</div>
              </div>
              <span className="font-display text-xs text-bagua-muted">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="border-t-4 border-bagua-fiber bg-bagua-canvas/60 px-4 py-3">
                <p className="font-body text-sm italic text-bagua-text">{s.hint}</p>
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
