/* 場面: 並木通り（広島市中区）。../road/engine.js より先に読む。
   3Dのまちづくりデータ（Unity のシーン）から読み取った寸法と構成を、
   ドット絵の等角の道に置き直したもの。
   ・南（平和大通り側）から北（本通り側）へ歩く
   ・道は3つに区切ってあり、A=現況 / B=再配分案2024 / C=案01_車OFF の断面を順に通る
   ・実際にはどれも同じ1本の道の案なので、並べて見比べられるようにしている */
(function(){
'use strict';

/* ---------- データから読み取った数字 ---------- */
var D = {
 len: 362.4,          // 中心線の長さ（m）
 deg: 13.9,           // 南北からのふれ
 rise: 1.26,          // 南端→北端の高低差（m）
 nodes: 5864,         // シーンの中の座標の数
 trees: 200,          // 木として登録されていたものの数
 hidden: 455          // 隠してある（案ごとに切り替える）かたまりの数
};

/* ---------- 道の割りつけ（単位） ---------- */
var L = 1200;
var X0 = 96, X1 = 1112;                       // 並木通りの南端・北端
var MPU = D.len / (X1 - X0);                  // 1単位＝約0.357m
var SEC = [['A', 96, 456], ['B', 488, 856], ['C', 888, 1112]];
var CROSS = [[40, 88], [456, 488], [856, 888], [1112, 1240]];   // 交差する道（北端は島のふちまで）

function within(x, a, b){ return x >= a && x < b; }
function crossing(x){ for(var i=0;i<CROSS.length;i++) if(within(x, CROSS[i][0], CROSS[i][1])) return true; return false; }
function sec(x){ for(var i=0;i<SEC.length;i++) if(within(x, SEC[i][1], SEC[i][2])) return SEC[i][0]; return null; }

/* ---------- 路面の色 ---------- */
var P = {
 walk1:'#C9C2B6', walk2:'#BFB8AB',            // いまの歩道
 wide1:'#E7E0CD', wide2:'#DBD3BE',            // 広げた歩道
 brick1:'#C08457', brick2:'#B3784E',          // レンガ（車を通さない案）
 lot1:'#CBD0D6',  lot2:'#C2C8D0',             // 沿道の敷地
 back1:'#B9C0C7', back2:'#B0B8C0',            // 奥の街区
 cross:'#767E88', road:'#6B7280', kerb:'#D6D1C6'
};

/* ---------- 標識の中身を、板の中の下書きから取り出して窓に渡す ---------- */
[].forEach.call(document.querySelectorAll('#cards [data-body]'), function(el){
 var src = document.getElementById(el.getAttribute('data-body'));
 if(!src) return;
 el.setAttribute('data-pop', src.innerHTML);
 el.setAttribute('data-pop-title', el.getAttribute('data-t') || '');
 if(el.classList.contains('sign')){ el.setAttribute('role', 'button'); el.tabIndex = 0; }
});

window.ROAD_SCENE = {
 L: L,
 pad: 200,
 auto: false,          // 並木・人・車はこの場面で組むので、既定の飾りは止める
 hero: {shirt:'#3B82F6', pants:'#1B2430', hat:null},

 /* 路面。tx は8単位のマス、tz は −8〜7（tz=−1,0 が車道）。
    帯の割りつけ：車道 → 歩道 → 沿道の敷地 → 奥の街区 → 川べりの緑 */
 tile: function(tx, tz, c){
  var x = tx * 8, s = sec(x), chk = (tx + tz) & 1;
  var road = (tz === -1 || tz === 0), walk = (tz === -2 || tz === 1);
  var lot  = (tz === -4 || tz === -3 || tz === 2 || tz === 3);
  var back = (tz === -6 || tz === -5 || tz === 4 || tz === 5);
  if(crossing(x)) return road ? P.road : (walk || lot ? P.cross : (back ? (chk ? P.back1 : P.back2) : null));
  if(back) return chk ? P.back1 : P.back2;
  if(!s) return lot ? (chk ? P.lot1 : P.lot2) : null;
  if(s === 'C' && (road || walk || tz === -3 || tz === 2)) return chk ? P.brick1 : P.brick2;
  if(s === 'B' && (walk || tz === -3 || tz === 2)) return chk ? P.wide1 : P.wide2;
  if(walk) return chk ? P.walk1 : P.walk2;
  if(lot) return chk ? P.lot1 : P.lot2;
  return null;
 },

 /* 白線。'none'＝引かない、数値＝車道の半分の幅 */
 mark: function(tx){
  var x = tx * 8, s = sec(x);
  if(crossing(x)) return 'none';
  if(s === 'C') return 'none';
  if(s === 'B') return 6;
  return null;
 },

 build: function(api){
  var M = api.M, C = api.C, Model = api.Model, put = api.put, movers = api.movers;
  var anim = api.anim, drift = api.drift, walker = api.walker, R = api.R;

  /* ================= この道だけの物 ================= */

  /* プラタナス（スズカケノキ）。幹のまだら模様が目印 */
  M.plane = function(big){
   var m = new Model(), bark = '#CFC9BA', spot = '#9A9C82', leaf = big ? '#5CBB4E' : '#63C458';
   var th = big ? 8 : 5;
   m.box(-1, 0, -1, 2, th, 2, bark);
   m.set(0, 2, -1, spot).set(-1, 3, 0, spot).set(0, 5, 0, spot).set(-1, th-1, -1, spot).set(0, 1, 0, spot);
   if(big){
    m.box(-5, th,   -5, 10, 2, 10, leaf);
    m.box(-6, th+2, -6, 12, 3, 12, leaf);
    m.box(-4, th+5, -4,  8, 2,  8, leaf);
    m.box(-2, th+7, -2,  4, 1,  4, leaf);
   } else {
    m.box(-3, th,   -3, 6, 3, 6, leaf);
    m.box(-4, th+2, -4, 8, 2, 8, leaf);
    m.box(-2, th+4, -2, 4, 1, 4, leaf);
   }
   return m;
  };
  /* 植樹桝。1本ずつ独立して立っている */
  M.pit = function(){
   var m = new Model(), stone = '#B9B3A6', soil = '#6E5A44';
   m.box(-3, 0, -3, 6, 1, 6, soil);
   m.box(-3, 0, -3, 6, 1, 1, stone).box(-3, 0, 2, 6, 1, 1, stone);
   m.box(-3, 0, -2, 1, 1, 4, stone).box(2, 0, -2, 1, 1, 4, stone);
   return m;
  };
  /* 街灯。腕木のついた背の高いもの */
  M.slamp = function(){
   var m = new Model(), po = '#585F68';
   m.box(0, 0, 0, 1, 13, 1, po);
   m.box(-1, 0, -1, 3, 1, 3, '#3F454C');
   m.box(0, 13, -3, 1, 1, 3, po); m.box(0, 13, 1, 1, 1, 3, po);
   m.box(-1, 12, -4, 3, 1, 2, po); m.box(-1, 12, 3, 3, 1, 2, po);
   m.box(-1, 11, -4, 3, 1, 2, C.yellow); m.box(-1, 11, 3, 3, 1, 2, C.yellow);
   return m;
  };
  /* パラソル */
  M.parasol = function(col){
   var m = new Model();
   m.box(-1, 0, -1, 3, 1, 3, C.dgray);
   m.box(0, 1, 0, 1, 7, 1, '#6B5D4C');
   m.box(-4, 8, -4, 9, 1, 9, col); m.box(-3, 9, -3, 7, 1, 7, col); m.box(-1, 10, -1, 3, 1, 3, col);
   m.set(0, 11, 0, C.wht);
   return m;
  };
  /* テーブルと椅子 */
  M.cafetable = function(){
   var m = new Model(), t = '#C8B79A';
   m.box(0, 0, 0, 1, 3, 1, C.dgray); m.box(-2, 3, -2, 5, 1, 5, t);
   m.box(-5, 0, -1, 2, 2, 2, C.dgray); m.box(-5, 2, -1, 1, 2, 2, C.dgray);
   m.box(4, 0, -1, 2, 2, 2, C.dgray); m.box(5, 2, -1, 1, 2, 2, C.dgray);
   return m;
  };
  /* パークレット。車道の端に張り出した木のデッキ */
  M.parklet = function(){
   var m = new Model(), deck = '#C09A6B', beam = '#8A6743';
   m.box(-9, 0, -5, 18, 1, 11, deck);
   m.box(-9, 1, -5, 18, 1, 1, beam); m.box(-9, 1, 5, 18, 1, 1, beam);
   m.box(-9, 1, -5, 1, 1, 11, beam); m.box(8, 1, -5, 1, 1, 11, beam);
   m.box(-9, 1, -5, 1, 4, 1, beam).box(8, 1, -5, 1, 4, 1, beam).box(-9, 4, -5, 18, 1, 1, beam);
   m.box(-7, 1, 2, 8, 1, 3, deck); m.box(-7, 2, 4, 8, 2, 1, deck);
   m.box(2, 1, -3, 6, 2, 6, '#8E7B63'); m.box(3, 3, -2, 4, 1, 4, C.g3); m.set(4, 4, -1, C.g1).set(6, 4, 1, C.g1);
   return m;
  };
  /* ボラード（車止め） */
  M.bollard = function(col){ return new Model().box(0, 0, 0, 1, 4, 1, col || '#585F68').set(0, 4, 0, C.wht); };
  /* 縁石 */
  M.kerb = function(len){ return new Model().box(0, 0, 0, len, 1, 1, P.kerb); };
  /* 車道から歩道へ取り返した2単位ぶん。一段上げて、内側を縁石にする */
  M.widen = function(len){
   var m = new Model();
   m.box(0, 0, 0, len, 1, 2, P.wide1);
   for(var i = 1; i < len; i += 2) m.box(i, 0, 0, 1, 1, 2, P.wide2);
   return m;
  };
  /* プランター（歩道の張り出し） */
  M.planter = function(){
   var m = new Model();
   m.box(-3, 0, -2, 7, 2, 5, '#8E7B63'); m.box(-2, 2, -1, 5, 1, 3, C.g3);
   m.set(-1, 3, 0, C.g1).set(1, 3, -1, C.lime).set(2, 3, 1, C.g1);
   return m;
  };
  /* 沿道の建物。1階が店、上が事務所や住まい */
  M.bldg = function(w, d, h, wall, acc){
   var m = new Model(), x0 = -Math.floor(w/2), z0 = -Math.floor(d/2), zf = z0 + d - 1;
   m.box(x0, 0, z0, w, h, d, wall);
   m.box(x0-1, h, z0-1, w+2, 1, d+2, '#8C949E');
   m.box(x0+1, 0, zf, w-2, 4, 1, '#2B3038');                  // 1階の開口
   m.box(x0+2, 1, zf, w-4, 2, 1, C.glass);
   m.box(x0+1, 5, zf, w-2, 2, 1, acc);                        // 看板
   for(var f = 1; f*4+4 < h; f++){
    for(var i = 1; i < w-2; i += 3) m.box(x0+i, f*4+2, zf, 2, 2, 1, C.glass);
    for(var k = 1; k < d-2; k += 3) m.box(x0+w-1, f*4+2, z0+k, 1, 2, 2, C.glass);
   }
   return m;
  };
  /* 奥の街区の建物。窓だけの簡単なかたまり */
  M.backblock = function(w, d, h, wall){
   var m = new Model(), x0 = -Math.floor(w/2), z0 = -Math.floor(d/2), zf = z0 + d - 1;
   m.box(x0, 0, z0, w, h, d, wall);
   m.box(x0-1, h, z0-1, w+2, 1, d+2, '#868E97');
   for(var f = 0; f*4+4 < h; f++){
    for(var i = 1; i < w-2; i += 3) m.box(x0+i, f*4+2, zf, 2, 2, 1, '#9FBECD');
    for(var k = 1; k < d-2; k += 3) m.box(x0+w-1, f*4+2, z0+k, 1, 2, 2, '#9FBECD');
   }
   return m;
  };
  /* 区間の目印。A・B・C の板を、道の奥側に立てる */
  var GLY = {
   A:['.###.','#...#','#####','#...#','#...#'],
   B:['####.','#...#','####.','#...#','####.'],
   C:['.####','#....','#....','#....','.####']
  };
  M.marker = function(ch, col){
   var m = new Model(), g = GLY[ch];
   m.box(-2, 0, 0, 4, 2, 3, '#3F454C');                                   // 台
   m.box(-1, 2, 0, 3, 6, 2, '#585F68');                                   // 柱
   m.box(-10, 8, 0, 20, 22, 1, C.ink);                                    // 板の枠
   m.box(-9, 9, 0, 18, 20, 1, col);
   for(var r = 0; r < 5; r++) for(var q = 0; q < 5; q++) if(g[r][q] === '#') m.box(-5 + q*2, 14 + (4-r)*2, 0, 2, 2, 1, C.ink);
   return m;
  };
  /* アーケードの入口（北端・本通り側） */
  M.arcade = function(){
   var m = new Model(), col = '#B8C0CC';
   m.box(-2, 0, -22, 3, 13, 3, col); m.box(-2, 0, 19, 3, 13, 3, col);
   for(var z = -22; z < 22; z++) m.box(-2, 13, z, 3, 1, 1, ((z+22) >> 2) % 2 ? '#DDE3EA' : C.glass);
   m.box(-3, 14, -22, 5, 1, 44, '#9AA3AD');
   m.box(-2, 9, -22, 3, 2, 3, C.lime); m.box(-2, 9, 19, 3, 2, 3, C.lime);
   return m;
  };

  /* ================= 交差する道 ================= */
  /* 南端・平和大通り。中央に緑の帯 */
  put(M.arch(C.lime), 64, 0);
  for(var pz = -60; pz <= 60; pz += 12){
   if(Math.abs(pz) < 18) continue;
   put(M.plane(true), 52, pz, 0); put(M.plane(true), 78, pz, 0);
  }
  movers.push(drift([M.car(C.wht)], 64, 0, -40, 0, -60, 60));
  /* 北端・本通りのアーケード */
  put(M.arcade(), 1140, 0);

  /* ================= 並木 ================= */
  /* 木の位置はどの案でも動かない。約10mおき（28単位）に、左右を互い違いに */
  var tx;
  for(tx = X0 + 8; tx < X1; tx += 28){
   if(crossing(tx)) continue;
   put(M.pit(), tx, -13); put(M.plane(true), tx, -13, 1);
  }
  for(tx = X0 + 22; tx < X1; tx += 28){
   if(crossing(tx)) continue;
   put(M.pit(), tx, 13); put(M.plane(true), tx, 13, 1);
  }
  /* 中木・低木は、広げた歩道と車を通さない道の側に足す */
  for(tx = 500; tx < 1104; tx += 56){
   if(crossing(tx)) continue;
   put(M.plane(false), tx + 14, 20, 0); put(M.bush(), tx + 4, 21);
  }

  /* ================= 街灯 ================= */
  for(tx = X0 + 20; tx < X1; tx += 56){ if(!crossing(tx)) put(M.slamp(), tx, -17); }
  for(tx = X0 + 48; tx < X1; tx += 56){ if(!crossing(tx)) put(M.slamp(), tx, 16); }

  /* ================= 沿道の建物 ================= */
  var walls = ['#EFE7D8', '#DCD5CB', '#F0E3D2', '#CED6DC', '#E6D9C8', '#D5CCC0', '#E9E4DC', '#C9CFD6'];
  var accs  = [C.red, C.navy, C.orange, C.purple, C.cyan, C.brown, '#1B2430', '#2F7A3D'];
  /* 手前（+z）側は低く、奥（−z）側は高く。等角の絵では、手前が高いと道が見えなくなる。
     目安は「高さ < z ÷ 2」。この道では手前12段・奥は自由 */
  var bi = 0;
  for(tx = X0 + 10; tx < X1 - 8; tx += 40){
   if(crossing(tx) || crossing(tx + 18)) { bi++; continue; }
   put(M.bldg(16, 10, 14 + (bi % 4) * 6, walls[bi % 8], accs[bi % 8]), tx, -26);
   put(M.bldg(16, 10, 8 + (bi % 3) * 2, walls[(bi + 3) % 8], accs[(bi + 5) % 8]), tx + 18, 26);
   bi++;
  }
  /* 奥の街区。近くの通りの背中だけが見えている */
  var bwalls = ['#AEB6BE', '#B8BCC2', '#A6AEB8', '#BCB6AE'];
  for(tx = X0 - 40; tx < X1 + 40; tx += 34){
   var k = ((tx / 34) | 0);
   put(M.backblock(22, 12, 22 + (k % 5) * 8, bwalls[(k + 1) % 4]), tx, -46);
   put(M.backblock(22, 12, 12 + ((k + 2) % 4) * 2, bwalls[k % 4]), tx + 16, 46);
  }
  /* 川べりの緑 */
  for(var gz = 0; gz < 96; gz++){
   var gx = -180 + Math.floor(R() * (L + 300)), gs = R();
   put(gs < 0.55 ? M.plane(false) : (gs < 0.8 ? M.pine() : M.bush()), gx, (54 + Math.floor(R() * 8)) * (R() < 0.5 ? 1 : -1), 0);
  }
  /* 手前（南）へ延ばした道ぞい。入口までの並木 */
  for(tx = -184; tx < 40; tx += 28){ put(M.pit(), tx, -13); put(M.plane(true), tx, -13, 1); }
  for(tx = -170; tx < 40; tx += 28){ put(M.pit(), tx, 13); put(M.plane(true), tx, 13, 1); }
  for(tx = -180; tx < 32; tx += 40){
   var ki = Math.abs((tx / 40) | 0) & 3;
   put(M.backblock(18, 10, 16 + ki * 6, walls[ki + 2]), tx, -26);
   put(M.backblock(18, 10, 8 + ki * 2, walls[ki]), tx + 16, 26);
  }

  /* ================= 区間の目印 ================= */
  put(M.marker('A', '#AEB6BE'), 146, -20);
  put(M.marker('B', C.lime), 498, -20);
  put(M.marker('C', C.orange), 898, -20);

  /* ================= A｜現況 ================= */
  /* 細い歩道。路肩に停まる車と、荷さばき */
  put(M.kei(C.wht, C.blue), 150, -5); put(M.cone(), 168, -6); put(M.cone(), 172, -6);
  put(M.crate(), 176, -11); put(M.crate(), 180, -12);
  put(M.person(C.blue, C.navy, C.yellow, 0), 172, -11);
  put(M.car(C.slate), 250, 5); put(M.car(C.cream), 300, -5);
  put(M.truck(C.wht), 380, 5); put(M.cone(), 366, 6);
  put(M.car(C.navy), 200, 5); put(M.car(C.wht), 224, 5); put(M.kei(C.cream, C.blue), 274, 5);
  put(M.car(C.dgray), 328, -5); put(M.car(C.wht), 352, -5); put(M.car(C.slate), 410, 5);
  put(M.cone(), 190, 6); put(M.cone(), 320, -6);
  put(M.vending(C.red), 214, -16); put(M.postbox(), 330, 16);
  put(M.bollard(), 118, -8); put(M.bollard(), 122, -8);
  put(M.sign(C.blue), 196, 17); put(M.sign(C.red), 412, -17);
  /* 歩道が細いので、人はまばらに */
  put(M.person(C.pink, C.ink, null, 0), 232, -15); put(M.person(C.cream, C.brown, null, 0), 236, -15);
  put(M.person(C.yellow, C.navy, null, 0), 344, 15);

  /* ================= B｜再配分案2024 ================= */
  /* 縁石を車道側へ寄せる。張り出したところにパークレットと植栽 */
  var bx;
  for(bx = 488; bx < 856; bx += 8){
   if(crossing(bx)) continue;
   put(M.widen(8), bx, -8); put(M.widen(8), bx, 6);
  }
  put(M.parklet(), 530, -12); put(M.parklet(), 620, 12); put(M.parklet(), 712, -12); put(M.parklet(), 806, 12);
  put(M.parasol(C.red), 540, -13); put(M.parasol(C.cyan), 628, 13); put(M.parasol(C.yellow), 800, 13);
  put(M.cafetable(), 566, -14); put(M.cafetable(), 660, 14); put(M.cafetable(), 748, -14);
  put(M.bench(), 592, -15); put(M.bench(), 686, 15); put(M.bench(), 776, -15);
  for(bx = 500; bx < 852; bx += 20){
   if(crossing(bx)) continue;
   put(M.planter(), bx + 10, -19); put(M.planter(), bx, 19);
  }
  put(M.person(C.lime, C.ink, null, 0), 536, -16); put(M.person(C.purple, C.brown, null, 0), 544, -16);
  put(M.person(C.orange, C.navy, null, 0), 624, 16); put(M.person(C.wht, C.ink, C.red, 0), 632, 16);
  put(M.person(C.cyan, C.ink, null, 0), 744, -16); put(M.person(C.pink, C.brown, null, 0), 782, -16);
  put(M.sign(C.lime), 494, 17);

  /* ================= C｜案01_車OFF ================= */
  /* 車を通さない。端から端まで人の場所になる */
  var cx;
  for(cx = 892; cx < 900; cx += 3) put(M.bollard(C.yellow), cx, -6);
  for(cx = 892; cx < 900; cx += 3){ put(M.bollard(C.yellow), cx, -2); put(M.bollard(C.yellow), cx, 2); put(M.bollard(C.yellow), cx, 6); }
  put(M.foodtruck(C.orange), 930, -4);
  put(M.stall(C.red), 966, 4); put(M.stall(C.blue), 986, -4); put(M.stall(C.orange), 1006, 4);
  put(M.parasol(C.red), 950, 6); put(M.parasol(C.cyan), 998, -8); put(M.parasol(C.yellow), 1044, 6);
  put(M.cafetable(), 944, 8); put(M.cafetable(), 1004, -8); put(M.cafetable(), 1050, 4);
  put(M.bench(), 916, 10); put(M.bench(), 1028, -10); put(M.bench(), 1074, 8);
  put(M.parklet(), 1062, -12);
  var pc = [C.red, C.blue, C.yellow, C.lime, C.wht, C.pink, C.cyan, C.purple, C.orange, C.cream];
  for(var q = 0; q < 22; q++){
   var px = 906 + q * 9, pz = ((q * 5) % 17) - 8;
   put(M.person(pc[q % pc.length], q % 3 ? C.ink : C.navy, q % 5 === 0 ? C.yellow : null, 0), px, pz);
  }
  put(M.sign(C.lime), 904, 17); put(M.sign(C.lime), 1096, -17);

  /* ================= 動くもの ================= */
  /* 車はAとBの区間だけを走り、Cには入らない */
  var cols = [C.blue, C.red, C.wht, C.slate, C.cream];
  for(var i = 0; i < 4; i++) movers.push(drift([M.car(cols[i])], X0 + i * 180, 0, -4, 3.4 + R() * 1.2, X0 - 30, 872));
  movers.push(drift([M.kei(C.wht, C.blue)], 300, 0, -4, 3.0, X0 - 30, 872));
  for(var j = 0; j < 3; j++) movers.push(drift([M.car(cols[4 - j]).mirror()], X0 + 120 + j * 200, 0, 4, -(3.4 + R() * 1.2), X0 - 30, 872));
  movers.push(drift([M.truck(C.wht).mirror()], 640, 0, 4, -3.0, X0 - 30, 872));
  /* 歩く人 */
  var sh = [C.red, C.blue, C.yellow, C.lime, C.wht, C.pink, C.cyan, C.purple], pa = [C.ink, C.brown, C.navy];
  for(var w = 0; w < 16; w++){
   var s = sh[w % sh.length], p = pa[w % pa.length], hat = (w % 5 === 0) ? C.yellow : null;
   movers.push(walker([M.person(s, p, hat, 1), M.person(s, p, hat, 2)], X0 + Math.floor(R() * (X1 - X0)), w % 2 ? 14 : -15, (R() < 0.5 ? 1 : -1) * (1.1 + R() * 0.7)));
  }
  /* 空 */
  for(var cl = 0; cl < 6; cl++) movers.push(drift([M.cloud()], Math.floor(R() * L), 42 + Math.floor(R() * 8), Math.floor(R() * 90 - 45), 0.5 + R() * 0.4, -60, L + 60));
  for(var bd = 0; bd < 3; bd++) movers.push(drift([M.bird(0), M.bird(1)], Math.floor(R() * L), 26, Math.floor(R() * 40 - 20), 4 + R() * 2, -30, L + 30, 5));
  /* 川。島のふちは元安川と京橋川の見立て */
  movers.push(drift([M.boat(C.wht)], 200, api.SEA_Y, -104, 1.1, -40, L + 40));
  movers.push(drift([M.boat(C.cream)], 800, api.SEA_Y, 106, -0.9, -40, L + 40));
  for(var wv = 0; wv < 50; wv++){
   movers.push(anim([M.wave(0), M.wave(1)], Math.floor(R() * L), api.SEA_Y, (74 + Math.floor(R() * 38)) * (R() < 0.5 ? 1 : -1), 1 + R()));
  }
 }
};
window.NAMIKI_DATA = D;
window.NAMIKI_MPU = MPU;
})();
