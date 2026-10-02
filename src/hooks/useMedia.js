import { useState, useEffect } from 'react';

/* Live matchMedia boolean. Reads synchronously on first render so layouts that
 * branch on it (pinned vs. swipe) never flash the wrong variant. */
export function useMedia(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export const NARROW = '(max-width: 768px)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';
