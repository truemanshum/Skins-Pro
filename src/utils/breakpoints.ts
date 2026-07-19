// Centralized media-query helpers.
// Previously, matchMedia strings were scattered across:
//   src/render/layout.ts, src/views/energy.ts, src/views/home.ts, src/views/search.ts
// Each used slightly different (sometimes conflicting) queries. This file is the
// single source of truth.

const portraitQ = (): MediaQueryList =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(orientation: portrait)')
    : ({ matches: false } as MediaQueryList);

const landscapeQ = (): MediaQueryList =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(orientation: landscape)')
    : ({ matches: false } as MediaQueryList);

const shortLandscapeQ = (): MediaQueryList =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(orientation: landscape) and (max-height: 768px)')
    : ({ matches: false } as MediaQueryList);

const smallQ = (): MediaQueryList =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(max-width: 480px)')
    : ({ matches: false } as MediaQueryList);

const mediumQ = (): MediaQueryList =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(max-width: 1180px)')
    : ({ matches: false } as MediaQueryList);

const reducedMotionQ = (): MediaQueryList =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : ({ matches: false } as MediaQueryList);

export const isPortrait = (): boolean => portraitQ().matches;
export const isLandscape = (): boolean => landscapeQ().matches;
export const isShortLandscape = (): boolean => shortLandscapeQ().matches;
export const isSmall = (): boolean => smallQ().matches;
export const isMedium = (): boolean => mediumQ().matches;
export const prefersReducedMotion = (): boolean => reducedMotionQ().matches;

export const subscribeOrientation = (cb: () => void): (() => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const portrait = portraitQ();
  const shortLandscape = shortLandscapeQ();
  const handler = (): void => cb();
  // addEventListener is the modern API; older Safari uses addListener.
  if (typeof portrait.addEventListener === 'function') {
    portrait.addEventListener('change', handler);
    shortLandscape.addEventListener('change', handler);
    return () => {
      portrait.removeEventListener('change', handler);
      shortLandscape.removeEventListener('change', handler);
    };
  }
  portrait.addListener(handler);
  shortLandscape.addListener(handler);
  return () => {
    portrait.removeListener(handler);
    shortLandscape.removeListener(handler);
  };
};
