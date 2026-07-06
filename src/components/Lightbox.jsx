import { useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { cld } from '../utils/cloudinary';
import { useBodyLock } from '../hooks/useBodyLock';
import { LUXE } from '../utils/motion';

const frameVariants = {
  enter: (dir) => ({ opacity: 0, x: dir * 36, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, ease: LUXE } },
  exit: (dir) => ({ opacity: 0, x: dir * -36, transition: { duration: 0.3, ease: 'easeIn' } }),
};

export default function Lightbox({ items, index, dir, onClose, onPrev, onNext }) {
  const open = index != null;
  useBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);

  const item = open ? items[index] : null;

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => { if (e.target.classList.contains('lightbox')) onClose(); }}
        >
          <div className="lightbox__counter">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </div>
          <button className="lightbox__close" onClick={onClose}>Close <span>×</span></button>
          <button className="lightbox__arrow prev" onClick={onPrev} aria-label="Previous">‹</button>

          <div className="lightbox__stage">
            <AnimatePresence mode="sync" custom={dir} initial={false}>
              <m.figure
                key={index}
                className="lightbox__frame"
                custom={dir}
                variants={frameVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -70 || info.velocity.x < -500) onNext();
                  else if (info.offset.x > 70 || info.velocity.x > 500) onPrev();
                }}
              >
                <img src={cld(item.name, { w: 1600 })} alt={item.title} draggable={false} />
                <figcaption className="lightbox__caption">
                  <div className="t">{item.title}</div>
                  <div className="s">{item.place} <span className="dot-sep" /> {item.year}</div>
                </figcaption>
              </m.figure>
            </AnimatePresence>
          </div>

          <button className="lightbox__arrow next" onClick={onNext} aria-label="Next">›</button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
