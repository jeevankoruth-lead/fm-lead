// Override and disable letter animation
// This must run BEFORE the theme's letter-animation.js
(function() {
  // Prevent the theme's letter animation from running
  document.addEventListener("DOMContentLoaded", function() {
    // Remove any letter animation classes
    const animatedElements = document.querySelectorAll('.focus-seq, .free-rand');
    animatedElements.forEach(function(el) {
      el.classList.remove('focus-seq', 'free-rand');
      // Restore original text if it was wrapped
      if (el.querySelectorAll('span').length > 0) {
        const text = el.textContent;
        el.innerHTML = text;
      }
    });
    
    // Ensure all title spans are visible
    const heroTitles = document.querySelectorAll('.hero-title, .hero-title-muser');
    heroTitles.forEach(function(title) {
      const spans = title.querySelectorAll('span');
      spans.forEach(function(span) {
        span.style.visibility = 'visible';
        span.style.display = 'inline';
      });
    });

    const hero = document.querySelector('.fm-home-hero');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hero) {
      const staggerNodes = hero.querySelectorAll('.fm-cinematic-stagger');
      staggerNodes.forEach(function(node) {
        if (node.dataset.staggerReady === 'true') {
          return;
        }

        const rawText = node.textContent;
        if (!rawText) {
          return;
        }

        const words = rawText.trim().split(/\s+/);
        const step = Number(node.getAttribute('data-stagger-step')) || 24;
        const fragment = document.createDocumentFragment();

        words.forEach(function(word, index) {
          const span = document.createElement('span');
          span.className = 'fm-stagger-word';
          span.style.setProperty('--word-index', String(index));
          span.style.setProperty('--word-step', step + 'ms');
          span.textContent = word;
          fragment.appendChild(span);

          if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(' '));
          }
        });

        node.textContent = '';
        node.appendChild(fragment);
        node.dataset.staggerReady = 'true';
      });

      requestAnimationFrame(function() {
        hero.classList.add('is-cinematic-ready');
      });

      if (!prefersReducedMotion) {
        let cameraTicking = false;
        const clamp = function(value, min, max) {
          return Math.min(Math.max(value, min), max);
        };

        const updateCamera = function() {
          const rect = hero.getBoundingClientRect();
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
          const centerOffset = (rect.top + rect.height * 0.5) - viewportHeight * 0.5;
          const normalized = clamp(centerOffset / (viewportHeight * 0.5), -1, 1);
          const topProgress = clamp(-rect.top / Math.max(rect.height, 1), -1, 1);

          const tiltY = normalized * 6;
          const tiltX = clamp(topProgress * 2.8, -2.8, 2.8);
          const panX = normalized * -18;
          const panY = clamp(-rect.top * 0.06, -24, 24);

          hero.style.setProperty('--hero-tilt-x', tiltX.toFixed(2) + 'deg');
          hero.style.setProperty('--hero-tilt-y', tiltY.toFixed(2) + 'deg');
          hero.style.setProperty('--hero-pan-x', panX.toFixed(2) + 'px');
          hero.style.setProperty('--hero-pan-y', panY.toFixed(2) + 'px');

          cameraTicking = false;
        };

        const onViewportMotion = function() {
          if (cameraTicking) {
            return;
          }
          cameraTicking = true;
          requestAnimationFrame(updateCamera);
        };

        window.addEventListener('scroll', onViewportMotion, { passive: true });
        window.addEventListener('resize', onViewportMotion, { passive: true });
        onViewportMotion();
      }
    }

    if (hero && canHover) {
      let targetX = -220;
      let targetY = -220;
      let currentX = -220;
      let currentY = -220;
      let rafId = null;

      const tick = function() {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        hero.style.setProperty('--spotlight-x', currentX.toFixed(2) + 'px');
        hero.style.setProperty('--spotlight-y', currentY.toFixed(2) + 'px');
        if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
        }
      };

      const ensureAnimation = function() {
        if (!rafId) {
          rafId = requestAnimationFrame(tick);
        }
      };

      hero.addEventListener('pointerenter', function() {
        hero.classList.add('is-spotlight-active');
      });

      hero.addEventListener('pointermove', function(event) {
        const rect = hero.getBoundingClientRect();
        targetX = event.clientX - rect.left;
        targetY = event.clientY - rect.top;
        ensureAnimation();
      });

      hero.addEventListener('pointerleave', function() {
        hero.classList.remove('is-spotlight-active');
        targetX = -220;
        targetY = -220;
        ensureAnimation();
      });
    }

    // ─────────────────────────────────────────────────────
    // PAGE TRANSITION OVERLAY
    // ─────────────────────────────────────────────────────
    var ptOverlay = document.createElement('div');
    ptOverlay.id = 'fm-page-transition';
    document.body.appendChild(ptOverlay);

    // Reveal page on load (fade from bg colour → transparent)
    ptOverlay.style.opacity = '1';
    ptOverlay.style.transition = 'none';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        ptOverlay.style.transition = '';
        ptOverlay.style.opacity = '0';
      });
    });

    // Fade-out on internal link navigation
    document.addEventListener('click', function(e) {
      var anchor = e.target.closest('a[href]');
      if (!anchor) { return; }
      var href = anchor.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || anchor.target === '_blank') { return; }
      try {
        var dest = new URL(href, window.location.href);
        if (dest.origin !== window.location.origin) { return; }
      } catch (err) { return; }
      e.preventDefault();
      ptOverlay.classList.add('fm-transition-out');
      setTimeout(function() { window.location.href = href; }, 295);
    });

    // ─────────────────────────────────────────────────────
    // MAGNETIC CURSOR
    // ─────────────────────────────────────────────────────
    if (canHover && !prefersReducedMotion) {
      var fmCursor = document.createElement('div');
      fmCursor.className = 'fm-cursor';
      document.body.appendChild(fmCursor);

      var curMouseX = 0, curMouseY = 0, curPosX = 0, curPosY = 0;
      var animateCursor = function() {
        curPosX += (curMouseX - curPosX) * 0.16;
        curPosY += (curMouseY - curPosY) * 0.16;
        fmCursor.style.left = curPosX.toFixed(1) + 'px';
        fmCursor.style.top  = curPosY.toFixed(1) + 'px';
        requestAnimationFrame(animateCursor);
      };
      requestAnimationFrame(animateCursor);

      document.addEventListener('mousemove', function(e) {
        curMouseX = e.clientX;
        curMouseY = e.clientY;
        if (!fmCursor.style.opacity || fmCursor.style.opacity === '0') {
          fmCursor.style.opacity = '1';
        }
      });

      document.addEventListener('mouseleave', function() {
        fmCursor.style.opacity = '0';
      });

      var muserSel = '.header-nav-group-muser a, a[href*="/muser/"], .fm-home-cta-button-muser';
      document.querySelectorAll('a, button, [role="button"]').forEach(function(el) {
        var isMuser = el.matches(muserSel);
        el.addEventListener('mouseenter', function() {
          fmCursor.classList.remove('is-hovering', 'is-hovering-muser');
          fmCursor.classList.add(isMuser ? 'is-hovering-muser' : 'is-hovering');
        });
        el.addEventListener('mouseleave', function() {
          fmCursor.classList.remove('is-hovering', 'is-hovering-muser');
        });
      });
    }

    // ─────────────────────────────────────────────────────
    // 3D CARD TILT
    // ─────────────────────────────────────────────────────
    if (canHover && !prefersReducedMotion) {
      document.querySelectorAll('.fm-feature-card, .fm-latest-card, .hero-panel').forEach(function(card) {
        var maxDeg = card.classList.contains('hero-panel') ? 2.5 : 3;
        card.addEventListener('mousemove', function(e) {
          var r = card.getBoundingClientRect();
          var nx = (e.clientX - r.left) / r.width  - 0.5;
          var ny = (e.clientY - r.top)  / r.height - 0.5;
          card.style.setProperty('--card-rx', (-ny * maxDeg).toFixed(2) + 'deg');
          card.style.setProperty('--card-ry', ( nx * maxDeg).toFixed(2) + 'deg');
          card.style.setProperty('--card-gx', ((nx + 0.5) * 100).toFixed(1) + '%');
          card.style.setProperty('--card-gy', ((ny + 0.5) * 100).toFixed(1) + '%');
        });
        card.addEventListener('mouseleave', function() {
          card.style.setProperty('--card-rx', '0deg');
          card.style.setProperty('--card-ry', '0deg');
        });
      });
    }

    // ─────────────────────────────────────────────────────
    // SECTION FADE-THROUGH
    // ─────────────────────────────────────────────────────
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      var homeSections = document.querySelectorAll('.fm-home section');
      if (homeSections.length > 1) {
        var secObs = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('fm-section-active');
              entry.target.classList.remove('fm-section-dim');
            } else {
              entry.target.classList.remove('fm-section-active');
              entry.target.classList.add('fm-section-dim');
            }
          });
        }, { threshold: 0.12, rootMargin: '-8% 0px -8% 0px' });
        homeSections.forEach(function(s) { secObs.observe(s); });
      }
    }

    // ─────────────────────────────────────────────────────
    // SPLIT-SCREEN GAP REVEAL
    // ─────────────────────────────────────────────────────
    if (hero && !prefersReducedMotion) {
      var splitClamp = function(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; };
      var updateSplitGap = function() {
        var r = hero.getBoundingClientRect();
        var progress = splitClamp(-r.top / Math.max(r.height * 0.5, 1), 0, 1);
        var gap = progress * 14;
        hero.style.setProperty('--hero-split-gap', gap.toFixed(2) + 'px');
        if (gap > 2) {
          hero.classList.add('is-split-active');
        } else {
          hero.classList.remove('is-split-active');
        }
      };
      window.addEventListener('scroll', updateSplitGap, { passive: true });
      updateSplitGap();
    }

    // ─────────────────────────────────────────────────────
    // SMOOTH THEME COLOR MORPH
    // ─────────────────────────────────────────────────────
    document.querySelectorAll('#appearance-switcher, #appearance-switcher-mobile').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.documentElement.classList.add('fm-theme-morphing');
        setTimeout(function() {
          document.documentElement.classList.remove('fm-theme-morphing');
        }, 450);
      });
    });

    // ─────────────────────────────────────────────────────
    // CIRCUIT BURST EVERY 10 SECONDS
    // ─────────────────────────────────────────────────────
    if (hero && !prefersReducedMotion) {
      setInterval(function() {
        hero.classList.add('is-circuit-burst');
        setTimeout(function() { hero.classList.remove('is-circuit-burst'); }, 2100);
      }, 10000);
    }

  });
})();
