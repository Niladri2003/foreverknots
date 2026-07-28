import { useEffect } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { INFO, FAQS, STORIES } from '../data';
import { cld } from '../utils/cloudinary';

/* JSON-LD structured data (generated from data.js so it never drifts from the visible
 * content) plus per-route <head> management. The SPA otherwise ships one static title /
 * description / canonical for every URL, which would make /gallery and /stories/:id read
 * as duplicates of the homepage. Googlebot renders JS, so updating the head per route
 * lets each page index distinctly. (Non-JS social scrapers still read the static tags in
 * index.html; full per-route social cards would need prerendering/SSR.) */

const LOGO_URL = 'https://res.cloudinary.com/dvbnkndyc/image/upload/f_auto,q_auto/foreverknots/logo.png';
const HOME_DESC =
  'Forever Knots (foreverknots) — cinematic wedding photography out of Kolkata. Documentary, slow, and printed on paper. Pre-weddings, Bengali weddings and beyond. Tying knots since 2020.';

const ogImage = (name) => cld(name, { w: 1200, fill: true, ar: '1.91:1' });

const business = {
  '@context': 'https://schema.org',
  '@type': 'Photographer',
  name: INFO.brand,
  alternateName: 'Forever Knots',
  description:
    'Cinematic wedding photography studio out of Kolkata. Pre-weddings, Bengali weddings, candid rituals and heirloom albums. Tying knots since 2020.',
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

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: INFO.brand,
  alternateName: 'Forever Knots',
  url: INFO.site,
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

function metaFor(pathname, storyId) {
  const story = storyId ? STORIES.find((s) => s.id === storyId) : null;
  if (story) {
    return {
      title: `${story.couple} · ${story.type}, ${story.place} · foreverknots`,
      description: story.excerpt,
      path: `/stories/${story.id}`,
      image: ogImage(story.cover),
    };
  }
  if (pathname.startsWith('/gallery')) {
    return {
      title: 'The Gallery · foreverknots · Wedding Photography, Kolkata',
      description:
        'The full foreverknots archive: pre-weddings, Bengali weddings, candid rituals, portraits and details, from Kolkata to Kashmir.',
      path: '/gallery',
      image: ogImage('hero-couple'),
    };
  }
  if (pathname.startsWith('/privacy')) {
    return {
      title: 'Privacy Policy · foreverknots',
      description:
        'How foreverknots collects, uses and protects the information you share through this site.',
      path: '/privacy',
      image: ogImage('hero-couple'),
    };
  }
  return {
    title: 'foreverknots · Wedding Photography, Kolkata',
    description: HOME_DESC,
    path: '/',
    image: ogImage('hero-couple'),
  };
}

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo() {
  const location = useLocation();
  const storyMatch = useMatch('/stories/:id');
  const storyId = storyMatch?.params.id;

  useEffect(() => {
    const { title, description, path, image } = metaFor(location.pathname, storyId);
    const url = INFO.site + path;
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertCanonical(url);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
  }, [location.pathname, storyId]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
    </>
  );
}
