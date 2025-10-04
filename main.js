// Mobile nav toggle
const nav = document.getElementById('nav');
const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// IntersectionObserver reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
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
  let startX = 0, scrolling = false;
  track.addEventListener('pointerdown', (e) => { scrolling = true; startX = e.clientX; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointerup',   (e) => { scrolling = false; const dx = e.clientX - startX; if (dx > 40) to(index-1); if (dx < -40) to(index+1); });
}

document.getElementById('year').textContent = new Date().getFullYear();

// Hero: Device-Interaktion
const stack = document.querySelector('.device-stack');
if (stack) {
  const devices = Array.from(stack.querySelectorAll('.device'));

  // einfache Detection: kein Hover = Touchgerät
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const setActive = (el) => {
    const isActive = el.classList.contains('is-active');
    devices.forEach(d => { d.classList.remove('is-active'); d.setAttribute('aria-pressed', 'false'); });
    stack.classList.remove('has-active');

    if (!isActive) {
      el.classList.add('is-active');
      el.setAttribute('aria-pressed', 'true');
      stack.classList.add('has-active');
    }
  };

  if (isTouch) {
    // Nur auf Touch-Geräten Klick/Key aktivieren
    devices.forEach(d => {
      d.addEventListener('click', () => setActive(d));
      d.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(d); }
      });
    });
  }
}


