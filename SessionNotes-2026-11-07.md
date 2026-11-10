# Session notes — 2026-11-07

## Rest-lab & the den-to-square journey

Two lab pages, all untracked/experimental:

- **`rest-lab.html`** — a clear page for exploring resting-snake
  display. Grew a collection: snake 1 = horizontal S-wave (the MASTER
  wave — grab and pull to deepen the wave on 2/3/4); facing snakes
  (x-sway, y-bob, combined rosette); fidget snakes 5/6/7 (head-driven
  trail motion, lag `i*LAG_F`); snake 8 = a dealt `Anim.pose` seen
  end-on + puzzle's restless wriggle; snake 9 = sleepy head-up look;
  snake 10 = wound coil; snake 11 = the den `heap()` portrait enlarged.
  Drag handlers: fids heads, snake-1 wave master.
- **`scroll-lab.html`** — the den-to-square reveal. Three heaps wait
  bottom-left (den character ported, peek-bobs REMOVED — Roger: they
  read as "darting balls", the quiet heap is better). "Send ×5 ▸":
  the first snake unspools (segments peel off in trail order), swims
  right on a bezier to the grid's left margin; the CAMERA pans right
  following the head (`CAM_LEAD 0.35`) — Roger's "like a video camera
  panning right following the snake". World-space drawing under
  `translate(-cam)`; grid sits a page-width right. "Recall ◂" resets.
  Roger judged it: "Yes!! Good" — the camera-follow is approved.

## The resting character (front-runner: snake 9 register)

Lugubrious patience = grounded pile + head-and-neck occasional slow
look: `reach` caps motion to nearest ~4 segs (deep body stays at
anchor on the ground — "body should remain on the ground"), `liftAmp`
(head rises ~1.5× dia), drowsy lids (`lidBase 0.58`), pupil sweep
with the look, irregular 20-40s gaps. "Sleepy occasionally curious"
= slow everything, no darts, motion dies toward the tail.

## Design destination confirmed (Roger)

Three completed snakes wait in the den lugubriously; when all three
are done the page pans right — "as if the page is double wide" —
revealing the hundred square; the full-size snakes crawl over it and
deposit numbers. Deposit refinements pending Roger's ideas.

## Open / next

- iPad portrait pass on scroll-lab (built for desktop; "exciting but
  incomplete" on iPad portrait).
- Crawl onto the grid + number depositing (Roger has refinements to
  share).
- The journey back — victory lap → den travel → gather (melt pile
  stands unjudged in anim.js).
- Test server: `python3 -m http.server 8001` in repo root; iPad hits
  `http://192.168.0.19:8001/scroll-lab.html` (machine's LAN IP; his
  Simple Web Server owns 8000).

## Process note (Roger's ask)

The den-heap hunt failed on keyword search — `heap()` in nav.js,
found by tracing `completion → NF.complete → den`. Agreed practice:
trace event paths first, ask after one failed guess, offer
inspect-element early, treat description/code conflicts as signal.
Linux move changes nothing about tooling — only missing `node` and
flaky headless Firefox while a browsing session runs.
