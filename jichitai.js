/* 自治体別データベース：絞り込み・検索（CSP対応・インライン不使用）
   行はサーバー側で静的に出力済み。JSは表示/非表示を切り替えるだけなので、
   JavaScriptが動かない環境でも全31件がそのまま読めます。 */
(function () {
  'use strict';

  var root = document.getElementById('jt-root');
  if (!root) return;

  var rows  = [].slice.call(document.querySelectorAll('#jt-list .jt-row'));
  var q     = document.getElementById('jt-q');
  var count = document.getElementById('jt-count');
  var empty = document.getElementById('jt-empty');
  var state = { reg: '', lv: '', typ: '', q: '' };
  var fired = false;

  function track(name, p) {
    try { if (typeof gtag === 'function') gtag('event', name, p || {}); } catch (e) {}
  }

  function apply() {
    var n = 0;
    var kw = state.q.trim().toLowerCase();
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i], d = r.dataset;
      var ok = (!state.reg || d.reg === state.reg) &&
               (!state.lv  || d.lv  === state.lv)  &&
               (!state.typ || d.typ === state.typ) &&
               (!kw || (d.name + ' ' + d.tags + ' ' + r.textContent).toLowerCase().indexOf(kw) >= 0);
      r.hidden = !ok;
      if (ok) n++;
    }
    count.textContent = n + '件を表示中' + (n < rows.length ? '（全' + rows.length + '件中）' : '');
    empty.hidden = n > 0;

    if (!fired && (state.reg || state.lv || state.typ || kw)) {
      fired = true;
      track('jichitai_filter', {});
    }
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('.jt-b');
    if (!b) return;
    var f = b.dataset.f;
    state[f] = b.dataset.v;
    var group = b.parentNode.querySelectorAll('.jt-b');
    for (var i = 0; i < group.length; i++) group[i].classList.remove('is-on');
    b.classList.add('is-on');
    apply();
  });

  if (q) {
    q.addEventListener('input', function () { state.q = q.value; apply(); });
  }

  apply();
})();
