const WHATSAPP_NUMBER = '94771495443';   // keep in sync with index.html

const params = new URLSearchParams(location.search);
const keys   = Object.keys(window.DEMOS);
const key    = keys.includes(params.get('demo')) ? params.get('demo') : keys[0];
const d      = window.DEMOS[key];
const guest  = params.get('guest');
const idx    = keys.indexOf(key);

const demoUrl = k => `${window.DEMOS[k].page || 'invite.html'}?demo=${k}` + (guest ? `&guest=${encodeURIComponent(guest)}` : '');
const previewUrl = k => `preview.html?demo=${k}` + (guest ? `&guest=${encodeURIComponent(guest)}` : '');

document.title = `${d.templateName} · Bloom & Vows`;
const frame = document.getElementById('frame');
frame.src = demoUrl(key);
/* Hide the invitation's own scrollbar inside the phone (same origin, so we can style it) */
frame.addEventListener('load', () => {
  try {
    const s = frame.contentDocument.createElement('style');
    s.textContent = 'html{scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none}';
    frame.contentDocument.head.appendChild(s);
  } catch (_) {}
});
document.getElementById('open-full').href = demoUrl(key);
document.getElementById('tpl-name').textContent = d.templateName;
document.getElementById('tpl-count').textContent = `${idx + 1}/${keys.length}`;
document.getElementById('make-price').textContent = d.price ? `· from Rs. ${d.price}` : '';
document.getElementById('make').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'd like to order the ${d.templateName} invitation template.`)}`;
document.getElementById('make').target = '_blank';

/* Backdrop: the template's own artwork if it has one, otherwise a soft wash of its colours */
if (d.art && d.art.backdrop) {
  document.body.style.backgroundImage = `url('${d.art.backdrop}')`;
} else {
  document.body.style.background = d.theme.bg;
  document.getElementById('tint').style.background =
    `radial-gradient(ellipse 60% 70% at 20% 20%, ${d.theme.accentLight}, transparent 70%),
     radial-gradient(ellipse 60% 70% at 85% 85%, color-mix(in srgb, ${d.theme.accent} 25%, transparent), transparent 70%)`;
}
document.getElementById('statusbar').style.background = d.theme.bg;

/* Prev / next template */
const go = step => location.href = previewUrl(keys[(idx + step + keys.length) % keys.length]);
document.getElementById('prev').onclick = () => go(-1);
document.getElementById('next').onclick = () => go(1);
addEventListener('keydown', e => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });

/* Scale the phone to fit the window height */
function fit() {
  const phone = document.getElementById('phone');
  if (innerWidth <= 600) { phone.style.transform = ''; return; }
  const s = Math.min(1, (innerHeight - 40) / phone.offsetHeight, (innerWidth - 40) / phone.offsetWidth);
  phone.style.transform = `scale(${s})`;
}
fit();
addEventListener('resize', fit);
