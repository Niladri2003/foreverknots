import { useState, useRef } from 'react';
import { m, AnimatePresence, useInView } from 'motion/react';
import { INFO } from '../data';
import Turnstile from './Turnstile';
import Seal from './Seal';
import SplitWords from './SplitWords';
import Reveal from './Reveal';
import { waLink } from '../utils/whatsapp';
import { sendEnquiry } from '../utils/contact';
import { EXPO, SILK } from '../utils/motion';

const DATE_CHIPS = ['This winter', 'Spring 2027', 'Summer 2027', 'Autumn 2027', '2028', 'Still deciding'];
const TYPE_CHIPS = ['Pre-wedding', 'Wedding day', 'Both', 'Something else'];
const EMPTY = { firstName: '', partnerName: '', email: '', phone: '', date: '', venue: '', type: '', story: '' };
const WA = "Hi foreverknots! We're planning our wedding and would love to talk about photography.";

/* An inline blank in the letter. It grows with what is typed, so the sentence
 * stays a sentence. The label is real (visually hidden) for screen readers. */
function Blank({ id, label, value, placeholder, onChange, onBlur, error, type = 'text', autoComplete, inputMode }) {
  const size = Math.max((value || placeholder).length, 4) + 1;
  return (
    <span className={`blank ${error ? 'is-error' : ''}`}>
      <label className="sr-only" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        size={size}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
    </span>
  );
}

function Err({ id, children }) {
  return (
    <AnimatePresence>
      {children && (
        <m.span
          id={id}
          className="letter__err"
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: EXPO }}
        >
          {children}
        </m.span>
      )}
    </AnimatePresence>
  );
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [botField, setBotField] = useState('');
  // Cloudflare Turnstile token; tsKey remounts the widget to get a fresh one.
  const [tsToken, setTsToken] = useState('');
  const [tsKey, setTsKey] = useState(0);
  // Cloudflare's script only loads once the letter is close, so it never
  // competes with the hero for bandwidth on arrival.
  const letterRef = useRef(null);
  const nearLetter = useInView(letterRef, { once: true, margin: '900px 0px' });

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const err = (k) => (touched[k] && errors[k]) || null;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Add your name so we know who to write back to.';
    if (!form.email.trim()) e.email = 'Add an email address so we can reply.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Check the email address; it looks incomplete.';
    if (!form.date) e.date = 'Choose a season, even a rough one.';
    if (!form.story.trim() || form.story.trim().length < 20) e.story = 'Write a few sentences about the day (at least 20 characters).';
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    if (Object.keys(e).length > 0) {
      document.getElementById(`c-${Object.keys(e)[0]}`)?.focus({ preventScroll: false });
      return;
    }
    if (!tsToken) {
      setSendError('Complete the verification below, then send again.');
      return;
    }
    setSendError(null);
    setSending(true);
    try {
      await sendEnquiry({ ...form, botcheck: botField, token: tsToken });
      setSubmitted(true);
    } catch {
      setSendError("The note didn't go through. Try again in a moment, or send it on WhatsApp and we'll pick it up from there.");
      // Turnstile tokens are single-use — reset so the retry gets a fresh one.
      setTsToken('');
      setTsKey((k) => k + 1);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm(EMPTY);
    setTouched({});
    setErrors({});
    setSendError(null);
    setBotField('');
    setTsToken('');
    setTsKey((k) => k + 1);
  };

  const signature = [form.firstName.trim(), form.partnerName.trim()].filter(Boolean).join(' & ');

  return (
    <section id="contact" className="contact section" data-tone="garnet" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div className="contact__side">
          <SplitWords as="h2" id="contact-title" className="display contact__title">
            Write to us
          </SplitWords>
          <Reveal as="p" className="lead" delay={0.1}>
            Tell us a little about your wedding. Every note is read by the two
            of us, and every reply is written by hand, usually within two
            working days.
          </Reveal>
          <Reveal className="contact__details" delay={0.15}>
            <dl>
              <div><dt className="label">Studio</dt><dd>{INFO.basedIn}</dd></div>
              <div><dt className="label">Weddings</dt><dd>Across India</dd></div>
              <div><dt className="label">Email</dt><dd><a className="tlink" href={`mailto:${INFO.email}`}>{INFO.email}</a></dd></div>
              <div><dt className="label">Phone</dt><dd><a className="tlink" href={`tel:+${INFO.phone.replace(/\D/g, '')}`}>{INFO.phone}</a></dd></div>
              <div><dt className="label">Hours</dt><dd>Monday to Saturday, 11 am to 7 pm IST</dd></div>
            </dl>
            <div className="contact__social">
              <a className="tlink" href={INFO.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a className="tlink" href={INFO.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a className="tlink" href={waLink(INFO.phone, WA)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </Reveal>
          <Seal size={210} className="contact__seal" />
        </div>

        <m.div
          ref={letterRef}
          className="letter"
          initial={{ opacity: 0, y: 60, rotate: -1.2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.6, ease: EXPO }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <m.div
                key="sent"
                className="letter__sent"
                initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
                animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: SILK }}
                role="status"
              >
                <Seal size={170} spin={false} />
                <h3 className="display t-2xl">Your note is on its way.</h3>
                <p>
                  We read every message ourselves. Expect a reply within two
                  working days, usually with a few questions and a time for a
                  video call. You should also find a short confirmation in your inbox.
                </p>
                <button className="btn" onClick={reset}>
                  <span className="roll"><span>Write another note</span><span aria-hidden="true">Write another note</span></span>
                </button>
              </m.div>
            ) : (
              <m.form
                key="form"
                className="letter__form"
                onSubmit={onSubmit}
                noValidate
                exit={{ opacity: 0, y: -20, transition: { duration: 0.5, ease: SILK } }}
              >
                {/* Honeypot: hidden from people, catnip for bots. */}
                <input
                  type="text"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                  aria-hidden="true"
                  className="letter__hp"
                />

                <p className="letter__salute display it">Dear foreverknots,</p>

                <p className="letter__line">
                  We&rsquo;re{' '}
                  <Blank id="c-firstName" label="Your name" value={form.firstName} placeholder="your name" onChange={set('firstName')} onBlur={blur('firstName')} error={err('firstName')} autoComplete="given-name" />{' '}
                  and{' '}
                  <Blank id="c-partnerName" label="Your partner's name" value={form.partnerName} placeholder="your partner's name" onChange={set('partnerName')} />,
                  and we&rsquo;re getting married in{' '}
                  <Blank id="c-venue" label="Venue or city" value={form.venue} placeholder="a city, or not sure yet" onChange={set('venue')} />.
                  <Err id="c-firstName-err">{err('firstName')}</Err>
                </p>

                <fieldset className="letter__choice">
                  <legend>We&rsquo;re thinking of</legend>
                  <div className="chips">
                    {DATE_CHIPS.map((d, k) => (
                      <button
                        id={k === 0 ? 'c-date' : undefined}
                        type="button"
                        key={d}
                        className="chip"
                        aria-pressed={form.date === d}
                        onClick={() => { set('date')(d); blur('date')(); }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <Err id="c-date-err">{err('date')}</Err>
                </fieldset>

                <fieldset className="letter__choice">
                  <legend>and we&rsquo;d love you there for</legend>
                  <div className="chips">
                    {TYPE_CHIPS.map((d) => (
                      <button type="button" key={d} className="chip" aria-pressed={form.type === d} onClick={() => set('type')(d)}>
                        {d}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className={`letter__story ${err('story') ? 'is-error' : ''}`}>
                  <label htmlFor="c-story">A little about the day</label>
                  <textarea
                    id="c-story"
                    value={form.story}
                    onChange={(e) => set('story')(e.target.value)}
                    onBlur={blur('story')}
                    rows={4}
                    placeholder="How you met, what the day looks like in your head, anything you're worried about…"
                    aria-invalid={err('story') ? true : undefined}
                    aria-describedby={err('story') ? 'c-story-err' : undefined}
                  />
                  <Err id="c-story-err">{err('story')}</Err>
                </div>

                <p className="letter__line">
                  Write back to us at{' '}
                  <Blank id="c-email" type="email" label="Email" value={form.email} placeholder="your email" onChange={set('email')} onBlur={blur('email')} error={err('email')} autoComplete="email" inputMode="email" />{' '}
                  or call{' '}
                  <Blank id="c-phone" type="tel" label="Phone (optional)" value={form.phone} placeholder="a number (optional)" onChange={set('phone')} autoComplete="tel" inputMode="tel" />.
                  <Err id="c-email-err">{err('email')}</Err>
                </p>

                <p className="letter__sign">
                  <span className="label">With love,</span>
                  <span className="letter__sig display it">{signature || 'the two of us'}</span>
                </p>

                <div className="letter__verify">
                  {nearLetter && <Turnstile key={tsKey} onToken={setTsToken} />}
                </div>

                <div className="letter__actions">
                  <button type="submit" className="btn btn--solid" disabled={sending} aria-busy={sending}>
                    <span className="roll">
                      <span>{sending ? 'Sending your note…' : 'Send our note'}</span>
                      <span aria-hidden="true">{sending ? 'Sending your note…' : 'Send our note'}</span>
                    </span>
                  </button>
                  <a className="tlink" href={waLink(INFO.phone, WA)} target="_blank" rel="noopener noreferrer">
                    Or message us on WhatsApp
                  </a>
                </div>
                {sendError && <p className="letter__err letter__err--send" role="alert">{sendError}</p>}
              </m.form>
            )}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  );
}
