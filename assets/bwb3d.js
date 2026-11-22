/* BWB scroll story: the dissertation CAD in three.js, camera driven by scroll.
   Camera choreography ported from the earlier Next.js site's BwbEngine.
   The model is the real .glb online, or the embedded copy in bwb-model.js when opened as a local file. */
(() => {
const story = document.getElementById('story'); if (!story) return;
const canvas = story.querySelector('canvas'), stage = story.querySelector('.story-stage');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a, b, t) => a + (b - a) * t, ease = t => t * t * (3 - 2 * t), clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// camera keyframes, one per chapter (positions in metres, model centred)
const SHOTS = [
  { pos: [-1.55, 1.05, -2.35], target: [-0.3, -0.3, 0.1], edges: 0.12, solid: 1, flow: 0, dims: 0, shift: 0.18 },
  { pos: [0, 3.5, 0.5], target: [0, 0, 0.05], edges: 0.95, solid: 0.3, flow: 0, dims: 1, shift: 0.17 },
  { pos: [3.0, 0.14, 0.15], target: [0, 0.02, 0], edges: 0.25, solid: 1, flow: 0, dims: 0, shift: -0.17 },
  { pos: [1.45, 0.42, 1.05], target: [0.55, 0.04, 0.12], edges: 0.15, solid: 1, flow: 0, dims: 0, shift: 0.18 },
  { pos: [-1.95, 1.0, -2.15], target: [0, -0.04, 0.15], edges: 0.04, solid: 1, flow: 1, dims: 0, shift: -0.17 }
];

let started = false;
const io = new IntersectionObserver(e => { if (e[0].isIntersecting && !started) { started = true; io.disconnect(); boot(); } }, { rootMargin: '200px' });
io.observe(story);

async function boot() {
  let THREE, GLTFLoader, RoomEnvironment;
  try {
    THREE = await import('three');
    ({ GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'));
    ({ RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js'));
  } catch (e) { fail('Could not load the 3D library (needs an internet connection).'); return; }
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { fail('WebGL is not available in this browser.'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50), pivot = new THREE.Group();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.45; pm.dispose();
  const key = new THREE.DirectionalLight(0xffffff, 1.3); key.position.set(-2, 4, -1);
  const rim = new THREE.DirectionalLight(0xb0e0e6, 3); rim.position.set(2, 0.6, 3);
  const under = new THREE.DirectionalLight(0xff4d4d, 0.5); under.position.set(0, -2, 0);
  scene.add(key, rim, under, new THREE.AmbientLight(0x2a2d30, 0.6));

  const solidMat = new THREE.MeshPhysicalMaterial({ color: 0xd5dde0, metalness: 0.3, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15, transparent: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xb0e0e6, transparent: true, depthWrite: false });
  const flowMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
    vertexShader: 'attribute float aS; attribute float aSeed; varying float vS; varying float vSeed; void main(){ vS=aS; vSeed=aSeed; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform float uTime; uniform float uOpacity; varying float vS; varying float vSeed;
      void main(){ float head=fract(uTime*0.22+vSeed); float d=head-vS; if(d<0.0) d+=1.0; float trail=exp(-d*9.0);
      float edge=smoothstep(0.0,0.08,vS)*smoothstep(1.0,0.85,vS);
      vec3 col=mix(vec3(0.69,0.88,0.90), vec3(1.0,1.0,1.0), trail);
      gl_FragColor=vec4(col,(0.05+trail*0.85)*edge*uOpacity); }`
  });
  const dimMats = [], dimGroup = new THREE.Group(); dimGroup.renderOrder = 10;
  scene.add(pivot, dimGroup);

  // model
  let bytes;
  try {
    const url = await window.bwbModelUrl();
    bytes = await (await fetch(url)).arrayBuffer();
  } catch (e) { fail('Could not load the model.'); return; }
  new GLTFLoader().parse(bytes, '', gltf => {
    const mesh = gltf.scene.getObjectByProperty('type', 'Mesh'), geo = mesh.geometry;
    geo.computeBoundingBox(); const c = geo.boundingBox.getCenter(new THREE.Vector3()); geo.translate(-c.x, -c.y, -c.z); geo.computeBoundingBox();
    pivot.add(new THREE.Mesh(geo, solidMat), new THREE.LineSegments(new THREE.EdgesGeometry(geo, 22), edgeMat));
    buildFlow(geo.boundingBox); buildDims(geo.boundingBox);
    story.classList.add('ready');
  }, () => fail('Could not read the model.'));

  function buildFlow(box) {
    const halfSpan = box.max.x, lines = 140, seg = 90, pos = [], s = [], seed = [], idx = []; let v = 0;
    for (let i = 0; i < lines; i++) {
      const x = (Math.random() * 2 - 1) * halfSpan * 1.25, y0 = (Math.random() * 2 - 1) * 0.16, above = y0 >= 0 ? 1 : -1, r = Math.abs(x) / halfSpan;
      const le = lerp(box.min.z, box.min.z + (box.max.z - box.min.z) * 0.62, Math.min(r, 1)), te = box.max.z, thick = r < 1 ? lerp(0.09, 0.025, r) : 0, sd = Math.random();
      for (let k = 0; k <= seg; k++) {
        const t = k / seg, z = lerp(-1.9, 1.9, t), mid = (le + te) / 2, half = (te - le) / 2 + 0.08;
        const bump = Math.exp(-Math.pow((z - mid) / half, 4)), y = y0 + above * thick * bump * (above > 0 ? 1 : 0.6) * Math.exp(-Math.abs(y0) * 6) - t * 0.04;
        pos.push(x * (1 + 0.04 * Math.max(0, z - te) * Math.sign(x)), y, z); s.push(t); seed.push(sd);
        if (k > 0) idx.push(v - 1, v); v++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aS', new THREE.Float32BufferAttribute(s, 1)); g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1)); g.setIndex(idx);
    const f = new THREE.LineSegments(g, flowMat); f.frustumCulled = false; scene.add(f);
  }
  function buildDims(box) {
    const y = box.max.y + 0.02, z = box.max.z + 0.12, x = box.max.x;
    const mk = pts => { const m = new THREE.LineBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 0, depthTest: false }); dimMats.push(m); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); return new THREE.LineSegments(g, m); };
    dimGroup.add(mk([-x, y, z, x, y, z]), mk([-x, y, z - 0.05, -x, y, z + 0.05, x, y, z - 0.05, x, y, z + 0.05]), mk([-x, y, z - 0.3, -x, y, z + 0.05, x, y, z - 0.3, x, y, z + 0.05]));
  }

  function theme() {
    const light = document.documentElement.dataset.theme === 'light';
    scene.fog = new THREE.Fog(light ? 0xf2f9fa : 0x111111, 3.5, 9);
    edgeMat.color.set(light ? 0x1d6b78 : 0xb0e0e6);
    flowMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending; flowMat.needsUpdate = true;
  }
  theme(); addEventListener('sjt-theme', theme);

  const cur = { pos: [-1.6, 0.4, -1.8], target: [0, 0, 0], edges: 1, solid: 0, flow: 0, dims: 0, shift: 0 };
  const ptr = new THREE.Vector2(), ptrS = new THREE.Vector2(), look = new THREE.Vector3(), clock = new THREE.Clock();
  addEventListener('pointermove', e => ptr.set(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1), { passive: true });
  let intro = 0, visible = true;
  new IntersectionObserver(e => visible = e[0].isIntersecting).observe(stage);
  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 1 ? 50 : 32; camera.updateProjectionMatrix();
  }
  new ResizeObserver(size).observe(canvas); size();

  const chapters = [...story.querySelectorAll('.ch')];
  function shotNow() {
    const r = story.getBoundingClientRect(), f = clamp(-r.top / innerHeight, 0, SHOTS.length - 1);
    chapters.forEach((c, i) => c.classList.toggle('on', Math.abs(f - i) < 0.5));
    const i = Math.floor(f), j = Math.min(i + 1, SHOTS.length - 1), t = ease(f - i), a = SHOTS[i], b = SHOTS[j];
    const v3 = (p, q) => [0, 1, 2].map(k => lerp(p[k], q[k], t));
    return { pos: v3(a.pos, b.pos), target: v3(a.target, b.target), edges: lerp(a.edges, b.edges, t), solid: lerp(a.solid, b.solid, t), flow: lerp(a.flow, b.flow, t), dims: lerp(a.dims, b.dims, t), shift: lerp(a.shift, b.shift, t) };
  }
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 0.05), time = clock.elapsedTime, k = 1 - Math.pow(0.0015, dt);
    const s = shotNow();
    if (pivot.children.length) intro = Math.min(1, intro + dt / (reduce ? 0.01 : 2.4));
    const ie = ease(intro);
    s.solid *= ease(Math.max(0, (intro - 0.35) / 0.65)); s.edges = Math.max(s.edges, 1 - ease(Math.max(0, (intro - 0.5) / 0.5)));
    for (const key of ['edges', 'solid', 'flow', 'dims', 'shift']) cur[key] = lerp(cur[key], s[key], k);
    for (let a = 0; a < 3; a++) { cur.pos[a] = lerp(cur.pos[a], s.pos[a], k); cur.target[a] = lerp(cur.target[a], s.target[a], k); }
    const w = canvas.clientWidth, h = canvas.clientHeight, portrait = w / h < 1;
    if (w && h) camera.setViewOffset(w, h, portrait ? 0 : -cur.shift * w, portrait ? h * 0.2 : 0, w, h);
    ptrS.lerp(ptr, k * 0.6);
    const dist = (1 + (1 - ie) * 1.8) * (portrait ? 1.6 : 1);
    camera.position.set(cur.pos[0] * dist + ptrS.x * 0.12, cur.pos[1] * dist - ptrS.y * 0.08, cur.pos[2] * dist);
    look.set(...cur.target); camera.lookAt(look);
    if (!reduce) { pivot.position.y = Math.sin(time * 0.8) * 0.012; pivot.rotation.z = Math.sin(time * 0.55) * 0.012; }
    edgeMat.opacity = cur.edges; solidMat.opacity = cur.solid; solidMat.depthWrite = cur.solid > 0.9; solidMat.visible = cur.solid > 0.01;
    flowMat.uniforms.uOpacity.value = cur.flow; flowMat.uniforms.uTime.value = reduce ? 0.3 : time;
    for (const m of dimMats) m.opacity = cur.dims;
    renderer.render(scene, camera);
  })();
}
function fail(msg) { story.classList.add('failed'); const l = story.querySelector('.story-load'); if (l) l.textContent = msg; }
})();
