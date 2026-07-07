import { useState, useMemo, useEffect } from 'react';
import { PHOTOS, FILTERS } from '../data';
import PhotoGrid from '../components/PhotoGrid';
import Reveal from '../components/Reveal';
import { m } from 'motion/react';
import { maskLine, stagger } from '../utils/motion';

const HOME_TITLE = 'foreverknots — Wedding Photography, Kolkata';

export default function GalleryPage({ openLightbox }) {
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(
    () => PHOTOS.filter((p) => filter === 'all' || p.cat === filter),
    [filter],
  );

  useEffect(() => {
    document.title = 'The Gallery — foreverknots · Wedding Photography, Kolkata';
    return () => { document.title = HOME_TITLE; };
  }, []);

  return (
    <main className="gallery-page">
      <section className="section">
        <div className="wrap">
          <div className="gallery-page__head">
            <m.div initial="hidden" animate="show" variants={stagger(0.12, 0.1)}>
              <div className="mono">The gallery · {PHOTOS.length} photographs & counting</div>
              <h1 className="gallery-page__title">
                <span className="mask"><m.span variants={maskLine}>Every frame</m.span></span>
                <span className="mask"><m.span variants={maskLine}>we <em>kept</em>.</m.span></span>
              </h1>
              <p className="sec-head__lead gallery-page__lead">
                The complete foreverknots archive — pre-weddings, rituals,
                portraits and details, from Kolkata to Kashmir. New frames
                join after every season.
              </p>
            </m.div>
          </div>

          <Reveal className="filters gallery-page__filters" delay={0.2}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={filter === f.id ? 'active' : ''}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </Reveal>

          <PhotoGrid photos={filtered} openLightbox={openLightbox} />
        </div>
      </section>
    </main>
  );
}
