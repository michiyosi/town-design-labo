
const hdr = document.getElementById('hdr');
window.addEventListener('scroll', () => hdr.classList.toggle('scrolled', window.scrollY > 8));

const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

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
    if (cfBtn) { cfBtn.disabled = true; cfBtn.textContent = 'Sending…'; }
  });
  gsink.addEventListener('load', function () {
    if (!cfSubmitted) return;
    if (cfFields) cfFields.hidden = true;
    if (cfDone) cfDone.hidden = false;
  });
}

/* ---- Works Lightbox ---- */
const galleries = {
  w0: { title: "001 · Caravan Car — OTAFUKU okonomiyaki caravan car", imgs: ["otafuku-01.jpg","otafuku-02.jpg","otafuku-03.jpg","otafuku-04.jpg"] },
  w9: { title: "002 · Kitchen Car — KAZARI KITCHEN Type A", imgs: ["kazari-a-01.jpg","kazari-a-02.jpg","kazari-a-03.jpg","kazari-a-04.jpg","kazari-a-05.jpg"] },
  w10: { title: "003 · Kitchen Car — KAZARI KITCHEN Type B", imgs: ["kazari-b-01.jpg","kazari-b-02.jpg","kazari-b-03.jpg","kazari-b-04.jpg","kazari-b-05.jpg"] },
  w1: { title: "004 · Bar — WICK BAR", imgs: ["eagle-01.jpg","wick-02.jpg","wick-03.jpg","wick-04.jpg"] },
  w2: { title: "005 · House — Second House", imgs: ["CppfyPsv4kN_01.jpg","CppfyPsv4kN_02.jpg","CppfyPsv4kN_03.jpg","CppfyPsv4kN_04.jpg","CppfyPsv4kN_05.jpg"] },
  w3: { title: "006 · Pizzeria — PIZZERIA Calcifer", imgs: ["eagle-11.jpg","calcifer-02.jpg","calcifer-03.jpg","calcifer-04.jpg","calcifer-05.jpg"] },
  w4: { title: "007 · Food Truck — PARA-SOL Kitchen Stand", imgs: ["CG2E9eDB-z0_01.jpg","CG2E9eDB-z0_02.jpg","CG2E9eDB-z0_03.jpg","CG2E9eDB-z0_04.jpg","CG2E9eDB-z0_05.jpg"] },
  w5: { title: "008 · Atelier — レザークラフト移動工房", imgs: ["eagle-04.jpg","eagle-05.jpg","eagle-10.jpg"] },
  w6: { title: "009 · Hotel — THE NOMAD 八ヶ岳 トレーラーホテル", imgs: ["CaGqL7fv3mc_03.jpg","CaGqL7fv3mc_06.jpg","CccEOvgLPIY_04.jpg","CccEOvgLPIY_02.jpg","CccEOvgLPIY_05.jpg"] },
  w7: { title: "010 · Industrial — Saratoga Mark2", imgs: ["CERIUKlhGWp_01.jpg","CERIUKlhGWp_02.jpg","CERIUKlhGWp_03.jpg","CERIUKlhGWp_04.jpg"] },
  w8: { title: "011 · Delivery — 納車・陸送", imgs: ["CrGPYCqvxna_01.jpg","CrGPYCqvxna_02.jpg","CrGPYCqvxna_03.jpg","CrGPYCqvxna_04.jpg","CrGPYCqvxna_05.jpg"] }
};
const IMG_BASE = "./";
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
    if (openLB(a.dataset.gallery) === false) e.preventDefault();
  });
});
