import { useEffect, useRef } from 'react';

// Cloudflare Turnstile widget (explicit render, so it survives SPA mounts/
// remounts). The site key is PUBLIC — safe to ship in the client. The secret
// lives only in the backend env (TURNSTILE_SECRET) and is never referenced here.
const SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY || '0x4AAAAAAD9QR5Yoqv8BUbiX';
const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

/**
 * Renders the Turnstile widget and reports its token via onToken (called with
 * '' when the token expires/errors). Remount with a changing `key` to reset.
 */
export default function Turnstile({ onToken }) {
  const ref = useRef(null);
  const idRef = useRef(null);
  const cbRef = useRef(onToken);
  cbRef.current = onToken;

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        // Explicit render — call directly once api.js has loaded (no ready()).
        if (cancelled || idRef.current !== null || !window.turnstile || !ref.current) return;
        idRef.current = window.turnstile.render(ref.current, {
          sitekey: SITEKEY,
          action: 'turnstile-spin-v2',
          callback: (t) => cbRef.current(t),
          'expired-callback': () => cbRef.current(''),
          'timeout-callback': () => cbRef.current(''),
          'error-callback': () => cbRef.current(''),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (idRef.current !== null && window.turnstile) {
        try { window.turnstile.remove(idRef.current); } catch { /* already gone */ }
      }
      idRef.current = null;
    };
  }, []);

  // The telemetry marker (data-action) rides on the cf-turnstile div per the
  // Spin integration; the action is also passed to render() above.
  return (
    <div
      ref={ref}
      className="cf-turnstile"
      data-sitekey={SITEKEY}
      data-action="turnstile-spin-v2"
    />
  );
}
