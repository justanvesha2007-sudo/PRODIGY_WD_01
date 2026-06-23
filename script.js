// ========================================
// BREW & CO. — script.js
// Author: Prodigy Infotech Intern
// ========================================

// ── 1. GRAB ELEMENTS FROM THE DOM ──────────────────────────
const navbar     = document.getElementById('navbar');
const progress   = document.getElementById('scroll-progress');
const hamburger  = document.getElementById('hamburger');
const navUl      = document.getElementById('nav-links');
const navLinks   = document.querySelectorAll('.nav-link:not(.nav-reserve)');
const reserveBtn = document.getElementById('reserve-btn');
const formMsg    = document.getElementById('form-msg');

// List of section IDs used for active-link tracking
const sectionIds = ['hero', 'menu', 'story', 'contact'];

// ── 2. SCROLL HANDLER ──────────────────────────────────────
// Fires every time the user scrolls the page.
// Does three things:
//   a) Adds/removes the .scrolled class on the navbar
//   b) Updates the width of the scroll-progress bar
//   c) Highlights the nav link matching the current section

function handleScroll() {

  // a) Navbar style change on scroll
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');    // triggers the CSS .scrolled styles
  } else {
    navbar.classList.remove('scrolled');
  }

  // b) Scroll progress bar width (0% → 100%)
  const scrollableHeight = document.body.scrollHeight - window.innerHeight;
  const scrolledPercent  = scrollableHeight > 0
    ? (window.scrollY / scrollableHeight) * 100
    : 0;
  progress.style.width = scrolledPercent + '%';

  // c) Active link highlight — find which section is on screen
  let currentSection = 'hero'; // default to hero

  sectionIds.forEach(function(id) {
    const section = document.getElementById(id);
    if (section && window.scrollY >= section.offsetTop - 120) {
      currentSection = id;
    }
  });

  // Apply / remove the .active class on each nav link
  navLinks.forEach(function(link) {
    const linkTarget = link.getAttribute('href').replace('#', '');
    if (linkTarget === currentSection) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Attach scroll listener (passive: true = better performance)
window.addEventListener('scroll', handleScroll, { passive: true });


// ── 3. HAMBURGER MENU (mobile) ─────────────────────────────
// Toggles the open/close state of the nav on small screens

hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('open');
  navUl.classList.toggle('open');
});

// Close the menu automatically when a nav link is clicked
navUl.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    hamburger.classList.remove('open');
    navUl.classList.remove('open');
  });
});


// ── 4. NAV LINK HOVER — colour change ─────────────────────
// The CSS handles most hover effects via ::after pseudo-element.
// Here we add a subtle colour change to the logo on hover.

const navLogo = document.querySelector('.nav-logo');

navLogo.addEventListener('mouseenter', function() {
  navLogo.style.opacity = '0.85';
});
navLogo.addEventListener('mouseleave', function() {
  navLogo.style.opacity = '1';
});


// ── 5. MENU CARD — hover colour accent ────────────────────
// Adds a dynamic highlight colour when hovering over menu cards.
// The top border line is already handled in CSS,
// but here we log which card was hovered (good to see in DevTools).

const menuCards = document.querySelectorAll('.menu-card');

menuCards.forEach(function(card) {
  card.addEventListener('mouseenter', function() {
    // You can see these messages in the browser DevTools console (F12)
    console.log('Hovered:', card.querySelector('.menu-card-name').textContent);
  });
});


// ── 6. CONTACT FORM — RESERVE BUTTON ──────────────────────
// Simple validation + success feedback message

reserveBtn.addEventListener('click', function() {
  // Collect all input / textarea / select inside the form
  const formWrapper = document.querySelector('.contact-form');
  const inputs      = formWrapper.querySelectorAll('input, textarea, select');

  let allFilled = true;

  inputs.forEach(function(input) {
    // Trim whitespace; check for empty value
    if (!input.value.trim() || input.value === '') {
      allFilled = false;
      // Flash a red border on the empty field
      input.style.borderColor = '#c0543c';
      setTimeout(function() {
        input.style.borderColor = '';
      }, 2000);
    }
  });

  if (allFilled) {
    // Success feedback
    formMsg.textContent = '✓ Table reserved! We\'ll send a confirmation to your email shortly.';
    formMsg.style.color = '#5a7057'; // sage green

    // Clear the form after 2 seconds
    setTimeout(function() {
      inputs.forEach(function(input) { input.value = ''; });
      formMsg.textContent = '';
    }, 3000);

  } else {
    formMsg.textContent = 'Please fill in all the fields before submitting.';
    formMsg.style.color = '#c0543c'; // terracotta red
  }
});


// ── 7. SMOOTH SCROLL OFFSET FIX ───────────────────────────
// Anchor clicks need to account for the fixed navbar height.
// We override the default jump behaviour here.

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').replace('#', '');
    const target   = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


// ── 8. PAGE LOAD — run scroll once to set initial state ───
// In case the user refreshes mid-page, update everything immediately.
handleScroll();

console.log('☕ Brew & Co. script loaded successfully!');
