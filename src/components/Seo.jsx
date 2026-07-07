import { INFO, FAQS } from '../data';
import { cld } from '../utils/cloudinary';

/* JSON-LD structured data, generated from data.js so it never drifts
 * from the visible content. Valid anywhere in the document. */

const LOGO_URL = 'https://res.cloudinary.com/dvbnkndyc/image/upload/f_auto,q_auto/foreverknots/logo.png';

const business = {
  '@context': 'https://schema.org',
  '@type': 'Photographer',
  name: INFO.brand,
  description:
    'Cinematic wedding photography studio out of Kolkata — pre-weddings, Bengali weddings, candid rituals and heirloom albums. Tying knots since 2020.',
  url: INFO.site,
  email: INFO.email,
  telephone: `+${INFO.phone.replace(/\D/g, '')}`,
  image: cld('hero-couple', { w: 1200 }),
  logo: LOGO_URL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kolkata',
    addressRegion: 'West Bengal',
    addressCountry: 'IN',
  },
  areaServed: INFO.serves.map((city) => ({ '@type': 'City', name: city })),
  sameAs: [INFO.instagram],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '11:00',
    closes: '19:00',
  },
  priceRange: '₹₹',
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Seo() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
    </>
  );
}
