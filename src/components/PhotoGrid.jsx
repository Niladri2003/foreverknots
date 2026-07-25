import { useState, useRef } from 'react';
import { m, useMotionValue, useSpring } from 'motion/react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import CloudImage from './CloudImage';
import { EASE } from '../utils/motion';

/* Editorial masonry shared by the homepage archive and the gallery page.
 * Columns + balancing are handled by react-responsive-masonry; every photo
 * keeps its true aspect ratio (aspectRatio on the tile, no crop), so each
 * frame's shape matches what the lightbox shows. */
const TILE_SIZES = '(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw';
const GUTTER = 'clamp(12px, 1.6vw, 22px)';
// Match the previous breakpoints: 1 col ≤600, 2 col 601–1024, 3 col ≥1025.
const COLUMNS = { 0: 1, 601: 2, 1025: 3 };

export default function PhotoGrid({ photos, lightboxPhotos, openLightbox }) {
  const pool = lightboxPhotos || photos;

  // "View →" label following the cursor, pointer devices only
  const [labelOn, setLabelOn] = useState(false);
  const fine = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  );
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const sx = useSpring(cx, { stiffness: 500, damping: 45 });
  const sy = useSpring(cy, { stiffness: 500, damping: 45 });

  const open = (p) => {
    const items = pool.map((x) => ({ name: x.id, title: x.title, place: x.place, year: x.year }));
    openLightbox(items, pool.indexOf(p));
  };

  return (
    <>
      <div
        className="masonry"
        onMouseMove={(e) => { cx.set(e.clientX); cy.set(e.clientY); }}
        onMouseEnter={() => setLabelOn(true)}
        onMouseLeave={() => setLabelOn(false)}
      >
        <ResponsiveMasonry columnsCountBreakPoints={COLUMNS}>
          <Masonry gutter={GUTTER}>
            {photos.map((p, i) => (
              <m.div
                key={p.id}
                className="tile"
                style={{ aspectRatio: String(p.ratio || 1) }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.04, 0.35) }}
                onClick={() => open(p)}
              >
                <CloudImage
                  name={p.id}
                  alt={p.title}
                  sizes={TILE_SIZES}
                  q="auto:good"
                  widths={[400, 640, 900, 1200, 1440]}
                />
                <div className="tile__overlay">
                  <div className="tile__title">{p.title}</div>
                  <div className="tile__meta">
                    {p.place} <span className="dot-sep" /> {p.year}
                  </div>
                </div>
              </m.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>

      {fine.current && (
        <m.div
          className="cursor-label"
          style={{ x: sx, y: sy }}
          animate={{ opacity: labelOn ? 1 : 0, scale: labelOn ? 1 : 0.8 }}
          transition={{ duration: 0.25, ease: EASE }}
          aria-hidden="true"
        >
          <span>View →</span>
        </m.div>
      )}
    </>
  );
}
