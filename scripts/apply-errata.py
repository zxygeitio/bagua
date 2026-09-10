#!/usr/bin/env python3
"""v2.1.0 经文勘误落地：E6/E11 异文修正 + G1 用九用六补录 + G2 小象第二句补录。

依据 docs/ERRATA.md 裁决；改动逐条断言现状匹配，任何不符即失败退出（不盲改）。
JSON round-trip 已验证与原格式逐字节一致（indent=2 + ensure_ascii=False）。
"""
import json
import sys

PATH = 'src/lib/iching/data/hexagrams.json'

with open(PATH, encoding='utf-8') as f:
    data = json.load(f)

by_id = {g['id']: g for g in data}


def yao(gid, pos):
    return next(y for y in by_id[gid]['yaos'] if y['position'] == pos)


def patch_xiang(gid, pos, old_suffix, addition):
    y = yao(gid, pos)
    cur = y['xiangZhuan']
    if not cur.endswith(old_suffix):
        sys.exit(f'FAIL 卦{gid} 爻{pos} 现值不符: {cur!r} (期望后缀 {old_suffix!r})')
    y['xiangZhuan'] = cur + addition
    print(f'OK 卦{gid} 爻{pos}: {cur} -> {y["xiangZhuan"]}')


def replace_xiang(gid, pos, old, new):
    y = yao(gid, pos)
    cur = y['xiangZhuan']
    if old not in cur:
        sys.exit(f'FAIL 卦{gid} 爻{pos} 未找到待替换串 {old!r}，现值 {cur!r}')
    y['xiangZhuan'] = cur.replace(old, new)
    print(f'OK 卦{gid} 爻{pos}: {cur} -> {y["xiangZhuan"]}')


# ---- E6：讼 九二小象「归逋窜」→「归而逋」+ G2 第二句 ----
replace_xiang(6, 2, '不克讼，归逋窜也。', '不克讼，归而逋也。')
patch_xiang(6, 2, '归而逋也。', '自下讼上，患至掇也。')

# ---- E11：大有 九四小象「明辨皙」→「明辨晰」 ----
replace_xiang(14, 4, '明辨皙也', '明辨晰也')

# ---- G2：小象第二句补录（16 卦，依据 ERRATA G2 已确认清单） ----
G2 = [
    (2, 1, '阴始凝也。', '驯致其道，至坚冰也。'),
    (2, 2, '直以方也。', '不习无不利，地道光也。'),
    (2, 3, '以时发也。', '或从王事，知光大也。'),
    (3, 1, '志行正也。', '以贵下贱，大得民也。'),
    (3, 2, '乘刚也。', '十年乃字，反常也。'),
    (3, 3, '以从禽也。', '君子舍之，往吝穷也。'),
    (5, 1, '不犯难行也。', '利用恒，无咎；未失常也。'),
    (5, 2, '衍在中也。', '虽小有言，以终吉也。'),
    (5, 3, '灾在外也。', '自我致寇，敬慎不败也。'),
    (5, 6, '敬之终吉。', '虽不当位，未大失也。'),
    (6, 1, '讼不可长也。', '虽有小言，其辩明也。'),
    (7, 2, '承天宠也。', '王三锡命，怀万邦也。'),
    (7, 5, '以中行也。', '弟子舆尸，使不当也。'),
    (7, 6, '以正功也。', '小人勿用，必乱邦也。'),
    (8, 5, '位正中也。', '舍逆取顺，失前禽也。邑人不诫，上使中也。'),
    (10, 3, '位不当也。', '眇能视，不足以有明也。跛能履，不足以与行也。武人为于大君，志刚也。'),
    (9, 6, '德积载也。', '君子征凶，有所疑也。'),
    (11, 4, '皆失实也。', '不戒以孚，中心愿也。'),
    (13, 3, '敌刚也。', '三岁不兴，安行也。'),
    (13, 4, '义弗克也。', '其吉，则困而反则也。'),
    (13, 5, '以中直也。', '大师相遇，言相克也。'),
    (14, 5, '信以发志也。', '威如之吉，易而无备也。'),
    (15, 6, '志未得也。', '可用行师，征邑国也。'),
    (16, 5, '乘刚也。', '恒不死，中未亡也。'),
]
for gid, pos, suffix, addition in G2:
    patch_xiang(gid, pos, suffix, addition)

# ---- G1：乾用九 / 坤用六 补录（插在 yaos 键之后，保持逻辑字段序） ----
YONG = {
    1: {'label': '用九', 'text': '见群龙无首，吉。', 'xiangZhuan': '用九，天德不可为首也。'},
    2: {'label': '用六', 'text': '利永贞。', 'xiangZhuan': '用六永贞，以大终也。'},
}
for gid, yong in YONG.items():
    if 'yong' in by_id[gid]:
        sys.exit(f'FAIL 卦{gid} 已存在 yong 字段')
    g = by_id[gid]
    rebuilt = {}
    for k, v in g.items():
        rebuilt[k] = v
        if k == 'yaos':
            rebuilt['yong'] = yong
    by_id[gid].clear()
    by_id[gid].update(rebuilt)
    print(f'OK 卦{gid} yong: {yong["label"]} {yong["text"]}')

out = json.dumps(data, ensure_ascii=False, indent=2) + '\n'
with open(PATH, 'w', encoding='utf-8') as f:
    f.write(out)
print('WRITTEN')
