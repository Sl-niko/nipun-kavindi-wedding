/* ── Load config: hydrangea.html?demo=hydrangea&guest=Mr+%26+Mrs+Silva[&preview=1][&autoscroll=1] ── */
const params    = new URLSearchParams(location.search);
const PREVIEW   = params.get('preview') === '1';
const AUTOPLAY  = params.get('autoscroll') === '1';
const cfg       = window.DEMOS[params.get('demo')] || window.DEMOS.hydrangea;
const art       = cfg.art;
const guestName = params.get('guest');

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Theme ── */
const root = document.documentElement.style;
const themeVars = { bg:'--bg', card:'--card', ink:'--ink', blue:'--blue', blueLight:'--blue-light', pin:'--pin' };
Object.entries(cfg.theme).forEach(([k, v]) => themeVars[k] && root.setProperty(themeVars[k], v));
const abs = p => new URL(p, location.href).href;   // url() inside a custom property would resolve against css/, not the page
root.setProperty('--paper', `url('${abs(art.paper)}')`);
root.setProperty('--garden', `url('${abs(art.backdrop)}')`);
document.title = `${cfg.bride} & ${cfg.groom} · Wedding Invitation`;
if (PREVIEW) [document.documentElement, document.body].forEach(el => el.classList.add('is-preview'));
if (window.self !== window.top) document.documentElement.classList.add('in-frame');

/* ── Dates ── */
const when    = new Date(cfg.date);
const MONTH   = when.toLocaleString('en-US', { month: 'long' });
const TIME    = when.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
const US_DATE = `${MONTH} ${when.getDate()}, ${when.getFullYear()}`;

/* ── Calendar links ── */
const calEnd   = new Date(when.getTime() + (cfg.durationHours || 6) * 36e5);
const stamp    = x => `${x.getFullYear()}${String(x.getMonth()+1).padStart(2,'0')}${String(x.getDate()).padStart(2,'0')}T${String(x.getHours()).padStart(2,'0')}${String(x.getMinutes()).padStart(2,'0')}00`;
const calTitle = `${cfg.bride} & ${cfg.groom} Wedding`;
const googleCal = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: 'TEMPLATE', text: calTitle, dates: `${stamp(when)}/${stamp(calEnd)}`,
  details: 'Join us for our wedding celebration!', location: `${cfg.venue.name}, ${cfg.venue.address}`
})}`;
function downloadIcs() {
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bloom & Vows//Invitation//EN', 'BEGIN:VEVENT',
    `UID:${stamp(when)}-${cfg.monogram.replace(/\W/g, '')}@bloomandvows`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(when)}`, `DTEND:${stamp(calEnd)}`, `SUMMARY:${calTitle}`, `LOCATION:${cfg.venue.name}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'wedding.ics';
  a.click();
}

/* ── Render ── */
const PINS = '<span class="pin tl"></span><span class="pin tr"></span><span class="pin bl"></span><span class="pin br"></span>';
const DIVIDER = '<div class="divider reveal"><i class="fas fa-heart"></i></div>';
const pen = (s, start) => [...s].map((c, i) => `<span style="animation-delay:${(start + i * .08).toFixed(2)}s">${esc(c)}</span>`).join('');
const mapFrame = (q, title) => `<div class="paper map-frame reveal">${PINS}${PREVIEW ? '<div class="blank"></div>'
  : `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed" loading="lazy" title="Map of ${esc(title)}" referrerpolicy="no-referrer-when-downgrade"></iframe>`}</div>`;
const rec = cfg.reception;

document.getElementById('app').innerHTML = `
<section class="hero" id="home">
  <div class="doily">
    <img src="${art.doily}" alt="">
    <div class="inner">
      <p class="label">You are cordially invited</p>
      <p class="to">to the wedding of</p>
      <h1 aria-label="${esc(cfg.bride)}">${pen(cfg.bride, .6)}</h1>
      <p class="and">and</p>
      <h1 aria-label="${esc(cfg.groom)}">${pen(cfg.groom, 1.5)}</h1>
    </div>
  </div>
  <div class="paper date-card">${PINS}
    <p class="d">${US_DATE}</p>
    <div class="rule"></div>
    <p class="v">${esc(cfg.venue.name)}</p>
  </div>
</section>

<section id="countdown">
  <p class="label reveal">Counting the days</p>
  ${DIVIDER}
  <p class="script reveal">until forever</p>
  <div class="cd reveal">
    ${[['d','days'],['h','hours'],['m','minutes'],['s','seconds']].map(([id, w]) =>
      `<div class="paper">${PINS}<div><b id="cd-${id}">--</b><small>${w}</small></div></div>`).join('')}
  </div>
  ${DIVIDER}
  <p class="until reveal">until we say “I do”</p>
</section>

<section id="story">
  <div class="polaroids reveal">
    ${cfg.storyPhotos.map(src => `<div class="polaroid"><div style="background-image:url('${src}')"></div></div>`).join('')}
  </div>
  <p class="label reveal">Our Story</p>
  <h2 class="script reveal">How it all began</h2>
  ${DIVIDER}
  <p class="story-text reveal">${esc(cfg.story)}</p>
</section>

<section id="events">
  <p class="day reveal">Wedding Day</p>
  <p class="script reveal">Schedule</p>
  ${DIVIDER}
  <div class="schedule">
    ${cfg.schedule.map(s => `
    <div class="slot reveal"><span class="paper ic"><i class="${s.icon}"></i></span><p class="t">${esc(s.time)}</p><p class="n">${esc(s.event)}</p></div>`).join('')}
  </div>
  <div class="paper std-card reveal">${PINS}
    <details class="std">
      <summary>
        <span class="s-ic"><i class="far fa-calendar-plus"></i></span>
        <span><h4>Save Our Day</h4><p>Add the wedding to your calendar</p></span>
        <i class="fas fa-chevron-down chev"></i>
      </summary>
      <div class="std-btns">
        <a class="btn" href="${googleCal}" target="_blank" rel="noopener noreferrer"><i class="fab fa-google"></i> Google</a>
        <button class="btn" type="button" onclick="downloadIcs()"><i class="fab fa-apple"></i> Apple / Outlook</button>
      </div>
    </details>
  </div>
</section>

<section id="gallery">
  <p class="label reveal">Captured</p>
  <h2 class="script reveal">Moments in Black &amp; White</h2>
  ${DIVIDER}
  <div class="gal reveal">
    ${cfg.gallery.map(g => `<figure data-src="${g.src}"><img src="${g.src}" alt="" loading="lazy" style="object-position:${g.position || 'center'}"></figure>`).join('')}
  </div>
</section>

<section class="venue" id="venue">
  <p class="label reveal">The Setting</p>
  <p class="script reveal">Details</p>
  ${DIVIDER}
  ${mapFrame(`${cfg.venue.name}, ${cfg.venue.address}`, cfg.venue.name)}
  <h3 class="reveal">${esc(cfg.venue.name)}</h3>
  <p class="addr reveal">${esc(cfg.venue.address)}</p>
  <p class="when reveal">Ceremony begins at ${TIME}</p>
  <a class="btn reveal" href="${cfg.venue.mapUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-location-dot"></i> Open in Maps</a>
  ${rec ? `
  <div class="second">
    <p class="label reveal">Second Location</p>
    <h3 class="reveal">${esc(rec.title)}</h3>
    <p class="addr reveal">${esc(rec.name)}</p>
    ${mapFrame(rec.mapQuery, rec.title)}
    <a class="btn reveal" href="${rec.mapUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-location-dot"></i> Open in Maps</a>
  </div>` : ''}
</section>

<section id="rsvp">
  <p class="label reveal">Kindly Respond</p>
  <h2 class="script reveal">R.S.V.P.</h2>
  ${DIVIDER}
  <p class="rsvp-note reveal">Let us know if you can celebrate this unforgettable moment with us</p>
  ${cfg.rsvpBy ? `<p class="by reveal">Please reply by ${esc(cfg.rsvpBy)}</p>` : ''}
  <form class="paper rsvp reveal" onsubmit="return sendRsvp(event)">${PINS}
    <div><label for="r-name">Your name</label><input id="r-name" required maxlength="60" placeholder="First and last name"></div>
    <div><span class="lbl">Will you celebrate with us?</span>
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
    <button class="send" type="submit"><i class="fas fa-paper-plane"></i> Send Our Reply</button>
    <p class="rsvp-done" id="rsvp-done"></p>
  </form>
</section>

<footer>
  <p class="thanks">Thank you for being part of our story.</p>
  <p class="script">${esc(cfg.bride)} &amp; ${esc(cfg.groom)}</p>
  <div class="calls">
    ${cfg.contacts.map(c => `<a href="tel:${c.phone.replace(/\s/g, '')}"><i class="fas fa-phone"></i> ${esc(c.name)} · ${esc(c.phone)}</a>`).join('')}
  </div>
</footer>`;

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
    ? `Thank you, ${name}! We can't wait to celebrate with you 💙`
    : `Thank you for letting us know, ${name}. You'll be missed 🤍`;
  return false;
}

/* ── Gallery lightbox ── */
document.querySelectorAll('.gal figure').forEach(f => f.onclick = () => {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = f.dataset.src;
  lb.classList.add('show');
});

/* ── Music: no opening gate here, so it starts on the guest's first tap anywhere ── */
const audio = document.getElementById('bg-music');
function setMusicIcon(on) {
  const btn = document.getElementById('music');
  btn.querySelector('i').className = on ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
  btn.setAttribute('aria-label', on ? 'Turn music off' : 'Turn music on');
}
function playMusic() {
  audio.volume = 0;
  audio.play().then(() => {
    let v = 0;
    const fadeIn = setInterval(() => { v = Math.min(v + .05, .7); audio.volume = v; if (v >= .7) clearInterval(fadeIn); }, 120);
    setMusicIcon(true);
  }).catch(() => {});
}
function toggleMusic() {
  if (audio.paused) playMusic();
  else { audio.pause(); setMusicIcon(false); }
}
if (!PREVIEW) addEventListener('pointerdown', function first(e) {
  removeEventListener('pointerdown', first);
  if (!e.target.closest('#music') && audio.paused) playMusic();
});

/* ── Countdown ── */
function tick() {
  const diff = when - new Date();
  const set = (id, v) => document.getElementById('cd-' + id).textContent = String(v).padStart(2, '0');
  if (diff <= 0) { 'dhms'.split('').forEach(id => set(id, 0)); return; }
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

/* ── Auto scroll (preview thumbnails only — there's no intro to start it from) ── */
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
['wheel','mousedown','keydown'].forEach(e => addEventListener(e, () => { _pauseAutoScroll(); if (AUTOPLAY) _scheduleResume(3000); }, { passive: true }));
addEventListener('touchstart', _pauseAutoScroll, { passive: true });
addEventListener('touchend', () => { if (AUTOPLAY) _scheduleResume(2000); }, { passive: true });

if (AUTOPLAY) setTimeout(startAutoScroll, 2400);
