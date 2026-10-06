"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Layers,
  Box,
  Play,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Compass,
  Check,
  Activity,
  AlertTriangle,
  Wind,
  Clock,
} from "lucide-react";
import { ProjectData, ProjectMediaItem } from "@/data/projects";
import { portfolioData } from "@/data/portfolioData";
import { getAssetPath } from "@/lib/utils";
import { ModelViewer3D } from "./ModelViewer3D";
import { AnimatedFooter } from "./AnimatedFooter";
import { ProjectHeader, ProjectPager } from "./ProjectHeader";

interface LightboxItem {
  src: string;
  type?: "image" | "video" | "3d";
  caption: string;
  desc?: string;
  category?: string;
}

interface UniversalProjectDetailProps {
  project: ProjectData;
  prevProject: ProjectData;
  nextProject: ProjectData;
}

export function UniversalProjectDetail({
  project,
  prevProject,
  nextProject,
}: UniversalProjectDetailProps) {
  const [activeLightbox, setActiveLightbox] = useState<{
    items: LightboxItem[];
    index: number;
  } | null>(null);

  const openGalleryLightbox = (idx: number) => {
    if (!project.gallery) return;
    const items: LightboxItem[] = project.gallery.map((g) => ({
      src: g.src,
      type: g.type,
      caption: g.caption,
      desc: g.desc,
      category: "Technical Media Gallery",
    }));
    setActiveLightbox({ items, index: idx });
  };

  const openCfdLightbox = (idx: number) => {
    if (!project.cfdResults) return;
    const items: LightboxItem[] = project.cfdResults.items.map((c) => ({
      src: c.src,
      type: "image",
      caption: c.title,
      desc: `${c.description} (Freestream simulation airspeed: 20 m/s)`,
      category: `Test CFD Results · ${c.aoa || "Preliminary Simulation"}`,
    }));
    setActiveLightbox({ items, index: idx });
  };

  // Parallax scroll effect for Hero Asset
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.85]);

  // Keyboard navigation for Fullscreen Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeLightbox) return;
      if (e.key === "Escape") setActiveLightbox(null);
      if (e.key === "ArrowLeft") {
        setActiveLightbox((prev) =>
          prev
            ? {
                ...prev,
                index: (prev.index - 1 + prev.items.length) % prev.items.length,
              }
            : null
        );
      }
      if (e.key === "ArrowRight") {
        setActiveLightbox((prev) =>
          prev
            ? {
                ...prev,
                index: (prev.index + 1) % prev.items.length,
              }
            : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightbox]);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden pt-24 sm:pt-28 transition-colors duration-500 ease-in-out">
      {/* Ambient background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pb-24">
        {/* ========================================================================= */}
        {/* 1. HEADER & HERO: Title, Year, Summary & Full-Width Parallax Hero Asset   */}
        {/* ========================================================================= */}
        <section className="mb-14 sm:mb-20">
          <ProjectHeader project={project} />

          {/* Visual Project Progress Tracker / Timeline */}
          {project.progressTracker && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mb-10 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-cyan-500/5"
            >
              {/* Top tracker bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-slate-100 uppercase">
                      {project.progressTracker.title || "Project Progression Timeline"}
                    </h2>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Vehicle research, aerodynamic analysis & flight testing roadmap
                    </p>
                  </div>
                </div>

                {/* Current Stage Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-300 shrink-0 self-start sm:self-auto shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span>{project.progressTracker.currentStepLabel}</span>
                </div>
              </div>

              {/* Progress Bar Track (Segmented Lifecycle Rail) */}
              <div className="mb-6 space-y-2">
                <div className="grid grid-cols-4 gap-2.5 h-1.5">
                  {/* Phase 1 Completed */}
                  <div className="h-full rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30" />
                  {/* Phase 2 Active Pulse */}
                  <div className="relative h-full rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse" />
                  {/* Phase 3 Upcoming */}
                  <div className="h-full rounded-full bg-slate-200 dark:bg-slate-800" />
                  {/* Phase 4 Upcoming */}
                  <div className="h-full rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>

              {/* 4 Clean Phase Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                {project.progressTracker.steps.map((st, sIdx) => {
                  const isCompleted = st.status === "completed";
                  const isCurrent = st.status === "current";

                  return (
                    <div
                      key={sIdx}
                      className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl transition-all duration-300 h-full ${
                        isCurrent
                          ? "bg-cyan-50/70 dark:bg-cyan-950/30 border-2 border-cyan-500 dark:border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                          : isCompleted
                          ? "bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/90 shadow-sm"
                          : "bg-slate-50/40 dark:bg-slate-900/25 border border-slate-200/60 dark:border-slate-800/50 opacity-70"
                      }`}
                    >
                      <div>
                        {/* Top Indicator Row */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-xs font-mono font-bold tracking-wider ${
                              isCurrent
                                ? "text-cyan-700 dark:text-cyan-300"
                                : isCompleted
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            PHASE {st.step}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${
                              isCompleted
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                                : isCurrent
                                ? "bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200 border-cyan-400/60 shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>COMPLETED</span>
                              </>
                            ) : isCurrent ? (
                              <>
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                                </span>
                                <span>CURRENT STAGE</span>
                              </>
                            ) : (
                              <span>{st.badge || "UPCOMING"}</span>
                            )}
                          </span>
                        </div>

                        {/* Step Title */}
                        <h3
                          className={`text-sm font-bold font-mono tracking-tight mb-2 ${
                            isCurrent
                              ? "text-cyan-900 dark:text-cyan-100"
                              : isCompleted
                              ? "text-slate-900 dark:text-slate-100"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {st.title}
                        </h3>

                        {/* Step Description */}
                        {st.shortDesc && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                            {st.shortDesc}
                          </p>
                        )}
                      </div>

                      {/* Card Bottom Progress Bar Accent */}
                      <div className="pt-4 mt-auto">
                        <div
                          className={`h-1 w-full rounded-full ${
                            isCompleted
                              ? "bg-emerald-500"
                              : isCurrent
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse"
                              : "bg-slate-200 dark:bg-slate-800"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ONE Massive Full-Width Hero Asset with Parallax Scroll */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative w-full aspect-[21/9] min-h-[360px] sm:min-h-[460px] lg:min-h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between group"
          >
            {/* Top HUD Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-100/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-cyan-700 dark:text-cyan-400 z-20 shrink-0">
              <div className="flex items-center gap-2 font-semibold tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span>
                  {project.heroAsset.type === "3d"
                    ? "// INTERACTIVE 3D CAD MODEL"
                    : project.heroAsset.type === "video"
                    ? "// TELEMETRY & FLIGHT DYNAMICS"
                    : "// VEHICLE & SYSTEM ARCHITECTURE"}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                ASPECT 21:9 · REAL-TIME VIEWPORT
              </span>
            </div>

            {/* Parallax Media Stage */}
            <motion.div
              style={{ scale: heroScale, opacity: heroOpacity }}
              className="relative w-full h-full flex-1 bg-slate-950 flex items-center justify-center overflow-hidden"
            >
              {project.heroAsset.type === "3d" ? (
                <div className="w-full h-full min-h-[300px]">
                  <ModelViewer3D
                    src={project.heroAsset.src}
                    alt={project.heroAsset.caption || project.title}
                    hudLabel={project.heroAsset.caption?.toUpperCase()}
                    height="100%"
                  />
                </div>
              ) : project.heroAsset.type === "video" ? (
                <video
                  src={getAssetPath(project.heroAsset.src)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <img
                  src={getAssetPath(project.heroAsset.src)}
                  alt={project.heroAsset.caption || project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}
            </motion.div>

            {/* Bottom Caption Overlay */}
            {project.heroAsset.caption && project.heroAsset.type !== "3d" && (
              <div className="p-3.5 sm:p-4 bg-slate-100/90 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{project.heroAsset.caption}</span>
              </div>
            )}
          </motion.div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SPLIT LAYOUT: ENGINEERING BREAKDOWN (LEFT) & STICKY TECH DATA (RIGHT)  */}
        {/* ========================================================================= */}
        <div className="max-w-7xl mx-auto w-full px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Engineering Breakdown (Milestone Cards) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-6">
            {project.breakdownTitle && (
              <h3 className="font-mono uppercase text-cyan-700 dark:text-cyan-400 font-bold mb-4 text-base sm:text-lg tracking-wider">
                {project.breakdownTitle}
              </h3>
            )}
            {((project.engineeringBreakdown && project.engineeringBreakdown.length > 0) ||
              (project.breakdownItems && project.breakdownItems.length > 0)) &&
              (project.engineeringBreakdown || project.breakdownItems)!.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="relative p-[1.5px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-cyan-500/50 via-sky-500/30 to-slate-200 dark:to-slate-800/60 hover:from-cyan-400 hover:via-sky-400 hover:to-slate-300 dark:hover:to-slate-700 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-cyan-500/10 group"
                >
                  <div className="w-full h-full p-6 rounded-[calc(1rem-1.5px)] sm:rounded-[calc(1.5rem-1.5px)] bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-transparent">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-slate-900 dark:text-slate-100 font-mono font-bold uppercase tracking-wider text-sm sm:text-base group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h4>
                      <span
                        className={`text-xs px-2.5 py-1 border uppercase rounded-full font-mono font-semibold shrink-0 ${
                          item.role === "LED"
                            ? "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800"
                            : "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800"
                        }`}
                      >
                        {item.role}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Right Column: Sticky Technical Data Cards (Static stacked on mobile, sticky on desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Card 1: Key Technical Specifications (Telemetry Instrumentation Tiles) */}
            {(project.specs || project.quickStats) && (project.specs || project.quickStats).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45 }}
                className="p-6 sm:p-7 rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-5 pb-3.5 border-b border-slate-200 dark:border-slate-800/60">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      Key Technical Specifications
                    </h3>
                  </div>

                  {/* Clean Vertical Stack Without Inner Boxes */}
                  <div className="flex flex-col space-y-5">
                    {(project.specs || project.quickStats).map((stat, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-mono break-words">
                          {stat.label}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-mono break-words">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/60">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    CURRENT STATUS
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/50 text-xs font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-widest whitespace-nowrap shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></div>
                    {project.statusBadge}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Card 2: Engineering Stack, Categorized Tools & CTAs (Purple Accent) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="p-6 sm:p-7 rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-sky-500/50 dark:hover:border-sky-400/50 hover:shadow-sky-500/10 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-5 pb-3.5 border-b border-slate-200 dark:border-slate-800/60">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Engineering Stack & Tools
                  </h3>
                </div>

                {/* Refined Categorical Tool Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tool) => {
                    const lower = tool.toLowerCase();
                    const isSim =
                      lower.includes("ansys") ||
                      lower.includes("cfd") ||
                      lower.includes("xflr") ||
                      lower.includes("avl") ||
                      lower.includes("fea") ||
                      lower.includes("fluent") ||
                      lower.includes("matlab") ||
                      lower.includes("simul") ||
                      lower.includes("python") ||
                      lower.includes("openfoam");
                    const isMfg =
                      lower.includes("print") ||
                      lower.includes("additive") ||
                      lower.includes("composite") ||
                      lower.includes("layup") ||
                      lower.includes("cnc") ||
                      lower.includes("machin") ||
                      lower.includes("avionics") ||
                      lower.includes("telemetry") ||
                      lower.includes("hardware");

                    const badgeStyle = isSim
                      ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/50 hover:border-sky-400/60 hover:bg-sky-100/60 dark:hover:bg-sky-900/50"
                      : isMfg
                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 hover:border-amber-400/60 hover:bg-amber-100/60 dark:hover:bg-amber-900/50"
                      : "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50 hover:border-cyan-400/60 hover:bg-cyan-100/60 dark:hover:bg-cyan-900/50";

                    return (
                      <span
                        key={tool}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all hover:scale-[1.02] whitespace-normal break-words ${badgeStyle}`}
                      >
                        {tool}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action CTAs */}
              <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800/60 mt-auto">
                {project.externalUrl ? (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-mono font-semibold text-white bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-500 shadow-md shadow-cyan-600/20 hover:shadow-sky-500/35 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>{project.externalLabel || "Visit External Project"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href={getAssetPath(portfolioData.personal.cvUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-mono font-semibold text-white bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-500 shadow-md shadow-cyan-600/20 hover:shadow-sky-500/35 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>View Full Technical CV</span>
                    <FileText className="w-4 h-4" />
                  </a>
                )}

                <Link
                  href="/#contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/80 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/50 border border-slate-200 dark:border-slate-800 transition-all text-center"
                >
                  <span>Contact Regarding This Project</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. TEST CFD RESULTS SECTION                                               */}
        {/* ========================================================================= */}
        {project.cfdResults && (
          <section className="mb-20 sm:mb-28 space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-700 dark:text-cyan-400 uppercase mb-2">
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-4 h-4" />
                    <span>AERODYNAMIC FLOW SIMULATION // ANSYS FLUENT 2025 R1</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span>V∞ = 20 m/s</span>
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {project.cfdResults.title}
                </h2>
                {project.cfdResults.subtitle && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono mt-1">
                    {project.cfdResults.subtitle}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Test Airspeed:</span>
                  <span className="font-bold text-cyan-700 dark:text-cyan-400">20 m/s</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">(~72 km/h)</span>
                </div>
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                  Click any contour to inspect in cinematic lightbox
                </span>
              </div>
            </div>

            {/* Prominent Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/15 dark:from-amber-500/20 dark:via-amber-500/10 dark:to-orange-500/20 border-2 border-amber-500/40 dark:border-amber-400/50 shadow-md shadow-amber-500/10"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                    ENGINEERING RESEARCH DISCLAIMER
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-amber-950 dark:text-amber-100 leading-snug">
                    {project.cfdResults.disclaimer}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 4 CFD Results Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
              {project.cfdResults.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Header with HUD info - Fixed height to guarantee perfect alignment */}
                  <div className="h-11 flex items-center justify-between px-4 sm:px-5 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs font-mono z-10 shrink-0 gap-3">
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className="px-2.5 py-0.5 rounded-md font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 whitespace-nowrap shrink-0">
                        {item.aoa || "CFD SWEEP"}
                      </span>
                      {item.tag && (
                        <span className="text-slate-500 dark:text-slate-400 truncate text-xs">
                          · {item.tag}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                      V∞ = 20 m/s
                    </span>
                  </div>

                  {/* Image Display Container with Lightbox Trigger */}
                  <div
                    onClick={() => openCfdLightbox(idx)}
                    className="relative w-full aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer group/img"
                  >
                    <img
                      src={getAssetPath(item.src)}
                      alt={item.fileName}
                      loading="lazy"
                      className="w-full h-full object-contain p-2 group-hover/img:scale-[1.03] transition-transform duration-500 ease-out"
                    />

                    {/* Expand overlay button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCfdLightbox(idx);
                      }}
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Inspect high-resolution simulation in lightbox"
                      aria-label={`Expand ${item.fileName} in lightbox`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content & Description */}
                  <div className="p-4 sm:p-5 bg-white dark:bg-slate-950 flex flex-col justify-between flex-1">
                    <div className="mb-4">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h3 className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => openCfdLightbox(idx)}
                          className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-semibold shrink-0 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Expand</span>
                          <span>↗</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans min-h-[42px]">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mt-auto">
                      <span className="truncate">File: {item.fileName}</span>
                      <span className="text-cyan-700 dark:text-cyan-400 shrink-0 font-medium ml-2">High-Fidelity Contour</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 4. SINGLE MIXED-MEDIA MASONRY BENTO GRID (Images, Videos & 3D Models)    */}
        {/* ========================================================================= */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mb-20 sm:mb-28 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-700 dark:text-cyan-400 uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Technical Media Gallery ({project.gallery.length} Exhibits)</span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Click to expand in cinematic lightbox
              </span>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {project.gallery.map((media, idx) => {
                const is3D = media.type === "3d";
                const isVideo = media.type === "video";
                const colSpan = media.colSpan || "col-span-12 md:col-span-6";
                const isRowSpan = colSpan.includes("row-span");

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl group flex flex-col justify-between ${colSpan}`}
                  >
                    {/* Expand Button */}
                    <button
                      type="button"
                      onClick={() => openGalleryLightbox(idx)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Open in Cinematic Lightbox"
                      aria-label="Expand in full-screen lightbox"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Media Render Stage */}
                    <div
                      className={`relative w-full ${
                        isRowSpan
                          ? "h-full min-h-[380px] sm:min-h-[460px] flex-1"
                          : "aspect-video"
                      } bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden`}
                    >
                      {is3D ? (
                        <div className="w-full h-full min-h-[280px]">
                          <ModelViewer3D
                            src={media.src}
                            alt={media.caption}
                            hudLabel={media.caption.toUpperCase()}
                            height="100%"
                          />
                        </div>
                      ) : isVideo ? (
                        <div
                          onClick={() => openGalleryLightbox(idx)}
                          className="w-full h-full cursor-pointer relative group/vid overflow-hidden"
                        >
                          <video
                            src={getAssetPath(media.src)}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover object-center group-hover/vid:scale-105 transition-transform duration-500 ease-out"
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => openGalleryLightbox(idx)}
                          className="w-full h-full cursor-pointer relative group/img overflow-hidden flex items-center justify-center"
                        >
                          <img
                            src={getAssetPath(media.src)}
                            alt={media.caption}
                            loading="lazy"
                            className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500 ease-out"
                          />
                        </div>
                      )}
                    </div>

                    {/* Caption Bar */}
                    {!is3D && (
                      <div
                        onClick={() => openGalleryLightbox(idx)}
                        className="p-3 sm:p-4 bg-slate-100/90 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate font-semibold">{media.caption}</span>
                        <span className="text-xs text-cyan-700 dark:text-cyan-400 shrink-0 pl-2 font-semibold">
                          Expand ↗
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 5. BOTTOM PAGINATION: Prev & Next Projects                                */}
        {/* ========================================================================= */}
        <ProjectPager prevProject={prevProject} nextProject={nextProject} />
      </main>

      {/* ========================================================================= */}
      {/* 6. FULLSCREEN CINEMATIC LIGHTBOX MODAL                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeLightbox !== null && activeLightbox.items[activeLightbox.index] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Top Lightbox Bar */}
            <div className="flex items-center justify-between z-30 pb-4 border-b border-slate-800 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">{project.title}</span>
                <span className="text-slate-600 dark:text-slate-400">|</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {activeLightbox.items[activeLightbox.index].category || "Exhibit"} (
                  {activeLightbox.index + 1} of {activeLightbox.items.length})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveLightbox(null)}
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                aria-label="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5 text-slate-200 hover:text-white" />
              </button>
            </div>

            {/* Central Stage */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeLightbox.items[activeLightbox.index].type === "3d" ? (
                  <motion.div
                    key={`lb-3d-${activeLightbox.items[activeLightbox.index].src}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl h-[70vh] rounded-3xl overflow-hidden glass-card border border-cyan-500/30"
                  >
                    <ModelViewer3D
                      src={activeLightbox.items[activeLightbox.index].src}
                      alt={activeLightbox.items[activeLightbox.index].caption}
                      hudLabel={activeLightbox.items[activeLightbox.index].caption.toUpperCase()}
                      height="100%"
                    />
                  </motion.div>
                ) : activeLightbox.items[activeLightbox.index].type === "video" ? (
                  <motion.div
                    key={`lb-vid-${activeLightbox.items[activeLightbox.index].src}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-5xl max-h-[75vh] flex items-center justify-center"
                  >
                    <video
                      src={getAssetPath(activeLightbox.items[activeLightbox.index].src)}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`lb-img-${activeLightbox.items[activeLightbox.index].src}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-6xl max-h-[75vh] flex items-center justify-center p-2"
                  >
                    <img
                      src={getAssetPath(activeLightbox.items[activeLightbox.index].src)}
                      alt={activeLightbox.items[activeLightbox.index].caption}
                      className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prev / Next Buttons */}
              {activeLightbox.items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLightbox((prev) =>
                        prev
                          ? {
                              ...prev,
                              index:
                                (prev.index - 1 + prev.items.length) %
                                prev.items.length,
                            }
                          : null
                      );
                    }}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-105"
                    aria-label="Previous exhibit"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLightbox((prev) =>
                        prev
                          ? {
                              ...prev,
                              index: (prev.index + 1) % prev.items.length,
                            }
                          : null
                      );
                    }}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-105"
                    aria-label="Next exhibit"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Caption Bar */}
            <div className="pt-4 border-t border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 max-w-6xl mx-auto w-full">
              <div>
                <h4 className="text-sm sm:text-base font-bold font-mono text-slate-200">
                  {activeLightbox.items[activeLightbox.index].caption}
                </h4>
                {activeLightbox.items[activeLightbox.index].desc && (
                  <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-0.5">
                    {activeLightbox.items[activeLightbox.index].desc}
                  </p>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs shrink-0">
                {activeLightbox.items.map((g, gIdx) => (
                  <button
                    key={gIdx}
                    onClick={() =>
                      setActiveLightbox((prev) =>
                        prev ? { ...prev, index: gIdx } : null
                      )
                    }
                    className={`w-10 h-7 rounded border transition-all overflow-hidden ${
                      gIdx === activeLightbox.index
                        ? "border-cyan-400 scale-110"
                        : "border-slate-700 opacity-50 hover:opacity-100"
                    }`}
                  >
                    {g.type === "3d" ? (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-cyan-400 text-xs font-mono">
                        3D
                      </div>
                    ) : g.type === "video" ? (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-amber-400 text-xs font-mono">
                        VID
                      </div>
                    ) : (
                      <img
                        src={getAssetPath(g.src)}
                        alt={g.caption}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Animated Footer */}
      <AnimatedFooter />
    </div>
  );
}
