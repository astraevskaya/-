(() => {
  const openButton = document.getElementById('openButton');
  const openText = document.getElementById('openText');
  const letterScreen = document.getElementById('letterScreen');
  let opened = false;

  function revealVisible() {
    document.querySelectorAll('.scroll-reveal').forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        el.style.transitionDelay = `${Math.min(index * 0.035, 0.22)}s`;
        el.classList.add('visible');
      }
    });
  }

  function openLetter(event) {
    if (event) event.preventDefault();
    if (opened) return;
    opened = true;
    document.body.classList.add('opened');

    window.setTimeout(() => {
      letterScreen.style.display = 'block';
      letterScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(revealVisible, 320);
    }, 1050);
  }

  ['click', 'touchend', 'pointerup'].forEach((eventName) => {
    openButton.addEventListener(eventName, openLetter, { passive: false });
    openText.addEventListener(eventName, openLetter, { passive: false });
  });

  openButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') openLetter(event);
  });

  window.addEventListener('scroll', revealVisible, { passive: true });
  window.addEventListener('resize', revealVisible);
})();
