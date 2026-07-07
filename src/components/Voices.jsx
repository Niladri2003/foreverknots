import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { TESTIMONIALS } from '../data';
import { EASE } from '../utils/motion';

const INTERVAL = 7000;

export default function Voices() {
  const [i, setI] = useState(0);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const playing = inView && !hovered && !reduced;

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), INTERVAL);
    return () => clearInterval(t);
  }, [playing, i]);

  const t = TESTIMONIALS[i];

  return (
    <section
      id="voices"
      className="testi"
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="testi__inner">
        <div className="mono">Kind words · received with thanks</div>
        <span className="testi__mark" aria-hidden="true">"</span>
        <AnimatePresence mode="wait">
          <m.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <blockquote className="testi__quote">{t.q}</blockquote>
            <div className="testi__attr">{t.a}</div>
          </m.div>
        </AnimatePresence>
        <div className="testi__nav">
          {TESTIMONIALS.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`}>
              {k === i && (
                <m.span
                  className="fill"
                  key={`fill-${i}-${playing}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: playing ? 1 : 0.35 }}
                  transition={playing ? { duration: INTERVAL / 1000, ease: 'linear' } : { duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
