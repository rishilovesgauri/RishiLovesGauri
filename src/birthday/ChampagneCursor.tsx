import { useEffect, useRef, useState } from 'react';

type ParticleKind = 'bubble' | 'sparkle';

type TrailParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  ageMs: number;
  lifetimeMs: number;
  kind: ParticleKind;
  wobble: number;
  wobbleSpeed: number;
};

type PointerState = {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  visible: boolean;
};

const MAX_PARTICLES = 280;
const SPAWN_SPACING_PX = 8;
const BOTTLE_WIDTH_PX = 52;
const BOTTLE_HOTSPOT_X = 26;
const BOTTLE_HOTSPOT_Y = 4;

function bottleAssetUrl(): string {
  const base = import.meta.env.BASE_URL ?? '/';
  return `${base}assets/birthday/old-monk.png`;
}

function createParticle(x: number, y: number, kind: ParticleKind): TrailParticle {
  if (kind === 'bubble') {
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.55,
      vy: -0.22 - Math.random() * 0.55,
      size: 2 + Math.random() * 4.8,
      ageMs: 0,
      lifetimeMs: 620 + Math.random() * 520,
      kind: kind,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.05 + Math.random() * 0.07,
    };
  }

  return {
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 0.9,
    vy: -0.12 - Math.random() * 0.45,
    size: 1.6 + Math.random() * 2.6,
    ageMs: 0,
    lifetimeMs: 380 + Math.random() * 360,
    kind: kind,
    wobble: 0,
    wobbleSpeed: 0,
  };
}

function spawnAlongSegment(
  x0: number,
  y0: number,
  x1: number,
  y1: number
): ReadonlyArray<TrailParticle> {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) {
    return [];
  }

  const steps = Math.max(1, Math.floor(dist / SPAWN_SPACING_PX));
  const spawned: Array<TrailParticle> = [];
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const jitterX = (Math.random() - 0.5) * 8;
    const jitterY = (Math.random() - 0.5) * 8;
    const x = x0 + dx * t + jitterX;
    const y = y0 + dy * t + jitterY;
    spawned.push(createParticle(x, y, 'bubble'));
    if (Math.random() < 0.55) {
      spawned.push(createParticle(x + (Math.random() - 0.5) * 10, y, 'bubble'));
    }
    if (Math.random() < 0.55) {
      spawned.push(createParticle(x, y, 'sparkle'));
    }
  }
  return spawned;
}

function stepParticle(particle: TrailParticle, dtMs: number): TrailParticle {
  const frameScale = dtMs / 16.67;
  return {
    x: particle.x + (particle.vx + Math.sin(particle.wobble) * 0.18) * frameScale,
    y: particle.y + particle.vy * frameScale,
    vx: particle.vx * 0.99,
    vy: particle.vy - 0.006 * frameScale,
    size: particle.size,
    ageMs: particle.ageMs + dtMs,
    lifetimeMs: particle.lifetimeMs,
    kind: particle.kind,
    wobble: particle.wobble + particle.wobbleSpeed * frameScale,
    wobbleSpeed: particle.wobbleSpeed,
  };
}

function particleAlpha(particle: TrailParticle): number {
  const t = particle.ageMs / particle.lifetimeMs;
  if (t < 0.12) {
    return t / 0.12;
  }
  if (t > 0.7) {
    return Math.max(0, 1 - (t - 0.7) / 0.3);
  }
  return 1;
}

function drawBubble(ctx: CanvasRenderingContext2D, particle: TrailParticle): void {
  const alpha = particleAlpha(particle);
  const radius = particle.size;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 228, 150, ${0.42 * alpha})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(255, 248, 214, ${0.7 * alpha})`;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    particle.x - radius * 0.28,
    particle.y - radius * 0.32,
    radius * 0.28,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * alpha})`;
  ctx.fill();
}

function drawSparkle(ctx: CanvasRenderingContext2D, particle: TrailParticle): void {
  const alpha = particleAlpha(particle);
  const size = particle.size;
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.fillStyle = `rgba(255, 244, 196, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(0, -size * 1.8);
  ctx.lineTo(size * 0.32, 0);
  ctx.lineTo(0, size * 1.8);
  ctx.lineTo(-size * 0.32, 0);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-size * 1.8, 0);
  ctx.lineTo(0, size * 0.32);
  ctx.lineTo(size * 1.8, 0);
  ctx.lineTo(0, -size * 0.32);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function resizeCanvas(canvas: HTMLCanvasElement): void {
  const dpr = window.devicePixelRatio;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('Could not get 2d context for champagne trail canvas');
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function ChampagneCursor(): JSX.Element | null {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bottleRef = useRef<HTMLImageElement | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const syncEnabled = (): void => {
      setEnabled(finePointer.matches);
    };
    syncEnabled();
    finePointer.addEventListener('change', syncEnabled);
    return () => {
      finePointer.removeEventListener('change', syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const canvas = canvasRef.current;
    const bottle = bottleRef.current;
    if (canvas === null || bottle === null) {
      throw new Error('Champagne cursor overlay refs were not mounted');
    }

    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      throw new Error('Could not get 2d context for champagne trail canvas');
    }

    document.documentElement.classList.add('birthday-cursor-on');
    resizeCanvas(canvas);

    const pointer: PointerState = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      visible: false,
    };
    let particles: ReadonlyArray<TrailParticle> = [];
    let tiltDeg = 0;
    let lastTs = 0;
    let idleAccMs = 0;
    let frameId = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onPointerMove = (event: PointerEvent): void => {
      pointer.lastX = pointer.visible ? pointer.x : event.clientX;
      pointer.lastY = pointer.visible ? pointer.y : event.clientY;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.visible = true;
    };

    const onResize = (): void => {
      resizeCanvas(canvas);
    };

    const tick = (ts: number): void => {
      const dtMs = lastTs === 0 ? 16.67 : Math.min(32, ts - lastTs);
      lastTs = ts;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (pointer.visible) {
        const moveX = pointer.x - pointer.lastX;
        const targetTilt = Math.max(-18, Math.min(18, moveX * 1.8));
        tiltDeg = tiltDeg + (targetTilt - tiltDeg) * 0.2;

        bottle.style.opacity = '1';
        bottle.style.transform = `translate(${pointer.x - BOTTLE_HOTSPOT_X}px, ${pointer.y - BOTTLE_HOTSPOT_Y}px) rotate(${tiltDeg}deg)`;

        if (!reduceMotion) {
          const segment = spawnAlongSegment(pointer.lastX, pointer.lastY, pointer.x, pointer.y);
          particles = particles.concat(segment);
          const moved = Math.hypot(moveX, pointer.y - pointer.lastY);
          if (moved < 1.2) {
            idleAccMs += dtMs;
            if (idleAccMs > 70) {
              idleAccMs = 0;
              particles = particles.concat([
                createParticle(pointer.x + (Math.random() - 0.5) * 4, pointer.y, 'bubble'),
              ]);
            }
          } else {
            idleAccMs = 0;
          }
        }

        pointer.lastX = pointer.x;
        pointer.lastY = pointer.y;
      }

      particles = particles
        .map((particle) => stepParticle(particle, dtMs))
        .filter((particle) => particle.ageMs < particle.lifetimeMs);
      if (particles.length > MAX_PARTICLES) {
        particles = particles.slice(particles.length - MAX_PARTICLES);
      }

      for (const particle of particles) {
        if (particle.kind === 'bubble') {
          drawBubble(ctx, particle);
        } else {
          drawSparkle(ctx, particle);
        }
      }

      frameId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onResize);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('birthday-cursor-on');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(frameId);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="birthday-cursor-layer" aria-hidden="true">
      <canvas ref={canvasRef} />
      <img
        ref={bottleRef}
        className="birthday-cursor-bottle"
        src={bottleAssetUrl()}
        alt=""
        width={BOTTLE_WIDTH_PX}
      />
    </div>
  );
}
