/* Shared unobtrusive menu — every page includes this one file.
   Add or reorder entries in ITEMS and all pages update together.
   Entries: {label, href} for a page link, {label, action} for a
   function, {type:'sep'} for a divider. `children:[...]` makes a
   submenu (indented group shown when the parent is tapped). */
(function () {
  'use strict';

  /* launched via "Add to Home Screen" the app already has no browser
     chrome, so a fullscreen toggle would be a no-op — drop the row */
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  const ITEMS = [
    { label: 'Home', href: 'index.html' },
    { label: 'Tilt Snake', href: 'tilt-snake.html' },
    { label: 'Snake Puzzle', href: 'snake-puzzle.html' },
    { label: 'Patterns', href: 'patterns.html' },
    { label: 'Pattern Snake', href: 'pattern-snake.html' },
    { label: 'Lattice', href: 'lattice.html' },
    { label: 'Honeycomb Search', href: 'honeycomb.html' },
    { label: 'Tilt Ball', href: 'tilt-ball.html' },
    { label: 'Rationale', href: 'rationale.html' },
    { label: 'Help', href: 'help.html' },
    { type: 'sep' },
    ...(standalone ? [] : [{ label: 'Fullscreen', action: 'fullscreen' }]),
    { label: 'Feedback', href: 'feedback.html' },
  ];

  const css = `
    /* top offset: env(safe-area-inset-top) clears notches when the browser
       reports them — but iPad's floating status bar overlaps content while
       reporting 0, so keep generous breathing room after it. Bump the
       trailing px value if the burger ever crowds the status line. */
    #navBurger {
      position: fixed;
      top: calc(env(safe-area-inset-top, 0px) + 24px);
      right: 8px;
      width: 40px; height: 40px;
      border-radius: 10px;
      border: 1px solid #3a4a58;
      background: rgba(20, 28, 36, .65);
      z-index: 40;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 4px; padding: 0; cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    #navBurger svg {
      width: 18px; height: 18px;
    }
    #navPanel {
      position: fixed;
      top: calc(env(safe-area-inset-top, 0px) + 70px);
      right: 8px;
      min-width: 170px;
      background: rgba(14, 20, 26, .96);
      border: 1px solid #2c3e50;
      border-radius: 12px;
      padding: 6px;
      z-index: 39;
      font-family: -apple-system, system-ui, sans-serif;
    }
    #navPanel.hidden { display: none; }
    #navPanel a, #navPanel button, #navPanel .group {
      display: block; width: 100%;
      padding: 12px 14px;
      color: #cfd8e0; font-size: 15px;
      text-align: left; text-decoration: none;
      background: none; border: none;
      border-radius: 8px; cursor: pointer;
      box-sizing: border-box;
      font-family: inherit;
    }
    #navPanel a:active, #navPanel button:active { background: #24303c; }
    #navPanel .sub { padding-left: 28px; font-size: 14px; color: #9fb0bd; }
    #navPanel .sep { border-top: 1px solid #2c3e50; margin: 6px 4px; }
    #navPanel .cur { color: #4da3ff; font-weight: 600; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* an umbrella glyph rather than the standard ≡ — the browser's own
     menu button sits just above ours on some devices and two burgers
     stacked reads as clutter. Inline SVG keeps it crisp everywhere. */
  /* the glyph: a chunky S-bodied snake (after Roger's reference) — bold
     head, eye, forked tongue. More visible than the thin outline was. */
  const burger = document.createElement('button');
  burger.id = 'navBurger';
  burger.setAttribute('aria-label', 'Menu');
  burger.innerHTML =
    '<svg viewBox="0 0 24 24" stroke="#35c795" fill="none" ' +
    'stroke-linecap="round">' +
    '<path d="M18 6.5 C 9 4.5, 4.5 8.5, 7 12.5 C 9.5 16.5, 17.5 15, 16 19.5' +
    ' C 15.2 21.6, 10.5 22.3, 5.5 20.8" stroke-width="4.2"/>' +
    '<circle cx="18.6" cy="5.8" r="3.6" fill="#35c795" stroke="none"/>' +
    '<circle cx="19.6" cy="4.6" r="0.9" fill="#101418" stroke="none"/>' +
    '<path d="M22 5 l1.7-0.8 M22 5 l1.7 0.6" stroke="#e0a53a" stroke-width="1"/>' +
    '</svg>';

  const panel = document.createElement('nav');
  panel.id = 'navPanel';
  panel.className = 'hidden';

  function toggleFullscreen() {
    const d = document;
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    } else {
      const el = d.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) Promise.resolve(req.call(el)).catch(() => { });
    }
  }

  /* the fullscreen row doubles as a state indicator: its label says what
     tapping will do next */
  let fsRow = null;
  function syncFSLabel() {
    if (fsRow) fsRow.textContent =
      (document.fullscreenElement || document.webkitFullscreenElement)
        ? 'Exit fullscreen' : 'Fullscreen';
  }
  document.addEventListener('fullscreenchange', syncFSLabel);
  document.addEventListener('webkitfullscreenchange', syncFSLabel);

  /* mark the row for the page we're standing on */
  const here = location.pathname.split('/').pop() || 'index.html';

  function addRow(item, parent, sub) {
    if (item.type === 'sep') {
      const s = document.createElement('div');
      s.className = 'sep';
      parent.appendChild(s);
      return;
    }
    let el;
    if (item.href) {
      el = document.createElement('a');
      el.href = item.href;
    } else {
      el = document.createElement('button');
      el.addEventListener('click', () => {
        if (item.action === 'fullscreen') toggleFullscreen();
        close();
      });
    }
    el.textContent = item.label;
    if (sub) el.className = 'sub';
    if (item.href === here) el.classList.add('cur');
    if (item.action === 'fullscreen') fsRow = el;
    parent.appendChild(el);
    if (item.children) item.children.forEach(c => addRow(c, parent, true));
  }
  ITEMS.forEach(i => addRow(i, panel, false));
  syncFSLabel();

  function close() { panel.classList.add('hidden'); }
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('hidden');
  });
  document.addEventListener('pointerdown', (e) => {
    if (!panel.classList.contains('hidden')
      && !panel.contains(e.target) && e.target !== burger) close();
  });

  document.body.appendChild(burger);
  document.body.appendChild(panel);
})();
