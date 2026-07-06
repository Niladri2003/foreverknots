/* Shared motion vocabulary — two eases, a handful of variants.
 * EASE for workhorse fades/moves, LUXE (expo-out) for hero/type moments. */

export const EASE = [0.22, 0.61, 0.36, 1];
export const LUXE = [0.16, 1, 0.3, 1];

export const VIEW = { once: true, margin: '-12% 0px -12% 0px' };

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay },
  }),
};

export const fade = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 1, ease: 'easeOut', delay },
  }),
};

/* Place inside an overflow:hidden .mask wrapper */
export const maskLine = {
  hidden: { y: '110%' },
  show: (delay = 0) => ({
    y: 0,
    transition: { duration: 1.05, ease: LUXE, delay },
  }),
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
