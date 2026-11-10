# Session notes — 2026-11-10

## The hint family — carried forward

Two banked members and one new arrival; none built yet. All share the
rule: steering, never forcing — nothing reveals an unambiguous centre.

1. **Area hint** (banked 2026-11-08) — twinkle a region briefly, the
   child still finds the member inside. Comb-native shapes: 7-cell
   flower, 3–4 cell lines, rhombi. Open: which shape, centred vs
   offset, does a line leak direction, idle-timer trigger.
2. **Chip kin-glow** (decided 2026-11-10, see 11-09 notes) — crossable
   partners glow after the first chip pick; friendless stay dim.
3. **Exclusion zone** (Roger, carried from the umbrella tidy) — a
   wandering hover/gesture shades cells amber: the child marks where
   the answer *isn't*, refining their own search. The inversion that
   matters: the game never computes anything, so there is no centre to
   leak. Amber is already the family's "not this" — the vocabulary
   comes free. Reversible by the same gesture — a hasty exclusion
   costs nothing. Open point: the verb — tap is already claim, so
   exclusion needs long-press ("hold to shade") or drag-paint for
   sweeping a region in one stroke; audition both when the lab gets
   its hint layer.

The family reads: the game whispers zones, the child excludes cells,
and the two never meet at a bullseye.

## Wandering lens — first iteration built (search-lab3)

First guess was a pencil (child paints amber exclusions); Roger's
audition corrected it — it's a LENS the game looks through:

- Press-and-wander opens a soft-glow circle riding `HALO_LIFT`
  pitches above the finger (mouse: centred, plus a half-strength
  hover preview — the literal "wandering hover").
- Inside the circle the game reveals: non-members go amber =
  "discounted completely" (numerals dim too); unfound members keep a
  faint cool glint — "still possible", never "this one". Found cells
  are untouched.
- The reveal lives ONLY under the circle — "the app insists on user
  concentrating" (Roger). No trail, no accumulation.
- On release the reveal freezes for `LINGER_S` (1.2s, `?linger=`),
  then fades over 0.7s — the beat that lets the finger become a tap.
- Tap still claims (on release, so a drag can't claim); a tap during
  the linger leaves the reveal up for its remaining window.
- Params: `?wash=0` off, `?halo=N` radius, `?linger=S`.

Verified headless (zoomed stills): non-members amber inside the
ring, members kept clear, linger freeze, clean fade, taps claim.
Open for Roger's eye: is the possible-glint (thin cool ring) enough
on a real board, or is "just not amber" the better register?

### Roger's adaptations (same day, second pass)

- **Possibles invert**: members under the lens ease to black text on
  white over ~0.3s (per-cell reveal timers — a cell blooms as the
  circle arrives, doesn't snap). Replaces the glint; far stronger.
- **Blurred margin**: the ring became a hazy annulus band — a
  boundary the reveal lives inside, not a drawn line.
- **The more-able dial**: wider circle + fainter amber
  (`?halo=2&amber=0.35`) — more cells to hold, softer discounting.
  Difficulty lives in how much the reveal makes you work.
- **Second tap splits**: a crossover cell claims in one colour; a
  second tap on the found cell reveals the wedges — and the
  arpeggio moved to that reveal, so the chord waits for the
  question to be asked.

Roger's observation, banked: landing mid-sequence and working both
ways "makes the task less mechanical and more thoughtful" — the
lens discovers a member anywhere in the word, and the reasoning
runs in both directions from it. Order-forced collection only ever
asks "what's next?"; this asks "what was this, and what follows?"

## iPad → Linux captures (settled, working 2026-11-10)

- iPad USB-cabled to the Linux box, `ifuse ~/ipad` mounts the camera
  roll; recordings/screenshots are `~/ipad/DCIM/100APPLE/IMG_*.MOV|.PNG`.
- Gotcha learned: if `ifuse` says "No device found", usbmuxd missed
  the plug event — `pkexec systemctl restart usbmuxd` WHILE the cable
  is in (GUI password dialog), then `idevicepair pair` once. Pairing
  persists; later plugs should mount directly.
- Zero-install alternative for one-offs: pairdrop.net in both
  browsers (same Wi-Fi).
- First use: IMG_0674.PNG — Roger playing t=6,7,11 on the iPad;
  shared cells (66, 42) single-coloured, splits still unrevealed.

## The broken chain caught in the wild (IMG_0675)

Roger's second capture (t=6,8,11, 2/30): found cells 110 top and
99 bottom — adjacent members of the ×11 word at opposite ends of
the board. The deal had fallen into the scatter fallback: words
that aren't lines. Diagnosis: with 3 crowded ten-member words,
placeRun often finds no legal straight run, and the old code then
silently scattered. Fixes landed same session:

- **No silent scatter**: deal() now rerolls whole deals — 60
  attempts with crossing ambition, 120 parallel (still honest
  lines). A partial scatter (some words lines, some strewn) was
  the worst outcome and is gone.
- **Declared feasibility**: MEMBERS clamps to 2·SIDE−1 (impossible
  geometry refused up front, visible in the params line).
- **Chips 2–10** (Roger: "don't get too clever… worry about
  friendless later"). Every pair in 2..10 shares a multiple in
  range — crossings always exist.
- **Cuisenaire dash**: inverted possibles take a pastel of the
  table's colour (hue lifted to 80% lightness) under the white —
  "a dash of the cuisenaire colour", Roger's term.

Verified: t=6,8,10 deals parallel ×6/×8 diagonals sharing 24+48;
t=5,7,9 crosses at 35 and 63. Every shipped word is a line.

### IMG_0677 + the hue-clustering catch (Roger's reading beats mine)

Completed t=3,4,5 board: two real crossings (12=×3×4, 20=×4×5),
×4 word the hub. I read both shared cells as single-coloured;
Roger: the splits WERE drawn — I'd misread adjacent hues as one.
Root cause: tableColour's 31° hue step means a 3,4,5 deal packs
its colours into 62° of the wheel (293/324/355 — purple, pink,
coral). Consecutive tables are hue-kin by design. Fix landed:
hairline separators between a shared cell's colour strips — the
boundary carries what the hues can't. Convention question parked:
whether the family ever wants a wider hue step.

### Correction — that "verified" was itself wrong

A node harness (DOM-stubbed, real deal+tap logic) caught two things
my screenshot-reading had glossed:

1. deal()'s degrade loop ran UNCONDITIONALLY — a parallel-word
   attempt overwrote every successful crossed deal. No crossing had
   ever shipped. Fixed: parallel attempts only run when crossing
   attempts are exhausted. (And my earlier "parallel diagonals
   sharing 24" was doubly wrong — disjoint lines can't share.)
2. Roger's 30-in-×5-colour: cell display colour was deal order
   (ts[0]), not player order. Now the chain being followed decides:
   a found neighbour of one of the cell's tables wins the colour,
   else the table last collected, else ts[0]. Six neighbour checks
   on tap. Second-tap split retained (verified firing in harness).

Method note, banked for me: verify values arithmetically before
naming a cell's role — "single colour" pattern-matched to
"unrevealed split" when 66 was never shared (6's eleventh
multiple). The harness > squinting at stills for semantic checks;
stills still rule for visual checks.

## Graduated reveal + the triple's bloom (built, same session)

IMG_0676: completed t=4,6,8 board with 24 shared by ALL THREE
lines. Roger's rulings: colours arrive one per tap (chain colour,
then second, then third); the rare triple gets "specialness"
without slowing an inspired user — each tap sings its table's
note so the chord assembles, and the third colour lands with a
one-beat golden bloom (~0.8s, waits for nobody). Reveal order =
followed chain first, then deal order. Triples ≈1-in-6 for 4,6,8
at cross=1, always at 24 (the trio's only triple-shared value).

## members=12 — Roger's discounting (agreed, keep 10)

The arithmetic gift (every pair in 2..12 shares a value once
words run to 12, ×11 included) he'd already seen and discounted:
the discriminating variable is WHERE the shared index sits, not
whether it exists. Small tables meet mid-word (12,24,36 for
4×6 — short arms, easy knitting); 9×10's only meeting is 90 —
indices 9 and 10, two long arms needing near-diameter corridors.
The crossing pool is biased toward small tables GEOMETRICALLY,
not just arithmetically — a board where only small tables
intersect teaches "big numbers don't meet". Parked with framing:
friendship at the high end costs arms the comb rarely has room
for. Possible later dial: crossDeal prefers pairs whose shared
index sits mid-word in both words.

## Crossover census + the triple-compose question

- Params line now logs ∩2:/∩3: counts — bonus intersections
  announce themselves per deal.
- Triple-compose cost (Roger's question): trivial compute (~ms —
  shared values × cells × direction-triples); the rarity is
  combinatorial — needs lcm(a,b,c) ≤ 10·min. Only small-club
  triples qualify (4,6,8→24; 4,6,9→36; 5,7,9→315 never). Worth
  knowing the compose exists; the bottleneck is arithmetic.
- Roger's scope point: bonus intersections need multiple axes —
  comb (3 directions) breeds them, square (2) sparsely, honeycomb
  paths make "intersection" a different object. Machinery stays
  comb-scoped.

### Triangular meetings — measured, and re-homed (Roger)

Idea: not three words through one cell but each PAIR crossing once
— A×B, A×C, B×C at three distinct cells: a woven triangle. Built
`triDeal` behind `?tri=`: shared values set the triangle's
side-lengths in member-indices, directions must vector-sum
(e2·db − e1·da = e3·dc). Measured: eligibility is BINARY and
arithmetic — {2,4,6},{3,6,9},{2,3,5} succeed every time;
{4,6,8},{3,4,6},{2,3,4} and most others never can, whatever the
seed. A square grid needs diagonals for ≥3 axes anyway.

Roger's re-home: "find tables" (honeycomb) is the more adaptable
host — curved paths dissolve vector-closure entirely; the
triangle there only needs the arithmetic trio of shared values,
and the split/wedge rendering vocabulary already exists. The
build would be in honeycomb's deal: compose the three pairwise
meeting cells first, grow paths through them. Parked as a
feature candidate for the activity itself — the lab proved the
shape exists.

### IMG_0678 — the triangle in the wild

t=3,6,9 (eligible triple), seed 3935657118, △ flag set, ∩2:3 —
three pairwise meetings at 9 (×3×9), 36 (×6×9), 18 (×3×6), splits
revealed. Roger played a triangle deal within the session.

## End-of-day assessment + carry-forwards (Roger & Devin)

- **"Desklamp"** is Roger's settled name for the wandering lens —
  "superior to overuse of hints": a hint announces, the lamp makes
  the child hold the gaze. Concentration is the cost the user pays.
- **Inheritance list**: split-strip separators + graduated reveal
  belong in honeycomb's wedges next; sound porting with care.
- **Classroom ruling (Roger)**: sound in real activities should be
  OPT-IN, not opt-out — a lab may be loud, a classroom shouldn't
  be surprised.
- Devin ledger honestly noted: three corrections this session from
  narrating before verifying (66-mislabel, degrade-overwrite,
  splits-misread). Fix = claims through the harness BEFORE
  asserting. Roger's design reads ran ahead of the build all day —
  best outcomes came when his instinct set the question and the
  lab measured it.
