import { useEffect, useRef } from 'react';

export default function StoryModal({ story, onClose, openLightbox }) {
  const open = !!story;
  const innerRef = useRef(null);

  useEffect(() => {
    if (open) document.body.classList.add('lock');
    else document.body.classList.remove('lock');
    return () => document.body.classList.remove('lock');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && innerRef.current) innerRef.current.scrollTop = 0;
  }, [story?.id, open]);

  useEffect(() => {
    if (!open) return;
    const els = innerRef.current?.querySelectorAll('.reveal:not(.in)') || [];
    const t = setTimeout(() => { els.forEach((el) => el.classList.add('in')); }, 80);
    return () => clearTimeout(t);
  }, [open, story?.id]);

  return (
    <div className={`story-modal ${open ? 'open' : ''}`} ref={innerRef}>
      {story && (
        <>
          <button className="story-modal__close" onClick={onClose}>
            Close <span>×</span>
          </button>
          <div className="story-modal__hero">
            <img src={story.cover} alt={story.couple} />
            <div className="story-modal__hero-text reveal">
              <div className="mono">{story.type} · {story.when}</div>
              <h2>
                <em>{story.couple.split(' & ')[0]}</em>
                <span style={{ fontStyle: 'italic', color: 'var(--accent-warm)' }}> & </span>
                {story.couple.split(' & ')[1]}
              </h2>
            </div>
          </div>

          <div className="story-modal__body">
            <div className="story-modal__intro">
              <div className="story-modal__facts reveal">
                <div className="mono" style={{ marginBottom: 16 }}>The Day, in Facts</div>
                <dl>
                  {story.facts.map(([k, v]) => (
                    <div className="row" key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="story-modal__narrative reveal" data-delay="1">
                <div className="mono" style={{ marginBottom: 24 }}>A note from the day</div>
                {story.narrative.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            <div className="story-modal__gallery">
              {story.gallery.map((src, i) => (
                <div
                  key={src + i}
                  className="reveal"
                  data-delay={(i % 4) + 1}
                  onClick={() => {
                    const items = story.gallery.map((s) => ({
                      src: s, title: story.couple, place: story.place, year: story.when,
                    }));
                    openLightbox(items, i);
                  }}
                >
                  <img src={src} alt={`${story.couple} — frame ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--sp-6)' }}>
              <button className="btn btn--ghost" onClick={onClose}>
                Back to the site <span className="ar">→</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
