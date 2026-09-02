#!/usr/bin/env python3
"""ファイル名にハッシュが無いCSS/JSの参照に ?v=<内容のハッシュ> を付ける。

GitHub Pages はどのファイルも同じ有効期限で配ってしまうので、これが無いと
更新直後に「新しいHTML＋古いJS」の読者が出る。CSS/JSを変えたら実行する。
    python3 tools/stamp-assets.py
"""
import hashlib, os, re, sys

TARGETS = {
    'life/index.html': ['../road/road.css', 'analytics.js', 'data-rp.js', 'data-ev.js', 'road-scene.js', '../road/engine.js'],
    'life/story.html': ['analytics.js'],
    'road/index.html': ['road.css', 'scene-tdl.js', 'engine.js'],
}
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
changed = []
for page, assets in TARGETS.items():
    p = os.path.join(root, page)
    s = open(p, encoding='utf-8').read()
    before = s
    for a in assets:
        real = os.path.normpath(os.path.join(os.path.dirname(p), a))
        h = hashlib.md5(open(real, 'rb').read()).hexdigest()[:8]
        s = re.sub(r'(["\'])' + re.escape(a) + r'(\?v=[0-9a-f]+)?\1',
                   lambda m: m.group(1) + a + '?v=' + h + m.group(1), s)
    if s != before:
        open(p, 'w', encoding='utf-8').write(s); changed.append(page)
print('更新:', ', '.join(changed) if changed else 'なし')
