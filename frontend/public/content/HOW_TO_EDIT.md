# How to edit the house content (no code needed)

Everything you'll want to swap later — the 12 memory videos and captions, the 10 quiz
photos/questions, the 2 dance videos, and the final video message — lives in **one** file:

```
frontend/public/content/rooms.json      (and the same file in site/content/rooms.json)
```

That file holds only plain text and file paths. It never holds any logic, so you can edit it
safely. Rules that always apply:

1. Keep the quotes, the commas and the curly braces exactly where they are — only change the
   text **between** the quotes.
2. To add a video or photo, drop the file into `frontend/public/media/` (create the folder if it
   isn't there), then write its path as `/media/your-file.mp4`.
3. Leave a field as `""` (empty quotes) if it isn't ready yet — the site shows a tidy
   placeholder for it instead of breaking.
4. After editing, just reload the page. Nothing else to run.

---

## Room 1 — Time Capsule (12 memories)

Find `"timeCapsule"` → `"memories"`. There are 12 blocks, numbered 1 to 12:

```json
{ "id": 7, "video": "", "poster": "", "caption": "" }
```

Worked example — filling memory 7:

```json
{ "id": 7, "video": "/media/goa-night.mp4", "poster": "/media/goa-night.jpg", "caption": "the night you fell asleep on my shoulder" }
```

- `video` — the video file for that slot.
- `poster` — optional still image shown before it plays.
- `caption` — the line printed under the video. Leave `""` for no caption.

## Room 2 — Game Room (10 questions)

Find `"gameRoom"` → `"questions"`. Each block:

```json
{ "id": 1, "photo": "", "question": "Where did we meet for the very first time?",
  "options": ["The old coffee place", "College library", "A friend's birthday", "On a train"],
  "correctIndex": 0 }
```

- `photo` — the picture above the question, e.g. `/media/quiz-1.jpg`.
- `question` — the question text.
- `options` — always **four** answers, in the order they'll appear.
- `correctIndex` — which option is right, counting from **0**: `0` = first, `1` = second,
  `2` = third, `3` = fourth.

The teasing lines for a wrong answer live in `"wrongMessages"` and the sweet ones in
`"rightMessages"` — add or reword as many as you like; the site picks one at random. The
end-of-quiz screen text is in `"completion"`.

## Room 3 — Dance Room (2 videos)

Find `"danceRoom"` → `"videos"`. Exactly two blocks:

```json
{ "id": 1, "title": "Garba night", "video": "/media/dance-1.mp4", "poster": "", "caption": "your line here" }
```

`caption` is the handwritten line printed under that clip — leave it `""` for no caption.

Video 2 stays greyed out until video 1 has played through once. The greyed-out label is
`"lockedLabel"`.

## Room 4 — Final Room

Find `"finalDoor"`:

```json
"video": "/media/final-message.mp4", "poster": "", "caption": "for you, always"
```

`emptyText` is what shows while `video` is still empty. The `caption` here is the ending line —
it stays hidden until the video has played all the way through, then fades in.

## The mailbox letter (outside, before you even open the door)

Find `"exterior"` → `"mailboxNote"`. That one line of text is the whole letter shown when the
mailbox is clicked. Swap in real names freely — the note box scrolls if the letter gets long.

## Hallway

Find `"hallway"`. `"background"` is the hallway photo, `"lockedMessage"` is the line shown when
she clicks a door she hasn't earned yet, and each entry in `"doors"` sets the nameplate text on
that door (the order is fixed: left to right).

---

### Resetting her progress

The house remembers which rooms are unlocked in the browser. To start fresh, open the site and
run this once in the browser console:

```js
localStorage.removeItem("aayushiHouse.progress.v1");
```

Then reload.
