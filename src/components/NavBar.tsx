import { useCallback } from 'react';

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { id: 'valentine-proposal', label: 'Valentine Proposal' },
  { id: 'gauri', label: 'Gauri' },
  { id: 'rishi', label: 'Rishi' },
  { id: 'love-story', label: 'Love Story' }
];

export function NavBar() {
  const onClick = useCallback((targetId: string) => {
    const el: HTMLElement | null = document.getElementById(targetId);
    if (el !== null) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main">
      <div className="navbar-inner">
        <div className="brand" aria-label="Site title">For Gauri</div>
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="nav-link"
                onClick={() => onClick(item.id)}
                aria-label={`Go to ${item.label}`}
                style={{
                  fontFamily: 'Inter'
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}


