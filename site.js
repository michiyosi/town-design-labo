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

/* ---- 拡張コンバージョン用：ユーザー提供データの受け渡し ----
   フォーム送信時にメール・電話を sessionStorage に一時保存し、
   /thanks.html でコンバージョン発火の直前に gtag へ渡す。
   値は gtag によりブラウザ内で SHA-256 ハッシュ化されてから送信され、
   送信後は直ちに sessionStorage から削除する。                       */
var TDL_UD_KEY = 'tdl_ud';
function tdlNormalizePhone(v) {
  if (!v) return '';
  var s = String(v).trim();
  if (s.charAt(0) === '+') return '+' + s.slice(1).replace(/\D/g, '');
  var d = s.replace(/\D/g, '');
  if (!d) return '';
  if (d.charAt(0) === '0') return '+81' + d.slice(1);
  if (d.slice(0, 2) === '81') return '+' + d;
  return '+81' + d;
}
if (location.pathname === '/thanks.html') {
  try {
    var tdlRaw = sessionStorage.getItem(TDL_UD_KEY);
    if (tdlRaw) {
      var tdlUd = JSON.parse(tdlRaw);
      var tdlPayload = {};
      if (tdlUd.email) tdlPayload.email = tdlUd.email;
      if (tdlUd.phone) tdlPayload.phone_number = tdlUd.phone;
      if (tdlPayload.email || tdlPayload.phone_number) {
        gtag('set', 'user_data', tdlPayload);
      }
      sessionStorage.removeItem(TDL_UD_KEY);
    }
  } catch (e) { /* 取得に失敗してもコンバージョン計測は継続する */ }
}

/* 送信完了ページ到達＝コンバージョン */
if (location.pathname === '/thanks.html') {
  gtag('event', 'conversion', {'send_to': 'AW-18326502333/2_pjCLO9kdYcEL334KJE'});
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
if (location.pathname === '/thanks.html') { fbq('track', 'Lead'); }

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
  burger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---- Contact form -> Google Forms (hidden iframe POST) ---- */
const cform = document.getElementById('cform');
const gsink = document.getElementById('gform-sink');
const cfFields = document.getElementById('cform-fields');
const cfDone = document.getElementById('cform-done');
const cfBtn = document.getElementById('cform-submit');
let cfSubmitted = false;
if (cform && gsink) {
  cform.addEventListener('submit', function () {
    cfSubmitted = true;
    /* 拡張コンバージョン用にメール・電話を一時保存（/thanks.html で使用後すぐ削除） */
    try {
      var udEmail = cform.querySelector('input[type="email"]');
      var udTel = cform.querySelector('input[type="tel"]');
      var ud = {};
      if (udEmail && udEmail.value) ud.email = udEmail.value.trim().toLowerCase();
      if (udTel && udTel.value) ud.phone = tdlNormalizePhone(udTel.value);
      if (ud.email || ud.phone) sessionStorage.setItem(TDL_UD_KEY, JSON.stringify(ud));
    } catch (e) { /* 保存に失敗しても送信は継続する */ }
    if (cfBtn) { cfBtn.disabled = true; cfBtn.textContent = 'Sending…'; }
  });
  gsink.addEventListener('load', function () {
    if (!cfSubmitted) return;
    /* 送信成功 -> 計測用サンクスページへ（広告コンバージョンの発火点） */
    if (cfFields) cfFields.hidden = true;
    if (cfDone) cfDone.hidden = false;
    window.location.href = '/thanks.html';
  });
}

/* ---- Works Lightbox ---- */
const galleries = {
  w0: { title: "001 · Caravan Car — OTAFUKU okonomiyaki caravan car", imgs: ["otafuku-01.jpg","otafuku-02.jpg","otafuku-03.jpg","otafuku-04.jpg","otafuku-05.jpg","otafuku-06.jpg","otafuku-07.jpg","otafuku-08.jpg"] },
  w9: { title: "002 · Kitchen Car — KAZARI KITCHEN Type A", imgs: ["kazari-a-01.jpg","kazari-a-02.jpg","kazari-a-03.jpg","kazari-a-04.jpg","kazari-a-05.jpg"] },
  w10: { title: "003 · Kitchen Car — KAZARI KITCHEN Type B", imgs: ["kazari-b-01.jpg","kazari-b-02.jpg","kazari-b-03.jpg","kazari-b-04.jpg","kazari-b-05.jpg"] },
  w11: { title: "004 · Kitchen Car — 生協ひろしま KITCHEN CAR", imgs: ["coop-01.jpg","coop-02.jpg","coop-03.jpg","coop-04.jpg","coop-05.jpg"] },
  w1: { title: "005 · Bar — WICK BAR", imgs: ["eagle-01.jpg","wick-02.jpg","wick-03.jpg","wick-04.jpg"] },
  w2: { title: "006 · House — Second House", imgs: ["CppfyPsv4kN_01.jpg","CppfyPsv4kN_02.jpg","CppfyPsv4kN_03.jpg","CppfyPsv4kN_04.jpg","CppfyPsv4kN_05.jpg"] },
  w3: { title: "007 · Pizzeria — PIZZERIA Calcifer", imgs: ["eagle-11.jpg","calcifer-02.jpg","calcifer-03.jpg","calcifer-04.jpg","calcifer-05.jpg"] },
  w4: { title: "008 · Food Truck — PARA-SOL Kitchen Stand", imgs: ["CG2E9eDB-z0_01.jpg","CG2E9eDB-z0_02.jpg","CG2E9eDB-z0_03.jpg","CG2E9eDB-z0_04.jpg","CG2E9eDB-z0_05.jpg"] },
  w5: { title: "009 · Atelier — レザークラフト移動工房", imgs: ["eagle-04.jpg","eagle-05.jpg","eagle-10.jpg"] },
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
