/* ============================================================
   Aayushi & Me — Our Little House · Stage 1
   Vanilla JS: stars, fireflies, parallax, door sequence,
   easter eggs, mailbox note, reduced-motion support.
   ============================================================ */
(() => {
  "use strict";

  /* ---------------- stage configuration (structure only) ---------------- */
  const rooms = {
    livingRoom: { id: "livingRoom", label: "Living Room", unlocked: false },
    memoryRoom: { id: "memoryRoom", label: "Memory Room", unlocked: false },
    gameRoom: { id: "gameRoom", label: "Game Room", unlocked: false },
    lettersRoom: { id: "lettersRoom", label: "Letters Room", unlocked: false },
    musicRoom: { id: "musicRoom", label: "Music Room", unlocked: false },
    travelRoom: { id: "travelRoom", label: "Travel Room", unlocked: false },
    balcony: { id: "balcony", label: "Balcony", unlocked: false },
    timeCapsule: { id: "timeCapsule", label: "Time Capsule", unlocked: true },
    danceRoom: { id: "danceRoom", label: "Dance Room", unlocked: false },
    bedroom: { id: "bedroom", label: "Bedroom", unlocked: false },
    finalDoor: { id: "finalDoor", label: "Final Door", unlocked: false },
  };

  /* Stage 2 hook — real playback arrives with the rooms. */
  const AudioManager = {
    playAmbient(track) {
      void track;
    },
    playSFX(name) {
      void name;
    },
    setRoomTrack(room) {
      void room;
    },
  };
  window.AayushiHouse = { rooms, AudioManager };

  /* ---------------- environment ---------------- */
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COARSE = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (REDUCED) document.body.classList.add("reduced");

  const $ = (id) => document.getElementById(id);
  const scene = $("scene");
  const starsEl = $("stars");
  const skyParallax = document.querySelector(".layer-sky .parallax");
  const fireflyLayer = $("fireflyLayer");
  const narrative = document.querySelector(".narrative");
  const hintMain = $("hintMain");
  const hintSub = $("hintSub");
  const doorGroup = $("doorGroup");
  const mailboxGroup = $("mailboxGroup");
  const mailboxPop = $("mailboxPop");
  const noteCloseBtn = $("noteCloseBtn");
  const moonBtn = $("moonBtn");
  const chimneyGroup = $("chimneyGroup");
  const smokeGroup = $("smokeGroup");
  const catBody = document.querySelector(".cat-body");
  const bushGroup = $("bushGroup");
  const interior = $("interior");
  const stepOutsideBtn = $("stepOutsideBtn");
  const loader = $("loader");

  let W = window.innerWidth;
  let H = window.innerHeight;

  /* ---------------- loader → ready ---------------- */
  const loaderTimeout = REDUCED ? 250 : 2350;
  window.setTimeout(() => {
    loader.classList.add("done");
    document.body.classList.add("ready");
    window.setTimeout(showHints, REDUCED ? 200 : 800);
  }, loaderTimeout);

  function showHints() {
    if (narrative.classList.contains("gone")) return;
    hintMain.classList.add("show");
    window.setTimeout(() => hintSub.classList.add("show"), 1900);
  }

  /* dismiss the beats on first interaction */
  const dismissHints = () => narrative.classList.add("gone");
  window.addEventListener("pointerdown", dismissHints, { once: true, passive: true });
  window.addEventListener("keydown", dismissHints, { once: true });

  /* ---------------- stars ---------------- */
  const STAR_COUNT = 78;
  const TWINKLE_COUNT = 26;
  for (let i = 0; i < STAR_COUNT; i++) {
    const s = document.createElement("span");
    const size = 1 + Math.random() * 1.6;
    s.className = "star" + (Math.random() < 0.22 ? " star-warm" : "");
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.opacity = 0.2 + Math.random() * 0.5;
    if (i < TWINKLE_COUNT) {
      s.classList.add("twinkle");
      s.style.setProperty("--tw-dur", (2.5 + Math.random() * 3.5).toFixed(2) + "s");
      s.style.setProperty("--tw-delay", (-Math.random() * 6).toFixed(2) + "s");
    }
    starsEl.appendChild(s);
  }

  /* ---------------- moon easter egg → shooting star ---------------- */
  moonBtn.addEventListener("click", () => {
    moonBtn.classList.remove("moon-pulse");
    void moonBtn.offsetWidth;
    moonBtn.classList.add("moon-pulse");
    if (!REDUCED) spawnShootingStar();
    AudioManager.playSFX("moon");
  });

  function spawnShootingStar() {
    const trail = document.createElement("span");
    trail.className = "shooting-star";
    const wrap = moonBtn.getBoundingClientRect();
    const skyRect = skyParallax.getBoundingClientRect();
    trail.style.left = Math.max(10, wrap.left - skyRect.left - 160) + "px";
    trail.style.top = wrap.top - skyRect.top + 30 + "px";
    skyParallax.appendChild(trail);
    trail.addEventListener("animationend", () => trail.remove());
    window.setTimeout(() => trail.remove(), 2000);
  }

  /* ---------------- chimney easter egg → extra smoke ---------------- */
  chimneyGroup.addEventListener("click", () => {
    if (REDUCED) return;
    for (let i = 0; i < 3; i++) {
      window.setTimeout(() => {
        const puff = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puff.setAttribute("cx", 298 + (Math.random() * 10 - 5));
        puff.setAttribute("cy", 162);
        puff.setAttribute("r", 7 + Math.random() * 5);
        puff.setAttribute("class", "puff-extra");
        smokeGroup.appendChild(puff);
        puff.addEventListener("animationend", () => puff.remove());
        window.setTimeout(() => puff.remove(), 5000);
      }, i * 180);
    }
    AudioManager.playSFX("chimney");
  });

  /* ---------------- cat easter egg → stretch ---------------- */
  const catGroup = $("catGroup");
  catGroup.addEventListener("click", () => {
    catBody.classList.remove("stretch");
    void catBody.getBoundingClientRect();
    catBody.classList.add("stretch");
    AudioManager.playSFX("purr");
  });
  catBody.addEventListener("animationend", () => catBody.classList.remove("stretch"));

  /* ---------------- garden easter egg → rustle ---------------- */
  const bushFoli = bushGroup.querySelector(".foli");
  bushGroup.addEventListener("click", () => {
    bushFoli.classList.remove("rustle");
    void bushFoli.getBoundingClientRect();
    bushFoli.classList.add("rustle");
    AudioManager.playSFX("rustle");
  });
  bushFoli.addEventListener("animationend", () => bushFoli.classList.remove("rustle"));

  /* ---------------- mailbox note ---------------- */
  function setNote(open) {
    mailboxPop.classList.toggle("open", open);
    mailboxPop.setAttribute("aria-hidden", String(!open));
  }
  mailboxGroup.addEventListener("click", () => {
    setNote(!mailboxPop.classList.contains("open"));
    AudioManager.playSFX("mailbox");
  });
  noteCloseBtn.addEventListener("click", () => setNote(false));
  document.addEventListener("pointerdown", (e) => {
    if (!mailboxPop.classList.contains("open")) return;
    if (!mailboxPop.contains(e.target) && !mailboxGroup.contains(e.target)) setNote(false);
  });

  /* ---------------- front door sequence ---------------- */
  let entering = false;
  function enterHouse() {
    if (entering) return;
    entering = true;
    dismissHints();
    /* zoom origin = the door, in scene coordinates */
    const sceneRect = scene.getBoundingClientRect();
    const doorRect = doorGroup.getBoundingClientRect();
    scene.style.transformOrigin =
      (doorRect.left + doorRect.width / 2 - sceneRect.left) + "px " +
      (doorRect.top + doorRect.height / 2 - sceneRect.top) + "px";
    scene.classList.add("zooming");
    doorGroup.classList.add("opening");
    AudioManager.playAmbient("inside");
    window.setTimeout(() => {
      interior.classList.add("visible");
      stepOutsideBtn.focus({ preventScroll: true });
    }, REDUCED ? 450 : 2050);
  }
  doorGroup.addEventListener("click", enterHouse);
  doorGroup.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      enterHouse();
    }
  });

  function stepOutside() {
    if (!entering) return;
    entering = false;
    interior.classList.remove("visible");
    doorGroup.classList.remove("opening");
    scene.classList.remove("zooming");
    AudioManager.setRoomTrack(null);
  }
  stepOutsideBtn.addEventListener("click", stepOutside);

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (mailboxPop.classList.contains("open")) setNote(false);
    else if (interior.classList.contains("visible")) stepOutside();
  });

  /* ---------------- fireflies ---------------- */
  const FIREFLY_COUNT = Math.min(COARSE || W < 720 ? 5 : 7, 7);
  const fireflies = [];

  function seedFirefly() {
    const el = document.createElement("div");
    el.className = "firefly";
    el.setAttribute("aria-hidden", "true");
    el.dataset.testid = "firefly";
    fireflyLayer.appendChild(el);
    const f = {
      el,
      x: (0.06 + Math.random() * 0.88) * W,
      y: (0.44 + Math.random() * 0.4) * H,
      wp: null,
      wpUntil: 0,
      ease: 0.004 + Math.random() * 0.006,
      wf: 0.6 + Math.random() * 0.8,
      pr: 0.9 + Math.random() * 1.1,
      ph: Math.random() * Math.PI * 2,
      pauseUntil: 0,
      special: null,
      lit: false,
    };
    el.addEventListener("pointerenter", () => {
      f.lit = true;
      el.classList.add("lit");
      /* drift slightly away from the cursor */
      f.wp = { x: f.x + (Math.random() - 0.5) * 90, y: f.y - 30 - Math.random() * 40 };
      f.wpUntil = performance.now() / 1000 + 2.5;
    });
    el.addEventListener("pointerleave", () => {
      f.lit = false;
      el.classList.remove("lit");
    });
    el.addEventListener("click", () => {
      if (f.special) return;
      const glow = $("lanternGlow").getBoundingClientRect();
      f.special = { x: glow.left + glow.width / 2, y: glow.top + glow.height / 2 };
      AudioManager.playSFX("firefly");
    });
    return f;
  }
  for (let i = 0; i < FIREFLY_COUNT; i++) fireflies.push(seedFirefly());

  function newWaypoint(f, t) {
    f.wp = { x: (0.05 + Math.random() * 0.9) * W, y: (0.42 + Math.random() * 0.44) * H };
    f.ease = 0.004 + Math.random() * 0.006;
    f.wpUntil = t + 4 + Math.random() * 5;
  }

  function stepFirefly(f, t) {
    if (f.special) {
      f.x += (f.special.x - f.x) * 0.085;
      f.y += (f.special.y - f.y) * 0.085;
      if (Math.hypot(f.special.x - f.x, f.special.y - f.y) < 16) {
        f.special = null;
        f.pauseUntil = t + 1.3;
        f.wp = null;
      }
    } else if (t > f.pauseUntil) {
      if (!f.wp || Math.hypot(f.wp.x - f.x, f.wp.y - f.y) < 26 || t > f.wpUntil) newWaypoint(f, t);
      f.x += (f.wp.x - f.x) * f.ease;
      f.y += (f.wp.y - f.y) * f.ease;
      f.x += Math.sin(t * f.wf + f.ph) * 0.5;
      f.y += Math.cos(t * f.wf * 0.8 + f.ph) * 0.5;
    }
    f.x = Math.max(-20, Math.min(W + 20, f.x));
    f.y = Math.max(-20, Math.min(H + 20, f.y));
    const pulse = 0.4 + 0.45 * Math.abs(Math.sin(t * f.pr + f.ph));
    const scale = f.lit ? 1.3 : 1;
    f.el.style.opacity = pulse.toFixed(3);
    f.el.style.transform =
      "translate3d(" + f.x.toFixed(1) + "px," + f.y.toFixed(1) + "px,0) scale(" + scale + ")";
  }

  /* ---------------- parallax + idle drift ---------------- */
  const layers = Array.from(document.querySelectorAll(".parallax")).map((el) => ({
    el,
    f: parseFloat(el.dataset.depth || "0.05"),
  }));
  let pointerNX = 0;
  let pointerNY = 0;
  let lastPointerAt = -1e4;
  let px = 0;
  let py = 0;
  let raf = 0;

  window.addEventListener(
    "pointermove",
    (e) => {
      pointerNX = (e.clientX / W - 0.5) * 2;
      pointerNY = (e.clientY / H - 0.5) * 2;
      lastPointerAt = performance.now() / 1000;
    },
    { passive: true }
  );

  function loop(ts) {
    raf = window.requestAnimationFrame(loop);
    const t = ts / 1000;
    const idle = COARSE || t - lastPointerAt > 4;
    const tx = idle ? Math.sin(t * 0.12) * 9 : pointerNX * 26;
    const ty = idle ? Math.cos(t * 0.09) * 6 : pointerNY * 16;
    px += (tx - px) * 0.045;
    py += (ty - py) * 0.045;
    for (const l of layers) {
      l.el.style.transform =
        "translate3d(" + (px * l.f).toFixed(2) + "px," + (py * l.f * 0.7).toFixed(2) + "px,0)";
    }
    for (const f of fireflies) stepFirefly(f, t);
  }

  if (!REDUCED) {
    raf = window.requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
      } else {
        raf = window.requestAnimationFrame(loop);
      }
    });
  } else {
    /* static fireflies, gently lit */
    fireflies.forEach((f, i) => {
      f.x = (0.12 + (i / FIREFLY_COUNT) * 0.76) * W;
      f.y = (0.5 + (i % 3) * 0.09 + (i % 2 ? 0.06 : 0)) * H;
      f.el.style.opacity = 0.7;
      f.el.style.transform = "translate3d(" + f.x.toFixed(1) + "px," + f.y.toFixed(1) + "px,0)";
    });
  }

  /* ---------------- resize ---------------- */
  window.addEventListener("resize", () => {
    W = window.innerWidth;
    H = window.innerHeight;
  });
})();
