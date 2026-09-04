/* 場面: ある通りの断面を、歩いて見比べる道。../road/engine.js より先に読む。
   通りの検討でつくられた3Dデータから読み取れた「道の組み立て方」を、
   等角ボクセルの道に置き直したもの。場所と案の名前は出していない。
   ・A＝いまの断面 / B＝車道を絞って歩道に足した断面 / C＝車を通さない断面
   ・実際にはどれも同じ1本の道に重ねて用意されていたもの。
     歩きながら比べられるように、3つに分けて並べている */
(function(){
'use strict';

/* ---------- 道の割りつけ（単位） ---------- */
var L = 1820;
var X0 = 96, X1 = 1700;                                       // 通りの南端・北端
var SEC = [['A', 96, 660], ['B', 700, 1260], ['C', 1300, 1700]];
var CROSS = [[40, 88], [660, 700], [1260, 1300], [1700, 1900]];   // 交差する道

function within(x, a, b){ return x >= a && x < b; }
function crossing(x){ for(var i=0;i<CROSS.length;i++) if(within(x, CROSS[i][0], CROSS[i][1])) return true; return false; }
function sec(x){ for(var i=0;i<SEC.length;i++) if(within(x, SEC[i][1], SEC[i][2])) return SEC[i][0]; return null; }

/* 路面の色は道具箱（../road/street-kit.js）と共通 */
var P = window.STREETKIT.P;

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
  if(crossing(x) || s === 'C') return 'none';
  if(s === 'B') return 6;
  return null;
 },

 build: function(api){
  var M = api.M, C = api.C, put = api.put, movers = api.movers;
  var anim = api.anim, drift = api.drift, walker = api.walker, R = api.R;

  /* この道の物は ../road/street-kit.js に置いてある（/life/ と共通） */
  var KIT = window.STREETKIT;
  KIT.models(api);

  /* ================= 交差する道 ================= */
  /* 南端。中央に緑の帯のある大きな通り */
  put(M.arch(C.lime), 64, 0);
  for(var pz = -60; pz <= 60; pz += 12){
   if(Math.abs(pz) < 18) continue;
   put(M.plane(true), 52, pz, 0); put(M.plane(true), 78, pz, 0);
  }
  /* 北端。商店街のアーケードにつながる */
  put(M.arcade(), 1790, 0);

  /* ================= 並木 ================= */
  /* 木の位置はどの断面でも動かない。左右を互い違いに */
  var tx;
  KIT.trees(api, X0 + 14, X1 - 8, 34, -13, 13, crossing);
  /* 中木・低木は、広げた歩道と車を通さない道の側に足す */
  for(tx = 720; tx < 1690; tx += 68){
   if(crossing(tx)) continue;
   put(M.plane(false), tx + 16, 20, 0); put(M.bush(), tx + 4, 21);
  }

  /* ================= 街灯 ================= */
  for(tx = X0 + 26; tx < X1 - 12; tx += 68){ if(!crossing(tx)) put(M.slamp(), tx, -17); }
  for(tx = X0 + 60; tx < X1 - 12; tx += 68){ if(!crossing(tx)) put(M.slamp(), tx, 16); }

  /* ================= 沿道の街並み ================= */
  KIT.frontage(api, X0 + 12, X1 - 12, 48, crossing);

  /* ================= 区間の目印 ================= */
  put(M.marker('A', '#AEB6BE'), 300, -20);
  put(M.marker('B', C.lime), 680, -20);
  put(M.marker('C', C.orange), 1280, -20);

  /* ================= A｜いまの断面 ================= */
  /* 細い歩道。路肩に停まる車と、荷さばき */
  var ax;
  put(M.kei(C.wht, C.blue), 230, -5); put(M.cone(), 250, -6); put(M.cone(), 254, -6);
  put(M.crate(), 258, -11); put(M.crate(), 262, -12);
  put(M.person(C.blue, C.navy, C.yellow, 0), 254, -11);
  var acars = [C.navy, C.wht, C.slate, C.cream, C.dgray, C.wht, C.slate];
  for(ax = 0; ax < acars.length; ax++){
   put(M.car(acars[ax]), 300 + ax * 46, ax % 2 ? 5 : -5);
  }
  put(M.truck(C.wht), 596, 5); put(M.cone(), 580, 6); put(M.cone(), 340, -6);
  put(M.vending(C.red), 300, -16); put(M.postbox(), 470, 16);
  put(M.bollard(), 140, -8); put(M.bollard(), 144, -8);
  put(M.sign(C.blue), 268, 17); put(M.sign(C.red), 620, -17);
  /* 歩道が細いので、人はまばらに */
  put(M.person(C.pink, C.ink, null, 0), 322, -15); put(M.person(C.cream, C.brown, null, 0), 326, -15);
  put(M.person(C.yellow, C.navy, null, 0), 500, 15); put(M.person(C.lime, C.ink, null, 0), 552, -15);

  /* ================= B｜車道を絞って、歩道に足した断面 ================= */
  var bx;
  for(bx = 700; bx < 1260; bx += 8){
   if(crossing(bx)) continue;
   put(M.widen(8), bx, -8); put(M.widen(8), bx, 6);
  }
  put(M.parklet(), 760, -12); put(M.parklet(), 890, 12); put(M.parklet(), 1030, -12); put(M.parklet(), 1170, 12);
  put(M.parasol(C.red), 772, -13); put(M.parasol(C.cyan), 900, 13); put(M.parasol(C.yellow), 1160, 13);
  put(M.cafetable(), 810, -14); put(M.cafetable(), 940, 14); put(M.cafetable(), 1080, -14);
  put(M.bench(), 846, -15); put(M.bench(), 986, 15); put(M.bench(), 1120, -15);
  for(bx = 712; bx < 1256; bx += 24){
   if(crossing(bx)) continue;
   put(M.planter(), bx + 12, -19); put(M.planter(), bx, 19);
  }
  put(M.person(C.lime, C.ink, null, 0), 766, -16); put(M.person(C.purple, C.brown, null, 0), 776, -16);
  put(M.person(C.orange, C.navy, null, 0), 896, 16); put(M.person(C.wht, C.ink, C.red, 0), 906, 16);
  put(M.person(C.cyan, C.ink, null, 0), 1076, -16); put(M.person(C.pink, C.brown, null, 0), 1114, -16);
  put(M.sign(C.lime), 706, 17);

  /* ================= C｜車を通さない断面 ================= */
  var cx;
  for(cx = 1304; cx < 1316; cx += 3){ put(M.bollard(C.yellow), cx, -6); put(M.bollard(C.yellow), cx, -2); put(M.bollard(C.yellow), cx, 2); put(M.bollard(C.yellow), cx, 6); }
  put(M.foodtruck(C.orange), 1360, -4);
  put(M.stall(C.red), 1404, 4); put(M.stall(C.blue), 1432, -4); put(M.stall(C.orange), 1466, 4);
  put(M.parasol(C.red), 1386, 6); put(M.parasol(C.cyan), 1450, -8); put(M.parasol(C.yellow), 1524, 6);
  put(M.cafetable(), 1378, 8); put(M.cafetable(), 1458, -8); put(M.cafetable(), 1536, 4);
  put(M.bench(), 1340, 10); put(M.bench(), 1494, -10); put(M.bench(), 1592, 8);
  put(M.parklet(), 1570, -12); put(M.parklet(), 1650, 12);
  var pc = [C.red, C.blue, C.yellow, C.lime, C.wht, C.pink, C.cyan, C.purple, C.orange, C.cream];
  for(var q = 0; q < 34; q++){
   var px = 1324 + q * 11, pz = ((q * 5) % 17) - 8;
   put(M.person(pc[q % pc.length], q % 3 ? C.ink : C.navy, q % 5 === 0 ? C.yellow : null, 0), px, pz);
  }
  put(M.sign(C.lime), 1322, 17); put(M.sign(C.lime), 1684, -17);

  /* ================= 動くもの ================= */
  /* 車はAとBの区間だけを走り、Cには入らない */
  var cols = [C.blue, C.red, C.wht, C.slate, C.cream];
  for(var i = 0; i < 5; i++) movers.push(drift([M.car(cols[i])], X0 + i * 230, 0, -4, 3.4 + R() * 1.2, X0 - 30, 1284));
  movers.push(drift([M.kei(C.wht, C.blue)], 420, 0, -4, 3.0, X0 - 30, 1284));
  for(var j = 0; j < 4; j++) movers.push(drift([M.car(cols[4 - j]).mirror()], X0 + 160 + j * 250, 0, 4, -(3.4 + R() * 1.2), X0 - 30, 1284));
  movers.push(drift([M.truck(C.wht).mirror()], 900, 0, 4, -3.0, X0 - 30, 1284));
  /* 歩く人 */
  var sh = [C.red, C.blue, C.yellow, C.lime, C.wht, C.pink, C.cyan, C.purple], pa = [C.ink, C.brown, C.navy];
  for(var w = 0; w < 20; w++){
   var s = sh[w % sh.length], p = pa[w % pa.length], hat = (w % 5 === 0) ? C.yellow : null;
   movers.push(walker([M.person(s, p, hat, 1), M.person(s, p, hat, 2)], X0 + Math.floor(R() * (X1 - X0)), w % 2 ? 14 : -15, (R() < 0.5 ? 1 : -1) * (1.1 + R() * 0.7)));
  }
  /* 空 */
  for(var cl = 0; cl < 8; cl++) movers.push(drift([M.cloud()], Math.floor(R() * L), 42 + Math.floor(R() * 8), Math.floor(R() * 90 - 45), 0.5 + R() * 0.4, -60, L + 60));
  for(var bd = 0; bd < 3; bd++) movers.push(drift([M.bird(0), M.bird(1)], Math.floor(R() * L), 26, Math.floor(R() * 40 - 20), 4 + R() * 2, -30, L + 30, 5));
  /* 島のふちの水 */
  movers.push(drift([M.boat(C.wht)], 300, api.SEA_Y, -104, 1.1, -40, L + 40));
  movers.push(drift([M.boat(C.cream)], 1100, api.SEA_Y, 106, -0.9, -40, L + 40));
  for(var wv = 0; wv < 60; wv++){
   movers.push(anim([M.wave(0), M.wave(1)], Math.floor(R() * L), api.SEA_Y, (74 + Math.floor(R() * 38)) * (R() < 0.5 ? 1 : -1), 1 + R()));
  }
 }
};
})();
