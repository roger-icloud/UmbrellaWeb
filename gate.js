/* Soft curtain for pre-launch (2026-11-26): the site works only on
   devices that have visited once with the key. Not security — a polite
   "not open yet" for anyone who wanders in early; reading the page
   source reveals the mechanism, which is fine at this stage.

   Admit a device:  anynumberoftimes.com/?key=mika   (or just  ?mika)
   — the word plants a flag in localStorage and the device stays
   admitted. ?key=mika stays visible in the address bar (so saved
   shortcuts carry it); the bare ?mika and gate= words are stripped.
   Re-curtain a device:  ?gate=bye  — lets Roger see what strangers
   see, or retire a test device.

   Holding text below is Roger's to reword. */
(function () {
  'use strict';
  var KEY = 'mika';
  try {
    var params = new URLSearchParams(location.search || '');
    var store;
    try { store = window.localStorage; } catch (e) { store = null; }

    var keyed = params.get('key') === KEY || params.get('gate') === KEY || params.has(KEY);
    if (params.get('gate') === 'bye') {
      if (store) store.removeItem('uw-gate');
    } else if (keyed && store) {
      store.setItem('uw-gate', KEY);
    }
    /* strip the magic-word and gate params, but KEEP key= visible in
       the address bar: a shortcut saved from a keyed page bakes the key
       into itself and standalone web apps (separate storage) can then
       re-admit themselves on every launch — desktop/dock shortcut fix */
    params.delete('gate'); params.delete(KEY);
    var rest = params.toString();
    if ((location.search || '') !== (rest ? '?' + rest : '')) {
      try { history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + location.hash); } catch (e) {}
    }

    var admitted = store && store.getItem('uw-gate') === KEY;
    if (admitted) return;

    /* hide the body the moment this file parses (before first paint),
       then lay a fixed card over it once the body exists — the card
       re-sets visibility:visible so the hidden body can't swallow it */
    document.write('<style>body{visibility:hidden!important}</style>');
    var show = function () {
      var d = document.createElement('div');
      d.setAttribute('style',
        'position:fixed;inset:0;z-index:2147483647;background:#101418;' +
        'visibility:visible;display:flex;align-items:center;justify-content:center;' +
        'text-align:center;color:#cfd8dc;font:16px -apple-system,system-ui,sans-serif;padding:24px');
      d.innerHTML =
        '<div style="max-width:26em;line-height:1.6">' +
        '<div style="font-size:20px;letter-spacing:.4px;color:#35c795">Any Number of Times</div>' +
        '<div style="margin-top:10px;opacity:.8">this little garden is still being planted —<br>it isn\u2019t open yet</div>' +
        '</div>';
      document.body.appendChild(d);
    };
    if (document.body) show();
    else document.addEventListener('DOMContentLoaded', show);
  } catch (e) { /* curtain must never break a page — fail open */ }
})();
