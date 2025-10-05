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

