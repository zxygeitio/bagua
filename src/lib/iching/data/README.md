# 卦象数据

- `hexagrams.json`: 64 卦完整数据。**当前为占位空数组 `[]`**,实际数据由 A2 agent 从根目录 `guaxiang.ts` 转换生成。
- 校验方式: `npm run build:data`(使用 `src/lib/iching/schemas.ts` 的 `HexagramsSchema` + `validateHexagramRelationships`)。
