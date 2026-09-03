// AIヤスムラミチヨシ — ホログラム風アバターを director-sm.jpg から作る
// 使い方: NODE_PATH=/opt/node22/lib/node_modules node make.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SRC = path.join(__dirname, '..', '..', '..', '..', 'director-sm.jpg');  // サイト本体の代表者写真
const OUTDIR = path.join(__dirname, '..', 'assets', 'photos');
const b64 = fs.readFileSync(SRC).toString('base64');

// 元画像 1170x780 のうち、バスト（頭〜胸）の範囲
const CROP = { x: 634, y: 152, w: 206, h: 274 };

const THEMES = {
  cyan: { bg1: '#03080f', bg2: '#0a1a2e', accent: '#38e1ff', accent2: '#0a7ea8', text: '#8fdcf5' },
  pink: { bg1: '#12060b', bg2: '#2b0d1a', accent: '#ff6fa5', accent2: '#d15881', text: '#f5b8ce' },
};

function html(theme) {
  const t = THEMES[theme];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @page{margin:0} *{margin:0;padding:0;box-sizing:border-box}
  body{width:1600px;height:1200px;overflow:hidden;
       font-family:'DejaVu Sans Mono',monospace;
       background:radial-gradient(ellipse 80% 70% at 50% 42%, ${t.bg2} 0%, ${t.bg1} 70%, #000 100%)}
  .stage{position:relative;width:1600px;height:1200px}
  .grid{position:absolute;inset:0;opacity:.16;
    background-image:linear-gradient(${t.accent2} 1px,transparent 1px),linear-gradient(90deg,${t.accent2} 1px,transparent 1px);
    background-size:80px 80px;
    -webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 50%,#000 20%,transparent 75%)}
  /* 投影のビーム */
  .beam{position:absolute;left:50%;top:180px;width:760px;height:840px;transform:translateX(-50%);
    background:linear-gradient(to bottom, ${t.accent}22 0%, ${t.accent}08 55%, transparent 100%);
    clip-path:polygon(30% 0,70% 0,100% 100%,0 100%);filter:blur(14px);opacity:.55}
  /* 台座 */
  .plinth{position:absolute;left:50%;top:950px;transform:translateX(-50%);width:620px;height:120px}
  .plinth i{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border:2px solid ${t.accent};
    border-radius:50%;box-shadow:0 0 30px ${t.accent}99, inset 0 0 30px ${t.accent}55}
  .r1{width:600px;height:110px;opacity:.85}
  .r2{width:440px;height:80px;opacity:.5}
  .r3{width:280px;height:50px;opacity:.3}
  .glow{position:absolute;left:50%;top:1000px;transform:translate(-50%,-50%);width:700px;height:200px;
    background:radial-gradient(ellipse at center, ${t.accent}55 0%, transparent 65%);filter:blur(20px)}
  /* アバター本体 */
  #av{position:absolute;left:50%;top:150px;transform:translateX(-50%);width:800px;height:1000px;
    filter:drop-shadow(0 0 18px ${t.accent}aa) drop-shadow(0 0 60px ${t.accent}44)}
  /* HUD */
  .hud{position:absolute;inset:0;color:${t.text}}
  .br{position:absolute;width:64px;height:64px;border:3px solid ${t.accent};opacity:.85}
  .tl{left:52px;top:52px;border-right:0;border-bottom:0}
  .tr{right:52px;top:52px;border-left:0;border-bottom:0}
  .bl{left:52px;bottom:52px;border-right:0;border-top:0}
  .brr{right:52px;bottom:52px;border-left:0;border-top:0}
  .name{position:absolute;left:96px;top:96px;letter-spacing:.22em}
  .name b{display:block;font-size:40px;color:${t.accent};font-weight:700;text-shadow:0 0 20px ${t.accent}88}
  .name span{display:block;font-size:20px;margin-top:10px;opacity:.8}
  .stat{position:absolute;right:96px;top:100px;text-align:right;font-size:18px;line-height:2;opacity:.85}
  .stat u{text-decoration:none;color:${t.accent}}
  .wave{position:absolute;left:50%;bottom:96px;transform:translateX(-50%);width:900px;height:60px;display:flex;
    align-items:center;justify-content:center;gap:6px}
  .wave i{display:block;width:6px;background:${t.accent};border-radius:3px;box-shadow:0 0 10px ${t.accent}}
  .cap{position:absolute;left:50%;bottom:56px;transform:translateX(-50%);font-size:19px;letter-spacing:.16em;opacity:.75}
  </style></head><body>
  <div class="stage">
    <div class="grid"></div><div class="beam"></div>
    <div class="glow"></div>
    <div class="plinth"><i class="r1"></i><i class="r2"></i><i class="r3"></i></div>
    <canvas id="av" width="1600" height="2000"></canvas>
    <div class="hud">
      <div class="br tl"></div><div class="br tr"></div><div class="br bl"></div><div class="br brr"></div>
      <div class="name"><b>AI YASUMURA</b><span>TOWN DESIGN LABO</span></div>
      <div class="stat">STATUS <u>ONLINE</u><br>MODE <u>SHOP ASSIST</u><br>SHEET <u>LOADED</u></div>
      <div class="wave" id="wave"></div>
      <div class="cap">うちの店シート 読み込み完了</div>
    </div>
  </div>
  <script>
  const CROP = ${JSON.stringify(CROP)};
  const ACC = ${JSON.stringify(hexToRgb(t.accent))};
  const W = 1600, H = 2000;
  window.__done = (async () => {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,${b64}';
    await img.decode();
    const c = document.getElementById('av'), ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, CROP.x, CROP.y, CROP.w, CROP.h, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H), p = d.data;
    // 明るさを配列に取り、分布から下限・上限を決める
    const L = new Float32Array(W * H);
    const hist = new Uint32Array(256);
    for (let k = 0, i = 0; k < W * H; k++, i += 4) {
      const l = 0.299*p[i] + 0.587*p[i+1] + 0.114*p[i+2];
      L[k] = l; hist[l | 0]++;
    }
    const total = W * H; let acc = 0, lo = 0, hi = 255;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc > total * 0.02) { lo = v; break; } }
    acc = 0;
    for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc > total * 0.02) { hi = v; break; } }
    const span = Math.max(1, hi - lo);
    const nrm = k => { const v = (L[k] - lo) / span; return v < 0 ? 0 : v > 1 ? 1 : v; };
    const ss = (a, b, x) => { let u = (x - a) / (b - a); u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); };
    // 輪郭（ソーベル）
    const E = new Float32Array(W * H);
    let emax = 1e-6;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const k = y * W + x;
      const gx = -L[k-W-1] - 2*L[k-1] - L[k+W-1] + L[k-W+1] + 2*L[k+1] + L[k+W+1];
      const gy = -L[k-W-1] - 2*L[k-W] - L[k-W+1] + L[k+W-1] + 2*L[k+W] + L[k+W+1];
      const e = Math.sqrt(gx*gx + gy*gy); E[k] = e; if (e > emax) emax = e;
    }
    for (let y = 0; y < H; y++) {
      const ny = (y / H - 0.45) / 0.47, scan = (y % 4 < 2) ? 1 : 0.40;
      for (let x = 0; x < W; x++) {
        const k = y * W + x, i = k * 4;
        // 楕円のマスク（頭と肩のまわりだけ残す）
        const nx = (x / W - 0.5) / 0.36;
        const r = Math.sqrt(nx * nx + ny * ny);
        let m = 1 - (r - 0.62) / 0.38; m = m < 0 ? 0 : m > 1 ? 1 : m; m = m * m * (3 - 2 * m);
        if (y < H * 0.10) m *= ss(0, H * 0.10, y);
        if (y > H * 0.84) m *= Math.max(0, 1 - (y - H * 0.84) / (H * 0.16));
        const v = nrm(k);
        // 明るい背景（白タイル）を抜く
        const bp = 1 - ss(0.58, 0.84, v);
        // 明るい背景（タイルの目地・棚）の輪郭は拾わない
        const e = Math.pow(E[k] / emax, 0.65) * (1 - 0.9 * ss(0.55, 0.88, v));
        const a = m * scan * bp * (0.52 + 0.62 * e);
        const inten = 0.38 + 0.62 * ss(0.04, 0.78, v) + 0.35 * e;
        const g = inten > 1.25 ? 1.25 : inten;
        p[i]   = Math.min(255, ACC[0] * g);
        p[i+1] = Math.min(255, ACC[1] * g);
        p[i+2] = Math.min(255, ACC[2] * (0.62 + 0.38 * g) + 30);
        p[i+3] = Math.round(255 * (a > 1 ? 1 : a));
      }
    }
    ctx.putImageData(d, 0, 0);
    // 波形
    const wv = document.getElementById('wave');
    for (let k = 0; k < 64; k++) {
      const e = document.createElement('i');
      const t2 = Math.sin(k * 0.5) * Math.sin(k * 0.17) ;
      e.style.height = (8 + Math.abs(t2) * 46) + 'px';
      e.style.opacity = 0.35 + Math.abs(t2) * 0.6;
      wv.appendChild(e);
    }
    return true;
  })();
  </script></body></html>`;
}
function hexToRgb(h) { return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]; }

(async () => {
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  for (const theme of Object.keys(THEMES)) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
    await page.setContent(html(theme), { waitUntil: 'load' });
    await page.waitForFunction('window.__done !== undefined');
    await page.evaluate('window.__done');
    await page.waitForTimeout(300);
    const out = path.join(OUTDIR, theme === 'cyan' ? 'ai.jpg' : `ai-${theme}.jpg`);
    await page.screenshot({ path: out, type: 'jpeg', quality: 92 });
    console.log('→', out);
    await page.close();
  }
  await browser.close();
})();
