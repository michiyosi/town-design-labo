// deck.js — 石央商工会 DXマーケティングセミナー スライドの部品集（pptxgenjs）
// 使い方:
//   const D = require('/path/to/assets/deck.js');
//   const pres = D.newDeck();
//   D.cover(pres, {...}); const s = D.card(pres, {eyebrow, title}); D.chip(s, ...);
//   await pres.writeFile({ fileName: 'out.pptx' });

const pptxgen = require('pptxgenjs');

// ───────────────────────── デザイントークン ─────────────────────────
const T = {
  // 元デッキから抽出。変えない。
  PINK:       'D15881', // 見出し・強調・表紙背景
  PINK_SOFT:  'F6E8ED', // 薄ピンクのパネル
  PINK_TABLE: 'F5BDD6', // 表のヘッダー
  GREEN_BG:   'E2EFD9', // 本文スライドの背景（薄緑）
  BLUE_CHIP:  'BDD7EE', // 薄青のチップ（roundRect）
  BLUE:       '5B9BD5', // 濃青のラベルバー
  TEXT:       '333333', // 本文
  WHITE:      'FFFFFF',
  RED:        'C00000', // スクショの注目枠

  FONT_JP: '游ゴシック',  // 日本語本文。手元で無ければ Noto Sans JP でも可
  FONT_EN: 'Calibri',

  // A4横（元デッキと同じ）
  W: 10.83, H: 7.5,

  // 白カード（本文スライドの土台）
  CARD: { x: 0.37, y: 0.55, w: 10.1, h: 6.47, r: 0.05 },
};

// ───────────────────────── 基本 ─────────────────────────
function newDeck() {
  const pres = new pptxgen();
  pres.defineLayout({ name: 'A4L', width: T.W, height: T.H });
  pres.layout = 'A4L';
  pres.lang = 'ja-JP';
  return pres;
}

function txt(slide, text, o) {
  // 共通のテキスト追加。fontFace/色/太字のデフォルトを揃える
  slide.addText(text, Object.assign({
    fontFace: T.FONT_JP, color: T.TEXT, fontSize: 18,
    isTextBox: true, margin: 0.05, valign: 'top',
  }, o));
}

function slideNumber(slide, n) {
  if (n == null) return;
  txt(slide, String(n), { x: T.W - 1.0, y: T.H - 0.42, w: 0.7, h: 0.3, fontSize: 10, color: '888888', align: 'right' });
}

function logo(slide, logoPath) {
  // 右上のロゴ。元デッキでは 9.11, 0.2, 1.36x0.35
  if (!logoPath) return;
  slide.addImage({ path: logoPath, x: 9.11, y: 0.18, w: 1.36, h: 0.35 });
}

// ───────────────────────── スライド型 ─────────────────────────

// 表紙・締め・まとめ：ピンク一面
// opts: { organizer, title, subtitle, date, footerLogo, slideNo }
function cover(pres, o = {}) {
  const s = pres.addSlide();
  s.background = { color: T.PINK };
  if (o.organizer) txt(s, o.organizer, { x: 0.48, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: T.WHITE });
  // 白い角丸の枠線ボックス
  s.addShape(pres.ShapeType.roundRect, { x: 0.34, y: 2.17, w: 10.16, h: 2.77, rectRadius: 0.15, fill: { type: 'none' }, line: { color: T.WHITE, width: 2.75 } });
  const lines = [];
  if (o.title)    lines.push({ text: o.title,    options: { fontSize: 24, bold: true, color: T.WHITE, breakLine: true } });
  if (o.subtitle) lines.push({ text: o.subtitle, options: { fontSize: 14, bold: true, color: T.WHITE, breakLine: true } });
  if (o.headline) lines.push({ text: o.headline, options: { fontSize: 28, bold: true, color: T.WHITE } });
  s.addText(lines, { x: 0.6, y: 2.3, w: 9.6, h: 2.5, fontFace: T.FONT_JP, align: 'center', valign: 'middle', isTextBox: true });
  if (o.date) txt(s, o.date, { x: 3.45, y: 5.12, w: 3.93, h: 0.4, fontSize: 16, bold: true, color: T.WHITE, align: 'center' });
  if (o.footerLogo) s.addImage({ path: o.footerLogo, x: 3.63, y: 5.55, w: 3.57, h: 0.69 });
  else if (o.footerText) txt(s, o.footerText, { x: 2.5, y: 5.6, w: 5.8, h: 0.5, fontSize: 18, bold: true, color: T.WHITE, align: 'center' });
  slideNumber(s, o.slideNo);
  return s;
}

// 締めスライド（ピンク一面＋白枠の中に一言）
function closing(pres, o = {}) {
  const s = pres.addSlide();
  s.background = { color: T.PINK };
  s.addShape(pres.ShapeType.roundRect, { x: 1.03, y: 3.0, w: 8.8, h: 1.65, rectRadius: 0.15, fill: { type: 'none' }, line: { color: T.WHITE, width: 2.75 } });
  txt(s, o.text || '', { x: 1.3, y: 3.15, w: 8.3, h: 1.4, fontSize: 28, bold: true, color: T.WHITE, align: 'center', valign: 'middle' });
  if (o.footerLogo) s.addImage({ path: o.footerLogo, x: 3.76, y: 5.6, w: 2.65, h: 0.69 });
  else if (o.footerText) txt(s, o.footerText, { x: 2.5, y: 5.6, w: 5.8, h: 0.5, fontSize: 18, bold: true, color: T.WHITE, align: 'center' });
  slideNumber(s, o.slideNo);
  return s;
}

// 本文スライド：薄緑背景＋白カード。eyebrow（小見出し24pt）と title（40pt）は任意
// opts: { eyebrow, title, logo, slideNo }
function card(pres, o = {}) {
  const s = pres.addSlide();
  s.background = { color: T.GREEN_BG };
  const c = T.CARD;
  s.addShape(pres.ShapeType.roundRect, { x: c.x, y: c.y, w: c.w, h: c.h, rectRadius: c.r, fill: { color: T.WHITE }, line: { type: 'none' } });
  logo(s, o.logo);
  let y = 0.85;
  if (o.eyebrow) { txt(s, o.eyebrow, { x: 0.6, y, w: 8.76, h: 0.5, fontSize: 24, bold: true, color: T.PINK }); y += 0.7; }
  if (o.title)   { txt(s, o.title,   { x: 0.6, y, w: 9.4,  h: 0.8, fontSize: 40, bold: true, color: T.PINK }); y += 1.0; }
  s._nextY = y; // 部品側で「見出しの下」から置けるように
  slideNumber(s, o.slideNo);
  return s;
}

// ───────────────────────── 部品 ─────────────────────────

// 中央寄せの大きなピンク文（テーマ提示・問いかけ）。lines: string[]
function centerStatement(slide, lines, o = {}) {
  const items = lines.map((l, i) => ({ text: l, options: { breakLine: i < lines.length - 1 } }));
  slide.addText(items, Object.assign({
    x: 0.8, y: 1.2, w: 9.2, h: 5.0, fontFace: T.FONT_JP, fontSize: 32, bold: true, color: T.PINK,
    align: 'center', valign: 'middle', isTextBox: true, paraSpaceAfter: 14,
  }, o));
}

// 本文（黒・18pt）。string か string[]
function body(slide, text, o = {}) {
  const arr = Array.isArray(text) ? text : [text];
  const items = arr.map((l, i) => ({ text: l, options: { breakLine: i < arr.length - 1 } }));
  slide.addText(items, Object.assign({
    x: 0.8, y: slide._nextY || 2.0, w: 9.2, h: 4.0, fontFace: T.FONT_JP, fontSize: 18, color: T.TEXT,
    isTextBox: true, valign: 'top', paraSpaceAfter: 8,
  }, o));
}

// ①②③ の番号付き・ピンク太字（「今日から実践！」型）
function numberedPink(slide, items, o = {}) {
  const marks = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨'];
  const arr = items.map((t, i) => ({ text: `${marks[i]} ${t}`, options: { breakLine: i < items.length - 1 } }));
  slide.addText(arr, Object.assign({
    x: 0.82, y: slide._nextY || 2.0, w: 9.24, h: 3.9, fontFace: T.FONT_JP, fontSize: 28, bold: true, color: T.PINK,
    isTextBox: true, valign: 'top', paraSpaceAfter: 18,
  }, o));
}

// ☐ チェック型（まとめスライド）
function checklist(slide, items, o = {}) {
  const arr = items.map((t, i) => ({ text: `☐ ${t}`, options: { breakLine: i < items.length - 1 } }));
  slide.addText(arr, Object.assign({
    x: 0.8, y: slide._nextY || 2.0, w: 9.4, h: 4.0, fontFace: T.FONT_JP, fontSize: 28, bold: true, color: T.PINK,
    isTextBox: true, valign: 'top', paraSpaceAfter: 18,
  }, o));
}

// 薄青チップ（roundRect）。テキスト太字・黒
function chip(slide, text, x, y, w = 1.47, h = 0.78, o = {}) {
  slide.addText(text, Object.assign({
    shape: 'roundRect', rectRadius: 0.12, x, y, w, h,
    fill: { color: T.BLUE_CHIP }, line: { color: T.BLUE_CHIP },
    fontFace: T.FONT_JP, fontSize: 14, bold: true, color: '000000',
    align: 'center', valign: 'middle', isTextBox: true, margin: 0.03,
  }, o));
}

// ラベルバー（角なし・白文字）。color: 'pink' | 'blue'
function labelBar(slide, text, x, y, w = 1.75, h = 0.43, color = 'pink') {
  const c = color === 'blue' ? T.BLUE : T.PINK;
  slide.addText(text, {
    shape: 'rect', x, y, w, h, fill: { color: c }, line: { color: c },
    fontFace: T.FONT_JP, fontSize: 14, bold: true, color: T.WHITE,
    align: 'center', valign: 'middle', isTextBox: true, margin: 0.02,
  });
}

// 薄ピンクのパネル（チェック項目などを囲む）
function pinkPanel(slide, x, y, w, h) {
  slide.addShape('rect', { x, y, w, h, fill: { color: T.PINK_SOFT }, line: { type: 'none' } });
}

// 右向きの小さな緑三角（チップとチップの間の矢印）
function arrowTri(slide, x, y) {
  slide.addShape('triangle', { x, y, w: 0.28, h: 0.24, rotate: 90, fill: { color: '70AD47' }, line: { color: '70AD47' } });
}

// 3列の「数字 → 原因 → 改善」型テーブル（チップ＋矢印）。rows: [[a,b,c],...]
function chipFlowGrid(slide, headers, rows, o = {}) {
  const colX = [1.48, 4.18, 7.0];
  const top = o.y || slide._nextY || 1.24;
  headers.forEach((h, i) => labelBar(slide, h, colX[i] - 0.09, top, 1.75, 0.43, i === 1 ? 'blue' : 'pink'));
  rows.forEach((r, ri) => {
    const y = top + 0.55 + ri * 1.16;
    r.forEach((c, ci) => {
      const w = ci === 2 ? 1.9 : 1.47;
      chip(slide, c, colX[ci], y, w, 0.78, { fontSize: 12 });
      if (ci < 2) arrowTri(slide, colX[ci] + w + 0.45, y + 0.27);
    });
  });
}

// 横一列の流れ（チップ → チップ → チップ）。中央配置
function flowRow(slide, items, o = {}) {
  const w = o.w || 1.6, h = o.h || 0.78, gap = 0.55;
  const total = items.length * w + (items.length - 1) * gap;
  let x = (T.W - total) / 2;
  const y = o.y || ((slide._nextY || 1.5) + 1.2);
  items.forEach((t, i) => {
    chip(slide, t, x, y, w, h, { fontSize: o.fontSize || 14 });
    if (i < items.length - 1) arrowTri(slide, x + w + 0.13, y + h / 2 - 0.12);
    x += w + gap;
  });
}

// ピンクヘッダーの表（改善策の例 型）。rows[0] がヘッダー
function pinkTable(slide, rows, o = {}) {
  const data = rows.map((r, ri) => r.map(cell => ({
    text: cell,
    options: ri === 0
      ? { fill: { color: T.PINK_TABLE }, bold: true, align: 'center', color: '000000' }
      : { color: T.TEXT },
  })));
  slide.addTable(data, Object.assign({
    x: 0.76, y: slide._nextY || 1.9, w: 9.34, fontFace: T.FONT_JP, fontSize: 12,
    border: { type: 'solid', color: 'BFBFBF', pt: 0.75 }, valign: 'middle', margin: 0.05,
    rowH: o.rowH || 0.55,
  }, o));
}

// ワークシート（白背景・罫線の表）。label列＋記入欄
function worksheet(pres, o = {}) {
  const s = pres.addSlide();
  s.background = { color: T.WHITE };
  txt(s, `${o.title || 'ワークシート'}　　　事業者名（　　　　　　　　　　）`, { x: 0.21, y: 0.4, w: 10.4, h: 0.4, fontSize: 16, bold: true });
  const rows = (o.rows || []).map(r => [
    { text: r.label, options: { bold: true, fill: { color: 'F2F2F2' }, fontSize: 14 } },
    { text: r.hint || '', options: { fontSize: 10, color: '888888' } },
  ]);
  s.addTable(rows, { x: 0.21, y: 1.0, w: 10.42, colW: [2.2, 8.22], fontFace: T.FONT_JP, border: { type: 'solid', color: '000000', pt: 0.75 }, rowH: o.rowH || 1.0, valign: 'top', margin: 0.06 });
  slideNumber(s, o.slideNo);
  return s;
}

// スクショの上に赤枠（元デッキの注目マーク）
function redBox(slide, x, y, w, h) {
  slide.addShape('rect', { x, y, w, h, fill: { type: 'none' }, line: { color: T.RED, width: 2 } });
}


// ───────────────────────── 後半用に追加した部品 ─────────────────────────
const fs = require('fs');

// 写真を「はみ出さずに埋める」で置く。無ければ灰色の枠＋ファイル名
function photoOrPlaceholder(slide, p, box, label) {
  if (p && fs.existsSync(p)) {
    slide.addImage({ path: p, x: box.x, y: box.y, w: box.w, h: box.h, sizing: { type: 'cover', w: box.w, h: box.h } });
    return true;
  }
  slide.addShape('rect', { x: box.x, y: box.y, w: box.w, h: box.h, fill: { color: 'F2F2F2' }, line: { color: 'BFBFBF', width: 0.75 } });
  txt(slide, `写真\n${label || ''}`, { x: box.x, y: box.y, w: box.w, h: box.h, fontSize: 12, color: '888888', align: 'center', valign: 'middle' });
  return false;
}

// PROFILE（元デッキ slide2, 3 と同型）。左に項目、右に写真
// o: { kind:'会社紹介'|'講師紹介', rows:[[label, value, h?]], photos:[{path,label}] (右に縦積み) | photo:{path,label} (右に1枚), slideNo }
function profile(pres, o = {}) {
  const s = card(pres, { logo: o.logo, slideNo: o.slideNo });
  txt(s, 'PROFILE', { x: 0.7, y: 0.78, w: 3.5, h: 0.6, fontFace: T.FONT_EN, fontSize: 28, bold: true, italic: true, color: T.PINK, charSpacing: 8 });
  if (o.kind) txt(s, o.kind, { x: 0.75, y: 1.3, w: 3, h: 0.3, fontSize: 11, bold: true, color: T.PINK });
  s.addShape('line', { x: 0.7, y: 1.62, w: 6.0, h: 0, line: { color: T.PINK, width: 1 } });
  let y = 1.85;
  (o.rows || []).forEach(([label, value, h]) => {
    const rh = h || 0.5;
    txt(s, label, { x: 0.75, y, w: 1.55, h: rh, fontSize: 14, bold: true });
    body(s, value, { x: 2.3, y, w: 4.5, h: rh, fontSize: 14, paraSpaceAfter: 2 });
    y += rh + 0.08;
  });
  if (o.photos && o.photos.length) {
    const n = o.photos.length, ph = n >= 3 ? 1.6 : 2.3, gap = 0.15;
    o.photos.forEach((p, i) => photoOrPlaceholder(s, p.path, { x: 7.15, y: 0.95 + i * (ph + gap), w: 3.0, h: ph }, p.label));
  } else if (o.photo) {
    photoOrPlaceholder(s, o.photo.path, { x: 6.95, y: 1.0, w: 3.25, h: 2.3 }, o.photo.label);
  }
  return s;
}

// 取り組み紹介：eyebrow＋大見出し＋左に写真・右に本文
// o: { eyebrow, title, photo, photoLabel, caption, lines, slideNo, notes }
function caseSlide(pres, o = {}) {
  const s = card(pres, { eyebrow: o.eyebrow, title: o.title, logo: o.logo, slideNo: o.slideNo });
  const y = s._nextY;
  const box = { x: 0.6, y, w: 4.6, h: 3.45 };
  photoOrPlaceholder(s, o.photo, box, o.photoLabel);
  if (o.caption) txt(s, o.caption, { x: box.x, y: box.y + box.h + 0.03, w: box.w, h: 0.3, fontSize: 10, color: '888888' });
  body(s, o.lines || [], { x: 5.5, y, w: 4.75, h: 3.8, fontSize: 16, paraSpaceAfter: 10 });
  if (o.notes) s.addNotes(o.notes);
  return s;
}

// 2列比較：ラベルバー（左＝青、右＝ピンク）＋本文
// left/right: { label, lines }
function twoColumn(slide, left, right, o = {}) {
  const y = o.y || slide._nextY || 2.0, colW = 4.5, xs = [0.7, 5.62];
  [left, right].forEach((c, i) => {
    labelBar(slide, c.label, xs[i], y, colW, 0.45, i === 0 ? 'blue' : 'pink');
    body(slide, c.lines, { x: xs[i], y: y + 0.6, w: colW, h: 3.5, fontSize: o.fontSize || 16, paraSpaceAfter: 6 });
  });
}

// 小さな前置き＋大きな一言（ピンク・中央）。sub があれば黒で補足
function bigLine(slide, small, big, o = {}) {
  txt(slide, small, { x: 0.8, y: 1.5, w: 9.2, h: 0.9, fontSize: 24, bold: true, color: T.PINK, align: 'center', valign: 'middle' });
  txt(slide, big, { x: 0.8, y: 2.6, w: 9.2, h: 2.3, fontSize: o.fontSize || 44, bold: true, color: T.PINK, align: 'center', valign: 'middle' });
  if (o.sub) body(slide, o.sub, { x: 0.8, y: 5.1, w: 9.2, h: 1.4, fontSize: 18, align: 'center' });
}

// まとめ（元デッキ slide27 と同型）：ピンク一面・白文字・☐ を白枠で囲む
// o: { eyebrow, title, items, footerText, slideNo }
function summary(pres, o = {}) {
  const s = pres.addSlide();
  s.background = { color: T.PINK };
  if (o.eyebrow) txt(s, o.eyebrow, { x: 0.97, y: 1.0, w: 8, h: 0.5, fontSize: 20, bold: true, color: T.WHITE });
  if (o.title) txt(s, o.title, { x: 0.97, y: 1.5, w: 9, h: 0.8, fontSize: 30, bold: true, color: T.WHITE });
  const items = (o.items || []).map((t, i) => ({ text: `☐ ${t}`, options: { breakLine: i < o.items.length - 1 } }));
  const bh = 0.75 + items.length * 0.72;
  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 2.5, w: 9.6, h: bh, rectRadius: 0.15, fill: { type: 'none' }, line: { color: T.WHITE, width: 2.75 } });
  s.addText(items, { x: 0.95, y: 2.75, w: 9.0, h: bh - 0.5, fontFace: T.FONT_JP, fontSize: 24, bold: true, color: T.WHITE, isTextBox: true, valign: 'top', paraSpaceAfter: 14 });
  if (o.footerText) txt(s, o.footerText, { x: 2.5, y: 6.55, w: 5.8, h: 0.4, fontSize: 14, bold: true, color: T.WHITE, align: 'center' });
  slideNumber(s, o.slideNo);
  return s;
}

module.exports = { T, newDeck, txt, cover, closing, card, centerStatement, body, numberedPink, checklist,
  chip, labelBar, pinkPanel, arrowTri, chipFlowGrid, flowRow, pinkTable, worksheet, redBox, slideNumber, logo,
  photoOrPlaceholder, profile, caseSlide, twoColumn, bigLine, summary };
