export const PHOTOS = [
  { src: "/photos/p05.jpg", cat: "prewed",   title: "By the Howrah",         place: "Kolkata · West Bengal",      year: "2024", aspect: "portrait" },
  { src: "/photos/p18.jpg", cat: "wedding",  title: "The Bengali Bride",      place: "South Kolkata",              year: "2024", aspect: "landscape" },
  { src: "/photos/p15.jpg", cat: "prewed",   title: "The Old Stairwell",      place: "North Kolkata Heritage",     year: "2024", aspect: "landscape" },
  { src: "/photos/p14.jpg", cat: "candid",   title: "Haldi, Held High",       place: "Bhubaneswar · Odisha",       year: "2024", aspect: "landscape" },
  { src: "/photos/p01.jpg", cat: "prewed",   title: "The Inner Courtyard",    place: "North Kolkata",              year: "2024", aspect: "landscape" },
  { src: "/photos/p13.jpg", cat: "portrait", title: "Sunflower Promise",      place: "Hooghly Riverside",          year: "2025", aspect: "portrait" },
  { src: "/photos/p03.jpg", cat: "prewed",   title: "Beside the Lake",        place: "Rabindra Sarobar",           year: "2024", aspect: "portrait" },
  { src: "/photos/p10.jpg", cat: "portrait", title: "A Red Saree, Spun",      place: "Princep Ghat",               year: "2024", aspect: "portrait" },
  { src: "/photos/p20.jpg", cat: "prewed",   title: "Green Shutters",         place: "Bowbazar Lane",              year: "2024", aspect: "portrait" },
  { src: "/photos/p21.jpg", cat: "portrait", title: "Across the Wall",        place: "Varanasi · Uttar Pradesh",   year: "2025", aspect: "landscape" },
  { src: "/photos/p09.jpg", cat: "prewed",   title: "Arms to the Sky",        place: "Ranchi Hills",               year: "2024", aspect: "landscape" },
  { src: "/photos/p17.jpg", cat: "prewed",   title: "Among the Books",        place: "College Street",             year: "2024", aspect: "landscape" },
  { src: "/photos/p12.jpg", cat: "portrait", title: "On the Ghat",            place: "Hooghly",                    year: "2025", aspect: "landscape" },
  { src: "/photos/p22.jpg", cat: "candid",   title: "The Groom's Turmeric",   place: "Bhubaneswar",                year: "2024", aspect: "portrait" },
  { src: "/photos/p23.jpg", cat: "detail",   title: "Rings, Reading",         place: "Studio Detail",              year: "2024", aspect: "landscape" },
  { src: "/photos/p25.jpg", cat: "portrait", title: "Held, Laughing",         place: "Kolkata",                    year: "2024", aspect: "landscape" },
  { src: "/photos/p04.jpg", cat: "prewed",   title: "Painted Walls",          place: "Kumartuli, Kolkata",         year: "2024", aspect: "portrait" },
  { src: "/photos/p07.jpg", cat: "portrait", title: "Polka & Petals",         place: "Garden Studio",              year: "2024", aspect: "portrait" },
  { src: "/photos/p02.jpg", cat: "portrait", title: "Lamp Light",             place: "After Hours",                year: "2024", aspect: "portrait" },
  { src: "/photos/p24.jpg", cat: "portrait", title: "Eye to Eye",             place: "Kolkata",                    year: "2024", aspect: "portrait" },
  { src: "/photos/p06.jpg", cat: "candid",   title: "Of Course It Mattered",  place: "Behala",                     year: "2024", aspect: "landscape" },
  { src: "/photos/p08.jpg", cat: "prewed",   title: "Quiet Spectator",        place: "Kashmir",                    year: "2025", aspect: "landscape" },
  { src: "/photos/p19.jpg", cat: "wedding",  title: "Noir Editorial",         place: "Studio Story",               year: "2024", aspect: "portrait" },
];

export const FILTERS = [
  { id: "all",      label: "All Work" },
  { id: "prewed",   label: "Pre-Wedding" },
  { id: "wedding",  label: "Weddings" },
  { id: "candid",   label: "Candid & Rituals" },
  { id: "portrait", label: "Portraits" },
  { id: "detail",   label: "Details" },
];

export const STORIES = [
  {
    id: "howrah",
    couple: "Aditi & Soumya",
    place: "Princep Ghat · Kolkata",
    when: "November 2024",
    type: "Pre-Wedding",
    cover: "/photos/p05.jpg",
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
    gallery: ["/photos/p05.jpg", "/photos/p10.jpg", "/photos/p21.jpg", "/photos/p09.jpg", "/photos/p25.jpg"],
  },
  {
    id: "northkol",
    couple: "Rashmi & Aniket",
    place: "North Kolkata Heritage Home",
    when: "Spring 2024",
    type: "Pre-Wedding",
    cover: "/photos/p15.jpg",
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
    gallery: ["/photos/p15.jpg", "/photos/p01.jpg", "/photos/hero-couple.jpg", "/photos/p25.jpg", "/photos/p23.jpg"],
  },
  {
    id: "bengali",
    couple: "Priyanka & Sourav",
    place: "South Kolkata",
    when: "December 2024",
    type: "Wedding Day",
    cover: "/photos/p18.jpg",
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
    gallery: ["/photos/p18.jpg", "/photos/p14.jpg", "/photos/p22.jpg", "/photos/p02.jpg"],
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
