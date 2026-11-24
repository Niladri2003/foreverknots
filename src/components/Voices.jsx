import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { TESTIMONIALS, STORIES } from '../data';
import { EXPO, EASE } from '../utils/motion';

const INTERVAL = 8000;

// Each quote sits over the cover of the couple who wrote it. The attribution
// reads "Couple · Type, Place"; the name before the "·" is the STORIES key.
const COVER_BY_COUPLE = Object.fromEntries(STORIES.map((s) => [s.couple, s.cover]));
const split = (attr) => {
  const [who, rest = ''] = attr.split('·').map((x) => x.trim());
  return { who, rest };
};

/* One quote at a time, set like a pull-quote in a magazine. The words arrive
 * out of a soft blur, one after another; the couple's names below double as
 * the controls, each with a hairline that fills while its quote is shown. */
export default function Voices() {
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReducedMotion();
  const playing = inView && !held && !reduced;

  useEffect(() => {
    if (!playing) return undefined;
    const t = setTimeout(() => setI((x) => (x + 1) % TESTIMONIALS.length), INTERVAL);
    return () => clearTimeout(t);
  }, [playing, i]);

  const t = TESTIMONIALS[i];
  const photo = COVER_BY_COUPLE[split(t.a).who] || null;
  const words = t.q.split(' ');

  return (
    <section
      id="voices"
      className="voices"
      ref={ref}
      data-tone="night"
      aria-label="Kind words from couples"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="voices__bg" aria-hidden="true">
        <AnimatePresence initial={false}>
          {photo && (
            <m.img
              key={photo}
              src={photo}
              alt=""
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.6, ease: EASE }, scale: { duration: 9, ease: 'linear' } }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="voices__inner wrap">
        <span className="voices__mark display" aria-hidden="true">&ldquo;</span>
        <div className="voices__stage" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.blockquote
              key={i}
              className="voices__quote display"
              initial="hidden"
              animate="show"
              exit="gone"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: reduced ? 0 : 0.035 } },
                gone: { opacity: 0, y: -12, filter: 'blur(4px)', transition: { duration: 0.5, ease: EASE } },
              }}
            >
              {words.map((w, k) => (
                <m.span
                  key={k}
                  className="voices__w"
                  variants={{
                    hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EXPO } },
                  }}
                >
                  {w}{' '}
                </m.span>
              ))}
            </m.blockquote>
          </AnimatePresence>
        </div>

        <div className="voices__who" role="tablist" aria-label="Choose a couple">
          {TESTIMONIALS.map((x, k) => {
            const { who, rest } = split(x.a);
            return (
              <button
                key={x.a}
                role="tab"
                aria-selected={k === i}
                className={`voices__tab ${k === i ? 'is-on' : ''}`}
                onClick={() => setI(k)}
              >
                <span className="voices__tab-name">{who}</span>
                <span className="voices__tab-rest label">{rest}</span>
                <span className="voices__tab-line" aria-hidden="true">
                  {k === i && (
                    <m.span
                      key={`${i}-${playing}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      // fills over the quote's time while playing; held, it just completes
                      transition={playing ? { duration: INTERVAL / 1000, ease: 'linear' } : { duration: 0.6, ease: EXPO }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
