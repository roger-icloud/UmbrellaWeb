/* progress.js — the visit record + shared chip vocabulary (Roger 2026-11-18).
   Pages call:

     UW.boot(page)            — once, after chipRow exists: injects the
                                vocabulary CSS.
     UW.completed(page, [ts]) — at a finished round: records the table(s)
                                on this page.
     UW.paint(row, page)      — re-apply vocabulary after chips re-render.

   Chip classes: .uw-made = faint ring in the table's hue (done);
   .uw-suggest = warm edge (the next school-order table);
   .uw-far = cool, dim edge (open, but ahead of the suggestion).

   The record is session-only: the "carry on / start fresh?" prompt and
   its localStorage consent flow were retired 2026-11-19 (Roger — the
   pill was too long for a phone and bought little). Persistence
   returns when names & progress are stored properly; until then the
   vocabulary simply marks what this visit has done. */
(function () {
  const SCHOOL = [2, 5, 10, 3, 4, 6, 8, 9, 7, 11, 12];
  const memory = { pages: {} };

  /* ---------- public ---------- */
  window.UW = {
    boot(page) {
      injectCSS();
    },
    completed(page, ts) {
      const p = memory.pages[page] || (memory.pages[page] = {});
      (Array.isArray(ts) ? ts : [ts]).forEach(t => { p[t] = (p[t] || 0) + 1; });
    },
    done(page) { return Object.keys(memory.pages[page] || {}).map(Number); },
    suggest(page, maxT) {
      const done = new Set(UW.done(page));
      return SCHOOL.find(t => t <= maxT && !done.has(t)) || 0;
    },
    paint(row, page) {
      const btns = [...row.children];
      const done = new Set(UW.done(page));
      const maxT = btns.length + 1;
      const sug = UW.suggest(page, maxT);
      const sugIdx = SCHOOL.indexOf(sug);
      btns.forEach((b, i) => {
        const t = i + 2;
        const m = done.has(t);
        b.classList.toggle('uw-made', m);
        b.classList.toggle('uw-suggest', !m && t === sug);
        b.classList.toggle('uw-far', !m && sug &&
          SCHOOL.indexOf(t) > sugIdx);
        b.style.setProperty('--uw-made', m ?
          'hsla(' + ((t * 31 + 200) % 360) + ',60%,55%,.55)' : '');
      });
    },
  };

  let cssDone = false;
  function injectCSS() {
    if (cssDone) return; cssDone = true;
    const s = document.createElement('style');
    s.textContent = `
      #chipRow button.uw-made { box-shadow: inset 0 0 0 2px var(--uw-made, rgba(140,255,180,.5)); }
      #chipRow button.uw-suggest { box-shadow: 0 0 0 2px rgba(255,196,96,.75), 0 0 12px rgba(255,196,96,.3); }
      #chipRow button.uw-far { opacity: .42; }
      #chipRow button.uw-cap { opacity: .42; }
    `;
    document.head.appendChild(s);
  }
})();
