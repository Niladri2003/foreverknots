import { useState, useEffect, useRef } from 'react';
import {
  m, AnimatePresence, useScroll, useMotionTemplate, useInView, useReducedMotion,
} from 'motion/react';
import HeroStage from './HeroStage';
import SplitWords from './SplitWords';
import { HERO_SLIDES } from '../data';
import { useMedia, NARROW } from '../hooks/useMedia';
import { EXPO, useRange } from '../utils/motion';

const INTERVAL = 7200;

/* The hero is a short film in two acts.
 *  Act one: the photograph, full-bleed, dissolving slowly from frame to frame.
 *  Act two (on scroll): the photograph draws in to a framed print at the centre,
 *  a gilt hairline settles around it, and the name of the house appears either
 *  side, uncovered from behind the frame. The section is tall and the stage is
 *  sticky, so the scroll itself is the timeline. */
export default function Hero({ ready }) {
  const ref = useRef(null);
  const stickyRef = useRef(null);
  const reduced = useReducedMotion();
  const narrow = useMedia(NARROW);
  const inView = useInView(stickyRef, { amount: 0.02 });
  const [idx, setIdx] = useState(0);
  const playing = ready && inView && !reduced;

  useEffect(() => {
    if (!playing) return undefined;
    const t = setTimeout(() => {
      if (!document.hidden) setIdx((i) => (i + 1) % HERO_SLIDES.length);
    }, INTERVAL);
    return () => clearTimeout(t);
  }, [playing, idx]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const end = 0.78;
  const ix = useRange(p, [0, end], [0, narrow ? 8 : 31]);
  const iy = useRange(p, [0, end], [0, narrow ? 16 : 11]);
  const clip = useMotionTemplate`inset(${iy}% ${ix}% ${iy}% ${ix}%)`;
  const inner = useRange(p, [0, end], [1, 0.92]);
  const frameTop = useMotionTemplate`${iy}%`;
  const frameSide = useMotionTemplate`${ix}%`;
  const frameOpacity = useRange(p, [0.45, end], [0, 1]);

  const titleY = useRange(p, [0, 0.4], ['0vh', '-14vh']);
  const titleOpacity = useRange(p, [0, 0.3], [1, 0]);
  const chromeOpacity = useRange(p, [0, 0.18], [1, 0]);

  const wordOpacity = useRange(p, [0.2, 0.6], [0, 1]);
  const leftX = useRange(p, [0.1, end], narrow ? ['0vw', '0vw'] : ['14vw', '0vw']);
  const rightX = useRange(p, [0.1, end], narrow ? ['0vw', '0vw'] : ['-14vw', '0vw']);
  const topY = useRange(p, [0.1, end], narrow ? ['10vh', '0vh'] : ['0vh', '0vh']);
  const botY = useRange(p, [0.1, end], narrow ? ['-10vh', '0vh'] : ['0vh', '0vh']);
  const tagOpacity = useRange(p, [0.6, 0.9], [0, 1]);

  const slide = HERO_SLIDES[idx];

  return (
    <section id="home" className="hero" ref={ref} data-tone="garnet">
      <div className="hero__sticky" ref={stickyRef}>
        <m.div className="hero__name hero__name--l" style={{ opacity: wordOpacity, x: leftX, y: topY }} aria-hidden="true">
          forever
        </m.div>
        <m.div className="hero__name hero__name--r" style={{ opacity: wordOpacity, x: rightX, y: botY }} aria-hidden="true">
          knots
        </m.div>

        <m.div className="hero__stage" style={{ clipPath: clip }}>
          <m.div className="hero__slides" style={{ scale: inner }} aria-hidden="true">
            <HeroStage slides={HERO_SLIDES} index={idx} active={inView} />
          </m.div>
          <div className="hero__scrim" aria-hidden="true" />
        </m.div>

        <m.div
          className="hero__frame"
          style={{ top: frameTop, bottom: frameTop, left: frameSide, right: frameSide, opacity: frameOpacity }}
          aria-hidden="true"
        />

        <m.p className="hero__tag caption" style={{ opacity: tagOpacity }}>
          Tying knots since 2020
        </m.p>

        <div className="hero__content">
          <m.div className="hero__titlewrap" style={{ y: titleY, opacity: titleOpacity }}>
            <SplitWords as="h1" className="hero__title display" play={ready} delay={0.25} stagger={0.08}>
              For the knot<br />you tie once.
            </SplitWords>
            <m.p
              className="hero__sub"
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.4, ease: EXPO, delay: 1.05 }}
            >
              Wedding photography, based in Kolkata and travelling across India.
            </m.p>
          </m.div>

          <m.div className="hero__meta" style={{ opacity: chromeOpacity }}>
          <m.div
            className="hero__meta-in"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1.6, delay: 1.3 }}
          >
            <div className="hero__caption" aria-live="off">
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={slide.id}
                  className="caption"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.8, ease: EXPO }}
                >
                  {slide.alt}
                </m.span>
              </AnimatePresence>
            </div>
            <div className="hero__dial" aria-hidden="true">
              <span>{String(idx + 1).padStart(2, '0')}</span>
              <span className="hero__track">
                <m.span
                  className="hero__progress"
                  key={idx}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: playing ? 1 : 0 }}
                  transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                />
              </span>
              <span>{String(HERO_SLIDES.length).padStart(2, '0')}</span>
            </div>
          </m.div>
          </m.div>
        </div>

        <m.div className="hero__cue" style={{ opacity: chromeOpacity }} aria-hidden="true">
          <m.span
            className="hero__cue-line"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1.6, delay: 1.6 }}
          />
        </m.div>
      </div>
    </section>
  );
}
