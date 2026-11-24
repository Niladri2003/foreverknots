import { useId } from 'react';
import { m } from 'motion/react';
import { EXPO } from '../utils/motion';

/* The house mark, after the studio's logo: two rings tied through each other,
 * a small stone set on the first. `draw` strokes it on like a pen line.
 *
 * Geometry: ring one centred (19,20), ring two (31,20), r = 11. They cross at
 * (25, 10.8) and (25, 29.2). Ring two is drawn last, so it lies on top at the
 * lower crossing; at the upper crossing a mask parts ring two and ring one runs
 * over it. That one over-under is what reads as "tied" rather than "overlapping".
 * A mask (not a background-coloured knockout) keeps it clean over photographs. */
const RING_ONE = 'M19 9 a11 11 0 1 1 -0.001 0';
const RING_TWO = 'M31 9 a11 11 0 1 1 -0.001 0';
const CROSSING = 'M21.85 9.37 A11 11 0 0 1 27.43 12.93';

export default function RingsMark({ size = 30, draw = false, delay = 0, className, title }) {
  const id = useId().replace(/:/g, '');
  const stroke = (d) =>
    draw
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { duration: 1.8, ease: EXPO, delay: delay + d },
            opacity: { duration: 0.01, delay: delay + d },
          },
        }
      : {};

  return (
    <svg
      className={className}
      width={size}
      height={size * (34 / 50)}
      viewBox="0 0 50 34"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <mask id={`fk-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="50" height="34">
          <rect width="50" height="34" fill="#fff" />
          <path d={CROSSING} stroke="#000" strokeWidth="3.4" />
        </mask>
      </defs>
      <m.path d={RING_ONE} {...stroke(0)} />
      <g mask={`url(#fk-${id})`}>
        <m.path d={RING_TWO} {...stroke(0.2)} />
      </g>
      <m.path
        d="M19 2.2 l2.4 2.6 -2.4 2.6 -2.4 -2.6 z"
        fill="currentColor"
        stroke="none"
        initial={draw ? { opacity: 0, scale: 0.3 } : false}
        animate={draw ? { opacity: 1, scale: 1 } : undefined}
        transition={draw ? { duration: 1, ease: EXPO, delay: delay + 1.2 } : undefined}
        style={{ transformOrigin: '19px 4.8px', transformBox: 'view-box' }}
      />
    </svg>
  );
}
