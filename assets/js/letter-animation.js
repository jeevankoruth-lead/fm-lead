document.addEventListener("DOMContentLoaded", function () {
  const cycleTotal = 8000; // 8 seconds per cycle (much faster)

  function wrapLetters(container) {
    if (!container) return;
    if (container.dataset.lettersWrapped === '1') return;

    const text = container.textContent.trim();
    if (!text) return;

    container.dataset.lettersWrapped = '1';
    container.innerHTML = '';
    const spans = [];

    for (const ch of text) {
      const span = document.createElement('span');
      span.textContent = ch;
      if (ch === ' ') span.classList.add('space');
      container.appendChild(span);
      if (!span.classList.contains('space')) spans.push(span);
    }

    return spans;
  }

  function prepareAndAnimate(container) {
    const spans = wrapLetters(container);
    if (!spans || !spans.length) return;

    const N = spans.length || 1;
    const revealDuration = Math.round(cycleTotal * 0.75);
    const holdDuration = Math.round(cycleTotal * 0.20);
    const hideDuration = cycleTotal - revealDuration - holdDuration;
    const revealInterval = revealDuration / N;
    const hideInterval = hideDuration / N;

    function reveal() {
      spans.forEach((s, i) => {
        setTimeout(() => s.classList.add('letter-visible'), Math.round(i * revealInterval));
      });
    }

    function hide() {
      spans.slice().reverse().forEach((s, i) => {
        setTimeout(() => s.classList.remove('letter-visible'), Math.round(i * hideInterval));
      });
    }

    function cycle() {
      spans.forEach(s => s.classList.remove('letter-visible'));
      setTimeout(() => {
        reveal();
        setTimeout(() => hide(), revealDuration + holdDuration);
      }, 50);
    }

    cycle();
    setInterval(cycle, cycleTotal);
  }

  function prepareAndAnimateRandom(container) {
    const spans = wrapLetters(container);
    if (!spans || !spans.length) return;

    const N = spans.length || 1;
    const revealDuration = Math.round(cycleTotal * 0.75);
    const holdDuration = Math.round(cycleTotal * 0.20);
    const hideDuration = cycleTotal - revealDuration - holdDuration;

    function revealRandom() {
      // randomly reveal letters throughout reveal duration
      spans.forEach(s => {
        const randomDelay = Math.random() * revealDuration;
        setTimeout(() => s.classList.add('letter-visible'), randomDelay);
      });
    }

    function hideRandom() {
      // randomly hide letters throughout hide duration
      spans.forEach(s => {
        const randomDelay = Math.random() * hideDuration;
        setTimeout(() => s.classList.remove('letter-visible'), randomDelay);
      });
    }

    function cycle() {
      spans.forEach(s => s.classList.remove('letter-visible'));
      setTimeout(() => {
        revealRandom();
        setTimeout(() => hideRandom(), revealDuration + holdDuration);
      }, 50);
    }

    cycle();
    setInterval(cycle, cycleTotal);
  }

  // Try explicit selectors first
  let left = document.querySelector('.focus-seq') || document.querySelector('.left-panel');
  let right = document.querySelector('.free-rand') || document.querySelector('.right-panel');

  function findBestVisibleMatch(keyword) {
    const rx = new RegExp(keyword, 'i');
    const candidates = document.querySelectorAll('.hero-title, .hero-title-muser, .left-panel, .right-panel, h1, h2, [data-title]');
    let best = null;
    let bestFont = -1;

    for (const candidate of candidates) {
      const text = candidate.textContent;
      if (!text || !rx.test(text)) continue;
      if (candidate.offsetWidth <= 0 || candidate.offsetHeight <= 0) continue;
      const fontSize = parseFloat(window.getComputedStyle(candidate).fontSize) || 0;
      if (fontSize > bestFont) {
        best = candidate;
        bestFont = fontSize;
      }
    }

    return best;
  }

  if (!left) left = findBestVisibleMatch('focus');
  if (!right) right = findBestVisibleMatch('muser');

  // add classes so CSS rules apply and animate both sides
  if (left) {
    left.classList.add('focus-seq');
    prepareAndAnimate(left);
  }
  if (right) {
    right.classList.add('free-rand');
    prepareAndAnimateRandom(right);
  }
});
