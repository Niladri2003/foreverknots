import { useEffect } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import CloudImage from './CloudImage';
import { cld } from '../utils/cloudinary';
import { LUXE } from '../utils/motion';

/* Presentational Ken Burns crossfade — timing lives in Hero.
 * Scale outlives the 1.4s opacity fade so drift never visibly stops. */
export default function HeroSlideshow({ slides, index, interval = 5500 }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => {
      const next = slides[(index + 1) % slides.length];
      const img = new Image();
      img.src = cld(next.id, { w: 1440 });
    }, Math.max(interval - 1200, 0));
    return () => clearTimeout(t);
  }, [index, interval, reduced, slides]);

  const slide = slides[reduced ? 0 : index];

  return (
    <AnimatePresence mode="sync" initial={false}>
      <m.div
        key={slide.id}
        className="hero__slide"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 1.4, ease: 'easeInOut' },
          scale: { duration: 7, ease: LUXE },
        }}
      >
        <CloudImage
          name={slide.id}
          alt={slide.alt}
          sizes="100vw"
          widths={[768, 1080, 1440, 1920, 2048]}
          eager={index === 0}
          // Retire the static boot image (index.html) the instant this real frame has
          // decoded AND painted (decode + two frames) — never sooner, or an overlay
          // boot image on repeat visits would flash the load gap. Removing it does not
          // retract the LCP it already recorded.
          onLoad={
            index === 0
              ? (e) => {
                  const img = e.currentTarget;
                  const drop = () =>
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => document.getElementById('boot-hero')?.remove()),
                    );
                  if (img.decode) img.decode().then(drop, drop);
                  else drop();
                }
              : undefined
          }
        />
      </m.div>
    </AnimatePresence>
  );
}
