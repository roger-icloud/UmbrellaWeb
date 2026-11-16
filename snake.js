/* HouseSnake — the shared snake character (Roger, 2026-11-15).
   One face for every game, injected like nav.js so a redraw improves
   all of them at once — the house style by construction.

     HouseSnake.mount(host, opts) → handle {wrap, el, play}
       opts: {x, y, size, pose:'rise'} — x/y in px position the head
       centre; size is the svg width in px; pose 'rise' draws the head
       on a short neck for curtain-call entrances.
     handle.play(name?) → plays an expression and returns its name;
       with no name it picks at random — the anticipation is the point.

   Expressions: wink, blink (a double), spin (in the page's plane),
   flip (over the top), swivel (side to side) — the flat head's whole
   three-plane repertoire, plus its eyes. */
(function () {
  'use strict';

  const EYES = `
    <g class="eyeL" style="transform-box:fill-box;transform-origin:center">
      <circle cx="72" cy="62" r="17" fill="#fdfdf7"/>
      <circle cx="74" cy="64" r="8" fill="#26303a"/></g>
    <g class="eyeR" style="transform-box:fill-box;transform-origin:center">
      <circle cx="148" cy="62" r="17" fill="#fdfdf7"/>
      <circle cx="146" cy="64" r="8" fill="#26303a"/></g>`;
  const SMILE = `
    <path d="M66 112 Q110 140 154 112" fill="none" stroke="#26303a"
          stroke-width="5" stroke-linecap="round"/>
    <path d="M110 128 L110 150 M110 150 L102 160 M110 150 L118 160"
          fill="none" stroke="#d0533f" stroke-width="5"
          stroke-linecap="round"/>`;

  const SVG_HEAD = `<svg class="hs" viewBox="0 0 220 170" aria-hidden="true">
    <ellipse cx="110" cy="86" rx="90" ry="70" fill="#79b168"/>
    <ellipse cx="110" cy="86" rx="90" ry="70" fill="none"
             stroke="#3f6b34" stroke-width="3"/>${EYES}${SMILE}
  </svg>`;

  /* posed: the same head carried on a short neck, for entrances that
     arrive from below — viewBox is taller, head occupies the top */
  const SVG_POSED = `<svg class="hs" viewBox="0 0 220 230" aria-hidden="true">
    <path d="M110 228 C 62 196, 158 168, 110 140" fill="none"
          stroke="#79b168" stroke-width="34" stroke-linecap="round"/>
    <ellipse cx="110" cy="70" rx="90" ry="62" fill="#79b168"/>
    <ellipse cx="110" cy="70" rx="90" ry="62" fill="none"
             stroke="#3f6b34" stroke-width="3"/>
    <g class="eyeL" style="transform-box:fill-box;transform-origin:center">
      <circle cx="72" cy="48" r="17" fill="#fdfdf7"/>
      <circle cx="74" cy="50" r="8" fill="#26303a"/></g>
    <g class="eyeR" style="transform-box:fill-box;transform-origin:center">
      <circle cx="148" cy="48" r="17" fill="#fdfdf7"/>
      <circle cx="146" cy="50" r="8" fill="#26303a"/></g>
    <path d="M66 96 Q110 124 154 96" fill="none" stroke="#26303a"
          stroke-width="5" stroke-linecap="round"/>
    <path d="M110 112 L110 130 M110 130 L103 139 M110 130 L117 139"
          fill="none" stroke="#d0533f" stroke-width="5"
          stroke-linecap="round"/>
  </svg>`;

  const EASE = 'cubic-bezier(.45,0,.2,1)';
  const X = {
    wink(el) {
      el.querySelector('.eyeR').animate(
        [{ transform: 'scaleY(1)' },
         { transform: 'scaleY(0.08)', offset: .5 },
         { transform: 'scaleY(1)' }],
        { duration: 550, easing: 'ease-in-out' });
    },
    blink(el) {
      for (const s of ['.eyeL', '.eyeR'])
        el.querySelector(s).animate(
          [{ transform: 'scaleY(1)' },
           { transform: 'scaleY(0.08)', offset: .12 },
           { transform: 'scaleY(1)', offset: .26 },
           { transform: 'scaleY(0.08)', offset: .56 },
           { transform: 'scaleY(1)' }],
          { duration: 950, easing: 'ease-in-out' });
    },
    spin(el) {
      el.animate(
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
        { duration: 1000, easing: EASE });
    },
    flip(el) {
      el.animate(
        [{ transform: 'perspective(900px) rotateX(0deg)' },
         { transform: 'perspective(900px) rotateX(360deg)' }],
        { duration: 1200, easing: EASE });
    },
    swivel(el) {
      el.animate(
        [{ transform: 'perspective(900px) rotateY(0deg)' },
         { transform: 'perspective(900px) rotateY(360deg)' }],
        { duration: 1200, easing: EASE });
    },
  };
  const NAMES = Object.keys(X);

  function mount(host, opts = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'hsWrap';
    wrap.style.cssText =
      'position:absolute;transform:translate(-50%,-50%);pointer-events:none';
    if (opts.x != null) wrap.style.left = opts.x + 'px';
    if (opts.y != null) wrap.style.top = opts.y + 'px';
    wrap.innerHTML = opts.pose === 'rise' ? SVG_POSED : SVG_HEAD;
    host.appendChild(wrap);
    const el = wrap.firstElementChild;
    if (opts.size) el.style.width = opts.size + 'px';
    return { wrap, el, play: (name) => play(el, name) };
  }

  function play(el, name) {
    const pick = (name && X[name]) ? name
      : NAMES[(Math.random() * NAMES.length) | 0];
    X[pick](el);
    return pick;
  }

  /* the mute head's canvas repertoire — recipes a clock feeds to the
     pupils of any drawn head: {l,r} lid factors, gaze offsets gx/gy,
     a head bob and a yaw slide, all in units of head radius. The same
     set serves the lab's obverse cameo and the puzzle's own little
     head, so both stay in one house style (Roger, 2026-11-15). */
  const _p = u => Math.sin(Math.max(0, Math.min(1, u)) * Math.PI);
  const _e = k => { k = Math.max(0, Math.min(1, k));
    return k * k * (3 - 2 * k); };
  const FACES = {
    wink:   { dur: .55, f: u => ({ l: 1 - _p(u) * .15,
                                  r: 1 - _p(u) * .94 }) },
    blink:  { dur: .45, f: u => ({ l: 1 - _p(u) * .9,
                                  r: 1 - _p(u) * .9 }) },
    double: { dur: 1.0, f: u => ({ l: 1 - _p(u * 2 % 1) * .9,
                                  r: 1 - _p(u * 2 % 1) * .9 }) },
    glance: { dur: .9,  f: u => ({ l: 1, r: 1,
                                  gx: Math.sin(u * Math.PI) * .42 }) },
    nod:    { dur: .9,  f: u => ({ l: 1, r: 1,
                                  bob: Math.sin(u * Math.PI * 2) * .11 }) },
    squint: { dur: .75, f: u => ({ l: 1 - _p(u) * .5,
                                  r: 1 - _p(u) * .5 }) },
    yaw:    { dur: 1.7, f: u => ({ l: 1, r: 1, yaw: u * Math.PI * 2 }) },
    tour:   { dur: 1.9, f: u => {
              const P = [[0, -.5], [0, .5], [-.5, 0], [.5, 0], [0, 0]];
              const k = Math.min(u, .999) * (P.length - 1);
              const i = k | 0, e2 = _e(Math.min(1, (k - i) * 1.6));
              return { l: 1, r: 1,
                gx: P[i][0] + (P[i + 1][0] - P[i][0]) * e2,
                gy: P[i][1] + (P[i + 1][1] - P[i][1]) * e2 }; } },
  };
  const FACE_NAMES = Object.keys(FACES);

  window.HouseSnake = { mount, play, NAMES, FACES, FACE_NAMES };
})();
