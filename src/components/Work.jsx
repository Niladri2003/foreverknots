import { useNavigate } from 'react-router-dom';
import { PHOTOS } from '../data';
import PhotoGrid from './PhotoGrid';
import Reveal from './Reveal';

/* Curated homepage selection; the full, filterable archive lives at /gallery */
const CURATED = PHOTOS.slice(0, 9);

export default function Work({ openLightbox }) {
  const navigate = useNavigate();

  return (
    <section id="work" className="section">
      <div className="wrap">
        <div className="work__head">
          <Reveal>
            <div className="mono">Selected work · 2023 - 2026</div>
            <h2 className="sec-head__title" style={{ marginTop: 12 }}>
              The <em>archive</em>
            </h2>
          </Reveal>
          <Reveal as="p" className="sec-head__lead" delay={0.1}>
            Nine frames we keep coming back to. The full archive, every
            pre-wedding, ritual, portrait and detail, lives in the gallery.
          </Reveal>
        </div>

        <PhotoGrid photos={CURATED} lightboxPhotos={PHOTOS} openLightbox={openLightbox} />

        <div className="loadmore">
          <button className="btn btn--ghost" onClick={() => navigate('/gallery')}>
            View the full archive · {PHOTOS.length} frames <span className="ar">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
