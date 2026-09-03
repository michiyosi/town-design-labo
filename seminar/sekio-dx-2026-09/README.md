# 石央商工会 DXマーケティングセミナー 後半 — 作業メモ

登壇日：2026-09-15（火）15:00–16:00　会場：石央商工会 本所　定員20名
前半：ハーストーリィプラス 福原潤子氏／後半：TOWN DESIGN LABO ヤスムラミチヨシ

前半スライド（ピンク D15881 × 薄緑背景 × 白カード、A4横）と同じ見た目で、後半1時間分（36枚）を生成する。

## このフォルダにあるもの

| ファイル | 用途 |
|---|---|
| `DXマーケティング後半編.pptx` | 後半スライド本番版・36枚（`deck/build-kouhan-full.js` から生成） |
| `DXマーケティング後半編_preview.pdf` | 上のPDF版。スマホで確認する用（この環境には游ゴシックが無いので字形・字幅は目安） |
| `deck/build-kouhan-full.js` | 36枚の文言と構成。**文言を直すときはここを直して再生成する** |
| `deck/deck.js` | 部品集（cover / card / profile / caseSlide / centerStatement / body / numberedPink / checklist / chip / labelBar / pinkPanel / twoColumn / bigLine / chipFlowGrid / flowRow / pinkTable / summary / worksheet / redBox） |
| `deck/references/patterns.md` | 元デッキ30枚の型と座標 |
| `deck/assets/photos/` | 写真の差し替え場所（中の README 参照） |
| `deck/tools/make-ai-avatar.js` | 代表者写真から「AIヤスムラ」ホログラム画像を生成する（スライド8で使用） |
| `AIヤスムラ_画像生成プロンプト.md` | 上のスクリプトの使い方と、画像生成AIに描かせるときのプロンプト |

前半のスライドのサムネイル（福原氏のもの）と、主催向け概要ワード・当日の実務マニュアルは、このリポジトリには入れていない（別の場所で管理）。

## 再生成のしかた

```bash
cd seminar/sekio-dx-2026-09/deck
npm install                      # 初回だけ（pptxgenjs）
node build-kouhan-full.js        # → ../DXマーケティング後半編.pptx
```

写真は `deck/assets/photos/` に `kitchencar.jpg` `trailer.jpg` `akiya.jpg` `ai.jpg` `yasumura.jpg` を置くと優先して使う。置かないときはサイト本体の写真（下記）が自動で入る。

## 決まっていること

- **Canvaは使わない**。後半の芯は **A案：「うちの店シート」をAIに渡して、毎回の説明をなくす**
- 参加者は AI未経験・スマホは電話とLINE程度が前提。専門用語は言い換える（プロンプト→頼み方、キャプション→投稿の文章、Googleビジネスプロフィール→Googleマップのお店情報）
- 通しのたとえ：**「AIは今日入ったアルバイトさん」**。店のことを知らないから説明書（うちの店シート）を渡す。書いたものは店長が見る
- 使うAIアプリは **Gemini 一本**
- 予約投稿は **Instagram公式アプリだけで可**（Meta Business Suite不要。ストーリーズのみ不可）
- LINE公式：無料は月200通、超過分の追加購入不可、友だち100人×2回で上限。2026-10-01 の有料プラン料金改定は今回の規模には影響なし
- 持ち帰りは **紙2枚**：うちの店シート（5項目・35枚目）＋ワークシート（⑤の日付・36枚目）

## 36枚の構成

| # | 内容 | 部品 |
|---|---|---|
| 1 | 表紙 | cover |
| 2 | PROFILE 会社紹介（写真3枚） | profile |
| 3 | PROFILE 講師紹介（写真1枚） | profile |
| 4 | TOWN DESIGN LABO がやっていること（導入） | centerStatement |
| 5–8 | 取り組み①キッチンカー ②トレーラーハウス ③空き家 ④AIに自分の分身 | caseSlide |
| 9–12 | 後半のテーマ／挙手／1回あたりの手間／だから手間を減らす話だけ | centerStatement, bigLine |
| 13 | 身近なDX＝毎回考えることを減らす | flowRow + body |
| 14–17 | AIはアルバイトさん／なし・あり比較／うちの店シート5項目／ワークタイム | body, twoColumn, numberedPink |
| 18–22 | Geminiの開き方／頼み方の型／実演／そのまま投稿しない（値段・日付・言い回し）／30分→10分 | numberedPink, flowRow + pinkPanel, bigLine |
| 23–29 | 止まらない仕組み／予約投稿の手順／確認タイム／月1回1時間／Googleマップ×3枚／その手順／余裕が出てきたら（LINE公式ほか） | numberedPink, pinkTable, flowRow |
| 30 | 事例（前→やったこと→後） | chipFlowGrid |
| 31–32 | ワーク／ペア共有 | centerStatement |
| 33–34 | 後半のまとめ（☐）／締め | summary, closing |
| 35–36 | ワークシート：うちの店シート／変えたいことを動く形にする | worksheet |

主要な枚にはスピーカーノートあり（PowerPoint のノート欄）。

## 写真の出どころ（いまの状態）

| 枚 | いま入っている写真 | 備考 |
|---|---|---|
| 2, 5 | `kazari-b-01.jpg`（KAZARI KITCHEN Type B） | 自社で設計・保有 |
| 2, 6 | `CaGqL7fv3mc_01.jpg`（THE NOMAD 八ヶ岳） | **製造パートナー撮影**。セミナーで使ってよいか判断を |
| 2, 7 | `life/img/317-febd7827.jpg`（空家の学校の会場） | 740px と小さめ。高解像度があれば `akiya.jpg` で差し替え |
| 8 | `deck/assets/photos/ai.jpg` | `director-sm.jpg` から生成したホログラム風の「AIヤスムラ」。ピンク版 `ai-pink.jpg` もあり |
| 3 | `director-sm.jpg` | チラシの208px版より良い |

## 未完了（本人の入力待ち）

1. **3枚目の「趣味」「やってみたい事」**（空欄の括弧）
2. **30枚目の事例3件**（「（事例1）」「（やったこと）」「（結果）」のチップ。1枠12文字以内）。数字は自分で確認できるものだけ。「保存2倍」より「月3人の予約が8人に」のようにお客さんの数で
3. 2枚目の部署名「可動産部／まちづくり部／AI実装部」は仮置き。実際の呼び方に差し替え
4. 8枚目の本文（AIに自分の分身）は、サイトの記述から起こした仮の文。実際にやっていることに直す
5. 24枚目の Instagram のボタン名（「詳細設定」「日時を指定」）は、当日朝に自分のスマホで確認
6. さとうみどり氏に確認：Wi-Fi／スマホ画面の投影可否／机の配置／参加者の年齢層・業種／配布資料の印刷分担と部数

## 関係者

- さとうみどり氏 — 主催側窓口（LINEでチラシ・概要ワードを受領）
- 福原潤子氏 — 株式会社ハーストーリィプラス プランナー。前半担当。元デッキの作者
- チラシ掲載の講師名義：ヤスムラミチヨシ氏／TOWN DESIGN LABO Co., Ltd. 代表取締役
