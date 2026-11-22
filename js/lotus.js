/* ── Load config: lotus.html?demo=lotus&guest=Mr+%26+Mrs+Silva[&lang=en][&preview=1][&autoscroll=1] ── */
const params    = new URLSearchParams(location.search);
const PREVIEW   = params.get('preview') === '1';
const AUTOPLAY  = params.get('autoscroll') === '1';
const cfg       = window.DEMOS[params.get('demo')] || window.DEMOS.lotus;
const art       = cfg.art;
const guestName = params.get('guest');

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Theme ── */
const themeVars = {
  bg:'--bg', card:'--card', band:'--band', text:'--text', textMid:'--text-mid',
  gold:'--gold', goldLight:'--gold-light', goldDark:'--gold-dark', cream:'--cream'
};
Object.entries(cfg.theme).forEach(([k, v]) => themeVars[k] && document.documentElement.style.setProperty(themeVars[k], v));
const abs = p => new URL(p, location.href).href;   // url() inside a custom property would resolve against css/, not the page
document.documentElement.style.setProperty('--pattern', `url('${abs(art.pattern)}')`);
document.documentElement.style.setProperty('--grain', `url('${abs(art.grain)}')`);
if (PREVIEW) [document.documentElement, document.body].forEach(el => el.classList.add('is-preview'));
if (window.self !== window.top) document.documentElement.classList.add('in-frame');

/* ── Language: ?lang= → the guest's last choice → the couple's default ── */
const LANGS = ['si', 'en'];
let lang = params.get('lang');
if (!LANGS.includes(lang)) { try { lang = localStorage.getItem('lotus-lang'); } catch (_) {} }
if (!LANGS.includes(lang)) lang = cfg.lang || 'si';

/* ── Dates (formatted per language) ── */
const when = new Date(cfg.date);
const end  = new Date(when.getTime() + (cfg.durationHours || 6) * 36e5);
const SI_MONTHS = ['ජනවාරි','පෙබරවාරි','මාර්තු','අප්‍රේල්','මැයි','ජූනි','ජූලි','අගෝස්තු','සැප්තැම්බර්','ඔක්තෝබර්','නොවැම්බර්','දෙසැම්බර්'];
const SI_DAYS   = ['ඉරිදා','සඳුදා','අඟහරුවාදා','බදාදා','බ්‍රහස්පතින්දා','සිකුරාදා','සෙනසුරාදා'];
const month   = d => lang === 'si' ? SI_MONTHS[d.getMonth()] : d.toLocaleString('en-US', { month: 'long' });
const weekday = d => lang === 'si' ? SI_DAYS[d.getDay()] : d.toLocaleString('en-US', { weekday: 'long' });
const longDate = d => lang === 'si'
  ? `${d.getFullYear()} ${month(d)} ${d.getDate()} ${weekday(d)}`
  : `${weekday(d)}, ${d.getDate()} ${month(d)} ${d.getFullYear()}`;
/* "09:30" or a Date → "පෙ.ව. 9.30" / "9:30 AM" */
function clock(t) {
  const [h, m] = t instanceof Date ? [t.getHours(), t.getMinutes()] : t.split(':').map(Number);
  const h12 = h % 12 || 12, mm = String(m).padStart(2, '0');
  return lang === 'si' ? `${h < 12 ? 'පෙ.ව.' : 'ප.ව.'} ${h12}.${mm}` : `${h12}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
}
const DOTS_DATE = `${String(when.getDate()).padStart(2, '0')} . ${String(when.getMonth() + 1).padStart(2, '0')} . ${String(when.getFullYear()).slice(2)}`;
const rsvpDeadline = cfg.rsvpDaysBefore ? new Date(when.getTime() - cfg.rsvpDaysBefore * 864e5) : null;

/* ── Fixed wording; the couple's own words come from cfg.text[lang] ── */
const UI = {
  si: {
    welcome: 'සාදර ඇරයුමයි !', and: 'සහ', open: 'විවෘත කරන්න', dear: n => `ආදරණීය ${n},`,
    occasion: 'චාරිත්‍රානුකූලව අතිනත ගැනීමේ ප්‍රීතිය නිමිත්තෙන්',
    atVenue: 'හෝටල් පරිශ්‍රයේ දී පැවැත්වෙන මංගල උත්සවයට', invite: 'ඔබව අපි ගෞරවයෙන් ආරාධනා කරන්නෙමු.',
    poruwa: t => `(පෝරුවේ චාරිත්‍ර ${t} ට)`, range: (a, b) => `${a} සිට ${b} දක්වා`, at: t => `${t} ට`,
    cdTitle: 'සුබ මොහොත එළඹෙන තුරු', units: ['දින', 'පැය', 'මිනිත්තු', 'තත්පර'],
    evTitle: 'උත්සව විස්තර', std: 'දිනය සුරකින්න', stdSub: 'ඔබගේ දින දර්ශනයට එක් කරන්න',
    galTitle: 'ඡායාරූප එකතුව', venueTitle: 'උත්සව ස්ථානය', venue: 'උත්සව ස්ථානය', map: 'සිතියමෙන් බලන්න',
    rsvpTitle: 'පැමිණීම දන්වන්න', rsvpNote: 'ඔබගේ පැමිණීම අපට මහත් සතුටකි. කරුණාකර කලින් දන්වන්න.',
    rsvpBy: d => `ඔබගේ පැමිණීම ${d} දිනට පෙර කරුණාකර දන්වන්න`,
    name: 'සම්පූර්ණ නම', namePh: 'ඔබගේ නම', attend: 'සහභාගි වෙනවාද?', yes: 'සතුටින් සහභාගි වෙමි', no: 'සහභාගි විය නොහැක',
    count: 'පැමිණෙන ගණන', send: 'පිළිතුර යවන්න',
    thanksYes: n => `ස්තූතියි ${n}! ඔබව හමුවීමට අපි බලාපොරොත්තු වෙමු 🪷`, thanksNo: n => `දැනුම් දීමට ස්තූතියි ${n} 🤍`,
    footer: 'ආදරයෙන්, දෙපවුලේ ආරාධනයයි'
  },
  en: {
    welcome: 'You are warmly invited!', and: '&', open: 'Open Invitation', dear: n => `Dear ${n},`,
    occasion: 'On the joyous occasion of their traditional wedding',
    atVenue: 'for the wedding celebration held at the hotel,', invite: 'we request the honour of your presence.',
    poruwa: t => `(Poruwa ceremony at ${t})`, range: (a, b) => `${a} to ${b}`, at: t => `at ${t}`,
    cdTitle: 'Until the Auspicious Hour', units: ['Days', 'Hours', 'Minutes', 'Seconds'],
    evTitle: 'The Celebration', std: 'Save the Date', stdSub: 'Add the wedding to your calendar',
    galTitle: 'Our Moments', venueTitle: 'The Venue', venue: 'Venue', map: 'View on Map',
    rsvpTitle: 'Kindly Respond', rsvpNote: 'Your presence would bring us great joy. Please let us know in advance.',
    rsvpBy: d => `Kindly reply by ${d}`,
    name: 'Full name', namePh: 'Your name', attend: 'Will you attend?', yes: 'Joyfully attending', no: 'Unable to attend',
    count: 'Number of guests', send: 'Send reply',
    thanksYes: n => `Thank you, ${n}! We can't wait to celebrate with you 🪷`, thanksNo: n => `Thank you for letting us know, ${n} 🤍`,
    footer: 'With love, from both our families'
  }
};

/* ── Calendar links ── */
const stamp = x => `${x.getFullYear()}${String(x.getMonth()+1).padStart(2,'0')}${String(x.getDate()).padStart(2,'0')}T${String(x.getHours()).padStart(2,'0')}${String(x.getMinutes()).padStart(2,'0')}00`;
const calTitle = `${cfg.bride} & ${cfg.groom} Wedding`;
const googleCal = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: 'TEMPLATE', text: calTitle, dates: `${stamp(when)}/${stamp(end)}`,
  details: 'Join us for our wedding celebration!', location: cfg.text.en.venue
})}`;
function downloadIcs() {
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bloom & Vows//Invitation//EN', 'BEGIN:VEVENT',
    `UID:${stamp(when)}-${cfg.monogram.replace(/\W/g, '')}@bloomandvows`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(when)}`, `DTEND:${stamp(end)}`, `SUMMARY:${calTitle}`, `LOCATION:${cfg.text.en.venue}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'wedding.ics';
  a.click();
}

/* ── Render (re-run when the language changes) ── */
let rendered = false, attending = true, guests = 1;
const mapQuery = encodeURIComponent(cfg.venue.mapQuery);

function render() {
  const u = UI[lang], t = cfg.text[lang];
  const nameInput = document.getElementById('r-name');
  const typedName = nameInput ? nameInput.value : (guestName || '');   // keep what the guest typed across a language switch
  document.documentElement.lang = lang;
  document.title = `${t.bride} ${u.and} ${t.groom}`;
  const FLOURISH = `<img class="flourish reveal" src="${art.flourish}" alt="">`;
  const head = (eyebrow, title) => `<span class="eyebrow reveal">${eyebrow}</span><h2 class="title reveal">${title}</h2>${FLOURISH}`;
  const couple = `${esc(t.groom)}<span class="and">${u.and}</span>${esc(t.bride)}`;

  document.getElementById('app').innerHTML = `
<section class="hero" id="home">
  <img class="hero-mandala" src="${art.mandala}" alt="">
  <h1 class="welcome gold-text reveal">${u.welcome}</h1>
  ${guestName ? `<p class="dear reveal">${esc(u.dear(guestName))}</p>` : ''}
  <div class="families reveal">
    <div><p>${esc(t.brideFamily)}</p><p class="nm">${esc(t.bride)}</p></div>
    <div><p>${esc(t.groomFamily)}</p><p class="nm">${esc(t.groom)}</p></div>
  </div>
  <div class="couple-wrap reveal"><img src="${cfg.heroImage}" alt="${esc(t.bride)} ${u.and} ${esc(t.groom)}"></div>
  <p class="occasion reveal">${u.occasion}</p>
  <div class="date-block reveal">
    <div class="yr">${when.getFullYear()}</div>
    <div class="row"><span>${month(when)}</span><span class="day">${when.getDate()}</span><span>${weekday(when)}</span></div>
    <div class="time">${u.range(clock(when), clock(end))}</div>
  </div>
  <div class="venue-lines reveal">
    <p class="v-name">${esc(t.venue)}</p>
    <p>${u.atVenue}</p>
    ${guestName ? `<p class="guest">${esc(guestName)}</p>` : ''}
    <p>${u.invite}</p>
    ${cfg.poruwaTime ? `<p class="poruwa">${u.poruwa(clock(cfg.poruwaTime))}</p>` : ''}
  </div>
</section>

<section class="cd-wrap" id="countdown">
  <img class="deco l" src="${art.mandala}" alt=""><img class="deco r" src="${art.mandala}" alt="">
  ${head('Countdown', u.cdTitle)}
  <div class="cd reveal">
    ${u.units.map((w, i) => `<div><b id="cd-${'dhms'[i]}">--</b><i></i><small>${w}</small></div>`).join('')}
  </div>
  <p class="cd-date reveal">${longDate(when)}</p>
</section>

<section id="events">
  ${head('Event Details', u.evTitle)}
  ${cfg.events.map(e => `
  <div class="card ev-card reveal">
    <span class="ic"><i class="${e.icon}"></i></span>
    <h3>${esc(e.title[lang])}</h3>
    <div class="place">${esc(e.place[lang])}</div>
    <div class="rule"></div>
    <p>${esc(e.label[lang])}: ${u.at(clock(e.time))}${e.after ? `\n${esc(e.after[lang])}` : ''}</p>
  </div>`).join('')}
  <details class="card std reveal">
    <summary>
      <span class="s-ic"><i class="far fa-calendar-plus"></i></span>
      <span><h4>${u.std}</h4><p>${u.stdSub}</p></span>
      <span class="chev"><i class="fas fa-chevron-down"></i></span>
    </summary>
    <div class="std-btns">
      <a class="btn" href="${googleCal}" target="_blank" rel="noopener noreferrer"><i class="fab fa-google"></i> Google</a>
      <button class="btn" type="button" onclick="downloadIcs()"><i class="fab fa-apple"></i> Apple / Outlook</button>
    </div>
  </details>
</section>

<section id="gallery">
  ${head('Gallery', u.galTitle)}
  <div class="gal reveal">
    ${cfg.gallery.map(g => `<figure data-src="${g.src}"><img src="${g.src}" alt="" loading="lazy" style="object-position:${g.position || 'center'}"></figure>`).join('')}
  </div>
</section>

<section class="venue" id="venue">
  ${head('Location', u.venueTitle)}
  <div class="card venue-card reveal">
    <img class="deco" src="${art.mandala}" alt="">
    <span class="eyebrow">${u.venue}</span>
    <h3>${esc(t.venue)}</h3>
    <p>${esc(t.address)}</p>
  </div>
  <div class="map reveal">
    ${PREVIEW ? '' : `<iframe src="https://maps.google.com/maps?q=${mapQuery}&z=14&hl=${lang}&output=embed" loading="lazy" title="Map of ${esc(t.venue)}" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
  </div>
  <a class="btn-gold reveal" href="${cfg.venue.mapUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-location-dot"></i> ${u.map}</a>
</section>

<section id="rsvp">
  ${head('RSVP', u.rsvpTitle)}
  <p class="rsvp-note reveal">${u.rsvpNote}</p>
  ${rsvpDeadline ? `<p class="rsvp-by reveal">${u.rsvpBy(lang === 'si' ? `${rsvpDeadline.getFullYear()} ${month(rsvpDeadline)} ${rsvpDeadline.getDate()}` : longDate(rsvpDeadline))}</p>` : ''}
  <form class="card rsvp reveal" onsubmit="return sendRsvp(event)">
    <div><label for="r-name">${u.name}</label><input id="r-name" required maxlength="60" placeholder="${u.namePh}" value="${esc(typedName)}"></div>
    <div><span class="lbl">${u.attend}</span>
      <div class="choice">
        <button type="button" class="${attending ? 'on' : ''}" data-a="yes">${u.yes}</button>
        <button type="button" class="${attending ? '' : 'on'}" data-a="no">${u.no}</button>
      </div>
    </div>
    <div id="r-count-wrap" style="${attending ? '' : 'display:none'}"><span class="lbl">${u.count}</span>
      <div class="stepper">
        <button type="button" onclick="stepGuests(-1)" aria-label="Decrease guest count">−</button>
        <span id="r-count">${guests}</span>
        <button type="button" onclick="stepGuests(1)" aria-label="Increase guest count">+</button>
      </div>
    </div>
    <button class="btn-gold" type="submit"><i class="fas fa-paper-plane"></i> ${u.send}</button>
    <p class="rsvp-done" id="rsvp-done"></p>
  </form>
</section>

<footer>
  <img class="f-mandala" src="${art.mandala}" alt="">
  <span class="eyebrow">Save the date</span>
  <p class="f-date">${DOTS_DATE}</p>
  <p>${u.footer}</p>
  <img class="flourish" src="${art.flourish}" alt="">
  <p class="f-names">${couple}</p>
  <div class="f-calls">
    ${cfg.contacts.map(c => `<a href="tel:${c.phone.replace(/\s/g, '')}"><i class="fas fa-phone"></i> ${esc(c.name[lang])}</a>`).join('')}
  </div>
</footer>`;

  /* intro text (the intro is already gone in preview mode or after opening) */
  if (document.getElementById('intro')) {
    document.getElementById('i-welcome').textContent = u.welcome;
    document.getElementById('i-names').innerHTML = couple;
    document.getElementById('i-guest').textContent = guestName || '';
    document.getElementById('i-btn').textContent = u.open;
  }
  document.querySelectorAll('#lang button').forEach(b => {
    b.classList.toggle('on', b.dataset.lang === lang);
    b.setAttribute('aria-pressed', b.dataset.lang === lang);
  });

  bindPage();
  tick();
  rendered = true;
}

/* ── Wiring that has to be redone after every render ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
const navLinks = [...document.querySelectorAll('#nav a')];
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });

function bindPage() {
  /* after a language switch, show everything at once instead of replaying the reveal */
  document.querySelectorAll('.reveal').forEach(el => rendered ? el.classList.add('vis') : obs.observe(el));
  navObs.disconnect();
  ['home', 'events', 'gallery', 'venue', 'rsvp'].forEach(id => navObs.observe(document.getElementById(id)));
  document.querySelectorAll('.choice button').forEach(b => b.onclick = () => {
    attending = b.dataset.a === 'yes';
    document.querySelectorAll('.choice button').forEach(x => x.classList.toggle('on', x === b));
    document.getElementById('r-count-wrap').style.display = attending ? '' : 'none';
  });
  document.querySelectorAll('.gal figure').forEach(f => f.onclick = () => {
    const lb = document.getElementById('lightbox');
    lb.querySelector('img').src = f.dataset.src;
    lb.classList.add('show');
  });
}

document.querySelectorAll('#lang button').forEach(b => b.onclick = () => {
  if (b.dataset.lang === lang) return;
  lang = b.dataset.lang;
  try { localStorage.setItem('lotus-lang', lang); } catch (_) {}
  render();
});

/* ── RSVP (demo: stored only in this browser; a real app posts to the server) ── */
function stepGuests(d) {
  guests = Math.min(10, Math.max(1, guests + d));
  document.getElementById('r-count').textContent = guests;
}
function sendRsvp(e) {
  e.preventDefault();
  const name = document.getElementById('r-name').value.trim();
  const entry = { name, attending, guests: attending ? guests : 0, lang, at: new Date().toISOString() };
  try {
    const all = JSON.parse(localStorage.getItem('rsvp-' + cfg.monogram) || '[]');
    all.push(entry);
    localStorage.setItem('rsvp-' + cfg.monogram, JSON.stringify(all));
  } catch (_) {}
  document.getElementById('rsvp-done').textContent = attending ? UI[lang].thanksYes(name) : UI[lang].thanksNo(name);
  return false;
}

/* ── Static artwork ── */
document.getElementById('paper').style.backgroundImage = `url('${art.texture}')`;
document.getElementById('paper').style.backgroundSize = '450px 800px';
document.getElementById('intro').style.backgroundImage = `url('${art.texture}')`;
document.getElementById('i-mandala').src = art.mandala;
document.getElementById('i-flourish').src = art.flourish;
document.getElementById('drums').src = cfg.introDrums || '';
document.getElementById('bg-music').src = cfg.music;

/* ── Intro: tap → drum roll → music fades in → intro fades into the invitation ── */
const intro = document.getElementById('intro');
if (PREVIEW) intro.remove();
else document.body.style.overflow = 'hidden';

let introEnded = false;
function openIntro() {
  if (introEnded) return;
  introEnded = true;
  intro.classList.add('fading');
  document.body.style.overflow = '';
  setTimeout(() => { intro.remove(); setTimeout(startAutoScroll, 1800); }, 1200);

  const audio = document.getElementById('bg-music'), drums = document.getElementById('drums');
  let started = false;
  const startMusic = () => {
    if (started) return;
    started = true;
    audio.volume = 0;
    audio.play().then(() => {
      let v = 0;
      const fadeIn = setInterval(() => { v = Math.min(v + .05, .75); audio.volume = v; if (v >= .75) clearInterval(fadeIn); }, 120);
      document.getElementById('music').classList.add('on');
    }).catch(() => {});
  };
  if (drums.src) {
    drums.onended = startMusic;
    drums.play().catch(startMusic);
    setTimeout(startMusic, 6000);   // don't wait forever if the drums stall
  } else startMusic();
}

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  if (audio.paused) audio.play().then(() => document.getElementById('music').classList.add('on')).catch(() => {});
  else { audio.pause(); document.getElementById('music').classList.remove('on'); }
}

/* ── Countdown ── */
function tick() {
  const diff = when - new Date();
  const set = (id, v) => { const el = document.getElementById('cd-' + id); if (el) el.textContent = String(v).padStart(2, '0'); };
  if (diff <= 0) { 'dhms'.split('').forEach(id => set(id, 0)); return; }
  set('d', Math.floor(diff / 864e5));
  set('h', Math.floor((diff % 864e5) / 36e5));
  set('m', Math.floor((diff % 36e5) / 6e4));
  set('s', Math.floor((diff % 6e4) / 1e3));
}
setInterval(tick, 1000);

render();

/* ── Auto scroll (same behaviour as invite.html) ── */
let _asRaf = null, _asActive = false, _asResumeTimer = null;
const _maxScroll = () => document.documentElement.scrollHeight - ((window.visualViewport && window.visualViewport.height) || innerHeight);

function startAutoScroll() {
  if (_asActive) return;
  clearTimeout(_asResumeTimer);
  _asActive = true;
  let speed = 0, acc = 0;
  function step() {
    if (!_asActive) return;
    const top = window.pageYOffset;
    if (top >= _maxScroll() - 2) {
      _asActive = false;
      if (AUTOPLAY) setTimeout(() => { scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(startAutoScroll, 2500); }, 2500);
      return;
    }
    speed += ((AUTOPLAY ? 1.1 : .7) - speed) * .04;
    acc += speed;
    if (acc >= 1) { const px = Math.floor(acc); scrollTo(0, top + px); acc -= px; }
    _asRaf = requestAnimationFrame(step);
  }
  _asRaf = requestAnimationFrame(step);
}
function _pauseAutoScroll() { _asActive = false; cancelAnimationFrame(_asRaf); clearTimeout(_asResumeTimer); }
function _scheduleResume(delay) {
  clearTimeout(_asResumeTimer);
  _asResumeTimer = setTimeout(() => { if (pageYOffset < _maxScroll() - 2) startAutoScroll(); }, delay);
}
['wheel','mousedown','keydown'].forEach(e => addEventListener(e, () => { _pauseAutoScroll(); _scheduleResume(3000); }, { passive: true }));
addEventListener('touchstart', _pauseAutoScroll, { passive: true });
addEventListener('touchend', () => _scheduleResume(2000), { passive: true });

if (AUTOPLAY) setTimeout(startAutoScroll, 1200);
