/**
 * OUR UNIVERSE — Interactive Romantic Experience
 * Pure Vanilla JavaScript ES6+ Architecture
 */

// ==========================================================================
// 1. CONFIGURATION — EASY PERSONALIZATION
// ==========================================================================
const CONFIG = {
  girlfriendName: "My Love",
  relationshipDate: "August 12, 2024",

  // Music Settings
  musicFile: "our-song.mp3",
  musicTitle: "Our Song",

  // Digital Love Letter
  loveLetter: `Dear My Love,

If you're reading this, you've already explored the little universe I created for you.

Every star in this sky represents a piece of my heart—a memory, a laugh, a quiet moment, or a feeling that made me fall deeper in love with you.

Out of millions of possibilities in this vast world, finding you remains my absolute favorite plot twist. Thank you for making ordinary days feel extraordinary.

You are, and will always be, my favorite part of this universe.`,

  // Special Interactive Memory Stars (Targeting Heart Constellation Form)
  memories: [
    {
      id: 1,
      title: "The Beginning",
      date: "February 14, 2022",
      image: "memory1.jpg",
      message: "February 14, 2022, was the first time I saw you at the school gate, and I felt something different.",
      // Target position in Heart Constellation ratio (-1 to 1 space)
      targetX: 0,
      targetY: 0.4
    },
    {
      id: 2,
      title: "Our official Start",
      date: "May 28,29, 2022",
      image: "memory2.jpg",
      message: "May 28–29 was when you officially became my girlfriend. I was so happy. It was two dates because I asked you on the 28th, and on the 29th, you asked me if it was really true, and I said yes.",
      targetX: -0.4,
      targetY: -0.1
    },
    {
      id: 3,
      title: "Skip to the graduation day",
      date: "July 26, 2024",
      image: "memory3.jpg",
      message: "Skip to graduation. We made it—we both finished our studies together after going through so many fights, misunderstandings, and happy moments.",
      targetX: -0.2,
      targetY: -0.45
    },
    {
      id: 4,
      title: "Quiet Moments",
      date: "February 28, 2025",
      image: "memory4.jpg",
      message: "Fast forward, we slowly started building up our future, while at the same time, collecting more and more memories together.",
      targetX: 0.2,
      targetY: -0.45
    },
    {
      id: 5,
      title: "Under the blue Sky",
      date: "June 20, 2025",
      image: "memory5.jpg",
      message: "Under the blue sky, we can now go wherever we want, buy the things we’ve always wanted, and slowly build a better future together.",
      targetX: 0.4,
      targetY: -0.1
    },
    {
      id: 6,
      title: "A Promise for Tomorrow",
      date: "Present Day",
      image: "memory6.jpg",
      message: "Here's to every memory we've made, and to all the infinite stars we have yet to discover together.",
      targetX: 0,
      targetY: -0.1
    }
  ]
};

// ==========================================================================
// 2. GLOBAL STATE ENGINE
// ==========================================================================
const state = {
  activeScreen: 'loading', // loading, intro, galaxy, final, celebration
  discoveredStars: new Set(),
  secretStarRevealed: false,
  secretStarUnlocked: false,
  mouse: { x: -1000, y: -1000, targetX: -1000, targetY: -1000 },
  hoveredStar: null,
  musicPlaying: false,
  audioElement: null,
  easterEggClicks: 0
};

// ==========================================================================
// 3. CANVAS & GALAXY GRAPHICS SYSTEM
// ==========================================================================
class GalaxyEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.interactiveStars = [];
    this.particles = [];
    this.secretStar = null;
    this.width = 0;
    this.height = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createBackgroundStars(120);
    this.createInteractiveStars();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.repositionInteractiveStars();
  }

  createBackgroundStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15
      });
    }
  }

  createInteractiveStars() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.28;

    this.interactiveStars = CONFIG.memories.map((mem) => {
      return {
        ...mem,
        x: centerX + mem.targetX * radius,
        y: centerY + mem.targetY * radius,
        currentRadius: 6,
        baseRadius: 6,
        discovered: false,
        pulseAngle: Math.random() * Math.PI * 2
      };
    });

    this.secretStar = {
      id: 'secret',
      title: 'OUR FUTURE',
      x: centerX,
      y: centerY + 0.6 * radius,
      currentRadius: 9,
      baseRadius: 9,
      discovered: false,
      pulseAngle: 0
    };
  }

  repositionInteractiveStars() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.28;

    this.interactiveStars.forEach((star) => {
      star.x = centerX + star.targetX * radius;
      star.y = centerY + star.targetY * radius;
    });

    if (this.secretStar) {
      this.secretStar.x = centerX;
      this.secretStar.y = centerY + 0.6 * radius;
    }
  }

  spawnBurstParticles(x, y) {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        life: Math.random() * 40 + 20,
        color: Math.random() > 0.5 ? '#ff69b4' : '#8a2be2'
      });
    }
  }

  drawConstellations() {
    const discovered = this.interactiveStars.filter(s => s.discovered);
    if (discovered.length < 2) return;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(255, 105, 180, 0.35)';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 4]);

    for (let i = 0; i < discovered.length; i++) {
      for (let j = i + 1; j < discovered.length; j++) {
        this.ctx.moveTo(discovered[i].x, discovered[i].y);
        this.ctx.lineTo(discovered[j].x, discovered[j].y);
      }
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.1;
    state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.1;

    // 1. Nebulae BG Glow
    const bgGlow = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, 100,
      this.width / 2, this.height / 2, this.width * 0.6
    );
    bgGlow.addColorStop(0, 'rgba(20, 10, 35, 0.4)');
    bgGlow.addColorStop(0.5, 'rgba(10, 5, 20, 0.2)');
    bgGlow.addColorStop(1, 'rgba(3, 3, 8, 0)');
    this.ctx.fillStyle = bgGlow;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Background Stars
    this.stars.forEach(star => {
      star.x += star.vx;
      star.y += star.vy;

      if (star.x < 0) star.x = this.width;
      if (star.x > this.width) star.x = 0;
      if (star.y < 0) star.y = this.height;
      if (star.y > this.height) star.y = 0;

      star.alpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
      const finalAlpha = Math.max(0.1, Math.min(0.9, star.alpha));

      this.ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 3. Constellations
    if (state.activeScreen === 'galaxy' || state.activeScreen === 'final') {
      this.drawConstellations();
    }

    // 4. Interactive Stars
    if (state.activeScreen === 'galaxy') {
      let currentHovered = null;

      this.interactiveStars.forEach(star => {
        star.pulseAngle += 0.03;
        const pulse = Math.sin(star.pulseAngle) * 2;

        const dx = state.mouse.x - star.x;
        const dy = state.mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 25) {
          currentHovered = star;
          star.currentRadius = star.baseRadius + 4;
        } else {
          star.currentRadius = star.baseRadius;
        }

        const glowRadius = (star.currentRadius + pulse + (star.discovered ? 8 : 4));
        const glow = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowRadius * 2.5
        );

        if (star.discovered) {
          glow.addColorStop(0, 'rgba(255, 105, 180, 0.8)');
          glow.addColorStop(0.5, 'rgba(138, 43, 226, 0.4)');
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          glow.addColorStop(0.5, 'rgba(138, 43, 226, 0.3)');
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, glowRadius * 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = star.discovered ? '#ff69b4' : '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
      });

      // 5. Secret Star
      if (state.secretStarRevealed && this.secretStar) {
        const secret = this.secretStar;
        secret.pulseAngle += 0.05;
        const pulse = Math.sin(secret.pulseAngle) * 4;

        const dx = state.mouse.x - secret.x;
        const dy = state.mouse.y - secret.y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          currentHovered = secret;
        }

        const goldGlow = this.ctx.createRadialGradient(
          secret.x, secret.y, 0,
          secret.x, secret.y, (secret.currentRadius + pulse) * 3
        );
        goldGlow.addColorStop(0, 'rgba(255, 215, 0, 1)');
        goldGlow.addColorStop(0.5, 'rgba(255, 105, 180, 0.5)');
        goldGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = goldGlow;
        this.ctx.beginPath();
        this.ctx.arc(secret.x, secret.y, (secret.currentRadius + pulse) * 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(secret.x, secret.y, secret.currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }

      state.hoveredStar = currentHovered;
      this.updateTooltip();
    }

    // 6. Burst Particles
    this.particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;

      if (p.alpha <= 0) {
        this.particles.splice(index, 1);
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }
    });

    requestAnimationFrame(() => this.animate());
  }

  updateTooltip() {
    const tooltip = document.getElementById('starTooltip');
    const tooltipText = document.getElementById('tooltipText');

    if (state.hoveredStar) {
      tooltipText.innerText = state.hoveredStar.title ? state.hoveredStar.title.toUpperCase() : "A MEMORY";
      tooltip.style.left = `${state.hoveredStar.x}px`;
      tooltip.style.top = `${state.hoveredStar.y}px`;
      tooltip.classList.remove('hidden');
    } else {
      tooltip.classList.add('hidden');
    }
  }
}

// ==========================================================================
// 4. MUSIC & AUDIO MANAGER
// ==========================================================================
function initAudioEngine() {
  state.audioElement = document.getElementById('bgMusic');
  state.audioElement.src = CONFIG.musicFile;
  document.getElementById('musicTitle').innerText = CONFIG.musicTitle;

  const musicToggle = document.getElementById('musicToggle');
  musicToggle.addEventListener('click', toggleMusic);
}

function toggleMusic() {
  if (state.musicPlaying) {
    state.audioElement.pause();
    state.musicPlaying = false;
    document.querySelector('.music-icon').innerText = '🔇';
  } else {
    state.audioElement.play().then(() => {
      state.musicPlaying = true;
      document.querySelector('.music-icon').innerText = '♫';
    }).catch(err => console.log("Autoplay blocked or audio load error:", err));
  }
}

// ==========================================================================
// 5. MEMORY MODAL SYSTEM
// ==========================================================================
function openMemoryModal(star) {
  const modal = document.getElementById('memoryModal');
  document.getElementById('modalNumber').innerText = `MEMORY 0${star.id}`;
  document.getElementById('modalTitle').innerText = star.title;
  document.getElementById('modalDate').innerText = star.date;
  document.getElementById('modalImage').src = star.image;
  document.getElementById('modalMessage').innerText = star.message;

  modal.classList.remove('hidden');

  if (!star.discovered) {
    star.discovered = true;
    state.discoveredStars.add(star.id);
    galaxy.spawnBurstParticles(star.x, star.y);
    updateTracker();
  }
}

function closeModal() {
  document.getElementById('memoryModal').classList.add('hidden');
}

function updateTracker() {
  const total = CONFIG.memories.length;
  const current = state.discoveredStars.size;
  document.getElementById('memoryTracker').innerText = `${current} / ${total}`;

  if (current === total && !state.secretStarRevealed) {
    state.secretStarRevealed = true;
    setTimeout(() => {
      document.getElementById('secretStarBanner').classList.remove('hidden');
    }, 1000);
  }
}

// ==========================================================================
// 6. CINEMATIC FINAL REVEAL & CELEBRATION
// ==========================================================================
function startFinalSequence() {
  state.activeScreen = 'final';
  document.getElementById('galaxyHud').classList.add('hidden');
  document.getElementById('finalRevealSection').classList.remove('hidden');

  const line1 = document.getElementById('cinematicLine1');
  const line2 = document.getElementById('cinematicLine2');
  const line3 = document.getElementById('cinematicLine3');
  const heart = document.getElementById('cinematicHeart');
  const line4 = document.getElementById('cinematicLine4');
  const btn = document.getElementById('continueToLetterBtn');

  line1.innerText = "Out of billions of people...";
  line2.innerText = "somehow, our paths crossed.";
  line3.innerText = "And I'm really glad they did.";
  line4.innerText = "YOU ARE MY FAVORITE PART OF THIS UNIVERSE.";

  setTimeout(() => line1.classList.add('visible'), 1000);
  setTimeout(() => line2.classList.add('visible'), 3500);
  setTimeout(() => line3.classList.add('visible'), 6000);
  setTimeout(() => heart.classList.remove('hidden'), 8500);
  setTimeout(() => line4.classList.add('visible'), 10000);
  setTimeout(() => btn.classList.remove('hidden'), 12500);
}

function populateGallery() {
  const grid = document.getElementById('photoGalleryGrid');
  grid.innerHTML = '';

  CONFIG.memories.forEach((mem, index) => {
    const card = document.createElement('div');
    card.className = 'photo-card glass-card';
    card.style.setProperty('--rotation', (index % 2 === 0 ? 2 : -2));

    card.innerHTML = `
      <img src="${mem.image}" alt="${mem.title}">
      <div class="photo-caption">${mem.title}</div>
      <div class="photo-date">${mem.date}</div>
    `;
    grid.appendChild(card);
  });
}

function triggerCelebration() {
  state.activeScreen = 'celebration';
  const overlay = document.getElementById('celebrationOverlay');
  
  // Reset and trigger Rose Constellation SVG Drawing Animation
  overlay.classList.add('hidden');
  void overlay.offsetWidth; // Force CSS reflow
  overlay.classList.remove('hidden');

  // Spawn particle bursts across screen
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      galaxy.spawnBurstParticles(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }, i * 300);
  }
}

// Complete State & UI Reset function for Replay
function replayUniverse() {
  // 1. Reset Global State
  state.activeScreen = 'galaxy';
  state.discoveredStars.clear();
  state.secretStarRevealed = false;
  state.secretStarUnlocked = false;

  // 2. Reset Interactive Stars
  if (galaxy) {
    galaxy.interactiveStars.forEach(star => {
      star.discovered = false;
    });
  }

  // 3. Reset Tracker & Secret Banner UI
  updateTracker();
  document.getElementById('secretStarBanner').classList.add('hidden');

  // 4. Hide Overlay Screens & Modals
  document.getElementById('celebrationOverlay').classList.add('hidden');
  document.getElementById('finalRevealSection').classList.add('hidden');
  document.getElementById('memoryModal').classList.add('hidden');

  // 5. Reset Cinematic Sequence Stage Text Visibilities
  const line1 = document.getElementById('cinematicLine1');
  const line2 = document.getElementById('cinematicLine2');
  const line3 = document.getElementById('cinematicLine3');
  const heart = document.getElementById('cinematicHeart');
  const line4 = document.getElementById('cinematicLine4');
  const btn = document.getElementById('continueToLetterBtn');

  line1.classList.remove('visible');
  line2.classList.remove('visible');
  line3.classList.remove('visible');
  heart.classList.add('hidden');
  line4.classList.remove('visible');
  btn.classList.add('hidden');

  // 6. Reset Stage Container Views
  document.getElementById('cinematicTextStage').classList.remove('hidden');
  document.getElementById('letterAndGalleryStage').classList.add('hidden');

  // 7. Reveal Galaxy HUD
  document.getElementById('galaxyHud').classList.remove('hidden');
}

// ==========================================================================
// 7. EASTER EGGS & TOAST MESSAGES
// ==========================================================================
function showSecretToast(msg) {
  const toast = document.getElementById('secretToast');
  toast.innerText = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

function initEasterEggs() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'l' || e.key === 'L') {
      showSecretToast("SECRET MESSAGE UNLOCKED: I love you endlessly! ❤️");
    }
  });

  const title = document.querySelector('.main-title');
  if (title) {
    title.addEventListener('click', () => {
      state.easterEggClicks++;
      if (state.easterEggClicks === 5) {
        showSecretToast("You found something that wasn't supposed to be found. 👀❤️");
        state.easterEggClicks = 0;
      }
    });
  }
}

// ==========================================================================
// 8. INITIALIZATION & EVENT LISTENERS
// ==========================================================================
let galaxy = null;

window.addEventListener('DOMContentLoaded', () => {
  galaxy = new GalaxyEngine('galaxyCanvas');
  initAudioEngine();
  initEasterEggs();
  populateGallery();

  window.addEventListener('mousemove', (e) => {
    state.mouse.targetX = e.clientX;
    state.mouse.targetY = e.clientY;

    const cursor = document.getElementById('cursorGlow');
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      state.mouse.targetX = e.touches[0].clientX;
      state.mouse.targetY = e.touches[0].clientY;
    }
  });

  // Simulated Loader
  let progress = 0;
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);

      setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('introScreen').classList.remove('hidden');
        state.activeScreen = 'intro';
      }, 500);
    }
    progressBar.style.width = `${progress}%`;
    progressText.innerText = `${progress}%`;
  }, 120);

  // Intro Button
  document.getElementById('enterBtn').addEventListener('click', () => {
    document.getElementById('introScreen').classList.add('hidden');
    document.getElementById('galaxyHud').classList.remove('hidden');
    state.activeScreen = 'galaxy';

    if (!state.musicPlaying) {
      toggleMusic();
    }
  });

  // Star Click Handler
  galaxy.canvas.addEventListener('click', () => {
    if (state.activeScreen !== 'galaxy') return;

    if (state.hoveredStar) {
      if (state.hoveredStar.id === 'secret') {
        startFinalSequence();
      } else {
        openMemoryModal(state.hoveredStar);
      }
    }
  });

  // Modal Closers
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('modalCloseActionBtn').addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Continue to Letter
  document.getElementById('continueToLetterBtn').addEventListener('click', () => {
    document.getElementById('cinematicTextStage').classList.add('hidden');
    document.getElementById('letterAndGalleryStage').classList.remove('hidden');
    document.getElementById('letterTextContainer').innerText = CONFIG.loveLetter;
  });

  // Final Action Buttons
  document.getElementById('yesBtn1').addEventListener('click', triggerCelebration);
  document.getElementById('yesBtn2').addEventListener('click', triggerCelebration);

  // Replay Button Click Listener
  document.getElementById('replayBtn').addEventListener('click', replayUniverse);
});