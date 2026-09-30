"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  Activity,
  SlidersHorizontal,
  Grid,
  Columns,
  Table as TableIcon,
  BarChart3,
  HelpCircle,
  Clock,
  Calendar,
  Tag,
  Check,
} from "lucide-react";
import { ProjectData } from "@/data/projects";
import { getAssetPath } from "@/lib/utils";
import { AnimatedFooter } from "./AnimatedFooter";
import {
  computedCfdModels,
  marginalReturnSteps,
  cfdSetupRows,
  optionalSetupRows,
  forceBasisNote,
  contoursShareScale,
  pathlinesAsset,
  generateCfdResultsCsv,
  formatNumber,
  formatSignedNumber,
  FORCE_UNIT,
  ComputedCfdModel,
} from "@/data/supercarCfdData";

interface SupercarCfdDetailProps {
  project: ProjectData;
  prevProject: ProjectData;
  nextProject: ProjectData;
}

interface LightboxItem {
  figureNumber: number;
  title: string;
  caption: string;
  src: string;
  alt: string;
  legendRange?: string;
  modelLabel: string;
  viewType: string;
}

const tocSections = [
  { id: "hero", label: "Overview & Metrics" },
  { id: "aim-objectives", label: "01 / Aim & Objectives" },
  { id: "methodology", label: "02 / Numerical Setup" },
  { id: "results", label: "03 / Results & Charts" },
  { id: "contours", label: "04 / Contour Explorer" },
  { id: "discussion", label: "05 / Discussion & Modes" },
  { id: "limitations", label: "06 / Limitations" },
  { id: "download", label: "07 / Report Download" },
];

export function SupercarCfdDetail({
  project,
  prevProject,
  nextProject,
}: SupercarCfdDetailProps) {
  // Navigation & Scrollspy
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);

  // Chart interactivity & Zoom state
  const [hoveredChartIdx, setHoveredChartIdx] = useState<number | null>(null);
  const [focusedChartIdx, setFocusedChartIdx] = useState<number | null>(null);
  const [zoomedChart, setZoomedChart] = useState<"chart1" | "chart2" | null>(null);
  const [chartZoomLevel, setChartZoomLevel] = useState<number>(1);

  // Contour Explorer state
  const [selectedModelId, setSelectedModelId] = useState<string>("model-175");
  const [selectedView, setSelectedView] = useState<"velocity" | "pressure">("velocity");
  const [compareAll, setCompareAll] = useState<boolean>(false);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxModalRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // CSV download feedback
  const [csvDownloaded, setCsvDownloaded] = useState<boolean>(false);

  // Collect all contour figures for the Lightbox and print rendering
  const allContourItems = useMemo<LightboxItem[]>(() => {
    const items: LightboxItem[] = [];
    computedCfdModels.forEach((m) => {
      items.push({
        figureNumber: m.figureNumberVelocity,
        title: `${m.label} - Velocity Magnitude Contour`,
        caption: m.velocityCaption,
        src: m.velocityImageSrc,
        alt: m.velocityAlt,
        legendRange: m.velocityLegendRange,
        modelLabel: m.label,
        viewType: "Velocity (m/s)",
      });
      if (m.pressureImageSrc && m.figureNumberPressure && m.pressureCaption && m.pressureAlt) {
        items.push({
          figureNumber: m.figureNumberPressure,
          title: `${m.label} - Static Pressure Contour`,
          caption: m.pressureCaption,
          src: m.pressureImageSrc,
          alt: m.pressureAlt,
          legendRange: m.pressureLegendRange,
          modelLabel: m.label,
          viewType: "Pressure (Pa)",
        });
      }
    });
    // Add Figure 10 pathlines
    items.push({
      figureNumber: pathlinesAsset.figureNumber,
      title: pathlinesAsset.title,
      caption: pathlinesAsset.caption,
      src: pathlinesAsset.src,
      alt: pathlinesAsset.alt,
      legendRange: "0 to 199 m/s",
      modelLabel: "150° Spoiler",
      viewType: "Particle Pathlines",
    });
    return items;
  }, []);

  // Sync URL hash with contour selection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.includes("model=") || hash.includes("view=")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const m = params.get("model");
      const v = params.get("view");
      if (m && ["baseline", "190", "175", "150"].includes(m)) {
        const idMap: Record<string, string> = {
          baseline: "baseline",
          "190": "model-190",
          "175": "model-175",
          "150": "model-150",
        };
        setSelectedModelId(idMap[m]);
      }
      if (v === "velocity" || v === "pressure") {
        setSelectedView(v);
      }
    }
  }, []);

  const updateHashSelection = useCallback((modelId: string, view: "velocity" | "pressure") => {
    if (typeof window === "undefined") return;
    const modelShort = modelId.replace("model-", "");
    const newHash = `model=${modelShort}&view=${view}`;
    if (window.location.hash !== `#${newHash}`) {
      window.history.replaceState(null, "", `#${newHash}`);
    }
  }, []);

  // Scrollspy observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    tocSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lightbox keyboard and focus trap handling
  useEffect(() => {
    if (lightboxIndex === null && zoomedChart === null) {
      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus();
      }
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomedChart !== null) {
          setZoomedChart(null);
        } else if (lightboxIndex !== null) {
          setLightboxIndex(null);
        }
      } else if (lightboxIndex !== null) {
        if (e.key === "ArrowLeft") {
          setLightboxIndex((prev) =>
            prev !== null ? (prev > 0 ? prev - 1 : allContourItems.length - 1) : null
          );
        } else if (e.key === "ArrowRight") {
          setLightboxIndex((prev) =>
            prev !== null ? (prev < allContourItems.length - 1 ? prev + 1 : 0) : null
          );
        }
      } else if (zoomedChart !== null) {
        if (e.key === "+" || e.key === "=") {
          setChartZoomLevel((prev) => Math.min(3, Math.round((prev + 0.25) * 100) / 100));
        } else if (e.key === "-" || e.key === "_") {
          setChartZoomLevel((prev) => Math.max(0.75, Math.round((prev - 0.25) * 100) / 100));
        } else if (e.key === "0") {
          setChartZoomLevel(1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, zoomedChart, allContourItems.length]);

  const openLightbox = (index: number) => {
    lastActiveElementRef.current = document.activeElement as HTMLElement;
    setLightboxIndex(index);
  };

  const handleDownloadCsv = () => {
    const csvContent = generateCfdResultsCsv();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "supercar_cfd_spoiler_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCsvDownloaded(true);
    setTimeout(() => setCsvDownloaded(false), 3000);
  };

  // Currently active model object in the explorer
  const activeModel = useMemo(
    () => computedCfdModels.find((m) => m.id === selectedModelId) || computedCfdModels[2],
    [selectedModelId]
  );

  // Determine current active figure index in allContourItems
  const currentFigureIndex = useMemo(() => {
    if (selectedView === "velocity") {
      return allContourItems.findIndex((item) => item.figureNumber === activeModel.figureNumberVelocity);
    }
    return allContourItems.findIndex(
      (item) => item.figureNumber === activeModel.figureNumberPressure
    );
  }, [activeModel, selectedView, allContourItems]);

  // Models list for model selector
  const modelOptions = [
    { id: "baseline", label: "Baseline (0°)" },
    { id: "model-190", label: "190°" },
    { id: "model-175", label: "175°" },
    { id: "model-150", label: "150°" },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans antialiased pt-16 sm:pt-20 pb-16 transition-colors duration-200">
      
      {/* Skip to Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-600 focus:text-white focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        Skip to main content
      </a>

      {/* Main Grid Container with Sticky TOC Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* ================================================================= */}
          {/* DESKTOP STICKY TOC SIDEBAR                                        */}
          {/* ================================================================= */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6 print:hidden">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <TableIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>On This Page</span>
                </div>
                <nav aria-label="Table of Contents">
                  <ul className="space-y-1 text-xs font-mono">
                    {tocSections.map((sec) => (
                      <li key={sec.id}>
                        <a
                          href={`#${sec.id}`}
                          className={`block py-1.5 px-2 rounded transition-colors ${
                            activeSection === sec.id
                              ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-semibold border-l-2 border-cyan-500"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {sec.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Quick CSV Export Widget in Sidebar */}
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Study Dataset</span>
                <span className="font-semibold text-slate-900 dark:text-white block mb-3">
                  Raw CFD Monitor Tables
                </span>
                <button
                  type="button"
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-medium cursor-not-allowed border border-slate-200 dark:border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV Dataset (Coming Soon)</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ================================================================= */}
          {/* MAIN CONTENT COLUMN                                               */}
          {/* ================================================================= */}
          <main id="main-content" className="lg:col-span-9 max-w-4xl mx-auto w-full">
            
            {/* Top Back Breadcrumb */}
            <div className="mb-6 print:hidden">
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Projects</span>
              </Link>
            </div>

            {/* Mobile Collapsible TOC */}
            <div className="lg:hidden mb-6 print:hidden">
              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                  className="w-full flex items-center justify-between p-3 text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                  aria-expanded={mobileTocOpen}
                >
                  <span className="flex items-center gap-2">
                    <TableIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Table of Contents</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${mobileTocOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileTocOpen && (
                  <nav aria-label="Mobile Table of Contents" className="p-3 pt-0 border-t border-slate-200 dark:border-slate-800">
                    <ul className="space-y-1 text-xs font-mono">
                      {tocSections.map((sec) => (
                        <li key={sec.id}>
                          <a
                            href={`#${sec.id}`}
                            onClick={() => setMobileTocOpen(false)}
                            className={`block py-1.5 px-2 rounded ${
                              activeSection === sec.id
                                ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-semibold"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {sec.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </div>

            {/* =============================================================== */}
            {/* BLOCK 1: HERO & KEY METRICS                                     */}
            {/* =============================================================== */}
            <header id="hero" className="scroll-mt-24 sm:scroll-mt-28 mb-12 pb-10 border-b border-slate-200 dark:border-slate-800">
              
              {/* Metadata Badge Row */}
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>CFD · ANSYS Fluent 2025 R1 · RANS · Aerodynamics</span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Last updated 30 Sep 2026</span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>6 min read</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                Aerodynamic Analysis of a Supercar Rear Spoiler
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-mono mb-8">
                2D External Flow CFD Study of Spoiler Deployment Angles at 80 m/s
              </p>

              {/* 4 KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* KPI 1 */}
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Baseline Lift
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    {formatNumber(Math.abs(computedCfdModels[0].verticalN), 0)} {FORCE_UNIT}
                  </div>
                  <span className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 block">
                    Net upward vertical force, no spoiler
                  </span>
                </div>

                {/* KPI 2 */}
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Peak Downforce
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                    {formatNumber(computedCfdModels[3].verticalN, 0)} {FORCE_UNIT}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    At 150° deployment
                  </span>
                </div>

                {/* KPI 3 */}
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Peak Efficiency
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    {formatNumber(computedCfdModels[3].liftToDrag, 2)}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Maximum L/D ratio
                  </span>
                </div>

                {/* KPI 4 */}
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Drag Increase
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    {formatSignedNumber(computedCfdModels[3].deltaDragPercent, 0)}%
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {formatNumber(computedCfdModels[0].dragN, 0)} N → {formatNumber(computedCfdModels[3].dragN, 0)} N ({formatSignedNumber(computedCfdModels[3].deltaDragN, 0)} N)
                  </span>
                </div>
              </div>

              {/* Computed One-Sentence Takeaway */}
              <div className="p-3.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                <strong>Key Takeaway:</strong> A 120 mm spoiler turns {formatNumber(Math.abs(computedCfdModels[0].verticalN), 0)} N of lift into {formatNumber(computedCfdModels[3].verticalN, 0)} N of downforce at 150 degrees for {formatSignedNumber(computedCfdModels[3].deltaDragN, 0)} N of drag. Each steeper step buys less downforce per newton of drag: {formatNumber(marginalReturnSteps[0].marginalReturn, 2)}, then {formatNumber(marginalReturnSteps[1].marginalReturn, 2)}, then {formatNumber(marginalReturnSteps[2].marginalReturn, 2)}.
              </div>
            </header>

            {/* =============================================================== */}
            {/* BLOCK 2: PROJECT AIM & OBJECTIVES                               */}
            {/* =============================================================== */}
            <section id="aim-objectives" className="scroll-mt-24 sm:scroll-mt-28 mb-14 pb-12 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                01 / Aim & Objectives
              </h2>

              <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Project Aim
                  </h3>
                  <p>
                    To conduct a quantitative 2D computational fluid dynamics (CFD) investigation evaluating the aerodynamic impact of an active rear spoiler deployed across discrete angles (190°, 175°, and 150°) on a high-performance vehicle profile operating at 80 m/s (288 km/h). The primary focus is assessing the transition from natural vehicle lift to stable aerodynamic downforce, analyzing flow separation over the fastback canopy, and quantifying the associated drag penalty.
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Key Objectives
                  </h3>
                  <ul className="list-disc list-outside pl-5 space-y-2 text-sm sm:text-base">
                    <li>
                      <strong>Baseline Characterization:</strong> Quantify the positive aerodynamic lift generated over the vehicle body without aerodynamic appendages.
                    </li>
                    <li>
                      <strong>Lift Neutralization & Downforce Generation:</strong> Evaluate the progression of vertical forces (F<sub>L</sub>) across spoiler deployment angles to determine the angle required to eliminate natural lift and establish net downforce.
                    </li>
                    <li>
                      <strong>Aerodynamic Efficiency (L/D):</strong> Calculate the lift-to-drag ratio (F<sub>L</sub> / F<sub>D</sub>) across all configurations to understand the aerodynamic trade-off at each deployment setting.
                    </li>
                    <li>
                      <strong>Diminishing Returns Analysis:</strong> Measure the incremental downforce yield per unit of added drag (ΔF<sub>L</sub> / ΔF<sub>D</sub>) to identify the aerodynamic envelope of optimal efficiency versus maximum load.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* =============================================================== */}
            {/* BLOCK 3: METHODOLOGY & NUMERICAL SETUP                          */}
            {/* =============================================================== */}
            <section id="methodology" className="scroll-mt-24 sm:scroll-mt-28 mb-14 pb-12 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                02 / Methodology & Numerical Setup
              </h2>

              <div className="space-y-6">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Numerical simulations were executed in ANSYS Fluent utilizing a 2D steady-state Reynolds-Averaged Navier-Stokes (RANS) solver. Turbulence closure was achieved with the Realizable k-epsilon model and Enhanced Wall Treatment to capture boundary layer separation and adverse pressure gradients across the rear decklid.
                </p>

                {/* Minimalist HTML Table for Methodology Specs */}
                <div>
                  <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                    Boundary Conditions & Geometry Parameters
                  </h3>
                  <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none" tabIndex={0} aria-label="Numerical simulation parameters table">
                    <table className="w-full text-left text-xs sm:text-sm font-mono">
                      <caption className="sr-only">ANSYS Fluent 2025 R1 CFD numerical setup parameters</caption>
                      <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th scope="col" className="py-2.5 px-4 font-semibold">Parameter</th>
                          <th scope="col" className="py-2.5 px-4 font-semibold">Specification / Value</th>
                          <th scope="col" className="py-2.5 px-4 font-semibold">Description / Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {cfdSetupRows.map((row) => (
                          <tr key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                            <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">{row.label}</td>
                            <td className="py-2.5 px-4">{row.value}</td>
                            <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-sans text-xs">{row.unitOrNote}</td>
                          </tr>
                        ))}
                        {/* Optional setup rows rendered only when value is not null */}
                        {optionalSetupRows
                          .filter((r) => r.value !== null)
                          .map((r) => (
                            <tr key={r.key} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                              <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">{r.label}</td>
                              <td className="py-2.5 px-4">{r.value}</td>
                              <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-sans text-xs">{r.note || ""}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Model Assumptions */}
                <div>
                  <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                    Modeling Assumptions & Constraints
                  </h3>
                  <ul className="list-disc list-outside pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <li>
                      <strong>Standard Atmosphere:</strong> Sea level standard atmosphere (p0 = 101,325 Pa, T0 = 288.15 K). Freestream Mach number is about 0.23, but the contour legends show local velocity maxima of 132 to 199 m/s (Mach 0.39 to 0.58), so compressibility effects cannot be dismissed everywhere in the domain.
                    </li>
                    <li>
                      <strong>Steady-State Flow:</strong> Mean flowfield properties were computed at asymptotic convergence assuming time-averaged boundary layer behavior.
                    </li>
                    <li>
                      <strong>Rigid Bodies:</strong> The vehicle body and active spoiler flap are modeled as perfectly rigid, neglecting structural aeroelastic deformation under high pressure loads.
                    </li>
                    <li>
                      <strong>Simplified 2D Longitudinal Geometry:</strong> Analysis is conducted along the central symmetry plane; 3D wingtip vortices and lateral crossflows are excluded.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* =============================================================== */}
            {/* BLOCK 4: FORMAL DATA VISUALIZATION (Results, Table & Charts)     */}
            {/* =============================================================== */}
            <section id="results" className="scroll-mt-24 sm:scroll-mt-28 mb-14 pb-12 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  03 / Quantitative Results & Analysis
                </h2>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 dark:text-slate-500 cursor-not-allowed print:hidden"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV Dataset (Coming Soon)</span>
                </button>
              </div>

              {/* 3a. Results Summary Table */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                  Table 1: Aerodynamic Force Summary across Spoiler Configurations
                </h3>
                <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none" tabIndex={0} aria-label="CFD Force Summary Table">
                  <table className="w-full text-left text-xs sm:text-sm font-mono">
                    <caption className="sr-only">Comparison of drag, vertical force, deltas, and L/D across spoiler angles</caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th scope="col" className="py-2.5 px-3 sm:px-4 font-semibold">Configuration</th>
                        <th scope="col" className="py-2.5 px-3 sm:px-4 font-semibold">Angle (°)</th>
                        <th scope="col" className="py-2.5 px-3 sm:px-4 font-semibold">Drag F<sub>D</sub> ({FORCE_UNIT})</th>
                        <th scope="col" className="py-2.5 px-3 sm:px-4 font-semibold">Vertical F<sub>L</sub> ({FORCE_UNIT})</th>
                        <th scope="col" className="py-2.5 px-3 sm:px-4 font-semibold">Δ Drag ({FORCE_UNIT})</th>
                        <th scope="col" className="py-2.5 px-3 sm:px-4 font-semibold">Δ Drag (%)</th>
                        <th scope="col" className="py-2.5 px-3 sm:px-4 font-semibold">Net Shift ({FORCE_UNIT})</th>
                        <th scope="col" className="py-2.5 px-3 sm:px-4 font-semibold text-right">L/D Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {computedCfdModels.map((m) => (
                        <tr
                          key={m.id}
                          className={`transition-colors ${
                            m.isMaxEfficiency
                              ? "bg-cyan-50/70 dark:bg-cyan-950/40 font-semibold text-slate-900 dark:text-white"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                          }`}
                        >
                          <td className="py-2.5 px-3 sm:px-4 font-medium text-slate-900 dark:text-white">
                            {m.label}
                            {m.isMaxEfficiency && (
                              <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200">
                                Peak L/D
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 sm:px-4">{m.angleDeg !== null ? `${m.angleDeg}°` : "None"}</td>
                          <td className="py-2.5 px-3 sm:px-4">{formatNumber(m.dragN, 2)}</td>
                          <td className="py-2.5 px-3 sm:px-4 font-semibold">
                            {m.verticalN >= 0 ? formatSignedNumber(m.verticalN, 2) : formatNumber(m.verticalN, 2)}
                          </td>
                          <td className="py-2.5 px-3 sm:px-4">{m.deltaDragN === 0 ? "0.00" : formatSignedNumber(m.deltaDragN, 2)}</td>
                          <td className="py-2.5 px-3 sm:px-4">{m.deltaDragPercent === 0 ? "0.0%" : `${formatSignedNumber(m.deltaDragPercent, 1)}%`}</td>
                          <td className="py-2.5 px-3 sm:px-4">{m.netVerticalShiftN === 0 ? "0.00" : formatSignedNumber(m.netVerticalShiftN, 2)}</td>
                          <td className="py-2.5 px-3 sm:px-4 text-right font-bold">
                            {formatNumber(m.liftToDrag, 2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <em>Note: Pressure drag dominated in every case, viscous drag stayed below 90 N.</em>
                </p>
                {forceBasisNote && (
                  <p className="mt-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <em>Basis note: {forceBasisNote}</em>
                  </p>
                )}
              </div>

              {/* 3b. Interactive Academic SVG Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                
                {/* Chart 1: Force Trade-off (Grouped Bar Chart) */}
                <div className="p-5 sm:p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="text-xs sm:text-sm font-semibold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                        Chart 1: Downforce vs. Drag Trade-off
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600 dark:bg-cyan-500" />
                            <span className="text-slate-600 dark:text-slate-400">Downforce (F<sub>L</sub>)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-slate-500 dark:bg-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">Drag (F<sub>D</sub>)</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setZoomedChart("chart1");
                            setChartZoomLevel(1);
                          }}
                          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors print:hidden"
                          aria-label="Zoom in on Chart 1"
                          title="Zoom in on graph"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* SVG Chart 1 */}
                    <div className="relative w-full h-64 sm:h-72">
                      <svg
                        role="img"
                        aria-label="Grouped bar chart showing Downforce F_L versus Drag F_D across Baseline, 190 degree, 175 degree, and 150 degree configurations"
                        viewBox="0 0 500 270"
                        className="w-full h-full overflow-visible font-mono text-[10px]"
                      >
                        {/* Y-Axis Title */}
                        <text
                          x="-120"
                          y="14"
                          transform="rotate(-90)"
                          textAnchor="middle"
                          className="fill-slate-600 dark:fill-slate-400 font-bold text-[10px]"
                        >
                          Force ({FORCE_UNIT})
                        </text>

                        {/* Y-Axis Horizontal Gridlines (-2000 N to +10000 N, Span=12000) */}
                        {[
                          { val: 10000, y: 20 },
                          { val: 8000, y: 53.3 },
                          { val: 6000, y: 86.6 },
                          { val: 4000, y: 120 },
                          { val: 2000, y: 153.3 },
                          { val: 0, y: 186.6 },
                          { val: -2000, y: 220 },
                        ].map((tick) => (
                          <g key={tick.val}>
                            <line
                              x1="55"
                              y1={tick.y}
                              x2="480"
                              y2={tick.y}
                              stroke="currentColor"
                              strokeDasharray={tick.val === 0 ? "none" : "2 3"}
                              className={
                                tick.val === 0
                                  ? "text-slate-400 dark:text-slate-600 stroke-[1.5]"
                                  : "text-slate-200 dark:text-slate-800"
                              }
                            />
                            <text
                              x="48"
                              y={tick.y + 3}
                              textAnchor="end"
                              className="fill-slate-500 dark:fill-slate-400 text-[9px]"
                            >
                              {tick.val > 0 ? `+${tick.val}` : tick.val}
                            </text>
                          </g>
                        ))}

                        {/* Main Axis Lines */}
                        <line x1="55" y1="20" x2="55" y2="220" stroke="currentColor" className="text-slate-400 dark:text-slate-600 stroke-1" />
                        <line x1="55" y1="186.6" x2="480" y2="186.6" stroke="currentColor" className="text-slate-400 dark:text-slate-600 stroke-[1.5]" />

                        {/* Grouped Bars */}
                        {computedCfdModels.map((d, i) => {
                          const centerX = 95 + i * 85;
                          const zeroY = 186.6;
                          const scale = 200 / 12000;

                          const dfHeight = Math.abs(d.verticalN) * scale;
                          const dfY = d.verticalN >= 0 ? zeroY - dfHeight : zeroY;

                          const dragHeight = d.dragN * scale;
                          const dragY = zeroY - dragHeight;

                          const isHovered = hoveredChartIdx === i || focusedChartIdx === i;
                          const subtitle =
                            i === 0
                              ? "No Spoiler"
                              : i === 1
                              ? "Retracted"
                              : i === 2
                              ? "Balanced"
                              : "Peak Force";

                          return (
                            <g
                              key={d.id}
                              tabIndex={0}
                              role="group"
                              aria-label={`${d.label}: Downforce ${formatNumber(d.verticalN, 2)} N, Drag ${formatNumber(d.dragN, 2)} N`}
                              onMouseEnter={() => setHoveredChartIdx(i)}
                              onMouseLeave={() => setHoveredChartIdx(null)}
                              onFocus={() => setFocusedChartIdx(i)}
                              onBlur={() => setFocusedChartIdx(null)}
                              className="cursor-pointer outline-none focus:opacity-100 transition-opacity"
                              opacity={hoveredChartIdx === null || isHovered ? 1 : 0.6}
                            >
                              {/* Downforce bar */}
                              <rect
                                x={centerX - 24}
                                y={dfY}
                                width="20"
                                height={Math.max(dfHeight, 2)}
                                rx="1"
                                className={
                                  d.verticalN < 0
                                    ? "fill-amber-500/80 stroke-amber-600"
                                    : "fill-cyan-600 dark:fill-cyan-500"
                                }
                              />

                              {/* Drag bar */}
                              <rect
                                x={centerX + 2}
                                y={dragY}
                                width="20"
                                height={Math.max(dragHeight, 2)}
                                rx="1"
                                className="fill-slate-500 dark:fill-slate-400"
                              />

                              {/* Value text labels */}
                              <text
                                x={centerX - 14}
                                y={d.verticalN >= 0 ? dfY - 4 : dfY + dfHeight + 9}
                                textAnchor="middle"
                                className="fill-slate-900 dark:fill-white text-[8px] font-bold"
                              >
                                {isHovered ? formatNumber(d.verticalN, 2) : formatNumber(d.verticalN, 0)}
                              </text>

                              <text
                                x={centerX + 12}
                                y={dragY - 4}
                                textAnchor="middle"
                                className="fill-slate-600 dark:fill-slate-300 text-[8px]"
                              >
                                {isHovered ? formatNumber(d.dragN, 2) : formatNumber(d.dragN, 0)}
                              </text>

                              {/* X-Axis Category Label */}
                              <text
                                x={centerX}
                                y="240"
                                textAnchor="middle"
                                className="fill-slate-800 dark:fill-slate-200 font-semibold text-[10px]"
                              >
                                {d.shortLabel}
                              </text>
                              <text
                                x={centerX}
                                y="254"
                                textAnchor="middle"
                                className="fill-slate-500 dark:fill-slate-400 text-[8px]"
                              >
                                {subtitle}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* Screen reader hidden table */}
                      <table className="sr-only">
                        <caption>Chart 1 numerical data for screen readers</caption>
                        <thead>
                          <tr>
                            <th>Model</th>
                            <th>Downforce F_L (N)</th>
                            <th>Drag F_D (N)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {computedCfdModels.map((m) => (
                            <tr key={m.id}>
                              <td>{m.label}</td>
                              <td>{formatNumber(m.verticalN, 2)}</td>
                              <td>{formatNumber(m.dragN, 2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <em>Figure 1: Comparison of vertical forces (F<sub>L</sub>) and longitudinal drag (F<sub>D</sub>) across spoiler configurations.</em>
                  </div>
                </div>

                {/* Chart 2: Aerodynamic Efficiency (L/D Ratio) */}
                <div className="p-5 sm:p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                          Chart 2: Aerodynamic Efficiency (L/D)
                        </h3>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                          Vertical Force / Drag (F<sub>L</sub> / F<sub>D</sub>)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setZoomedChart("chart2");
                          setChartZoomLevel(1);
                        }}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors print:hidden"
                        aria-label="Zoom in on Chart 2"
                        title="Zoom in on graph"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    {/* SVG Chart 2 */}
                    <div className="relative w-full h-64 sm:h-72">
                      <svg
                        role="img"
                        aria-label="Bar chart showing Aerodynamic Efficiency L/D Ratio from -2.50 at Baseline to 6.03 at 150 degrees"
                        viewBox="0 0 500 270"
                        className="w-full h-full overflow-visible font-mono text-[10px]"
                      >
                        {/* Y-Axis Title */}
                        <text
                          x="-120"
                          y="14"
                          transform="rotate(-90)"
                          textAnchor="middle"
                          className="fill-slate-600 dark:fill-slate-400 font-bold text-[10px]"
                        >
                          Efficiency (L/D Ratio)
                        </text>

                        {/* Y-Axis Ticks: Range -4.0 to +8.0. Span=12. Height=200 */}
                        {[
                          { val: 8.0, y: 20 },
                          { val: 6.0, y: 53.3 },
                          { val: 4.0, y: 86.6 },
                          { val: 2.0, y: 120 },
                          { val: 0.0, y: 153.3 },
                          { val: -2.0, y: 186.6 },
                          { val: -4.0, y: 220 },
                        ].map((tick) => (
                          <g key={tick.val}>
                            <line
                              x1="55"
                              y1={tick.y}
                              x2="480"
                              y2={tick.y}
                              stroke="currentColor"
                              strokeDasharray={tick.val === 0 ? "none" : "2 3"}
                              className={
                                tick.val === 0
                                  ? "text-slate-400 dark:text-slate-600 stroke-[1.5]"
                                  : "text-slate-200 dark:text-slate-800"
                              }
                            />
                            <text
                              x="48"
                              y={tick.y + 3}
                              textAnchor="end"
                              className="fill-slate-500 dark:fill-slate-400 text-[9px]"
                            >
                              {tick.val.toFixed(1)}
                            </text>
                          </g>
                        ))}

                        {/* Zero Line Regime Labels (Moved to x=485 with ample clearance from bars) */}
                        <text
                          x="485"
                          y="147"
                          textAnchor="end"
                          className="fill-emerald-600 dark:fill-emerald-400 text-[8px] font-semibold"
                        >
                          downforce regime ↑
                        </text>
                        <text
                          x="485"
                          y="164"
                          textAnchor="end"
                          className="fill-amber-600 dark:fill-amber-400 text-[8px] font-semibold"
                        >
                          lift regime ↓
                        </text>

                        {/* Main Axes */}
                        <line x1="55" y1="20" x2="55" y2="220" stroke="currentColor" className="text-slate-400 dark:text-slate-600 stroke-1" />
                        <line x1="55" y1="153.3" x2="480" y2="153.3" stroke="currentColor" className="text-slate-400 dark:text-slate-600 stroke-[1.5]" />

                        {/* Bars for Efficiency */}
                        {computedCfdModels.map((d, i) => {
                          const centerX = 95 + i * 85;
                          const zeroY = 153.3;
                          const scale = 200 / 12;

                          const barHeight = Math.abs(d.liftToDrag) * scale;
                          const barY = d.liftToDrag >= 0 ? zeroY - barHeight : zeroY;

                          const isHovered = hoveredChartIdx === i || focusedChartIdx === i;

                          const configSubtitle =
                            d.id === "baseline"
                              ? "No Spoiler"
                              : d.angleDeg === 190
                              ? "Retracted"
                              : d.angleDeg === 175
                              ? "Balanced"
                              : "Peak Downforce";

                          return (
                            <g
                              key={d.id}
                              tabIndex={0}
                              role="group"
                              aria-label={`${d.label}: Efficiency L/D = ${formatNumber(d.liftToDrag, 2)}`}
                              onMouseEnter={() => setHoveredChartIdx(i)}
                              onMouseLeave={() => setHoveredChartIdx(null)}
                              onFocus={() => setFocusedChartIdx(i)}
                              onBlur={() => setFocusedChartIdx(null)}
                              className="cursor-pointer outline-none focus:opacity-100 transition-opacity"
                              opacity={hoveredChartIdx === null || isHovered ? 1 : 0.6}
                            >
                              <rect
                                x={centerX - 16}
                                y={barY}
                                width="32"
                                height={Math.max(barHeight, 2)}
                                rx="1"
                                className={
                                  d.liftToDrag < 0
                                    ? "fill-amber-500/80 stroke-amber-600"
                                    : d.isMaxEfficiency
                                    ? "fill-cyan-600 dark:fill-cyan-500"
                                    : "fill-slate-600 dark:fill-slate-400"
                                }
                              />

                              {/* Value Text with clean separation */}
                              <text
                                x={centerX}
                                y={d.liftToDrag >= 0 ? barY - 6 : barY + barHeight + 12}
                                textAnchor="middle"
                                className="fill-slate-900 dark:fill-white text-[9px] font-bold font-mono"
                              >
                                {formatNumber(d.liftToDrag, 2)}
                              </text>

                              {/* X-Axis Category Label */}
                              <text
                                x={centerX}
                                y="240"
                                textAnchor="middle"
                                className="fill-slate-800 dark:fill-slate-200 font-semibold text-[10px]"
                              >
                                {d.shortLabel}
                              </text>
                              <text
                                x={centerX}
                                y="254"
                                textAnchor="middle"
                                className="fill-slate-500 dark:fill-slate-400 text-[8px]"
                              >
                                {configSubtitle}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* Screen reader hidden table */}
                      <table className="sr-only">
                        <caption>Chart 2 numerical data for screen readers</caption>
                        <thead>
                          <tr>
                            <th>Model</th>
                            <th>Efficiency L/D</th>
                          </tr>
                        </thead>
                        <tbody>
                          {computedCfdModels.map((m) => (
                            <tr key={m.id}>
                              <td>{m.label}</td>
                              <td>{formatNumber(m.liftToDrag, 2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <em>Figure 2: Progression of aerodynamic efficiency ratio (L/D = F<sub>L</sub> / F<sub>D</sub>) from baseline lift to peak efficiency at 150°.</em>
                  </div>
                </div>

              </div>

              {/* 3c. Diminishing Returns Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                  Table 2: Cost of Each Extra Step in Drag (Marginal Return ΔF<sub>L</sub> / ΔF<sub>D</sub>)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Analysis of incremental gains showing the diminishing returns in vertical load produced per unit of pressure drag as the spoiler deployment angle steepens.
                </p>

                <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none" tabIndex={0} aria-label="Marginal return table">
                  <table className="w-full text-left text-xs sm:text-sm font-mono">
                    <caption className="sr-only">Marginal return of downforce per unit drag between consecutive spoiler steps</caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th scope="col" className="py-2.5 px-4 font-semibold">Deployment Transition</th>
                        <th scope="col" className="py-2.5 px-4 font-semibold">Δ Vertical Force (ΔF<sub>L</sub>)</th>
                        <th scope="col" className="py-2.5 px-4 font-semibold">Δ Drag (ΔF<sub>D</sub>)</th>
                        <th scope="col" className="py-2.5 px-4 font-semibold">Marginal Return (ΔF<sub>L</sub> / ΔF<sub>D</sub>)</th>
                        <th scope="col" className="py-2.5 px-4 font-semibold">Observation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {marginalReturnSteps.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">
                            {row.fromLabel} → {row.toLabel}
                          </td>
                          <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400 font-semibold">
                            {formatSignedNumber(row.deltaVerticalN, 2)} {FORCE_UNIT}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                            {formatSignedNumber(row.deltaDragN, 2)} {FORCE_UNIT}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                            {formatNumber(row.marginalReturn, 2)} N / N
                          </td>
                          <td className="py-2.5 px-4 text-xs text-slate-500 dark:text-slate-400 font-sans">
                            {row.observation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans pt-1">
                  <strong>Summary:</strong> The marginal return drops from <strong>{formatNumber(marginalReturnSteps[0].marginalReturn, 2)} N/N</strong> (Baseline to 190°) to <strong>{formatNumber(marginalReturnSteps[1].marginalReturn, 2)} N/N</strong> (190° to 175°), and further to <strong>{formatNumber(marginalReturnSteps[2].marginalReturn, 2)} N/N</strong> (175° to 150°), demonstrating that steep deployment angles incur higher drag penalties for every additional newton of downforce gained.
                </p>
              </div>
            </section>

            {/* =============================================================== */}
            {/* BLOCK 5: ACCESSIBLE CONTOUR EXPLORER & VISUALIZATIONS           */}
            {/* =============================================================== */}
            <section id="contours" className="scroll-mt-24 sm:scroll-mt-28 mb-14 pb-12 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    04 / Flow Field Contours & Explorer
                  </h2>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    Interactive ANSYS Fluent Post-Processing Viewer
                  </p>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={() => setCompareAll(!compareAll)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
                      compareAll
                        ? "bg-cyan-600 text-white border-cyan-600"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {compareAll ? <Columns className="w-3.5 h-3.5" /> : <Grid className="w-3.5 h-3.5" />}
                    <span>{compareAll ? "Single View" : "Compare All (2×2)"}</span>
                  </button>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 print:hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Model Selector (ARIA Tabs) */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                      Select Configuration:
                    </span>
                    <div
                      role="tablist"
                      aria-label="CFD Model Selector"
                      className="inline-flex rounded bg-slate-100 dark:bg-slate-800 p-1 text-xs font-mono"
                    >
                      {modelOptions.map((opt) => {
                        const isSelected = selectedModelId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            role="tab"
                            id={`tab-model-${opt.id}`}
                            aria-selected={isSelected}
                            tabIndex={isSelected ? 0 : -1}
                            onClick={() => {
                              setSelectedModelId(opt.id);
                              updateHashSelection(opt.id, selectedView);
                            }}
                            onKeyDown={(e) => {
                              const currentIndex = modelOptions.findIndex((o) => o.id === selectedModelId);
                              if (e.key === "ArrowRight") {
                                const nextIndex = (currentIndex + 1) % modelOptions.length;
                                setSelectedModelId(modelOptions[nextIndex].id);
                                updateHashSelection(modelOptions[nextIndex].id, selectedView);
                              } else if (e.key === "ArrowLeft") {
                                const prevIndex = (currentIndex - 1 + modelOptions.length) % modelOptions.length;
                                setSelectedModelId(modelOptions[prevIndex].id);
                                updateHashSelection(modelOptions[prevIndex].id, selectedView);
                              }
                            }}
                            className={`px-3 py-1.5 rounded transition-all min-h-[36px] ${
                              isSelected
                                ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* View Type Selector (Velocity vs Pressure) */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                      Select Field Variable:
                    </span>
                    <div
                      role="tablist"
                      aria-label="Contour Field Variable Selector"
                      className="inline-flex rounded bg-slate-100 dark:bg-slate-800 p-1 text-xs font-mono"
                    >
                      <button
                        role="tab"
                        aria-selected={selectedView === "velocity"}
                        tabIndex={selectedView === "velocity" ? 0 : -1}
                        onClick={() => {
                          setSelectedView("velocity");
                          updateHashSelection(selectedModelId, "velocity");
                        }}
                        className={`px-3 py-1.5 rounded transition-all min-h-[36px] ${
                          selectedView === "velocity"
                            ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        Velocity Magnitude (m/s)
                      </button>

                      <button
                        role="tab"
                        aria-selected={selectedView === "pressure"}
                        tabIndex={selectedView === "pressure" ? 0 : -1}
                        disabled={selectedModelId === "baseline"}
                        title={selectedModelId === "baseline" ? "Not available for this model" : undefined}
                        onClick={() => {
                          if (selectedModelId !== "baseline") {
                            setSelectedView("pressure");
                            updateHashSelection(selectedModelId, "pressure");
                          }
                        }}
                        className={`px-3 py-1.5 rounded transition-all min-h-[36px] ${
                          selectedModelId === "baseline"
                            ? "opacity-40 cursor-not-allowed text-slate-400"
                            : selectedView === "pressure"
                            ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        Static Pressure (Pa)
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Single View Mode */}
              {!compareAll && (
                <div className="space-y-4 print:hidden">
                  <div className="max-w-3xl mx-auto">
                    <figure className="space-y-2">
                      <div
                        onClick={() => {
                          if (currentFigureIndex >= 0) openLightbox(currentFigureIndex);
                        }}
                        className="group relative aspect-[16/10] w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden cursor-pointer shadow-sm hover:border-cyan-500/60 transition-colors"
                      >
                        <img
                          src={getAssetPath(
                            selectedView === "velocity" || selectedModelId === "baseline"
                              ? activeModel.velocityImageSrc
                              : activeModel.pressureImageSrc || activeModel.velocityImageSrc
                          )}
                          alt={
                            selectedView === "velocity" || selectedModelId === "baseline"
                              ? activeModel.velocityAlt
                              : activeModel.pressureAlt || activeModel.velocityAlt
                          }
                          className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
                        />

                        {/* Top HUD Badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 border border-slate-700 text-[11px] font-mono text-cyan-300 font-semibold">
                          Figure {selectedView === "velocity" || selectedModelId === "baseline" ? activeModel.figureNumberVelocity : activeModel.figureNumberPressure}: {activeModel.label}
                        </div>

                        {/* Fullscreen indicator */}
                        <div className="absolute top-3 right-3 p-1.5 rounded bg-slate-950/80 border border-slate-700 text-slate-300 group-hover:text-white">
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                      </div>

                      {/* Legend Readout and Figcaption */}
                      <figcaption className="text-center space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                          <span className="font-semibold text-slate-900 dark:text-white">Legend Range:</span>
                          <span>
                            {selectedView === "velocity" || selectedModelId === "baseline"
                              ? activeModel.velocityLegendRange
                              : activeModel.pressureLegendRange}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          <em>
                            {selectedView === "velocity" || selectedModelId === "baseline"
                              ? activeModel.velocityCaption
                              : activeModel.pressureCaption}
                          </em>
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              )}

              {/* Compare All 2x2 Mode */}
              {compareAll && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
                  {computedCfdModels.map((m) => {
                    const isVelocity = selectedView === "velocity" || m.id === "baseline";
                    const src = isVelocity ? m.velocityImageSrc : m.pressureImageSrc || m.velocityImageSrc;
                    const alt = isVelocity ? m.velocityAlt : m.pressureAlt || m.velocityAlt;
                    const figNum = isVelocity ? m.figureNumberVelocity : m.figureNumberPressure || m.figureNumberVelocity;
                    const legend = isVelocity ? m.velocityLegendRange : m.pressureLegendRange || m.velocityLegendRange;
                    const caption = isVelocity ? m.velocityCaption : m.pressureCaption || m.velocityCaption;

                    const figIdx = allContourItems.findIndex((item) => item.figureNumber === figNum);

                    return (
                      <figure key={m.id} className="space-y-1.5">
                        <div
                          onClick={() => {
                            if (figIdx >= 0) openLightbox(figIdx);
                          }}
                          className="group relative aspect-[16/10] w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden cursor-pointer shadow-sm hover:border-cyan-500/60 transition-colors"
                        >
                          <img
                            src={getAssetPath(src)}
                            alt={alt}
                            className="w-full h-full object-contain object-center"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 text-[10px] font-mono text-cyan-300 font-semibold">
                            Figure {figNum}: {m.shortLabel}
                          </div>
                          <div className="absolute top-2 right-2 p-1 rounded bg-slate-950/80 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-3 h-3" />
                          </div>
                        </div>
                        <figcaption className="text-center text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{m.label} ({legend})</span>
                          <span className="block text-[10px] text-slate-500"><em>{caption}</em></span>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              )}

              {/* Color Scale Comparison Note */}
              <div className="mt-4 p-3 rounded bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center gap-2 print:hidden">
                <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>
                  {contoursShareScale
                    ? "All contours share the same colour scale."
                    : "Each contour uses its own colour scale. Read the legend before comparing models."}
                </span>
              </div>

              {/* Supplemental Standalone Figure 10: Particle Pathlines */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold font-mono text-slate-900 dark:text-white mb-3">
                  Figure 10: Full Vehicle Particle Pathlines & Wake Topology (150°)
                </h3>
                <div className="max-w-3xl mx-auto">
                  <figure className="space-y-2">
                    <div
                      onClick={() => {
                        const idx = allContourItems.findIndex((item) => item.figureNumber === 10);
                        if (idx >= 0) openLightbox(idx);
                      }}
                      className="group relative aspect-[21/9] w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden cursor-pointer shadow-sm hover:border-cyan-500/60 transition-colors"
                    >
                      <img
                        src={getAssetPath(pathlinesAsset.src)}
                        alt={pathlinesAsset.alt}
                        className="w-full h-full object-contain object-center"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 border border-slate-700 text-[11px] font-mono text-cyan-300 font-semibold">
                        Figure 10: 150° Spoiler Particle Pathlines
                      </div>
                      <div className="absolute top-3 right-3 p-1.5 rounded bg-slate-950/80 border border-slate-700 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <figcaption className="text-center text-xs font-mono text-slate-500 dark:text-slate-400">
                      <em>{pathlinesAsset.caption}</em>
                    </figcaption>
                  </figure>
                </div>
              </div>

              {/* PRINT ONLY: All Figures Expanded Stacked */}
              <div className="hidden print:block space-y-6">
                <p className="text-xs font-mono text-slate-600 mb-4">
                  <em>Complete Contour Gallery (Print Edition):</em>
                </p>
                {allContourItems.map((item) => (
                  <figure key={item.figureNumber} className="space-y-1 break-inside-avoid">
                    <div className="aspect-[16/10] w-full border border-slate-300 bg-slate-950">
                      <img src={getAssetPath(item.src)} alt={item.alt} className="w-full h-full object-contain" />
                    </div>
                    <figcaption className="text-xs font-mono text-slate-700 text-center">
                      <strong>Figure {item.figureNumber}: {item.title}</strong> (Legend: {item.legendRange}). {item.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>

            </section>

            {/* =============================================================== */}
            {/* BLOCK 6: DISCUSSION & OPERATING MODES                           */}
            {/* =============================================================== */}
            <section id="discussion" className="scroll-mt-24 sm:scroll-mt-28 mb-14 pb-12 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                05 / Discussion & Operating Modes
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>Non-Linear Force Progression:</strong> The simulation data illustrates a non-linear relationship between spoiler deployment angle, vertical downforce, and pressure drag. Downforce rises about 193 N per degree from 190° to 175° and about 206 N per degree from 175° to 150°, while the drag cost per degree rises from about 14.4 N to 21.4 N.
                </p>

                {/* Scope Note */}
                <div className="p-3.5 rounded bg-slate-100 dark:bg-slate-900 border-l-4 border-cyan-500 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <strong>Scope note:</strong> These operating modes are interpretations of steady, straight-line results at 80 m/s. Braking, cornering, pitch and yaw were not simulated.
                </div>

                <p>
                  <strong>Aerodynamic Operating Modes:</strong>
                </p>
                <ul className="list-disc list-outside pl-5 space-y-2 text-sm sm:text-base">
                  <li>
                    <strong>190° Angle (Low-Drag Mode):</strong> Converts {formatNumber(Math.abs(computedCfdModels[0].verticalN), 0)} N of lift into +{formatNumber(computedCfdModels[1].verticalN, 0)} N of downforce with only a {formatSignedNumber(computedCfdModels[1].deltaDragN, 0)} N (+{formatNumber(computedCfdModels[1].deltaDragPercent, 1)}%) drag rise (L/D = {formatNumber(computedCfdModels[1].liftToDrag, 2)}). This setting would suit straight-line acceleration and high-speed straights.
                  </li>
                  <li>
                    <strong>175° Angle (Balanced Cruise & Cornering Mode):</strong> Generates +{formatNumber(computedCfdModels[2].verticalN, 0)} N of downforce at {formatNumber(computedCfdModels[2].dragN, 0)} N drag, achieving an efficiency ratio of L/D = F<sub>L</sub> / F<sub>D</sub> = {formatNumber(computedCfdModels[2].liftToDrag, 2)}. This setting would suit high-speed sweeping corners where tire grip requires significant vertical loading without excessive power loss.
                  </li>
                  <li>
                    <strong>150° Angle (Airbrake & High-Downforce Mode):</strong> Generates +{formatNumber(computedCfdModels[3].verticalN, 0)} N of peak downforce with an efficiency ratio of L/D = F<sub>L</sub> / F<sub>D</sub> = {formatNumber(computedCfdModels[3].liftToDrag, 2)}, but incurs a +{formatNumber(computedCfdModels[3].deltaDragPercent, 0)}% drag rise ({formatNumber(computedCfdModels[3].dragN, 0)} N). This configuration would suit heavy braking and tight corner entry to maximize normal load and tire adhesion.
                  </li>
                </ul>

                <p>
                  <strong>Aero-Mechanical Synthesis:</strong> Active aerodynamic articulation allows a vehicle to exploit low drag at high speeds and maximum vertical load under braking and cornering. Fixed aerodynamic elements typically impose a compromise between top speed and low-speed stability, whereas active deployment precisely matches instantaneous dynamic requirements.
                </p>
              </div>
            </section>

            {/* =============================================================== */}
            {/* BLOCK 7: LIMITATIONS & CONFIDENCE                               */}
            {/* =============================================================== */}
            <section id="limitations" className="scroll-mt-24 sm:scroll-mt-28 mb-14 pb-12 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                06 / Limitations & Confidence
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>Geometric and Dimensional Simplifications:</strong> This study evaluated a 2D longitudinal centreline slice. The model does not include rotating wheels, detailed underbody diffusers, ground proximity interaction, or 3D crossflows. Consequently, absolute force values are overstated, and relative trends between configurations are more reliable than absolute numbers.
                </p>

                <p>
                  <strong>Turbulence Modeling Sensitivity:</strong> Calculations relied on steady-state RANS with a single turbulence model (Realizable k-epsilon). Predicted forces depend directly on how accurately separation and reattachment locations are captured along the curved decklid and spoiler flap.
                </p>

                {/* Optional validation note (rendered only when populated in dataset) */}
                {optionalSetupRows.find((r) => r.key === "validationNote")?.value && (
                  <p className="p-3 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <strong>Validation note:</strong> {optionalSetupRows.find((r) => r.key === "validationNote")?.value}
                  </p>
                )}

                <div>
                  <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                    Possible Future Extensions
                  </h3>
                  <ul className="list-disc list-outside pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <li>Transient URANS or Detached Eddy Simulation (DES) to capture unsteady wake shedding dynamics.</li>
                    <li>Turbulence model comparative sensitivity study using the k-omega SST formulation.</li>
                    <li>3D full-chassis geometry modeling including wheels, wheelhouse ventilation, and underbody ground effect.</li>
                    <li>Parametric sweeps of spoiler height, endplate configurations, and trailing-edge Gurney flaps.</li>
                    <li>Formal grid convergence index (GCI) mesh independence study across fine, medium, and coarse meshes.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* =============================================================== */}
            {/* BLOCK 8: TECHNICAL DOCUMENTATION / REPORT DOWNLOAD              */}
            {/* =============================================================== */}
            <section id="download" className="scroll-mt-24 sm:scroll-mt-28 mb-14">
              <div className="p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Technical Documentation</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Full CFD Investigation Report
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                    Full write-up of the study: aim, method, results, flow field contours and discussion.
                  </p>
                </div>

                <div className="shrink-0 print:hidden">
                  <button
                    type="button"
                    disabled
                    data-goatcounter-click="download-spoiler-report"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-xs sm:text-sm font-semibold cursor-not-allowed shadow-none border border-slate-300 dark:border-slate-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Report coming soon</span>
                  </button>
                </div>
              </div>
            </section>

            {/* =============================================================== */}
            {/* PROJECT PAGINATION NAVIGATION                                   */}
            {/* =============================================================== */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sm:text-sm print:hidden">
              <Link
                href={`/projects/${prevProject.slug}`}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"
              >
                <span>← Previous: {prevProject.title}</span>
              </Link>
              <Link
                href={`/projects/${nextProject.slug}`}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"
              >
                <span>Next: {nextProject.title} →</span>
              </Link>
            </div>

          </main>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ACCESSIBLE FULLSCREEN LIGHTBOX MODAL (CONTOURS)                     */}
      {/* =================================================================== */}
      {lightboxIndex !== null && allContourItems[lightboxIndex] && (
        <div
          ref={lightboxModalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6"
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-3">
              <span id="lightbox-title" className="font-semibold text-white">
                Figure {allContourItems[lightboxIndex].figureNumber}: {allContourItems[lightboxIndex].title}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400">
                {lightboxIndex + 1} of {allContourItems.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Main Stage with Navigation Arrows */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            {/* Previous Arrow */}
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) =>
                  prev !== null ? (prev > 0 ? prev - 1 : allContourItems.length - 1) : null
                )
              }
              className="absolute left-2 sm:left-4 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              aria-label="Previous figure"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <div className="max-w-5xl max-h-[75vh] w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-full h-full max-h-[65vh] rounded bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                <img
                  src={getAssetPath(allContourItems[lightboxIndex].src)}
                  alt={allContourItems[lightboxIndex].alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="mt-3 text-center max-w-3xl space-y-1">
                {allContourItems[lightboxIndex].legendRange && (
                  <div className="inline-block px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 mb-1">
                    Legend Range: {allContourItems[lightboxIndex].legendRange}
                  </div>
                )}
                <p className="text-xs font-mono text-slate-300">
                  {allContourItems[lightboxIndex].caption}
                </p>
              </div>
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) =>
                  prev !== null ? (prev < allContourItems.length - 1 ? prev + 1 : 0) : null
                )
              }
              className="absolute right-2 sm:right-4 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              aria-label="Next figure"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer Instructions */}
          <div className="pt-2 border-t border-slate-800 text-center font-mono text-[11px] text-slate-500">
            Use Left/Right arrow keys to navigate · Press Escape to close
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* INTERACTIVE CHART ZOOM MODAL (LIGHT & DARK MODE AWARE)              */}
      {/* =================================================================== */}
      {zoomedChart !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chart-zoom-title"
          className="fixed inset-0 z-[200] bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <span id="chart-zoom-title" className="font-semibold text-slate-900 dark:text-white">
                {zoomedChart === "chart1"
                  ? "Chart 1: Downforce vs. Drag Trade-off (Detailed Zoom)"
                  : "Chart 2: Aerodynamic Efficiency L/D Ratio (Detailed Zoom)"}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChartZoomLevel((prev) => Math.max(0.75, Math.round((prev - 0.25) * 100) / 100))}
                disabled={chartZoomLevel <= 0.75}
                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom out"
                title="Zoom out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 px-2 min-w-[48px] text-center">
                {Math.round(chartZoomLevel * 100)}%
              </span>

              <button
                type="button"
                onClick={() => setChartZoomLevel((prev) => Math.min(3, Math.round((prev + 0.25) * 100) / 100))}
                disabled={chartZoomLevel >= 3}
                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom in"
                title="Zoom in (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setChartZoomLevel(1)}
                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Reset zoom"
                title="Reset zoom (0)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setZoomedChart(null)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors ml-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chart Display Area (Scrollable & Zoomable) */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-auto">
            <div
              style={{
                transform: `scale(${chartZoomLevel})`,
                transformOrigin: "center center",
                transition: "transform 0.15s ease-out",
              }}
              className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl shrink-0"
            >
              {zoomedChart === "chart1" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                      Force Vector Balance across Spoiler Angles
                    </span>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600 dark:bg-cyan-500" />
                        <span className="text-slate-600 dark:text-slate-300">Downforce (F<sub>L</sub>)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-500 dark:bg-slate-400" />
                        <span className="text-slate-600 dark:text-slate-300">Drag (F<sub>D</sub>)</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-80 sm:h-96">
                    <svg
                      role="img"
                      aria-label="Zoomed Chart 1: Downforce F_L vs Drag F_D"
                      viewBox="0 0 500 270"
                      className="w-full h-full overflow-visible font-mono text-[10px]"
                    >
                      <text
                        x="-120"
                        y="14"
                        transform="rotate(-90)"
                        textAnchor="middle"
                        className="fill-slate-600 dark:fill-slate-400 font-bold text-[10px]"
                      >
                        Force ({FORCE_UNIT})
                      </text>

                      {[
                        { val: 10000, y: 20 },
                        { val: 8000, y: 53.3 },
                        { val: 6000, y: 86.6 },
                        { val: 4000, y: 120 },
                        { val: 2000, y: 153.3 },
                        { val: 0, y: 186.6 },
                        { val: -2000, y: 220 },
                      ].map((tick) => (
                        <g key={tick.val}>
                          <line
                            x1="55"
                            y1={tick.y}
                            x2="480"
                            y2={tick.y}
                            stroke="currentColor"
                            strokeDasharray={tick.val === 0 ? "none" : "2 3"}
                            className={
                              tick.val === 0
                                ? "text-slate-400 dark:text-slate-600 stroke-[1.5]"
                                : "text-slate-200 dark:text-slate-800"
                            }
                          />
                          <text
                            x="48"
                            y={tick.y + 3}
                            textAnchor="end"
                            className="fill-slate-500 dark:fill-slate-400 text-[9px]"
                          >
                            {tick.val > 0 ? `+${tick.val}` : tick.val}
                          </text>
                        </g>
                      ))}

                      <line x1="55" y1="20" x2="55" y2="220" stroke="currentColor" className="text-slate-400 dark:text-slate-600 stroke-1" />
                      <line x1="55" y1="186.6" x2="480" y2="186.6" stroke="currentColor" className="text-slate-400 dark:text-slate-600 stroke-[1.5]" />

                      {computedCfdModels.map((d, i) => {
                        const centerX = 95 + i * 85;
                        const zeroY = 186.6;
                        const scale = 200 / 12000;

                        const dfHeight = Math.abs(d.verticalN) * scale;
                        const dfY = d.verticalN >= 0 ? zeroY - dfHeight : zeroY;

                        const dragHeight = d.dragN * scale;
                        const dragY = zeroY - dragHeight;

                        const subtitle =
                          i === 0
                            ? "No Spoiler"
                            : i === 1
                            ? "Retracted"
                            : i === 2
                            ? "Balanced"
                            : "Peak Force";

                        return (
                          <g key={d.id}>
                            <rect
                              x={centerX - 24}
                              y={dfY}
                              width="20"
                              height={Math.max(dfHeight, 2)}
                              rx="1"
                              className={
                                d.verticalN < 0
                                  ? "fill-amber-500/80 stroke-amber-600"
                                  : "fill-cyan-600 dark:fill-cyan-500"
                              }
                            />
                            <rect
                              x={centerX + 2}
                              y={dragY}
                              width="20"
                              height={Math.max(dragHeight, 2)}
                              rx="1"
                              className="fill-slate-500 dark:fill-slate-400"
                            />

                            <text
                              x={centerX - 14}
                              y={d.verticalN >= 0 ? dfY - 4 : dfY + dfHeight + 9}
                              textAnchor="middle"
                              className="fill-slate-900 dark:fill-white text-[8px] font-bold"
                            >
                              {formatNumber(d.verticalN, 2)}
                            </text>
                            <text
                              x={centerX + 12}
                              y={dragY - 4}
                              textAnchor="middle"
                              className="fill-slate-600 dark:fill-slate-300 text-[8px]"
                            >
                              {formatNumber(d.dragN, 2)}
                            </text>

                            <text
                              x={centerX}
                              y="240"
                              textAnchor="middle"
                              className="fill-slate-800 dark:fill-slate-200 font-semibold text-[10px]"
                            >
                              {d.shortLabel}
                            </text>
                            <text
                              x={centerX}
                              y="254"
                              textAnchor="middle"
                              className="fill-slate-500 dark:fill-slate-400 text-[8px]"
                            >
                              {subtitle}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                      Lift-to-Drag Aerodynamic Efficiency (L/D = F<sub>L</sub> / F<sub>D</sub>)
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Positive = Downforce Regime
                    </span>
                  </div>

                  <div className="relative w-full h-80 sm:h-96">
                    <svg
                      role="img"
                      aria-label="Zoomed Chart 2: Aerodynamic Efficiency L/D Ratio"
                      viewBox="0 0 500 270"
                      className="w-full h-full overflow-visible font-mono text-[10px]"
                    >
                      <text
                        x="-120"
                        y="14"
                        transform="rotate(-90)"
                        textAnchor="middle"
                        className="fill-slate-600 dark:fill-slate-400 font-bold text-[10px]"
                      >
                        Efficiency (L/D Ratio)
                      </text>

                      {[
                        { val: 8.0, y: 20 },
                        { val: 6.0, y: 53.3 },
                        { val: 4.0, y: 86.6 },
                        { val: 2.0, y: 120 },
                        { val: 0.0, y: 153.3 },
                        { val: -2.0, y: 186.6 },
                        { val: -4.0, y: 220 },
                      ].map((tick) => (
                        <g key={tick.val}>
                          <line
                            x1="55"
                            y1={tick.y}
                            x2="480"
                            y2={tick.y}
                            stroke="currentColor"
                            strokeDasharray={tick.val === 0 ? "none" : "2 3"}
                            className={
                              tick.val === 0
                                ? "text-slate-400 dark:text-slate-600 stroke-[1.5]"
                                : "text-slate-200 dark:text-slate-800"
                            }
                          />
                          <text
                            x="48"
                            y={tick.y + 3}
                            textAnchor="end"
                            className="fill-slate-500 dark:fill-slate-400 text-[9px]"
                          >
                            {tick.val.toFixed(1)}
                          </text>
                        </g>
                      ))}

                      <text
                        x="485"
                        y="147"
                        textAnchor="end"
                        className="fill-emerald-600 dark:fill-emerald-400 text-[8px] font-semibold"
                      >
                        downforce regime ↑
                      </text>
                      <text
                        x="485"
                        y="164"
                        textAnchor="end"
                        className="fill-amber-600 dark:fill-amber-400 text-[8px] font-semibold"
                      >
                        lift regime ↓
                      </text>

                      <line x1="55" y1="20" x2="55" y2="220" stroke="currentColor" className="text-slate-400 dark:text-slate-600 stroke-1" />
                      <line x1="55" y1="153.3" x2="480" y2="153.3" stroke="currentColor" className="text-slate-400 dark:text-slate-600 stroke-[1.5]" />

                      {computedCfdModels.map((d, i) => {
                        const centerX = 95 + i * 85;
                        const zeroY = 153.3;
                        const scale = 200 / 12;

                        const barHeight = Math.abs(d.liftToDrag) * scale;
                        const barY = d.liftToDrag >= 0 ? zeroY - barHeight : zeroY;

                        const configSubtitle =
                          d.id === "baseline"
                            ? "No Spoiler"
                            : d.angleDeg === 190
                            ? "Retracted"
                            : d.angleDeg === 175
                            ? "Balanced"
                            : "Peak Downforce";

                        return (
                          <g key={d.id}>
                            <rect
                              x={centerX - 16}
                              y={barY}
                              width="32"
                              height={Math.max(barHeight, 2)}
                              rx="1"
                              className={
                                d.liftToDrag < 0
                                  ? "fill-amber-500/80 stroke-amber-600"
                                  : d.isMaxEfficiency
                                  ? "fill-cyan-600 dark:fill-cyan-500"
                                  : "fill-slate-600 dark:fill-slate-400"
                              }
                            />

                            <text
                              x={centerX}
                              y={d.liftToDrag >= 0 ? barY - 6 : barY + barHeight + 12}
                              textAnchor="middle"
                              className="fill-slate-900 dark:fill-white text-[9px] font-bold font-mono"
                            >
                              {formatNumber(d.liftToDrag, 2)}
                            </text>

                            <text
                              x={centerX}
                              y="240"
                              textAnchor="middle"
                              className="fill-slate-800 dark:fill-slate-200 font-semibold text-[10px]"
                            >
                              {d.shortLabel}
                            </text>
                            <text
                              x={centerX}
                              y="254"
                              textAnchor="middle"
                              className="fill-slate-500 dark:fill-slate-400 text-[8px]"
                            >
                              {configSubtitle}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer instructions */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400">
            Use + / - to zoom · 0 to reset · Press Escape to close
          </div>
        </div>
      )}

      <div className="print:hidden">
        <AnimatedFooter />
      </div>
    </div>
  );
}
