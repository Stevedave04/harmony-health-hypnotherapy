// Apply persisted theme immediately — prevents flash when navigating between pages
(function () {
  var saved = localStorage.getItem('harmony-theme');
  if (saved && /^(navy|plum|ivory)$/.test(saved)) {
    document.body.className = 'theme-' + saved;
  }
}());

// Persist theme to localStorage whenever body class changes (set by TweaksApp)
new MutationObserver(function () {
  var m = document.body.className.match(/theme-(\w+)/);
  if (m) localStorage.setItem('harmony-theme', m[1]);
}).observe(document.body, { attributes: true, attributeFilter: ['class'] });

// Nav scroll effect
var nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// Hamburger / mobile menu
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Stagger mobile menu link entrance animation
  var mobileLinks = document.querySelectorAll('.mobile-menu a');
  new MutationObserver(function () {
    if (mobileMenu.classList.contains('open')) {
      mobileLinks.forEach(function (el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(24px)';
        setTimeout(function () {
          el.style.transition = 'opacity 0.4s ease ' + (i * 0.07) + 's, transform 0.4s cubic-bezier(0.22,1,0.36,1) ' + (i * 0.07) + 's';
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, 10);
      });
    }
  }).observe(mobileMenu, { attributes: true, attributeFilter: ['class'] });
}

// Fade-up scroll reveal
var fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(function (el) { fadeObserver.observe(el); });

// Highlight active nav link based on current page
(function () {
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var page = href.split('#')[0];
    if (page && page === current) {
      link.classList.add('nav-link-active');
      link.setAttribute('aria-current', 'page');
    }
  });
}());
