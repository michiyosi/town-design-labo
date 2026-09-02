/* 場面: 13年の道（/life/ の内容を歩く）。../road/engine.js より先に読む
   ・章の板は road.html にある。ここでは街と、道ぞいの標識（年表）を組む
   ・年 → 道の位置 の対応表で、企画364件から拾った32件を道ぞいに立てる */
(function(){
'use strict';

/* 年表。/life/ の結びにある「13年でやってきたこと」の代表32件 */
var EVENTS = [
 [2015,'海図ワークショップ'],[2015,'宮島口マルシェ'],[2015,'ポートマルシェ（Port marche）',2023],[2015,'ポートマルシェ 出店者サポート／創業支援の場づくり',2016],
 [2016,'さとやま未来博2017 説明会'],[2016,'グランピング候補地・物産施設の視察'],[2016,'街中グランピング（広島市街地）'],[2016,'大野地域 新春懇談会'],[2016,'西の森フェスタ',2019],
 [2017,'宮浜温泉×グランピング×夜桜'],[2017,'大野みんなのまつり「子供商店街」'],[2017,'廿学（はつがく）',2019],[2017,'Mono/Coto market',2019],
 [2018,'Free Food Project'],[2018,'緊急登庁保育支援'],[2018,'岩倉グランピングフェス',2019],
 [2019,'ONEDAY MARKET',2020],[2019,'HIROSHIMA学生応援PROJECT',2020],
 [2020,'オンライン自宅学習支援「ハウスタ！」'],[2020,'おけいこハウス お教室',2022],[2020,'学生応援プロジェクト（飲食版・美容版）',2021],
 [2021,'災害対応型モビリティの構想'],[2021,'佐伯・吉和エリア観光看板の設置'],[2021,'学生応援プロジェクト【美容版】'],[2021,'子育て世代の働き方支援'],[2021,'吉和ココから塾 つながるトーク'],[2021,'事業再構築補助金活用セミナー'],[2021,'前副市長との懇談・東京と広島を結ぶ新規事業',2022],
 [2022,'新規事業開発の講演会（渡瀬ひろみさん招へい）'],[2022,'『論語と算盤』講演会・会合'],[2022,'空家の学校'],
 [2024,'災害対応型モビリティ（能登の教訓）']
];
/* 年 → 道の位置（単位）。章の板の位置に合わせてある */
var YX = [[2011.5,200],[2013.7,300],[2015,400],[2016,520],[2017.5,650],[2018.5,760],[2020,860],[2021,910],[2024,1060],[2026,1150]];
function yearX(y){
 for(var i=1;i<YX.length;i++){ if(y <= YX[i][0]){ var a = YX[i-1], b = YX[i]; return a[1] + (b[1]-a[1]) * (y - a[0]) / (b[0]-a[0]); } }
 return YX[YX.length-1][1];
}
/* 標識を #cards に足す。年順に並べ、前の標識から18単位は離す。2列に互い違いで、章の板の反対側に立てる */
(function signs(){
 var wrap = document.getElementById('cards'); if(!wrap) return;
 var st = [].slice.call(wrap.querySelectorAll('.card:not(.sign)')).map(function(el){ return {x:+el.dataset.x, side:el.dataset.side}; });
 function oppositeOf(x){
  var best = null, d = 1e9;
  for(var k=0;k<st.length;k++){ var dd = Math.abs(st[k].x - x); if(dd < d){ d = dd; best = st[k]; } }
  return (best && best.side === 'l') ? 'r' : 'l';
 }
 var ev = EVENTS.slice().sort(function(a,b){ return a[0]-b[0]; });
 var last = -1e9, i, e;
 for(i=0;i<ev.length;i++){
  e = ev[i];
  var x = Math.max(Math.round(yearX(e[0]) - 8), last + 18); last = x;
  var side = oppositeOf(x), zz = 40 + 12 * (i % 2);
  var el = document.createElement('div');
  el.className = 'card sign'; el.dataset.x = x; el.dataset.side = side; el.dataset.z = side === 'r' ? -zz : zz;
  el.innerHTML = '<div class="in"><span class="yr">' + e[0] + (e[2] ? '–' + String(e[2]).slice(2) : '') + '</span>' + e[1] + '</div>';
  wrap.appendChild(el);
 }
})();

var PHOTOS = [{"ch": 0, "src": "img/001-c45656f9.jpg", "cap": "一年ぶりの動物園。久しぶりのキリンに、子供たちがびびっていた"}, {"ch": 0, "src": "img/005-2d00680a.jpg", "cap": "宮島の水族館。この日の投稿を最後に、記録が20か月止まる"}, {"ch": 0, "src": "img/007-421b837c.jpg", "cap": "宮島町。この日はプラレールからの宮島だった"}, {"ch": 1, "src": "img/038-7c30a223.jpg", "cap": "家族と。"}, {"ch": 2, "src": "img/040-a32daad8.jpg", "cap": "アルパークのすぐ近く、WOODPROさんの横。使われていない施設の一角が、市場になりました。"}, {"ch": 2, "src": "img/044-5a91ad4e.jpg", "cap": "出店者と、来てくれた人。"}, {"ch": 2, "src": "img/050-2c1a5da6.jpg", "cap": "まず一枚のチラシから。作り手が集まる日を、自分で決めた。"}, {"ch": 2, "src": "wall/g0108-a1457003.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 3, "src": "img/116-c1b8771d.jpg", "cap": "設営スタートの日。会場の岩倉キャンプ場は、ほんとうに何もない原っぱだった。"}, {"ch": 3, "src": "img/120-50eb62da.jpg", "cap": "WOODPROの足場板でランウェイを通し、キャンドルを並べた。"}, {"ch": 3, "src": "img/122-fc9c50ea.jpg", "cap": "2016年8月27日、本番の夜。原っぱが、この姿になった。"}, {"ch": 3, "src": "wall/g0112-f63a72f3.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 4, "src": "img/295-49d8cde9.jpg", "cap": "材はここから来る。山を下りた木が、次の役目を待っている。"}, {"ch": 4, "src": "img/301-f1c6fd9c.jpg", "cap": "積まれていた板が、床になる。使い道は、こちらで決める。"}, {"ch": 4, "src": "img/303-c1de47ad.jpg", "cap": "一軒ずつ直すより早い方法。空き家の直し方を、人に渡す。"}, {"ch": 4, "src": "wall/g0124-720ad9ed.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 5, "src": "img/400-7178f3f0.jpg", "cap": "水を提げて、階段を上る。給水所へ行けない人の家まで、一軒ずつ。"}, {"ch": 5, "src": "img/402-e723ab37.jpg", "cap": "軽トラックに生活用水。毎日1000リットル近くを配った。"}, {"ch": 5, "src": "img/408-30f7e545.jpg", "cap": "配ったのは支援ではなく、ふつうに旨い一皿だった"}, {"ch": 5, "src": "wall/g0136-670493b9.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 6, "src": "img/607-46c62a0c.jpg", "cap": "制作の現場で見た一台。キッチンカーの概念を覆す作品ばかりだった"}, {"ch": 6, "src": "img/613-660810e7.jpg", "cap": "屋根からバスケットゴールが飛び出す一台。こういうものが並んでいた"}, {"ch": 6, "src": "img/605-48b1fd54.jpg", "cap": "屋根の下で一台ずつ組み上げる。ここが製造の現場。"}, {"ch": 6, "src": "wall/g0148-cc5a096b.jpg", "cap": "この時期の集合写真", "g": 1}, {"ch": 7, "src": "img/749-5c329c1a.jpg", "cap": "僕です。まちの困りごとに、つくることで向き合っています。"}];
/* 章の停留所（埋め込みの章番号 → 道の位置と板の側） */
var STN = [[220,'l'],[330,'r'],[440,'l'],[560,'r'],[680,'l'],[800,'r'],[940,'l'],[1080,'r']];
/* 写真の看板の置き場。板の周りの画面上の3か所（左上・真上・右）を決めて、道の座標に逆算する。
   画面 dx = (x - z)*8, dy = (x + z)*4 なので x = (dx/8 + dy/4)/2, z = (dy/4 - dx/8)/2 */
var SCR = [[-400,-380],[40,-520],[720,-120]];
var POSTS = [];   /* 街に立てる支柱の位置 */
(function posters(){
 var wrap = document.getElementById('cards'); if(!wrap) return;
 var byCh = {}, i;
 for(i=0;i<PHOTOS.length;i++){ (byCh[PHOTOS[i].ch] = byCh[PHOTOS[i].ch] || []).push(PHOTOS[i]); }
 for(var ch in byCh){
  var list = byCh[ch], st = STN[+ch], g = null, ms = [];
  for(i=0;i<list.length;i++){ if(list[i].g) g = list[i]; else ms.push(list[i]); }
  var pick = [ms[0], ms[1], g || ms[2]];
  for(i=0;i<3;i++){
   var ph = pick[i]; if(!ph) continue;
   var dx = SCR[i][0] * (st[1] === 'l' ? -1 : 1), dy = SCR[i][1] + 190;
   var x = st[0] + Math.round((dx/8 + dy/4)/2), z = (st[1] === 'r' ? -16 : 16) + Math.round((dy/4 - dx/8)/2);
   z = Math.max(-60, Math.min(60, z));
   var el = document.createElement('figure');
   el.className = 'card photo' + (ph.g ? ' group' : ''); el.dataset.x = x; el.dataset.z = z; el.dataset.side = 'p'; el.dataset.ch = ch;
   el.innerHTML = '<div class="in"><img data-src="' + ph.src + '" alt=""><figcaption>' + ph.cap + '</figcaption></div>';
   el.addEventListener('click', function(e){ var b = document.querySelector('a[data-win="index.html?ch=' + (+this.dataset.ch + 1) + '"]'); if(b){ e.preventDefault(); b.click(); } });
   wrap.appendChild(el);
   POSTS.push([x, z]);
  }
  /* 狭い画面では看板が板の裏に隠れるので、板の中に同じ写真の帯を入れる（CSSで幅により出し分け） */
  var btn = wrap.querySelector('a[data-win="index.html?ch=' + (+ch + 1) + '"]'), card = btn && btn.closest('.card');
  if(card){
   var strip = document.createElement('div'); strip.className = 'strip';
   for(i=0;i<3;i++){ if(pick[i]) strip.innerHTML += '<img data-src="' + pick[i].src + '" alt="' + pick[i].cap.replace(/"/g,'&quot;') + '">'; }
   var after = card.querySelector('.stats') || card.querySelector('.period') || card.querySelector('h2');
   after.parentNode.insertBefore(strip, after.nextSibling);
   strip.addEventListener('click', function(){ btn.click(); });
  }
 }
})();

window.ROAD_SCENE = {
 L: 1220,
 hero: null,
 /* 空白の章（2013.9〜2015.4）の地面だけ色が抜ける */
 tile: function(tx, tz, c){
  if(tx >= 37 && tx <= 48 && Math.abs(tz) >= 2) return ((tx+tz)&1) ? '#CBD2C3' : '#BFC7B7';
  return null;
 },
 build: function(api){
  var M = api.M, C = api.C, Model = api.Model, put = api.put, movers = api.movers, anim = api.anim, drift = api.drift, smoke = api.smoke, L = api.L, SEA_Y = api.SEA_Y;

  /* この道だけの物 */
  M.child = function(shirt, pants){
   var m = new Model();
   m.box(-1,0,-1,1,1,1,pants).box(0,0,-1,1,1,1,pants);
   m.box(-1,1,-1,2,2,2,shirt); m.box(-1,3,-1,2,2,2,C.skin); m.box(-1,5,-1,2,1,2,C.hair);
   return m;
  };
  M.giraffe = function(){
   var m = new Model(), y = C.yellow, b = C.brown;
   m.box(-4,0,-2,1,4,1,y).box(3,0,-2,1,4,1,y).box(-4,0,1,1,4,1,y).box(3,0,1,1,4,1,y);
   m.box(-4,4,-2,8,4,4,y);
   m.box(3,8,-1,2,6,2,y); m.box(3,14,-2,4,2,3,y); m.set(4,16,-1,b).set(6,16,-1,b);
   m.set(-2,5,1,b).set(1,6,1,b).set(-1,4,1,b).set(-3,7,-1,b).set(2,7,0,b).set(3,10,0,b).set(4,12,0,b);
   m.set(-5,6,0,b);
   return m;
  };
  M.well = function(){
   var m = new Model();
   m.box(-2,0,-2,4,2,4,C.gray); m.box(-1,1,-1,2,1,2,C.navy);
   m.box(-2,2,-2,1,5,1,C.brown).box(1,2,1,1,5,1,C.brown);
   m.box(-3,7,-3,6,1,6,C.roof); m.box(-2,8,-2,4,1,4,C.roof);
   return m;
  };
  M.tank = function(){ return new Model().box(-2,0,-2,4,4,4,C.blue).box(-1,4,-1,2,1,2,C.wht).set(1,2,1,C.glass); };
  M.office = function(){
   var m = new Model();
   m.box(-6,0,-5,12,14,10,'#B8C0CC');
   for(var f=0;f<4;f++){ var yy = 2+f*3; for(var i=0;i<5;i++){ m.box(-5+i*2, yy, 4, 1, 2, 1, C.glass); m.box(5, yy, -4+i*2, 1, 2, 1, C.glass); } }
   m.box(-1,0,4,2,3,1,C.ink); m.box(-6,14,-5,12,1,10,C.dgray); m.box(-1,15,-1,2,4,2,C.dgray);
   return m;
  };
  M.raincloud = function(){
   var m = new Model(), g = '#6B7A8C';
   m.box(-4,0,-1,8,2,3,g); m.box(-2,1,-2,5,2,5,g); m.box(1,0,0,5,2,2,g); m.box(-6,0,0,3,1,2,g);
   m.set(-3,-3,0,C.cyan).set(0,-2,1,C.cyan).set(3,-4,0,C.cyan).set(1,-5,-1,C.cyan).set(-1,-6,0,C.cyan);
   return m;
  };
  M.cake = function(){
   var m = new Model();
   m.box(-4,0,-4,8,1,8,C.wht); m.box(-3,1,-3,6,3,6,C.cream); m.box(-2,4,-2,4,2,4,C.pink);
   m.set(-1,6,-1,C.yellow).set(1,6,1,C.yellow).set(-1,7,-1,C.orange).set(1,7,1,C.orange);
   return m;
  };
  M.stage = function(){
   var m = new Model();
   m.box(-8,0,-4,16,2,8,C.wood); m.box(-8,2,-4,16,6,1,C.ink); m.box(-6,4,-4,4,2,1,C.lime).box(2,4,-4,4,2,1,C.cyan);
   m.box(-9,0,3,2,4,2,C.dgray).box(7,0,3,2,4,2,C.dgray);
   return m;
  };
  M.pallets = function(){
   var m = new Model();
   m.box(-4,0,-3,8,1,6,C.wood); m.box(-4,1,-3,8,1,6,C.brown); m.box(-3,2,-2,6,1,4,C.wood); m.box(-3,3,-2,6,1,4,C.brown);
   m.box(-2,4,-1,4,2,2,C.wood);
   return m;
  };
  var GL = {
   '1':['..#..','.##..','..#..','..#..','.###.'],
   '3':['####.','....#','.###.','....#','####.']
  };
  M.digit = function(ch, col){
   var m = new Model(), g = GL[ch];
   for(var r=0;r<g.length;r++) for(var c=0;c<g[r].length;c++) if(g[r][c]==='#') m.box(c*2-5, (g.length-1-r)*2, -1, 2, 2, 2, col);
   return m;
  };
  /* 写真の看板の支柱。板そのものは HTML で、この上に乗る */
  M.billboard = function(){
   var m = new Model();
   m.box(-13,0,0,2,10,1,C.brown).box(11,0,0,2,10,1,C.brown);
   m.box(-13,4,0,26,1,1,C.brown);
   m.box(-14,0,-1,4,1,3,C.dgray).box(10,0,-1,4,1,3,C.dgray);
   return m;
  };
  for(var pi=0; pi<POSTS.length; pi++) put(M.billboard(), POSTS[pi][0], POSTS[pi][1]);

  /* 出発点。海に鳥居、START */
  put(M.arch(C.lime), 60, 0);
  put(M.torii(), 4, -80, SEA_Y);
  put(M.sakura(), 40, 24); put(M.sakura(), 4, 30);
  put(M.house(C.cream, C.roof, 10, 8, 6), 8, 46); put(M.house(C.wht, C.slate, 12, 8, 6), 44, 44);
  put(M.person(C.blue, C.ink, null, 0), 30, 22); put(M.child(C.red, C.ink), 34, 22); put(M.child(C.yellow, C.ink), 37, 22);

  /* このページについて。13 の文字 */
  put(M.digit('1', C.ink), 132, 40); put(M.digit('3', C.lime), 148, 40);
  put(M.shop(C.wht, C.cyan, 12, 8, 6), 110, 46); put(M.bench(), 150, 20); put(M.tree(C.g3), 170, 30);

  /* はじまり。家と家族、動物園のキリン */
  put(M.house(C.cream, C.roof, 10, 8, 6), 200, -30); put(M.house(C.wht, C.slate, 10, 8, 7), 236, -46);
  put(M.person(C.blue, C.ink, null, 0), 214, -22); put(M.child(C.red, C.ink), 218, -22); put(M.child(C.yellow, C.brown), 221, -22);
  put(M.car(C.wht), 262, -24); put(M.giraffe(), 256, -44); put(M.tree(C.g3), 276, -32); put(M.bush(), 246, -30);

  /* 空白。色の抜けた地面に、ベンチと枯れ木と小さな店 */
  put(M.tree('#8A9A7B'), 330, 30); put(M.bench(), 352, 22); put(M.person(C.dgray, C.ink, null, 0), 354, 20);
  put(M.shop(C.cream, C.purple, 10, 8, 6), 376, 44);

  /* 再起動。マルシェと古材、のぼり */
  put(M.stall(C.red), 410, -28); put(M.stall(C.blue), 426, -32); put(M.stall(C.orange), 442, -28);
  put(M.pallets(), 470, -44); put(M.crate(), 478, -40); put(M.crate(), 474, -34);
  put(M.person(C.red, C.ink, null, 0), 414, -22); put(M.person(C.cyan, C.brown, null, 0), 430, -20); put(M.person(C.pink, C.ink, null, 0), 446, -22); put(M.person(C.lime, C.navy, C.yellow, 0), 452, -20);
  movers.push(anim([M.flagpole(0, C.orange), M.flagpole(1, C.orange)], 400, 0, -22, 3));
  movers.push(anim([M.flagpole(0, C.red), M.flagpole(1, C.red)], 458, 0, -24, 3));
  put(M.sign(C.red), 486, -20);

  /* 場をつくる。キャンプ場と、レインボー倉庫と、舞台 */
  put(M.tent(C.orange), 516, 30); put(M.tent(C.blue), 532, 44); put(M.lamp(), 524, 26);
  movers.push(anim([M.campfire(0), M.campfire(1)], 526, 0, 36, 6));
  put(M.pine(), 508, 48); put(M.pine(), 544, 56);
  put(M.warehouse(), 584, 46);
  put(M.stage(), 616, 28);
  put(M.person(C.yellow, C.ink, null, 0), 560, 22); put(M.person(C.purple, C.brown, null, 0), 566, 20); put(M.person(C.wht, C.navy, null, 0), 572, 22); put(M.person(C.red, C.ink, null, 0), 604, 22);

  /* 捨てられるものを、もう一度。廃材の森、空き家、会社 */
  put(M.pallets(), 640, -30); put(M.crate(), 648, -34); put(M.crate(), 652, -28); put(M.pallets(), 660, -40);
  put(M.house(C.cream, C.slate, 10, 8, 6), 684, -44); put(M.person(C.wht, C.ink, C.yellow, 0), 676, -24); put(M.person(C.lime, C.ink, C.brown, 0), 692, -22);
  put(M.sign(C.blue), 704, -20);
  put(M.shop(C.wht, C.lime, 12, 8, 6), 726, -42); put(M.tree(C.g3), 744, -30);

  /* 制度の外にいる人へ。雨雲、井戸、水、集会所のキッチンカーに並ぶ人、合同庁舎 */
  movers.push(drift([M.raincloud()], 760, 34, 26, 0.3, 740, 800));
  put(M.well(), 760, 30); put(M.tank(), 768, 22); put(M.tank(), 773, 22);
  put(M.kei(C.wood, C.red), 806, 30);
  for(var q=0;q<8;q++) put(q%3 ? M.person([C.red,C.blue,C.yellow,C.pink][q%4], C.ink, null, 0) : M.child([C.cyan,C.lime,C.orange][q%3], C.ink), 790 + q*3, 20);
  put(M.house(C.wht, C.slate, 12, 8, 6), 828, 46);
  put(M.office(), 866, 44); put(M.person(C.lime, C.ink, C.brown, 0), 858, 22); put(M.person(C.wht, C.navy, C.navy, 0), 864, 22);

  /* つくる側へ。初号機、カフェ、トレーラー、陸送 */
  put(M.kei(C.wood, C.red), 900, -24); put(M.foodtruck(C.orange), 924, -46);
  put(M.shop(C.cream, C.orange, 12, 8, 6), 946, -28); put(M.person(C.pink, C.ink, null, 0), 936, -20); put(M.person(C.cyan, C.brown, null, 0), 954, -22);
  put(M.trailer(), 976, -46); put(M.carrier(), 1006, -22); put(M.tree(C.g3), 1020, -34);

  /* いま。TDL の文字、ケーキ、家族、ゴール */
  put(M.letter('T', C.lime), 1040, 40); put(M.letter('D', C.cyan), 1056, 40); put(M.letter('L', C.orange), 1072, 40);
  put(M.cake(), 1060, 24);
  put(M.person(C.lime, C.ink, C.brown, 0), 1048, 20); put(M.person(C.pink, C.ink, null, 0), 1052, 20); put(M.person(C.blue, C.ink, null, 0), 1056, 20); put(M.person(C.yellow, C.brown, null, 0), 1044, 22);
  put(M.sakura(), 1090, 30); put(M.sakura(), 1100, 48);
  put(M.arch(C.yellow), 1140, 0);
  movers.push(anim([M.goalflag(0), M.goalflag(1)], 1150, 0, -12, 3));
 }
};
})();
