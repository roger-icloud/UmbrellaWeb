# SessionNotes — 2026-11-22

## The homecoming, the blank screen, and the jerk

A full day's arc — the tilt-snake homecoming went in, hit a device-only
blank screen on second completion, and the hunt became the day's real work.

### Built (morning)

- **`/tilt-snake.html` homecoming** (`d46bf0f`, polished `3f4e17a`,
  `79ebaf2`): Roger's spec — after a lap of the board the snake slinks to
  its own button on the head row, body feeding in behind; when the head
  stands alone the row fades back up; the returnee glances left and right
  (~2.4s restless head) before going still. The done-bar retired — the row
  IS the "again". A real engine bug found and fixed along the way: a capped
  turn rate could orbit a near target forever — seek now docks within a
  disc's width.
- **Head buttons on tilt-snake** (`2a098a9`): the chip row became eleven
  table-coloured heads, numeral on the face, blink-on-tap — the resident
  creature doing double duty, not a costume on a button. Row fades out
  when not required (`51fe9cb` — Roger's call, frees the bottom strip on
  small phones).
- Snake-puzzle earned rail continued from yesterday's tail-end: partner
  mode dims (not hides) invalid heads; the ghost-duet tour before the
  homecoming stays in place.

### The blank screen — the hunt worth recording

Roger: ×2 completes fine, ×5 blanks forever — heads never return. The
recording showed the lap running then full black, no error.

**What was tried and disproven:** stale anim.js cache (v-bump shipped, bug
persisted); repeated-begin harness on desktop (3 "clean" runs — but see the
lesson below); gather stall (math-capped, impossible); onDone-never-fires
(every 'gone' path calls it — verified); every exception theory (the frame
catch swallowed draw errors but uncaught ones would have shown).

**The instrumentation arc (a lesson in itself):**
- v18: mstat line got `pg:`/`an:`/`row:` — his first readout said
  `menu/gone/locked` — engine "finished", row never unlocked.
- The trap had a bug of its own: the poller overwrote `ERR:` text every
  500ms — a real error could flash and vanish.
- v20: engine internals (`b:`/`dn:` counters, `unlock@`/`lock@`
  timestamps) — his screenshot read `b:2 dn:1 unlock@110s lock@112s`:
  the second begin ran, only ONE onDone ever fired, the row re-locked
  2s after game one's unlock (that was the ×5 deal lock).

**The bug:** `begin()` reset `state='beat'` but never reset the
end-of-run flags (`denHome`, `denDone`, `gather`, `roost`, `roostT`) —
those cleared only in `startDepart`, ~1.4s later. During the 'beat'
window the roost block (guarded by `denHome` alone, not
`state==='depart'`) saw game one's stale flags, satisfied the ending
instantly, and the `!denDone` guard swallowed the second `onDone`.
One frame, snake gone, row locked forever. Game one always worked —
fresh flags. Fixed `4acfc12`: `begin()` resets all run state; "new run
means no leftovers" is the invariant.

**Why it hid so well:** two legitimate states look identical — "finished
properly" and "ended instantly from stale flags" produce the same 'gone'.
The desktop harness was silently reproducing the bug all along: an
instant-'gone' reads as "complete". A test that can't fail isn't a test.

**The heuristic that cracks this species:** *works once, fails every
time after* = state surviving between runs. Audit what a new run
actually resets before theorising.

### The jerk at the homeward turn (`245acf1`)

Roger's niggle: pieces "jerk" as they pass the point where the lap hands
over to the dive home. His instinct — not a position gap — was right:
breadcrumbs stay continuous in position, but the heading error at the
joint (~90°) hits the full turn rate instantly, so the tangent kinks and
every piece snaps its facing crossing it. Fix: the seek's steering
weight ramps in over ~0.35s of travel — a fillet instead of a corner.
Same principle as the rim-entry ghost point: don't let the snake
teleport its intent.

### Housekeeping

- `?mstat=1` revives the diagnostic line; hidden by default (`2ee68c5`).
- anim.js cache-buster discipline: bump `?v=` on every anim change AND on
  fixes shipped under an already-bumped URL (v22 covers the flag fix +
  turn ramp).
- Roger's HTTPS test server: `https://192.168.0.175:8082/` (Simple Web
  Server) — real tilt testing on iPad needs it; plain http can't get
  motion permission.

### Carried threads (not for today)

- The 90° tilt-veer report (consider-only at Roger's word): candidate
  mechanisms logged — feint window ±92° by design; stray-tap autopilot
  hijack ignoring small corrections; stale gravity; sleepwalk near
  walls. A steering-source readout was proposed and awaits his verdict.
- Design bank: TIM weighing machine, crusher, auto-sort, dual-colour
  balls (option four, the strongest: two 12-balls rimmed differently —
  colour as identity, tests observation not arithmetic — honest price is
  a new refusal dialect + per-colour deal guarantees), square numbers
  quietly marked, incidental-learning ledger.
- Head-rail rule settled: heads inside snake games only, chips
  elsewhere — the ornate-font principle.
- Code health: anim.js now ~1450 lines with ~20 module-level flags and
  an implicit lifecycle. If it keeps growing, bundling per-run state
  into one object makes this bug species structurally impossible.
  Noted, not urgent.
- Kid testing remains the end-of-polish priority.
