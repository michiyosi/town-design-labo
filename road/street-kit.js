/* 道の道具箱。engine.js の場面（ROAD_SCENE.build）から呼ぶ。
   通りの検討でよく出てくる要素（並木・植樹桝・街灯・パークレット・
   ボラード・縁石・沿道の建物など）を、等角ボクセルの物として持っている。
   /street/ と /life/ の両方で使う。
       STREETKIT.models(api);   // api.M に物を足す
       STREETKIT.P              // 路面の色
   engine.js より先に読むこと（場面ファイルよりもさらに先）。 */
window.STREETKIT = (function(){
'use strict';

/* 路面の色 */
var P = {
 walk1:'#C9C2B6', walk2:'#BFB8AB',            // いまの歩道
 wide1:'#E7E0CD', wide2:'#DBD3BE',            // 広げた歩道
 brick1:'#C08457', brick2:'#B3784E',          // レンガ（舗装の色の選択肢のひとつ）
 lot1:'#CBD0D6',  lot2:'#C2C8D0',             // 沿道の敷地
 back1:'#B9C0C7', back2:'#B0B8C0',            // 奥の街区
 cross:'#767E88', road:'#6B7280', kerb:'#D6D1C6'
};

var GLY = {
 A:['.###.','#...#','#####','#...#','#...#'],
 B:['####.','#...#','####.','#...#','####.'],
 C:['.####','#....','#....','#....','.####']
};

function models(api){
 var M = api.M, C = api.C, Model = api.Model;
 if(M.plane) return M;                        // 二度呼んでも足さない

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
 /* 車道から歩道へ取り返した2単位ぶん。一段上げて、縞を入れる */
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
  m.box(x0+1, 0, zf, w-2, 4, 1, '#2B3038');
  m.box(x0+2, 1, zf, w-4, 2, 1, C.glass);
  m.box(x0+1, 5, zf, w-2, 2, 1, acc);
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
 /* 区間の目印（A・B・C の板） */
 M.marker = function(ch, col){
  var m = new Model(), g = GLY[ch];
  m.box(-2, 0, 0, 4, 2, 3, '#3F454C');
  m.box(-1, 2, 0, 3, 6, 2, '#585F68');
  m.box(-10, 8, 0, 20, 22, 1, C.ink);
  m.box(-9, 9, 0, 18, 20, 1, col);
  for(var r = 0; r < 5; r++) for(var q = 0; q < 5; q++) if(g[r][q] === '#') m.box(-5 + q*2, 14 + (4-r)*2, 0, 2, 2, 1, C.ink);
  return m;
 };
 /* アーケードの入口（商店街につながる側） */
 M.arcade = function(){
  var m = new Model(), col = '#B8C0CC';
  m.box(-2, 0, -22, 3, 13, 3, col); m.box(-2, 0, 19, 3, 13, 3, col);
  for(var z = -22; z < 22; z++) m.box(-2, 13, z, 3, 1, 1, ((z+22) >> 2) % 2 ? '#DDE3EA' : C.glass);
  m.box(-3, 14, -22, 5, 1, 44, '#9AA3AD');
  m.box(-2, 9, -22, 3, 2, 3, C.lime); m.box(-2, 9, 19, 3, 2, 3, C.lime);
  return m;
 };
 return M;
}

/* 並木。x0〜x1 の区間に、植樹桝つきの高木を左右へ互い違いに立てる */
function trees(api, x0, x1, step, zn, zf, skip){
 var put = api.put, M = api.M, x;
 step = step || 28; zn = zn == null ? -13 : zn; zf = zf == null ? 13 : zf;
 for(x = x0; x < x1; x += step){ if(skip && skip(x)) continue; put(M.pit(), x, zn); put(M.plane(true), x, zn, 1); }
 for(x = x0 + step/2; x < x1; x += step){ if(skip && skip(x)) continue; put(M.pit(), x, zf); put(M.plane(true), x, zf, 1); }
}

/* 沿道の街並み。手前（+z）は低く、奥（−z）は高く。
   等角の絵では「高さ < z ÷ 2」を超えると、手前の建物が道を隠してしまう */
function frontage(api, x0, x1, step, skip){
 var put = api.put, M = api.M, C = api.C;
 var walls = ['#EFE7D8', '#DCD5CB', '#F0E3D2', '#CED6DC', '#E6D9C8', '#D5CCC0', '#E9E4DC', '#C9CFD6'];
 var accs  = [C.red, C.navy, C.orange, C.purple, C.cyan, C.brown, '#1B2430', '#2F7A3D'];
 var bwalls = ['#AEB6BE', '#B8BCC2', '#A6AEB8', '#BCB6AE'];
 var i = 0, x;
 for(x = x0; x < x1; x += (step || 40)){
  if(skip && (skip(x) || skip(x + 18))) { i++; continue; }
  put(M.bldg(16, 10, 14 + (i % 4) * 6, walls[i % 8], accs[i % 8]), x, -26);
  put(M.bldg(16, 10, 8 + (i % 3) * 2, walls[(i + 3) % 8], accs[(i + 5) % 8]), x + 18, 26);
  i++;
 }
 for(x = x0 - 20, i = 0; x < x1 + 20; x += 34, i++){
  put(M.backblock(22, 12, 22 + (i % 5) * 8, bwalls[(i + 1) % 4]), x, -46);
  put(M.backblock(22, 12, 12 + ((i + 2) % 4) * 2, bwalls[i % 4]), x + 16, 46);
 }
}

return {P:P, models:models, trees:trees, frontage:frontage};
})();
