/* ---- Google 広告タグ（外部ローダー：CSP対応・インライン不使用） ---- */
(function(){
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18326502333';
  document.head.appendChild(s);
})();
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18326502333');
/* GA4（回遊・滞在・スクロール深度の計測） */
gtag('config', 'G-SD0J17P6ST');

/* ---- 受け付けを証明できない計測は行わない ----
   当サイトから Google フォームへ送信した結果（受理・却下）は、同一オリジンポリシーにより
   ブラウザ側から読み取れない。したがって
     ・/thanks.html への到達を「お問い合わせ成立」とみなす広告コンバージョン
     ・同ページでの Meta Lead / GA4 generate_lead
     ・拡張コンバージョン用のメール・電話の sessionStorage 保存と gtag への受け渡し
   は停止した。計測するのは「送信操作が行われた」という非個人情報のイベントのみ。 */
try { sessionStorage.removeItem('tdl_ud'); } catch (e) { /* 旧バージョンの残存キーを掃除するだけ */ }

/* 送信操作イベント（受理の証明ではない。広告のコンバージョンには転用しない） */
function tdlTrackAttempt(name) {
  try { if (typeof gtag === 'function') gtag('event', name, { send_to: 'G-SD0J17P6ST' }); } catch (e) {}
  try { if (typeof fbq === 'function') fbq('trackCustom', name); } catch (e) {}
}

/* ---- Meta Pixel (external loader; CSP-safe, no inline) ---- */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1752804519503355');
fbq('track', 'PageView');

/* ---- Meta: フォーム入力開始をContactとして計測（低予算時の最適化用マイクロCV） ---- */
document.addEventListener('DOMContentLoaded', function () {
  var mcForm = document.getElementById('cform');
  if (!mcForm || typeof fbq !== 'function') return;
  var mcFired = false;
  mcForm.addEventListener('focusin', function () {
    if (mcFired) return;
    mcFired = true;
    try { fbq('track', 'Contact'); } catch (e) { /* 計測失敗は無視 */ }
  });
});

/* Google Fonts を非ブロッキングで適用（CSP対応: インラインhandler不使用） */
(function () {
  var p = document.querySelector('link[rel="preload"][as="style"][href*="fonts.googleapis.com"]');
  if (!p) return;
  var href = p.href;
  if (document.querySelector('link[rel="stylesheet"][href="' + href + '"]')) return;
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
})();


const hdr = document.getElementById('hdr');
if (hdr) window.addEventListener('scroll', () => hdr.classList.toggle('scrolled', window.scrollY > 8));

const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
if (burger && menu) {
  /* 折り畳みメニューはモーダルではないので、focus trap は設けない。
     スクロールとキーボード操作を妨げず、開閉状態だけを支援技術に伝える。 */
  burger.setAttribute('aria-controls', menu.id || 'menu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  setMenu(menu.classList.contains('open'));
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !menu.classList.contains('open')) return;
    setMenu(false);
    burger.focus();
  });
  /* 横並びメニューに戻る幅では、開いた状態を残さない */
  const mqDesktop = window.matchMedia('(min-width: 881px)');
  const syncMenuWidth = (e) => { if (e.matches) setMenu(false); };
  if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', syncMenuWidth);
  else if (mqDesktop.addListener) mqDesktop.addListener(syncMenuWidth);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---- お問い合わせフォーム（Googleフォームへ通常POST） ----
   送信先は Google のフォーム受付URL。応答はそのまま同じタブに表示されるため、
   受け付けられたかどうかは Google の画面（例:「回答を記録しました」）で確認してもらう。
   このスクリプトは連打の抑制と状況表示だけを担当し、成功・失敗の判定はしない。
   JavaScript が無効でも、フォームは通常のPOSTとして送信できる。 */
const cform = document.getElementById('cform');
const cfBtn = document.getElementById('cform-submit');
const cfStatus = document.getElementById('cform-status');
const cfStatusMsg = document.getElementById('cform-status-msg');
if (cform) {
  const cfBtnHTML = cfBtn ? cfBtn.innerHTML : '';
  let cfSending = false;
  let cfTimer = null;

  const cfSay = (msg) => {
    if (!cfStatus || !cfStatusMsg) return;
    cfStatusMsg.textContent = msg;
    cfStatus.hidden = false;
  };
  const cfReset = () => {
    cfSending = false;
    if (cfTimer) { clearTimeout(cfTimer); cfTimer = null; }
    if (cfBtn) { cfBtn.disabled = false; cfBtn.innerHTML = cfBtnHTML; }
  };

  /* ---- きっかけ（流入元）の「その他」----
     Googleフォーム側はチェックボックス形式で、「その他」の値は __other_option__、
     自由記述は entry.2099901741.other_option_response という別の名前で送る必要がある。
     「その他」以外を選んでいるときに自由記述を送ると不整合になるため、
     選択中だけ hidden を有効化する（初期表示・変更時・送信直前に同期）。 */
  const cfSource = cform.querySelector('[name="entry.2099901741"]');
  const cfSourceOther = cform.querySelector('[name="entry.2099901741.other_option_response"]');
  const cfSyncSource = () => {
    if (!cfSource || !cfSourceOther) return;
    cfSourceOther.disabled = cfSource.value !== '__other_option__';
  };
  if (cfSource && cfSourceOther) {
    cfSyncSource();
    cfSource.addEventListener('change', cfSyncSource);
  }

  cform.addEventListener('submit', function (e) {
    cfSyncSource();
    /* 連打の抑制。自動での再送信は行わない。 */
    if (cfSending) { e.preventDefault(); return; }
    cfSending = true;
    if (cfBtn) { cfBtn.disabled = true; cfBtn.textContent = '送信中…'; }
    cfSay('送信しています。まもなくGoogleの画面に移動します。「回答を記録しました」と表示された場合、受け付けは完了しています。');
    try { tdlTrackAttempt('contact_submit_attempt'); } catch (err) { /* 計測失敗で送信を止めない */ }
    /* 画面が切り替わらないまま時間が経った場合。受理・不受理は断定できない。 */
    cfTimer = setTimeout(function () {
      cfReset();
      cfSay('しばらく待っても画面が切り替わりませんでした。受け付けられたかどうかは、この画面からは分かりません。入力内容はそのまま残しています。');
    }, 15000);
  });

  /* 戻る操作やbfcacheでの復帰時に、送信ボタンが押せないまま残らないようにする。 */
  window.addEventListener('pageshow', function (ev) {
    const wasSending = cfSending;
    cfReset();
    if (ev.persisted && wasSending) {
      cfSay('この画面に戻りました。送信が受け付けられたかどうかは、この画面からは分かりません。Googleフォームの画面でご確認ください。');
    }
  });
}

/* ---- Works Lightbox ---- */
const galleries = {
  w0: { title: "001 · Caravan Car — OTAFUKU okonomiyaki caravan car", imgs: ["otafuku-01.jpg","otafuku-02.jpg","otafuku-03.jpg","otafuku-04.jpg","otafuku-05.jpg","otafuku-06.jpg","otafuku-07.jpg","otafuku-08.jpg"] },
  w9: { title: "002 · Kitchen Car — KAZARI KITCHEN Type A", imgs: ["kazari-a-01.jpg","kazari-a-02.jpg","kazari-a-03.jpg","kazari-a-04.jpg","kazari-a-05.jpg"] },
  w10: { title: "003 · Kitchen Car — KAZARI KITCHEN Type B", imgs: ["kazari-b-01.jpg","kazari-b-02.jpg","kazari-b-03.jpg","kazari-b-04.jpg","kazari-b-05.jpg"] },
  w11: { title: "004 · Kitchen Car — 生協ひろしま KITCHEN CAR", imgs: ["coop-01.jpg","coop-02.jpg","coop-03.jpg","coop-04.jpg","coop-05.jpg"] },
  w1: { title: "005 · Bar — WICK BAR", imgs: ["wick-01.jpg","wick-02.jpg","wick-03.jpg","wick-04.jpg"] },
  w2: { title: "006 · House — Second House", imgs: ["CppfyPsv4kN_01.jpg","CppfyPsv4kN_02.jpg","CppfyPsv4kN_03.jpg","CppfyPsv4kN_04.jpg","CppfyPsv4kN_05.jpg"] },
  w3: { title: "007 · Pizzeria — PIZZERIA Calcifer", imgs: ["calcifer-01.jpg","calcifer-02.jpg","calcifer-03.jpg","calcifer-04.jpg","calcifer-05.jpg"] },
  w4: { title: "008 · Food Truck — PARA-SOL Kitchen Stand", imgs: ["CG2E9eDB-z0_01.jpg","CG2E9eDB-z0_02.jpg","CG2E9eDB-z0_03.jpg","CG2E9eDB-z0_04.jpg","CG2E9eDB-z0_05.jpg"] },
  w5: { title: "009 · Atelier — レザークラフト移動工房", imgs: ["atelier-01.jpg","atelier-02.jpg","atelier-03.jpg"] },
  w6: { title: "010 · Hotel — THE NOMAD 八ヶ岳 トレーラーホテル", imgs: ["CaGqL7fv3mc_03.jpg","CaGqL7fv3mc_06.jpg","CccEOvgLPIY_04.jpg","CccEOvgLPIY_02.jpg","CccEOvgLPIY_05.jpg"] },
  w7: { title: "011 · Industrial — Saratoga Mark2", imgs: ["CERIUKlhGWp_01.jpg","CERIUKlhGWp_02.jpg","CERIUKlhGWp_03.jpg","CERIUKlhGWp_04.jpg"] },
  w8: { title: "012 · Delivery — 納車・陸送", imgs: ["CrGPYCqvxna_01.jpg","CrGPYCqvxna_02.jpg","CrGPYCqvxna_03.jpg","CrGPYCqvxna_04.jpg","CrGPYCqvxna_05.jpg"] }
};
const IMG_BASE = "./";
if (document.getElementById('lb')) {
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbCount = document.getElementById('lbCount');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let lbKey = null, lbIdx = 0;
  function lbRender() {
    const g = galleries[lbKey]; if (!g) return;
    const multi = g.imgs.length > 1;
    lbImg.src = IMG_BASE + g.imgs[lbIdx];
    lbImg.alt = g.title + " — " + (lbIdx + 1);
    lbTitle.textContent = g.title;
    lbCount.textContent = multi ? (lbIdx + 1) + " / " + g.imgs.length : "";
    lbPrev.style.visibility = multi ? "visible" : "hidden";
    lbNext.style.visibility = multi ? "visible" : "hidden";
    if (multi) {
      [1, -1].forEach(function(d){ var n = (lbIdx + d + g.imgs.length) % g.imgs.length; var p = new Image(); p.src = IMG_BASE + g.imgs[n]; });
    }
  }
  function openLB(key) {
    if (!galleries[key]) return true;
    lbKey = key; lbIdx = 0; lbRender();
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    return false;
  }
  function closeLB() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function lbStep(d) {
    const g = galleries[lbKey]; if (!g) return;
    lbIdx = (lbIdx + d + g.imgs.length) % g.imgs.length; lbRender();
  }
  lbPrev.addEventListener('click', function(e){ e.stopPropagation(); lbStep(-1); });
  lbNext.addEventListener('click', function(e){ e.stopPropagation(); lbStep(1); });
  document.getElementById('lbClose').addEventListener('click', closeLB);
  lb.addEventListener('click', function(e){ if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', function(e){
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    else if (e.key === 'ArrowLeft') lbStep(-1);
    else if (e.key === 'ArrowRight') lbStep(1);
  });

  /* ---- CSP: onclick属性の代替（イベント委譲） ---- */
  document.querySelectorAll('a[data-gallery]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (typeof openLB === 'function' && openLB(a.dataset.gallery) === false) e.preventDefault();
    });
  });
}
