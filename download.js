/* 資料ダウンロード：送信後にDLリンクを表示（CSP対応・インライン不使用） */
(function () {
  var f = document.getElementById('dlform');
  if (!f) return;
  var fields = document.getElementById('dl-fields');
  var done   = document.getElementById('dl-done');
  var btn    = document.getElementById('dl-submit');

  f.addEventListener('submit', function () {
    var mail = document.getElementById('dlmail');
    if (mail && !mail.checkValidity()) return;   // ネイティブ検証に任せる

    if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }

    // GA4／広告へイベント通知（gtagはsite.jsで定義済み）
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

    // Googleフォームへの送信は隠しiframe宛。少し待ってから完了表示に切替
    setTimeout(function () {
      if (fields) fields.hidden = true;
      if (done)   done.hidden = false;
      var lk = document.getElementById('dl-link');
      if (lk) { try { lk.focus(); } catch (e) {} }
    }, 700);
  });
})();
