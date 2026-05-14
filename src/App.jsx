import { useState, useCallback } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Intro from './components/Intro';
import Work from './components/Work';
import Stories from './components/Stories';
import StoryModal from './components/StoryModal';
import About from './components/About';
import Voices from './components/Voices';
import Contact from './components/Contact';
import Foot from './components/Foot';
import Lightbox from './components/Lightbox';
import { useReveal } from './hooks/useReveal';

export default function App() {
  useReveal([]);

  const [lb, setLb] = useState({ items: [], index: null });
  const openLightbox = useCallback((items, idx) => setLb({ items, index: idx }), []);
  const closeLightbox = useCallback(() => setLb((s) => ({ ...s, index: null })), []);
  const prev = useCallback(() => setLb((s) => ({ ...s, index: (s.index - 1 + s.items.length) % s.items.length })), []);
  const next = useCallback(() => setLb((s) => ({ ...s, index: (s.index + 1) % s.items.length })), []);

  const [story, setStory] = useState(null);
  const openStory = useCallback((s) => setStory(s), []);
  const closeStory = useCallback(() => setStory(null), []);

  const jump = useCallback((id) => {
    if (story) {
      setStory(null);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
      }, 350);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
  }, [story]);

  return (
    <>
      <Nav onJump={jump} />
      <main>
        <Hero />
        <Marquee />
        <Intro />
        <Work openLightbox={openLightbox} />
        <Stories openStory={openStory} />
        <About />
        <Voices />
        <Contact />
      </main>
      <Foot onJump={jump} />

      <Lightbox items={lb.items} index={lb.index} onClose={closeLightbox} onPrev={prev} onNext={next} />
      <StoryModal story={story} onClose={closeStory} openLightbox={openLightbox} />
    </>
  );
}
