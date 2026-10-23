# UmbrellaWeb — project context for Devin

## What this is

A family of small exploratory activities about number, hosted as a
static site at `https://number-fun.uk` (GitHub Pages behind Cloudflare,
repo `roger-icloud/UmbrellaWeb`, deploys from `main`). It is the
lightweight sibling of the Swift app `~/Developer/Umbrella` — the web
exists to *test mechanics cheaply*; ideas that survive graduate to Swift
with their semantics already settled.

Roger is the designer and author. He is not a programmer; he edits
marked prose blocks himself and asks Devin to commit and push. Never
rewrite his text. He is 76 and prefers a calm pace — no superlatives,
no excitement, no fault/blame vocabulary ("oversight", "needs further
attention" — never "still pending" for something broken).

## The design grammar (the part that's easy to lose)

- **Discovery, not instruction.** Activities provoke questions ("why did
  it refuse?", "why does 7 have no friends?") rather than explain.
- **Refusal is information.** A wrong tap/drop shakes or flashes amber
  and nothing else — no score, no penalty, no red. `#e0a53a` is the
  refusal/accent amber; `#35c795` is the snake green; `#101418` is the
  page dark.
- **Numbers are objects** — collected (Tilt Snake), found (Patterns,
  Honeycomb), carried home (Snake Puzzle). Three mechanics, one family.
- **Table colour-coding** is shared: `hsl((t*31+200)%360, 60%, 45%)`.
- **Table selection happens between games** — chips lock once a round
  has started.
- **Steering, never forcing** — e.g. Honeycomb's kin glow (a chip glows
  only if it shares ≥2 multiples with a selected table; the bare product
  doesn't count — ×7 and ×11 correctly glow nobody).
- **Tunables live at the top of each file** in a `/* tunables */` block —
  Roger adjusts behaviour through named constants, not code spelunking.
- The snake is one character everywhere: green head, eyes that face the
  heading, S-curve body (also the menu icon, inline SVG in `nav.js`).

## Architecture

- Single-file pages: HTML + inline `<script>`, no build, no deps.
- `nav.js` — shared top-right snake menu; every page includes it with a
  `?v=N` cache-buster that must be bumped on every nav change (Cloudflare
  caches ~10min; hard-reload or wait when a change "isn't there").
- Canvas rendering: `visualViewport` for true visible size (iOS toolbar
  lies), degenerate mid-transition sizes ignored, `requestAnimationFrame`
  wrapped in try/catch so a bad frame can't kill the loop.
- Two layout policies, chosen per activity:
  - **Design-px virtual resolution** (the tilt games): world is 375
    design-px wide, `K = min(W/DESIGN_W, H/MIN_DESIGN_H, K_MAX)` scales
    it — capped so desktop windows widen the world rather than inflate
    the objects.
  - **Discrete real-px boards** (Patterns, Honeycomb, Snake Puzzle):
    the board refits cells/segments to the actual space.
- Handheld landscape → polite "Turn upright" overlay (the game waits,
  doesn't re-lay-out). Desktop landscape is legitimate and exempt —
  guard keys on `ontouchstart`.
- PWA: `manifest.json` + icons give Add-to-Home-Screen standalone mode;
  no service worker — **the site is not offline-capable**, don't claim it.
- Roger-facing prose lives between `ROGERS … TEXT` comment markers
  (index intro, rationale, help). Edit inside the markers only on request.

## Files

- `index.html` — landing + Roger's intro + activity tiles
- `tilt-snake.html` — tilt/drag/tap snake collects ×t in order
- `snake-puzzle.html` — assemble a table on a posed snake; 4 blanks,
  values spawn one at a time, drag home (port of Swift `TailPuzzleModel`)
- `honeycomb.html` — connected path of multiples in a hex comb; 1–3
  tables, crossover cells shared by paths (split-colour when claimed by
  two, wedge by three), twin cells, ambiguity rejection, kin glow
- `patterns.html` — hundred-square multiples
- `lattice.html` — loose multiples of a table rest on the ground;
  drag (or tap) each home to its socket on the hundred square.
  On the main menu since 2026-10-21 — "earned its place" though the
  idea isn't fully thought through; no departure yet.
- `tilt-ball.html` — bar-billiards factors game (first cut 2026-10-21,
  from the tilt probe): holes carry 2,3,5,7 plus a `prime` hole for
  values none of them divide; ball deals 2..100, fades in, sinks in a
  hole that divides it, refused (amber + ejection) elsewhere.
  ROGER-NOTE block in the file lists open design questions — hole set,
  prime-hole wording, deal bias, best steer mode (default VELOCITY =
  level-to-stop), capture feel. Steer-mode button kept for now.
- `rationale.html`, `help.html`, `feedback.html` — human-facing pages
- `snake.html`/`search.html`/`ball.html` — redirect stubs, kept

## Animation grammar (agreed 2026-10-17)

Shared vocabulary for all motion; `anim.js` (a shared include, `nav.js`
style) is the intended medium — activities call it, never implement
their own. One implementation is what makes "one snake" a fact rather
than a hope; the Swift departure engines rotted precisely because two
copies drifted.

- **Registers** — our design words, invisible to the child:
  *life* (blink, gaze, idle drift — "this is an animal"),
  *feedback* (refusal shake, amber flash, spawn rise, hint pulse,
  fly-home — "the game heard you"),
  *completion* (the departure — only when the round is truly done).
- **Honest reward**: success is marked by the built entity coming alive
  and departing — wriggle-off (Puzzle), a found chain gains a head then
  departs (Search), a celebration lap (Tilt Snake). No coins, confetti,
  badges — the object itself says "the table is whole".
- **The reinforcement beat**: before departure, segments light their
  members in sequence (×1…×12) — the farewell that teaches.
- **Motion must answer "what is it saying?"** — alive, heard-you, or
  finished. Not stillness (a resting snake drifts); purposelessness is
  what's barred.
- First build: Snake Puzzle departure. Search departures need their
  concurrency rules agreed first (the Swift lesson: departures must not
  run entangled with live board state).

## Pose lab — current thread (2026-10-18)

`pose-lab.html` is **a proving ground, not a product** — its purpose is
building the exit vocabulary before any activity inherits it. Ports to
real activities come *after* the vocabulary is proven, not before.
Local only (untracked); served by `python3 -m http.server 8000`.

**Why this exists (Roger, 2026-10-18):** games complete without comment
— Search is the sore case: three paths found with time and thought,
brushed aside the instant the last tap lands. No recap, no admiration,
no reinforcement. Completion needs all three plus a fourth:
**curiosity** — varied exits so the child wonders what farewell comes
next time; encouraging continuation, never obliging it. The whirlpool
was tackled first *deliberately as the hardest case* — if the grammar
survives it, the rest are downhill. It did. (Roger: "a remarkable
success".) Also in progress ~8 weeks — only recently feasible, since
agents can now interpret pictures/stills and screen recordings.
**A second axis recorded** — cumulative rewards: successes *build*
(a flower +petal, a machine +piece ending in a working model, a jigsaw
+piece to a full picture). Tangible progress-as-construction; no fake
coins. The exit celebrates *this* round; the construction accumulates
across rounds. Unbuilt; keep for the family-wide version.

**The programme — Roger's five exits** (celebrations, plural, different
characters; each is a resolution the sentence lands on):

1. **lap** — victory circuit. *Built 2026-10-18* (`?depart=lap` or the
   Lap button / `l` key): tangential join to nearest edge (carrot-on-
   track steering, `lapGeom`/`lapPt`/`lapNearest` — a sharp-rect guide
   whose corners the finite turn rate rounds), one full circuit, leave
   at the entry point, then `ring`: ghost-point rim approach + wind
   until the whole body lies on the circle (r = body length / 2π,
   clamped to board — "if geometry allows"). Then `glow`: halo blooms
   ~0.35s, holds `GLOW_SECS`, **and the light gathers into the table's
   numeral** (Roger's idea — the ring becomes a frame, the centre
   answers "which snake was this"); the ring fades over `FADE_SECS`
   while the numeral holds `NUM_LINGER` longer, then dims over
   `NUM_FADE` — the message outlives the messenger. New ending kind:
   resolves-into-shape + reveal, not disappearance. Timings ≈ lap 7s →
   ring 3.5s → glow+num ~4.5s. Departure draws blanks as *filled* — a
   celebrating snake is whole (revisit if the lab needs sockets).
   Parked refinement: the snake could trace the table's *numeral*
   shape with its body (a "7" for ×7) — Roger's idea, basics first.
   Pending A/B: numeral **grow-and-dissolve** — swells past the ring
   while losing alpha (the idea outgrows the exercise) vs the current
   stand-then-dim. The numeral was never bound to fit the ring;
   early "must fit interior" constraint was an oversight.
2. **hole** — a sandy burrow appears; the snake goes down it. *Built,
   two characters*: `spin` (stately whirlpool descent, the default)
   and `dive` (`?depart=dive`, the whoosh through a broken window).
   Pending audition (Roger, late-evening idea): **spin-dryer numeral**
   — the multiplicand pops back out of the hole still spinning,
   decelerating to rest (the whirlpool's angular momentum handed to
   the digit like a baton). Comic register vs the lap's solemn
   hallmark — variety at the *mood* level, not just the shape level.
3. **drift** — floats off into the distance, shrinking. *Not built.*
4. **sweep** — edge to edge, descending a row each turn (boustrophedon;
   could pause on multiple cells — reinforcement by movement). *Not built.*
5. **whirlpool** — orbit the hole, radius decaying, shrinking to
   nothing. *Built — this is the `spin` exit.*

**Mechanism (proven):** the trail model — the head writes breadcrumbs,
the body reads back twelve segments behind (conga is the canonical
slither; corner-cutting retired). Departure = phrase scripts in
`DEPART_SCRIPTS` (cruise / turn / seek / spin / dive); the pose rail
seeds the trail so rest and motion are one continuum. Phrases =
(kind, speed, turn, extent); joints are free because heading persists.
Grammar rules agreed: pick the resolution first, generate backward;
bounded randomness (vetted shapes, randomised parameters — a farm of
surprises we've fenced); the composer comes last, plus a lab "audition"
mode to watch departures en masse.

**What makes it read as intent:** forward-cone hole placement
(`coneHole`, ±100° of facing — else the seek is a hairpin U-turn);
tangential rim entry via a ghost point (else the snake baulks like a
refusing horse-jumper); wriggle dies under the hole's pull (else a
stale-axis wobble breathes the ring radius); the ring keeps *winding*
while the sink front drains it (else Tom-and-Jerry: freeze, drop);
shrink rides spin progress through the turns; eased depth front —
a slide, not a gulp. Edge fallback: no room for a hole ahead → the
snake exits the way it faces (`rayToBoard`/`pendingHole` decide before
the first phrase runs).

**Diagnostics (all `?` params):** `metrics=1` (flight recorder +
phase-boundary digest in caption/tab), `seed=N` (deterministic RNG),
`hole=x,y` (pinned hole), `board=WxH` (pinned board for cross-machine
runs), `pose=`, `life=0`, `departAt=`, `beatAt=`. Headless stills via
Chrome `--headless` + `/tmp` PNGs; `imageio-ffmpeg` binary exists for
tiling Roger's screen recordings at N fps — recordings were the
decisive diagnostic tool, keep asking for them.

**macOS rendering question — bounded, unresolved.** A day's
fault-finding (2026-10-18) produced *real* defects found via Roger's
recordings: the pulsating ring (stale-heading wobble), spoke/backward
slide (position-collapse applied to approach-trail members, not just
the ring), full-size flash at the spin→sink joint, freeze-then-drop.
All fixed. Residual: identical digests on Windows and Mac prove the
simulation computes the same trajectory — the remaining Mac/iOS visual
difference lives in presentation/compositing, not our math. **Decision
(Roger, 2026-10-18): parked, revisit declined** — "the mac can't do it
at present"; the lap (a different animation on the same engine) shows
the same shortfall, consistent with platform-level presentation.
Options if it ever matters: substitute a simpler exit on macOS, or
shelve the whirlpool there. No further probing.

**Design principle that emerged (2026-10-18):** the numeral gets a
*personality per exit* — but the Liberace test applies: a flourish
must inherit meaning from the motion that birthed it (spin-dryer
works because the hole just whirled; the same trick off the edge
exit would be candelabra-on-piano). The user's delight is the
criterion; coherence is our job.

**Circles & holes — the emergence landscape (mulling 2026-10-19;
design talk, deliberately not code yet).** Roger's Pink Panther
pointer: the DePatie–Freleng credits — one character, endless
business — and specifically the *pocket-hole* gag (a rolled-up hole
thrown down and climbed into): circles as **objects the character
handles**, not just destinations. Character spec settled:
fun-loving, a little mischievous, clever, shares and uncovers —
makes its own luck (external-agency exits like "the lift" grate;
the snake is agent, never passenger).

Circle taxonomy: **hole** = two-way portal (drain AND dispenser —
the snake descends, then the hole can serve; implied gag: the
snake is down there operating the machine); **whirlpool** = hole
wearing motion; **sun** = the halo already is one (a numeral-circle
rising over the board edge = the dawn of ×N); **hoop** = rolls,
wobbles, collapses flat — the settle is an *event*, nobody knows
when it'll drop; **ball** = playground physics. STRUCK: **coin** —
currency metaphor = fake-reward economy in miniature; the object
is a numeral-disc whose value is what it *is*, not what it buys.

Emergence grammar: what goes in shapes what comes out; colour
survives the transit. Candidate uses — each fun-with-a-job:
- *hole serves the table*: 12 numeral-discs emitted (tennis-ball
  server; bounce-roll-settle) self-ordering into a row = recap
  made physical; or scattered unordered = the next challenge
  dealt wordlessly;
- *whack-a-mole*: holes as a network — down the whirlpool, out
  elsewhere; peek-out/duck-back tease before the real emergence;
- *colour anticipation*: hole rims / emitted discs tinted by the
  next table's colour (shared convention, so free); odd/even,
  prime/factor marks — a consistent, never-explained code =
  incidental learning. Rule: consistency, not explanation;
- Snake Puzzle spawn pieces *dealt from a hole*, not popped —
  unifies existing machinery rather than adding a trick.
Business layer (cheap, high-yield; we own gaze already): look-back
at the viewer, tail-wave, double-take at the hole, head-count
along the body, numeral lands tilted → snake nudges it upright.
Unbuilt exit candidates beyond the five: coil-up-and-sleep
(slinkie: a coil that travels end-over-end), ghost (fades to board
colour), off-like-a-shot, fourth-wall (keeps going across the
page), line-up (becomes its own multiples row), the knot.
Rejected: the lift (external agency).

**Constraints sharpened (mull continued, 2026-10-19):**
- **Objects have physics; only the snake has agency.** Discs may
  roll, wobble, flop — never hop, bow, struggle, breathe, or wear
  expressions. Numbers are placeholders for ideas; the snake is
  the only animated agent and it *manages* them. Test: does it
  move like a thing or like a being?
- **Conduit vocabulary** for the portal machinery: pipes (make the
  hole-network legible — see the route), rabbit holes (depth),
  volcanos (emergence with force), earthworms, slinkie springs.
  Keep the value of the notion without going lifelike/cartoony.
- **Three modes of number — the scaffold must respect them**
  (a 6-yr-old doesn't mode-switch for free):
  *sequence* (Tilt/Puzzle/Search — adjacency is the meaning;
  landing grammar: discs order themselves into the row);
  *pattern* (hundred square — position is the meaning, no snake;
  landing grammar: discs take their places on cells — MY
  SPECULATION, unproven, cells are positions not collectibles —
  may confuse; needs a lab audition before it constrains design);
  *construction* (building blocks — grouping is the meaning;
  landing grammar: discs assemble/stack).
  Shape: ONE token (numeral-disc) + ONE machine (transit — depart
  and emerge are the same mechanism in opposite directions) +
  THREE mode-appropriate arrival grammars. Consistent feel from
  shared machinery; honest variety from mode.
- Open question: Patterns has no snake — who manages the
  placeholders there? Portal unescorted, or its own register?
- **Patterns reframe (Roger, 2026-10-19):** the hundred square as
  a *lattice to add to*, not a completed object to colour in —
  "almost Connect 4 building rather than marking". Discs become
  placed pieces: hold 21, set it at address 21 — placement teaches
  position=magnitude. Caveat: it INVERTS the task's cognition —
  today runs property→position (find the multiples); discs run
  name→position (here is 21, where does it live). Probably
  strongest as a PAIR — discover the pattern, then build it from
  dealt discs as consolidation — not a replacement. Connect 4's
  value is the tactile deliberate placement into sockets (which
  can refuse wrong drops), not literal gravity. Bonus: the served
  discs from the hole are the same objects the child places —
  transit machinery feeding a build task.
- Reservoir note (Roger): ideation and consolidation are separate
  phases — "make hay while the sun shines"; ideas bank here
  unprocessed, get processed against a drought. Capture beats
  curation during a mull.
- **The street (Roger, 2026-10-19):** balls earned in one activity
  roll down a road to a lattice (the current `lattice.html`
  build); other vacant lattice-frames of different widths/heights
  line the street — area and commutation made spatial. The
  **fit-test** is the pedagogy: a 12-ball set seats into 3×4 or
  6×2, is REFUSED by 5×3 (three homeless) or 4×4 (four unseated)
  — divisibility discovered by trying doors; refusal made spatial.
  Gift: every table family is exactly 12 members, and 12 factors
  richly — every earned set tiles several frames, so commutation
  is shown by the same objects succeeding twice. The street is
  also the cumulative axis given geography: a museum of earned
  sets. Cautions: cross-activity persistence is real plumbing —
  prove the fit in the lab first; unresolved whether discs keep
  their numerals in-frame (members-in-order) or shed them
  (pure units) — different lessons.
  Colour jobs (Roger): identity survives transit (the set stays
  table-coloured on road/frame/street — mixed collections stay
  sortable by hue); anticipation (tinted gate/rim announces the
  next arrival); diagnosis (refusal colour can say WHAT refused —
  wrong count vs wrong place).
  **Menus-as-teleport (Roger):** the street is the child's
  navigation — a world walked, not a menu read; adult/teacher
  menus are fast-travel to the SAME locations (nav.js → a map
  overlay; index tiles → the street's directory). Plumbing caveat:
  a walked world needs the street to exist somewhere — hub scene
  or persistent layer; prove fit-test mechanics in the lab first.
  **Subways (Roger):** the hole-network given addresses — holes
  become stations, tunnels the transit (pneumatic-tube physics for
  discs). Lines colour-coded by TABLE — the purple line runs to
  the threes' neighbourhood: map-reading as incidental learning.
  Subway = the child's diegetic fast-travel; menus = the adult's
  extradiegetic one; same destinations. Caution: stations/signs
  must stay sparse — theme-park clutter is the cloying failure.
- **The Connect-4 principle (Roger, 2026-10-19):** mechanics
  should make the number MATTER — blocking a run of three makes
  "3 is a limit" learned-by-need, never taught. Test for every
  reservoir idea: does the mechanic *require* the fact or merely
  display it? Rhymes with "refusal is information" — the block IS
  a refusal, and the denial teaches. Analogues banked: primes as
  numbers that won't tile a rectangle (composite 12 obliges,
  prime 7 refuses — the friction IS the lesson); lattice row-wrap
  as the felt decade limit; spacing-as-rhythm (placing every Nth
  socket = the interval felt in the skipping); N−1-of-N as the
  tension point (the beat's 11-of-12 already exploits it).
- Doctor's caution (recorded against myself): the vocabulary is
  outrunning proof — 4 built exits vs a dozen candidates. Design
  the scaffold around proven machinery, not the imagined menu;
  one emergence prototype (hole serves the table) before anim.js
  takes shape — ornament-before-semantics is the Swift lesson.

**Architecture note (Roger, 2026-10-19):** this is scaffolding to
hang the pages on and link them — minor mods to existing
activities wired into shared disappear/emerge machinery, handled
well and consistently; NOT taste-a-bit-there-a-bit. The shared
include (`anim.js`) is the intended home; design the structure
before the tricks.

**Next in this thread:** design the scaffolding (shared
disappear/emerge machinery → anim.js shape) before more code;
numeral variants to audition (grow-and-dissolve A/B on the lap;
spin-dryer emergence on the whirlpool); remaining exits (drift,
sweep + the new candidates above); the audition mode; then the
bounded composer. Hole pop-in could linger (fade-out) at polish
time. All tunables at the top of the file.

## anim.js exists (2026-10-20) — first port: Snake Puzzle

The shared engine now lives in `anim.js` (`window.Anim`, nav.js
style — bump `?v=` on change). `Anim.begin({ctx, W, H, board, segD,
table, segs, kind, onFade, onDone})` hands the engine the assembled
snake; `Anim.frame(now)` drives it until `Anim.state === 'gone'`.
Callbacks: `onFade` fires when the numeral's terminal dim begins —
the agreed moment for an end-card to fade up *over* it; `onDone` at
all-gone. Exits are a registry (`SCRIPTS`) — `kind: 'random'` draws
from `EXITS` so variety slots in free. `calm` on a phrase suppresses
the wriggle (that's all `tour` is — lap minus wiggle; Roger's simple
celebration, iPad-approved 2026-10-20).

**macOS omits motion** — settled decision (parked investigation
2026-10-18). `IS_MAC = platform==='MacIntel' && maxTouchPoints<=1`
— iPadOS also reports MacIntel; touch is the discriminator. With
motion off every exit maps to `still`: beat, body fades in place
(`STILL_FADE`), halo+numeral fade up at centre — same tableau as the
lap's end minus the journey. The conditional lives in `startDepart`
so every future exit inherits it. `?motion=0|1` auditions either
path anywhere. Parked: `LAP_SPEED` tunable is defined but never
wired into a phrase — dead knob, deliberate.

Snake Puzzle flow now: last drop → `finish()` → beat → departure →
`doneOverlay` fades up during numeral dim ("Another?" Yes→fresh deal
with chips live / No→index). Lab params: `?t=` `?done` `?pose=` `?dbg`
(page), `?depart=` `?departAt=` `?motion=` `?seed=` `?animdbg`
(engine). Static-target games keep the snake posed during play; the
trail seeds from the pose at handover — rest and motion one
continuum, proven.

**Trail-ready poses (Roger's insight, 2026-10-20):** "a single
arrangement ready for the off" — the dealt pose itself must satisfy
the trail invariant, or sampling at fixed spacing lands segments
somewhere else = visible rearrangement at handover (observed live;
a settle-blend masked it but the cure is structural). `Anim.pose`
now deals them: the lab's heading-walk grammar (steps of exactly
`SPACING_K·segD`, so the body is always continuous — no beads-on-a-
string) with one change from the lab — walks that don't fit are
*rejected*, never fit-scaled (scaling bent the step length). Two
margin tiers keep variety on phones; `serpentine` (compact ~4×3
spacing fold) is the guaranteed-fit fallback. Verified lossless:
dealt positions ≡ departure-sampled positions, so the settle blend
is now a no-op kept only for foreign handovers (e.g. a live trail
from tilt-snake). This is what "lift any arrangement and continue"
means mechanically — the trail doesn't care how it got there, it
only needs the spacing to be honest.

**The `wind` exit — now the Snake Puzzle default (2026-10-21).**
Roger's proposal, verbatim: "the screen tour continues but simply
stops at the point where the tour circuit has become small enough
that the head meets the tail". Motivation: the `ring` phrase renders
incoherently on iPhone 6/8-era WebKit (tour circuit fine, corruption
starts exactly at the circular steering — bisected with `?depart=`
variants). `wind` = 3 `laptrack` circuits (`laps`/`speed` are phrase
tunables) → `shrinktrack`: the same carrot-on-track steering, but
the *track* contracts (`SHRINK_RATE` px/s) until its perimeter ≈
one body-length (`SHRINK_TO`); the head keeps circling until the
trail fills the loop — head meets tail with no ring machinery.
Detail that matters: `lapGeom` refuses rects under 3·segD sides,
so on near-square boards the rect floors at P≈12·segD > bodyLen —
the body could only ever lie as an arc (observed by Roger, first
device test). Fix: at the floor the phrase inscribes a *circle* in
the last rect and keeps contracting that until the body closes.
Head ends tucked slightly inside the loop — reads as settling.
End-card also gained: `pose NNNNNN` seed line + **share pose**
(native share sheet / clipboard — carries `?t=N&poseSeed=M`, which
reproduces the dealt shape exactly; pinning survives "Another") and
a **↺** button cycling exits in place for audition without URL
editing. **Build tag**: a dim `#buildTag` numeral sits beside the
nav snake — currently `7` — bump it when a change needs device
confirmation, since mobile URL/cache ambiguity cost us a round of
"is this the new build?". macOS still takes the `still` path;
`?motion=1` auditions wind on the Mac — worth a look before
deciding whether desktop inherits it.

**2026-10-21, evening — convergence.** Roger's original spec landed
verbatim: ONE perimeter tour (`wind` laps:1 — his "three circuits"
meant three *of the closed loop*, see `WIND_TURNS`), the track
contracts only while the head rides it (the arch/diving-head
posture was the track outrunning the snake), and the loop ends head-
meets-tail (`SHRINK_TO` 1.0 — 1.05 left a gap just over the meet
threshold, so the failsafe always fired). The track is a centred
square (`lapGeom` caps at `min(bW,bH)` — wide windows no longer tour
the far edges). iPad Air + iPhone 8 confirmed clean; Mac verified in
stills. IS_MAC restriction lifted — `still` remains an exit in the
registry + `?motion=0` fallback. Cleanup pass: end-card stripped to
Yes/No/share-pose (↺ audition button and its cycle removed);
URL params stay dormant in code (invisible, lab convention, needed
for baked stills during the remaining ports). `#buildTag` retires
before the public push. **Tilt fix:** tap-autopilot was cancelled by
*any* hand-held lean — gravity's x/y components are ~9.8 at normal
angles vs MANUAL_TILT 1.5, so tap only worked flat-on-table
("excellent when it works"). Now `tiltBase` snapshots the lean at
tap time; only a *change* > MANUAL_TILT overrides the steer.

**Snake Puzzle UI pass (Roger, 2026-10-21):** `share pose` and the
seed line removed — they existed to capture seeds for the knotty-pose
hunt; that job is done (`?poseSeed=` param stays dormant for
diagnostics). "Another snake? Yes" no longer redeals — it returns to
a `choose` state: empty board, chips live, "pick a table", and no
snake until a choice is made (chips handle `state==='choose'`).
Restless wriggle restored: after `IDLE_WRIG_S` (10s) of stillness the
pose does a travelling sway — bursts of `WRIG_SECS` every
`WRIG_CYCLE`, amplitude `WRIG_AMP` — **draw-time only**, so drop
targets never move (the earlier version was lost in the static-pose
work; this is its return on the new invariant).

**2026-10-23 — Tilt Snake completion + the real root cause of the
"rigid hinge / resists curves" defect.**
- `tilt-snake.html` now orders captured multiples `×1…×12` head-to-tail
  (`segs.push` behind the current tail tip instead of `unshift` behind
  the head) and hands the completed snake to `Anim.begin(..., kind:
  'wind')` with the same `Another snake? Yes / No` fade-up card as
  Snake Puzzle.
- **Root cause of the "resists curves / single hinge" defect found via
  Roger's iPad Air Tilt Snake recording (`pushHead` in `anim.js` and
  `pose-lab.html`):**
  `pushHead(p)` tested `hypot(p - l) >= CRUMB_STEP` (3 px) against
  `l = trail[trail.length - 1]`, and when `< 3` it overwrote `l` in
  place (`l.x = p.x; l.y = p.y`). Because `l` was moved to `p` on every
  sub-3px frame, `hypot(p - l)` on the next frame measured only a
  *single frame's step* (`v * dt`), never the cumulative distance from
  the last dropped breadcrumb! Whenever `v * dt < 3` — which happened
  as soon as `wind` slowed from `laptrack` (`speed: 1.6`, 3.07 px/frame)
  to `shrinktrack` (`speed: 1.2`, 2.30 px/frame in Tilt Snake's
  `segD=36` design-px), and previously in `ring` (`speed: 1.0`) on
  iPhone 8 and 120Hz Macs — `trail.push` stopped firing altogether. The
  tail froze on the old breadcrumbs while `trail[trail.length - 1]`
  dragged a single straight line segment from `trail[trail.length - 2]`
  (the single hinge!) to the orbiting head. Fixed by measuring distance
  from `trail[trail.length - 2]` while keeping `trail[trail.length - 1]`
  as the live head tip, plus clamping the circle carrot lookahead to
  `1.2 * r` so `head` meets `tail` cleanly.
- **Honeycomb Search (`honeycomb.html`) completion:**
  1. Each completed 12-cell path ripples from `×1` to `×12` as soon as
     its 12th cell is tapped.
  2. Once all selected tables have completed and rippled, all unclaimed
     lattice cells fade out over `LATTICE_FADE` (0.8s).
  3. One table at a time (`startCoil(ti)`), each path sprouts a head at
     its `×1` end and uses the shared `anim.js` engine (`kind: 'coil'`,
     which skips the outer perimeter tour and steers directly into
     `shrinktrack` + 3 circuits + halo + numeral around its assigned
     non-overlapping spot: centre for 1 table, pair for 2, triangle for 3).
  4. `anim.js` gained `hold: true`, `clear: false`, `Anim.snapshot()`,
     and `Anim.drawCoil(snap, now)` so completed coils remain visible
     together (with blinking eyes, halo, and table numeral) while later
     tables coil and after all finish. Also fixed a `ph.dir === -1`
     double-sign flip in `shrinktrack`'s `ptOf` lookahead.
  5. At conclusion, a compact bottom bar (`#doneBar`: `Search again?
     Yes / No`) fades in where the chips sit so the coils remain
     completely uncovered.
- **Unified held-coil ending & accelerated 3-circuit spin across Snake
  Puzzle, Tilt Snake, and Honeycomb Search (`anim.js?v=11`):**
  - Snake Puzzle and Tilt Snake now also pass `hold: true` to `Anim.begin`
    and use the bottom `#doneBar` (`Another snake? Yes / No`), keeping
    the coiled snake, halo, and table numeral on screen until the user
    responds.
  - On the closed loop (`ph.t.P <= bodyLen * SHRINK_TO`), rotation pace
    follows a smooth bell curve `pace = 1 - 0.25*u + WIND_ACCEL * sin(π*u)`
    (`WIND_ACCEL = 2.18`), accelerating into the middle of the three
    circuits and easing down to rest (`0.75×`) so all three rotations
    complete in the time of 1.5 standard rotations while preserving the
    exact circular curvature.
- **Honeycomb Search crossover variety (`genBoard` in `honeycomb.html`):**
  - Multi-table deals now vary naturally across deals (<1 ms per board):
    - **2 tables** with ≥2 common multiples: ~45% of deals cross twice
      (`pathThroughTwo` routing through two shared multiples `X1, X2`),
      ~55% cross once.
    - **3 tables**: mixes **chained 2-way meetings** (middle snake meets
      the other two at two separate cells `X1 !== X2`), **double 2-way
      meetings** on a pair, **single 2-way meeting** + third path free,
      and **single 3-way meeting** (~15–20% when `lcm(A,B,C) ≤ 12×min`).
  - Also fixed a latent defect in `genPathAnywhere(foreign)` where the
    random `start` cell wasn't checked against `foreign`, which could
    occasionally drop a free path's `×1` cell onto an existing path.
- **Patterns & Lattice mull (2026-10-23):**
  - Snakes teach *sequence/chain*; the hundred square (`Patterns` and
    `Lattice`) teaches *decade geometry and intersections* within 1–100.
  - Known defects in `patterns.html` to fix when we touch it:
    `DEBUG_GRID = true` is still on, and `found.size === 12` makes
    `×9..×12` uncompletable on the 100-square (needs `Math.min(12,
    Math.floor(100 / t))` like `lattice.html`).
  - Bridge candidates between snake and grid under consideration:
    1. Unused grid numbers fade, leaving the table's geometric pattern;
       after a hold, the pattern either morphs into a snake or leaves
       ghost imprints behind.
    2. A snake threads through the grid positions in order (`×1 → ×2…`),
       lighting/plumping each sphere in place as it passes and gliding
       off so the completed geometric pattern stays standing on the
       square above the bottom `Yes / No` bar (or at deal time in
       Lattice, the snake slithers across the ground strip dropping the
       loose discs).
  - **Built experimental `pattern-snake.html` (on main menu + `nav.js`):**
    0. **Opening attract state (`choose`) + top-left table numeral:**
       Starts on the `10 × 10` grid with the `×2…×12` buttons live at the
       bottom. Until the user taps a table, a random table button glows in
       its coded colour (`tableColour(demoTable)`), its pattern fades up on
       the grid (`1×..12×` solid, `>12×` at 50%), and its table numeral
       appears in the top-left corner at completion-animation scale for
       `DEMO_HOLD_S = 2.0s` before cycling to another random table. Tapping
       any table button interrupts immediately; the chosen table's numeral
       remains in the top-left corner for the duration of the round.
    1. **Stage 1a (`run`, top-down `1×t → 100` → `waitCollect`):** The
       12-segment snake enters at the top-left (`1`), visits `1×t .. 12×t`
       first — leaving a 100%-solid square and shedding one body segment
       per multiple until at `12×t` only the light round head remains —
       then zips down the remaining multiples (`> 12×t` up to `100`),
       leaving 50%-opaque (`PALE_ALPHA = 0.48`) continuation squares. At
       the bottom, the lone head steps just below the grid (`waitCollect`),
       the numbers fade up over all coloured squares (`PRE_NUM_FADE_S =
       0.8s`), and the top-left table numeral pulses an intermittent halo
       ring (`NUM_HALO_CYCLE_S = 2.2s`). Tapping the top-left numeral
       initiates the collection.
    2. **Stage 1b (`collect` → `parkTop`):** Once the top-left numeral is
       tapped, the preview numbers fade out and the lone head wanders back
       up through the `1×t .. 12×t` solid squares in a randomised order
       (`buildCollectOrder`). Each square it visits softens to a faint
       pattern trace (`FAINT_SOLID = 0.28`) while the snake grows back by
       one segment (`0 → 12`). Finishing near the top-right of the grid,
       the reassembled snake slithers directly into its S-wave resting
       strip **above** the 100-square (`parkTop`), and the multiples fade
       up on its segments.
    3. **Stage 2 (`play`, drag down from above the 100-square):**
       **Synchronous pair-glow hint:** `1.5s` after parking (`HINT_FIRST_S`,
       picking the 3rd segment, e.g. `9`, first — and after any `6.5s`
       idle pause `HINT_IDLE_S`), a segment on the snake above and its
       corresponding square on the grid below pulse in lockstep
       (`HINT_DUR_S = 3.2s`) while the snake's eyes glance toward that
       square. Dragging down from above the square makes the top-row
       multiples a short, easy reach. Each valid drop lights the square
       solid with its white numeral and shortens the snake by one segment;
       any other drop returns silently and uncritically to its slot.
    4. **Conclusion (`endFloat` → `reveal` → `done`):** When the last
       segment is placed, the lone head above the grid floats playfully
       upward with a blink, the `>12×` multiples fade up over their
       coloured squares (`SEQ_FADE_S`), followed 1s later by a slow
       fade-in of the remaining unpatterned grid numbers (`REST_FADE_S`),
       holding with `Another pattern? Yes / No` at the bottom.

**ACTION POINT (Roger, 2026-10-21):** table choice is currently free;
an enhancement should *guide* users to appropriate tables for their
skill — track miss/refusal and completion-time stats per device and
suggest or stage tables accordingly. Design deferred; the stats
(misses, doneMs) already exist in-page per round — persistence and
the guidance policy are the open parts.

## Priorities (Roger, 2026-10-17; updated 2026-10-19)

**Bread-and-butter first (2026-10-19):** complete the EXISTING
activities with celebrations and ship them for testing/consumer
reaction — before building more. The street/towers/colour-coded
connective tissue is shelf-stock: exciting, banked, deliberately
deferred. Roger is writing the online-pages introduction himself;
then polish/paint what exists.

- **Animation is the main priority** — the departure work above.
- Patterns: second (and third) table support; the guidance vocabulary
  for extra tables should be consistent between Search and Patterns
  (Search already has crossover cells, split-colour claims, kin glow).
- Explanatory videos / small-screen help text: maybe later; the
  activities should stay self-explanatory.
- Adaptive behaviour: keeps until there is an audience.
- Roger's index intro ends mid-sentence ("choose Rationale from the") —
  his text to finish, detail not urgency.

## Open threads

- Celebration/departure is now the design direction (see grammar above);
  the caution that survives: keep it honest (fires only on true
  completion) and single-engined.
- Honeycomb three-table readability on small screens is under test.
- Service worker / offline: discussed, deferred.
- The loupe idea (magnify cells under touch) noted for later — niche
  (small phones), deliberately easy to add when wanted.
- VoiceOver: deferred to "polishing", maybe never — the activities are
  inherently visual-spatial (Roger, 2026-10-17). If ever done, the route
  is a visually-hidden live-region mirroring game state, not canvas
  changes.

## Workflow

- **Keep "current thread" sections live**: update them at natural
  breakpoints mid-session — intent, open questions, what turned out
  real — not only at session end. The handover must not depend on the
  auto-summary, which keeps facts and loses plot.
- Verify statically: `node --check` on extracted `<script>` blocks; for
  logic, a small DOM-stubbed node harness has proven worth it.
- Commit+push only when Roger asks; he may have uncommitted prose edits —
  always `git status`/`git diff` first and carry his changes along.
- Commits as `rogereve` with the Devin trailer; push to `main`.
