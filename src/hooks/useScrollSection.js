import { useState, useEffect } from 'react';

export function useScrollSection() {
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState('home');

  useEffect(() => {
    const ids = ['home', 'work', 'stories', 'packages', 'about', 'voices', 'faq', 'contact'];
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      let active = 'home';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) active = id;
      }
      setSection(active);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrolled, section };
}
