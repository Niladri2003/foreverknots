import { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { PHOTOS, FILTERS } from '../data';
import CloudImage from './CloudImage';
import Reveal from './Reveal';
import { EASE } from '../utils/motion';

/* Mosaic slot per index — crop ratios matching .tile--v* so Cloudinary
 * serves pre-cropped, face-aware thumbnails. */
const PATTERN_AR = ['4:3', '4:5', '3:4', '3:4', '3:4', '4:5', '4:5', '21:9'];
const TILE_SIZES = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw';

export default function Work({ openLightbox }) {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () => PHOTOS.filter((p) => filter === 'all' || p.cat === filter),
    [filter],
  );
  const visible = showAll ? filtered : filtered.slice(0, 8);

  const open = (p) => {
    const items = filtered.map((x) => ({ name: x.id, title: x.title, place: x.place, year: x.year }));
    openLightbox(items, filtered.indexOf(p));
  };

  return (
    <section id="work" className="section">
      <div className="wrap">
        <div className="work__head">
          <Reveal>
            <div className="mono">Selected work · 2023 – 2026</div>
            <h2 className="sec-head__title" style={{ marginTop: 12 }}>
              The <em>archive</em>
            </h2>
          </Reveal>
          <Reveal className="filters" delay={0.1}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={filter === f.id ? 'active' : ''}
                onClick={() => { setFilter(f.id); setShowAll(false); }}
              >
                {f.label}
              </button>
            ))}
          </Reveal>
        </div>

        <div className="grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <m.div
                layout
                key={p.id}
                className={`tile tile--v${(i % 8) + 1} ${p.aspect === 'portrait' ? 'is-portrait' : ''}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  layout: { duration: 0.5, ease: EASE },
                  opacity: { duration: 0.5, ease: EASE, delay: Math.min(i * 0.04, 0.35) },
                  y: { duration: 0.5, ease: EASE, delay: Math.min(i * 0.04, 0.35) },
                  scale: { duration: 0.25, ease: 'easeIn' },
                }}
                onClick={() => open(p)}
              >
                <CloudImage
                  name={p.id}
                  alt={p.title}
                  sizes={TILE_SIZES}
                  fill
                  ar={PATTERN_AR[i % 8]}
                />
                <div className="tile__overlay">
                  <div className="tile__title">{p.title}</div>
                  <div className="tile__meta">
                    {p.place} <span className="dot-sep" /> {p.year}
                  </div>
                </div>
              </m.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length > 8 && !showAll && (
          <div className="loadmore">
            <button className="btn btn--ghost" onClick={() => setShowAll(true)}>
              View {filtered.length - 8} more <span className="ar">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
