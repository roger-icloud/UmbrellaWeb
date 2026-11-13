# Session notes — 2026-11-13

## Mix Patterns demo — loose ends tidied (mix-demo)

Roger's account of the intended demo: plain hundred square; ×2 flies
on and shades it; ×4 follows and shared cells go two-tone; pause;
colours drain; fade; a fresh blank page for the user. The order was
right; the code had three faults, now fixed:

- **Flight from the middle.** The up–down half of the fly-on ran
  backwards (`lerp(cy, hy)` → `lerp(hy, cy)`), so both performers
  started mid-screen on a skewed diagonal.
- **The bow removed** (Roger: the ending stays, "without the bow").
  The performer now stays still; the one low note still sounds at
  that moment — **keep or remove is undecided**.
- **The worked board came back after the fade.** The drain never
  quite reached "fully faded", so ×2 and ×4 stayed laid, invisible,
  and reappeared when the dark lifted (a tap on the eyes then played
  ×3 and ×5 on top). Drained tables are now always lifted off.
- Robustness: a table now lays once its landing moment has passed,
  not only during that 0.1 s window — a slow frame can't skip it.

Each satellite still goes home straight after laying its pattern —
Roger confirmed that is right (his point 5 was a slip).

## Hover and drop — one progressive shade (Roger's refinements)

- The faint full-cell wash is gone.
- **First table, empty board:** while hovering, its colour grows into
  half of each cell it would claim, with the same soft divide as the
  real split. On release it carries on, at the same pace, to the
  whole cell.
- **Once mixing:** the hover reveals **only the shared cells** (Roger's
  "third way") — the new colour grows into its exact share of the
  split, centred where it will settle (the left half for two). On
  release the shared cells finish their split and the rest of the new
  table shades in from nothing.
- A tap (no hover) shades the whole pattern in from nothing.
- One pace for all of it: `PREVIEW_MS` (400 ms per half cell).
- The split itself is unchanged — Roger: "really good", keep it.
  `blendFill` gained an optional "arriving colour" so hover and final
  are drawn by the same code; tested equal at the end of the growth.
- A white twinkle on shared cells was tried and **removed** (Roger:
  "simple speaks for itself and I'm inviting discovery not telling").

## Parked

- **A twinkling star** for shared multiples — Roger may consider it
  later; not now.
- **Review the screen for simplification** (Roger): there is much for
  a learner to take in — eleven satellites, the eraser, the eyes, the
  menu, a hundred numerals. The map is planned for wider use (the
  atlas thread), so it will become familiar — all the more reason to
  get it just right.
- The low note — keep or remove.
- Publishing Mix Patterns to `main` — Roger's call.

## Observed

- An on-screen keyboard (probably the Apple Pencil touching the iPad
  Air) made the satellites rearrange smoothly — the `visualViewport`
  resize path doing its job. Reassuring, not designed for.

## Housekeeping

- Inventory of all pages made (attached in the session, not in the
  repo): table colour formula copied in 18 pages, table chips in 6,
  refusal shake in 8 — the refactoring candidates.
- Naming candidates NumberBrew / GrowingNumbers / Table Snakes — still
  settling.
- Labs stay on `main` for now (Roger: "leave for now").
- Mint preview: Simple Web Server's 8001 needs https + password and
  8081 returned errors; `python3 -m http.server 8000` in the folder
  works (iPad: http://192.168.0.19:8000).
- The `ff23d28` commit message mentions "tones as the ring wakes";
  those tones had already been cut.

## Working together (agreed suggestions)

- A short iPad screen recording when motion looks wrong.
- End each session with "save and note": commit, push, dated note.
- "Park that" for ideas that arrive mid-task — they go in the note.
