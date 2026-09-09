// 石央商工会 DXマーケティングセミナー【後半】当日の台本（Word）
// 使い方: node tools/build-daihon.js  → ../石央商工会DXセミナー_後半_台本.docx
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  Footer, PageNumber, LevelFormat, convertInchesToTwip,
} = require('docx');

const OUT = path.join(__dirname, '..', '..', '石央商工会DXセミナー_後半_台本.docx');
const JP = '游ゴシック';
const PINK = 'D15881';
const GRAY = '767676';
const CONTENT_W = 9638;           // A4縦 - 左右余白（1134×2）

const kids = [];
const P = (o) => kids.push(new Paragraph(o));

// 見出し（時間ブロック）
function block(time, mins, slides, title) {
  kids.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: PINK, space: 4 } },
    children: [
      new TextRun({ text: `${time}（${mins}分）　`, font: JP, size: 22, bold: true, color: GRAY }),
      new TextRun({ text: title, font: JP, size: 28, bold: true, color: PINK }),
      new TextRun({ text: `　スライド ${slides}`, font: JP, size: 20, bold: false, color: GRAY }),
    ],
  }));
}
// スライド見出し
function slide(no, title) {
  kids.push(new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 60 },
    children: [
      new TextRun({ text: `${no}`, font: JP, size: 22, bold: true, color: PINK }),
      new TextRun({ text: `　${title}`, font: JP, size: 22, bold: true, color: '333333' }),
    ],
    shading: { type: ShadingType.CLEAR, fill: 'F6E8ED' },
  }));
}
// 話すこと（台詞）
function say(text) {
  P({ spacing: { after: 80, line: 300 }, indent: { left: 340 },
      children: [new TextRun({ text: `「${text}」`, font: JP, size: 21, color: '222222' })] });
}
// ト書き（動き・注意）
function note(label, text) {
  P({ spacing: { after: 60, line: 280 }, indent: { left: 340 },
      children: [
        new TextRun({ text: `【${label}】`, font: JP, size: 19, bold: true, color: PINK }),
        new TextRun({ text: `　${text}`, font: JP, size: 19, color: '444444' }),
      ] });
}
// ふつうの段落
function body(text, o = {}) {
  P(Object.assign({ spacing: { after: 100, line: 300 },
    children: [new TextRun({ text, font: JP, size: 21, color: '222222' })] }, o));
}
function lead(text) {
  P({ spacing: { after: 120, line: 300 }, indent: { left: 340 },
      children: [new TextRun({ text, font: JP, size: 20, color: GRAY })] });
}
function cell(text, w, o = {}) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: o.head ? { type: ShadingType.CLEAR, fill: 'F5BDD6' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({
      text, font: JP, size: o.head ? 19 : 19, bold: !!o.head, color: '222222' })] })],
  });
}
function table(widths, rows) {
  kids.push(new Table({
    columnWidths: widths,
    width: { size: CONTENT_W, type: WidthType.DXA },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
      left:   { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
      right:  { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
      insideVertical:   { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
    },
    rows: rows.map((r, i) => new TableRow({
      tableHeader: i === 0,
      children: r.map((c, j) => cell(c, widths[j], { head: i === 0 })),
    })),
  }));
  P({ spacing: { after: 160 }, children: [] });
}
function bullets(items) {
  items.forEach(t => P({
    numbering: { reference: 'dot', level: 0 },
    spacing: { after: 60, line: 280 },
    children: [new TextRun({ text: t, font: JP, size: 20, color: '222222' })],
  }));
}

// ─────────────────────────── 表紙 ───────────────────────────
P({ spacing: { after: 60 }, children: [new TextRun({
  text: '石央商工会 DXマーケティングセミナー', font: JP, size: 24, bold: true, color: GRAY })] });
P({ spacing: { after: 200 }, children: [new TextRun({
  text: '【後半】当日の台本', font: JP, size: 44, bold: true, color: PINK })] });
table([2100, 7538], [
  ['項目', '内容'],
  ['日時', '2026年9月15日（火）15:00〜16:00（後半 60分）'],
  ['会場', '石央商工会 本所'],
  ['対象', '20名。SNSを使っている事業者。AIは未経験の想定'],
  ['担当', 'TOWN DESIGN LABO　ヤスムラ ミチヨシ'],
  ['前半', 'ハーストーリィプラス 福原潤子氏（Instagramの分析サイクル）'],
  ['スライド', 'DXマーケティング後半編.pdf（36枚）'],
  ['配布物', 'うちの店シート（35ページ）／ワークシート（36ページ）　各1枚ずつ'],
]);

body('この台本は、スライド1枚ずつに「話すこと」「動き」「注意」を書いたものです。' +
     '「　」の中はそのまま読める文章にしてありますが、読み上げる必要はありません。言いたいことの目安です。');
body('後半の芯はひとつだけです。参加者に「うちの店シート」を紙1枚書いて帰ってもらう。' +
     'それ以外は全部おまけなので、時間が押したら遠慮なく飛ばしてください。');

// ─────────────────────────── 時間割 ───────────────────────────
kids.push(new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: PINK, space: 4 } },
  children: [new TextRun({ text: '当日の流れ', font: JP, size: 28, bold: true, color: PINK })],
}));
table([1500, 700, 1200, 6238], [
  ['時刻', '分', 'スライド', '内容'],
  ['15:00', '5', '1–8', '自己紹介と、やっている4つのこと'],
  ['15:05', '4', '9–13', 'なぜ改善が続かないのか／手間を減らす話だけ'],
  ['15:09', '11', '14–17', 'AIはアルバイトさん／うちの店シート　＋ ワーク5分'],
  ['15:20', '10', '18–22', 'Geminiの開き方・頼み方・実演・直す3点'],
  ['15:30', '8', '23–26', '予約投稿　＋ 確認3分／月に1回1時間'],
  ['15:38', '2', '27', 'Googleマップのお店情報'],
  ['15:40', '10', '31', 'ワーク：変えたいことを動く形にする'],
  ['15:50', '5', '32', 'ペアで共有'],
  ['15:55', '5', '33–36', 'まとめ・締め・配布物の案内'],
  ['16:00', '—', '—', '終了'],
]);
lead('※ スライド28・29・30（Googleマップの手順／その次の道具／事例）は、時間が余ったときだけ使います。' +
     '基本は飛ばす前提で組んであります。');

// ─────────────────────────── 準備 ───────────────────────────
kids.push(new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: PINK, space: 4 } },
  children: [new TextRun({ text: '前日までの準備', font: JP, size: 28, bold: true, color: PINK })],
}));
bullets([
  '自分の店（KAZARI KITCHEN）で「うちの店シート」を1枚書いて、Geminiで実演を最初から最後まで1回通しておく。',
  'その実演の結果をスクリーンショットして印刷し、手元に置く。会場のWi-Fiが繋がらないときの差し替えになる。',
  'Instagramの予約投稿のボタン名（「詳細設定」「日時を指定」）を、当日の朝に自分のスマホで確認する。アプリの更新で変わることがある。',
  '配布物を印刷する。PDFの35ページ（うちの店シート）と36ページ（ワークシート）を、参加人数＋5枚。',
  'スライドはPDFを全画面で投影する。PowerPointは使わなくてよい。',
  'ペンを10本ほど持っていく。書くものを持ってきていない人が必ずいる。',
]);
body('さとうみどり氏（主催側窓口）に、事前に確認しておくこと：', { spacing: { before: 120, after: 60 } });
bullets([
  '会場のWi-Fiは使えるか。参加者も使えるか。',
  'スマホの画面を投影できるか（できなければ、実演は講師のスマホを手持ちで見せる）。',
  '机の配置。ペアで話せる並びか。',
  '参加者の業種と年齢層。飲食が多いか、物販が多いかで例え話を変える。',
  '配布資料の印刷は主催側か、こちらで持ち込むか。部数も。',
]);

// ─────────────────────────── 台本 ───────────────────────────
kids.push(new Paragraph({ children: [new TextRun({ text: '', font: JP })], pageBreakBefore: true }));

block('15:00', 5, '1–8', '自己紹介と、やっている4つのこと');
slide('スライド1', '表紙');
say('後半を担当します、TOWN DESIGN LABOのヤスムラミチヨシです。よろしくお願いします。');
say('前半、お疲れさまでした。数字の見方、たくさん出てきましたね。');
say('後半は、前半で見つけた「直したいこと」を、明日から実際に動かすところまで持っていきます。');
note('注意', '前半の内容には必ず一言触れる。別々の話ではなく、続きだと分かるようにする。');

slide('スライド2', 'PROFILE 会社紹介');
say('会社のことを30秒だけ。広島県廿日市市で、トレーラーハウスとキッチンカーを設計しています。');
say('あとは空き家の活用と、地域で商売を始めたい人の手伝いです。');
say('今日お話しするAIの話は、いちばん下の「AI実装部」でやっていることの、小さい版です。');
note('注意', '部署名は仮置き。実際の呼び方に直しておく。');

slide('スライド3', 'PROFILE 講師紹介');
say('私自身は、もともと東京でアパレルの本部にいて、広報とウェブの担当をしていました。2014年に広島に戻って、いまの仕事をしています。');
say('趣味はCOTENラジオで歴史を聞くこと。やってみたいのは、ブータンに行くことです。');
note('注意', '趣味とやってみたい事は、場の空気をゆるめるためのもの。笑いが起きなくても気にせず次へ進む。');

slide('スライド4', 'やっていること（導入）');
say('キッチンカー、トレーラーハウス、空き家、AI。バラバラに見えますが、共通しているのは「大きく建てる前に、小さく試す」です。');
say('いきなり店を建てるのではなく、まず車で出してみる。今日の話も同じで、いきなり全部やらずに、小さく1回だけやってみる話です。');

slide('スライド5–8', '取り組み①〜④');
lead('4枚を1枚30秒ずつ。写真を見せながら、テンポよく。');
say('①キッチンカー。買う前に借りて試せる仕組みを貸しています。2022年に、固定の店と同じ範囲で営業できる車両を、西日本で最初に導入しました。');
say('②トレーラーハウス。「動かせる建築」です。基礎を打たないので早く始められて、あとから動かせます。');
say('③空き家。2014年からずっとやっています。誰も住まなくなった家でも、壊す前にまだできることがある、という考えです。');
say('④AIに自分の分身をつくる。AIに自分と会社のことを覚えさせて、説明や下書きを任せています。13年分の投稿を整理して、自分の記録サイトも作りました。');
say('今日やるのは、この④のいちばん小さい版です。');
note('注意', 'ここで5分。押していたら⑤〜⑦を各15秒に縮めて、④だけしっかり話す。');

block('15:05', 4, '9–13', 'なぜ改善が続かないのか');
slide('スライド9', '後半のテーマ');
say('では本題です。');
say('前半で「直したいこと」が見つかったと思います。でも、セミナーが終わって1週間経つと、たいてい元に戻ります。');
say('なぜ、改善が続かないのか。ここから話します。');

slide('スライド10', '挙手');
say('3つだけ聞かせてください。手を挙げてください。');
say('投稿の文章を考えるのに、10分以上かかる人？');
say('忙しくて、投稿が2週間以上空いたことがある人？');
say('AI、人工知能を使ったことがある人？');
note('動き', '3つを続けて聞かず、1つずつ間を取って、会場を見回す。');
note('注意', '3つめは手が挙がらない前提。少なければ「ありがとうございます。今日はゼロの方に合わせて話します」と言って安心させる。');

slide('スライド11', '1回あたりの手間');
say('続かない理由は、やる気でも、道具を知らないからでもありません。');
say('1回あたりの手間が、大きすぎるからです。');
say('文章を考えるのに30分、写真を選ぶのに10分。忙しい週に「今日はいいか」となる。一度止まると、再開が重い。');

slide('スライド12', '手間を減らす話だけ');
say('なので今日は、新しいアプリを増やす話はしません。1回あたりの手間を減らす。この話だけです。');

slide('スライド13', '身近なDX');
say('DXという言葉、大げさに聞こえますよね。やることは1つだけです。');
say('毎回その場で考えていたことを、一度書いて、使い回す。');
say('今日はその「一度書くもの」を、紙1枚で作って帰ってもらいます。');
note('注意', '「DX」という言葉はここで一度だけ言い換える。以降は「手間を減らす」で通す。');

block('15:09', 11, '14–17', 'AIはアルバイトさん／うちの店シート');
slide('スライド14', 'AIは、今日入ったアルバイトさん');
say('使う道具は1つ。AIです。Gemini、ジェミニというアプリを使います。');
say('AIは、今日入ったアルバイトさんだと思ってください。');
say('頭はいい。文章も書ける。調べものもできる。でも、うちの店のことは何も知らない。');
say('だから最初に、お店の説明書を1枚渡す。それだけです。');
say('そして、書いたものは店長が見てから出す。ここは変わりません。');
note('注意', 'この「アルバイトさん」のたとえを、以降ずっと使う。専門用語が出そうになったら、このたとえに戻す。');

slide('スライド15', '説明書なし／あり の比較');
say('説明書を渡さないで「お好み焼き屋の投稿文を書いて」と言うと、どこにでもある文章が出てきます。店の名前も場所も入っていない。直すのに時間がかかる。しかも次もまた、最初から説明することになります。');
say('説明書を貼ってから頼むと、店の名前も場所も入る。いつものお客さんに向いた言葉になる。直すのは値段と日付くらい。説明は最初の1回だけで済みます。');

slide('スライド16', 'うちの店シート 5項目');
say('その説明書が、これです。書くのは5つだけ。');
say('店の名前と場所。売っているもの。よく来るお客さん。よく言われること。文章の雰囲気。');
say('たとえば「よく来るお客さん」なら、近所の60代、でいいんです。「よく言われること」なら、出汁がやさしい、とか。それくらいで十分です。');

slide('スライド17', 'ワークタイム（5分）');
say('では、お手元の「うちの店シート」に書いてみてください。5分取ります。');
say('全部埋まらなくて大丈夫です。書けるところだけで、ちゃんと動きます。');
note('動き', '机を回る。手が止まっている人には「お客さんによく言われることって、何かありますか」と口で聞いて、こちらが代わりに書き込む。');
note('注意', '5分きっかりで止める。「残りは家で足せます」と言って次へ。ここで延ばすと後半が全部押す。');

block('15:20', 10, '18–22', 'Geminiの開き方・頼み方・実演');
slide('スライド18', 'Geminiを開く');
say('ここからは実際の画面です。手順は4つ。');
say('スマホでGeminiのアプリを入れる。無料です。Googleで「ジェミニ」と検索してもいいです。');
say('Googleのアカウントで入る。Gmailを使っている方は、それでそのまま入れます。');
say('下の入力欄に、話しかけるように文章を打つ。');
say('出てきた文章を、長押しでコピー。');
note('注意', 'Wi-Fiが不安なら、参加者に操作させず「見るだけ」にする。家でやってもらえばいい。');

slide('スライド19', '頼み方の型');
say('頼み方は、この形だけ覚えてください。');
say('シートの中身を貼る。そのあとに、頼みごとを書く。3案出してもらう。');
say('3案、というのがポイントです。1案だと直すしかないですが、3案あると選べます。選ぶのは店長の仕事です。');

slide('スライド20', '実演（3分）');
note('動き', '実際にその場でやる。手順を声に出しながら操作する。① シートを貼る ② 頼みごとを打つ ③ 出てきた3案を読み上げる。');
say('いま貼ったのが、私の店のシートです。そこに「今週の投稿文を3案」と足しました。');
say('……はい、出ました。3つ出ていますね。読んでみます。');
note('注意', '3分で切り上げる。うまくいかないときは、印刷しておいた出力例を見せて「本当はこう出ます」と進める。焦らない。');
note('注意', '変な文章が出たときは、むしろ好都合。「こういうことがあります。だから次のスライドが大事なんです」と、そのまま21へつなぐ。');

slide('スライド21', 'そのまま投稿しない。直すのは3つ');
say('ここがいちばん大事です。出てきた文章を、そのまま投稿しないでください。');
say('直すのは3つ。値段、日付、言い回し。');
say('AIは、値段や日付を「それらしく」作ってしまうことがあります。必ず自分の目で確認してください。');
say('言い回しは、自分の口ぐせに直す。それで「うちの店」の文章になります。');
say('書いたのはAI、出すのはあなたです。アルバイトさんが書いたPOPを、店長が見ないで貼らないですよね。それと同じです。');
note('注意', 'この1枚だけは、押していても絶対に飛ばさない。');

slide('スライド22', '30分 → 10分');
say('これで、1回30分かかっていたのが10分になります。');
say('浮いた20分は、お客さんの相手に使ってください。');

block('15:30', 8, '23–26', '忙しくても止まらない仕組み');
slide('スライド23', '止まらない仕組み');
say('もう1つ、忙しい週に止まらないための話です。');
say('「毎回その場で投稿する」を、やめます。月に1回、まとめて作って、予約しておく。');

slide('スライド24', 'Instagramで予約投稿');
say('Instagramの公式アプリだけでできます。別のアプリは要りません。');
say('いつも通り投稿を作って、投稿する前の画面で「詳細設定」をタップ。「日時を指定」をオンにして、日と時間を選ぶ。それで完了です。あとは自動で投稿されます。');
say('ストーリーズは予約できません。ふつうの投稿とリールだけです。');
note('注意', 'ボタンの名前はアプリの更新で変わる。当日の朝に自分のスマホで見て、違っていたらここで言い直す。');

slide('スライド25', '確認タイム（3分）');
say('自分のスマホで、「詳細設定」から「日時を指定」を探してみてください。3分取ります。');
say('見つけるだけでOKです。今日は投稿しなくて大丈夫です。');
note('動き', '机を回る。見つからない人には、自分の画面を横から見せる。');

slide('スライド26', '月に1回、1時間');
say('月に1回、1時間だけ確保してください。その1時間でやることが、この表です。');
say('今月のお知らせを書き出すのに10分。シートを貼って4週分の投稿文を頼むのに15分。値段と日付と言い回しを直すのに20分。写真を選んで4件を予約するのに15分。');
say('これで、その月は終わりです。');

block('15:38', 2, '27', 'Googleマップのお店情報');
slide('スライド27', 'Googleマップのお店情報を直す');
say('もう1つだけ。お客さんは、まず地図で探します。');
say('写真がない店、営業時間が古い店は、選ばれにくい。');
say('直すのは、写真3枚と営業時間だけです。外観、いちばん売れているもの、店内。この3枚を入れておいてください。');
note('注意', 'ここまでで15:40。押していたらこの1枚も飛ばして、すぐワークへ。' +
      'スライド28（手順）・29（その次の道具）・30（事例）は、時間が余ったときだけ。');

block('15:40', 10, '31', 'ワーク：変えたいことを動く形にする');
slide('スライド31', 'ワーク（10分）');
say('最後のワークです。10分取ります。');
say('前半で見つけた改善点を、1つ選んでください。');
say('次に、使う道具を1つ選ぶ。Gemini、予約投稿、Googleマップのどれかです。');
say('最後に、最初の一歩と、いつやるかを書く。');
say('「いつ」が書けたら合格です。日付まで入れてください。');
note('動き', '机を回る。「いつ」が空欄の人を優先して、その場で日付を決めてもらう。' +
      '「今週の定休日はいつですか」と聞くと決まりやすい。');
note('注意', '改善点が思いつかない人には「投稿が続かない」でいいと伝える。ゼロから考えさせない。');

block('15:50', 5, '32', 'ペアで共有');
slide('スライド32', 'ペアで共有（5分）');
say('隣の人に、書いたことを1つだけ話してください。');
say('「いつ、何をするか」だけでいいです。');
say('聞いた人は「それ、いつやるの？」と、一度だけ聞いてあげてください。');
note('注意', '奇数のときは講師が入る。「話したくない」という人がいたら無理強いしない。');

block('15:55', 5, '33–36', 'まとめ・締め');
slide('スライド33', '後半のまとめ');
say('後半のまとめです。道具を増やさず、手間を減らす。');
say('うちの店シートを1枚書く。シートを貼って、AIに下書きを3案。値段と日付と言い回しを直して、予約投稿。月に1回、1時間でまとめて作る。');
say('今日やってほしいのは、いちばん上の1つだけです。うちの店シートを1枚。もう書けている方は、それで十分です。');

slide('スライド34', '締め');
say('以上で後半を終わります。ありがとうございました。');

slide('スライド35・36', 'ワークシートの案内');
say('お手元の紙2枚は、持って帰ってください。');
say('1枚目が「うちの店シート」。次にAIに頼むとき、これを貼るだけで始められます。');
say('2枚目が、今日決めた日付です。冷蔵庫でも、レジの横でも、目に入るところに貼っておいてください。');
note('注意', '時間が余ったらここで質疑。余らなければ「あとで個別に聞いてください」と言って締める。');

// ─────────────────── うまくいかないとき ───────────────────
kids.push(new Paragraph({ children: [new TextRun({ text: '', font: JP })], pageBreakBefore: true }));
kids.push(new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: PINK, space: 4 } },
  children: [new TextRun({ text: 'うまくいかないときの差し替え', font: JP, size: 28, bold: true, color: PINK })],
}));
table([2600, 7038], [
  ['起きたこと', 'どうするか'],
  ['Wi-Fiが繋がらない／Geminiが開かない',
   '実演をやめて、印刷しておいた出力例を見せる。「本当はこう出ます。家でやってみてください」で先へ進む。参加者にも操作させない。'],
  ['Geminiが変な文章を出した',
   'そのまま見せる。「こういうことがあります。だから次が大事なんです」とスライド21（直す3点）につなぐ。慌てて隠さない。'],
  ['時間が押している（15:40の時点でスライド26より前）',
   'スライド27を飛ばして、すぐワーク（31）へ。ワークを7分、ペア共有を3分に縮める。まとめは必ず残す。'],
  ['時間が余った（15:38の時点でスライド27が終わっている）',
   'スライド28（Googleマップの手順）→29（その次の道具）の順で足す。事例（30）は中身が入っていれば使う。'],
  ['参加者が手を動かさない',
   '机を回って、1人ずつ口頭で聞き取り、こちらが代わりに書く。1人書けると周りが書き出す。'],
  ['「AIは難しそう」と言われた',
   '「今日は使えなくて大丈夫です。紙1枚だけ持って帰ってください」と返す。シートは手書きのメモとしても役に立つ、と伝える。'],
  ['スマホを持っていない参加者がいる',
   '実演は見るだけでよい、と最初に言っておく。シートは紙なので、全員が書ける。'],
]);

// ─────────────────── 言い換えの一覧 ───────────────────
kids.push(new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: PINK, space: 4 } },
  children: [new TextRun({ text: '使わない言葉／言い換え', font: JP, size: 28, bold: true, color: PINK })],
}));
body('参加者はAI未経験で、スマホは電話とLINEが中心という前提です。次の言葉は口に出さないようにします。');
table([3200, 6438], [
  ['使わない', '言い換える'],
  ['プロンプト', '頼み方／頼みごと'],
  ['キャプション', '投稿の文章'],
  ['Googleビジネスプロフィール', 'Googleマップのお店情報'],
  ['生成AI／LLM', 'AI（今日入ったアルバイトさん）'],
  ['アカウント連携／API', '（そもそも触れない）'],
  ['インプレッション、リーチ', '（前半で出た言葉なので、後半では使わない）'],
  ['DX', '手間を減らす（スライド13で一度だけ言い換えて、以降は使わない）'],
]);

// ─────────────────────────── 出力 ───────────────────────────
const doc = new Document({
  creator: 'TOWN DESIGN LABO',
  title: '石央商工会 DXマーケティングセミナー【後半】当日の台本',
  numbering: {
    config: [{
      reference: 'dot',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '●', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 460, hanging: 260 } },
                 run: { color: PINK, size: 16 } },
      }],
    }],
  },
  styles: {
    default: { document: { run: { font: JP, size: 21, color: '222222' } } },
  },
  sections: [{
    properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '石央商工会DXセミナー 後半 台本　', font: JP, size: 16, color: GRAY }),
        new TextRun({ children: [PageNumber.CURRENT], font: JP, size: 16, color: GRAY }),
      ],
    })] }) },
    children: kids,
  }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(OUT, b); console.log('→', OUT, (b.length/1024).toFixed(0) + 'KB'); });
