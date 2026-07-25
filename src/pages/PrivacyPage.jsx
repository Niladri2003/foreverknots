import { INFO } from '../data';
import Reveal from '../components/Reveal';

// Kept deliberately plain and honest: the site collects data only through the
// contact form, uses no analytics/tracking, and leans on a few well-known
// service providers. Update EFFECTIVE_DATE whenever the substance changes.
const EFFECTIVE_DATE = '25 July 2026';

export default function PrivacyPage() {
  const mail = <a href={`mailto:${INFO.email}`}>{INFO.email}</a>;

  return (
    <main className="legal-page">
      <section className="section">
        <div className="wrap">
          <Reveal className="legal">
            <div className="mono">Legal</div>
            <h1 className="legal__title">Privacy Policy</h1>
            <p className="legal__updated">Last updated · {EFFECTIVE_DATE}</p>

            <p>
              This policy explains what information {INFO.brand} (“we”, “us”)
              collects when you use <strong>{INFO.site.replace('https://', '')}</strong>,
              why we collect it, and what we do with it. We keep it short because
              we keep the data-collection simple.
            </p>

            <h2>What we collect</h2>
            <p>
              <strong>Information you give us.</strong> When you fill in our
              enquiry form, we collect the details you share: your name and your
              partner’s name, your email address, your phone number (if you add
              it), your wedding date or season, your venue or city, the type of
              shoot, and anything you write in your message. If you instead reach
              us by email, WhatsApp or Instagram, we receive whatever you choose
              to send there.
            </p>
            <p>
              <strong>Information collected automatically.</strong> Our hosting
              provider keeps standard server logs (such as your IP address,
              browser type and the pages requested) to keep the site secure and
              running. We also use a website-analytics tool to understand how the
              site is used — see <strong>Analytics</strong> below. We do{' '}
              <strong>not</strong> run advertising trackers, and we never sell
              your data.
            </p>

            <h2>How we use it</h2>
            <ul>
              <li>To read and reply to your enquiry.</li>
              <li>To send you an automatic acknowledgement that your note arrived.</li>
              <li>To discuss, quote for and arrange your booking.</li>
              <li>To keep a record of our correspondence with you.</li>
            </ul>
            <p>
              We do not sell, rent or trade your information to anyone, ever.
            </p>

            <h2>Who we share it with</h2>
            <p>
              We use a small number of trusted service providers to run the site
              and reach you. They only process your information to provide their
              service to us:
            </p>
            <ul>
              <li><strong>Netlify</strong> — hosts this website.</li>
              <li><strong>Amazon Web Services (SES)</strong> — delivers the emails sent from the enquiry form.</li>
              <li><strong>Cloudinary</strong> — serves the photographs you see on the site.</li>
              <li><strong>Microsoft Clarity</strong> — helps us see how the site is used so we can improve it (see “Analytics” below).</li>
            </ul>
            <p>
              If you contact us through WhatsApp or Instagram, those platforms
              handle your data under their own privacy policies.
            </p>

            <h2>Analytics</h2>
            <p>
              To understand how visitors use this site — which pages they read,
              where they tap, and where they run into trouble — we use{' '}
              <strong>Microsoft Clarity</strong>. Clarity collects usage and
              interaction data (pages viewed, clicks, scrolling and navigation)
              and technical data (your device, browser and an approximate location
              derived from your IP address) using cookies and similar
              technologies, and it captures anonymised session replays with text
              and form fields <strong>masked by default</strong> — so we don’t see
              what you type. We use this only to improve the site’s usability and
              accessibility, not to identify you. Clarity is provided by Microsoft,
              which processes this data under its own{' '}
              <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">privacy statement</a>.
            </p>

            <h2>How long we keep it</h2>
            <p>
              We keep your enquiry for as long as we need it to respond and, if
              you book with us, for the length of our work together and our
              normal business records afterwards. You can ask us to delete your
              enquiry at any time.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask us what information we hold about you, ask us to correct
              it, or ask us to delete it. Just email us at {mail} and we’ll take
              care of it.
            </p>

            <h2>Children</h2>
            <p>
              This site and our services are intended for adults. We do not
              knowingly collect information from children.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this policy from time to time. When we do, we’ll
              revise the “last updated” date above.
            </p>

            <h2>Contact us</h2>
            <p>
              Questions about this policy or your information? Write to us at
              {' '}{mail} and we’ll be glad to help.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
