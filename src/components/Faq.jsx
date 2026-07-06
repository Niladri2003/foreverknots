import { useState } from 'react';
import { m } from 'motion/react';
import { FAQS, INFO } from '../data';
import Reveal from './Reveal';
import { waLink } from '../utils/whatsapp';
import { EASE } from '../utils/motion';

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-item__q" aria-expanded={open} onClick={onToggle}>
        <span>{q}</span>
        <span className="faq-item__plus" aria-hidden="true">+</span>
      </button>
      <m.div
        className="faq-item__a"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="faq-item__a-inner">{a}</div>
      </m.div>
    </div>
  );
}

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="section">
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="sec-head__meta">
            <div className="mono">Questions couples ask</div>
            <h2 className="sec-head__title">
              Before you <em>write to us</em>
            </h2>
          </Reveal>
        </div>

        <Reveal className="faq__list" delay={0.1}>
          {FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </Reveal>

        <Reveal as="p" className="faq__outro" delay={0.15}>
          Something else on your mind?{' '}
          <a
            href={waLink(INFO.phone, 'Hi foreverknots! We have a question about our wedding photography.')}
            target="_blank"
            rel="noreferrer"
          >
            Ask us on WhatsApp →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
