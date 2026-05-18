/* ============================================================
   WEDDING INVITATION — JavaScript
   Dilanga & Nilushika · June 25, 2026
   ============================================================ */

// ── Wedding Date ───────────────────────────────────────────
const WEDDING_DATE = new Date('2026-06-25T09:00:00');

// ── DOM Ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0); // Ensure we start at the landing page
  spawnPetals();
  startCountdown();
  initScrollObserver();
  initScrollTopBtn();
});

// ══════════════════════════════════════════════════════════
// 1. PETAL ANIMATION
// ══════════════════════════════════════════════════════════
function spawnPetals() {
  const container = document.getElementById('petals-container');
  const petalEmojis = ['🌸', '🌹', '💐', '✿', '❀', '🌺'];
  for (let i = 0; i < 18; i++) {
    spawnOnePetal(container, petalEmojis, i);
  }
}

function spawnOnePetal(container, emojis, index) {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  petal.textContent = emoji;
  petal.style.left = `${Math.random() * 100}%`;
  const dur = 8 + Math.random() * 12;
  const delay = -Math.random() * 20;
  petal.style.animationDuration = `${dur}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.fontSize = `${12 + Math.random() * 16}px`;
  petal.style.opacity = `${0.4 + Math.random() * 0.5}`;
  container.appendChild(petal);
}

// ══════════════════════════════════════════════════════════
// 2. ENVELOPE OPEN ANIMATION
// ══════════════════════════════════════════════════════════
function openInvitation() {
  const overlay = document.getElementById('envelope-overlay');
  const envelope = document.getElementById('envelope');

  overlay.classList.remove('hidden');

  // Auto-play the beautiful romantic wedding background music on open
  if (!musicPlaying) {
    toggleMusic();
  }

  // Phase 1: flip the flap
  setTimeout(() => {
    envelope.classList.add('open');
  }, 300);

  // Phase 2: show the invitation, trigger fireworks
  setTimeout(() => {
    overlay.classList.add('hidden');
    const landingPage = document.getElementById('landing-page');
    const invitationPage = document.getElementById('invitation-page');

    landingPage.style.transition = 'opacity 0.8s ease';
    landingPage.style.opacity = '0';

    setTimeout(() => {
      landingPage.style.display = 'none';
      invitationPage.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Reset scroll for invitation page too
      launchFireworks();
      initScrollObserver();
    }, 800);
  }, 2500);
}

function closeInvitation() {
  const landingPage    = document.getElementById('landing-page');
  const invitationPage = document.getElementById('invitation-page');
  const envelope       = document.getElementById('envelope');

  // Fade out invitation
  invitationPage.style.transition = 'opacity 0.6s ease';
  invitationPage.style.opacity = '0';

  setTimeout(() => {
    invitationPage.classList.add('hidden');
    invitationPage.style.opacity = '';

    // Show landing
    landingPage.style.display = 'flex';
    landingPage.style.opacity = '0';
    setTimeout(() => {
      landingPage.style.opacity = '1';
      window.scrollTo(0, 0);

      // Reset envelope state
      envelope.classList.remove('open');
    }, 50);
  }, 600);
}

// ══════════════════════════════════════════════════════════
// 3. COUNTDOWN TIMER
// ══════════════════════════════════════════════════════════
function startCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('t-days').textContent    = '00';
    document.getElementById('t-hours').textContent   = '00';
    document.getElementById('t-minutes').textContent = '00';
    document.getElementById('t-seconds').textContent = '00';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  setTimerNum('t-days',    days);
  setTimerNum('t-hours',   hours);
  setTimerNum('t-minutes', minutes);
  setTimerNum('t-seconds', seconds);
}

function setTimerNum(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const formatted = String(value).padStart(2, '0');
  if (el.textContent !== formatted) {
    el.classList.add('flip');
    setTimeout(() => el.classList.remove('flip'), 150);
    el.textContent = formatted;
  }
}

// ══════════════════════════════════════════════════════════
// 4. SCROLL OBSERVER (Section reveal)
// ══════════════════════════════════════════════════════════
function initScrollObserver() {
  const sections = document.querySelectorAll('.inv-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(sec => observer.observe(sec));
}

// ══════════════════════════════════════════════════════════
// 5. FIREWORKS
// ══════════════════════════════════════════════════════════
let fireworksActive = false;
let fireworksTimeout = null;

function launchFireworks() {
  if (fireworksActive) return;
  fireworksActive = true;

  const canvas  = document.getElementById('fireworks-canvas');
  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const COLORS    = ['#c9a84c', '#f0d080', '#c2627f', '#f4b8cb', '#ffffff', '#ff8fa3', '#ffd700'];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = 0.012 + Math.random() * 0.015;
      this.radius = 1.5 + Math.random() * 3;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // gravity
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function playFireworksSound() {
    const sound = new Audio('fireworks.mp3');
    sound.volume = 0.65;
    sound.play().catch(e => console.log("Sound play failed", e));
    
    // Smoothly fade out and pause the sound after 1.1 seconds to perfectly match the visual burst
    setTimeout(() => {
      let vol = 0.65;
      const fade = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.05;
          sound.volume = vol;
        } else {
          clearInterval(fade);
          sound.pause();
        }
      }, 25);
    }, 1100);
  }

  function burst() {
    const x = 100 + Math.random() * (canvas.width - 200);
    const y = 80 + Math.random() * (canvas.height * 0.5);
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle(x, y));
    }
    playFireworksSound();
  }

  let burstCount = 0;
  const burstInterval = setInterval(() => {
    burst();
    burstCount++;
    if (burstCount >= 8) clearInterval(burstInterval);
  }, 400);

  function animate() {
    if (!fireworksActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.fillStyle = 'rgba(10,4,8,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }
  animate();

  fireworksTimeout = setTimeout(() => {
    fireworksActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 6000);
}

// ══════════════════════════════════════════════════════════
// 6. MUSIC TOGGLE (High-quality Background Music)
// ══════════════════════════════════════════════════════════
const bgMusic = new Audio('wedding_music.mp3');
bgMusic.loop = true;
bgMusic.volume = 1.0; // Maximized volume for rich, clear background music
let musicPlaying = false;

function toggleMusic() {
  const btn = document.getElementById('music-btn');
  if (!musicPlaying) {
    startAmbientMusic();
    btn.textContent = '🔊';
    btn.classList.add('playing');
    musicPlaying = true;
  } else {
    stopAmbientMusic();
    btn.textContent = '🎵';
    btn.classList.remove('playing');
    musicPlaying = false;
  }
}

function startAmbientMusic() {
  if (bgMusic.currentTime === 0) {
    bgMusic.currentTime = 24; // Skip quiet intro, jump straight to the rich, loud romantic climax
  }
  bgMusic.play().catch(error => {
    console.log("Audio playback failed or was prevented by browser autoplay policy: ", error);
  });
}

function stopAmbientMusic() {
  bgMusic.pause();
}

// ══════════════════════════════════════════════════════════
// 7. RSVP FORM
// ══════════════════════════════════════════════════════════
function submitRSVP(event) {
  event.preventDefault();
  const name       = document.getElementById('rsvp-name').value;
  const attendance = document.querySelector('input[name="attendance"]:checked');
  if (!name || !attendance) return;

  document.getElementById('rsvp-form').classList.add('hidden');
  document.getElementById('rsvp-success').classList.remove('hidden');

  // mini fireworks on accept
  if (attendance.value === 'yes') {
    launchFireworks();
  }
}

// ══════════════════════════════════════════════════════════
// 8. SCROLL TO TOP
// ══════════════════════════════════════════════════════════
function initScrollTopBtn() {
  const btn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════════════════════════
// 9. WINDOW RESIZE — fix canvas
// ══════════════════════════════════════════════════════════
window.addEventListener('resize', () => {
  const canvas = document.getElementById('fireworks-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});
