# AIヤスムラミチヨシ — キャラクター画像のつくり方

ドラマに出てくるような「画面に浮かぶ半透明のAIアバター」を、自分の顔でつくるための材料。

## いま使っているもの（キャラクターイラスト）

`deck/assets/photos/ai-character.png` が元のイラスト（正方形）。
スライド8の写真枠は4:3なので、そのまま入れると上下が切れる。`deck/tools/fit-ai-character.js` が
左右の余白を同じ絵のぼかしで埋めて `ai.jpg`（1600×1200）を書き出す。

```bash
cd seminar/sekio-dx-2026-09/deck
NODE_PATH=$(npm root -g) node tools/fit-ai-character.js
```

イラストを差し替えるときは `ai-character.png` を置き換えて、上を実行し直す。

## A. 写真からホログラム風にする（差し替え候補・いまは未使用）

```bash
cd seminar/sekio-dx-2026-09/deck
npm install                                   # 初回だけ（playwright も入る）
NODE_PATH=$(npm root -g) node tools/make-ai-avatar.js
```

Chromeの場所を指定したいときは `CHROME_PATH=/path/to/chrome` を付ける。

調整するところ（スクリプト冒頭）：

| 変数 | 何を決めるか |
|---|---|
| `CROP` | 元写真のどこを切り抜くか（いまは頭〜胸）。`{x, y, w, h}` は 1170×780 の座標 |
| `THEMES` | 色。`cyan`（青）と `pink`（D15881系）の2つ |
| 楕円のマスク | `ny`／`nx` の除数を小さくすると、顔まわりだけ残って背景がもっと消える |

写真を差し替えるときは `SRC` を変える。**正面・バストアップ・背景が明るく単純**な写真ほどきれいに出る。

## B. 画像生成AIに描かせる（キャラクターらしくしたいとき）

写真加工では「実写のホログラム」にしかならない。イラスト寄りのキャラクターにしたいときは、
Gemini・ChatGPT・Midjourney などの画像生成に、**自分の顔写真を添付して**次を貼る。

### 日本語（Gemini / ChatGPT 用・写真を添付して使う）

```
添付した人物の顔の特徴（ニット帽、丸い輪郭、笑った目、黒いパーカー）を保ったまま、
近未来のホログラムAIアシスタントのキャラクターとして描いてください。

・胸から上のバストアップ。正面向き、やわらかく微笑んでいる
・体は半透明のシアンブルーの光でできていて、細い走査線（横のスキャンライン）が入っている
・輪郭が青白く発光し、粒子が少し立ちのぼっている
・背景は真っ黒に近い濃紺。うっすらとした方眼のグリッド
・足元に円形の投影台があり、そこから光が立ちのぼっている
・画面の四隅に細いL字のフレーム、左上に「AI YASUMURA」の小さな英字ラベル
・実写風ではなく、なめらかなセルルック（アニメ調）のイラストで
・比率は4:3、文字は英数字のみ、日本語は入れない
```

### 英語（Midjourney など）

```
holographic AI assistant character, bust portrait of a friendly Japanese man
in a knit beanie and black hoodie, warm smile, body rendered as translucent
cyan-blue light with fine horizontal scanlines, glowing rim light, faint
particles rising, dark navy void background with subtle grid, circular
projection pedestal below casting light upward, thin L-shaped HUD brackets in
the corners, clean cel-shaded anime illustration, not photorealistic
--ar 4:3 --style raw
```

### 気をつけること

- 特定のドラマの映像・キャラクターデザインをそのまま真似た指示は避ける（上の文面は「ホログラムのAIアバター」という一般的な表現にしてある）
- 顔写真を外部サービスに上げることになるので、使うサービスの学習利用の設定は先に確認する
- 出てきた画像は `deck/assets/photos/ai.jpg` に置けば、そのままスライド8に入る（4:3・横長で書き出す）
