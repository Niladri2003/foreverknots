import { useState } from 'react';
import { m } from 'motion/react';
import { FAQS, INFO } from '../data';
import SplitWords from './SplitWords';
import Reveal from './Reveal';
import { waLink } from '../utils/whatsapp';
import { EXPO } from '../utils/motion';

function FaqItem({ q, a, open, onToggle, i }) {
  const id = `faq-${i}`;
  return (
    <div className={`faq__item ${open ? 'is-open' : ''}`}>
      <h3>
        <button className="faq__q" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          <span className="faq__q-text">{q}</span>
          <span className="faq__icon" aria-hidden="true"><i /><i /></span>
        </button>
      </h3>
      <m.div
        id={id}
        role="region"
        className="faq__a"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ height: { duration: 0.8, ease: EXPO }, opacity: { duration: 0.5, delay: open ? 0.15 : 0 } }}
      >
        <p>{a}</p>
      </m.div>
    </div>
  );
}

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="faq section" data-tone="pearl" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <div className="faq__side">
          <SplitWords as="h2" id="faq-title" className="display t-3xl">
            Before you write
          </SplitWords>
          <Reveal as="p" className="faq__aside" delay={0.1}>
            Something we haven&rsquo;t covered?{' '}
            <a
              className="tlink tlink--on"
              href={waLink(INFO.phone, 'Hi foreverknots! We have a question about our wedding photography.')}
              target="_blank"
              rel="noreferrer"
            >
              Ask us on WhatsApp
            </a>
          </Reveal>
        </div>

        <Reveal className="faq__list" delay={0.1}>
          {FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              i={i}
              q={f.q}
              a={f.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
