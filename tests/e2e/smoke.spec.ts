import { test, expect } from '@playwright/test'

/**
 * 主链路冒烟：起卦 → 结果 → 历史
 */

test('首页渲染且提供起卦入口', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: /开始起卦|起卦/ }).first()).toBeVisible()
})

test('起卦 → 结果 → 历史主链路', async ({ page }) => {
  // 关闭起卦动画以加速（bagua-settings.showAnimation = false）
  await page.goto('/divine')
  await page.evaluate(() => {
    localStorage.setItem('bagua-settings', JSON.stringify({ showAnimation: false }))
  })

  await expect(page.getByRole('heading', { name: '起卦', exact: true })).toBeVisible()
  await page.getByRole('button', { name: /开始起卦/ }).click()

  // 等待跳转结果页
  await page.waitForURL(/\/result\?id=.+/, { timeout: 30_000 })
  await expect(page).toHaveURL(/\/result\?id=/)

  // 结果页应呈现朱熹判读与本卦名
  await expect(page.getByText('朱熹判读')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText(/本卦|卦名|为天|为地/).first()).toBeVisible()

  // 前往历史页，应能看到 1 条记录（而非空态）
  await page.goto('/history')
  await expect(page.getByRole('heading', { name: '历史记录' })).toBeVisible()
  await expect(page.getByText('暂无起卦记录')).toBeHidden()
})

test('历史页空态可正常渲染', async ({ page }) => {
  await page.goto('/history')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByRole('heading', { name: '历史记录' })).toBeVisible()
  await expect(page.getByText('暂无起卦记录')).toBeVisible()
})

test('易学页与六十四卦页可达', async ({ page }) => {
  await page.goto('/learn')
  await expect(page.getByRole('heading', { name: '易学入门' })).toBeVisible()
  // 滚动触发 Reveal 动画后再断言章节标题
  await page.getByRole('heading', { name: '八卦总览' }).scrollIntoViewIfNeeded()
  await expect(page.getByRole('heading', { name: '八卦总览' })).toBeVisible()

  await page.goto('/hexagrams')
  await expect(page.getByRole('heading', { name: '六十四卦' })).toBeVisible()
  await expect(page.getByText('共 64 卦')).toBeVisible()
})
