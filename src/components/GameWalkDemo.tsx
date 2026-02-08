import { useEffect, useRef, useState } from 'react';
type DemoProps = {
  onAccept?: () => void;
  onReject?: () => void;
};
import { AnimationSpec, GameConfig, SpriteSpec } from '../types/gameSpec';
import { loadSprite, LoadedSprite, loadImage } from '../game/assetLoader';

type Entity = {
  x: number;
  y: number;
  vx: number;
  facing: 1 | -1;
  animation: AnimationSpec;
  frameTimeAcc: number;
  frameCursor: number;
  sprite: LoadedSprite;
};

const DIALOGS: ReadonlyArray<string> = [
  'Gauri, every day with you is a day I look forward to.',
  'Life never feels mundane with you.',
  'I am excited for the life we are going to build together.',
  'And I want to cherish you, in both the good times and the bad.',
  'Will you be my valentine?'
];
const DIALOG_DURATION_MS = 3000;

const DEFAULT_CONFIG: GameConfig = {
  canvasWidth: 640,
  canvasHeight: 360,
  startPositions: { maleX: 80, femaleX: 560, y: 260 },
  meetThresholdPixels: 200,
  male: {} as SpriteSpec, // will be replaced after load
  female: {} as SpriteSpec // will be replaced after load
};

function getAnimation(spec: SpriteSpec, name: AnimationSpec['name']): AnimationSpec {
  const anim = spec.animations.find((a) => a.name === name);
  if (!anim) {
    throw new Error(`Animation "${name}" not found in spec for ${spec.imageUrl}`);
  }
  return anim;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  sprite: LoadedSprite,
  animation: AnimationSpec,
  frameCursor: number,
  x: number,
  y: number,
  facing: 1 | -1,
  extraScale: number = 1
): void {
  const { spec, image, columns } = sprite;
  const frameIndex = animation.frameIndices[frameCursor % animation.frameIndices.length];
  const fw = spec.frameWidth;
  const fh = spec.frameHeight;
  const sx = (frameIndex % columns) * fw;
  const sy = Math.floor(frameIndex / columns) * fh;

  const scaleX = spec.scale * extraScale * (facing === -1 ? -1 : 1);
  const scaleY = spec.scale * extraScale;
  const originX = fw * spec.origin.x;
  const originY = fh * spec.origin.y;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleX, scaleY);
  ctx.drawImage(image, sx, sy, fw, fh, -originX, -originY, fw, fh);
  ctx.restore();
}

export function GameWalkDemo(props: DemoProps) {
  const { onAccept, onReject } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const groundYRef = useRef<number>(DEFAULT_CONFIG.startPositions.y);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'met' | 'together'>('idle');
  const phaseRef = useRef<'idle' | 'playing' | 'met' | 'together'>('idle');
  phaseRef.current = phase;
  const controlsRef = useRef<{ start: () => void; stepFrame: () => void; stepFrameMale: () => void } | null>(null);
  const metStartTsRef = useRef<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [noClicks, setNoClicks] = useState<number>(0);
  const modalShownRef = useRef<boolean>(false);
  // final text remains as original; toast handled outside via onAccept

  useEffect(() => {
    let rafId = 0;
    let running = true;
    let lastTs = 0;
    let bgImage: HTMLImageElement | null = null;
    let togetherSprite: LoadedSprite | null = null;

    async function loadFirstAvailableImage(urls: ReadonlyArray<string>): Promise<HTMLImageElement | null> {
      for (const url of urls) {
        try {
          // try each path until one loads
          const img = await loadImage(url);
          return img;
        } catch {
          // continue
        }
      }
      return null;
    }

    function drawBackgroundCover(
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvasW: number,
      canvasH: number
    ): void {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(canvasW / iw, canvasH / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (canvasW - dw) / 2;
      const dy = (canvasH - dh) / 2;
      ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
    }

    // no keyboard alignment controls

    const setup = async () => {
      try {
        const [male, female, together] = await Promise.all([
          loadSprite('/assets/male.json'),
          loadSprite('/assets/female.json'),
          loadSprite('/assets/together.json')
        ]);

        const config: GameConfig = {
          ...DEFAULT_CONFIG,
          male: male.spec,
          female: female.spec
        };
        togetherSprite = together;

        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error('Canvas not found');
        }
        const canvasEl: HTMLCanvasElement = canvas;
        canvasEl.width = config.canvasWidth;
        canvasEl.height = config.canvasHeight;

        const ctxMaybe = canvasEl.getContext('2d');
        if (!ctxMaybe) {
          throw new Error('2D context not available');
        }
        const ctx: CanvasRenderingContext2D = ctxMaybe;
        // We want crisp pixel art
        ctx.imageSmoothingEnabled = false;

        // Load optional background image (user-provided)
        bgImage = await loadFirstAvailableImage([
          '/assets/canvas.png',
          '/assets/Canvas.png',
          '/assets/background.png'
        ]);

        const maleWalk = getAnimation(male.spec, 'walk');
        const femaleWalk = getAnimation(female.spec, 'walk');

        const maleEntity: Entity = {
          x: config.startPositions.maleX,
          y: groundYRef.current,
          vx: 60, // px/s
          facing: 1,
          animation: maleWalk,
          frameTimeAcc: 0,
          frameCursor: 0,
          sprite: male
        };
        const femaleEntity: Entity = {
          x: config.startPositions.femaleX,
          y: groundYRef.current,
          vx: -60, // px/s
          facing: -1,
          animation: femaleWalk,
          frameTimeAcc: 0,
          frameCursor: 0,
          sprite: female
        };

        function resetToStart(): void {
          maleEntity.x = config.startPositions.maleX;
          femaleEntity.x = config.startPositions.femaleX;
          maleEntity.y = groundYRef.current;
          femaleEntity.y = groundYRef.current;
          maleEntity.vx = 60;
          femaleEntity.vx = -60;
          maleEntity.facing = 1;
          femaleEntity.facing = -1;
          maleEntity.frameCursor = 0;
          femaleEntity.frameCursor = 0;
          maleEntity.frameTimeAcc = 0;
          femaleEntity.frameTimeAcc = 0;
          metStartTsRef.current = null;
        }

        controlsRef.current = {
          start: () => {
            resetToStart();
            setPhase('playing');
          },
          stepFrame: () => {
            // Pause if currently playing
            if (phaseRef.current === 'playing') {
              setPhase('idle');
            }
            // Advance ONLY the female animation one frame for debugging
            const len = Math.max(1, femaleEntity.animation.frameIndices.length);
            femaleEntity.frameCursor = (femaleEntity.frameCursor + 1) % len;
          },
          stepFrameMale: () => {
            if (phaseRef.current === 'playing') {
              setPhase('idle');
            }
            const len = Math.max(1, maleEntity.animation.frameIndices.length);
            maleEntity.frameCursor = (maleEntity.frameCursor + 1) % len;
          }
        };

        function step(ts: number) {
          if (!running) return;
          const dt = Math.min(0.05, (ts - lastTs) / 1000); // clamp to 50ms
          lastTs = ts;

          // Update positions until meet, only while playing
          if (phaseRef.current === 'playing') {
            const dx = femaleEntity.x - maleEntity.x;
            const distance = Math.abs(dx);
            const met = distance <= config.meetThresholdPixels;
            if (!met) {
              maleEntity.x += maleEntity.vx * dt;
              femaleEntity.x += femaleEntity.vx * dt;
            } else {
              setPhase('met');
              if (metStartTsRef.current === null) {
                metStartTsRef.current = ts;
              }
              // schedule modal after last line completes
            }
          }
          // Keep entities stuck to the ground Y
          maleEntity.y = groundYRef.current;
          femaleEntity.y = groundYRef.current;

          // Advance animations by fps only while playing
          if (phaseRef.current === 'playing') {
            [maleEntity, femaleEntity].forEach((e) => {
              const frameDur = 1 / Math.max(1, e.animation.framesPerSecond);
              e.frameTimeAcc += dt;
              while (e.frameTimeAcc >= frameDur) {
                e.frameTimeAcc -= frameDur;
                e.frameCursor = (e.frameCursor + 1) % e.animation.frameIndices.length;
              }
            });
          }

          // Draw
          ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
          // Background image if available; else solid red
          if (bgImage) {
            drawBackgroundCover(ctx, bgImage, canvasEl.width, canvasEl.height);
          } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
          }
          if (phaseRef.current !== 'together') {
            drawFrame(ctx, male, maleEntity.animation, maleEntity.frameCursor, maleEntity.x, maleEntity.y, maleEntity.facing);
            drawFrame(ctx, female, femaleEntity.animation, femaleEntity.frameCursor, femaleEntity.x, femaleEntity.y, femaleEntity.facing);
          } else if (togetherSprite) {
            const centerX2 = canvasEl.width / 2;
            const centerY2 = canvasEl.height / 2;
            const animTogether = getAnimation(togetherSprite.spec, 'idle');
            const fitScale = Math.min(
              (canvasEl.width * 0.7) / togetherSprite.spec.frameWidth,
              (canvasEl.height * 0.7) / togetherSprite.spec.frameHeight
            );
            drawFrame(ctx, togetherSprite, animTogether, 0, centerX2, centerY2, 1, fitScale);
          }

          // Proposal dialog sequence overlay when met (top-center)
          if (phaseRef.current === 'met') {
            const centerX = canvasEl.width / 2;
            const topY = 20;
            const startTs = metStartTsRef.current ?? ts;
            const elapsed = Math.max(0, ts - startTs);
            const lastIndex = DIALOGS.length - 1;
            const seg = Math.min(Math.floor(elapsed / DIALOG_DURATION_MS), lastIndex);
            // For last segment, avoid modulo to prevent flashing
            const segProgress = seg < lastIndex
              ? (elapsed % DIALOG_DURATION_MS) / DIALOG_DURATION_MS
              : (elapsed - lastIndex * DIALOG_DURATION_MS) / DIALOG_DURATION_MS;
            const isLast = seg === DIALOGS.length - 1;
            let alpha = 1;
            if (!isLast) {
              if (segProgress < 0.15) alpha = segProgress / 0.15; // fade in
              else if (segProgress > 0.85) alpha = (1 - segProgress) / 0.15; // fade out
              else alpha = 1;
            } else {
              // last line fades in once then stays
              alpha = segProgress < 0.15 ? Math.max(0, Math.min(1, segProgress / 0.15)) : 1;
              // after one full last segment, open modal exactly once
              const modalDelayReached = elapsed >= (lastIndex + 1) * DIALOG_DURATION_MS;
              if (modalDelayReached && !modalShownRef.current) {
                modalShownRef.current = true;
                setShowModal(true);
              }
            }
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = 'rgba(0,0,0,0.6)';
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.miterLimit = 2.5;
            ctx.font = 'bold 22px ui-sans-serif, system-ui, -apple-system';
            const text = DIALOGS[seg];
            const prevAlpha = ctx.globalAlpha;
            ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
            ctx.strokeText(text, centerX, topY);
            ctx.fillText(text, centerX, topY);
            ctx.globalAlpha = prevAlpha;
          }

          rafId = requestAnimationFrame(step);
        }

        setReady(true);
        lastTs = performance.now();
        rafId = requestAnimationFrame(step);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      }
    };

    setup();
    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      // no keydown listeners
    };
  }, []);
  // no persisted alignment anymore

  if (error) {
    return <div role="alert" style={{ color: '#ffa3b1' }}>Error: {error}</div>;
  }

  return (
    <div>
      <div className="game-stage" style={{ position: 'relative' }}>
        <canvas ref={canvasRef} aria-label="Walk demo canvas" />
        {showModal && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(2px)',
              borderRadius: 12
            }}
          >
            <div
              style={{
                background: 'rgba(23,23,32,0.96)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '1.1rem 1.2rem',
                maxWidth: 420,
                textAlign: 'center',
                color: 'var(--text)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 8, fontSize: 18 }}>
                What will you respond with?
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setPhase('together'); onAccept && onAccept(); }}
                  style={{
                    appearance: 'none',
                    border: 0,
                    background: 'linear-gradient(180deg, var(--accent), #e93157)',
                    color: 'white',
                    padding: '0.6rem 1rem',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontWeight: 800,
                    transform: `scale(${1 + Math.min(0.15 * noClicks, 0.8)})`,
                    transition: 'transform 120ms ease'
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => { setNoClicks((n) => n + 1); onReject && onReject(); }}
                  style={{
                    appearance: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: 'var(--text)',
                    padding: '0.6rem 1rem',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontWeight: 700,
                    transform: `scale(${Math.max(1 - 0.2 * noClicks, 0.4)})`,
                    transition: 'transform 120ms ease'
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
        <button
          type="button"
          onClick={() => controlsRef.current?.start()}
          disabled={!ready}
          style={{
            appearance: 'none',
            border: 0,
            background: 'linear-gradient(180deg, var(--accent), #e93157)',
            color: 'white',
            padding: '0.5rem 0.9rem',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 700,
            boxShadow: '0 6px 16px rgba(233, 49, 87, .35)',
            transform: 'scale(2)',
            transformOrigin: 'center',
            marginBottom: '2em'
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
}


