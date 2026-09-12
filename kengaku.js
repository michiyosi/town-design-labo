/* KAZARI 実車見学 予約フォーム
   希望日時とメモを1つのメッセージ欄（entry.1424514303）に集約してから
   Google フォームへ通常POSTする（送信結果はGoogleの画面に表示される）。
   受け付けの成否はこのページからは読めないため、成功の断定・サンクス表示は行わない。
   外部ファイルにすることでCSP（inline script禁止）に適合。 */
(function () {
  var f = document.getElementById('kgform');
  if (!f) return;
  var btn = document.getElementById('kg-submit');
  var status = document.getElementById('kg-status');
  var msg = document.getElementById('kg-status-msg');
  var sending = false, timer = null, label = btn ? btn.textContent : '';

  function say(t) { if (status && msg) { msg.textContent = t; status.hidden = false; } }
  function reset() {
    sending = false;
    if (timer) { clearTimeout(timer); timer = null; }
    if (btn) { btn.disabled = false; btn.textContent = label; }
  }

  f.addEventListener('submit', function (e) {
    if (sending) { e.preventDefault(); return; }   // 連打の抑制（自動再送はしない）

    var dt = (document.getElementById('kg-datetime') || {}).value || '';
    var memo = (document.getElementById('kg-memo') || {}).value || '';
    var h = document.getElementById('kg-message');
    if (h) h.value = '【KAZARI実車 見学予約】\n希望日時：' + (dt || '（未記入）') + '\n見たい車両・相談：' + (memo || '（未記入）');

    sending = true;
    if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }
    say('送信しています。まもなくGoogleの画面に移動します。「回答を記録しました」と表示された場合、受け付けは完了しています。');

    /* 送信操作の計測（非個人情報・受理の証明ではない。広告のコンバージョンには使わない） */
    try {
      if (typeof tdlTrackAttempt === 'function') tdlTrackAttempt('kengaku_submit_attempt');
    } catch (err) { /* 計測失敗で送信を止めない */ }

    timer = setTimeout(function () {
      reset();
      say('しばらく待っても画面が切り替わりませんでした。受け付けられたかどうかは、この画面からは分かりません。入力内容はそのまま残しています。お急ぎの場合は 080-5615-9786 へお電話ください。');
    }, 15000);
  });

  window.addEventListener('pageshow', function (ev) {
    var was = sending;
    reset();
    if (ev.persisted && was) {
      say('この画面に戻りました。送信が受け付けられたかどうかは、この画面からは分かりません。Googleフォームの画面でご確認ください。');
    }
  });
})();
