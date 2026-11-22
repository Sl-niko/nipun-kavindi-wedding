/* ═══════════════════════════════════════════════════
   DEMO INVITATIONS
   Each entry is one complete invitation. invite.html?demo=<key>
   renders it. A real customer order is just another entry like these
   (later: a row in the database).
═══════════════════════════════════════════════════ */

/* Demo dates are never hard-coded: the wedding is always next year,
   5 days before today's date, at the given time (e.g. viewed on
   1 Nov 2026 → 27 Oct 2027). Returns { date, dateText } for spreading. */
const DEMO_OFFSET_DAYS = -5;
const DEMO_DAY = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  d.setDate(d.getDate() + DEMO_OFFSET_DAYS);
  return d;
})();
const WEDDING_YEAR = DEMO_DAY.getFullYear();
function demoWhen(time) {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(DEMO_DAY);
  d.setHours(h, m, 0, 0);
  const dd = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'long' });
  return { date: d, dateText: `${dd}  ·  ${month}  ·  ${d.getFullYear()}` };
}
/* "1st December 2026"-style date a number of days before the wedding (RSVP deadlines) */
function daysBefore(n) {
  const d = new Date(DEMO_DAY);
  d.setDate(d.getDate() - n);
  const day = d.getDate();
  const ord = (day % 100 >= 11 && day % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th');
  return `${day}${ord} ${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`;
}

const SAMPLE_GALLERY = [
  { src: 'assets/images/c1.jpg', caption: 'A chapter of our story' },
  { src: 'assets/images/c2.jpg', caption: 'In the garden of our love', position: 'top' },
  { src: 'assets/images/c3.jpg', caption: 'The start of us' }
];

window.DEMOS = {
  perahara: {
    page: 'perahara.html',
    templateName: 'Royal Perahara',
    tagline: 'Lotus silk, a gold mandala and a marching perahara procession',
    category: 'Traditional', price: '7,500',
    theme: {
      bg: '#f7f1e6', bgHero: '#f7f1e6', card: '#fffbf4', alt: '#f3e9d8',
      text: '#3a1414', textMid: '#5e2a22', textSoft: '#8a6a5a',
      accent: '#7a1424', accentDark: '#560d19', accentPale: '#e3c98f', accentLight: '#f6e7c8',
      name: '#560d19', amp: '#b8892e'
    },
    art: {
      backdrop:  'assets/images/perahara/backdrop.webp',
      mandala:   'assets/images/perahara/mandala.svg',
      procLeft:  'assets/images/perahara/perahara-left.webp',
      procRight: 'assets/images/perahara/perahara-right.webp'
    },
    bride: 'Kavindi', groom: 'Nipun', monogram: 'K & N',
    greeting: 'Sri Suba Mangalam!', greetingSi: 'ශ්‍රී සුබ මංගලම්',
    parents: { bride: 'Mr. & Mrs. Perera', groom: 'Mr. & Mrs. Hewawasam' },
    ...demoWhen('08:30'), durationHours: 8,
    venue: { name: 'The Grand Kandyan', city: 'Kandy, Sri Lanka', mapQuery: 'The Grand Kandyan Hotel, Kandy',
             mapUrl: 'https://maps.google.com/?q=The+Grand+Kandyan+Kandy' },
    heroImage: 'assets/images/perahara/hero-couple.webp',
    storyTitle: 'Together Forever',
    story: {
      image: 'assets/images/perahara/lovestory.webp',
      text: 'We are delighted to invite you to celebrate the beginning of our forever as we exchange vows surrounded by our loved ones. Your presence will make our special day even more memorable.'
    },
    journey: [
      { year: '2019', title: 'The Beginning', text: 'Two paths crossed on an ordinary day, and somehow nothing felt ordinary after that.' },
      { year: '2021', title: 'Falling in Love', text: 'Long talks, shared dreams and a friendship that quietly became love.' },
      { year: '2025', title: 'The Proposal', text: 'One question, one answer, and a lifetime of yes.' },
      { year: String(WEDDING_YEAR), title: 'Forever Begins', text: 'Hand in hand on the Poruwa, surrounded by the people we love.' }
    ],
    events: [
      { title: 'Registration',    icon: 'fas fa-signature', time: '8:30 AM' },
      { title: 'Poruwa Ceremony', icon: 'fas fa-landmark',  time: '9:42 AM' },
      { title: 'Reception',       icon: 'fas fa-champagne-glasses', time: '12:30 PM' }
    ],
    gallery: SAMPLE_GALLERY,
    music: 'assets/music/music.mp3',
    contacts: [{ name: 'Nipun', phone: '077 000 0000', wa: '94770000000' },
               { name: 'Kavindi', phone: '071 000 0000', wa: '94710000000' }]
  },

  ariya: {
    page: 'ariya.html',
    templateName: 'Ariya Sinhala',
    tagline: 'Jasmine silk, forest green & gold with a perahara procession',
    category: 'Traditional', price: '5,000',
    theme: {
      bg: '#f7f2e7', card: '#fcf9f0', alt: '#f1e9d4',
      text: '#3f3b29', textMid: '#78704f', textSoft: '#9a9275',
      accent: '#2f5a45', accentDark: '#1f3e2f', accentPale: '#d3bd86', accentLight: '#eadfb8',
      name: '#2f5a45', amp: '#9c4a2f', gold: '#b49a55', label: '#8c7134'
    },
    art: {
      backdrop:  'assets/images/ariya/backdrop.webp',
      mandala:   'assets/images/perahara/mandala.svg',
      procLeft:  'assets/images/perahara/perahara-left.webp',
      procRight: 'assets/images/perahara/perahara-right.webp'
    },
    bride: 'Sanduni', groom: 'Ravindu', monogram: 'S & R',
    greeting: 'Sri Suba Mangalam!',
    parents: { bride: 'Mr. & Mrs. Rajapaksha', groom: 'Mr. & Mrs. Fernando' },
    ...demoWhen('08:30'), durationHours: 8,
    rsvpBy: daysBefore(11),
    venue: { name: 'Araliya Grand', city: 'Nuwara Eliya, Sri Lanka', town: 'Nuwara Eliya',
             mapQuery: 'Araliya Grand, Nuwara Eliya, Sri Lanka',
             mapUrl: 'https://www.google.com/maps/search/?api=1&query=Araliya%20Grand%2C%20Nuwara%20Eliya%2C%20Sri%20Lanka' },
    heroImage: 'assets/images/ariya/hero-couple.webp',
    storyTitle: 'Together Forever',
    story: {
      image: 'assets/images/ariya/lovestory.webp',
      text: 'We are delighted to invite you to celebrate the beginning of our forever as we exchange vows surrounded by our loved ones. Your presence will make our special day even more memorable.'
    },
    journey: [
      { year: String(WEDDING_YEAR - 7), title: 'The Beginning',    text: 'Two paths crossed on an ordinary day, and somehow nothing felt ordinary after that.' },
      { year: String(WEDDING_YEAR - 5), title: 'Growing Together', text: 'Through seasons of laughter and quiet moments alike, a friendship blossomed into something deeper.' },
      { year: String(WEDDING_YEAR - 3), title: 'The Promise',      text: 'Under a sky full of stars, one question changed everything, and the answer was yes.' },
      { year: String(WEDDING_YEAR - 1), title: 'Building a Home',  text: 'Side by side, we turned shared dreams into plans and plans into a life we cherish.' },
      { year: String(WEDDING_YEAR),     title: 'Forever Begins',   text: 'Now, surrounded by the people we love, we are ready for our most beautiful chapter yet: becoming husband and wife.' }
    ],
    events: [
      { title: 'Registration',    icon: 'fas fa-signature', time: '8:30 AM' },
      { title: 'Poruwa Ceremony', icon: 'fas fa-landmark',  time: '10:00 AM' }
    ],
    gallery: SAMPLE_GALLERY,
    music: 'assets/music/music.mp3',
    contacts: [{ name: 'Ravindu', phone: '077 000 0000', wa: '94770000000' },
               { name: 'Sanduni', phone: '071 000 0000', wa: '94710000000' }]
  },

  chapel: {
    page: 'chapel.html',
    templateName: 'Chapel Vows',
    tagline: 'Church doors that swing open, a rose window and a candlelit aisle',
    category: 'Church', price: '5,000',
    theme: {
      bg: '#f8f5ef', card: '#fcfaf6', alt: '#f0ebe0',
      text: '#3d3b36', textMid: '#77726a', textSoft: '#9a958c',
      accent: '#2b3440', accentDark: '#161c25', accentPale: '#d8c494', accentLight: '#efe3c4',
      name: '#2b3440', amp: '#8c3b44', gold: '#b79a5f', label: '#8c7238'
    },
    art: {
      backdrop:   'assets/images/chapel/backdrop.webp',
      roseWindow: 'assets/images/chapel/rose-window.webp',
      doorLeft:   'assets/images/chapel/door-left.webp',
      doorRight:  'assets/images/chapel/door-right.webp',
      aisleLeft:  'assets/images/chapel/aisle-left.webp',
      aisleRight: 'assets/images/chapel/aisle-right.webp'
    },
    bride: 'Shenali', groom: 'Rovan', monogram: 'S & R',
    greeting: 'Holy Matrimony',
    verse: 'Therefore what God has joined together, let no one separate.',
    parents: { bride: 'Mr. & Mrs. Perera', groom: 'Mr. & Mrs. Fernando' },
    ...demoWhen('08:30'), durationHours: 8,
    rsvpBy: daysBefore(11),
    venue: { name: 'St. Mary’s Church', city: 'Negombo, Sri Lanka', town: 'Negombo',
             mapQuery: 'St. Mary’s Church, Negombo, Sri Lanka',
             mapUrl: 'https://www.google.com/maps/search/?api=1&query=St.%20Mary%27s%20Church%2C%20Negombo%2C%20Sri%20Lanka' },
    heroImage: 'assets/images/chapel/hero-couple.webp',
    storyTitle: 'Two Hearts, One Faith',
    story: {
      image: 'assets/images/chapel/lovestory.webp',
      text: 'We are delighted to invite you to the church as we exchange our vows before God and the people we love. Your presence and your prayers will make our special day even more memorable.'
    },
    journey: [
      { year: String(WEDDING_YEAR - 7), title: 'The Beginning',    text: 'Two paths crossed on an ordinary day, and somehow nothing felt ordinary after that.' },
      { year: String(WEDDING_YEAR - 5), title: 'Growing Together', text: 'Through seasons of laughter and quiet moments alike, a friendship blossomed into something deeper.' },
      { year: String(WEDDING_YEAR - 3), title: 'The Promise',      text: 'Under a sky full of stars, one question changed everything, and the answer was yes.' },
      { year: String(WEDDING_YEAR - 1), title: 'Building a Home',  text: 'Side by side, we turned shared dreams into plans and plans into a life we cherish.' },
      { year: String(WEDDING_YEAR),     title: 'Forever Begins',   text: 'Now, surrounded by the people we love, we are ready for our most beautiful chapter yet: becoming husband and wife.' }
    ],
    events: [
      { title: 'Registration',  icon: 'fas fa-signature', time: '8:30 AM' },
      { title: 'Nuptial Mass',  icon: 'fas fa-church',    time: '10:00 AM' },
      { title: 'Reception',     icon: 'fas fa-champagne-glasses', time: '12:30 PM' }
    ],
    gallery: SAMPLE_GALLERY,
    music: 'assets/music/piano-cello.mp3',
    contacts: [{ name: 'Rovan', phone: '077 000 0000', wa: '94770000000' },
               { name: 'Shenali', phone: '071 000 0000', wa: '94710000000' }]
  },

  lotus: {
    page: 'lotus.html',            // bilingual: Sinhala by default, English via the සිං / EN switch
    templateName: 'Mandalaa Lotus',
    tagline: 'A bilingual සිංහල / English invitation with a gold mandala and lotus',
    category: 'Traditional', price: '7,500',
    theme: {
      bg: '#f5eedf', card: '#fcf8ee', band: '#eddfb8', text: '#5a4a33', textMid: '#8a7a60',
      gold: '#b98a2f', goldLight: '#d8b45f', goldDark: '#8c6420', cream: '#fdf8ec',
      // read by the landing and preview pages
      accent: '#8c6420', amp: '#d8b45f', accentLight: '#f3e6c4', cardTint: '#e9d3a0'
    },
    art: {
      mandala:  'assets/images/lotus/mandala-gold.svg',
      flourish: 'assets/images/lotus/lotus-flourish-gold.svg',
      pattern:  'assets/images/lotus/pattern.svg',
      texture:  'assets/images/lotus/texture.webp',
      grain:    'assets/images/lotus/grain.webp'
    },
    lang: 'si',
    bride: 'Sanuli', groom: 'Dinura', monogram: 'D & S',
    text: {
      si: {
        bride: 'සනුලි', groom: 'දිනුර',
        brideFamily: 'මහනුවර පදිංචි පෙරේරා මහතාගේ සහ එම මහත්මියගේ ආදරණීය දියණිය',
        groomFamily: 'ගම්පහ පදිංචි සිල්වා මහතාගේ සහ එම මහත්මියගේ ආදරණීය පුතු',
        venue: 'සිනමන් ලේක්සයිඩ් (කිංග්ස් කෝර්ට්)',
        address: 'අංක 115, සර් චිට්ටම්පලම් ඒ. ගාර්ඩිනර් මාවත, කොළඹ 02.'
      },
      en: {
        bride: 'Sanuli', groom: 'Dinura',
        brideFamily: 'Beloved daughter of\nMr. & Mrs. Perera of Kandy',
        groomFamily: 'Beloved son of\nMr. & Mrs. Silva of Gampaha',
        venue: 'Cinnamon Lakeside (King’s Court)',
        address: '115 Sir Chittampalam A. Gardiner Mawatha, Colombo 02.'
      }
    },
    ...demoWhen('09:30'), durationHours: 6,
    poruwaTime: '10:00',
    rsvpDaysBefore: 16,
    venue: { mapQuery: "Cinnamon Lakeside (King's Court), 115 Sir Chittampalam A. Gardiner Mawatha, Colombo 02",
             mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cinnamon%20Lakeside%20Colombo' },
    heroImage: 'assets/images/lotus/couple.webp',
    events: [
      { icon: 'fas fa-archway', time: '10:00',
        title: { si: 'මංගල උත්සවය සහ පෝරුවේ චාරිත්‍රය', en: 'Wedding & Poruwa Ceremony' },
        place: { si: 'සිනමන් ලේක්සයිඩ් කොළඹ – කිංග්ස් කෝර්ට් මංගල ශාලාව', en: 'Cinnamon Lakeside Colombo – King’s Court Ballroom' },
        label: { si: 'පෝරුවේ චාරිත්‍රය', en: 'Poruwa ceremony' },
        after: { si: 'ඉන් අනතුරුව මංගල භෝජන සංග්‍රහය', en: 'Followed by the wedding lunch' } }
    ],
    gallery: SAMPLE_GALLERY,
    introDrums: 'assets/music/intro-drums.mp3',
    music: 'assets/music/music.mp3',
    contacts: [{ name: { si: 'දිනුර', en: 'Dinura' }, phone: '071 638 2094' },
               { name: { si: 'සනුලි', en: 'Sanuli' }, phone: '077 245 1836' }]
  },

  ivory: {
    page: 'ivory.html',
    templateName: 'Ivory Seal',
    tagline: 'A wax-sealed envelope, gold-embossed peonies and arched portraits',
    category: 'Modern', price: '5,000',
    theme: {
      bg: '#fbf9f4', card: '#fffdf8', alt: '#f1eadf',
      text: '#463e36', textMid: '#837769', textSoft: '#a08f7d',
      accent: '#5a4d41', accentDark: '#4a3f35', accentPale: '#d6c196', accentLight: '#fbf7ef',
      name: '#5a4d41', amp: '#a98a4a', gold: '#a98a4a', button: '#76685a',
      cardTint: '#dccab0'   // landing-page card background (accentLight is too close to white)
    },
    art: {
      backdrop:        'assets/images/ivory/backdrop.webp',
      envelope:        'assets/images/ivory/envelope-closed.webp',
      envelopeVideo:   'assets/video/ivory-envelope-open.mp4',
      countdownFloral: 'assets/images/ivory/countdown-floral.webp',
      footerFloral:    'assets/images/ivory/footer-floral.webp'
    },
    bride: 'Hiruni', groom: 'Kavindu', monogram: 'H & K',
    parents: { bride: 'Mr. & Mrs. Sunil Wijesinghe', groom: 'Mr. & Mrs. Ranjith Fernando' },
    ...demoWhen('10:30'), durationHours: 6,
    rsvpBy: daysBefore(31),
    venue: { name: 'Cinnamon Grand Colombo', address: '77 Galle Road, Colombo 03, Sri Lanka',
             mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cinnamon%20Grand%20Colombo%2C%2077%20Galle%20Road%2C%20Colombo%2003' },
    heroImage: 'assets/images/ivory/couple-hero.webp',
    story: { image: 'assets/images/ivory/story.webp' },
    journey: [
      { year: String(WEDDING_YEAR - 8), title: 'First Met',      text: 'Two friends of friends at a birthday dinner in Colombo, and a conversation that never really ended.' },
      { year: String(WEDDING_YEAR - 5), title: 'The Adventure',  text: 'A misty morning in Nuwara Eliya, one shared umbrella, and the quiet realisation that this was it.' },
      { year: String(WEDDING_YEAR - 2), title: 'The Proposal',   text: 'At sunset on the Galle Fort ramparts, a question was asked and the easiest yes was given.' },
      { year: String(WEDDING_YEAR),     title: 'Forever Begins', text: 'And now, surrounded by everyone we love, we say I do.' }
    ],
    events: [
      { title: 'Poruwa Ceremony', icon: 'fas fa-ring', time: '10:30 AM', note: 'The traditional Poruwa ceremony in the Lotus Ballroom' },
      { title: 'Reception',       icon: 'fas fa-champagne-glasses', time: '12:30 PM', note: 'Lunch, toasts and dancing to follow' }
    ],
    dressCode: {
      title: 'Formal attire',
      text: 'We would love to see you in ivory, taupe, soft gold or champagne.',
      colors: ['#5a4d41', '#a08f7d', '#f7f3ec', '#d6c196', '#a98a4a']
    },
    gallery: SAMPLE_GALLERY,
    music: 'assets/music/piano-cello.mp3',
    contacts: [{ name: 'Hiruni', role: 'Bride', phone: '077 123 4567', wa: '94771234567' },
               { name: 'Kavindu', role: 'Groom', phone: '076 765 4321', wa: '94767654321' }]
  },

  sage: {
    page: 'ivory.html',            // same layout as Ivory Seal, sage colourway
    templateName: 'Sage Seal',
    tagline: 'A sage wax-sealed envelope, rose-gold peonies and arched portraits',
    category: 'Modern', price: '5,000',
    theme: {
      bg: '#f7f8f2', card: '#fffdf8', alt: '#e8ede4',
      text: '#33402e', textMid: '#5f6b57', textSoft: '#8a9a7b',
      accent: '#3f5038', accentDark: '#33402e', accentPale: '#d6c196', accentLight: '#f5f7f3',
      name: '#3f5038', amp: '#987a3e', gold: '#987a3e', button: '#66765a', shadow: 'rgba(48,60,40,.4)',
      bandA: '#d9e0cd', bandB: '#c3cdb4', footA: '#eef3eb', footB: '#d8e2d1', petal: '#e4eadf',
      cardTint: '#b9c8ab'   // landing-page card background
    },
    art: {
      backdrop:        'assets/images/sage/backdrop.webp',
      envelope:        'assets/images/sage/envelope-closed.webp',
      envelopeVideo:   'assets/video/sage-envelope-open.mp4',
      countdownFloral: 'assets/images/ivory/countdown-floral.webp',
      footerFloral:    'assets/images/ivory/footer-floral.webp'
    },
    bride: 'Nethmi', groom: 'Ravindu', monogram: 'N & R',
    parents: { bride: 'Mr. & Mrs. Nimal Perera', groom: 'Mr. & Mrs. Ajith Jayasinghe' },
    ...demoWhen('10:30'), durationHours: 6,
    rsvpBy: daysBefore(31),
    venue: { name: 'Waters Edge', address: '316 Ethul Kotte Road, Battaramulla, Sri Lanka',
             mapUrl: 'https://www.google.com/maps/search/?api=1&query=Waters%20Edge%2C%20316%20Ethul%20Kotte%20Road%2C%20Battaramulla' },
    heroImage: 'assets/images/ivory/couple-hero.webp',
    story: { image: 'assets/images/ivory/story.webp' },
    journey: [
      { year: String(WEDDING_YEAR - 8), title: 'First Met',      text: 'Two friends of friends at a birthday dinner in Colombo, and a conversation that never really ended.' },
      { year: String(WEDDING_YEAR - 5), title: 'The Adventure',  text: 'A misty morning in Nuwara Eliya, one shared umbrella, and the quiet realisation that this was it.' },
      { year: String(WEDDING_YEAR - 2), title: 'The Proposal',   text: 'At sunset on the Galle Fort ramparts, a question was asked and the easiest yes was given.' },
      { year: String(WEDDING_YEAR),     title: 'Forever Begins', text: 'And now, surrounded by everyone we love, we say I do.' }
    ],
    events: [
      { title: 'Poruwa Ceremony', icon: 'fas fa-ring', time: '10:30 AM', note: 'The traditional Poruwa ceremony by the lake' },
      { title: 'Reception',       icon: 'fas fa-champagne-glasses', time: '12:30 PM', note: 'Lunch, toasts and dancing to follow' }
    ],
    dressCode: {
      title: 'Garden formal',
      text: 'We would love to see you in the soft colours of our day: sage and moss greens, ivory and champagne.',
      colors: ['#4f5f45', '#9dae8f', '#f4efe3', '#d6c196', '#b9a58a']
    },
    gallery: SAMPLE_GALLERY,
    music: 'assets/music/piano-cello.mp3',
    contacts: [{ name: 'Nethmi', role: 'Bride', phone: '077 123 4567', wa: '94771234567' },
               { name: 'Ravindu', role: 'Groom', phone: '076 765 4321', wa: '94767654321' }]
  },

  celeste: {
    page: 'ivory.html',            // same layout as Ivory Seal, powder-blue colourway
    templateName: 'Celeste Seal',
    tagline: 'A pearl-white sealed envelope, powder blue & gold, arched portraits',
    category: 'Modern', price: '5,000',
    theme: {
      bg: '#f4f7fb', card: '#f9fbfe', alt: '#eef4fa',
      text: '#2e3c4a', textMid: '#5e6b7a', textSoft: '#7f8ea0',
      accent: '#344a60', accentDark: '#2b3d4e', accentPale: '#d4af37', accentLight: '#f9fbfe',
      name: '#344a60', amp: '#8c6d1f', gold: '#8c6d1f', button: '#566474', shadow: 'rgba(20,46,66,.4)',
      bandA: '#e2eaf3', bandB: '#cdd9e5', footA: '#e7eef4', footB: '#cbd7e3', petal: '#e5edf5',
      cardTint: '#c3d3e4'   // landing-page card background
    },
    art: {
      backdrop:        'assets/images/celeste/backdrop.webp',
      envelope:        'assets/images/celeste/envelope-closed.webp',
      envelopeVideo:   'assets/video/celeste-envelope-open.mp4',
      countdownFloral: 'assets/images/celeste/countdown-floral.webp',
      footerFloral:    'assets/images/celeste/footer-floral.webp'
    },
    bride: 'Hiruni', groom: 'Kavindu', monogram: 'H & K',
    parents: { bride: 'Mr. & Mrs. Sunil Wijesinghe', groom: 'Mr. & Mrs. Ranjith Fernando' },
    ...demoWhen('10:30'), durationHours: 6,
    rsvpBy: daysBefore(31),
    venue: { name: 'Cinnamon Grand Colombo', address: '77 Galle Road, Colombo 03, Sri Lanka',
             mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cinnamon%20Grand%20Colombo%2C%2077%20Galle%20Road%2C%20Colombo%2003' },
    heroImage: 'assets/images/ivory/couple-hero.webp',
    story: { image: 'assets/images/ivory/story.webp' },
    journey: [
      { year: String(WEDDING_YEAR - 8), title: 'First Met',      text: 'Two friends of friends at a birthday dinner in Colombo, and a conversation that never really ended.' },
      { year: String(WEDDING_YEAR - 5), title: 'The Adventure',  text: 'A misty morning in Nuwara Eliya, one shared umbrella, and the quiet realisation that this was it.' },
      { year: String(WEDDING_YEAR - 2), title: 'The Proposal',   text: 'At sunset on the Galle Fort ramparts, a question was asked and the easiest yes was given.' },
      { year: String(WEDDING_YEAR),     title: 'Forever Begins', text: 'And now, surrounded by everyone we love, we say I do.' }
    ],
    events: [
      { title: 'Poruwa Ceremony', icon: 'fas fa-ring', time: '10:30 AM', note: 'The traditional Poruwa ceremony in the Lotus Ballroom' },
      { title: 'Reception',       icon: 'fas fa-champagne-glasses', time: '12:30 PM', note: 'Lunch, toasts and dancing to follow' }
    ],
    dressCode: {
      title: 'Formal attire',
      text: 'We would love to see you in white, powder blue, silver or soft gold.',
      colors: ['#ffffff', '#e6f0fa', '#d9d9d9', '#d4af37', '#f7e6c4']
    },
    gallery: SAMPLE_GALLERY,
    music: 'assets/music/piano-cello.mp3',
    contacts: [{ name: 'Hiruni', role: 'Bride', phone: '077 123 4567', wa: '94771234567' },
               { name: 'Kavindu', role: 'Groom', phone: '076 765 4321', wa: '94767654321' }]
  },

  pink: {
    page: 'pink.html',
    templateName: 'Pink Watercolor',
    tagline: 'A paper envelope that opens to cherry blossoms and pink watercolour',
    category: 'Floral', price: '5,000',
    theme: {
      bg: '#fef5ef', blush: '#fce4e1', text: '#5b2e3f', rose: '#c75d6d', roseLight: '#d97585', gold: '#b8773d',
      // read by the landing and preview pages
      accent: '#c75d6d', amp: '#b8773d', accentLight: '#fce4e1', cardTint: '#f4c3cb'
    },
    art: {
      background:   'assets/images/pink/background.webp',
      sprigCorner:  'assets/images/pink/sprig-corner.svg',
      sprigCornerB: 'assets/images/pink/sprig-corner-b.svg',
      sprigBranch:  'assets/images/pink/sprig-branch.svg',
      sprigTall:    'assets/images/pink/sprig-tall.svg',
      envBack:      'assets/images/pink/env-back.webp',
      envFront:     'assets/images/pink/env-front.webp',
      envFlapOut:   'assets/images/pink/env-flap-out.webp',
      envFlapIn:    'assets/images/pink/env-flap-in.webp',
      letter:       'assets/images/pink/letter.webp',
      seal:         'assets/images/pink/seal.webp'
    },
    bride: 'Isabel', groom: 'Daniel', monogram: 'I & D',
    ...demoWhen('17:00'), durationHours: 6,
    rsvpBy: daysBefore(30),
    venue: { name: 'Rose Garden Estate', address: '123 Anywhere St., Any City',
             mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rose%20Garden%20Estate' },
    journey: [
      { year: String(WEDDING_YEAR - 4), title: 'How We Met',      text: 'A spring afternoon at a friend’s birthday – Daniel spilled his coffee, Isabel laughed first, the rest of the evening wrote itself.' },
      { year: String(WEDDING_YEAR - 2), title: 'Our First Trip',  text: 'Two backpacks, one Kyoto map and a thousand cherry blossoms. We walked until the lanterns came on and called it the best week of our lives.' },
      { year: String(WEDDING_YEAR - 1), title: 'The Proposal',    text: 'On a quiet veranda in late October, with the maples turning copper, Daniel asked the question we both already knew the answer to.' },
      { year: String(WEDDING_YEAR),     title: 'Saying I Do',     text: 'We choose each other in front of the people who shaped us – and we want you in that room. Bring your dancing shoes.' }
    ],
    events: [
      { title: 'Wedding Ceremony',  icon: 'fas fa-ring',        time: '5:00 PM', place: 'Rose Garden – North Lawn',
        note: 'An intimate exchange of vows beneath the cherry blossoms, followed by champagne under the lanterns.' },
      { title: 'Reception Dinner',  icon: 'fas fa-utensils',    time: '7:00 PM', place: 'Rose Garden – Conservatory',
        note: 'A long-table feast for our families – a four-course tasting menu and toasts from those who know us best.' },
      { title: 'Dancing & Dessert', icon: 'fas fa-music',       time: '9:30 PM', place: 'Rose Garden – Conservatory',
        note: 'The good music gets louder, the cake comes out, and we’d love you on the dance floor until the lights come up.' }
    ],
    gallery: SAMPLE_GALLERY,
    music: 'assets/music/piano-cello.mp3',
    contacts: [{ name: 'Isabel', phone: '077 123 4567' }, { name: 'Daniel', phone: '077 765 4321' }]
  },

  hydrangea: {
    page: 'hydrangea.html',        // no opening gate: the hero animates in, music starts on the first tap
    templateName: 'Hydrangea Lace',
    tagline: 'A lace doily over a hydrangea garden, dusty blue & black-and-white photos',
    category: 'Floral', price: '5,000',
    theme: {
      bg: '#f3ecdc', card: '#fcf8ee', ink: '#3d556e', blue: '#5a7a94', blueLight: '#7a96b0', pin: '#c9a96e',
      // read by the landing and preview pages
      accent: '#5a7a94', amp: '#c9a96e', accentLight: '#dfe7ee', cardTint: '#c5d4e1'
    },
    art: {
      backdrop: 'assets/images/hydrangea/hydrangea-backdrop.webp',
      doily:    'assets/images/hydrangea/lace-doily-floral.webp',
      paper:    'assets/images/hydrangea/paper-texture.webp'
    },
    bride: 'Lianna', groom: 'Nathan', monogram: 'L & N',
    ...demoWhen('16:00'), durationHours: 7,
    rsvpBy: daysBefore(30),
    venue: { name: 'Ragama Basilica Church', address: 'Tewatte Rd, Ragama, Sri Lanka',
             mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ragama%20Basilica%20Church' },
    reception: { title: 'The Reception', name: 'Waters Edge, Battaramulla', mapQuery: 'Waters Edge, Battaramulla, Sri Lanka',
                 mapUrl: 'https://maps.google.com/maps?q=Waters+Edge+Battaramulla' },
    storyPhotos: ['assets/images/hydrangea/story-photo-1.webp', 'assets/images/hydrangea/story-photo-2.webp'],
    story: 'Lianna and Nathan’s story began with a shared reach for a vintage camera at a sun-drenched flea market. What started as a polite tug-of-war quickly dissolved into a playful debate about film grain and the best hidden corners of the city. By the time the sun dipped below the horizon, they realised they hadn’t just found a new hobby; they had found each other.',
    schedule: [
      { time: '3:30 PM', event: 'Guest Arrival',      icon: 'fas fa-door-open' },
      { time: '4:00 PM', event: 'Ceremony',           icon: 'fas fa-church' },
      { time: '4:30 PM', event: 'Cocktail Hour',      icon: 'fas fa-martini-glass' },
      { time: '5:00 PM', event: 'Reception',          icon: 'fas fa-utensils' },
      { time: '7:00 PM', event: 'Dancing',            icon: 'fas fa-music' },
      { time: '9:00 PM', event: 'Late Night Snacks',  icon: 'fas fa-cookie-bite' }
    ],
    gallery: SAMPLE_GALLERY,
    music: 'assets/music/piano-cello.mp3',
    contacts: [{ name: 'Nathan', phone: '+94 77 765 4321' }, { name: 'Lianna', phone: '+94 77 123 4567' }]
  },

  lovegate: {
    page: 'lovegate.html',         // no opening gate: a looping garden video hero, music starts on the first tap
    templateName: 'Love Gate',
    tagline: 'A painted palace garden that moves, with editorial stationery details',
    category: 'Modern', price: '7,500',
    theme: {
      bg: '#fbf6ec', sand: '#f1e5cc', ink: '#3d2517', brown: '#7a5a40',
      wine: '#8b3b47', wineLight: '#a8485a', rose: '#c46a78', gold: '#9b7b48',
      // read by the landing and preview pages
      accent: '#8b3b47', amp: '#9b7b48', accentLight: '#f1e5cc', cardTint: '#e7c9b8'
    },
    art: { heroVideo: 'assets/video/lovegate-hero.mp4' },
    bride: 'Sophia', groom: 'Marcus', monogram: 'S & M',
    ...demoWhen('17:00'), durationHours: 6,
    rsvpBy: daysBefore(30),
    venue: { name: 'The Grand Pavilion', address: 'Galle Face Hotel, Colombo 03, Sri Lanka',
             mapUrl: 'https://maps.google.com/maps?q=The%20Grand%20Pavilion%2C%20Galle%20Face%20Hotel%2C%20Colombo%2003' },
    journey: [
      { year: String(WEDDING_YEAR - 7), title: 'The First Look', text: 'A New Year’s Eve party. A glance across a crowded room. The kind of moment you don’t realise is a beginning until much later.' },
      { year: String(WEDDING_YEAR - 5), title: 'Becoming Us',    text: 'Sunday morning markets, long drives with no destination, the slow private discovery that we’d already chosen each other long before we said it out loud.' },
      { year: String(WEDDING_YEAR - 2), title: 'The Yes',        text: 'A rooftop overlooking the harbour, a velvet box that had been waiting six months, and the answer that was never in doubt.' },
      { year: String(WEDDING_YEAR),     title: 'The Love Gate',  text: 'Today, with the people we love most, we step into the rest of our lives together. Thank you for being part of the room when it begins.' }
    ],
    events: [
      { title: 'Ceremony',      icon: 'fas fa-ring',           time: '5:00 PM', place: 'Garden Pavilion', note: 'An exchange of vows under a late-summer sky.' },
      { title: 'Cocktail Hour', icon: 'fas fa-martini-glass',  time: '6:30 PM', place: 'Terrace Lounge',  note: 'Champagne, canapés and the long golden hour.' },
      { title: 'Reception',     icon: 'fas fa-champagne-glasses', time: '7:30 PM', place: 'Grand Ballroom', note: 'Dinner, dancing and the night you’ll talk about for years.' }
    ],
    gallery: SAMPLE_GALLERY,
    music: 'assets/music/piano-cello.mp3',
    contacts: [{ name: 'Sophia', phone: '+94 77 123 4567' }, { name: 'Marcus', phone: '+94 77 765 4321' }]
  }

};
