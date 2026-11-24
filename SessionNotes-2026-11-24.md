# SessionNotes — 2026-11-24 (launch-prep device sweep)

## Selection grammar settled — the shared pattern

Both path games (find tables `honeycomb.html`, search tables
`search-lab3.html`) now share one selection language:

- **Insist on three** — the board waits for three picked heads before
  dealing once (no per-tap redraws; a fourth pick is refused; a picked
  head can be tapped back off before the deal).
- **The riff** — unchosen heads pulse slightly bigger and brighter
  while fewer than three are picked ("why isn't it starting?" answered
  without chrome).
- **The ring** — a chosen head wears a bold ring in its table's colour.
  Two head states only: riffing = pick me, ringed = picked.
- **Sockets before numbers** — the comb draws as empty sockets under
  the rail before the deal, fills on the third pick, and returns to
  sockets when the last snake docks home. Search tables got the same
  auto-return (cameo beat → tumble home → empty grid; the Again?
  prompt is retired).
- Difficulty debate settled: no start button. Adaptive (when built)
  owns difficulty, including guiding strugglers to simpler.

## Parked — kin glow (Roger asked to log, 2026-11-24)

The kin ring — an amber ring on heads sharing ≥2 multiples with a
chosen table — was removed because it competed with the selection
ring. Roger: "the kin is a great idea please log for later."
If it returns, it needs a non-ring channel (e.g. a different riff
speed/warmth) so the two grammars don't collide again. Note the
steering purpose: helps a child pick tables that will produce
crossovers.

## Banked for the adaptive design talk

- Adaptive/challenge ladder — Roger "longs for the adaptive"; talk
  before code. Strugglers guided to simpler, not just winners to harder.
- Tilt-ball: more harder-factor holes + closing easy holes once proven
  (design talk first).
- Snake-as-skin (train/caterpillar for older kids) — feasible at the
  `Anim.stationHead` seam; build only when a second character exists.
- Grid-head-as-hint — logged previously, do NOT implement.
- Pattern-snake numerals, open-mouth catches, heads on
  help/rationale/feedback — offered, parked.

## Housekeeping learned the hard way

- Roger's Mac auto-pulls every ~60s but `git pull` **refuses silently
  when his prose is uncommitted** — he was testing stale files while
  believing the pull worked. Remedy: say "commit my words" at end of a
  writing session; Devin commits his prose, then
  `git pull --no-rebase` + push reconciles.
- Stray file in his repo dir: "YOu may not have noticed but the pages a"
  — a note saved to the wrong place; left for Roger to move/delete.

## Engine notes

- anim.js cache-buster at v=27 — bump `?v=` on every anim.js change.
- The jerk saga (2026-11-23/24): seed homecoming trails from the
  *wound* pose (`snap.pos`), not the found-path cells; ease steering
  rate itself from zero at phrase joints (S-bends, not ramps); swell
  the receiving station head during a homecoming so there is only one
  set of eyes.
- `?mtime=1` paints a running clock + last six engine events on-canvas —
  screen recordings become the log. Built for jerk-hunting; kept.
