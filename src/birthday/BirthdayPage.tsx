import { useEffect } from 'react';
import {
  AMREEKA_PHOTOS,
  HERO_PHOTO,
  ICE_CREAM_PHOTOS,
  INFLUENCER_PHOTOS,
  PARENTS_PHOTOS,
  SCHOOL_PHOTOS,
  type PolaroidPhoto,
} from './photos';
import '../styles/birthday.css';

type RuleAlign = 'start' | 'center' | 'end';
type RuleSpacing = 'after-hero' | 'section' | 'section-tight';

type PolaroidProps = {
  photo: PolaroidPhoto;
  assetBase: string;
};

type PhotoGridProps = {
  photos: ReadonlyArray<PolaroidPhoto>;
  assetBase: string;
  className: string;
};

type SectionRuleProps = {
  label: string;
  align: RuleAlign;
  spacing: RuleSpacing;
};

function birthdayAssetBase(): string {
  const base = import.meta.env.BASE_URL ?? '/';
  return `${base}assets/birthday/`;
}

function Polaroid(props: PolaroidProps): JSX.Element {
  const { photo, assetBase } = props;
  const className =
    photo.variant === 'featured'
      ? 'birthday-polaroid birthday-polaroid--featured'
      : 'birthday-polaroid';

  return (
    <figure
      className={className}
      style={{
        width: `${photo.widthPx}px`,
        transform: `rotate(${photo.rotateDeg}deg)`,
      }}
    >
      <img
        src={`${assetBase}${photo.fileName}`}
        alt={photo.alt}
        style={{ height: `${photo.imageHeightPx}px` }}
      />
    </figure>
  );
}

function PhotoGrid(props: PhotoGridProps): JSX.Element {
  const { photos, assetBase, className } = props;
  return (
    <div className={className}>
      {photos.map((photo) => (
        <Polaroid key={photo.fileName} photo={photo} assetBase={assetBase} />
      ))}
    </div>
  );
}

function SectionRule(props: SectionRuleProps): JSX.Element {
  const { label, align, spacing } = props;
  return (
    <div className={`birthday-rule birthday-rule--${spacing}`}>
      {align !== 'start' ? <div className="birthday-rule-line birthday-rule-line--in" /> : null}
      <div className="birthday-rule-label">{label}</div>
      {align !== 'end' ? <div className="birthday-rule-line birthday-rule-line--out" /> : null}
    </div>
  );
}

export function BirthdayPage(): JSX.Element {
  const assetBase = birthdayAssetBase();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Happy Birthday, Gauri';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="birthday-page">
      <div className="birthday-canvas">
        <div className="birthday-hero">
          <div className="birthday-hero-copy">
            <div className="birthday-kicker">29 · 09 · 1998 - The end of time</div>
            <h1 className="birthday-title">
              Happy Birthday,
              <br />
              <span className="birthday-title-name">Gauri</span>
            </h1>
            <p className="birthday-lede">
              Let's peek through your life and see if you remember any of these moments
            </p>
          </div>
          <Polaroid photo={HERO_PHOTO} assetBase={assetBase} />
        </div>

        <SectionRule label="GAURI KA ICE CREAM ERA" align="start" spacing="after-hero" />
        <PhotoGrid photos={ICE_CREAM_PHOTOS} assetBase={assetBase} className="birthday-grid" />

        <SectionRule label="MUMMY AUR PAPA" align="center" spacing="section-tight" />
        <p className="birthday-caption">:)</p>
        <PhotoGrid
          photos={PARENTS_PHOTOS}
          assetBase={assetBase}
          className="birthday-grid birthday-grid--parents"
        />

        <SectionRule label="school years" align="start" spacing="section" />
        <PhotoGrid photos={SCHOOL_PHOTOS} assetBase={assetBase} className="birthday-grid" />

        <SectionRule label="INFLUENCER ERA ;)" align="end" spacing="section" />
        <PhotoGrid photos={INFLUENCER_PHOTOS} assetBase={assetBase} className="birthday-grid" />

        <SectionRule label="AMREEKA" align="start" spacing="section-tight" />
        <p className="birthday-caption birthday-caption--wide">
          A country, a college and a skyline that was compelled to remember your name.
        </p>
        <PhotoGrid
          photos={AMREEKA_PHOTOS}
          assetBase={assetBase}
          className="birthday-grid birthday-grid--amreeka"
        />

        <div className="birthday-letter-wrap">
          <div className="birthday-letter">
            <div className="birthday-letter-kicker">for you</div>
            <p className="birthday-letter-body">
              {`Gauri,\n\nEvery time you tell me you're visiting a new place, I always think to myself, this place has never met Gauri Sinha. This year has thrown a lot at us together, but I am glad we endured it all together. I love you tremendously, and I wish that you get everything you want, and so much more.`}
            </p>
            <p className="birthday-letter-signoff">My chiku {'<3'}</p>
          </div>
        </div>

        <div className="birthday-footer">HAPPY BIRTHDAY, GAURI {'<3'} · 29 SEPTEMBER</div>
      </div>
    </div>
  );
}
