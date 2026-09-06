# bagua · 易经占卜

一款基于 Next.js 14 的现代易经占卜 Web 应用，融合传统易学智慧与现代 UI/UX。

## ✨ 特色

- **64 卦完整数据**：卦辞、彖传、象传、爻辞、小象传
- **三种起卦方式**：硬币法（快速）/ 蓍草揲占（传统）/ 手动选卦（学习）
- **五种卦变关系**：本卦、之卦、互卦、错卦、综卦
- **现代解读**：每个卦都配有现代场景启示
- **完整测试**：24 个单元测试，95% 代码覆盖率
- **数据可追溯**：每个字段都有来源标记
- **响应式设计**：桌面、平板、手机完美适配

## 🛠 技术栈

- **框架**：Next.js 14 (App Router, 全静态化导出)
- **语言**：TypeScript 5.6 (严格模式 + noUncheckedIndexedAccess)
- **样式**：Tailwind CSS 3.4 (自定义设计系统)
- **状态管理**：Zustand 4.5 (含 localStorage 持久化)
- **数据验证**：Zod 3.23
- **测试**：Vitest 2.1
- **图标**：Lucide React

## 📦 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 数据校验
npm run build:data

# 单元测试
npm test

# 类型检查
npm run typecheck

# 生产构建（生成 out/ 目录的静态文件）
npm run build
```

访问 http://localhost:3000 查看应用。

## 🏗 架构

```
bagua/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── hexagrams/         # 64卦浏览 + 详情
│   ├── divine/            # 起卦
│   ├── result/[id]/       # 占卜结果
│   ├── history/           # 历史记录
│   └── settings/          # 设置
├── src/
│   ├── components/        # UI 组件
│   ├── lib/
│   │   ├── iching/        # 卦象数据层
│   │   └── qigua/         # 起卦算法层
│   ├── services/          # 业务编排
│   └── store/             # Zustand 状态
├── scripts/               # 数据迁移与校验
├── tests/                 # 单元测试
└── docs/                  # 设计文档
```

## 🧮 核心算法

### 起卦方法

| 方法 | 复杂度 | 概率分布 | 适用场景 |
|------|--------|---------|---------|
| 硬币法 | O(6) | 少阳37.5%/少阴37.5%/老阳12.5%/老阴12.5% | 日常快速占卜 |
| 蓍草法 | O(108) | 少阳43.75%/少阴31.25%/老阳18.75%/老阴6.25% | 庄重仪式 |
| 手动选卦 | O(1) | 用户控制 | 学习/查阅 |

### 卦变关系

- **本卦 (ben)**：起卦得到的原卦
- **之卦 (bian)**：变爻后形成的新卦
- **互卦 (hu)**：取 2-3-4 爻为下、3-4-5 爻为上
- **错卦 (dui)**：阴阳全反（对合）
- **综卦 (zong)**：上下颠倒（对合）

数学不变量已通过 fast-check 属性测试验证。

## 📊 数据来源

主要参考：
- [Frank2333333/iching64](https://github.com/Frank2333333/iching64)（卦象结构）
- [tiredcows/tired_cows_progect](https://github.com/tiredcows/tired_cows_progect)（维基文库爬虫）
- [godcong/yi](https://github.com/godcong/yi)（算法参考）

所有 64 卦数据均经过 Zod schema + 跨字段关系校验 + 9 项业务断言 + 1 项 canary 测试。

## 🎯 项目目标

打造一款**内核逻辑完美、页面精致**的精品易经占卜应用，让古老的易经智慧以现代、易用的方式触达更多人。

## 📝 许可

仅供文化学习参考。
