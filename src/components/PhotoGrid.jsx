import { useState, useRef, useEffect } from 'react';
import { m, useMotionValue, useSpring } from 'motion/react';
import CloudImage from './CloudImage';
import { EASE } from '../utils/motion';

/* Editorial masonry shared by the homepage archive and the gallery page.
 * Every photo keeps its true aspect ratio (no crop). Tiles are packed into
 * balanced columns by running height, so the wall stays gapless and each
 * frame's true crop matches what the lightbox shows. */
const TILE_SIZES = '(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw';

// Responsive column count, matched to the CSS breakpoints in layout.css.
function useColumnCount() {
  const [cols, setCols] = useState(() => {
    if (typeof window === 'undefined') return 3;
    return window.innerWidth <= 600 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  });
  useEffect(() => {
    const one = window.matchMedia('(max-width: 600px)');
    const two = window.matchMedia('(max-width: 1024px)');
    const update = () => setCols(one.matches ? 1 : two.matches ? 2 : 3);
    one.addEventListener('change', update);
    two.addEventListener('change', update);
    return () => {
      one.removeEventListener('change', update);
      two.removeEventListener('change', update);
    };
  }, []);
  return cols;
}

// Greedy shortest-column packing: preserves input order while balancing the
// running height of each column (height per unit width = 1 / ratio).
function toColumns(photos, n) {
  const cols = Array.from({ length: n }, () => []);
  const heights = new Array(n).fill(0);
  for (const p of photos) {
    let target = 0;
    for (let i = 1; i < n; i++) if (heights[i] < heights[target]) target = i;
    cols[target].push(p);
    heights[target] += 1 / (p.ratio || 1);
  }
  return cols;
}

export default function PhotoGrid({ photos, lightboxPhotos, openLightbox }) {
  const pool = lightboxPhotos || photos;
  const colCount = useColumnCount();
  const columns = toColumns(photos, colCount);

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
        {columns.map((col, ci) => (
          <div className="masonry__col" key={ci}>
            {col.map((p) => {
              const i = photos.indexOf(p);
              return (
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
              );
            })}
          </div>
        ))}
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
