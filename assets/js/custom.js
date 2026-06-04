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
      if (el.querySelector('span')) {
        el.textContent = el.textContent;
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
    if (hero && canHover) {
      let targetX = -220;
      let targetY = -220;
      let currentX = -220;
      let currentY = -220;
      let rafId = null;
      let rect = null;
      let rectUpdateRaf = null;

      const updateRect = function() {
        rect = hero.getBoundingClientRect();
      };
      updateRect();

      const scheduleRectUpdate = function() {
        if (rectUpdateRaf) return;
        rectUpdateRaf = requestAnimationFrame(function() {
          updateRect();
          rectUpdateRaf = null;
        });
      };

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
        updateRect();
        hero.classList.add('is-spotlight-active');
      });

      hero.addEventListener('pointermove', function(event) {
        if (!rect) updateRect();
        targetX = event.clientX - rect.left;
        targetY = event.clientY - rect.top;
        ensureAnimation();
      }, { passive: true });

      hero.addEventListener('pointerleave', function() {
        hero.classList.remove('is-spotlight-active');
        targetX = -220;
        targetY = -220;
        ensureAnimation();
      });

      window.addEventListener('resize', scheduleRectUpdate, { passive: true });
    }
  }, { once: true });
})();
