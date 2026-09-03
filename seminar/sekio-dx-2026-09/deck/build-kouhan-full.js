// 石央商工会 DXマーケティングセミナー【後半】スライド 36枚
// 実行: node build-kouhan-full.js  → ../DXマーケティング後半編.pptx
// 文言を直すときはこのファイルを直して、もう一度実行する。

const path = require('path');
const fs = require('fs');
const D = require('./deck.js');

const OUT = path.join(__dirname, '..', 'DXマーケティング後半編.pptx');
const SITE = path.join(__dirname, '..', '..', '..');        // リポジトリの根（towndesignlabo.jp の本体）
const PHOTOS = path.join(__dirname, 'assets', 'photos');

// assets/photos/ に置いた写真を優先。無ければサイトの写真を使う
function photo(name, fallback) {
  for (const ext of ['jpg', 'jpeg', 'png']) {
    const p = path.join(PHOTOS, `${name}.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return fallback ? path.join(SITE, fallback) : null;
}
const P = {
  kitchencar: photo('kitchencar', 'kazari-b-01.jpg'),
  trailer:    photo('trailer',    'CaGqL7fv3mc_01.jpg'),
  akiya:      photo('akiya',      'life/img/317-febd7827.jpg'),
  ai:         photo('ai',         null),
  yasumura:   photo('yasumura',   'director-sm.jpg'),
};

const FOOTER = 'TOWN DESIGN LABO';
let n = 0;
const no = () => ++n;

(async () => {
const pres = D.newDeck();
let s;

// 1 表紙
s = D.cover(pres, {
  organizer: '石央商工会主催',
  title: 'DXマーケティングセミナー',
  subtitle: '～マーケティングを活かした集客・売上アップのためのスマホひとつでできる！SNS活用法～',
  headline: '【後半】改善策を実行する 身近なDX',
  date: '2026 年 9 月 15 日 (火)',
  footerText: FOOTER, slideNo: no(),
});

// 2 PROFILE 会社紹介
s = D.profile(pres, {
  kind: '会社紹介',
  rows: [
    ['会社名', '株式会社TOWN DESIGN LABO\n（タウンデザインラボ）', 0.7],
    ['所在地', '〒739-0402\n広島県廿日市市対厳山2丁目16-53', 0.7],
    ['設立', '2018年5月', 0.4],
    ['事業内容', [
      '可動産部：トレーラーハウス・キッチンカーの企画設計、キッチンカーのシェア・開業支援（KAZARI KITCHEN）',
      'まちづくり部：空き家・空き地の利活用、地域の創業支援',
      'AI実装部：AIに「自分の分身」をつくり、説明・下書き・調べものを任せる仕組みづくり',
    ], 1.9],
    ['代表', '代表取締役　ヤスムラ ミチヨシ', 0.45],
  ],
  photos: [
    { path: P.kitchencar, label: 'kitchencar.jpg' },
    { path: P.trailer,    label: 'trailer.jpg' },
    { path: P.akiya,      label: 'akiya.jpg' },
  ],
  slideNo: no(),
});
s.addNotes('会社紹介は1分。部署名（可動産部／まちづくり部／AI実装部）は仮置き。実際の呼び方に直す。');

// 3 PROFILE 講師紹介
s = D.profile(pres, {
  kind: '講師紹介',
  rows: [
    ['名前', 'ヤスムラ ミチヨシ（安村 通芳）', 0.45],
    ['出身', '広島市（1984年生まれ）', 0.45],
    ['独立', '2014年 広島へUターン、KAZARI を創業\n2018年 TOWN DESIGN LABO を設立', 0.85],
    ['担当', 'キッチンカー・トレーラーハウスの設計と運用\nキッチンカーによる創業支援、空き家の利活用', 0.85],
    ['趣味', 'COTENラジオで歴史の勉強', 0.45],
    ['やってみたい事', 'ブータンへ旅行', 0.45],
  ],
  photo: { path: P.yasumura, label: 'yasumura.jpg' },
  slideNo: no(),
});
s.addNotes('自己紹介は1分。趣味とやってみたい事は、会場の空気をゆるめる用。深追いしない。');

// 4 TOWN DESIGN LABO がやっていること（導入）
s = D.card(pres, { slideNo: no() });
D.centerStatement(s, [
  'TOWN DESIGN LABO が やっていること',
  '',
  'キッチンカー　トレーラーハウス',
  '空き家　AI（自分の分身）',
  '',
  '共通しているのは',
  '「大きく建てる前に、小さく試す」',
], { fontSize: 30 });
s.addNotes('4つの取り組みを、写真で1枚ずつ。合計3分。「小さく試す」が後半の話（手間を減らして、まず1回やる）につながる。');

// 5–8 取り組み①〜④
D.caseSlide(pres, {
  eyebrow: '取り組み①', title: 'キッチンカー',
  photo: P.kitchencar, photoLabel: 'kitchencar.jpg', caption: 'KAZARI KITCHEN Type B（自社で設計・保有）',
  lines: [
    '買う前に、借りて試せるキッチンカー「KAZARI KITCHEN」',
    '2020年から。飲食で開業したい人が、最短1日から出店できる',
    '2022年、固定店舗と同じ範囲で営業できる車両を西日本で最初に導入',
    '設計から製造の手配、貸し出しの運用まで自社で',
  ],
  slideNo: no(),
  notes: '「買う前に試す」＝小さく試す、の1つ目。',
});
D.caseSlide(pres, {
  eyebrow: '取り組み②', title: 'トレーラーハウス',
  photo: P.trailer, photoLabel: 'trailer.jpg', caption: 'THE NOMAD 八ヶ岳（製造パートナー撮影）',
  lines: [
    '「動かせる建築」として、宿・店・事務所・別荘を設計',
    '基礎を打たず、車両のまま置く。だから早く、あとから動かせる',
    '法規（建築基準法・食品衛生法など）の確認から、製造の監修、引き渡し後まで',
    '対応エリアは関西・中国・四国・九州',
  ],
  slideNo: no(),
});
D.caseSlide(pres, {
  eyebrow: '取り組み③', title: '空き家',
  photo: P.akiya, photoLabel: 'akiya.jpg', caption: '空家の学校（廿日市市）',
  lines: [
    '2014年に広島へ戻ってから、空き家の利活用を続けてきた',
    '空家の学校／空家SHOP／遊休施設でのグランピング',
    '2018年、国土交通省のモデル事業に採択（廿日市市空き家0プロジェクト・事業管理者）',
    '「誰も住まなくなった家。壊す前に、まだできることがある」',
  ],
  slideNo: no(),
});
D.caseSlide(pres, {
  eyebrow: '取り組み④', title: 'AIに自分の分身をつくる',
  photo: P.ai, photoLabel: 'ai.jpg', caption: '',
  lines: [
    'AIに「自分」と「会社」のことを覚えさせて、説明・下書き・調べものを任せる',
    '13年分の投稿1,992件・写真8,633枚を整理して、自分の記録サイトをつくった',
    '会社の資料や実務ガイドの下書きも、AIと一緒につくっている',
    '今日お話しするのは、この「AIに覚えさせる」の いちばん小さい版',
  ],
  slideNo: no(),
  notes: '写真 ai.jpg は未配置。ここで「今日の話は、この一番小さい版」と言って後半の本題へ。',
});

// 9 後半のテーマ
s = D.card(pres, { slideNo: no() });
D.centerStatement(s, [
  '後半のテーマ',
  '「なぜ、改善が続かないのか？」',
  '',
  '前半で見つけた改善点を',
  '明日からも続く形にする',
]);
s.addNotes('前半（福原さん）の「数字→原因→仮説→改善」を受けて、「改善」を実際に動かす話だと位置づける。');

// 10 挙手
s = D.card(pres, { eyebrow: 'ちょっと聞かせてください（手を挙げてください）', slideNo: no() });
D.centerStatement(s, [
  '投稿の文章を考えるのに、10分以上かかる人？',
  '',
  '忙しくて、投稿が2週間以上空いたことがある人？',
  '',
  'AI（人工知能）を使ったことがある人？',
], { fontSize: 28, align: 'left', x: 1.0, y: 1.8, w: 9.0, h: 4.4 });
s.addNotes('3つ聞く。最後の「AIを使ったことがある人」は少ない前提。少なくて大丈夫、と言う。');

// 11 1回あたりの手間
s = D.card(pres, { slideNo: no() });
D.bigLine(s, '続かない理由は、やる気でも、道具でもない', '1回あたりの手間が\n大きすぎる', {
  sub: ['文章を考える30分　写真を選ぶ10分　「今日はいいか」', 'これが毎回だと、忙しい週に止まる。止まると再開が重い'],
});

// 12 だから手間を減らす話だけ
s = D.card(pres, { slideNo: no() });
D.centerStatement(s, [
  '今日の後半は',
  '新しい道具を増やす話は しません',
  '',
  '「1回あたりの手間を減らす」',
  'この話だけ',
]);

// 13 身近なDX＝毎回考えることを減らす
s = D.card(pres, { eyebrow: '身近なDXとは', title: '毎回考えることを、減らす', slideNo: no() });
D.flowRow(s, ['毎回ゼロから考える', '一度だけ書く', '毎回使い回す', '手間が減る'], { y: 3.2, w: 1.9, fontSize: 13 });
D.body(s, [
  'DX（デジタル化）というと大げさに聞こえますが、やることは1つ。',
  '「毎回その場で考えていたこと」を、一度書いて、使い回す。',
  '今日はその「一度書くもの」を、紙1枚で作って帰ります。',
], { y: 4.6, h: 2.0, fontSize: 18 });
s.addNotes('DXという言葉はここで一度だけ言い換える。以後は「手間を減らす」で通す。');

// 14 AIはアルバイトさん
s = D.card(pres, { eyebrow: '使う道具は1つ：AI（Gemini）', title: 'AIは、今日入ったアルバイトさん', slideNo: no() });
D.body(s, [
  '頭はいい。文章も書ける。調べものもできる。',
  'でも、うちの店のことは何も知らない。',
  '',
  'だから最初に「お店の説明書」を1枚渡す。それだけ。',
  '書いたものは、店長（あなた）が見てから出す。',
], { fontSize: 22 });
s.addNotes('通しのたとえ。以後「AI」は全部「アルバイトさん」で説明できる。アプリは Gemini 一本に固定（会場で迷わないため）。');

// 15 なし・あり比較
s = D.card(pres, { eyebrow: '「お店の説明書」があると、何が変わるか', slideNo: no() });
D.twoColumn(s,
  { label: '説明書なし', lines: [
    '「お好み焼き屋の投稿文を書いて」',
    '',
    '→ どこにでもある文章が出てくる',
    '→ 店の名前も場所も入っていない',
    '→ 直すのに時間がかかる',
    '→ 次もまた、最初から説明',
  ]},
  { label: '説明書あり', lines: [
    '説明書を貼って「今週の投稿文を3案」',
    '',
    '→ 店の名前・場所が入っている',
    '→ いつものお客さんに向いた言葉',
    '→ 直すのは、値段と日付くらい',
    '→ 説明は最初の1回だけ',
  ]},
  { y: 1.7 });

// 16 うちの店シート 5項目
s = D.card(pres, { eyebrow: 'お店の説明書 ＝「うちの店シート」', title: '書くのは、この5つだけ', slideNo: no() });
D.numberedPink(s, [
  '店の名前と場所',
  '売っているもの（いちばん出るもの）',
  'よく来るお客さん',
  'よく言われること（ほめ言葉）',
  '文章の雰囲気（きちんと／ふつう／親しみやすく）',
], { fontSize: 24, paraSpaceAfter: 12 });
s.addNotes('配布の「うちの店シート」（紙）と同じ5項目。例：「浜田の駅前のお好み焼き屋」「近所の60代」「出汁がやさしいと言われる」。');

// 17 ワークタイム
s = D.card(pres, { eyebrow: 'ワークタイム（5分）', slideNo: no() });
D.centerStatement(s, [
  '配った「うちの店シート」に',
  '5つを書いてみましょう',
  '',
  '書けるところだけで OK',
  '空欄があっても、ちゃんと動きます',
]);
s.addNotes('机を回って、詰まっている人には「よく言われること」だけ聞いて代わりに書く。');

// 18 Gemini の開き方
s = D.card(pres, { eyebrow: 'やってみよう①', title: 'Gemini（ジェミニ）を開く', slideNo: no() });
D.numberedPink(s, [
  'スマホで「Gemini」アプリを入れる（無料）。または Google で「Gemini」と検索',
  'Google のアカウントで入る（Gmail があれば、そのまま）',
  '下の入力欄に、話しかけるように文章を打つ',
  '出てきた文章を、長押しでコピー',
], { fontSize: 20, paraSpaceAfter: 14 });
s.addNotes('会場のWi-Fiが不安なら、講師のスマホを投影して見せるだけにする。参加者は家でやってもよい。');

// 19 頼み方の型
s = D.card(pres, { eyebrow: 'やってみよう②', title: '頼み方の型（これだけ覚える）', slideNo: no() });
D.flowRow(s, ['シートを貼る', '頼みごとを書く', '3案 出てくる'], { y: 2.7, w: 2.2, fontSize: 14 });
D.pinkPanel(s, 0.8, 3.75, 9.2, 2.7);
D.body(s, [
  '【うちの店シートの内容を貼る】',
  '',
  'このお店の Instagram の投稿文を、3案書いてください。',
  '今週のお知らせ：◯◯（例：新メニュー／定休日の変更／季節の品）',
  '長さは3行くらい。',
], { x: 1.0, y: 3.85, w: 8.8, h: 2.5, fontSize: 16, paraSpaceAfter: 4 });
s.addNotes('「3案」がポイント。1案だと直すしかないが、3案なら選べる。選ぶのは店長の仕事。');

// 20 実演
s = D.card(pres, { eyebrow: '実演', slideNo: no() });
D.centerStatement(s, [
  '講師のスマホで、その場でやってみます',
  '',
  'シートを貼る → 頼みごと → 3案',
  '',
  '（つながらないときは、紙で説明します）',
], { fontSize: 28 });
s.addNotes('実演の手順と、失敗したときの差し替えは実務マニュアル v3 を参照。事前に自分の店で1回やって、結果のスクショを保険に持っておく。');

// 21 そのまま投稿しない
s = D.card(pres, { eyebrow: 'ここが いちばん大事', title: 'そのまま投稿しない。直すのは3つ', slideNo: no() });
D.flowRow(s, ['値段', '日付・時間', '言い回し'], { y: 2.85, w: 1.9, fontSize: 16 });
D.body(s, [
  'AI は、値段や日付を「それらしく」作ってしまうことがある。必ず自分の目で確認',
  '言い回しは、自分の口ぐせに直す。それで「うちの店」の文章になる',
  '直したら、店長の目で最終確認をして投稿。書いたのは AI、出すのはあなた',
], { y: 4.1, h: 2.5, fontSize: 18 });
s.addNotes('アルバイトさんの書いた POP を、店長が見ずに貼らない、と同じ。');

// 22 30分→10分
s = D.card(pres, { slideNo: no() });
D.bigLine(s, '1回の投稿にかかる時間', '30分 → 10分', {
  sub: ['AI が下書き（1分）＋ 直す（5分）＋ 写真を選ぶ（4分）', '浮いた20分を、お客さんの相手に'],
});

// 23 忙しくても止まらない仕組み
s = D.card(pres, { slideNo: no() });
D.centerStatement(s, [
  '忙しくても、止まらない仕組み',
  '',
  '「毎回その場で投稿」を やめる',
  '',
  '月に1回、まとめて作って、予約しておく',
]);

// 24 予約投稿の手順
s = D.card(pres, { eyebrow: 'やってみよう③　公式アプリだけで OK', title: 'Instagram で予約投稿', slideNo: no() });
D.numberedPink(s, [
  'いつも通り、投稿を作る（写真 → 文章）',
  '投稿する前の画面で「詳細設定」をタップ',
  '「日時を指定」をオンにして、投稿したい日と時間を選ぶ',
  '「日時指定」をタップして完了。あとは自動で投稿される',
], { fontSize: 20, paraSpaceAfter: 14 });
D.body(s, ['※ ストーリーズは予約できません（フィード投稿・リールのみ）。別のアプリは要りません'], { y: 6.0, h: 0.6, fontSize: 14, color: '888888' });
s.addNotes('Meta Business Suite は不要。ボタンの文言はアプリの更新で変わることがあるので、当日朝に自分のスマホで確認する。');

// 25 予約投稿 確認タイム
s = D.card(pres, { eyebrow: 'ワークタイム（3分）', slideNo: no() });
D.centerStatement(s, [
  '自分のスマホで',
  '「詳細設定」→「日時を指定」を',
  '探してみましょう',
  '',
  '（見つけるだけで OK）',
  '今日は投稿しなくて大丈夫',
], { fontSize: 28 });

// 26 月1回1時間
s = D.card(pres, { eyebrow: '月に1回、1時間', title: 'その1時間で やること', slideNo: no() });
D.pinkTable(s, [
  ['やること', '時間', '使うもの'],
  ['今月のお知らせを書き出す（新メニュー・定休日・季節もの）', '10分', 'ワークシート'],
  ['うちの店シートを貼って、4週分の投稿文を AI に頼む', '15分', 'Gemini'],
  ['値段・日付・言い回しを直す', '20分', '自分の目'],
  ['写真を選んで、4件を予約投稿', '15分', 'Instagram'],
], { colW: [5.6, 1.4, 2.34], rowH: 0.62 });
s.addNotes('合計60分。忙しい週にゼロにならないのが目的で、週1回のペースは目安。');

// 27 Googleマップ ×3枚
s = D.card(pres, { eyebrow: '余裕が出てきたら①', title: 'Googleマップのお店情報を直す', slideNo: no() });
D.body(s, [
  'お客さんは、まず地図で探す。',
  '写真がない店・営業時間が古い店は、選ばれにくい。',
  '',
  '直すのは、写真3枚と営業時間だけ',
], { fontSize: 20, h: 2.4 });
D.flowRow(s, ['① 外観', '② いちばん売れているもの', '③ 店内（または自分）'], { y: 5.2, w: 2.4, fontSize: 13 });
s.addNotes('Googleビジネスプロフィール、という言葉は使わない。「Googleマップのお店情報」で通す。');

// 28 Googleマップ 手順
s = D.card(pres, { eyebrow: '余裕が出てきたら①　Googleマップ', title: 'お店情報を直す手順', slideNo: no() });
D.numberedPink(s, [
  'Google マップで、自分の店の名前を検索する',
  '「このビジネスのオーナーですか？」または「ビジネス情報を管理」をタップ',
  '写真を3枚追加する（外観・売れ筋・店内）',
  '営業時間・定休日が、今と同じか確認する',
], { fontSize: 20, paraSpaceAfter: 14 });
D.body(s, ['※ オーナー確認（ハガキや電話）が必要なことがあります。今日は「自分の店が出てくるか」だけ見ておく'], { y: 6.0, h: 0.6, fontSize: 14, color: '888888' });

// 29 余裕が出てきたら②
s = D.card(pres, { eyebrow: '余裕が出てきたら②', title: 'その次に手を出すなら', slideNo: no() });
D.pinkTable(s, [
  ['道具', '向いている店', '気をつけること'],
  ['LINE 公式アカウント（無料）', '常連さんが多い店。予約・お知らせを直接届けたい', '無料は月200通まで。友だち100人なら月2回で上限。超えた分の追加購入はできない'],
  ['Google マップの口コミ返信', '口コミが付き始めた店', 'AI に下書きを頼んでもよい。ただし必ず自分の言葉に直す'],
  ['Instagram のストーリーズ', '毎日、店にいる人', '予約はできない。当日の「今日の一品」向け'],
], { colW: [2.6, 3.0, 3.74], rowH: 0.9, fontSize: 12 });
s.addNotes('LINE 公式：2026-10-01 に有料プランの追加メッセージ料金が改定されるが、無料プラン（月200通）にはこの規模なら影響なし。');

// 30 事例
s = D.card(pres, { eyebrow: '実際にやってみた店', slideNo: no() });
D.chipFlowGrid(s, ['前', 'やったこと', '後'], [
  ['（事例1）', '（やったこと）', '（結果）'],
  ['（事例2）', '（やったこと）', '（結果）'],
  ['（事例3）', '（やったこと）', '（結果）'],
], { y: 1.7 });
D.body(s, ['数字は、自分で確認できるものだけ。「保存2倍」より「月3人の予約が8人に」のように、お客さんの数で'], { y: 5.6, h: 0.8, fontSize: 14, color: '888888' });
s.addNotes('事例3件は本人記入（未記入）。チップの文字は12ptなので、1枠12文字以内。');

// 31 ワーク
s = D.card(pres, { eyebrow: 'ワーク（10分）　ワークシート⑤', slideNo: no() });
D.centerStatement(s, [
  '「変えたいこと」を 動く形にする',
  '',
  '前半で見つけた改善点を、1つ選ぶ',
  '→ 使う道具を1つ選ぶ',
  '　（Gemini／予約投稿／Googleマップ）',
  '→ 最初の一歩と、いつやるか（日付）',
], { fontSize: 26, align: 'left', x: 0.9, y: 1.8, w: 9.3, h: 4.4 });
s.addNotes('配布のワークシート（⑤の日付）に書く。「いつ」が書けたら合格。');

// 32 ペア共有
s = D.card(pres, { eyebrow: 'ペアで共有（5分）', slideNo: no() });
D.centerStatement(s, [
  '隣の人に、書いたことを 1つ話す',
  '',
  '「いつ、何をするか」だけで OK',
  '',
  '聞いた人は',
  '「それ、いつやるの？」と 一度だけ聞く',
], { fontSize: 28 });

// 33 後半のまとめ
D.summary(pres, {
  eyebrow: '後半のまとめ',
  title: '道具を増やさず、手間を減らす',
  items: [
    'うちの店シートを 1枚書く（今日）',
    'シートを貼って、AI に下書きを3案',
    '値段・日付・言い回しを直して、予約投稿',
    '月に1回・1時間、まとめて作る',
  ],
  footerText: FOOTER, slideNo: no(),
});

// 34 締め
D.closing(pres, { text: '後半お疲れさまでした\nご清聴ありがとうございました', footerText: FOOTER, slideNo: no() });

// 35 ワークシート：うちの店シート
D.worksheet(pres, {
  title: 'うちの店シート',
  rows: [
    { label: '① 店の名前と場所', hint: '例）◯◯食堂／浜田駅から歩いて5分' },
    { label: '② 売っているもの\n（いちばん出るもの）', hint: '例）お好み焼き。いちばん出るのは「そば肉玉」' },
    { label: '③ よく来るお客さん', hint: '例）近所の60代、仕事帰りの人、土日は子連れ' },
    { label: '④ よく言われること\n（ほめ言葉）', hint: '例）出汁がやさしい／量が多い／店主と話すのが楽しみ' },
    { label: '⑤ 文章の雰囲気', hint: 'きちんと　／　ふつう　／　親しみやすく　（1つに◯）' },
  ],
  rowH: 1.08, slideNo: no(),
});

// 36 ワークシート：変えたいことを動く形にする
D.worksheet(pres, {
  title: '変えたいことを動く形にする ワークシート',
  rows: [
    { label: '① 前半で見つけた\n改善点', hint: '例）保存が少ない → 役立つ内容を増やす' },
    { label: '② 使う道具', hint: 'Gemini　／　予約投稿　／　Googleマップ　（1つに◯）' },
    { label: '③ 最初の一歩', hint: '例）うちの店シートを貼って、今週の投稿文を3案出す' },
    { label: '④ 誰と／どこで', hint: '例）自分ひとりで、閉店後の店で' },
    { label: '⑤ いつやる（日付）', hint: '例）9月20日（土）の閉店後　　→　できたか見る日：9月27日（土）' },
  ],
  rowH: 1.08, slideNo: no(),
});

await pres.writeFile({ fileName: OUT });
console.log(`書き出し: ${OUT}（${n}枚）`);
console.log('写真:', Object.entries(P).map(([k, v]) => `${k}=${v ? path.relative(SITE, v) : '（なし・枠のみ）'}`).join('  '));
})().catch(e => { console.error(e); process.exit(1); });
