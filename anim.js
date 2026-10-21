/* anim.js — the shared completion engine (pose-lab graduate, 2026-10-20).

   One snake, one motion model: the head writes a trail of breadcrumbs,
   the body reads it back twelve segments behind. A page hands over its
   assembled snake; Anim runs the reinforcement beat, then a departure.
   (macOS used to be routed to the still path — compositing rendered
   the ring phrase incoherently; lifted 2026-10-21 once `wind` proved
   clean on the devices that corrupted. ?motion=0 still forces still.)

     Anim.begin({
       ctx, W, H,                    // canvas 2d context + viewport px
       board: { x, y, w, h },        // the playfield rect (css px)
       segD,                         // segment diameter (css px)
       table,                        // 2..12 — colour + numeral come from it
       segs,                         // [{x,y,expected,blank}] head-first, N=13
       kind,                         // 'tour' | 'lap' | 'spin' | 'dive' |
                                     // 'edge' | 'still' | 'random'
       onFade:  () => …,             // the numeral's terminal dim begins —
                                     // the moment for an end-card to fade
                                     // up over it (fires once)
       onDone:  () => …              // everything over — state 'gone'
     });
     Anim.frame(now) — call from the page's rAF; safe to call always.
     Anim.state — 'off' | 'beat' | 'depart' | 'gone'

   Lab-style overrides honoured here, on any page:
     ?depart=kind   pin the exit        ?motion=0|1  force either path
     ?seed=N        deterministic rng   ?departAt=N  jump N s in (skips beat) */
window.Anim = (function () {
  'use strict';

  /* ---------- tunables (same names as the lab) ---------- */
  const N = 13;               // head + twelve body segments
  const SPACING_K = 0.78;     // adjacent centre spacing / segD
  const CRUMB_STEP = 3;       // px of head travel per breadcrumb
  const BEAT_STAGGER = 0.11;  // s between member highlights, head → tail
  const BEAT_HOLD = 0.45;     // each highlight lingers this long
  const SETTLE_SECS = 0.45;   // per-segment ease onto the trail at handover
  const SETTLE_STAGGER = 0.05;
  const DEPART_SPEED = 3.2;   // segD per second along the trail
  const DEPART_AMP = 0.5;     // sway grows to this while departing
  const DEPART_FREQ = 3.4;    // faster wriggle while departing
  const DEPART_RAMP = 0.7;    // s for sway to reach DEPART_AMP
  const HOLE_TURN = 210;      // max steering rate (deg/s) while seeking
  const HOLE_GAIN = 4.5;      // steering eagerness per radian of error
  const HOLE_ORBIT = 2.6;     // segDs out where the vortex catches the head
  const DIVE_LEN = 1.3;       // segDs of trail over which a member sinks
  const SINK_LEN = 2.4;       // whirlpool version — a slide, not a gulp
  const LAP_INSET = 0.55;     // segD — the lap track sits this far in-board
  const LAP_LOOKAHEAD = 2.2;  // segD — the carrot's lead along the track
  const LAP_TURN = 170;       // deg/s steering onto and around the track
  const LAP_GAIN = 4.0;       // steering eagerness per radian of error
  const SHRINK_RATE = 90;     // px/s the wind's track contracts inward
  const SHRINK_TO = 1.0;      // stop when perimeter ≈ body length × this
  const WIND_TURNS = 3;       // circuits of the closed loop before rest
  const GLOW_SECS = 1.1;      // halo holds at full bloom
  const FADE_SECS = 1.8;      // then the slow fade
  const STILL_FADE = 0.9;     // s for the body to fade on the still path
  const NUM_RISE = 0.8;       // s for the numeral to gather from the halo
  const NUM_LINGER = 0.7;     // it outlives the ring's fade by this much
  const NUM_FADE = 1.0;       // then dims in its own time
  const BLINK_MIN = 2.4, BLINK_MAX = 6, BLINK_SECS = 0.28;

  /* departure sentences — each a list of phrases the head performs in
     order. A phrase is {extent, turn, deg, speed, seek, dive, spin,
     laptrack, ring, glow, still, calm}:
       extent:  segDs of arc to run     turn: deg/s of steering wheel
       seek:    steer toward the hole   dive: body shrinks through the hole
       spin:    orbit the hole, radius decaying to centre
       laptrack: join the edge track, `laps` circuits (default 1), leave
                 at the join; `speed` scales the head's pace this phrase
       ring:    wind onto a circle of the body's own length
       glow:    head parked — the halo blooms then fades
       still:   the no-motion ending — body fades, halo+numeral in place
       calm:    suppress the wriggle for this phrase */
  const SCRIPTS = {
    spin: [
      { extent: 5 },
      { seek: true },
      { spin: true, turns: 3 },
    ],
    dive: [
      { extent: 5 },
      { seek: true },
      { dive: true, extent: 40, speed: 1.45 },
    ],
    edge: [
      { extent: 40 },
    ],
    lap: [
      { laptrack: true },
      { ring: true },
      { glow: true },
    ],
    tour: [
      { laptrack: true, calm: true, laps: 3, speed: 1.6 },
      { ring: true, calm: true },
      { glow: true, calm: true },
    ],
    still: [
      { still: true, calm: true },
    ],
    // the wind: circuit, then the track itself contracts until it can
    // hold only one body — the loop closes itself (head meets tail)
    // without the ring phrase's circular steering. Built for devices
    // where the ring wind renders incoherently (iPhone 6/8-era WebKit)
    wind: [
      { laptrack: true, calm: true, laps: 1, speed: 1.6 },
      { shrinktrack: true, calm: true, speed: 1.2 },
      { glow: true, calm: true },
    ],
  };
  // the pool 'random' draws from — one engine, varied goodbyes
  const EXITS = ['tour', 'lap', 'spin', 'dive'];

  /* ---------- environment ---------- */
  // IS_MAC kept for diagnostics — iPadOS reports MacIntel too, so touch
  // is the discriminator. Motion is now on everywhere by default.
  const IS_MAC = navigator.platform === 'MacIntel' &&
    navigator.maxTouchPoints <= 1;
  const qs = new URLSearchParams(location.search);
  let MOTION = true;
  if (qs.get('motion') === '0') MOTION = false;
  if (qs.get('motion') === '1') MOTION = true;
  let rng = Math.random;
  if (qs.get('seed')) {
    let s = (parseInt(qs.get('seed'), 10) >>> 0) || 1;
    rng = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  }

  /* ---------- pose grammar (the lab's heading walk) ----------
     From the head, count-1 steps of exactly one spacing, each step's
     heading given by the family — equal step length by construction, so
     the body is always continuous AND the pose is trail-ready: seeding
     it as the trail loses nothing, the celebration lifts it as-is.
     The lab fit-scaled its walks to the margins (which bent the step
     length); here a walk that doesn't fit is rejected outright —
     folding families fit boards a straight diagonal can't, and the
     coil always does. */
  const POSE_MARGIN = 0.14;   // square fraction kept clear on every side
  const POSE_CLEAR = 1.0;     // min centre distance between NON-ADJACENT
  //   segments, ×segD — adjacent members overlap by design (0.78·segD);
  //   anyone else must clear a full disc or the pose reads as a knot
  const POSE_HT = 4.0;        // min head↔tail distance, ×segD — the
  //   openness gate: open poses hold ≥5.5; a folded block sits ~3.5
  //   (measured per family — serpentine self-excludes from random draws
  //   but stays available as the compact small-board fallback)
  const POSE_TRIES = 90;
  const POSE_FAMILIES = {
    diagonal: () => Math.PI / 4,
    wave: i => Math.PI / 4 + 0.6 * Math.sin(i * 0.85),
    zigzag: i => Math.PI / 4 + (i % 2 ? -0.6 : 0.6),
    scurve: (i, n) => Math.PI / 4 +
      0.7 * Math.sin(i * 2 * Math.PI / (n - 1)),
    coil: i => Math.PI / 2 + 0.45 + i * 0.28,
    // the compact guarantee: three-step legs alternating direction with
    // TWO-step drops, so the rows stand a full disc apart — extent ~3×4
    // spacings whatever the board; also the fallback when nothing fits
    serpentine: i => {
      const c = i % 5;
      if (c < 3) return Math.floor(i / 5) % 2 ? Math.PI : 0;
      return Math.PI / 2;
    },
  };
  const POSE_NAMES = Object.keys(POSE_FAMILIES);

  function walkPose(fam, n, sp, r) {
    const pts = [{ x: 0, y: 0 }];
    for (let i = 0; i < n - 1; i++) {
      const h = POSE_FAMILIES[fam](i, n);
      const last = pts[pts.length - 1];
      pts.push({
        x: last.x + Math.cos(h) * sp, y: last.y + Math.sin(h) * sp
      });
    }
    if (r() < 0.5) pts.forEach(p => p.x = -p.x);
    if (r() < 0.5) pts.forEach(p => p.y = -p.y);
    if (r() < 0.5) pts.reverse();
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    return pts.map(p => ({ x: 0.5 + p.x - cx, y: 0.5 + p.y - cy }));
  }

  /* Anim.pose({ board:{x,y,w,h}, segD, count?, family?, seed? })
     → {fam, rail}
     rail is normalized 0..1 over a square of side min(board.w, board.h)
     centred on the board — the page maps it in its own layout(). Deal
     → play → Anim.begin all read the same positions: nothing rearranges
     at the handover. `seed` gives the walk its own rng — one number
     reproduces one pose exactly (for sharing a deal's shape). */
  function pose(o) {
    const n = o.count || N;
    const sq = Math.min(o.board.w, o.board.h);
    const sp = SPACING_K * o.segD / sq;
    let r = rng;
    if (o.seed !== undefined) {
      let s = (o.seed >>> 0) || 1;
      r = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    }
    const names = o.family && o.family !== 'any' ? [o.family] : POSE_NAMES;
    const clear = POSE_CLEAR * o.segD / sq;   // normalized min pair distance
    // two margin tiers: full clearance first, then nearly edge-to-edge —
    // on small boards the strict margin leaves only the serpentine,
    // so loosen before surrendering variety. No pose is accepted where
    // any two segments sit close enough to crowd a numeral (the lab's
    // PAIR_MIN) — falling back to the least crowded that fit.
    let best = null, bestD = 0, bestFam = 'serpentine';
    for (let pass = 0; pass < 2; pass++) {
      const m = pass ? POSE_MARGIN * 0.35 : POSE_MARGIN;
      for (let a = 0; a < POSE_TRIES; a++) {
        const fam = names[Math.floor(r() * names.length)];
        const rail = walkPose(fam, n, sp, r);
        let worst = Infinity;
        for (let i = 0; i < n; i++)
          for (let j = i + 2; j < n; j++)   // neighbours are meant to touch
            worst = Math.min(worst, Math.hypot(
              rail[i].x - rail[j].x, rail[i].y - rail[j].y));
        const fits = rail.every(p => p.x >= m && p.x <= 1 - m &&
          p.y >= m && p.y <= 1 - m);
        const ht = Math.hypot(rail[0].x - rail[n - 1].x,
          rail[0].y - rail[n - 1].y);        // openness, ×segD-normalized
        if (fits && worst >= clear && ht >= POSE_HT * o.segD / sq)
          return { fam, rail };
        if (fits && worst > bestD) { bestD = worst; best = rail; bestFam = fam; }
      }
    }
    return best ? { fam: bestFam, rail: best }
      : { fam: 'serpentine', rail: walkPose('serpentine', n, sp, r) };
  }

  /* ---------- handed over by the page ---------- */
  let ctx = null, W = 0, H = 0;
  let bX = 0, bY = 0, bW = 0, bH = 0;
  let segD = 48, table = 0, segs = [];
  let onFade = null, onDone = null, fadeFired = false;
  let pageKind = null;        // the page's chosen exit; ?depart= outranks it

  /* ---------- engine state ---------- */
  let state = 'off';           // off | beat | depart | gone
  let beatT = 0, departT = 0, prevNow = 0;
  let trail = [], headPos = { x: 0, y: 0 }, heading = 0;
  let script = [], phraseArc = 0, tipArc = 0;
  let hole = null, holeArc = null, holeShowArc = 0;
  let spinning = false, whirlpool = false, spinProg = 0;
  let stillK = 1, ring = null, glowT0 = -1;
  let gaze = 0, nextBlinkAt = 0, blinkT0 = -1;
  let from = [], settleT = 0;  // positions the page handed over + when —
  //   segments ease from there onto the trail (a page's pose spacing is
  //   arbitrary; trail spacing is fixed — the settle hides the gap)

  function tableColour(t) { return 'hsl(' + ((t * 31 + 200) % 360) + ',60%,45%)'; }
  function wrapAngle(d) {
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return d;
  }

  /* ---------- the trail ----------
     The head's position history as a polyline of breadcrumbs (oldest →
     newest). The body samples back along it at fixed arc spacing — every
     segment retraces the head's exact path. At rest the trail is simply
     the pose itself, so the celebration needs no mode switch. */
  function pushHead(p) {
    const l = trail[trail.length - 1];
    if (!l || Math.hypot(p.x - l.x, p.y - l.y) >= CRUMB_STEP)
      trail.push({ x: p.x, y: p.y });
    else { l.x = p.x; l.y = p.y; }
    if (trail.length > 4000) trail.splice(0, trail.length - 4000);
  }
  function sampleTrail(d) {
    let acc = 0;
    for (let i = trail.length - 1; i > 0; i--) {
      const a = trail[i], b = trail[i - 1];
      const seg = Math.hypot(a.x - b.x, a.y - b.y);
      if (acc + seg >= d) {
        const f = seg ? (d - acc) / seg : 0;
        return {
          x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f,
          tx: (a.x - b.x) / (seg || 1), ty: (a.y - b.y) / (seg || 1)
        };
      }
      acc += seg;
    }
    const t0 = trail[0], t1 = trail[1] || t0;
    const seg = Math.hypot(t1.x - t0.x, t1.y - t0.y) || 1;
    return { x: t0.x, y: t0.y, tx: (t1.x - t0.x) / seg, ty: (t1.y - t0.y) / seg };
  }

  /* ---------- hole + lap-track geometry ---------- */
  function rayToBoard(x, y, a) {
    const cx = Math.cos(a), sy = Math.sin(a);
    let t = Infinity;
    if (cx > 0) t = Math.min(t, (bX + bW - x) / cx);
    if (cx < 0) t = Math.min(t, (bX - x) / cx);
    if (sy > 0) t = Math.min(t, (bY + bH - y) / sy);
    if (sy < 0) t = Math.min(t, (bY - y) / sy);
    return t;
  }
  function coneHole(px, py, half) {
    if (px === undefined) { px = headPos.x; py = headPos.y; }
    if (half === undefined) half = 1.75;
    for (let k = 0; k < 30; k++) {
      const a = heading + (rng() - 0.5) * 2 * half;
      const r = segD * (4 + rng() * 5);
      const p = { x: px + Math.cos(a) * r, y: py + Math.sin(a) * r };
      const m = Math.max(bW * 0.12, HOLE_ORBIT * segD * 0.5);
      const my = Math.max(bH * 0.12, HOLE_ORBIT * segD * 0.5);
      if (p.x > bX + m && p.x < bX + bW - m &&
        p.y > bY + my && p.y < bY + bH - my)
        return p;
    }
    return null;
  }
  function pickHole() {
    const c = coneHole();
    if (c) return c;
    for (let k = 0; k < 30; k++) {
      const p = {
        x: bX + bW * (0.2 + rng() * 0.6),
        y: bY + bH * (0.2 + rng() * 0.6)
      };
      if (Math.hypot(p.x - headPos.x, p.y - headPos.y) > segD * 3.5)
        return p;
    }
    return { x: bX + bW / 2, y: bY + bH / 2 };
  }
  /* the lap track: a sharp-rect guide inset inside the board; the
     head's finite turn rate is what rounds the corners */
  function lapGeom(inset) {
    const in0 = inset === undefined ? LAP_INSET * segD : inset;
    // the track is at most a centred square — on wide screens the
    // circuit shouldn't hug the far edges of the window
    const sq = Math.min(bW, bH);
    const x0 = bX + (bW - sq) / 2 + in0, y0 = bY + (bH - sq) / 2 + in0;
    const x1 = x0 + sq - 2 * in0, y1 = y0 + sq - 2 * in0;
    if (x1 <= x0 || y1 <= y0) return null;
    const w = x1 - x0, h = y1 - y0;
    if (w < segD * 3 || h < segD * 3) return null;
    return { x0, y0, x1, y1, w, h, P: 2 * (w + h) };
  }
  function lapPt(t, s) {
    s = ((s % t.P) + t.P) % t.P;
    if (s < t.w) return { x: t.x0 + s, y: t.y0 };
    s -= t.w;
    if (s < t.h) return { x: t.x1, y: t.y0 + s };
    s -= t.h;
    if (s < t.w) return { x: t.x1 - s, y: t.y1 };
    s -= t.w;
    return { x: t.x0, y: t.y1 - s };
  }
  function lapNearest(t, p) {
    let x = Math.min(Math.max(p.x, t.x0), t.x1);
    let y = Math.min(Math.max(p.y, t.y0), t.y1);
    const c = [
      { s: x - t.x0, d: Math.abs(p.y - t.y0) + Math.abs(p.x - x) },
      { s: t.w + (y - t.y0), d: Math.abs(p.x - t.x1) + Math.abs(p.y - y) },
      { s: t.w + t.h + (t.x1 - x), d: Math.abs(p.y - t.y1) + Math.abs(p.x - x) },
      { s: 2 * t.w + t.h + (t.y1 - y), d: Math.abs(p.x - t.x0) + Math.abs(p.y - y) }
    ];
    c.sort((a, b) => a.d - b.d);
    return c[0].s;
  }

  /* ---------- the script drive ---------- */
  function startDepart(kind) {
    state = 'depart';
    departT = performance.now();
    const a = trail[trail.length - 1], b = trail[trail.length - 2];
    heading = Math.atan2(a.y - b.y, a.x - b.x);
    phraseArc = 0;
    kind = kind || qs.get('depart') || pageKind || 'tour';
    if (kind === 'random') kind = EXITS[Math.floor(rng() * EXITS.length)];
    if (!MOTION) kind = 'still';
    hole = null; holeArc = null;
    ring = null; glowT0 = -1; stillK = 1;
    spinning = false; whirlpool = false; spinProg = 0;
    let cruiseCap = Infinity;
    if (kind === 'spin' || kind === 'dive') {
      const room = rayToBoard(headPos.x, headPos.y, heading);
      const cruiseArc = Math.min(
        (SCRIPTS[kind][0].extent || 0) * segD,
        Math.max(0, room - segD * 1.5));
      cruiseCap = cruiseArc;
      const px = headPos.x + Math.cos(heading) * cruiseArc;
      const py = headPos.y + Math.sin(heading) * cruiseArc;
      hole = coneHole(px, py) || coneHole(px, py, 2.8);
      if (!hole) kind = 'edge';
    }
    script = (SCRIPTS[kind] || SCRIPTS.spin).map(p => ({
      ...p,
      arc: p.deg
        ? DEPART_SPEED * segD * (p.speed || 1) * Math.abs(p.deg) / Math.abs(p.turn || 1)
        : (p.extent || 0) * segD
    }));
    if (isFinite(cruiseCap)) script[0].arc = Math.min(script[0].arc, cruiseCap);
  }

  function driveHead(dt, depAge) {
    let budget = dt, guard = 32;
    while (budget > 1e-9 && guard--) {
      const ph = script[0];
      const v = DEPART_SPEED * segD * ((ph && ph.speed) || 1);
      if (ph && ph.spin) {
        if (ph.r0 === undefined) {
          const rx = headPos.x - hole.x, ry = headPos.y - hole.y;
          ph.r0 = Math.hypot(rx, ry);
          ph.ang = Math.atan2(ry, rx);
          ph.dir = hole.spinDir || 1;
          ph.done = 0;
          ph.total = ph.turns * Math.PI * 2;
          spinning = true; whirlpool = true;
        }
        let r = ph.r0 * Math.max(0, 1 - ph.done / ph.total);
        let dth = v / Math.max(r, segD * 0.25) * budget;
        dth = Math.min(dth, ph.total - ph.done);
        const spent = dth * Math.max(r, segD * 0.25) / v;
        ph.done += dth;
        ph.ang += ph.dir * dth;
        spinProg = ph.done / ph.total;
        r = ph.r0 * Math.max(0, 1 - ph.done / ph.total);
        headPos.x = hole.x + Math.cos(ph.ang) * r;
        headPos.y = hole.y + Math.sin(ph.ang) * r;
        tipArc += v * spent;
        budget -= spent;
        if (ph.done >= ph.total - 1e-9) {
          headPos.x = hole.x; headPos.y = hole.y;
          holeArc = tipArc;
          script.shift(); phraseArc = 0; spinning = false;
        }
        continue;
      }
      if (ph && ph.laptrack) {
        if (ph.t === undefined) {
          ph.t = lapGeom();
          if (!ph.t) { script.shift(); phraseArc = 0; continue; }
          ph.s = lapNearest(ph.t, headPos);
          const tp = lapPt(ph.t, ph.s + 4), tm = lapPt(ph.t, ph.s - 4);
          ph.dir = (Math.cos(heading) * (tp.x - tm.x) +
            Math.sin(heading) * (tp.y - tm.y)) >= 0 ? 1 : -1;
          ph.prog = 0;
        }
        const sNew = lapNearest(ph.t, headPos);
        let dlt = sNew - ph.s;
        if (dlt > ph.t.P / 2) dlt -= ph.t.P;
        if (dlt < -ph.t.P / 2) dlt += ph.t.P;
        ph.prog += Math.max(0, ph.dir * dlt);
        ph.s = sNew;
        const c = lapPt(ph.t, ph.s + ph.dir * LAP_LOOKAHEAD * segD);
        const err = wrapAngle(Math.atan2(c.y - headPos.y,
          c.x - headPos.x) - heading);
        const w = Math.max(-LAP_TURN, Math.min(LAP_TURN,
          err * LAP_GAIN * 180 / Math.PI)) * Math.PI / 180;
        heading += w * budget;
        const step = v * budget;
        headPos.x += Math.cos(heading) * step;
        headPos.y += Math.sin(heading) * step;
        tipArc += step; phraseArc += step;
        budget = 0;
        if (ph.prog >= ph.t.P * (ph.laps || 1) * 0.985) {
          script.shift(); phraseArc = 0;
        }
        continue;
      }
      if (ph && ph.shrinktrack) {
        // same carrot-on-track steering as the lap, but the track is
        // the thing that moves: it contracts until it holds just one
        // body-length, then the snake keeps circling until the body
        // fills the loop — the ring without the ring machinery
        if (ph.t === undefined) {
          ph.inset = LAP_INSET * segD;
          ph.t = lapGeom(ph.inset);
          if (!ph.t) { script.shift(); phraseArc = 0; continue; }
          ph.s = lapNearest(ph.t, headPos);
          const tp = lapPt(ph.t, ph.s + 4), tm = lapPt(ph.t, ph.s - 4);
          ph.dir = (Math.cos(heading) * (tp.x - tm.x) +
            Math.sin(heading) * (tp.y - tm.y)) >= 0 ? 1 : -1;
          ph.fill = 0;
        }
        const bodyLen = (N - 1) * SPACING_K * segD;
        // the track: a rect while there's room, then a circle inscribed
        // at its floor — lapGeom stops at ~3 segD sides, but the body
        // is ~9 segD long and needs a loop it can actually fill
        if (ph.t.P > bodyLen * SHRINK_TO) {
          if (ph.circ) {
            // contract only while the head is riding the boundary —
            // the loop shrinks under the snake, never out from under it
            const r2 = Math.max(segD * 0.8,
              ph.circ.r - SHRINK_RATE * budget);
            if (Math.abs(Math.hypot(headPos.x - ph.circ.x,
              headPos.y - ph.circ.y) - r2) <= segD * 1.2) {
              ph.circ.r = r2;
              ph.t.P = 2 * Math.PI * r2;
            }
          } else {
            const nt = lapGeom(ph.inset + SHRINK_RATE * budget);
            if (nt) {
              const dIn = Math.min(headPos.x - nt.x0, nt.x1 - headPos.x,
                headPos.y - nt.y0, nt.y1 - headPos.y);
              if (dIn <= segD * 1.2) {
                ph.inset += SHRINK_RATE * budget; ph.t = nt;
              }
            }
            else {
              const cx = (ph.t.x0 + ph.t.x1) / 2,
                cy = (ph.t.y0 + ph.t.y1) / 2;
              ph.circ = {
                x: cx, y: cy, r: Math.min(ph.t.w, ph.t.h) / 2,
                a0: Math.atan2(headPos.y - cy, headPos.x - cx)
              };
              ph.t.P = 2 * Math.PI * ph.circ.r;
            }
          }
        } else ph.fill += v * budget;   // track fixed — body winds on
        const ptOf = s => ph.circ
          ? {
            x: ph.circ.x + Math.cos(ph.circ.a0 + ph.dir * s / ph.circ.r)
              * ph.circ.r,
            y: ph.circ.y + Math.sin(ph.circ.a0 + ph.dir * s / ph.circ.r)
              * ph.circ.r
          }
          : lapPt(ph.t, s);
        const nearOf = p => {
          if (!ph.circ) return lapNearest(ph.t, p);
          let d = ph.dir > 0
            ? Math.atan2(p.y - ph.circ.y, p.x - ph.circ.x) - ph.circ.a0
            : ph.circ.a0 - Math.atan2(p.y - ph.circ.y, p.x - ph.circ.x);
          d = ((d % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          return d * ph.circ.r;
        };
        const sNew = nearOf(headPos);
        let dlt = sNew - ph.s;
        if (dlt > ph.t.P / 2) dlt -= ph.t.P;
        if (dlt < -ph.t.P / 2) dlt += ph.t.P;
        ph.s = sNew;
        const c = ptOf(ph.s + ph.dir * LAP_LOOKAHEAD * segD);
        const err = wrapAngle(Math.atan2(c.y - headPos.y,
          c.x - headPos.x) - heading);
        const w = Math.max(-LAP_TURN, Math.min(LAP_TURN,
          err * LAP_GAIN * 180 / Math.PI)) * Math.PI / 180;
        heading += w * budget;
        const step = v * budget;
        headPos.x += Math.cos(heading) * step;
        headPos.y += Math.sin(heading) * step;
        tipArc += step; phraseArc += step;
        budget = 0;
        // the loop "closes" when the head comes home to the tail —
        // actual meeting, not distance travelled. From there the head
        // winds WIND_TURNS-1 more circuits of the loop, then rests.
        // (fill is a failsafe cap if the meeting never registers)
        let done = ph.fill >= bodyLen * 4;
        if (ph.t.P <= bodyLen * SHRINK_TO) {
          if (ph.met === undefined && ph.fill >= bodyLen) {
            const tl = sampleTrail(bodyLen);
            if (Math.hypot(headPos.x - tl.x, headPos.y - tl.y)
              < segD * 0.45) ph.met = 0;
          }
          if (ph.met !== undefined) {
            ph.met += step;
            done = ph.met >= ph.t.P * (WIND_TURNS - 1);
          }
        }
        if (done) {
          // hand the glow its circle — the loop's own geometry
          if (!ring) ring = {
            x: ph.circ ? ph.circ.x : (ph.t.x0 + ph.t.x1) / 2,
            y: ph.circ ? ph.circ.y : (ph.t.y0 + ph.t.y1) / 2,
            r: ph.t.P / (2 * Math.PI), dir: ph.dir, ang: 0, arc: 0,
            orbiting: true
          };
          script.shift(); phraseArc = 0;
        }
        continue;
      }
      if (ph && ph.ring) {
        if (!ring) {
          const L = (N - 1) * SPACING_K * segD;
          ring = {
            x: bX + bW / 2, y: bY + bH / 2,
            r: Math.min(L / (2 * Math.PI), Math.min(bW, bH) * 0.38),
            dir: 0, ang: 0, arc: 0, orbiting: false
          };
        }
        const dx = headPos.x - ring.x, dy = headPos.y - ring.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (!ring.orbiting) {
          if (ring.dir === 0) {
            const ox = dx / dist, oy = dy / dist;
            ring.dir =
              (ox * Math.sin(heading) - oy * Math.cos(heading)) > 0 ? -1 : 1;
          }
          const ox = dx / dist, oy = dy / dist, s = ring.dir;
          const ax = ring.x + (s > 0 ? -oy : oy) * ring.r;
          const ay = ring.y + (s > 0 ? ox : -ox) * ring.r;
          const err = wrapAngle(Math.atan2(ay - headPos.y,
            ax - headPos.x) - heading);
          const w = Math.max(-LAP_TURN, Math.min(LAP_TURN,
            err * LAP_GAIN * 180 / Math.PI)) * Math.PI / 180;
          heading += w * budget;
          const step = v * budget;
          headPos.x += Math.cos(heading) * step;
          headPos.y += Math.sin(heading) * step;
          tipArc += step; phraseArc += step;
          budget = 0;
          if (dist <= ring.r) {
            ring.orbiting = true;
            ring.ang = Math.atan2(dy, dx);
          }
          continue;
        }
        const dth = v / ring.r * budget;
        ring.ang += ring.dir * dth;
        ring.arc += v * budget;
        headPos.x = ring.x + Math.cos(ring.ang) * ring.r;
        headPos.y = ring.y + Math.sin(ring.ang) * ring.r;
        heading = ring.ang + ring.dir * Math.PI / 2;
        tipArc += v * budget; phraseArc += v * budget;
        budget = 0;
        if (ring.arc >= (N - 1) * SPACING_K * segD) {
          script.shift(); phraseArc = 0;
          glowT0 = depAge;
        }
        continue;
      }
      if (ph && ph.glow) {
        if (glowT0 < 0) glowT0 = depAge;
        budget = 0;
        break;
      }
      if (ph && ph.still) {
        // the no-motion ending: the body fades where it lies, then the
        // usual halo + numeral fade up at board centre — the ring exists
        // as halo geometry only, no body ever winds it
        if (!ring) {
          const L = (N - 1) * SPACING_K * segD;
          ring = {
            x: bX + bW / 2, y: bY + bH / 2,
            r: Math.min(L / (2 * Math.PI), Math.min(bW, bH) * 0.38),
            dir: 0, ang: 0, arc: 0, orbiting: false
          };
        }
        if (ph.t0 === undefined) ph.t0 = depAge;
        stillK = 1 - Math.min(1, (depAge - ph.t0) / STILL_FADE);
        if (stillK <= 0 && glowT0 < 0) glowT0 = depAge;
        budget = 0;
        break;
      }
      let w = ((ph && ph.turn) || 0) * Math.PI / 180;
      let step;
      if (ph && ph.seek) {
        if (!hole) { hole = pickHole(); holeShowArc = tipArc; }
        const dx = hole.x - headPos.x, dy = hole.y - headPos.y;
        const dist = Math.hypot(dx, dy);
        let ax = hole.x, ay = hole.y;
        if (script[1] && script[1].spin) {
          if (hole.spinDir === undefined) {
            const ox = -dx / dist, oy = -dy / dist;
            hole.spinDir =
              (ox * Math.sin(heading) - oy * Math.cos(heading)) > 0 ? -1 : 1;
          }
          const ox = -dx / dist, oy = -dy / dist;
          const s = hole.spinDir, R = HOLE_ORBIT * segD;
          ax = hole.x + (s > 0 ? -oy : oy) * R;
          ay = hole.y + (s > 0 ? ox : -ox) * R;
        }
        const err = wrapAngle(Math.atan2(ay - headPos.y, ax - headPos.x) - heading);
        w = Math.max(-HOLE_TURN, Math.min(HOLE_TURN,
          err * HOLE_GAIN * 180 / Math.PI)) * Math.PI / 180;
        if (script[1] && script[1].spin && dist <= HOLE_ORBIT * segD) {
          script.shift(); phraseArc = 0;
          continue;
        }
        step = Math.min(dist, v * budget);
        if (step >= dist) {
          headPos.x = hole.x; headPos.y = hole.y;
          tipArc += dist; budget -= dist / v;
          holeArc = tipArc;
          script.shift(); phraseArc = 0;
          continue;
        }
      } else if (!ph) {
        if (holeArc !== null) {
          const back = tipArc - holeArc;
          const pace = 1 + 0.45 * Math.min(1, back / (segD * 2));
          tipArc += v * pace * budget;
          break;
        }
        step = v * budget;
      } else {
        step = Math.min(ph.arc - phraseArc, v * budget);
      }
      const dtStep = step / v;
      heading += w * dtStep;
      headPos.x += Math.cos(heading) * step;
      headPos.y += Math.sin(heading) * step;
      tipArc += step;
      phraseArc += step;
      budget -= dtStep;
      if (ph && !ph.seek && phraseArc >= ph.arc - 1e-6) {
        script.shift(); phraseArc = 0;
      }
    }
    // the wriggle is baked into the trail: the head swims, the body
    // retraces the wiggly path — nothing to add at draw time
    const amp = (DEPART_AMP * Math.min(1, depAge / DEPART_RAMP)) * segD;
    let wob = Math.sin(depAge * DEPART_FREQ) * amp;
    if (script[0] && script[0].calm) wob = 0;   // a calm phrase runs straight
    if (hole)
      wob *= Math.max(0, Math.min(1,
        1 - (tipArc - holeShowArc) / (segD * 1.2)));
    if (ring && ring.orbiting)
      wob *= Math.max(0, 1 - ring.arc / (segD * 1.2));
    pushHead({
      x: headPos.x - Math.sin(heading) * wob,
      y: headPos.y + Math.cos(heading) * wob
    });
  }

  /* ---------- head grammar (same as the games) ---------- */
  function blinkScale(now) {
    if (blinkT0 < 0) {
      if (now < nextBlinkAt) return 1;
      blinkT0 = now;
    }
    const k = (now - blinkT0) / 1000 / BLINK_SECS;
    if (k >= 1) {
      blinkT0 = -1;
      nextBlinkAt = now + (BLINK_MIN + rng() * (BLINK_MAX - BLINK_MIN)) * 1000;
      return 1;
    }
    return 1 - Math.sin(k * Math.PI) * 0.88;
  }
  function drawHead(s, facing, now, sc) {
    const r = segD / 2 * (sc === undefined ? 1 : sc);
    const hue = (table * 31 + 200) % 360;
    const g = ctx.createRadialGradient(
      s.x - r * 0.33, s.y - r * 0.33, r * 0.2, s.x, s.y, r);
    g.addColorStop(0, 'hsl(' + hue + ',62%,64%)');
    g.addColorStop(1, 'hsl(' + hue + ',56%,28%)');
    ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, 7);
    ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'hsl(' + hue + ',58%,40%)';
    ctx.stroke();
    gaze += wrapAngle(facing - gaze) * 0.14;
    const ex = Math.cos(gaze), ey = Math.sin(gaze);
    const px = -ey, py = ex;
    const sq = blinkScale(now);
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(s.x + ex * r * 0.38 + px * side * r * 0.36,
        s.y + ey * r * 0.38 + py * side * r * 0.36,
        r * 0.16, Math.max(r * 0.16 * sq, r * 0.03), gaze, 0, 7);
      ctx.fillStyle = '#101418'; ctx.fill();
    }
  }
  function numeral(v, cx, cy, size, colour) {
    ctx.font = '700 ' + size + 'px -apple-system, system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = colour;
    ctx.fillText(v, cx, cy);
  }

  /* ---------- begin ---------- */
  function begin(opts) {
    ctx = opts.ctx; W = opts.W; H = opts.H;
    bX = opts.board.x; bY = opts.board.y; bW = opts.board.w; bH = opts.board.h;
    segD = opts.segD; table = opts.table; segs = opts.segs;
    onFade = opts.onFade || null; onDone = opts.onDone || null;
    pageKind = opts.kind || null;
    fadeFired = false;
    // the trail IS the pose, read tail→head — the celebration starts from
    // exactly where the game left the snake
    trail = segs.map(s => ({ x: s.x, y: s.y })).reverse();
    from = segs.map(s => ({ x: s.x, y: s.y }));
    settleT = performance.now();
    headPos = { x: segs[0].x, y: segs[0].y };
    tipArc = 0; hole = null; holeArc = null; script = [];
    spinning = false; whirlpool = false; spinProg = 0;
    ring = null; glowT0 = -1; stillK = 1;
    prevNow = 0;
    gaze = Math.atan2(segs[0].y - segs[1].y, segs[0].x - segs[1].x);
    nextBlinkAt = performance.now() + 2000 + rng() * 2000;
    blinkT0 = -1;
    const at = parseFloat(qs.get('departAt'));
    if (at > 0) {
      settleT = performance.now() - 2000;   // a baked run pretends the
      state = 'depart';                     // settle already happened
      startDepart();
      departT = performance.now() - at * 1000;
      const steps = Math.ceil(at / 0.016);
      for (let k = 0; k < steps; k++) driveHead(0.016, k * 0.016);
    } else {
      state = 'beat';
      beatT = performance.now();
    }
  }

  /* ---------- frame ---------- */
  function frame(now) {
    if (state === 'off' || state === 'gone' || !segs.length) return;
    ctx.fillStyle = '#101418';
    ctx.fillRect(0, 0, W, H);

    const dt = Math.min((now - prevNow) / 1000 || 0.016, 0.05);
    prevNow = now;
    const departAge = state === 'depart' ? (now - departT) / 1000 : 0;
    const settleAge = (now - settleT) / 1000;
    if (state === 'depart') driveHead(dt, departAge + dt);
    if (state === 'beat' &&
      now - beatT > (N - 1) * BEAT_STAGGER * 1000 + BEAT_HOLD * 1000 + 250)
      startDepart();

    // the hole, if there is one, under everything — a flat sandy circle
    if (hole) {
      const grow = Math.min(1, (tipArc - holeShowArc) / (segD * 0.8));
      const r = segD * 0.85 * grow;
      if (r > 0.5) {
        const g = ctx.createRadialGradient(hole.x, hole.y, 0,
          hole.x, hole.y, r);
        g.addColorStop(0, '#6e5f42');
        g.addColorStop(0.75, '#b7a273');
        g.addColorStop(1, '#d9c49a');
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, r, 0, 7);
        ctx.fillStyle = g; ctx.fill();
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, r * 0.97, 0, 7);
        ctx.strokeStyle = 'rgba(140,120,80,.45)';
        ctx.lineWidth = 2; ctx.stroke();
      }
    }

    // the halo ending: bloom, hold, slow fade — the numeral gathers the
    // light and outlives the ring by a beat
    let fadeK = 1, numA = 0;
    if (glowT0 >= 0 && ring) {
      const ga = departAge - glowT0;
      const bloom = Math.max(0, Math.min(1, ga / 0.35));
      fadeK = ga <= GLOW_SECS ? 1
        : Math.max(0, 1 - (ga - GLOW_SECS) / FADE_SECS);
      const nk = Math.max(0, Math.min(1, (ga - 0.7) / NUM_RISE));
      const held = ga <= GLOW_SECS + FADE_SECS + NUM_LINGER;
      numA = nk * nk * (3 - 2 * nk) *
        (held ? 1 : Math.max(0, 1 -
          (ga - GLOW_SECS - FADE_SECS - NUM_LINGER) / NUM_FADE));
      const haloR = ring.r + segD * 2 * (1 - 0.55 * nk);
      const haloA = bloom * fadeK * (1 - 0.35 * nk);
      const g = ctx.createRadialGradient(ring.x, ring.y,
        ring.r * 0.2, ring.x, ring.y, haloR);
      g.addColorStop(0, 'rgba(255,240,200,' + 0.55 * haloA + ')');
      g.addColorStop(0.65, 'rgba(255,215,130,' + 0.28 * haloA + ')');
      g.addColorStop(1, 'rgba(255,215,130,0)');
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, haloR, 0, 7);
      ctx.fillStyle = g; ctx.fill();
      if (!fadeFired && !held) {   // the numeral's terminal dim — the
        fadeFired = true;          // end-card fades up over it
        if (onFade) onFade();
      }
    }

    // body sampled back along the trail
    const sp = SPACING_K * segD;
    const pos = [];
    let allGone = true;
    for (let i = 0; i < N; i++) {
      const sm = sampleTrail(i * sp);
      let sc = 1;
      if (state === 'depart') {
        if (sm.x < -segD || sm.x > W + segD || sm.y < -segD || sm.y > H + segD) {
          pos[i] = null; continue;
        }
        if (whirlpool && hole) {
          let dx = sm.x - hole.x, dy = sm.y - hole.y;
          const d = Math.hypot(dx, dy) || 1;
          sc = Math.max(0, Math.min(1, d / (HOLE_ORBIT * segD)))
            * (1 - 0.7 * spinProg);
          if (holeArc !== null) {
            const a = (hole.spinDir || 1) * (tipArc - holeArc) /
              Math.max(d, segD * 0.35);
            const ca = Math.cos(a), sa = Math.sin(a);
            const rx = dx * ca - dy * sa, ry = dx * sa + dy * ca;
            dx = rx; dy = ry;
            const depth = (tipArc - holeArc) - i * sp;
            if (depth > 0) {
              const f = Math.min(1, depth / (SINK_LEN * segD));
              const s2 = 1 - f * f * (3 - 2 * f);
              sc = Math.min(sc, s2);
              dx *= s2; dy *= s2;
            }
            sm.x = hole.x + dx; sm.y = hole.y + dy;
          }
        } else if (holeArc !== null) {
          const depth = (tipArc - holeArc) - i * sp;
          if (depth > 0) {
            const f = Math.min(1, depth / (DIVE_LEN * segD));
            sc = Math.min(sc, 1 - f);
            sm.x += (hole.x - sm.x) * f * f;
            sm.y += (hole.y - sm.y) * f * f;
          }
        }
        if (sc <= 0.02) { pos[i] = null; }
        else allGone = false;
      }
      if (state !== 'depart') allGone = false;
      if (pos[i] === null && state === 'depart') continue;
      pos[i] = { x: sm.x, y: sm.y, sc };
      // settle-in: ease from the position the page left each segment to
      // its trail spot — no visible rearrangement at the handover
      if (settleAge < SETTLE_SECS + N * SETTLE_STAGGER) {
        const st = Math.max(0, Math.min(1,
          (settleAge - i * SETTLE_STAGGER) / SETTLE_SECS));
        const e = st * st * (3 - 2 * st);
        pos[i].x = from[i].x + (pos[i].x - from[i].x) * e;
        pos[i].y = from[i].y + (pos[i].y - from[i].y) * e;
      }
    }
    if (qs.has('animdbg') && state === 'depart')
      document.title = pos.map(p => p ?
        Math.round(p.x) + ',' + Math.round(p.y) : 'x').join(' ');
    if (state === 'depart' && (allGone || (glowT0 >= 0 &&
      departAge - glowT0 > GLOW_SECS + FADE_SECS + NUM_LINGER + NUM_FADE))) {
      state = 'gone';
      if (!fadeFired) { fadeFired = true; if (onFade) onFade(); }
      if (onDone) onDone();
      return;
    }
    const headTip = sampleTrail(0);
    const headFacing = Math.atan2(headTip.ty, headTip.tx);

    ctx.globalAlpha = fadeK * stillK;   // ring fade; stillK fades the body
    // early on the no-motion path (stays 1 everywhere else)
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < N; i++) {
      if (!pos[i]) continue;
      if (!started) { ctx.moveTo(pos[i].x, pos[i].y); started = true; }
      else ctx.lineTo(pos[i].x, pos[i].y);
    }
    ctx.strokeStyle = 'rgba(90,110,130,.25)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // segments back-to-front; a celebrating snake is whole — blanks
    // draw as filled
    for (let i = N - 1; i >= 0; i--) {
      if (!pos[i]) continue;
      const s = segs[i], r = segD / 2;
      if (i === 0) { drawHead(pos[0], headFacing, now, pos[0].sc); continue; }
      let pop = 0;
      if (state === 'beat') {
        const k = (now - beatT) / 1000 - i * BEAT_STAGGER;
        if (k > 0 && k < BEAT_HOLD) pop = Math.sin(k / BEAT_HOLD * Math.PI);
      }
      const rr = r * (1 + pop * 0.12) * pos[i].sc;
      ctx.beginPath(); ctx.arc(pos[i].x, pos[i].y, rr, 0, 7);
      ctx.fillStyle = tableColour(table); ctx.fill();
      if (pop > 0) {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.85 * pop) + ')';
        ctx.stroke();
      }
      numeral(s.expected, pos[i].x, pos[i].y, segD * 0.34 * pos[i].sc, '#fff');
    }
    ctx.globalAlpha = 1;

    // the numeral the ring resolved into — drawn last, on its own alpha
    if (numA > 0.01 && ring) {
      ctx.font = '800 ' + (segD * (table >= 10 ? 0.8 : 1.05)) +
        'px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,240,200,' + numA + ')';
      ctx.fillText(table, ring.x, ring.y);
    }
  }

  return {
    begin,
    frame,
    pose,
    get state() { return state; }
  };
})();
