import { useEffect, useRef } from 'react';
import { m, AnimatePresence, useScroll, useTransform } from 'motion/react';
import CloudImage from './CloudImage';
import Reveal from './Reveal';
import { useBodyLock } from '../hooks/useBodyLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { LUXE } from '../utils/motion';

const GALLERY_SIZES = '(max-width: 768px) 100vw, 50vw';
const GALLERY_AR = ['4:3', '4:5', '4:5', '4:5', '21:9'];

function StoryPanel({ story, onClose, openLightbox }) {
  const innerRef = useRef(null);
  const rootRef = useRef(null);
  useFocusTrap(rootRef, true);
  const { scrollY } = useScroll({ container: innerRef });
  const yHero = useTransform(scrollY, [0, 800], [0, -70]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const [first, second] = story.couple.split(' & ');

  return (
    <m.div
      className="story-modal-root"
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${story.couple}, wedding story`}
      initial={{ y: '100%' }}
      animate={{ y: 0, transition: { duration: 0.7, ease: LUXE } }}
      exit={{ y: '100%', transition: { duration: 0.5, ease: LUXE } }}
    >
      <div className="story-modal" ref={innerRef} data-lenis-prevent>
        <div className="story-modal__hero">
          <m.div style={{ y: yHero }}>
            <CloudImage name={story.cover} alt={story.couple} sizes="100vw" widths={[768, 1080, 1440, 1920, 2048]} eager />
          </m.div>
          <m.div
            className="story-modal__hero-text"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: LUXE, delay: 0.5 }}
          >
            <div className="mono">{story.type} · {story.when}</div>
            <h2>
              <em>{first}</em>
              <span style={{ fontStyle: 'italic', color: 'var(--accent-warm)' }}> & </span>
              {second}
            </h2>
          </m.div>
        </div>

        <div className="story-modal__body">
          <div className="story-modal__intro">
            <Reveal className="story-modal__facts" root={innerRef}>
              <div className="mono" style={{ marginBottom: 16 }}>The Day, in Facts</div>
              <dl>
                {story.facts.map(([k, v]) => (
                  <div className="row" key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal className="story-modal__narrative" root={innerRef} delay={0.1}>
              <div className="mono" style={{ marginBottom: 24 }}>A note from the day</div>
              {story.narrative.map((p, i) => <p key={i}>{p}</p>)}
            </Reveal>
          </div>

          <div className="story-modal__gallery">
            {story.gallery.map((name, i) => (
              <Reveal
                key={name + i}
                className={`g-v${(i % 5) + 1}`}
                root={innerRef}
                delay={(i % 4) * 0.08}
                onClick={() => {
                  const items = story.gallery.map((n) => ({
                    name: n, title: story.couple, place: story.place, year: story.when,
                  }));
                  openLightbox(items, i);
                }}
              >
                <CloudImage
                  name={name}
                  alt={`${story.couple}, frame ${i + 1}`}
                  sizes={GALLERY_SIZES}
                  fill
                  ar={GALLERY_AR[i % 5]}
                  q="auto:good"
                  widths={[480, 768, 1080, 1440]}
                />
              </Reveal>
            ))}
          </div>

          <div className="story-modal__end">
            <button className="btn btn--ghost" onClick={onClose}>
              Back to the site <span className="ar">→</span>
            </button>
          </div>
        </div>
      </div>

      <button className="story-modal__close" onClick={onClose}>
        Close <span>×</span>
      </button>
    </m.div>
  );
}

export default function StoryModal({ story, onClose, openLightbox }) {
  useBodyLock(!!story);
  return (
    <AnimatePresence>
      {story && (
        <StoryPanel key={story.id} story={story} onClose={onClose} openLightbox={openLightbox} />
      )}
    </AnimatePresence>
  );
}
