/* ── Load config: perahara.html?demo=perahara&guest=John+Silva[&preview=1][&autoscroll=1] ── */
const params    = new URLSearchParams(location.search);
const PREVIEW   = params.get('preview') === '1';
const AUTOPLAY  = params.get('autoscroll') === '1';
const cfg       = window.DEMOS[params.get('demo')] || window.DEMOS.perahara;
const art       = cfg.art;
const guestName = params.get('guest');

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Theme ── */
const themeVars = {
  bg:'--bg', card:'--card', alt:'--alt',
  text:'--text', textMid:'--text-mid', textSoft:'--text-soft',
  accent:'--accent', accentDark:'--accent-dark', accentPale:'--accent-pale', accentLight:'--accent-light',
  name:'--name', amp:'--amp'
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
const mapQuery = encodeURIComponent(cfg.venue.mapQuery || cfg.venue.name);

document.getElementById('app').innerHTML = `
<div class="paper">
  <div class="top-mandala-wrap"><img class="top-mandala" src="${art.mandala}" alt=""></div>

  <section class="hero" id="home">
    <p class="greet reveal">${esc(cfg.greeting || 'Sri Suba Mangalam!')}</p>
    ${cfg.greetingSi ? `<p class="greet-si reveal">${esc(cfg.greetingSi)}</p>` : ''}
    <p class="invited reveal">${guestName ? `Dear ${esc(guestName)}, you` : 'You'} are invited to the wedding of</p>
    ${ORN}
    <h1 class="names reveal">${esc(cfg.bride)}<span class="amp">&amp;</span>${esc(cfg.groom)}</h1>
    ${p.bride || p.groom ? `
    <div class="parents reveal">
      <div><b>Daughter of</b><span>${esc(p.bride || '')}</span></div>
      <div><b>Son of</b><span>${esc(p.groom || '')}</span></div>
    </div>` : ''}
    <div class="date-row reveal">
      <div class="side">${MONTH}</div>
      <div class="day">${DAY}</div>
      <div class="side">${YEAR}</div>
    </div>
    <p class="full-date reveal">${LONG_DATE}</p>
    <img class="couple reveal" src="${cfg.heroImage}" alt="${esc(cfg.bride)} &amp; ${esc(cfg.groom)}">
  </section>
</div>

<div class="paper">
  <section class="story" id="story">
    ${cfg.story ? `<img class="story-img reveal" src="${cfg.story.image}" alt="" loading="lazy">` : ''}
    <p class="eyebrow reveal">Our Story</p>
    <h2 class="title reveal">${esc(cfg.storyTitle || 'Together Forever')}</h2>
    ${ORN}
    <p class="body-text reveal">${esc(cfg.story ? cfg.story.text : '')}</p>
    <p class="when reveal">${LONG_DATE}</p>
    <p class="body-text families reveal"><b>Together with their families</b> request the honour of your presence at the celebration of their marriage.</p>
    <div class="rule"></div>
    <p class="venue-name reveal">${esc(cfg.venue.name)}</p>
    ${cfg.venue.city ? `<p class="venue-city reveal">${esc(cfg.venue.city)}</p>` : ''}
    ${cfg.journey ? `
    <div class="rule"></div>
    <div class="journey">
      <span class="eyebrow reveal">A Journey Together</span>
      ${cfg.journey.map(j => `
      <div class="j-row reveal">
        <div class="j-year">${esc(j.year)}</div>
        <div class="j-body"><h4>${esc(j.title)}</h4><p>${esc(j.text)}</p></div>
      </div>`).join('')}
    </div>` : ''}
  </section>
</div>

<section>
  <p class="eyebrow reveal">Until We Say I Do</p>
  <h2 class="title reveal">Counting Down</h2>
  ${ORN}
  <div class="cd reveal">
    ${['Days','Hours','Minutes','Seconds'].map(u => `<div><b id="cd-${u[0].toLowerCase()}">--</b><small>${u}</small></div>`).join('')}
  </div>
</section>

<section id="events">
  <p class="eyebrow reveal">Celebrate With Us</p>
  <h2 class="title reveal">Wedding Events</h2>
  ${ORN}
  ${(cfg.events || []).map(e => `
  <div class="ev-card reveal">
    <div class="ev-ic"><i class="${e.icon}"></i></div>
    <h3>${esc(e.title)}</h3>
    <p class="ev-line"><i class="far fa-calendar"></i>${esc(e.date || SHORT_DATE)}</p>
    <p class="ev-line"><i class="far fa-clock"></i>${esc(e.time)}</p>
    <p class="ev-line"><i class="fas fa-location-dot"></i>${esc(e.venue || cfg.venue.name)}</p>
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
  <div class="venue-card reveal">
    <div class="ev-ic"><i class="fas fa-location-dot"></i></div>
    <p class="eyebrow">Venue</p>
    <h3>${esc(cfg.venue.name)}</h3>
    ${cfg.venue.city ? `<p>${esc(cfg.venue.city)}</p>` : ''}
  </div>
  <div class="map reveal">
    ${PREVIEW ? '' : `<iframe src="https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed" loading="lazy" title="Map to ${esc(cfg.venue.name)}" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
  </div>
  <a class="map-link reveal" href="${cfg.venue.mapUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-location-dot"></i> View on map</a>
</section>

<section id="rsvp">
  <p class="eyebrow reveal">Kindly Respond</p>
  <h2 class="title reveal">Will You Join Us?</h2>
  ${ORN}
  <form class="rsvp reveal" onsubmit="return sendRsvp(event)">
    <div class="choice">
      <button type="button" class="on" data-a="yes"><i class="fas fa-heart"></i> Joyfully accept</button>
      <button type="button" data-a="no">Regretfully decline</button>
    </div>
    <div><label for="r-name">Your name</label><input id="r-name" required maxlength="60"></div>
    <div id="r-count-wrap"><label for="r-count">Number of guests</label>
      <select id="r-count">${[1,2,3,4,5,6].map(n => `<option>${n}</option>`).join('')}</select></div>
    <div><label for="r-msg">A note for the couple</label><textarea id="r-msg" maxlength="300" placeholder="Optional"></textarea></div>
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
  <p class="f-names">${esc(cfg.bride)} <span class="amp">&amp;</span> ${esc(cfg.groom)}</p>
  <p class="f-venue">${esc(cfg.venue.name)}</p>
  <p class="f-made">Questions? ${cfg.contacts.map(c => `<a href="https://wa.me/${c.wa}" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i> ${esc(c.name)}</a>`).join(' · ')}</p>
</footer>`;

document.getElementById('silk').style.backgroundImage = `url('${art.backdrop}')`;
document.getElementById('intro').style.backgroundImage = `url('${art.backdrop}')`;
document.getElementById('i-mandala').src = art.mandala;
document.getElementById('i-greet').textContent = cfg.greeting || 'Sri Suba Mangalam!';
document.getElementById('i-mono').textContent = cfg.monogram;
document.getElementById('i-date').textContent = DOTS_DATE;
document.getElementById('bg-music').src = cfg.music;
if (guestName) document.getElementById('r-name').value = guestName;

/* ── RSVP (demo: stored only in this browser; a real app posts to the server) ── */
let attending = true;
document.querySelectorAll('.choice button').forEach(b => b.onclick = () => {
  attending = b.dataset.a === 'yes';
  document.querySelectorAll('.choice button').forEach(x => x.classList.toggle('on', x === b));
  document.getElementById('r-count-wrap').style.display = attending ? '' : 'none';
});
function sendRsvp(e) {
  e.preventDefault();
  const name = document.getElementById('r-name').value.trim();
  const entry = { name, attending, guests: attending ? +document.getElementById('r-count').value : 0,
                  note: document.getElementById('r-msg').value.trim(), at: new Date().toISOString() };
  try {
    const all = JSON.parse(localStorage.getItem('rsvp-' + cfg.monogram) || '[]');
    all.push(entry);
    localStorage.setItem('rsvp-' + cfg.monogram, JSON.stringify(all));
  } catch (_) {}
  document.getElementById('rsvp-done').textContent = attending
    ? `Thank you, ${name}! We can't wait to celebrate with you 🪷`
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
    document.getElementById('music').classList.add('on');
  }).catch(() => {});
}

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  audio.paused ? audio.play() : audio.pause();
  document.getElementById('music').classList.toggle('on', !audio.paused);
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
