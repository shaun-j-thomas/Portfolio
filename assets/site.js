/* Shared behaviour for every page: nav, theme, kinetic type, page transition,
   reveal, lightbox, table of contents, compare sliders, route lines. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ROOT = document.body.dataset.root || './';
const PAGE = document.body.dataset.page || 'home';
const CV = ROOT + 'assets/files/Shaun-John-Thomas-CV.pdf';

const PROJECTS = [
  { id: 'bwb', n: '01', title: 'Blended Wing Body UAV', short: 'BWB UAV dissertation', line: 'Winglet cant angle and yaw stability, validated with CFD', when: '2026 to 2027' },
  { id: 'r2s', n: '02', title: 'R2S Combustion Chamber V3', short: 'R2S engine, CFD and FEA', line: 'Regen-cooled thermal CFD and structural FEA of a printed engine', when: '2026 to now' },
  { id: 'mh45', n: '03', title: 'MH 45 Aerofoil CFD Sweep', short: 'MH 45 aerofoil sweep', line: '2D Fluent sweep on HPC, checked against published polars', when: 'Oct 2026' },
  { id: 'strathais', n: '04', title: 'StrathAIS: Nevis', short: 'StrathAIS, IREC 2026', line: 'Recovery bulkhead design and FEA for a supersonic rocket', when: '2025 to 2026' },
  { id: 'ignition', n: '05', title: 'Team Ignition: Pioneer', short: 'Team Ignition airframe', line: 'Led the airframe of a 10,000 ft high-power rocket', when: '2023 to 2025' }
];
window.SJT = { PROJECTS, ROOT };
const href = id => ROOT + 'projects/' + id + '.html';
const home = h => ROOT + 'index.html' + (h || '');
const caret = '<svg class="caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
const foil = '<svg viewBox="0 0 34 14" aria-hidden="true"><path d="M1 8 C 4 3, 12 2, 20 4.5 S 30 8, 33 7.6 C 26 9.6, 12 10.4, 1 8 Z"/><circle cx="1.6" cy="8" r="1.6"/></svg>';

/* ---------- nav ---------- */
const nav = $('header.nav');
if (nav) {
  const items = PROJECTS.map(p => `<a href="${href(p.id)}" ${PAGE === p.id ? 'aria-current="page"' : ''} data-veil="${p.title}"><span>${p.n}</span><b>${p.title}</b><em>${p.when}</em><small>${p.line}</small></a>`).join('');
  nav.innerHTML = `
  <a class="me" href="${home('#top')}" data-veil="Shaun John Thomas">${foil}Shaun John Thomas</a>
  <ul class="nav-links">
    <li class="has-menu hide-sm"><button aria-expanded="false" aria-controls="workmenu" id="workbtn">Work ${caret}</button>
      <div class="menu" id="workmenu" role="menu">${items}</div></li>
    <li class="hide-sm"><a href="${home('#about')}">About</a></li>
    <li class="hide-sm"><a href="${home('#skills')}">Skills</a></li>
    <li class="hide-sm"><a href="${home('#journey')}">Journey</a></li>
    <li class="hide-sm"><a href="${home('#contact')}">Contact</a></li>
    <li><a class="cv" href="${CV}" target="_blank" rel="noopener">View CV</a></li>
    <li><button class="theme" id="theme" aria-label="Switch colour theme"><i></i><span>Light</span></button></li>
    <li><button class="burger" id="burger" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><i></i></button></li>
  </ul>`;
  const drawer = document.createElement('div');
  drawer.className = 'drawer'; drawer.id = 'drawer';
  drawer.innerHTML = `<h3>Work</h3>${PROJECTS.map(p => `<a href="${href(p.id)}" data-veil="${p.title}"><span>${p.n}</span>${p.title}</a>`).join('')}
    <h3>Page</h3><a href="${home('#top')}">Home</a><a href="${home('#about')}">About</a><a href="${home('#skills')}">Skills</a><a href="${home('#journey')}">Journey</a><a href="${home('#contact')}">Contact</a>
    <div class="row"><a class="btn hot" href="${CV}" target="_blank" rel="noopener" style="font-size:1rem;border:0">View CV</a></div>`;
  nav.after(drawer);
  const wb = $('#workbtn'), wm = $('#workmenu'), bg = $('#burger');
  const setMenu = o => { wb.setAttribute('aria-expanded', o); wm.classList.toggle('open', o); };
  wb.addEventListener('click', e => { e.stopPropagation(); setMenu(wb.getAttribute('aria-expanded') !== 'true'); });
  wb.parentElement.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') setMenu(true); });
  wb.parentElement.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') setMenu(false); });
  document.addEventListener('click', e => { if (!wb.parentElement.contains(e.target)) setMenu(false); });
  const setDrawer = o => { bg.setAttribute('aria-expanded', o); drawer.classList.toggle('open', o); document.body.style.overflow = o ? 'hidden' : ''; };
  bg.addEventListener('click', () => setDrawer(bg.getAttribute('aria-expanded') !== 'true'));
  drawer.addEventListener('click', e => { if (e.target.closest('a')) setDrawer(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); setDrawer(false); closeLb(); } });
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });
}

/* ---------- footer links (project pages and home share it) ---------- */
$$('[data-footnav]').forEach(el => {
  el.innerHTML = PROJECTS.map(p => `<a href="${href(p.id)}" data-veil="${p.title}">${p.n} ${p.short}</a>`).join('');
});
const SOCIAL = { linkedin: 'https://www.linkedin.com/in/shaun-john-thomas-0635652aa', github: 'https://github.com/shaun-j-thomas' };
$$('.foot').forEach(f => {
  const row = document.createElement('div');
  row.className = 'foot2';
  row.innerHTML = `<span>Glasgow, Scotland</span>
    <a href="${SOCIAL.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
    <a href="${SOCIAL.github}" target="_blank" rel="noopener">GitHub ↗</a>
    <a href="${CV}" target="_blank" rel="noopener">CV ↗</a>
    <button class="totop" type="button">Back to top <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14V2M3 7l5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>`;
  f.after(row);
  row.querySelector('.totop').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
});

/* ---------- analytics: GoatCounter, same endpoint as the live site, only on the real domain ---------- */
if (location.hostname === 'shaun-j-thomas.github.io') {
  const gc = document.createElement('script');
  gc.async = true; gc.src = 'https://gc.zgo.at/count.js';
  gc.dataset.goatcounter = 'https://shaunjthomas.goatcounter.com/count';
  document.body.append(gc);
}

/* ---------- copy email ---------- */
$$('a.sl[href^="mailto:"]').forEach(a => {
  const addr = a.getAttribute('href').slice(7);
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'copy'; b.setAttribute('aria-label', 'Copy email address');
  b.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg><span>Copy</span>';
  const wrap = document.createElement('span'); wrap.className = 'mailrow';
  a.replaceWith(wrap); wrap.append(a, b);
  const label = b.querySelector('span');
  const done = ok => { label.textContent = ok ? 'Copied' : 'Press Ctrl+C'; b.classList.toggle('ok', ok); setTimeout(() => { label.textContent = 'Copy'; b.classList.toggle('ok', false); }, 2000); };
  b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(addr); done(true); }
    catch (e) { const r = document.createRange(); r.selectNodeContents(a); const sel = getSelection(); sel.empty(); sel.addRange(r); done(false); }
  });
});

/* ---------- prev / next on project pages ---------- */
const np = $('[data-nextprev]');
if (np) {
  const i = PROJECTS.findIndex(p => p.id === PAGE), prev = PROJECTS[(i + PROJECTS.length - 1) % PROJECTS.length], next = PROJECTS[(i + 1) % PROJECTS.length];
  np.innerHTML = `<a href="${href(prev.id)}" data-veil="${prev.title}"><small>← Previous project, ${prev.n}</small><b>${prev.title}</b></a>
                  <a href="${href(next.id)}" data-veil="${next.title}"><small>Next project, ${next.n} →</small><b>${next.title}</b></a>`;
}

/* ---------- theme ---------- */
const themeBtn = $('#theme');
function applyTheme(light) {
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  if (themeBtn) themeBtn.querySelector('span').textContent = light ? 'Dark' : 'Light';
  dispatchEvent(new CustomEvent('sjt-theme', { detail: { light } }));
}
applyTheme(document.documentElement.dataset.theme === 'light');
if (themeBtn) themeBtn.onclick = () => { const l = document.documentElement.dataset.theme !== 'light'; applyTheme(l); try { localStorage.setItem('sjt-theme', l ? 'light' : 'dark'); } catch (e) {} };

/* ---------- page transition (scan-line veil) ---------- */
const veil = document.createElement('div');
veil.className = 'veil'; veil.setAttribute('aria-hidden', 'true');
veil.innerHTML = '<div class="panel"><b></b></div><div class="edge"></div>';
document.body.append(veil);
let incoming = null; try { incoming = sessionStorage.getItem('sjt-veil'); sessionStorage.removeItem('sjt-veil'); } catch (e) {}
if (incoming && !reduce) {
  veil.querySelector('b').textContent = incoming; veil.classList.add('in');
  veil.querySelector('.panel').addEventListener('animationend', e => { if (e.animationName === 'vout') veil.classList.remove('in'); });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-veil]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === '_blank') return;
  const url = new URL(a.href, location.href);
  if (url.pathname === location.pathname) return; // same-page anchors scroll normally
  if (reduce) return;
  e.preventDefault();
  try { sessionStorage.setItem('sjt-veil', a.dataset.veil); } catch (err) {}
  veil.querySelector('b').textContent = a.dataset.veil;
  veil.classList.remove('in'); void veil.offsetWidth; veil.classList.add('out');
  setTimeout(() => { location.href = a.href; }, 480);
});
addEventListener('pageshow', e => { if (e.persisted) veil.classList.remove('out', 'in'); });

/* ---------- kinetic width + scroll progress ---------- */
const kinHero = $('.hero h1.kin'), prog = $('.progress');
let lastY = scrollY, vsm = 0;
(function tick() {
  const dy = scrollY - lastY; lastY = scrollY; vsm += (Math.abs(dy) - vsm) * 0.14;
  // scroll-speed width, applied to the hero name only (other headings stay fixed so text never re-wraps mid-scroll)
  if (!reduce && kinHero && scrollY < innerHeight * 1.2) kinHero.style.setProperty('--wdth', (125 - clamp(vsm * 1.5, 0, 63)).toFixed(1));
  if (prog) prog.style.transform = `scaleX(${clamp(scrollY / (document.body.scrollHeight - innerHeight), 0, 1)})`;
  requestAnimationFrame(tick);
})();

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.reveal').forEach(el => io.observe(el));

/* ---------- table of contents ---------- */
let tocLinks = $$('.toc a[href^="#"]');
if (tocLinks.length) {
  // compact "on this page" bar for narrow screens, built from the same list
  const body = $('.doc > div:not(.toc)'), mt = document.createElement('nav');
  mt.className = 'mtoc'; mt.setAttribute('aria-label', 'On this page');
  mt.innerHTML = `<button type="button" aria-expanded="false"><small>On this page</small><b></b>${caret}</button><ol>${tocLinks.map(a => `<li><a href="${a.getAttribute('href')}">${a.textContent}</a></li>`).join('')}</ol>`;
  if (body) body.prepend(mt);
  const mb = mt.querySelector('button'), setOpen = o => { mt.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); };
  mb.addEventListener('click', () => setOpen(!mt.classList.contains('open')));
  mt.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', e => { if (!mt.contains(e.target)) setOpen(false); });
  const setNavH = () => document.documentElement.style.setProperty('--navh', (nav ? nav.offsetHeight : 70) + 'px');
  setNavH(); addEventListener('resize', setNavH);
  tocLinks = tocLinks.concat($$('a', mt));
  const secs = $$('.toc a[href^="#"]').map(a => $(a.getAttribute('href'))).filter(Boolean);
  const mark = () => {
    let cur = secs[0];
    for (const s of secs) if (s.getBoundingClientRect().top < innerHeight * 0.35) cur = s;
    tocLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id));
    const on = $('.toc a.on'); mb.querySelector('b').textContent = on ? on.textContent : '';
  };
  addEventListener('scroll', mark, { passive: true }); mark();
}

/* ---------- lightbox ---------- */
const lb = document.createElement('div');
lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Enlarged figure');
lb.innerHTML = '<button class="x" aria-label="Close">×</button><figure><img alt=""><figcaption></figcaption></figure>';
document.body.append(lb);
let lastFocus = null;
function closeLb() { if (!lb.classList.contains('open')) return; lb.classList.remove('open'); if (lastFocus) lastFocus.focus(); }
lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.x')) closeLb(); });
$$('figure .frame').forEach(fr => {
  const img = fr.querySelector('img'); if (!img) return;
  fr.tabIndex = 0; fr.setAttribute('role', 'button'); fr.setAttribute('aria-label', 'Enlarge: ' + img.alt);
  const open = () => {
    lastFocus = fr; const li = lb.querySelector('img'); li.src = img.currentSrc || img.src; li.alt = img.alt;
    const cap = fr.closest('figure').querySelector('figcaption'); lb.querySelector('figcaption').innerHTML = cap ? cap.innerHTML : '';
    lb.classList.add('open'); lb.querySelector('.x').focus();
  };
  fr.addEventListener('click', open);
  fr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
});

/* ---------- compare sliders ---------- */
$$('.cmp').forEach(c => {
  const r = c.querySelector('input'); if (!r) return;
  const up = () => { c.style.setProperty('--x', r.value + '%'); c.dispatchEvent(new CustomEvent('cmp', { detail: +r.value })); };
  r.addEventListener('input', up); up();
});

/* ---------- route lines (journey and progress trackers) ---------- */
const routes = $$('.route');
function routesUpdate() {
  for (const route of routes) {
    const stops = $$('.stop', route), r = route.getBoundingClientRect();
    const max = route.dataset.max ? +route.dataset.max : 1;
    const p = clamp((innerHeight * 0.85 - r.top) / (innerHeight * 0.5), 0, 1) * max;
    route.style.setProperty('--p', p);
    stops.forEach((s, i) => s.classList.toggle('on', p >= i / (stops.length - 1) - 0.02));
  }
}
if (routes.length) { addEventListener('scroll', routesUpdate, { passive: true }); addEventListener('resize', routesUpdate); routesUpdate(); }

})();
