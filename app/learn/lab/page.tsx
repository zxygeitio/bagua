import type { Metadata } from 'next'
import Link from 'next/link'

import { mulberry32 } from '@/lib/qigua/rng'
import {
  CHI2_CRITICAL_DF3_005,
  LINE_VALUES,
  THEORY,
  hexagramInvariant,
  movingStructure,
  simulateLineDistribution,
} from '@/lib/qigua/cast/probability-lab'

export const metadata: Metadata = {
  title: '概率实验室',
  description: '硬币起卦法与大衍筮法的蒙特卡洛对比：单爻分布、卡方检验与「阳三而阴一」。',
}

/** 构建期蒙特卡洛：固定种子、同种子可重放（与单测同口径） */
const TRIALS = 40_000
const SEED = 20_260_909

const VALUE_LABEL: Record<6 | 7 | 8 | 9, string> = {
  6: '6 老阴 ⚋→⚊',
  7: '7 少阳 ⚊',
  8: '8 少阴 ⚋',
  9: '9 老阳 ⚊→⚋',
}

const METHOD_LABEL = { coin: '硬币法', dayan: '大衍筮法' } as const

/** 频率条形图横轴满刻度（50%），覆盖两法最大频率 7/16 */
const BAR_SCALE = 0.5

function pct(x: number): string {
  return `${(x * 100).toFixed(2)}%`
}

export default function LabPage() {
  const coin = simulateLineDistribution('coin', TRIALS, mulberry32(SEED))
  const dayan = simulateLineDistribution('dayan', TRIALS, mulberry32(SEED))
  const dists = { coin, dayan }
  const moving = { coin: movingStructure(coin), dayan: movingStructure(dayan) }
  const inv = { coin: hexagramInvariant('coin'), dayan: hexagramInvariant('dayan') }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="enter-up font-display text-4xl tracking-[0.16em] md:text-5xl">概率实验室</h1>
      <p className="prose-body mt-3 max-w-3xl text-bagua-muted">
        硬币起卦法与大衍筮法得到的爻，分布并不相同。本页在构建期用固定种子的 蒙特卡洛模拟各{' '}
        {TRIALS.toLocaleString()} 爻，对照理论分布做卡方检验，
        并摊开两法真正的分歧点：「阳三而阴一」。学术依据见{' '}
        <Link href="/learn#references" className="draw-underline text-bagua-primary">
          参考文献 R1 / R3 / R6
        </Link>
        。
      </p>

      {/* ===== 单爻分布对比 ===== */}
      <section className="mt-12 cv-auto cis-m">
        <h2 className="font-display text-sm tracking-[0.24em] text-bagua-primary">
          单爻分布 · 蒙特卡洛 {TRIALS.toLocaleString()} 爻
        </h2>
        <p className="prose-body mt-3 max-w-3xl text-bagua-muted">
          实心条为观测频率，右端刻线为理论值。大衍少阴（8）占 7/16 最高， 硬币法则 7、8 各占 3/8
          并列——两法形状不同，但本卦（变前）阳爻率同为 1/2。
        </p>
        <div className="paper-panel mt-6 space-y-8 p-5 md:p-8">
          {LINE_VALUES.map((v) => (
            <div key={v}>
              <div className="mb-3 flex items-baseline justify-between">
                <span className="font-display text-sm tracking-widest">{VALUE_LABEL[v]}</span>
                <span className="font-body text-xs text-bagua-muted">
                  理论：硬币 {pct(THEORY.coin[v])} / 大衍 {pct(THEORY.dayan[v])}
                </span>
              </div>
              <div className="space-y-2">
                {(['coin', 'dayan'] as const).map((m) => {
                  const freq = dists[m].frequencies[v]
                  return (
                    <div key={m} className="flex items-center gap-3">
                      <span className="w-16 flex-shrink-0 font-display text-xs text-bagua-muted">
                        {METHOD_LABEL[m]}
                      </span>
                      <div className="relative h-6 flex-1 border-2 border-bagua-fiber bg-bagua-canvas">
                        <div
                          className="h-full bg-bagua-primary/85"
                          style={{ width: `${Math.min(freq / BAR_SCALE, 1) * 100}%` }}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-y-0 w-0.5 bg-bagua-text"
                          style={{ left: `${Math.min(THEORY[m][v] / BAR_SCALE, 1) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 flex-shrink-0 text-right font-display text-xs">
                        {pct(freq)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 卡方检验 ===== */}
      <section className="mt-14 cv-auto cis-s">
        <h2 className="font-display text-sm tracking-[0.24em] text-bagua-primary">
          卡方检验 · 观测 vs 理论
        </h2>
        <p className="prose-body mt-3 max-w-3xl text-bagua-muted">
          χ² 统计量衡量观测频率对理论分布的偏离（自由度 3，α=0.05 临界值 {CHI2_CRITICAL_DF3_005}
          ）。本次固定样本均未显著偏离理论分布；“通过”不等于对算法的独立证明。
        </p>
        <div className="paper-panel mt-6 overflow-x-auto p-4">
          <table className="w-full min-w-[30rem] border-collapse text-center">
            <thead>
              <tr className="border-b-4 border-bagua-text font-display text-xs tracking-widest text-bagua-muted">
                <th className="py-2">方法</th>
                <th className="py-2">模拟爻数</th>
                <th className="py-2">χ² 统计量</th>
                <th className="py-2">临界值</th>
                <th className="py-2">检验结论</th>
              </tr>
            </thead>
            <tbody>
              {(['coin', 'dayan'] as const).map((m) => (
                <tr key={m} className="border-b border-bagua-fiber">
                  <td className="py-2 font-display text-sm tracking-widest">{METHOD_LABEL[m]}</td>
                  <td className="py-2 font-body text-sm">{dists[m].trials.toLocaleString()}</td>
                  <td className="py-2 font-display text-sm text-bagua-primary">
                    {dists[m].chi2.toFixed(2)}
                  </td>
                  <td className="py-2 font-body text-sm">{CHI2_CRITICAL_DF3_005}</td>
                  <td className="py-2 font-display text-xs tracking-widest">
                    {dists[m].chi2Pass ? '通过' : '未通过'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== 阳三而阴一 ===== */}
      <section className="mt-14 cv-auto cis-s">
        <h2 className="font-display text-sm tracking-[0.24em] text-bagua-primary">
          阳三而阴一 · 两法的真正分歧
        </h2>
        <p className="prose-body mt-3 max-w-3xl text-bagua-muted">
          两法每爻变爻率同为 1/4、静卦率与期望动爻数也全然相同；差别只在变爻的阴阳结构：
          大衍老阳与老阴之比约为 3:1（朱熹《易学启蒙》「阳三而阴一」），硬币法则是 1:1 对称。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(['dayan', 'coin'] as const).map((m) => (
            <div key={m} className="paper-panel border-4 border-bagua-fiber bg-bagua-surface p-5">
              <div className="font-display text-base tracking-widest text-bagua-primary">
                {METHOD_LABEL[m]}
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-4xl tracking-wider">
                  {moving[m].ratio?.toFixed(2) ?? '—'}
                </span>
                <span className="font-body text-sm text-bagua-muted">
                  老阳 : 老阴（观测比{m === 'dayan' ? '，理论 3:1' : '，理论 1:1'}）
                </span>
              </div>
              <dl className="mt-4 space-y-2 font-body text-sm">
                <div className="flex justify-between">
                  <dt className="text-bagua-muted">老阳率 P(9)</dt>
                  <dd>{pct(moving[m].movingYangRate)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-bagua-muted">老阴率 P(6)</dt>
                  <dd>{pct(moving[m].movingYinRate)}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 全卦不变量 ===== */}
      <section className="mt-14 cv-auto cis-s">
        <h2 className="font-display text-sm tracking-[0.24em] text-bagua-primary">
          全卦层面 · 两法相同的不变量
        </h2>
        <p className="prose-body mt-3 max-w-3xl text-bagua-muted">
          由单爻分布解析推出：两法的静卦率（六爻皆不变）、期望动爻数与本卦（变前）阳爻率分别相同，
          「换算法改运气」并无数学依据。
        </p>
        <div className="paper-panel mt-6 overflow-x-auto p-4">
          <table className="w-full min-w-[28rem] border-collapse text-center">
            <thead>
              <tr className="border-b-4 border-bagua-text font-display text-xs tracking-widest text-bagua-muted">
                <th className="py-2">指标</th>
                <th className="py-2">硬币法</th>
                <th className="py-2">大衍筮法</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-bagua-fiber">
                <td className="py-2 font-body text-sm text-bagua-muted">每爻变爻率</td>
                <td className="py-2 font-display text-sm">{pct(inv.coin.pMovingPerLine)}</td>
                <td className="py-2 font-display text-sm">{pct(inv.dayan.pMovingPerLine)}</td>
              </tr>
              <tr className="border-b border-bagua-fiber">
                <td className="py-2 font-body text-sm text-bagua-muted">本卦阳爻率（变前）</td>
                <td className="py-2 font-display text-sm">{pct(inv.coin.pYangPerLine)}</td>
                <td className="py-2 font-display text-sm">{pct(inv.dayan.pYangPerLine)}</td>
              </tr>
              <tr className="border-b border-bagua-fiber">
                <td className="py-2 font-body text-sm text-bagua-muted">静卦率（理论）</td>
                <td className="py-2 font-display text-sm">{pct(inv.coin.staticHexagramRate)}</td>
                <td className="py-2 font-display text-sm">{pct(inv.dayan.staticHexagramRate)}</td>
              </tr>
              <tr>
                <td className="py-2 font-body text-sm text-bagua-muted">期望动爻数（理论）</td>
                <td className="py-2 font-display text-sm">
                  {inv.coin.expectedMovingLines.toFixed(2)}
                </td>
                <td className="py-2 font-display text-sm">
                  {inv.dayan.expectedMovingLines.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="prose-body mt-4 text-xs text-bagua-muted">
          说明：模拟采用 mulberry32 固定种子（{SEED}），同一构建内结果可重放；
          单测（tests/unit/probability-lab.test.ts）以同口径校验两法 χ² 均低于临界值；
          本页展示的是构建期样本，不是实时抽样。
        </p>
      </section>
    </main>
  )
}
