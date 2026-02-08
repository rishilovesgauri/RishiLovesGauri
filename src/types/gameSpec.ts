export type AnimationName = 'idle' | 'walk' | 'celebrate' | 'heartbreak';

export type FrameRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AnimationSpec = {
  name: AnimationName;
  frameIndices: ReadonlyArray<number>;
  framesPerSecond: number;
  loop: boolean;
};

export type SpriteSpec = {
  imageUrl: string;
  frameWidth: number;
  frameHeight: number;
  totalFrames: number;
  defaultAnimation: AnimationName;
  animations: ReadonlyArray<AnimationSpec>;
  origin: {
    x: number;
    y: number;
  };
  scale: number;
  canFlipX: boolean;
};

export type GameConfig = {
  canvasWidth: number;
  canvasHeight: number;
  male: SpriteSpec;
  female: SpriteSpec;
  startPositions: {
    maleX: number;
    femaleX: number;
    y: number;
  };
  meetThresholdPixels: number;
};

export type GameEvents = {
  onMeet: () => void;
  onAccept: () => void;
  onReject: () => void;
};


