/* ── Business settings ── */
const WHATSAPP_NUMBER = '94771495443';   // ← your business WhatsApp number (country code, no +)

const waLink = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Template cards ── */
// A demo can use its own layout file (e.g. kandyan.html); otherwise invite.html
const demoUrl = key => `${window.DEMOS[key].page || 'invite.html'}?demo=${key}`;
const previewUrl = key => `preview.html?demo=${key}`;   // phone-frame preview page
const demos = Object.entries(window.DEMOS);
const grid = document.getElementById('tpl-grid');
grid.innerHTML = demos.map(([key, d], i) => `
  <article class="tpl reveal" data-cat="${esc(d.category || 'Modern')}">
    <div class="tpl-stage" style="--tint:color-mix(in srgb, ${d.theme.cardTint || d.theme.accentLight} 70%, #fff)">
      ${i === 0 ? '<span class="tpl-badge">✨ New</span>' : ''}
      <div class="mini-phone"><div class="mini-screen">
        <iframe src="${demoUrl(key)}&preview=1" title="${esc(d.templateName)} preview" loading="lazy" tabindex="-1"></iframe>
      </div></div>
      <div class="tpl-hover">
        <a class="btn btn-light btn-sm" href="${previewUrl(key)}" data-demo="${key}"><i class="fas fa-eye"></i> Live preview</a>
        <a class="btn btn-primary btn-sm" href="#" data-wa="Hi! I'd like to order the ${esc(d.templateName)} invitation template.">Use this design <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
    <div class="tpl-info">
      <div>
        <h3>${esc(d.templateName)}</h3>
        <p>${esc(d.tagline)}</p>
        <div class="swatches">${[d.theme.accent, d.theme.amp, d.theme.bg].map(c => `<span style="background:${c}"></span>`).join('')}</div>
      </div>
      ${d.price ? `<div class="tpl-price"><small>From</small>Rs. ${esc(d.price)}</div>` : ''}
    </div>
  </article>`).join('');

/* Category filters */
const cats = ['All', ...new Set(demos.map(([, d]) => d.category || 'Modern'))];
const filtersEl = document.getElementById('filters');
filtersEl.innerHTML = cats.map((c, i) => {
  const n = c === 'All' ? demos.length : demos.filter(([, d]) => (d.category || 'Modern') === c).length;
  return `<button class="${i === 0 ? 'on' : ''}" data-cat="${esc(c)}">${esc(c)}<span>${n}</span></button>`;
}).join('');
filtersEl.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  filtersEl.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  grid.querySelectorAll('.tpl').forEach(t => t.classList.toggle('hide', b.dataset.cat !== 'All' && t.dataset.cat !== b.dataset.cat));
});

/* "Try with a guest name" → update every demo link */
document.getElementById('try-input').addEventListener('input', e => {
  const name = e.target.value.trim();
  document.querySelectorAll('[data-demo]').forEach(a => {
    a.href = previewUrl(a.dataset.demo) + (name ? `&guest=${encodeURIComponent(name)}` : '');
  });
});

/* ── Marquee ── */
const words = ['Poruwa ceremonies', 'Homecomings', 'Engagements', 'Nikah', 'Kandyan weddings', 'Church weddings', 'Hindu weddings', 'Garden parties'];
document.getElementById('marquee').innerHTML = [...words, ...words].map(w => `<span>${w}</span>`).join('');

/* ── All WhatsApp buttons ── */
document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = waLink(a.dataset.wa);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});

/* Close the mobile menu after picking a link */
document.querySelectorAll('#nav-links a').forEach(a => a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open')));

/* ── Scroll reveal ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

document.getElementById('yr').textContent = new Date().getFullYear();
