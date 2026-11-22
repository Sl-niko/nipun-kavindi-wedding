/* ── Load config: pink.html?demo=pink&guest=Mr+%26+Mrs+Silva[&preview=1][&autoscroll=1] ── */
const params    = new URLSearchParams(location.search);
const PREVIEW   = params.get('preview') === '1';
const AUTOPLAY  = params.get('autoscroll') === '1';
const cfg       = window.DEMOS[params.get('demo')] || window.DEMOS.pink;
const art       = cfg.art;
const guestName = params.get('guest');

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Theme ── */
const themeVars = { bg:'--bg', blush:'--blush', text:'--text', rose:'--rose', roseLight:'--rose-light', gold:'--gold' };
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
const calEnd   = new Date(when.getTime() + (cfg.durationHours || 5) * 36e5);
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
const INITIALS = `${cfg.bride[0]}${cfg.groom[0]}`;
const DIVIDER = '<div class="divider reveal"><i class="fas fa-heart"></i></div>';
const SPRIGS = `<div class="sprigs"><img class="tl" src="${art.sprigCorner}" alt=""><img class="tr" src="${art.sprigCorner}" alt="">`
             + `<img class="bl" src="${art.sprigCornerB}" alt=""><img class="br" src="${art.sprigCornerB}" alt=""></div>`;
const deco = src => `<img class="deco l" src="${src}" alt=""><img class="deco r" src="${src}" alt="">`;
const head = (eyebrow, title) => `<p class="eyebrow reveal">${eyebrow}</p><h2 class="script-title reveal">${title}</h2>${DIVIDER}`;
const letters = s => [...s].map((c, i) => `<span class="ch" style="animation-delay:${(.3 + i * .06).toFixed(2)}s">${esc(c)}</span>`).join('');
const mapQuery = encodeURIComponent(`${cfg.venue.name}, ${cfg.venue.address}`);

document.getElementById('app').innerHTML = `
<section class="hero" id="home">
  <div class="wash" style="background-image:url('${art.background}')"></div>
  ${SPRIGS}
  <span class="weekday">${WEEKDAY}</span>
  <p class="save reveal">Save the date</p>
  <div class="medallion reveal"><i></i><i></i><i></i><i></i><i></i><i></i><div>${esc(cfg.bride[0])} &amp; ${esc(cfg.groom[0])}</div></div>
  <h1><span>${letters(cfg.bride)}</span><span class="amp">&amp;</span><span>${letters(cfg.groom)}</span></h1>
  <p class="request reveal">Request the pleasure of your company at their wedding celebration</p>
  <div class="date-badge reveal"><small>${MONTH.slice(0, 3)}</small><b>${when.getDate()}</b></div>
  ${DIVIDER}
  <div class="info reveal">
    <p>${US_DATE.toUpperCase()} <span>·</span> ${TIME}</p>
    <p>${esc(cfg.venue.address)}</p>
  </div>
  <div class="scroll">Scroll<i class="fas fa-chevron-down"></i></div>
</section>

<section id="countdown">
  ${deco(art.sprigBranch)}
  ${head('Counting down to forever', 'Until We Say I Do')}
  <div class="cd reveal">
    ${[['d','Days'],['h','Hours'],['m','Min'],['s','Sec']].map(([id, w], i) =>
      `${i ? '<span class="colon">:</span>' : ''}<div class="unit"><b id="cd-${id}">--</b><small>${w}</small></div>`).join('')}
  </div>
</section>

<section id="story">
  ${deco(art.sprigTall)}
  ${head('Our story', 'How We Got Here')}
  <ol class="timeline">
    ${(cfg.journey || []).map((j, i) => `
    ${i ? '<li class="heart" aria-hidden="true"><i class="fas fa-heart"></i></li>' : ''}
    <li class="step reveal"><span class="yr">${esc(j.year)}</span><h3>${esc(j.title)}</h3><p>${esc(j.text)}</p></li>`).join('')}
  </ol>
</section>

<section id="events">
  ${deco(art.sprigBranch)}
  ${head('The day', 'Order of Celebrations')}
  ${cfg.events.map(e => `
  <div class="card ev reveal">
    <div class="row"><div><span class="ic"><i class="${e.icon}"></i></span><h3>${esc(e.title)}</h3></div><span class="time">${esc(e.time)}</span></div>
    <p class="place">${esc(e.place)}</p>
    <p>${esc(e.note)}</p>
  </div>`).join('')}
</section>

<section id="gallery">
  ${deco(art.sprigTall)}
  ${head('Pressed memories', 'Our Album')}
  <div class="gal">
    ${cfg.gallery.map(g => `<figure class="reveal" data-src="${g.src}"><div><img src="${g.src}" alt="" loading="lazy" style="object-position:${g.position || 'center'}"></div><span><i class="fas fa-heart"></i></span></figure>`).join('')}
  </div>
</section>

<section class="venue" id="venue">
  ${deco(art.sprigBranch)}
  ${head('Where', esc(cfg.venue.name))}
  <p class="addr reveal">${esc(cfg.venue.address)}</p>
  <div class="postcard reveal">
    <span class="stamp"><i class="fas fa-heart"></i>Posted</span>
    ${PREVIEW ? '<div class="blank"></div>' : `<iframe src="https://maps.google.com/maps?q=${mapQuery}&output=embed" loading="lazy" allowfullscreen title="Wedding venue map" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
  </div>
  <div class="card details reveal">
    <span class="eyebrow">The date</span>
    <p class="big">${US_DATE}</p>
    <p>${WEEKDAY} · ${TIME}</p>
    <span class="eyebrow">Address</span>
    <p>${esc(cfg.venue.address)}</p>
    <a class="btn" style="margin-top:12px" href="${cfg.venue.mapUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-location-dot"></i> Open in Maps</a>
    <details class="std">
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
  </div>
</section>

<section id="rsvp">
  ${deco(art.sprigTall)}
  <div class="env-ic reveal"><i class="far fa-envelope-open"></i></div>
  ${head('R.S.V.P.', 'Kindly Reply')}
  ${cfg.rsvpBy ? `<p class="by reveal">Please respond by ${esc(cfg.rsvpBy)}</p>` : ''}
  <form class="card rsvp reveal" onsubmit="return sendRsvp(event)">
    <div><label for="r-name">Your name</label><input id="r-name" required maxlength="60" placeholder="Full name"></div>
    <div><span class="lbl">Will you attend?</span>
      <div class="choice">
        <button type="button" class="on" data-a="yes">JOYFULLY ACCEPT</button>
        <button type="button" data-a="no">REGRETFULLY DECLINE</button>
      </div>
    </div>
    <div id="r-count-wrap"><span class="lbl">Number of guests</span>
      <div class="stepper">
        <button type="button" onclick="stepGuests(-1)" aria-label="Decrease guest count">−</button>
        <span id="r-count">1</span>
        <button type="button" onclick="stepGuests(1)" aria-label="Increase guest count">+</button>
      </div>
    </div>
    <button class="btn-rose" type="submit">Send Reply <i class="fas fa-paper-plane"></i></button>
    <p class="rsvp-done" id="rsvp-done"></p>
  </form>
</section>

<footer>
  <div class="wash" style="background-image:url('${art.background}')"></div>
  ${deco(art.sprigBranch)}
  <p class="f-names">${esc(cfg.bride)} &amp; ${esc(cfg.groom)}</p>
  <p class="f-date">${US_DATE}</p>
  <p class="f-venue">${esc(cfg.venue.name)}</p>
  ${DIVIDER}
  <div class="f-calls">
    ${cfg.contacts.map(c => `<a href="tel:${c.phone.replace(/\s/g, '')}"><i class="fas fa-phone"></i> Call ${esc(c.name)}</a>`).join('')}
  </div>
  <p class="f-thanks">Thank you for being part of the love story that brought us here.</p>
  <div class="sign"><span>With love,</span><span>${esc(cfg.bride)} &amp; ${esc(cfg.groom)}</span><i class="fas fa-heart"></i></div>
</footer>`;

/* ── Intro envelope ── */
document.getElementById('i-wash').style.backgroundImage = `url('${art.background}')`;
document.getElementById('i-sprigs').outerHTML = SPRIGS;
document.getElementById('i-sub').textContent = `${cfg.bride} & ${cfg.groom} · ${US_DATE}`;
[['env-back', art.envBack], ['env-front', art.envFront], ['env-flap-out', art.envFlapOut], ['env-flap-in', art.envFlapIn],
 ['env-letter', art.letter], ['env-seal', art.seal]].forEach(([id, src]) => document.getElementById(id).src = src);
document.getElementById('seal-mono').textContent = INITIALS;
document.getElementById('letter-text').innerHTML = `
  <span class="fam">Together with their families</span>
  <span class="nm">${esc(cfg.bride)}</span><span class="amp">&amp;</span><span class="nm">${esc(cfg.groom)}</span>
  <span class="dt">${US_DATE}</span>`;
if (guestName) document.getElementById('env-for').innerHTML = `<small>Specially for</small><b>${esc(guestName)}</b>`;
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
    ? `Thank you, ${name}! We can't wait to celebrate with you 🌸`
    : `Thank you for letting us know, ${name}. You'll be missed 🤍`;
  return false;
}

/* ── Gallery lightbox ── */
document.querySelectorAll('.gal figure').forEach(f => f.onclick = () => {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = f.dataset.src;
  lb.classList.add('show');
});

/* ── Intro: tap the seal → flap folds back → letter slides out, music fades in → intro fades away ── */
const intro = document.getElementById('intro');
if (PREVIEW) intro.remove();
else document.body.style.overflow = 'hidden';

let introEnded = false;
function openIntro() {
  if (introEnded) return;
  introEnded = true;
  intro.classList.add('opening');
  setTimeout(() => {
    intro.classList.add('fading');
    document.body.style.overflow = '';
    setTimeout(() => { intro.remove(); setTimeout(startAutoScroll, 1500); }, 1000);
  }, 3000);
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
  if (audio.paused) audio.play().then(() => document.getElementById('music').classList.add('on')).catch(() => {});
  else { audio.pause(); document.getElementById('music').classList.remove('on'); }
}

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

/* ── Scroll reveal (the hero also triggers its letter-by-letter names) ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .hero').forEach(el => obs.observe(el));

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
