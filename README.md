## Valentine SPA (For Gauri)

A small single-page React + TypeScript app with:
- An opening love-letter overlay that fades to reveal the site
- A fixed top navigation bar
- Sections: Gauri, Rishi, Our Love Story, and Valentine Proposal
- A placeholder for a mini game with strict sprite specs below

### Run locally
1. Install Node.js 18+.
2. In the project directory:
   - `npm install`
   - `npm run dev`
3. Open the URL shown (default `http://localhost:5173`).

### Structure
- `src/components/LoveLetterIntro.tsx`: Intro overlay
- `src/components/NavBar.tsx`: Top nav
- `src/components/Section.tsx`: Generic section wrapper
- `src/components/GamePlaceholder.tsx`: Placeholder for the mini game
- `src/types/gameSpec.ts`: Strongly-typed sprite and game config contracts

---

## Sprite and Mini Game Specifications (What I need from you)

To plug in your sprites, please provide the following. This lets me wire the “Propose to me” mini game quickly and cleanly.

### Visual assets
- **Format**: PNG with transparent background (lossless, premultiplied alpha ok).
- **Spritesheets**: One spritesheet per character (Male/Female).
- **Consistent frame size**: Every frame must be exactly the same width and height across animations per character.
- **Recommended frame size**: 128×128 px (or 64×64 if pixel-art). Both characters should match scale.
- **Origin/pivot**: Bottom-center. Measure from the bottom middle of the character’s feet. I’ll use this as the anchor for ground collision and meeting logic.
- **Facing**: Provide frames facing right. I will flip horizontally for left when needed.

### Required animations
- `idle`: 8–12 frames, 6–10 fps, loop = true
- `walk`: 6–10 frames, 8–12 fps, loop = true
- `celebrate`: 8–12 frames, 10–14 fps, loop = false (for “Yes”)
- `heartbreak`: 10–14 frames, 8–12 fps, loop = false (for “No”)

If you want extra polish:
- `blush` (short non-loop)
- `wave` (short non-loop)

### JSON manifest per character (matches `SpriteSpec`)
Provide a JSON for each character that aligns with `src/types/gameSpec.ts`:

```json
{
  "imageUrl": "/assets/sprites/male.png",
  "frameWidth": 128,
  "frameHeight": 128,
  "totalFrames": 48,
  "defaultAnimation": "idle",
  "animations": [
    { "name": "idle", "frameIndices": [0,1,2,3,4,5,6,7], "framesPerSecond": 8, "loop": true },
    { "name": "walk", "frameIndices": [8,9,10,11,12,13,14,15], "framesPerSecond": 10, "loop": true },
    { "name": "celebrate", "frameIndices": [16,17,18,19,20,21,22,23], "framesPerSecond": 12, "loop": false },
    { "name": "heartbreak", "frameIndices": [24,25,26,27,28,29,30,31,32,33], "framesPerSecond": 10, "loop": false }
  ],
  "origin": { "x": 0.5, "y": 1.0 },
  "scale": 1.0,
  "canFlipX": true
}
```

Notes:
- `origin.x` and `origin.y` are normalized [0..1] of the frame (0.5, 1.0 = bottom-center).
- `frameIndices` are 0-based, in the order frames are packed in the spritesheet (row-major).
- Make sure `totalFrames` matches the sheet.

### Game canvas and layout
- **Canvas size**: 640×360 (default). If you prefer: 800×450 or 960×540 (16:9).
- **Start positions**: Characters begin on opposite sides moving toward each other on a shared ground Y.
- **Meet threshold**: 16–24 px distance between origins triggers the proposal popup.

### Audio (optional but lovely)
- Short `.mp3`/`.ogg` for:
  - Footsteps (walk loop)
  - “Yes”/celebrate sting (0.5–1.0s)
  - “No”/sad sting (0.5–1.0s)

### Deliverables to drop into `public/assets`
- `public/assets/sprites/male.png`
- `public/assets/sprites/female.png`
- `public/assets/sprites/male.json` (SpriteSpec)
- `public/assets/sprites/female.json` (SpriteSpec)
- Optional: `public/assets/audio/*.mp3`

### Integration I will handle
- Canvas renderer that:
  - Loads both spritesheets and manifests
  - Advances animation frames by `framesPerSecond`
  - Flips X when needed
  - Moves characters horizontally toward center
  - Detects meeting and opens a proposal modal with two buttons
  - Plays celebrate or heartbreak animation based on choice
  - Spawns a heart particle above the male sprite on “Yes”

### What I need from you to proceed
1. Both spritesheets (PNG)
2. Both JSON manifests as above
3. Your preferred canvas size (optional)
4. Any audio files you want included (optional)

Once I have those, I’ll wire the game and we’re done. 💖


