import { useEffect } from 'react';

/* The page changes colour as you move through it. Every section declares a
 * data-tone (garnet / night / pearl); whichever one crosses the middle of the
 * viewport sets <html data-tone>, and the registered colour tokens in
 * tokens.css cross-fade. Text and background move together, so no section is
 * ever left with dark type on a dark ground mid-transition.
 *
 * Sections mount late (lazy routes, Suspense), so a MutationObserver re-scans. */
export function useTone() {
  useEffect(() => {
    const root = document.documentElement;
    const host = document.getElementById('root');
    let io;
    let raf = 0;

    const scan = () => {
      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) root.dataset.tone = e.target.dataset.tone;
          }
        },
        { rootMargin: '-49% 0px -50% 0px', threshold: 0 },
      );
      host.querySelectorAll('[data-tone]').forEach((el) => io.observe(el));
    };

    scan();
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(host, { childList: true, subtree: true });

    return () => {
      io?.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
}
