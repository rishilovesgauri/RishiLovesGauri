import { SpriteSpec } from '../types/gameSpec';

function resolveUrl(url: string): string {
  // Leave fully-qualified and data URLs unchanged
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) {
    return url;
  }
  // Ensure paths work when the app is served from a sub-path (GitHub Pages)
  const clean = url.startsWith('/') ? url.slice(1) : url;
  const base = (import.meta.env.BASE_URL ?? '/');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${clean}`;
}

export async function loadJson<T>(url: string): Promise<T> {
  const res = await fetch(resolveUrl(url), { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error(`Failed to load JSON at ${url}: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image at ${url}`));
    img.src = resolveUrl(url);
  });
}

export type LoadedSprite = {
  spec: SpriteSpec;
  image: HTMLImageElement;
  columns: number;
  rows: number;
};

export async function loadSprite(specUrl: string): Promise<LoadedSprite> {
  const spec = await loadJson<SpriteSpec>(specUrl);
  const image = await loadImage(spec.imageUrl);

  if (spec.frameWidth <= 0 || spec.frameHeight <= 0) {
    throw new Error('SpriteSpec.frameWidth/height must be > 0');
  }

  const columns = Math.floor(image.naturalWidth / spec.frameWidth);
  const rows = Math.floor(image.naturalHeight / spec.frameHeight);
  if (columns * rows < spec.totalFrames) {
    throw new Error(
      `Spritesheet does not contain totalFrames (${spec.totalFrames}). Sheet cells: ${columns * rows}`
    );
  }

  return { spec, image, columns, rows };
}



