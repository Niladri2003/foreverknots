import { useState, useEffect, useRef } from 'react';
import { m, useScroll, useTransform, useInView, useReducedMotion } from 'motion/react';
import HeroSlideshow from './HeroSlideshow';
import { HERO_SLIDES } from '../data';
import { maskLine, fadeUp, stagger } from '../utils/motion';

const INTERVAL = 5500;

export default function Hero({ ready }) {
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { amount: 0.15 });
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const playing = !reduced && inView && ready;

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      if (!document.hidden) setIdx((i) => (i + 1) % HERO_SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [playing]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yImg = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const yTitle = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const opTitle = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <m.div className="hero__slides" style={{ y: yImg }} aria-hidden="true">
        <HeroSlideshow slides={HERO_SLIDES} index={idx} interval={INTERVAL} />
      </m.div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />

      <m.div
        className="hero__top"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <div className="mono">foreverknots · est. 2020 · Kolkata</div>
        <div className="mono">№ 01 · A Wedding-Day Studio</div>
      </m.div>

      <m.div
        className="hero__stamp"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 1.1 }}
      >
        <span>
          tying knots since
          <em>2020</em>
        </span>
      </m.div>

      <div className="hero__content">
        <m.div
          style={{ y: yTitle, opacity: opTitle }}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          variants={stagger(0.14, 0.1)}
        >
          <h1 className="hero__title">
            <span className="mask"><m.span variants={maskLine}>Love, kept</m.span></span>
            <span className="mask"><m.span variants={maskLine}>in <em>light</em>.</m.span></span>
          </h1>
          {/* <m.p className="hero__sub" variants={fadeUp}>
            A small wedding-photography studio out of Kolkata. We photograph the
            quiet half-second between things: the look just before the vow,
            the laugh in the middle of the haldi, the moment your grandmother
            holds your face.
          </m.p> */}
        </m.div>

        <m.div
          className="hero__bottom"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          <div className="hero__meta">
            <div>
              Based in
              <strong>Kolkata, India</strong>
            </div>
            {/* <div>
              Travelling to
              <strong>Bhubaneswar · Ranchi · Varanasi · Kashmir</strong>
            </div> */}
            <div>
              Now booking
              <strong>2026 / 2027</strong>
            </div>
          </div>
          <div className="hero__dial">
            <div className="hero__count">
              {String(idx + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
            </div>
            <div className="hero__track">
              <m.div
                className="hero__progress"
                key={idx}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: playing ? 1 : 0 }}
                transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
              />
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
