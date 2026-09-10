import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/app': resolve(__dirname, './app'),
    },
  },
  test: {
    // 纯逻辑单测默认走 node 环境（启动快 ~30 倍）；仅 DOM 依赖文件单独指定 happy-dom
    environment: 'node',
    environmentMatchGlobs: [['tests/unit/identity.test.ts', 'happy-dom']],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts', 'src/repositories/**/*.ts', 'src/services/**/*.ts'],
      // 纯类型声明文件（0 可执行行）与外部环境胶水不计入算法层覆盖率
      exclude: ['src/lib/iching/data/**', 'src/lib/**/types.ts'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
})
