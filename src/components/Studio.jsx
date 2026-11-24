import { useState, useEffect, useRef } from 'react';
import { m, animate, useInView, useReducedMotion, useScroll } from 'motion/react';
import Develop from './Develop';
import SplitWords from './SplitWords';
import Reveal from './Reveal';
import { INFO } from '../data';
import { EXPO, useRange } from '../utils/motion';

/* A number that counts up once, inline, as part of a sentence. */
function Count({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 1 });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? to : 0);
  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) { setN(to); return undefined; }
    const c = animate(0, to, { duration: 2.2, ease: EXPO, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduced]);
  return <span className="count" ref={ref}>{n}</span>;
}

export default function Studio() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yBig = useRange(scrollYProgress, [0, 1], ['6%', '-6%']);
  const ySmall = useRange(scrollYProgress, [0, 1], ['22%', '-26%']);

  return (
    <section id="about" className="studio section" data-tone="garnet" ref={ref} aria-labelledby="studio-title">
      <div className="wrap studio__grid">
        <div className="studio__media">
          <m.div className="studio__big" style={{ y: yBig }}>
            <Develop
              name="hero-courtyard"
              alt="A couple framed by the arch of a heritage mansion's courtyard"
              sizes="(max-width: 768px) 92vw, 46vw"
              widths={[768, 1080, 1440, 1920]}
              fill
              ar="4:5"
            />
          </m.div>
          <m.div className="studio__small" style={{ y: ySmall }}>
            <Develop
              name="p23"
              alt="A couple on the cast-iron stairwell of an old house"
              sizes="(max-width: 768px) 50vw, 20vw"
              widths={[480, 768, 1080]}
              fill
              ar="1:1"
              delay={0.3}
            />
          </m.div>
        </div>

        <div className="studio__body">
          <SplitWords as="h2" id="studio-title" className="display t-3xl">
            A small studio, by design.
          </SplitWords>
          <Reveal className="studio__copy" delay={0.1}>
            <p className="studio__lede">
              We take no more than two weddings a week, and we come in pairs:
              one camera close in, one stepped back.
            </p>
            <p>
              We started in 2020, the year nobody got married. The weddings we
              did photograph were small: five guests, two photographers, a quiet
              ceremony in a sitting room. We learned to work without an
              audience, and we never quite stopped.
            </p>
            <p>
              Today we photograph weddings across India, for couples who want
              something more honest than a posed reel. The work is documentary
              first, with a few deliberate portraits when the light is generous.
              We finish in a slow, film-leaning palette and deliver an heirloom
              album you will pass on, not a link you will lose.
            </p>
            <p className="studio__tally">
              Since 2020: <Count to={INFO.weddingsDone} /> weddings,{' '}
              <Count to={INFO.cities} /> cities, and every album designed in our studio.
            </p>
            <p className="studio__sign">
              <span className="studio__sig display it">Arnab Maity</span>
              <span className="label">Founder and lead photographer</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
