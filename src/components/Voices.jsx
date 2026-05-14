import { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../data';

export default function Voices() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 7500);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[i];

  return (
    <section id="voices" className="testi">
      <div className="testi__inner">
        <div className="mono testi__mono">Kind words · received with thanks</div>
        <span className="testi__mark">"</span>
        <blockquote key={i} className="testi__quote" style={{ animation: 'fadeIn .8s ease both' }}>
          {t.q}
        </blockquote>
        <div className="testi__attr">{t.a}</div>
        <div className="testi__nav">
          {TESTIMONIALS.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              className={k === i ? 'active' : ''}
              aria-label={`Testimonial ${k + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
