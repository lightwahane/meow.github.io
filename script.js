/* =========================================================
   EASY CUSTOMIZATION
   =========================================================
   1. Photos       -> paths in index.html
   2. Music        -> MUSIC_SRC below / index.html audio src
   3. Story text   -> index.html
   4. Colors       -> CSS variables in style.css
   5. Animation    -> TIMINGS below
   6. Particles    -> PARTICLE_DENSITY below
   ========================================================= */

const MUSIC_SRC = "love.mp3";
const PARTICLE_DENSITY = 0.62; // lower this for slower phones
const TIMINGS = {
  introPause: 1450,
  introLineGap: 1750,
  particleBurst: 180
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmall = window.matchMedia("(max-width: 480px)").matches;

document.documentElement.style.setProperty("--motion", reducedMotion ? "0" : "1");

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d", { alpha: true });
let particles = [];
let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function particleCount() {
  const base = isSmall ? 34 : 58;
  return Math.max(16, Math.round(base * PARTICLE_DENSITY));
}

function seedParticles() {
  particles = Array.from({ length: particleCount() }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.35 + .25,
    a: Math.random() * .32 + .08,
    vx: (Math.random() - .5) * .09,
    vy: -(Math.random() * .16 + .02),
    tw: Math.random() * Math.PI * 2
  }));
}

function renderParticles() {
  if (reducedMotion) return;
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    p.tw += .006;
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -5) p.y = height + 5;
    if (p.x < -5) p.x = width + 5;
    if (p.x > width + 5) p.x = -5;

    const alpha = p.a * (.7 + Math.sin(p.tw) * .3);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232, 201, 155, ${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(renderParticles);
}

resizeCanvas();
seedParticles();
window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
}, { passive: true });
renderParticles();

/* ---------- Intro typewriter / cinematic reveal ---------- */
const introLine = document.getElementById("introLine");
const continueCue = document.getElementById("continueCue");

const introSequence = [
  "Hey...",
  "I've been thinking about something.",
  "Not about today.",
  "About all the tomorrows."
];

let introStarted = false;

function typeLine(text, speed = 44) {
  return new Promise(resolve => {
    introLine.textContent = "";
    let i = 0;
    const tick = () => {
      introLine.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    };
    tick();
  });
}

async function runIntro() {
  if (introStarted) return;
  introStarted = true;

  for (let i = 0; i < introSequence.length; i++) {
    await typeLine(introSequence[i], reducedMotion ? 0 : (i === 0 ? 80 : 43));
    await new Promise(r => setTimeout(r, reducedMotion ? 350 : TIMINGS.introPause));
  }
  continueCue.classList.add("visible");
}
setTimeout(runIntro, reducedMotion ? 100 : 900);

/* ---------- Scene activation ---------- */
const scenes = [...document.querySelectorAll(".scene")];
const chapterLabel = document.getElementById("chapterLabel");

const sceneObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-active");
      const label = entry.target.dataset.chapter;
      if (label) chapterLabel.textContent = label;
    }
  });
}, { threshold: 0.25 });

scenes.forEach(scene => sceneObserver.observe(scene));

/* ---------- Gentle desktop / touch parallax ---------- */
const depthItems = [...document.querySelectorAll("[data-depth]")];

function applyParallax(x, y) {
  if (reducedMotion) return;
  depthItems.forEach(item => {
    const depth = Number(item.dataset.depth || .1);
    const tx = (x - .5) * depth * 34;
    const ty = (y - .5) * depth * 28;
    item.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${tx * .035 - 1}deg)`;
  });
}

window.addEventListener("pointermove", e => {
  if (e.pointerType === "mouse") {
    applyParallax(e.clientX / width, e.clientY / height);
  }
}, { passive: true });

window.addEventListener("deviceorientation", e => {
  if (reducedMotion || !isSmall) return;
  const x = Math.max(-30, Math.min(30, e.gamma || 0)) / 60 + .5;
  const y = Math.max(-30, Math.min(30, e.beta || 0)) / 60 + .5;
  applyParallax(x, y);
}, { passive: true });

/* ---------- Music ---------- */
const audio = document.getElementById("loveMusic");
const musicButton = document.getElementById("musicButton");
const musicText = document.getElementById("musicText");

audio.src = MUSIC_SRC;
let musicAvailable = true;

audio.addEventListener("error", () => {
  musicAvailable = false;
  musicText.textContent = "Music unavailable";
  musicButton.classList.remove("playing");
  musicButton.setAttribute("aria-label", "Music file not added yet");
});

musicButton.addEventListener("click", async () => {
  if (!musicAvailable) {
    musicText.textContent = "Add love.mp3";
    setTimeout(() => musicText.textContent = "Music", 1800);
    return;
  }

  try {
    if (audio.paused) {
      await audio.play();
      musicButton.classList.add("playing");
      musicText.textContent = "Playing";
      musicButton.setAttribute("aria-label", "Pause music");
    } else {
      audio.pause();
      musicButton.classList.remove("playing");
      musicText.textContent = "Music";
      musicButton.setAttribute("aria-label", "Play music");
    }
  } catch {
    musicAvailable = false;
    musicText.textContent = "Add love.mp3";
  }
});

audio.addEventListener("ended", () => {
  musicButton.classList.remove("playing");
  musicText.textContent = "Music";
});

/* ---------- Natural continuation: tapping intro moves forward ---------- */
document.querySelector(".scene-intro").addEventListener("click", () => {
  if (window.scrollY < window.innerHeight * .8) {
    document.querySelector(".memory-one").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }
});

/* ---------- Yes climax ---------- */
const yesButton = document.getElementById("yesButton");
const finale = document.getElementById("finale");
let celebrated = false;

function createCelebration() {
  if (celebrated) return;
  celebrated = true;

  const count = isSmall ? 110 : 165;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * .48;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "celebration-particle";
    const angle = Math.random() * Math.PI * 2;
    const velocity = 4 + Math.random() * (isSmall ? 8 : 12);
    const driftX = Math.cos(angle) * velocity;
    const driftY = Math.sin(angle) * velocity - (Math.random() * 4);
    const size = Math.random() < .13 ? 7 : 2 + Math.random() * 3;

    el.style.left = `${cx}px`;
    el.style.top = `${cy}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;

    if (Math.random() < .12) {
      el.textContent = "♥";
      el.style.background = "transparent";
      el.style.boxShadow = "none";
      el.style.fontSize = `${8 + Math.random() * 8}px`;
      el.style.color = "rgba(201,135,142,.9)";
    }

    document.body.appendChild(el);

    const duration = 1100 + Math.random() * 1700;
    el.animate([
      { transform: "translate3d(0,0,0) scale(.4) rotate(0deg)", opacity: 0 },
      { transform: `translate3d(${driftX * 9}px, ${driftY * 9}px, 0) scale(1) rotate(${Math.random()*360}deg)`, opacity: .95, offset: .28 },
      { transform: `translate3d(${driftX * 16}px, ${driftY * 16 + 180}px, 0) scale(.2) rotate(${Math.random()*720}deg)`, opacity: 0 }
    ], { duration, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" })
      .finished.finally(() => el.remove());
  }

  finale.classList.add("celebrate");

  if (!audio.paused) {
    audio.volume = Math.max(0, audio.volume - .35);
    setTimeout(() => { audio.volume = 1; }, 3200);
  }

  setTimeout(() => {
    finale.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }, 550);
}

yesButton.addEventListener("click", createCelebration);

/* ---------- Secret easter egg ---------- */
const secretTrigger = document.getElementById("secretTrigger");
const secretMessage = document.getElementById("secretMessage");

secretTrigger.addEventListener("click", () => {
  const showing = secretMessage.classList.toggle("show");
  secretMessage.setAttribute("aria-hidden", String(!showing));
  secretTrigger.textContent = showing ? "one last thing..." : "one more thing...";
});

/* ---------- Keyboard / accessibility ---------- */
document.addEventListener("keydown", e => {
  if (e.key === " " && document.activeElement === document.body) {
    e.preventDefault();
    const next = scenes.find(scene => scene.getBoundingClientRect().top > window.innerHeight * .35);
    if (next) next.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }
});
