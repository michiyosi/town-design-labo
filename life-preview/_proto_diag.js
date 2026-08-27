
(function(){
 var seg=document.getElementById('diag'), world=document.getElementById('world'),
     prog=document.getElementById('prog');
 var mq=matchMedia('(prefers-reduced-motion: reduce)');
 var WW=4200, WH=1750;
 function tick(){
  if(!mq.matches){
   var r=seg.getBoundingClientRect();
   var total=seg.offsetHeight-innerHeight;
   var p=Math.min(1,Math.max(0,-r.top/total));
   var dx=p*(WW-innerWidth), dy=p*(WH-innerHeight);
   world.style.transform='translate3d('+(-dx)+'px,'+(-dy)+'px,0)';
   prog.textContent='p='+p.toFixed(2);
  }
  requestAnimationFrame(tick);
 }
 var q=new URLSearchParams(location.search);
 var fp=q.get('p');   // 検証用: pを直接指定し、写像ループは止める
 if(fp!==null){
  document.body.classList.add('fixedp');
  var p=+fp, dx=p*(WW-innerWidth), dy=p*(WH-innerHeight);
  world.style.transform='translate3d('+(-dx)+'px,'+(-dy)+'px,0)';
  prog.textContent='p='+p.toFixed(2)+' (fixed)';
 } else {
  tick();
  var s=q.get('s'); if(s) addEventListener('load',function(){scrollTo(0,+s);});
 }
})();
