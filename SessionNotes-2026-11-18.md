# SessionNotes — 2026-11-18

## The morning-after map (post-launch reflection)

Roger's threads after going live — recorded as discussed, nothing decided.

### Tables tidying (on the live site, when he returns to it)
- **Multi-table selection is ill-defined.** Activities that host more than one
  table (Search/Honeycomb) need a clear, child-legible way to choose and show
  which tables are in play.
- **Colour: "dark and mysterious" was an arbitrary decision** — worth a proper
  look rather than accepting as inherited.
- **Sound and haptics: an untouched field.** Quiet signals fit the house style
  (the soft chime precedent); phone haptics would be genuinely new — "haptic
  tables" for phones noted as an idea, not a plan.
- **Patterns page needs review** — currently the most complex and challenging
  page; may be over the heads of its audience.
- **Phone format is a latent strength** — kids could pick up a phone in an idle
  moment and play Tilt instead of doomscrolling. Worth keeping phone-first
  thinking as a lens on everything.

### Wittgenstein's ladder
The app is a ladder that gets kicked away once climbed — a modest, useful,
short-lived thing. Two readings noted: it releases the urge to polish
endlessly, AND it makes *adaptive* more interesting, not less — a ladder that
notices who's climbing serves the next child better, and the adaptive idea
carries forward into every future project even after this app is discarded.

### Flipper — the subtlety ladder and its ceiling
Roger's design instinct: pairs get *more subtle* as you go —
- easy: same shape, same everything
- then: same triangle, different orientation → still a pair?
- then: different size, different colour → still a pair?
- then: IQ-test territory — reflections vs rotations, sequences of shapes
Open worry (his): how quickly does the quiet medium tire? Same presentation
every game — the subtlety ladder is the built-in answer, but there may be a
presentation ceiling regardless. Worth remembering flipper was always the
recreation piece (his "kleine Nachtmusik"), not the serious project.

### Blocks
A rich area "that maybe needs a discovery makeover" — the recursion chain
(unit → rod → flat → cube, one material across HTU/fractions/symmetry) with
discovery+nudging rather than instruction. Connects: UnitsLab (drag/fuse
squares), the 1000-cube pptx storyboard, RotateBricks' parked diagonal-halves.

### Sequencing (his own call, sensible)
- Web first. A Swift port is feasible but should wait until the web is more
  mature AND contains adaptive — otherwise too many versions in different
  places, more confusion than progress.
- Adaptive in tables is the most promising direction (both agreed);
  flipper is the rest-project; the handwriting doorway is the
  biggest-but-later project.
- Ranked promise (Devin's list): 1 adaptive tables · 2 handwriting doorway ·
  3 HTU blocks · 4 flipper matchers.

### For next session
- He's stepping back for a bit — nothing is urgent.
- Outstanding small items (unchanged): `#mstat` status line removal on tilt
  pages (awaiting his word); Google Search Console submission (needs his Google
  account, ~5 guided minutes).
- The lost penmanship/join-the-dots page may live on the Mint PC (server was
  off) or an old iPad — look there if it ever matters.

## Contraptions — earned construction (Roger's idea, ~03:25)

The Incredible Machine lineage (Dynamix/Sierra): TIM 1992-95, *Return of the
Incredible Machine: Contraptions* 2000 (the one with lasers), *Even More
Contraptions* 2001 — Dynamix's last game before Sierra/Vivendi closed them.
Died of corporate death, not bad design; never marketed to schools.

**The idea:** machine-*parts* as cumulative rewards — earn contraption parts
through successful play in the maths games; a workshop/sandbox page where the
earned parts assemble into machines that actually run. Play earns play:
effort → exploration. Turns the site from six pages into one place with an
economy. Design cautions noted: reward *accuracy/care* not speed (else a
child grinds the tables badly for parts); the workshop itself must be fun or
the currency is worthless; localStorage can carry the inventory between
games — no server needed.

## Staircase, not courtroom (Roger's plagiarism inversion, ~03:45)
Imitation is the engine of learning — instead of fighting it, exploit it:
let players copy and remix each other's contraptions with credit built in
("based on Tom's machine"). The community becomes a staircase rather than a
courtroom. Newton's 1675 letter to Hooke ("standing on the shoulders of
giants") — itself borrowed from Bernard of Chartres. Partner-artist may
draw original parts art → solves plagiarism AND becomes the signature look.

## Selection mods + tilt-ball trial (evening session)
Built and committed to mix-demo — NOT yet published; test locally:
- **progress.js** (new): shared visit record — one localStorage key, written only when the visitor says "keep this for next time?" at a completion; returning visitors get "carry on — or start fresh?". Shared chip vocabulary: .uw-made (faint ring), .uw-suggest (warm edge = next school-order table), .uw-far (cool dim = open but ahead), .uw-cap (dimmed past the multi-select cap).
- **search-lab3**: opens uncommitted — lit chips over an empty board, first tap deals.
- **honeycomb**: already opened uncommitted; gained the shared vocabulary + cap-dim.
- **snake-puzzle**: now opens in the existing 'choose' state — no default ×3.
- **tilt-snake**: covering picker overlay retired; bottom chips instead, permission overlay still follows the pick.
- **tilt-ball**: a game is now 3 clean racks (GAME_RACKS); encore = every earned ball loose on the cushions ~4.8s, drains one by one, HouseSnake wink, then "Another game?". Wrong-home bounce keeps ×0.7 speed (chains die naturally); 3 refusals in a row = 0.6s coasting stillness. Churn/dents NOT built — parked.
- **intro.html**: I drafted the honest qualifier on "No data collection" — *"your device may remember your progress if you ask it to; nothing is ever sent anywhere."* Roger's text to reword — mine is a placeholder.

## Open items (decided later, don't lose)
- **Tap-to-steer assist**: left as-is in both tilt games for now — unresolved whether it should gate behind ?assist. Roger: "leave but note so it returns and is not forgotten".
- **Recital earned a menu tile** — the menu's missing "demonstration" page; the index is full at 6 cards, so a 7th card deals a third row (Roger mused about theatrical card-disappearing too — circular wipe).
- **F1-straw-bale refusal**: wrong recital sequence should spin off comically into the straw, not fail — "not too exciting to aim for".
- **Menu-card theatre**: a card could temporarily vanish (circular wipe) and return — parked idea, his.
- **Snake-puzzle theatrical opening**: the 'choose' state currently shows text "pick a table"; Roger wants a blank board with the first tap fading the snake up in colour — polish pending.
- **Churn + dents + rack-order difficulty** in tilt-ball: spec'd in discussion only; churn/dents off for this trial.

## Roger's post-test notes (11:18-11:32)
- Touch-drag in snake-puzzle on phone: "PERFECT".
- Encore feels two-phase ("whistle blows, everybody goes away") — wants natural Brownian drift with balls sinking at their own pace, visible POP on the last, then the head appears and enlarges with eye movement into a smile/wink.
- Three racks feels overlong — try 2.
- mix-patterns too crowded on phone: numerals on smaller tiles; touch → fade into enlarged draggable pattern tile; same touch ring as puzzle.
- Touch ring: formalise as a shared house gesture (his question, my yes — cheap-to-change early decision).
- His dilemma note: "good early decisions save much fiddling... but early cut and dried inhibits creativity" — resolution we agreed: decide early only what's cheap to change, stay loose on what's expensive to feel.
