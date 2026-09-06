# Bagua — 易经占卜 Web 应用 设计文档 v2

| 项目 | 信息 |
|------|------|
| **代号** | bagua |
| **版本** | v2.0 (基于多智能体评审 + GitHub第二轮侦查后调整) |
| **日期** | 2026-09-06 |
| **状态** | 设计完成，待审阅 |
| **技术栈** | Next.js 14 (SSG) + TypeScript + Tailwind CSS + Framer Motion + Zustand |

---

## 0. v2 调整摘要（相对 v1 的关键变更）

| 章节 | 变更 | 原因 |
|------|------|------|
| §5.1 技术栈 | **移除** TanStack Query；Next.js 14 加 `output: 'export'` | 无远程API场景过度设计；全静态化简化心智 |
| §5.2 目录 | **新增** `src/repositories/`、`src/services/`、`src/lib/qigua/` | 解耦 Store 与 localStorage；编排逻辑集中 |
| §6.1 八卦 | **不变** | - |
| §6.2.1 硬币 | **不变** | - |
| §6.2.2 蓍草 | **修正**：基数 50 → 49；明确 18 变推导 | v1 算法错误 |
| §6.4 概率分布 | **修正**：少阳 7/16、少阴 5/16、老阳 3/16、老阴 1/16 | v1 描述错误 |
| §6.5 数据源 | **重写**：tiredcows 维基文库版为主源 + wangxb96 补全 | Frank2333333 无 LICENSE 且缺用九用六 |
| §7 schema | **扩展**：增加 palace/scenarios/interpretationPack 等字段 | 易学评审建议 |
| §8.3 起卦页 | **改**：渐进式披露（硬币法为主CTA） | UX 评审建议 |
| §8.4 卦象详情 | **改**：径向关系图（仅结果页保留5 Tab） | UX 评审建议 |
| §9 测试 | **强化**：增加 fast-check 属性测试 + Monte Carlo | 算法评审建议 |
| §10 时间表 | **重排**：10天→15天（加 Phase 0 内容预生产） | 实施评审 |

---

## 1. 背景与目标

### 1.1 背景

易经作为中华文明的源头经典，距今已有三千余年历史。GitHub 上虽有不少易经相关开源项目，但调研发现：
- **Frank2333333/iching64**（TypeScript，最相关）：缺用九/用六、无LICENSE、无十翼扩展
- **godcong/yi**（Go，MIT）：完整六维卦变但无经文原文
- **OlleMattsson/yijing-ts**：4年未维护，无64卦语义数据
- **mikhael28/i-ching**：UI/UX优秀，但本地化不足

缺少一款**数据完整、逻辑精确、视觉精美**的精品 Web 应用。

### 1.2 目标

打造 `bagua`：
- **数据完整**：四源投票校验，64卦 + 384爻 + 用九用六 + 386小象（完整十翼结构）
- **逻辑精确**：硬币/蓍草/手动三种起卦，与 godcong/yi 交叉验证
- **视觉精美**：复刻参考图米黄底色 + 紫绿橙点缀 + 玻璃拟态 + 柔阴影
- **架构清晰**：Repository + Service 双层抽象，未来可扩展云同步

### 1.3 非目标

- ❌ AI 动态解读（100% 静态预生成）
- ❌ 语音朗读
- ❌ 多语言（仅中文）
- ❌ 用户账号 / 后端服务
- ❌ 占卜结果云端同步（架构预留）

---

## 2. 用户与场景

### 2.1 目标用户

| 群体 | 需求 | 优先级 |
|------|------|-------|
| 易经爱好者 | 学习研究、查阅卦辞爻辞 | P0 |
| 寻求指引者 | 占卜问事、获得启发 | P0 |
| 文化传播者 | 演示易经文化、分享 | P1 |

### 2.2 关键场景

1. **学习**：浏览 64 卦网格 → 点击 → 查看完整卦辞/爻辞/卦变关系
2. **占卜**：首页 → 一键起卦 → 获得本卦 + 变爻 + 解读
3. **回顾**：历史记录 → 重温占卜详情
4. **深入**：从本卦切换到错卦/综卦/互卦/之卦

---

## 3. 功能架构

### 3.1 功能矩阵

| 模块 | 功能 | 优先级 |
|------|------|-------|
| 首页 | 品牌展示 + 双入口 + 特性 | P0 |
| 64 卦浏览 | 网格 + 搜索 + 筛选 | P0 |
| 卦象详情 | 径向关系图（本卦居中 + 4变卦环绕） | P0 |
| 起卦 | 单一CTA + 进阶切换（硬币/蓍草/手动） | P0 |
| 占卜结果 | 本卦 + 变爻 + 解读 + 建议 | P0 |
| 本地历史 | 起卦记录、收藏、笔记 | P1 |
| 高质量解读 | 9大场景 × 64 卦 预置解读 | P0 |

### 3.2 路由

```
/                     首页
/hexagrams            64 卦浏览
/hexagrams/[id]       卦象详情（径向关系图）
/divine               起卦（渐进式披露）
/result/[id]          占卜结果（5 Tab 卦变切换）
/history              历史记录
/settings             设置
```

---

## 4. 视觉与交互设计

### 4.1 设计系统

| Token | Hex | 用途 |
|-------|-----|------|
| `bg-canvas` | `#FBF8F0` | 主背景（米黄） |
| `bg-surface` | `#FFFFFF` | 卡片 |
| `primary` | `#6366F1` | 浏览卦象 |
| `secondary` | `#10B981` | 起卦 |
| `accent` | `#F59E0B` | 强调 |
| `text-primary` | `#1F2937` | 主文本 |

字体：`Noto Serif SC`（标题）+ `Ma Shan Zheng`（卦名）+ `Inter`（正文）

### 4.2 起卦页：渐进式披露

```
┌─────────────────────────────────────┐
│  问询主题（可选）                       │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║   🎲 快速起卦（约 10 秒）       ║  │  ← 主 CTA（硬币法）
│  ╚═══════════════════════════════╝  │
│                                     │
│  ───────── 想更深入？ ─────────       │
│                                     │
│  蓍草揲占（传统，~3 分钟）              │  ← 次级链接
│  手动选卦（学习模式）                    │  ← 次级链接
└─────────────────────────────────────┘
```

### 4.3 卦象详情：径向关系图（浏览场景）

```
                    错卦
                ☷坤为地
                   │
                   │
   之卦 ───────── 本卦 ───────── 综卦
   ☴                ☰              ☳
  风天小畜        乾为天         天泽履

                   │
                   │
                  互卦
                  ☶☶ 山地剥
```

### 4.4 占卜结果：5 Tab（占卜场景）

- Tab 1：本卦
- Tab 2：之卦（变卦）
- Tab 3：互卦
- Tab 4：错卦
- Tab 5：综卦

---

## 5. 技术架构

### 5.1 技术栈（v2 调整）

| 层 | 技术 | 备注 |
|----|------|------|
| 框架 | Next.js 14 + `output: 'export'` | 全静态化 SSG |
| 语言 | TypeScript 5.x | - |
| 样式 | Tailwind CSS 3.x | - |
| 动画 | Framer Motion 11 | 按路由 lazy load |
| 状态 | Zustand 4.x | 注入 Repository |
| 数据 | 编译时打包 + IndexedDB | 无远程 API |
| 测试 | Vitest + fast-check + Playwright | - |
| 部署 | Vercel (静态托管) | - |

**移除**：TanStack Query（无远程数据源）

### 5.2 目录结构（v2）

```
bagua/
├── app/                              # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                      # 首页
│   ├── globals.css
│   ├── hexagrams/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── divine/page.tsx
│   ├── result/[id]/page.tsx
│   ├── history/page.tsx
│   └── settings/page.tsx
│
├── src/
│   ├── components/                   # UI 组件
│   │   ├── ui/                       # shadcn 基础
│   │   ├── hexagram/                 # 卦象组件
│   │   ├── line/                     # 爻组件
│   │   ├── cast/                     # 起卦组件
│   │   └── shared/
│   │
│   ├── lib/
│   │   ├── iching/                   # 卦象数据 + 卦变（只读）
│   │   │   ├── data/
│   │   │   │   ├── hexagrams.json    # 64 卦完整数据
│   │   │   ├── trigrams.ts           # 八卦编码
│   │   │   └── interpretations/      # 解读内容库
│   │   ├── qigua/                    # 起卦算法（独立模块）
│   │   │   ├── types.ts
│   │   │   ├── bagua.ts
│   │   │   ├── rng.ts                # 可重放 PRNG
│   │   │   ├── coin.ts               # 硬币法
│   │   │   ├── dayan.ts              # 蓍草法
│   │   │   ├── meihua.ts             # 梅花易数
│   │   │   ├── manual.ts             # 手动选卦
│   │   │   ├── time.ts               # 时间起卦
│   │   │   └── transform.ts          # 之/互/错/综
│   │   └── utils/
│   │
│   ├── repositories/                 # 数据持久化抽象
│   │   ├── CastRecordRepository.ts   # 接口
│   │   └── LocalStorageRepository.ts # 默认实现
│   │
│   ├── services/                     # 跨域编排
│   │   ├── divination.service.ts     # 占卜编排
│   │   └── history.service.ts
│   │
│   ├── store/
│   │   ├── history.ts                # 注入 Repository
│   │   ├── settings.ts
│   │   └── divine.ts
│   │
│   ├── hooks/
│   ├── types/
│   ├── styles/
│   └── config/
│
├── scripts/
│   └── build-iching-data.ts          # 数据迁移脚本（Phase 0）
│
├── tests/
│   ├── unit/                         # Vitest
│   ├── property/                     # fast-check 属性测试
│   └── e2e/                          # Playwright
│
├── public/
│   ├── fonts/
│   └── sounds/
│
└── docs/
    ├── DESIGN.md
    ├── ARCHITECTURE.md
    └── superpowers/
        ├── specs/
        └── plans/
```

---

## 6. 核心算法

### 6.1 八卦编码

```
八卦（从下到上读爻）：
  乾 ☰  111 = 7
  兑 ☱  110 = 6
  离 ☲  101 = 5
  震 ☳  100 = 4
  巽 ☴  011 = 3
  坎 ☵  010 = 2
  艮 ☶  001 = 1
  坤 ☷  000 = 0
```

### 6.2 起卦算法（v2 修正）

#### 6.2.1 硬币法

```typescript
// 每轮投 3 枚硬币（字=3，背=2）
// 6 = 老阴 ⚋→⚊  7 = 少阳 ⚊
// 8 = 少阴 ⚋       9 = 老阳 ⚊→⚋
function castCoins(rng: () => number = Math.random): Line[] {
  const lines: Line[] = [];
  for (let i = 0; i < 6; i++) {
    const sum = [flip(rng), flip(rng), flip(rng)].reduce((a, b) => a + b, 0);
    lines.push(createLine(sum));
  }
  return lines.reverse(); // 从初爻到上爻
}
```

#### 6.2.2 蓍草法（v2 修正：49 基数）

```typescript
// 大衍之数五十，其用四十有九（先扣除太极一根作为不变之象）
// 每爻 18 变（3 次"分二、挂一、揲四、归奇"）
// 余数 24 = 老阳 (9) → 阳变阴
// 余数 28 = 少阴 (8)
// 余数 32 = 少阳 (7)
// 余数 36 = 老阴 (6) → 阴变阳

function castYarrow(rng: () => number = Math.random): Line[] {
  const lines: Line[] = [];
  for (let i = 0; i < 6; i++) {
    let stalks = 49; // ⚠️ 49，不是 50
    for (let j = 0; j < 3; j++) {
      const left = randomInt(rng, 1, stalks - 1);
      const right = stalks - left;
      const leftMod = left % 4 || 4;
      const rightMod = right % 4 || 4;
      stalks -= leftMod + rightMod + 1; // 减去左余+右余+挂一
    }
    lines.push(createLine(stalksRemapped(stalks)));
  }
  return lines.reverse();
}

function stalksRemapped(stalks: number): number {
  return stalks === 24 ? 9 : stalks === 28 ? 8 : stalks === 32 ? 7 : 6;
}
```

#### 6.2.3 手动选卦

```typescript
function castManual(upper: TrigramName, lower: TrigramName, changingPosition?: number): Line[] {
  const upperLines = trigramToLines(upper);
  const lowerLines = trigramToLines(lower);
  const allLines = [...lowerLines, ...upperLines];
  if (changingPosition) allLines[changingPosition - 1].isChanging = true;
  return allLines;
}
```

### 6.3 概率分布（v2 修正）

**硬币法**（独立 3 硬币，每枚独立）：
- 6（老阴）= 1/8 = 12.5%
- 7（少阳）= 3/8 = 37.5%
- 8（少阴）= 3/8 = 37.5%
- 9（老阳）= 1/8 = 12.5%

**蓍草法**（理论，1次三变）：
- 少阳 7/16 = 43.75%
- 少阴 5/16 = 31.25%
- 老阳 3/16 = 18.75%
- 老阴 1/16 = 6.25%

### 6.4 卦变关系

```typescript
// 错卦（阴阳全反）
function getDuiGua(hexagram: Gua): Gua {
  // 每爻阴阳互换
  return buildHexagram(hexagram.yaos.map(y => ({
    ...y, yinYang: y.yinYang === 'yang' ? 'yin' : 'yang'
  })));
}

// 综卦（上下颠倒，爻位倒序）
function getZongGua(hexagram: Gua): Gua {
  return buildHexagram([...hexagram.yaos].reverse());
}

// 互卦（取 2-3-4 为下，3-4-5 为上）
function getHuGua(hexagram: Gua): Gua {
  const lower = [hexagram.yaos[1], hexagram.yaos[2], hexagram.yaos[3]];
  const upper = [hexagram.yaos[2], hexagram.yaos[3], hexagram.yaos[4]];
  return buildHexagram([...lower, ...upper]);
}

// 之卦（本卦变爻→新卦）
function getBianGua(lines: Line[]): Gua {
  const newLines = lines.map(l => ({
    ...l,
    yinYang: l.isChanging ? (l.yinYang === 'yang' ? 'yin' : 'yang') : l.yinYang,
    isChanging: false,
  }));
  return buildHexagram(newLines);
}
```

### 6.5 卦变不变式（必须测试）

```typescript
// 数学不变量
- getDuiGua(getDuiGua(x)) === x         // 错卦对合
- getZongGua(getZongGua(x)) === x       // 综卦对合
- getBianGua(getBianGua(lines)) === ben  // 之卦对合
- 错卦 + 综卦 = 原卦（互逆）              // 数学定理

// 全枚举（64 × 6 = 384 个变爻位置）
- 所有 (本卦, 变爻位) → 之卦 的 golden 测试
```

### 6.6 数据源（v2 重写）

**主源**：[tiredcows 维基文库版](https://github.com/tiredcows/tired_cows_progect)（MIT）
- 64/64 卦经文 + binary 键索引 + `yong_jiu`/`yong_liu` 独立字段
- 386 条小象结构完整

**补全源**：[wangxb96/Classical-Chinese-Text-Dataset](https://github.com/wangxb96/Classical-Chinese-Text-Dataset)（无 LICENSE，需联系）
- 补全主源 5 卦（10/12/13/25/29）共 35 处破损

**辅助校验源**：
- Frank2333333/iching64（无LICENSE，仅复用其 `duiGua/zongGua/huGua/guaBian/wuxing/pronunciation` 元数据）
- john-walks-slow/open-iching（提供交叉投票）

**白话解读**：[sunls2/zhouyi](https://github.com/sunls2/zhouyi)（62★，64×~20KB Markdown）

**现代启示**：原创（LLM 草稿 + 人工精修 + 易学顾问三审）

### 6.7 数据校对流程

```
Phase 1 归一化（opencc t2s + 繁简映射 + 标点剥离 + 异体字映射）
Phase 2 四源投票（91.9% 一致自动采信 / 6.8% 抽查 / 1.3% 人工）
Phase 3 启动期 Zod 校验（含跨字段断言）
Phase 4 Canary 测试（"见龙在田"等高频易错点回归哨兵）
Phase 5 字段溯源（{value, source, confidence, variants[]} 留痕）
```

**预期人工校对量**：31/384 条爻辞（约 1 下午）+ 64 条 modernInsight（原创）

---

## 7. 数据模型（v2 扩展）

### 7.1 Gua（卦）

```typescript
interface Gua {
  id: 1 | 2 | ... | 64;
  name: string;            // 卦名（乾为天）
  chineseName: string;     // 简称（乾）
  pronunciation: string;   // 拼音（qián）
  guaci: string;           // 卦辞
  tuanZhuan: string;       // 彖传
  daXiangZhuan: string;    // 大象传
  xiangTuan?: string;      // 象传彖（可选）
  wenYan?: string;         // 文言（乾坤专属）
  yaos: Yao[];             // 6 爻
  shangGua: TrigramName;   // 上卦
  xiaGua: TrigramName;     // 下卦
  duiGua: number;          // 错卦 ID
  zongGua: number;         // 综卦 ID
  huGua: number;           // 互卦 ID
  guaBian: number[];       // 之卦链
  wuxing: WuXing;          // 五行
  palace: number;          // 京房八宫卦序（1-8）
  palaceOrder: number;     // 八宫内序（1-8）
  shiYao: number;          // 世爻位（1-6）
  yingYao: number;         // 应爻位（1-6）
  categoryTags: string[];  // 分类标签（如["事业","感情"]）
  keywords: string[];      // 关键词（如["刚健","创始"]）
  scenarios: Scenario[];   // 适用场景
  interpretationPack: InterpretationPack;
  fuGua?: number;          // 伏卦（纳甲隐藏之卦）
  symbol: string;          // Unicode 卦象符号
  meaning: string;         // 象征意义
  modernInsight: string;   // 现代启示
  metadata: SourceMetadata;
}

type WuXing = '金' | '木' | '水' | '火' | '土';
type TrigramName = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';

type Scenario = 'career' | 'wealth' | 'relationship' | 'health' | 'study' | 'family' | 'decision' | 'crisis' | 'self';

interface SourceMetadata {
  primary: string;          // 主源 ID
  sources: string[];        // 所有引用源
  confidence: number;       // 0-1
  variants?: Record<string, string[]>; // 真异文（如"己日/巳日"）
}
```

### 7.2 Yao（爻）

```typescript
interface Yao {
  position: 1 | 2 | 3 | 4 | 5 | 6;
  yinYang: 'yang' | 'yin';
  text: string;             // 爻辞
  xiangZhuan: string;       // 小象传
  tianGan?: string;         // 纳甲天干
  diZhi?: string;           // 纳甲地支
  wuXing?: WuXing;          // 纳甲五行
  sixRelations?: SixRelation; // 六亲（父母/兄弟/子孙/妻财/官鬼）
  shiStatus?: '当位' | '不当位' | '中和';
  isChanging?: boolean;     // 变爻标记（运行时）
}

type SixRelation = '父母' | '兄弟' | '子孙' | '妻财' | '官鬼';
```

### 7.3 InterpretationPack

```typescript
interface InterpretationPack {
  // 9 大场景全覆盖
  byScenario: Record<Scenario, ScenarioInterpretation>;
  // 综合解读
  overall: string;
  // 关键提示
  keywords: string[];
  // 行动建议（数组化）
  advice: string[];
  // 注意事项
  warnings: string[];
}

interface ScenarioInterpretation {
  summary: string;          // 一句话总结
  judgment: string;         // 卦辞白话
  image: string;            // 象传白话
  lineInterprets: LineInterpret[];
  structural: StructuralAnalysis;
  modernAdvice: string;     // 该场景下的现代建议
}

interface StructuralAnalysis {
  dangWei: number[];        // 当位之爻
  buDangWei: number[];      // 不当位之爻
  zhongZheng: number[];     // 中正之爻（居二五）
  chengYing: number[];      // 承乘比应关系
  he: { position: number; partner: number; type: string }[]; // 六合
}
```

### 7.4 CastResult

```typescript
interface CastResult {
  id: string;               // uuid
  timestamp: number;
  method: 'coins' | 'yarrow' | 'manual';
  question?: string;
  lines: Line[];
  benGuaId: number;
  bianGuaId?: number;
  huGuaId?: number;
  changingLinePositions: number[];
}
```

---

## 8. 状态管理与持久化

### 8.1 Repository 抽象层

```typescript
interface CastRecordRepository {
  getAll(): Promise<CastRecord[]>;
  save(record: CastRecord): Promise<void>;
  delete(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<void>;
  updateNotes(id: string, notes: string): Promise<void>;
}

class LocalStorageRepository implements CastRecordRepository {
  // 默认实现，封装 zustand persist
}

class InMemoryRepository implements CastRecordRepository {
  // 测试用
}

// Store 注入 Repository
const useHistoryStore = create<HistoryStore>((set, get) => ({
  repository: new LocalStorageRepository(),
  records: [],
  addRecord: async (record) => {
    await get().repository.save(record);
    set({ records: [...get().records, record] });
  },
}));
```

### 8.2 Service 层

```typescript
// src/services/divination.service.ts
export async function performDivination(
  method: CastMethod,
  question?: string,
  options?: { manualUpper?: TrigramName; manualLower?: TrigramName }
): Promise<CastResult> {
  // 1. 调用 qigua 生成 lines
  const lines = await runCastMethod(method, options);
  // 2. 构建本卦
  const benGua = buildHexagram(lines);
  // 3. 计算卦变
  const bianGua = hasChanging(lines) ? getBianGua(lines) : undefined;
  const huGua = getHuGua(benGua);
  // 4. 生成解读
  const interpretation = generateInterpretation(benGua, bianGua, lines, question);
  // 5. 持久化
  const record: CastRecord = { id: uuid(), timestamp: Date.now(), method, question, lines, benGuaId: benGua.id, ... };
  return record;
}
```

---

## 9. 测试策略

### 9.1 测试金字塔

```
        E2E（Playwright）       关键用户流程 5 场景
       /
      属性测试（fast-check）    卦变不变式 1000+ 随机
     /
    单元测试（Vitest）        核心逻辑 95%
```

### 9.2 关键测试

**单元测试**：
```typescript
describe('trigram', () => {
  test('八卦编码正确');
  test('爻数组转八卦正确');
});

describe('qigua/coin', () => {
  test('6 爻全部生成');
  test('10000 次随机分布：6/7/8/9 各占 12.5%/37.5%/37.5%/12.5%');
});

describe('qigua/dayan', () => {
  test('18 变后剩余 24/28/32/36 之一');
  test('10000 次 Monte Carlo 分布接近 1/16, 5/16, 7/16, 3/16');
});

describe('qigua/transform', () => {
  test('错卦对合：getDuiGua(getDuiGua(x)) === x');
  test('综卦对合：getZongGua(getZongGua(x)) === x');
  test('之卦对合：变爻再变爻恢复');
  test('64×6 全枚举 golden 表');
});

describe('hexagram data', () => {
  test('64 卦完整');
  test('卦辞/彖传/大象 各 64 条非空');
  test('爻辞 == 384 + 用九用六 == 2，小象 == 386');
  test('yong_jiu 仅存于卦1, yong_liu 仅存于卦2');
  test('无字段匹配 /提取失败|TODO|N\/A|null/');
  test('每卦 binary id 六位且 64 个唯一');
  test('binary popcount 与 yinYang 序列一致');
});
```

**属性测试**（fast-check）：
```typescript
fc.assert(
  fc.property(fc.integer({ min: 1, max: 64 }), (guaId) => {
    const gua = getGuaById(guaId);
    return getDuiGua(getDuiGua(gua)).id === gua.id;
  })
);
```

**Canary 测试**（高频易错点回归哨兵）：
```typescript
test('见龙在田（不是"见龙再田"）', () => {
  const yao = getGuaById(1).yaos[1]; // 乾九二
  expect(yao.text).toBe('见龙在田，利见大人。');
});
```

**E2E**：
1. 首页 → 起卦 → 查看结果
2. 浏览 64 卦 → 查看详情
3. 历史记录保存与查看
4. 卦变关系切换（结果页5 Tab）
5. 搜索卦象

---

## 10. 实施阶段（v2：15 天）

### Phase 0：内容预生产（3 天）

- [ ] 64 卦 modernInsight LLM 草稿生成（每卦 ~800 字，共 ~5 万字）
- [ ] 数据迁移脚本 `scripts/build-iching-data.ts`
  - 从 tiredcows 维基文库抓取主数据
  - 归一化（繁简、标点、异体字）
  - 四源投票
  - 输出 `src/lib/iching/data/hexagrams.json`
- [ ] 启动期 Zod 校验脚本
- [ ] 单元测试：数据完整性

### Phase 1：算法底座（3 天）

- [ ] `src/lib/qigua/types.ts` - 枚举与类型
- [ ] `src/lib/qigua/rng.ts` - mulberry32 PRNG
- [ ] `src/lib/qigua/bagua.ts` - 八卦编码
- [ ] `src/lib/qigua/coin.ts` - 硬币法
- [ ] `src/lib/qigua/dayan.ts` - 蓍草法（修正版）
- [ ] `src/lib/qigua/manual.ts` - 手动选卦
- [ ] `src/lib/qigua/transform.ts` - 卦变（之/互/错/综）
- [ ] `src/lib/iching/data/hexagrams.json` 接入
- [ ] `src/lib/iching/interpetations/` 解读内容库
- [ ] 10000 次 Monte Carlo 分布测试
- [ ] fast-check 属性测试
- [ ] 64×6 全枚举 golden 测试

### Phase 2：UI 骨架（3 天）

- [ ] Repository 层 `src/repositories/`
- [ ] Service 层 `src/services/divination.service.ts`
- [ ] Zustand stores（注入 Repository）
- [ ] 设计系统 tokens
- [ ] 首页（hero + 双入口 + 特性）
- [ ] 64 卦网格浏览（响应式列数 + 先天方阵排序 + 搜索）
- [ ] 卦象详情页（径向关系图）
- [ ] 起卦页（渐进式披露）
- [ ] 占卜结果页（5 Tab）
- [ ] 历史记录页

### Phase 3：仪式感 + 解读（3 天）

- [ ] `react-countdown-circle-timer` 蓍草仪式
- [ ] 硬币 3D 翻转动画（CSS `transform: rotateY`）
- [ ] SVG 卦象组件（Unicode 优先 + SVG 工厂 fallback）
- [ ] 爻变动画（`scaleX` + `clip-path`）
- [ ] 解读 Pipeline（场景识别 → 模板拼装 → 变爻注入）
- [ ] 移动端响应式优化
- [ ] 中文字体子集化（glyphhanger）

### Phase 4：集成测试 + 部署（3 天）

- [ ] E2E 测试（Playwright 5 场景）
- [ ] CI/CD（GitHub Actions）
- [ ] Lighthouse 优化（首屏 JS < 100KB gzipped）
- [ ] Vercel 部署（静态托管）
- [ ] 中文 SEO 元数据
- [ ] 无障碍（a11y）优化

---

## 11. 质量门禁

### 提交前

- TypeScript: 0 errors
- ESLint: 0 errors
- 单元测试: 100% pass
- 核心 lib 覆盖率: ≥95%

### 合并前

- 所有单测 + 属性测试 pass
- E2E 关键流程 pass
- 代码 review 通过
- Bundle size < 200KB gzipped（首页）
- Lighthouse: 性能 > 90, 可访问性 > 95

---

## 12. 风险与缓解（v2 更新）

| # | 风险 | 等级 | 缓解 |
|---|------|------|------|
| 1 | **无 LICENSE 数据源的法律风险**（wangxb96/Frank2333333/sunls2） | 🔴 高 | 发 issue 请求加 MIT/CC0；同时以 tiredcows 为基底，破损处从维基文库（CC BY-SA 4.0）自抓 |
| 2 | **modernInsight 内容生产延期**（5万字原创） | 🟡 中 | 严格 Phase 0 时间盒；LLM prompt 约束风格；先 P0 级，其他卦占位 |
| 3 | **蓍草法用户流失**（162 秒仪式） | 🟡 中 | 三档模式（庄重/标准/象征）；节点进度提示；"我已知结果"快速通道（强制 ≥30 秒） |
| 4 | **中文字体加载阻塞首屏** | 🟡 中 | glyphhanger 子集化；`font-display: swap`；正文系统字体兜底 |
| 5 | **卦变算法 bug** | 🔴 高 | 64×6 全枚举 golden 测试 + fast-check 属性测试 + 与 godcong/yi 抽样对比 |

---

## 13. 交付物

### 代码
- Next.js 完整应用源码
- 64 卦 JSON 数据
- 核心算法库（含测试）
- UI 组件库

### 文档
- README.md
- DESIGN.md（设计文档）
- ARCHITECTURE.md（架构说明）
- 本设计文档 v2

### 部署
- Vercel 部署链接
- GitHub Actions CI/CD

---

## 附录 A：参考资源

### 核心参考（已确认）
| 项目 | URL | 用途 |
|------|-----|------|
| tiredcows/tired_cows_progect | GitHub | 64 卦主数据源（MIT） |
| godcong/yi | GitHub | 算法参考（MIT） |
| wangxb96/Classical-Chinese-Text-Dataset | GitHub | 数据补全源 |
| mikhael28/i-ching | GitHub | UI/UX 参考 |
| dvberkel/svghexagrams | GitHub | SVG 卦象 |
| oxarbitrage/hermetica | GitHub | SVG path 模板 |
| sunls2/zhouyi | GitHub | 白话解读参考 |

### 历史参考（不推荐直接依赖）
- Frank2333333/iching64（无LICENSE，仅元数据参考）
- OlleMattsson/yijing-ts（4年未维护）

---

## 附录 B：术语对照

| 中文 | 英文 | 含义 |
|------|------|------|
| 卦 | hexagram / gua | 6 爻 |
| 爻 | line / yao | 卦基本单位 |
| 经卦 / 八卦 | trigram | 3 爻 |
| 别卦 / 六十四卦 | hexagram | 上下两经卦 |
| 卦辞 | judgment | 整卦判断辞 |
| 爻辞 | line text | 单爻吉凶辞 |
| 彖传 | Tuan commentary | 解释卦辞 |
| 象传 | Xiang commentary | 解释卦象、爻象 |
| 文言 | Wenyan | 乾坤专属 |
| 用九/用六 | Yong jiu/liu | 乾/坤特有用爻 |
| 错卦 | opposite hexagram | 阴阳全反 |
| 综卦 | reverse hexagram | 上下颠倒 |
| 互卦 | nuclear hexagram | 取中间四爻 |
| 之卦 / 变卦 | changed hexagram | 变爻后形成 |
| 蓍草 | yarrow stalks | 起卦工具 |
| 揲占 | yarrow divination | 用蓍草起卦 |
| 揲 | die | 蓍草分堆计算 |
| 纳甲 | na-jia | 天干地支装配 |
| 六亲 | six relations | 父母/兄弟/子孙/妻财/官鬼 |
| 世应 | shi-ying | 卦中主客爻 |
| 当位 | dang-wei | 阴居阴位、阳居阳位 |

---

**文档版本**：v2.0
**变更记录**：v1→v2 基于多智能体评审 + GitHub 第二轮侦查结果调整
**下次审阅**：Phase 0 开始前最终确认
