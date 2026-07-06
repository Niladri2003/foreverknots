import { PACKAGES, PACKAGES_NOTE, INFO } from '../data';
import Reveal from './Reveal';
import { waLink } from '../utils/whatsapp';

export default function Packages({ onJump }) {
  return (
    <section id="packages" className="section packages">
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="sec-head__meta">
            <div className="mono">The investment · booking 2026 / 27</div>
            <h2 className="sec-head__title">
              Three ways to <em>keep the day</em>
            </h2>
          </Reveal>
          <Reveal as="p" className="sec-head__lead" delay={0.1}>
            Every package includes our full editing pass, a private online
            gallery, and the two of us arriving early and staying late. Tell
            us the shape of your days and we'll send an exact quote.
          </Reveal>
        </div>

        <div className="pkg-grid">
          {PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.id} className={`pkg ${pkg.featured ? 'pkg--featured' : ''}`} delay={i * 0.1}>
              {pkg.tag && <div className="pkg__tag">{pkg.tag}</div>}
              <h3 className="pkg__name">{pkg.name}</h3>
              <p className="pkg__blurb">{pkg.blurb}</p>
              <ul className="pkg__features">
                {pkg.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <div className="pkg__ctas">
                <button className="btn" onClick={() => onJump('contact')}>
                  Enquire <span className="ar">→</span>
                </button>
                <a
                  className="btn btn--ghost"
                  href={waLink(INFO.phone, `Hi foreverknots! We'd love to know more about ${pkg.name} package for our wedding.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp us
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className="pkg-note" delay={0.2}>{PACKAGES_NOTE}</Reveal>
      </div>
    </section>
  );
}
