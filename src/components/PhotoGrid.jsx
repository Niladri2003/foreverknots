import { useState, useRef } from 'react';
import { m, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import CloudImage from './CloudImage';
import { EASE } from '../utils/motion';

/* Editorial mosaic shared by the homepage archive and the gallery page.
 * Crop ratios match .tile--v* so Cloudinary serves face-aware thumbnails. */
const PATTERN_AR = ['4:3', '4:5', '3:4', '3:4', '3:4', '4:5', '4:5', '21:9'];
const TILE_SIZES = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw';

export default function PhotoGrid({ photos, lightboxPhotos, openLightbox }) {
  const pool = lightboxPhotos || photos;

  // "View →" label following the cursor — pointer devices only
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
        className="grid"
        onMouseMove={(e) => { cx.set(e.clientX); cy.set(e.clientY); }}
        onMouseEnter={() => setLabelOn(true)}
        onMouseLeave={() => setLabelOn(false)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {photos.map((p, i) => (
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
        </AnimatePresence>
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
