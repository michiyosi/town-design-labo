# town-design-labo

TOWN DESIGN LABO の公開サイト（GitHub Pages、静的 HTML）。
ルート直下のファイルはそのまま https://towndesignlabo.jp/ で配信される。

## スクリーンショット

画面のスクショが必要なときはユーザーに撮影を依頼しない。

```
powershell -NoProfile -ExecutionPolicy Bypass -File ./shot.ps1 -Out screenshots/<名前>.png
```

を実行して自分で取得し、Read で読むこと。

- 保存先は必ず `screenshots/` 配下にする（.gitignore 済み。ルートに置くとサイトに公開されてしまう）
- ターミナルの写り込みを避けたいときは `-Delay 3` を付け、その間にユーザーが対象画面を出す
- プライマリモニタだけ撮るなら `-Primary` を付ける（既定は全モニタを1枚に結合）
