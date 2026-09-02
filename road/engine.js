/* 道の街のエンジン（y-n10.com の作りを踏襲した等角ボクセルの街）
   場面（何をどこに置くか・章の板）は window.ROAD_SCENE で先に渡す。
   ・画面は4pxグリッド。立方体は 8px を最小単位に 16・32・64px を使う
   ・WebGL の直交投影（横2:縦1）。頂点は必ず整数ピクセルに乗る
   ・スクロールは乗っ取らない。見え方だけを遅らせて慣性をつける
   ・物はすべてこのファイルの中で組み立てる（画像なし） */
(function(){
'use strict';

var RM = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : {matches:false};
var U = 8;                                  // 立方体1個 = 8px
var UPX = Math.sqrt(8*8 + 4*4);             // 道を1単位進むと画面が動く距離 = 8.944px
var SCENE = window.ROAD_SCENE || {};
var L = SCENE.L || 1180;                    // 島の長さ（単位）
var ZW = 64;                                // 島の半幅（単位）
var SEA_Y = -4;                             // 海面の高さ
var CAM0 = 20, CAM1 = L - 60;               // カメラが進む範囲

/* ---------- 固定シードの乱数 ---------- */
function rng(seed){ var a = seed >>> 0; return function(){ a += 0x6D2B79F5; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---------- 色 ---------- */
var C = {
 ink:'#1B2430', wht:'#FFFFFF', cream:'#F4F1EA', gray:'#9AA3AD', dgray:'#5B6470', asphalt:'#6B7280', line:'#F8FAFC',
 g1:'#79D26A', g2:'#6BC65C', g3:'#4EA648', dg:'#2F7A3D', sand:'#E9D8A6', dirt:'#8C6A4A', wood:'#B98A5A', brown:'#7A4F33',
 red:'#E5484D', orange:'#F5A524', yellow:'#FFD93D', cyan:'#5FD3F3', blue:'#3B82F6', pink:'#F6A5C0', lime:'#28DD34', purple:'#8B5CF6',
 skin:'#F2C9A0', hair:'#2B1B12', foam:'#E8F7FB', roof:'#3B4048', slate:'#4A5568', smoke:'#C9D1D9', glass:'#A7E8FA', navy:'#1E3A5F'
};

/* ---------- ボクセルモデル ---------- */
function Model(){ this.v = {}; }
Model.prototype.set = function(x,y,z,c){ this.v[x+','+y+','+z] = c; return this; };
Model.prototype.box = function(x,y,z,w,h,d,c){
 for(var i=0;i<w;i++) for(var j=0;j<h;j++) for(var k=0;k<d;k++) this.v[(x+i)+','+(y+j)+','+(z+k)] = c;
 return this;
};
/* 文字の絵で1段ぶんを置く。rows[z][x]、'.' は空 */
Model.prototype.layer = function(y, rows, pal, ox, oz){
 for(var z=0; z<rows.length; z++) for(var x=0; x<rows[z].length; x++){
  var ch = rows[z][x]; if(ch==='.'||ch===' ') continue;
  this.v[(x+ox)+','+y+','+(z+oz)] = pal[ch];
 }
 return this;
};
Model.prototype.merge = function(m, dx, dy, dz){
 for(var k in m.v){ var p = k.split(','); this.v[(+p[0]+dx)+','+(+p[1]+dy)+','+(+p[2]+dz)] = m.v[k]; }
 return this;
};
/* x を裏返す（-1-x）。左向きに歩く人や車に使う */
Model.prototype.mirror = function(){
 var m = new Model();
 for(var k in this.v){ var p = k.split(','); m.v[(-1-(+p[0]))+','+p[1]+','+p[2]] = this.v[k]; }
 return m;
};

/* ---------- 面を出す ----------
   見えるのは +y（上）・+x（右下向き）・+z（左下向き）の3面だけ。
   法線ごとの明るさを頂点色に焼き込む（y-n10 は dFdx で求めているが結果は同じ） */
var SH_TOP = 1.0, SH_X = 0.80, SH_Z = 0.62;
var hexCache = {};
function hex(c){
 var h = hexCache[c]; if(h) return h;
 var v = parseInt(c.slice(1), 16);
 return (hexCache[c] = [((v>>16)&255)/255, ((v>>8)&255)/255, (v&255)/255]);
}
function quad(out, a, b, c, d, col, sh){
 var t = [a,b,c,a,c,d], r = col[0]*sh, g = col[1]*sh, bl = col[2]*sh;
 for(var i=0;i<6;i++) out.push(t[i][0], t[i][1], t[i][2], r, g, bl);
}
function emit(out, m, ox, oy, oz){
 var v = m.v;
 for(var k in v){
  var p = k.split(','), x = +p[0], y = +p[1], z = +p[2], c = hex(v[k]);
  var X = x+ox, Y = y+oy, Z = z+oz;
  if(!v[x+','+(y+1)+','+z]) quad(out, [X,Y+1,Z],[X+1,Y+1,Z],[X+1,Y+1,Z+1],[X,Y+1,Z+1], c, SH_TOP);
  if(!v[(x+1)+','+y+','+z]) quad(out, [X+1,Y,Z],[X+1,Y+1,Z],[X+1,Y+1,Z+1],[X+1,Y,Z+1], c, SH_X);
  if(!v[x+','+y+','+(z+1)]) quad(out, [X,Y,Z+1],[X+1,Y,Z+1],[X+1,Y+1,Z+1],[X,Y+1,Z+1], c, SH_Z);
 }
}
/* 平らな四角（地面のタイル・道の線） */
function flat(out, x0, z0, x1, z1, y, c, sh){
 quad(out, [x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1], hex(c), sh||SH_TOP);
}

/* ---------- 物のカタログ ---------- */
var M = {};

M.tree = function(col){
 var m = new Model(); col = col || C.g3;
 m.box(-1,0,-1,2,3,2,C.brown);
 m.box(-3,3,-3,6,3,6,col); m.box(-4,4,-4,8,2,8,col); m.box(-2,6,-2,4,2,4,col); m.box(-1,8,-1,2,1,2,col);
 return m;
};
M.sakura = function(){
 var m = M.tree(C.pink);
 m.set(-3,5,-4,C.wht).set(2,4,-4,C.wht).set(3,5,1,C.wht).set(-4,4,2,C.wht).set(0,8,-1,C.wht).set(-2,7,1,C.wht);
 return m;
};
M.pine = function(){
 var m = new Model();
 m.box(-1,0,-1,2,2,2,C.brown);
 m.box(-4,2,-4,8,2,8,C.dg); m.box(-3,4,-3,6,2,6,C.dg); m.box(-2,6,-2,4,2,4,C.dg); m.box(-1,8,-1,2,3,2,C.dg);
 return m;
};
M.bush = function(){ return new Model().box(-2,0,-2,4,2,4,C.g3).box(-1,2,-1,2,1,2,C.g3); };
M.flower = function(col){ return new Model().set(0,0,0,col); };

M.house = function(wall, roofc, w, d, h){
 var m = new Model(), x0 = -Math.floor(w/2), z0 = -Math.floor(d/2);
 m.box(x0,0,z0,w,h,d,wall);
 for(var t=0;t<4;t++) m.box(x0-1+t, h+t, z0-1+t, w+2-2*t, 1, d+2-2*t, roofc);
 m.box(x0+Math.floor(w/2)-1, 0, z0+d-1, 2, 3, 1, C.brown);              // 戸（+z面）
 m.box(x0+1, 2, z0+d-1, 2, 2, 1, C.cyan); m.box(x0+w-3, 2, z0+d-1, 2, 2, 1, C.cyan);
 m.box(x0+w-1, 2, z0+1, 1, 2, 2, C.cyan);                              // 窓（+x面）
 return m;
};
M.shop = function(wall, sign, w, d, h){
 var m = M.house(wall, C.roof, w, d, h), x0 = -Math.floor(w/2), z0 = -Math.floor(d/2);
 m.box(x0, h+4, z0+d-2, w, 3, 1, sign); m.box(x0+1, h+5, z0+d-2, w-2, 1, 1, C.wht);   // 屋根の上の看板
 for(var i=0;i<w+2;i++) m.box(x0-1+i, 4, z0+d, 1, 1, 2, i%2 ? C.wht : sign);          // 庇（縞）
 return m;
};
M.warehouse = function(){
 var m = new Model();
 m.box(-12,0,-8,24,10,16,C.gray);
 m.box(-13,10,-9,26,1,18,C.dgray); m.box(-11,11,-7,22,1,14,C.dgray);
 m.box(11,0,-3,1,7,6,C.slate);                                          // 大きな戸（+x面）
 var rb = [C.red,C.orange,C.yellow,C.lime,C.cyan,C.purple];
 for(var i=0;i<6;i++) m.box(11, 8, -8+i*3, 1, 1, 3, rb[i]);            // 虹の帯
 m.box(-10,0,7,1,7,1,C.slate).box(9,0,7,1,7,1,C.slate);                 // 柱
 m.box(-6,3,7,4,3,1,C.glass).box(2,3,7,4,3,1,C.glass);                  // 窓
 return m;
};

/* トレーラーハウス（いちばん大きい物。デッキつき） */
M.trailer = function(){
 var m = new Model();
 m.box(-14,1,-5,28,1,10,C.ink);                                         // シャーシ
 m.box(-8,0,5,3,2,1,C.ink).box(3,0,5,3,2,1,C.ink);                      // 車輪
 m.box(-14,2,-5,28,8,10,C.cream);                                       // 本体
 m.box(-15,10,-6,30,1,12,C.roof); m.box(-13,11,-5,26,1,10,C.roof);      // 屋根
 m.box(-4,12,-2,2,2,2,C.gray);                                          // 換気筒
 m.box(-11,5,4,4,3,1,C.glass).box(-3,5,4,4,3,1,C.glass).box(5,5,4,4,3,1,C.glass); // 窓（+z面）
 m.box(10,2,4,2,5,1,C.brown);                                           // 戸
 m.box(13,5,-3,1,3,6,C.glass);                                          // 窓（+x面）
 m.box(14,1,-1,4,1,2,C.ink); m.box(17,0,-1,1,1,2,C.ink);                // 牽引部
 m.box(-14,0,6,28,2,6,C.wood);                                          // デッキ
 m.box(-14,0,12,28,1,2,C.wood);                                         // 段
 m.box(-13,2,11,1,3,1,C.brown).box(12,2,11,1,3,1,C.brown);              // 手すりの柱
 m.box(-13,4,11,26,1,1,C.brown);
 return m;
};
/* 軽トラのキッチンカー */
M.kei = function(shell, awn){
 var m = new Model(); shell = shell || C.wood; awn = awn || C.red;
 m.box(-8,0,-3,18,1,6,C.ink);                                           // 下まわり
 m.box(-6,0,3,3,2,1,C.ink).box(5,0,3,3,2,1,C.ink);                      // 車輪
 m.box(6,1,-3,4,5,6,C.wht);                                             // キャブ
 m.box(9,3,-2,1,2,4,C.glass); m.box(7,3,2,2,2,1,C.glass);               // ガラス
 m.box(-8,1,-3,14,6,6,shell);                                           // 荷台のシェル
 m.box(-6,3,2,10,3,1,C.ink); m.box(-5,4,2,8,1,1,C.glass);               // 提供口
 m.box(-8,7,-3,14,1,6,C.roof);                                          // 屋根
 for(var i=0;i<14;i++) m.box(-8+i, 7, 3, 1, 1, 3, i%2 ? C.wht : awn);   // オーニング
 m.set(-8,8,3,C.ink).set(5,8,3,C.ink);
 return m;
};
/* 2tロングのフードトラック */
M.foodtruck = function(body){
 var m = new Model(); body = body || C.orange;
 m.box(-10,0,-4,24,1,8,C.ink);
 m.box(-7,0,4,3,2,1,C.ink).box(7,0,4,3,2,1,C.ink);
 m.box(8,1,-4,6,7,8,body); m.box(13,4,-3,1,3,6,C.glass); m.box(9,4,3,3,3,1,C.glass);
 m.box(-10,1,-4,18,9,8,body);
 m.box(-8,4,3,14,4,1,C.ink); m.box(-7,5,3,12,2,1,C.glass);
 m.box(-10,10,-4,18,1,8,C.roof); m.box(8,8,-4,6,1,8,C.roof);
 for(var i=0;i<18;i++) m.box(-10+i, 10, 4, 1, 1, 4, i%2 ? C.wht : C.ink);
 m.box(-2,11,-2,4,2,3,C.gray);
 return m;
};
/* お好み焼きのキャラバンカー。壁が跳ね上がって大屋根になる */
M.caravan = function(){
 var m = M.foodtruck(C.red);
 m.box(-10,9,4,18,1,8,C.red);                                           // 跳ね上げた壁
 m.box(-10,0,4,18,1,8,C.wood);                                          // デッキ
 m.box(-9,1,9,3,2,2,C.brown).box(-2,1,9,3,2,2,C.brown).box(4,1,9,3,2,2,C.brown); // 客席
 return m;
};
/* トレーラーを積んだ運搬車（製造パートナーの陸送） */
M.carrier = function(){
 var m = new Model();
 m.box(-16,0,-4,34,1,8,C.ink);
 m.box(-13,0,4,3,2,1,C.ink).box(-6,0,4,3,2,1,C.ink).box(11,0,4,3,2,1,C.ink);
 m.box(12,1,-4,6,7,8,C.blue); m.box(17,4,-3,1,3,6,C.glass); m.box(13,4,3,3,3,1,C.glass);
 m.box(-16,1,-4,27,1,8,C.dgray);                                        // 荷台
 m.box(-14,2,-3,22,6,6,C.cream); m.box(-15,8,-4,24,1,8,C.roof);         // 積んだ小さなトレーラー
 m.box(-11,4,2,3,2,1,C.glass).box(-4,4,2,3,2,1,C.glass).box(3,4,2,3,2,1,C.glass);
 return m;
};
M.car = function(col){
 var m = new Model(); col = col || C.blue;
 m.box(-4,0,3,2,1,1,C.ink).box(2,0,3,2,1,1,C.ink);
 m.box(-5,1,-3,10,2,6,col);
 m.box(-3,3,-3,6,2,6,col);
 m.box(2,3,-2,1,2,4,C.glass); m.box(-2,3,2,4,1,1,C.glass);
 m.set(5,1,-2,C.yellow).set(5,1,1,C.yellow);
 return m;
};
M.bus = function(){
 var m = new Model();
 m.box(-7,0,3,3,1,1,C.ink).box(4,0,3,3,1,1,C.ink);
 m.box(-9,1,-3,18,6,6,C.cyan); m.box(-9,7,-3,18,1,6,C.wht);
 m.box(8,3,-2,1,3,4,C.glass);
 for(var i=0;i<4;i++) m.box(-8+i*4, 4, 2, 3, 2, 1, C.glass);
 m.box(-1,1,2,2,3,1,C.ink);
 return m;
};
M.truck = function(col){
 var m = new Model(); col = col || C.wht;
 m.box(-8,0,-3,18,1,6,C.ink);
 m.box(-6,0,3,3,2,1,C.ink).box(5,0,3,3,2,1,C.ink);
 m.box(6,1,-3,4,5,6,col); m.box(9,3,-2,1,2,4,C.glass); m.box(7,3,2,2,2,1,C.glass);
 m.box(-8,1,-3,14,1,6,C.gray); m.box(-8,2,-3,14,2,1,C.gray).box(-8,2,2,14,2,1,C.gray).box(-8,2,-3,1,2,6,C.gray);
 return m;
};

/* 人。frame 0=立つ / 1,2=歩く */
M.person = function(shirt, pants, hat, frame){
 var m = new Model();
 if(frame===1){ m.box(-2,0,-1,1,2,1,pants).box(1,0,-1,1,2,1,pants).box(-1,1,-1,2,1,1,pants); }
 else if(frame===2){ m.box(-1,0,-1,1,1,1,pants).box(0,0,-1,1,1,1,pants).box(-1,1,-1,2,1,1,pants); m.set(-1,0,0,pants); }
 else { m.box(-1,0,-1,1,2,1,pants).box(0,0,-1,1,2,1,pants); }
 m.box(-1,2,-1,2,2,2,shirt);
 m.box(-2,2,0,1,2,1,shirt).box(1,2,0,1,2,1,shirt);                       // 腕
 m.box(-1,4,-1,2,2,2,C.skin);
 m.box(-1,5,-1,2,1,1,C.hair);                                            // 髪（後ろ）
 if(hat){ m.box(-2,6,-2,4,1,4,hat); m.box(-1,7,-1,2,1,2,hat); } else { m.box(-1,6,-1,2,1,2,C.hair); }
 return m;
};
M.torii = function(){
 var m = new Model();
 m.box(-6,0,-1,2,12,2,C.red).box(4,0,-1,2,12,2,C.red);
 m.box(-8,9,-1,16,1,2,C.red);                                            // 貫
 m.box(-9,12,-1,18,1,2,C.ink); m.box(-9,13,-1,18,1,2,C.red);             // 笠木
 m.box(-1,9,0,2,3,1,C.ink);                                              // 額
 m.box(-7,0,-2,4,1,4,C.gray).box(3,0,-2,4,1,4,C.gray);                   // 根石
 return m;
};
M.boat = function(col){
 var m = new Model(); col = col || C.wht;
 m.box(-6,0,-2,12,2,4,C.roof); m.box(-5,2,-1,10,1,2,col);
 m.box(-2,3,-1,4,3,2,col); m.box(1,4,-1,1,1,2,C.glass); m.box(-1,4,0,2,1,1,C.glass);
 m.box(-3,6,-1,1,2,1,C.ink);
 return m;
};
M.lamp = function(){
 var m = new Model();
 m.box(0,0,0,1,10,1,C.roof); m.box(-1,10,-1,3,1,3,C.roof); m.box(-1,9,-1,3,1,3,C.yellow);
 return m;
};
M.bench = function(){
 var m = new Model();
 m.box(-3,1,-1,6,1,2,C.wood); m.box(-3,2,-1,6,2,1,C.wood);
 m.set(-3,0,0,C.ink).set(2,0,0,C.ink);
 return m;
};
M.vending = function(col){
 var m = new Model(); col = col || C.red;
 m.box(-1,0,-1,3,6,2,col); m.box(1,3,-1,1,2,2,C.glass); m.set(1,1,0,C.ink);
 return m;
};
M.postbox = function(){
 var m = new Model();
 m.box(-1,0,-1,3,6,3,C.red); m.box(-2,6,-2,5,1,5,C.red); m.box(1,3,0,1,1,1,C.ink);
 return m;
};
M.sign = function(col){
 var m = new Model(); col = col || C.blue;
 m.box(0,0,0,1,7,1,C.dgray); m.box(-2,4,0,5,3,1,col); m.box(-1,5,0,3,1,1,C.wht);
 return m;
};
M.cone = function(){ return new Model().box(-1,0,-1,2,1,2,C.orange).set(0,1,0,C.wht).set(0,2,0,C.orange); };
M.gate = function(){                                                     // 検問所（道をまたぐ）
 var m = new Model();
 m.box(-1,0,-12,2,9,2,C.gray).box(-1,0,10,2,9,2,C.gray);
 for(var z=-12; z<12; z++) m.box(-1, 8, z, 2, 1, 1, ((z+12)>>1)%2 ? C.wht : C.red);
 m.box(-2,9,-2,4,3,4,C.wht); m.box(-1,10,-2,2,1,1,C.red);
 return m;
};
M.arch = function(col){                                                  // START / GOAL のアーチ
 var m = new Model(); col = col || C.lime;
 m.box(-1,0,-11,2,12,2,C.ink).box(-1,0,9,2,12,2,C.ink);
 m.box(-1,12,-11,2,3,22,col); m.box(-1,13,-9,2,1,18,C.wht);
 return m;
};
M.flagpole = function(frame, col){
 var m = new Model(); col = col || C.yellow;
 m.box(0,0,0,1,12,1,C.dgray);
 if(frame){ m.box(1,5,0,2,6,1,col); m.box(3,6,0,1,4,1,col); m.set(4,7,0,col); }
 else { m.box(1,5,0,3,6,1,col); m.set(4,6,0,col).set(4,8,0,col); }
 m.box(1,7,0,3,2,1,C.ink);
 return m;
};
M.goalflag = function(frame){
 var m = new Model();
 m.box(0,0,0,1,14,1,C.dgray);
 for(var y=0;y<6;y++) for(var x=0;x<6;x++){ var w = frame && x>3 ? 1 : 0; m.set(1+x, 7+y+w, 0, ((x+y)%2) ? C.wht : C.ink); }
 return m;
};
M.stall = function(col){
 var m = new Model(); col = col || C.red;
 m.box(-4,2,-2,8,1,4,C.wood); m.set(-4,0,-2,C.wood).set(3,0,-2,C.wood).set(-4,0,1,C.wood).set(3,0,1,C.wood);
 m.set(-4,1,-2,C.wood).set(3,1,-2,C.wood).set(-4,1,1,C.wood).set(3,1,1,C.wood);
 m.box(-4,3,-2,1,4,1,C.wood).box(3,3,-2,1,4,1,C.wood).box(-4,3,1,1,4,1,C.wood).box(3,3,1,1,4,1,C.wood);
 for(var z=0; z<6; z++) m.box(-5, 7, -3+z, 10, 1, 1, z%2 ? C.wht : col);
 m.box(-3,3,-1,2,1,2,C.yellow).box(1,3,-1,2,1,2,C.orange);
 return m;
};
M.dome = function(){
 var m = new Model(), w = [10,12,12,10,8,4];
 for(var y=0;y<w.length;y++) m.box(-w[y]/2, y, -w[y]/2, w[y], 1, w[y], C.cream);
 m.box(3,0,2,3,3,3,C.glass); m.box(-1,0,5,2,3,1,C.brown);
 return m;
};
M.sauna = function(){
 var m = new Model();
 m.box(-4,0,-4,8,6,8,C.brown); m.box(-5,6,-5,10,1,10,C.roof); m.box(-3,7,-3,6,1,6,C.roof);
 m.box(2,7,-2,2,3,2,C.gray);
 m.box(-1,0,3,2,4,1,C.ink); m.box(3,2,-1,1,2,2,C.glass);
 return m;
};
M.tent = function(col){
 var m = new Model(); col = col || C.orange;
 m.box(-5,0,-4,10,1,8,col); m.box(-4,1,-3,8,1,6,col); m.box(-3,2,-2,6,1,4,col); m.box(-2,3,-1,4,1,2,col);
 m.box(-1,4,-1,2,1,2,C.ink); m.box(-1,0,3,2,1,1,C.ink);
 return m;
};
M.campfire = function(frame){
 var m = new Model();
 m.box(-2,0,-1,4,1,2,C.brown); m.box(-1,0,-2,2,1,4,C.brown);
 if(frame){ m.box(-1,1,-1,2,1,2,C.orange); m.set(0,2,0,C.yellow).set(-1,2,-1,C.orange).set(0,3,0,C.yellow); }
 else { m.box(-1,1,-1,2,2,2,C.orange); m.set(0,3,-1,C.yellow).set(-1,3,0,C.yellow); }
 return m;
};
M.cloud = function(){
 var m = new Model();
 m.box(-4,0,-1,8,2,3,C.wht); m.box(-2,1,-2,5,2,5,C.wht); m.box(1,0,0,5,2,2,C.wht); m.box(-6,0,0,3,1,2,C.wht);
 return m;
};
M.bird = function(frame){
 var m = new Model();
 if(frame){ m.set(-1,1,0,C.ink).set(0,0,0,C.ink).set(1,1,0,C.ink); } else { m.set(-1,0,0,C.ink).set(0,0,0,C.ink).set(1,0,0,C.ink); }
 return m;
};
M.puff = function(size){ var m = new Model(); m.box(-Math.floor(size/2),0,-Math.floor(size/2),size,size,size,C.smoke); return m; };
M.wave = function(frame){ var m = new Model(); if(frame){ m.set(0,0,0,C.foam).set(1,0,0,C.foam); } else { m.set(1,0,0,C.foam).set(2,0,0,C.foam); } return m; };
M.crate = function(){ return new Model().box(-2,0,-2,4,4,4,C.wood).box(-2,1,1,4,1,1,C.brown); };
/* 立てた文字（1ドット = 16pxの立方体） */
var GLYPH = {
 T:['#####','..#..','..#..','..#..','..#..'],
 D:['####.','#...#','#...#','#...#','####.'],
 L:['#....','#....','#....','#....','#####']
};
M.letter = function(ch, col){
 var m = new Model(), g = GLYPH[ch];
 for(var r=0;r<g.length;r++) for(var c=0;c<g[r].length;c++) if(g[r][c]==='#') m.box(c*2-5, (g.length-1-r)*2, -1, 2, 2, 2, col);
 return m;
};

/* ---------- WebGL ---------- */
var stage = document.getElementById('stage'), cv = document.getElementById('gl');
var gl = cv.getContext('webgl', {antialias:false, alpha:false, depth:true, powerPreference:'high-performance'})
      || cv.getContext('experimental-webgl', {antialias:false, alpha:false, depth:true});
if(!gl){ document.documentElement.classList.add('nogl'); return; }

var VS = [
 'attribute vec3 a_pos; attribute vec3 a_col;',
 'uniform vec3 u_off; uniform vec2 u_cam; uniform vec2 u_half;',
 'varying vec3 v_col;',
 'void main(){',
 ' vec3 p = a_pos + u_off;',
 ' float sx = (p.x - p.z) * 8.0 + u_cam.x;',
 ' float sy = (p.x + p.z) * 4.0 - p.y * 8.0 + u_cam.y;',
 ' float d = p.x + p.y + p.z;',
 ' gl_Position = vec4(sx / u_half.x - 1.0, 1.0 - sy / u_half.y, -d / 4096.0, 1.0);',
 ' v_col = a_col;',
 '}'].join('\n');
var FS = 'precision mediump float; varying vec3 v_col; void main(){ gl_FragColor = vec4(v_col, 1.0); }';
function shader(type, src){ var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
var prog = gl.createProgram();
gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS));
gl.linkProgram(prog); gl.useProgram(prog);
var aPos = gl.getAttribLocation(prog, 'a_pos'), aCol = gl.getAttribLocation(prog, 'a_col');
var uOff = gl.getUniformLocation(prog, 'u_off'), uCam = gl.getUniformLocation(prog, 'u_cam'), uHalf = gl.getUniformLocation(prog, 'u_half');
gl.enableVertexAttribArray(aPos); gl.enableVertexAttribArray(aCol);
gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
var sea = hex(C.sea = '#79CDEB'); gl.clearColor(sea[0], sea[1], sea[2], 1);

function upload(arr){
 var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
 return {buf:b, n:arr.length/6};
}
function meshOf(model){ var out = []; emit(out, model, 0, 0, 0); return upload(out); }
function drawMesh(g, x, y, z){
 if(!g.n) return;
 gl.bindBuffer(gl.ARRAY_BUFFER, g.buf);
 gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 24, 0);
 gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 24, 12);
 gl.uniform3f(uOff, x, y, z);
 gl.drawArrays(gl.TRIANGLES, 0, g.n);
}

/* ---------- 街を組む ----------
   地面は1枚。物は x 48単位 × z 3帯の区画に分けて持ち、画面に入った区画から上から降りてきて組み上がる */
var STATIC = [], movers = [], R = rng(20180501);
var CHW = 48, chunks = {};
function put(model, x, z, y){
 var cx = Math.floor(x / CHW), cz = z < -20 ? 0 : (z > 20 ? 2 : 1), k = cx + ':' + cz;
 var ch = chunks[k] || (chunks[k] = {arr:[], x0:cx*CHW, x1:cx*CHW+CHW, z0:cz===0 ? -ZW-60 : (cz===2 ? 20 : -20), z1:cz===0 ? -20 : (cz===2 ? ZW+60 : 20), t0:null, mesh:null});
 emit(ch.arr, model, x, y||0, z);
}

/* 地面 */
(function ground(){
 var tx, tz;
 for(tx=0; tx<L/8; tx++) for(tz=-8; tz<8; tz++){
  var x0 = tx*8, z0 = tz*8, c;
  if(tz===-1 || tz===0) c = C.asphalt;
  else if(tz===-2 || tz===1) c = C.gray;
  else c = ((tx+tz)&1) ? C.g1 : C.g2;
  if(SCENE.tile){ var cc = SCENE.tile(tx, tz, c); if(cc) c = cc; }
  flat(STATIC, x0, z0, x0+8, z0+8, 0, c);
 }
 for(tx=0; tx<L; tx+=8) flat(STATIC, tx, -0.5, tx+4, 0.5, 0.02, C.line);              // 中央線
 flat(STATIC, 0, -8.5, L, -8, 0.02, C.line); flat(STATIC, 0, 8, L, 8.5, 0.02, C.line);   // 路側線
 for(tx=0; tx<L; tx+=8){ flat(STATIC, tx, -16, tx+8, -15.5, 0.02, C.sand); flat(STATIC, tx, 15.5, tx+8, 16, 0.02, C.sand); }
 /* 島のふち（土）。見えるのは +x と +z の面 */
 var dirt = hex(C.dirt), sand = hex(C.sand);
 quad(STATIC, [L,SEA_Y,-ZW],[L,0,-ZW],[L,0,ZW],[L,SEA_Y,ZW], dirt, SH_X);
 quad(STATIC, [0,SEA_Y,ZW],[L,SEA_Y,ZW],[L,0,ZW],[0,0,ZW], dirt, SH_Z);
 quad(STATIC, [L,-1,-ZW],[L,0,-ZW],[L,0,ZW],[L,-1,ZW], sand, SH_X);
 quad(STATIC, [0,-1,ZW],[L,-1,ZW],[L,0,ZW],[0,0,ZW], sand, SH_Z);
 /* 花 */
 var fl = [C.red, C.yellow, C.wht, C.pink, C.orange];
 for(var i=0;i<260;i++){
  var x = Math.floor(R()*L), z = Math.floor(18 + R()*44) * (R()<0.5 ? 1 : -1);
  put(M.flower(fl[i%fl.length]), x, z);
 }
})();

/* 道ぞいの街灯とベンチ */
(function street(){
 for(var x=40; x<L-20; x+=48){ put(M.lamp(), x, -14); put(M.lamp(), x+24, 13); }
 for(var i=0;i<12;i++){ put(M.bench(), 70 + i*96, 14); }
})();
/* 奥の木々（章の場面とかぶらない帯に置く） */
(function woods(){
 for(var i=0;i<70;i++){
  var x = 10 + Math.floor(R()*(L-20)), z = (52 + Math.floor(R()*8)) * (R()<0.5 ? 1 : -1);
  var k = R();
  put(k<0.5 ? M.tree(k<0.25 ? C.g3 : C.dg) : (k<0.85 ? M.pine() : M.sakura()), x, z);
 }
 for(var j=0;j<40;j++) put(M.bush(), Math.floor(R()*L), (20 + Math.floor(R()*28)) * (R()<0.5 ? 1 : -1));
})();

/* 海の上。船と白波 */
(function seaside(){
 movers.push(drift([M.boat(C.wht)], 60, SEA_Y, -104, 1.2, 0, L));
 movers.push(drift([M.boat(C.cream)], 400, SEA_Y, 106, -0.9, 0, L));
 movers.push(drift([M.boat(C.wht)], 900, SEA_Y, -110, 1.5, 0, L));
 for(var i=0;i<60;i++){
  var x = Math.floor(R()*L), z = (72 + Math.floor(R()*40)) * (R()<0.5 ? 1 : -1);
  movers.push(anim([M.wave(0), M.wave(1)], x, SEA_Y, z, 1 + R()));
 }
})();
/* 空。雲と鳥 */
(function sky(){
 for(var i=0;i<7;i++) movers.push(drift([M.cloud()], Math.floor(R()*L), 40 + Math.floor(R()*8), Math.floor(R()*80 - 40), 0.6 + R()*0.4, -40, L+40));
 for(var j=0;j<3;j++) movers.push(drift([M.bird(0), M.bird(1)], Math.floor(R()*L), 24, Math.floor(R()*40 - 20), 4 + R()*2, -20, L+20, 5));
})();
/* 道を走る車。左車線は +x へ、右車線は -x へ */
(function traffic(){
 var cols = [C.blue, C.red, C.wht, C.yellow, C.lime, C.cyan];
 for(var i=0;i<5;i++) movers.push(drift([M.car(cols[i])], Math.floor(R()*L), 0, -4, 5 + R()*2, -30, L+30));
 movers.push(drift([M.bus()], 300, 0, -4, 4.5, -30, L+30));
 for(var j=0;j<4;j++) movers.push(drift([M.car(cols[5-j]).mirror()], Math.floor(R()*L), 0, 4, -(5 + R()*2), -30, L+30));
 movers.push(drift([M.kei(C.wood, C.red).mirror()], 700, 0, 4, -4, -30, L+30));
 movers.push(drift([M.truck(C.wht).mirror()], 150, 0, 4, -4.5, -30, L+30));
})();
/* 歩く人 */
(function walkers(){
 var sh = [C.red, C.blue, C.yellow, C.lime, C.wht, C.pink, C.cyan, C.purple], pa = [C.ink, C.brown, C.navy];
 for(var i=0;i<14;i++){
  var s = sh[i%sh.length], p = pa[i%pa.length], hat = (i%4===0) ? C.yellow : null;
  var fr = [M.person(s,p,hat,1), M.person(s,p,hat,2)];
  var dir = R()<0.5 ? 1 : -1;
  movers.push(walker(fr, Math.floor(R()*L), i%2 ? 12 : -12, dir * (1.2 + R()*0.8)));
 }
})();

/* 動くものの型 */
function frames(models){ var a = []; for(var i=0;i<models.length;i++) a.push(meshOf(models[i])); return a; }
function anim(models, x, y, z, fps){ return {fr:frames(models), x:x, y:y, z:z, fps:fps||4, t:R()*3, vx:0}; }
function drift(models, x, y, z, vx, x0, x1, fps){ return {fr:frames(models), x:x, y:y, z:z, vx:vx, x0:x0, x1:x1, fps:fps||4, t:R()*3}; }
function walker(models, x, z, vx){
 var right = frames(models), left = frames([models[0].mirror(), models[1].mirror()]);
 return {fr:vx>0 ? right : left, R:right, Lf:left, x:x, y:0, z:z, vx:vx, x0:20, x1:L-30, fps:4, t:R()*3, walker:true};
}
function smoke(x, y, z){
 var fr = frames([M.puff(1), M.puff(2), M.puff(2), M.puff(1)]);
 var puffs = []; for(var i=0;i<3;i++) puffs.push({h:i*3, f:i%2});
 return {smoke:true, fr:fr, x:x, y:y, z:z, puffs:puffs, vx:0};
}

/* 場面。板の位置と同じファイルで、何をどこに置くかを決める */
var api = {M:M, C:C, R:R, Model:Model, put:put, anim:anim, drift:drift, walker:walker, smoke:smoke, movers:movers, L:L, ZW:ZW, SEA_Y:SEA_Y};
if(SCENE.build) SCENE.build(api);

var staticMesh = upload(STATIC); STATIC = null;
var chunkList = [];
for(var ck in chunks){ var ch = chunks[ck]; ch.mesh = upload(ch.arr); ch.arr = null; chunkList.push(ch); }
function easeOut(t){ return 1 - Math.pow(1 - t, 3); }

/* 主人公。画面の中心に立ち、進むときだけ歩く */
var HR = SCENE.hero || {shirt:C.lime, pants:C.ink, hat:C.brown};
var heroR = frames([M.person(HR.shirt, HR.pants, HR.hat, 0), M.person(HR.shirt, HR.pants, HR.hat, 1), M.person(HR.shirt, HR.pants, HR.hat, 2)]);
var heroL = frames([M.person(HR.shirt, HR.pants, HR.hat, 0).mirror(), M.person(HR.shirt, HR.pants, HR.hat, 1).mirror(), M.person(HR.shirt, HR.pants, HR.hat, 2).mirror()]);

/* ---------- カメラとスクロール ---------- */
var W = 0, H = 0, dpr = 1;
var track = document.getElementById('track');
var cards = [].slice.call(document.querySelectorAll('#cards .card')).map(function(el){
 var side = el.dataset.side;
 return {el:el, x:+el.dataset.x, z: el.dataset.z !== undefined ? +el.dataset.z : (side === 'r' ? -16 : (side === 'l' ? 16 : 0)), side:side, name:el.dataset.name || '', on:false, sign:el.classList.contains('sign') || el.classList.contains('photo'), photo:el.classList.contains('photo')};
});
var stations = cards.filter(function(c){ return !c.sign && (c.el.dataset.name !== undefined || c.el.classList.contains('title')); });
var sttotal = document.getElementById('sttotal'); if(sttotal) sttotal.textContent = (stations.length-1 < 10 ? '0' : '') + (stations.length-1);
/* 幅の足りない画面では、板・写真・標識を道の順に縦一列に流す（指の動きと1:1）。
   それぞれの「流れの上での位置」fy を、重ならないように一度だけ決める */
var flow = false;
function buildFlow(){
 var list = cards.slice().sort(function(a,b){ return a.x - b.x; }), bottom = -1e9, last = 0;
 for(var i=0;i<list.length;i++){
  var c = list[i], h = c.el.offsetHeight, sPx = (c.x - CAM0) * UPX;
  c.fy = Math.max(sPx - h/2, bottom + 24); bottom = c.fy + h; last = bottom;
 }
 return last;
}
function layout(){
 W = innerWidth; H = innerHeight; dpr = Math.min(devicePixelRatio || 1, 2);
 cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
 gl.viewport(0, 0, cv.width, cv.height);
 gl.uniform2f(uHalf, W/2, H/2);
 var th = (CAM1 - CAM0) * UPX + H;
 flow = W < 1100;
 if(flow){ th = Math.max(th, buildFlow() + H/2 + 32); }
 track.style.height = Math.round(th) + 'px';
}
var EASE = 0.12, cur = null, lastT = 0, prevCur = 0, heroT = 0, heroDir = 1;
function targetCam(){ return Math.min(CAM1, CAM0 + (scrollY || 0) / UPX); }
function snap(v){ return Math.round(v*4)/4; }   /* 0.25単位 → 画面では横2px・縦1px */

function project(x, y, z, cx, cy){ return [(x - z)*8 + cx, (x + z)*4 - y*8 + cy]; }

/* 板は道ぞいの点に留めてあり、街と一緒に右下から左上へ斜めに横切る。
   幅の足りない画面では横位置だけ留めて、縦にだけ流す */
function placeCards(cx, cy){
 var scrollPx = (scrollY || 0);
 for(var i=0;i<cards.length;i++){
  var c = cards[i], el = c.el, w = el.offsetWidth, h = el.offsetHeight, px, py;
  if(flow){
   px = (W - w) / 2; py = c.fy - scrollPx + H/2;
  } else {
   var pt = project(c.x, 0, c.z, cx, cy); py = pt[1] - h/2;
   if(c.side === 'r') px = pt[0]; else if(c.side === 'l') px = pt[0] - w; else px = pt[0] - w/2;
   if(c.photo){ py = pt[1] - 76 - h; }                 /* 支柱（10段=80px）の上に乗せる */
  }
  px = Math.round(px/4)*4; py = Math.round(py/4)*4;
  el.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
  var vis = py < H - 80 && py + h > 80 && px < W - 40 && px + w > 40;
  if(vis && !c.on){
   c.on = true; el.classList.add('on');
   var im = el.querySelectorAll('img[data-src]');
   for(var q=0;q<im.length;q++){ im[q].src = im[q].getAttribute('data-src'); im[q].removeAttribute('data-src'); }
  }
 }
}
var stno = document.getElementById('stno'), stname = document.getElementById('stname'), hint = document.getElementById('hint');
var lastStage = -1;
function hud(cam){
 var n = 0, name = 'はじまり';
 for(var i=1;i<stations.length;i++){ if(cam + 20 >= stations[i].x){ n = i; name = stations[i].name; } }
 if(n !== lastStage){ lastStage = n; stno.textContent = (n<10?'0':'') + n; stname.textContent = n ? name : 'はじまり'; }
 hint.classList.toggle('off', cam > CAM0 + 6);
}

function draw(cam, dt, now){
 var cx = Math.round(-cam*8 + W/2), cy = Math.round(-cam*4 + H/2);
 gl.uniform2f(uCam, cx, cy);
 gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 drawMesh(staticMesh, 0, 0, 0);
 var s = dt/1000;
 /* 区画。画面に入った瞬間に時刻を刻み、上から降りてきて着地する */
 for(var q=0;q<chunkList.length;q++){
  var ch = chunkList[q];
  if(ch.t0 === null){
   var minX = (ch.x0 - ch.z1)*8 + cx, maxX = (ch.x1 - ch.z0)*8 + cx;
   var minY = (ch.x0 + ch.z0)*4 - 24*8 + cy, maxY = (ch.x1 + ch.z1)*4 + cy;
   if(maxX < -32 || minX > W + 32 || maxY < -32 || minY > H + 32) continue;
   ch.t0 = (RM.matches || !running) ? now - 1000 : now;
  }
  var pr = Math.min(1, (now - ch.t0) / 420);
  drawMesh(ch.mesh, 0, pr >= 1 ? 0 : Math.round((1 - easeOut(pr)) * 16), 0);
 }
 for(var i=0;i<movers.length;i++){
  var m = movers[i];
  if(m.smoke){
   for(var p=0;p<m.puffs.length;p++){
    var pf = m.puffs[p]; pf.h += s*3; if(pf.h > 9){ pf.h = 0; pf.f = (pf.f+1)&1; }
    var stage_ = pf.h < 3 ? 0 : (pf.h < 6 ? 1 : (pf.h < 8 ? 2 : 3));
    drawMesh(m.fr[stage_], m.x, m.y + Math.floor(pf.h), m.z + (pf.f ? 1 : 0));
   }
   continue;
  }
  if(m.vx){
   m.x += m.vx*s;
   if(m.walker){
    if(m.x > m.x1){ m.vx = -Math.abs(m.vx); m.fr = m.Lf; } else if(m.x < m.x0){ m.vx = Math.abs(m.vx); m.fr = m.R; }
   } else {
    if(m.vx > 0 && m.x > m.x1) m.x = m.x0; else if(m.vx < 0 && m.x < m.x0) m.x = m.x1;
   }
  }
  m.t += s;
  var f = m.fr.length > 1 ? Math.floor(m.t*m.fps) % m.fr.length : 0;
  drawMesh(m.fr[f], snap(m.x), m.y, m.z);
 }
 /* 主人公 */
 var v = (cam - prevCur) / Math.max(s, 0.001); prevCur = cam;
 if(Math.abs(v) > 0.3){ heroDir = v > 0 ? 1 : -1; heroT += s; }
 var hf = Math.abs(v) > 0.3 ? 1 + (Math.floor(heroT*6) % 2) : 0;
 drawMesh(heroDir > 0 ? heroR[hf] : heroL[hf], snap(cam) + 12, 0, -4);   /* 少し先の左車線を歩く */
 placeCards(cx, cy);
 hud(cam);
}

var running = false;
function frame(ts){
 requestAnimationFrame(frame);
 if(!running) return;
 var now = ts || performance.now();
 var dt = lastT ? Math.min(Math.max(now - lastT, 1), 100) : 16.7; lastT = now;
 var tg = targetCam();
 if(cur === null) cur = tg;
 if(RM.matches){ cur = tg; }
 else { var k = 1 - Math.pow(1 - EASE, dt/16.7); cur += (tg - cur) * k; if(Math.abs(tg - cur) < 0.02) cur = tg; }
 draw(snap(cur), dt, now);
}
layout();
addEventListener('resize', function(){ layout(); if(cur !== null) draw(snap(cur), 16.7, performance.now()); }, {passive:true});
requestAnimationFrame(frame);


/* ---------- 窓（立ち止まって読む） ----------
   板の「くわしく読む」で開く。中身は data-win の URL を埋め込む */
var winEl = null, winFrame = null, winTitle = null, winNo = null, winOpenLink = null, winPrev = null, winNext = null, winIdx = -1, winFrom = null;
var winBtns = [].slice.call(document.querySelectorAll('[data-win]'));
function buildWin(){
 winEl = document.createElement('div'); winEl.id = 'win'; winEl.setAttribute('role','dialog'); winEl.setAttribute('aria-modal','true'); winEl.hidden = true;
 winEl.innerHTML = '<div class="win-in">'
  + '<div class="win-head"><span class="no" id="win-no"></span><b class="win-t" id="win-t"></b>'
  + '<a class="win-ext" id="win-ext" target="_blank" rel="noopener">新しいタブで開く ↗</a>'
  + '<button type="button" class="win-x" id="win-x" aria-label="閉じる">×</button></div>'
  + '<div class="win-body"><iframe id="win-frame" title="本文" loading="eager"></iframe><div class="win-html" id="win-html" hidden></div></div>'
  + '<div class="win-foot"><button type="button" class="btn" id="win-prev">◀ 前の章</button>'
  + '<button type="button" class="btn" id="win-close">道にもどる</button>'
  + '<button type="button" class="btn btn-go" id="win-next">次の章 ▶</button></div></div>';
 document.body.appendChild(winEl);
 winFrame = document.getElementById('win-frame'); winTitle = document.getElementById('win-t'); winNo = document.getElementById('win-no');
 winOpenLink = document.getElementById('win-ext'); winPrev = document.getElementById('win-prev'); winNext = document.getElementById('win-next');
 document.getElementById('win-x').addEventListener('click', closeWin);
 document.getElementById('win-close').addEventListener('click', closeWin);
 winPrev.addEventListener('click', function(){ if(winMode === 'pop'){ if(winIdx > 0) openPop(winIdx - 1); } else if(winIdx > 0) openWin(winIdx - 1); });
 winNext.addEventListener('click', function(){ if(winMode === 'pop'){ if(winIdx < popEls.length - 1) openPop(winIdx + 1); } else if(winIdx < winBtns.length - 1) openWin(winIdx + 1); });
 winEl.addEventListener('click', function(e){ if(e.target === winEl) closeWin(); });
 addEventListener('keydown', function(e){ if(e.key === 'Escape' && winEl && !winEl.hidden) closeWin(); });
}
var winMode = 'frame', popEls = [].slice.call(document.querySelectorAll('[data-pop]')), winHtml = null;
/* 標識など、HTMLをそのまま窓に出す */
function showHtml(title, html){
 if(!winEl) buildWin();
 winMode = 'pop';
 winHtml = winHtml || document.getElementById('win-html');
 winTitle.textContent = title || '';
 winNo.textContent = ''; winNo.hidden = true;
 winFrame.src = 'about:blank'; winFrame.hidden = true; winHtml.hidden = false; winHtml.innerHTML = html; winHtml.scrollTop = 0;
 winOpenLink.hidden = true;
 winEl.hidden = false; document.documentElement.classList.add('win-open');
 document.getElementById('win-x').focus();
}
function openPop(i){
 var el = popEls[i]; if(!el) return;
 winIdx = i;
 showHtml(el.getAttribute('data-pop-title') || '', el.getAttribute('data-pop'));
 winPrev.disabled = i <= 0; winNext.disabled = i >= popEls.length - 1;
 winPrev.textContent = '◀ 前の企画'; winNext.textContent = '次の企画 ▶';
}
/* 場面側から使う口。窓に HTML を出す／板の高さが変わったあとに流れを組み直す */
window.Road = {
 openHtml: function(title, html){ winIdx = -1; showHtml(title, html); winPrev.disabled = true; winNext.disabled = true; winPrev.textContent = '◀'; winNext.textContent = '▶'; },
 closeWin: function(){ closeWin(); },
 relayout: function(){ layout(); if(cur !== null) draw(snap(cur), 16.7, performance.now()); }
};
popEls.forEach(function(el, i){
 el.addEventListener('click', function(){ winFrom = el; openPop(i); });
 el.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); winFrom = el; openPop(i); } });
});
function openWin(i){
 if(!winEl) buildWin();
 var b = winBtns[i]; if(!b) return;
 winIdx = i; winMode = 'frame';
 winHtml = winHtml || document.getElementById('win-html'); winHtml.hidden = true; winFrame.hidden = false; winOpenLink.hidden = false;
 winPrev.textContent = '◀ 前の章'; winNext.textContent = '次の章 ▶';
 var card = b.closest('.card'), h = card ? card.querySelector('h1,h2') : null, no = card ? card.querySelector('.no') : null;
 winTitle.textContent = b.dataset.winTitle || (h ? h.textContent : '');
 winNo.textContent = no ? no.textContent : ''; winNo.hidden = !no;
 winFrame.src = b.dataset.win; winOpenLink.href = b.dataset.win;
 winPrev.disabled = i <= 0; winNext.disabled = i >= winBtns.length - 1;
 winEl.hidden = false; document.documentElement.classList.add('win-open');
 document.getElementById('win-x').focus();
}
function closeWin(){
 if(!winEl || winEl.hidden) return;
 winEl.hidden = true; document.documentElement.classList.remove('win-open');
 winFrame.src = 'about:blank';
 if(winFrom && winFrom.focus) winFrom.focus();
}
winBtns.forEach(function(b, i){ b.addEventListener('click', function(e){ e.preventDefault(); winFrom = b; openWin(i); }); });

/* ---------- 音（チップチューン。ファイルなし） ---------- */
var Chip = (function(){
 var ctx = null, master = null, timer = 0, step = 0, next = 0, on = false, noiseBuf = null;
 var STEP = 60/132/2;   /* 132 BPM の8分 */
 var lead = [72,76,79,76, 72,76,79,81, 79,0,76,0, 74,76,74,72, 69,72,76,72, 69,72,76,77, 76,0,74,72, 74,0,0,0,
             79,81,84,81, 79,81,84,86, 84,0,81,0, 79,81,79,76, 77,79,81,79, 77,79,81,84, 83,0,81,79, 84,0,0,0];
 var bass = [48,0,55,0, 48,0,55,0, 53,0,60,0, 55,0,50,0, 45,0,52,0, 45,0,52,0, 50,0,57,0, 55,0,55,0];
 function f(n){ return 440*Math.pow(2, (n-69)/12); }
 function tone(type, n, t, len, vol){
  var o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = f(n);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t+0.005);
  g.gain.setValueAtTime(vol, t+len*0.5); g.gain.linearRampToValueAtTime(0, t+len);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+len+0.02);
 }
 function kick(t){
  var o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(40, t+0.09);
  g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.1);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+0.12);
 }
 function hat(t, vol){
  var s = ctx.createBufferSource(), g = ctx.createGain();
  s.buffer = noiseBuf; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.03);
  s.connect(g); g.connect(master); s.start(t); s.stop(t+0.04);
 }
 function sched(){
  while(next < ctx.currentTime + 0.15){
   var i = step % 64, j = step % 32;
   if(lead[i]) tone('square', lead[i], next, STEP*0.9, 0.045);
   if(bass[j]) tone('triangle', bass[j], next, STEP*1.8, 0.10);
   if(i % 4 === 0) kick(next); else if(i % 2 === 0) hat(next, 0.05); else hat(next, 0.025);
   next += STEP; step++;
  }
 }
 function start(){
  if(!ctx){
   var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return false;
   ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
   noiseBuf = ctx.createBuffer(1, ctx.sampleRate*0.05, ctx.sampleRate);
   var d = noiseBuf.getChannelData(0); for(var i=0;i<d.length;i++) d[i] = Math.random()*2-1;
  }
  if(ctx.resume) ctx.resume();
  next = ctx.currentTime + 0.05; timer = setInterval(sched, 40); on = true; return true;
 }
 function stop(){ clearInterval(timer); timer = 0; on = false; if(ctx && ctx.suspend) ctx.suspend(); }
 return {start:start, stop:stop, isOn:function(){ return on; }};
})();
var sndBtn = document.getElementById('snd');
function setSound(v){
 var ok = v ? Chip.start() : (Chip.stop(), true);
 var onNow = v && ok;
 sndBtn.setAttribute('aria-pressed', onNow ? 'true' : 'false');
 sndBtn.querySelector('b').textContent = onNow ? 'ON' : 'OFF';
}
sndBtn.addEventListener('click', function(){ setSound(!Chip.isOn()); });
document.addEventListener('visibilitychange', function(){ if(document.hidden && Chip.isOn()){ Chip.stop(); sndBtn.setAttribute('aria-pressed','false'); sndBtn.querySelector('b').textContent = 'OFF'; } });

/* ---------- 入口 ---------- */
var gate = document.getElementById('gate'), fill = document.getElementById('barfill'), pct = document.getElementById('pct');
var gbtns = document.getElementById('gatebtns'), gload = document.getElementById('gateload');
(function loading(){
 var t0 = performance.now(), dur = 900;
 function tick(){
  var p = Math.min(1, (performance.now() - t0)/dur);
  var q = Math.floor(p*16)/16;                       /* 16段で進む */
  fill.style.width = (q*100) + '%'; pct.textContent = Math.round(q*100);
  if(p < 1) requestAnimationFrame(tick);
  else { gload.textContent = 'READY'; gbtns.hidden = false; document.getElementById('enter').focus(); }
 }
 requestAnimationFrame(tick);
})();
/* 入るときの、ブロックが消えていくワイプ */
var wipe = document.getElementById('wipe');
function doWipe(done){
 var c = wipe.getContext('2d'); if(!c || RM.matches){ done(); return; }
 var B = 32, cols = Math.ceil(W/B), rows = Math.ceil(H/B);
 wipe.width = W; wipe.height = H; wipe.style.display = 'block';
 var t0 = performance.now(), TOTAL = 700, ink = C.ink;
 function tick(){
  var t = performance.now() - t0;
  c.clearRect(0, 0, W, H); c.fillStyle = ink;
  for(var j=0;j<rows;j++) for(var i=0;i<cols;i++){
   var delay = ((i*7 + j*13 + ((i*j)%5)*3) % 17) / 17 * 420;
   var p = Math.max(0, Math.min(1, (t - delay)/240));
   var s = Math.round((1-p)*B/4)*4; if(s <= 0) continue;
   c.fillRect(i*B + (B-s)/2, j*B + (B-s)/2, s, s);
  }
  if(t < TOTAL) requestAnimationFrame(tick); else { wipe.style.display = 'none'; done(); }
 }
 tick();
}
function enter(withSound){
 gate.classList.add('out');
 running = true; lastT = 0; cur = targetCam(); prevCur = cur;
 draw(snap(cur), 16.7, performance.now());
 if(withSound) setSound(true);
 doWipe(function(){});
}
document.getElementById('enter').addEventListener('click', function(){ enter(true); });
document.getElementById('enterq').addEventListener('click', function(){ enter(false); });
/* 検証用: ?go=1 で入口を飛ばす、?wy=<scrollY> でその位置に立つ */
var q = new URLSearchParams(location.search);
if(q.get('go')){ gate.classList.add('out'); running = true; }
if(q.get('wy') !== null){ scrollTo(0, +q.get('wy')); }
})();
