import { useEffect, useState } from 'react';
import { m, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from 'motion/react';
import { useMedia, FINE_POINTER } from '../hooks/useMedia';
import { EXPO } from '../utils/motion';

/* A quiet cursor for pointer devices: a pin-point that tracks exactly and a
 * hairline ring that follows a breath behind. Over anything marked
 * data-cursor="…" the ring opens into a disc carrying that word. Text fields
 * get the system caret back. Touch devices never see any of it. */
const SIZES = { default: 34, link: 56, media: 104, hidden: 0 };

export default function Cursor() {
  const fine = useMedia(FINE_POINTER);
  const reduced = useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });
  const [mode, setMode] = useState('hidden');
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!fine) return undefined;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setMode((m0) => (m0 === 'hidden' && !e.target.closest?.('input, textarea, select') ? 'default' : m0));
    };
    const over = (e) => {
      const t = e.target;
      if (t.closest?.('input, textarea, select, iframe')) { setMode('hidden'); return; }
      const media = t.closest?.('[data-cursor]');
      if (media) { setMode('media'); setLabel(media.getAttribute('data-cursor')); return; }
      if (t.closest?.('a, button, [role="button"], label')) { setMode('link'); return; }
      setMode('default');
    };
    const leave = () => setMode('hidden');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    root.addEventListener('pointerleave', leave);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      root.removeEventListener('pointerleave', leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const size = SIZES[mode];
  return (
    <>
      <m.div
        className="cursor-dot"
        style={{ x, y }}
        animate={{ scale: mode === 'default' || mode === 'link' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      />
      <m.div
        className={`cursor-ring is-${mode}`}
        style={reduced ? { x, y } : { x: sx, y: sy }}
        animate={{ width: size, height: size, opacity: mode === 'hidden' ? 0 : 1 }}
        transition={{ duration: 0.6, ease: EXPO }}
        aria-hidden="true"
      >
        <AnimatePresence>
          {mode === 'media' && (
            <m.span
              key={label}
              className="cursor-ring__label"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.4, ease: EXPO }}
            >
              {label}
            </m.span>
          )}
        </AnimatePresence>
      </m.div>
    </>
  );
}
