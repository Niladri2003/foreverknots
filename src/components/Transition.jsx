import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import RingsMark from './RingsMark';
import { SILK } from '../utils/motion';

/* Page changes pass behind a garnet curtain: it rises over the page, the
 * route changes unseen, and it lifts off the top once the new page has
 * actually committed (not after a guessed number of frames: router navigations
 * are transitions and can land later). `go(to, state)` passes router state
 * through, e.g. { section: 'contact' } for the page to scroll to while covered. */
const Ctx = createContext(null);

export function useGo() {
  return useContext(Ctx);
}

const variants = {
  idle:   { clipPath: 'inset(100% 0% 0% 0%)', transition: { duration: 0 } },
  cover:  { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.75, ease: SILK } },
  reveal: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.9, ease: SILK, delay: 0.12 } },
};

export function TransitionProvider({ reduced, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState('idle');
  const pending = useRef(null);   // the latest requested { to, state }
  const awaiting = useRef(false); // navigated, waiting for the new location to commit
  const safety = useRef(0);

  const proceed = useCallback(() => {
    const next = pending.current;
    pending.current = null;
    if (!next) { setPhase('reveal'); return; }
    awaiting.current = true;
    navigate(next.to, { state: next.state });
    // never leave the curtain down if the location somehow doesn't change
    clearTimeout(safety.current);
    safety.current = setTimeout(() => {
      if (!awaiting.current) return;
      awaiting.current = false;
      setPhase('reveal');
    }, 1500);
  }, [navigate]);

  const go = useCallback(
    (to, state) => {
      if (reduced) { navigate(to, { state }); return; }
      // Latest request wins; if the curtain is already down or coming down,
      // it is simply picked up when the cover finishes (or after this commit).
      pending.current = { to, state };
      setPhase('cover');
    },
    [navigate, reduced],
  );

  // The new page has committed (its layout effects, including any section
  // scroll, have run): lift the curtain — unless a newer go() arrived meanwhile.
  useEffect(() => {
    if (!awaiting.current) return;
    awaiting.current = false;
    clearTimeout(safety.current);
    if (pending.current) { proceed(); return; }
    requestAnimationFrame(() => setPhase('reveal'));
  }, [location.key, proceed]);

  useEffect(() => () => clearTimeout(safety.current), []);

  const onDone = (def) => {
    if (def === 'cover') proceed();
    else if (def === 'reveal') setPhase('idle');
  };

  return (
    <Ctx.Provider value={go}>
      {children}
      <m.div
        className="curtain"
        variants={variants}
        initial="idle"
        animate={phase}
        onAnimationComplete={onDone}
        aria-hidden="true"
      >
        <m.div
          className="curtain__mark"
          animate={{ opacity: phase === 'cover' ? 1 : 0, y: phase === 'reveal' ? -40 : 0 }}
          transition={{ duration: 0.6, ease: SILK, delay: phase === 'cover' ? 0.3 : 0 }}
        >
          <RingsMark size={64} />
        </m.div>
      </m.div>
    </Ctx.Provider>
  );
}
