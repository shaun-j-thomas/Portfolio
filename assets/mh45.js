/* MH 45 aerofoil: geometry, a Hess-Smith panel solver and helpers.
   Geometry traced from Project Data/Portfolio data Airfoil/Graphs/01_mh45_geometry.png
   (10.0% thick at 28% chord, 1.69% camber, reflexed trailing edge).
   Fluent and XFOIL numbers are mh45_results.csv from the same folder. */
(function (root) {
  const X = [0,0.00099,0.00394,0.00886,0.01571,0.02447,0.03511,0.04759,0.06185,0.07784,0.09549,0.11474,0.13552,0.15773,0.18129,0.20611,0.23209,0.25912,0.28711,0.31594,0.34549,0.37566,0.40631,0.43733,0.4686,0.5,0.5314,0.56267,0.59369,0.62434,0.65451,0.68406,0.71289,0.74088,0.76791,0.79389,0.81871,0.84227,0.86448,0.88526,0.90451,0.92216,0.93815,0.95241,0.96489,0.97553,0.98429,0.99114,0.99606,0.99901,1];
  const UP = [0,0.00403,0.00894,0.01387,0.02004,0.0252,0.03055,0.03616,0.04112,0.04512,0.04942,0.05301,0.05657,0.05984,0.06169,0.06345,0.0649,0.06581,0.06601,0.06568,0.06498,0.06429,0.06216,0.0604,0.05792,0.05508,0.05196,0.04869,0.04513,0.04122,0.03695,0.03317,0.02876,0.02485,0.02126,0.01774,0.01453,0.01169,0.00952,0.00707,0.00565,0.00388,0.00246,0.00211,0.00105,0.0007,0.00068,0.00071,0.00071,0.0008,0];
  const LO = [0,-0.00349,-0.00643,-0.00902,-0.01218,-0.01536,-0.01887,-0.02144,-0.02392,-0.02641,-0.02854,-0.03032,-0.03173,-0.03279,-0.03349,-0.03383,-0.03381,-0.03415,-0.03341,-0.03268,-0.03194,-0.03109,-0.02975,-0.0283,-0.02685,-0.02539,-0.02394,-0.02249,-0.02103,-0.01958,-0.01813,-0.01668,-0.01523,-0.01413,-0.01268,-0.01159,-0.01014,-0.00905,-0.00797,-0.00724,-0.00615,-0.00578,-0.00469,-0.00397,-0.00331,-0.00273,-0.0018,-0.00144,-0.00108,-0.00072,0];

  function setGeometry(g) { X.length = 0; UP.length = 0; LO.length = 0; X.push(...g.x); UP.push(...g.up); LO.push(...g.lo); }

  // Fluent (Transition SST) and XFOIL (Re 685k, Ncrit 9) from mh45_results.csv
  const DATA = {
    a:   [-4,-2,0,2,4,6,8,10,12,14,16],
    clF: [-0.3532,-0.1461,0.0841,0.3148,0.5364,0.7532,0.9568,1.1413,1.077,0.9336,0.7827],
    cdF: [0.01131,0.00658,0.00562,0.00628,0.0077,0.01012,0.0147,0.02148,0.06855,0.11863,0.18936],
    cmF: [-0.0025,-0.0016,-0.0025,-0.0046,-0.0053,-0.0064,-0.0075,-0.0083,-0.0399,-0.0567,-0.0815],
    ldF: [-31.2,-22.2,15,50.2,69.7,74.4,65.1,53.1,15.7,7.9,4.1],
    clX: [-0.3592,-0.1445,0.066,0.3527,0.5667,0.7783,0.9807,1.1671,1.3063,1.3323,1.2608],
    cdX: [0.01057,0.00719,0.00534,0.00576,0.00693,0.00888,0.01197,0.01605,0.02236,0.03643,0.07245],
    cmX: [-0.0041,-0.0021,0.0018,-0.0109,-0.0091,-0.0076,-0.0056,-0.0021,0.0058,0.0135,-0.0004],
    ldX: [-34,-20.1,12.4,61.2,81.8,87.6,81.9,72.7,58.4,36.6,17.4],
    sdCL:[0.0001,0,0.0001,0,0,0,0,0.0066,0.2755,0.2817,0.2107],
    xtr: [0.7691,0.709,0.6361,0.5158,0.3709,0.2164,0.0903,0.0329,0.0118,0.0054,0.0035]
  };
  function interp(key, a) {
    const A = DATA.a, Y = DATA[key];
    if (a <= A[0]) return Y[0];
    if (a >= A[A.length - 1]) return Y[Y.length - 1];
    const i = Math.min(A.length - 2, Math.floor((a - A[0]) / 2));
    const t = (a - A[i]) / (A[i + 1] - A[i]);
    return Y[i] * (1 - t) + Y[i + 1] * t;
  }

  /* Closed contour, clockwise: TE -> lower -> LE -> upper -> TE */
  function contour() {
    const pts = [];
    for (let i = X.length - 1; i >= 0; i--) pts.push([X[i], LO[i]]);
    for (let i = 1; i < X.length; i++) pts.push([X[i], UP[i]]);
    return pts;
  }

  /* Hess-Smith: constant source per panel + one uniform vortex strength, Kutta condition.
     Solution is linear in the freestream, so we solve for (1,0) and (0,1) once and superpose. */
  function solve() {
    const P = contour(), N = P.length - 1, pan = [];
    for (let j = 0; j < N; j++) {
      const [x1, y1] = P[j], [x2, y2] = P[j + 1], L = Math.hypot(x2 - x1, y2 - y1);
      const tx = (x2 - x1) / L, ty = (y2 - y1) / L;
      pan.push({ x1, y1, x2, y2, L, tx, ty, nx: -ty, ny: tx, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 });
    }
    // unit-strength influence (global velocity) of panel j at point
    function infl(p, px, py, self) {
      const dx = px - p.x1, dy = py - p.y1;
      const xl = dx * p.tx + dy * p.ty, yl = dx * p.nx + dy * p.ny;
      let beta, lnr;
      if (self) { beta = Math.PI; lnr = 0; }
      else {
        const r1 = Math.hypot(xl, yl), r2 = Math.hypot(xl - p.L, yl);
        beta = Math.atan2(yl, xl - p.L) - Math.atan2(yl, xl);
        if (beta > Math.PI) beta -= 2 * Math.PI; else if (beta < -Math.PI) beta += 2 * Math.PI;
        lnr = Math.log(r1 / r2);
      }
      const k = 1 / (2 * Math.PI);
      const su = k * lnr, sv = k * beta;      // source, local
      const vu = -k * beta, vv = k * lnr;     // vortex, local
      return {
        sx: su * p.tx + sv * p.nx, sy: su * p.ty + sv * p.ny,
        vx: vu * p.tx + vv * p.nx, vy: vu * p.ty + vv * p.ny
      };
    }
    const M = N + 1, A = [], B0 = new Float64Array(M), B1 = new Float64Array(M);
    const T = []; // tangential influence rows for Kutta
    for (let i = 0; i < N; i++) {
      const row = new Float64Array(M), trow = new Float64Array(M), pi = pan[i];
      for (let j = 0; j < N; j++) {
        const f = infl(pan[j], pi.mx, pi.my, i === j);
        row[j] = f.sx * pi.nx + f.sy * pi.ny;
        row[N] += f.vx * pi.nx + f.vy * pi.ny;
        trow[j] = f.sx * pi.tx + f.sy * pi.ty;
        trow[N] += f.vx * pi.tx + f.vy * pi.ty;
      }
      A.push(row); T.push(trow);
      B0[i] = -pi.nx; B1[i] = -pi.ny;
    }
    const kr = new Float64Array(M);
    for (let j = 0; j < M; j++) kr[j] = T[0][j] + T[N - 1][j];
    A.push(kr);
    B0[N] = -(pan[0].tx + pan[N - 1].tx); B1[N] = -(pan[0].ty + pan[N - 1].ty);
    const s0 = gauss(A.map(r => Float64Array.from(r)), B0), s1 = gauss(A.map(r => Float64Array.from(r)), B1);
    let per = 0; for (const p of pan) per += p.L;
    // CL = -2 Gamma_ccw / (V c),  Gamma_ccw = gamma * perimeter
    const cl0 = -2 * s0[N] * per, cl1 = -2 * s1[N] * per;
    // surface tangential speed per panel for each unit solution
    const vt0 = new Float64Array(N), vt1 = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      let a = pan[i].tx, b = pan[i].ty;
      for (let j = 0; j < M; j++) { a += T[i][j] * s0[j]; b += T[i][j] * s1[j]; }
      vt0[i] = a; vt1[i] = b;
    }
    function field(px, py, out) { // velocity for freestream (1,0) and (0,1)
      let u0 = 1, v0 = 0, u1 = 0, v1 = 1;
      for (let j = 0; j < N; j++) {
        const f = infl(pan[j], px, py, false);
        u0 += f.sx * s0[j] + f.vx * s0[N]; v0 += f.sy * s0[j] + f.vy * s0[N];
        u1 += f.sx * s1[j] + f.vx * s1[N]; v1 += f.sy * s1[j] + f.vy * s1[N];
      }
      out[0] = u0; out[1] = v0; out[2] = u1; out[3] = v1;
    }
    return { pan, P, cl0, cl1, vt0, vt1, field, inside: pt => pip(P, pt[0], pt[1]) };
  }
  function gauss(A, b) {
    const n = b.length; b = Float64Array.from(b);
    for (let c = 0; c < n; c++) {
      let m = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[m][c])) m = r;
      [A[c], A[m]] = [A[m], A[c]]; [b[c], b[m]] = [b[m], b[c]];
      for (let r = c + 1; r < n; r++) {
        const f = A[r][c] / A[c][c]; if (!f) continue;
        for (let k = c; k < n; k++) A[r][k] -= f * A[c][k];
        b[r] -= f * b[c];
      }
    }
    const x = new Float64Array(n);
    for (let r = n - 1; r >= 0; r--) { let s = b[r]; for (let k = r + 1; k < n; k++) s -= A[r][k] * x[k]; x[r] = s / A[r][r]; }
    return x;
  }
  function pip(P, x, y) {
    let c = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const [xi, yi] = P[i], [xj, yj] = P[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }

  root.MH45 = { X, UP, LO, DATA, interp, contour, solve, setGeometry };
})(typeof window !== 'undefined' ? window : globalThis);
