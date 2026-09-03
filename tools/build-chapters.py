#!/usr/bin/env python3
"""縦に読む版（story.html）の各章を、道のページの窓にそのまま出せる形に切り出す。

もともと窓は story.html を枠（iframe）で読み込んでいたが、拡張機能に枠を
止められると本文が読めなくなる。枠をやめて、本文を窓の中に直接入れる。

出すもの
  life/chapters.<hash>.css   story.html の見た目を「#win-html .story」の中だけに閉じ込めたCSS
  life/chapters.<hash>.js    window.CHAPTERS = {"kv":[題,本文], "0":[題,本文], ...}

story.html か style.css を変えたら実行する:
    python3 tools/build-chapters.py
"""
import hashlib, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIFE = os.path.join(ROOT, 'life')
PREFIX = '#win-html .story'
CLS = 's-'   # 章のクラス名に付ける印。道のページの .card などとぶつからないようにする


def rename_sel(sel):
    """セレクタの中のクラス名に印を付ける。"""
    return re.sub(r'\.([A-Za-z_][\w-]*)', lambda m: '.' + CLS + m.group(1), sel)


def rename_html(html):
    """class 属性の中のクラス名に、同じ印を付ける。"""
    def one(m):
        names = ' '.join(CLS + c for c in m.group(2).split())
        return '%s="%s"' % (m.group(1), names)
    return re.sub(r'\b(class)="([^"]*)"', one, html)


def scope(block, prefix):
    """CSSの各規則を prefix の中だけに効くように書き換える。"""
    out = ''
    i = 0
    while i < len(block):
        j = block.find('{', i)
        if j < 0:
            break
        sel = block[i:j].strip()
        depth, k = 1, j + 1
        while k < len(block) and depth:
            if block[k] == '{':
                depth += 1
            elif block[k] == '}':
                depth -= 1
            k += 1
        body, i = block[j + 1:k - 1], k
        if sel.startswith('@media') or sel.startswith('@supports'):
            out += sel + '{' + scope(body, prefix) + '}'
        elif sel.startswith('@'):          # @font-face / @keyframes はそのまま
            out += sel + '{' + body + '}'
        else:
            parts = []
            for one in sel.split(','):
                one = one.strip()
                if not one or 'html:not(.js)' in one:
                    continue               # JSが動かない前提の規則は要らない
                one = re.sub(r'^html\.[A-Za-z0-9_-]+\s*', '', one)
                if one in ('', 'html', 'body', ':root'):
                    parts.append(prefix)
                else:
                    parts.append(prefix + ' ' + rename_sel(one))
            if parts:
                out += ','.join(parts) + '{' + body + '}'
    return out


def strip_blocks(html, opening):
    """opening で始まる div を、対応する閉じタグごと取り除く。"""
    tag = re.compile(r'<div\b|</div>')
    while True:
        i = html.find(opening)
        if i < 0:
            return html
        depth, k = 0, i
        while True:
            m = tag.search(html, k)
            if not m:
                return html[:i]
            depth += 1 if m.group(0) == '<div' else -1
            k = m.end()
            if depth == 0:
                break
        html = html[:i] + html[k:]


def main():
    story = open(os.path.join(LIFE, 'story.html'), encoding='utf-8').read()

    # ---- CSS ----
    css = open(os.path.join(LIFE, 'style.0a3d5ed9.css'), encoding='utf-8').read()
    inline = re.findall(r'<style>(.*?)</style>', story, flags=re.S)
    css = re.sub(r'/\*.*?\*/', '', css + '\n' + '\n'.join(inline), flags=re.S)
    css = scope(css, PREFIX)
    css += (
        # 窓の中では、章を1本の記事として素直に流す
        PREFIX + '{padding:0;margin:0;height:auto;min-height:0;overflow:visible}'
        + PREFIX + ' section{min-height:0!important;padding-top:24px}'
        # 出現アニメは画面外の判定で止まるので、最初から見えた状態にする
        + PREFIX + ' .' + CLS + 'rv,' + PREFIX + ' .' + CLS + 'rv.' + CLS + 'is-in{opacity:1!important;filter:none!important;transform:none!important;animation:none!important}'
        + PREFIX + ' img{max-width:100%}'
        + PREFIX + ' [data-full]{cursor:zoom-in}'
    )
    ch = hashlib.md5(css.encode()).hexdigest()[:8]
    css_name = 'chapters.%s.css' % ch

    # ---- 各章の本文 ----
    secs = re.findall(r'<section[^>]*>.*?</section>', story, flags=re.S)
    assert len(secs) == 10, '章の数が変わっています: %d' % len(secs)
    chapters = {}
    for n, sec in enumerate(secs):
        h = strip_blocks(sec, '<div class="njcard" data-fw=')   # 顔ウォールは道の板が持っている
        h = rename_html(h)
        h = re.sub(r'<p class="jswarn">.*?</p>', '', h, flags=re.S)
        h = re.sub(r'<script.*?</script>', '', h, flags=re.S)
        m = re.search(r'data-chname="([^"]*)"', sec)
        title = m.group(1) if m else '13年分の投稿と写真'
        chapters['kv' if n == 0 else str(n - 1)] = [title, '<div class="story">' + h + '</div>']

    js = ('/* 縦に読む版の各章。tools/build-chapters.py が作る。直接さわらない */\n'
          'window.CHAPTERS_CSS = %s;\nwindow.CHAPTERS = %s;\n'
          % (json.dumps(css_name), json.dumps(chapters, ensure_ascii=False, separators=(',', ':'))))
    jh = hashlib.md5(js.encode()).hexdigest()[:8]
    js_name = 'chapters.%s.js' % jh

    for old in os.listdir(LIFE):
        if re.match(r'chapters\.[0-9a-f]+\.(css|js)$', old) and old not in (css_name, js_name):
            os.remove(os.path.join(LIFE, old))
    open(os.path.join(LIFE, css_name), 'w', encoding='utf-8').write(css)
    open(os.path.join(LIFE, js_name), 'w', encoding='utf-8').write(js)

    # 道のページの参照を差し替える
    p = os.path.join(LIFE, 'index.html')
    s = open(p, encoding='utf-8').read()
    s = re.sub(r'chapters\.[0-9a-f]+\.js', js_name, s)
    open(p, 'w', encoding='utf-8').write(s)

    print('%s  %d KB' % (css_name, len(css) // 1024))
    print('%s  %d KB / %d章' % (js_name, len(js) // 1024, len(chapters)))


if __name__ == '__main__':
    main()
