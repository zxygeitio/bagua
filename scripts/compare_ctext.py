#!/usr/bin/env python3
"""比对本地 hexagrams.json 与 ctext.org（武英殿十三经注疏本《周易正义》底本）卦页文本。

用途：B5 经文校勘抽查。输入为 fetch 工具保存的 ctext 卦页 markdown，
提取卦辞/彖传/大象/爻辞/小象/文言，与本地数据做两级比对：
  - 严格级：去标点后字符序列完全一致
  - 宽松级：仅报告差异字符对，标注是否异文/句读

用法：python3 scripts/compare_ctext.py <ctext页.md> <卦id> [...]
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEX = json.loads((ROOT / "src/lib/iching/data/hexagrams.json").read_text(encoding="utf-8"))

# ctext 行尾的英文小节标记（卦名拼音 + 冒号，或英文小节名）
TAIL_MARKERS = re.compile(r"[A-Za-z][A-Za-z ]*:\s*$")
PUNCT = "，。、；：？！“”「」『』（）《》〈〉·…"

YAO_PREFIX = re.compile(r"^(初九|初六|九二|六二|九三|六三|九四|六四|九五|六五|上九|上六|用九|用六)：")


def normalize(s: str) -> str:
    return "".join(ch for ch in s if ch not in PUNCT and not ch.isspace())


def extract_segments(md: str):
    """返回 [(label, chinese)]，label ∈ {'卦辞','彖传','大象','小象','爻辞','文言'}。"""
    out = []
    ctx = "卦辞"  # 当前语境：紧随 ䷀卦名 行的是卦辞
    pending_label = None
    for line in md.splitlines():
        line = line.strip()
        if not line:
            continue
        # 小节标题行（独立成行的「彖传:」「象传:」「文言:」，含繁体变体）
        if line in ("彖传:", "象传:", "文言:", "彖傳:", "象傳:", "文言傳:"):
            pending_label = {
                "彖传:": "彖传", "象传:": "象传", "文言:": "文言",
                "彖傳:": "彖传", "象傳:": "象传", "文言傳:": "文言",
            }[line]
            continue
        m = TAIL_MARKERS.search(line)
        if not m:
            continue
        # 该行含中文正文（排除纯链接/编号行）
        chinese_part = line[: m.start()].strip()
        if not chinese_part or not re.search(r"[\u4e00-\u9fff]", chinese_part):
            pending_label = None
            continue
        label = pending_label
        if label == "象传":
            label = "大象"  # 语境尚不确定，后续按是否在爻辞后修正
        pending_label = None
        # 判断是否爻辞行
        if YAO_PREFIX.match(chinese_part):
            label = "爻辞"
        elif label == "大象":
            pass
        elif label == "彖传":
            pass
        elif label is None:
            # 卦辞行形如「乾：元亨，利贞。」
            label = "卦辞"
        out.append((label, chinese_part))
    return out


def refine_segments(segs):
    """把「爻辞」后紧跟的「大象」判为小象。"""
    out = []
    last_yao = None
    for label, text in segs:
        if label == "爻辞":
            last_yao = YAO_PREFIX.match(text).group(1)
        elif label == "大象" and last_yao is not None:
            label = "小象"
        elif label == "卦辞":
            last_yao = None
        out.append((label, text, last_yao))
    return out


def diff_str(local, remote):
    """返回逐字符差异描述（去标点后）。"""
    if local is None:
        return "本地数据缺该字段"
    a, b = normalize(local), normalize(remote)
    if a == b:
        if local.strip() != remote.strip():
            return "句读差异"
        return None
    # 简单差异定位：找首个与最末差异
    i, j = 0, 0
    while i < len(a) and i < len(b) and a[i] == b[i]:
        i += 1
    while j < len(a) - i and j < len(b) - i and a[len(a) - 1 - j] == b[len(b) - 1 - j]:
        j += 1
    core_a, core_b = a[i : len(a) - j], b[i : len(b) - j]
    return f"异文：本地「{core_a}」↔ ctext「{core_b}」"


def compare(page_md: str, gua_id: int):
    gua = next(g for g in HEX if g["id"] == gua_id)
    segs = refine_segments(extract_segments(page_md))
    results = []
    cur_yao = None  # 当前爻位（供小象归属）
    pmap = {"初": 1, "上": 6, "二": 2, "三": 3, "四": 4, "五": 5}
    for label, text, _ in segs:
        if label == "卦辞":
            cur_yao = None
            remote = re.sub(r"^[䷀-䷿]?[^：]{1,3}：", "", text)
            results.append(("卦辞", gua["guaci"], remote))
        elif label == "彖传":
            results.append(("彖传", gua["tuanZhuan"], text))
        elif label == "大象":
            cur_yao = None
            results.append(("大象传", gua["daXiangZhuan"], text))
        elif label == "爻辞":
            m = YAO_PREFIX.match(text)
            prefix = m.group(1)
            body = text[m.end():]
            if prefix in ("用九", "用六"):
                cur_yao = None
                results.append((f"{prefix}(本地缺)", None, body))
                continue
            pos = pmap.get(prefix[0]) or pmap.get(prefix[-1])
            cur_yao = pos
            for y in gua["yaos"]:
                if y["position"] == pos:
                    results.append((f"爻辞{pos}", y["text"], body))
                    break
        elif label == "小象":
            pos = cur_yao
            if pos:
                for y in gua["yaos"]:
                    if y["position"] == pos:
                        results.append((f"小象{pos}", y["xiangZhuan"], text))
                        break
    return results


def main():
    args = sys.argv[1:]
    if not args or len(args) % 2 != 0:
        print(__doc__)
        sys.exit(2)
    total = flagged = 0
    for i in range(0, len(args), 2):
        page, gua_id = args[i], int(args[i + 1])
        md = Path(page).read_text(encoding="utf-8")
        if re.search(r"[傳於來險與]", md):
            print("  ⚠ 检测到繁体页（/zh），分段与比对以简体为准，请改抓 /zhs 页面", file=sys.stderr)
        print(f"== 卦 {gua_id} ← {page}")
        for field, local, remote in compare(md, gua_id):
            total += 1
            d = diff_str(local, remote)
            if d:
                flagged += 1
                print(f"  [{field}] {d}")
                print(f"    本地: {local}")
                print(f"    ctext: {remote}")
    print(f"\n合计比对字段 {total}，差异 {flagged}")


if __name__ == "__main__":
    main()
