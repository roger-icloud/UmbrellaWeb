#!/usr/bin/env python3
"""Generate icon-coil.svg — coiled snake of numbered segments.
   Tunables first; re-run to re-render the SVG, then Chrome screenshots it.
   Geometry note: a flat spiral of uniform discs wraps ~1.2 turns at most —
   R_IN is solved so the body's arc exactly spans those turns."""
import math

# ---- tunables ----
CX, CY   = 256, 298     # spiral centre (canvas is 512)
HEAD_R   = 60
SEG_R    = 40
GAP      = 70           # arc distance between segment centres (~segD)
N_SEG    = 9            # nine members — less busy scaled down (Roger)
R_OUT    = 158          # spiral outer radius (head orbit)
TURNS    = 1.35         # how far the body coils
HEAD_DEG = -95          # world angle of the head around the centre
HEAD_DX, HEAD_DY = -30, -20  # head offset — sit it on the 10 (Roger)
HUE      = 150          # x10 table hue — itself the green
NUMS     = [10,20,30,40,50,60,70,80,90]  # x10, head-end first
TAIL_NUB = False         # taper the tail tip with one small disc
# -------------------

STEPS = 4000
BODY_ARC = GAP * (0.9 + N_SEG + (0.8 if TAIL_NUB else 0))

def build(r_in):
    th_max = TURNS * 2 * math.pi
    k = (R_OUT - r_in) / th_max
    arc = [0.0]; samples = []
    prev = None
    for i in range(STEPS + 1):
        th = i / STEPS * th_max
        r = R_OUT - k * th
        a = math.radians(HEAD_DEG) - th
        x, y = CX + r * math.cos(a), CY + r * math.sin(a)
        if prev is not None:
            arc.append(arc[-1] + math.hypot(x - prev[0], y - prev[1]))
        prev = (x, y)
        samples.append((x, y))
    return arc, samples

# solve R_IN so total spiral arc == body arc
lo, hi = 4.0, R_OUT - 8.0
for _ in range(40):
    mid = (lo + hi) / 2
    arc, _ = build(mid)
    if arc[-1] < BODY_ARC: lo = mid   # too short: shrink less (larger R_IN)
    else: hi = mid                    # too long: shrink faster (smaller R_IN)
R_IN = (lo + hi) / 2
arc, samples = build(R_IN)
total = arc[-1]

def at_arc(d):
    lo2, hi2 = 0, STEPS
    while lo2 < hi2:
        m = (lo2 + hi2) // 2
        if arc[m] < d: lo2 = m + 1
        else: hi2 = m
    x0, y0 = samples[lo2 - 1]; x1, y1 = samples[lo2]
    f = 0 if arc[lo2] == arc[lo2 - 1] else (d - arc[lo2 - 1]) / (arc[lo2] - arc[lo2 - 1])
    return x0 + (x1 - x0) * f, y0 + (y1 - y0) * f

hx, hy = at_arc(0)
head = (hx + HEAD_DX, hy + HEAD_DY)
neck = at_arc(GAP * 0.9)
heading = math.radians(-90)   # face straight up: eyes sit horizontal
segs = [at_arc(GAP * (0.9 + i)) for i in range(N_SEG)]
nums = NUMS[:N_SEG]

def hsl(h, s, l): return f"hsl({h},{s}%,{l}%)"

out = []
out.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">')
out.append('<defs><radialGradient id="head" cx="50%" cy="50%" r="72%" fx="36%" fy="30%">'
           f'<stop offset="0" stop-color="{hsl(HUE,68,70)}"/>'
           f'<stop offset="0.38" stop-color="{hsl(HUE,62,58)}"/>'
           f'<stop offset="1" stop-color="{hsl(HUE,56,28)}"/></radialGradient></defs>')
out.append('<rect width="512" height="512" fill="#101418"/>')

if TAIL_NUB:
    tn = at_arc(GAP * (0.9 + N_SEG - 1 + 0.9))
    out.append(f'<circle cx="{tn[0]:.1f}" cy="{tn[1]:.1f}" r="{SEG_R*0.5:.1f}" '
               f'fill="{hsl(HUE,60,45)}" stroke="{hsl(HUE,55,36)}" stroke-width="1.5"/>')

for (x, y), v in zip(segs, nums):
    out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{SEG_R}" fill="{hsl(HUE,60,45)}" '
               f'stroke="{hsl(HUE,55,36)}" stroke-width="1.5"/>')
    out.append(f'<text x="{x:.1f}" y="{y+2:.1f}" font-family="Andika,-apple-system,sans-serif" '
               f'font-size="{SEG_R*0.78:.0f}" font-weight="700" fill="#fff" '
               f'text-anchor="middle" dominant-baseline="central">{v}</text>')

out.append(f'<circle cx="{head[0]:.1f}" cy="{head[1]:.1f}" r="{HEAD_R}" fill="url(#head)" '
           f'stroke="{hsl(HUE,58,40)}" stroke-width="2"/>')

ex, ey = math.cos(heading), math.sin(heading)
px, py = -ey, ex
deg = math.degrees(heading)
for sgn in (1, -1):
    exx = head[0] + ex * HEAD_R * 0.38 + px * sgn * HEAD_R * 0.36
    eyy = head[1] + ey * HEAD_R * 0.38 + py * sgn * HEAD_R * 0.36
    out.append(f'<ellipse cx="{exx:.1f}" cy="{eyy:.1f}" rx="{HEAD_R*0.16:.1f}" ry="{HEAD_R*0.16:.1f}" '
               f'fill="#101418" transform="rotate({deg:.1f} {exx:.1f} {eyy:.1f})"/>')

out.append('</svg>')
open('icons/icon-coil.svg', 'w').write('\n'.join(out) + '\n')
print(f"R_IN {R_IN:.0f}, arc {total:.0f}px, head {head[0]:.0f},{head[1]:.0f} heading {deg:.0f}deg")
