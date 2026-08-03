/* 可動建築／固定建築 判定ツール（CSP対応・インライン不使用）
   判定根拠：平成9年3月31日 住指発第170号／日本建築行政会議『建築確認のための
   基準総則・集団規定の適用事例』2022年度版 P16／国土交通省 構造改革特区回答／
   各特定行政庁の取扱い文書。最終判断は所在地を管轄する特定行政庁が行う。 */
(function () {
  'use strict';

  var Q = [
    {
      code: 'A',
      req: '設置期間',
      title: '同じ場所に、どのくらいの期間<br>置く予定ですか。',
      help: '「土地に定着する」かどうかは、物理的な固定だけでなく、用途上どれだけ長く一定の場所に在置されるかでも判断されます。',
      opts: [
        { v: 'ok',   label: '1年以内',      sub: 'イベント・仮設・季節営業など' },
        { v: 'warn', label: '1〜3年程度',   sub: '事業の様子を見ながら判断したい' },
        { v: 'ng',   label: '3年以上／恒久的', sub: 'この場所で長く使う前提' }
      ],
      why: {
        ok:   '短期設置は「随時かつ任意に移動できる」側の評価を受けやすい範囲です。',
        warn: '自治体によっては「長期間存置」と評価されうる長さです。管轄の特定行政庁への事前相談が要ります。',
        ng:   '国土交通省は「用途上、長期間にわたって一定の場所に在置される場合」も土地への定着に含まれるとしています。上尾市・木更津市・浜松市など、長期設置を明確に建築物として扱う自治体があります。'
      },
      src: { t: 'GUIDE 01 建築物か、車両か', u: '/trailerhouse-kenchikubutsu.html' }
    },
    {
      code: 'B',
      req: '移動の計画',
      title: '将来、別の場所へ移動して<br>使う計画はありますか。',
      help: '「移動する目的があるか」を要件に加えている自治体があります。',
      opts: [
        { v: 'ok',   label: 'ある',       sub: '移動先や時期の見込みがある' },
        { v: 'warn', label: '可能性はある', sub: '未定だが動かすことは想定している' },
        { v: 'ng',   label: 'ない',       sub: 'この場所で使い続ける' }
      ],
      why: {
        ok:   '移動を前提とした計画は、車両としての取扱いと整合します。',
        warn: '移動計画が具体化していないと、自治体によっては定着性ありと判断されることがあります。',
        ng:   '浜松市は「設置時において、公道を通行して他の場所へ移動して使用する等の移動することを目的とした計画のないもの」を建築物として扱う旨を示しています。'
      },
      src: { t: 'GUIDE 01 建築物か、車両か', u: '/trailerhouse-kenchikubutsu.html' }
    },
    {
      code: 'C',
      req: '公道走行',
      title: '車検（自動車検査証）または<br>基準緩和認定を維持できますか。',
      help: '設置した瞬間だけでなく、置いている間ずっと適法に公道を走れる状態である必要があります。',
      opts: [
        { v: 'ok',   label: '継続して維持する',        sub: '車検・自賠責を切らさない' },
        { v: 'ng',   label: '仮ナンバー等で対応する',  sub: '臨時運行許可・特殊車両通行許可' },
        { v: 'ng',   label: '取得しない／わからない',  sub: '' }
      ],
      why: {
        ok:   '登録・番号標・保安基準適合・有効な車検証・自賠責が揃っていれば、この要件は満たされます。',
        ng:   '神奈川県建築行政連絡協議会は「一時的に公道を移動するために許可等を受けるもの」は要件に該当しないと明記しています。仮ナンバーも特殊車両通行許可も、この要件を満たしません。長岡市は「設置期間中においても同様」とし、車検切れはその時点で要件を失うとしています。'
      },
      src: { t: 'GUIDE 07 車検か、基準緩和か', u: '/trailerhouse-shaken-kenin.html' }
    },
    {
      code: 'D',
      req: 'ライフライン接続',
      title: '給排水・電気・ガスの接続は<br>工具なしで外せますか。',
      help: 'プラグ・カプラー等の簡易な着脱式であることが求められます。',
      opts: [
        { v: 'ok',   label: '工具不要の着脱式にする', sub: 'プラグ・カプラー接続' },
        { v: 'warn', label: '未定',                  sub: 'これから仕様を決める' },
        { v: 'ng',   label: '固定配管にしたい',       sub: '埋設・直結' }
      ],
      why: {
        ok:   '通達が例示する「固定された配管・配線によるものかどうか」の判断で、有利に働く仕様です。',
        warn: 'ここは後から変えると費用も工期も跳ね上がる部分です。設計の初期に決めるべき項目です。',
        ng:   '固定配管は「随時かつ任意に移動できる」要件を満たしません。設置時点で車両扱いだったものが、後から配管を固定式に替えたことで建築物として扱われるようになる例もあります。'
      },
      src: { t: 'GUIDE 01 建築物か、車両か', u: '/trailerhouse-kenchikubutsu.html' }
    },
    {
      code: 'E',
      req: '外構・造作',
      title: 'デッキ・階段・ポーチ・柵を<br>造る予定はありますか。',
      help: '移動の支障となる造作があると、要件を欠くと判断されます。',
      opts: [
        { v: 'ok',   label: '造らない／仮設にする', sub: '工具なしで撤去できる範囲' },
        { v: 'warn', label: '未定',                sub: '' },
        { v: 'ng',   label: '固定式で造りたい',     sub: 'ウッドデッキ・基礎付き階段など' }
      ],
      why: {
        ok:   '通達が「移動の支障となる階段、ポーチ、ベランダ等」を判断材料に挙げています。仮設であれば支障になりません。',
        warn: '外構は納まりの検討が必要です。可動を保つ形でのデッキ計画は設計で解けます。',
        ng:   '固定式の造作は、設置後に土地への定着性が認められる典型的な要因です。適用事例集は「その後の改造等を通じて土地への定着性が認められるようになった場合は、その時点から建築物として取り扱う」としています。'
      },
      src: { t: 'GUIDE 01 建築物か、車両か', u: '/trailerhouse-kenchikubutsu.html' }
    },
    {
      code: 'F',
      req: '車輪の状態',
      title: '車輪を付けたまま、<br>走行可能な状態を保ちますか。',
      help: '車輪の取り外しやパンク放置は、走行可能性を失わせます。',
      opts: [
        { v: 'ok', label: '保つ',                sub: '車輪はそのまま維持する' },
        { v: 'ng', label: '外して基礎に載せたい', sub: '安定させたい・見た目を整えたい' },
        { v: 'warn', label: '未定',              sub: '' }
      ],
      why: {
        ok:   '車輪が走行に十分な状態に保守されていることは、多くの自治体が共通して挙げる要件です。',
        warn: '基礎に載せるかどうかは、車両扱いを保てるかの分岐点になります。',
        ng:   '車輪を取り外して基礎に固定した状態は「随時かつ任意に移動できる」とは認められない、というのが基準を公表している自治体に共通する取扱いです。この形を選ぶなら、最初から建築物として確認申請を通す計画に切り替えるほうが、結果的に手戻りがありません。'
      },
      src: { t: 'GUIDE 01 建築物か、車両か', u: '/trailerhouse-kenchikubutsu.html' }
    },
    {
      code: 'G',
      req: '公道までの通路',
      title: '設置場所から公道まで、<br>車両が通れる通路はありますか。',
      help: '幅員・勾配・路盤が支障なく、連続して確保されている必要があります。',
      opts: [
        { v: 'ok',   label: '確保できる',   sub: '搬入経路に問題はない' },
        { v: 'warn', label: '未確認',       sub: 'これから現地を見る' },
        { v: 'ng',   label: '確保が難しい', sub: '道が狭い・段差や急勾配がある' }
      ],
      why: {
        ok:   '「敷地内に、設置場所から公道に至るまで移動可能な通路が連続して確保されていること」を満たします。',
        warn: '搬入経路は現地確認が要る項目です。道幅・曲がり角・高さ制限・地面の強度・クレーンの要否を確認します。',
        ng:   '通路が確保できない場合、そもそも「随時かつ任意に移動できる」とは評価されません。搬入自体が成立しない可能性もあるため、土地の選定から見直すことになります。'
      },
      src: { t: '納車・陸送（現場に届くまで）', u: '/nosha-rikuso.html' }
    },
    {
      code: 'H',
      req: '住所としての登録',
      title: 'その場所を「住所」として<br>登録する必要がありますか。',
      help: '住民票の登録、営業所の所在地、旅館業の施設所在地など。',
      opts: [
        { v: 'ok',   label: '必要ない', sub: '' },
        { v: 'warn', label: 'わからない', sub: '' },
        { v: 'ng',   label: '必要',     sub: '住民票・営業所・旅館業の所在地など' }
      ],
      why: {
        ok:   '住所登録を要しない用途であれば、この論点は生じません。',
        warn: '用途によっては他法令側から住所の特定を求められます。営業許可の申請先も含めて確認が必要です。',
        ng:   '木更津市は「他法令により特定の住所が必要となるもの（住民票の登録、営業所の位置、旅館業の施設の設置場所等）」を建築物として扱う旨を示しています。'
      },
      src: { t: 'GUIDE 02 キッチンカーの営業許可', u: '/kitchencar-eigyo-kyoka.html' }
    }
  ];

  var el = function (id) { return document.getElementById(id); };
  var answers = new Array(Q.length).fill(null);
  var idx = 0;
  var started = false;

  var stage = el('ht-stage');
  var bar = el('ht-bar');
  var step = el('ht-step');
  if (!stage) return;

  function track(name, params) {
    try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch (e) {}
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderQ() {
    var q = Q[idx];
    var h = '<div class="ht-q">';
    h += '<div class="ht-req">' + esc(q.req) + '</div>';
    h += '<h3>' + q.title + '</h3>';
    h += '<p class="ht-help">' + esc(q.help) + '</p>';
    h += '<div class="ht-opts">';
    for (var i = 0; i < q.opts.length; i++) {
      var o = q.opts[i];
      var sel = answers[idx] === i ? ' is-sel' : '';
      h += '<button type="button" class="ht-opt' + sel + '" data-i="' + i + '">';
      h += '<span class="ht-opt-l">' + esc(o.label) + '</span>';
      if (o.sub) h += '<span class="ht-opt-s">' + esc(o.sub) + '</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ht-nav">';
    if (idx > 0) h += '<button type="button" class="ht-back" data-back="1">&larr; 前の質問</button>';
    h += '</div></div>';
    stage.innerHTML = h;
    bar.style.width = Math.round((idx / Q.length) * 100) + '%';
    step.textContent = 'Q' + (idx + 1) + ' / ' + Q.length;
  }

  function verdictOf(i) { return Q[i].opts[answers[i]].v; }

  function renderResult() {
    var ng = 0, warn = 0, k;
    for (k = 0; k < Q.length; k++) {
      var v = verdictOf(k);
      if (v === 'ng') ng++; else if (v === 'warn') warn++;
    }

    var grade, title, lead;
    if (ng > 0) {
      grade = 'C';
      title = '固定建築として計画するほうが、<em>合理的です</em>。';
      lead = '車両として扱われるための要件のうち、' + ng + '項目が満たせない見込みです。無理に車両扱いを目指すより、最初から建築物として確認申請を通す計画に切り替えたほうが、着工後の手戻りがありません。当社は「固定建築のほうが適している」と判断した場合、そのようにお伝えしています。';
    } else if (warn > 0) {
      grade = 'B';
      title = '設計しだいで、<em>車両として成立します</em>。';
      lead = '決定的に不足している要件はありません。ただし' + warn + '項目が未確定です。配管の接続方式、外構の納まり、搬入経路——これらは後から変えると費用も工期も跳ね上がる部分です。設計に入る前に固めておくべき論点として、下に整理しました。';
    } else {
      grade = 'A';
      title = '車両として成立する<em>見込みが高い計画です</em>。';
      lead = '8項目すべてで、車両として扱われる方向の条件が揃っています。あとは管轄の特定行政庁への事前相談で、その自治体固有の運用を確認する段階です。';
    }

    var h = '<div class="ht-result">';
    h += '<div class="ht-grade ht-g' + grade + '"><span>判定</span><strong>' + grade + '</strong></div>';
    h += '<h3>' + title + '</h3>';
    h += '<p class="ht-lead">' + esc(lead) + '</p>';

    h += '<div class="ht-table">';
    for (k = 0; k < Q.length; k++) {
      var q = Q[k];
      var vv = verdictOf(k);
      var mark = vv === 'ok' ? '✓' : (vv === 'warn' ? '△' : '✕');
      h += '<div class="ht-row ht-' + vv + '">';
      h += '<div class="ht-mark">' + mark + '</div>';
      h += '<div class="ht-body">';
      h += '<div class="ht-rq">' + esc(q.req) + '<span>' + esc(q.opts[answers[k]].label) + '</span></div>';
      h += '<p>' + esc(q.why[vv]) + '</p>';
      h += '<a href="' + q.src.u + '">' + esc(q.src.t) + ' &rarr;</a>';
      h += '</div></div>';
    }
    h += '</div>';

    h += '<div class="ht-note"><strong>この判定は、目安です。</strong>建築物に当たるかどうかを判断するのは、所在地を管轄する特定行政庁です。同じ仕様の車両でも、置く市町村によって結論が変わります。「他県で車両扱いだった」は根拠になりません。計画の早い段階で、管轄の特定行政庁に事前相談することを強くおすすめします。</div>';

    h += '<div class="ht-after">';
    h += '<a class="pbtn solid" href="/#contact">この結果をもとに相談する &rarr;</a>';
    h += '<a class="pbtn" href="/price-download.html">価格表・法規チェックリスト（PDF）</a>';
    h += '<button type="button" class="ht-reset" data-reset="1">もう一度やり直す</button>';
    h += '</div></div>';

    stage.innerHTML = h;
    bar.style.width = '100%';
    step.textContent = '判定結果';
    track('hantei_complete', { result_grade: grade, ng_count: ng, warn_count: warn });
  }

  stage.addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t) return;

    if (t.dataset.reset) {
      answers = new Array(Q.length).fill(null);
      idx = 0; renderQ();
      stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (t.dataset.back) { idx--; renderQ(); return; }
    if (typeof t.dataset.i === 'undefined') return;

    if (!started) { started = true; track('hantei_start', {}); }
    answers[idx] = parseInt(t.dataset.i, 10);
    if (idx < Q.length - 1) { idx++; renderQ(); }
    else { renderResult(); }
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  renderQ();
})();
