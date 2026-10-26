"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowUpRight, Box, Eye, Layers, Pause, Play, Wind } from "lucide-react";
import { BwbCanvas } from "./BwbCanvas";
import type { Shot, ViewMode } from "./BwbEngine";
import { getAssetPath, cn } from "@/lib/utils";

// Camera choreography: one shot per data-shot section, in order
const SHOTS: Shot[] = [
  { pos: [-1.55, 1.05, -2.35], target: [-0.3, -0.3, 0.1], edges: 0.12, solid: 1, flow: 0, dims: 0, pitch: 0, shift: 0.18 },
  { pos: [0, 3.5, 0.5], target: [0, 0, 0.05], edges: 0.95, solid: 0.3, flow: 0, dims: 1, pitch: 0, shift: 0.17 },
  { pos: [3.0, 0.14, 0.15], target: [0, 0.02, 0], edges: 0.25, solid: 1, flow: 0, dims: 0, pitch: 0, shift: -0.17 },
  { pos: [1.45, 0.42, 1.05], target: [0.55, 0.04, 0.12], edges: 0.15, solid: 1, flow: 0, dims: 0, pitch: 0, shift: 0.18 },
  { pos: [-1.95, 1.0, -2.15], target: [0, -0.04, 0.15], edges: 0.04, solid: 1, flow: 1, dims: 0, pitch: 5, shift: -0.17 },
  { pos: [-1.9, 0.95, 1.7], target: [0, 0, 0], edges: 0.08, solid: 1, flow: 0.55, dims: 0, pitch: 2, shift: 0 },
];

const CHAPTERS = [
  {
    n: "01",
    tag: "Planform",
    title: "One wing.\nNo fuselage. No tail.",
    body: "The whole airframe is a lifting surface. A deep centre body blends smoothly into swept outer wings, removing the drag of a conventional wing-fuselage junction and freeing up internal volume.",
    stat: { value: "1.51 m", label: "wingspan, from the CAD" },
    side: "left",
  },
  {
    n: "02",
    tag: "Profile",
    title: "Stable without\na tailplane.",
    body: "Early XFLR5 runs with a Clark Y section could not hold trim. Switching to a reflexed MH-series aerofoil gave the wing a positive static margin on its own, with no horizontal tail and no elevator trim drag.",
    stat: { value: "MH", label: "reflexed aerofoil family" },
    side: "right",
  },
  {
    n: "03",
    tag: "Winglets",
    title: "The fins do\nthe tail's job.",
    body: "With no vertical stabiliser, the wingtip fins carry the directional stability. The dissertation maps how their cant angle changes roll and yaw due to sideslip (Clβ, Cnβ) against the induced drag it costs.",
    stat: { value: "Clβ · Cnβ", label: "stability derivatives studied" },
    side: "left",
  },
  {
    n: "04",
    tag: "Airflow",
    title: "Into the\nvirtual wind tunnel.",
    body: "The geometry was swept through ANSYS Fluent 3D CFD from −2° to 14° angle of attack at 20 m/s, tracking tip vortex roll-up, spanwise crossflow and where the flow begins to separate.",
    stat: { value: "−2° → 14°", label: "angle-of-attack sweep" },
    side: "right",
    note: "Animated streamlines are illustrative. The real CFD results follow below.",
  },
];

const STATS = [
  { value: 1.51, decimals: 2, suffix: " m", label: "Wingspan" },
  { value: 0, decimals: 0, suffix: "", label: "Tail surfaces" },
  { value: 20, decimals: 0, suffix: " m/s", label: "CFD freestream" },
  { value: 16, decimals: 0, suffix: "°", label: "AoA range swept" },
];

const CFD = {
  pathlines: { 0: "/Assets/Pathlines at 0 AOA.png", 5: "/Assets/5 AOA Pathlines Side Profile.png" },
  pressure: { 0: "/Assets/StaticPressure at 0 AOA.png", 5: "/Assets/Static Pressure at 5 AOA.png" },
} as const;

const ROADMAP = [
  { n: "01", title: "Sizing & aerofoil selection", desc: "XFLR5 vortex lattice sweeps, Clark Y to reflexed MH-series.", state: "done" },
  { n: "02", title: "Iterative studies & CFD sweeps", desc: "Twist, sweep and taper studies; ANSYS Fluent sweeps at 20 m/s.", state: "now" },
  { n: "03", title: "Build", desc: "3D-printed formers reinforced with glass and carbon layups.", state: "next" },
  { n: "04", title: "Flight test", desc: "IMU and pitot telemetry to check the stability predictions.", state: "next" },
];

function Counter({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min((now - start) / 1600, 1);
      setV(value * (1 - Math.pow(1 - t, 4)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function SplitTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span aria-label={text} className="block">
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: delay + i * 0.035, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function BwbShowcase() {
  const shotIndex = useRef(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [canvasDim, setCanvasDim] = useState(0);
  const [aoa, setAoa] = useState<0 | 5>(0);
  const [field, setField] = useState<"pathlines" | "pressure">("pathlines");
  const [mode, setMode] = useState<ViewMode>("solid");
  const [flowOn, setFlowOn] = useState(true);
  const [spin, setSpin] = useState(true);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: roadmapProgress } = useScroll({ target: roadmapRef, offset: ["start 75%", "end 55%"] });
  const roadmapLine = useTransform(roadmapProgress, [0, 1], ["0%", "100%"]);

  // Turn section positions into a continuous shot index for the camera
  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight / 2;
      let idx = 0;
      document.querySelectorAll<HTMLElement>("[data-shot]").forEach((el) => {
        const r = el.getBoundingClientRect();
        idx += Math.min(Math.max((mid - r.top) / r.height, 0), 1);
      });
      shotIndex.current = idx;
      setCanvasDim(Math.min(Math.max(idx - (SHOTS.length - 0.6), 0) / 0.6, 1));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="relative bg-[#030712] text-slate-100 overflow-x-clip">
      {/* Loader */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#030712]"
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <p className="font-mono text-[11px] tracking-[0.35em] text-cyan-400/80">LOADING AIRFRAME</p>
            <div className="mt-5 h-px w-56 bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-400 transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
            </div>
            <p className="mt-3 font-mono text-xs text-slate-500 tabular-nums">{Math.round(progress * 100)}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed 3D stage */}
      <div className="fixed inset-0 z-0" style={{ opacity: 1 - canvasDim * 0.8 }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0b1a2e_0%,#030712_70%)]" />
        <BwbCanvas
          className="absolute inset-0 h-full w-full"
          shots={SHOTS}
          shotIndexRef={shotIndex}
          onProgress={setProgress}
          onReady={() => setReady(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(3,7,18,0.85)_100%)]" />
      </div>

      <main id="main-content" className="relative z-10">
        {/* HERO */}
        <section data-shot className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-16 sm:px-10 md:pb-24">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent" />
          <div className="relative mx-auto w-full max-w-7xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-mono text-[11px] tracking-[0.3em] text-cyan-300/90 sm:text-xs"
            >
              FINAL-YEAR DISSERTATION · UNIVERSITY OF STRATHCLYDE
            </motion.p>
            <h1 className="mt-4 font-[family-name:var(--font-space)] text-[13vw] font-semibold leading-[0.88] tracking-tight sm:text-[9vw] lg:text-[8rem]">
              {ready && (
                <>
                  <SplitTitle text="Blended" delay={0.6} />
                  <span className="block bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                    <SplitTitle text="Wing Body" delay={0.9} />
                  </span>
                </>
              )}
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.6, duration: 0.9 }}
              className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
            >
              <p className="max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
                A tailless UAV where the whole aircraft is the wing. Designed in SolidWorks, tested in CFD, and built to
                answer one question: how do you keep it pointing straight without a tail?
              </p>
              <a
                href="#story"
                className="group inline-flex items-center gap-3 self-start font-mono text-xs tracking-[0.2em] text-slate-400 hover:text-cyan-300 sm:self-auto"
              >
                SCROLL TO EXPLORE
                <span className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 group-hover:border-cyan-400">
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                </span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section id="story" className="relative border-y border-white/5 bg-[#030712]/70 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className={cn("px-5 py-8 sm:px-10 sm:py-12", i > 0 && "md:border-l border-white/5", i % 2 === 1 && "border-l border-white/5")}
              >
                <div className="font-[family-name:var(--font-space)] text-4xl font-semibold text-white sm:text-5xl">
                  <Counter {...s} />
                </div>
                <div className="mt-2 font-mono text-[11px] tracking-[0.2em] text-slate-400 uppercase">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SCROLL CHAPTERS */}
        {CHAPTERS.map((c) => (
          <section key={c.n} data-shot className="relative min-h-[170vh] px-5 sm:px-10">
            <div
              className={cn(
                "sticky top-0 mx-auto flex h-[100svh] w-full max-w-7xl items-end pb-8 md:items-center md:pb-0",
                c.side === "right" ? "md:justify-end" : "md:justify-start"
              )}
            >
              <motion.article
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.6 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#030712]/60 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9"
              >
                <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-cyan-300">
                  <span>{c.n}</span>
                  <span className="h-px w-8 bg-cyan-400/50" />
                  <span className="uppercase">{c.tag}</span>
                </div>
                <h2 className="mt-5 whitespace-pre-line font-[family-name:var(--font-space)] text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  {c.title}
                </h2>
                <p className="mt-5 leading-relaxed text-slate-300">{c.body}</p>
                <div className="mt-7 flex items-baseline gap-3 border-t border-white/10 pt-5">
                  <span className="font-[family-name:var(--font-space)] text-2xl font-semibold text-amber-300">{c.stat.value}</span>
                  <span className="text-sm text-slate-400">{c.stat.label}</span>
                </div>
                {c.note && <p className="mt-4 font-mono text-[11px] leading-relaxed text-slate-500">{c.note}</p>}
              </motion.article>
            </div>
          </section>
        ))}

        {/* Outro shot section: gives the camera room to settle before content */}
        <section data-shot className="relative flex min-h-[90vh] items-center justify-center px-5 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.6 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl font-[family-name:var(--font-space)] text-4xl font-semibold leading-tight sm:text-6xl"
          >
            Less aircraft.{" "}
            <span className="bg-gradient-to-r from-cyan-200 to-cyan-500 bg-clip-text text-transparent">More wing.</span>
          </motion.h2>
        </section>

        {/* CFD RESULTS */}
        <section className="relative bg-[#030712]/85 px-5 py-24 backdrop-blur-xl sm:px-10 md:py-32">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-[#030712]/85" />
          <div className="mx-auto max-w-7xl">
            <SectionHead kicker="REAL RESULTS · ANSYS FLUENT" title="What the simulation showed" />
            <p className="mt-5 max-w-2xl text-slate-400">
              Unedited outputs from the preliminary CFD runs at 20 m/s. Switch angle of attack and flow field to compare.
              These are early test runs, not final results.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Toggle
                options={[
                  { id: "pathlines", label: "Pathlines" },
                  { id: "pressure", label: "Static pressure" },
                ]}
                value={field}
                onChange={(v) => setField(v as typeof field)}
              />
              <Toggle
                options={[
                  { id: "0", label: "α = 0°" },
                  { id: "5", label: "α = 5°" },
                ]}
                value={String(aoa)}
                onChange={(v) => setAoa(Number(v) as 0 | 5)}
              />
            </div>

            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={`${field}-${aoa}`}
                  src={getAssetPath(CFD[field][aoa])}
                  alt={`${field === "pathlines" ? "Flow pathlines" : "Static pressure contour"} at ${aoa} degrees angle of attack`}
                  initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </AnimatePresence>
              <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1.5 font-mono text-[11px] tracking-wider text-cyan-300">
                {field === "pathlines" ? "PATHLINES" : "STATIC PRESSURE"} · α = {aoa}° · 20 m/s
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <MediaCard src="/Assets/XFLR5Image.png" title="XFLR5 vortex lattice analysis" desc="Early sizing: surface pressure and tip vortex streamlines on the reflexed planform." />
              <MediaCard src="/Assets/TopVIEW.png" title="SolidWorks planform" desc="Top view showing elevons, winglet cuffs and the centreline motor mount." />
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section className="relative bg-[#030712] px-5 py-24 sm:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHead kicker="WHERE IT'S HEADED" title="From screen to sky" />
            <div ref={roadmapRef} className="relative mt-14 md:mt-20">
              <div className="absolute left-[15px] top-0 h-full w-px bg-white/10 md:left-0 md:top-[15px] md:h-px md:w-full" />
              <motion.div
                className="absolute left-[15px] top-0 w-px bg-cyan-400 md:hidden"
                style={{ height: roadmapLine }}
              />
              <motion.div
                className="absolute left-0 top-[15px] hidden h-px bg-cyan-400 md:block"
                style={{ width: roadmapLine }}
              />
              <div className="grid gap-10 md:grid-cols-4 md:gap-8">
                {ROADMAP.map((r, i) => (
                  <motion.div
                    key={r.n}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ delay: i * 0.15, duration: 0.7 }}
                    className="relative pl-12 md:pl-0 md:pt-12"
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-0 grid h-[31px] w-[31px] place-items-center rounded-full border font-mono text-[10px]",
                        r.state === "done" && "border-cyan-400 bg-cyan-400 text-slate-950",
                        r.state === "now" && "border-cyan-400 bg-[#030712] text-cyan-300",
                        r.state === "next" && "border-white/15 bg-[#030712] text-slate-500"
                      )}
                    >
                      {r.state === "now" && <span className="absolute inset-0 animate-ping rounded-full border border-cyan-400/60" />}
                      {r.n}
                    </span>
                    <p className="font-mono text-[10px] tracking-[0.25em] text-slate-500">
                      {r.state === "done" ? "COMPLETE" : r.state === "now" ? "IN PROGRESS" : "UPCOMING"}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{r.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{r.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EXPLORE */}
        <section className="relative bg-[#030712] px-5 pb-24 sm:px-10 md:pb-32">
          <div className="mx-auto max-w-7xl">
            <SectionHead kicker="YOUR TURN" title="Take it for a spin" />
            <p className="mt-5 max-w-2xl text-slate-400">Drag to orbit, pinch or scroll to zoom. This is the actual dissertation CAD model.</p>
            <div className="relative mt-10 h-[70vh] min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_35%,#0f2238_0%,#030712_75%)]">
              <BwbCanvas
                interactive
                className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
                mode={mode}
                flowOn={flowOn}
                autoRotate={spin}
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 p-4">
                {(
                  [
                    { id: "solid", label: "Solid", icon: Box },
                    { id: "xray", label: "X-ray", icon: Eye },
                    { id: "blueprint", label: "Blueprint", icon: Layers },
                  ] as const
                ).map((m) => (
                  <ControlButton key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
                    <m.icon className="h-4 w-4" /> {m.label}
                  </ControlButton>
                ))}
                <span className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />
                <ControlButton active={flowOn} onClick={() => setFlowOn((f) => !f)}>
                  <Wind className="h-4 w-4" /> Airflow
                </ControlButton>
                <ControlButton active={spin} onClick={() => setSpin((s) => !s)}>
                  {spin ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} Spin
                </ControlButton>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="relative border-t border-white/5 bg-[#030712] px-5 py-20 sm:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[11px] tracking-[0.3em] text-cyan-300/80">SHAUN JOHN THOMAS</p>
              <h2 className="mt-3 font-[family-name:var(--font-space)] text-3xl font-semibold sm:text-5xl">Want the full engineering story?</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects/bwb-uav/"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
              >
                Technical write-up <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                <ArrowLeft className="h-4 w-4" /> Portfolio
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
      <p className="font-mono text-[11px] tracking-[0.3em] text-cyan-300/80">{kicker}</p>
      <h2 className="mt-3 font-[family-name:var(--font-space)] text-4xl font-semibold text-white sm:text-6xl">{title}</h2>
    </motion.div>
  );
}

function Toggle({ options, value, onChange }: { options: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn("relative rounded-full px-4 py-2 text-sm transition-colors", value === o.id ? "text-slate-950" : "text-slate-300 hover:text-white")}
        >
          {value === o.id && (
            <motion.span layoutId={`pill-${options[0].id}`} className="absolute inset-0 rounded-full bg-cyan-400" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function ControlButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-md transition",
        active ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200" : "border-white/10 bg-slate-950/60 text-slate-300 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function MediaCard({ src, title, desc }: { src: string; title: string; desc: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
    >
      <div className="aspect-[16/10] overflow-hidden bg-white">
        <img src={getAssetPath(src)} alt={title} className="h-full w-full object-contain transition duration-700 group-hover:scale-105" />
      </div>
      <figcaption className="p-5">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{desc}</p>
      </figcaption>
    </motion.figure>
  );
}
