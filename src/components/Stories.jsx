import { STORIES } from '../data';
import CloudImage from './CloudImage';
import Reveal from './Reveal';

export default function Stories({ openStory }) {
  return (
    <section id="stories" className="section stories">
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="sec-head__meta">
            <div className="mono">Wedding stories · long-form</div>
            <h2 className="sec-head__title">
              From the <em>journal</em>.
            </h2>
          </Reveal>
          <Reveal as="p" className="sec-head__lead" delay={0.1}>
            A few weddings deserve more than a tile. Step inside three of our
            favourite stories — full galleries, short notes from the day,
            and the small details we don't usually share.
          </Reveal>
        </div>

        <div className="stories-grid">
          {STORIES.map((s, i) => (
            <Reveal
              as="article"
              key={s.id}
              className="story-card"
              delay={i * 0.1}
              onClick={() => openStory(s)}
            >
              <div className="story-card__media">
                <CloudImage
                  name={s.cover}
                  alt={s.couple}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  fill
                  ar="4:5"
                />
              </div>
              <div className="story-card__meta">
                <span>{s.type}</span>
                <span>{s.when}</span>
              </div>
              <h3 className="story-card__title">
                <em>{s.couple.split(' & ')[0]}</em> & {s.couple.split(' & ')[1]}
              </h3>
              <div className="mono" style={{ marginBottom: 12 }}>{s.place}</div>
              <p className="story-card__excerpt">{s.excerpt}</p>
              <div className="story-card__cta">
                Read the story <span className="ar">→</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
