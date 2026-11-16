# UmbrellaWeb — page inventory, 13 November 2026

Covers every page on `main` (all of it public at number-fun.uk) plus `mix-patterns.html` from the `mix-demo` branch, which isn't published. The "Suggestion" column is only my starting point, for you to mark up.

**Den** = the page tells the den when a table is finished, so the gather-home → hundred-square journey can start.

## 1. Activities on the menu

| Page | Menu name | What it is | Den | Suggestion for 1.0 |
|---|---|---|---|---|
| tilt-snake.html | Tilt Snake | Steer the snake to collect ×1…×12 in order | yes | Keep |
| snake-puzzle.html | Snake Puzzle | Drag the missing numbers home to a posed snake | yes | Keep |
| honeycomb.html | Find Tables | Paths of multiples hidden in a honeycomb, one to three tables | yes | Keep |
| tilt-ball.html | Tilt Ball | Bar-billiards factors: sink each number in its largest hole | no | Keep. Decide whether it should feed the den (it's a factors game, not a single table) |

## 2. Pages for adults

| Page | How it's reached | What it is | Suggestion |
|---|---|---|---|
| intro.html | Book icon, top-left of the home page | Your introduction, with the ×3 and ×9 snakes on the frame | Keep. Your prose to finish |
| help.html | Menu | Help | Keep. Add the search family's description |
| rationale.html | Menu | Rationale | Keep |
| feedback.html | Menu and a home-page tile | Feedback form, sent by email | Keep |
| Biog.html | Not linked from anywhere | Your biography | Decide: link it from the intro, or leave it unlinked |

## 3. The journey page

| Page | How it's reached | What it is | Suggestion |
|---|---|---|---|
| square.html | Only by the den, after three tables are completed | The hundred square where gathered snakes leave their tables | Keep. Needs the den check on every activity |

## 4. Finished or nearly finished, but not on the menu

| Page | Last on the menu | What it is | Den | Suggestion |
|---|---|---|---|---|
| search-lab3.html | never | Word search on a hex comb, with the desklamp and crossovers | no | The graduate: give it a real name and a menu tile, and wire it to the den |
| mole.html | never | Numeral moles rise; tap the members; a row builds ×1…×12 | no | "Maybe" on your push list. Decide |
| mix-patterns.html (*mix-demo branch only*) | branch index has a tile | Hundred square ringed by satellite tables; patterns mix; wordless demo | sandbox, deliberately none | Decide: menu place (your atlas thought) or 1.1 |
| patterns.html | until 26 Oct | Tap a table's multiples on the hundred square | no | Probably superseded by mix-patterns and the square. Retire or keep for 1.1 |
| pattern-snake.html | until 4 Nov ("does too much") | Single-table hundred square with a snake | no | Retire to the labs |
| lattice.html | until 26 Oct | Drag loose multiples home to the hundred square | no | Retire to the labs. (AGENTS.md still says it's on the menu, which needs updating) |

## 5. Labs: proving grounds, public only by direct address

| Page | What it proves | Suggestion |
|---|---|---|
| search-lab.html | First word-search deal (square grid, diagonals) | Superseded by lab3 |
| search-lab2.html | Beginner's deal, crossings on a square grid | Superseded by lab3, but keep as a record |
| recital.html | Declare the table by tapping stops; the snake performs it | Your note says immature, so it stays a lab |
| recital2.html | Recital, revised after your 3 Nov feedback | Same. Probably only one of the two is needed |
| pose-lab.html | Snake poses and the departures (exits) | Its work now lives in anim.js. Keep as a record |
| rest-lab.html | How a resting snake looks | Keep as a record |
| scroll-lab.html | Den-to-square pan | Keep as a record |

## 6. Redirect stubs (old addresses, so shared links still work)

| Page | Goes to |
|---|---|
| snake.html | tilt-snake.html |
| ball.html | tilt-ball.html |
| search.html | patterns.html (the original "Search" was Patterns) |

If patterns.html retires, search.html will need a new destination.

## 7. Shared pieces

- **nav.js** (menu + den): every page uses it, all at the same version (v=14), which is tidy.
- **anim.js** (departures): used by Tilt Snake, Snake Puzzle, Find Tables and rest-lab.
- **fonts/** (Andika): used everywhere.

## What the inventory says about refactoring

- The table colour formula is copied separately into **18 pages**. It belongs in one shared place.
- The table-picker chips appear in 6 pages, and the refusal shake/flash in 8. These are the next candidates for the same treatment.
- Doing this would keep "one snake, one colour, one refusal" true by construction, the same lesson as anim.js.

## Documents needing a refresh

- README.md is out of date: old web address, Tilt Ball called "a probe", the Patterns debug grid.
- AGENTS.md lists Lattice as on the menu.
