import { m } from 'motion/react';
import { useMarqueeDrift } from '../hooks/useMarqueeDrift';

const WORDS = [
  'Kolkata', 'Bhubaneswar', 'Ranchi', 'Varanasi', 'Kashmir',
  'Pre-Weddings', 'Bengali Weddings', 'Destinations', 'Heirloom Albums',
];

function Row({ ariaHidden }) {
  return (
    <span aria-hidden={ariaHidden || undefined}>
      {WORDS.map((w, i) => (
        <span key={i}>
          {w}
          {i < WORDS.length - 1 && <span className="marquee__dot" />}
        </span>
      ))}
    </span>
  );
}

export default function Marquee() {
  const transform = useMarqueeDrift(1.4);
  return (
    <div className="marquee">
      <m.div className="marquee__track" style={{ transform }}>
        <Row />
        <Row ariaHidden />
      </m.div>
    </div>
  );
}
