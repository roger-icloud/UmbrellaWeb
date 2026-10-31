# Session notes — 2026-10-28

## Tilt Ball — rack/rounds rework (built, on device for testing)

Agreed design from the morning's discussion, then written in one pass.
Uncommitted while Roger tests (previous state checkpointed as
`040a373 WIP: Tilt Ball rounds`).

### What changed (tilt-ball.html)

- **Rack**: a round deals ~RACK_SIZE (10) balls into a rail below the
  table — Roger's "pool-table ball return / pinball magazine" image;
  what remains to be placed is visible. One ball live at a time;
  next feeds automatically after LAUNCH_GAP, or tap a waiting ball:
  during the feed gap it picks the next launch (pendingPick), during
  play it swaps the live ball back into the tapped slot.
- **One true home**: rack composed so no home gets more balls than it
  can still take (≤ HOLE_CAP=3 pips) — a dealt ball's home can never
  close while it waits; the "10 refused by 5, accepted later" mixed
  message cannot be staged. Multi-home ambiguity banked for a later,
  more sophisticated variant.
- **Tap-to-hole autopilot**: tap sends the ball; it cruises then
  decelerates in (billiards roll-in — a min-drive floor left the ball
  orbiting just outside the capture radius: turn radius > capture
  radius = limit cycle, caught by the node harness). While sent, only
  the tapped hole can capture — a sent ball rolls past other holes.
  Drag or a real lean (MANUAL_TILT since the tap, tilt-snake rule)
  retakes control. Targeted hole holds a soft ring while en route.
- **Refusal**: shallow legal fit → slate flash + warm GLOW on the true
  home (a new 'glow' glint kind alongside 'spark'); non-fit → amber.
- **Advancement**: round ends when the rack empties; stage advances if
  cleanSinks ≥ CLEAN_FRAC (0.6) of the rack — "first-time-right"
  replaces deepest-choice (every legal sink is now a home sink).
- **Speed**: BALL_SPEED 150→200 + SPEED_STAGE 7%/stage (cap ×1.5).
- Fixed latent capture bug: a hole could swallow a ball sharing its
  depth tier without dividing it (added missing holeFits check).
- Verified headless: node DOM-stubbed harness drives real taps —
  rack composition, autopilot sinks, slate+glow refusals, swap,
  pendingPick, clean-metric stage advance all confirmed.

### Second pass same day — hierarchy REMOVED (Roger's design call)

Evening discussion produced a cleaner semantics, implemented and
harness-verified:

- **Any fitting hole accepts, always.** No capacity, no pips, no
  "full" state, no "best home". Roger's decisive example: 56 is 7×8
  AND 8×7 — refusing either is a small lie. The dealt bucketing
  survives ONLY for rack coverage (every offered hole gets
  exercised), never as a rule the child can trip.
- **Pips binned** — a filling dot-row was drifting toward score.
  "Full" visuals, slate flash, true-home glow, STRICT_HOME,
  HOLE_CAP all gone with it. Refusal is now one honest thing:
  the number doesn't divide → amber.
- **Orphans impossible by construction** — a dealt ball's fits
  never close; the return-to-rack rescue machinery was never
  needed (Roger's call saved the complexity).
- **"?" keeps its purity** — takes only what no offered hole wants
  (its real job: widening the dealt pool to primes/odd values);
  explicitly NOT a bin for composite leftovers.
- **Twinkle binned** with its fiction — a sparkle for obeying an
  invented ranking was decoration on a lie; plain sink + end-of-
  round glint cascade remain.
- Advancement unchanged: clean (refusal-free) ≥ CLEAN_FRAC — purer
  now since a refusal can only be a genuine non-fit error.
- Launch smoothing also landed: ball arrives fully-formed (slide IS
  the entrance, no re-fade), LAUNCH_SECS 0.32, taps mid-flight queue
  the destination.
- Banked for later: snooker-referee hole redistribution for
  challenges (Roger's analogy), multi-home strategy as an explicit
  difficulty dial, drift-refusal clean-metric question stays open.

### Roger's evening feedback (banked — discussion, not built)

- **Rolling 3D numeral** — audition wanted: (a) honest roll, numeral
  turns with travel like a pool-ball spot — truer illusion, risks
  legibility mid-flight; (b) numeral upright, a surface mark/shine
  rotates instead — the retreat. Tunable + device judgement.
- **Stage order** — "?" was sequenced before 7 and 13 (deep-shot
  capstones + primes get a home early); Roger expects 7 earlier,
  correctly: school-table content shouldn't sit third-from-last.
  Proposed revision: 2,10 → 5 → 4 → 3 → 6 → 8 → 7 → 9 → 13 → "?"
  (7 mid-late, 13 the hard test, "?" as "now the odd ones" finale).
- **Layout too regimented** — symmetric rails do display work, not
  gameplay work; nothing for a tilter to solve. Banked: per-round
  position jitter within bands.
- **Obstacles with hit-delay** (Roger) — pinball-bumper spirit,
  delay not score; intercepts autopilot paths too, so it matters
  for tappers and tilters. Later-stage feature, not base furniture —
  young learners get a clean table first.

### Open for Roger's eye on device

- Does a ball that *drifts* into a wrong hole uncommanded deserve to
  lose its "clean" mark? Currently yes (refusal is refusal) — strict
  but honest; easy to re-scope to decisions only.
- Roll-in pace near the hole (deliberate deceleration) — crisp or
  too patient?
- Rack legibility: next-in-queue pulse, two-row wrap, smaller balls.

### Context

- number-fun.uk serving locally via `python3 -m http.server 8000` +
  cloudflared quick tunnel (iOS motion permission needs HTTPS — the
  plain-HTTP local address silently withholds devicemotion; drag
  worked, tilt didn't. Tunnel URL regenerated per session).
- tilt-ball completion still parked (Roger, 10-28) — chained-ball
  recap idea banked; no score, per the grammar.
- font-samples.html untracked (scratch from Andika comparison).
