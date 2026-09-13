/* 設置前チェック（可動建築／固定建築の確認ツール、CSP対応・インライン不使用）
   参照根拠：平成9年3月31日 住指発第170号／日本建築行政会議『建築確認のための
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
        ok:   '1年以内なら建築物に当たらないという全国共通の基準はありません。期間と用途、実際の移動可能性を確認します。',
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
      title: '公道を適法に走行するための<br>条件を確認していますか。',
      help: '車検・登録・車両寸法・走行経路などを確認します。一時的に移動できる許可と、建築物への該当性の判断は別です。',
      opts: [
        { v: 'ok',   label: '継続して維持する',        sub: '車検・自賠責を切らさない' },
        { v: 'ng',   label: '仮ナンバー等で対応する',  sub: '臨時運行許可・特殊車両通行許可' },
        { v: 'warn', label: '未確認／わからない', sub: '必要な手続きをこれから確認する' }
      ],
      why: {
        ok: '走行条件を確認したうえで、設置後の管理方法と建築担当窓口の取扱いも確認してください。',
        warn: '必要な登録・検査・保険・道路上の手続きと、設置先の建築行政の取扱いを確認してください。',
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
        ok:   '通達が「移動の支障となる階段、ポーチ、ベランダ等」を判断材料に挙げています。仮設という名称だけでは判断できません。実際に移動を妨げないかを確認します。',
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
        ok:   '予定する車両の寸法・旋回・地盤条件を現地で照合してください。回答だけでは通行可能性を確認できません。',
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
    stage.focus();
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
      title = '先に確認したい項目が<em>あります</em>。';
      lead = '設置計画で先に相談したい項目が' + ng + '件あります。建築物としての計画を含め、所在地の担当窓口と専門家に確認してください。この結果だけで設置の可否は決まりません。';
    } else if (warn > 0) {
      grade = 'B';
      title = '計画の<em>未確定項目を確認しましょう</em>。';
      lead = '未確定の項目が' + warn + '件あります。回答内容をもとに仕様と使い方を整理し、設置予定地の担当窓口へ相談してください。';
    } else {
      grade = 'A';
      title = '回答を整理できました。<em>次は設置先への事前相談です</em>。';
      lead = '回答上の予定は整理できました。8問は全国共通の合否基準ではなく、車両扱いや許可不要を保証するものでもありません。現地条件と図面を添えて管轄窓口に確認してください。';
    }

    var h = '<div class="ht-result">';
    h += '<div class="ht-grade ht-g' + grade + '"><span>確認事項</span><strong>8</strong></div>';
    h += '<h3>' + title + '</h3>';
    h += '<p class="ht-lead">' + esc(lead) + '</p>';

    var priorities = []; for (k = 0; k < Q.length; k++) if (verdictOf(k) !== 'ok') priorities.push(Q[k].req);
    h += '<p class="ht-priorities">' + (priorities.length ? '先に確認：' + esc(priorities.slice(0,3).join(' ／ ')) + (priorities.length > 3 ? '（ほか' + (priorities.length-3) + '項目）' : '') : '次の準備：所在地・用途・配置図をそろえて事前相談') + '</p>';
    h += '<details class="reading-detail"><summary>8問の回答と根拠を確認する</summary><div class="ht-table">';
    for (k = 0; k < Q.length; k++) {
      var q = Q[k];
      var vv = verdictOf(k);
      var mark = vv === 'ok' ? '✓' : (vv === 'warn' ? '△' : '✕');
      h += '<div class="ht-row ht-' + vv + '">';
      h += '<div class="ht-mark">' + mark + '</div>';
      h += '<div class="ht-body">';
      h += '<div class="ht-rq">' + esc(q.req) + '<span>' + esc(q.opts[answers[k]].label) + '</span></div>';
      h += '<details class="reading-detail"><summary>理由と確認先</summary><p>' + esc(q.why[vv]) + '</p>';
      h += '<a href="' + q.src.u + '">' + esc(q.src.t) + ' &rarr;</a></details>';
      h += '</div></div>';
    }
    h += '</div>';

    h += '</details><div class="ht-note"><strong>このツールは、事前相談の準備用です。</strong>設置可否は、この結果だけでは決まりません。所在地の担当窓口で個別に確認してください。</div>';

    var allLines = [];
    var priorityLines = [];
    for (k = 0; k < Q.length; k++) {
      var line = Q[k].req + '「' + Q[k].opts[answers[k]].label + '」';
      allLines.push(line);
      if (verdictOf(k) !== 'ok') priorityLines.push(line);
    }
    var contactNote = '設置前チェック（8問）の回答：' + allLines.join('、') + '。' +
      (priorityLines.length ? '先に確認したい項目：' + priorityLines.join('、') + '。' : '') +
      'この内容をもとに相談したいです。';

    h += '<div class="ht-after">';
    h += '<a class="pbtn solid" href="/?note=' + encodeURIComponent(contactNote) + '#contact">この結果をもとに相談する &rarr;</a>';
    h += '<a class="pbtn" href="/price-download.html">価格表・法規チェックリスト（PDF）</a>';
    h += '<button type="button" class="ht-reset" data-reset="1">もう一度やり直す</button>';
    h += '</div></div>';

    stage.innerHTML = h;
    bar.style.width = '100%';
    step.textContent = '回答の整理';
    stage.focus();
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

