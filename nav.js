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
    || window.matchMedia('(display-mode: fullscreen)').matches
    || window.navigator.standalone === true;

  /* mirrors the main menu's tile order; housekeeping rows at the bottom */
  const ITEMS = [
    { label: 'Home', href: 'index.html' },
    { label: 'Tilt Snake', href: 'tilt-snake.html' },
    { label: 'Snake Puzzle', href: 'snake-puzzle.html' },
    { label: 'Tilt Ball', href: 'tilt-ball.html' },
    { label: 'Find Tables', href: 'honeycomb.html' },
    { type: 'sep' },
    ...(standalone ? [] : [{ label: 'Fullscreen', action: 'fullscreen' }]),
    { label: 'Feedback', href: 'feedback.html' },
    { label: 'Help', href: 'help.html' },
    { label: 'Rationale', href: 'rationale.html' },
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

  const panel = document.createElement('nav');
  panel.id = 'navPanel';
  panel.className = 'hidden';

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
  document.body.appendChild(panel);
})();

/* ---------- the den (Roger, 2026-11-04) ----------
   Completed snakes come home to wait in a corner den — collapsed,
   not coiled: segments dropped behind each other like a spent
   Slinky, still breathing, head blinking now and then. When THREE
   have gathered they extend together and travel to the hundred
   square (square.html) to deposit their tables. Roster is
   sessionStorage-scoped: a visit's memory, nothing stored away.
   Games announce a completion via NF.complete(table); the den owns
   the waiting, the counting, and the march. */
(function () {
  'use strict';
  const KEY = 'nf-den';
  const roster = () => {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '[]'); }
    catch (e) { return []; }
  };
  const save = r => sessionStorage.setItem(KEY, JSON.stringify(r));
  const hue = t => (t * 31 + 200) % 360;

  // lab aid: ?den=5 or ?den=5,3,7 seats those tables straight into the
  // den for auditioning — overrides whatever the session had gathered
  const qd = new URLSearchParams(location.search).get('den');
  if (qd) save(qd.split(',').map(Number)
    .filter(t => t >= 2 && t <= 12).map(t => ({ t })));

  const cv = document.createElement('canvas');
  const DEN_W = 230, DEN_H = 120, DEN_SC = 1.35;
  cv.id = 'navDen';
  cv.width = DEN_W * 2; cv.height = DEN_H * 2;         // retina
  cv.style.cssText = 'position:fixed;left:4px;bottom:4px;width:' +
    DEN_W + 'px;height:' + DEN_H + 'px;z-index:8;pointer-events:none';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  ctx.scale(2, 2);

  /* one gathered snake, seen head-on (Roger, 2026-11-04): the head
     out front, the twelve segments stacked behind it like a pack of
     cards drawn into a pile — a low mound, mostly hidden. It stays
     alive: the head sways and blinks, the pupils wander, and the
     buried segments take occasional turns bobbing half out from
     behind the pile before slipping back (never more than two at
     once — a jostle, not a queue). */
  const PEEK_DUR = 1400;                  // ms for one bob out-and-back
  const PEEK_MIN = 2600, PEEK_SPAN = 9000; // per-segment lull between bobs
  const peeks = {};                        // slot -> per-segment schedule
  // lab aid: ?jig=1 holds two segments fully bobbed-out — the still
  // to judge the jostle by, without waiting on the timetable
  const JIG = new URLSearchParams(location.search).has('jig');

  function heap(sx, sy, t, ph, now, slotIdx) {
    ctx.save();
    ctx.translate(sx, sy); ctx.scale(DEN_SC, DEN_SC); ctx.translate(-sx, -sy);
    const c = 'hsl(' + hue(t) + ',60%,45%)';
    const cd = 'hsl(' + hue(t) + ',55%,36%)';
    const breathe = Math.sin(now / 900 + ph) * 1.2;
    const blink = (Math.sin(now / 2600 + ph * 3) > 0.97) ? 0.15 : 1;

    // the buried twelve: each keeps its own loose timetable; when its
    // turn comes it eases out to a side (or over the shoulder) and
    // returns — drawn before mound and head so only the outer part
    // of the bob is ever seen
    const S = peeks[slotIdx] || (peeks[slotIdx] =
      Array.from({ length: 12 }, (_, i) => ({
        t0: -1,
        pinned: JIG && i < 2,      // ?jig=1 holds two out permanently
        dur: PEEK_DUR,
        next: now + 600 + Math.random() * PEEK_SPAN * (0.4 + i / 12),
        side: i ? -1 : 1, lift: 0.4 + 0.5 * (i % 2), reach: 10 + i * 2
      })));
    let active = 0;
    S.forEach(s => {
      if (!s.pinned && s.t0 >= 0 && now - s.t0 < s.dur) active++;
    });
    S.forEach(s => {
      let w;
      if (s.pinned) w = 1;
      else {
        if (s.t0 < 0 && now >= s.next && active < 2) {
          s.t0 = now; active++;
          s.dur = PEEK_DUR;
          s.side = Math.random() < 0.5 ? -1 : 1;
          s.lift = Math.random();          // <0.8 sideways, else shoulder
          s.reach = 9 + Math.random() * 4;  // stays half-buried in the pile
        }
        if (s.t0 < 0) return;
        const k = (now - s.t0) / s.dur;
        if (k >= 1) {
          s.t0 = -1;
          s.next = now + PEEK_MIN + Math.random() * PEEK_SPAN;
          return;
        }
        w = Math.sin(k * Math.PI);
      }
      const a = s.lift > 0.8 ? -Math.PI / 2 + s.side * 0.3
        : -Math.PI / 2 + s.side * (1.1 + s.lift * 0.9);
      const x = sx + Math.cos(a) * s.reach * w;
      const y = sy - 15 + breathe + Math.sin(a) * s.reach * 0.85 * w;
      ctx.beginPath();
      ctx.arc(x, y, 6.5, 0, 7);
      ctx.fillStyle = c; ctx.fill();
      ctx.strokeStyle = cd; ctx.lineWidth = 1; ctx.stroke();
    });

    // the hidden bulk — a low mound with a lumpy top edge, so the pile
    // has body even while every segment is at home
    ctx.beginPath();
    ctx.ellipse(sx, sy - 8 + breathe * 0.5, 13, 7.5, 0, 0, 7);
    ctx.fillStyle = 'hsl(' + hue(t) + ',50%,32%)';
    ctx.fill();
    ctx.strokeStyle = cd; ctx.lineWidth = 1; ctx.stroke();
    [[-8, -13], [1, -15], [9, -12]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(sx + dx, sy + dy + breathe * 0.7, 5, 0, 7);
      ctx.fillStyle = 'hsl(' + hue(t) + ',52%,36%)';
      ctx.fill();
    });

    // the head out front, eyes to the viewer — a slow sway over the
    // pile, pupils wandering, the usual blink
    const hx = sx + Math.sin(now / 1400 + ph) * 1.8;
    const hy = sy - 15 + breathe;
    const g = ctx.createRadialGradient(hx - 3, hy - 3, 2, hx, hy, 8.5);
    g.addColorStop(0, 'hsl(' + hue(t) + ',62%,64%)');
    g.addColorStop(1, 'hsl(' + hue(t) + ',56%,28%)');
    ctx.beginPath(); ctx.arc(hx, hy, 8.5, 0, 7);
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = cd; ctx.lineWidth = 1; ctx.stroke();
    const look = Math.sin(now / 3100 + ph * 2.1) * 2.2;
    [[-1], [1]].forEach(([s]) => {
      ctx.beginPath();
      ctx.ellipse(hx + s * 3 + look, hy - 0.5, 1.4, 1.4 * blink, 0, 0, 7);
      ctx.fillStyle = '#101418'; ctx.fill();
    });
    ctx.restore();
  }

  const slot = i => ({ x: 40 + (i % 3) * 78, y: 92 });
  let arrivals = [];   // {t, x} sliding in from the right

  window.NF = window.NF || {};
  /* a game calls this when its completion is done: a small same-hued
     snake slides into the den and collapses there. Three gathered →
     pause a beat so the trio is seen, then all march to the square */
  NF.complete = function (t) {
    const r = roster();
    r.push({ t: t });
    save(r);
    arrivals.push({ t: t, x: DEN_W + 30 });
    if (r.length >= 3)
      setTimeout(() => { location.href = 'square.html'; }, 2600);
  };

  function draw(now) {
    ctx.clearRect(0, 0, DEN_W, DEN_H);
    roster().forEach((s, i) => {
      const p = slot(i);
      heap(p.x, p.y, s.t, i * 1.7, now, i);
    });
    arrivals = arrivals.filter(a => a.x > -60);
    arrivals.forEach(a => {
      a.x -= 1.1;
      ctx.save();
      ctx.translate(a.x, 88); ctx.scale(DEN_SC, DEN_SC);
      // incoming: head leading, three segments trailing
      for (let k = 3; k >= 0; k--) {
        ctx.beginPath();
        ctx.arc(k * 12, Math.sin(now / 120 + k) * 2, k ? 6 : 7.5, 0, 7);
        ctx.fillStyle = 'hsl(' + hue(a.t) + ',60%,45%)'; ctx.fill();
        if (!k) {
          ctx.beginPath();
          ctx.arc(2, -3, 1.3, 0, 7);
          ctx.fillStyle = '#101418'; ctx.fill();
        }
      }
      ctx.restore();
      // arrived at its slot → collapse into the roster's heap
      const i = arrivals.indexOf(a);
      if (a.x <= slot(Math.min(i + roster().length - arrivals.length + 1, 2)).x)
        arrivals.splice(i, 1);
    });
    requestAnimationFrame(draw);
  }
  // the den only breathes when snakes wait or arrive — empty = hidden.
  // first paint is synchronous (the recital lesson): a capture or a
  // quick glance mustn't race the first rAF
  const origDraw = draw;
  function tick(now) {
    if (roster().length || arrivals.length) origDraw(now);
    else { ctx.clearRect(0, 0, DEN_W, DEN_H); requestAnimationFrame(tick); }
  }
  tick(performance.now());
})();
