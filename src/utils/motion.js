import { useMemo } from 'react';
import { transform, useTransform } from 'motion/react';

/* Shared motion vocabulary. Luxury reads as patience: long, decelerating
 * moves and nothing that bounces.
 *   EXPO  expo-out, for things arriving (type rising, images settling)
 *   SILK  slow in-out, for things that cover and uncover (curtains, frames)
 *   EASE  the quiet workhorse for small fades */

export const EASE = [0.22, 0.61, 0.36, 1];
export const EXPO = [0.16, 1, 0.3, 1];
export const SILK = [0.76, 0, 0.24, 1];
export const LUXE = EXPO;

export const VIEW = { once: true, margin: '-10% 0px -10% 0px' };

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EXPO, delay },
  }),
};

export const fade = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 1.2, ease: 'easeOut', delay },
  }),
};

/* Place inside an overflow:hidden .mask wrapper */
export const maskLine = {
  hidden: { y: '110%' },
  show: (delay = 0) => ({
    y: 0,
    transition: { duration: 1.3, ease: EXPO, delay },
  }),
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/* A photograph coming up in the developing tray: overexposed and flat, then
 * contrast and colour arrive. Used once per image, on first view. */
export const develop = {
  hidden: {
    opacity: 0.001,
    scale: 1.06,
    filter: 'brightness(1.9) contrast(0.5) saturate(0) blur(10px)',
  },
  show: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    filter: 'brightness(1) contrast(1) saturate(1) blur(0px)',
    transition: {
      opacity: { duration: 0.6, ease: 'easeOut', delay },
      scale: { duration: 2.2, ease: EXPO, delay },
      filter: { duration: 2, ease: EXPO, delay },
    },
  }),
};

/* Scroll-linked ranges, without motion's native ScrollTimeline acceleration.
 * motion 12 hands range-form useTransform(scrollYProgress, [a, b], [x, y]) to a
 * WAAPI ViewTimeline animation whose keyframes stop at `b` — so past the end of
 * the range the value drifts back to its start (a title that faded out at 30%
 * fades back in by 100%). The function form is never accelerated, and
 * transform() clamps exactly like the range form should. */
export function useRange(value, input, output, options) {
  const map = useMemo(
    () => transform(input, output, { clamp: true, ...options }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(input), JSON.stringify(output)],
  );
  return useTransform(value, map);
}
