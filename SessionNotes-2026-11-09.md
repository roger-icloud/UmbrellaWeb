# Session notes — 2026-11-09

## Banked idea — "dial a pattern" (Roger)

On the 100 square: choose a button and a pattern appears; a second
button for an overlay. Developing toward a **sieve of Eratosthenes**
— overlaying table patterns as filtration.

## Open item from yesterday's session (paused mid-check)

Roger tried `?tables=7,9,11` in search-lab3 and couldn't find
complete paths — "is it me or too difficult?" A claim-all-machine
test was mid-run when the session paused (playwright chromium had
to be reinstalled; rerun /tmp/t7911.py next session). Suspicion to
test first: the deal is almost certainly completable but genuinely
hard at the top of the dial range (3 tables × 10 members on 169
cells, near-misses on, no hints). Softer audition: `?near=0`,
two tables first, `?mark=1` to see what's hidden. Also recall:
×7/×11 share no multiple in range — 11 is always a parallel word;
only 7&9 can cross (at 63). Session to resume here.

## Resolution — "couldn't find complete paths" (Roger, 2026-11-09)

Not a defect: every dealt word is fully placed before distractors
fill in, distractors can never be members, and one tap on a shared
cell serves both tables — nothing asked-for can be absent. Roger's
difficulty was the honest top of the dial: 3 tables × 10 members
on 169 cells with near-misses and no hints. Softer auditions:
`?near=0`, two tables first, `?mark=1` reveals the hiding places.

### The crossability map (ten-member words)

A pair of tables can cross iff `lcm(a,b) ≤ 10·min(a,b)`. The only
UNcrossable pairs for tables 2–12: **anything with ×11** (friendless
— lcm with any partner is 11t, outside the partner's first ten) plus
**(5,12)** and **(7,12)** (60 and 84 sit just outside the smaller
word). Everything else shares 1–3 values and can intersect.

Design consequence for later: crossing-rich deals should pick pairs
from the crossable pool — the "kin" relation honeycomb already
computes (sharedCount). If crossings become the feature, chip
selection can steer that way; if discovery is prized, un-crossable
pairs staying parallel is equally fine — just know which you dealt.

## The wall reasoning (Roger's deduction, confirmed)

Uncrossable words (×11 etc.) are walls: they kill transverse runs —
totally when they fill their line (a 10-cell row), through ≤3 gaps
otherwise, with traversal only near the traverser's own ends.
Crossing richness collapses to the SHALLOWEST shared value under
pressure (6 for ×2×3 survives what 18 and 12 can't). Three-table
deals: kin words can still cross in corridors off the wall's row.
Method note (Roger's): measure the middle to verify, reason at the
boundary to understand — his 7,9,11 probe found the constraint that
averaged seed-counts had smoothed over.

## Interface decision (Roger, 2026-11-10)

Allow all tables, advise by glow (kin-glow on the chips — crossable
partners glow after the first pick; friendless stay dim). Board size
is a crowding dial, not a crossing fix — ×11's friendlessness is
arithmetic, unfixable by geometry. Roger's framing: primes and the
friendless are advanced concepts — the intent is removing drudgery
and shortening the learning curve; extremes taught limits, they are
not the curriculum. Wall/crossing logic stays engine-side steering.
Deal design agreed: deductive pre-filter (crossability, arm-capacity,
least-flexible-first placement) + per-deal invariant check — no
unproven deal ships; degrade by declared spec, never silent scatter.
