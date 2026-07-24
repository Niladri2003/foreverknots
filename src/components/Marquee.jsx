import { m } from 'motion/react';
import { useMarqueeDrift } from '../hooks/useMarqueeDrift';

const WORDS = [
  'Kolkata', 'Bhubaneswar', 'Ranchi', 'Varanasi', 'Kashmir',
  'Pre-Weddings', 'Bengali Weddings', 'Destinations', 'Heirloom Albums',
];

/* Each place is tied into one running thread: a gold hairline knotted
 * between names, echoing the .thread signature. The tie follows every word
 * (not all but the last) so the loop seam is knotted like any other join. */
function Row({ ariaHidden }) {
  return (
    <span className="marquee__row" aria-hidden={ariaHidden || undefined}>
      {WORDS.map((w, i) => (
        <span className="marquee__item" key={i}>
          <span className="marquee__word">{w}</span>
          <span className="marquee__tie" aria-hidden="true">
            <i className="marquee__knot" />
          </span>
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
