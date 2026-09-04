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

/* 路面の色は道具箱（../road/namiki-kit.js）と共通 */
var P = window.NAMIKI.P;

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

  /* この道の物は ../road/namiki-kit.js に置いてある（/life/ と共通） */
  NAMIKI.models(api);

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
})();
