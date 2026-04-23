// ===== Force scroll to top on reload (preserve hash navigation) =====
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', function () {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

// ===== Hero Entrance Animation =====
(function heroEntrance() {
  var heroFrame = document.querySelector('.hero-frame');
  var frameImage = document.querySelector('.hero-frame-image');
  var heroTags = document.querySelectorAll('.hero-tag');
  var heroContent = document.querySelector('.hero-content');
  var heroEmoji = document.querySelector('.hero-emoji');
  var cursor = document.querySelector('.hero-frame-cursor');
  var svg = document.querySelector('.hero-frame-svg');
  var navEl = document.querySelector('.nav');
  var scrollHint = document.querySelector('.hero-scroll-hint');

  if (!heroFrame || !cursor || !svg) return;

  // SVG geometry — read actual container size for responsiveness
  var PAD = 10, CSZ = 16, CIN = 2;
  var ANIM_DURATION = 1100;
  var FULL_W = heroFrame.offsetWidth;
  var FULL_H = heroFrame.offsetHeight;
  var START_RATIO = 0.12;
  var START_W = Math.round(FULL_W * START_RATIO);
  var START_H = Math.round(FULL_H * START_RATIO);

  // SVG element refs
  var border = svg.querySelector('.frame-border');
  var cTR = svg.querySelector('.frame-corner-tr');
  var cBL = svg.querySelector('.frame-corner-bl');
  var cBR = svg.querySelector('.frame-corner-br');

  function setFrameSize(w, h) {
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    // Use inline style so it overrides the CSS width/height: 100% rule
    svg.style.width = w + 'px';
    svg.style.height = h + 'px';
    border.setAttribute('width', w - PAD * 2);
    border.setAttribute('height', h - PAD * 2);
    cTR.setAttribute('x', w - CSZ - CIN);
    cBL.setAttribute('y', h - CSZ - CIN);
    cBR.setAttribute('x', w - CSZ - CIN);
    cBR.setAttribute('y', h - CSZ - CIN);
  }

  function positionCursor() {
    var rect = svg.getBoundingClientRect();
    cursor.style.left = (rect.right - 4) + 'px';
    cursor.style.top = (rect.bottom - 4) + 'px';
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // 1) Hide SVG until we're ready, set initial size
  svg.style.visibility = 'hidden';
  setFrameSize(START_W, START_H);

  // 2) Wait for layout, then reveal & show cursor
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      svg.style.visibility = '';
      positionCursor();
      cursor.style.opacity = '1';

      // 3) Begin expansion after a short pause
      setTimeout(function() {
        var startTime = null;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          var elapsed = timestamp - startTime;
          var progress = Math.min(elapsed / ANIM_DURATION, 1);
          var eased = easeOutQuart(progress);

          var w = START_W + (FULL_W - START_W) * eased;
          var h = START_H + (FULL_H - START_H) * eased;
          setFrameSize(Math.round(w), Math.round(h));
          positionCursor();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setFrameSize(FULL_W, FULL_H);
            // Hand control back to CSS so the SVG stays responsive on resize
            svg.style.width = '';
            svg.style.height = '';
            cursor.style.transition = 'opacity 0.3s ease';
            cursor.style.opacity = '0';

            // Reveal character (slide up)
            frameImage.classList.add('anim-ready');
            setTimeout(function() {
              frameImage.classList.add('anim-in');
            }, 150);

            // Tags one by one
            heroTags.forEach(function(tag, i) {
              setTimeout(function() {
                tag.classList.add('anim-in');
              }, 450 + i * 200);
            });

            // Text content
            setTimeout(function() {
              heroContent.classList.add('anim-in');
            }, 550);

            // Navbar & scroll hint fade in
            setTimeout(function() {
              if (navEl) navEl.classList.add('anim-in');
              if (scrollHint) scrollHint.classList.add('anim-in');
            }, 300);

            // Emoji bounce after everything settles
            setTimeout(function() {
              if (heroEmoji) heroEmoji.classList.add('anim-bounce');
            }, 1400);
          }
        }

        requestAnimationFrame(animate);
      }, 350);
    });
  });
})();

// ===== Navigation scroll effect =====
const nav = document.getElementById('nav');
const navMenuBtn = document.getElementById('navMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const isCasePage = document.body.classList.contains('case-page');

if (nav) {
  window.addEventListener('scroll', () => {
    if (!isCasePage) {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
}

// Mobile menu toggle
if (navMenuBtn && mobileMenu) {
  navMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    navMenuBtn.classList.toggle('active');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navMenuBtn.classList.remove('active');
    });
  });
}

// ===== Hide nav on scroll down, show on scroll up (case pages) =====
if (nav && isCasePage) {
  let lastScrollY = window.scrollY;
  let navTicking = false;
  const NAV_DELTA = 8;
  const NAV_TOP_THRESHOLD = 80;

  window.addEventListener('scroll', () => {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const diff = y - lastScrollY;
      if (y < NAV_TOP_THRESHOLD) {
        nav.classList.remove('nav-hidden');
      } else if (Math.abs(diff) > NAV_DELTA) {
        if (diff > 0) {
          nav.classList.add('nav-hidden');
        } else {
          nav.classList.remove('nav-hidden');
        }
      }
      lastScrollY = y;
      navTicking = false;
    });
  }, { passive: true });
}

// ===== Scroll-Driven Reveal Animations =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== Parallax effect on hero =====
const heroLayout = document.querySelector('.hero-layout');
const heroScrollHint = document.querySelector('.hero-scroll-hint');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroHeight = window.innerHeight;

  if (scrollY < heroHeight) {
    const progress = scrollY / heroHeight;
    if (heroLayout) {
      heroLayout.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroLayout.style.opacity = 1 - progress * 1.2;
    }
    if (heroScrollHint) heroScrollHint.style.opacity = 1 - progress * 3;
  }
}, { passive: true });

// ===== Active nav link highlight =====
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--color-text)'
          : '';
      });
    }
  });
}, {
  threshold: 0.3
});

sections.forEach(section => sectionObserver.observe(section));

// ===== Counter animation for stats =====
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, 0, target, 1200);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(el, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===== Smooth scroll for nav links (fallback) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Work card tilt effect =====
const workCards = document.querySelectorAll('.work-card');

workCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -3;
    const rotateY = (x - centerX) / centerX * 3;

    card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== (Character removed — hero redesigned) =====


// ===== Gradient cursor glow effect =====
const glowEl = document.createElement('div');
glowEl.style.cssText = `
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124,108,246,0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
`;
document.body.appendChild(glowEl);

document.addEventListener('mousemove', (e) => {
  glowEl.style.left = e.clientX + 'px';
  glowEl.style.top = e.clientY + 'px';
});

// ===== Go To Top — Liquid Morph =====
const goTopBtn = document.getElementById('goTop');
const heroSection = document.getElementById('hero');
const goTopPupilL = document.getElementById('goTopPupilL');
const goTopPupilR = document.getElementById('goTopPupilR');
let goTopVisible = false;
let goTopAnimating = false;

function showGoTop() {
  if (!goTopBtn || goTopVisible || goTopAnimating) return;
  goTopVisible = true;
  goTopAnimating = true;
  goTopBtn.classList.remove('hiding');
  goTopBtn.classList.add('visible');
  setTimeout(() => { goTopAnimating = false; }, 800);
}

function hideGoTop() {
  if (!goTopBtn || !goTopVisible || goTopAnimating) return;
  goTopVisible = false;
  goTopAnimating = true;
  goTopBtn.classList.remove('visible');
  goTopBtn.classList.add('hiding');
  setTimeout(() => {
    goTopBtn.classList.remove('hiding');
    goTopAnimating = false;
  }, 600);
}

if (goTopBtn) {
  if (heroSection) {
    // Index page — observe hero section leaving viewport
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hideGoTop();
        } else {
          showGoTop();
        }
      });
    }, { threshold: 0.15 });
    heroObserver.observe(heroSection);
  } else {
    // Case pages — show after scrolling past a threshold
    const SHOW_THRESHOLD = 400;
    window.addEventListener('scroll', () => {
      if (window.scrollY > SHOW_THRESHOLD) {
        showGoTop();
      } else {
        hideGoTop();
      }
    }, { passive: true });
  }

  // Click to scroll to top
  goTopBtn.addEventListener('click', () => {
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Eye tracking for go-top button
  if (goTopPupilL && goTopPupilR) {
    document.addEventListener('mousemove', (e) => {
      if (!goTopVisible) return;
      [goTopPupilL, goTopPupilR].forEach(pupil => {
        const eye = pupil.parentElement;
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const angle = Math.atan2(dy, dx);
        const maxM = 3;
        const ratio = Math.min(Math.sqrt(dx * dx + dy * dy) / 150, 1);
        pupil.style.transform = `translate(calc(-50% + ${Math.cos(angle) * maxM * ratio}px), calc(-50% + ${Math.sin(angle) * maxM * ratio}px))`;
      });
    });
  }
}

// ===== i18n Language Toggle =====
(function i18n() {
  var translations = {
    en: {
      'nav.projects': 'Projects',
      'nav.works': 'Works',
      'nav.about': 'About',
      'works.title': 'Featured Works',
      'tmcdf.title': 'TmCDF Website',
      'tmcdf.desc': 'Redesign of the Taiwan Cancer New Drug Co-payment Fund (TmCDF) website. Responsible for UIUX — from information architecture planning to visual design and motion design.',
      'tmcdf.tooltip': 'Under Construction',
      'judian.title': 'Retailing Data Website',
      'judian.desc': 'Redesign of the Retailing Data Co., Ltd. corporate website. Responsible for UIUX — from information architecture planning to visual design and motion design.',
      'btn.visit': 'Visit Site',
      'btn.details': 'Case Study',
      'card.badminton': 'Badminton Butler - Store Management System',
      'card.metro': 'Taipei Metro Go - Navigation System',
      'card.fitness': 'My Fitness Factory - Member APP',
      'card.dailyui': 'Daily UI - Daily Design Challenge',
      'about.title': 'About Me',
      'about.p1': 'I am a UIUX designer with over 3 years of experience, specializing in user experience design for digital products.',
      'about.p2': 'I excel at transforming complex business logic into intuitive digital experiences, with the ability to build design systems from scratch. Currently exploring how to leverage AI tools to accelerate requirement analysis and prototyping, turning ambiguous goals into actionable product strategies while ensuring seamless alignment between design and development.',
      'contact.desc': 'Interested in collaboration or want to chat about design?<br>Feel free to reach out.',
      'contact.email': 'View My Email',
      'footer.resume': 'Download Resume'
    },
    zh: {}
  };

  // Store original Chinese text
  var originals = {};
  var currentLang = 'zh';

  // Collect originals on init
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (el.getAttribute('data-i18n-html') === 'true') {
      originals[key] = originals[key] || el.innerHTML;
    } else {
      originals[key] = originals[key] || el.childNodes[0] ? getDirectText(el) : el.textContent;
    }
  });

  function getDirectText(el) {
    // Get only direct text, preserving child elements (like SVGs)
    var text = '';
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3) { // TEXT_NODE
        var t = el.childNodes[i].textContent.trim();
        if (t) text = t;
      }
    }
    return text;
  }

  function setLang(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var newText = lang === 'en' ? translations.en[key] : originals[key];
      if (!newText) return;

      if (el.getAttribute('data-i18n-html') === 'true') {
        el.innerHTML = newText;
        return;
      }

      // Check if element has child elements (SVG icons, etc.)
      var hasChildren = false;
      for (var i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 1) { hasChildren = true; break; }
      }

      if (hasChildren) {
        // Only replace the first text node
        for (var j = 0; j < el.childNodes.length; j++) {
          if (el.childNodes[j].nodeType === 3 && el.childNodes[j].textContent.trim()) {
            el.childNodes[j].textContent = '\n                ' + newText + '\n                ';
            break;
          }
        }
      } else {
        el.textContent = newText;
      }
    });

    // Update all lang toggle buttons
    document.querySelectorAll('.nav-lang span').forEach(function(s) {
      s.textContent = lang === 'en' ? 'CN' : 'EN';
    });

    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
  }

  // Bind click to all lang buttons (desktop + mobile)
  document.querySelectorAll('.nav-lang').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setLang(currentLang === 'zh' ? 'en' : 'zh');
    });
  });
})();

/* ============================= */
/* Slider CAPTCHA                */
/* ============================= */
(function () {
  var card = document.getElementById('emailCard');
  var cardText = document.getElementById('emailCardText');
  var modal = document.getElementById('captchaModal');
  if (!card || !modal) return;

  var imageEl = document.getElementById('captchaImage');
  var gapEl = document.getElementById('captchaGap');
  var pieceEl = document.getElementById('captchaPiece');
  var flashEl = document.getElementById('captchaFlash');
  var slider = document.getElementById('captchaSlider');
  var handle = document.getElementById('captchaHandle');
  var fill = document.getElementById('captchaFill');
  var closeBtn = document.getElementById('captchaClose');
  var refreshBtn = document.getElementById('captchaRefresh');

  var IMAGE_W = 284;
  var IMAGE_H = 170;
  var PIECE = 42;
  var HANDLE = 38;
  var SLIDER_W = 284;
  var MAX_PIECE_X = IMAGE_W - PIECE;
  var MAX_HANDLE_X = SLIDER_W - HANDLE;
  var TOLERANCE = 6;

  var IMAGES = [
    'assets/captcha01.png',
    'assets/captcha02.png',
    'assets/captcha03.png',
    'assets/captcha04.png',
    'assets/captcha05.png',
    'assets/captcha06.png'
  ];

  var verified = false;
  var gapX = 0;
  var gapY = 0;
  var dragging = false;
  var startX = 0;
  var startHandleX = 0;
  var currentHandleX = 0;
  var locked = false;

  function randomPuzzle() {
    var imgUrl = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    var bg = "url('" + imgUrl + "')";
    imageEl.style.backgroundImage = bg;
    pieceEl.style.backgroundImage = bg;
    gapX = Math.floor(60 + Math.random() * (MAX_PIECE_X - 60 - 10));
    gapY = Math.floor(20 + Math.random() * (IMAGE_H - PIECE - 40));
    gapEl.style.left = gapX + 'px';
    gapEl.style.top = gapY + 'px';
    pieceEl.style.left = '0px';
    pieceEl.style.top = gapY + 'px';
    pieceEl.style.backgroundPosition = '-' + gapX + 'px -' + gapY + 'px';
    pieceEl.classList.remove('success', 'fail');
    flashEl.classList.remove('show-success', 'show-fail');
    slider.classList.remove('success', 'fail');
    handle.style.left = '0px';
    fill.style.width = HANDLE + 'px';
    currentHandleX = 0;
    locked = false;
  }

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    randomPuzzle();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  function setHandle(x) {
    x = Math.max(0, Math.min(MAX_HANDLE_X, x));
    currentHandleX = x;
    handle.style.left = x + 'px';
    fill.style.width = (x + HANDLE) + 'px';
    var pieceX = (x / MAX_HANDLE_X) * MAX_PIECE_X;
    pieceEl.style.left = pieceX + 'px';
  }

  function onPointerDown(e) {
    if (locked) return;
    dragging = true;
    handle.classList.add('dragging');
    var point = e.touches ? e.touches[0] : e;
    startX = point.clientX;
    startHandleX = currentHandleX;
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging) return;
    var point = e.touches ? e.touches[0] : e;
    setHandle(startHandleX + (point.clientX - startX));
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    var pieceX = (currentHandleX / MAX_HANDLE_X) * MAX_PIECE_X;
    var delta = Math.abs(pieceX - gapX);
    if (delta <= TOLERANCE) {
      onSuccess();
    } else {
      onFail();
    }
  }

  function onSuccess() {
    locked = true;
    pieceEl.classList.add('success');
    flashEl.textContent = '驗證成功';
    flashEl.classList.add('show-success');
    slider.classList.add('success');
    verified = true;
    setTimeout(function () {
      closeModal();
      revealEmail();
    }, 700);
  }

  function onFail() {
    locked = true;
    pieceEl.classList.add('fail');
    flashEl.textContent = '驗證失敗，請重試';
    flashEl.classList.add('show-fail');
    slider.classList.add('fail');
    setTimeout(function () {
      randomPuzzle();
    }, 800);
  }

  function revealEmail() {
    var email = card.getAttribute('data-email') || 'iling1114@gmail.com';
    cardText.textContent = email;
    cardText.removeAttribute('data-i18n');
    card.setAttribute('href', 'mailto:' + email);
  }

  card.addEventListener('click', function (e) {
    if (verified) return;
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener('click', closeModal);
  refreshBtn.addEventListener('click', randomPuzzle);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  handle.addEventListener('mousedown', onPointerDown);
  handle.addEventListener('touchstart', onPointerDown, { passive: false });
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('touchmove', onPointerMove, { passive: false });
  document.addEventListener('mouseup', onPointerUp);
  document.addEventListener('touchend', onPointerUp);
})();
