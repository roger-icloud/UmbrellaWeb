# Session notes — 2026-10-25

## Done today

- index.html: Patterns + Lattice tiles removed; Honeycomb Search →
  Find Tables; Pattern Snake → Snake Patterns (with patterns.png);
  tile descs → tooltips (custom bubble — hover / press-and-hold,
  text lives in title= inside ROGERS TILE TOOLTIPS markers).
- nav.js: menu mirrors main menu order; Fullscreen/Feedback/Help/
  Rationale at bottom; nf-fs sessionStorage flag restores fullscreen
  after navigation (best-effort — browser gesture rule); ?v=11.
- manifest.json: display standalone → fullscreen (installed app).
- tilt-ball.html: HUD + steer-mode button removed; snake-head heading
  drive; STAGES curriculum table (holes × ceiling), deepest-choice
  streak advances stage; binary twinkle glint on deepest valid sink;
  holes laid out in bar-billiards rows (near = easy, far = hard);
  "?" hole replaces "prime" — accepts whatever no offered hole takes.
- rationale.html: fixed broken p/h2 nesting (caused two densities);
  all intro text bold.
- .gitignore added (.DS_Store).

## Tilt Ball — design ledger (Roger's early-morning notes)

- Hole set rethink: include 4 and 6 — school-table ordering should
  precede exotic holes; 13 was introduced too early. Candidate
  order: 2,5 → 3,9 → 4 → 6 → 8 → 7 → 13 → ?. The 6 hole is special:
  "fits 2 AND 3" — a compound test.
- Deepest = largest hole value is a proxy only (30 → 10 vs 30 → 6);
  may need a per-hole rank field.
- Difficulty ramps fast — suspect ADVANCE_STREAK=3 too quick and the
  two deal biases (0.4 + 0.35) make most deals discriminating ones.
- NEW IDEA — "full" holes: after N sinks a hole is full and closes;
  pool then only serves values with a live home. Creates a round
  structure → completion moment → stage could advance BETWEEN rounds
  (child watches the table deepen) rather than mid-play. Morphs the
  game from endless into consolidation → larger factors → primes.
  Full-state display candidates: pips inside the hole, dimmed numeral.
- "?" hole: Roger wants it always central — special, equally
  available, not far. If always present, deals must still be gated
  so prime-values aren't served early (pool test should ignore "?"
  until its stage — a flag, not a position).
- My add: round structure is the strongest idea — gives the grammar's
  completion register a natural home in this game.

## Patterns idea (Roger, late note)

Superimpose two or three grids showing table patterns in Cuisenaire
colours — doesn't stand alone as an activity; probably belongs with
Snake Patterns. No coherent progression through a game yet. Roger's
own note: "too many good ideas at once" — park it; the stage-table
shape from tilt-ball may be the progression mechanism when this is
revisited.

## Snake Patterns (pattern-snake) — open question

Too much happens too fast; meaning can outrun pacing. Options floated:
split into two activities, slow the sequence, fewer patterns by
ability (same stage-table shape as tilt-ball could govern pattern
count). "Removing random elements of a sequence is not explained" —
the removal needs to be visible/explicit, not just noticed.

## Whack-a-mole — new thread (Roger, 10-25 morning)

Numbers pop up and are tapped back down. NOT a time trial — moles
hold until judged (tap = accept if it fits, refusal if not; no chase,
no clock). Skill being exercised is fluency/recognition of single
values — different from Patterns (spatial structure of multiples).
Connects to the existing mull's hole-network thread ("whack-a-mole:
down the whirlpool, out elsewhere") — the hole as dealer, moles as
dealt objects; collected multiples could build the table row =
consolidation. Open: is it distinct enough to earn a place, or
duplicate detection? Also: tilt-ball deal algorithm still too fast
through complexity — tune NEW_HOLE_BIAS / MULTI_FIT_BIAS /
ADVANCE_STREAK, or wait for the rounds/"full holes" rework.

## Ghost demos — new thread (Roger, late 10-24/early 10-25)

Help as demonstration, not words: a ghost/low-intensity rendering of
the activity shows the principle or the next move — subdued colour or
lower alpha so the live game keeps primacy. Generalises family-wide
(ghost path in Find Tables, ghost drag in Snake Puzzle, ghost route
in Tilt Ball) — same argument as anim.js for one implementation.
Trigger question open: inactivity (long idle, ambient, dismiss on
any touch) vs explicit button (agency, but young learners don't
press help). Likely hybrid: idle-triggered with generous delay +
subtle manual affordance. Ghost must never take control from the
child — it demonstrates, it doesn't play for them.

## Snake Puzzle — open question

Two-snake variant unexplored; also need to assess how distinct it is
from Find Tables (honeycomb) — overlapping "locate multiples of t"
core vs different skills (assembly vs discovery).

Idle behaviour idea (Roger): the head turns to inspect itself / gaze
toward an unfilled socket after ~8–10s of no changes. Life register
(endearing — animal curiosity, not a UI prompt) that doubles as a
wordless hint for less experienced learners. Adjacent to the
"head-count along the body" idea already in the mull.

## Snake metaphor search (Roger, 10-26)

Rejected: chicks to devour (predation; devour is Tilt Snake's verb).
Scale/lift idea was "closer but raw" — refined into: the scale's real
metaphor is *equivalence* (3 balls of 7 balance 21 — equals sign made
physical). Candidates auditioned: waking snake (segment-thaw as
progress), tongue-flick detection, buried snake in the hole network
(ties to mole page + emergence mull), balance-as-equation.

NEW STRAND (another app, later): "mousetrap" — chain-reaction
machines where mathematical achievement turns levers, twists knobs,
raises pulleys, runs ramps. Rube-Goldberg progress-as-construction;
fits the cumulative-reward axis. Parked — snake family first.

## Pre-publish list (still open)

- help.html stale (old names, "bare probe" tilt-ball).
- Device test on real iPad/iPhone (fullscreen manifest, tooltips,
  tilt-ball stages).
- Then merge ready-to-publish → main.
