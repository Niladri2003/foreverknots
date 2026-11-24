import { m } from 'motion/react';
import { INFO } from '../data';
import { waLink } from '../utils/whatsapp';
import RingsMark from './RingsMark';
import { EXPO } from '../utils/motion';

const WORD = 'foreverknots';
const WA = "Hi foreverknots! We're planning our wedding and would love to talk about photography.";

export default function Foot({ onJump, onRoute, onTop }) {
  const year = new Date().getFullYear();
  return (
    <footer className="foot" data-tone="night">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__intro">
            <RingsMark size={52} />
            <p className="foot__line display">
              Wedding photography for the knot you tie once. Based in Kolkata,
              travelling across India since 2020.
            </p>
          </div>
          <nav className="foot__col" aria-label="Site">
            <p className="label">Visit</p>
            <ul>
              <li><button className="tlink" onClick={() => onJump('work')}>Selected work</button></li>
              <li><button className="tlink" onClick={() => onJump('day')}>The wedding day</button></li>
              <li><button className="tlink" onClick={() => onJump('stories')}>Journal</button></li>
              <li><button className="tlink" onClick={() => onRoute('/gallery')}>Gallery</button></li>
              <li><button className="tlink" onClick={() => onJump('about')}>The studio</button></li>
              <li><button className="tlink" onClick={() => onJump('faq')}>Questions</button></li>
            </ul>
          </nav>
          <div className="foot__col">
            <p className="label">Talk to us</p>
            <ul>
              <li><a className="tlink" href={`mailto:${INFO.email}`}>{INFO.email}</a></li>
              <li><a className="tlink" href={`tel:+${INFO.phone.replace(/\D/g, '')}`}>{INFO.phone}</a></li>
              <li><a className="tlink" href={waLink(INFO.phone, WA)} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a className="tlink" href={INFO.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className="tlink" href={INFO.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>

        <m.div
          className="foot__word display"
          aria-hidden="true"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ show: { transition: { staggerChildren: 0.045 } } }}
        >
          {WORD.split('').map((ch, i) => (
            <span className="rw" key={i}>
              <m.span
                className="rw__i"
                variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1.6, ease: EXPO } } }}
              >
                {ch}
              </m.span>
            </span>
          ))}
        </m.div>

        <div className="foot__bot">
          <span className="label">&copy; {year} foreverknots</span>
          <button className="label tlink" onClick={() => onRoute('/privacy')}>Privacy</button>
          <button className="label tlink" onClick={onTop}>Back to the top</button>
        </div>
      </div>
    </footer>
  );
}
