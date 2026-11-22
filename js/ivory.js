/* ── Load config: ivory.html?demo=ivory&guest=Mr+%26+Mrs+Silva[&preview=1][&autoscroll=1] ── */
const params    = new URLSearchParams(location.search);
const PREVIEW   = params.get('preview') === '1';
const AUTOPLAY  = params.get('autoscroll') === '1';
const cfg       = window.DEMOS[params.get('demo')] || window.DEMOS.ivory;
const art       = cfg.art;
const guestName = params.get('guest');

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Theme ── */
const themeVars = {
  bg:'--bg', card:'--card', alt:'--alt',
  text:'--text', textMid:'--text-mid', textSoft:'--text-soft',
  accent:'--accent', accentDark:'--accent-dark', accentPale:'--accent-pale', accentLight:'--accent-light',
  name:'--name', amp:'--amp', gold:'--gold', button:'--button', shadow:'--shadow',
  bandA:'--band-a', bandB:'--band-b', footA:'--foot-a', footB:'--foot-b', petal:'--petal'
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
const TIME    = when.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
const LONG_DATE = `${WEEKDAY}, ${DAY} ${MONTH} ${YEAR}`;
const DOTS_DATE = `${String(DAY).padStart(2, '0')} . ${String(when.getMonth() + 1).padStart(2, '0')} . ${YEAR}`;

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
const ORN = '<div class="orn reveal">✦</div>';
const AMP = '<span class="amp">&amp;</span>';
const MONO = `${esc(cfg.bride[0])}${AMP}${esc(cfg.groom[0])}`;
const head = (eyebrow, plain, gold) => `
  <span class="eyebrow reveal">${eyebrow}</span>
  <h2 class="title reveal">${plain} <em>${gold}</em></h2>
  ${ORN}`;
const mapQuery = encodeURIComponent([cfg.venue.name, cfg.venue.address].filter(Boolean).join(', '));

document.getElementById('app').innerHTML = `
<section class="hero" id="home">
  <div class="hero-copy reveal">
    ${guestName ? `<p class="dear">Dear ${esc(guestName)}</p>` : ''}
    <span class="eyebrow">Together with their families</span>
    <h1 class="names">
      <span class="nm">${esc(cfg.bride)}</span>
      ${p.bride ? `<span class="of"><small>Daughter of</small>${esc(p.bride)}</span>` : ''}
      <span class="and">and</span>
      <span class="nm">${esc(cfg.groom)}</span>
      ${p.groom ? `<span class="of"><small>Son of</small>${esc(p.groom)}</span>` : ''}
    </h1>
    <p class="invite-line">joyfully invite you to celebrate their marriage</p>
    <div class="dia"><i></i></div>
    <p class="when-line">${LONG_DATE}</p>
    <p class="where-line">${TIME} · ${esc(cfg.venue.name)}</p>
  </div>
  <div class="arch reveal"><img src="${cfg.heroImage}" alt="${esc(cfg.bride)} &amp; ${esc(cfg.groom)}"></div>
</section>

<div class="cd-band" id="countdown">
  <img class="floral" src="${art.countdownFloral}" alt="">
  <div class="script reveal">We are getting</div>
  <h2 class="reveal">Married</h2>
  ${ORN}
  <div class="cd reveal">
    ${['Days','Hours','Minutes','Seconds'].map(u => `<div><b id="cd-${u[0].toLowerCase()}">--</b><i></i><small>${u}</small></div>`).join('')}
  </div>
  <p class="until reveal">Until ${LONG_DATE}</p>
</div>

<section class="story" id="story">
  ${head('How it began', 'Our', 'Story')}
  <p class="lede reveal">A few of the moments that brought us here.</p>
  ${cfg.story ? `<div class="arch reveal"><img src="${cfg.story.image}" alt="" loading="lazy"></div>` : ''}
  <div class="timeline">
    ${(cfg.journey || []).map(j => `
    <div class="t-row reveal">
      <span class="yr">${esc(j.year)}</span>
      <div><h4>${esc(j.title)}</h4><p>${esc(j.text)}</p></div>
    </div>`).join('')}
  </div>
</section>

<section id="events">
  ${head(LONG_DATE, 'The', 'Celebration')}
  ${(cfg.events || []).map(e => `
  <div class="arch-card reveal">
    <span class="ic"><i class="${e.icon}"></i></span>
    <h3>${esc(e.title)}</h3>
    <div class="ev-time">${esc(e.time)}</div>
    <div class="rule"></div>
    <p>${esc(e.venue || cfg.venue.name)}${e.note ? `<br>${esc(e.note)}` : ''}</p>
  </div>`).join('')}
  <details class="std reveal">
    <summary>
      <span class="s-ic"><i class="far fa-calendar-plus"></i></span>
      <span><h4>Save Our Date</h4><p>Add the wedding to your calendar</p></span>
      <span class="chev"><i class="fas fa-chevron-down"></i></span>
    </summary>
    <div class="std-btns">
      <a class="btn" href="${googleCal}" target="_blank" rel="noopener noreferrer"><i class="fab fa-google"></i> Google</a>
      <button class="btn" type="button" onclick="downloadIcs()"><i class="fab fa-apple"></i> Apple / Outlook</button>
    </div>
  </details>
</section>

${cfg.dressCode ? `
<section id="dresscode">
  ${head('What to wear', 'Dress', 'Code')}
  <div class="arch-card reveal">
    <span class="ic"><i class="fas fa-shirt"></i></span>
    <h3>${esc(cfg.dressCode.title)}</h3>
    <div class="rule"></div>
    <p>${esc(cfg.dressCode.text)}</p>
    <ul class="swatches" aria-label="Colour palette for guests">
      ${cfg.dressCode.colors.map(c => `<li style="background:${c}" title="${c}"></li>`).join('')}
    </ul>
  </div>
</section>` : ''}

<section id="gallery">
  ${head('Moments we treasure', 'Photo', 'Gallery')}
  <div class="gal reveal">
    ${cfg.gallery.map(g => `<figure data-src="${g.src}"><img src="${g.src}" alt="${esc(g.caption || '')}" loading="lazy" style="object-position:${g.position || 'center'}"></figure>`).join('')}
  </div>
</section>

<section id="venue">
  ${head('Where we celebrate', 'The', 'Venue')}
  <div class="venue-card reveal">
    <span class="v-ic"><i class="fas fa-location-dot"></i></span>
    <div><span class="eyebrow">Venue</span><h3>${esc(cfg.venue.name)}</h3>${cfg.venue.address ? `<p>${esc(cfg.venue.address)}</p>` : ''}</div>
  </div>
  <div class="map reveal">
    ${PREVIEW ? '' : `<iframe src="https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed" loading="lazy" title="Map of ${esc(cfg.venue.name)}" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
  </div>
  <a class="map-link reveal" href="${cfg.venue.mapUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-location-arrow"></i> Open in Maps</a>
</section>

<section id="rsvp">
  ${head('Kindly reply', 'Will you', 'join us')}
  <p class="lede reveal">It would mean so much to have you with us. Please let us know if you can join the celebration.</p>
  ${cfg.rsvpBy ? `<p class="reply-by reveal">Kindly reply by ${esc(cfg.rsvpBy)}</p>` : ''}
  <form class="rsvp reveal" onsubmit="return sendRsvp(event)">
    <div><label for="r-name">Full name</label><input id="r-name" required maxlength="60" placeholder="Your name"></div>
    <div><span class="lbl">Will you attend?</span>
      <div class="choice">
        <button type="button" class="on" data-a="yes">Joyfully accepts</button>
        <button type="button" data-a="no">Regretfully declines</button>
      </div>
    </div>
    <div id="r-count-wrap"><span class="lbl">Number of guests</span>
      <div class="stepper">
        <button type="button" onclick="stepGuests(-1)" aria-label="Decrease guest count">−</button>
        <span id="r-count">1</span>
        <button type="button" onclick="stepGuests(1)" aria-label="Increase guest count">+</button>
      </div>
    </div>
    <button class="btn solid" type="submit"><i class="fas fa-paper-plane"></i> Send my reply</button>
    <p class="rsvp-done" id="rsvp-done"></p>
  </form>
</section>

<footer>
  <div class="f-card reveal">
    <img class="floral" src="${art.footerFloral}" alt="">
    <span class="eyebrow">Save the date</span>
    <p class="f-date">${DOTS_DATE}</p>
    <p class="f-sealed">Sealed with love.</p>
    <p class="f-mono">${MONO}</p>
    <p class="f-names">${esc(cfg.bride)} &amp; ${esc(cfg.groom)}</p>
    <div class="f-calls">
      ${cfg.contacts.map(c => `<a href="tel:${c.phone.replace(/\s/g, '')}"><i class="fas fa-phone"></i> Call ${esc(c.role || c.name)}</a>`).join('')}
    </div>
  </div>
</footer>`;

const backdrop = `linear-gradient(color-mix(in srgb, var(--bg) 40%, transparent), color-mix(in srgb, var(--bg) 40%, transparent)), url('${art.backdrop}')`;
document.getElementById('silk').style.backgroundImage = backdrop;
document.getElementById('intro').style.backgroundImage = backdrop;
document.getElementById('mono').innerHTML = MONO;
document.getElementById('i-names').innerHTML = `<span>${esc(cfg.bride)}</span>${AMP}<span>${esc(cfg.groom)}</span>`;
document.getElementById('i-date').textContent = DOTS_DATE;
if (guestName) document.getElementById('i-guest').textContent = `Dear ${guestName}`;
const envVideo = document.getElementById('env-video');
envVideo.poster = art.envelope;
envVideo.style.backgroundImage = `url('${art.envelope}')`;
if (!PREVIEW && art.envelopeVideo) envVideo.src = art.envelopeVideo;
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
    ? `Thank you, ${name}! We can't wait to celebrate with you 🤍`
    : `Thank you for letting us know, ${name}. You'll be missed 🤍`;
  return false;
}

/* ── Gallery lightbox ── */
document.querySelectorAll('.gal figure').forEach(f => f.onclick = () => {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = f.dataset.src;
  lb.classList.add('show');
});

/* ── Intro: tap breaks the seal → envelope video plays, music fades in → intro fades away ── */
const intro = document.getElementById('intro');
if (PREVIEW) intro.remove();
else document.body.style.overflow = 'hidden';

let introEnded = false;
function finishIntro() {
  if (!intro.isConnected || intro.classList.contains('fading')) return;
  intro.classList.add('fading');
  document.body.style.overflow = '';
  setTimeout(() => { intro.remove(); setTimeout(startAutoScroll, 1200); }, 900);
}
function openIntro() {
  if (introEnded) return;
  introEnded = true;
  intro.classList.add('opening');
  if (envVideo.src) {
    envVideo.onended = finishIntro;
    envVideo.play().catch(finishIntro);
    setTimeout(finishIntro, 9000);   // never get stuck if the video stalls
  } else finishIntro();
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
['home', 'events', 'rsvp', 'gallery', 'venue'].forEach(id => navObs.observe(document.getElementById(id)));

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
