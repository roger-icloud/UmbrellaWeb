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

## Still parked

- `YOu may not have noticed but the pages a` — Roger's "note for
  adults" prose, saved to repo root by accident. He'll fold it into
  a page himself soon; leave untouched meanwhile.
- Kin glow (non-ring channel needed), the adaptive/challenge ladder
  (talk before code), tilt-ball hole-set ordering — all as logged
  in SessionNotes-2026-11-24.
