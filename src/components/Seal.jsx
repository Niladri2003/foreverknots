import { useId, useMemo } from 'react';
import { m } from 'motion/react';
import { EXPO } from '../utils/motion';

/* An engraved seal, drawn procedurally: an outer band of italic lettering
 * between hairlines, a ring of scallops, a lotus of sixteen petals, eight inner
 * leaves and the rings mark at the centre. On first view every line is drawn
 * like an engraver's burin, outside in; afterwards it turns very slowly.
 * Everything is currentColor, so it takes the tone's gold. */

const P = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
const f = (n) => n.toFixed(2);

function petal(r1, r2, a, width) {
  const [x1, y1] = P(r1, a);
  const [x2, y2] = P(r2, a);
  const rm = r1 + (r2 - r1) * 0.55;
  const [cx1, cy1] = P(rm, a - width);
  const [cx2, cy2] = P(rm, a + width);
  return `M${f(x1)} ${f(y1)} Q${f(cx1)} ${f(cy1)} ${f(x2)} ${f(y2)} Q${f(cx2)} ${f(cy2)} ${f(x1)} ${f(y1)}`;
}

function scallops(r, n, depth) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a1 = (i / n) * Math.PI * 2;
    const a2 = ((i + 1) / n) * Math.PI * 2;
    const am = (a1 + a2) / 2;
    const [x1, y1] = P(r, a1);
    const [x2, y2] = P(r, a2);
    const [cx, cy] = P(r + depth, am);
    d += `${i === 0 ? `M${f(x1)} ${f(y1)}` : ''} Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`;
  }
  return d;
}

const circle = (r) => `M${r} 0 A${r} ${r} 0 1 1 ${-r} 0 A${r} ${r} 0 1 1 ${r} 0`;

const WORDS = ['foreverknots', 'tying knots since 2020', 'weddings across india'];

export default function Seal({ size = 260, className, spin = true }) {
  const id = useId().replace(/:/g, '');

  const g = useMemo(() => {
    const outer = [circle(96), circle(93.5), circle(76)];
    const lotus = Array.from({ length: 16 }, (_, i) => petal(44, 70, (i / 16) * Math.PI * 2 - Math.PI / 2, 0.16));
    const leaves = Array.from({ length: 8 }, (_, i) => petal(22, 40, (i / 8) * Math.PI * 2 - Math.PI / 2 + Math.PI / 8, 0.28));
    const dots = Array.from({ length: 48 }, (_, i) => P(73, (i / 48) * Math.PI * 2));
    const stones = WORDS.map((_, i) => P(84.5, (i / WORDS.length) * Math.PI * 2 - Math.PI / 2 - 0.2));
    return { outer, scallop: scallops(70.5, 32, 4), lotus, leaves, dots, stones };
  }, []);

  const draw = (delay, duration = 2.4) => ({
    variants: {
      hidden: { pathLength: 0, opacity: 0 },
      show: {
        pathLength: 1,
        opacity: 1,
        transition: { pathLength: { duration, ease: EXPO, delay }, opacity: { duration: 0.01, delay } },
      },
    },
  });

  return (
    <m.svg
      className={`seal ${spin ? 'seal--spin' : ''} ${className || ''}`}
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <defs>
        <path id={`band-${id}`} d="M0 -84.5 A84.5 84.5 0 1 1 -0.01 -84.5" />
      </defs>
      <g className="seal__turn">
        {g.outer.map((d, i) => <m.path key={`o${i}`} d={d} {...draw(i * 0.12)} />)}
        <m.text
          className="seal__text"
          fill="currentColor"
          stroke="none"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1.6, delay: 0.6 } } }}
        >
          {WORDS.map((w, i) => (
            <textPath key={w} href={`#band-${id}`} startOffset={`${(i / WORDS.length) * 100 + 1.5}%`}>
              {w}
            </textPath>
          ))}
        </m.text>
        {g.stones.map(([x, y], i) => (
          <m.path
            key={`s${i}`}
            d={`M${f(x)} ${f(y - 2.2)} l2 2.2 -2 2.2 -2 -2.2 z`}
            fill="currentColor"
            stroke="none"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1, delay: 1 } } }}
          />
        ))}
        <m.path d={g.scallop} {...draw(0.35, 3)} />
        {g.dots.map(([x, y], i) => (
          <m.circle
            key={`d${i}`}
            cx={f(x)}
            cy={f(y)}
            r="0.7"
            fill="currentColor"
            stroke="none"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 0.8 + i * 0.012 } } }}
          />
        ))}
        {g.lotus.map((d, i) => <m.path key={`l${i}`} d={d} {...draw(0.55 + i * 0.05, 2)} />)}
        <m.path d={circle(44)} {...draw(0.9)} />
        {g.leaves.map((d, i) => <m.path key={`v${i}`} d={d} {...draw(1.1 + i * 0.06, 1.8)} />)}
        <m.path d={circle(20)} {...draw(1.3)} />
      </g>
      {/* the rings at the centre stay upright while the seal turns */}
      <g transform="translate(-12.5 -9.2) scale(0.5)" strokeWidth="1.3">
        <m.path d="M19 9 a11 11 0 1 1 -0.001 0" {...draw(1.5, 2)} />
        <m.path d="M31 9 a11 11 0 1 1 -0.001 0" {...draw(1.65, 2)} />
      </g>
    </m.svg>
  );
}
