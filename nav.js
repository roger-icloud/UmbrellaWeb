/* Shared unobtrusive menu — every page includes this one file.
   Add or reorder entries in ITEMS and all pages update together.
   Entries: {label, href} for a page link, {label, action} for a
   function, {type:'sep'} for a divider. `children:[...]` makes a
   submenu (indented group shown when the parent is tapped). */
(function () {
  'use strict';

  /* launched via "Add to Home Screen" the app already has no browser
     chrome, so a fullscreen toggle would be a no-op — drop the row.
     iPhone Safari/Chrome can't fullscreen a web page at all (Apple
     reserves the API for video; iPads and desktops can) — drop the
     row there too rather than offer a button that does nothing */
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches
    || window.navigator.standalone === true;
  const fsCapable = !!document.documentElement.requestFullscreen
    || !!document.documentElement.webkitRequestFullscreen;

  /* mirrors the main menu's tile order; housekeeping rows at the bottom */
  const ITEMS = [
    /* game links retired 2026-11-19 (Roger): the menu was too long for
       landscape phones — the tiles home is the real crossroads, so the
       menu keeps only home + housekeeping, in their existing order */
    { label: 'Home', href: 'index.html' },
    { type: 'sep' },
    ...(standalone || !fsCapable ? [] : [{ label: 'Fullscreen', action: 'fullscreen' }]),
    { label: 'Feedback', href: 'feedback.html' },
    { label: 'Help', href: 'help.html' },
    { label: 'Rationale', href: 'rationale.html' },
    { label: 'Settings', href: 'settings.html' },
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
    /* the pennant: milestones quietly — a window onto the flagpole that
       opens over any page and lifts again on tap (Roger 2026-11-27) */
    #navPennant {
      position: fixed;
      top: calc(env(safe-area-inset-top, 0px) + 24px);
      right: 56px;
      width: 40px; height: 40px;
      border-radius: 10px;
      border: 1px solid #3a4a58;
      background: rgba(20, 28, 36, .65);
      z-index: 40;
      display: flex; align-items: center; justify-content: center;
      padding: 0; cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    #navPennant svg { width: 20px; height: 20px; }
    #navPennant.open { border-color: #35c795; }
    #pennantWin {
      position: fixed;
      z-index: 38;
      background: #101418;
      display: none;
      overflow: hidden;
      /* the pilot-assist rectangle (Roger 2026-11-27): starts at the
         icon's bounds, floats to a centred frame — geometry animated,
         so the border is real and visible throughout */
      border: 1px solid #3a4a58;
      border-radius: 8px;
      box-sizing: border-box;
      transition: left .55s cubic-bezier(.4, 0, .2, 1),
                  top .55s cubic-bezier(.4, 0, .2, 1),
                  width .55s cubic-bezier(.4, 0, .2, 1),
                  height .55s cubic-bezier(.4, 0, .2, 1);
    }
    #pennantWin.open { display: block; }
    #pennantWin iframe {
      position: absolute; inset: 0;
      width: 100%; height: 100%; border: none;
      opacity: 0;
      transition: opacity .45s ease;
    }
    #pennantWin.shown iframe { opacity: 1; }
    /* a new milestone can ping the icon — quiet "something lives here" */
    #navPennant.ping { animation: penPing .8s ease 3; }
    @keyframes penPing {
      50% { border-color: #35c795; box-shadow: 0 0 14px rgba(53,199,149,.55); }
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
      font-family: Andika, -apple-system, system-ui, sans-serif;
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

  /* canvas text can draw before Andika arrives; a resize once it has
     loaded makes every page redraw in the right font */
  if (document.fonts) document.fonts.ready.then(() =>
    window.dispatchEvent(new Event('resize')));

  /* a snake glyph rather than the standard ≡ — the browser's own
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

  /* the pennant window: which flagpole page the overlay carries.
     flagpole.html exists on main today; point at flagpole-1.html or a
     dedicated strand view when the machine settles */
  const PENNANT_URL = 'flagpole.html';

  const panel = document.createElement('nav');
  panel.id = 'navPanel';
  panel.className = 'hidden';

  const pennantBtn = document.createElement('button');
  pennantBtn.id = 'navPennant';
  pennantBtn.setAttribute('aria-label', 'Your pennants');
  pennantBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round">' +
    '<path d="M15 3.5v17" stroke="#7a8fa0" stroke-width="2.4"/>' +
    '<path d="M15 5.5 L4.5 9.5 L15 13.5 Z" fill="hsl(150,62%,50%)" ' +
    'stroke="hsl(150,45%,35%)" stroke-width="1"/></svg>';

  /* overlay created up front (cheap div); the flagpole page itself is
     fetched lazily — only if the pennant is ever tapped */
  const win = document.createElement('div');
  win.id = 'pennantWin';
  let pennantFrame = null;
  const PENNANT_MARGIN = 12;   // centred frame sits this far off the edges
  function pennantHome() {
    const r = pennantBtn.getBoundingClientRect();
    return { left: r.left + 'px', top: r.top + 'px',
      width: r.width + 'px', height: r.height + 'px' };
  }
  function pennantFull() {
    return { left: PENNANT_MARGIN + 'px', top: PENNANT_MARGIN + 'px',
      width: (innerWidth - PENNANT_MARGIN * 2) + 'px',
      height: (innerHeight - PENNANT_MARGIN * 2) + 'px' };
  }
  function togglePennant(open) {
    if (open === undefined) open = !win.classList.contains('open');
    if (open === win.classList.contains('open')) return;
    if (open) {
      if (!pennantFrame) {
        pennantFrame = document.createElement('iframe');
        pennantFrame.src = PENNANT_URL;
        /* fade the flagpole up once it has loaded AND the rectangle
           has had time to cover the screen */
        pennantFrame.addEventListener('load',
          () => setTimeout(() => win.classList.add('shown'), 500));
        setTimeout(() => win.classList.add('shown'), 2500);   // fallback
        win.appendChild(pennantFrame);
      } else {
        setTimeout(() => win.classList.add('shown'), 500);
      }
      Object.assign(win.style, pennantHome());   // start at the icon
      win.classList.add('open');
      pennantBtn.classList.add('open');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        Object.assign(win.style, pennantFull());   // float to centre
      }));
    } else {
      win.classList.remove('shown');
      Object.assign(win.style, pennantHome());   // float back to the icon
      pennantBtn.classList.remove('open');
      setTimeout(() => win.classList.remove('open'), 580);
    }
  }
  /* keep the centred frame fitted if the window resizes while open */
  window.addEventListener('resize', () => {
    if (win.classList.contains('open')) Object.assign(win.style, pennantFull());
  });
  /* the window can be summoned from outside — a milestone can open it
     outright (uwPennant.open()) or just ping the icon (uw-pennant event) */
  window.uwPennant = {
    open: () => togglePennant(true),
    close: () => togglePennant(false),
  };
  document.addEventListener('uw-pennant', () => {
    pennantBtn.classList.add('ping');
    setTimeout(() => pennantBtn.classList.remove('ping'), 2400);
  });
  pennantBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePennant();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && win.classList.contains('open')) togglePennant(false);
  });

  /* fullscreen is per-page: navigation drops it, so remember the intent
     and re-request on the next page — immediately where the browser
     allows, else on the first touch there. The flag is cleared only by
     choosing "Exit fullscreen" here, not by Esc or by navigating. */
  const FS_KEY = 'nf-fs';
  const fsActive = () =>
    document.fullscreenElement || document.webkitFullscreenElement;

  function requestFS() {
    if (fsActive()) return;
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) Promise.resolve(req.call(el)).catch(() => { });
  }

  function toggleFullscreen() {
    const d = document;
    if (fsActive()) {
      sessionStorage.removeItem(FS_KEY);
      (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    } else {
      sessionStorage.setItem(FS_KEY, '1');
      requestFS();
    }
  }

  if (!standalone && sessionStorage.getItem(FS_KEY)) {
    requestFS();
    window.addEventListener('pointerdown', requestFS, { once: true });
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
  /* any fullscreen entry counts as intent — including the games' own
     enable-tilt buttons — so the flag survives whatever put us there */
  const fsNote = () => { if (fsActive()) sessionStorage.setItem(FS_KEY, '1'); };
  document.addEventListener('fullscreenchange', fsNote);
  document.addEventListener('webkitfullscreenchange', fsNote);

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
  document.body.appendChild(pennantBtn);
  document.body.appendChild(panel);
  document.body.appendChild(win);
})();
