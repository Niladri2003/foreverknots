import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

/* Counted so stacked overlays (lightbox above story modal) don't
 * unlock the page when the top one closes. */
let locks = 0;

export function useBodyLock(locked) {
  const lenis = useLenis();
  useEffect(() => {
    if (!locked) return;
    locks += 1;
    if (locks === 1) {
      document.body.classList.add('lock');
      lenis?.stop();
    }
    return () => {
      locks -= 1;
      if (locks === 0) {
        document.body.classList.remove('lock');
        lenis?.start();
      }
    };
  }, [locked, lenis]);
}
