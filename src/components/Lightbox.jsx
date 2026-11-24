import { useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { cld } from '../utils/cloudinary';
import { useBodyLock } from '../hooks/useBodyLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { EXPO, SILK } from '../utils/motion';

const frameVariants = {
  enter: (dir) => ({ opacity: 0, x: dir * 60, scale: 0.97, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.9, ease: EXPO } },
  exit: (dir) => ({ opacity: 0, x: dir * -60, filter: 'blur(6px)', transition: { duration: 0.45, ease: 'easeIn' } }),
};

/* Separate component so AnimatePresence's direct child carries no ref:
 * motion reads the child's ref prop internally, which React 18 warns on. */
function LightboxShell({ items, index, dir, onClose, onPrev, onNext }) {
  const rootRef = useRef(null);
  useFocusTrap(rootRef, true);
  const item = items[index];

  return (
    <m.div
      className="lb"
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: SILK } }}
      transition={{ duration: 0.6, ease: SILK }}
      onClick={(e) => { if (e.target === e.currentTarget || e.target.classList.contains('lb__stage')) onClose(); }}
    >
      <div className="lb__top">
        <span className="label">{index + 1} of {items.length}</span>
        <button className="lb__close" onClick={onClose}>
          <span className="roll"><span>Close</span><span aria-hidden="true">Close</span></span>
        </button>
      </div>

      <div className="lb__stage">
        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          <m.figure
            key={`${item.name}-${index}`}
            className="lb__frame"
            custom={dir}
            variants={frameVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(e, info) => {
              if (info.offset.x < -70 || info.velocity.x < -500) onNext();
              else if (info.offset.x > 70 || info.velocity.x > 500) onPrev();
            }}
          >
            <img src={cld(item.name, { w: 2048 })} alt={item.title} draggable={false} />
            <figcaption>
              <span className="lb__title display it">{item.title}</span>
              <span className="label">{item.place}{item.year ? `, ${item.year}` : ''}</span>
            </figcaption>
          </m.figure>
        </AnimatePresence>
      </div>

      <div className="lb__nav">
        <button onClick={onPrev} aria-label="Previous photograph" className="lb__arrow">
          <svg viewBox="0 0 40 12" aria-hidden="true"><path d="M40 6H1M6 1 1 6l5 5" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
        </button>
        <button onClick={onNext} aria-label="Next photograph" className="lb__arrow">
          <svg viewBox="0 0 40 12" aria-hidden="true"><path d="M0 6h39M34 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
        </button>
      </div>
    </m.div>
  );
}

export default function Lightbox({ items, index, dir, onClose, onPrev, onNext }) {
  const open = index != null;
  useBodyLock(open);

  useEffect(() => {
    if (!open) return undefined;
    // Capture on window so this runs before the story overlay's document
    // listener, and stop it there: Escape closes the lightbox, not both.
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
      else return;
      e.stopImmediatePropagation();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {open && (
        <LightboxShell items={items} index={index} dir={dir} onClose={onClose} onPrev={onPrev} onNext={onNext} />
      )}
    </AnimatePresence>
  );
}
