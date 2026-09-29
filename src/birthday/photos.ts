export type PolaroidVariant = 'standard' | 'featured';

export type PolaroidPhoto = {
  fileName: string;
  alt: string;
  widthPx: number;
  imageHeightPx: number;
  rotateDeg: number;
  variant: PolaroidVariant;
};

export const HERO_PHOTO: PolaroidPhoto = {
  fileName: 'photo-01.jpg',
  alt: 'Portrait of Gauri',
  widthPx: 420,
  imageHeightPx: 470,
  rotateDeg: 2.2,
  variant: 'standard',
};

export const ICE_CREAM_PHOTOS: ReadonlyArray<PolaroidPhoto> = [
  {
    fileName: 'photo-02.jpg',
    alt: 'Gauri during her ice cream era',
    widthPx: 300,
    imageHeightPx: 250,
    rotateDeg: -2.4,
    variant: 'standard',
  },
  {
    fileName: 'photo-03.jpg',
    alt: 'Gauri during her ice cream era',
    widthPx: 300,
    imageHeightPx: 250,
    rotateDeg: 1.6,
    variant: 'standard',
  },
  {
    fileName: 'photo-04.jpg',
    alt: 'Gauri during her ice cream era',
    widthPx: 300,
    imageHeightPx: 250,
    rotateDeg: -1.2,
    variant: 'standard',
  },
  {
    fileName: 'photo-05.jpg',
    alt: 'Gauri during her ice cream era',
    widthPx: 264,
    imageHeightPx: 250,
    rotateDeg: 2.8,
    variant: 'standard',
  },
  {
    fileName: 'photo-06.jpg',
    alt: 'Gauri during her ice cream era',
    widthPx: 264,
    imageHeightPx: 250,
    rotateDeg: -3,
    variant: 'standard',
  },
];

export const PARENTS_PHOTOS: ReadonlyArray<PolaroidPhoto> = [
  {
    fileName: 'photo-07.jpg',
    alt: 'Gauri with family',
    widthPx: 258,
    imageHeightPx: 320,
    rotateDeg: -3.2,
    variant: 'standard',
  },
  {
    fileName: 'photo-08.jpg',
    alt: 'Gauri with her parents',
    widthPx: 520,
    imageHeightPx: 368,
    rotateDeg: 0.6,
    variant: 'featured',
  },
  {
    fileName: 'photo-09.jpg',
    alt: 'Gauri with family',
    widthPx: 300,
    imageHeightPx: 320,
    rotateDeg: 3,
    variant: 'standard',
  },
];

export const SCHOOL_PHOTOS: ReadonlyArray<PolaroidPhoto> = [
  {
    fileName: 'photo-10.jpg',
    alt: 'Gauri during her school years',
    widthPx: 260,
    imageHeightPx: 340,
    rotateDeg: -2.2,
    variant: 'standard',
  },
  {
    fileName: 'photo-11.jpg',
    alt: 'Gauri during her school years',
    widthPx: 250,
    imageHeightPx: 340,
    rotateDeg: 2.4,
    variant: 'standard',
  },
  {
    fileName: 'photo-12.jpg',
    alt: 'Gauri during her school years',
    widthPx: 340,
    imageHeightPx: 250,
    rotateDeg: -1.4,
    variant: 'standard',
  },
  {
    fileName: 'photo-13.jpg',
    alt: 'Gauri during her school years',
    widthPx: 300,
    imageHeightPx: 250,
    rotateDeg: 3.4,
    variant: 'standard',
  },
];

export const INFLUENCER_PHOTOS: ReadonlyArray<PolaroidPhoto> = [
  {
    fileName: 'photo-14.jpg',
    alt: 'Gauri during her influencer era',
    widthPx: 300,
    imageHeightPx: 300,
    rotateDeg: -2.6,
    variant: 'standard',
  },
  {
    fileName: 'photo-15.jpg',
    alt: 'Gauri during her influencer era',
    widthPx: 262,
    imageHeightPx: 330,
    rotateDeg: 1.4,
    variant: 'standard',
  },
  {
    fileName: 'photo-16.jpg',
    alt: 'Gauri during her influencer era',
    widthPx: 290,
    imageHeightPx: 290,
    rotateDeg: -1.8,
    variant: 'standard',
  },
  {
    fileName: 'photo-17.jpg',
    alt: 'Gauri during her influencer era',
    widthPx: 290,
    imageHeightPx: 290,
    rotateDeg: 2.6,
    variant: 'standard',
  },
];

export const AMREEKA_PHOTOS: ReadonlyArray<PolaroidPhoto> = [
  {
    fileName: 'photo-18.jpg',
    alt: 'Gauri in America',
    widthPx: 300,
    imageHeightPx: 400,
    rotateDeg: 2.2,
    variant: 'standard',
  },
  {
    fileName: 'photo-19.jpg',
    alt: 'Gauri in America',
    widthPx: 286,
    imageHeightPx: 400,
    rotateDeg: -2.8,
    variant: 'standard',
  },
  {
    fileName: 'photo-20.jpg',
    alt: 'Gauri in America',
    widthPx: 320,
    imageHeightPx: 300,
    rotateDeg: 1.6,
    variant: 'standard',
  },
  {
    fileName: 'photo-21.jpg',
    alt: 'Gauri in America',
    widthPx: 262,
    imageHeightPx: 330,
    rotateDeg: -1.6,
    variant: 'standard',
  },
  {
    fileName: 'photo-22.jpg',
    alt: 'Gauri in America',
    widthPx: 262,
    imageHeightPx: 330,
    rotateDeg: -2.4,
    variant: 'standard',
  },
  {
    fileName: 'photo-23.jpg',
    alt: 'Gauri in America',
    widthPx: 290,
    imageHeightPx: 420,
    rotateDeg: 2,
    variant: 'standard',
  },
  {
    fileName: 'photo-24.jpg',
    alt: 'Gauri in America',
    widthPx: 290,
    imageHeightPx: 300,
    rotateDeg: -2.2,
    variant: 'standard',
  },
  {
    fileName: 'photo-25.jpg',
    alt: 'Gauri in America',
    widthPx: 262,
    imageHeightPx: 330,
    rotateDeg: 1.8,
    variant: 'standard',
  },
  {
    fileName: 'photo-26.jpg',
    alt: 'Gauri in America',
    widthPx: 262,
    imageHeightPx: 330,
    rotateDeg: 2.6,
    variant: 'standard',
  },
  {
    fileName: 'photo-27.jpg',
    alt: 'Gauri in America',
    widthPx: 420,
    imageHeightPx: 400,
    rotateDeg: -0.8,
    variant: 'featured',
  },
  {
    fileName: 'photo-28.jpg',
    alt: 'Gauri in America',
    widthPx: 300,
    imageHeightPx: 330,
    rotateDeg: 2,
    variant: 'standard',
  },
  {
    fileName: 'photo-29.jpg',
    alt: 'Gauri in America',
    widthPx: 400,
    imageHeightPx: 300,
    rotateDeg: -1.2,
    variant: 'standard',
  },
  {
    fileName: 'photo-30.jpg',
    alt: 'Gauri in America',
    widthPx: 262,
    imageHeightPx: 330,
    rotateDeg: 2.4,
    variant: 'standard',
  },
  {
    fileName: 'photo-31.jpg',
    alt: 'Gauri in America',
    widthPx: 262,
    imageHeightPx: 340,
    rotateDeg: -2.8,
    variant: 'standard',
  },
  {
    fileName: 'photo-32.jpg',
    alt: 'Gauri in America',
    widthPx: 262,
    imageHeightPx: 330,
    rotateDeg: 1.6,
    variant: 'standard',
  },
  {
    fileName: 'photo-33.jpg',
    alt: 'Gauri in America',
    widthPx: 520,
    imageHeightPx: 346,
    rotateDeg: -1.4,
    variant: 'featured',
  },
  {
    fileName: 'photo-34.jpg',
    alt: 'Gauri in America',
    widthPx: 262,
    imageHeightPx: 330,
    rotateDeg: 2.8,
    variant: 'standard',
  },
  {
    fileName: 'photo-35.jpg',
    alt: 'Gauri in America',
    widthPx: 520,
    imageHeightPx: 400,
    rotateDeg: -1.2,
    variant: 'featured',
  },
];
