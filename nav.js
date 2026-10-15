/* Shared unobtrusive menu — every page includes this one file.
   Add or reorder entries in ITEMS and all pages update together.
   Entries: {label, href} for a page link, {label, action} for a
   function, {type:'sep'} for a divider. `children:[...]` makes a
   submenu (indented group shown when the parent is tapped). */
(function () {
  'use strict';

  const ITEMS = [
    { label: 'Home', href: 'index.html' },
    { label: 'Table Snake', href: 'snake.html' },
    { label: 'Tilt Ball', href: 'ball.html' },
    { type: 'sep' },
    { label: 'Fullscreen', action: 'fullscreen' },
    { label: 'Feedback', href: 'feedback.html' },
  ];

  const css = `
    #navBurger {
      position: fixed;
      top: calc(env(safe-area-inset-top, 0px) + 8px);
      right: 8px;
      width: 40px; height: 40px;
      border-radius: 10px;
      border: 1px solid #3a4a58;
      background: rgba(20, 28, 36, .65);
      z-index: 40;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 4px; padding: 0; cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    #navBurger span {
      display: block; width: 16px; height: 2px;
      background: #b9c8d4; border-radius: 1px;
    }
    #navPanel {
      position: fixed;
      top: calc(env(safe-area-inset-top, 0px) + 54px);
      right: 8px;
      min-width: 170px;
      background: rgba(14, 20, 26, .96);
      border: 1px solid #2c3e50;
      border-radius: 12px;
      padding: 6px;
      z-index: 39;
      font-family: -apple-system, system-ui, sans-serif;
    }
    #navPanel.hidden { display: none; }
    #navPanel a, #navPanel button, #navPanel .group {
      display: block; width: 100%;
      padding: 12px 14px;
      color: #cfd8e0; font-size: 15px;
      text-align: left; text-decoration: none;
      background: none; border: none;
      border-radius: 8px; cursor: pointer;
      box-sizing: border-box;
      font-family: inherit;
    }
    #navPanel a:active, #navPanel button:active { background: #24303c; }
    #navPanel .sub { padding-left: 28px; font-size: 14px; color: #9fb0bd; }
    #navPanel .sep { border-top: 1px solid #2c3e50; margin: 6px 4px; }

    /* pull-tab: appears only while fullscreen, taps exit. The platform's
       own exit control (an x top-left, or a swipe-down gesture) still
       exists underneath — it cannot be suppressed — this just gives the
       exit a clearer, labelled door. */
    #navPullTab {
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 72px; height: calc(env(safe-area-inset-top, 0px) + 22px);
      border: 1px solid #3a4a58; border-top: none;
      border-radius: 0 0 12px 12px;
      background: rgba(20, 28, 36, .65);
      z-index: 38;
      display: none;
      align-items: flex-end; justify-content: center;
      padding-bottom: 4px;
      color: #b9c8d4; font-size: 13px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    #navPullTab.on { display: flex; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const burger = document.createElement('button');
  burger.id = 'navBurger';
  burger.setAttribute('aria-label', 'Menu');
  burger.innerHTML = '<span></span><span></span><span></span>';

  const panel = document.createElement('nav');
  panel.id = 'navPanel';
  panel.className = 'hidden';

  function toggleFullscreen() {
    const d = document;
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    } else {
      const el = d.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) Promise.resolve(req.call(el)).catch(() => { });
    }
  }

  function addRow(item, parent, sub) {
    if (item.type === 'sep') {
      const s = document.createElement('div');
      s.className = 'sep';
      parent.appendChild(s);
      return;
    }
    let el;
    if (item.href) {
      el = document.createElement('a');
      el.href = item.href;
    } else {
      el = document.createElement('button');
      el.addEventListener('click', () => {
        if (item.action === 'fullscreen') toggleFullscreen();
        close();
      });
    }
    el.textContent = item.label;
    if (sub) el.className = 'sub';
    parent.appendChild(el);
    if (item.children) item.children.forEach(c => addRow(c, parent, true));
  }
  ITEMS.forEach(i => addRow(i, panel, false));

  /* pull-tab: visible only while an element is fullscreen; tap = exit */
  const pullTab = document.createElement('div');
  pullTab.id = 'navPullTab';
  pullTab.textContent = '⌄';
  pullTab.setAttribute('role', 'button');
  pullTab.setAttribute('aria-label', 'Exit fullscreen');
  pullTab.addEventListener('click', () => {
    const d = document;
    (d.exitFullscreen || d.webkitExitFullscreen).call(d);
  });
  function syncPullTab() {
    pullTab.classList.toggle('on',
      !!(document.fullscreenElement || document.webkitFullscreenElement));
  }
  document.addEventListener('fullscreenchange', syncPullTab);
  document.addEventListener('webkitfullscreenchange', syncPullTab);

  function close() { panel.classList.add('hidden'); }
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('hidden');
  });
  document.addEventListener('pointerdown', (e) => {
    if (!panel.classList.contains('hidden')
      && !panel.contains(e.target) && e.target !== burger) close();
  });

  document.body.appendChild(burger);
  document.body.appendChild(panel);
  document.body.appendChild(pullTab);
})();
