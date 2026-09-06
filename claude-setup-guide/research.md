# Claude のローカル環境セットアップを画像付きで解説した日本語記事ガイド（Windows向け・2026年9月時点）

> 調査日: 2026-09-06。構造化データは `sources.json`、各記事の画像取得は `fetch_images.py`（ローカルPCで実行）を参照。

## TL;DR

- Windowsでのローカル環境設定を「画像が豊富」に実確認できた記事は複数存在する。Claude Code／デスクトップアプリ導入なら **note「くろちゃん」（約40枚）、リベシティ「全手順スクショ付き」No1（約25枚）、キウイ設計（約25枚＋動画）**、MCPファイル連携なら **Qiita「amatatsuk」（約15枚）** が現時点で画像量・実用性ともに有力。
- カテゴリ2（Claude Desktop＋MCP filesystem）は日本語記事が最も充実しており、Windows特有のパス・npx・再起動のつまずきも詳しく解説されている。一方カテゴリ3（Cowork）は「インストール手順を画像付きで」扱う独立記事はまだ少なめ。
- Claude Code／MCPは仕様変更が非常に速い（例：npmパッケージの必要Node.jsはv2.1.198以降「22以上」に引き上げられた）。まず公式ドキュメント（code.claude.com/docs、support.claude.com）で最新仕様を確認したうえで、下記の画像付き記事を補助として読む進め方を推奨する。

## Key Findings

- 各記事の画像有無は、調査担当が実際にページを開いて本文中の画像・スクリーンショットを数えて判定した（後述の「画像の量」欄）。判定できなかったものは「未確認」と明記し、画像付きと断定していない。
- Windowsネイティブ対応（WSL不要）は2025年7月にAnthropicが発表した（Hacker News「Claude Code adds native support for Windows」2025年7月）。Claude Code本体は2025年2月24日にリサーチプレビュー、2025年5月22日に一般提供が開始されている。
- 2026年時点のClaude Code公式ドキュメント（Advanced setup）は「Option 1: Native Windows」を最初に案内し、「PowerShellまたはCMDからインストールコマンドを実行。管理者権限は不要。Git for Windowsのインストールは任意（Git Bashを使えるようになる）」と明記している。**多くの日本語記事が「Git for Windows必須」と書いているが、公式上は任意で、無い場合はPowerShellツール経由でシェルコマンドが実行される**点に注意（ただしClaude Desktopの Code タブ利用時はGitが必要）。
- Claude Desktopの設定ファイルは Windows では `%APPDATA%\Claude\claude_desktop_config.json`。 JSON内のパスはバックスラッシュを `\\`（2つ）にエスケープするのが必須のつまずきポイント。設定ファイルは「Claudeメニュー→設定→開発者→構成を編集（Edit Config）」から開くのが確実（存在しなければ自動生成される）。
- Windows特有の重要な落とし穴：MSIX（Microsoft Store）版でインストールした場合、設定ファイルの実体が `C:\Users\<user>\AppData\Local\Packages\Claude_...\LocalCache\Roaming\Claude\` に置かれ、「Edit Config」が別ファイルを開いてMCPが無言で起動しない既知の不具合が報告されている（GitHub Issue #26073）。加えて「日本語ユーザー名（C:\Users\〇〇）でClaude Codeが無言でクラッシュ」「npxのフルパス指定が必要」「PATHが自動で通らない」なども複数記事で報告されている。

## Details

### カテゴリ1：Claude Code のWindowsローカル環境へのインストール・セットアップ

**note「【2026年4月最新版Windows】初めてのClaude導入ガイド」（くろちゃん@Claude先生）**

- URL: <https://note.com/kurochan_ai/n/n4a2e2a56372b>
- 媒体: note ／ 公開日: 2026年4月17日
- 画像の量: 豊富（約40枚、各ステップに操作画面スクショ）
- 内容: Claudeデスクトップアプリのダウンロード〜インストール、Chrome連携、Coworkの利用方法まで。Windows用ダウンロード（ x64/arm64）の選び方も解説。
- Windows対応: ○ ／ 想定読者: 初心者向け（非エンジニア可）

**リベシティ「【画像付き】WindowsにClaude Codeをインストールする方法」**

- URL: <https://library.libecity.com/articles/01KMWNGV82ZYGN4VG5TKGV5NE2>
- 媒体: 会員コミュニティ記事（リベシティ）
- 画像の量: 未確認（調査時にページが404を返し取得不可。タイトル・説明文では「全手順を画像付きで解説」とされる）
- 内容: Git導入→Claude Codeインストール→PATH設定→初回起動 の4ステップ。有料プラン加入の案内あり。
- Windows対応: ○ ／ 想定読者: 初心者向け

**リベシティ「Windows版Claudeデスクトップアプリ 完全導入ガイド【全手順スクリーンショット付き】No1」**

- URL: <https://library.libecity.com/articles/01KNCDYCBQEH2CVSC92E34SGR0>
- 媒体: リベシティ ／ 公開日: 2026年4月5日（更新: 2026年4月20日）
- 画像の量: 豊富（約25枚。アカウント作成・課金・サインイン・Cowork有効化の各画面）
- 内容: デスクトップアプリ導入→サインイン→Cowork用の仮想マシン有効化まで。画像点数の都合で2部構成（No2でClaude Code導入）。
- Windows対応: ○ ／ 想定読者: 初心者向け

**キウイ設計「Claude Code：Windows 11へのインストール手順」**

- URL: <https://kiwi-mechanical.com/claudecode-win11-install/>
- 媒体: 個人ブログ ／ 公開日: 2026年4月25日
- 画像の量: 豊富（約25枚＋動作mp4。Git for Windowsの各インストール画面、仮想化有効化、Cowork画面）
- 内容: 非エンジニア（機械設計者）による、Windows 11 Homeノートでのデスクトップアプリ版導入手順。実機環境を明記。
- Windows対応: ○ ／ 想定読者: 初心者・非エンジニア向け

**Zenn ホロラボ「Claude Code がネイティブ Windows 対応したのでインストール手順をまとめた」**

- URL: <https://zenn.dev/hololab/articles/claude_001_9eb52d7d9e2568>
- 媒体: Zenn（企業テックブログ）／ 公開日: 2025年7月14日 ※ネイティブ対応直後の記事で情報鮮度に注意
- 画像の量: 豊富（約12枚。Node.js／Git for Windows／PowerShell／Set-ExecutionPolicy／ログイン画面）
- 内容: Node.js＋Git for Windows導入、PowerShellでのSet-ExecutionPolicy、テーマ選択・ログインまで。※記事は「Node.js 18以降」と記載するが、公式のnpmパッケージ要件はv2.1.198以降「Node.js 22以上」に変更されている。ネイティブ／Homebrewインストーラはゼロ依存で導入可能。
- Windows対応: ○ ／ 想定読者: エンジニア寄り

**Qiita tomyu「Claude Codeのインストール、めっっっちゃ簡単だった！」**

- URL: <https://qiita.com/tomyu/items/414d39aab4305260547c>
- 媒体: Qiita ／ 公開日: 2026年4月19日
- 画像の量: 普通（7〜8枚。PowerShellでのインストール実行、PATH追加、トークン入力画面等。ただし冒頭1枚は相対パス未修正でリンク切れ）
- 内容: ネイティブインストーラでの1行インストール、PATH追加、トークン貼り付けのハマりポイント。
- Windows対応: ○ ／ 想定読者: 初心者〜エンジニア

**Qiita kai_kou「Claude Code Windows版完全ガイド — PowerShellプレビューとネイティブインストール」**

- URL: <https://qiita.com/kai_kou/items/2e33c169a9e297fe71c1>
- 媒体: Qiita ／ 内容: v2.1.84でのPowerShellツールのオプトインプレビュー、Native Installer（install.ps1）、Git Bash連携改善などを公式変更履歴ベースで解説。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: エンジニア向け

**note「Claude Code のインストール方法【Windows完全版】WSL2を使った環境構築をゼロから解説」（イスケ）**

- URL: <https://note.com/d_isuke23/n/nb96e4e7c0f48>
- 媒体: note ／ 内容: ネイティブとWSL2の両方式を比較し、WSL2をゼロから構築する手順（PowerShell管理者権限、Ubuntu導入）。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: 初心者〜中級

**digitalbox「WSL2 + Claude + VS Code の開発環境を作る」**

- URL: <https://digitalbox.jp/building-a-development-environment-using-wsl2-claude-vs-code/>
- 媒体: 個人ブログ ／ 内容: WSL2経由での構築、ブラウザ認証フロー、VS CodeのWSL連携。筆者が最終的にメモリ消費を理由にGit Bash構成へ移行した経緯も率直に記載。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: エンジニア向け

**note「Claude Code をパソコンにインストールする方法（Mac / Windows）」（tatsuki）**

- URL: <https://note.com/nobel/n/n1852d110a7c4>
- 媒体: note ／ 内容: 「実質1行」でのインストールを非エンジニア向けに解説。コピペ中心で手を動かす構成。
- 画像の量: 未確認 ／ Windows対応: ○（Mac併記）／ 想定読者: 初心者・非エンジニア向け

**muku-group「【Windows版】Claude Code導入〜VSCode連携まで完全ガイド（非エンジニア向け）2026」**

- URL: <https://muku-group.jp/claude-code-2026/>
- 媒体: 企業ブログ ／ 内容: 非エンジニア（経営者・マーケター等）向けにVS Code連携まで。つまずき先回りとプロンプト集付き。 想定読者にCEO・事業責任者を明記。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: 非エンジニア・経営者向け

**37Design「Claude Code 始め方｜非エンジニア経営者がMac/Windowsで30分で動かす手順【2026年最新】」**

- URL: <https://37design.co.jp/blog/claude-code-getting-started-non-engineer-2026/>
- 媒体: 企業ブログ ／ 内容: ターミナルを避けたい非エンジニア経営者向けに、デスクトップアプリ／Web版／CLIの3ルートを比較。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: 非エンジニア・経営者向け（当該ユーザーの属性に最も近い）

**（参考・企業系網羅記事、いずれも画像量は未確認）** SHIFT AI（<https://shift-ai.co.jp/blog/55521/> ）、DevelopersIO「Claude CodeがWindows(WSLなし)で使えるように」（<https://dev.classmethod.jp/articles/claude-code-windows-wsl/> ）、DotAI TIMES（<https://dot-ai.myuuu.co.jp/times/articles/52> ）、Uravation（<https://uravation.com/media/claude-code-windows-installation-guide-2026/> ）、Tradivance（<https://tradivance.co.jp/column/ai/claude/claude-code-install/> ）、ユニマ（<https://unima.co.jp/columns/ai-claude-code-install-setup/> ）は、ネイティブ／WinGet／WSL2の全手順やエラー対処を網羅。情報は新しめ。

### カテゴリ2：Claude Desktop のインストールとMCP（filesystem）ローカルファイル連携

**Qiita amatatsuk「Claude for Desktop（Windows版）でMCP（Filesystem）を使う！日本語で一番詳しい手順を解説」**

- URL: <https://qiita.com/amatatsuk/items/4303f6bedd441c8a2588>
- 媒体: Qiita ／ 公開日: 2024年12月6日 ※初期の記事のため情報が古い可能性あり
- 画像の量: 豊富（約15枚。PowerShell実行画面、node -v確認、Developerモード有効化、設定画面、ハンマーアイコン、CSV生成デモ）
- 内容: filesystem MCPサーバーのインストール、claude_desktop_config.json編集、動作確認まで一連を画像付きで。
- Windows対応: ○ ／ 想定読者: 初心者〜エンジニア（初出が早く、UI表記は現行版と差異の可能性）

**クラスメソッド DevelopersIO「無料版でもOK！Claude Desktop でPCのファイルを操作する方法【filesystem MCP 設定手順】」**

- URL: <https://dev.classmethod.jp/articles/free-claude-desktop-filesystem-mcp-setup/>
- 媒体: 企業テックブログ ／ 公開日: 2026年3月4日
- 画像の量: 少なめ（スクショ3枚。テキスト＋JSON/PowerShellコード中心）
- 内容: 超初心者向け・Windows対象と明記。Node.js/npmの前提、無料版でも可、 設定画面から開く手順、 完全終了→再起動、runningの確認。  非エンジニア読者への配慮が厚い。
- Windows対応: ○（Mac補足あり）／ 想定読者: 超初心者向け（非エンジニア可）

**Zenn shomitei「Claude DesktopでFilesystem MCPを設定した話」**

- URL: <https://zenn.dev/shomitei/articles/claude-desktop-filesystem-mcp>
- 媒体: Zenn ／ 公開日: 2026年4月29日
- 画像の量: 未確認 ／ 内容: Windows環境でのFilesystem MCP設定と実際にハマったポイント。設定ファイルはメニューから開くのが確実、 commandにnpxのフルパス（例 `C:\Program Files\nodejs\npx.cmd`）を指定、ハンマーアイコンが出なくても実際に動くことがある等、Windows実践的な知見。
- Windows対応: ○ ／ 想定読者: エンジニア寄り（実体験ベース）

**Zenn rescuenow「Claude DesktopでMCPを使用する」**

- URL: <https://zenn.dev/rescuenow/articles/2bd9d3a7bca510>
- 媒体: Zenn（企業テックブログ）／ 内容: filesystem MCPのインストール、設定ファイルの場所（Windows/macOS両方）、 JSON記述例（`C:\\Test`）、完全終了→再起動まで簡潔にまとまっている。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: エンジニア向け

**note ゴマ団子ちゃん「Claude Desktop に MCP（filesystem / PowerShell実行）を追加する」**

- URL: <https://note.com/_gomadango/n/n5e83c42577c3>
- 媒体: note ／ 内容: filesystemに加えPowerShell実行MCPも追加する上級者向け。許可ディレクトリの絞り込みなどセキュリティ注意も。2026年3月追記でWindows-MCP拡張（GUI導入）にも言及。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: 上級者向け

**note しばぱぱ三上「Claude Desktopでローカルファイルを直接読ませる方法」**

- URL: <https://note.com/gugenkamikami/n/n0790d1d3e2d5>
- 媒体: note ／ 内容: MCP設定の意義（MCPなし/ありの比較表）とfilesystem設定。 ただしコード例はmacOSパス中心。
- 画像の量: 未確認 ／ Windows対応: △（Mac例が中心。Windowsへの読み替え必要）／ 想定読者: 初心者〜中級

**Snow System「【2026年版】Claude Desktop に MCP Server を設定する方法｜Windows対応・よくあるエラーと対処法」**

- URL: <https://snowsystem.net/ai/claude-desktop-mcp-server-setup/>
- 媒体: 個人／企業ブログ ／ 公開日: 2026年6月時点情報
- 画像の量: 未確認 ／ 内容: UI操作（拡張機能ワンクリック）と設定ファイル直接編集の2通り。`%APPDATA%\Claude`、バックスラッシュ二重化、完全終了→再起動、ハンマーアイコン確認、ログの場所まで。比較的新しく網羅的。
- Windows対応: ○ ／ 想定読者: 初心者向け

**Qiita toki_mwc「【Windows】Claude Desktop/CursorでMCPが動かない時の対処法と設定ファイルの正解」**

- URL: <https://qiita.com/toki_mwc/items/6e045969719c921053d1>
- 媒体: Qiita ／ 内容: PATH非継承問題（commandはフルパス指定）、バックスラッシュのエスケープ、uv.exeのフルパス指定など、 Windowsの典型的つまずきを解説。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: エンジニア向け

**Zenn sunwood_ai_labs（Maki）「Windows環境でのClaude Desktop MCP接続エラーの解決方法【2024.11.28】」**

- URL: <https://zenn.dev/sunwood_ai_labs/articles/fix-claude-desktop-mcp-windows-error>
- 媒体: Zenn ／ 公開日: 2024年11月28日 ※古いので情報鮮度に注意
- 画像の量: 未確認 ／ 内容: nodeでdist/index.jsを直接指定する回避策、バックスラッシュ二重化などの初期エラー対処。
- Windows対応: ○ ／ 想定読者: エンジニア向け

**infranexai「【Windows対応】Claude Desktopでfilesystem MCPを設定する方法｜OneDriveの実体パス・エラー対策」**

- URL: <https://infranexai.com/claude-mcp-windows-enable-onedrive-json/>
- 媒体: 個人ブログ（インフラエンジニア）／ 更新: 2026年8月24日
- 画像の量: 未確認 ／ 内容: OneDrive同期フォルダの実体パス問題、空テストフォルダから始める安全設計。 Windows特化・企業PC利用者への配慮あり。
- Windows対応: ○ ／ 想定読者: 初心者〜中級

### カテゴリ3：Claude Cowork／デスクトップアプリ全般のローカルフォルダ連携

**note ROROSUKE LABO「Claude Coworkが便利すぎる件｜ローカルファイル操作をAIに丸投げできる時代が来た」**

- URL: <https://note.com/rorosuke/n/n768febe111af>
- 媒体: note ／ 公開日: 2026年3月20日
- 画像の量: 豊富（約20枚）。ただし内容はインストール手順よりCoworkの使用例・成果物スクショが主体
- 内容: 作業フォルダの許可、PDF/カレンダー出力など実演。
- Windows対応: △（OS明記が弱く機能紹介中心）／ 想定読者: 非エンジニア向け

**Akashi_n Port「Claude for Windows（Cowork）をインストールしてみた — 開発者モード有効化からセットアップまで」**

- URL: <https://akashi-n.com/blog/Claude_for_Windows_Cowork_Install>
- 媒体: 個人ブログ ／ 公開日: 2026年2月14日（更新: 2026年2月23日）
- 画像の量: 普通〜やや豊富（8枚。プレビュー→チャットまで各ステップ1枚。エラー画面も画像付き）
- 内容: Windowsへのインストール手順を実スクショで。初回起動時のワークスペースエラー（`smol-bin.x64.vhdx` コピー時のリソース競合）と対処法も記載。
- Windows対応: ○ ／ 想定読者: エンジニア寄り

**Qiita Tadataka_Takahashi「Claude Cowork まとめ ― Windows版を試してみた」**

- URL: <https://qiita.com/Tadataka_Takahashi/items/1c89eaeb7130b6d00172>
- 媒体: Qiita ／ 内容: Coworkの概要（2026年1月12日リサーチプレビュー公開）、Chrome連携、対応タスク例、Windows版の位置づけ。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: エンジニア〜一般

**米澤社労士事務所「Claude Code（デスクトップ版）使いはじめの初期設定」**

- URL: <https://office-roumu1.com/claude-code-setup>
- 媒体: 個人（士業）ブログ ／ 内容: 作業フォルダの指定、CLAUDE.mdでのプロフィール・文体ルール・禁止事項の書き方、プライバシー設定オフ など、非エンジニアの実務目線。
- 画像の量: 未確認 ／ Windows対応: △（OS非依存の設定寄り）／ 想定読者: 非エンジニア向け

**GENAI「【2026年8月最新】Claude Codeデスクトップアプリ完全入門｜ターミナル不要で業務自動化」**

- URL: <https://genai-ai.co.jp/ai-kanri/blog/cc-yt-desktop-app-mastery-01/>
- 媒体: 企業ブログ ／ 公開日: 2026年8月 ／ 内容: デスクトップアプリ導入（Mac/Windows）、CLAUDE.mdなど初期設定3つ、業務フォルダ設計。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: 非エンジニア向け

**（参考・Cowork網羅記事、画像量は未確認）** ネクサフロー「Claude CoworkをWindowsで使う｜導入条件・設定・トラブル対応」（<https://nexaflow.io/blog/guide/claude-cowork-windows> ）は、Windows x64/arm64のreadiness check、仮想化設定、企業PCの権限・AppLocker・EDR・プロキシのつまずきに言及。start-link（<https://start-link.jp/hubspot-ai/claude-cowork-ai/claude-cowork-setup-guide> ）は「会社をフォルダで表現する」運用思想、webst8（<https://webst8.com/blog/claude-cowork/> ）はCoworkとClaude Codeの違いを整理。solab-works（<https://solab-works.com/claude-cowork-folder/> ）はWindows・Macのフォルダ管理ベストプラクティスを扱う。いずれも企業導入・運用設計の観点で有用。

### カテゴリ4：Windows特有のつまずきポイント

**Zenn shkybnzg「Claude CodeがWindowsで動かない？日本語ユーザー名とPATHの解決法」**

- URL: <https://zenn.dev/shkybnzg/articles/windows-claudecode-setup>
- 媒体: Zenn ／ 内容: 日本語ユーザー名（C:\Users\〇〇）でパスが壊れる問題、英語名の新規ローカルアカウントへの移行、 PATHが自動で通らない問題。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: 初心者〜中級

**Qiita imamu123「【備忘】【Claude Code】無言で落ちる！日本語(ユーザー名)×WindowsのACCESS_VIOLATION」**

- URL: <https://qiita.com/imamu123/items/f0faa786cc7e4e417bfd>
- 媒体: Qiita ／ 内容: 日本語ユーザー名環境でclaudeが無言でクラッシュ（ バイナリ未DL問題）。GitHub Issue #14902等を引用した原因究明。CoworkのGUI版と症状が異なる点も。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: エンジニア向け

**Zenn sora_biz「Claude Code が動かない時に見るページ（Windows）」**

- URL: <https://zenn.dev/sora_biz/articles/claude-code-windows-troubleshoot>
- 媒体: Zenn ／ 内容: Git Bashパス指定（`CLAUDE_CODE_GIT_BASH_PATH`）、/clear・/compact・/rewind、日本語文字化け対策など、Windowsの困りごとを網羅。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: 初心者〜中級

**crystal-method「Claude Code を日本語化する設定方法｜文字化け対策・実務活用ガイド」**

- URL: <https://crystal-method.com/blog/claude-code-japanese/>
- 媒体: 企業ブログ ／ 内容: 推奨ターミナル（Windows Terminal等）、Shift+Enterの複数行入力、 CLAUDE.mdでの言語指定。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: 初心者〜中級

**genai-ai「【2026年8月最新】Claude Codeは日本語で使える？設定方法・文字化け対処」**

- URL: <https://genai-ai.co.jp/ai-kanri/blog/cc-claude-japanese/>
- 媒体: 企業ブログ ／ 公開日: 2026年8月 ／ 内容: chcp 65001（UTF-8化）、PYTHONIOENCODING、 非エンジニア向けの日本語運用コツ。
- 画像の量: 未確認 ／ Windows対応: ○ ／ 想定読者: 非エンジニア向け

**fyve「Claude Codeが動かない・雑になった時の対処法」**

- URL: <https://fyve.co.jp/claude-code/articles/claude-code-troubleshooting-guide>
- 媒体: 企業ブログ ／ 内容: 日本語やスペースを含むパスでサンドボックスが誤動作、サイレント接続失敗、 WSLでは /mnt/c配下でなく /home配下で作業 などの実務知見。
- 画像の量: 未確認 ／ Windows対応: ○（WSL含む）／ 想定読者: 中級〜エンジニア

### 補足：CLAUDE.md の書き方（カテゴリ1・3に関連）

- サーバーワークス「CLAUDE.md の書き方ガイド」 <https://blog.serverworks.co.jp/claude-code-claudemd-guide>
- Zenn farstep「効果的なCLAUDE.mdの書き方」 <https://zenn.dev/farstep/articles/how-to-write-a-great-claude-md>
- Uravation「CLAUDE.mdの書き方｜何を書く・どこに置く・実例【2026年8月】」 <https://uravation.com/media/claude-md-writing-guide-templates-2026/>

これらは配置場所（組織／ユーザー／プロジェクト／ローカルの4層）や「1ファイル200行未満」の目安など公式ドキュメントに沿った内容。いずれも画像より本文・コード中心。

### 公式ドキュメント（Windows向け手順あり）

- **Claude Code Docs「Desktop application」（日本語）**: <https://code.claude.com/docs/ja/desktop> — Chat/Cowork/Codeの3タブ構成、WindowsではCodeタブ利用にGit for Windowsが必要、Windows x64/arm64インストーラのダウンロードリンク、環境（Local/Remote/SSH/WSL）とプロジェクトフォルダの選択 を解説。
- **Claude Code Docs「Advanced setup」（英語）**: code.claude.com/docs/en/setup — 「Option 1: Native Windows」を先頭に案内。PowerShell/CMDでのインストール、管理者権限不要、Git for Windowsは任意（無い場合はPowerShellツール経由でシェル実行）。npmパッケージはv2.1.198以降でNode.js 22以上が必要。
- **Anthropic Help Center「Getting Started with Local MCP Servers on Claude Desktop」（英語）**: <https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop> — Connectors／開発者設定、Desktop Extensions（ワンクリックのローカルMCP導入）。
- **Claude Help Center「Use connectors to extend Claude's capabilities」（英語）**: <https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities> — リモートMCPコネクタ （Anthropicのクラウドから接続）とローカルMCPの違い。
- **Model Context Protocol公式「Connect to local MCP servers」（英語）**: <https://modelcontextprotocol.io/docs/develop/connect-local-servers> — filesystemサーバーのargsでアクセス許可ディレクトリを指定する仕組み 、設定後の完全終了→再起動、Connectorsからの確認手順。

## Recommendations

**まず読むならこの順番（Windows・非エンジニア寄りの経営者向け）:**

1. **全体像の把握（公式）**: まず `code.claude.com/docs/ja/desktop` で、Claude Desktopに Chat / Cowork / Code の3タブがあること、 Code利用時はGit for Windowsが必要なことを確認する。ターミナルを避けたいなら37Design（非エンジニア経営者向け・3ルート比較）で自分に合う入り口を決める。
2. **デスクトップアプリ導入（画像豊富）**: note「くろちゃん」（約40枚）またはリベシティ「完全導入ガイドNo1」（約25枚）で、ダウンロード〜サインイン〜Cowork有効化までを画面付きで進める。
3. **MCPでローカルファイル連携（画像あり＋初心者配慮）**: クラスメソッドDevelopersIO（超初心者向け・Windows対象明記）で概念と手順を理解し、Qiita amatatsuk（画像約15枚）で実際の画面を照合する。ただし後者はUI表記が古い可能性があるため、Snow System（2026年6月）で最新のUI手順を必ず補う。
4. **Claude Code本体（CLI）を入れる場合（画像豊富）**: キウイ設計（約25枚、非エンジニア視点）またはZennホロラボ（ネイティブ手順・約12枚）。※Node.js要件など細部は公式（en/setup）で最新確認。
5. **つまずいたら**: 日本語ユーザー名問題はZenn shkybnzg／Qiita imamu123、パス・エスケープ・PATHはQiita toki_mwc、文字化けはgenai-ai、MSIX版の設定ファイル位置ずれはinfranexaiや公式Issueを参照。

**判断の目安（しきい値）:**

- 「ターミナルは避けたい」なら → Claude Desktop＋Cowork＋MCP filesystem（カテゴリ2・3）中心で十分。Claude Code（CLI）は後回しでよい。
- 「複数プロジェクトを本格運用したい／開発も視野」なら → Claude Code（ネイティブWindows。Git for Windowsを入れるとGit Bashが使えて機能が広がる）に進む。
- 記事の公開が2026年前半より前（特に2024〜2025年のMCP記事）の場合は、UIメニュー名・インストール方法・Node.js要件が現行と異なる前提で、必ず公式ドキュメントで最新手順を照合すること。

## Caveats

- 「画像の量」は調査担当が実際にページを開いて数えた結果に基づくが、サイトによっては後日画像が追加・削除される可能性がある。「未確認」と記した記事は本文の画像を直接数えていないため、画像付きと断定していない。
- リベシティ「【画像付き】WindowsにClaude Codeをインストールする方法」（01KMWN…）は調査時にページが404を返し取得できなかった。URLが失効・変更された可能性があるため、アクセスできない場合は同著者の「完全導入ガイドNo1」を代替とすること。
- **「Git for Windows必須」の記述に注意**: 多くの日本語記事がGit for Windowsを必須としているが、公式（en/setup）ではネイティブインストール時のGitは任意（Git Bashを有効化する目的）で、無い場合はPowerShellツールでシェルが実行される。ただしClaude DesktopのCodeタブ（セッション分離）を使う場合はGitが必要。用途で要否が変わる点に留意。
- **Node.jsのバージョン要件が変動している**: npmパッケージ経由の導入はv2.1.198以降でNode.js 22以上が必要（従来は18以降）。「Node.js 18」と書かれた記事は古い前提の可能性がある。ネイティブ／Homebrewインストーラはこの依存を回避できる。
- **MSIX（Microsoft Store）版の既知バグ**: 設定ファイルの実体が `AppData\Local\Packages\Claude_...\LocalCache\Roaming\Claude\` に置かれ、「Edit Config」が別ファイルを開いてMCPが無言で起動しないケースが報告されている（GitHub Issue #26073）。設定してもMCPが認識されないときはこの位置ずれを疑うこと。
- Claude Code・MCP・Coworkは2024年末〜2026年にかけて仕様変更が非常に速い。特にQiita amatatsuk（2024年12月）、Zenn sunwood_ai_labs（2024年11月）、Zennホロラボ（2025年7月）は公開時期が古く、UI名称・インストール方法が現行版と異なる可能性がある。
- 企業系網羅記事（SHIFT AI、Uravation、DotAI、ネクサフロー等）は情報量が多い一方、画像量を確認できていないものが多い。SEO目的の一般論的記述が含まれる場合があるため、手順の細部は公式ドキュメントで裏取りすることを推奨する。
- 一部のnote記事（しばぱぱ三上、tatsuki等）はMac向けコード例が混在する、またはOSの明記が弱い場合がある。Windows固有のパス表記（`%APPDATA%\Claude`、`\\`エスケープ）に読み替えて利用すること。
- カテゴリ3（Cowork）については、Windows向けに「インストール手順そのものを画像付きで」独立解説した記事は、Akashi_n Port（8枚）を除くと現時点では限られる。多くはCoworkの機能紹介・活用例が主体である点に留意。
