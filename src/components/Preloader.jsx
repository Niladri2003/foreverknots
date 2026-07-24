import { useEffect } from 'react';
import { m } from 'motion/react';
import { LUXE } from '../utils/motion';

export default function Preloader({ onDone }) {
  useEffect(() => {
    try { sessionStorage.setItem('fk-seen', '1'); } catch { /* private mode */ }
    // The word finishes rising at ~1.0s; dismiss right after so the intro reads
    // without dead hold. (LCP no longer depends on this; the boot hero paints first.)
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <m.div
      className="preloader"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.7, ease: LUXE }}
      aria-hidden="true"
    >
      <div className="preloader__word mask">
        <m.span
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: LUXE, delay: 0.1 }}
        >
          forever<em>knots</em>
        </m.span>
      </div>
      <m.div
        className="preloader__line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.65 }}
      />
    </m.div>
  );
}
