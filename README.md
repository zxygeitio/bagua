# bagua · 易经占卜

`bagua` 是一款基于 Next.js 14 的现代易经探索工具，将传统卦象资料、起卦算法与简洁的数字化界面结合，帮助用户以更直观的方式了解六十四卦。

## 在线体验

无需安装，打开 [bagua 在线体验](https://bagua-1lq.pages.dev) 即可使用。

## 项目亮点

- **六十四卦资料**：收录卦辞、彖传、大象传、六爻爻辞与小象传。
- **硬币起卦**：采用三枚铜钱六掷，规则透明，适合作为统一的六爻起卦入口。
- **五种卦变关系**：展示本卦、之卦、互卦、错卦与综卦，辅助理解卦象之间的联系。
- **现代场景启示**：为卦象补充易于理解的现代语境解读。
- **本地优先**：占卜记录和偏好可保存在浏览器本地；配置 Supabase 后可启用历史同步与分享功能。
- **响应式界面**：适配桌面、平板和手机等常见屏幕尺寸。

## 技术栈

- **框架**：Next.js 14（App Router、静态导出）
- **语言**：TypeScript 5.6（严格模式、`noUncheckedIndexedAccess`）
- **样式**：Tailwind CSS 3.4（自定义设计系统）
- **状态管理**：Zustand 4.5（含 `localStorage` 持久化）
- **数据验证**：Zod 3.23
- **测试**：Vitest 2.1、fast-check 3.23
- **云同步**：Supabase（可选）
- **部署**：Cloudflare Pages

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看应用。

常用校验和构建命令：

```bash
# 校验六十四卦数据
npm run build:data

# 运行单元测试
npm test

# TypeScript 类型检查
npm run typecheck

# 生产构建，生成 out/ 静态文件
npm run build
```

如需启用 Supabase 云同步，请参考 [`.env.example`](.env.example) 配置环境变量。

## 页面与目录

```
bagua/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── hexagrams/         # 64卦浏览 + 详情
│   ├── divine/            # 起卦
│   ├── result/            # 占卜结果（通过查询参数读取结果）
│   ├── history/           # 历史记录
│   ├── learn/             # 入门指南
│   ├── share/             # 分享结果
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

## 核心算法

### 起卦方法

| 方法 | 复杂度 | 概率分布 | 适用场景 |
|------|--------|---------|---------|
| 硬币法 | O(6) | 少阳37.5%/少阴37.5%/老阳12.5%/老阴12.5% | 日常快速占卜 |

硬币法约定：字面记 3，背面记 2；三枚硬币之和为 6、7、8、9，分别对应老阴、少阳、少阴、老阳。六爻按初爻到上爻自下而上记录，6 和 9 为动爻。

### 卦变关系

- **本卦 (ben)**：起卦得到的原卦
- **之卦 (bian)**：变爻后形成的新卦
- **互卦 (hu)**：取 2-3-4 爻为下、3-4-5 爻为上
- **错卦 (dui)**：阴阳全反（对合）
- **综卦 (zong)**：上下颠倒（对合）

卦变关系中的数学不变量已通过 fast-check 属性测试验证。

## 数据来源

主要参考：
- [Frank2333333/iching64](https://github.com/Frank2333333/iching64)（卦象结构）
- [tiredcows/tired_cows_progect](https://github.com/tiredcows/tired_cows_progect)（维基文库爬虫）
- [godcong/yi](https://github.com/godcong/yi)（算法参考）

所有六十四卦数据都会经过 Zod schema、跨字段关系校验和业务断言检查。

## 许可与声明

本项目原创代码采用 [Apache License 2.0](LICENSE) 开源。第三方依赖、数据与字体资源可能受其各自许可协议约束，请以对应项目的原始说明为准。

本项目用于传统文化学习与个人参考，卦象内容不构成医疗、法律、财务或其他专业建议。
