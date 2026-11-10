# Session notes — 2026-11-08 ("tidying umbrella")

## Environment — Linux tooling settled

- `~/.local`: node v26.13.0 + npm (restores `node --check` + the cjs
  harness); Chrome for Testing 157 pinned at
  `~/.local/opt/chrome-linux64`, on PATH as `chrome` (headless stills —
  reproducible version, AGENTS.md path restored).
- `~/jstools` venv (earlier session's): playwright + esprima; chromium +
  ffmpeg in `~/.cache/ms-playwright`; `imageio-ffmpeg` added for
  recording-tiling. `/tmp/shot.py` = playwright screenshot helper.
- Google Chrome 157 installed system-wide via `pkexec` (GUI password
  dialog — the sudo route that doesn't need a terminal): repo +
  keyring registered, updates ride with system updates. Roger keeps
  Brave as his daily browser; Chrome is a bisect/reference tool.
- Roger's rule banked (global prefs): proactively advise on his
  environment; "fewer" never "less" for countables.

## Project state (Roger's summary)

Puzzle, tilt and search are **mature** — polish only, with adaptive
and extending strategies later. Three areas deserve attention:

1. **Completion → hundred-square link** (the den journey already in
   flight) — sequence meets pattern; done right it gives tangible
   progress, not just entertainment.
2. **Nomenclature** — a wisdom pass owed; "heap" was the lesson (a
   programmer's term misread as the design noun for a slumped snake).
   Names must carry the design grammar, not implementation shorthand.
3. **Reasons to persist** — today the only rewards are the animations
   and the achievement itself; an open exploration.

Standing principle restated: words at bare minimum — familiarity of
environment, gesture, convention, a sprinkle of hints and clues.

## New brief — the straightforward table search

Roger's observation: word-search words hide in *straight lines*;
Honeycomb's paths bend — richer, but harder for the beginner. The
family needs a simpler entry rung on the same mechanic: find a
table's multiples lying in a straight line, word-search fashion.

### First geometry fact (mull)

A straight run of 12 cells needs a board at least 12 long in that
direction — the 10×10 square can't host a full-table line. Options:
12×12 board; shorter runs (windows of the table); several parallel
lines sharing the table; or runs that wrap at the decade (which
re-bends the line). Decision deferred.

### Design gifts noted

- Two found members → the line *predicts* the rest: spatial
  scaffolding honeycomb can't offer. The beginner's free clue.
- Distractors are the difficulty dial: obvious non-members (pure
  ordering) vs near-misses (membership discrimination — recital's
  DECOYS dial transferred).
- Descending runs = the recital's direction idea, free.
- Crossover idiom transfers wholesale: intersecting runs can share a
  cell (36 on ×4 and ×6), split-colour already established.
- Naming candidates live in the pun: "table search" (times-table +
  grid-of-numbers) or "number search" (genre echo).

## Open from earlier sessions (unchanged)

- Tilt-ball decisions (geography lever, tap removal, rack length).
- Recital defaults awaiting Roger's eye.
- help.html intro awaiting Roger's read; index intro still ends
  mid-sentence (his to finish).
- `#buildTag` and `DEBUG_GRID` retirements; patterns ×9–×12 defect.
- The week's work uncommitted — pending Roger's call on commit shape.

## search-lab 2 (Roger's first calls, same session)

Auditioned `search-lab.html` once and ruled: **no diagonals, no
hints** — the beginner's deal is purer discovery. `search-lab2.html`
bakes that: 12×12 board, ONE run of 12 (the whole table as the word),
h/v directions only, glow off, near-misses at 0.25. The dormant
params stay underneath for A/B (`?dirs=` `?glow=` `?runs=` `?board=`).
Noted while watching: distractor fill includes beyond-table multiples
(98 = 14×7 sits in a ×7 board) — the "does the table stop at 12?"
discrimination, a free difficulty lever.

## search-lab3 — the comb arrangement

- `search-lab3.html`: word-search deal on a hexagonal comb (axial
  coords, hexagon side 7, 169 cells, circle cells like honeycomb).
  Three axes / six directions → more crossing chances than the
  square's two axes.
- Crossovers are COMPOSED, not hoped for: `crossDeal` picks a shared
  multiple + cell first, lays both words through it (resolution
  first, deal generated backward — the departure-grammar rule).
  CROSS_P default 0.7 here and now in lab2 too.
- Geometry lesson recorded: side-6 (91 cells, max line 11) starves
  crossings whose shared value sits near word-ends (×2/×9 share only
  18 — index 8 and index 1 — arms won't fit). Side 7 (13-long
  diameters) restores them: 18–19/20 for all pairs tested, and
  3-table deals can chain crossings (24 = ×3×4 and 20 = ×4×5 in one
  board). Pairs with no in-range shared multiple (×7/×11) can never
  cross — honest maths, not a defect.
- Sound+haptics entered the family: crossover arpeggio (pentatonic
  table-notes, the chord IS the two tables) + refusal vibrate.
  iOS has no web haptics — Android only; the amber flash still
  carries refusal on Apple devices. Roger's note: iPhone 8 Taptic
  exists but WebKit won't expose it; a later Swift port could cure.
- Roger's drift on platform: browsers DO grant gyroscope now (the
  iOS permission prompt we already use) + Add-to-Home-Screen gives
  app presence — the web route is vindicated; haptics is the
  remaining Swift argument, filed for later.

## BANKED, not built — the area hint (Roger, 2026-11-08)

For absolute beginners some hinting would help, but pointing at the
correct cell is too much help. Roger's middle way: twinkle an AREA
briefly and let the child still find the member inside it.

- shapes offered: a row of four, a cross of five, a square of nine —
  brief twinkle, guides to a region, not an answer;
- open questions for build time: which shape (difficulty dial or
  variety?); does the area centre on the target (a centred cross
  whispers "the middle one" — maybe offset it?); does a row-of-4
  leak the word's DIRECTION as well as its location (helpful or
  too much?); trigger = the family's idle-hint convention
  (NEXT_HINT_SECS-style);
- on the comb the shapes translate naturally: cell+ring = a
  7-cell flower, 3- and 4-cell lines, rhombi — worth choosing the
  comb-native set rather than forcing square shapes onto hexes;
- rhymes with kin glow: steering, never forcing — the area says
  "warm", the cell still has to be found and recognised.

## Where the line-search sits pedagogically (Roger, 2026-11-08)

The hexagon keeps the straight-run principle while offering more
diagonals — and Roger's verdict on the mechanic's learning register:
straight-line finding is a DIFFERENT KIND of learning, "more
reinforcement than learning from scratch or thinking and questioning
deeper, as curved searches seem to require."

Sharpened: in a curved search every cell is a question (is THIS a
multiple?); once a straight word is found, the remaining cells stop
being questions — the search converts to a recital, each tap a
confirmation. Discovery front-loaded, rehearsal behind. That places
the activity on the family's ramp as the consolidation rung:
honeycomb interrogates, the word rehearses. Crossovers may restore
some interrogation at the line level (which word does this cell
serve? is worth a thought). Matches the ideation/consolidation phase
split from the reservoir notes.

## intro.html — the framed words (built while Roger wrote)

Adult-facing introduction page: a prose column (max-width 640,
ROGERS TEXT markers around placeholder paragraphs for him to
replace) with two table-snakes living on its border. Behaviours:
drape along the perimeter (a perch is just where the head stops —
corner drapes fall out free), blink, wandering pupils, breathing
sway, head-to-tail wriggle ripple now and then, and VERY
occasionally (60–150s) a full intrusion: the snake slides across
the text on a lazy arc and settles on a new perch. Only one snake
travels at a time. ?demo=1 quickens the clocks for audition;
?tables= picks the household; ?seed=.

Key decision: the border wraps the VISIBLE window of text, not the
document — it hugs the column's width and the screen's height, and
re-lays on scroll/resize, so the frame is always where the reader
is regardless of page length. First version draped the document
rect and the snakes perched off-screen — the visible-window frame
is the truer reading anyway.
