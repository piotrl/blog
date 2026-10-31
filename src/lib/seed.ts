import { DESIGN_SEED } from '../consts';

const hexByte = (index: number) => parseInt(DESIGN_SEED.slice(index * 2, index * 2 + 2), 16);

export const accentHue = Math.round((hexByte(0) / 255) * 360);

// mulberry32: small deterministic PRNG, so the same seed always draws the same picture.
export const random = (offset = 0) => {
  let state = (parseInt(DESIGN_SEED.slice(8, 16), 16) + offset) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
