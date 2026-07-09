import { useState } from 'react';
import { INFO } from '../data';
import Reveal from './Reveal';
import { waLink } from '../utils/whatsapp';
import { sendEnquiry } from '../utils/contact';

const DATE_CHIPS = ['Winter 2026', 'Spring 2026', 'Summer 2026', 'Autumn 2026', '2027', 'Still deciding'];
const TYPE_CHIPS = ['Pre-Wedding', 'Wedding Day', 'Both', 'Other'];

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '', partnerName: '', email: '', phone: '',
    date: '', venue: '', type: '', story: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [botField, setBotField] = useState('');

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };
  const blur = (k) => setTouched((t) => ({ ...t, [k]: true }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "We'd love your name.";
    if (!form.email.trim()) e.email = "We'll need an email to reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "That doesn't look quite right.";
    if (!form.date) e.date = 'Pick a season — even an approximate one.';
    if (!form.story.trim() || form.story.trim().length < 20) e.story = 'A few sentences, please — anything about the day.';
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    if (Object.keys(e).length > 0) return;

    setSendError(null);
    setSending(true);
    try {
      await sendEnquiry({ ...form, botcheck: botField });
      setSubmitted(true);
    } catch (err) {
      setSendError(
        "We couldn't send your note just now. Please try again in a moment — or reach us on WhatsApp and we'll pick it up straight away."
      );
    } finally {
      setSending(false);
    }
  };

  const fieldCls = (k) => `field ${touched[k] && errors[k] ? 'error' : ''}`;

  if (submitted) {
    return (
      <section id="contact" className="contact">
        <div className="wrap">
          <div className="form form-success">
            <div className="mark">Thank you.</div>
            <h3 className="display display-m" style={{ margin: '0 0 16px' }}>
              Your note is in.
            </h3>
            <p className="lead" style={{ margin: '0 auto' }}>
              We read every message ourselves. You'll hear back within two
              working days — usually with a few warm questions and a link to
              book a video call.
            </p>
            <div style={{ marginTop: 32 }}>
              <button className="btn btn--ghost" onClick={() => {
                setSubmitted(false);
                setForm({ firstName: '', partnerName: '', email: '', phone: '', date: '', venue: '', type: '', story: '' });
                setTouched({});
                setSendError(null);
                setBotField('');
              }}>
                Send another <span className="ar">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="contact-grid">
          <Reveal className="contact__intro">
            <div className="mono">Inquiries · open for 2026 / 2027</div>
            <h2 className="display display-l">
              Let's <span className="swash">begin</span>.
            </h2>
            <p className="lead">
              Tell us a little about your day. The form takes about three
              minutes. Every message is read by us — there is no assistant,
              and never a template reply.
            </p>
            <div className="contact__details">
              <div className="row">
                <span className="k">Studio</span>
                <span className="v">{INFO.basedIn}</span>
              </div>
              <div className="row">
                <span className="k">Email</span>
                <span className="v">{INFO.email}</span>
              </div>
              <div className="row">
                <span className="k">Phone</span>
                <span className="v">{INFO.phone}</span>
              </div>
              <div className="row">
                <span className="k">Hours</span>
                <span className="v">{INFO.hours}</span>
              </div>
              <div className="row">
                <span className="k">Travelling</span>
                <span className="v">{INFO.serves.join(' · ')}</span>
              </div>
            </div>
            <div className="contact__social">
              <a href={INFO.instagram} target="_blank" rel="noopener noreferrer">
                Instagram <span>↗</span>
              </a>
              <a
                href={waLink(INFO.phone, "Hi foreverknots! We're planning our wedding and would love to talk about photography.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp <span>↗</span>
              </a>
            </div>
          </Reveal>

          <Reveal as="form" className="form" delay={0.1} onSubmit={onSubmit} noValidate>
            {/* Honeypot: hidden from people, catnip for bots. Filled = ignored server-side. */}
            <input
              type="text"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              value={botField}
              onChange={(e) => setBotField(e.target.value)}
              aria-hidden="true"
              style={{ position: 'absolute', left: '-5000px', width: 1, height: 1, opacity: 0 }}
            />
            <div className="form__row">
              <div className={fieldCls('firstName')}>
                <label>Your name</label>
                <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} onBlur={() => blur('firstName')} placeholder="Aditi" />
                {touched.firstName && errors.firstName && <span className="err-msg">{errors.firstName}</span>}
              </div>
              <div className={fieldCls('partnerName')}>
                <label>Your partner's name</label>
                <input value={form.partnerName} onChange={(e) => set('partnerName', e.target.value)} placeholder="Soumya" />
              </div>
            </div>

            <div className="form__row">
              <div className={fieldCls('email')}>
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')} placeholder="you@somewhere.com" />
                {touched.email && errors.email && <span className="err-msg">{errors.email}</span>}
              </div>
              <div className={fieldCls('phone')}>
                <label>Phone (optional)</label>
                <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 …" />
              </div>
            </div>

            <div className="form__row form__row--single">
              <div className={fieldCls('date')}>
                <label>When are you thinking?</label>
                <div className="chips" style={{ marginTop: 4 }}>
                  {DATE_CHIPS.map((d) => (
                    <button type="button" key={d} className={form.date === d ? 'active' : ''} onClick={() => set('date', d)}>
                      {d}
                    </button>
                  ))}
                </div>
                {touched.date && errors.date && <span className="err-msg" style={{ marginTop: 8 }}>{errors.date}</span>}
              </div>
            </div>

            <div className="form__row form__row--single">
              <div className={fieldCls('type')}>
                <label>What kind of shoot?</label>
                <div className="chips" style={{ marginTop: 4 }}>
                  {TYPE_CHIPS.map((d) => (
                    <button type="button" key={d} className={form.type === d ? 'active' : ''} onClick={() => set('type', d)}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form__row form__row--single">
              <div className={fieldCls('venue')}>
                <label>Venue or city</label>
                <input value={form.venue} onChange={(e) => set('venue', e.target.value)} placeholder="Kolkata · or 'not yet'" />
              </div>
            </div>

            <div className="form__row form__row--single">
              <div className={fieldCls('story')}>
                <label>Your day, in a few sentences</label>
                <textarea value={form.story} onChange={(e) => set('story', e.target.value)} onBlur={() => blur('story')} placeholder="How you met, what the day looks like in your head, any worries…" />
                {touched.story && errors.story && <span className="err-msg">{errors.story}</span>}
                {!errors.story && <span className="hint">Read by us, not a team. No template replies.</span>}
              </div>
            </div>

            <div className="form__actions">
              <button type="submit" className="btn" disabled={sending} aria-busy={sending}>
                {sending ? 'Sending…' : <>Send the note <span className="ar">→</span></>}
              </button>
              <a
                className="btn btn--ghost"
                href={waLink(INFO.phone, "Hi foreverknots! We're planning our wedding and would love to talk about photography.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                or WhatsApp us <span className="ar">→</span>
              </a>
            </div>
            {sendError && (
              <p className="err-msg" role="alert" style={{ marginTop: 16 }}>
                {sendError}
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
