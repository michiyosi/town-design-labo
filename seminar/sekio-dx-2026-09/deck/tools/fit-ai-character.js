// キャラクターイラスト（正方形）を、スライド8の写真枠（4:3）に切れずに収める
// 使い方: NODE_PATH=$(npm root -g) node tools/fit-ai-character.js
// 入力: assets/photos/ai-character.png   出力: assets/photos/ai.jpg（1600×1200）
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PHOTOS = path.join(__dirname, '..', 'assets', 'photos');
const SRC = path.join(PHOTOS, 'ai-character.png');
const OUT = path.join(PHOTOS, 'ai.jpg');
const W = 1600, H = 1200;

const uri = 'data:image/png;base64,' + fs.readFileSync(SRC).toString('base64');

// 正方形のイラストを中央に置き、左右の余白は同じ絵をぼかして引き伸ばして埋める
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0} body{width:${W}px;height:${H}px;overflow:hidden;background:#0b1f3a}
.bg{position:absolute;inset:-60px;background:url('${uri}') center/cover no-repeat;
    filter:blur(45px) saturate(1.1) brightness(.82)}
.vig{position:absolute;inset:0;
    background:radial-gradient(ellipse 62% 78% at 50% 50%, transparent 45%, rgba(4,12,26,.55) 100%)}
.fg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
    width:${Math.round(H * 0.96)}px;height:${Math.round(H * 0.96)}px;
    background:url('${uri}') center/contain no-repeat;
    -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 7%,#000 93%,transparent 100%),
                       linear-gradient(180deg,transparent 0,#000 5%,#000 95%,transparent 100%);
    -webkit-mask-composite:source-in;mask-composite:intersect}
</style></head><body><div class="bg"></div><div class="vig"></div><div class="fg"></div></body></html>`;

(async () => {
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  await page.screenshot({ path: OUT, type: 'jpeg', quality: 94 });
  await browser.close();
  console.log('→', OUT);
})();
