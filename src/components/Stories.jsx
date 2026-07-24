import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { useMatch } from 'react-router-dom';
import { STORIES } from '../data';
import CloudImage from './CloudImage';
import Reveal from './Reveal';
import { EASE } from '../utils/motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/* The grid shows three at a time and cycles on its own; the arrows walk the
 * same window by hand. Both wrap around. With three stories there is nothing
 * to move, so the timer stays off and the arrows sit disabled until a fourth
 * story is added. */
const PER_VIEW = 3;
const INTERVAL = 6000;

/* Outgoing and incoming decks share one grid cell (see .stories__stage), so
 * these two dissolve through each other rather than cutting. A dissolve also
 * makes wrapping from the last window back to the first read the same as any
 * other step, with no backwards rewind. */
const deck = {
  hidden: {},
  show: (stagger = 0) => ({ transition: { staggerChildren: stagger } }),
  exit: { opacity: 0, pointerEvents: 'none', transition: { duration: 0.9, ease: EASE } },
};

const cardIn = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const cardCross = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export default function Stories({ openStory }) {
  const [start, setStart] = useState(0);
  const [paged, setPaged] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const storyOpen = !!useMatch('/stories/:id');

  const maxStart = Math.max(0, STORIES.length - PER_VIEW);
  const canPage = STORIES.length > PER_VIEW;
  const visible = STORIES.slice(start, start + PER_VIEW);

  const go = (dir) => {
    setPaged(true);
    setStart((s) => (dir > 0 ? (s >= maxStart ? 0 : s + 1) : s <= 0 ? maxStart : s - 1));
  };

  /* Auto-advance, held while the reader is hovering, tabbing through, or has a
   * story open over the top. Depending on `start` restarts the wait after a
   * manual click, so the next tick never lands right on top of it. */
  useEffect(() => {
    if (!canPage || reduced || paused || storyOpen) return;
    const id = setTimeout(() => {
      setPaged(true);
      setStart((s) => (s >= maxStart ? 0 : s + 1));
    }, INTERVAL);
    return () => clearTimeout(id);
  }, [start, canPage, reduced, paused, storyOpen, maxStart]);

  return (
    <section id="stories" className="section stories">
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="sec-head__meta">
            <div className="mono">Wedding stories · long-form</div>
            <h2 className="sec-head__title">
              From the <em>journal</em>.
            </h2>
          </Reveal>
          <Reveal as="p" className="sec-head__lead" delay={0.1}>
            A few weddings deserve more than a tile. Step inside our
            favourite stories: full galleries, short notes from the day,
            and the small details we don't usually share.
          </Reveal>
        </div>

        {/* Hovering or tabbing anywhere in the carousel holds the timer, so the
            deck never shifts out from under someone reaching for an arrow. */}
        <div
          className="stories__carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="stories__nav">
            <button
              type="button"
              className="stories__arrow"
              onClick={() => go(-1)}
              disabled={!canPage}
              aria-label="Previous stories"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="stories__arrow"
              onClick={() => go(1)}
              disabled={!canPage}
              aria-label="Next stories"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="stories__stage">
            <AnimatePresence initial={false}>
              <m.div
                key={start}
                className="stories-grid"
                variants={deck}
                custom={paged ? 0 : 0.1}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {visible.map((s) => (
                  <m.article
                    key={s.id}
                    className="story-card"
                    variants={paged ? cardCross : cardIn}
                    onClick={() => openStory(s)}
                  >
                    <div className="story-card__media">
                      <CloudImage
                        name={s.cover}
                        alt={s.couple}
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        fill
                        ar="4:5"
                      />
                    </div>
                    <div className="story-card__meta">
                      <span>{s.type}</span>
                      <span>{s.when}</span>
                    </div>
                    <h3 className="story-card__title">
                      <em>{s.couple.split(' & ')[0]}</em> & {s.couple.split(' & ')[1]}
                    </h3>
                    <div className="mono" style={{ marginBottom: 12 }}>{s.place}</div>
                    <p className="story-card__excerpt">{s.excerpt}</p>
                    <div className="story-card__cta">
                      Read the story <span className="ar">→</span>
                    </div>
                  </m.article>
                ))}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
