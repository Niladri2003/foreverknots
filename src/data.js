/* All images live on Cloudinary in the `foreverknots` folder.
 * Store bare names here; URLs are built by utils/cloudinary.js. */

export const PHOTOS = [
  { id: "p05", cat: "candid",   title: "The Haldi, Danced",     place: "Kolkata · West Bengal",      year: "2024", ratio: 1.463, aspect: "landscape" },
  { id: "p18", cat: "wedding",  title: "The Bengali Bride",      place: "South Kolkata",              year: "2024", ratio: 1.500, aspect: "landscape" },
  { id: "p15", cat: "prewed",   title: "The Old Stairwell",      place: "North Kolkata Heritage",     year: "2024", ratio: 1.500, aspect: "landscape" },
  { id: "p14", cat: "candid",   title: "Haldi, Held High",       place: "Kolkata",       year: "2024", ratio: 1.437, aspect: "landscape" },
  { id: "p01", cat: "prewed",   title: "The Inner Courtyard",    place: "North Kolkata",              year: "2024", ratio: 1.500, aspect: "landscape" },
  { id: "p13", cat: "portrait", title: "Sunflower Promise",      place: "Hooghly Riverside",          year: "2025", ratio: 1.387, aspect: "landscape" },
  { id: "p03", cat: "prewed",   title: "Beside the Lake",        place: "Rabindra Sarobar",           year: "2024", ratio: 0.667, aspect: "portrait" },
  { id: "p10", cat: "portrait", title: "A Red Saree, Spun",      place: "Princep Ghat",               year: "2024", ratio: 0.667, aspect: "portrait" },
  { id: "p20", cat: "prewed",   title: "Green Shutters",         place: "Bowbazar Lane",              year: "2024", ratio: 0.667, aspect: "portrait" },
  { id: "p21", cat: "portrait", title: "Across the Wall",        place: "Varanasi · Uttar Pradesh",   year: "2025", ratio: 0.562, aspect: "portrait" },
  { id: "p09", cat: "prewed",   title: "Arms to the Sky",        place: "Ranchi Hills",               year: "2024", ratio: 1.500, aspect: "landscape" },
  { id: "p17", cat: "prewed",   title: "Among the Books",        place: "College Street",             year: "2024", ratio: 1.500, aspect: "landscape" },
  { id: "p12", cat: "portrait", title: "On the Ghat",            place: "Hooghly",                    year: "2025", ratio: 1.500, aspect: "landscape" },
  { id: "p22", cat: "candid",   title: "The Groom's Turmeric",   place: "Bhubaneswar",                year: "2024", ratio: 0.576, aspect: "portrait" },
  { id: "p23", cat: "detail",   title: "Rings, Reading",         place: "Studio Detail",              year: "2024", ratio: 1.500, aspect: "landscape" },
  { id: "p25", cat: "portrait", title: "Held, Laughing",         place: "Kolkata",                    year: "2024", ratio: 0.667, aspect: "portrait" },
  { id: "p04", cat: "prewed",   title: "Painted Walls",          place: "Kumartuli, Kolkata",         year: "2024", ratio: 0.672, aspect: "portrait" },
  { id: "p07", cat: "portrait", title: "Polka & Petals",         place: "Garden Studio",              year: "2024", ratio: 0.667, aspect: "portrait" },
  { id: "p02", cat: "portrait", title: "Lamp Light",             place: "After Hours",                year: "2024", ratio: 0.667, aspect: "portrait" },
  { id: "p24", cat: "portrait", title: "Eye to Eye",             place: "Kolkata",                    year: "2024", ratio: 1.500, aspect: "landscape" },
  { id: "p06", cat: "candid",   title: "Of Course It Mattered",  place: "Behala",                     year: "2024", ratio: 0.896, aspect: "portrait" },
  { id: "p08", cat: "prewed",   title: "Quiet Spectator",        place: "Kashmir",                    year: "2025", ratio: 1.500, aspect: "landscape" },
  { id: "p19", cat: "wedding",  title: "Noir Editorial",         place: "Studio Story",               year: "2024", ratio: 0.614, aspect: "portrait" },
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
  { id: "hero-veil",      alt: "Bride beneath a red veil, glowing in candlelight" },
  { id: "hero-bride",     alt: "Bride in a red Banarasi saree and gold jewellery", focus: "50% 17%" },
  { id: "hero-courtyard", portrait: "hero-courtyard-portrait", portraitOpts: { pad: true, ar: "0.57" }, alt: "Couple on the steps of a North Kolkata heritage mansion" },
  { id: "hero-grid",      alt: "Pritam & Priyanka, a pre-wedding story in red and white" },
];

export const STORIES = [
  {
    // Real photos wired in from the "yuganti & Shubham" folder — the existing
    // narrative already matched (Hooghly, sunflowers, the Howrah).
    // NOTE: folder is spelled "yuganti"; keeping existing "Yujanti"/id to avoid
    // breaking the /stories/yujanti-subham link — confirm the correct spelling.
    id: "yujanti-subham",
    couple: "Yujanti & Shubham",
    place: "Streets of Kolkata",
    when: "September 2025",
    type: "Pre-Wedding",
    cover: "/photos/yujanti-subham-04.jpg",
    excerpt: "A morning that began with mist on the Hooghly and ended with sunflowers in her hands, somewhere near the Howrah.",
    facts: [
      ["Couple", "Yujanti & Shubham"],
      ["Place",  "Princep Ghat, Kolkata"],
      ["Season", "Late Autumn, 2024"],
      ["Type",   "Pre-Wedding · Half Day"],
    ],
    narrative: [
      "We started before the city was properly awake. Yujanti wanted the Hooghly. Shubham wanted the bridge. They settled on both, on the same morning, in a single quiet hour of light before the boats came in.",
      "What I love about Kolkata in November is the haze. It softens everything. The iron of the Howrah, the steps of the ghat, even the pigeons that lift, perfectly on cue, when a couple decides to run. Yujanti laughed almost the entire time. Shubham watched her, mostly. I just stayed out of the way.",
    ],
    gallery: [
      "/photos/yujanti-subham-01.jpg",
      "/photos/yujanti-subham-02.jpg",
      "/photos/yujanti-subham-03.jpg",
      "/photos/yujanti-subham-04.jpg",
      "/photos/yujanti-subham-05.jpg",
    ],
  },
  // Avi & Rimpa — journal built from the "avi & rimpa" set. Images are served
  // locally from /public/photos for now; when they're uploaded to Cloudinary
  // under the same base names, drop the "/photos/…​.jpg" wrapper and use bare
  // ids ("avirimpa-01", …) to get responsive + face-aware delivery.
  // TODO(client): confirm the date, place and narrative below — drafted from the frames.
  {
    id: "avi-rimpa",
    couple: "Avi & Rimpa",
    place: "The Maidan & the old ghats, Kolkata",
    when: "June 2025",
    type: "Pre-Wedding",
    cover: "/photos/avirimpa-01.jpg",
    excerpt: "A slow afternoon across the city, from the shade of the Maidan to the worn steps of a ghat, ending with a bridal portrait in white and red on the grass.",
    facts: [
      ["Couple", "Avi & Rimpa"],
      ["Place",  "Maidan & the ghats, Kolkata"],
      ["Season", "Spring 2025"],
      ["Type",   "Pre-Wedding · Portraits"],
    ],
    narrative: [
      "We spent the day letting Kolkata do the work. Under the great tree on the Maidan, with the Victoria Memorial dissolving into the afternoon haze behind them, Avi and Rimpa mostly forgot the camera was there. That is usually when the good frames arrive: her looking at him, him looking back, the city getting on with itself all around.",
      "Later we walked to the ghats, where the light goes soft against the old blue-washed walls and someone is always resting in the shade. And then, the bridal portraits: the white-and-red Garad, the mukut catching the sun, a quiet minute on the grass. Two very different sides of the same couple, one long unhurried day.",
    ],
    gallery: [
      "/photos/avirimpa-01.jpg",
      "/photos/avirimpa-02.jpg",
      "/photos/avirimpa-03.jpg",
      "/photos/avirimpa-04.jpg",
      "/photos/avirimpa-05.jpg",
      "/photos/avirimpa-06.jpg",
    ],
  },
  // Prathama & Surajit — a Bengali wedding (haldi → bridal → the mandap).
  // Same local-passthrough setup as Avi & Rimpa; images in /public/photos.
  // TODO(client): confirm the date, place and narrative below — drafted from the frames.
  {
    id: "prathama-surajit",
    couple: "Prathama & Surajit",
    place: "Kolkata, West Bengal",
    when: "February 2025",
    type: "Wedding Day",
    cover: "/photos/prathama-surajit-01.jpg",
    excerpt: "A full Bengali wedding, from a marigold-and-turmeric haldi in dark glasses to the quiet of the mandap under a canopy of fairy lights.",
    facts: [
      ["Couple", "Prathama & Surajit"],
      ["Place",  "Kolkata, West Bengal"],
      ["Season", "February 2025"],
      ["Type",   "Full Wedding · Haldi to Mandap"],
    ],
    narrative: [
      "Some brides sit quietly through their haldi. Prathama wore sunglasses and caught the marigolds as they fell. The turmeric came by the bucket, the flowers came by the handful, and everyone — cousins in yellow, aunts throwing petals — was thoroughly in on it. It is my favourite kind of morning to photograph: nobody posing, everybody laughing.",
      "By evening the mood had turned. The mukut, the red Benarasi, the paan leaf held up at just the right moment, the long pause under the fairy lights before the vows. Surajit barely looked away from her. We kept the frames close and let the light and the gold do the rest.",
    ],
    gallery: [
      "/photos/prathama-surajit-01.jpg",
      "/photos/prathama-surajit-02.jpg",
      "/photos/prathama-surajit-03.jpg",
      "/photos/prathama-surajit-04.jpg",
      "/photos/prathama-surajit-05.jpg",
      "/photos/prathama-surajit-06.jpg",
    ],
  },
  // Arnab & Swagata — a reception under a rose canopy + a softer pre-wedding day.
  // Local-passthrough images in /public/photos. TODO(client): confirm date/place/copy.
  {
    id: "arnab-swagata",
    couple: "Arnab & Swagata",
    place: "Kolkata",
    when: "December 2025",
    type: "Reception",
    cover: "/photos/arnab-swagata-01.jpg",
    excerpt: "A reception under a canopy of roses and marigolds, and a quieter afternoon before it — bougainvillea, a painted neighbourhood wall, and no need to pose.",
    facts: [
      ["Couple", "Arnab & Swagata"],
      ["Place",  "Kolkata"],
      ["Season", "December 2025"],
      ["Type",   "Reception & Pre-Wedding"],
    ],
    narrative: [
      "The reception was all warmth: a navy suit, a green-and-magenta Benarasi heavy with gold, and a canopy of roses that turned every frame the colour of celebration. We worked close on this one — the watch, the mehndi, the half-second when they leaned their foreheads together and forgot the room was full.",
      "The afternoon before had been the opposite kind of quiet. Bougainvillea in bloom, a painted wall in the neighbourhood, the two of them laughing at something we never quite heard. Same couple, two tempos, one story.",
    ],
    gallery: [
      "/photos/arnab-swagata-01.jpg",
      "/photos/arnab-swagata-02.jpg",
      "/photos/arnab-swagata-03.jpg",
      "/photos/arnab-swagata-04.jpg",
      "/photos/arnab-swagata-05.jpg",
    ],
  },
  // Soumaydip & Arina — a pre-wedding inside a crumbling Bengal rajbari.
  // Local-passthrough images in /public/photos. TODO(client): confirm date/place/copy.
  {
    id: "soumaydip-arina",
    couple: "Soumaydip & Arina",
    place: "Chandanagar, Bengal",
    when: "December 2025",
    type: "Pre-Wedding",
    cover: "/photos/soumaydip-arina-02.jpg",
    excerpt: "An afternoon inside an old rajbari — peeling arches, alpona underfoot, and a slow spin across an empty courtyard.",
    facts: [
      ["Couple", "Soumaydip & Arina"],
      ["Place",  "A heritage rajbari, Bengal"],
      ["Season", "December 2025"],
      ["Type",   "Pre-Wedding · Half Day"],
    ],
    narrative: [
      "We had the whole rajbari to ourselves: cusped arches, walls peeling back a century at a time, faded om marks and an alpona someone had drawn on the courtyard floor. Arina's teal-and-mustard saree was the only bright thing for yards, and it made every arch feel built to frame her.",
      "Soumaydip is easy in front of a camera, which helps. We let them wander — a corner here, a doorway there — and then asked them to dance. The spin you see was one take. The house did the rest.",
    ],
    gallery: [
      "/photos/soumaydip-arina-01.jpg",
      "/photos/soumaydip-arina-02.jpg",
      "/photos/soumaydip-arina-03.jpg",
      "/photos/soumaydip-arina-04.jpg",
      "/photos/soumaydip-arina-05.jpg",
    ],
  },
  // sudipta & shaheli — a Kolkata pre-wedding: graffiti, the yellow taxi, the ferry, a rajbari after dark.
  // Local-passthrough images in /public/photos. TODO(client): confirm date/place/copy.
  {
    id: "sudipta-shaheli",
    couple: "Sudipta & Shaheli",
    place: "Kolkata",
    when: "December 2024",
    type: "Pre-Wedding",
    cover: "/photos/sudipta-shaheli-01.jpg",
    excerpt: "A love letter to Kolkata — a graffiti wall, a yellow Ambassador at College Street, a ferry on the Hooghly, and a rajbari lit up after dark.",
    facts: [
      ["Couple", "Sudipta & Shaheli"],
      ["Place",  "Across Kolkata"],
      ["Season", "December 2024"],
      ["Type",   "Pre-Wedding · Full Day"],
    ],
    narrative: [
      "We treated the city like a third character. A spray-painted wall in the morning, a black-and-white minute by the river as a ferry slid past, and then the yellow Ambassador at College Street — her framed in the window, books stacked behind, the whole of Kolkata in one pane of glass.",
      "After dark we moved indoors, to a rajbari lit only where it wanted to be: a single glowing window on a black façade, a checkerboard hall, a mirror doubling them among red flowers. Sudipta and Shaheli barely stopped laughing the entire day.",
    ],
    gallery: [
      "/photos/sudipta-shaheli-01.jpg",
      "/photos/sudipta-shaheli-02.jpg",
      "/photos/sudipta-shaheli-03.jpg",
      "/photos/sudipta-shaheli-04.jpg",
      "/photos/sudipta-shaheli-05.jpg",
      "/photos/sudipta-shaheli-06.jpg",
      "/photos/sudipta-shaheli-07.jpg",
    ],
  },
];

export const TESTIMONIALS = [
  {
    q: "We forgot the camera was there. Then the photos arrived and we recognised every feeling we'd had that day, and a few we'd missed.",
    a: "Yujanti & Shubham · Pre-Wedding, Kolkata",
  },
  {
    q: "Patient, quiet, somehow everywhere at once. Our Kolkata shoot felt like our story, not a generic postcard. We've already booked them for the wedding.",
    a: "Sudipta & Shaheli · Pre-Wedding, Kolkata",
  },
  {
    q: "Our parents cried looking at the bridal portrait. That is the highest review we know how to give.",
    a: "Prathama & Surajit · Bengali Wedding, Kolkata",
  },
  {
    q: "He photographed our grandmothers laughing together. That single frame is the most loved photograph in our home.",
    a: "Arnab & Swagata · Reception, Kolkata",
  },
];

export const PACKAGES = [
  {
    id: "intimate",
    name: "The Intimate",
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
    blurb: "Every ritual from mehendi to reception, with film.",
    features: [
      "Up to 4 events across 2-3 days",
      "2 photographers + 1 cinematographer",
      "800+ edited photographs",
      "3-5 min wedding film + teaser",
      "40-page 12×18″ archival heirloom album",
      "Complimentary pre-wedding session",
    ],
    featured: false,
  },
];

export const PACKAGES_NOTE =
  "Pre-wedding shoots available on their own or with any package · travel & stay at actuals outside Kolkata · a 30% advance reserves your date.";

export const FAQS = [
  {
    q: "How far in advance should we book?",
    a: "For winter dates (November-February) we are usually booked 6-9 months out. A 30% advance locks your date; we take a maximum of two weddings a week so every couple gets our full attention.",
  },
  {
    q: "When do we see our photographs?",
    a: "A sneak peek of 30-40 edited frames reaches you within a week. The full gallery arrives in 6-8 weeks, and the album about 3-4 weeks after you approve the selection.",
  },
  {
    q: "Do you travel outside Kolkata?",
    a: "Happily. Bhubaneswar, Ranchi, Varanasi and beyond. Travel and stay are billed at actuals on top of the package; destination weddings get a custom quote.",
  },
  {
    q: "Do you share RAW files?",
    a: "No. The edit is half the photograph. Every usable frame is colour-corrected and delivered; you will never feel short-changed on count.",
  },
  {
    q: "What are the albums like?",
    a: "Lay-flat 12×18″ books on archival matte paper, designed by us and proofed by you before print. Built to be passed down, not put away.",
  },
  {
    q: "Can we customise a package?",
    a: "Yes. Most couples start from The Signature and add events, an album, or a film. Tell us the shape of your days and we will send an exact quote in 24 hours.",
  },
  // {
  //   q: "Do you photograph non-Bengali weddings?",
  //   a: "Often. Marwari, Punjabi, Odia, Christian and court weddings so far. We arrive early, learn the rituals that matter to your family, and never interrupt one for a photo.",
  // },
];

export const INSTA_PHOTOS = ["p04", "p13", "p07", "p20", "p24", "p12", "p02", "p22"];

export const INFO = {
  brand: "foreverknots",
  site: "https://foreverknots.studio",
  basedIn: "Kolkata, India",
  serves: ["Kolkata", "Bhubaneswar", "Ranchi", "Varanasi", "Kashmir"],
  yearsActive: 5,
  weddingsDone: 80,
  cities: 12,
  email: "contact@foreverknots.studio",
  phone: "+91 83358 77977",
  instagram: "https://www.instagram.com/forever_knots__/",
  instagramHandle: "@forever_knots__",
  facebook: "https://www.facebook.com/profile.php?id=100092252460962",
  hours: "Mon-Sat · 11:00 - 19:00 IST",
};
