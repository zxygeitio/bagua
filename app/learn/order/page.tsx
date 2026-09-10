import type { Metadata } from 'next'
import Link from 'next/link'

import { HexagramSymbol } from '@/components/hexagram/HexagramSymbol'
import { hexagramCodeTable, kingwenPairs, XIANTIAN_TABLE } from '@/lib/iching/order-structure'

export const metadata: Metadata = {
  title: '卦序结构',
  description: '文王卦序的三十二对配对结构、先天八卦二进制与六十四卦编码总表。',
}

export default function OrderPage() {
  const pairs = kingwenPairs()
  const codes = hexagramCodeTable()
  const symmetricCount = pairs.filter((p) => p.symmetric).length

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="enter-up font-display text-4xl tracking-[0.16em] md:text-5xl">卦序结构</h1>
      <p className="prose-body mt-3 max-w-3xl text-bagua-muted">
        六十四卦不是散落的目录：文王序中每两卦结成一对，或互为综卦（上下颠倒），
        或互为错卦（阴阳全反）；八卦又各有二进制编码。这一页把这两个结构摊开来看。
      </p>

      {/* ===== 文王卦序配对 ===== */}
      <section className="mt-12 cv-auto cis-m">
        <h2 className="font-display text-sm tracking-[0.24em] text-bagua-primary">
          文王卦序 · 三十二对
        </h2>
        <p className="prose-body mt-3 max-w-3xl text-bagua-muted">
          文王序中奇数位卦之后紧随其综卦（上下颠倒之卦）；上下颠倒不变的
          {symmetricCount} 个对称卦，则与其错卦（阴阳全反之卦）配对——
          乾坤、颐大过、坎离、中孚小过。结构依据见{' '}
          <Link href="/learn#references" className="draw-underline text-bagua-primary">
            参考文献 R8
          </Link>
          （Knuth, TAOCP §7.2.1.7）。
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {pairs.map((pair) => (
            <div
              key={pair.a.id}
              className={`paper-panel cv-auto cis-xs flex items-center gap-3 p-3 ${
                pair.symmetric ? 'border-bagua-primary' : ''
              }`}
            >
              <Link
                href={`/hexagrams/${pair.a.id}`}
                prefetch={false}
                className="flex flex-1 items-center gap-2"
              >
                <HexagramSymbol gua={pair.a} size="sm" />
                <span className="font-display text-xs tracking-wider">{pair.a.chineseName}</span>
              </Link>
              <span
                className={`flex-shrink-0 border-2 px-1 py-0.5 font-display text-[9px] tracking-widest ${
                  pair.symmetric
                    ? 'border-bagua-primary bg-bagua-primary text-bagua-surface'
                    : 'border-bagua-text text-bagua-muted'
                }`}
                title={pair.symmetric ? '对称卦，配错卦（阴阳全反）' : '上下颠倒为对方'}
              >
                {pair.type}
              </span>
              <Link
                href={`/hexagrams/${pair.b.id}`}
                prefetch={false}
                className="flex flex-1 items-center gap-2"
              >
                <HexagramSymbol gua={pair.b} size="sm" />
                <span className="font-display text-xs tracking-wider">{pair.b.chineseName}</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 先天八卦二进制 ===== */}
      <section className="mt-14 cv-auto cis-s">
        <h2 className="font-display text-sm tracking-[0.24em] text-bagua-primary">
          先天八卦 · 二进制
        </h2>
        <p className="prose-body mt-3 max-w-3xl text-bagua-muted">
          初爻为最高位、自下而上读：乾 111、兑 110、离 101、震 100、巽 011、坎 010、艮 001、坤
          000。卦位传为伏羲所作（传统归属），取象《说卦传》「天地定位，山泽通气」。
        </p>
        <div className="paper-panel mt-6 overflow-x-auto p-4">
          <table className="w-full min-w-[32rem] border-collapse text-center">
            <thead>
              <tr className="border-b-4 border-bagua-text font-display text-xs tracking-widest text-bagua-muted">
                <th className="py-2">卦</th>
                <th className="py-2">符号</th>
                <th className="py-2">二进制</th>
                <th className="py-2">数值</th>
                <th className="py-2">先天方位</th>
              </tr>
            </thead>
            <tbody>
              {XIANTIAN_TABLE.map((row) => (
                <tr key={row.name} className="border-b border-bagua-fiber">
                  <td className="py-2 font-display text-sm tracking-widest">{row.name}</td>
                  <td className="py-2 text-2xl leading-none text-bagua-text">{row.symbol}</td>
                  <td className="py-2 font-display text-sm tracking-[0.3em] text-bagua-primary">
                    {row.binary}
                  </td>
                  <td className="py-2 font-display text-sm">{row.value}</td>
                  <td className="py-2 font-body text-sm text-bagua-muted">{row.direction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== 64 卦编码总表 ===== */}
      <section className="mt-14 cv-auto cis-m">
        <h2 className="font-display text-sm tracking-[0.24em] text-bagua-primary">
          六十四卦 · 编码总表
        </h2>
        <p className="prose-body mt-3 max-w-3xl text-bagua-muted">
          按文王序排列；六位二进制由下卦三位接上卦三位组成（初爻为最高位）。
        </p>
        <div className="mt-6 grid grid-cols-2 gap-px border-4 border-bagua-text bg-bagua-text md:grid-cols-4">
          {codes.map(({ gua, binary, value }) => (
            <Link
              key={gua.id}
              href={`/hexagrams/${gua.id}`}
              prefetch={false}
              className="cv-auto cis-xs flex items-center justify-between gap-3 bg-bagua-canvas px-3 py-2 transition hover:bg-bagua-surface"
            >
              <span className="font-display text-[10px] text-bagua-muted">
                {gua.id.toString().padStart(2, '0')}
              </span>
              <span className="font-display text-xs tracking-widest">{gua.chineseName}</span>
              <span className="font-display text-[11px] tracking-[0.25em] text-bagua-primary">
                {binary}
              </span>
              <span className="font-display text-[10px] text-bagua-muted">{value}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
