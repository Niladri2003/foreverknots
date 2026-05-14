import { useState } from 'react';
import { useScrollSection } from '../hooks/useScrollSection';

const NAV_ITEMS = [
  ['work', 'Work'],
  ['stories', 'Stories'],
  ['about', 'Story'],
  ['voices', 'Voices'],
  ['contact', 'Contact'],
];

export default function Nav({ onJump }) {
  const { scrolled, section } = useScrollSection();
  const [mobile, setMobile] = useState(false);
  const jump = (id) => { onJump(id); setMobile(false); };

  return (
    <>
      <nav className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav__brand" onClick={() => jump('home')}>
          forever<em>knots</em>
        </div>
        <div className="nav__links">
          {NAV_ITEMS.map(([id, label]) => (
            <button key={id} onClick={() => jump(id)} className={section === id ? 'active' : ''}>
              {label}
            </button>
          ))}
        </div>
        <button className="nav__cta" onClick={() => jump('contact')}>
          <span>Inquire</span> <span aria-hidden="true">→</span>
        </button>
        <button className="nav__menubtn" onClick={() => setMobile(true)}>
          <span className="bars" />
          Menu
        </button>
      </nav>
      <div className={`mnav ${mobile ? 'open' : ''}`}>
        <button className="mnav__close" onClick={() => setMobile(false)}>Close ×</button>
        <div className="mnav__list">
          {NAV_ITEMS.map(([id, label]) => (
            <button key={id} onClick={() => jump(id)}>{label}</button>
          ))}
          <button onClick={() => jump('contact')}>
            <em className="italic" style={{ color: 'var(--accent)' }}>Inquire →</em>
          </button>
        </div>
      </div>
    </>
  );
}
