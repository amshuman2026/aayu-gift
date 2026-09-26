# Aayushi & Me — Interactive Anniversary House

A gift website (vanilla HTML/CSS/JS, no React, no backend, no DB). Served by the Vite dev
server from `frontend/` (`index.html` + `public/`), and mirrored as a portable standalone copy
in `/site` (open `site/index.html` with relative paths).

## Files

| file | role |
| --- | --- |
| `frontend/index.html` | whole page: Stage 1 exterior SVG scene + Stage 2 interior shell |
| `frontend/public/styles.css` | Stage 1 — night exterior, house, door sequence |
| `frontend/public/script.js` | Stage 1 — stars, fireflies, parallax, easter eggs, front-door entry |
| `frontend/public/interior.css` | Stage 2 — hallway, door hotspots, four rooms |
| `frontend/public/interior.js` | Stage 2 — content loading, progress/locks, all room logic |
| `frontend/public/hallway.jpg` | the hallway photograph used as the interior background |
| `frontend/public/content/rooms.json` | **all** fill-in-later content (mailbox letter, videos, captions, quiz) |
| `frontend/public/content/HOW_TO_EDIT.md` | plain-English edit guide for that JSON |
| `/site/**` | byte-identical mirror of the above (portable deliverable) |

## Stage 1 (exterior)
Night scene, parallax layers, twinkling stars, fireflies that follow/flee the cursor, easter
eggs on the moon, chimney, cat, bush and mailbox. Two signboards by the door: the "Aayushi & Me"
plaque and a smaller crooked "No pets allowed (only until I convince her)" sign
(`data-testid="no-pets-signboard"`). The mailbox opens a letter from her friends & family — its
text comes from `exterior.mailboxNote` in `rooms.json`, fetched by `script.js` with the markup
line as fallback. Clicking the front door zooms in and reveals the interior.

## Stage 2 (interior)
Hallway = the photo with **4 door hotspots** (left→right): Time Capsule, Game Room, Dance Room,
Final Room. All four show a nameplate from the start; locked ones look dimmed with a padlock.

- Locked door click → shake + toast "View the room before this to unlock."
- Unlocked door click → camera push-in + cross-fade into the room; every room has
  "← Back to hallway" (Escape also works).
- Ambient: rotating ceiling fan, TV flicker, breathing lamp + pendant glow, drifting dust
  motes. All disabled under `prefers-reduced-motion`.

### Progress / locks
Sequential: `timeCapsule → gameRoom → danceRoom → finalDoor`. Only the Time Capsule is open on
a first visit. Persisted in `localStorage["aayushiHouse.progress.v1"]` as
`{timeCapsule, gameRoom, danceRoom, finalDoor: boolean}`.

Completion rules: Time Capsule = play at least one memory (12 slots) · Game Room = answer all 10 questions
correctly · Dance Room = both videos played once · Final Room = video played.

### Rooms
1. **Time Capsule** — dim scattered photo-tile collage background, 12 video slots, one at a time, with
   prev/next, a numbered strip, and an (empty by default) caption under the video.
2. **Game Room** — 10 photo questions, 4 options each. Wrong → teasing line and she can retry
   (retry-until-correct); right → warm line, then auto-advance. Question 10 shows a completion
   screen.
3. **Dance Room** — exactly 2 videos; video 2 greyed out with "Play the first video to unlock
   this one" until video 1 has played through.
4. **Final Room** — locked until rooms 1–3 are done; player ready, video file pending. The
   ending caption ("…you have always been my home.") stays hidden until the video's `onPlayed`
   fires, then fades in (instant under reduced motion).

### Empty media slots
Because no video files have been supplied yet, an empty `video` field renders a placeholder
card with a ▶ Play button and a short progress bar that completes the "played" event — so the
unlock chain is fully walkable before the real files land. Dropping a real path into
`rooms.json` swaps in a native `<video>` with controls.

## Auth
None. No accounts, no credentials, no backend endpoints.
