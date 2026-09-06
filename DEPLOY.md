# Cloudflare Pages 部署指南

## 🎯 项目状态

✅ **Next.js 14 全静态化** - 已生成 73 个静态页面（5.3MB）  
✅ **GitHub 仓库** - 已推送到 `zxygeitio/bagua`  
✅ **wrangler.toml** - 部署配置已就绪  
✅ **无需后端** - 纯静态 + localStorage，无需 API/数据库

---

## 🚀 方式 A：Dashboard 部署（推荐，3分钟）

适合：首次部署、UI 偏好、一次性推送

### 步骤

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 左侧菜单 → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

2. **连接 GitHub 仓库**
   - 选择 `zxygeitio/bagua`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (默认)
   - **Environment variables**: 无需设置（纯静态）

3. **首次部署**
   - 点击 **Save and Deploy**
   - 等待 1-2 分钟构建完成
   - 获得 `https://bagua.pages.dev` URL（可绑定自定义域名）

### 后续自动部署
- 每次 push 到 main 分支 → 自动重新构建部署
- 在 Pages 项目 → **Deployments** 可查看历史

---

## 🔧 方式 B：CLI 部署（适合自动化）

适合：CI/CD、批量部署、本地脚本

### 前置：创建 API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token** → **Custom token** → **Get started**
3. 设置：
   - **Token name**: `bagua-deploy`
   - **Permissions**: `Account` → `Cloudflare Pages: Edit`
   - **Account Resources**: 你的账户
4. 点击 **Continue to summary** → **Create Token**
5. **复制 Token**（只显示一次！）

### 获取 Account ID

1. 访问 https://dash.cloudflare.com/
2. 右侧栏底部 → **Account ID**（点击复制）

### 本地部署

```bash
# 在项目根目录
cd D:\workspace\bagua

# 创建 .env（不要提交到 git！）
cp .env.example .env
# 编辑 .env，填入：
#   CLOUDFLARE_API_TOKEN=你的token
#   CLOUDFLARE_ACCOUNT_ID=你的account_id

# 加载环境变量并部署（Git Bash / WSL）
set -a; source .env; set +a
npx wrangler pages deploy out --project-name=bagua --commit-dirty=true
```

或在 PowerShell 中：

```powershell
$env:CLOUDFLARE_API_TOKEN="你的token"
$env:CLOUDFLARE_ACCOUNT_ID="你的account_id"
npx wrangler pages deploy out --project-name=bagua --commit-dirty=true
```

预期输出：
```
✨ Success! Uploaded 73 files (5.3 MB)
🌎 Deploying...
✨ Deployment complete!
🔗 https://bagua.pages.dev
```

---

## 🌐 绑定自定义域名（可选）

### 在 Cloudflare Pages Dashboard：

1. 项目 → **Custom domains** → **Set up a custom domain**
2. 输入域名（如 `bagua.example.com`）
3. Cloudflare 自动配置 DNS（如果域名已在 Cloudflare）
4. 等待 SSL 证书签发（通常 < 1 分钟）

---

## ✅ 部署后验证

部署完成后访问 `https://bagua.pages.dev`，应看到：

- 首页加载（米黄底色 + 双入口卡片）
- `/hexagrams` 显示 64 卦网格
- `/hexagrams/1` 显示乾为天详情
- `/divine` 起卦功能
- 浏览器 Console 无报错
- localStorage 历史记录保存正常

### Lighthouse 评分目标

- Performance > 90
- Accessibility > 95
- Best Practices > 95
- SEO > 90

---

## 🐛 故障排查

| 问题 | 解决方案 |
|------|---------|
| 构建失败：找不到 `out/` | 确认 `next.config.js` 含 `output: 'export'`，先 `npm run build` |
| 部署失败：403 | 检查 Token 权限含 `Pages: Edit` |
| 部署失败：404 on routes | Next.js SSG 已生成静态 HTML，无需 Functions |
| 字体不显示 | 检查 `next/font` 是否在 `output: 'export'` 下兼容 |
| 客户端 `useState` 不工作 | 确认页面带 `'use client'`（如 `/divine`、`/history`）|

---

## 🔄 后续更新

```bash
# 修改代码后
git add .
git commit -m "feat: 新功能"
git push origin main

# Dashboard 方式：自动触发部署
# CLI 方式：
npx wrangler pages deploy out --project-name=bagua
```
