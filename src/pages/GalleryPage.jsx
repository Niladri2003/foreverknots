import { useState, useMemo } from 'react';
import { m, LayoutGroup } from 'motion/react';
import { PHOTOS, FILTERS } from '../data';
import PhotoGrid from '../components/PhotoGrid';
import SplitWords from '../components/SplitWords';
import { EXPO } from '../utils/motion';

export default function GalleryPage({ openLightbox }) {
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(
    () => PHOTOS.filter((p) => filter === 'all' || p.cat === filter),
    [filter],
  );
  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.id, PHOTOS.filter((p) => f.id === 'all' || p.cat === f.id).length])),
    [],
  );

  return (
    <main className="gallery" data-tone="night">
      <div className="wrap">
        <header className="gallery__head">
          <SplitWords as="h1" className="display t-4xl" play delay={0.2} stagger={0.08}>
            Every frame<br />we kept.
          </SplitWords>
          <m.p
            className="lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EXPO, delay: 0.7 }}
          >
            The full archive: pre-weddings, rituals, portraits and the small
            details in between. New photographs join after every season.
          </m.p>
        </header>

        <m.div
          className="gallery__filters"
          role="toolbar"
          aria-label="Filter photographs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
        >
          <LayoutGroup id="gallery-filter">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`gallery__filter ${filter === f.id ? 'is-on' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <sup>{counts[f.id]}</sup>
                {filter === f.id && <m.span layoutId="gallery-underline" className="gallery__underline" transition={{ duration: 0.7, ease: EXPO }} />}
              </button>
            ))}
          </LayoutGroup>
        </m.div>

        <PhotoGrid key={filter} photos={filtered} openLightbox={openLightbox} />
      </div>
    </main>
  );
}
