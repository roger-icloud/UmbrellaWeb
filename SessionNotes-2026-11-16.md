# Session notes — 2026-11-16

## Adaptive help — the accumulating backlog (Roger)

hint.js landed: one fading-help law — help arrives instantly in early
games, waits ~3.5 s longer and speaks a quarter softer per game won,
silent from the fifth win. Roger: "the hint mods are for me perfect —
fading before I find them tiresome".

Now keyed **per table**: wins on the 2s don't silence help on the 7s —
a less familiar table rows the help back, "like a teacher meeting a new
topic".

Ideas queued for the adaptive system, not yet built:

- **Row back for the forgetful student.** Competence should decay —
  a child returning after days away gets help re-offered rather than
  treated as proven. Needs the count to persist between visits
  (currently per-visit) with a time-decay.
- **The helper problem.** A parent/older sibling "assisting" for a
  visit or two inflates the competence count; the child then faces
  silence they haven't earned. Decay helps here too; possibly also
  detect assist-shaped play (flawless but hesitant).
- **Rollout.** hint.js is only in tilt-snake; snake-puzzle, tilt-ball,
  Search Tables, Patterns still run their own laws. Unify once the
  pace is confirmed by play.

## Watch list — do not act yet

- **Veer on close approach to a correct numeral** (Roger, logged not
  acted): likely the post-tap feint doing its designed dither. If it
  happens under pure tilt steering, investigate.
- **Wrong numeral pass-through cases** (Roger collecting instances):
  known deliberate exemptions — autopilot crossings (flash + miss, no
  stall), dithering, sleepwalking, body pass-over, post-miss
  forgiveness window.

## Also today

- Tilt Snake refusal rework: wrong catch = firm rebuff off the
  numeral's rim (head reflected + veered) then a ~1.4 s stall — a true
  stop, so the paused snake can't travel over a wrong number.
- Hint visuals: pulsing ring replaced by a fuzzy blue-white halo that
  breathes every ~3 s while ignored (amber avoided — it's the refusal
  colour-word).
- Tilt Ball: orientation guard ported from tilt-snake (viewport dims,
  350 ms settle re-check, `pointer: coarse` handheld test).
- Meta descriptions added to the 9 public pages; `<meta keywords>`
  deliberately skipped (dead for ~15 years).
- Committed + pushed: `11208bf` on mix-demo.
- Domains: howmanytimes.com is squatted at $3,000 — declined. Roger
  registered **anynumberoftimes.com** and a .uk partner for ~$16/yr.
  howmanytim.es appeared free if wanted later. Plan: brand now, point
  the domain when the site has a real home.
