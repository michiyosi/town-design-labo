/* 資料ダウンロード（CSP対応・インライン不使用）
   メール登録は Google フォームへ別タブ（target="_blank"）でPOSTする。受け付けられたかどうかは
   同一オリジンポリシーによりこのページからは読めないため、成功判定は行わず、
   「別タブのGoogleの画面に『回答を記録しました』と出たら受け付け完了」と案内する方針に統一する。
   このページ側は、有効な送信操作が行われた時点でPDFの取得リンクを開く（＝受理の証明ではない）。
   JavaScript が無効な場合は、noscript のリンクから同じPDFに到達できる。 */
(function () {
  var f = document.getElementById('dlform');
  if (!f) return;
  var done = document.getElementById('dl-done');
  var btn  = document.getElementById('dl-submit');
  var label = btn ? btn.textContent : '';
  var opened = false;
  var sending = false;
  var timer = null;

  /* 送信中の状態を解除する。3秒後の自動復帰と、戻る操作（bfcache）からの復帰で使う。 */
  function restore() {
    sending = false;
    if (timer) { clearTimeout(timer); timer = null; }
    if (btn) { btn.disabled = false; btn.textContent = label; }
  }

  f.addEventListener('submit', function (e) {
    var mail = document.getElementById('dlmail');
    if (mail && !mail.checkValidity()) return;   // ネイティブ検証に任せる

    /* disabled だけでは Enter キーなどによる重複 submit を止められないため、
       送信中フラグで二重送信そのものを止める（自動再送はしない）。 */
    if (sending) { e.preventDefault(); return; }
    sending = true;

    /* 入力欄は消さない。メールアドレスを間違えたときに直して送り直せるようにしておく。 */
    if (done) done.hidden = false;
    if (!opened) {
      opened = true;                              // PDFリンクへのフォーカス移動は初回だけ
      var lk = document.getElementById('dl-link');
      if (lk) { try { lk.focus(); } catch (e2) {} }
    }

    /* 送信操作の計測（非個人情報・受理の証明ではない。広告のコンバージョンには使わない）。
       メールを直して送り直した場合も試行なので、送信のたびに1回記録する。
       計測が失敗しても、送信そのものは止めない。 */
    try {
      if (typeof tdlTrackAttempt === 'function') tdlTrackAttempt('document_request_attempt');
    } catch (e3) {}

    if (btn) {
      btn.disabled = true;
      btn.textContent = '送信中…';
    }
    timer = setTimeout(restore, 3000);
  });

  /* 戻る操作やbfcacheでの復帰時に、ボタンが押せないまま残らないようにする。 */
  window.addEventListener('pageshow', restore);

  /* PDFの実クリックだけを計測する（ページ到達や表示では発火しない）。
     GA4 の自動計測 file_download と名前を分けて二重計上を避ける。 */
  var link = document.getElementById('dl-link');
  if (link) {
    link.addEventListener('click', function () {
      try {
        if (typeof gtag === 'function') {
          gtag('event', 'document_pdf_click', {
            send_to: 'G-SD0J17P6ST',
            document_name: 'tdl-price-spec-checklist.pdf'
          });
        }
      } catch (e) {}
    });
  }
})();
