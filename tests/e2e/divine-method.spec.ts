import { test, expect } from '@playwright/test'

/**
 * v2.0.0 大衍筮法起卦入口：起卦页双方法可选，选择大衍后走完整起卦链路。
 */

test('起卦页双方法卡片可切换选中态', async ({ page }) => {
  await page.goto('/divine')

  const coinsCard = page.getByRole('button', { name: /硬币法/ })
  const yarrowCard = page.getByRole('button', { name: /大衍筮法/ })

  await expect(coinsCard).toBeVisible()
  await expect(yarrowCard).toBeVisible()
  await expect(coinsCard).toHaveAttribute('aria-pressed', 'true')
  await expect(yarrowCard).toHaveAttribute('aria-pressed', 'false')

  await yarrowCard.click()
  await expect(yarrowCard).toHaveAttribute('aria-pressed', 'true')
  await expect(coinsCard).toHaveAttribute('aria-pressed', 'false')
})

test('选择大衍筮法完成起卦并进入结果页', async ({ page }) => {
  await page.goto('/divine')
  await page.evaluate(() => {
    localStorage.setItem('bagua-settings', JSON.stringify({ showAnimation: false }))
  })

  await page.getByRole('button', { name: /大衍筮法/ }).click()
  await page.getByRole('button', { name: /开始起卦/ }).click()

  await page.waitForURL(/\/result\?id=.+/, { timeout: 30_000 })

  // 结果页应呈现朱熹判读与「大衍筮法」方式标注
  await expect(page.getByText('朱熹判读')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText('大衍筮法').first()).toBeVisible()

  // 历史页记录应带大衍方式
  await page.goto('/history')
  await expect(page.getByText('大衍筮法').first()).toBeVisible()
})
