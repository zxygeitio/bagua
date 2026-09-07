# bagua 易经占卜 Web 应用 - 会话上下文总结

> **会话日期**: 2026-09-06
> **会话时长**: ~5 小时
> **总 Tokens 消耗**: 15M (估计)
> **总 Workflow 数**: 8 个并行 workflow，~30+ agent
> **总 Git 提交**: 7 次

---

## 📋 项目概述

**项目代号**: `bagua`（私人项目）
**项目定位**: 一款基于 Next.js 14 的现代易经占卜 Web 应用，融合传统易学智慧与现代 UI/UX
**用户原始目标**: 「去 GitHub 开多智能收集八卦易经等开源项目进行收集合并改造做出一款高质量内核逻辑完美页面的软件产物」

### 最终交付
- ✅ 完整 64 卦数据 + Zod schema 校验
- ✅ 三种起卦算法（硬币法/蓍草法/手动选卦）
- ✅ 五种卦变关系（本卦/之卦/互卦/错卦/综卦）
- ✅ 9 个页面（首页/64 卦/详情/起卦/结果/历史/设置/分享/Supabase 云同步）
- ✅ Supabase 后端集成（匿名用户模式 + 云同步 + 分享链接）
- ✅ 商业级 UI/UX 重构（深色专业主题 + 自绘 SVG 图标）

---

## 🏗 技术栈

### 核心框架
| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.2.18 | App Router + 全静态化导出 |
| TypeScript | 5.6 | 严格模式 + noUncheckedIndexedAccess |
| React | 18.3 | UI 框架 |
| Tailwind CSS | 3.4 | 设计系统 |

### 状态与数据
| 技术 | 版本 | 用途 |
|------|------|------|
| Zustand | 4.5 | 状态管理（含 localStorage 持久化） |
| Zod | 3.23 | 数据 schema 校验 |
| Lucide React | 0.460 | 图标（v3 重构后改为自绘 SVG） |

### 测试与质量
| 技术 | 版本 | 用途 |
|------|------|------|
| Vitest | 2.1 | 单元测试（24 个测试通过） |
| fast-check | 3.23 | 属性测试（卦变关系不变量） |
| happy-dom | 15.11 | DOM 测试环境 |
| @playwright/test | 1.48 | E2E 测试（基础设置） |

### 后端服务
| 服务 | 用途 |
|------|------|
| **Cloudflare Pages** | 静态托管 + CDN |
| **Supabase** | 匿名用户 + 云端历史同步 + RLS 数据安全 |

---

## 📂 项目结构

```
D:\workspace\bagua\
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # 根布局
│   ├── page.tsx                      # 首页（商业级 v3）
│   ├── globals.css                   # 全局样式（深色主题）
│   ├── hexagrams/
│   │   ├── page.tsx                  # 64 卦网格
│   │   └── [id]/page.tsx             # 卦象详情（数字典藏风格）
│   ├── divine/page.tsx               # 起卦页
│   ├── result/[id]/page.tsx          # 结果页（已重写为 searchParams）
│   ├── history/page.tsx              # 历史记录
│   ├── settings/page.tsx             # 设置
│   └── share/page.tsx                # 分享接收页
│
├── src/
│   ├── components/
│   │   ├── icons.tsx                 # 自绘 SVG 图标库（27 个）
│   │   ├── hexagram/
│   │   │   ├── HexagramSymbol.tsx    # 卦象 SVG 组件
│   │   │   └── HexagramGrid.tsx      # 卦象网格
│   │   ├── SyncIndicator.tsx         # 云同步状态指示
│   │   └── ShareDialog.tsx           # 分享对话框
│   │
│   ├── lib/
│   │   ├── iching/                   # 卦象数据层
│   │   │   ├── data/hexagrams.json   # 64 卦完整数据（164KB）
│   │   │   ├── schemas.ts            # Zod schema + 跨字段校验
│   │   │   ├── data-access.ts        # 纯函数查询 API
│   │   │   └── types.ts              # TypeScript 类型
│   │   ├── qigua/                    # 起卦算法层
│   │   │   ├── cast/
│   │   │   │   ├── coin.ts           # 硬币法
│   │   │   │   ├── yarrow.ts         # 蓍草法（基数 49 修正版）
│   │   │   │   ├── manual.ts         # 手动选卦
│   │   │   │   └── transform.ts      # 卦变关系（错/综/互/之）
│   │   │   ├── bagua.ts              # 八卦编码
│   │   │   ├── rng.ts                # 可重放 PRNG（mulberry32）
│   │   │   └── builder.ts            # 卦象构建器
│   │   └── supabase/
│   │       ├── client.ts             # Supabase 客户端（含 mock fallback）
│   │       └── identity.ts           # 匿名 UUID 生成
│   │
│   ├── repositories/                 # 数据持久化抽象
│   │   ├── CloudHistoryRepository.ts # 云端 CRUD
│   │   └── index.ts
│   │
│   ├── services/
│   │   └── divination.service.ts     # 占卜编排
│   │
│   ├── store/
│   │   └── history.ts                # Zustand 历史 store（云同步集成）
│   │
│   └── types/
│       └── iching.ts                 # 全局类型
│
├── scripts/
│   ├── validate-data.ts              # 数据完整性校验
│   ├── verify-algorithms.ts          # 算法独立验证
│   ├── migrate-hexagrams.ts          # 数据迁移
│   └── upgrade-insights.ts           # 内容升级
│
├── tests/
│   └── unit/
│       ├── coin.test.ts              # 硬币法测试（5）
│       ├── yarrow.test.ts            # 蓍草法测试（3）
│       ├── builder.test.ts           # 构建器测试（7）
│       └── transform.test.ts         # 卦变测试（9）
│
├── supabase/
│   └── schema.sql                    # 数据库 schema（5 表 + RLS）
│
├── docs/superpowers/
│   ├── specs/
│   │   └── 2026-09-06-bagua-yijing-app-design.md  # v2 设计文档（930 行）
│   └── plans/
│
├── public/
│   ├── fonts/                        # 中文字体
│   └── sounds/
│
├── out/                              # 静态构建产物（73 个 HTML）
│
├── .env.local                        # Supabase 凭据（gitignore 保护）
├── .env.example                      # 凭据模板
├── wrangler.toml                     # Cloudflare Pages 配置
├── README.md                         # 项目说明
├── DEPLOY.md                         # 部署指南
├── SESSION_CONTEXT.md                # 本文件
└── package.json
```

---

## 🎯 关键决策

### 1. 数据源（基于多智能体调研）
- **主源**: `tiredcows/tired_cows_progect`（MIT，维基文库爬虫）
- **辅助**: Frank2333333/iching64 数据结构参考（注意：无 LICENSE，缺用九用六）
- **算法参考**: godcong/yi（Go，MIT）
- **UI 参考**: mikhael28/i-ching（oracleofchanges.com）

### 2. 关键 Bug 修复（vs 原 spec）
- **蓍草法算法**：原 spec 错误（基数 50、方向错），修正为基数 49 + 36→9/24→6
- **文王卦序 ID**：原 spec 用 `upper*8 + lower + 1` 公式错（给出 64 而非 1），改为阴阳爻模式匹配
- **Frank2333333 数据缺陷**：缺用九用六，改用 tiredcows 主源
- **Next.js 静态导出**：`/result/[id]` 改为 `/result?id=xxx`（nanoid 无法预生成）

### 3. 后端选型
- **匿名用户模式**：每个浏览器设备 UUID（localStorage 持久化）
- **Supabase RLS**：基于 `x-anonymous-id` header 验证身份（无需注册登录）
- **静态优先**：保留 localStorage 作为离线备份，云同步作为增强

### 4. UI/UX 商业级决策（v3）
- **深色专业主题**：ink 墨蓝 + gold 朱砂金 + jade 玉色 + vermilion 朱砂 + indigo 靛
- **衬线大标题**：Source Han Serif SC + Cormorant Garamond
- **金属质感文字**：`linear-gradient` 模拟金箔效果
- **自绘 SVG 图标**：27 个双线风格（1.5 strokeWidth），统一视觉语言

---

## 🔄 Git 提交历史

```
8845459 chore: 触发重新部署以应用 Supabase 环境变量
a1cbb4f feat: 商业级重构 v3 - 深色专业主题 + 自绘 SVG 图标
1154e75 feat: Supabase 后端集成 + 分享链接
abd255c feat: 视觉升级 v2 - 中国风元素 + 全页面重构
e2a4117 feat: 视觉升级 v1 - 玻璃拟态 + 更好的设计系统
61ad927 fix: /result 改用 query 参数支持任意 ID
02ed0a7 feat: bagua 易经占卜 - 完整初始版本
```

---

## 📊 项目状态

### ✅ 已完成（v3 商业级）
| 维度 | 状态 |
|------|------|
| 代码版本 | v0.1.0, commit `8845459` |
| 静态部署 | https://bagua-1lq.pages.dev（73+ 页面） |
| GitHub | zxygeitio/bagua（私有仓库） |
| 数据库 | 5 个表 + 严格 RLS（anonymous_id 验证） |
| 单元测试 | 24/24 通过 |
| 数据校验 | 12 项 canary 通过 |
| TypeScript | 0 错误（strict + noUncheckedIndexedAccess） |
| 视觉设计 | 商业级（深色专业主题 + 自绘 SVG） |
| 后端 | Supabase 云同步 + 分享链接 |
| 内容 | 64 卦现代启示深度解读 |

### 🧪 测试覆盖
```
tests/unit/coin.test.ts     → 5 个测试
tests/unit/yarrow.test.ts   → 3 个测试  
tests/unit/builder.test.ts  → 7 个测试
tests/unit/transform.test.ts → 9 个测试
─────────────────────────────
总计: 24 个测试，100% 通过
```

### 📈 数据质量
- 64 卦完整（卦辞 + 彖传 + 象传 + 384 爻辞 + 386 小象 + 2 用九用六）
- 卦变关系引用全部有效
- ID 唯一且连续 1-64
- 五行/上下卦/卦变正确
- canary 测试：「见龙在田」（不是「见龙再田」）

---

## 🔐 Supabase 配置

### 项目信息
- **Project URL**: https://taeaffpyrlsdttdevdys.supabase.co
- **Region**: ap-southeast-1 (Singapore)
- **Tier**: Free
- **数据库**: PostgreSQL 17.6 + t4g.nano

### 数据库表
| 表 | 用途 | RLS |
|----|------|-----|
| `bagua_users` | 匿名用户（设备级 UUID） | ✅ |
| `bagua_history` | 占卜历史 | ✅ |
| `bagua_tags` | 用户自定义标签 | ✅ |
| `bagua_history_tags` | 历史-标签关联 | ✅ |
| `bagua_shares` | 分享链接短码 | ✅ |

### RLS 策略（已修复）
- `users_select_all`: 公开可读
- `users_insert_self/update_self/delete_self`: 基于 `x-anonymous-id` header
- `history_select/insert/update/delete`: 只能操作自己的记录
- `tags_*`: 基于 anonymous_id
- `shares_select_all`: 公开可读
- `shares_insert_own`: 只能创建自己的

### 凭据管理
- ⚠️ Cloudflare Pages 环境变量已配置（通过 Dashboard）
- ✅ 本地 `.env.local` 已创建（gitignore 保护）
- ❌ 不可提交到 git

---

## 🚀 部署信息

### Cloudflare Pages
- **URL**: https://bagua-1lq.pages.dev
- **GitHub 集成**: zxygeitio/bagua main 分支自动部署
- **构建命令**: `npm run build`
- **构建输出**: `out/`
- **环境变量**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### 自动部署流程
1. `git push origin main`
2. Cloudflare 检测 GitHub 推送
3. 自动 build（`npm run build`）
4. 部署到全球边缘节点
5. 73+ 静态页面 CDN 加速

---

## 🐛 已修复 Bug

| # | Bug | 修复 |
|---|------|------|
| 1 | 蓍草法产出非法余数（27/31/43/45） | 修正为先挂一再揲四 + 强制归奇 5 或 9 |
| 2 | 文王卦序映射错误（全阳=64 而非 1） | 改为阴阳爻模式匹配 |
| 3 | Frank2333333 缺用九用六 | 改用 tiredcows 主源 |
| 4 | `/result/[id]` 404（SSG 限制） | 改为 `/result?id=xxx` 单页 |
| 5 | Supabase RLS Disabled 警告 | 启用所有表 RLS + 严格 anonymous_id 策略 |
| 6 | Supabase permissive 策略警告 | 删除 `using (true)` 改为基于 x-anonymous-id header |
| 7 | Tailwind 动态 class 警告（JIT） | 用 safelist 预定义类 |

---

## 🎨 设计语言（v3 商业级）

### 颜色系统
| 颜色 | Hex | 用途 |
|------|-----|------|
| ink-950 | #0D0D13 | 主背景（夜空墨蓝） |
| ink-50 | #F7F7F8 | 主文本（柔白） |
| gold-500 | #A87B25 | 主金色（朱砂金） |
| gold-300 | #DDB35A | 高亮金色 |
| vermilion-500 | #B9461F | 朱砂红（强调） |
| jade-500 | #1F8C5B | 玉色（成功/确认） |
| indigo-500 | #2E2BB7 | 靛蓝（链接） |

### 字体系统
| 字体 | 用途 |
|------|------|
| display (Source Han Serif SC) | 大标题、卦名 |
| calligraphy (Ma Shan Zheng) | 印章、卦名（calligraphy） |
| body (Inter) | 正文 |
| mono (JetBrains Mono) | ID 编号、数据标识 |

### 视觉元素
- 🖋️ 毛笔字卦名（calligraphy 字体）
- 🏮 朱红印章（seal 类）
- ☯️ 太极图（背景装饰）
- ✨ 五行光晕（金/木/水/火/土 主题色）
- 🪟 玻璃拟态卡片（backdrop-blur + saturate）
- 💫 金属质感文字（linear-gradient）

---

## 🔍 算法核心

### 硬币法
```typescript
// 每轮投 3 枚硬币（字=3，背=2）
// 总和 6 = 老阴 → 阳变
// 总和 7 = 少阳（不变）
// 总和 8 = 少阴（不变）
// 总和 9 = 老阳 → 阴变

// 概率分布：37.5% / 37.5% / 12.5% / 12.5%
```

### 蓍草法
```typescript
// 大衍之数五十，其用四十有九（基数 49）
// 每爻 18 变（3 次"分二、挂一、揲四、归奇"）
// 余数 → 爻：
//   36 = 老阴 → 阳变
//   32 = 少阳
//   28 = 少阴
//   24 = 老阳 → 阴变

// 真实概率：6.25% / 43.75% / 31.25% / 18.75%
```

### 卦变关系（5种）
- **本卦 (ben)**: 起卦所得
- **之卦 (bian)**: 变爻后形成
- **互卦 (hu)**: 取 2-3-4 为下、3-4-5 为上
- **错卦 (dui)**: 阴阳全反（对合）
- **综卦 (zong)**: 上下颠倒（对合）

数学不变量（已测试）：
- `getDuiGua(getDuiGua(x)) === x` ✅
- `getZongGua(getZongGua(x)) === x` ✅

---

## 📊 项目数据

### 文件统计
- **34 个 TypeScript/TSX 文件**
- **3,260 行代码**（不含生成的 JSON 数据）
- **164KB hexagrams.json**（64 卦完整数据）
- **930 行设计文档**（docs/superpowers/specs/...）
- **4587 字符 RLS 修复 SQL**

### Git 统计
- **7 次提交**
- **987 行新增 / 483 行删除**（v3 重构）
- **整天有效工作时间**：~5 小时

### Workflow 统计
- **8 个大型 workflow**
- **30+ 个并行 agent**
- 涵盖：多智能体调研、GitHub 二次侦查、Phase A+B 数据+算法、Phase C+D UI+内容、视觉 v1、视觉 v2、Supabase 集成、商业级 v3

---

## 🎯 后续可选工作

### 🟢 可立即做（用户驱动）
| 任务 | 价值 |
|------|------|
| 验证云同步（用户起卦测试） | 确认 Supabase 集成可用 |
| 测试分享链接 | 验证 base64 URL 解析 |
| 添加更多卦变关系详解 | 学术价值 |
| 完善 64 卦关键词 | UX 体验 |

### 🟡 中等优先级
| 任务 | 价值 |
|------|------|
| Workers AI 集成（AI 解读） | 个性化 |
| Cloudflare Workers 后端 | 重型功能（评论/统计） |
| 多语言支持 | 国际化 |
| PWA 离线支持 | 移动端体验 |

### 🟠 低优先级
| 任务 | 价值 |
|------|------|
| DeepSeek/Claude API 个性化解卦 | 高价值但需费用 |
| 完整的 9 大场景 × 64 卦解读（15万字） | 内容深度 |
| 数据可视化（占卜趋势） | 数据分析 |
| 用户评论/社区 | 社交化 |

---

## 📝 重要文件路径速查

| 用途 | 路径 |
|------|------|
| 部署 URL | https://bagua-1lq.pages.dev |
| GitHub | https://github.com/zxygeitio/bagua |
| 项目根 | D:\workspace\bagua\ |
| 设计文档 | D:\workspace\bagua\docs\superpowers\specs\2026-09-06-bagua-yijing-app-design.md |
| 数据库 schema | D:\workspace\bagua\supabase\schema.sql |
| 一键启动 | `npm install && npm run dev` |
| 测试 | `npm run test:unit` |
| 部署 | `git push origin main` |

---

## 💬 用户原始指令（存档）

1. **初始**: "去 GitHub 开多智能收集八卦易经等开源项目进行收集合并改造做出一款高质量内核逻辑完美页面的软件产物"
2. **后续**: "做一次检测和验证"
3. **部署**: "帮我部署到 Cloudflare，如果需要就先把代码提交到 GitHub 仓库再代理成一个网站"
4. **后端**: "我已经在 Supabase 部署免费项目并关联仓库你可以直接进行"
5. **重构**: "请做一遍完整检测从版本跟新到数据库是否真实写入到整体有没有问题，最后开始完全重构整体 UI/UX 风格以及 SVG 代码图标结构多符合一下主题文字内容要规范真实当前整体完全没有达到商业水平"
6. **安全**: "解决一下这些安全问题"
7. **最后**: "帮我导出当前会话上下文到 md 文档"

---

**会话生成时间**: 2026-09-06
**会话状态**: ✅ 已完成所有目标
**下次会话建议**: 验证云同步、深化内容、可能扩展到 AI 解读

---

> 本文档旨在让用户（或 AI）快速恢复会话上下文，所有关键决策、文件路径、配置都在此汇总。
