import { useState, useEffect } from 'react';

const IDS = ['home', 'work', 'day', 'stories', 'about', 'voices', 'faq', 'contact'];

export function useScrollSection() {
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      let active = 'home';
      for (const id of IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.4) active = id;
      }
      setSection(active);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrolled, section };
}
