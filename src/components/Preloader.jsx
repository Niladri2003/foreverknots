import { useEffect } from 'react';
import { m } from 'motion/react';
import RingsMark from './RingsMark';
import { EXPO, SILK } from '../utils/motion';

const WORD = 'foreverknots';

/* First visit only. The two rings are drawn on, the stone is set, the name
 * rises letter by letter, and the garnet lifts away like a curtain onto the
 * hero. (LCP does not wait on any of this; the boot image paints beneath.) */
export default function Preloader({ onDone }) {
  useEffect(() => {
    try { sessionStorage.setItem('fk-seen', '1'); } catch { /* private mode */ }
    // This preloader now paints over the static boot cover (index.html),
    // which hid the boot-hero image until here — safe to drop it.
    document.getElementById('boot-cover')?.remove();
    const t = setTimeout(onDone, 2100);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <m.div
      className="preloader"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 1.15, ease: SILK }}
      aria-hidden="true"
    >
      <m.div
        className="preloader__inner"
        exit={{ y: -60, opacity: 0 }}
        transition={{ duration: 0.9, ease: SILK }}
      >
        <RingsMark size={92} draw delay={0.1} className="preloader__mark" />
        <div className="preloader__word">
          {WORD.split('').map((ch, i) => (
            <span className="rw" key={i}>
              <m.span
                className="rw__i"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.3, ease: EXPO, delay: 0.55 + i * 0.035 }}
              >
                {ch}
              </m.span>
            </span>
          ))}
        </div>
        <m.div
          className="preloader__rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: EXPO, delay: 0.9 }}
        />
      </m.div>
    </m.div>
  );
}
