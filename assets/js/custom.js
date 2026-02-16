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
  });
})();
