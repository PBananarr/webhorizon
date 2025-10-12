/* 
-------------------- main.js --------------------
*/

// Mobile nav toggle + close on link / outside / ESC
const nav    = document.getElementById('nav');
const toggle = document.querySelector('.nav-toggle');

const openNav = () => {
  nav.classList.add('open');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
};

const closeNav = () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
};

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const willOpen = !nav.classList.contains('open');
    willOpen ? openNav() : closeNav();
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('open')) return;
    const clickedInsideNav    = nav.contains(e.target);
    const clickedToggleButton = toggle.contains(e.target);
    if (!clickedInsideNav && !clickedToggleButton) closeNav();
  }, { capture: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeNav();
      toggle.focus();
    }
  });
}

// IntersectionObserver reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, {threshold: .2});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Prozess: aktiven Step + Fortschritt ermitteln
(() => {
  const steps = Array.from(document.querySelectorAll('#prozess .steps .step'));
  const fill = document.querySelector('#prozess .progress-fill');
  if (!steps.length || !fill) return;

  const inView = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-active');
      else e.target.classList.remove('is-active');
    });
    // Fortschritt: Anteil sichtbarer/abgeschlossener Steps
    const idx = Math.max(0, steps.findLastIndex(s => s.classList.contains('is-active')));
    const ratio = (idx + 1) / steps.length;
    fill.style.width = (ratio * 100).toFixed(1) + '%';
  }, { rootMargin: "-30% 0px -50% 0px", threshold: 0.01 });

  steps.forEach(s => inView.observe(s));
})();


// Gallery basic slider (buttons + drag/swipe)
const gallery = document.querySelector('.gallery');
if (gallery) {
  const track = gallery.querySelector('.gallery-track');
  const prev = gallery.querySelector('.prev');
  const next = gallery.querySelector('.next');

  let index = 0;
  const to = (i) => {
    index = Math.max(0, Math.min(i, track.children.length - 1));
    track.scrollTo({left: track.clientWidth * index, behavior: 'smooth'});
  };

  prev.addEventListener('click', () => to(index - 1));
  next.addEventListener('click', () => to(index + 1));

  // drag/swipe
  let startX = 0;
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointerup',   (e) => {
    const dx = e.clientX - startX;
    if (dx > 40) to(index-1);
    if (dx < -40) to(index+1);
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

// ===== HERO STARFIELD: Sterne global im Hero ==================
(() => {
  const hero = document.querySelector('.hero');
  const field = hero?.querySelector('.hero-stars');
  if (!hero || !field) return;

  const base = 120;
  const extra = Math.round((window.innerWidth * window.innerHeight) / (1200 * 800) * 60);
  const make = (n) => {
    field.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      const size = Math.random() < 0.85 ? 2 : 3;
      s.style.left = (Math.random() * 100) + '%';
      s.style.top  = (Math.random() * 100) + '%';
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.animationDelay = (Math.random() * 6) + 's';
      field.appendChild(s);
    }
  };
  make(Math.min(260, base + extra));

  let t = null;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const extra = Math.round((window.innerWidth * window.innerHeight) / (1200 * 800) * 60);
      make(Math.min(260, base + extra));
    }, 150);
  });
})();


// Leistungen: Hover/Tap-Fokus für Mockup-Bilder
(() => {
  const root = document.querySelector('#leistungen .responsive-mockup');
  if (!root) return;

  const items = Array.from(root.querySelectorAll('.rm-device'));
  const activate = (el, autoClearMs = 2500) => {
    items.forEach(i => i.classList.remove('is-active'));
    el.classList.add('is-active');
    clearTimeout(el._gh_clear);
    if (autoClearMs) el._gh_clear = setTimeout(() => el.classList.remove('is-active'), autoClearMs);
  };

  items.forEach(el => {
    el.addEventListener('pointerenter', () => activate(el, 0));        // Desktop-Hover (bleibt aktiv, bis man rausgeht)
    el.addEventListener('pointerdown',  () => activate(el, 2500));     // Tap: hebt kurz hervor
  });

  root.addEventListener('pointerleave', () => {
    items.forEach(i => i.classList.remove('is-active'));
  });
})();
