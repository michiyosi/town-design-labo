/* 費用シミュレーター（CSP対応・インライン不使用）
   本体参考価格＝当社公表の税込参考価格。
   法定費用＝自動車税種別割（標準税率）、自賠責基準料率、固定資産税標準税率。
   出典はページ本文に明記。陸送・登録・設置工事・オプションは条件により変動するため
   利用者の入力値として扱い、当社の価格として表示しない。 */
(function () {
  'use strict';

  var BASE = {
    trailer: { label: 'トレーラーハウス',            price: 7480000, kind: 'trailer' },
    truck:   { label: 'フードトラック・キッチンカー', price: 4950000, kind: 'truck'   },
    shop:    { label: 'モバイルショップ・移動工房',   price: 5720000, kind: 'trailer' },
    unit:    { label: '定置型ユニット',              price: 4180000, kind: 'trailer' }
  };

  // 自動車税（種別割）標準税率・被けん引自動車（年額）
  var TAX_TRAILER = { small: 5300, normal: 10200 };
  // 軽自動車税（種別割）貨物・自家用（年額・標準税率）
  var TAX_KEI_CARGO = 5000;
  // 自賠責 被けん引自動車 12か月（2023年1月届出基準料率／離島・沖縄を除く）
  var CALI_TRAILER = 5320;
  var FIXED_ASSET_RATE = 0.014;    // 固定資産税 標準税率
  // 免税点（地方税法第351条・同一市町村内の課税標準額の合計）
  // 家屋 20万円未満（令和9年度分以後は30万円未満）／償却資産 150万円未満（同180万円未満）
  var HOUSE_TAX_MIN = 200000;

  var $ = function (id) { return document.getElementById(id); };
  var root = $('cs-root');
  if (!root) return;

  var yen = function (n) { return '¥' + Math.round(n).toLocaleString('ja-JP'); };
  var man = function (n) { return (Math.round(n / 1000) / 10).toLocaleString('ja-JP') + '万円'; };
  var num = function (id) { var v = parseFloat(($(id) || {}).value); return isFinite(v) ? v : 0; };

  function track(name, p) {
    try { if (typeof gtag === 'function') gtag('event', name, p || {}); } catch (e) {}
  }

  var fired = false;
  function calc() {
    if (!fired) { fired = true; track('cost_sim_use', {}); }

    var cat = $('cs-cat').value;
    var b = BASE[cat];
    var route = $('cs-route').value;          // vehicle | building
    var size = $('cs-size').value;            // small | normal
    var opt = num('cs-opt') * 10000;
    var etc = num('cs-etc') * 10000;

    /* ---- 初期費用 ---- */
    var initial = b.price + opt + etc;

    /* ---- 年間の法定固定費 ---- */
    var lines = [];
    var annual = 0;

    if (route === 'vehicle') {
      var carTax = (b.kind === 'truck') ? TAX_KEI_CARGO
                 : (size === 'small' ? TAX_TRAILER.small : TAX_TRAILER.normal);
      var carTaxLabel = (b.kind === 'truck')
        ? '軽自動車税（種別割）四輪貨物・自家用'
        : '自動車税（種別割）被けん引自動車' + (size === 'small' ? '・小型' : '・普通（最大積載量8t以下）');
      lines.push({ n: carTaxLabel, v: carTax, s: (b.kind === 'truck' ? '軽貨物（黄色ナンバー・自家用）を前提とした標準税率です。普通貨物ベースの車両なら自動車税（種別割）が最大積載量に応じてかかります。' : '自家用の標準税率です。営業用（緑ナンバー）は別税率になります。都道府県が条例で定めるため地域差もあります。牽引する側のトラクタの自動車税（自家用・小型10,200円／普通20,600円）は別途かかります。') });
      annual += carTax;

      if (b.kind === 'truck') {
        lines.push({ n: '自賠責保険', v: null,
          s: '軽自動車（検査対象）の基準料率が適用され、被けん引車とは別の区分です。契約月数によって額が変わるため、損害保険料率算出機構の基準料率表でご確認ください。2026年11月1日から改定されます。' });
        lines.push({ n: '自動車重量税・検査手数料', v: null,
          s: '車両重量と経過年数で決まるため、国土交通省の「次回自動車重量税額照会サービス（軽自動車）」でご確認ください。軽貨物の車検は初回2年・以後2年ごとです。' });
      } else {
        lines.push({ n: '自賠責保険（12か月）', v: CALI_TRAILER,
          s: '被けん引自動車の基準料率（2023年1月届出／離島・沖縄を除く）。この額が適用されるのは2026年10月31日までに始期を迎える契約までで、11月1日始期以降は改定料率（全車種平均+6.2％）になります。' });
        annual += CALI_TRAILER;
        lines.push({ n: '自動車重量税・検査手数料', v: null,
          s: '車両重量と経過年数で決まるため、国土交通省の「次回自動車重量税額照会サービス」でご確認ください。貨物登録の被けん引車は初回2年・以後1年ごとの車検です（道路運送車両法第61条）。' });
      }

      lines.push({ n: '固定資産税（償却資産）', v: 0,
        s: '自動車税・軽自動車税の課税客体は償却資産から除かれます（地方税法第341条第4号）。車両として登録されている限り、車両本体に償却資産税はかかりません。' });

    } else {
      var kazei = b.price * 0.7; // 課税標準額は評価額。取得価格をそのまま使わない旨は注記で明示
      var ftax = kazei >= HOUSE_TAX_MIN ? kazei * FIXED_ASSET_RATE : 0;
      lines.push({ n: '固定資産税（家屋）', v: ftax,
        s: '標準税率1.4％。ここでは本体価格の70％を仮の課税標準額として計算しています。実際の評価額は市町村が再建築価格方式で算定するため、この金額とは異なります。家屋の免税点は、同一市町村内の課税標準額の合計が20万円未満（令和9年度分以後は30万円未満）です（地方税法第351条）。' });
      annual += ftax;

      lines.push({ n: '自動車税・自賠責', v: 0,
        s: '車両登録をしない前提のため発生しません。ただし建築物と判断された場合、設置前に建築確認申請が必要です。' });

      lines.push({ n: '建築確認申請・構造設計・基礎工事', v: null,
        s: '規模と地域により変動します。確認申請が不要な規模でも、建築基準法の規定そのものには適合させる必要があります。' });
    }

    /* ---- 事業収支 ---- */
    var biz = $('cs-biz').checked;
    var monthly = 0, sales = 0, cost = 0;
    if (biz) {
      var unit = num('cs-unit');
      var cust = num('cs-cust');
      var days = num('cs-days');
      var rate = num('cs-rate') / 100;
      var rent = num('cs-rent');
      var other = num('cs-other') * 10000;
      sales = unit * cust * days;
      cost = sales * rate + rent * days + other + annual / 12;
      monthly = sales - cost;
    }

    /* ---- 描画 ---- */
    var h = '';

    h += '<div class="cs-cards">';
    h += '<div class="cs-card"><span>初期費用</span><strong>' + man(initial) + '</strong><em>' + yen(initial) + '（税込）</em></div>';
    h += '<div class="cs-card"><span>年間の固定費</span><strong>' + man(annual) + '</strong><em>' + yen(annual) + '／年</em></div>';
    if (biz) {
      var cls = monthly > 0 ? 'is-pos' : 'is-neg';
      h += '<div class="cs-card ' + cls + '"><span>月次の利益</span><strong>' + man(monthly) + '</strong><em>' + yen(monthly) + '／月</em></div>';
      if (monthly > 0) {
        var m = Math.ceil(initial / monthly);
        var y = Math.floor(m / 12), mm = m % 12;
        h += '<div class="cs-card is-key"><span>初期投資の回収</span><strong>' + m + 'か月</strong><em>' +
             (y > 0 ? y + '年' + (mm ? mm + 'か月' : '') : mm + 'か月') + '</em></div>';
      } else {
        h += '<div class="cs-card is-neg"><span>初期投資の回収</span><strong>—</strong><em>今の前提では回収できません</em></div>';
      }
    }
    h += '</div>';

    /* 初期費用の内訳 */
    h += '<h3 class="cs-h">初期費用の内訳</h3><div class="cs-table">';
    h += row('車両本体（' + b.label + '）', yen(b.price), '当社サイトで公表している参考価格（税込）。仕様により変動します。');
    h += row('内装・設備の追加', opt ? yen(opt) : '—', 'ご入力値。実際の金額は仕様確定後のお見積もりによります。');
    h += row('陸送・登録・設置工事など', etc ? yen(etc) : '要見積', '搬入経路・距離・現地条件で変わるため、公表できる定額がありません。現地確認のうえお見積もりします。');
    h += '<div class="cs-row cs-total"><div>合計</div><div>' + yen(initial) + '</div></div>';
    h += '</div>';

    /* 年間費用の内訳 */
    h += '<h3 class="cs-h">毎年かかる費用の内訳</h3><div class="cs-table">';
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i];
      h += row(L.n, L.v === null ? '要確認' : yen(L.v), L.s);
    }
    h += '<div class="cs-row cs-total"><div>年間合計（算出できる分）</div><div>' + yen(annual) + '／年</div></div>';
    h += '</div>';

    if (biz) {
      h += '<h3 class="cs-h">月次収支の内訳</h3><div class="cs-table">';
      h += row('売上', yen(sales), '客単価 × 1日の客数 × 月の営業日数。');
      h += row('原価', yen(sales * (num('cs-rate') / 100)), '売上に原価率を掛けたもの。');
      h += row('出店料', yen(num('cs-rent') * num('cs-days')), '1日あたりの出店料 × 営業日数。');
      h += row('人件費・燃料・その他', yen(num('cs-other') * 10000), 'ご入力値。');
      h += row('法定固定費の月割', yen(annual / 12), '上の年間費用を12で割ったもの。');
      h += '<div class="cs-row cs-total"><div>月次利益</div><div>' + yen(monthly) + '／月</div></div>';
      h += '</div>';
    }

    h += '<div class="cs-note"><strong>この試算は、意思決定の材料です。</strong>本体価格は当社の公表参考価格、税・保険料は公表されている標準税率と基準料率にもとづいて計算しています。' +
         '一方で、陸送費・設置工事費・オプション費用は条件によって大きく変わるため、根拠のない数字を置くことはしていません。' +
         'また、車両として扱われるか建築物として扱われるかで、かかる税がまるごと入れ替わります。' +
         'まずは<a href="/hantei.html">判定ツール</a>でどちら側かを確かめてください。</div>';

    $('cs-out').innerHTML = h;
  }

  function row(n, v, s) {
    return '<div class="cs-row"><div class="cs-n">' + n + '<span>' + s + '</span></div><div class="cs-v">' + v + '</div></div>';
  }

  function toggleBiz() {
    var on = $('cs-biz').checked;
    $('cs-bizfields').hidden = !on;
    calc();
  }
  function toggleRoute() {
    var v = $('cs-route').value;
    $('cs-sizewrap').hidden = (v !== 'vehicle') || (BASE[$('cs-cat').value].kind === 'truck');
    calc();
  }

  root.addEventListener('input', calc);
  root.addEventListener('change', function (e) {
    if (e.target.id === 'cs-biz') { toggleBiz(); return; }
    if (e.target.id === 'cs-route' || e.target.id === 'cs-cat') { toggleRoute(); return; }
    calc();
  });

  toggleBiz();
  toggleRoute();
  calc();
})();
