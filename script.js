(() => {
  const openButton = document.getElementById('openButton');
  const openText = document.getElementById('openText');
  const letterScreen = document.getElementById('letterScreen');
  const musicPanel = document.getElementById('musicPanel');
  const musicYes = document.getElementById('musicYes');
  const musicNo = document.getElementById('musicNo');
  const bgMusic = document.getElementById('bgMusic');
  const soundToggle = document.getElementById('soundToggle');
  const parallaxRoot = document.getElementById('parallaxRoot');

  let opened = false;
  let waitingForChoice = false;
  let musicEnabled = false;

  bgMusic.volume = 0.28;

  function revealVisible() {
    document.querySelectorAll('.scroll-reveal').forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        el.style.transitionDelay = `${Math.min(index * 0.035, 0.22)}s`;
        el.classList.add('visible');
      }
    });

    const ps = document.querySelector('.ps');
    if (ps && ps.classList.contains('visible')) {
      window.setTimeout(() => document.body.classList.add('finished'), 900);
    }
  }

  function showMusicPanel(event) {
    if (event) event.preventDefault();
    if (opened || waitingForChoice) return;
    waitingForChoice = true;
    document.body.classList.add('panel-open');
    musicPanel.classList.add('show');
    musicPanel.setAttribute('aria-hidden', 'false');
  }

  function hideMusicPanel() {
    document.body.classList.remove('panel-open');
    musicPanel.classList.remove('show');
    musicPanel.setAttribute('aria-hidden', 'true');
  }

  function playMusic() {
    musicEnabled = true;
    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        musicEnabled = false;
        document.body.classList.remove('music-on');
        soundToggle.hidden = true;
      });
    }
    document.body.classList.add('music-on');
    soundToggle.hidden = false;
  }

  function openLetter(withMusic = false) {
    if (opened) return;
    opened = true;
    hideMusicPanel();

    if (withMusic) playMusic();

    document.body.classList.add('seal-wiggle');
    window.setTimeout(() => {
      document.body.classList.add('opened');
    }, 520);

    window.setTimeout(() => {
      letterScreen.style.display = 'block';
      letterScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(revealVisible, 360);
    }, 1550);
  }

  ['click', 'touchend', 'pointerup'].forEach((eventName) => {
    openButton.addEventListener(eventName, showMusicPanel, { passive: false });
    openText.addEventListener(eventName, showMusicPanel, { passive: false });
  });

  openButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') showMusicPanel(event);
  });

  musicYes.addEventListener('click', () => openLetter(true));
  musicNo.addEventListener('click', () => openLetter(false));
  musicYes.addEventListener('touchend', (event) => { event.preventDefault(); openLetter(true); }, { passive: false });
  musicNo.addEventListener('touchend', (event) => { event.preventDefault(); openLetter(false); }, { passive: false });

  soundToggle.addEventListener('click', () => {
    if (!musicEnabled) return;
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      soundToggle.textContent = 'звук';
      soundToggle.setAttribute('aria-label', 'Выключить музыку');
    } else {
      bgMusic.pause();
      soundToggle.textContent = 'тишина';
      soundToggle.setAttribute('aria-label', 'Включить музыку');
    }
  });

  window.addEventListener('scroll', revealVisible, { passive: true });
  window.addEventListener('resize', revealVisible);

  window.addEventListener('deviceorientation', (event) => {
    if (!parallaxRoot || document.body.classList.contains('opened')) return;
    const x = Math.max(-8, Math.min(8, (event.gamma || 0) / 5));
    const y = Math.max(-8, Math.min(8, (event.beta || 0) / 8));
    parallaxRoot.style.transform = `translateY(calc(-2vh + ${y}px)) translateX(${x}px)`;
  }, { passive: true });
})();
