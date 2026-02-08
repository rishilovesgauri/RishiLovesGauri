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
