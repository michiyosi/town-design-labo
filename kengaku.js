/* KAZARI 実車見学 予約フォーム
   希望日時とメモを1つのメッセージ欄（entry.1424514303）に集約してから
   隠しiframe（kg-sink）へPOSTし、送信後にサンクスを表示する。
   外部ファイルにすることでCSP（inline script禁止）に適合。 */
(function () {
  var f = document.getElementById('kgform');
  if (!f) return;

  f.addEventListener('submit', function () {
    var dt = (document.getElementById('kg-datetime') || {}).value || '';
    var memo = (document.getElementById('kg-memo') || {}).value || '';
    var msg = '【KAZARI実車 見学予約】\n希望日時：' + (dt || '（未記入）') + '\n見たい車両・相談：' + (memo || '（未記入）');
    var h = document.getElementById('kg-message');
    if (h) h.value = msg;

    /* 送信自体は通常どおり iframe ターゲットへ飛ぶ。少し遅らせてサンクスへ差し替える。 */
    setTimeout(function () {
      var fields = document.getElementById('kg-fields');
      var done = document.getElementById('kg-done');
      if (fields) fields.hidden = true;
      if (done) done.hidden = false;
      try { done.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    }, 350);

    try { if (typeof gtag === 'function') gtag('event', 'kengaku_yoyaku', { event_category: 'engagement', event_label: 'KAZARI visit' }); } catch (e) {}
    try { if (typeof fbq === 'function') fbq('track', 'Lead', { content_name: 'KAZARI visit reservation' }); } catch (e) {}
  });
})();
