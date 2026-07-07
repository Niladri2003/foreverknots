import { useState, useEffect, useRef } from 'react';
import { m, animate, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import CloudImage from './CloudImage';
import Reveal from './Reveal';
import { LUXE } from '../utils/motion';

function Num({ value, children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setN(value); return; }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: LUXE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  return (
    <div className="num" ref={ref}>
      {n}
      {children}
    </div>
  );
}

export default function About() {
  const mediaRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '0%']);

  return (
    <section id="about" className="section">
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="sec-head__meta">
            <div className="mono">On the photographer</div>
            <h2 className="sec-head__title">
              Hello — we're a <em>small studio</em><br />out of Kolkata.
            </h2>
          </Reveal>
          <Reveal as="p" className="sec-head__lead" delay={0.1}>
            foreverknots is a five-year-old wedding photography practice. We work
            in pairs — one camera close in, one stepped back — and we believe
            the best wedding photographs are the ones nobody noticed being taken.
          </Reveal>
        </div>

        <div className="about-grid">
          <Reveal className="about__media" delay={0.1} ref={mediaRef}>
            <m.div style={{ y }}>
              <CloudImage
                name="p25"
                alt="The photographer at work"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </m.div>
          </Reveal>
          <Reveal className="about__body" delay={0.2}>
            <p>
              We started in 2020, the year nobody got married. The weddings we
              did photograph that year were small — five guests, two photographers,
              a quiet ceremony in a sitting room. We learned to work without an
              audience. We never quite stopped.
            </p>
            <p>
              Today we photograph across Bengal and well beyond — Bhubaneswar,
              Ranchi, Varanasi, Kashmir — for couples who want something more
              honest than a posed reel. Our work is documentary first, with a
              few deliberate portraits when the light is generous. We shoot on
              digital, finish in a slow, film-leaning palette, and deliver an
              heirloom album you'll pass on, not a Google Drive link you'll lose.
            </p>
            <p>
              Above everything, we believe a wedding day is not a performance.
              It's a long, slightly chaotic, deeply specific Tuesday. We are
              here to remember it for you.
            </p>
            <div className="about__sig">— the foreverknots studio</div>

            <div className="about__stats">
              <div className="about__stat">
                <Num value={80}><em>+</em></Num>
                <div className="label">Weddings photographed</div>
              </div>
              <div className="about__stat">
                <Num value={12} />
                <div className="label">Cities, five states</div>
              </div>
              <div className="about__stat">
                <Num value={5}><em> yrs</em></Num>
                <div className="label">Quietly in practice</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
