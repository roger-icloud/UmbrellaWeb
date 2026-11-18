/* progress.js — the visit record + shared chip vocabulary (Roger 2026-11-18).
   One localStorage key, 'uw-progress': per page, which tables this device
   has finished (with counts). It is written ONLY when the visitor says
   keep it — the record never leaves the device; nothing is sent anywhere
   (the intro's promise stays true). Pages call:

     UW.boot(page)            — once, after chipRow exists: injects the
                                vocabulary CSS, asks "carry on or start
                                fresh?" when a kept record returns.
     UW.completed(page, [ts]) — at a finished round: records the table(s)
                                on this page; if the visitor hasn't been
                                asked, quietly offers "keep this for next
                                time?" — yes/no, asked once.
     UW.paint(row, page)      — re-apply vocabulary after chips re-render.

   Chip classes: .uw-made = faint ring in the table's hue (done);
   .uw-suggest = warm edge (the next school-order table);
   .uw-far = cool, dim edge (open, but ahead of the suggestion). */
(function () {
  const KEY = 'uw-progress';
  const SCHOOL = [2, 5, 10, 3, 4, 6, 8, 9, 7, 11, 12];

  let rec = null;
  try { rec = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  let keep = rec && rec.keep === 'yes' ? 'yes'
           : rec && rec.keep === 'no' ? 'no' : null;
  /* the record this visit plays against — a kept one returns; anything
     else starts fresh (and stays session-only until asked) */
  let memory = keep === 'yes' && rec && rec.pages ? rec : { pages: {} };
  const saved = keep === 'yes' && Object.keys(memory.pages).length > 0;

  function write() {
    if (keep !== 'yes') return;
    try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (e) {}
  }

  /* ---------- the two consent moments ---------- */
  function ask(text, yesLabel, noLabel, cb) {
    const el = document.createElement('div');
    el.className = 'uw-ask';
    el.innerHTML = '<span>' + text + '</span>';
    const yes = document.createElement('button');
    yes.textContent = yesLabel;
    const no = document.createElement('button');
    no.className = 'quiet';
    no.textContent = noLabel;
    el.appendChild(yes); el.appendChild(no);
    document.body.appendChild(el);
    const done = (v) => { el.remove(); cb(v); };
    yes.onclick = () => done(true);
    no.onclick = () => done(false);
    setTimeout(() => { if (el.parentNode) done(false); }, 30000);
  }

  let askedKeep = false;
  function maybeAskKeep() {
    if (askedKeep || keep !== null) return;
    askedKeep = true;
    ask('keep this for next time?', 'yes', 'no', v => {
      keep = v ? 'yes' : 'no';
      memory.keep = keep;
      if (v) write();
      else try { localStorage.removeItem(KEY); } catch (e) {}
    });
  }

  /* ---------- public ---------- */
  window.UW = {
    boot(page) {
      injectCSS();
      if (saved) {
        ask('carry on where you left off — or start fresh?', 'carry on', 'start fresh', v => {
          if (!v) {
            memory = { pages: {}, keep: 'yes' };
            write();
            const row = document.getElementById('chipRow');
            if (row) UW.paint(row, page);
          }
        });
      }
    },
    completed(page, ts) {
      const p = memory.pages[page] || (memory.pages[page] = {});
      (Array.isArray(ts) ? ts : [ts]).forEach(t => { p[t] = (p[t] || 0) + 1; });
      write();
      maybeAskKeep();
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
    keep() { return keep; },
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
      .uw-ask { position: fixed; left: 50%; bottom: 76px; transform: translateX(-50%);
        z-index: 70; display: flex; gap: 10px; align-items: center;
        background: rgba(16,22,28,.94); color: #cfe8d8;
        border: 1px solid rgba(140,255,170,.28); border-radius: 999px;
        padding: 9px 8px 9px 16px; font: 14px/1.2 system-ui, sans-serif;
        box-shadow: 0 4px 22px rgba(0,0,0,.5); }
      .uw-ask button { border: 1px solid rgba(140,255,170,.4); background: rgba(140,255,170,.12);
        color: #dff5e8; border-radius: 999px; padding: 5px 14px;
        font: 13px system-ui, sans-serif; cursor: pointer; }
      .uw-ask button.quiet { border-color: rgba(255,255,255,.16); background: none;
        color: rgba(207,232,216,.6); }
    `;
    document.head.appendChild(s);
  }
})();
