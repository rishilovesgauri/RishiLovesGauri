import { useState, useEffect } from 'react';

type LoveLetterIntroProps = {
  isOpen: boolean;
  onComplete: () => void;
};

export function LoveLetterIntro(props: LoveLetterIntroProps) {
  const { isOpen, onComplete } = props;
  const [hasOpened, setHasOpened] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setHasOpened(true);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setHasOpened(true);
    onComplete();
  };

  return (
    <div
      className={`letter-overlay ${hasOpened ? 'closing' : 'opening'}`}
      aria-hidden={hasOpened}
      aria-label="Opening love letter overlay"
    >
      <div className="envelope">
        <div className="heart-seal" aria-hidden="true">❤</div>
        <div className="letter-card">
          <h1 className="letter-title">For Gauri</h1>
          <p className="letter-body">
            My favorite person,
            <br />
            This little site is a small gift — open it to find a few stories,
            a few smiles, and a little surprise. Happy Valentine’s Day.
          </p>
          <button type="button" className="open-button" onClick={handleOpen} aria-label="Open letter">
            Open
          </button>
        </div>
      </div>
    </div>
  );
}


