/* ── Load config: lovegate.html?demo=lovegate&guest=Mr+%26+Mrs+Silva[&preview=1][&autoscroll=1] ── */
const params    = new URLSearchParams(location.search);
const PREVIEW   = params.get('preview') === '1';
const AUTOPLAY  = params.get('autoscroll') === '1';
const cfg       = window.DEMOS[params.get('demo')] || window.DEMOS.lovegate;
const art       = cfg.art;
const guestName = params.get('guest');

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Theme ── */
const themeVars = { bg:'--bg', sand:'--sand', ink:'--ink', brown:'--brown', wine:'--wine', wineLight:'--wine-light', rose:'--rose', gold:'--gold' };
Object.entries(cfg.theme).forEach(([k, v]) => themeVars[k] && document.documentElement.style.setProperty(themeVars[k], v));
document.title = `${cfg.bride} & ${cfg.groom} · Wedding Invitation`;
if (PREVIEW) [document.documentElement, document.body].forEach(el => el.classList.add('is-preview'));
if (window.self !== window.top) document.documentElement.classList.add('in-frame');

/* ── Dates ── */
const when    = new Date(cfg.date);
const MONTH   = when.toLocaleString('en-US', { month: 'long' });
const WEEKDAY = when.toLocaleString('en-US', { weekday: 'long' });
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
const mapQuery = encodeURIComponent(`${cfg.venue.name}, ${cfg.venue.address}`);

document.getElementById('app').innerHTML = `
<section class="hero" id="home">
  <video autoplay muted loop playsinline preload="auto" poster="${art.heroPoster || ''}"><source src="${art.heroVideo}" type="video/mp4"></video>
  <div class="veil"></div>
  <div class="copy">
    <p class="fam">Together with their families</p>
    <p class="of">the wedding of</p>
    <h1>${esc(cfg.bride)}<span class="amp">&amp;</span>${esc(cfg.groom)}</h1>
    <p class="when">${MONTH} ${when.getDate()} · ${when.getFullYear()}</p>
    <p class="where">${TIME} · ${esc(cfg.venue.name)}</p>
  </div>
  <div class="scroll">scroll</div>
</section>

<section id="countdown">
  <div class="heart-rule reveal">♥</div>
  <p class="kicker reveal">Counting Down</p>
  <h2 class="script-h reveal">until we say I do</h2>
  <p class="cd-date reveal">${WEEKDAY}, ${US_DATE}</p>
  <div class="cd reveal">
    ${[['d','Days'],['h','Hours'],['m','Minutes'],['s','Seconds']].map(([id, w]) =>
      `<div class="unit"><div class="tile"><i></i><i></i><i></i><i></i><b id="cd-${id}">00</b></div><p>${w}</p></div>`).join('')}
  </div>
  <p class="heartbeat reveal">counting every heartbeat</p>
</section>

<section id="story">
  <p class="kicker reveal">Our Story</p>
  <h2 class="script-h reveal">How we got here</h2>
  <div class="thin"></div>
  <div class="chapters">
    ${cfg.journey.map((j, i) => `
    <article class="chapter reveal">
      <p class="yr">${esc(j.year)}</p>
      <div><p class="num">Chapter ${String(i + 1).padStart(2, '0')}</p><h3>${esc(j.title)}</h3><p>${esc(j.text)}</p></div>
    </article>`).join('')}
  </div>
</section>

<section id="events">
  <p class="kicker reveal">Programme</p>
  <h2 class="serif-h reveal">Order of the Day</h2>
  <div class="thin"></div>
  <ol class="programme">
    ${cfg.events.map(e => `
    <li class="reveal"><span class="dot"><i class="${e.icon}"></i></span>
      <div class="head"><h3>${esc(e.title)}</h3><span class="time">${esc(e.time)}</span></div>
      <p class="place">${esc(e.place)}</p>
      <p>${esc(e.note)}</p>
    </li>`).join('')}
  </ol>
  <details class="std reveal">
    <summary>
      <span class="s-ic"><i class="far fa-calendar-plus"></i></span>
      <span><h4>Add to Calendar</h4><p>Save the date to your calendar</p></span>
      <i class="fas fa-chevron-down chev"></i>
    </summary>
    <div class="std-btns">
      <a class="btn" href="${googleCal}" target="_blank" rel="noopener noreferrer"><i class="fab fa-google"></i> Google</a>
      <button class="btn" type="button" onclick="downloadIcs()"><i class="fab fa-apple"></i> Apple / Outlook</button>
    </div>
  </details>
</section>

<section id="gallery">
  <p class="kicker reveal">From the Album</p>
  <h2 class="serif-h reveal">Captured Moments</h2>
  <div class="thin"></div>
  <div class="gal reveal">
    ${cfg.gallery.map((g, i) => `<figure data-src="${g.src}"><img src="${g.src}" alt="" loading="lazy" style="object-position:${g.position || 'center'}"><span>${String(i + 1).padStart(2, '0')}</span></figure>`).join('')}
  </div>
</section>

<section class="venue" id="venue">
  <p class="kicker reveal">The Setting</p>
  <h2 class="serif-h reveal">${esc(cfg.venue.name)}</h2>
  <div class="thin"></div>
  <p class="addr reveal">${esc(cfg.venue.address)}</p>
  <div class="map reveal">
    ${PREVIEW ? '<div class="blank"></div>' : `<iframe src="https://maps.google.com/maps?q=${mapQuery}&output=embed" loading="lazy" allowfullscreen title="Wedding venue map" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
  </div>
  <a class="btn reveal" href="${cfg.venue.mapUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-location-dot"></i> Open in Maps</a>
</section>

<section id="rsvp">
  <p class="kicker reveal">Reply</p>
  <h2 class="script-h reveal">Kindly Reply</h2>
  <div class="thin"></div>
  ${cfg.rsvpBy ? `<p class="reply-by reveal">Please reply by ${esc(cfg.rsvpBy)}</p>` : ''}
  <div class="card reveal">
    <p class="title">The Reply Card</p>
    <p class="couple">${esc(cfg.bride)} &amp; ${esc(cfg.groom)}</p>
    <form onsubmit="return sendRsvp(event)">
      <div><input id="r-name" required maxlength="60" placeholder="Your full name" aria-label="Your name"><p class="lbl">Name</p></div>
      <div><p class="lbl">Kindly tick one</p>
        <div class="ticks">
          <button type="button" class="on" data-a="yes">Joyfully Accepts</button>
          <button type="button" data-a="no">Regretfully Declines</button>
        </div>
      </div>
      <div id="r-count-wrap"><p class="lbl">Number of guests</p>
        <div class="stepper">
          <button type="button" onclick="stepGuests(-1)" aria-label="Decrease guest count">−</button>
          <span id="r-count">1</span>
          <button type="button" onclick="stepGuests(1)" aria-label="Increase guest count">+</button>
        </div>
      </div>
      <button class="send" type="submit">Send Reply <i class="fas fa-arrow-right"></i></button>
      <p class="rsvp-done" id="rsvp-done"></p>
    </form>
  </div>
</section>

<footer>
  <div class="heart-rule">♥</div>
  <p class="names">${esc(cfg.bride)} &amp; ${esc(cfg.groom)}</p>
  <p class="meta">${WEEKDAY}, ${US_DATE} · ${esc(cfg.venue.name)}</p>
  <div class="calls">
    ${cfg.contacts.map(c => `<a href="tel:${c.phone.replace(/\s/g, '')}">${esc(c.name)} · ${esc(c.phone)}</a>`).join('')}
  </div>
  <p class="thanks">Thank you for being part of our story.</p>
  <p class="vol">${esc(cfg.templateName)} · Vol. I</p>
</footer>`;

document.getElementById('bg-music').src = cfg.music;
if (guestName) document.getElementById('r-name').value = guestName;

/* ── RSVP (demo: stored only in this browser; a real app posts to the server) ── */
let attending = true, guests = 1;
document.querySelectorAll('.ticks button').forEach(b => b.onclick = () => {
  attending = b.dataset.a === 'yes';
  document.querySelectorAll('.ticks button').forEach(x => x.classList.toggle('on', x === b));
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
    ? `Thank you, ${name}! We can't wait to celebrate with you ♥`
    : `Thank you for letting us know, ${name}. You'll be missed.`;
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
