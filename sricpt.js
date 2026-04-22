/* ===== NAVBAR SCROLL EFFECT ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled style
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link highlight
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinksMenu.classList.toggle('open');
  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('active');
  if (hamburger.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu when a nav link is clicked
navLinksMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksMenu.classList.remove('open');
    hamburger.classList.remove('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ===== SCROLL REVEAL ===== */
function setupReveal() {
  // Add reveal classes to elements
  const revealTargets = [
    { selector: '.section-header',   cls: 'reveal' },
    { selector: '.about-visual',     cls: 'reveal-left' },
    { selector: '.about-content',    cls: 'reveal-right' },
    { selector: '.skill-card',       cls: 'reveal' },
    { selector: '.project-card',     cls: 'reveal' },
    { selector: '.contact-card',     cls: 'reveal' },
    { selector: '.contact-subtitle', cls: 'reveal' },
    { selector: '.about-text',       cls: 'reveal' },
    { selector: '.about-traits',     cls: 'reveal' },
  ];

  revealTargets.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(cls);
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* ===== TYPING TAGLINE EFFECT ===== */
function setupTypingEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  // Store original HTML then re-animate opacity of each word span
  const highlights = tagline.querySelectorAll('.tag-highlight');
  highlights.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transition = `opacity 0.5s ease ${0.8 + i * 0.35}s`;
    setTimeout(() => {
      el.style.opacity = '1';
    }, (0.8 + i * 0.35) * 1000);
  });
}

/* ===== SKILL CARD COLOR RIPPLE ===== */
function setupSkillHover() {
  document.querySelectorAll('.skill-card').forEach(card => {
    const iconWrap = card.querySelector('.skill-icon-wrap');
    const color = getComputedStyle(iconWrap).getPropertyValue('--c').trim() || '#4da3ff';

    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--c', color);
    });
  });
}

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
  const stats = [
    { el: document.querySelector('.stat:nth-child(1) .stat-num'), target: 3,  suffix: '+' },
    { el: document.querySelector('.stat:nth-child(3) .stat-num'), target: 5,  suffix: '+' },
  ];

  const observerC = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stats.forEach(({ el, target, suffix }) => {
          if (!el) return;
          let count = 0;
          const step = Math.ceil(target / 20);
          const timer = setInterval(() => {
            count = Math.min(count + step, target);
            el.textContent = count + suffix;
            if (count >= target) clearInterval(timer);
          }, 60);
        });
        observerC.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observerC.observe(heroStats);
}

/* ===== CURSOR GLOW EFFECT on Cards ===== */
function setupCardGlow() {
  const cards = document.querySelectorAll('.project-card, .skill-card, .contact-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, #131c35 0%, #0f1629 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
}

/* ===== SMOOTH SCROLL FALLBACK ===== */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  setupTypingEffect();
  setupSkillHover();
  animateCounters();
  setupCardGlow();
});


/* ═══════════════════════════════════════════════════════
   INTERACTIVE ADDITIONS  (append-only — nothing above is touched)
═══════════════════════════════════════════════════════ */

/* ── 1. SCROLL PROGRESS BAR ── */
function setupScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    bar.style.width = ((window.scrollY / total) * 100).toFixed(2) + '%';
  }, { passive: true });
}

/* ── 2. CURSOR GLOW  (desktop / pointer device only) ── */
function setupCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  document.body.appendChild(glow);

  let tx = -300, ty = -300; // target position
  let cx = -300, cy = -300; // current (lerped) position

  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  (function lerpLoop() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    glow.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) translate(-50%, -50%)`;
    requestAnimationFrame(lerpLoop);
  })();

  // Expand on interactive elements
  const interactive = document.querySelectorAll(
    'a, button, .skill-card, .project-card, .contact-card, .nav-link, .btn'
  );
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => glow.classList.remove('is-hovering'));
  });

  document.addEventListener('mousedown', () => glow.classList.add('is-clicking'));
  document.addEventListener('mouseup',   () => glow.classList.remove('is-clicking'));
}

/* ── 3. 3-D CARD TILT (project / skill / contact cards) ── */
function setupCardTilt() {
  const MAX_ROT = 10;
  document.querySelectorAll('.project-card, .skill-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transition = 'box-shadow 0.2s ease';
      card.style.transform  =
        `perspective(700px) rotateY(${(x * MAX_ROT).toFixed(2)}deg) ` +
        `rotateX(${(-y * MAX_ROT * 0.7).toFixed(2)}deg) translateZ(12px) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease';
      card.style.transform  = '';
    });
  });
}

/* ── 4. CLICK PARTICLE BURST ── */
function setupClickBurst() {
  const COLORS = ['#4da3ff', '#00e5ff', '#a855f7', '#ffffff', '#22c55e'];
  const COUNT  = 10;

  document.addEventListener('click', e => {
    for (let i = 0; i < COUNT; i++) {
      const dot = document.createElement('span');
      dot.className   = 'click-particle';
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
      dot.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];

      const size = 3 + Math.random() * 4;
      dot.style.width  = size + 'px';
      dot.style.height = size + 'px';

      const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const dist  = 35 + Math.random() * 55;
      const tx    = Math.cos(angle) * dist;
      const ty    = Math.sin(angle) * dist;

      document.body.appendChild(dot);

      dot.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
      ], {
        duration: 480 + Math.random() * 280,
        easing:   'cubic-bezier(0,0,0.2,1)',
      }).onfinish = () => dot.remove();
    }
  });
}

/* ── 5. HERO SUBTITLE FADE-CYCLE ── */
function setupTitleCycle() {
  const titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;

  const roles = [
    'Data Analyst <span class="amp">&amp;</span> ML Enthusiast',
    'Python <span class="amp">&amp;</span> Pandas Expert',
    'Data Storyteller <span class="amp">&amp;</span> Insight Generator',
    'ML Model Builder <span class="amp">&amp;</span> Problem Solver',
  ];

  let idx = 0;
  titleEl.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

  setInterval(() => {
    idx = (idx + 1) % roles.length;
    titleEl.style.opacity   = '0';
    titleEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      titleEl.innerHTML       = roles[idx];
      titleEl.style.opacity   = '1';
      titleEl.style.transform = 'translateY(0)';
    }, 370);
  }, 3600);
}

/* ── INIT NEW FEATURES ── */
document.addEventListener('DOMContentLoaded', () => {
  setupScrollProgress();
  setupCursorGlow();
  setupCardTilt();
  setupClickBurst();
  setupTitleCycle();
});