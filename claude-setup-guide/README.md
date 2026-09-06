# claude-setup-guide

Claude（Claude Code／Claude Desktop／Cowork）を **Windows** のローカル環境に導入する手順を、画像付きで解説している日本語記事の調査データ置き場。

| ファイル | 内容 |
|---|---|
| `research.md` | 調査レポート本文（TL;DR・所見・記事一覧・推奨順・注意点） |
| `sources.json` | 記事51本を6カテゴリに整理した構造化データ（URL・媒体・公開日・画像量・想定読者） |
| `fetch_images.py` | 各記事の本文画像をローカルPCで一括保存するスクリプト |
| `images/` | 取得した画像の置き場（初期状態は空。下記の手順で保存） |

## 画像の取り方

Claude のサーバー環境からは外部サイト（note・Zenn・Qiita 等）へ接続できないため、画像は手元のPCで取得する。

```powershell
# 1) 初回のみ
pip install requests beautifulsoup4

# 2) このフォルダで実行（画像が豊富と確認済みの9記事だけ）
python fetch_images.py --priority

# 全51記事を対象にする場合
python fetch_images.py

# 特定の記事だけ（sources.json の key 先頭番号）
python fetch_images.py --only 01,04,21
```

`downloaded_images/<記事キー>/NN.jpg` の形で保存され、`downloaded_images/manifest.json` に記事タイトル・画像URL・保存先・キャプションが記録される。

- リベシティ（会員制）は未ログインだと本文が取れないため `login_required` になる。ブラウザでログインして手動保存する。
- 各画像は執筆者の著作物。参照・学習用にとどめ、このサイトに転載しない（`images/` に置く場合も同様）。
