import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Visual state the scroll choreography interpolates between.
 * Model is centred at the origin, span along X, nose towards -Z, Y up.
 */
export interface Shot {
  pos: [number, number, number];
  target: [number, number, number];
  edges: number; // blueprint edge line opacity
  solid: number; // painted surface opacity
  flow: number; // streamline opacity
  dims: number; // span dimension overlay opacity
  pitch: number; // model angle of attack in degrees
  shift: number; // horizontal screen offset, fraction of width (+ moves model right)
}

export type ViewMode = "solid" | "blueprint" | "xray";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

export class BwbEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private pivot = new THREE.Group();
  private solidMat: THREE.MeshPhysicalMaterial;
  private edgeMat: THREE.LineBasicMaterial;
  private flowMat: THREE.ShaderMaterial;
  private dimGroup = new THREE.Group();
  private dimMats: THREE.LineBasicMaterial[] = [];
  private shadow: THREE.Mesh;
  private grid: THREE.Mesh;
  private controls?: OrbitControls;
  private clock = new THREE.Clock();
  private raf = 0;
  private disposed = false;
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();
  private camTarget = new THREE.Vector3();
  private current: Shot;
  private intro = 0; // 0..1 fly-in progress
  private ro: ResizeObserver;

  shots: Shot[] = [];
  shotIndex = 0; // continuous scroll position across shots
  mode: ViewMode = "solid";
  flowOn = true;
  reducedMotion = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: { interactive?: boolean; onProgress?: (p: number) => void; onReady?: () => void } = {}
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);
    this.scene.fog = new THREE.Fog(0x030712, 3.5, 9);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.45;
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(-2, 4, -1);
    const rim = new THREE.DirectionalLight(0x22d3ee, 3);
    rim.position.set(2, 0.6, 3);
    const under = new THREE.DirectionalLight(0x6366f1, 0.8);
    under.position.set(0, -2, 0);
    this.scene.add(key, rim, under, new THREE.AmbientLight(0x1e293b, 0.5));

    this.solidMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9d3de,
      metalness: 0.35,
      roughness: 0.28,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
      transparent: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    this.edgeMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, depthWrite: false });

    this.flowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
      vertexShader: `
        attribute float aS; attribute float aSeed;
        varying float vS; varying float vSeed;
        void main(){ vS=aS; vSeed=aSeed; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uTime; uniform float uOpacity;
        varying float vS; varying float vSeed;
        void main(){
          float head = fract(uTime*0.22 + vSeed);
          float d = head - vS; if (d < 0.0) d += 1.0;
          float trail = exp(-d*9.0);
          float edge = smoothstep(0.0,0.08,vS)*smoothstep(1.0,0.85,vS);
          vec3 col = mix(vec3(0.13,0.83,0.93), vec3(0.75,0.95,1.0), trail);
          gl_FragColor = vec4(col, (0.06 + trail*0.9)*edge*uOpacity);
        }`,
    });

    // Soft contact shadow + fading ground grid
    const shadowTex = this.radialTexture("rgba(0,0,0,0.55)", "rgba(0,0,0,0)");
    this.shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.3),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = -0.22;
    this.grid = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uOpacity: { value: 1 } },
        vertexShader: `varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader: `
          uniform float uOpacity; varying vec2 vP;
          float line(float c, float w){ float f=abs(fract(c-0.5)-0.5)/fwidth(c); return 1.0-min(f/w,1.0); }
          void main(){
            vec2 c = vP*4.0;
            float g = max(line(c.x,1.0), line(c.y,1.0));
            float fade = smoothstep(4.5, 0.5, length(vP));
            gl_FragColor = vec4(0.13,0.83,0.93, g*0.16*fade*uOpacity);
          }`,
      })
    );
    this.grid.rotation.x = -Math.PI / 2;
    this.grid.position.y = -0.23;
    this.scene.add(this.grid, this.shadow, this.pivot);

    this.current = {
      pos: [-1.6, 0.4, -1.8],
      target: [0, 0, 0],
      edges: 1,
      solid: 0,
      flow: 0,
      dims: 0,
      pitch: 0,
      shift: 0,
    };

    if (opts.interactive) {
      this.controls = new OrbitControls(this.camera, canvas);
      this.controls.enableDamping = true;
      this.controls.enablePan = false;
      this.controls.minDistance = 0.9;
      this.controls.maxDistance = 4;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.8;
      this.camera.position.set(-1.7, 0.8, -1.7);
      this.controls.target.set(0, 0, 0);
      this.intro = 1;
    } else {
      window.addEventListener("pointermove", this.onPointer);
    }

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.tick();
  }

  load(url: string) {
    new GLTFLoader().load(
      url,
      (gltf) => {
        if (this.disposed) return;
        const mesh = gltf.scene.getObjectByProperty("type", "Mesh") as THREE.Mesh;
        const geo = mesh.geometry;
        geo.computeBoundingBox();
        const c = geo.boundingBox!.getCenter(new THREE.Vector3());
        geo.translate(-c.x, -c.y, -c.z);
        geo.computeBoundingBox();
        this.shadow.position.y = this.grid.position.y = geo.boundingBox!.min.y - 0.12;

        this.pivot.add(new THREE.Mesh(geo, this.solidMat));
        this.pivot.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 22), this.edgeMat));
        this.buildFlow(geo.boundingBox!);
        this.buildDims(geo.boundingBox!);
        this.opts.onReady?.();
      },
      (e) => e.total && this.opts.onProgress?.(e.loaded / e.total)
    );
  }

  /** Streamlines that ride over the airframe envelope, nose (-Z) to tail (+Z). */
  private buildFlow(box: THREE.Box3) {
    const halfSpan = box.max.x;
    const lines = 140;
    const seg = 90;
    const pos: number[] = [], s: number[] = [], seed: number[] = [], idx: number[] = [];
    let v = 0;
    for (let i = 0; i < lines; i++) {
      const x = (Math.random() * 2 - 1) * halfSpan * 1.25;
      const y0 = (Math.random() * 2 - 1) * 0.16;
      const above = y0 >= 0 ? 1 : -1;
      const r = Math.abs(x) / halfSpan;
      // leading/trailing edge follow the sweep: centre body further forward
      const le = lerp(box.min.z, box.min.z + (box.max.z - box.min.z) * 0.62, Math.min(r, 1));
      const te = box.max.z;
      const thick = r < 1 ? lerp(0.09, 0.025, r) : 0;
      const sd = Math.random();
      for (let k = 0; k <= seg; k++) {
        const t = k / seg;
        const z = lerp(-1.9, 1.9, t);
        const mid = (le + te) / 2, half = (te - le) / 2 + 0.08;
        const bump = Math.exp(-Math.pow((z - mid) / half, 4));
        const lift = above > 0 ? 1.0 : 0.6;
        const y = y0 + above * thick * bump * lift * Math.exp(-Math.abs(y0) * 6) - t * 0.04;
        const xs = x * (1 + 0.04 * Math.max(0, z - te) * Math.sign(x)); // slight tip spread aft
        pos.push(xs, y, z);
        s.push(t);
        seed.push(sd);
        if (k > 0) idx.push(v - 1, v);
        v++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aS", new THREE.Float32BufferAttribute(s, 1));
    g.setAttribute("aSeed", new THREE.Float32BufferAttribute(seed, 1));
    g.setIndex(idx);
    const flow = new THREE.LineSegments(g, this.flowMat);
    flow.frustumCulled = false;
    this.scene.add(flow);
  }

  /** Span dimension line with end ticks, shown over the planform shot. */
  private buildDims(box: THREE.Box3) {
    const y = box.max.y + 0.02;
    const z = box.max.z + 0.12;
    const x = box.max.x;
    const mk = (pts: number[]) => {
      const m = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0, depthTest: false });
      this.dimMats.push(m);
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, m);
    };
    this.dimGroup.add(
      mk([-x, y, z, x, y, z]),
      mk([-x, y, z - 0.05, -x, y, z + 0.05, x, y, z - 0.05, x, y, z + 0.05]),
      mk([-x, y, z - 0.3, -x, y, z + 0.05, x, y, z - 0.3, x, y, z + 0.05]),
    );
    this.dimGroup.renderOrder = 10;
    this.scene.add(this.dimGroup);
  }

  private radialTexture(inner: string, outer: string) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };

  private resize() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Portrait screens: widen the lens so the full span still fits
    this.camera.fov = w / h < 1 ? 50 : 32;
    this.camera.updateProjectionMatrix();
  }

  /** Blend the keyframes either side of the continuous scroll index. */
  private sampleShot(): Shot {
    const n = this.shots.length;
    if (!n) return this.current;
    const f = Math.min(Math.max(this.shotIndex - 0.5, 0), n - 1);
    const i = Math.floor(f), j = Math.min(i + 1, n - 1);
    const t = ease(f - i);
    const a = this.shots[i], b = this.shots[j];
    const v3 = (p: number[], q: number[]) => [0, 1, 2].map((k) => lerp(p[k], q[k], t)) as [number, number, number];
    return {
      pos: v3(a.pos, b.pos),
      target: v3(a.target, b.target),
      edges: lerp(a.edges, b.edges, t),
      solid: lerp(a.solid, b.solid, t),
      flow: lerp(a.flow, b.flow, t),
      dims: lerp(a.dims, b.dims, t),
      pitch: lerp(a.pitch, b.pitch, t),
      shift: lerp(a.shift, b.shift, t),
    };
  }

  private tick = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;
    const k = 1 - Math.pow(0.0015, dt); // frame-rate independent smoothing

    if (this.controls) {
      const target: Partial<Shot> =
        this.mode === "blueprint" ? { edges: 1, solid: 0.04 } : this.mode === "xray" ? { edges: 0.6, solid: 0.25 } : { edges: 0.12, solid: 1 };
      this.current.edges = lerp(this.current.edges, target.edges!, k);
      this.current.solid = lerp(this.current.solid, target.solid!, k);
      this.current.flow = lerp(this.current.flow, this.flowOn ? 1 : 0, k);
      this.controls.update();
    } else {
      const s = this.sampleShot();
      // Intro: blueprint lines first, then the surface fades in as the jet arrives
      if (this.pivot.children.length) this.intro = Math.min(1, this.intro + dt / (this.reducedMotion ? 0.01 : 2.6));
      const ie = ease(this.intro);
      s.solid *= ease(Math.max(0, (this.intro - 0.35) / 0.65));
      s.edges = Math.max(s.edges, 1 - ease(Math.max(0, (this.intro - 0.5) / 0.5)));
      for (const key of ["edges", "solid", "flow", "dims", "pitch", "shift"] as const) this.current[key] = lerp(this.current[key], s[key], k);
      // Slide the framing sideways so the model clears the text cards (not on portrait screens)
      // On portrait screens, pull back and lift the model above the bottom-docked cards instead
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      const portrait = w / h < 1;
      if (w && h) this.camera.setViewOffset(w, h, portrait ? 0 : -this.current.shift * w, portrait ? h * 0.2 : 0, w, h);
      for (let a = 0; a < 3; a++) {
        this.current.pos[a] = lerp(this.current.pos[a], s.pos[a], k);
        this.current.target[a] = lerp(this.current.target[a], s.target[a], k);
      }
      this.pointerSmooth.lerp(this.pointer, k * 0.6);
      const p = this.current.pos;
      const dist = (1 + (1 - ie) * 1.8) * (portrait ? 1.6 : 1);
      this.camera.position.set(
        p[0] * dist + this.pointerSmooth.x * 0.12,
        p[1] * dist - this.pointerSmooth.y * 0.08,
        p[2] * dist
      );
      this.camTarget.set(...this.current.target);
      this.camera.lookAt(this.camTarget);
      if (!this.reducedMotion) {
        this.pivot.position.y = Math.sin(time * 0.8) * 0.012;
        this.pivot.rotation.z = Math.sin(time * 0.55) * 0.012;
      }
    }

    this.pivot.rotation.x = THREE.MathUtils.degToRad(-this.current.pitch);
    this.edgeMat.opacity = this.current.edges;
    this.solidMat.opacity = this.current.solid;
    this.solidMat.depthWrite = this.current.solid > 0.9;
    this.solidMat.visible = this.current.solid > 0.01;
    this.flowMat.uniforms.uOpacity.value = this.current.flow;
    this.flowMat.uniforms.uTime.value = this.reducedMotion ? 0.3 : time;
    for (const m of this.dimMats) m.opacity = this.current.dims;
    (this.shadow.material as THREE.MeshBasicMaterial).opacity = this.current.solid;

    this.renderer.render(this.scene, this.camera);
  };

  setMode(m: ViewMode) {
    this.mode = m;
  }

  setAutoRotate(on: boolean) {
    if (this.controls) this.controls.autoRotate = on;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("pointermove", this.onPointer);
    this.ro.disconnect();
    this.controls?.dispose();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | undefined;
      mat?.dispose();
    });
    this.renderer.dispose();
  }
}
