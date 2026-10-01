import { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { DAY } from '../data';
import Develop from './Develop';
import SplitWords from './SplitWords';
import { useMedia, NARROW } from '../hooks/useMedia';
import { EXPO, useRange } from '../utils/motion';

/* "A wedding day, as we follow it." Six chapters, one scroll.
 * The sky behind the section moves through the day (turmeric morning, amber
 * afternoon, garnet evening, the deep blue after midnight), a small sun climbs
 * an arc and sets into a moon, and the chapter text changes as each photograph
 * reaches the middle of the screen. */

const N = DAY.length;

/* The day's sky as a hairline arc. The sun rises on the left with the haldi
 * and sets on the right at the vows; then a new moon rises for the night
 * chapters and is high by the reception. */
function SkyArc({ progress }) {
  const sunA = useRange(progress, [0.06, 0.6], [Math.PI, 0]);
  const moonA = useRange(progress, [0.6, 0.98], [Math.PI, Math.PI * 0.42]);
  const sunX = useTransform(sunA, (a) => 100 + 86 * Math.cos(a));
  const sunY = useTransform(sunA, (a) => 96 - 86 * Math.sin(a));
  const moonX = useTransform(moonA, (a) => 100 + 86 * Math.cos(a));
  const moonY = useTransform(moonA, (a) => 96 - 86 * Math.sin(a));
  const sunO = useRange(progress, [0.56, 0.61], [1, 0]);
  const moonO = useRange(progress, [0.6, 0.66], [0, 1]);
  return (
    <svg className="day__arc" viewBox="0 0 200 104" aria-hidden="true">
      <path d="M14 96 A86 86 0 0 1 186 96" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 3.5" />
      <line x1="0" y1="96.3" x2="200" y2="96.3" stroke="currentColor" strokeWidth="0.6" />
      <m.circle cx={sunX} cy={sunY} r="5.5" fill="currentColor" style={{ opacity: sunO }} />
      <m.g style={{ opacity: moonO, x: moonX, y: moonY }}>
        <path d="M2.2 -5.1 A5.6 5.6 0 1 0 2.2 5.1 A4.4 4.4 0 1 1 2.2 -5.1 Z" fill="currentColor" />
      </m.g>
    </svg>
  );
}

function Chapter({ beat, i }) {
  return (
    <div className="day__chapter">
      <div className="day__when">
        <span className="day__idx">{String(i + 1).padStart(2, '0')}</span>
        <span>{beat.when}</span>
      </div>
      <h3 className="day__name display">{beat.name}</h3>
      <p className="day__text">{beat.text}</p>
    </div>
  );
}

export default function WeddingDay() {
  const ref = useRef(null);
  const narrow = useMedia(NARROW);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const figs = useRef([]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // The sky starts in the night of the section before and warms into the
  // first morning as the heading passes, then moves through the chapters.
  const stops = [0, ...DAY.map((_, i) => 0.1 + (i / (N - 1)) * 0.82)];
  const sky = useRange(scrollYProgress, stops, ['#130B0A', ...DAY.map((d) => d.sky)]);
  const glowY = useRange(scrollYProgress, [0, 1], ['10%', '90%']);

  // whichever photograph holds the middle of the screen sets the chapter
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    figs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [narrow]);

  const beat = DAY[active];

  return (
    <section id="day" className="day" ref={ref} data-tone="night" aria-labelledby="day-title">
      <m.div className="day__sky" style={{ backgroundColor: sky }} aria-hidden="true">
        <m.div className="day__glow" style={{ top: glowY }} />
      </m.div>

      <header className="day__head wrap">
        <SplitWords as="h2" id="day-title" className="display t-3xl">
          A wedding day, as we follow it
        </SplitWords>
        <p className="lead">
          The muhurat moves the clock at every wedding, so no two days run the
          same. This is the shape most of them take, and the moments we never miss.
        </p>
      </header>

      <div className="day__grid wrap">
        <div className="day__panel">
          <SkyArc progress={scrollYProgress} />
          {!narrow && (
            <div className="day__stack" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={beat.id}
                  initial={reduced ? false : { opacity: 0, y: 26, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={reduced ? undefined : { opacity: 0, y: -18, filter: 'blur(6px)' }}
                  transition={{ duration: 0.8, ease: EXPO }}
                >
                  <Chapter beat={beat} i={active} />
                </m.div>
              </AnimatePresence>
              <ol className="day__ticks" aria-hidden="true">
                {DAY.map((d, i) => (
                  <li key={d.id} className={i === active ? 'is-on' : i < active ? 'is-past' : ''} />
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="day__photos">
          {DAY.map((d, i) => (
            <figure
              key={d.id}
              className={`day__fig day__fig--${i % 2 ? 'r' : 'l'}`}
              data-i={i}
              ref={(el) => { figs.current[i] = el; }}
            >
              {narrow && <Chapter beat={d} i={i} />}
              <Develop
                name={d.photo}
                alt={d.alt}
                className="day__img"
                sizes="(max-width: 768px) 90vw, 40vw"
                widths={[480, 768, 1080, 1440]}
                q="auto:good"
                fill={!d.photo.startsWith('/')}
                ar="4:5"
                amount={0.2}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
