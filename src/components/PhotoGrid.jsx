import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Develop from './Develop';

/* The gallery wall: true aspect ratios (no crop), columns balanced up front by
 * react-responsive-masonry, each print developing as it is reached. */
const TILE_SIZES = '(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw';
const GUTTER = 'clamp(14px, 2vw, 32px)';
const COLUMNS = { 0: 1, 601: 2, 1025: 3 };

export default function PhotoGrid({ photos, lightboxPhotos, openLightbox }) {
  const pool = lightboxPhotos || photos;

  const open = (p) => {
    const items = pool.map((x) => ({ name: x.id, title: x.title, place: x.place, year: x.year }));
    openLightbox(items, pool.indexOf(p));
  };

  return (
    <div className="grid">
      <ResponsiveMasonry columnsCountBreakPoints={COLUMNS}>
        <Masonry gutter={GUTTER}>
          {photos.map((p, i) => (
            <figure key={p.id} className="grid__tile">
              <button
                className="grid__print"
                style={{ aspectRatio: String(p.ratio || 1) }}
                onClick={() => open(p)}
                data-cursor="View"
                aria-label={`Open ${p.title}`}
              >
                <Develop
                  name={p.id}
                  alt={p.title}
                  sizes={TILE_SIZES}
                  q="auto:good"
                  widths={[400, 640, 900, 1200, 1440]}
                  delay={(i % 3) * 0.1}
                  amount={0.15}
                />
              </button>
              <figcaption>
                <span className="grid__title display it">{p.title}</span>
                <span className="label">{p.place}, {p.year}</span>
              </figcaption>
            </figure>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
