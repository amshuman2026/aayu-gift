/* ============================================================
   Aayushi & Me · Stage 2 — interior hallway + 4 rooms
   Vanilla JS. All copy/media comes from /content/rooms.json.
   ============================================================ */
(() => {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STORE_KEY = "aayushiHouse.progress.v1";
  const ORDER = ["timeCapsule", "gameRoom", "danceRoom", "finalDoor"];
  const DOOR_BOX = {
    timeCapsule: { x: "39.2%", y: "24.2%", w: "5.6%", h: "24%" },
    gameRoom: { x: "50.0%", y: "24.2%", w: "6.2%", h: "24%" },
    danceRoom: { x: "65.7%", y: "24.2%", w: "5.6%", h: "24%" },
    finalDoor: { x: "76.4%", y: "24.2%", w: "5.6%", h: "24%" },
  };

  const interior = document.getElementById("interior");
  const hall = document.getElementById("hall");
  const doorsEl = document.getElementById("hallDoors");
  const roomsEl = document.getElementById("rooms");
  const toastEl = document.getElementById("hallToast");
  if (!interior || !doorsEl || !roomsEl) return;

  /* ---------------- progress ---------------- */
  const done = { timeCapsule: false, gameRoom: false, danceRoom: false, finalDoor: false };
  try {
    Object.assign(done, JSON.parse(localStorage.getItem(STORE_KEY) || "{}"));
  } catch {
    /* corrupted store — start fresh */
  }
  const save = () => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(done));
    } catch {
      /* private mode — progress just won't persist */
    }
  };
  const isUnlocked = (id) => {
    const i = ORDER.indexOf(id);
    return i === 0 ? true : done[ORDER[i - 1]] === true;
  };
  const markDone = (id) => {
    if (done[id]) return;
    done[id] = true;
    save();
    paintDoors();
    const next = ORDER[ORDER.indexOf(id) + 1];
    if (next) toast("A new door just unlocked \u2014 " + labelOf(next) + ".");
  };

  let content = null;
  const labelOf = (id) => {
    const d = content && content.hallway.doors.find((x) => x.room === id);
    return d ? d.name : id;
  };

  let toastTimer = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("show"), 2800);
  }

  /* ---------------- doors ---------------- */
  function paintDoors() {
    doorsEl.querySelectorAll(".door-hot").forEach((btn) => {
      const open = isUnlocked(btn.dataset.room);
      btn.classList.toggle("unlocked", open);
      btn.classList.toggle("locked", !open);
      btn.setAttribute("aria-disabled", String(!open));
      btn.setAttribute(
        "aria-label",
        labelOf(btn.dataset.room) + (open ? " \u2014 open this door" : " \u2014 locked")
      );
    });
  }

  function buildDoors() {
    content.hallway.doors.forEach((d) => {
      const box = DOOR_BOX[d.room];
      const btn = document.createElement("button");
      btn.className = "door-hot";
      btn.dataset.room = d.room;
      btn.dataset.testid = "hall-door-" + d.room.toLowerCase();
      btn.style.cssText = `--x:${box.x};--y:${box.y};--w:${box.w};--h:${box.h}`;
      btn.innerHTML =
        '<span class="door-lock" aria-hidden="true">&#128274;</span>' +
        '<span class="door-plate" data-testid="door-plate-' +
        d.room.toLowerCase() +
        '">' +
        d.name +
        "</span>";
      btn.addEventListener("click", () => {
        if (!isUnlocked(d.room)) {
          btn.classList.remove("shake");
          void btn.offsetWidth;
          btn.classList.add("shake");
          toast(content.hallway.lockedMessage);
          return;
        }
        openRoom(d.room);
      });
      btn.addEventListener("animationend", (e) => {
        if (e.animationName === "doorShake") btn.classList.remove("shake");
      });
      doorsEl.appendChild(btn);
    });
    paintDoors();
  }

  /* ---------------- room shell ---------------- */
  const rooms = {};
  let openId = null;

  function roomShell(id, title, subtitle) {
    const sec = document.createElement("section");
    sec.className = "room";
    sec.id = "room-" + id;
    sec.dataset.testid = "room-" + id.toLowerCase();
    sec.setAttribute("aria-label", title);
    const head = document.createElement("header");
    head.className = "room-head";
    head.innerHTML =
      "<h2>" + title + "</h2><p>" + (subtitle || "") + "</p>";
    const back = document.createElement("button");
    back.className = "back-hall";
    back.dataset.testid = "back-to-hallway-" + id.toLowerCase();
    back.textContent = "\u2190 Back to hallway";
    back.addEventListener("click", closeRoom);
    head.appendChild(back);
    const body = document.createElement("div");
    body.className = "room-body";
    sec.append(head, body);
    roomsEl.appendChild(sec);
    rooms[id] = { el: sec, body, back };
    return body;
  }

  function openRoom(id) {
    if (openId) return;
    openId = id;
    interior.classList.add("pushing");
    window.setTimeout(
      () => {
        rooms[id].el.classList.add("open");
        rooms[id].back.focus({ preventScroll: true });
        if (id === "timeCapsule") renderMemory();
      },
      REDUCED ? 60 : 620
    );
  }

  function closeRoom() {
    if (!openId) return;
    const r = rooms[openId];
    r.el.querySelectorAll("video").forEach((v) => v.pause());
    r.el.classList.remove("open");
    interior.classList.remove("pushing");
    const btn = doorsEl.querySelector('[data-room="' + openId + '"]');
    openId = null;
    if (btn) btn.focus({ preventScroll: true });
  }

  /* a video frame that works both with a real file and with an empty slot */
  function mediaFrame(src, poster, emptyTitle, emptyNote, onPlayed, testid) {
    const box = document.createElement("div");
    box.className = "media";
    box.dataset.testid = testid;
    if (src) {
      const v = document.createElement("video");
      v.src = src;
      if (poster) v.poster = poster;
      v.controls = true;
      v.preload = "metadata";
      v.playsInline = true;
      v.dataset.testid = testid + "-video";
      v.addEventListener("ended", () => onPlayed && onPlayed());
      box.appendChild(v);
      return { el: box, play: () => v.play().catch(() => {}) };
    }
    const wrap = document.createElement("div");
    wrap.className = "media-empty";
    wrap.innerHTML =
      "<strong>" + emptyTitle + "</strong><small>" + emptyNote + "</small>";
    const bar = document.createElement("div");
    bar.className = "progress";
    bar.innerHTML = "<i></i>";
    const btn = document.createElement("button");
    btn.className = "pill";
    btn.textContent = "\u25B6 Play";
    btn.dataset.testid = testid + "-play";
    let playing = false;
    const play = () => {
      if (playing) return;
      playing = true;
      btn.disabled = true;
      const fill = bar.querySelector("i");
      const dur = REDUCED ? 120 : 1100;
      const t0 = performance.now();
      const tick = () => {
        const p = Math.min(1, (performance.now() - t0) / dur);
        fill.style.width = (p * 100).toFixed(1) + "%";
        if (p < 1) window.requestAnimationFrame(tick);
        else {
          playing = false;
          btn.disabled = false;
          btn.textContent = "\u21BB Play again";
          if (onPlayed) onPlayed();
        }
      };
      window.requestAnimationFrame(tick);
    };
    btn.addEventListener("click", play);
    wrap.append(bar, btn);
    box.appendChild(wrap);
    return { el: box, play };
  }

  /* ---------------- room 1 · time capsule ---------------- */
  let tcIndex = 0;
  let tcRefs = null;

  function buildTimeCapsule() {
    const c = content.timeCapsule;
    const body = roomShell("timeCapsule", c.title, c.subtitle);

    const collage = document.createElement("div");
    collage.className = "collage";
    collage.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 36; i++) {
      const s = document.createElement("span");
      s.style.animationDelay = (-i * 0.31).toFixed(2) + "s";
      collage.appendChild(s);
    }
    rooms.timeCapsule.el.appendChild(collage);

    const counter = document.createElement("p");
    counter.className = "counter";
    counter.dataset.testid = "memory-counter";

    const stage = document.createElement("div");
    stage.style.width = "min(760px, 100%)";
    stage.dataset.testid = "memory-stage";

    const caption = document.createElement("p");
    caption.className = "caption";
    caption.dataset.testid = "memory-caption";

    const row = document.createElement("div");
    row.className = "row";
    const prev = document.createElement("button");
    prev.className = "pill";
    prev.textContent = "\u2190 Previous";
    prev.dataset.testid = "memory-prev";
    const next = document.createElement("button");
    next.className = "pill";
    next.textContent = "Next \u2192";
    next.dataset.testid = "memory-next";
    prev.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));
    row.append(prev, next);

    const strip = document.createElement("div");
    strip.className = "tc-strip";
    strip.dataset.testid = "memory-strip";
    c.memories.forEach((m, i) => {
      const dot = document.createElement("button");
      dot.className = "tc-dot";
      dot.textContent = String(i + 1);
      dot.dataset.testid = "memory-dot-" + (i + 1);
      dot.setAttribute("aria-label", "Memory " + (i + 1));
      dot.addEventListener("click", () => {
        tcIndex = i;
        renderMemory();
      });
      strip.appendChild(dot);
    });

    body.append(counter, stage, caption, row, strip);
    tcRefs = { counter, stage, caption, strip, prev, next };
  }

  function step(dir) {
    const total = content.timeCapsule.memories.length;
    tcIndex = (tcIndex + dir + total) % total;
    renderMemory();
  }

  function renderMemory() {
    if (!tcRefs) return;
    const list = content.timeCapsule.memories;
    const m = list[tcIndex];
    tcRefs.counter.textContent = "Memory " + (tcIndex + 1) + " of " + list.length;
    tcRefs.caption.textContent = m.caption || "";
    tcRefs.stage.textContent = "";
    const frame = mediaFrame(
      m.video,
      m.poster,
      "Memory " + (tcIndex + 1),
      m.video ? "" : "this video slot is waiting for its file",
      () => markDone("timeCapsule"),
      "memory-player"
    );
    tcRefs.stage.appendChild(frame.el);
    tcRefs.strip.querySelectorAll(".tc-dot").forEach((d, i) => {
      d.classList.toggle("active", i === tcIndex);
    });
    const active = tcRefs.strip.children[tcIndex];
    if (active) active.scrollIntoView({ block: "nearest", inline: "center" });
  }

  /* ---------------- room 2 · game room ---------------- */
  let qIndex = 0;
  let qRefs = null;

  function buildGameRoom() {
    const c = content.gameRoom;
    const body = roomShell("gameRoom", c.title, "ten questions, one heart");

    const counter = document.createElement("p");
    counter.className = "counter";
    counter.dataset.testid = "quiz-counter";

    const quiz = document.createElement("div");
    quiz.className = "quiz";
    const photo = document.createElement("div");
    photo.className = "quiz-photo";
    photo.dataset.testid = "quiz-photo";
    const q = document.createElement("h3");
    q.className = "quiz-q";
    q.dataset.testid = "quiz-question";
    const opts = document.createElement("div");
    opts.className = "options";
    opts.dataset.testid = "quiz-options";
    const fb = document.createElement("p");
    fb.className = "feedback";
    fb.dataset.testid = "quiz-feedback";
    fb.setAttribute("role", "status");
    fb.setAttribute("aria-live", "polite");
    quiz.append(photo, q, opts, fb);

    const finish = document.createElement("div");
    finish.className = "quiz";
    finish.style.display = "none";
    finish.dataset.testid = "quiz-complete";
    finish.innerHTML =
      '<h3 class="quiz-q">' +
      c.completion.title +
      '</h3><p class="caption">' +
      c.completion.text +
      "</p>";
    const again = document.createElement("button");
    again.className = "pill";
    again.textContent = "Play again";
    again.dataset.testid = "quiz-replay";
    again.addEventListener("click", () => {
      qIndex = 0;
      finish.style.display = "none";
      quiz.style.display = "grid";
      renderQuestion();
    });
    finish.appendChild(again);

    body.append(counter, quiz, finish);
    qRefs = { counter, quiz, photo, q, opts, fb, finish };
    renderQuestion();
  }

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function renderQuestion() {
    const c = content.gameRoom;
    const item = c.questions[qIndex];
    qRefs.counter.textContent = "Question " + (qIndex + 1) + " of " + c.questions.length;
    qRefs.fb.textContent = "";
    qRefs.fb.classList.remove("good");
    qRefs.photo.textContent = "";
    const hasImageOptions = Array.isArray(item.optionImages) && item.optionImages.length > 0;
    if (item.video) {
      /* Q8 is a video, not a photo */
      const v = document.createElement("video");
      v.src = item.video;
      v.controls = true;
      v.preload = "metadata";
      v.playsInline = true;
      v.dataset.testid = "quiz-video";
      qRefs.photo.style.display = "";
      qRefs.photo.appendChild(v);
    } else if (item.photo) {
      const img = document.createElement("img");
      img.src = item.photo;
      img.alt = "";
      img.addEventListener("error", () => {
        img.remove();
        qRefs.photo.textContent = "photo for question " + (qIndex + 1) + " goes here";
      });
      qRefs.photo.style.display = "";
      qRefs.photo.appendChild(img);
    } else if (hasImageOptions) {
      /* Q9's answers are the pictures — it never had a header photo */
      qRefs.photo.style.display = "none";
    } else {
      qRefs.photo.style.display = "";
      qRefs.photo.textContent = "photo for question " + (qIndex + 1) + " goes here";
    }
    qRefs.q.textContent = item.question || "Question " + (qIndex + 1);
    qRefs.opts.textContent = "";
    const list = hasImageOptions ? item.optionImages : item.options;
    list.forEach((value, i) => {
      const b = document.createElement("button");
      b.className = "opt" + (hasImageOptions ? " opt-img" : "");
      if (hasImageOptions) {
        const oimg = document.createElement("img");
        oimg.src = value;
        oimg.alt = "Option " + (i + 1);
        oimg.addEventListener("error", () => {
          oimg.remove();
          b.textContent = "Option " + (i + 1) + " \u2014 photo coming";
        });
        b.appendChild(oimg);
        b.setAttribute("aria-label", "Option " + (i + 1));
      } else {
        b.textContent = value || "option " + (i + 1);
      }
      b.dataset.testid = "quiz-option-" + (i + 1);
      b.addEventListener("click", () => answer(b, i));
      qRefs.opts.appendChild(b);
    });
  }

  function answer(btn, i) {
    const c = content.gameRoom;
    const item = c.questions[qIndex];
    /* correctIndex null = answer not decided yet (Q5) — accept anything rather than dead-end */
    if (item.correctIndex !== null && i !== item.correctIndex) {
      btn.classList.remove("wrong");
      void btn.offsetWidth;
      btn.classList.add("wrong");
      qRefs.fb.classList.remove("good");
      qRefs.fb.textContent = pick(c.wrongMessages);
      return;
    }
    btn.classList.add("right");
    qRefs.fb.classList.add("good");
    qRefs.fb.textContent = pick(c.rightMessages);
    qRefs.opts.querySelectorAll(".opt").forEach((b) => (b.disabled = true));
    window.setTimeout(
      () => {
        if (qIndex + 1 < c.questions.length) {
          qIndex += 1;
          renderQuestion();
        } else {
          qRefs.quiz.style.display = "none";
          qRefs.finish.style.display = "grid";
          markDone("gameRoom");
        }
      },
      REDUCED ? 220 : 1150
    );
  }

  /* ---------------- room 3 · dance room ---------------- */
  function buildDanceRoom() {
    const c = content.danceRoom;
    const body = roomShell("danceRoom", c.title, "two songs, one floor");
    const grid = document.createElement("div");
    grid.className = "dance-grid";
    const played = [false, false];
    const cards = [];

    c.videos.forEach((v, i) => {
      const card = document.createElement("div");
      card.className = "dance-card";
      card.dataset.testid = "dance-card-" + (i + 1);
      const h = document.createElement("h3");
      h.textContent = v.title;
      const note = document.createElement("p");
      note.className = "lock-note";
      note.dataset.testid = "dance-lock-note-" + (i + 1);
      note.textContent = i === 1 ? c.lockedLabel : "";
      const frame = mediaFrame(
        v.video,
        v.poster,
        v.title,
        v.video ? "" : "this video slot is waiting for its file",
        () => {
          played[i] = true;
          if (i === 0) unlockSecond();
          if (played[0] && played[1]) markDone("danceRoom");
        },
        "dance-player-" + (i + 1)
      );
      card.append(h, frame.el, note);
      grid.appendChild(card);
      cards.push(card);
    });

    function unlockSecond() {
      cards[1].classList.remove("is-locked");
      cards[1].querySelector(".lock-note").textContent = "Unlocked \u2014 this one's yours.";
    }
    cards[1].classList.add("is-locked");
    body.appendChild(grid);
    if (done.danceRoom) {
      played[0] = true;
      played[1] = true;
      unlockSecond();
    }
  }

  /* ---------------- room 4 · final room ---------------- */
  function buildFinalRoom() {
    const c = content.finalDoor;
    const body = roomShell("finalDoor", c.title, "the last door in the house");
    const cap = document.createElement("p");
    cap.className = "caption" + (REDUCED ? "" : " cap-hidden");
    cap.dataset.testid = "final-caption";
    cap.textContent = c.caption || "";
    const frame = mediaFrame(
      c.video,
      c.poster,
      c.title,
      c.video ? "" : c.emptyText,
      () => {
        cap.classList.remove("cap-hidden");
        markDone("finalDoor");
      },
      "final-player"
    );
    body.append(frame.el, cap);
  }

  /* ---------------- boot ---------------- */
  fetch("content/rooms.json", { cache: "no-cache" })
    .then((r) => r.json())
    .then((data) => {
      content = data;
      if (hall) {
        const bg = hall.querySelector(".hall-bg");
        if (bg && data.hallway.background) bg.setAttribute("src", data.hallway.background);
      }
      buildDoors();
      buildTimeCapsule();
      buildGameRoom();
      buildDanceRoom();
      buildFinalRoom();
      if (window.AayushiHouse && window.AayushiHouse.rooms) {
        window.AayushiHouse.rooms.danceRoom = {
          id: "danceRoom",
          label: "Dance Room",
          unlocked: false,
        };
        ORDER.forEach((id) => {
          const r = window.AayushiHouse.rooms[id];
          if (r) r.unlocked = isUnlocked(id);
        });
      }
    })
    .catch(() => toast("Couldn't load the rooms \u2014 please refresh."));

  /* ---------------- hallway parallax (a few pixels of life) ---------------- */
  if (!REDUCED && hall) {
    const frame = hall.querySelector(".hall-frame");
    let hx = 0;
    let hy = 0;
    let hraf = 0;
    let htx = 0;
    let hty = 0;
    window.addEventListener(
      "pointermove",
      (e) => {
        htx = (e.clientX / window.innerWidth - 0.5) * 8;
        hty = (e.clientY / window.innerHeight - 0.5) * 5;
        if (!hraf) hraf = window.requestAnimationFrame(driftHall);
      },
      { passive: true }
    );
    function driftHall() {
      hx += (htx - hx) * 0.06;
      hy += (hty - hy) * 0.06;
      frame.style.transform =
        "translate3d(" + hx.toFixed(2) + "px," + hy.toFixed(2) + "px,0)";
      hraf =
        Math.abs(htx - hx) > 0.05 || Math.abs(hty - hy) > 0.05
          ? window.requestAnimationFrame(driftHall)
          : 0;
    }
  }

  /* capture phase, so Stage 1's Escape handler doesn't also step outside */
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && openId) {
        e.stopImmediatePropagation();
        closeRoom();
      }
    },
    true
  );
})();
