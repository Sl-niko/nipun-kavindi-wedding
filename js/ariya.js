/* ── Load config: ariya.html?demo=ariya&guest=Mr+%26+Mrs+Silva[&preview=1][&autoscroll=1] ── */
const params    = new URLSearchParams(location.search);
const PREVIEW   = params.get('preview') === '1';
const AUTOPLAY  = params.get('autoscroll') === '1';
const cfg       = window.DEMOS[params.get('demo')] || window.DEMOS.ariya;
const art       = cfg.art;
const guestName = params.get('guest');

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Theme ── */
const themeVars = {
  bg:'--bg', card:'--card', alt:'--alt',
  text:'--text', textMid:'--text-mid', textSoft:'--text-soft',
  accent:'--accent', accentDark:'--accent-dark', accentPale:'--accent-pale', accentLight:'--accent-light',
  name:'--name', amp:'--amp', gold:'--gold', label:'--label'
};
Object.entries(cfg.theme).forEach(([k, v]) => themeVars[k] && document.documentElement.style.setProperty(themeVars[k], v));
document.title = `${cfg.bride} & ${cfg.groom} · Wedding Invitation`;
if (PREVIEW) [document.documentElement, document.body].forEach(el => el.classList.add('is-preview'));
if (window.self !== window.top) document.documentElement.classList.add('in-frame');

/* ── Dates ── */
const when    = new Date(cfg.date);
const MONTH   = when.toLocaleString('en-US', { month: 'long' });
const WEEKDAY = when.toLocaleString('en-US', { weekday: 'long' });
const DAY     = when.getDate();
const YEAR    = when.getFullYear();
const ord     = n => (n % 100 >= 11 && n % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th');
const LONG_DATE = `${WEEKDAY}, ${DAY}<sup>${ord(DAY)}</sup> ${MONTH} ${YEAR}`;
const DOTS_DATE = `${String(DAY).padStart(2, '0')} . ${String(when.getMonth() + 1).padStart(2, '0')} . ${String(YEAR).slice(2)}`;
const SHORT_DATE = `${DAY}${ord(DAY)} ${MONTH} ${YEAR}`;

/* ── Calendar links ── */
const calStart = when;
const calEnd   = new Date(when.getTime() + (cfg.durationHours || 4) * 36e5);
const stamp    = x => `${x.getFullYear()}${String(x.getMonth()+1).padStart(2,'0')}${String(x.getDate()).padStart(2,'0')}T${String(x.getHours()).padStart(2,'0')}${String(x.getMinutes()).padStart(2,'0')}00`;
const calTitle = `${cfg.bride} & ${cfg.groom} Wedding`;
const googleCal = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: 'TEMPLATE', text: calTitle, dates: `${stamp(calStart)}/${stamp(calEnd)}`,
  details: 'Join us for our wedding celebration!', location: cfg.venue.name
})}`;
function downloadIcs() {
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bloom & Vows//Invitation//EN', 'BEGIN:VEVENT',
    `UID:${stamp(calStart)}-${cfg.monogram.replace(/\W/g, '')}@bloomandvows`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(calStart)}`, `DTEND:${stamp(calEnd)}`, `SUMMARY:${calTitle}`, `LOCATION:${cfg.venue.name}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'wedding.ics';
  a.click();
}

/* ── Render ── */
const p = cfg.parents || {};
const ORN = '<div class="orn reveal"><i></i></div>';
const NAMES = `${esc(cfg.bride)}<span class="amp">&amp;</span>${esc(cfg.groom)}`;
const PROCESSION = `<div class="procession"><img src="${art.procLeft}" alt=""><img src="${art.procRight}" alt=""></div>`;
const mapQuery = encodeURIComponent(cfg.venue.mapQuery || cfg.venue.name);

document.getElementById('app').innerHTML = `
<section class="hero" id="home">
  <div class="top-mandala"><img src="${art.mandala}" alt=""></div>
  <div class="glass hero-card">
    <p class="greet reveal">${esc(cfg.greeting || 'Sri Suba Mangalam!')}</p>
    ${cfg.greetingSi ? `<p class="greet-si reveal">${esc(cfg.greetingSi)}</p>` : ''}
    <p class="invited reveal">You are invited to the wedding of</p>
    ${ORN}
    <h1 class="names reveal">${NAMES}</h1>
    ${p.bride || p.groom ? `
    <div class="parents reveal">
      <div><b>Daughter of</b>${esc(p.bride || '')}</div>
      <div><b>Son of</b>${esc(p.groom || '')}</div>
    </div>` : ''}
    <div class="date-row reveal">
      <div class="side">${MONTH}</div>
      <div class="day">${DAY}</div>
      <div class="side">${YEAR}</div>
    </div>
    <img class="couple reveal" src="${cfg.heroImage}" alt="${esc(cfg.bride)} &amp; ${esc(cfg.groom)}">
    ${PROCESSION}
  </div>
  <a class="scroll-cue" href="#story" aria-label="Scroll to our story"><i class="fas fa-chevron-down"></i></a>
</section>

<section class="story" id="story">
  <div class="glass story-card">
    ${cfg.story ? `<img class="story-img reveal" src="${cfg.story.image}" alt="" loading="lazy">` : ''}
    <p class="eyebrow reveal">Our Story</p>
    <h2 class="title reveal">${esc(cfg.storyTitle || 'Together Forever')}</h2>
    ${ORN}
    <p class="body-text reveal">${esc(cfg.story ? cfg.story.text : '')}</p>
    <p class="when reveal">${LONG_DATE}</p>
    <p class="body-text families reveal"><b>Together with their families</b> request the honour of your presence at the celebration of their marriage.</p>
    <div class="block">
      <p class="venue-name reveal">${esc(cfg.venue.name)}</p>
      ${cfg.venue.city ? `<p class="venue-city reveal">${esc(cfg.venue.city)}</p>` : ''}
    </div>
    ${cfg.journey ? `
    <div class="block journey">
      <span class="eyebrow reveal">A Journey Together</span>
      ${cfg.journey.map(j => `
      <div class="j-row reveal">
        <div class="j-year">${esc(j.year)}</div>
        <div class="j-body"><h4>${esc(j.title)}</h4><p>${esc(j.text)}</p></div>
      </div>`).join('')}
    </div>` : ''}
  </div>
</section>

<section>
  <p class="eyebrow reveal">The Big Day Awaits</p>
  <h2 class="title reveal">Counting Down</h2>
  ${ORN}
  <div class="cd reveal">
    ${['Days','Hours','Minutes','Seconds'].map(u => `<div class="glass"><b id="cd-${u[0].toLowerCase()}">--</b><small>${u}</small></div>`).join('')}
  </div>
</section>

<section id="events">
  <p class="eyebrow reveal">Celebrate With Us</p>
  <h2 class="title reveal">Wedding Events</h2>
  ${ORN}
  ${(cfg.events || []).map(e => `
  <div class="glass ev-card reveal">
    <div class="ev-ic"><i class="${e.icon}"></i></div>
    <h3>${esc(e.title)}</h3>
    <p class="ev-line"><i class="far fa-calendar"></i>${esc(e.date || SHORT_DATE)}</p>
    <p class="ev-line"><i class="far fa-clock"></i>${esc(e.time)}</p>
    <p class="ev-line"><i class="fas fa-location-dot"></i>${esc(e.venue || [cfg.venue.name, cfg.venue.town].filter(Boolean).join(', '))}</p>
  </div>`).join('')}
  <details class="std reveal">
    <summary>
      <span class="ev-ic"><i class="far fa-calendar-plus"></i></span>
      <span><h4>Save the Date</h4><p>Add the wedding to your calendar</p></span>
      <span class="chev"><i class="fas fa-chevron-down"></i></span>
    </summary>
    <div class="std-btns">
      <a class="btn" href="${googleCal}" target="_blank" rel="noopener noreferrer"><i class="fab fa-google"></i> Google</a>
      <button class="btn" type="button" onclick="downloadIcs()"><i class="fab fa-apple"></i> Apple / Outlook</button>
    </div>
  </details>
</section>

<section>
  <p class="eyebrow reveal">Captured Moments</p>
  <h2 class="title reveal">Our Gallery</h2>
  ${ORN}
  <div class="gal reveal">
    ${cfg.gallery.map(g => `<figure data-src="${g.src}"><img src="${g.src}" alt="${esc(g.caption || '')}" loading="lazy" style="object-position:${g.position || 'center'}"></figure>`).join('')}
  </div>
</section>

<section id="venue">
  <p class="eyebrow reveal">The Setting</p>
  <h2 class="title reveal">Wedding Venue</h2>
  ${ORN}
  <div class="glass venue-card reveal">
    <div class="ev-ic"><i class="fas fa-location-dot"></i></div>
    <p class="eyebrow">Venue</p>
    <h3>${esc(cfg.venue.name)}</h3>
    ${cfg.venue.city ? `<p>${esc(cfg.venue.city)}</p>` : ''}
  </div>
  <div class="map reveal">
    ${PREVIEW ? '' : `<iframe src="https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed" loading="lazy" title="Map to ${esc(cfg.venue.name)}" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
  </div>
  <a class="map-link reveal" href="${cfg.venue.mapUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-location-dot"></i> View on map</a>
</section>

<section id="rsvp">
  <p class="eyebrow reveal">Kindly Reply</p>
  <h2 class="title reveal">Will You Join Us?</h2>
  ${ORN}
  <p class="body-text rsvp-note reveal">We joyfully await your presence. Please let us know if you will be joining us.</p>
  ${cfg.rsvpBy ? `<p class="rsvp-by reveal">Kindly respond by ${esc(cfg.rsvpBy)}</p>` : ''}
  <form class="glass rsvp reveal" onsubmit="return sendRsvp(event)">
    <div><label for="r-name">Full name</label><input id="r-name" required maxlength="60" placeholder="Your name"></div>
    <div><span class="lbl">Will you be attending?</span>
      <div class="choice">
        <button type="button" class="on" data-a="yes">Joyfully Accept</button>
        <button type="button" data-a="no">Regretfully Decline</button>
      </div>
    </div>
    <div id="r-count-wrap"><span class="lbl">Number of guests</span>
      <div class="stepper">
        <button type="button" onclick="stepGuests(-1)" aria-label="Decrease guest count">−</button>
        <span id="r-count">1</span>
        <button type="button" onclick="stepGuests(1)" aria-label="Increase guest count">+</button>
      </div>
    </div>
    <button class="btn solid" type="submit"><i class="fas fa-paper-plane"></i> Send RSVP</button>
    <p class="rsvp-done" id="rsvp-done"></p>
  </form>
</section>

<footer>
  <img class="f-mandala" src="${art.mandala}" alt="">
  <p class="eyebrow">Save the Date</p>
  <p class="f-date">${DOTS_DATE}</p>
  <p class="thanks">Thank you for being part of our special day.</p>
  <div class="orn"><i class="fas fa-heart"></i></div>
  <p class="f-names">${NAMES}</p>
  <p class="f-venue">${esc(cfg.venue.name)}</p>
  <p class="f-made">Questions? ${cfg.contacts.map(c => `<a href="https://wa.me/${c.wa}" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i> ${esc(c.name)}</a>`).join(' · ')}</p>
</footer>`;

const backdrop = `linear-gradient(color-mix(in srgb, var(--bg) 35%, transparent), color-mix(in srgb, var(--bg) 35%, transparent)), url('${art.backdrop}')`;
document.getElementById('silk').style.backgroundImage = backdrop;
document.getElementById('intro').style.backgroundImage = backdrop;
document.getElementById('i-mandala').src = art.mandala;
document.getElementById('i-proc-l').src = art.procLeft;
document.getElementById('i-proc-r').src = art.procRight;
document.getElementById('i-names').innerHTML = NAMES;
document.getElementById('i-date').innerHTML = LONG_DATE;
if (guestName) document.getElementById('i-guest').innerHTML = `<p>Dear</p><p>${esc(guestName)}</p>`;
document.getElementById('bg-music').src = cfg.music;
if (guestName) document.getElementById('r-name').value = guestName;

/* ── RSVP (demo: stored only in this browser; a real app posts to the server) ── */
let attending = true, guests = 1;
document.querySelectorAll('.choice button').forEach(b => b.onclick = () => {
  attending = b.dataset.a === 'yes';
  document.querySelectorAll('.choice button').forEach(x => x.classList.toggle('on', x === b));
  document.getElementById('r-count-wrap').style.display = attending ? '' : 'none';
});
function stepGuests(d) {
  guests = Math.min(10, Math.max(1, guests + d));
  document.getElementById('r-count').textContent = guests;
}
function sendRsvp(e) {
  e.preventDefault();
  const name = document.getElementById('r-name').value.trim();
  const entry = { name, attending, guests: attending ? guests : 0, at: new Date().toISOString() };
  try {
    const all = JSON.parse(localStorage.getItem('rsvp-' + cfg.monogram) || '[]');
    all.push(entry);
    localStorage.setItem('rsvp-' + cfg.monogram, JSON.stringify(all));
  } catch (_) {}
  document.getElementById('rsvp-done').textContent = attending
    ? `Thank you, ${name}! We can't wait to celebrate with you 🌼`
    : `Thank you for letting us know, ${name}. You'll be missed 🤍`;
  return false;
}

/* ── Gallery lightbox ── */
document.querySelectorAll('.gal figure').forEach(f => f.onclick = () => {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = f.dataset.src;
  lb.classList.add('show');
});

/* ── Intro: tap → music fades in → intro fades into the invitation ── */
const intro = document.getElementById('intro');
if (PREVIEW) intro.remove();
else document.body.style.overflow = 'hidden';

let introEnded = false;
function openIntro() {
  if (introEnded) return;
  introEnded = true;
  intro.classList.add('fading');
  document.body.style.overflow = '';
  setTimeout(() => { intro.remove(); setTimeout(startAutoScroll, 1200); }, 1200);
  const audio = document.getElementById('bg-music');
  audio.volume = 0;
  audio.play().then(() => {
    let v = 0;
    const fadeIn = setInterval(() => { v = Math.min(v + .05, .75); audio.volume = v; if (v >= .75) clearInterval(fadeIn); }, 120);
    setMusicIcon(true);
  }).catch(() => {});
}

function setMusicIcon(on) {
  const btn = document.getElementById('music');
  btn.querySelector('i').className = on ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
  btn.setAttribute('aria-label', on ? 'Turn music off' : 'Turn music on');
}
function toggleMusic() {
  const audio = document.getElementById('bg-music');
  if (audio.paused) audio.play().then(() => setMusicIcon(true)).catch(() => {});
  else { audio.pause(); setMusicIcon(false); }
}

/* ── Countdown ── */
function tick() {
  const diff = when - new Date();
  if (diff <= 0) { ['d','h','m','s'].forEach(id => document.getElementById('cd-' + id).textContent = '0'); return; }
  const set = (id, v) => document.getElementById('cd-' + id).textContent = String(v).padStart(2, '0');
  set('d', Math.floor(diff / 864e5));
  set('h', Math.floor((diff % 864e5) / 36e5));
  set('m', Math.floor((diff % 36e5) / 6e4));
  set('s', Math.floor((diff % 6e4) / 1e3));
}
tick(); setInterval(tick, 1000);

/* ── Scroll reveal ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── Bottom nav: highlight the section in view ── */
const navLinks = [...document.querySelectorAll('#nav a')];
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['home', 'story', 'events', 'venue', 'rsvp'].forEach(id => navObs.observe(document.getElementById(id)));

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
