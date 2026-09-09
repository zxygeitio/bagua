import { defineConfig } from '@playwright/test'

/**
 * E2E 冒烟：静态导出产物 + 零依赖静态服务器 + 系统 Chromium（跳过浏览器下载）。
 * 用法：pnpm build && pnpm test:e2e
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? '/usr/bin/chromium-browser',
          args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--headless=new'],
        },
      },
    },
  ],
  webServer: {
    command: 'node scripts/serve-static.mjs out 4174',
    port: 4174,
    reuseExistingServer: true,
    timeout: 20_000,
  },
})
