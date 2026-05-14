import { useState, useMemo, useEffect } from 'react';
import { PHOTOS, FILTERS } from '../data';

export default function Work({ openLightbox }) {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () => PHOTOS.filter((p) => filter === 'all' || p.cat === filter),
    [filter],
  );
  const visible = showAll ? filtered : filtered.slice(0, 8);

  useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll('#work .tile.reveal').forEach((el) => el.classList.add('in'));
    }, 30);
    return () => clearTimeout(t);
  }, [filter, showAll]);

  return (
    <section id="work" className="section">
      <div className="wrap">
        <div className="work__head">
          <div className="reveal">
            <div className="mono">Selected work · 2023 – 2026</div>
            <h2 className="sec-head__title" style={{ marginTop: 12 }}>
              The <em>archive</em>
            </h2>
          </div>
          <div className="filters reveal" data-delay="1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={filter === f.id ? 'active' : ''}
                onClick={() => { setFilter(f.id); setShowAll(false); }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid">
          {visible.map((p, i) => (
            <div
              key={p.src}
              className="tile reveal"
              data-delay={(i % 4) + 1}
              onClick={() => openLightbox(filtered, filtered.indexOf(p))}
            >
              <img src={p.src} alt={p.title} loading="lazy" />
              <div className="tile__overlay">
                <div className="tile__title">{p.title}</div>
                <div className="tile__meta">
                  {p.place} <span className="dot-sep" /> {p.year}
                </div>
              </div>
            </div>
          ))}
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
