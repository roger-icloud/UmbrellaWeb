# Session notes — 2026-10-31 (local session, Mint PC)

Roger's first sessions on the Linux Mint PC; UmbrellaWeb checked out and
serving locally (preview `http://localhost:8000`, also on LAN at
`192.168.0.99:8000`). Mac backed up via GitHub — nothing pending there.
Devin context: a cloud session's history can be replayed in Desktop on
any machine (Local Hands approval cards); this session is local.

## Tilt Ball — first real-play feedback (Roger, published version)

- **Overlong and repetitive** overall — but the rack launch landed:
  "balls are shot from the rack", a noticeably different motion. Keep.
- **The 2 hole is over-used on each new hole addition** — the concrete
  defect to sort.

### Root cause (structural, not deal-balancing)

4, 6, 8, 10 are *dominated* holes: every multiple they serve is even,
so no dealt value can ever require them while the 2 hole is open. The
rack's coverage weighting only decides which hole a ball was dealt
for; at the table "even → 2" stays true forever, and any-fit-accepts
means it always works. Deal values can't fix it — only rules or
availability can. The deepest-fit twinkle is currently the only steer
and nothing depends on it.

### Levers on the table (discussion, nothing built)

- **Geography (Roger's own, the keeper candidate)**: put the easy
  dominators at the back so the newer/"harder" holes are the easy
  reach. Inverts the convention — scoring games put difficulty far and
  reward the long shot; here near = *this round's lesson*, far =
  already proven. The table's geography mirrors the curriculum, not
  the difficulty. Consequence noted: some values still need the 2
  (22, 26, 34…), so the long shot stays practiced, just isn't the
  lazy default. Caveat raised: tap-to-send doesn't care about
  distance — steers tilters/draggers, not tappers.
- **Depth advances**: stage only advances on deepest-fit sinks —
  the twinkle becomes the goal; 2 stays an honest fallback.
- **Resting holes**: an early hole occasionally sleeps for a round;
  closed ≠ refusing.
- **Assigned balls**: dealt balls wear their intended home; honest
  but changes the game's soul from "which fits?" to matching.
- **Shorten**: smaller rack / faster stages — treats "overlong"
  only.

### Tap-to-send — proposed removal from tilt-ball (Roger)

"This game can discard a tap to define destination." Under the
geography lever, distance must cost something — tap makes it free.
Consequences kicked around:

- *For*: the spatial lever becomes real for everyone; tilt-ball keeps
  one pure verb (steering) — a body game like tilt-snake.
- *Against*: tap was the mercy for "I know it, don't make me steer all
  ten" — removing it worsens overlong *unless* the rack shrinks.
  Accessibility floor gone, though drag-steering still reaches
  everything.
- Rack-tap stays (choosing the next ball is selection, not autopilot).
- **Roger's rebuttal, banked**: when adaptivity arrives, demonstrated
  knowledge reduces the frequency of easy balls — the mercy lives in
  the deal, not the verb. Repetition is good for committing to
  memory; once acquired and demonstrated it loses value and may
  actively disincline — the user wants challenge or reassurance, not
  tedium. (This is a general adaptivity principle for the family,
  not just tilt-ball.)

## New activity embryo — tap-as-declaration (untitled, discussion)

Emerging from the tap conversation: the tap doesn't die, it migrates
to a game where it IS the game — a **declaration**. Numbers scattered
on a table; the child taps them in table order (3, 6, 9, 12…), then
releases the ball, which visits the taps in sequence and collects
each — "sit back and watch your recital performed". Roger's aim:
encouraging but not specifying foresight, and rapid recollection of
sequence — "a bit like reciting a table".

A third collection verb for the family:

- snake **gathers** — order enforced by what you catch
- search **finds** — any order; the path tests adjacency
- this **declares** — the child supplies the order; the ball tests it

Design points argued and banked:

- **Refusal at execution, not at the tap.** If the tap itself rejects
  wrong numbers it's just another find-the-multiples. Let the ball
  roll to a mis-called link and shake it off *there* — the recital
  broke at link four, re-declare and continue. Prediction tested by
  performance, like a wrong note in a recited table.
- **The speed dial comes free**: release early and *conduct* (declare
  the whole table, watch it play out) or release and *lead* — stay
  one step ahead of a ball already rolling. Difficulty = the player's
  own tempo; pressure self-inflicted, no timer.
- Resonance: the collected row could stand as a multiples row —
  links the "line-up" exit idea and the completion grammar (the
  built entity departs).
- Roger's call: a separate exercise — not part of tilt-ball, probably
  not tilt-snake either. Not potting… though see device, below.

### Embryo, continued (evening)

- **Timing — dissolve the dilemma**: the collector chases whatever
  stops are declared, at the child's pace — conduct (declare all,
  watch) and lead (stay one ahead) coexist; tempo IS the difficulty.
  But so the slow planner still gets "sit back and watch it all":
  **the snake waits, watching, until released** — tap the snake to
  start the performance. Queue stays open mid-run. Gaze invites the
  tap; one taught gesture, no timer.
- **Collection device — the snake after all.** Not just for
  consistency: collected stops join as segments — the recital builds
  the table-snake, and the departure grammar already knows the
  ending. Grammar note: "only the snake has agency" survives — the
  agency is the child's, performed *through* the snake. The one
  activity where the snake is meant to be the player's instrument.
- **Reverse-order collection (Roger) — "sideways deepening."**
  Descending a table is un-multiplication: what-comes-before,
  subtraction stepping, foreshadows division; proves the table is a
  structure walked both ways, not a one-way chant. Proposed
  interface: **the first tap declares direction** — smallest =
  forward recital, largest = descent. Cousins banked: start
  mid-table, every-other — same device, different recitals.

## Recital — first draft built (uncommitted prototype)

`recital.html` — working title; unlinked, pose-lab style, preview at
`/recital.html` (chips skipped with `?t=N`, auto-release off with
`?go=0`). Defaults taken, all tunables at the top for Roger:

- Pure-tap game — no tilt, no permission dialog. The snake only
  moves to *perform*; while declaring it drifts gently and watches
  (eyes face the last tap).
- 12 multiples scattered as stops; `DECOYS = 0` keeps the first test
  pure ordering — dial up for membership discrimination.
- Tap declares (order badge + dashed ROUTE_LINE through the queue —
  the plan made visible); tap again un-declares; queue open mid-run;
  tap the snake to release or hold.
- Direction from first stop; `ENDS_ONLY` — a mid-table opening is
  shaken off with both ends glinting (refusal carries its hint).
- Refusal at execution only: amber flash + head-shake AT the broken
  link; `TRIM_ON_REFUSE` clears the queue from there — re-declare
  from the break.
- `WAIT_GO_SECS = 9` auto-release so tap-me is a flourish, not a gate.
- Completion: the beat re-plays the child's own recital (collection
  order, so a descent lights as a descent), then the done bar. Full
  departure stays in pose-lab's charge.
- `CAPTION` one-liner for first-deal legibility — blank it to test
  pure discovery.

Verified headless (firefox --screenshot): menu chips, dealt board,
waiting head all render. Roger tested on desktop and iPad
(`http://192.168.0.99:8000/recital.html`, server `--bind 0.0.0.0`) —
likes the refusal-at-execution, the delayed auto-release, and the
idle bob. Complaint: after a pause/refusal the next wanted stop is
hard to find (collected numerals buried in the body).

### Posed boards + gaze fix (2026-11-03, built same day)

Roger's shapes idea — stops laid on a route the snake can perform
without self-crossing: **POSE** tunable, `?pose=` to audition:
`spiral` (in/out, winding, handedness random), `zigzag`
(boustrophedon, rows/orientation random), `wave` (freq/phase/
amplitude/orientation random), `bolt` (lightning diagonal), `sun`
(the honest star — in-out sunburst, never crosses), `s` (the family
glyph), `random` (default — picks per deal), `scatter` (the old
baseline). Each pose emits 12 points in VALUE ORDER, then rotMir
(±POSE_ROT rotation, random mirror) + fitPose + POSE_JITTER —
**a pose is a family, never a fixture** (Roger's constraint: patterns
discoverable, never routine; fixed recurring points would rot into
memorised positions). Design consequence: the shape carries order,
the child supplies values — a new difficulty dial: scatter = recall
+search, posed = shape scaffolds, posed+blanks = inference.
- **BLANKS** (`?blanks=N`): interior stops become dashed ghost
  sockets; their values are dealt LOOSE — the child must weave the
  loose number in at the right point. Socket taps flash amber —
  "nothing here to take". Ends never blank (direction needs them).
- **Gaze fix**: waiting with an empty script, the snake looks at
  expectedStop() (GAZE_NEXT) — dir 0 gazes the nearer end. After
  NEXT_HINT_SECS idle the wanted stop pulses. Solves the "lost my
  place" complaint inside the kin-glow grammar.
- Also: synchronous first paint at parse end (fixes a headless-
  screenshot race AND a blank flash on real loads).
- Verified: harness (cjs) drives deal+frames for all poses;
  screenshots confirm spiral, zigzag, wave, bolt, sun, blanks;
  's' verified by coordinate plot (headless shooter flaky, not code).

### recital2.html (2026-11-03, Roger's feedback — original kept)

Roger tested: params "don't work" (he typed pose=star — silently
scattered) and the structures were too regular ("star is a gear",
zigzag lined-up between parallel lanes). Changes:

- **Params**: `star`→`sun` alias; unknown names fall back to the
  random pool, never silently to scatter; a `pose:` label prints
  bottom-left whenever `?pose=` is in the URL so a param visibly
  took (or visibly didn't).
- **Irregular poses**: gestures not diagrams — sun de-geared (uneven
  rays, uneven angular gaps), zigzag as strokes (uneven row weights,
  uneven lanes — Roger's "longer and shorter strokes"), bolt with
  wild stroke variation, spiral wobbles its reach, wave amplitude
  breathes, s lopsided. Still non-crossing.
- **Celebration circuits**: after the 12th collect the snake runs
  the recited shape again — `LAP_RUNS=2` direction reversals
  (retrace to start, forward again; out-and-back never crosses on
  any pose), brisk speed, no dwell, then the beat → done bar.
- Full loop verified in cjs harness: declare→release→12 collects→
  22 lap vertices→beat→done; descent (dir=-1) passes; star alias OK.
- Known: headless firefox screenshots are flaky this session
  (rAF-vs-capture race); synchronous first paint already added.

## The den + the hundred square (2026-11-04, first build)

Roger's memory-square idea, built in one pass:

- **Snake Patterns off the menu** (tile + nav item; file kept) —
  the square is promoted from activity to shared memory.
- **The den lives in nav.js** — a bottom-left mini-canvas on every
  page: completed snakes collapse there ("collapsed, not coiled —
  a spent Slinky, bobbing, occasional blink", Roger's spec). Roster
  in sessionStorage `nf-den`; when three have gathered the page
  navigates to `square.html`. Games announce via `NF.complete(t)`
  — one line each in tilt-snake, snake-puzzle, honeycomb (per path).
- **square.html** — 10×10 hundred square. The trio marches in,
  deposits in turn: each segment's numeral flies home to its cell.
  Roger's cell language: +20% brightness per deposit, five = full;
  a shared cell splits into wedges (Honeycomb crossover idiom).
  `nf-square` sessionStorage — session-scoped: promise intact;
  persistence is the deferred door (event-ledger design already
  agreed: square is a VIEW of the record, not its home).
- Open questions parked: persistence/QR saves, sibling-profiles,
  "same-table trio vs mixed" (Roger envisaged same colour; mechanism
  accepts both), whether every completion journeys or only the
  third is followed (built: every third — snakes wait visibly).
- nav.js bumped ?v=13 everywhere.
- **Steered deposits** (same day, Roger's addition): drag-steer the
  depositing snake — the numeral drops only when the head passes over
  ITS cell (a second skill: where numbers live on the square).
  Autopilot resumes after AUTO_AFTER_SECS idle — participation
  invited, never gated. Tilt left as an option for later.
- Harness-verified: trio march → per-snake deposits → wedge cells
  (21 = ×7+×3, 12 = ×3+×4) → all leave → idle. Bug caught and
  fixed: deposits now land at fly-arrival, not fly-launch.

## Den journey — the lab pass (2026-11-04, afternoon)

Roger re-scoped the den work into single provable pieces: isolate the
motion before composing it. Built:

- **nav.js den, head-on** (replaces the 3-row heap): head out front on
  a low mound, twelve segments stacked behind — "a spread pack of
  cards drawn into a stack". Alive: sway, wandering pupils, blink,
  and per-segment loose timetables bobbing half out (≤2 at once;
  mostly sideways, some over the shoulder). Den enlarged 190×96 →
  230×120 at DEN_SC 1.35. `?den=5` / `?den=5,3,7` seats the roster
  for audition; `?jig=1` pins two segments out. Synchronous first
  paint added (the recital lesson — headless shots kept missing the
  first rAF). `?v=14` everywhere.
- **den-lab.html** (proving ground, index tile "Den Lab"): one
  completed Snake-Puzzle snake rests ~1.4s, then swims under normal
  trail motion to the bottom-left den spot and — this session's
  second piece — **the body keeps coming until all twelve stand
  behind the stationary head** (gather: each segment's trail read
  distance shrinks to zero, tail last; Roger's "cards gathered"
  spec verbatim). onDone fires at gather-complete.
- **anim.js `den` exit** (`?depart=den` dormant on the real pages):
  one seek phrase at opts.target, no hole drawn, swim fades to calm
  over the last ~2 segD, then gather. Verified headless: pose →
  mid-travel → mid-gather → lone head resting at the corner.
  Roger on the journey alone: "just right".

Roger's appreciation note (same session): the puzzle's ordering,
shaping and drag/drop "all works so smoothly I tend to take it for
granted instead of appreciating a sound achievement."

**Evening — the pile rebuilt as "assigned seats" (working).** Roger
judged the pursuit-chain reel-in a failure ("a tail that remains
extended with some segments displacing slightly") and called for a
simpler approach; he picked option A and left the session
unsupervised. What now runs in anim.js's `den` exit: journey →
trail-gather → each segment hops onto a fixed seat in an overlapping
mound behind the head (PILE_ROWS [3,4,5] centre-out, centres at
0.58·segD so the body overlaps and reads as a heap, tail seats last)
→ restless pile (head bob + scanning twists + blink; seated segments
stir ≤⅓ disc outward on loose timetables, ≤3 at once). The seat hop
is driven by `gather` itself (arc-based, no timers) so departAt
stills verify it — verified: mound renders fully at departAt≥8.
Dead ends recorded so the vocabulary knows them: clock-timed hops
(sim can't see them) and the pursuit chain (no pile, just a queue).
den-lab gained an on-canvas frame-error print; ?animdbg=1 draws
engine state.

**The melt pile (Roger's remembered collapse — third model).** Roger's
verdict on seats: "a bunch of ice cubes part melted and refrozen" —
his memory was momentum: pieces keep pressing forward after the head
stops, overlap, accommodate sideways. Now default (`?pile=melt`):
every segment presses toward the head at gather pace, overlap-resolves
pairwise (MELT_MIN 0.62·segD centres — partial cover allowed) for 4
relax passes/frame — an irregular jam, not a rack. `?pile=seats` keeps
the mound for comparison. Two traps fixed: `const PILE` used `qs`
before its declaration (whole script dead → all-blank pages); seeds
must come from the trail at arrival (`i*sp`), not the gathered sample
(all-at-tip can't separate). denHomeT stamped on the depart clock so
departAt bakes the settle. Verified: organic heap renders at
departAt=6 — jumbled overlapping cluster, head nestled in.
Note for the record: the day taught a lesson worth keeping — mock the
end-state first, describe the picture not the mechanism, keep failed
variants behind params.

Still unbuilt, in likely order: the lap before travel; shrink-to-den-
scale on the way in; the swap from gathered head to the nav.js pile;
the numeral's role in this ending; then port to the three activities.

## Open

- Tilt-ball changes await Roger's decision (geography + tap removal
  vs the other levers; rack length part of the same question).
- Recital prototype defaults await Roger's eye: strict ENDS_ONLY,
  TRIM_ON_REFUSE, WAIT_GO_SECS, CAPTION, descent handling.
- help.html new introduction drafted; Roger to read through.
