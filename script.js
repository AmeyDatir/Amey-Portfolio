/* ============================================================
   AMEY DATIR — PORTFOLIO  |  script.js
   ============================================================
   TABLE OF CONTENTS
   1. Theme Toggle (Dark / Light)
   2. Scroll Progress Bar
   3. Navbar Stuck State
   4. Typing Animation
   5. GSAP Animations (Hero entrance + Scroll reveals)
   6. Smooth Scroll (nav links)
   7. GSAP Skill List Stagger
   8. Hamburger / Mobile Menu
   ============================================================ */


/* ── 1. THEME TOGGLE ──────────────────────────────────────── */
const htmlEl = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const iconSun  = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

/**
 * Apply dark or light theme
 * @param {boolean} dark - true = dark mode
 */
function applyTheme(dark) {
  htmlEl.classList.toggle('dark', dark);
  iconSun.style.display  = dark ? 'block' : 'none';
  iconMoon.style.display = dark ? 'none'  : 'block';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// On page load: restore saved preference (default = light)
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark');

// Toggle on button click
themeBtn.addEventListener('click', () => {
  applyTheme(!htmlEl.classList.contains('dark'));
});


/* ── 2. SCROLL PROGRESS BAR ───────────────────────────────── */
const progressBar = document.getElementById('bar');

window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct       = (scrolled / maxScroll) * 100;
  progressBar.style.width = pct + '%';
});


/* ── 3. NAVBAR STUCK STATE ────────────────────────────────── */
const navbar = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('stuck', window.scrollY > 40);
});


/* ── 4. TYPING ANIMATION ──────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;

  // To add/remove phrases: just edit this array
  const phrases = [
    'AWS EC2 & RDS',
    'Terraform IaC',
    'Docker & ECS',
    'CI/CD Pipelines',
    'Linux Systems',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;

  // Blinking cursor
  const cursor = document.createElement('span');
  cursor.className   = 't-cur';
  cursor.textContent = '|';
  el.after(cursor);

  function type() {
    const phrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing forward
      el.textContent = phrase.slice(0, ++charIndex);
      if (charIndex === phrase.length) {
        isDeleting = true;
        setTimeout(type, 2000); // pause before deleting
        return;
      }
      setTimeout(type, 70);
    } else {
      // Deleting
      el.textContent = phrase.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 350); // pause before next phrase
        return;
      }
      setTimeout(type, 40);
    }
  }

  setTimeout(type, 800); // initial delay
})();


/* ── 5. GSAP ANIMATIONS ───────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Set initial hidden state for hero elements
gsap.set(['.hero-tag', 'h1', '.hero-sub', '.hero-actions'], {
  opacity: 0,
  y: 20,
});

// Hero entrance timeline — staggered reveal on load
gsap.timeline({ delay: 0.15 })
  .to('.hero-tag',     { opacity: 1, y: 0, duration: .8,  ease: 'power2.out' })
  .to('h1',            { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, '.2')
  .to('.hero-sub',     { opacity: 1, y: 0, duration: .8,  ease: 'power2.out' }, '.5')
  .to('.hero-actions', { opacity: 1, y: 0, duration: .8,  ease: 'power2.out' }, '.7')
  .to('.hero-pills',   { opacity: 1,        duration: .8                      }, '.9')
  .to('.scroll-hint',  { opacity: 1,        duration: .8                      }, '1');

// Scroll reveal — any element with class "r" fades up when visible
gsap.utils.toArray('.r').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: .9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start:   'top 88%',
        toggleActions: 'play none none none',
      },
    }
  );
});


/* ── 6. SMOOTH SCROLL (nav links) ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: 70 },
        ease: 'power3.inOut',
      });
    }
  });
});


/* ── 7. SKILL LIST STAGGER ────────────────────────────────── */
// Each skill bullet slides in from the left when section enters view
ScrollTrigger.batch('.sk-list li', {
  onEnter: els => gsap.from(els, {
    opacity:  0,
    x:        -12,
    duration: .45,
    stagger:  .04,
    ease:     'power2.out',
  }),
  start: 'top 90%',
});


/* ── 8. HAMBURGER / MOBILE MENU ───────────────────────────── */
const hamBtn     = document.getElementById('ham');
const mobileMenu = document.getElementById('mobile-menu');
const closeBtn   = document.getElementById('menu-close');

function openMobileMenu() {
  hamBtn.classList.add('open');
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent background scroll

  // Animate menu links in with stagger
  gsap.from('#mobile-menu a', {
    opacity:  0,
    y:        24,
    duration: .5,
    stagger:  .07,
    ease:     'power2.out',
  });
}

function closeMobileMenu() {
  hamBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

hamBtn.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});

closeBtn.addEventListener('click', closeMobileMenu);

// Close + scroll when a mobile nav link is tapped
document.querySelectorAll('#mobile-menu .mob-link').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      setTimeout(() => {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: target, offsetY: 70 },
          ease: 'power3.inOut',
        });
      }, 200);
    }
  });
});

// Tap outside menu to close
mobileMenu.addEventListener('click', e => {
  if (e.target === mobileMenu) closeMobileMenu();
});
