import { STORIES } from '../data';

export default function Stories({ openStory }) {
  return (
    <section id="stories" className="section stories">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head__meta reveal">
            <div className="mono">Wedding stories · long-form</div>
            <h2 className="sec-head__title">
              From the <em>journal</em>.
            </h2>
          </div>
          <p className="sec-head__lead reveal" data-delay="1">
            A few weddings deserve more than a tile. Step inside three of our
            favourite stories — full galleries, short notes from the day,
            and the small details we don't usually share.
          </p>
        </div>

        <div className="stories-grid">
          {STORIES.map((s, i) => (
            <article key={s.id} className="story-card reveal" data-delay={i + 1} onClick={() => openStory(s)}>
              <div className="story-card__media">
                <img src={s.cover} alt={s.couple} loading="lazy" />
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
