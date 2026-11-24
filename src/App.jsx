import { useState, useEffect, useLayoutEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { MotionConfig, LazyMotion, domMax, AnimatePresence } from 'motion/react';
import { ReactLenis, useLenis } from 'lenis/react';
import { Routes, Route, Outlet, Navigate, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { STORIES } from './data';
import Seo from './components/Seo';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Selects from './components/Selects';
import WeddingDay from './components/WeddingDay';
import Journal from './components/Journal';
// import Packages from './components/Packages'; // parked: pricing is shared on enquiry
import Studio from './components/Studio';
import Voices from './components/Voices';
import Faq from './components/Faq';
import Feed from './components/Feed';
import Contact from './components/Contact';
import Foot from './components/Foot';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import WhatsAppFloat from './components/WhatsAppFloat';
import { TransitionProvider, useGo } from './components/Transition';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useTone } from './hooks/useTone';

// Code-split: the gallery route and the on-demand overlays leave the initial bundle.
// Overlays mount on first open, then stay mounted so their internal AnimatePresence
// exit animations still run.
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const Lightbox = lazy(() => import('./components/Lightbox'));
const StoryModal = lazy(() => import('./components/StoryModal'));

function HomePage({ ready, openLightbox, openStory }) {
  return (
    <main>
      <Hero ready={ready} />
      <Manifesto />
      <Selects openLightbox={openLightbox} />
      <WeddingDay />
      <Journal openStory={openStory} />
      <Studio />
      <Voices />
      <Faq />
      <Feed />
      <Contact />
      {/* /stories/:id nests here so the homepage never remounts under the overlay */}
      <Outlet />
    </main>
  );
}

const pageOf = (pathname) =>
  pathname.startsWith('/gallery') ? 'gallery' : pathname.startsWith('/privacy') ? 'privacy' : 'home';

function Site({ reduced }) {
  const lenis = useLenis();
  const location = useLocation();
  const navigate = useNavigate();
  const go = useGo();
  useTone();

  const [booted, setBooted] = useState(() => {
    try { return !!sessionStorage.getItem('fk-seen'); } catch { return true; }
  });
  const showPreloader = !booted && !reduced;
  const ready = booted || reduced;

  const [lb, setLb] = useState({ items: [], index: null, dir: 0 });
  const openLightbox = useCallback((items, idx) => setLb({ items, index: idx, dir: 0 }), []);
  const closeLightbox = useCallback(() => setLb((s) => ({ ...s, index: null })), []);
  const prev = useCallback(() => setLb((s) => ({ ...s, index: (s.index - 1 + s.items.length) % s.items.length, dir: -1 })), []);
  const next = useCallback(() => setLb((s) => ({ ...s, index: (s.index + 1) % s.items.length, dir: 1 })), []);

  // Story overlay is route-driven: /stories/:id
  const storyMatch = useMatch('/stories/:id');
  const story = storyMatch ? STORIES.find((s) => s.id === storyMatch.params.id) || null : null;
  const openStory = useCallback((s) => navigate(`/stories/${s.id}`), [navigate]);
  const closeStory = useCallback(() => navigate('/'), [navigate]);

  // Load the lazy overlays on first use, then keep them mounted (so their internal
  // AnimatePresence handles open/close). A direct /stories/:id hit opens one immediately.
  const [lbMounted, setLbMounted] = useState(false);
  useEffect(() => { if (lb.index != null) setLbMounted(true); }, [lb.index]);
  const [storyMounted, setStoryMounted] = useState(false);
  useEffect(() => { if (story) setStoryMounted(true); }, [story]);

  const page = pageOf(location.pathname);

  const scrollToId = useCallback((id, immediate = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6, immediate, force: true });
    else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' });
  }, [lenis]);

  const toTop = useCallback((immediate = false) => {
    if (lenis) lenis.scrollTo(0, { immediate, duration: 1.6, force: true });
    else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
  }, [lenis]);

  /* Where to land after a navigation, decided once the new page has committed
   * (layout effect: the DOM is there, the curtain is still down). Lenis only
   * re-measures the document on a debounced resize, so it is told to now, or an
   * immediate scroll would be clamped to the previous page's height. A second
   * pass a frame later catches the exhibition wall, which sizes itself from a
   * measurement of its own. A page change with no section goes to the top. */
  const lastPage = useRef(page);
  useLayoutEffect(() => {
    const section = location.state?.section;
    const pageChanged = lastPage.current !== page;
    lastPage.current = page;
    if (!section && !pageChanged) return undefined;
    const land = () => {
      lenis?.resize();
      if (section) scrollToId(section, true);
      else toTop(true);
    };
    land();
    const raf = requestAnimationFrame(land);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const jump = useCallback((id) => {
    if (story) {
      closeStory();
      // wait for the panel to lift away before scrolling
      setTimeout(() => scrollToId(id), 850);
      return;
    }
    if (page !== 'home') {
      go('/', { section: id });
      return;
    }
    if (id === 'home') toTop();
    else scrollToId(id);
  }, [story, page, closeStory, go, scrollToId, toTop]);

  const route = useCallback((to) => {
    if (pageOf(to) === page && !story) { toTop(); return; }
    go(to);
  }, [go, page, story, toTop]);

  return (
    <>
      <AnimatePresence>
        {showPreloader && <Preloader onDone={() => setBooted(true)} />}
      </AnimatePresence>

      <Nav onJump={jump} onRoute={route} ready={ready} />

      <Routes>
        <Route path="/" element={<HomePage ready={ready} openLightbox={openLightbox} openStory={openStory} />}>
          <Route index element={null} />
          <Route path="stories/:id" element={null} />
        </Route>
        <Route
          path="/gallery"
          element={
            <Suspense fallback={<div aria-hidden="true" style={{ minHeight: '100vh' }} />}>
              <GalleryPage openLightbox={openLightbox} />
            </Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={<div aria-hidden="true" style={{ minHeight: '100vh' }} />}>
              <PrivacyPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Foot onJump={jump} onRoute={route} onTop={() => toTop()} />

      <WhatsAppFloat />
      <Cursor />
      <Seo />
      <div className="grain" aria-hidden="true" />

      {lbMounted && (
        <Suspense fallback={null}>
          <Lightbox items={lb.items} index={lb.index} dir={lb.dir} onClose={closeLightbox} onPrev={prev} onNext={next} />
        </Suspense>
      )}
      {storyMounted && (
        <Suspense fallback={null}>
          <StoryModal story={story} onClose={closeStory} openLightbox={openLightbox} openStory={openStory} />
        </Suspense>
      )}
    </>
  );
}

export default function App() {
  const reduced = usePrefersReducedMotion();
  const site = (
    <TransitionProvider reduced={reduced}>
      <Site reduced={reduced} />
    </TransitionProvider>
  );
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        {reduced ? site : (
          <ReactLenis root options={{ lerp: 0.085, smoothWheel: true }}>
            {site}
          </ReactLenis>
        )}
      </LazyMotion>
    </MotionConfig>
  );
}
