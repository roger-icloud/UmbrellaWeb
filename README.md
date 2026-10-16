# UmbrellaWeb — standalone web activities

Static site, no build step. Live at
**https://roger-icloud.github.io/UmbrellaWeb/** (GitHub Pages, auto-rebuilds
~1 min after each push to `main`).

## Pages

- `index.html` — landing/intro page. Roger's introduction sits between
  clearly-marked HTML comments; edit the text in any editor and push.
- `tilt-snake.html` — Tilt Snake. Tilt- or touch-steered snake collects
  the twelve multiples of a chosen table **in order**; each becomes a
  numbered tail segment. Wrong-order contact = amber refusal flash, no
  penalty. Extras: tap the next numeral to autopilot toward it; idle-time
  hint system (stronger target pulse, then a pointing arrow — all tunable).
- `patterns.html` — Patterns. The hundred square: tap the twelve
  multiples of a table (t…12t, any order) and watch its pattern emerge.
  The board fills the screen at native cell size (no virtual
  resolution — discrete space keeps its structure) and taps resolve to
  the nearest cell centre, so below-44pt cells stay tappable.
  `DEBUG_GRID` overlay shows the resolution boundaries.
- `tilt-ball.html` — the original bare tilt probe (three steering modes,
  HUD diagnostics). Development tool, not a game.
- `feedback.html` — adult-facing feedback form → email via formsubmit.co
  to roger.k.eve@outlook.com (`FEEDBACK_EMAIL` constant in the page).
- `nav.js` — shared menu (top-right snake icon). Edit `ITEMS` there and
  every page updates together. Includes a fullscreen toggle (works on
  Android/iPad; silently no-ops where iOS refuses element fullscreen).
  Old filenames (`snake.html`, `search.html`, `ball.html`) are redirect
  stubs so shared links keep working.

## Install as an app (PWA)

`manifest.json` + `icon.svg`/PNGs make every page installable: browser
menu → "Add to Home Screen". iOS launches chromeless (the
`apple-mobile-web-app-*` meta was already present); Android/Chrome does
a fuller install (WebAPK — own app-drawer entry). In standalone the
menu's Fullscreen row hides itself (nothing left to toggle). No service
worker yet, so installed pages still need a connection — offline caching
is a deliberate future step.

## Naming

Continuous-space pages scale everything proportionally through a single
K factor ("design px" world on a 375-wide board — speed, radii and
positions stay the same fraction of screen on every device). Discrete
grids keep structure and adapt the input layer (centroid taps).

## Conventions

- One file per page, tunables as constants at the top of each script.
- Portrait assumed for tilt games; landscape = pause + "Rotate back"
  (web pages can't force-lock orientation on iOS — the guard is the
  ceiling; Android accepts the real lock).
- Telemetry: snake.html keeps an in-memory `events` array with an
  ephemeral per-load session id — wiring a POST endpoint is a future
  step, deliberately anonymous (no cookies, no storage, no identity).

## Local serving (for testing unpushed edits)

```bash
cd ~/Developer/UmbrellaWeb
python3 -m http.server 8000        # terminal 1
cloudflared tunnel --url http://localhost:8000   # terminal 2 → temp HTTPS URL
```

On the device: open the URL in Safari/Chrome, tap the button — iOS
requires a user-gesture `DeviceMotionEvent.requestPermission()` before
motion data flows; Android needs no prompt.

## Status / open questions

- Verified on iPhone 8 (snake + probe) via HTTPS. Android untested —
  expect sensor-feel tuning (`TILT_DEAD`, `SMOOTHING`) rather than bugs.
- Actual `motion events`/s on device still unmeasured (HUD shows it).
- Parked Umbrella objective "password-free web prototype" — this repo is
  its realisation.
