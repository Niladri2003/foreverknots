import { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence, useInView, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react';
import { STORIES } from '../data';
import CloudImage from './CloudImage';
import SplitWords from './SplitWords';
import { useMedia, FINE_POINTER } from '../hooks/useMedia';
import { EXPO, EASE } from '../utils/motion';

/* The journal as a list of names, set large. On a pointer device the couple's
 * cover floats beside the cursor while you read down the list; it leans into
 * the direction you move, the way a held print would. On touch the covers sit
 * in the rows themselves. */
export default function Journal({ openStory }) {
  const fine = useMedia(FINE_POINTER);
  const [hover, setHover] = useState(null);
  const listRef = useRef(null);
  const near = useInView(listRef, { once: true, margin: '600px 0px' });

  // Warm the covers before the first hover so the floating print never opens
  // onto an empty frame.
  useEffect(() => {
    if (!near || !fine) return;
    STORIES.forEach((s) => { const img = new Image(); img.src = s.cover; });
  }, [near, fine]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 22, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 150, damping: 22, mass: 0.7 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-1800, 0, 1800], [-9, 0, 9], { clamp: true });

  const onMove = (e) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <section id="stories" className="journal section" data-tone="pearl" aria-labelledby="journal-title">
      <div className="wrap">
        <header className="journal__head">
          <SplitWords as="h2" id="journal-title" className="display t-3xl">
            The journal
          </SplitWords>
          <p className="lead">
            Some weddings deserve more than a single frame. Each of these opens
            into the full set of photographs and a short note from the day.
          </p>
        </header>

        <ul
          className={`journal__list ${hover !== null ? 'is-hovering' : ''}`}
          ref={listRef}
          onPointerMove={fine ? onMove : undefined}
          onPointerLeave={() => setHover(null)}
        >
          {STORIES.map((s, i) => {
            const [a, b] = s.couple.split(' & ');
            return (
              <m.li
                key={s.id}
                className={`journal__row ${hover === i ? 'is-on' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.2, ease: EXPO, delay: (i % 3) * 0.06 }}
              >
                <button
                  className="journal__btn"
                  onClick={() => openStory(s)}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  data-cursor="Read"
                >
                  {!fine && (
                    <span className="journal__thumb" aria-hidden="true">
                      <CloudImage name={s.cover} alt="" sizes="90vw" fill ar="16:10" />
                    </span>
                  )}
                  <span className="journal__names display">
                    {a} <span className="journal__amp">&amp;</span> {b}
                  </span>
                  <span className="journal__type">{s.type}</span>
                  <span className="journal__place caption">{s.place}</span>
                  <span className="journal__when label">{s.when}</span>
                  <span className="journal__line" aria-hidden="true" />
                </button>
              </m.li>
            );
          })}
        </ul>
      </div>

      {fine && (
        <m.div
          className="journal__float"
          style={{ x: sx, y: sy, rotate }}
          animate={{ opacity: hover !== null ? 1 : 0, scale: hover !== null ? 1 : 0.85 }}
          transition={{ duration: 0.6, ease: EXPO }}
          aria-hidden="true"
        >
          <AnimatePresence initial={false}>
            {hover !== null && (
              <m.div
                key={STORIES[hover].id}
                className="journal__float-img"
                initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE, delay: 0.25 } }}
                transition={{ duration: 0.75, ease: EXPO }}
              >
                <CloudImage name={STORIES[hover].cover} alt="" sizes="24vw" widths={[480, 768]} fill ar="4:5" />
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </section>
  );
}
