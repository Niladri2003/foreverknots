import { useEffect } from 'react';

export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (index == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, onClose, onPrev, onNext]);

  const open = index != null;
  const item = open ? items[index] : null;

  return (
    <div
      className={`lightbox ${open ? 'open' : ''}`}
      onClick={(e) => { if (e.target.classList.contains('lightbox')) onClose(); }}
    >
      {open && (
        <>
          <div className="lightbox__counter">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </div>
          <button className="lightbox__close" onClick={onClose}>Close <span>×</span></button>
          <button className="lightbox__arrow prev" onClick={onPrev} aria-label="Previous">‹</button>
          <div className="lightbox__media">
            <img src={item.src} alt={item.title} />
          </div>
          <button className="lightbox__arrow next" onClick={onNext} aria-label="Next">›</button>
          <div className="lightbox__caption">
            <div className="t">{item.title}</div>
            <div className="s">{item.place} <span className="dot-sep" /> {item.year}</div>
          </div>
        </>
      )}
    </div>
  );
}
