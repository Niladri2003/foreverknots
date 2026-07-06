import { useState } from 'react';
import { m } from 'motion/react';
import { INSTA_PHOTOS, INFO } from '../data';
import CloudImage from './CloudImage';
import Reveal from './Reveal';
import { useMarqueeDrift } from '../hooks/useMarqueeDrift';

function Tiles({ ariaHidden }) {
  return INSTA_PHOTOS.map((name, i) => (
    <a
      key={`${name}-${ariaHidden ? 'b' : 'a'}`}
      className="insta__tile"
      href={INFO.instagram}
      target="_blank"
      rel="noreferrer"
      aria-hidden={ariaHidden || undefined}
      tabIndex={ariaHidden ? -1 : undefined}
      aria-label={ariaHidden ? undefined : `Open Instagram ${INFO.instagramHandle}`}
    >
      <CloudImage name={name} alt="" sizes="220px" widths={[240, 480]} fill ar="1:1" />
    </a>
  ));
}

export default function InstaStrip() {
  const [paused, setPaused] = useState(false);
  const transform = useMarqueeDrift(0.9, paused);

  return (
    <section className="insta">
      <Reveal className="insta__head">
        <h2 className="insta__title">
          From <em>the feed</em>
        </h2>
        <a className="insta__handle" href={INFO.instagram} target="_blank" rel="noreferrer">
          {INFO.instagramHandle} ↗
        </a>
      </Reveal>
      <div
        className="insta__rail"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <m.div className="insta__track" style={{ transform }}>
          <Tiles />
          <Tiles ariaHidden />
        </m.div>
      </div>
    </section>
  );
}
