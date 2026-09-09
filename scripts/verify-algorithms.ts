#!/usr/bin/env tsx
/**
 * 算法独立验证脚本
 * 验证硬币法和文王卦序映射的正确性
 */
import { castCoins } from '../src/lib/qigua/cast/coin'
import { buildHexagram } from '../src/lib/qigua/builder'

console.log('═══════════════════════════════════════════════════════════════')
console.log('           算法独立验证')
console.log('═══════════════════════════════════════════════════════════════\n')

// 1. 硬币法分布
const cCounts = { 6: 0, 7: 0, 8: 0, 9: 0 }
const RUNS = 10000
for (let i = 0; i < RUNS; i++) {
  const lines = castCoins()
  for (const l of lines) cCounts[l.value as 6 | 7 | 8 | 9]++
}
const cTotal = RUNS * 6
console.log(`【硬币法】 ${RUNS} 次 = ${cTotal} 爻 分布:`)
console.log(`  6 (老阴): ${((cCounts[6] / cTotal) * 100).toFixed(2)}% (期望 12.5%)`)
console.log(`  7 (少阳): ${((cCounts[7] / cTotal) * 100).toFixed(2)}% (期望 37.5%)`)
console.log(`  8 (少阴): ${((cCounts[8] / cTotal) * 100).toFixed(2)}% (期望 37.5%)`)
console.log(`  9 (老阳): ${((cCounts[9] / cTotal) * 100).toFixed(2)}% (期望 12.5%)\n`)

// 2. 文王卦序正确性
console.log('【文王卦序】 边界卦验证:')
const allYang = Array.from({ length: 6 }, (_, i) => ({
  position: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
  yinYang: 'yang' as const,
  isChanging: false,
  value: 7 as 6 | 7 | 8 | 9,
}))
const allYin = Array.from({ length: 6 }, (_, i) => ({
  position: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
  yinYang: 'yin' as const,
  isChanging: false,
  value: 8 as 6 | 7 | 8 | 9,
}))

const qian = buildHexagram(allYang)
const kun = buildHexagram(allYin)
console.log(
  `  全阳 → ID=${qian.id} ${qian.gua.name} (期望 ID=1 乾为天) ${qian.id === 1 ? '✅' : '❌'}`,
)
console.log(
  `  全阴 → ID=${kun.id} ${kun.gua.name} (期望 ID=2 坤为地) ${kun.id === 2 ? '✅' : '❌'}`,
)

// 3. 64 卦覆盖率（基于 10000 个种子）
console.log('\n【卦象覆盖】 10000 种子起卦覆盖率:')
const seen = new Set<string>()
const idMap = new Map<number, number>()
for (let seed = 1; seed <= 10000; seed++) {
  // 用 mulberry32 替代 Math.random
  let a = seed | 0
  const rng = () => {
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const lines = castCoins(rng)
  const { id } = buildHexagram(lines)
  seen.add(lines.map((l) => (l.yinYang === 'yang' ? '1' : '0')).join(''))
  idMap.set(id, (idMap.get(id) || 0) + 1)
}
console.log(`  不重复卦象: ${seen.size} / 64`)
console.log(
  `  分布最广的卦: ID=${[...idMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]} (出现 ${[...idMap.values()].sort((a, b) => b - a)[0]} 次)`,
)

console.log('\n═══════════════════════════════════════════════════════════════')
console.log('✅ 算法验证完成')
console.log('═══════════════════════════════════════════════════════════════')
