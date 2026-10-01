import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { m, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { PHOTOS, SELECTS } from '../data';
import Develop from './Develop';
import SplitWords from './SplitWords';
import { useMedia, NARROW } from '../hooks/useMedia';
import { useGo } from './Transition';

const SPEED = 1.7;
const FRAMES = SELECTS.map((id) => PHOTOS.find((p) => p.id === id)).filter(Boolean);

/* Hung like a salon wall: heights and vertical positions vary frame to frame,
 * so the eye travels rather than marches. */
const HANG = [
  { h: 68, align: 'end' },
  { h: 54, align: 'start' },
  { h: 60, align: 'center' },
  { h: 50, align: 'end' },
  { h: 70, align: 'start' },
  { h: 56, align: 'center' },
  { h: 52, align: 'end' },
  { h: 62, align: 'start' },
  { h: 66, align: 'center' },
];

/* One frame. Inside its mount the photograph drifts against the wall's travel
 * (a slow parallax), so the prints read as hung in depth, not printed flat. */
function Frame({ p, i, x, pinned, onOpen }) {
  const ref = useRef(null);
  const [geo, setGeo] = useState({ left: 0, w: 1, vw: 1 });
  useLayoutEffect(() => {
    if (!pinned) return undefined;
    const measure = () => {
      const el = ref.current;
      if (el) setGeo({ left: el.offsetLeft, w: el.offsetWidth, vw: window.innerWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pinned]);
  const drift = useTransform(x, (v) => {
    if (!pinned) return '0%';
    const center = geo.left + v + geo.w / 2;
    const off = (center - geo.vw / 2) / geo.vw;
    return `${Math.max(-1, Math.min(1, off)) * -7}%`;
  });

  const hang = HANG[i % HANG.length];
  return (
    <figure
      ref={ref}
      className={`sel__frame sel__frame--${hang.align}`}
      style={{ '--h': `${hang.h}vh`, '--r': p.ratio }}
    >
      <button className="sel__mount" onClick={() => onOpen(p)} data-cursor="View" aria-label={`Open ${p.title}`}>
        <m.div className="sel__drift" style={{ x: drift }}>
          <Develop
            name={p.id}
            alt={p.title}
            className="sel__img"
            sizes={`(max-width: 768px) 80vw, ${Math.round(hang.h * p.ratio)}vh`}
            widths={[480, 768, 1080, 1440]}
            q="auto:good"
          />
        </m.div>
      </button>
      <figcaption className="sel__cap">
        <span className="sel__num">{String(i + 1).padStart(2, '0')}</span>
        <span>
          <span className="sel__title">{p.title}</span>
          <span className="label">{p.place}, {p.year}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Selects({ openLightbox }) {
  const go = useGo();
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const narrow = useMedia(NARROW);
  const pinned = !narrow && !reduced;
  // Reduced motion on a wide screen: no pinning and no sideways-only rail for
  // a mouse to fight with, just the nine prints hung in rows.
  const wall = !narrow && reduced;
  const ref = useRef(null);
  const trackRef = useRef(null);
  const [dist, setDist] = useState(0);
  const [count, setCount] = useState(1);

  useLayoutEffect(() => {
    if (!pinned) { setDist(0); return undefined; }
    const measure = () => {
      const t = trackRef.current;
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (v) => (pinned ? -v * dist : 0));
  // The wall travels faster than the page scrolls (SPEED px across per px
  // down), so nine frames cost about three screens of scrolling, not six.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!pinned) return;
    setCount(Math.min(FRAMES.length, Math.max(1, Math.round(v * (FRAMES.length - 1)) + 1)));
  });

  /* Keyboard: the wall only travels with the page's scroll, so when focus
   * lands on a frame, scroll the page to the point where it sits mid-screen. */
  const onFocusWall = (e) => {
    const item = e.target.closest('.sel__frame, .sel__intro, .sel__outro');
    const section = ref.current;
    if (!item || !section || !dist) return;
    const v = Math.min(1, Math.max(0, (item.offsetLeft + item.offsetWidth / 2 - window.innerWidth / 2) / dist));
    const y = section.offsetTop + v * (section.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };

  const open = (p) => {
    const items = FRAMES.map((f) => ({ name: f.id, title: f.title, place: f.place, year: f.year }));
    openLightbox(items, FRAMES.indexOf(p));
  };

  // Keep the counter honest when the section is unpinned (mobile swipe).
  const railRef = useRef(null);
  useEffect(() => {
    if (pinned || wall || !railRef.current) return undefined;
    const el = railRef.current;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const v = max > 0 ? el.scrollLeft / max : 0;
      setCount(Math.min(FRAMES.length, Math.round(v * (FRAMES.length - 1)) + 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [pinned, wall]);

  return (
    <section
      id="work"
      className={`sel ${pinned ? 'sel--pinned' : ''} ${wall ? 'sel--wall' : ''}`}
      ref={ref}
      data-tone="night"
      style={pinned ? { height: `calc(100vh + ${Math.round(dist / SPEED)}px)` } : undefined}
      aria-label="Selected work"
    >
      <div className="sel__sticky">
        <div className="sel__rail" ref={railRef}>
          <m.div className="sel__track" ref={trackRef} style={{ x }} onFocusCapture={pinned ? onFocusWall : undefined}>
            <div className="sel__intro">
              <SplitWords as="h2" className="display t-3xl">Selected frames</SplitWords>
              <p className="lead">
                Nine photographs we keep coming back to, from haldi mornings to
                riverside evenings. Each one opens full size.
              </p>
            </div>

            {FRAMES.map((p, i) => (
              <Frame key={p.id} p={p} i={i} x={x} pinned={pinned} onOpen={open} />
            ))}

            <div className="sel__outro">
              <p className="caption">There are more where these came from.</p>
              <button className="btn" onClick={() => go('/gallery')}>
                <span className="roll"><span>See the whole gallery</span><span aria-hidden="true">See the whole gallery</span></span>
              </button>
            </div>
          </m.div>
        </div>

        {!wall && <div className="sel__bar wrap" aria-hidden="true">
          <span className="label">{String(count).padStart(2, '0')} of {String(FRAMES.length).padStart(2, '0')}</span>
          <span className="sel__line">
            <m.span style={{ scaleX: pinned ? scrollYProgress : count / FRAMES.length }} />
          </span>
          {!pinned && <span className="label">Swipe</span>}
        </div>}
      </div>
    </section>
  );
}
