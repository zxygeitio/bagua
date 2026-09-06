#!/usr/bin/env tsx
/**
 * 64卦数据完整性校验脚本
 * 用法: npm run build:data 或 tsx scripts/validate-data.ts
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { HexagramsSchema, validateHexagramRelationships } from '../src/lib/iching/schemas'

const DATA_PATH = resolve(__dirname, '../src/lib/iching/data/hexagrams.json')

function main() {
  console.log('🔍 64卦数据校验开始...')
  const raw = JSON.parse(readFileSync(DATA_PATH, 'utf-8'))

  // 1. Zod schema 校验
  const parseResult = HexagramsSchema.safeParse(raw)
  if (!parseResult.success) {
    console.error('❌ Zod schema 校验失败:')
    console.error(parseResult.error.format())
    process.exit(1)
  }
  const hexagrams = parseResult.data
  console.log(`✅ Zod schema 校验通过 (${hexagrams.length} 卦)`)

  // 2. 跨字段关系校验
  const relCheck = validateHexagramRelationships(hexagrams)
  if (!relCheck.valid) {
    console.error('❌ 关系校验失败:')
    relCheck.errors.forEach(e => console.error('  -', e))
    process.exit(1)
  }
  console.log('✅ 卦变关系引用全部有效')

  // 3. 业务断言
  const assertions = [
    { name: '64卦完整', pass: hexagrams.length === 64 },
    { name: '卦辞全部非空', pass: hexagrams.every(g => g.guaci.length >= 2) },
    { name: '彖传全部非空', pass: hexagrams.every(g => g.tuanZhuan.length >= 2) },
    { name: '大象传全部非空', pass: hexagrams.every(g => g.daXiangZhuan.length >= 2) },
    { name: '每卦6爻完整', pass: hexagrams.every(g => g.yaos.length === 6) },
    { name: '爻辞384条', pass: hexagrams.every(g => g.yaos.every(y => y.text.length >= 2)) },
    { name: '小象传完整', pass: hexagrams.every(g => g.yaos.every(y => y.xiangZhuan.length >= 2)) },
    { name: 'ID唯一性', pass: new Set(hexagrams.map(g => g.id)).size === 64 },
    { name: '卦ID连续1-64', pass: hexagrams.every(g => g.id >= 1 && g.id <= 64) },
  ]

  // Canary 测试
  const qian = hexagrams[0]
  const qian2 = qian?.yaos[1]
  if (!qian2) {
    console.error('❌ 卦1缺失')
    process.exit(1)
  }
  assertions.push({ name: 'Canary: 见龙在田（非"再田"）', pass: qian2.text.includes('见龙在田') && !qian2.text.includes('见龙再') })

  let failed = 0
  for (const a of assertions) {
    console.log(`${a.pass ? '✅' : '❌'} ${a.name}`)
    if (!a.pass) failed++
  }

  if (failed > 0) {
    console.error(`\n❌ ${failed} 项校验失败`)
    process.exit(1)
  }
  console.log(`\n🎉 64卦数据校验全部通过！`)
}

main()