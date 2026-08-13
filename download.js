/* 資料ダウンロード：送信の応答を検知してからDLリンクを表示（CSP対応・インライン不使用） */
(function () {
  var f = document.getElementById('dlform');
  if (!f) return;
  var fields = document.getElementById('dl-fields');
  var done   = document.getElementById('dl-done');
  var btn    = document.getElementById('dl-submit');
  var sink   = document.getElementById('dl-sink');

  var submitted = false, settled = false;

  function settle(fired) {
    if (settled) return;
    settled = true;
    if (fields) fields.hidden = true;
    if (done)   done.hidden = false;
    var lk = document.getElementById('dl-link');
    if (lk) { try { lk.focus(); } catch (e) {} }

    // 送信の応答が返ったときだけ計測を発火（送信失敗をリードとして数えない）
    if (fired) {
      try {
        if (typeof gtag === 'function') {
          gtag('event', 'file_download', {
            file_name: 'tdl-price-spec-checklist.pdf',
            file_extension: 'pdf',
            link_text: '価格表・仕様一覧・法規チェックリスト'
          });
        }
        if (typeof fbq === 'function') { fbq('track', 'Lead', { content_name: 'price_pdf' }); }
      } catch (e) {}
    }
  }

  // Googleフォームへの送信は隠しiframe(dl-sink)宛。その応答(load)で完了表示に切替。
  // 初回の空ロードは submitted ガードで無視する。
  // 限界：docs.google.com はクロスオリジンのため応答内容は読めない。通常の失敗（応答なし）は
  // 8秒フェイルセーフで計測を打たずに済むが、Google側がエラーページを返した稀なケースでは
  // load が発火し Lead を過大計上しうる（従来の「送信前に無条件発火」よりは大幅に正確）。
  if (sink) {
    sink.addEventListener('load', function () {
      if (submitted) settle(true);
    });
  }

  f.addEventListener('submit', function () {
    var mail = document.getElementById('dlmail');
    if (mail && !mail.checkValidity()) return;   // ネイティブ検証に任せる

    submitted = true;
    if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }

    // フェイルセーフ：8秒応答が無ければ、計測は発火せず完了表示だけ出す（PDFは渡す）
    setTimeout(function () { settle(false); }, 8000);
  });
})();
