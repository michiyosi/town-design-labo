/* このページが読まれたかを知るための計測（GA4）。
   道のページと縦に読む版の両方から読む。

   ・章の窓は story.html を iframe で開くので、そのままだと窓を開くたびに
     縦に読む版の閲覧が1件ずつ増える。枠の中では何もしない（下の isEmbedded）
   ・拾うのは「どこまで進んだか」と「何を押したか」だけ。文字の入力は拾わない
   ・押した要素は road-scene.js 側ではなくここでまとめて見張る。
     ページの作りと計測を混ぜないため */
(function(){
 'use strict';
 var ID = 'G-SD0J17P6ST';   /* 本体サイトと同じ GA4 プロパティ */

 /* 枠の中（章の窓）では数えない */
 var isEmbedded = false;
 try{ isEmbedded = window.top !== window.self; }catch(e){ isEmbedded = true; }
 if(isEmbedded || new URLSearchParams(location.search).get('ch') !== null) return;

 var s = document.createElement('script');
 s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
 document.head.appendChild(s);
 window.dataLayer = window.dataLayer || [];
 function gtag(){ dataLayer.push(arguments); }
 window.gtag = window.gtag || gtag;
 gtag('js', new Date());
 gtag('config', ID);

 function ev(name, params){ try{ gtag('event', name, params || {}); }catch(e){} }
 function trim(t){ return String(t || '').replace(/\s+/g, ' ').trim().slice(0, 80); }

 /* 入場（入口のENTERを押した） */
 addEventListener('road:enter', function(){ ev('road_enter'); }, {once:true});

 /* どこまで進んだか。HUDの章表示が変わったときに、初めての章だけ数える */
 var stname = document.getElementById('stname'), seen = {};
 if(stname && window.MutationObserver){
  new MutationObserver(function(){
   var n = trim(stname.textContent);
   if(!n || seen[n]) return;
   seen[n] = 1;
   ev('reach_stage', {stage_name: n, stage_no: trim((document.getElementById('stno') || {}).textContent)});
  }).observe(stname, {childList:true, characterData:true, subtree:true});
 }

 /* 何を押したか */
 document.addEventListener('click', function(e){
  var t = e.target;
  if(!t || !t.closest) return;
  var el;

  if((el = t.closest('[data-win]')))
   return ev('open_chapter', {chapter: trim(el.getAttribute('data-win-title') || el.textContent), src: el.getAttribute('data-win')});

  if((el = t.closest('.card.sign.year[data-year], .btns.yrs [data-year]')))
   return ev('open_year', {year: el.getAttribute('data-year')});

  if((el = t.closest('#win-html [data-ei]')))
   return ev('open_project', {project: trim(el.querySelector('b') && el.querySelector('b').textContent)});

  if((el = t.closest('.card.sign[data-pop-title]')))
   return ev('open_project', {project: trim(el.getAttribute('data-pop-title'))});

  if(t.closest('.card.faces .ft')) return ev('open_faces');
  if(t.closest('.card.faces [data-group]')) return ev('open_group_photos');

  if((el = t.closest('a[href*="docs.google.com/forms"]'))) return ev('open_pdf_form');
  if((el = t.closest('a[href*="kikaku-ichiran"]'))) return ev('open_pdf_direct');

  if((el = t.closest('.share a'))) return ev('share', {method: el.getAttribute('data-s') || trim(el.textContent)});

  if((el = t.closest('a[href*="m.me/"], a[href*="facebook.com/profile"], a[href*="permalink"]'))){
   if(/外して/.test(el.textContent)) return ev('removal_request');
   return ev('click_cta', {label: trim(el.textContent)});
  }

  if(t.closest('#drawbtn')) return ev('draw_random_post');
  if(t.closest('#tdbtn')) return ev('draw_today');
 }, true);
})();
