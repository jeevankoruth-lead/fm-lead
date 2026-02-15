function initLetterAnimation() {
  const cycleTotal = 8000; // 8 seconds per cycle (much faster)

  function prepareAndAnimate(container) {
    if (!container) return;
    // avoid double-wrapping
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
  let left = document.querySelector('.left-panel h1') || document.querySelector('.focus-seq') || document.querySelector('.left-panel');
  let right = document.querySelector('.right-panel h1') || document.querySelector('.free-rand') || document.querySelector('.right-panel');

  // If not found, search for visible elements that contain the keywords and have large font-size
  function findVisibleLargeKeyword(keyword) {
    const candidates = Array.from(document.querySelectorAll('h1,h2,div,span'))
      .filter(e => e.textContent && new RegExp(keyword, 'i').test(e.textContent) && e.offsetWidth > 0 && e.offsetHeight > 0);
    if (!candidates.length) return null;
    // prefer larger font-size
    candidates.sort((a, b) => {
      const fa = parseFloat(window.getComputedStyle(a).fontSize) || 0;
      const fb = parseFloat(window.getComputedStyle(b).fontSize) || 0;
      return fb - fa;
    });
    return candidates[0];
  }

  if (!left) left = findVisibleLargeKeyword('focus');
  if (!right) right = findVisibleLargeKeyword('muser');

  // add classes so CSS rules apply and animate both sides
  if (left) {
    left.classList.add('focus-seq');
    prepareAndAnimate(left);
  }
  if (right) {
    right.classList.add('free-rand');
    prepareAndAnimateRandom(right);
  }
  return left || right;
}

function runLetterAnimation() {
  const ok = initLetterAnimation();
  if (!ok) {
    setTimeout(initLetterAnimation, 500);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runLetterAnimation);
} else {
  runLetterAnimation();
}
