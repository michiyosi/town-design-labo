/* 場面: TOWN DESIGN LABO の街。engine.js より先に読む */
window.ROAD_SCENE = {
 L: 1180,
 hero: null,
 build: function(api){
  var M = api.M, C = api.C, put = api.put, movers = api.movers, anim = api.anim, smoke = api.smoke, SEA_Y = api.SEA_Y;
  /* 章ごとの場面。板と反対側に置く（偶数章は左、奇数章は右） */
  /* 00 出発点。海に鳥居、START のアーチ */
  put(M.arch(C.lime), 60, 0);
  put(M.torii(), 4, -80, SEA_Y);
  put(M.sakura(), 40, 24); put(M.sakura(), 4, 30); put(M.tree(C.g3), 92, -30);
  put(M.house(C.cream, C.roof, 10, 8, 6), 8, 46); put(M.house(C.wht, C.slate, 12, 8, 6), 44, 44);
  /* 01 はじまり。廿日市の町並み */
  put(M.house(C.cream, C.roof, 10, 8, 6), 110, 30); put(M.shop(C.wht, C.red, 12, 8, 6), 132, 46);
  put(M.house(C.wht, C.slate, 10, 8, 7), 158, 30); put(M.vending(C.red), 122, 20); put(M.postbox(), 148, 20);
  put(M.person(C.blue, C.ink, null, 0), 140, 26); put(M.person(C.yellow, C.brown, null, 0), 112, 22);
  /* 02 動く建築。トレーラーハウスとキッチンカー */
  put(M.trailer(), 262, -42); put(M.kei(C.wood, C.red), 236, -24); put(M.tree(C.g3), 296, -30);
  put(M.person(C.lime, C.ink, C.brown, 0), 250, -22); put(M.flower(C.yellow), 260, -22);
  /* 03 法規。検問所と標識 */
  put(M.gate(), 390, 0);
  put(M.sign(C.blue), 372, 18); put(M.sign(C.red), 408, -14); put(M.cone(), 380, 6); put(M.cone(), 400, -6);
  put(M.house(C.wht, C.slate, 8, 6, 5), 372, 30); put(M.person(C.wht, C.navy, C.navy, 0), 396, 22);
  /* 04 つくってきたもの。3台とマルシェ */
  put(M.caravan(), 496, -34); put(M.foodtruck(C.orange), 536, -46); put(M.kei(C.brown, C.lime), 560, -24);
  put(M.stall(C.red), 510, -58); put(M.stall(C.blue), 528, -60);
  put(M.person(C.red, C.ink, null, 0), 500, -22); put(M.person(C.cyan, C.brown, null, 0), 520, -20); put(M.person(C.pink, C.ink, null, 0), 546, -20);
  /* 05 KAZARI KITCHEN。貸し出す軽トラと並ぶ人 */
  put(M.kei(C.wood, C.red), 640, 26); put(M.kei(C.cream, C.blue), 668, 42);
  put(M.person(C.yellow, C.ink, null, 0), 650, 20); put(M.person(C.purple, C.brown, null, 0), 656, 20); put(M.person(C.wht, C.navy, null, 0), 662, 20);
  movers.push(anim([M.flagpole(0, C.yellow), M.flagpole(1, C.yellow)], 632, 0, 20, 3));
  movers.push(anim([M.flagpole(0, C.red), M.flagpole(1, C.red)], 680, 0, 22, 3));
  /* 06 つくる仲間。倉庫と運搬 */
  put(M.warehouse(), 782, -46); put(M.carrier(), 812, -22); put(M.crate(), 756, -24); put(M.crate(), 762, -28); put(M.crate(), 760, -20);
  put(M.truck(C.wht), 750, -40); put(M.person(C.blue, C.ink, C.yellow, 0), 770, -20);
  /* 07 参考価格。キャンプ場 */
  put(M.dome(), 898, 30); put(M.dome(), 924, 48); put(M.sauna(), 946, 28); put(M.tent(C.orange), 892, 50); put(M.tent(C.blue), 908, 60);
  put(M.pine(), 880, 34); put(M.pine(), 936, 54); put(M.bench(), 912, 40);
  movers.push(anim([M.campfire(0), M.campfire(1)], 916, 0, 40, 6));
  movers.push(smoke(949, 10, 27));
  /* 08 ここから。TDL の文字、ゴール */
  put(M.letter('T', C.lime), 1024, -40); put(M.letter('D', C.cyan), 1040, -40); put(M.letter('L', C.orange), 1056, -40);
  put(M.postbox(), 1030, -20); put(M.bench(), 1050, -20); put(M.tree(C.g3), 1076, -32);
  put(M.arch(C.yellow), 1112, 0);
  movers.push(anim([M.goalflag(0), M.goalflag(1)], 1122, 0, -12, 3));
 }
};
