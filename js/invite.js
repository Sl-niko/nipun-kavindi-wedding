/* ── Load config: invite.html?demo=olive&guest=John+Silva[&preview=1][&autoscroll=1] ── */
const params    = new URLSearchParams(location.search);
const PREVIEW   = params.get('preview') === '1';
const AUTOPLAY  = params.get('autoscroll') === '1';
const cfg       = window.DEMOS[params.get('demo')] || window.DEMOS.olive;
const guestName = params.get('guest') || 'Our Dear Guest';

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Theme ── */
const themeVars = {
  bg:'--bg', bgHero:'--bg-hero', card:'--card', alt:'--alt',
  text:'--text', textMid:'--text-mid', textSoft:'--text-soft',
  accent:'--accent', accentDark:'--accent-dark', accentPale:'--accent-pale', accentLight:'--accent-light',
  name:'--name', amp:'--amp'
};
Object.entries(cfg.theme).forEach(([k, v]) => document.documentElement.style.setProperty(themeVars[k], v));
document.title = `${cfg.bride} & ${cfg.groom} · Wedding Invitation`;
if (PREVIEW) [document.documentElement, document.body].forEach(el => el.classList.add('is-preview'));

/* ── Birds ── */
const BIRD = (w, op) => `<svg width="${w}" height="${Math.round(w * .7)}" viewBox="0 0 32 22" fill="currentColor" opacity="${op}"><path d="M16,14 Q8,6 0,9 Q6,9 10,12 Q12,8 16,6 Q20,8 22,12 Q26,9 32,9 Q24,6 16,14Z"/></svg>`;
const birds = [
  ['top:6%;left:6%',   4.5, 0,   32, 1],
  ['top:5%;right:8%',  5,   .8,  26, .85],
  ['top:14%;left:2%',  6,   1.4, 20, .6],
  ['top:18%;right:3%', 3.8, 2,   22, .7]
].map(([pos, d, dd, w, op]) => `<div class="bird" style="${pos};--bd:${d}s;--bdd:${dd}s;--br:-4deg;--br2:3deg;">${BIRD(w, op)}</div>`).join('');

/* ── Calendar link ── */
function calendarUrl() {
  const start = new Date(cfg.date);
  const end = new Date(start.getTime() + (cfg.durationHours || 4) * 36e5);
  const fmt = x => `${x.getFullYear()}${String(x.getMonth()+1).padStart(2,'0')}${String(x.getDate()).padStart(2,'0')}T${String(x.getHours()).padStart(2,'0')}${String(x.getMinutes()).padStart(2,'0')}00`;
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${cfg.bride} & ${cfg.groom} Wedding`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: 'Join us for our wedding celebration!',
    location: cfg.venue.name
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/* ── Render ── */
document.getElementById('app').innerHTML = `
<section class="hero">
  ${birds}
  <div class="hero-names-block">
    <h1 class="hero-names">${esc(cfg.bride)} <span class="hero-amp">&amp;</span> ${esc(cfg.groom)}</h1>
    <div class="hero-ornament"><span>✦</span></div>
    <p class="hero-date">${esc(cfg.dateText)}</p>
  </div>
  <div class="couple-wrap reveal"><img src="${cfg.heroImage}" alt="${esc(cfg.bride)} &amp; ${esc(cfg.groom)}"></div>
</section>

<section class="invitation-section">
  <p class="invite-eyebrow reveal">✦ &nbsp; Together with their families &nbsp; ✦</p>
  <p class="invite-lead reveal">With hearts overflowing with love and joy, we invite</p>
  <span class="invitee-name reveal" id="guest-name"></span>
  <p class="invite-body reveal">
    to witness the beginning of our forever.<br><br>
    We would be deeply honoured to have you with us, celebrating this precious moment as we begin our journey together.
  </p>
  <div class="save-badge reveal">✦ &nbsp; Save the Date · ${esc(cfg.dateText.replace(/\s*·\s*/g, ' '))} &nbsp; ✦</div>
  <div class="venue-card reveal">
    <p class="venue-label">✦ &nbsp; Venue &nbsp; ✦</p>
    <p class="venue-name">${esc(cfg.venue.name)}</p>
    <a href="${cfg.venue.mapUrl}" target="_blank" rel="noopener noreferrer" class="venue-link">
      <i class="fas fa-map-marker-alt"></i> Get Directions
    </a>
  </div>
</section>

<section class="gallery-section">
  <div class="sec-rule reveal"><span>✦</span></div>
  <div class="carousel-wrap reveal">
    <div class="carousel-frame">
      <div class="c-track" id="c-track">
        ${cfg.gallery.map(g => `<div class="c-slide"><img src="${g.src}" alt="" loading="lazy" style="object-position:${g.position || 'center'}"></div>`).join('')}
      </div>
      <div class="c-caption" id="c-caption"></div>
      <button class="c-btn prev" onclick="slide(-1)" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
      <button class="c-btn next" onclick="slide(1)" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
    </div>
    <div class="c-dots" id="c-dots"></div>
  </div>
</section>

<section class="countdown-section">
  <div class="gold-rule"><span class="gold-rule-icon">✦</span></div>
  <p class="cd-label reveal">~ counting down to our special day ~</p>
  <div class="cd-grid">
    ${['Days','Hours','Minutes','Seconds'].map(u => `<div class="cd-item reveal"><div class="cd-val" id="cd-${u[0].toLowerCase()}">--</div><div class="cd-unit">${u}</div></div>`).join('')}
  </div>
  <p class="cd-sub reveal">...until we say "I do" 🤍</p>
</section>

<section class="schedule-section">
  <div class="gold-rule"><span class="gold-rule-icon">✦</span></div>
  <h2 class="sec-title reveal">The Schedule</h2>
  <div class="sec-rule reveal" style="margin-bottom:46px;"><span>✦</span></div>
  <div class="timeline">
    ${cfg.schedule.map(s => `
    <div class="tl-item reveal">
      <div class="tl-icon">${s.icon}</div>
      <div class="tl-body"><div class="tl-time">${esc(s.time)}</div><div class="tl-event">${esc(s.event)}</div></div>
    </div>`).join('')}
  </div>
</section>

<section class="rsvp-section">
  <div class="gold-rule"><span class="gold-rule-icon">✦</span></div>
  <p class="rsvp-msg reveal">Will you join us?</p>
  <p class="rsvp-q reveal">Kindly let us know</p>
  <div class="btn-row reveal">
    <button class="btn-g btn-solid" onclick="rsvp(true)"><i class="fas fa-heart"></i> Joyfully Accept</button>
    <button class="btn-g btn-outline" onclick="rsvp(false)"><i class="fas fa-envelope"></i> Regretfully Decline</button>
  </div>
  <p class="rsvp-done" id="rsvp-done"></p>
  <div class="btn-row rsvp-cal reveal">
    <a href="${calendarUrl()}" target="_blank" rel="noopener noreferrer" class="btn-g btn-outline">
      <i class="fab fa-google"></i> Add to Calendar
    </a>
  </div>
</section>

<footer>
  <p>Questions? &nbsp;
    <button class="footer-contact-btn" onclick="document.getElementById('contact-modal').classList.add('show')">
      <i class="fab fa-whatsapp"></i> Contact us on WhatsApp
    </button>
  </p>
  <p class="made">${esc(cfg.bride)} &amp; ${esc(cfg.groom)} · ${esc(cfg.venue.name)}</p>
</footer>`;

document.getElementById('guest-name').textContent = guestName;
document.getElementById('env-monogram').textContent = cfg.monogram;
document.getElementById('env-bg').style.backgroundImage = `url('${cfg.envelopeImage}')`;
document.getElementById('bg-music').src = cfg.music;
document.getElementById('cm-people').innerHTML = cfg.contacts.map(c => `
  <div class="cm-person">
    <div>
      <div class="cm-name">${esc(c.name)}</div>
      <a class="cm-wa" href="https://wa.me/${c.wa}" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i> WhatsApp</a>
    </div>
    <div class="cm-num">${esc(c.phone)}</div>
  </div>`).join('');

/* ── RSVP (demo: stored only in this browser; real app posts to the server) ── */
function rsvp(yes) {
  document.getElementById('rsvp-done').textContent = yes
    ? `Thank you, ${guestName}! We can't wait to celebrate with you 🤍`
    : `Thank you for letting us know, ${guestName}. You'll be missed 🤍`;
}

/* ── Envelope intro ── */
const intro = document.getElementById('env-intro');
if (PREVIEW) intro.remove();
else document.body.style.overflow = 'hidden';

function openEnvelope() {
  const audio = document.getElementById('bg-music');
  audio.volume = 0;
  audio.play().then(() => audio.pause()).catch(() => {});
  document.getElementById('env-content').classList.add('hidden');
  setTimeout(() => intro.classList.add('is-opening'), 200);
  setTimeout(() => {
    intro.classList.add('fading');
    document.body.style.overflow = '';
    audio.play().then(() => {
      let v = 0;
      const fadeIn = setInterval(() => { v = Math.min(v + .05, .75); audio.volume = v; if (v >= .75) clearInterval(fadeIn); }, 120);
    }).catch(() => {});
    document.getElementById('music-icon').className = 'fas fa-pause';
    document.getElementById('music-label').textContent = 'Pause';
  }, 1500);
  setTimeout(() => { intro.remove(); setTimeout(startAutoScroll, 800); }, 2400);
}

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const playing = audio.paused;
  playing ? audio.play() : audio.pause();
  document.getElementById('music-icon').className = playing ? 'fas fa-pause' : 'fas fa-music';
  document.getElementById('music-label').textContent = playing ? 'Pause' : 'Music';
}

/* ── Falling petals ── */
(function () {
  function spawn() {
    const el = document.createElement('span');
    el.className = 'petal';
    const dur = (Math.random() * 8 + 8).toFixed(1);
    el.textContent = cfg.petals[Math.floor(Math.random() * cfg.petals.length)];
    el.style.cssText = `left:${Math.random() * 100}vw;top:-40px;font-size:${(Math.random() * 12 + 9).toFixed(0)}px;
      animation-duration:${dur}s;--dx:${((Math.random() - .5) * 60).toFixed(0)}px;--rot:${(Math.random() * 600 + 300).toFixed(0)}deg;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 400);
  }
  for (let i = 0; i < 3; i++) setTimeout(spawn, i * 400);
  setInterval(spawn, 1800);
})();

/* ── Carousel ── */
let cur = 0;
const TOTAL = cfg.gallery.length;
const dotsEl = document.getElementById('c-dots');
for (let i = 0; i < TOTAL; i++) {
  const d = document.createElement('button');
  d.className = 'c-dot';
  d.setAttribute('aria-label', `Photo ${i + 1}`);
  d.onclick = () => goTo(i);
  dotsEl.appendChild(d);
}
let autoSlide;
function goTo(n) {
  cur = ((n % TOTAL) + TOTAL) % TOTAL;
  document.getElementById('c-track').style.transform = `translateX(-${cur * 100}%)`;
  document.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('on', i === cur));
  document.getElementById('c-caption').textContent = cfg.gallery[cur].caption;
  clearInterval(autoSlide);
  autoSlide = setInterval(() => slide(1), 4500);
}
function slide(dir) { goTo(cur + dir); }
goTo(0);

/* ── Countdown ── */
function tick() {
  const diff = new Date(cfg.date) - new Date();
  if (diff <= 0) {
    ['d','h','m','s'].forEach(id => document.getElementById('cd-' + id).textContent = '0');
    document.querySelector('.cd-sub').textContent = '🎊 The celebration has begun!';
    return;
  }
  const set = (id, v, pad) => document.getElementById('cd-' + id).textContent = pad ? String(v).padStart(2, '0') : v;
  set('d', Math.floor(diff / 864e5));
  set('h', Math.floor((diff % 864e5) / 36e5), true);
  set('m', Math.floor((diff % 36e5) / 6e4), true);
  set('s', Math.floor((diff % 6e4) / 1e3), true);
}
tick(); setInterval(tick, 1000);

/* ── Scroll reveal ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── Auto scroll ── */
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
      // Showcase phone mock-up: loop back to the top
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
