/* Hero: live panel-method flow around the MH 45, cross-checked against the Fluent sweep.
   Particles are advected through a precomputed Hess-Smith velocity field (two unit solutions,
   superposed for any angle of attack). The readout compares inviscid lift with the Fluent
   and XFOIL numbers from mh45_results.csv, and above 10 degrees the separated region behind
   the suction peak goes unsteady, as it did in Fluent. */
(() => {
const cv = document.getElementById('flow'); if (!cv || !window.MH45) return;
const M = window.MH45, ctx = cv.getContext('2d'), hero = cv.closest('.hero');
const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const D2R = Math.PI / 180;
const S0 = M.solve();

/* ---- velocity grid in the aerofoil frame ---- */
const GX0 = -1.2, GX1 = 2.8, GY0 = -1.1, GY1 = 1.1, H = 0.0125;
const NX = Math.round((GX1 - GX0) / H) + 1, NY = Math.round((GY1 - GY0) / H) + 1;
const G = new Float32Array(NX * NY * 4); let gridRows = 0;
const tmp = [0, 0, 0, 0];
function buildRows(n) {
  const end = Math.min(NY, gridRows + n);
  for (; gridRows < end; gridRows++) {
    const y = GY0 + gridRows * H;
    for (let i = 0; i < NX; i++) {
      const x = GX0 + i * H, k = (gridRows * NX + i) * 4;
      if (x > -0.02 && x < 1.02 && y > -0.06 && y < 0.09 && S0.inside([x, y])) { G[k] = G[k + 1] = G[k + 2] = G[k + 3] = 0; continue; }
      S0.field(x, y, tmp); G[k] = tmp[0]; G[k + 1] = tmp[1]; G[k + 2] = tmp[2]; G[k + 3] = tmp[3];
    }
  }
}
const ready = () => gridRows >= NY;

let alpha = 5 * D2R, alphaT = alpha, ca = Math.cos(alpha), sa = Math.sin(alpha);
let CLp = 0;
function setAlpha(a) { alpha = a; ca = Math.cos(a); sa = Math.sin(a); CLp = S0.cl0 * ca + S0.cl1 * sa; }
setAlpha(alpha);

/* aerofoil-frame velocity for the current alpha */
function velA(x, y, o) {
  if (!ready() || x <= GX0 || x >= GX1 - H || y <= GY0 || y >= GY1 - H) {
    // freestream plus the bound vortex seen from far away
    const g = -CLp / 2, dx = x - 0.25, dy = y, r2 = dx * dx + dy * dy + 1e-6;
    o[0] = ca - g * dy / (2 * Math.PI * r2); o[1] = sa + g * dx / (2 * Math.PI * r2); return;
  }
  const fx = (x - GX0) / H, fy = (y - GY0) / H, i = fx | 0, j = fy | 0, tx = fx - i, ty = fy - j;
  const k00 = (j * NX + i) * 4, k10 = k00 + 4, k01 = k00 + NX * 4, k11 = k01 + 4;
  const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty;
  const u0 = G[k00] * w00 + G[k10] * w10 + G[k01] * w01 + G[k11] * w11;
  const v0 = G[k00 + 1] * w00 + G[k10 + 1] * w10 + G[k01 + 1] * w01 + G[k11 + 1] * w11;
  const u1 = G[k00 + 2] * w00 + G[k10 + 2] * w10 + G[k01 + 2] * w01 + G[k11 + 2] * w11;
  const v1 = G[k00 + 3] * w00 + G[k10 + 3] * w10 + G[k01 + 3] * w01 + G[k11 + 3] * w11;
  o[0] = u0 * ca + u1 * sa; o[1] = v0 * ca + v1 * sa;
}

/* upper surface lookup for the separated region */
function upperY(x) {
  const X = M.X, U = M.UP; if (x <= 0) return 0; if (x >= 1) return U[U.length - 1];
  let i = 1; while (X[i] < x) i++;
  const t = (x - X[i - 1]) / (X[i] - X[i - 1]); return U[i - 1] * (1 - t) + U[i] * t;
}
function sepStart(aDeg) { return aDeg <= 9.5 ? 2 : clamp(0.95 - (aDeg - 9.5) * 0.12, 0.3, 0.95); }

/* ---- screen mapping (aerofoil pitched nose-up by alpha about quarter chord) ---- */
let W = 0, Hh = 0, S = 1, cx = 0, cy = 0, P = [], LIGHT = false;
let INK = '176,224,230', BG = '17,17,17', EDGE = 'rgba(176,224,230,.9)', HOT = '#FF4D4D';
function toScreen(x, y) { const xq = x - 0.25; return [cx + (xq * ca + y * sa) * S, cy - (-xq * sa + y * ca) * S]; }
function toFoil(sx, sy) { const X = (sx - cx) / S, Y = -(sy - cy) / S; return [X * ca - Y * sa + 0.25, X * sa + Y * ca]; }

let lastW = 0, lastH = 0;
function resize() {
  const w = hero.clientWidth, h = hero.clientHeight;
  // phones fire resize when the address bar slides away; ignore small height-only changes
  if (w === lastW && Math.abs(h - lastH) < 140) return;
  lastW = w; lastH = h;
  const narrow = w < 760, dpr = Math.min(devicePixelRatio || 1, narrow ? 1.5 : 2); W = w; Hh = h;
  cv.width = W * dpr; cv.height = Hh * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (narrow) {
    // fit the section into the free band between the readout and the name, so they never overlap
    const hr = hero.getBoundingClientRect(), ro = document.querySelector('.readout'), copy = hero.querySelector('.hero-copy');
    const top = ro ? ro.getBoundingClientRect().bottom - hr.top + 12 : Hh * 0.15;
    const bottom = copy ? copy.getBoundingClientRect().top - hr.top - 12 : Hh * 0.6;
    const band = Math.max(bottom - top, 40);
    S = Math.min(W * 0.6, band / 0.42);   // a pitched section needs about 0.42 chord of height
    cx = W * 0.42; cy = top + band / 2;
  } else {
    S = Math.min(W * 0.3, Hh * 0.62); cx = W * 0.47; cy = Hh * 0.4;
  }
  const n = narrow ? 420 : 1100; P = []; for (let i = 0; i < n; i++) P.push(spawn(true));
  ctx.clearRect(0, 0, W, Hh);
}
function spawn(any) {
  for (let k = 0; k < 8; k++) {
    const sx = any ? Math.random() * W : -8 - Math.random() * 20, sy = Math.random() * Hh, f = toFoil(sx, sy);
    if (!(f[0] > -0.01 && f[0] < 1.01 && Math.abs(f[1]) < 0.1 && S0.inside(f))) return { x: sx, y: sy, px: sx, py: sy, life: 240 + Math.random() * 520, skip: true };
  }
  return { x: -10, y: Math.random() * Hh, px: -10, py: 0, life: 300, skip: true };
}

const o = [0, 0];
let aDeg = 5, sep = 2, t0 = performance.now();
function step(fade, t) {
  if (fade) { ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,0.04)'; ctx.fillRect(0, 0, W, Hh); ctx.globalCompositeOperation = 'source-over'; }
  const dt = 2 / S; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
  for (const p of P) {
    let sp = 1;
    for (let k = 0; k < 2; k++) {
      const f = toFoil(p.x, p.y); velA(f[0], f[1], o);
      // separated zone above the aft upper surface: slow, unsteady, recirculating
      if (f[0] > sep && f[0] < 2.2) {
        const yu = f[0] < 1 ? upperY(f[0]) : upperY(1) + (f[0] - 1) * 0.15, hgt = (Math.min(f[0], 1.6) - sep) * (0.35 + (aDeg - 9.5) * 0.03);
        if (f[1] > yu - 0.004 && f[1] < yu + hgt) {
          const d = (f[1] - yu) / Math.max(hgt, 1e-3), ph = t * 0.004 + f[0] * 9;
          const vx = 0.25 * d - 0.12 + 0.35 * Math.sin(ph + f[1] * 30), vy = 0.3 * Math.cos(ph * 1.3 + f[0] * 20);
          o[0] = vx; o[1] = vy; // already in the aerofoil frame
        }
      }
      // aerofoil frame -> screen frame
      const vx = o[0] * ca + o[1] * sa, vy = -o[0] * sa + o[1] * ca;
      p.x += vx * dt * S; p.y -= vy * dt * S; sp = Math.hypot(vx, vy);
    }
    const f = toFoil(p.x, p.y);
    if (--p.life < 0 || p.x > W + 20 || p.y < -40 || p.y > Hh + 40 || (f[0] > -0.01 && f[0] < 1.01 && Math.abs(f[1]) < 0.1 && S0.inside(f))) { Object.assign(p, spawn(false)); continue; }
    if (!p.skip && Math.abs(p.x - p.px) < 40) {
      const a = clamp(0.22 + 0.75 * (sp - 0.85), 0.14, 0.95);
      ctx.strokeStyle = 'rgba(' + INK + ',' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
    p.skip = false; p.px = p.x; p.py = p.y;
  }
  drawFoil();
}

/* aerofoil body, surface coloured by pressure coefficient, stagnation point and XFOIL transition */
function mix(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)); }
function drawFoil() {
  const C = S0.P;
  ctx.beginPath();
  C.forEach(([x, y], i) => { const s = toScreen(x, y); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); });
  ctx.closePath(); ctx.fillStyle = 'rgb(' + BG + ')'; ctx.fill();
  const cool = LIGHT ? [17, 60, 68] : [176, 224, 230], hot = LIGHT ? [229, 58, 58] : [255, 77, 77];
  ctx.lineWidth = 2.2;
  let stag = null, best = 9;
  for (let i = 0; i < S0.pan.length; i++) {
    const p = S0.pan[i], vt = S0.vt0[i] * ca + S0.vt1[i] * sa, cp = 1 - vt * vt;
    if (p.mx < 0.05 && Math.abs(vt) < best) { best = Math.abs(vt); stag = p; }
    const k = clamp(-cp / 2.2, 0, 1), c = mix(cool, hot, Math.pow(k, 0.8));
    const a = toScreen(p.x1, p.y1), b = toScreen(p.x2, p.y2);
    ctx.strokeStyle = `rgb(${c})`; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  // transition point on the upper surface (XFOIL, Ncrit 9)
  const xt = M.interp('xtr', aDeg), ts = toScreen(xt, upperY(xt)), nrm = [-sa, -ca];
  ctx.strokeStyle = HOT; ctx.lineWidth = 1.4; ctx.beginPath();
  ctx.moveTo(ts[0] + nrm[0] * 4, ts[1] + nrm[1] * 4); ctx.lineTo(ts[0] + nrm[0] * 16, ts[1] + nrm[1] * 16); ctx.stroke();
  if (stag) {
    const s = toScreen(stag.mx, stag.my);
    ctx.beginPath(); ctx.arc(s[0], s[1], 4.5, 0, 7); ctx.fillStyle = HOT; ctx.fill();
    ctx.beginPath(); ctx.arc(s[0], s[1], 10, 0, 7); ctx.strokeStyle = 'rgba(255,77,77,.35)'; ctx.lineWidth = 1; ctx.stroke();
  }
}

/* ---- readout + mini lift curve ---- */
const chart = $('ro-chart');
const cxs = a => 8 + (a + 4) / 20 * 244, cys = c => 92 - (c + 0.5) / 2 * 84;
if (chart) {
  const d = M.DATA, line = k => d.a.map((a, i) => (i ? 'L' : 'M') + cxs(a).toFixed(1) + ' ' + cys(d[k][i]).toFixed(1)).join('');
  const pl = 'M' + cxs(-4) + ' ' + cys(S0.cl0 * Math.cos(-4 * D2R) + S0.cl1 * Math.sin(-4 * D2R)) + 'L' + cxs(12) + ' ' + cys(S0.cl0 * Math.cos(12 * D2R) + S0.cl1 * Math.sin(12 * D2R));
  chart.innerHTML = `<rect x="${cxs(10)}" y="4" width="${cxs(16) - cxs(10)}" height="88" fill="var(--poppy-dim)"/>
    <line class="chart-axis" x1="8" x2="252" y1="${cys(0)}" y2="${cys(0)}"/><line class="chart-axis" x1="${cxs(0)}" x2="${cxs(0)}" y1="4" y2="92"/>
    <path d="${pl}" fill="none" stroke="var(--ash)" stroke-width=".8" opacity=".6"/>
    <path class="chart-xfoil" d="${line('clX')}"/><path class="chart-fluent" d="${line('clF')}"/>
    <circle class="chart-dot" id="ro-dot" r="4"/>
    <text class="chart-lbl" x="${cxs(10) + 3}" y="14">stall</text>
    <text class="chart-lbl" x="8" y="104">−4°</text><text class="chart-lbl" x="${cxs(16) - 14}" y="104">16°</text>
    <text class="chart-lbl" x="${cxs(0) + 4}" y="12">CL</text>`;
}
function readout() {
  aDeg = alpha / D2R; sep = sepStart(aDeg);
  const clF = M.interp('clF', aDeg), ld = M.interp('ldF', aDeg);
  $('ro-a').textContent = aDeg.toFixed(1) + '°';
  $('ro-cp').textContent = CLp.toFixed(2);
  $('ro-cf').textContent = clF.toFixed(2);
  $('ro-ld').textContent = ld.toFixed(0);
  const dot = $('ro-dot'); if (dot) { dot.setAttribute('cx', cxs(aDeg)); dot.setAttribute('cy', cys(clF)); }
  const st = $('ro-state'), stalled = aDeg > 10;
  st.classList.toggle('stall', stalled);
  st.textContent = stalled
    ? 'Past 10° the Fluent solution separates and sheds. Inviscid lift keeps climbing, real lift does not.'
    : aDeg > 4.5 && aDeg < 7 ? 'Near peak L/D. Fluent found 74 at 6°, XFOIL 88 at 5.5°.'
    : 'Attached flow. Panel method, Fluent and XFOIL agree on the lift slope.';
}

/* ---- input, theme, loop ---- */
let pointerIn = false;
hero.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; pointerIn = true; const r = hero.getBoundingClientRect(); alphaT = (14 - 18 * clamp((e.clientY - r.top) / r.height, 0, 1)) * D2R; });
hero.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch') pointerIn = false; });
// touch: swipe sideways to pitch (vertical swipes still scroll the page, see touch-action in CSS)
let touchX = null, touchA = 0, idleTimer = 0;
hero.addEventListener('pointerdown', e => { if (e.pointerType !== 'touch') return; touchX = e.clientX; touchA = alphaT / D2R; pointerIn = true; clearTimeout(idleTimer); });
hero.addEventListener('pointermove', e => {
  if (e.pointerType !== 'touch' || touchX === null) return;
  alphaT = clamp(touchA + (e.clientX - touchX) / hero.clientWidth * 24, -4, 14) * D2R;
});
const touchEnd = e => { if (e.pointerType !== 'touch') return; touchX = null; clearTimeout(idleTimer); idleTimer = setTimeout(() => pointerIn = false, 4000); };
hero.addEventListener('pointerup', touchEnd); hero.addEventListener('pointercancel', touchEnd);
function theme(light) {
  LIGHT = light;
  INK = light ? '17,60,68' : '176,224,230'; BG = light ? '229,244,246' : '17,17,17';
  EDGE = light ? '#111111' : 'rgba(176,224,230,.9)'; HOT = light ? '#e53a3a' : '#FF4D4D';
  if (W) ctx.clearRect(0, 0, W, Hh);
}
theme(document.documentElement.dataset.theme === 'light');
addEventListener('sjt-theme', e => { theme(e.detail.light); if (reduce) still(); });
let visible = true; new IntersectionObserver(e => visible = e[0].isIntersecting).observe(hero);
addEventListener('resize', () => { resize(); if (reduce) still(); });
resize(); readout();
function still() { buildRows(NY); ctx.clearRect(0, 0, W, Hh); for (let i = 0; i < 260; i++) step(false, i * 16); }
if (reduce) { still(); return; }
function frame(t) {
  if (!ready()) buildRows(14);
  if (visible) {
    if (!pointerIn) alphaT = (5 + 6.5 * Math.sin((t - t0) / 3200)) * D2R;
    const prev = alpha; setAlpha(alpha + (alphaT - alpha) * 0.05);
    if (Math.abs(alpha - prev) > 1e-4) {
      // keep particles on their screen positions; flow re-orients around the pitched section
      readout();
    }
    step(true, t);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
