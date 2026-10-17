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
- `tilt-ball.html` — bare tilt probe
- `rationale.html`, `help.html`, `feedback.html` — human-facing pages
- `snake.html`/`search.html`/`ball.html` — redirect stubs, kept

## Open threads

- Celebration grammar is parked, deliberately — the Swift departure
  engine was the costly lesson ("decorative machinery before proven
  semantics is where bugs breed"). When it returns, it's a family-wide
  design conversation, not a patch.
- Honeycomb three-table readability on small screens is under test.
- Service worker / offline: discussed, deferred.
- The loupe idea (magnify cells under touch) noted for later.

## Workflow

- Verify statically: `node --check` on extracted `<script>` blocks; for
  logic, a small DOM-stubbed node harness has proven worth it.
- Commit+push only when Roger asks; he may have uncommitted prose edits —
  always `git status`/`git diff` first and carry his changes along.
- Commits as `rogereve` with the Devin trailer; push to `main`.
