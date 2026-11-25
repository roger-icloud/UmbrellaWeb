# SessionNotes — 2026-11-25 (narrow-phone legibility; session crash post-mortem)

## Where the previous session ended

Overnight work on the launch-prep device sweep, last commit 01:30
(`8d5bd23`, "commit and try four"). Below 430px shortest dimension —
iPhone 8 (375×667) qualifies:

- `search-lab3.html` — drops a ring (side 6); cells ~18% wider;
  lines of ten still fit the longest line of 11. Known cost: tighter
  crossing arms for three tables — the experiment will judge.
- `honeycomb.html` — deals 104 cells instead of 132 (`TARGET_CELLS`
  is now `let`, set once at load by the same <430px test); paths of
  twelve still fit with twins and decoys.
- `408197c` — the fullscreen row hides wherever the API is absent
  (iPhone Safari never got it for web content; the iPhone's real
  chromeless route is Add to Home Screen). nav.js → v20.

Numerals scale with cell size (`FONT_MAX` cap in search tables,
`NUM_FONT` fraction of pitch in honeycomb), so bigger cells = bigger
digits — this IS the legibility experiment, committed. **Awaiting
Roger's verdict on iPhone 8.** If digits are still too small, the
next lever is a font floor or raising `NUM_FONT`/`FONT_MAX` for the
narrow case — discussed in principle, never coded.

## The crash (post-mortem, new session same morning)

Roger reported the previous session "crashed". Findings:

- No app crash — no Crashpad dumps since August; the app process ran
  continuously since 11-22; acp websocket log shows only routine
  planned reconnects (code 1012 / max_connection_age) overnight.
- The *session* died, not the app. Commits spanned ~22h (03:47 →
  01:30) — consistent with the known long-session `invalid_argument`
  rejections on swe-2-high (field report, AGENTS.md). Exact error
  unconfirmed; the transcript isn't locally readable.
- Nothing lost: working tree was clean at the crash, all work
  committed. No 11-25 notes existed until this file.

Lesson reaffirmed: checkpoint notes early in a session, not only at
the end — this file was written at session start for that reason.

## Try five — committed (277a275)

Roger on iPhone: "considerable space above and below the grid on
find, some below on search — aesthetics or real barrier?" Answer:
real chrome, padded. Below 430px on find tables: TOP_RESERVE 92→64
(status box hugs top edge) + BOT_RESERVE 116→76 — the comb is
height-limited so cells grow ~15%. Search: width-limited, spare
height already spent on `tall` stretch, so instead the comb slides
down COMB_DROP=0.25 of remaining slack — balance, never reaches rail.

## Honeycomb — the rename + true hexagon cells (1b6928c)

"Search Tables" is now **Honeycomb** — display-level rename (index
tile, page title, help + feedback options). Filename search-lab3.html
stays; honeycomb.html already hosts Find Tables — a quirk only we
see. The icon (spotty hexagon) still fits.

Cells are true pointy-top hexagons: `HEX_A = 0.48` pitch apothem
(0.50 would tile edge-to-edge; the inset keeps dark seams). One
`hexPath()` helper — every old `ctx.ellipse` cell call swapped
(fills, wedge clips, separators, the bloom ring — now hexagonal).
Inscribed circle 0.48p > old 0.40p: digits gain room. Hit test
widened to 0.58p for pointy corners. `HEX_V = HEX_A·2/√3` is the
vertical extent in geom()'s fit, `tall` gate, cap and COMB_DROP's
spare maths.

## Side 6 retired same day (0c4e7e1)

Roger tested: four iPhone deals, zero crossovers (iPad fine — it
keeps side 7). Cause confirmed in the deal code: a length-10 run has
~12 legal slots on a side-6 comb vs ~48 on side 7, so `attempt`'s
60-try crossing ambition always exhausted into parallel words (the
declared degrade — honest, just bland). Options weighed: MEMBERS 9
(restores density, loses ×10) vs SIDE 7 (smaller cells, full table).
Roger chose side 7 — "smaller cells? yes please" — helped by the
hexagons' bigger inscribed circle. Also brightened cell seams
(sockets #1d2832→#31455a, unfound #2c3e50→#41587a): his ask,
"cell dividers visible during selection" — the empty comb now reads
as a honeycomb skeleton under the picker rail.

## Publish logistics (Roger: "I'd like to be neat")

- mix-demo → main merge is the publish; waiting on his word and on
  this round's iPhone verdict. Lab files are tracked but unlinked —
  reachable by URL only, already the case.
- iPhone testing is via local server `http://<mac-ip>:8000/...`
  (already running, serves the repo; tilt won't work over http —
  accepted, "will keep").
- Headless Chrome has a ~500px min window width — the <430 branch
  can't be verified that way; use `?side=6`+params or a real device.

## Housekeeping incident (resolved)

`git add -A` swept Roger's untracked prose file into 1b6928c;
`git rm --cached` + 75df93e untracked it — still on disk for him
to place, as he asked.

## Still parked

- `YOu may not have noticed but the pages a` — Roger's "note for
  adults" prose, saved to repo root by accident. He'll fold it into
  a page himself soon; leave untouched meanwhile.
- Kin glow (non-ring channel needed), the adaptive/challenge ladder
  (talk before code), tilt-ball hole-set ordering — all as logged
  in SessionNotes-2026-11-24.

## Twist celebration revised (midday, commit 933f05e)

Roger replaced the coil->glow->numeral celebration: each found path's
snake now runs ONE circuit straight from the found pose, the table
numeral fades up plainly at its resting spot as the lap hands to the
seek (anim.js gained an `onPhrase` hook fired at each script phrase
boundary — the page times the numeral to it), then the snake seeks
home into the rail. Sequential, one snake at a time — Anim is a
single-run engine; a multi-run refactor enabling all-three-together
is parked as possible future work. After the third homecoming the
created numerals fade out together (`'clearing'` state, CLEAR_FADE),
sockets fade back in, and one ripple sweeps the rail (railRiffT0,
RAIL_RIPPLE) before the normal riff resumes. anim.js ?v=33->34 on all
six consumers. Verified headless via the existing ?t=&done&advance=
diagnostic: mid-celebration frame shows lap+numeral; end frame shows
home rail + clean sockets. Old startCoil/startHome/finishedCoils/'rest'
machinery removed.

## Platform quirk noted (Roger field report)

DuckDuckGo browser on desktop Mac renders the Twist celebration
jerkily; Safari desktop, DDG on iPad Air, and iPhone 8 are all smooth.
Cause is environmental: DDG-Mac is a WKWebView wrapper (weaker
compositing than Safari's own renderer) plus injected
fingerprinting-protection scripts hooking the canvas API. Per-site
privacy toggle can confirm. Not a defect, not blocking publish.
