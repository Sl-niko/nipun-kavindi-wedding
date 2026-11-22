/* ── Load config: kandyan.html?demo=nilame&guest=John+Silva[&preview=1][&autoscroll=1] ── */
const params    = new URLSearchParams(location.search);
const PREVIEW   = params.get('preview') === '1';
const AUTOPLAY  = params.get('autoscroll') === '1';
const cfg       = window.DEMOS[params.get('demo')] || window.DEMOS.nilame;
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
const GOLD = cfg.theme.amp;

/* ── Ornaments (inline SVG so they pick up the theme gold) ── */
const LOTUS = `<svg viewBox="0 0 100 60" fill="${GOLD}"><path d="M50 4C42 18 42 34 50 50C58 34 58 18 50 4Z"/><path d="M50 50C40 40 28 30 14 28C20 40 34 50 50 50Z" opacity=".85"/><path d="M50 50C60 40 72 30 86 28C80 40 66 50 50 50Z" opacity=".85"/><path d="M50 50C36 46 20 46 4 52C18 58 36 56 50 50Z" opacity=".65"/><path d="M50 50C64 46 80 46 96 52C82 58 64 56 50 50Z" opacity=".65"/></svg>`;
const LAMP = `<svg viewBox="0 0 60 110"><g fill="${GOLD}"><path class="flame" d="M30 2C24 14 24 22 30 28C36 22 36 14 30 2Z" fill="#ffcf5a"/><ellipse cx="30" cy="34" rx="22" ry="6"/><path d="M10 34Q30 48 50 34L46 40Q30 50 14 40Z"/><rect x="27" y="44" width="6" height="40"/><ellipse cx="30" cy="62" rx="10" ry="4"/><path d="M14 98Q30 84 46 98Z"/><rect x="10" y="98" width="40" height="6" rx="3"/></g></svg>`;
const DOOR_ORN = `<svg viewBox="0 0 120 240" fill="none" stroke="${GOLD}" stroke-width="2.5"><rect x="6" y="6" width="108" height="228" rx="6"/><circle cx="60" cy="120" r="34"/><circle cx="60" cy="120" r="20"/><path d="M60 86V40M60 154V200M26 120H6M94 120h20"/><path d="M60 40c-14 10-14 22 0 30c14-8 14-20 0-30zM60 200c-14-10-14-22 0-30c14 8 14 20 0 30z"/><circle cx="60" cy="120" r="5" fill="${GOLD}"/></svg>`;
const RULE = `<svg class="orn" viewBox="0 0 150 20" fill="none" stroke="${GOLD}" stroke-width="1.5"><path d="M0 10H55M95 10H150"/><path d="M75 2l8 8-8 8-8-8z" fill="${GOLD}"/><circle cx="60" cy="10" r="2.5" fill="${GOLD}"/><circle cx="90" cy="10" r="2.5" fill="${GOLD}"/></svg>`;
const vineSvg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="26" viewBox="0 0 60 26" fill="none" stroke="${GOLD}" stroke-width="1.6"><path d="M0 13C10 3 20 3 30 13S50 23 60 13"/><path d="M15 8c-4-6 2-8 4-4M45 18c4 6-2 8-4 4"/><circle cx="30" cy="13" r="2" fill="${GOLD}"/></svg>`);
const VINE = `<div class="vine" style="background-image:url('data:image/svg+xml,${vineSvg}')"></div>`;

document.getElementById('door-l').innerHTML = DOOR_ORN;
document.getElementById('door-r').innerHTML = DOOR_ORN;
document.getElementById('door-mono').textContent = cfg.monogram;

/* ── Calendar link ── */
function calendarUrl() {
  const start = new Date(cfg.date);
  const end = new Date(start.getTime() + (cfg.durationHours || 4) * 36e5);
  const fmt = x => `${x.getFullYear()}${String(x.getMonth()+1).padStart(2,'0')}${String(x.getDate()).padStart(2,'0')}T${String(x.getHours()).padStart(2,'0')}${String(x.getMinutes()).padStart(2,'0')}00`;
  const q = new URLSearchParams({
    action: 'TEMPLATE', text: `${cfg.bride} & ${cfg.groom} Wedding`,
    dates: `${fmt(start)}/${fmt(end)}`, details: 'Join us for our wedding celebration!', location: cfg.venue.name
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/* ── Render ── */
const p = cfg.parents || {};
document.getElementById('app').innerHTML = `
<section class="hero">
  ${Array.from({ length: 14 }, () => `<i class="spark" style="left:${Math.random()*100}%;bottom:${Math.random()*30}%;animation-duration:${(Math.random()*5+5).toFixed(1)}s;animation-delay:${(Math.random()*5).toFixed(1)}s"></i>`).join('')}
  <p class="hero-greet si">${esc(cfg.greeting || 'ආයුබෝවන්')}</p>
  <p class="hero-eyebrow">The wedding of</p>
  <h1 class="hero-names">${esc(cfg.bride)}<span class="amp">&amp;</span>${esc(cfg.groom)}</h1>
  <p class="hero-date">${esc(cfg.dateText)}</p>
  <div class="arch">
    <div class="arch-lotus">${LOTUS}</div>
    <div class="arch-inner"><img src="${cfg.heroImage}" alt="${esc(cfg.bride)} &amp; ${esc(cfg.groom)}"></div>
    <div class="lamp l">${LAMP}</div><div class="lamp r">${LAMP}</div>
  </div>
  <div class="hero-base"></div>
  ${VINE}
</section>

<section class="s s-card">
  <p class="eyebrow reveal">With the blessings of the Triple Gem</p>
  <p class="lead reveal">Together with our families, we warmly invite</p>
  <span class="guest reveal" id="guest-name"></span>
  <p class="lead reveal">to grace the auspicious occasion of our wedding, and to share in the joy as we begin our life together.</p>
  ${p.bride || p.groom ? `
  <div class="parents reveal">
    <div><b>Daughter of</b>${esc(p.bride || '')}</div>
    <span>✦</span>
    <div><b>Son of</b>${esc(p.groom || '')}</div>
  </div>` : ''}
</section>

<section class="s s-alt">
  <p class="eyebrow reveal">Save the date</p>
  <h2 class="title reveal">The Auspicious Day</h2>
  ${RULE}
  <div class="details">
    <div class="dcard reveal"><i class="fas fa-calendar-days"></i><h4>DATE</h4><p>${esc(cfg.dateText.replace(/\s*·\s*/g, ' '))}</p></div>
    <div class="dcard reveal"><i class="fas fa-sun"></i><h4>PORUWA · NEKATH</h4><p>${esc(cfg.nekath || cfg.schedule[1]?.time || '')}</p></div>
    <div class="dcard reveal"><i class="fas fa-location-dot"></i><h4>VENUE</h4><p>${esc(cfg.venue.name)}</p>
      <a href="${cfg.venue.mapUrl}" target="_blank" rel="noopener noreferrer">Get directions →</a></div>
  </div>
</section>

${cfg.story ? `
<section class="s s-card">
  <p class="eyebrow reveal">How it began</p>
  <h2 class="title reveal">Our Story</h2>
  ${RULE}
  <div class="story reveal">
    <img src="${cfg.story.image}" alt="" loading="lazy">
    <p>${esc(cfg.story.text)}</p>
  </div>
</section>` : ''}

<section class="s s-dark">
  ${VINE}
  <p class="eyebrow reveal" style="margin-top:34px">Counting the moments</p>
  <h2 class="title reveal">Until We Wed</h2>
  ${RULE}
  <div class="cd reveal">
    ${['Days','Hours','Minutes','Seconds'].map(u => `<div><b id="cd-${u[0].toLowerCase()}">--</b><small>${u}</small></div>`).join('')}
  </div>
  <p class="cd-sub reveal">...until the Poruwa ceremony 🪷</p>
</section>

<section class="s s-alt">
  <p class="eyebrow reveal">Order of the day</p>
  <h2 class="title reveal">Programme</h2>
  ${RULE}
  <div class="tl">
    ${cfg.schedule.map(s => `
    <div class="tl-row reveal">
      <div class="tl-ic">${s.icon}</div>
      <div><div class="tl-time">${esc(s.time)}</div><div class="tl-ev">${esc(s.event)}</div></div>
    </div>`).join('')}
  </div>
</section>

<section class="s s-card">
  <p class="eyebrow reveal">Moments</p>
  <h2 class="title reveal">Gallery</h2>
  ${RULE}
  <div class="gal reveal">
    ${cfg.gallery.map(g => `<figure data-src="${g.src}"><img src="${g.src}" alt="${esc(g.caption || '')}" loading="lazy" style="object-position:${g.position || 'center'}"></figure>`).join('')}
  </div>
</section>

<section class="s s-alt" id="rsvp">
  <p class="eyebrow reveal">Kindly respond</p>
  <h2 class="title reveal">Will You Join Us?</h2>
  ${RULE}
  <form class="rsvp reveal" onsubmit="return sendRsvp(event)">
    <div class="choice">
      <button type="button" class="on" data-a="yes"><i class="fas fa-heart"></i> Joyfully accept</button>
      <button type="button" data-a="no">Regretfully decline</button>
    </div>
    <div><label for="r-name">YOUR NAME</label><input id="r-name" required maxlength="60"></div>
    <div id="r-count-wrap"><label for="r-count">NUMBER OF GUESTS</label>
      <select id="r-count">${[1,2,3,4,5,6].map(n => `<option>${n}</option>`).join('')}</select></div>
    <button class="btn" type="submit"><i class="fas fa-paper-plane"></i> Send RSVP</button>
    <p class="rsvp-done" id="rsvp-done"></p>
    <a class="btn ghost" href="${calendarUrl()}" target="_blank" rel="noopener noreferrer"><i class="fab fa-google"></i> Add to Calendar</a>
  </form>
</section>

<footer>
  <div style="width:70px;margin:0 auto 6px">${LOTUS}</div>
  <p class="si">ස්තූතියි</p>
  <p>${esc(cfg.bride)} &amp; ${esc(cfg.groom)} · ${esc(cfg.venue.name)}</p>
  <p>Questions? ${cfg.contacts.map(c => `<a href="https://wa.me/${c.wa}" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i> ${esc(c.name)}</a>`).join(' · ')}</p>
</footer>`;

const guestEl = document.getElementById('guest-name');
guestEl.textContent = guestName;
if (params.get('guest')) document.getElementById('r-name').value = guestName;
document.getElementById('bg-music').src = cfg.music;

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
  const entry = { name, attending, guests: attending ? +document.getElementById('r-count').value : 0, at: new Date().toISOString() };
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

/* ── Door intro ── */
const intro = document.getElementById('door-intro');
if (PREVIEW) intro.remove();
else document.body.style.overflow = 'hidden';

function openDoors() {
  const audio = document.getElementById('bg-music');
  document.getElementById('door-center').classList.add('hidden');
  intro.classList.add('is-opening');
  audio.volume = 0;
  audio.play().then(() => {
    let v = 0;
    const fadeIn = setInterval(() => { v = Math.min(v + .05, .75); audio.volume = v; if (v >= .75) clearInterval(fadeIn); }, 120);
    document.getElementById('music-icon').className = 'fas fa-pause';
    document.getElementById('music-label').textContent = 'Pause';
  }).catch(() => {});
  setTimeout(() => { intro.classList.add('fading'); document.body.style.overflow = ''; }, 1500);
  setTimeout(() => { intro.remove(); setTimeout(startAutoScroll, 1200); }, 2400);
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
  setInterval(spawn, 2200);
})();

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
