#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fetch_images.py — Claude セットアップ解説記事（Windows向け）の本文画像をローカルPCで一括保存する

使い方（Windows PowerShell の例）:
    pip install requests beautifulsoup4
    python fetch_images.py                 # 同じフォルダの sources.json を読み、全記事を処理
    python fetch_images.py --only 01,04    # キーの先頭番号で絞り込み（カンマ区切り）
    python fetch_images.py --priority      # 「画像が豊富」と確認済みの記事だけ
    python fetch_images.py --out D:\\claude_images

出力:
    downloaded_images/<記事キー>/NN.<ext>   … 本文画像（元の並び順）
    downloaded_images/<記事キー>/page.html  … 取得した記事HTML（画像の出典確認用）
    downloaded_images/manifest.json         … 記事タイトル・画像URL・保存先・キャプション一覧

注意:
    - 記事の画像は各執筆者の著作物です。自分の学習・参照目的で保存し、そのまま再公開しないこと。
    - サイトによっては会員限定（リベシティ等）で、ログインなしでは本文が取れません。
      その場合は manifest.json の status に "login_required" または "404" が記録されます。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("先に次を実行してください:  pip install requests beautifulsoup4")
    sys.exit(1)

# Windows のコンソールで日本語が化けないようにする
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/128.0 Safari/537.36"
    ),
    "Accept-Language": "ja,en;q=0.8",
}

# 「画像が豊富／普通」と実確認できた記事（sources.json の key 先頭番号）
PRIORITY_KEYS = ("01", "03", "04", "05", "06", "21", "22", "31", "32")

# 本文領域と思われるセレクタ（サイト別・上から順に試す）
BODY_SELECTORS = [
    ".note-common-styles__textnote-body",   # note
    "#personal-public-article-body",        # Qiita
    ".it-MdContent",                        # Qiita（旧）
    ".znc",                                 # Zenn
    ".article-body",                        # Zenn / 汎用
    ".post-content", ".entry-content", ".blog-content",
    ".article__body", ".article-content", ".content-body",
    "article", "main",
]

# アイコン・アバター・広告などを除外するためのURL断片
SKIP_PATTERNS = re.compile(
    r"(avatar|icon|logo|profile|emoji|badge|banner-ad|/ads?/|gravatar|"
    r"twitter\.com|facebook\.com|line\.me|hatena|pixel|beacon|tracking|"
    r"\.svg(\?|$)|data:image)",
    re.IGNORECASE,
)

IMG_EXT = {
    "image/jpeg": ".jpg", "image/jpg": ".jpg", "image/png": ".png",
    "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif",
    "video/mp4": ".mp4", "video/webm": ".webm",
}


def load_sources(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    out = []
    for cat in data["categories"]:
        for a in cat["articles"]:
            a = dict(a)
            a["category"] = cat["name"]
            out.append(a)
    return out


def pick_from_srcset(srcset: str) -> str | None:
    """srcset から最も幅の大きい候補を返す"""
    best, best_w = None, -1
    for part in srcset.split(","):
        bits = part.strip().split()
        if not bits:
            continue
        url = bits[0]
        w = 0
        if len(bits) > 1:
            m = re.match(r"(\d+)(w|x)", bits[1])
            if m:
                w = int(m.group(1)) * (1000 if m.group(2) == "x" else 1)
        if w > best_w:
            best, best_w = url, w
    return best


def find_body(soup: BeautifulSoup):
    for sel in BODY_SELECTORS:
        node = soup.select_one(sel)
        if node and node.find(["img", "video", "source"]):
            return node
    return soup.body or soup


def extract_media(html: str, page_url: str) -> list[dict]:
    """本文中の画像・動画URLを、出現順で重複なく返す"""
    soup = BeautifulSoup(html, "html.parser")
    body = find_body(soup)
    seen, items = set(), []

    def add(url: str | None, caption: str = ""):
        if not url:
            return
        url = url.strip()
        if not url or url.startswith("data:"):
            return
        url = urljoin(page_url, url)
        if SKIP_PATTERNS.search(url):
            return
        if url in seen:
            return
        seen.add(url)
        items.append({"url": url, "caption": caption.strip()})

    for tag in body.find_all(["img", "source", "video", "a"]):
        name = tag.name
        if name == "img":
            # 小さすぎるものはアイコン扱いで除外
            try:
                w = int(str(tag.get("width", "")).rstrip("px") or 0)
                h = int(str(tag.get("height", "")).rstrip("px") or 0)
                if (w and w < 80) or (h and h < 80):
                    continue
            except ValueError:
                pass
            cap = tag.get("alt") or ""
            fig = tag.find_parent("figure")
            if fig and fig.find("figcaption"):
                cap = fig.find("figcaption").get_text(" ", strip=True) or cap
            srcset = tag.get("data-srcset") or tag.get("srcset")
            url = (
                tag.get("data-src") or tag.get("data-original") or tag.get("data-lazy-src")
                or (pick_from_srcset(srcset) if srcset else None)
                or tag.get("src")
            )
            add(url, cap)
        elif name == "source":
            srcset = tag.get("srcset")
            add(pick_from_srcset(srcset) if srcset else tag.get("src"))
        elif name == "video":
            add(tag.get("src") or tag.get("poster"))
        elif name == "a":
            href = tag.get("href") or ""
            if re.search(r"\.(mp4|webm|png|jpe?g|webp|gif)(\?|$)", href, re.IGNORECASE):
                add(href, tag.get_text(" ", strip=True))
    return items


def guess_ext(resp: requests.Response, url: str) -> str:
    ctype = (resp.headers.get("Content-Type") or "").split(";")[0].strip().lower()
    if ctype in IMG_EXT:
        return IMG_EXT[ctype]
    m = re.search(r"\.(png|jpe?g|webp|gif|avif|mp4|webm)(\?|$)", urlparse(url).path + "?", re.I)
    if m:
        e = m.group(1).lower()
        return ".jpg" if e == "jpeg" else "." + e
    return ".bin"


def fetch_article(article: dict, out_root: Path, session: requests.Session, delay: float) -> dict:
    key, url = article["key"], article["url"]
    rec = {
        "key": key, "title": article["title"], "author": article.get("author"),
        "url": url, "category": article.get("category"),
        "status": "", "page_title": None, "images": [],
    }
    print(f"\n=== [{key}] {article['title']}\n    {url}")
    try:
        r = session.get(url, headers=HEADERS, timeout=20, allow_redirects=True)
    except Exception as e:  # noqa: BLE001
        rec["status"] = f"error: {e}"
        print(f"  ❌ ページ取得失敗: {e}")
        return rec

    if r.status_code == 404:
        rec["status"] = "404"
        print("  ❌ 404（URL失効の可能性）")
        return rec
    if r.status_code in (401, 403) or "login" in r.url.lower():
        rec["status"] = "login_required"
        print(f"  ⚠️ ログインが必要か拒否されました（HTTP {r.status_code}）")
        return rec
    if r.status_code != 200:
        rec["status"] = f"http_{r.status_code}"
        print(f"  ❌ HTTP {r.status_code}")
        return rec

    r.encoding = r.apparent_encoding or "utf-8"
    html = r.text
    soup = BeautifulSoup(html, "html.parser")
    rec["page_title"] = soup.title.get_text(strip=True) if soup.title else None

    out_dir = out_root / key
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "page.html").write_text(html, encoding="utf-8")

    media = extract_media(html, r.url)
    print(f"  本文画像候補: {len(media)} 件")
    if not media:
        rec["status"] = "no_images_found"
        return rec

    ok = 0
    for i, item in enumerate(media, 1):
        img_url = item["url"]
        try:
            ir = session.get(img_url, headers={**HEADERS, "Referer": url}, timeout=30)
            ir.raise_for_status()
            ext = guess_ext(ir, img_url)
            if ext == ".bin" or len(ir.content) < 512:
                # 画像でない／極小ファイルはスキップ
                item["saved"] = None
                item["note"] = f"skipped ({ir.headers.get('Content-Type')}, {len(ir.content)} bytes)"
                continue
            path = out_dir / f"{i:02d}{ext}"
            path.write_bytes(ir.content)
            item["saved"] = str(path.relative_to(out_root)).replace("\\", "/")
            item["bytes"] = len(ir.content)
            ok += 1
            print(f"  ✅ {item['saved']}  {item['caption'][:40]}")
        except Exception as e:  # noqa: BLE001
            item["saved"] = None
            item["note"] = f"error: {e}"
            print(f"  ❌ {img_url[:90]} : {e}")
        time.sleep(delay)
    rec["images"] = media
    rec["status"] = f"ok ({ok}/{len(media)} saved)"
    return rec


def main() -> None:
    here = Path(__file__).resolve().parent
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--sources", default=str(here / "sources.json"), help="sources.json のパス")
    ap.add_argument("--out", default=str(Path.cwd() / "downloaded_images"), help="保存先フォルダ")
    ap.add_argument("--only", default="", help="処理する記事キーの先頭番号（例: 01,04,21）")
    ap.add_argument("--priority", action="store_true", help="画像が豊富と確認済みの記事だけ処理")
    ap.add_argument("--delay", type=float, default=0.5, help="画像1枚ごとの待ち秒数（サーバー負荷配慮）")
    args = ap.parse_args()

    sources = load_sources(Path(args.sources))
    if args.only:
        wanted = {s.strip() for s in args.only.split(",") if s.strip()}
        sources = [a for a in sources if a["key"].split("_")[0] in wanted]
    elif args.priority:
        sources = [a for a in sources if a["key"].split("_")[0] in PRIORITY_KEYS]

    out_root = Path(args.out)
    out_root.mkdir(parents=True, exist_ok=True)
    print(f"対象記事: {len(sources)} 件 → 保存先: {out_root}")

    session = requests.Session()
    manifest = []
    for a in sources:
        manifest.append(fetch_article(a, out_root, session, args.delay))
        time.sleep(args.delay)

    (out_root / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    total = sum(len([i for i in m["images"] if i.get("saved")]) for m in manifest)
    print("\n" + "=" * 60)
    for m in manifest:
        print(f"  [{m['key']}] {m['status']}")
    print(f"\n完了！ 画像 {total} 枚を {out_root} に保存しました。")
    print("manifest.json に記事ごとの画像URLと保存先を記録しています。")
    print("必要な画像をこのチャットにアップロードしてください（フォルダごとzip推奨）。")


if __name__ == "__main__":
    main()
