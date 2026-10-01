import { useEffect, useRef, useState, useCallback } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import CloudImage from './CloudImage';
import { cld } from '../utils/cloudinary';
import { createHeroRenderer } from '../gl/heroRenderer';
import { useMedia, NARROW } from '../hooks/useMedia';

const WIDTHS = [768, 1080, 1440, 1920, 2048];

const focusOf = (s) => {
  const [x = '50%', y = '50%'] = (s.focus || '').split(' ').filter(Boolean);
  return [parseFloat(x) / 100 || 0.5, parseFloat(y) / 100 || 0.5];
};

/* Pick the srcset width the browser would: smallest at or above the device
 * width, so a texture fetch can reuse what the preload already cached. */
const pickWidth = () => {
  const need = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  return WIDTHS.find((w) => w >= need) || WIDTHS[WIDTHS.length - 1];
};

/* The photographs behind the hero.
 *
 * Layer 1 is always a plain <img> of the first frame: it is what the static
 * boot image in index.html hands off to (and retires), and what anyone without
 * WebGL, or with reduced motion, sees. Layer 2 is the WebGL canvas, which
 * renders that same frame pixel-for-pixel, fades in over it, then takes over
 * every transition. If WebGL is missing, a plain crossfade runs instead. */
export default function HeroStage({ slides, index, active }) {
  const reduced = useReducedMotion();
  const narrow = useMedia(NARROW);
  const canvasRef = useRef(null);
  const baseRef = useRef(null);
  const rRef = useRef(null);
  const loading = useRef(new Map());
  const wanted = useRef(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [canvasOn, setCanvasOn] = useState(false);
  const off = reduced || failed;
  const mode = off ? 'off' : ready ? 'gl' : 'pending';

  const keyOf = useCallback((s) => (narrow && s.portrait ? s.portrait : s.id), [narrow]);
  const urlOf = useCallback(
    (s) => (narrow && s.portrait ? cld(s.portrait, { ...s.portraitOpts, w: pickWidth() }) : cld(s.id, { w: pickWidth() })),
    [narrow],
  );

  /* Load a frame into the GPU (once). Resolves when uploaded. */
  const ensure = useCallback(
    (s) => {
      const r = rRef.current;
      if (!r) return Promise.reject();
      const key = keyOf(s);
      if (r.has(key)) return Promise.resolve(key);
      if (loading.current.has(key)) return loading.current.get(key);
      const p = new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.src = urlOf(s);
        img
          .decode()
          .then(() => {
            if (!rRef.current) return reject();
            rRef.current.upload(key, img, focusOf(s));
            resolve(key);
          })
          .catch(reject);
      });
      loading.current.set(key, p);
      p.catch(() => loading.current.delete(key));
      return p;
    },
    [keyOf, urlOf],
  );

  /* First frame: take the already-loaded <img> straight into a texture. */
  const prime = useCallback(() => {
    const r = rRef.current;
    const img = baseRef.current;
    if (!r || !img || !img.complete || !img.naturalWidth) return;
    const key = keyOf(slides[0]);
    try {
      r.upload(key, img, focusOf(slides[0]));
    } catch {
      // A tainted (non-CORS) image cannot become a texture; stay on the fallback.
      setFailed(true);
      return;
    }
    r.show(key);
    // two frames so the canvas has definitely presented before it fades in
    requestAnimationFrame(() => requestAnimationFrame(() => setCanvasOn(true)));
  }, [keyOf, slides]);

  useEffect(() => {
    if (off || !canvasRef.current) return undefined;
    const r = createHeroRenderer(canvasRef.current);
    if (!r) { setFailed(true); return undefined; }
    rRef.current = r;
    setReady(true);
    const canvas = canvasRef.current;
    const ro = new ResizeObserver(() => r.resize());
    ro.observe(canvas);
    // iOS drops GL contexts under memory pressure / after backgrounding; the
    // canvas would then sit black over the hero. Fall back to the image path.
    const onLost = (e) => { e.preventDefault(); setFailed(true); };
    canvas.addEventListener('webglcontextlost', onLost);
    const loads = loading.current;
    return () => {
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      r.destroy();
      rRef.current = null;
      loads.clear();
      setReady(false);
      setCanvasOn(false);
    };
  }, [off]);

  useEffect(() => { if (mode === 'gl') prime(); }, [mode, prime]);

  /* Run the render loop only while the hero can be seen. */
  useEffect(() => {
    const r = rRef.current;
    if (!r || mode !== 'gl') return;
    if (active) r.start();
    else r.stop();
  }, [active, mode, canvasOn]);

  /* Follow the index: dissolve to it once its texture is ready, and fetch the
   * one after so it is waiting by the time it is needed. */
  useEffect(() => {
    if (mode !== 'gl' || !canvasOn) return;
    wanted.current = index;
    const s = slides[index];
    ensure(s)
      .then((key) => {
        if (wanted.current === index) rRef.current?.transitionTo(key);
        ensure(slides[(index + 1) % slides.length]).catch(() => {});
      })
      .catch(() => {});
  }, [index, mode, canvasOn, slides, ensure]);

  /* Candle light under the cursor (fine pointers only). */
  useEffect(() => {
    if (mode !== 'gl') return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const onMove = (e) => {
      const c = canvasRef.current;
      const r = rRef.current;
      if (!c || !r) return;
      const b = c.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width;
      const y = (e.clientY - b.top) / b.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1 && e.clientY < window.innerHeight;
      r.pointer(x, y, inside);
    };
    const onLeave = () => rRef.current?.pointer(0.5, 0.5, false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [mode]);

  /* Retire the static boot image (index.html) only once this frame has decoded
   * and painted (decode + two frames), never sooner, or the repeat-visit overlay
   * would flash the gap. Removing it does not retract the LCP it recorded. */
  const onBaseLoad = (e) => {
    const img = e.currentTarget;
    const drop = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.getElementById('boot-hero')?.remove()),
      );
    if (img.decode) img.decode().then(drop, drop);
    else drop();
    if (mode === 'gl') prime();
  };

  const first = slides[0];
  const fallbackSlide = mode === 'off' && !reduced && index > 0 ? slides[index] : null;

  return (
    <>
      <div className="hero__slide">
        <CloudImage
          ref={baseRef}
          name={first.id}
          portrait={first.portrait}
          portraitOpts={first.portraitOpts}
          alt={first.alt}
          sizes="100vw"
          widths={WIDTHS}
          eager
          crossOrigin="anonymous"
          style={first.focus ? { objectPosition: first.focus } : undefined}
          onLoad={onBaseLoad}
        />
      </div>

      {mode === 'off' && (
        <AnimatePresence initial={false}>
          {fallbackSlide && (
            <m.div
              key={fallbackSlide.id}
              className="hero__slide"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.8, ease: 'easeInOut' }, scale: { duration: 8, ease: [0.16, 1, 0.3, 1] } }}
            >
              <CloudImage
                name={fallbackSlide.id}
                portrait={fallbackSlide.portrait}
                portraitOpts={fallbackSlide.portraitOpts}
                alt=""
                sizes="100vw"
                widths={WIDTHS}
                style={fallbackSlide.focus ? { objectPosition: fallbackSlide.focus } : undefined}
              />
            </m.div>
          )}
        </AnimatePresence>
      )}

      {mode !== 'off' && (
        <canvas
          ref={canvasRef}
          className={`hero__canvas ${canvasOn ? 'is-on' : ''}`}
          aria-hidden="true"
        />
      )}
    </>
  );
}
