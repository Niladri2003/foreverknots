import { useState, useRef } from 'react';
import { m, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useScrollSection } from '../hooks/useScrollSection';
import { useBodyLock } from '../hooks/useBodyLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import RingsMark from './RingsMark';
import CloudImage from './CloudImage';
import { EASE, EXPO, SILK } from '../utils/motion';
import { INFO } from '../data';
import { waLink } from '../utils/whatsapp';

/* Desktop shows the four places people actually go; the menu holds the rest.
 * Each menu entry carries a photograph that develops beside it on hover. */
const BAR = [
  { type: 'section', id: 'work', label: 'Work' },
  { type: 'section', id: 'stories', label: 'Journal' },
  { type: 'route', to: '/gallery', label: 'Gallery' },
  { type: 'section', id: 'about', label: 'Studio' },
];

const MENU = [
  { type: 'section', id: 'work', label: 'Selected work', photo: 'p06' },
  { type: 'section', id: 'day', label: 'The wedding day', photo: 'p14' },
  { type: 'section', id: 'stories', label: 'Journal', photo: '/photos/sudipta-shaheli-01.jpg' },
  { type: 'route', to: '/gallery', label: 'Gallery', photo: 'p01' },
  { type: 'section', id: 'about', label: 'The studio', photo: 'hero-courtyard' },
  { type: 'section', id: 'faq', label: 'Questions', photo: 'p17' },
  { type: 'section', id: 'contact', label: 'Write to us', photo: 'p13' },
];

const WA = "Hi foreverknots! We're planning our wedding and would love to talk about photography.";

function MenuOverlay({ go, onClose }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(0);
  useFocusTrap(ref, true);

  return (
    <m.div
      className="menu"
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.7, ease: SILK, delay: 0.1 } }}
      transition={{ duration: 0.9, ease: SILK }}
      data-lenis-prevent
    >
      <div className="menu__top">
        <span className="menu__brand"><RingsMark size={30} /> foreverknots</span>
        <button className="menu__close" onClick={onClose}>
          <span className="roll"><span>Close</span><span aria-hidden="true">Close</span></span>
        </button>
      </div>

      <div className="menu__body">
        <m.ol
          className="menu__list"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.35 } }, hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } } }}
        >
          {MENU.map((item, i) => (
            <li key={item.label} className="mask">
              <m.button
                variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1.1, ease: EXPO } } }}
                onClick={() => go(item)}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className={hover === i ? 'is-on' : ''}
              >
                {item.label}
              </m.button>
            </li>
          ))}
        </m.ol>

        <m.div
          className="menu__photo"
          initial={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: SILK, delay: 0.4 }}
          aria-hidden="true"
        >
          <AnimatePresence initial={false}>
            <m.div
              key={MENU[hover].photo}
              className="menu__photo-in"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.6, ease: EASE }, scale: { duration: 1.6, ease: EXPO } }}
            >
              <CloudImage name={MENU[hover].photo} alt="" sizes="30vw" widths={[480, 768, 1080]} fill ar="4:5" />
            </m.div>
          </AnimatePresence>
        </m.div>
      </div>

      <m.div
        className="menu__foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <a className="tlink" href={`mailto:${INFO.email}`}>{INFO.email}</a>
        <a className="tlink" href={waLink(INFO.phone, WA)} target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="tlink" href={INFO.instagram} target="_blank" rel="noreferrer">Instagram</a>
        <a className="tlink" href={INFO.facebook} target="_blank" rel="noreferrer">Facebook</a>
      </m.div>
    </m.div>
  );
}

export default function Nav({ onJump, onRoute, ready }) {
  const { scrolled, section } = useScrollSection();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const onHome = pathname === '/' || pathname.startsWith('/stories');

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y < 80 || y < prev - 4) setHidden(false);
    else if (y > prev + 4) setHidden(true);
  });

  useBodyLock(open);

  const go = (item) => {
    const fromMenu = open;
    setOpen(false);
    if (item.type === 'route') onRoute(item.to, fromMenu);
    /* While the menu is open, useBodyLock has Lenis stopped and scrollTo is a
     * silent no-op — wait for the unlock to release it before jumping. */
    else if (fromMenu) setTimeout(() => onJump(item.id), 120);
    else onJump(item.id);
  };

  const isActive = (item) =>
    item.type === 'route' ? pathname.startsWith(item.to) : onHome && section === item.id;

  return (
    <>
      <m.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        onFocusCapture={() => setHidden(false)}
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: ready ? 1 : 0,
          y: hidden && !open ? '-120%' : 0,
        }}
        transition={{ opacity: { duration: 1.2, delay: ready ? 0.6 : 0 }, y: { duration: 0.6, ease: EASE } }}
      >
        <button className="nav__brand" onClick={() => go({ type: 'section', id: 'home' })} aria-label="foreverknots, back to the top">
          <RingsMark size={30} />
          <span>foreverknots</span>
        </button>
        <nav className="nav__links" aria-label="Primary">
          {BAR.map((item) => (
            <button
              key={item.label}
              onClick={() => go(item)}
              className={`tlink ${isActive(item) ? 'tlink--on' : ''}`}
              aria-current={isActive(item) ? 'true' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="nav__right">
          <button className="btn nav__cta" onClick={() => go({ type: 'section', id: 'contact' })}>
            <span className="roll"><span>Write to us</span><span aria-hidden="true">Write to us</span></span>
          </button>
          <button className="nav__menu" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
            <span className="nav__menu-lines" aria-hidden="true"><i /><i /></span>
            <span className="nav__menu-word">Menu</span>
          </button>
        </div>
      </m.header>

      <AnimatePresence>
        {open && <MenuOverlay go={go} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
