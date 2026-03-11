// Theme persistence
(function () {
  const root = document.documentElement;
  const THEME_KEY = 'preferred-theme';
  function applyTheme(theme) {
    root.classList.remove('theme-light', 'theme-dark');
    if (theme) root.classList.add(theme);
  }
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) applyTheme(saved);
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.classList.contains('theme-dark') ? 'theme-light' : 'theme-dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }
})();

// Mobile nav toggle
(function () {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
})();

// Smooth scrolling
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    });
  });
})();

// Project filtering
(function () {
  const filters = Array.from(document.querySelectorAll('.filter'));
  const cards = Array.from(document.querySelectorAll('#projectList .card'));
  if (!filters.length || !cards.length) return;
  function setActive(btn) {
    filters.forEach(b => b.classList.toggle('active', b === btn));
  }
  function applyFilter(tag) {
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(/\s+/);
      const show = tag === 'all' || tags.includes(tag);
      card.style.display = show ? '' : 'none';
    });
  }
  filters.forEach(btn => btn.addEventListener('click', () => {
    const tag = btn.getAttribute('data-filter') || 'all';
    setActive(btn);
    applyFilter(tag);
  }));
})();

// Rotating headline text
(function () {
  const el = document.getElementById('rotatingText');
  if (!el) return;
  const phrases = ['Shubham Kumar', 'a Developer', 'a Designer', 'a Problem Solver'];
  let index = 0;
  function cycle() {
    const next = phrases[index % phrases.length];
    // simple fade/slide effect using classes
    el.classList.remove('rotate-enter-active');
    el.classList.add('rotate-exit-active');
    setTimeout(() => {
      el.textContent = next;
      el.classList.remove('rotate-exit-active');
      el.classList.add('rotate-enter');
      requestAnimationFrame(() => {
        el.classList.add('rotate-enter-active');
        el.classList.remove('rotate-enter');
      });
    }, 180);
    index += 1;
  }
  setInterval(cycle, 2200);
})();

// Footer year
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

// Contact form: open default mail client with prefilled subject/body
(function () {
  const form = document.getElementById('contactForm');
  const modal = document.getElementById('contactModal');
  const openBtn = document.getElementById('openContact');
  const closeBtn = document.getElementById('closeContact');
  function openModal() { if (modal) modal.classList.add('open'); }
  function closeModal() { if (modal) modal.classList.remove('open'); }
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = /** @type {HTMLInputElement} */(document.getElementById('name')).value.trim();
    const email = /** @type {HTMLInputElement} */(document.getElementById('email')).value.trim();
    const message = /** @type {HTMLTextAreaElement} */(document.getElementById('message')).value.trim();
    const to = 'subhamkumar260506@gmail.com';
    const subject = encodeURIComponent(`New message from ${name || 'Portfolio Visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    closeModal();
  });
})();


