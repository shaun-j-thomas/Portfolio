/* Interactive pieces used on the project pages. Each one is keyed by a data attribute. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const NS = 'http://www.w3.org/2000/svg';

/* ---------- segmented buttons helper ---------- */
function seg(el, onPick) {
  const bs = $$('button', el);
  bs.forEach((b, i) => b.addEventListener('click', () => { bs.forEach(x => x.setAttribute('aria-pressed', x === b)); onPick(b.dataset.k, i); }));
  const first = bs.find(b => b.getAttribute('aria-pressed') === 'true') || bs[0];
  first.setAttribute('aria-pressed', 'true'); onPick(first.dataset.k, bs.indexOf(first));
}

/* ---------- BWB: cant angle geometry explorer ---------- */
$$('[data-cant]').forEach(w => {
  const svg = $('svg', w), r = $('input', w), outA = $('[data-o=a]', w), outS = $('[data-o=s]', w), outT = $('[data-o=t]', w);
  // half-span 300 units each side of the centre line, fins 70 units long
  const span = 300, fin = 74, cy = 120;
  svg.innerHTML = `
    <line x1="-340" x2="340" y1="${cy + 18}" y2="${cy + 18}" stroke="var(--line)" stroke-dasharray="4 6"/>
    <path d="M${-span} ${cy} L-60 ${cy - 4} C -40 ${cy - 4}, -30 ${cy - 26}, 0 ${cy - 27} C 30 ${cy - 26}, 40 ${cy - 4}, 60 ${cy - 4} L${span} ${cy}" fill="none" stroke="var(--bone)" stroke-width="3" stroke-linejoin="round"/>
    <g id="cf-l"></g><g id="cf-r"></g>
    <circle cx="0" cy="${cy - 10}" r="5" fill="var(--powder)"/><text x="10" y="${cy - 14}" fill="var(--ash)" font-size="12">CG</text>`;
  const L = $('#cf-l', svg), R = $('#cf-r', svg);
  function draw(deg) {
    const a = deg * Math.PI / 180;
    [[R, 1], [L, -1]].forEach(([g, s]) => {
      const x0 = s * span, y0 = cy, x1 = x0 + s * Math.sin(a) * fin, y1 = y0 - Math.cos(a) * fin;
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, nx = s * Math.cos(a), ny = s * Math.sin(a); // outward normal of the fin
      const F = 64;
      g.innerHTML = `
        ${[0, 15, 30, 45, 60].map(d => { const b = d * Math.PI / 180; return `<line x1="${x0}" y1="${y0}" x2="${x0 + s * Math.sin(b) * fin}" y2="${y0 - Math.cos(b) * fin}" stroke="var(--line)" stroke-dasharray="3 4"/>`; }).join('')}
        <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="var(--poppy)" stroke-width="6" stroke-linecap="round"/>
        <line x1="${mx}" y1="${my}" x2="${mx - nx * F}" y2="${my - ny * F}" stroke="var(--powder)" stroke-width="2" marker-end="url(#ah)"/>
        <line x1="${mx}" y1="${my}" x2="${mx - nx * F}" y2="${my}" stroke="var(--powder)" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>`;
    });
    outA.textContent = deg + '°';
    outS.textContent = Math.round(Math.cos(a) * 100) + '%';
    outT.textContent = deg + '°';
  }
  const defs = document.createElementNS(NS, 'defs');
  defs.innerHTML = '<marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--powder)"/></marker>';
  svg.prepend(defs);
  r.addEventListener('input', () => draw(+r.value)); draw(+r.value);
});

/* ---------- BWB: derivative bars against the tunnel ---------- */
$$('[data-deriv]').forEach(w => {
  const rows = JSON.parse(w.dataset.deriv), host = $('.bars', w), note = $('[data-o=note]', w);
  const labels = { cy: 'CYβ', cl: 'Clβ', cn: 'Cnβ' };
  function draw(k) {
    const tun = Math.abs(rows[0][k]), max = Math.max(...rows.map(r => Math.abs(r[k]))) * 1.08;
    host.innerHTML = rows.map((r, i) => {
      const v = r[k], err = i ? ((Math.abs(v) - tun) / tun * 100) : 0, wpc = Math.abs(v) / max * 100;
      const best = !i ? '' : Math.abs(err) < 12 ? '' : 'hot';
      return `<div class="row ${i ? '' : 'tunnel'}"><span>${r.n}</span><div class="track"><div class="fill ${best}" style="width:${wpc}%"></div><div class="ref" style="left:${tun / max * 100}%" ${i ? '' : `data-l="tunnel"`}></div></div><div class="val">${v.toFixed(3)}${i ? `<br><small style="color:var(--ash);font-weight:400">${err > 0 ? '+' : ''}${err.toFixed(0)}%</small>` : ''}</div></div>`;
    }).join('');
    note.textContent = k === 'cn' ? 'Yaw stability is the one the fins set, and the one fully turbulent models miss by 38 to 46%.' : k === 'cl' ? 'Every Transition SST run lands within 2% of the tunnel on the dihedral effect.' : 'Side force is under-predicted by every model, least by Transition SST.';
    $('[data-o=k]', w).textContent = labels[k];
  }
  seg($('.seg', w), k => draw(k));
});

/* ---------- R2S: temperatures against limits ---------- */
$$('[data-limits]').forEach(w => {
  const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { w.classList.add('in'); $$('.fill', w).forEach(f => f.style.width = f.dataset.w + '%'); io.disconnect(); } }, { threshold: 0.4 });
  $$('.fill', w).forEach(f => f.style.width = '0%');
  io.observe(w);
});

/* ---------- R2S: wall temperature study ---------- */
$$('[data-tempstudy]').forEach(w => {
  const cases = [
    { k: '295 K', c: '22 °C', d: 0.09, sf: 2.03, img: '18_deformation_295K' },
    { k: '400 K', c: '127 °C', d: 0.76, sf: 2.03, img: '19_deformation_400K' },
    { k: '500 K', c: '227 °C', d: 1.61, sf: 1.91, img: '20_deformation_500K' },
    { k: '600 K', c: '327 °C', d: 2.86, sf: 1.09, img: '21_deformation_600K' }
  ];
  const r = $('input', w), img = $('img', w), base = w.dataset.tempstudy;
  cases.forEach(c => { const i = new Image(); i.src = base + c.img + '.webp'; });
  function set(i) {
    const c = cases[i]; img.src = base + c.img + '.webp'; img.alt = 'Total deformation at ' + c.k;
    $('[data-o=t]', w).textContent = c.k; $('[data-o=c]', w).textContent = c.c;
    $('[data-o=d]', w).textContent = c.d.toFixed(2) + ' mm';
    const sf = $('[data-o=sf]', w); sf.textContent = c.sf.toFixed(2); sf.classList.toggle('hot', c.sf < 1.5);
  }
  r.addEventListener('input', () => set(+r.value)); set(+r.value);
});

/* ---------- compare sliders wired to a number ---------- */
$$('.cmp[data-mass]').forEach(c => {
  const out = $(c.dataset.mass);
  c.addEventListener('cmp', e => { const v = e.detail; out.textContent = v <= 3 ? '−50%+' : '−' + Math.round((100 - v) / 2) + '%'; });
  c.dispatchEvent(new CustomEvent('cmp', { detail: +$('input', c).value }));
});

/* ---------- MH 45: interactive polar ---------- */
$$('[data-polar]').forEach(w => {
  if (!window.MH45) return;
  const D = MH45.DATA, svg = $('svg', w), out = $('[data-o=read]', w);
  const VIEWS = {
    cl: { x: 'a', yF: 'clF', yX: 'clX', xl: 'Angle of attack, α (deg)', yl: 'Lift coefficient, CL', xr: [-4, 16], yr: [-0.5, 1.5], xt: 4, yt: 0.5, f: v => v.toFixed(2) },
    cd: { x: 'cd', yF: 'clF', yX: 'clX', xl: 'Drag coefficient, CD', yl: 'Lift coefficient, CL', xr: [0, 0.08], yr: [-0.5, 1.5], xt: 0.02, yt: 0.5, f: v => v.toFixed(2) },
    ld: { x: 'a', yF: 'ldF', yX: 'ldX', xl: 'Angle of attack, α (deg)', yl: 'Lift-to-drag ratio, L/D', xr: [-4, 16], yr: [-40, 100], xt: 4, yt: 20, f: v => v.toFixed(0) },
    cm: { x: 'a', yF: 'cmF', yX: 'cmX', xl: 'Angle of attack, α (deg)', yl: 'Quarter-chord moment, Cm', xr: [-4, 16], yr: [-0.1, 0.03], xt: 4, yt: 0.02, f: v => v.toFixed(4) }
  };
  const Wd = 720, Ht = 400, l = 64, rgt = 20, t = 20, b = 50;
  let view = 'cl', V;
  const sx = v => l + (v - V.xr[0]) / (V.xr[1] - V.xr[0]) * (Wd - l - rgt), sy = v => t + (1 - (v - V.yr[0]) / (V.yr[1] - V.yr[0])) * (Ht - t - b);
  function xs(which) { return V.x === 'a' ? D.a : (which === 'F' ? D.cdF : D.cdX); }
  function draw() {
    V = VIEWS[view];
    let g = '';
    for (let y = V.yr[0]; y <= V.yr[1] + 1e-9; y += V.yt) g += `<line x1="${l}" x2="${Wd - rgt}" y1="${sy(y)}" y2="${sy(y)}" stroke="var(--line)"/><text x="${l - 8}" y="${sy(y) + 4}" text-anchor="end" fill="var(--ash)" font-size="12">${+y.toFixed(3)}</text>`;
    for (let x = V.xr[0]; x <= V.xr[1] + 1e-9; x += V.xt) g += `<text x="${sx(x)}" y="${Ht - b + 20}" text-anchor="middle" fill="var(--ash)" font-size="12">${+x.toFixed(3)}</text>`;
    const pts = (k, which) => xs(which).map((x, i) => [sx(Math.min(x, V.xr[1])), sy(clamp(D[k][i], V.yr[0], V.yr[1]))]);
    const F = pts(V.yF, 'F'), X = pts(V.yX, 'X');
    const pd = p => p.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('');
    const stall = V.x === 'a' ? `<rect x="${sx(10)}" y="${t}" width="${sx(16) - sx(10)}" height="${Ht - t - b}" fill="var(--poppy-dim)"/><text x="${sx(10) + 8}" y="${t + 16}" fill="var(--poppy)" font-size="12" font-weight="600">Fluent unsteady, values are averages</text>` : '';
    svg.innerHTML = `${stall}${g}
      <text x="${(l + Wd - rgt) / 2}" y="${Ht - 8}" text-anchor="middle" fill="var(--ash)" font-size="12">${V.xl}</text>
      <text transform="translate(16 ${(t + Ht - b) / 2}) rotate(-90)" text-anchor="middle" fill="var(--ash)" font-size="12">${V.yl}</text>
      <path d="${pd(X)}" fill="none" stroke="var(--ash)" stroke-width="1.8" stroke-dasharray="6 5"/>
      <path d="${pd(F)}" fill="none" stroke="var(--powder)" stroke-width="2.6"/>
      ${F.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${D.a[i] > 10 ? 4.5 : 3.6}" fill="${D.a[i] > 10 ? 'var(--graphite)' : 'var(--powder)'}" stroke="var(--powder)" stroke-width="1.5"/>`).join('')}
      <g id="pc" opacity="0"><line y1="${t}" y2="${Ht - b}" stroke="var(--poppy)"/><circle r="6" fill="none" stroke="var(--poppy)" stroke-width="2"/></g>
      <rect id="hit" x="${l}" y="${t}" width="${Wd - l - rgt}" height="${Ht - t - b}" fill="transparent"/>`;
    const pc = $('#pc', svg), hit = $('#hit', svg);
    const pick = i => {
      pc.setAttribute('opacity', 1); $('line', pc).setAttribute('x1', F[i][0]); $('line', pc).setAttribute('x2', F[i][0]);
      $('circle', pc).setAttribute('cx', F[i][0]); $('circle', pc).setAttribute('cy', F[i][1]);
      out.innerHTML = `<div><b>${D.a[i]}°</b>angle of attack</div><div><b>${V.f(D[V.yF][i])}</b>Fluent</div><div><b style="color:var(--ash)">${V.f(D[V.yX][i])}</b>XFOIL, Re 685k</div>` +
        (D.a[i] > 10 ? `<div><b class="hot">±${D.sdCL[i].toFixed(2)}</b>CL spread, unsteady</div>` : `<div><b>${(D.xtr[i] * 100).toFixed(0)}%</b>transition, XFOIL x/c</div>`);
    };
    const move = e => {
      const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * Wd;
      let best = 0; F.forEach((p, i) => { if (Math.abs(p[0] - x) < Math.abs(F[best][0] - x)) best = i; }); pick(best);
    };
    hit.addEventListener('pointermove', move); hit.addEventListener('pointerdown', move);
    pick(5);
  }
  svg.setAttribute('viewBox', `0 0 ${Wd} ${Ht}`);
  seg($('.seg', w), k => { view = k; draw(); });
  // keyboard: arrow keys step through the points
  w.tabIndex = 0;
});

/* ---------- Team Ignition: inspection sheet ---------- */
$$('[data-sheet]').forEach(w => {
  const sheet = $('.sheet', w), lens = $('.lens', w), ZOOM = 2.4, parts = JSON.parse(w.dataset.sheet);
  // on phones the drawing scrolls sideways at a readable size instead of being cropped
  const sc = document.createElement('div'); sc.className = 'sheet-scroll'; sheet.before(sc); sc.append(sheet);
  const hint = document.createElement('p'); hint.className = 'sheet-hint'; hint.textContent = 'Scroll the drawing sideways and tap a marker.'; sc.after(hint);
  sheet.addEventListener('pointermove', e => {
    const r = sheet.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    lens.style.left = x + 'px'; lens.style.top = y + 'px';
    lens.style.setProperty('--bs', `${r.width * ZOOM}px ${r.height * ZOOM}px`);
    lens.style.setProperty('--bp', `${-x * ZOOM + 85}px ${-y * ZOOM + 85}px`);
  });
  sheet.addEventListener('pointerenter', () => lens.style.opacity = 1);
  sheet.addEventListener('pointerleave', () => lens.style.opacity = 0);
  const pins = $$('.pin', w);
  function pick(k) { pins.forEach(p => p.setAttribute('aria-pressed', p.dataset.k == k)); $('[data-o=h]', w).textContent = parts[k][0]; $('[data-o=p]', w).textContent = parts[k][1]; }
  pins.forEach(p => p.addEventListener('click', () => pick(+p.dataset.k))); pick(0);
});

/* ---------- BWB model: the real .glb over http, the embedded copy when opened as a local file ---------- */
const BWB_GLB_URL = '../assets/files/bwb-dissertation.glb', BWB_FALLBACK = '../assets/bwb-model.js';
window.bwbModelUrl = async () => {
  if (location.protocol !== 'file:') return BWB_GLB_URL;
  if (!window.BWB_GLB) await new Promise((ok, no) => { const s = document.createElement('script'); s.src = BWB_FALLBACK; s.onload = ok; s.onerror = no; document.head.append(s); });
  return 'data:model/gltf-binary;base64,' + window.BWB_GLB;
};

/* ---------- 3D viewer, loaded on request ---------- */
$$('[data-load3d]').forEach(btn => btn.addEventListener('click', async () => {
  let src = btn.dataset.load3d; const alt = btn.dataset.alt || '3D model';
  if (src === 'inline:bwb') {
    try { src = await window.bwbModelUrl(); } catch (e) { btn.querySelector('span').textContent = 'Could not load the model.'; return; }
  } else if (location.protocol === 'file:') { btn.querySelector('span').textContent = 'This model is too large to embed, so it needs the page served over http. Browsers block it from a local file.'; return; }
  btn.querySelector('span').textContent = 'Loading the model…';
  const go = () => { const mv = document.createElement('model-viewer'); mv.setAttribute('src', src); mv.setAttribute('alt', alt); mv.setAttribute('camera-controls', ''); mv.setAttribute('auto-rotate', ''); mv.setAttribute('shadow-intensity', '0.6'); mv.setAttribute('exposure', '1.05'); mv.style.marginTop = '34px'; btn.replaceWith(mv); };
  if (customElements.get('model-viewer')) return go();
  const s = document.createElement('script'); s.type = 'module'; s.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
  s.onload = go; s.onerror = () => btn.querySelector('span').textContent = 'Could not load the 3D viewer.'; document.head.append(s);
}));
})();
