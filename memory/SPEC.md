# Aayushi & Me — Interactive Anniversary House (Stage 1)

## What it is
A static, vanilla HTML/CSS/JS site (no backend, no auth, no DB usage) — the night exterior of a
relationship house plus the front-door entry sequence. Built per the attached Stage-1 PRD.

## Where the code lives
- `/app/site/` — **portable deliverable** ("give html"): same three files + favicons, rewritten to
  relative paths (`./styles.css`, `./script.js`) so the folder runs on any static host.
- `/app/frontend/index.html` — the whole scene markup: sky/stars/moon/clouds layer, distant ridge
  SVG, the house SVG (asymmetric two-story, off-center door, porch + lantern, chimney + smoke,
  curtained window, balcony + cat window, signboard "Aayushi & Me", curved path, mailbox, hedges,
  trees), foreground grass, narrative hints, interior placeholder, mailbox note, loader.
- `/app/frontend/public/styles.css` — palette/typography tokens, layered parallax layout, all
  ambient keyframes (smoke, curtains, foliage, grass, clouds, lantern flicker, window breathing),
  hover states, door 3D open sequence, interior reveal, loader, reduced-motion block.
- `/app/frontend/public/script.js` — rooms config object (10 rooms, structure only), AudioManager
  stub (playAmbient/playSFX/setRoomTrack — no real playback per PRD), star field, fireflies
  (rAF wander + hover flee + click fly-to-porch), mouse parallax + mobile idle drift, door
  sequence, 5 easter eggs (moon→shooting star, chimney→puffs, bush→rustle, cat→stretch, firefly),
  mailbox note, Esc/keyboard handling.
- The React template app in `frontend/src/**` is intentionally NOT mounted (PRD requires vanilla
  static HTML); the Vite entry `frontend/index.html` links the static assets directly.

## Key flows
1. Load: dark screen → warm ember grows → scene fades in → "There's something waiting inside." →
   "Click the door." → both fade on first interaction.
2. Front door (click / Enter): camera zoom to door → lantern warms → handle turns → door swings
   (rotateY) → warm bloom → cross-fade to interior "Welcome home." → "Step back outside" (or Esc)
   returns and the door closes.
3. Mailbox: click → note card "Something special is being prepared…"; close via ×, outside click,
   or Esc.

## Auth
None. No credentials exist (`test_credentials.md` notes the same).

## Notes for testers
- Door/mailbox/moon/chimney/cat/bush are SVG groups with role="button", tabindex, aria-labels;
  Enter/Space activates door. Focus ring: 2px amber outline.
- `prefers-reduced-motion` disables parallax/ambient loops/static fireflies; door still opens.
- data-testids: anniversary-house-scene, front-door-trigger, front-door-handle, mailbox-trigger,
  mailbox-note-card, mailbox-note-close, moon-easter-egg, cat-easter-egg, chimney-easter-egg,
  garden-foliage, house-signboard, narrative-text-banner, house-interior-reveal,
  step-outside-button, firefly.
- Backend FastAPI (port 8001) is untouched and still serves `/api` (template status routes); the
  house makes no API calls by design.
