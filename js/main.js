// White Label Suite — main.js

// ── Sticky Navbar ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Mobile Menu ────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── Smooth Scroll ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Pricing Toggle ─────────────────────────────────────────────
const toggleBtn = document.getElementById('pricing-toggle');
let isAnnual = false;

const prices = {
  startup:    { monthly: 97,    annual: 77 },
  growth:     { monthly: 197,   annual: 157 },
  enterprise: { monthly: 397,   annual: 317 },
};

function updatePrices() {
  const mode = isAnnual ? 'annual' : 'monthly';
  Object.entries(prices).forEach(([plan, p]) => {
    const el = document.getElementById(`price-${plan}`);
    if (el) el.textContent = p[mode];
  });
  document.getElementById('wl-price-label').textContent = isAnnual
    ? '$4,997 / year' : '$497 / mo';
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    toggleBtn.classList.toggle('on', isAnnual);
    document.getElementById('toggle-monthly').classList.toggle('active', !isAnnual);
    document.getElementById('toggle-annual').classList.toggle('active', isAnnual);
    updatePrices();
  });
}

// ── FAQ Accordion ──────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Scroll Reveal ──────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
