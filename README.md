# UmbrellaWeb — standalone web activities

Static site, no build step. Live at
**https://roger-icloud.github.io/UmbrellaWeb/** (GitHub Pages, auto-rebuilds
~1 min after each push to `main`).

## Pages

- `index.html` — landing/intro page. Roger's introduction sits between
  clearly-marked HTML comments; edit the text in any editor and push.
- `snake.html` — Table Snake. Tilt- or touch-steered snake collects the
  twelve multiples of a chosen table **in order**; each becomes a numbered
  tail segment. Wrong-order contact = amber refusal flash, no penalty.
  Extras: tap the next numeral to autopilot toward it; idle-time hint
  system (stronger target pulse, then a pointing arrow — all tunable).
- `ball.html` — the original bare tilt probe (three steering modes, HUD
  diagnostics). Development tool, not a game.
- `feedback.html` — adult-facing feedback form → email via formsubmit.co.
  Set `FEEDBACK_EMAIL` in the page's script (one constant, top of script);
  first submission sends a one-time activation link to that address.
- `nav.js` — shared burger menu (top-left). Edit `ITEMS` there and every
  page updates together. Includes a fullscreen toggle (works on
  Android/iPad; silently no-ops where iOS refuses element fullscreen).

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
