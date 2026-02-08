import { useState, useCallback, useEffect, useRef } from 'react';
import { NavBar } from './components/NavBar';
import { Section } from './components/Section';
import { LoveLetterIntro } from './components/LoveLetterIntro';
import { GamePlaceholder } from './components/GamePlaceholder';
import './styles/app.css';

export default function App() {
  const [introOpen, setIntroOpen] = useState<boolean>(false);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const base = import.meta.env.BASE_URL ?? '/';
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const handleIntroComplete = useCallback(() => {
    setIntroOpen(true);
    const a = audioRef.current;
    if (a) {
      a.currentTime = 0;
      a.loop = true;
      if (!isMuted) {
        void a.play();
      }
    }
  }, [isMuted]);
  const toggleMuted = useCallback(() => {
    const a = audioRef.current;
    setIsMuted((prev) => {
      const next = !prev;
      if (a) {
        a.muted = next;
        if (!next && a.paused) {
          void a.play();
        }
      }
      return next;
    });
  }, []);
  useEffect(() => {
    if (toast !== null) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="app-root">
      <audio ref={audioRef} preload="auto">
        <source src={`${base}assets/CherryBlossoms.mp3`} type="audio/mpeg" />
      </audio>
      <LoveLetterIntro isOpen={introOpen} onComplete={handleIntroComplete} />

      <div aria-hidden={!introOpen} className={`site-shell ${introOpen ? 'visible' : 'hidden'}`}>
        <NavBar />
        <button
          type="button"
          onClick={toggleMuted}
          aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
          style={{
            position: 'fixed',
            top: 10,
            right: 12,
            appearance: 'none',
            border: 0,
            background: isMuted ? 'rgba(255,255,255,0.12)' : 'linear-gradient(180deg, var(--accent), #e93157)',
            color: 'white',
            padding: '0.4rem 0.7rem',
            borderRadius: 999,
            cursor: 'pointer',
            fontWeight: 700,
            boxShadow: '0 6px 16px rgba(0,0,0,.25)',
            zIndex: 50,
            fontFamily: 'Inter',
            letterSpacing: '.2px'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3 9v6h4l5 4V5L7 9H3z" />
            {!isMuted && (
              <>
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
                <path d="M14 3.23v2.06c3.39.49 6 3.39 6 6.71s-2.61 6.22-6 6.71v2.06c4.45-.52 8-4.31 8-8.77s-3.55-8.25-8-8.77z" />
              </>
            )}
            {isMuted && (
              <path d="M19 5L5 19" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <main>
          <Section id="valentine-proposal" title="Valentine Proposal">
            <GamePlaceholder
              onAccept={() => { setUnlocked(true); setToast('Woohoo!'); }}
              onReject={() => {}}
            />
          </Section>

          {unlocked && (
          <Section id="gauri" title="Gauri">
            <div className="section-grid">
              <figure className="section-image">
                <img src={`${base}assets/gauri.jpg`} alt="Gauri" />
              </figure>
              <div className="section-body">
                <p>
                Gauri isn't just pretty, she's charismatic in a calm, effortless way. She's got grace without trying, intelligence that sneaks up on you mid-conversation, and a presence that makes chaos her ally. 
                Being around her feels like winning without realizing you were competing. 
                </p>
              </div>
            </div>
          </Section>)}

          {unlocked && (
          <Section id="rishi" title="Rishi">
            <div className="section-grid">
              <figure className="section-image">
                <img src={`${base}assets/rishi.jpeg`} alt="Rishi" />
              </figure>
              <div className="section-body">
                <p>
                  I'm the lucky one who gets to write this. I love building things in the digital world, but it pales in comaprison to the thought of building a life with you.
                </p>
                <p>
                  I'm thoughtful, a bit nerdy, always curious, and constantly looking for
                  new ways to make you feel as special as you are to me.
                </p>
              </div>
            </div>
          </Section>)}

          {unlocked && (
          <Section id="love-story" title="Our Love Story">
            <div className="section-grid">
              <figure className="section-image">
                <img src={`${base}assets/story.jpg`} alt="Our love story" />
              </figure>
              <div className="section-body">
                <p>
                  Our story began with an instagram DM. We bonded over Korean dramas, and our bond grew deeper. 
                  We met in Delhi over "momos", but ended up embarassing the waiter at a completely separate place. 
                  We had a blast the next day, with the magnum incident no one will breath a word of. 
                  And we laughed, we cried, we fought, we made up and we bonded as friends over the course of that year.
                </p>
                <p>

                  You finally flew out to the US, and we started bonding again over phone carriers. 
                  We met up in Boston after Airbnb reviews that were conveniently ignored, and fell in love again.
                  If anyone asks, that's the version of the story I want to tell 😂. 

                </p>
                <p>

                  This past year has been nothing short of magical. 
                  If someone asks me what I love about you, it's the joyful calmness I feel around you. 
                  Even at your most chaotic, you manage to keep your cool and take life in stride, no matter what. 
                  When I see that, it inspires me to be a better person.
                  I am incredibly lucky to have you in my life ❤️. 

                </p>
                <p>
                  This page is a bookmark in our story — a reminder of how far we've come
                  and how excited I am for every chapter ahead.
                </p>
              </div>
            </div>
          </Section>)}
        </main>

        <footer className="footer">
          <span>Made with ❤️ by Rishi for Gauri</span>
        </footer>
        {toast !== null && (
          <div
            role="status"
            style={{
              position: 'fixed',
              top: 50,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(23,23,32,0.98)',
              border: '1px solid rgba(255,255,255,0.16)',
              color: 'white',
              padding: '0.6rem 0.9rem',
              borderRadius: 12,
              boxShadow: '0 10px 26px rgba(0,0,0,0.35)',
              zIndex: 20,
              fontWeight: 800,
              letterSpacing: '.2px'
            }}
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}


