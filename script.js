/* ═══════════════════════════════════════════
   CHRISTOPHER NUQUI PORTFOLIO — SCRIPT.JS
   Features:
   • Particle canvas background
   • Typing / typewriter animation
   • Scroll reveal
   • Skill bar animation
   • Stat counter animation
   • Project filter
   • Dark / light theme toggle
   • Navbar scroll shrink + hamburger
   • Contact form handler
   • Back-to-top button
   • RPM gauge easter egg (press R)
   • Active nav link highlight
═══════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. PARTICLE CANVAS BACKGROUND
───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = ['#00d4ff', '#ff3c00', '#39ff14', '#ffd700'];
  const COUNT  = 80;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.r  = Math.random() * 2 + 1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw dots
    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    // Draw connecting lines
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.18 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  draw();
})();

/* ─────────────────────────────────────────
   2. TYPING ANIMATION
───────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Game Developer (Unity)',
    'Full-Stack Developer',
    'Car Enthusiast 🚗',
    '2D & 3D Game Builder',
    'Tech Explorer 🔧',
    'Cisco Certified',
    'Caffeine-Powered Coder ☕'
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 45);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; tick(); }, 2000);
        return;
      }
      setTimeout(tick, 90);
    }
  }

  tick();
})();

/* ─────────────────────────────────────────
   3. SCROLL REVEAL
───────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────
   4. SKILL BAR ANIMATION
───────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.fill[data-w]');
  if (!fills.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => io.observe(f));
})();

/* ─────────────────────────────────────────
   5. STAT COUNTER ANIMATION
───────────────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.target;
      const dur    = 1400;
      const step   = 16;
      const steps  = dur / step;
      const inc    = target / steps;
      let current  = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, step);

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
})();

/* ─────────────────────────────────────────
   6. PROJECT FILTER
───────────────────────────────────────── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !show);
        // Tiny pop-in animation when showing
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight;  // reflow
          card.style.animation = 'popIn 0.35s ease';
        }
      });
    });
  });
})();

/* ─────────────────────────────────────────
   7. DARK / LIGHT THEME TOGGLE
───────────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const body = document.body;
  if (!btn) return;

  // Ensure body always has a theme class
  if (!body.classList.contains('dark-mode') && !body.classList.contains('light-mode')) {
    body.classList.add('dark-mode');
  }

  // Persist preference
  const saved = localStorage.getItem('cnTheme');
  if (saved === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    btn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  btn.addEventListener('click', () => {
    const isLight = body.classList.contains('light-mode');
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(isLight ? 'dark-mode' : 'light-mode');
    btn.innerHTML = isLight
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';
    localStorage.setItem('cnTheme', isLight ? 'dark' : 'light');
  });
})();

/* ─────────────────────────────────────────
   8. NAVBAR — SCROLL SHRINK + HAMBURGER
───────────────────────────────────────── */
(function initNav() {
  const nav       = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-links a');

  // Scroll shrink
  window.addEventListener('scroll', () => {
    nav.style.height = window.scrollY > 60 ? '52px' : '';
  }, { passive: true });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close menu on link click
  allLinks.forEach(a => {
    a.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      navLinks  && navLinks.classList.remove('open');
    });
  });

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        allLinks.forEach(a => a.classList.remove('active-link'));
        const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active-link');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();

/* ─────────────────────────────────────────
   9. BACK TO TOP
───────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────
   10. CONTACT FORM HANDLER
───────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = form.name.value.trim();
    const email = form.email.value.trim();
    const msg   = form.message.value.trim();

    if (!name || !email || !msg) {
      note.style.color = '#ff3c00';
      note.textContent = '⚠ Please fill in all fields.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.style.color = '#ff3c00';
      note.textContent = '⚠ Enter a valid email address.';
      return;
    }

    // Simulate send (wire up a real backend/Formspree/EmailJS as needed)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      note.style.color = '#39ff14';
      note.textContent = '✓ Message sent! I\'ll get back to you soon.';
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }, 1500);
  });
})();

/* ─────────────────────────────────────────
   11. RPM GAUGE EASTER EGG  (Press R)
   — with Web Audio API engine rev sound
───────────────────────────────────────── */
(function initRevEasterEgg() {
  const overlay    = document.getElementById('revOverlay');
  const needle     = document.getElementById('rpmNeedle');
  const readout    = document.getElementById('rpmReadout');
  const closeBtn   = document.getElementById('closeRev');
  if (!overlay) return;

  // Max RPM = 9000, needle swing = 240deg (-120 to +120)
  const MAX_RPM   = 9000;
  const MIN_ANG   = -120;
  const MAX_ANG   = 120;
  let   rpm       = 0;
  let   holding   = false;
  let   animFrame = null;

  // ─── WEB AUDIO ENGINE SOUND ───
  let audioCtx = null;
  let engineOsc1 = null;   // main engine tone
  let engineOsc2 = null;   // harmonic
  let engineGain = null;
  let distortion = null;
  let engineRunning = false;

  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Gain node (volume)
    engineGain = audioCtx.createGain();
    engineGain.gain.value = 0;

    // Distortion for that gritty engine feel
    distortion = audioCtx.createWaveShaper();
    distortion.curve = makeDistortionCurve(80);
    distortion.oversample = '4x';

    // Primary oscillator — sawtooth for engine growl
    engineOsc1 = audioCtx.createOscillator();
    engineOsc1.type = 'sawtooth';
    engineOsc1.frequency.value = 55; // idle ~55Hz

    // Secondary oscillator — adds harmonic richness
    engineOsc2 = audioCtx.createOscillator();
    engineOsc2.type = 'square';
    engineOsc2.frequency.value = 110;

    // Connect: oscillators → distortion → gain → output
    engineOsc1.connect(distortion);
    engineOsc2.connect(distortion);
    distortion.connect(engineGain);
    engineGain.connect(audioCtx.destination);

    engineOsc1.start();
    engineOsc2.start();
  }

  function makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  function startEngineSound() {
    if (engineRunning) return;
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    engineGain.gain.setTargetAtTime(0.12, audioCtx.currentTime, 0.05);
    engineRunning = true;
  }

  function stopEngineSound() {
    if (!engineRunning || !audioCtx) return;
    engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.15);
    engineRunning = false;
  }

  function updateEngineSound() {
    if (!audioCtx || !engineRunning) return;
    // Map RPM (800–9000) to frequency (55–320 Hz) for that rising rev sound
    const minFreq = 55;
    const maxFreq = 320;
    const ratio = (rpm - 800) / (MAX_RPM - 800);
    const freq = minFreq + ratio * (maxFreq - minFreq);

    engineOsc1.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.02);
    engineOsc2.frequency.setTargetAtTime(freq * 2, audioCtx.currentTime, 0.02);

    // Volume ramps up with RPM
    const vol = 0.08 + ratio * 0.22;
    engineGain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.03);
  }

  // ─── GAUGE LOGIC ───
  function setRPM(val) {
    rpm = Math.max(0, Math.min(MAX_RPM, val));
    const angle = MIN_ANG + (rpm / MAX_RPM) * (MAX_ANG - MIN_ANG);
    needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    readout.textContent    = Math.floor(rpm).toLocaleString();

    // Color shifts: cyan → yellow → red based on RPM
    if (rpm < 4000)      { readout.style.color = '#00d4ff'; needle.style.background = 'linear-gradient(to top,#00d4ff,transparent)'; }
    else if (rpm < 7000) { readout.style.color = '#ffd700'; needle.style.background = 'linear-gradient(to top,#ffd700,transparent)'; }
    else                 { readout.style.color = '#ff3c00'; needle.style.background = 'linear-gradient(to top,#ff3c00,transparent)'; }

    updateEngineSound();
  }

  function revUp() {
    if (!holding) return;
    rpm += 280;
    if (rpm > MAX_RPM) rpm = MAX_RPM;
    setRPM(rpm);
    animFrame = requestAnimationFrame(revUp);
  }

  function revDown() {
    cancelAnimationFrame(animFrame);
    function drop() {
      if (rpm <= 800) { setRPM(800); stopEngineSound(); return; }
      rpm -= 180;
      setRPM(rpm);
      animFrame = requestAnimationFrame(drop);
    }
    drop();
  }

  function openGauge() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setRPM(800);
  }

  function closeGauge() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    cancelAnimationFrame(animFrame);
    holding = false;
    stopEngineSound();
  }

  // Keyboard: R to open, hold SPACE to rev
  document.addEventListener('keydown', (e) => {
    // Don't trigger when typing in form fields
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.key === 'r' || e.key === 'R') {
      if (!overlay.classList.contains('active')) openGauge();
      return;
    }
    if (e.key === 'Escape' && overlay.classList.contains('active')) { closeGauge(); return; }
    if (e.code === 'Space' && overlay.classList.contains('active') && !e.repeat) {
      e.preventDefault();
      holding = true;
      startEngineSound();
      cancelAnimationFrame(animFrame);
      revUp();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') { holding = false; revDown(); }
  });

  // Touch support for the gauge
  overlay.addEventListener('pointerdown', (e) => {
    if (e.target === closeBtn || e.target === overlay) return;
    holding = true;
    startEngineSound();
    cancelAnimationFrame(animFrame);
    revUp();
  });
  overlay.addEventListener('pointerup',   () => { holding = false; revDown(); });
  overlay.addEventListener('pointerleave',() => { if (holding) { holding = false; revDown(); } });

  closeBtn.addEventListener('click', closeGauge);
})();

/* ─────────────────────────────────────────
   13. FOOTER YEAR
───────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─────────────────────────────────────────
   13. RESUME BUTTON (placeholder)
───────────────────────────────────────── */
const resumeBtn = document.getElementById('resumeBtn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', (e) => {
    // Replace href with your actual resume file path e.g. './resume.pdf'
    if (resumeBtn.getAttribute('href') === '#') {
      e.preventDefault();
      alert('📄 Resume coming soon! Upload your PDF and update the link in index.html');
    }
  });
}

/* ─────────────────────────────────────────
   14. CSS KEYFRAME INJECTION (pop-in for filter)
───────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.92) translateY(10px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  .nav-links a.active-link {
    color: var(--accent) !important;
  }
  .nav-links a.active-link::after {
    width: 100% !important;
  }
`;
document.head.appendChild(style);
