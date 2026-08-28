
/* 世界版エンジン。依存なし・全部自前。 */
(function(){
'use strict';
var cv=document.getElementById('wc'), ctx=cv.getContext('2d');
var DPR=Math.min(2,devicePixelRatio||1), W=0, H=0;
var A=12*Math.PI/180, cosA=Math.cos(A), sinA=Math.sin(A);
var ZL=1700, INTRO=1000, END=1300;
var NZ=WD.zones.length, TOTAL=INTRO+NZ*ZL+END;
var s=0, target=0, entered=false;
var q=new URLSearchParams(location.search), ws=q.get('ws');

function resize(){
 W=innerWidth; H=innerHeight;
 cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
 cv.style.width=W+'px'; cv.style.height=H+'px';
}
resize(); addEventListener('resize',resize,{passive:true});

/* ---- ドット絵を小さなcanvasに焼く（種×コマ×彩度の段） ---- */
var cache={};
function bake(k,sat){
 var key=k+'|'+sat;
 if(cache[key]) return cache[key];
 var rows=WD.arts[k], w=0, i;
 for(i=0;i<rows.length;i++) if(rows[i].length>w) w=rows[i].length;
 var h=rows.length, c=document.createElement('canvas');
 c.width=w; c.height=h;
 var x2=c.getContext('2d');
 for(var y=0;y<h;y++){
  var row=rows[y];
  for(var x=0;x<row.length;x++){
   var ch=row.charAt(x);
   if(ch==='.'||ch===' ') continue;
   var hex=WD.pal[ch]||'#45688A';
   var v=parseInt(hex.slice(1),16), R=(v>>16)&255, G=(v>>8)&255, B=v&255;
   if(sat<1){var L=0.299*R+0.587*G+0.114*B;R=L+(R-L)*sat;G=L+(G-L)*sat;B=L+(B-L)*sat;}
   x2.fillStyle='rgb('+Math.round(R)+','+Math.round(G)+','+Math.round(B)+')';
   x2.fillRect(x,y,1,1);
  }
 }
 cache[key]=c;
 return c;
}
function satBucket(v){ return v<=0.2?0.12:(v<=0.55?0.5:(v<=0.8?0.75:(v<0.97?0.9:1))); }

/* ---- 配置（章ごとに生成＋見せ場は手置き） ---- */
var items=[], labels=[], photos=[];
function rndf(seed){ var s0=seed; return function(){ s0=(s0*1103515245+12345)&0x7FFFFFFF; return s0/0x7FFFFFFF; }; }
/* 見せ場: [ゾーン番号, 絵, 進み, 横, 倍率] 進みはゾーン内0..1, 横は道からの距離 */
var HERO=[[0,10,0.30,-210,3.4],[0,11,0.55,150,2.6],[0,16,0.75,-140,2.2],
 [1,4,0.5,190,3.0],
 [2,2,0.35,-190,3.2],[2,18,0.55,150,2.4],
 [3,0,0.45,-230,4.2],[3,3,0.75,180,2.6],
 [4,1,0.4,200,3.4],[4,15,0.7,-160,2.4],
 [5,5,0.45,-210,3.4],[5,6,0.7,170,2.8],
 [6,9,0.5,-190,3.6],
 [7,7,0.4,180,3.2],[7,8,0.7,-210,3.0],
 [8,0,0.25,-240,2.8],[8,7,0.45,200,2.8],[8,10,0.65,-170,2.6],[8,5,0.85,190,2.6]];
function zoneSat(zi,t){
 var sv=WD.zones[zi].s;
 if(Array.isArray(sv)) return sv[0]+(sv[1]-sv[0])*Math.min(1,Math.max(0,t));
 return (sv==null)?1:sv;
}
function build(){
 items=[]; labels=[]; photos=[];
 for(var zi=0;zi<NZ;zi++){
  var z=WD.zones[zi], u0=INTRO+zi*ZL;
  var r=rndf(7919*(zi+3));
  /* 建物と人。まばらな章はまばらに */
  var nb=Math.max(2,Math.round(9-(z.b.length<2?6:0)-(zi===1?5:0)));
  for(var i=0;i<nb;i++){
   var k=z.b[(r()*z.b.length)|0];
   var u=u0+80+r()*(ZL-260), v=(r()<0.5?-1:1)*(120+r()*260);
   var fl=[0.6,1,1.32][(r()*3)|0];
   items.push({k:k,u:u,v:v,sc:(1.3+r()*1.3),fl:fl,zi:zi,ph:r()*6.28});
  }
  var nc=(zi===1?1:5);
  for(var i2=0;i2<nc;i2++){
   var k2=z.c[(r()*z.c.length)|0];
   var u2=u0+80+r()*(ZL-260), v2=(r()<0.5?-1:1)*(90+r()*230);
   items.push({k:k2,u:u2,v:v2,sc:(1.0+r()*0.9),fl:[0.6,1,1.32][(r()*3)|0],zi:zi,ph:r()*6.28,
               mv:(k2-WD.nb===4||k2-WD.nb===5)?(r()<0.5?1:-1):0});
  }
  /* 章タイトル */
  labels.push({u:u0+230,v:0,zi:zi,kick:z.kick,title:z.title,sub:z.sub});
  /* 写真のポラロイド */
  for(var pi=0;pi<z.imgs.length&&pi<4;pi++){
   var pu=u0+340+pi*((ZL-420)/4), pv=(pi%2?1:-1)*(200+((pi*53)%90));
   photos.push({src:z.imgs[pi],u:pu,v:pv,rot:((pi*37)%10-5)*Math.PI/180,zi:zi,img:null,tried:false});
  }
 }
 for(var hzi=0;hzi<HERO.length;hzi++){
  var hh=HERO[hzi];
  items.push({k:hh[1],u:INTRO+hh[0]*ZL+hh[2]*ZL,v:hh[3],sc:hh[4],fl:1,zi:hh[0],ph:hzi,hero:1});
 }
 items.sort(function(a,b){return a.fl-b.fl||a.u-b.u;});
}
build();

/* ---- 入力（wheel / touch / キー）。ネイティブスクロールは無い ---- */
addEventListener('wheel',function(e){
 if(!entered) return;
 target+=e.deltaY*1.15; e.preventDefault();
},{passive:false});
var ty=null;
addEventListener('touchstart',function(e){ ty=e.touches[0].clientY; },{passive:true});
addEventListener('touchmove',function(e){
 if(!entered||ty===null) return;
 target+=(ty-e.touches[0].clientY)*2.2; ty=e.touches[0].clientY; e.preventDefault();
},{passive:false});
addEventListener('touchend',function(){ ty=null; },{passive:true});
addEventListener('keydown',function(e){
 if(!entered) return;
 if(e.key==='ArrowDown'||e.key===' ') target+=340;
 if(e.key==='ArrowUp') target-=340;
 if(e.key==='PageDown') target+=H*0.9;
 if(e.key==='PageUp') target-=H*0.9;
});

/* ---- タップで反応（当たり判定は描画時に記録した矩形） ---- */
var hits=[], pulse={};
cv.addEventListener('pointerdown',function(e){
 var x=e.clientX, y=e.clientY;
 for(var i=hits.length-1;i>=0;i--){
  var hh=hits[i];
  if(x>=hh.x&&x<=hh.x+hh.w&&y>=hh.y&&y<=hh.y+hh.h){
   pulse[hh.id]={t0:performance.now(),name:WD.names[hh.k]||'',x:hh.x+hh.w/2,y:hh.y};
   break;
  }
 }
});

/* ---- 描画 ---- */
var pimgs={};
function photoImg(p){
 if(p.img||p.tried) return p.img;
 p.tried=true;
 var im=new Image();
 im.onload=function(){ p.img=im; };
 im.src=p.src;
 return null;
}
function draw(now){
 var t=now/1000;
 ctx.setTransform(DPR,0,0,DPR,0,0);
 ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,W,H);
 /* 点の格子（世界の地） */
 ctx.fillStyle='rgba(0,60,90,.10)';
 var g=18, gx0=-((s*cosA)%g), gy0=-((s*sinA)%g);
 for(var gx=gx0;gx<W;gx+=g) for(var gy=gy0;gy<H;gy+=g) ctx.fillRect(gx,gy,1.6,1.6);
 var camx=s*cosA, camy=s*sinA;
 function scr(u,v,fl){
  var px=u*cosA-v*sinA, py=u*sinA+v*cosA;
  return [ (px-camx)*fl+W/2, (py-camy)*fl+H/2 ];
 }
 /* 道（斜めの点線） */
 ctx.strokeStyle='rgba(0,120,160,.25)'; ctx.lineWidth=3; ctx.setLineDash([2,14]);
 var p0=scr(s-1200,26,1), p1=scr(s+1600,26,1);
 ctx.beginPath(); ctx.moveTo(p0[0],p0[1]); ctx.lineTo(p1[0],p1[1]); ctx.stroke();
 ctx.setLineDash([]);
 hits=[];
 /* 写真（中層） */
 for(var i=0;i<photos.length;i++){
  var p=photos[i];
  if(Math.abs(p.u-s)>1400) continue;
  var im=photoImg(p);
  var pos=scr(p.u,p.v,1);
  var pw=210, ph=160;
  ctx.save();
  ctx.translate(pos[0],pos[1]); ctx.rotate(p.rot-A*0.35);
  ctx.fillStyle='#fff';
  ctx.shadowColor='rgba(0,40,60,.22)'; ctx.shadowBlur=14; ctx.shadowOffsetY=5;
  ctx.fillRect(-pw/2-8,-ph/2-8,pw+16,ph+34);
  ctx.shadowColor='transparent';
  if(im){ctx.drawImage(im,-pw/2,-ph/2,pw,ph);}
  else{ctx.fillStyle='#DCE9F0';ctx.fillRect(-pw/2,-ph/2,pw,ph);}
  ctx.restore();
 }
 /* ドット絵（層の順） */
 for(var i2=0;i2<items.length;i2++){
  var it=items[i2];
  if(Math.abs(it.u-s)>1600/it.fl) continue;
  var sat=satBucket(zoneSat(it.zi,(it.u-(INTRO+it.zi*ZL))/ZL));
  var k=it.k, fr=WD.fr&&WD.fr[String(k)], oy=0;
  if(fr){ var st=Math.floor(t/0.26+it.ph*2)%fr.length; k=fr[st]; oy=(st%2); }
  var img=bake(k,sat);
  var scale=it.sc*3.1*it.fl;
  var pos2=scr(it.u,it.v,it.fl);
  var ww=img.width*scale, hh2=img.height*scale;
  var px2=pos2[0]-ww/2, py2=pos2[1]-hh2+oy*scale;
  if(it.mv){ var L=W+ww*2; px2=(( (pos2[0]+t*40*it.mv) % L)+L)%L-ww; }
  var pu=pulse[i2];
  if(pu){ var dt=(now-pu.t0)/1000; if(dt<0.4){ var b=1+0.18*Math.sin(dt/0.4*Math.PI); ctx.save(); ctx.translate(px2+ww/2,py2+hh2); ctx.scale(b,b); ctx.translate(-(px2+ww/2),-(py2+hh2)); ctx.imageSmoothingEnabled=false; ctx.drawImage(img,px2,py2,ww,hh2); ctx.restore(); } else { ctx.imageSmoothingEnabled=false; ctx.drawImage(img,px2,py2,ww,hh2);} }
  else { ctx.imageSmoothingEnabled=false; ctx.drawImage(img,px2,py2,ww,hh2); }
  if(it.fl>=1) hits.push({id:i2,x:px2,y:py2,w:ww,h:hh2,k:it.k});
 }
 /* 章のタイトル（大きな文字） */
 for(var li=0;li<labels.length;li++){
  var lb=labels[li];
  if(Math.abs(lb.u-s)>1500) continue;
  var lp=scr(lb.u,lb.v-170,1);
  ctx.save();
  ctx.translate(lp[0],lp[1]); ctx.rotate(-0.02);
  ctx.textAlign='left';
  ctx.strokeStyle='rgba(255,255,255,.92)'; ctx.lineJoin='round';
  ctx.font='700 15px "ZMG",sans-serif'; ctx.lineWidth=5;
  ctx.strokeText(lb.kick||WD.zones[lb.zi].n,0,0);
  ctx.fillStyle='#17811E';
  ctx.fillText(lb.kick||WD.zones[lb.zi].n,0,0);
  ctx.font='900 44px "ZMG",sans-serif'; ctx.lineWidth=9;
  ctx.strokeText(lb.title,0,52);
  ctx.fillStyle='#0b3a52';
  ctx.fillText(lb.title,0,52);
  ctx.font='400 14px "ZMG",sans-serif'; ctx.lineWidth=5;
  ctx.strokeText(lb.sub,2,80);
  ctx.fillStyle='#41626f';
  ctx.fillText(lb.sub,2,80);
  ctx.restore();
 }
 /* タップの名札 */
 for(var idn in pulse){
  var pl=pulse[idn], dt2=(now-pl.t0)/1000;
  if(dt2>1.4){ delete pulse[idn]; continue; }
  if(!pl.name) continue;
  ctx.save();
  ctx.globalAlpha=Math.min(1,2-dt2*1.4);
  ctx.font='700 14px "ZMG",sans-serif';
  var tw=ctx.measureText(pl.name).width;
  ctx.fillStyle='#060000';
  ctx.fillRect(pl.x-tw/2-10,pl.y-40,tw+20,28);
  ctx.fillStyle='#fff';
  ctx.textAlign='center';
  ctx.fillText(pl.name,pl.x,pl.y-21);
  ctx.restore();
 }
 /* 進みのバー */
 ctx.fillStyle='rgba(0,60,90,.14)'; ctx.fillRect(0,H-4,W,4);
 ctx.fillStyle='#28DD34'; ctx.fillRect(0,H-4,W*Math.min(1,s/TOTAL),4);
}

/* ---- 章の見出し（HUD） ---- */
var hud=document.getElementById('hud');
function updHud(){
 var zi=Math.floor((s-INTRO)/ZL);
 if(s<INTRO*0.7){ hud.textContent='はじまりへ、進んでください'; return; }
 if(zi>=0&&zi<NZ) hud.textContent=WD.zones[zi].n+'　'+WD.zones[zi].title;
 if(s>TOTAL-END) hud.textContent='おわり　42歳のはじまり';
}

/* ---- ループ（慣性） ---- */
var endshown=false;
function tick(now){
 requestAnimationFrame(tick);
 if(!entered) return;
 target=Math.max(0,Math.min(TOTAL,target));
 s+=(target-s)*0.085;                    /* 慣性。y-n10の「遅れてついてくる」感触 */
 if(Math.abs(target-s)<0.05) s=target;
 draw(now);
 updHud();
 var ec=document.getElementById('endcard');
 if(s>TOTAL-900&&!endshown){ endshown=true; ec.hidden=false; }
 if(s<=TOTAL-900&&endshown){ endshown=false; ec.hidden=true; }
}
requestAnimationFrame(tick);

/* ---- 入口 ---- */
var ov=document.getElementById('enter');
document.getElementById('go2').addEventListener('click',function(){
 ov.hidden=true; entered=true;
});
if(ws!==null){ ov.hidden=true; entered=true; s=target=+ws; }
if(q.get('walk')!==null){ ov.hidden=true; entered=true; }
if(matchMedia('(prefers-reduced-motion: reduce)').matches){
 /* 動きを減らす設定では慣性を切る */
 var _t=tick; s=target;
}
})();
