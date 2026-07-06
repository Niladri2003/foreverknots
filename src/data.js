/* All images live on Cloudinary in the `foreverknots` folder.
 * Store bare names here; URLs are built by utils/cloudinary.js. */

export const PHOTOS = [
  { id: "p05", cat: "prewed",   title: "By the Howrah",         place: "Kolkata · West Bengal",      year: "2024", aspect: "portrait" },
  { id: "p18", cat: "wedding",  title: "The Bengali Bride",      place: "South Kolkata",              year: "2024", aspect: "landscape" },
  { id: "p15", cat: "prewed",   title: "The Old Stairwell",      place: "North Kolkata Heritage",     year: "2024", aspect: "landscape" },
  { id: "p14", cat: "candid",   title: "Haldi, Held High",       place: "Bhubaneswar · Odisha",       year: "2024", aspect: "landscape" },
  { id: "p01", cat: "prewed",   title: "The Inner Courtyard",    place: "North Kolkata",              year: "2024", aspect: "landscape" },
  { id: "p13", cat: "portrait", title: "Sunflower Promise",      place: "Hooghly Riverside",          year: "2025", aspect: "portrait" },
  { id: "p03", cat: "prewed",   title: "Beside the Lake",        place: "Rabindra Sarobar",           year: "2024", aspect: "portrait" },
  { id: "p10", cat: "portrait", title: "A Red Saree, Spun",      place: "Princep Ghat",               year: "2024", aspect: "portrait" },
  { id: "p20", cat: "prewed",   title: "Green Shutters",         place: "Bowbazar Lane",              year: "2024", aspect: "portrait" },
  { id: "p21", cat: "portrait", title: "Across the Wall",        place: "Varanasi · Uttar Pradesh",   year: "2025", aspect: "landscape" },
  { id: "p09", cat: "prewed",   title: "Arms to the Sky",        place: "Ranchi Hills",               year: "2024", aspect: "landscape" },
  { id: "p17", cat: "prewed",   title: "Among the Books",        place: "College Street",             year: "2024", aspect: "landscape" },
  { id: "p12", cat: "portrait", title: "On the Ghat",            place: "Hooghly",                    year: "2025", aspect: "landscape" },
  { id: "p22", cat: "candid",   title: "The Groom's Turmeric",   place: "Bhubaneswar",                year: "2024", aspect: "portrait" },
  { id: "p23", cat: "detail",   title: "Rings, Reading",         place: "Studio Detail",              year: "2024", aspect: "landscape" },
  { id: "p25", cat: "portrait", title: "Held, Laughing",         place: "Kolkata",                    year: "2024", aspect: "landscape" },
  { id: "p04", cat: "prewed",   title: "Painted Walls",          place: "Kumartuli, Kolkata",         year: "2024", aspect: "portrait" },
  { id: "p07", cat: "portrait", title: "Polka & Petals",         place: "Garden Studio",              year: "2024", aspect: "portrait" },
  { id: "p02", cat: "portrait", title: "Lamp Light",             place: "After Hours",                year: "2024", aspect: "portrait" },
  { id: "p24", cat: "portrait", title: "Eye to Eye",             place: "Kolkata",                    year: "2024", aspect: "portrait" },
  { id: "p06", cat: "candid",   title: "Of Course It Mattered",  place: "Behala",                     year: "2024", aspect: "landscape" },
  { id: "p08", cat: "prewed",   title: "Quiet Spectator",        place: "Kashmir",                    year: "2025", aspect: "landscape" },
  { id: "p19", cat: "wedding",  title: "Noir Editorial",         place: "Studio Story",               year: "2024", aspect: "portrait" },
];

export const FILTERS = [
  { id: "all",      label: "All Work" },
  { id: "prewed",   label: "Pre-Wedding" },
  { id: "wedding",  label: "Weddings" },
  { id: "candid",   label: "Candid & Rituals" },
  { id: "portrait", label: "Portraits" },
  { id: "detail",   label: "Details" },
];

export const HERO_SLIDES = [
  { id: "hero-couple", alt: "Couple at dusk, wrapped in warm light" },
  { id: "p18",         alt: "Bengali bride in gold against candlelight" },
  { id: "p05",         alt: "Couple running near the Howrah Bridge" },
  { id: "p15",         alt: "Couple on a heritage stairwell, North Kolkata" },
  { id: "p10",         alt: "A red saree spun at Princep Ghat" },
];

export const STORIES = [
  {
    id: "howrah",
    couple: "Aditi & Soumya",
    place: "Princep Ghat · Kolkata",
    when: "November 2024",
    type: "Pre-Wedding",
    cover: "p05",
    excerpt: "A morning that began with mist on the Hooghly and ended with sunflowers in her hands, somewhere near the Howrah.",
    facts: [
      ["Couple", "Aditi & Soumya"],
      ["Place",  "Princep Ghat, Kolkata"],
      ["Season", "Late Autumn, 2024"],
      ["Type",   "Pre-Wedding · Half Day"],
    ],
    narrative: [
      "We started before the city was properly awake. Aditi wanted the Hooghly. Soumya wanted the bridge. They settled on both, on the same morning, in a single quiet hour of light before the boats came in.",
      "What I love about Kolkata in November is the haze. It softens everything — the iron of the Howrah, the steps of the ghat, even the pigeons that lift, perfectly on cue, when a couple decides to run. Aditi laughed almost the entire time. Soumya watched her, mostly. I just stayed out of the way.",
    ],
    gallery: ["p05", "p10", "p21", "p09", "p25"],
  },
  {
    id: "northkol",
    couple: "Rashmi & Aniket",
    place: "North Kolkata Heritage Home",
    when: "Spring 2024",
    type: "Pre-Wedding",
    cover: "p15",
    excerpt: "An afternoon inside a 19th-century rajbari — peeling walls, cast-iron stairs, a saree the colour of stained glass.",
    facts: [
      ["Couple", "Rashmi & Aniket"],
      ["Place",  "North Kolkata"],
      ["Season", "Spring 2024"],
      ["Type",   "Pre-Wedding · Full Day"],
    ],
    narrative: [
      "Rashmi grew up nearby. Her grandfather lived in a similar house — same courtyard, same wrought-iron banisters that have been sounding the same notes for a century. She wanted the kind of photographs you find in a grandparent's drawer, then forget you have, then rediscover.",
      "Aniket, characteristically, said: whatever Rashmi wants. We made the pictures slowly. A long lunch in between. The light turned amber by four. By then the house felt like a third person in the room.",
    ],
    gallery: ["p15", "p01", "hero-couple", "p25", "p23"],
  },
  {
    id: "bengali",
    couple: "Priyanka & Sourav",
    place: "South Kolkata",
    when: "December 2024",
    type: "Wedding Day",
    cover: "p18",
    excerpt: "A traditional Bengali wedding — gold against red, the topor catching candlelight, and a haldi morning that was mostly noise and laughter.",
    facts: [
      ["Couple", "Priyanka & Sourav"],
      ["Place",  "South Kolkata"],
      ["Season", "December 2024"],
      ["Type",   "Full Wedding · Two Days"],
    ],
    narrative: [
      "Two days, one family, and approximately four hundred opinions about how the haldi should be poured. I love a Bengali wedding for exactly this reason — nobody is performing for the camera because nobody has time. There is always a cousin to find, a flower to fix, an aunt to feed.",
      "We photographed the haldi from low angles, the sehnai players from across the courtyard, the sindoor at the closest distance Priyanka would allow. The bridal portrait you see here was taken in the half-second before she was called away. I think it's the best frame of the year.",
    ],
    gallery: ["p18", "p14", "p22", "p02"],
  },
];

export const TESTIMONIALS = [
  {
    q: "We forgot the camera was there. Then the photos arrived and we recognised every feeling we'd had that day — and a few we'd missed.",
    a: "Aditi & Soumya · Pre-Wedding, Kolkata",
  },
  {
    q: "Patient, quiet, somehow everywhere at once. The Howrah shoot felt like our story, not a generic Kolkata postcard. We've already booked them for the wedding.",
    a: "Rashmi & Aniket · North Kolkata",
  },
  {
    q: "Our parents cried looking at the bridal portrait. That is the highest review we know how to give.",
    a: "Priyanka & Sourav · Bengali Wedding, December 2024",
  },
  {
    q: "He photographed our grandmothers laughing together. That single frame is the most loved photograph in our home.",
    a: "Meera & Vikram · Bhubaneswar",
  },
];

export const PACKAGES = [
  {
    id: "intimate",
    name: "The Intimate",
    price: "₹45,000",
    priceNote: "starting at",
    blurb: "For registry days, small ceremonies and single events.",
    features: [
      "One event · up to 6 hours",
      "1 lead candid photographer",
      "250+ edited photographs",
      "Private online gallery · 4-week delivery",
      "Sneak peek of 30 frames within a week",
    ],
    featured: false,
  },
  {
    id: "signature",
    name: "The Signature",
    price: "₹95,000",
    priceNote: "starting at",
    blurb: "Two days of the wedding, told end to end.",
    features: [
      "Haldi / mehendi + wedding day · 2 days",
      "2 candid photographers",
      "500+ edited photographs",
      "60-second cinematic reel",
      "Sneak peek in a week · full gallery in 6 weeks",
    ],
    featured: true,
    tag: "Most chosen",
  },
  {
    id: "grand",
    name: "The Grand",
    price: "₹1,75,000",
    priceNote: "from",
    blurb: "Every ritual, mehendi to reception — with film.",
    features: [
      "Up to 4 events across 2–3 days",
      "2 photographers + 1 cinematographer",
      "800+ edited photographs",
      "3–5 min wedding film + teaser",
      "40-page 12×18″ archival heirloom album",
      "Complimentary pre-wedding session",
    ],
    featured: false,
  },
];

export const PACKAGES_NOTE =
  "Pre-wedding shoots from ₹25,000 · travel & stay at actuals outside Kolkata · 30% advance reserves your date · GST as applicable.";

export const FAQS = [
  {
    q: "How far in advance should we book?",
    a: "For winter dates (November–February) we are usually booked 6–9 months out. A 30% advance locks your date; we take a maximum of two weddings a week so every couple gets our full attention.",
  },
  {
    q: "When do we see our photographs?",
    a: "A sneak peek of 30–40 edited frames reaches you within a week. The full gallery arrives in 6–8 weeks, and the album about 3–4 weeks after you approve the selection.",
  },
  {
    q: "Do you travel outside Kolkata?",
    a: "Happily — Bhubaneswar, Ranchi, Varanasi and beyond. Travel and stay are billed at actuals on top of the package; destination weddings get a custom quote.",
  },
  {
    q: "Do you share RAW files?",
    a: "No — the edit is half the photograph. Every usable frame is colour-corrected and delivered; you will never feel short-changed on count.",
  },
  {
    q: "What are the albums like?",
    a: "Lay-flat 12×18″ books on archival matte paper, designed by us and proofed by you before print. Built to be passed down, not put away.",
  },
  {
    q: "Can we customise a package?",
    a: "Yes. Most couples start from The Signature and add events, an album, or a film. Tell us the shape of your days and we will send an exact quote in 24 hours.",
  },
  {
    q: "Do you photograph non-Bengali weddings?",
    a: "Often — Marwari, Punjabi, Odia, Christian and court weddings so far. We arrive early, learn the rituals that matter to your family, and never interrupt one for a photo.",
  },
];

export const INSTA_PHOTOS = ["p04", "p13", "p07", "p20", "p24", "p12", "p02", "p22"];

export const INFO = {
  brand: "foreverknots",
  basedIn: "Kolkata, India",
  serves: ["Kolkata", "Bhubaneswar", "Ranchi", "Varanasi", "Kashmir"],
  yearsActive: 5,
  weddingsDone: 80,
  cities: 12,
  email: "hello@foreverknots.in",
  phone: "+91 98000 00000",
  instagram: "https://www.instagram.com/forever_knots__/",
  instagramHandle: "@forever_knots__",
  facebook: "#",
  hours: "Mon–Sat · 11:00 – 19:00 IST",
};
