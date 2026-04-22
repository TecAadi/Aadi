/* ===================================================
   HERO ANIMATION
   Part 1 – Background floating-particle network canvas
   Part 2 – Data pipeline card stage cycler
   =================================================== */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════
     PART 1 · BACKGROUND PARTICLE NETWORK CANVAS
     Renders subtle, slow-moving particles connected
     by faint lines — sits behind all hero content.
  ══════════════════════════════════════════════════ */
  const bgCanvas = document.getElementById('hero-bg-canvas');
  if (bgCanvas) {
    const bctx = bgCanvas.getContext('2d');
    let bW = 0, bH = 0;
    const PARTS = [];
    const N = 60;
    const LINK_DIST = 115;

    const COLORS = [[77,163,255],[0,229,255],[168,85,247]];

    function mkP() {
      return {
        x: Math.random() * bW,
        y: Math.random() * bH,
        r: 0.8 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        a: 0.12 + Math.random() * 0.28,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }

    function resizeBg() {
      const dpr = window.devicePixelRatio || 1;
      bW = bgCanvas.offsetWidth;
      bH = bgCanvas.offsetHeight;
      bgCanvas.width  = bW * dpr;
      bgCanvas.height = bH * dpr;
      bctx.scale(dpr, dpr);
      PARTS.length = 0;
      for (let i = 0; i < N; i++) PARTS.push(mkP());
    }

    let rafBg;
    function drawBg() {
      bctx.clearRect(0, 0, bW, bH);

      /* connecting lines */
      for (let i = 0; i < PARTS.length; i++) {
        for (let j = i + 1; j < PARTS.length; j++) {
          const p = PARTS[i], q = PARTS[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK_DIST) {
            bctx.beginPath();
            bctx.moveTo(p.x, p.y);
            bctx.lineTo(q.x, q.y);
            bctx.strokeStyle = `rgba(77,163,255,${0.055 * (1 - d / LINK_DIST)})`;
            bctx.lineWidth = 0.8;
            bctx.stroke();
          }
        }
      }

      /* particles */
      PARTS.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > bW) p.vx *= -1;
        if (p.y < 0 || p.y > bH) p.vy *= -1;
        bctx.beginPath();
        bctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`;
        bctx.fill();
      });

      rafBg = requestAnimationFrame(drawBg);
    }

    resizeBg();
    drawBg();
    window.addEventListener('resize', resizeBg);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafBg);
      else drawBg();
    });
  }

  /* ══════════════════════════════════════════════════
     PART 2 · DATA PIPELINE STAGE CYCLER
     Cycles through 5 stages, each ~3.8 s:
       0 Raw Data → 1 Clean It → 2 Analyze It →
       3 Build ML Model → 4 Gen Insights → (loop)
     Also syncs the hero tagline highlights.
  ══════════════════════════════════════════════════ */
  const STAGE_MS = 3800;   /* duration per stage (ms) */

  const STAGES = [
    { name: 'Raw Data',       icon: '📋', color: '#f97316' },
    { name: 'Clean It',       icon: '🧹', color: '#22c55e' },
    { name: 'Analyze It',     icon: '📊', color: '#4da3ff' },
    { name: 'Build ML Model', icon: '🤖', color: '#a855f7' },
    { name: 'Gen Insights',   icon: '💡', color: '#00e5ff' },
  ];

  /* DOM refs */
  const stageEls = STAGES.map((_, i) => document.getElementById(`dps${i}`));
  const dotEls   = Array.from(document.querySelectorAll('.dpcnd'));
  const nameEl   = document.getElementById('dpcName');
  const iconEl   = document.getElementById('dpcIcon');
  const progEl   = document.getElementById('dpcProgFill');
  const tagEls   = document.querySelectorAll('.tag-highlight[data-stage]');

  let cur = 0;

  /* ── go to a stage ── */
  function go(idx) {
    /* hide all */
    stageEls.forEach(el => el && el.classList.remove('active'));
    dotEls.forEach(d => d.classList.remove('active'));
    tagEls.forEach(t => t.classList.remove('tl-active'));

    /* activate target */
    if (stageEls[idx]) stageEls[idx].classList.add('active');
    if (dotEls[idx])   dotEls[idx].classList.add('active');

    if (nameEl) {
      nameEl.textContent = STAGES[idx].name;
      nameEl.style.color = STAGES[idx].color;
    }
    if (iconEl) iconEl.textContent = STAGES[idx].icon;

    /* highlight matching tagline spans */
    tagEls.forEach(t => {
      if (parseInt(t.dataset.stage, 10) === idx) t.classList.add('tl-active');
    });

    /* special: ML accuracy ring on stage 3 */
    if (idx === 3) animateMLRing();

    /* progress bar */
    restartProgress();
    cur = idx;
  }

  /* ── progress bar ── */
  function restartProgress() {
    if (!progEl) return;
    progEl.style.transition = 'none';
    progEl.style.width = '0%';
    void progEl.offsetWidth;                                /* force reflow */
    progEl.style.transition = `width ${STAGE_MS}ms linear`;
    progEl.style.width = '100%';
  }

  /* ── ML accuracy ring & counter animation ── */
  function animateMLRing() {
    const numEl = document.getElementById('mlAccNum');
    const ring  = document.getElementById('mlRingFill');
    if (!numEl || !ring) return;

    const circumference = 2 * Math.PI * 38;   /* r = 38, circ ≈ 238.76 */
    const targetAcc = 87;

    numEl.textContent = '0';
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = circumference;
    void ring.offsetWidth;
    ring.style.transition = `stroke-dashoffset 2.2s cubic-bezier(0.25, 1, 0.5, 1)`;

    let t0 = null;
    const dur = 2200;

    function tick(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);        /* ease-out cubic */
      numEl.textContent = Math.round(e * targetAcc);
      ring.style.strokeDashoffset = circumference * (1 - (e * targetAcc) / 100);
      if (p < 1) requestAnimationFrame(tick);
    }

    setTimeout(() => requestAnimationFrame(tick), 200);
  }

  /* ── init & cycle ── */
  function init() {
    go(0);
    setInterval(() => go((cur + 1) % STAGES.length), STAGE_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
