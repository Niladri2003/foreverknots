import { useRef, useMemo } from 'react';
import { m, useScroll, useReducedMotion } from 'motion/react';
import CloudImage from './CloudImage';
import RingsMark from './RingsMark';
import { MANIFESTO } from '../data';
import { useRange } from '../utils/motion';

/* The founder's sentence, set large, lit one word at a time as it passes
 * through the screen, the way a print comes up under the safelight. Three
 * small photographs are set into the line itself and open as they are reached. */

function Word({ progress, range, children }) {
  const opacity = useRange(progress, range, [0.16, 1]);
  return <m.span className="mf__w" style={{ opacity }}>{children}</m.span>;
}

function Pill({ progress, range, name }) {
  const width = useRange(progress, range, ['0em', '1.9em']);
  const opacity = useRange(progress, range, [0, 1]);
  return (
    <m.span className="mf__pill" style={{ width, opacity }} aria-hidden="true">
      <CloudImage name={name} alt="" sizes="160px" widths={[160, 320]} fill ar="2:1" />
    </m.span>
  );
}

export default function Manifesto() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.48'] });

  const tokens = useMemo(() => MANIFESTO.text.split(' ').filter(Boolean), []);
  const n = tokens.length;

  return (
    <section className="manifesto section" data-tone="garnet" aria-label="How we work">
      <div className="wrap">
        <p className="mf display" ref={ref}>
          {tokens.map((tok, i) => {
            const a = i / n;
            const range = [a * 0.92, a * 0.92 + 0.1];
            const pill = tok.match(/^\[(.+)\]$/);
            if (pill) {
              return reduced ? null : <Pill key={i} progress={scrollYProgress} range={range} name={pill[1]} />;
            }
            return (
              <span key={i}>
                {reduced ? <span className="mf__w">{tok}</span> : <Word progress={scrollYProgress} range={range}>{tok}</Word>}{' '}
              </span>
            );
          })}
        </p>
        <div className="mf__by">
          <RingsMark size={34} />
          <div>
            <div className="mf__name">{MANIFESTO.by}</div>
            <div className="label">{MANIFESTO.role}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
