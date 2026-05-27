/* =====================================================
   MEKARK — Full-page video scroll scrub
   Video plays frame-by-frame across the ENTIRE page
   ===================================================== */

/* ---------- 1. FULL-PAGE VIDEO SCRUB ---------- */
const video       = document.getElementById('bgVideo');
const progressBar = document.getElementById('scrollProgressBar');
let rafId = null;

video.addEventListener('loadedmetadata', () => {});
video.addEventListener('canplay', () => {});
video.load();
// Pause immediately — scrub controls playback
video.addEventListener('loadeddata', () => { video.pause(); });

function getScrollProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  return docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
}

function updateScrub() {
  rafId = null;
  const progress = getScrollProgress();

  // Scrub video to matching frame
  if (video.duration > 0) {
    const target = progress * video.duration;
    if (Math.abs(video.currentTime - target) > 0.008) {
      video.currentTime = target;
    }
  }

  // Progress bar
  if (progressBar) progressBar.style.width = (progress * 100) + '%';
}

window.addEventListener('scroll', () => {
  if (!rafId) rafId = requestAnimationFrame(updateScrub);
}, { passive: true });

// Run immediately
requestAnimationFrame(updateScrub);


/* ---------- 2. NAVBAR ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });


/* ---------- 3. HAMBURGER ---------- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
});


/* ---------- 4. SCROLL REVEAL ---------- */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const d = parseInt(entry.target.dataset.delay || 0, 10);
      setTimeout(() => entry.target.classList.add('visible'), d);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

function addReveal(selector, cls, step = 80) {
  document.querySelectorAll(selector).forEach((el, i) => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
      el.classList.add(cls);
    }
    el.dataset.delay = i * step;
    revealObs.observe(el);
  });
}

addReveal('.process-step',   'reveal',       0);
addReveal('.benefit-item',   'reveal',       60);
addReveal('.why-card',       'reveal',       80);
addReveal('.solution-card',  'reveal',       80);
addReveal('.service-item',   'reveal',       60);
addReveal('.industry-card',  'reveal',       80);
addReveal('.faq-item',       'reveal',       60);

document.querySelectorAll('.intro-grid > div').forEach((el, i) => {
  el.classList.add(i === 0 ? 'reveal-left' : 'reveal-right');
  revealObs.observe(el);
});
document.querySelectorAll('.process-intro > *').forEach((el, i) => {
  el.classList.add(i === 0 ? 'reveal-left' : 'reveal-right');
  revealObs.observe(el);
});
document.querySelectorAll('.contact-grid > *').forEach((el, i) => {
  el.classList.add(i === 0 ? 'reveal-left' : 'reveal-right');
  revealObs.observe(el);
});
document.querySelectorAll('.footer-grid > div').forEach((el, i) => {
  el.classList.add('reveal');
  el.dataset.delay = i * 80;
  revealObs.observe(el);
});


/* ---------- 5. FAQ ---------- */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(e => e.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}


/* ---------- 6. FORM ---------- */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ SUBMITTED — WE\'LL CONTACT YOU SHORTLY';
  btn.style.background = '#111';
  btn.style.color = '#fff';
  btn.disabled = true;
}


/* ---------- 7. SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const t = document.querySelector(link.getAttribute('href'));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
});
