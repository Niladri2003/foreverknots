import { useEffect } from 'react';

export function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '-6% 0px -6% 0px', threshold: 0.05 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
