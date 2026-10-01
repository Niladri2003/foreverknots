import { useState } from 'react';
import { m } from 'motion/react';
import { INSTA_PHOTOS, INFO } from '../data';
import CloudImage from './CloudImage';
import { useMarqueeDrift } from '../hooks/useMarqueeDrift';

function Tiles({ copy }) {
  return INSTA_PHOTOS.map((name, i) => (
    <a
      key={`${name}-${copy}`}
      className={`feed__tile feed__tile--${i % 3}`}
      href={INFO.instagram}
      target="_blank"
      rel="noreferrer"
      // Every tile goes to the same profile, which the handle above already
      // links: keep the drifting tiles out of the tab order and the a11y tree.
      aria-hidden="true"
      tabIndex={-1}
      data-cursor="Open"
    >
      <CloudImage name={name} alt="" sizes="260px" widths={[280, 560]} fill ar="4:5" />
    </a>
  ));
}

/* A slow drifting row of recent frames, quickened a little by scrolling and
 * held still while you look. */
export default function Feed() {
  const [paused, setPaused] = useState(false);
  const transform = useMarqueeDrift(0.7, paused);

  return (
    <section className="feed" data-tone="pearl" aria-label="Instagram">
      <div className="feed__head wrap">
        <p className="caption">More, every week, on Instagram</p>
        <a className="feed__handle display tlink" href={INFO.instagram} target="_blank" rel="noreferrer">
          {INFO.instagramHandle}
        </a>
      </div>
      <div
        className="feed__rail"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <m.div className="feed__track" style={{ transform }}>
          <Tiles copy={0} />
          <Tiles copy={1} />
        </m.div>
      </div>
    </section>
  );
}
