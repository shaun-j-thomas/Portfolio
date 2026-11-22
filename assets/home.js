/* Landing page: project previews and the skills loop. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/* every preview runs an idle animation while on screen, and the pointer takes over on hover */
const live = new Set();
const vis = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('live', e.isIntersecting)), { threshold: 0.25 });
$$('.pv').forEach(pv => vis.observe(pv));
function track(el, onMove, onIdle) {
  const pv = el.closest('.pv'); let hover = false;
  el.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; hover = true; const r = el.getBoundingClientRect(); onMove((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); });
  el.addEventListener('pointerleave', () => hover = false);
  live.add(t => { if (!hover && pv.classList.contains('live') && !reduce) onIdle(t); });
}

/* 01: scrub through a stack of images with a scan line */
$$('[data-peek]').forEach(box => {
  const imgs = $$('img', box), scan = $('.scan', box), meter = $('.meter', box), cap = $('.cap', box), n = imgs.length;
  let last = -1;
  function set(p) {
    const f = clamp(p, 0, 1) * (n - 1); let sx = -1;
    imgs.forEach((im, i) => { if (!i) return; const k = ease(clamp(f - (i - 1), 0, 1)); im.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`; if (k > 0 && k < 1) sx = k; });
    scan.style.opacity = sx < 0 ? 0 : 1; if (sx >= 0) scan.style.left = `calc(${sx * 100}% - 1px)`;
    meter.style.transform = `scaleX(${clamp(p, 0, 1)})`;
    const a = Math.round(f); if (a !== last) { last = a; cap.textContent = imgs[a].dataset.cap; }
  }
  set(0);
  track(box, x => set((x - 0.06) / 0.88), t => { const c = (t / 14000) % 1; set(c < 0.85 ? c / 0.85 : 1 - (c - 0.85) / 0.15); });
});

/* 02 and 04: compare that follows the pointer */
$$('[data-hovercmp]').forEach(box => {
  const pv = box.closest('.pv'), out = $('[data-massout]', pv);
  function set(v) {
    v = clamp(v, 0, 100); box.style.setProperty('--x', v + '%');
    if (out) out.textContent = v <= 3 ? '−50%+' : '−' + Math.round((100 - v) / 2) + '%';
  }
  set(50);
  track(box, x => set(x * 100), t => set(50 + 38 * Math.sin(t / 2600)));
});

/* 05: scan line down the rotated drawing, stations light up as it passes */
$$('[data-stations]').forEach(box => {
  const sts = $$('.st', box), sweep = $('.sweep', box);
  function set(y) {
    y = clamp(y, 0, 1); sweep.style.setProperty('--sy', y * 100 + '%');
    sts.forEach(s => { const top = parseFloat(s.style.top) / 100; s.classList.toggle('on', Math.abs(top - y) < 0.09); });
  }
  set(0.28);
  track(box, (x, y) => set(y), t => set(0.08 + 0.84 * (0.5 - 0.5 * Math.cos(t / 3000))));
});

/* 03: the MH 45 lift curve from mh45_results.csv */
const chartBox = $('#pv-chart');
if (chartBox && window.MH45) {
  const D = MH45.DATA, svg = $('svg', chartBox);
  const X = a => 54 + (a + 4) / 20 * 446, Y = c => 280 - (c + 0.5) / 2 * 256;
  const path = k => D.a.map((a, i) => (i ? 'L' : 'M') + X(a).toFixed(1) + ' ' + Y(D[k][i]).toFixed(1)).join('');
  let g = '<g class="grid">';
  for (let c = -0.5; c <= 1.51; c += 0.5) g += `<line x1="54" x2="500" y1="${Y(c)}" y2="${Y(c)}"/><text class="lab" x="44" y="${Y(c) + 4}" text-anchor="end">${c.toFixed(1)}</text>`;
  for (let a = -4; a <= 16; a += 4) g += `<text class="lab" x="${X(a)}" y="300" text-anchor="middle">${a}°</text>`;
  g += '</g>';
  svg.innerHTML = `<rect class="stall" x="${X(10)}" y="20" width="${X(16) - X(10)}" height="260"/>
    <text class="stalltxt" x="${X(10) + 8}" y="38">Fluent unsteady</text>
    ${g}
    <text class="lab" x="500" y="316" text-anchor="end">angle of attack</text>
    <text class="lab" x="14" y="16">CL</text>
    <path class="x draw" pathLength="1" d="${path('clX')}"/>
    <path class="f draw" pathLength="1" d="${path('clF')}"/>
    <g class="dots">${D.a.map((a, i) => `<circle cx="${X(a)}" cy="${Y(D.clF[i])}" r="3.2"/>`).join('')}</g>
    <g transform="translate(70 34)"><line x1="0" x2="22" y1="0" y2="0" stroke="var(--powder)" stroke-width="2.4"/><text class="lab" x="28" y="4">Fluent, Transition SST</text>
      <line x1="0" x2="22" y1="18" y2="18" stroke="var(--ash)" stroke-width="1.6" stroke-dasharray="5 5"/><text class="lab" x="28" y="22">XFOIL, Re 685k</text></g>
    <g class="cross" opacity="0"><line y1="20" y2="280"/><circle r="5"/><text y="14" text-anchor="middle"></text></g>`;
  const cross = $('.cross', svg), cl = $('line', cross), cc = $('circle', cross), ct = $('text', cross);
  const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { chartBox.classList.add('in'); io.disconnect(); } }, { threshold: 0.4 });
  io.observe(chartBox);
  function set(a) {
    a = clamp(a, -4, 16); const f = MH45.interp('clF', a), x = MH45.interp('clX', a);
    cross.setAttribute('opacity', 1); cl.setAttribute('x1', X(a)); cl.setAttribute('x2', X(a));
    cc.setAttribute('cx', X(a)); cc.setAttribute('cy', Y(f));
    ct.setAttribute('x', clamp(X(a), 150, 420));
    ct.textContent = `α ${a.toFixed(1)}°   Fluent ${f.toFixed(2)}   XFOIL ${x.toFixed(2)}`;
  }
  track(chartBox, x => { const r = svg.getBoundingClientRect(), bx = chartBox.getBoundingClientRect(); const sx = (x * bx.width - (r.left - bx.left)) / r.width * 520; set((sx - 54) / 446 * 20 - 4); },
        t => { if (chartBox.classList.contains('in') && t > 1800) set(-2 + 16 * (0.5 - 0.5 * Math.cos(t / 3400))); });
}

function loop(t) { live.forEach(f => f(t)); requestAnimationFrame(loop); }
requestAnimationFrame(loop);

/* ---------- skills loop ---------- */
const P = 'projects/';
const stages = [
  ['Research and size', ['XFLR5', 'NASA CEA', 'Hand calculations', 'Python', 'Excel'], `BWB UAV: wing loading and vortex lattice sweeps set a 3 kg, 1.5 m planform, and showed a Clark Y would not trim. <a href="${P}bwb.html">See the sizing</a>`],
  ['Design', ['SolidWorks (CSWA)', 'Onshape', 'GD&T', 'Design for manufacture'], `StrathAIS: the interface that takes the main parachute opening load into the motor bay. <a href="${P}strathais.html">See the bulkhead</a>`],
  ['Simulate', ['ANSYS Fluent', 'Fluent Meshing', 'ANSYS Mechanical', 'ARCHIE-WeSt HPC', 'Slurm'], `R2S: a 5.24M cell conjugate heat transfer model showing regen cooling alone would melt the throat. <a href="${P}r2s.html">See the CFD</a>`],
  ['Verify and validate', ['Mesh studies and GCI', 'Wind tunnel comparison', 'Published polars', 'Hand checks'], `BWB: Transition SST matched NASA tunnel Cnβ within 11%, where standard SST was 46% low. <a href="${P}bwb.html#validation">See the validation</a>`],
  ['Build and test', ['Composite wet layup', 'CNC machining', 'FDM printing', 'Pyrotechnic ground tests', 'Root-cause diagnosis'], `Team Ignition: traced an avionics dropout to a connector softening under motor heat and led the fix. <a href="${P}ignition.html">See Pioneer</a>`]
];
const ring = $('#ring');
if (ring) {
  const NS = 'http://www.w3.org/2000/svg', RR = 150, GAP = 0.16, pt = (a, r) => [Math.cos(a) * r, Math.sin(a) * r];
  stages.forEach((s, i) => {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / 5 + GAP / 2, a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / 5 - GAP / 2, [x0, y0] = pt(a0, RR), [x1, y1] = pt(a1, RR);
    const d = `M${x0} ${y0}A${RR} ${RR} 0 0 1 ${x1} ${y1}`;
    const arc = document.createElementNS(NS, 'path'); arc.setAttribute('d', d); arc.setAttribute('class', 'arc');
    const hit = document.createElementNS(NS, 'path'); hit.setAttribute('d', d); hit.setAttribute('class', 'hit'); hit.setAttribute('tabindex', '0'); hit.setAttribute('role', 'button'); hit.setAttribute('aria-label', s[0]);
    const [tx, ty] = pt((a0 + a1) / 2, RR + 30), label = document.createElementNS(NS, 'text');
    label.setAttribute('x', tx); label.setAttribute('y', ty + 5);
    label.setAttribute('text-anchor', Math.abs(tx) < 20 ? 'middle' : tx > 0 ? 'start' : 'end'); label.textContent = s[0];
    ring.append(arc, label, hit);
    const go = () => setStage(i);
    hit.addEventListener('click', go); hit.addEventListener('pointerenter', go); hit.addEventListener('focus', go);
    hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  function setStage(i) {
    $$('#ring .arc').forEach((a, k) => a.classList.toggle('on', k === i)); $$('#ring text').forEach((a, k) => a.classList.toggle('on', k === i));
    const s = stages[i]; $('#core-n').textContent = s[0].split(' ')[0]; $('#core-i').textContent = i + 1;
    $('#sd-h').textContent = s[0]; $('#sd-t').innerHTML = s[1].map((t, k) => `<li style="--i:${k}">${t}</li>`).join(''); $('#sd-p').innerHTML = s[2];
  }
  setStage(2);
}
})();
