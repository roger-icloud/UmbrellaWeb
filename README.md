# UmbrellaWeb — tilt probe

Created 2026-09-26. A single-file web probe (`index.html`) to answer:
is device tilt usable for steering in a browser, and how does it compare
with touch?

## What it is

- One canvas ball, three steering modes (button, top-right):
  - **FORCE** — tilt applies acceleration; glide + bounce. Feels elastic.
  - **VELOCITY** — tilt sets speed directly; level = stop. Isolates sensor lag.
  - **STEER** — tilt picks a heading, ball turns toward it at a capped rate.
    Closest stand-in for snake heading-control.
- Touch-drag / mouse-drag steers in every mode — the comparison control,
  and also means the page is fully usable on a desktop Mac.
- HUD (top-left text panel): input mode, raw + smoothed gravity,
  motion events per second, ball speed. `motion events` is the key
  diagnostic — ~60/s feels near-native; low or steppy = browser tax.
- Orientation handling: after the enabling tap it requests JS fullscreen
  (`requestFullscreen`, best-effort — iPhone support is recent and
  WKWebView browsers may refuse) then attempts
  `screen.orientation.lock('portrait')`, which has better odds inside
  fullscreen. Detect-and-warn fallback remains: rotating to landscape
  pauses the sim under a "Rotate back" notice (verified stable on
  resumption, incl. DuckDuckGo iOS).
- Standalone mode: `apple-mobile-web-app-capable` is set, so iOS
  "Add to Home Screen" launches it chromeless like an app.
- `visibilitychange` resets smoothed motion state on return (stale
  gravity after lock/tab-switch would lurch the ball).
- Tunables are constants at the top of `index.html`.

## Serve it

```bash
cd ~/Developer/UmbrellaWeb
python3 -m http.server 8000        # terminal 1 (or Simple Web Server)
cloudflared tunnel --url http://localhost:8000   # terminal 2
```

cloudflared prints a `https://…trycloudflare.com` URL — real cert, no
account, works on any device/network. URL changes each run; Ctrl-C stops.
(`brew install cloudflared` if missing; `brew install qrencode` +
`qrencode -t UTF8 "<url>"` to show a QR instead of typing it.)

On the device: open the URL in Safari, tap the button — iOS requires a
user-gesture `DeviceMotionEvent.requestPermission()` before motion data
flows.

## Status / open questions

- Verified working on iPhone 8 via cloudflared tunnel (2026-09-26):
  permission flow + tilt steering functional. "Feels bouncy/elastic" in
  FORCE mode — expected: force+low friction reads springy; VELOCITY/STEER
  added to separate sensor lag from physics model.
- Physics feel on Mac via mouse-drag rated "more physical than a sprite"
  — second-order control (input→force→velocity→position) doing its job.
- **Not yet reported:** actual `motion events`/s on device — the number
  that decides whether browser tilt is a path or a curiosity.
- Motion math assumes portrait; no axis remap on rotation (probe only).
- Relevance: parked Umbrella "password-free web prototype" objective —
  this is its feasibility probe.
