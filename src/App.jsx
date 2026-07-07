import { useState, useEffect, useCallback } from 'react';
import { MotionConfig, LazyMotion, domMax, AnimatePresence } from 'motion/react';
import { ReactLenis, useLenis } from 'lenis/react';
import { Routes, Route, Outlet, Navigate, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { STORIES } from './data';
import Seo from './components/Seo';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Intro from './components/Intro';
import Work from './components/Work';
import Stories from './components/Stories';
import StoryModal from './components/StoryModal';
import Packages from './components/Packages';
import About from './components/About';
import Voices from './components/Voices';
import Faq from './components/Faq';
import InstaStrip from './components/InstaStrip';
import Contact from './components/Contact';
import Foot from './components/Foot';
import Lightbox from './components/Lightbox';
import Preloader from './components/Preloader';
import WhatsAppFloat from './components/WhatsAppFloat';
import GalleryPage from './pages/GalleryPage';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

function HomePage({ ready, openLightbox, openStory, jump }) {
  return (
    <main>
      <Hero ready={ready} />
      <Marquee />
      <Intro />
      <Work openLightbox={openLightbox} />
      <Stories openStory={openStory} />
      <Packages onJump={jump} />
      <About />
      <Voices />
      <Faq />
      <InstaStrip />
      <Contact />
      {/* /stories/:id nests here so the homepage never remounts under the overlay */}
      <Outlet />
    </main>
  );
}

function Site({ reduced }) {
  const lenis = useLenis();
  const location = useLocation();
  const navigate = useNavigate();

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

  // Scroll to top when switching between the home page and the gallery page
  const page = location.pathname.startsWith('/gallery') ? 'gallery' : 'home';
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.1 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [lenis]);

  const jump = useCallback((id) => {
    if (story) {
      closeStory();
      // wait for the panel's exit slide before scrolling
      setTimeout(() => scrollToId(id), 550);
      return;
    }
    if (page === 'gallery') {
      navigate('/');
      setTimeout(() => scrollToId(id), 400);
      return;
    }
    scrollToId(id);
  }, [story, page, closeStory, navigate, scrollToId]);

  return (
    <>
      <AnimatePresence>
        {showPreloader && <Preloader onDone={() => setBooted(true)} />}
      </AnimatePresence>

      <Nav onJump={jump} />

      <Routes>
        <Route path="/" element={<HomePage ready={ready} openLightbox={openLightbox} openStory={openStory} jump={jump} />}>
          <Route index element={null} />
          <Route path="stories/:id" element={null} />
        </Route>
        <Route path="/gallery" element={<GalleryPage openLightbox={openLightbox} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Foot onJump={jump} />

      <WhatsAppFloat />
      <Seo />
      <div className="grain" aria-hidden="true" />

      <Lightbox items={lb.items} index={lb.index} dir={lb.dir} onClose={closeLightbox} onPrev={prev} onNext={next} />
      <StoryModal story={story} onClose={closeStory} openLightbox={openLightbox} />
    </>
  );
}

export default function App() {
  const reduced = usePrefersReducedMotion();
  const site = <Site reduced={reduced} />;
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        {reduced ? site : (
          <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
            {site}
          </ReactLenis>
        )}
      </LazyMotion>
    </MotionConfig>
  );
}
