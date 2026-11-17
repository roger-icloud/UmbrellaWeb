/* hint.js — one fading-help law for the whole family of games.

   The idea (Roger, 2026-11-16): help should behave like a good teacher.
   Early on it arrives instantly and speaks clearly. As the player proves
   themselves — each game finished — help waits longer before speaking,
   and speaks more softly when it does. After enough wins it stays quiet:
   the teacher steps back.

   Every game uses the same law, so "the hint feels the same" everywhere.
   What glows (a number, a bead, a hole) is still each game's own choice —
   this file only decides WHEN and HOW STRONGLY.

   Use:
     const k = Hint.strength(idleSeconds, gamesDone);
   k is a number from 0 (no help) to 1 (full help). Games typically:
     · start marking a target once k passes a small value (~0.05)
     · add their bigger "please look here" cue as k climbs (~0.3+)
*/
'use strict';
const Hint = {
  /* WAIT grows a little per game won — help is ever less hasty.
     CAP  sinks a quarter per game won — help is ever softer-spoken,
          reaching silence on the fifth win. */
  WAIT_PER_GAME: 3.5,   // seconds extra patience each win
  CAP_PER_GAME: 0.25,   // quarter-voice lost each win
  RAMP: 6,              // seconds to swell from whisper to full strength

  strength(idle, gamesDone) {
    const wait = gamesDone * this.WAIT_PER_GAME;
    const cap = Math.max(0, 1 - gamesDone * this.CAP_PER_GAME);
    if (cap <= 0 || idle <= wait) return 0;
    return Math.min(cap, (idle - wait) / this.RAMP);
  }
};
