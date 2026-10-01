import { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import CloudImage from './CloudImage';
import Develop from './Develop';
import Reveal from './Reveal';
import SplitWords from './SplitWords';
import { STORIES } from '../data';
import { useBodyLock } from '../hooks/useBodyLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { EXPO, SILK, useRange } from '../utils/motion';
import { ratioFor } from '../utils/photoRatios';

const GALLERY_SIZES = '(max-width: 768px) 100vw, 50vw';
const GALLERY_GUTTER = 'clamp(12px, 1.6vw, 24px)';
const GALLERY_COLUMNS = { 0: 1, 769: 2 };

/* A story opens like a magazine feature laid over the page: the cover rises
 * full-bleed with the couple's names across it, then the facts, the note from
 * the day, every photograph, and a way on to the next couple. */
function StoryPanel({ story, onClose, openLightbox, openStory }) {
  const innerRef = useRef(null);
  const rootRef = useRef(null);
  useFocusTrap(rootRef, true);
  const { scrollY } = useScroll({ container: innerRef });
  const yHero = useRange(scrollY, [0, 900], ['0%', '18%']);
  const heroDim = useRange(scrollY, [0, 700], [0, 0.5]);
  // Over the cover the close pill is smoked glass; on the paper it turns to ink.
  const [onPaper, setOnPaper] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setOnPaper(y > window.innerHeight - 80));

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const [first, second] = story.couple.split(' & ');
  const at = STORIES.findIndex((s) => s.id === story.id);
  const next = STORIES[(at + 1) % STORIES.length];

  return (
    <m.div
      className="story"
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${story.couple}, wedding story`}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: SILK } }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.8, ease: SILK } }}
    >
      <div className="story__scroll" ref={innerRef} data-lenis-prevent>
        <header className="story__hero">
          <m.div
            className="story__cover"
            style={{ y: yHero }}
            initial={{ scale: 1.18 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: EXPO }}
          >
            <CloudImage name={story.cover} alt={story.couple} sizes="100vw" widths={[768, 1080, 1440, 1920, 2048]} eager />
          </m.div>
          <m.div className="story__dim" style={{ opacity: heroDim }} aria-hidden="true" />
          <div className="story__hero-text wrap">
            <m.p
              className="caption"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.9 }}
            >
              {story.type}, {story.when}
            </m.p>
            <SplitWords as="h2" className="story__names display" play delay={0.55} stagger={0.09}>
              {first} <em>&amp;</em> {second}
            </SplitWords>
          </div>
        </header>

        <div className="story__body wrap">
          <div className="story__intro">
            <Reveal className="story__facts" root={innerRef}>
              <dl>
                {story.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="label">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal className="story__note" root={innerRef} delay={0.1}>
              <p className="story__excerpt display">{story.excerpt}</p>
              {story.narrative.map((p, i) => <p key={i}>{p}</p>)}
            </Reveal>
          </div>

          <div className="story__gallery">
            <ResponsiveMasonry columnsCountBreakPoints={GALLERY_COLUMNS}>
              <Masonry gutter={GALLERY_GUTTER}>
                {story.gallery.map((name, i) => (
                  <button
                    key={name + i}
                    className="story__frame"
                    style={{ aspectRatio: String(ratioFor(name)) }}
                    data-cursor="View"
                    aria-label={`Open frame ${i + 1} of ${story.gallery.length}`}
                    onClick={() => {
                      const items = story.gallery.map((n) => ({ name: n, title: story.couple, place: story.place, year: story.when }));
                      openLightbox(items, i);
                    }}
                  >
                    <Develop
                      name={name}
                      alt={`${story.couple}, frame ${i + 1}`}
                      sizes={GALLERY_SIZES}
                      q="auto:good"
                      widths={[480, 768, 1080, 1440]}
                      root={innerRef}
                      delay={(i % 2) * 0.12}
                      amount={0.15}
                    />
                  </button>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </div>

        {next && next.id !== story.id && (
          <button className="story__next" onClick={() => openStory(next)} data-cursor="Read">
            <span className="story__next-img" aria-hidden="true">
              <CloudImage name={next.cover} alt="" sizes="100vw" widths={[768, 1440, 1920]} />
            </span>
            <span className="story__next-text wrap">
              <span className="caption">Next in the journal</span>
              <span className="story__next-name display">{next.couple.replace(' & ', ' & ')}</span>
              <span className="label">{next.type}, {next.place}</span>
            </span>
          </button>
        )}
      </div>

      <button className={`story__close ${onPaper ? 'is-paper' : ''}`} onClick={onClose}>
        <span className="roll"><span>Close</span><span aria-hidden="true">Close</span></span>
      </button>
    </m.div>
  );
}

export default function StoryModal({ story, onClose, openLightbox, openStory }) {
  useBodyLock(!!story);
  return (
    <AnimatePresence mode="wait">
      {story && (
        <StoryPanel key={story.id} story={story} onClose={onClose} openLightbox={openLightbox} openStory={openStory} />
      )}
    </AnimatePresence>
  );
}
