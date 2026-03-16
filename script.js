// Initial Setup & Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
  }
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    scrollProgress.style.width = progress + '%';
  }
});


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
    document.body.style.overflow = open ? 'hidden' : '';
    toggle.querySelector('.icon').textContent = open ? '✕' : '☰';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.querySelector('.icon').textContent = '☰';
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
  const phrases = ['Shubham Kumar', 'a Full-Stack Web Developer', 'a Website Designer', 'a Problem Solver'];
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

// Skill scroll animation with staggering
(function () {
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const grid = entry.target.closest('.skills-grid');
        if (grid) {
          const gridCards = Array.from(grid.querySelectorAll('.skill-card'));
          gridCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate');
            }, index * 100);
          });
          observer.unobserve(entry.target);
        } else {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      }
    });
  }, observerOptions);

  // We observe the grid or the cards? Observing the grid container might be better for staggering 
  // but the user might scroll slowly. Staggering within a grid when the first card hits is common.
  const grids = document.querySelectorAll('.skills-grid');
  grids.forEach(grid => observer.observe(grid));
})();

// Section entry animation (Fade In Up)
(function () {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
})();

// Scroll Spy: Update active nav link on scroll
(function () {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });
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

// Interactive background particles
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  }

  window.addEventListener('resize', resize);
  resize();

  function init() {
    particles = [];
    const numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const directionX = (Math.random() * 1) - 0.5;
      const directionY = (Math.random() * 1) - 0.5;
      const color = 'rgba(124, 58, 237, 0.3)';
      particles.push({ x, y, directionX, directionY, size, color });
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.directionX;
      p.y += p.directionY;

      if (p.x > canvas.width || p.x < 0) p.directionX = -p.directionX;
      if (p.y > canvas.height || p.y < 0) p.directionY = -p.directionY;

      // Mouse interaction
      let dx = mouse.x - p.x;
      let dy = mouse.y - p.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        if (mouse.x < p.x && p.x < canvas.width - p.size * 10) p.x += 1;
        if (mouse.x > p.x && p.x > p.size * 10) p.x -= 1;
        if (mouse.y < p.y && p.y < canvas.height - p.size * 10) p.y += 1;
        if (mouse.y > p.y && p.y > p.size * 10) p.y -= 1;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect lines
      for (let j = i; j < particles.length; j++) {
        let p2 = particles[j];
        let dx2 = p.x - p2.x;
        let dy2 = p.y - p2.y;
        let dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (dist2 < 120) {
          ctx.strokeStyle = `rgba(6, 182, 212, ${1 - dist2 / 120})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  animate();
})();