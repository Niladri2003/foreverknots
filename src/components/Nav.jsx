import { useState, useRef } from 'react';
import { m, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { useScrollSection } from '../hooks/useScrollSection';
import { useBodyLock } from '../hooks/useBodyLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { EASE, LUXE } from '../utils/motion';
import { INFO } from '../data';
import { waLink } from '../utils/whatsapp';

const NAV_ITEMS = [
  ['work', 'Work'],
  ['stories', 'Stories'],
  ['packages', 'Investment'],
  ['about', 'Story'],
  ['voices', 'Voices'],
  ['contact', 'Contact'],
];

/* Separate component so AnimatePresence's direct child carries no ref —
 * motion reads the child's ref prop internally, which React 18 warns on. */
function MobileOverlay({ jump, onClose }) {
  const ref = useRef(null);
  useFocusTrap(ref, true);

  return (
    <m.div
      className="mnav"
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.6, ease: LUXE }}
    >
      <button className="mnav__close" onClick={onClose}>Close ×</button>
      <m.div
        className="mnav__list"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
      >
        {NAV_ITEMS.map(([id, label], i) => (
          <div className="mask" key={id}>
            <m.button
              variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.7, ease: LUXE } } }}
              onClick={() => jump(id)}
            >
              <span className="idx">0{i + 1}</span>
              {label}
            </m.button>
          </div>
        ))}
        <div className="mask">
          <m.button
            variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.7, ease: LUXE } } }}
            onClick={() => jump('contact')}
          >
            <em>Inquire →</em>
          </m.button>
        </div>
      </m.div>
      <m.div
        className="mnav__foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <a href={`mailto:${INFO.email}`}>{INFO.email}</a>
        <a href={waLink(INFO.phone, "Hi foreverknots! We're planning our wedding and would love to talk about photography.")} target="_blank" rel="noreferrer">WhatsApp</a>
        <a href={INFO.instagram} target="_blank" rel="noreferrer">{INFO.instagramHandle}</a>
      </m.div>
    </m.div>
  );
}

export default function Nav({ onJump }) {
  const { scrolled, section } = useScrollSection();
  const [mobile, setMobile] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y < 80 || y < prev - 2) setHidden(false);
    else if (y > prev + 2) setHidden(true);
  });

  useBodyLock(mobile);
  const jump = (id) => { onJump(id); setMobile(false); };

  return (
    <>
      <m.nav
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        animate={hidden && !mobile ? 'hidden' : 'shown'}
        variants={{ shown: { y: 0 }, hidden: { y: '-110%' } }}
        transition={{ duration: 0.45, ease: EASE }}
        initial={false}
      >
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
        <button className="nav__menubtn" onClick={() => setMobile(true)} aria-label="Open menu">
          <span className="bars" />
          Menu
        </button>
      </m.nav>

      <AnimatePresence>
        {mobile && <MobileOverlay jump={jump} onClose={() => setMobile(false)} />}
      </AnimatePresence>
    </>
  );
}
