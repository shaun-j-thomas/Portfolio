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
} from "lucide-react";
import { ProjectData, ProjectMediaItem } from "@/data/projects";
import { portfolioData } from "@/data/portfolioData";
import { ModelViewer3D } from "./ModelViewer3D";
import { AnimatedFooter } from "./AnimatedFooter";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + project.gallery.length) % project.gallery.length : null
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % project.gallery.length : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, project.gallery.length]);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden pt-20 sm:pt-28 transition-colors duration-500 ease-in-out">
      {/* Ambient background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pb-24">
        {/* Top Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-500" />
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 1. HEADER & HERO: Title, Year, Summary & Full-Width Parallax Hero Asset   */}
        {/* ========================================================================= */}
        <section className="mb-14 sm:mb-20">
          {/* Header Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 sm:mb-10 max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                {project.category} · {project.year}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                {project.statusBadge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-3">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium mb-4 font-mono">
              {project.subtitle}
            </p>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
              {project.summary}
            </p>
          </motion.div>

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
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
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
                  src={project.heroAsset.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <img
                  src={project.heroAsset.src}
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
              <h3 className="font-mono uppercase text-cyan-600 dark:text-cyan-400 font-bold mb-4 text-base sm:text-lg tracking-wider">
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
                  className="relative p-[1.5px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-cyan-500/50 via-purple-500/30 to-slate-200 dark:to-slate-800/60 hover:from-cyan-400 hover:via-purple-400 hover:to-slate-300 dark:hover:to-slate-700 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-cyan-500/10 group"
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
                            : "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
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
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
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
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-mono break-words">
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
                  <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    CURRENT STATUS
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/50 text-[10px] font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-widest whitespace-nowrap shrink-0">
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
              className="p-6 sm:p-7 rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-purple-500/50 dark:hover:border-purple-400/50 hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-5 pb-3.5 border-b border-slate-200 dark:border-slate-800/60">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
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
                      ? "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50 hover:border-purple-400/60 hover:bg-purple-100/60 dark:hover:bg-purple-900/50"
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
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-mono font-semibold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-md shadow-cyan-600/20 hover:shadow-purple-500/35 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>{project.externalLabel || "Visit External Project"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href={portfolioData.personal.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-mono font-semibold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-md shadow-cyan-600/20 hover:shadow-purple-500/35 transition-all transform hover:-translate-y-0.5"
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
        {/* 3. SINGLE MIXED-MEDIA MASONRY BENTO GRID (Images, Videos & 3D Models)    */}
        {/* ========================================================================= */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mb-20 sm:mb-28 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Technical Media Gallery ({project.gallery.length} Exhibits)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
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
                      onClick={() => setLightboxIndex(idx)}
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
                          onClick={() => setLightboxIndex(idx)}
                          className="w-full h-full cursor-pointer relative group/vid overflow-hidden"
                        >
                          <video
                            src={media.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover object-center group-hover/vid:scale-105 transition-transform duration-500 ease-out"
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => setLightboxIndex(idx)}
                          className="w-full h-full cursor-pointer relative group/img overflow-hidden flex items-center justify-center"
                        >
                          <img
                            src={media.src}
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
                        onClick={() => setLightboxIndex(idx)}
                        className="p-3 sm:p-4 bg-slate-100/90 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate font-semibold">{media.caption}</span>
                        <span className="text-[11px] text-cyan-600 dark:text-cyan-400 shrink-0 pl-2 font-semibold">
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
        {/* 4. BOTTOM PAGINATION: Prev & Next Projects                                */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sm:text-sm">
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

      {/* ========================================================================= */}
      {/* 5. FULLSCREEN CINEMATIC LIGHTBOX MODAL                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {lightboxIndex !== null && project.gallery && project.gallery[lightboxIndex] && (
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
                <span className="text-slate-600 dark:text-slate-500">|</span>
                <span className="text-slate-400">
                  Exhibit {lightboxIndex + 1} of {project.gallery.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                aria-label="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5 text-slate-200 hover:text-white" />
              </button>
            </div>

            {/* Central Stage */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <AnimatePresence mode="wait">
                {project.gallery[lightboxIndex].type === "3d" ? (
                  <motion.div
                    key={`lb-3d-${project.gallery[lightboxIndex].src}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl h-[70vh] rounded-3xl overflow-hidden glass-card border border-cyan-500/30"
                  >
                    <ModelViewer3D
                      src={project.gallery[lightboxIndex].src}
                      alt={project.gallery[lightboxIndex].caption}
                      hudLabel={project.gallery[lightboxIndex].caption.toUpperCase()}
                      height="100%"
                    />
                  </motion.div>
                ) : project.gallery[lightboxIndex].type === "video" ? (
                  <motion.div
                    key={`lb-vid-${project.gallery[lightboxIndex].src}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-5xl max-h-[75vh] flex items-center justify-center"
                  >
                    <video
                      src={project.gallery[lightboxIndex].src}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`lb-img-${project.gallery[lightboxIndex].src}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-6xl max-h-[75vh] flex items-center justify-center p-2"
                  >
                    <img
                      src={project.gallery[lightboxIndex].src}
                      alt={project.gallery[lightboxIndex].caption}
                      className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prev / Next Buttons */}
              {project.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(
                        (prev) => (prev! - 1 + project.gallery.length) % project.gallery.length
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
                      setLightboxIndex((prev) => (prev! + 1) % project.gallery.length);
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
                  {project.gallery[lightboxIndex].caption}
                </h4>
                {project.gallery[lightboxIndex].desc && (
                  <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-0.5">
                    {project.gallery[lightboxIndex].desc}
                  </p>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs shrink-0">
                {project.gallery.map((g, gIdx) => (
                  <button
                    key={gIdx}
                    onClick={() => setLightboxIndex(gIdx)}
                    className={`w-10 h-7 rounded border transition-all overflow-hidden ${
                      gIdx === lightboxIndex
                        ? "border-cyan-400 scale-110"
                        : "border-slate-700 opacity-50 hover:opacity-100"
                    }`}
                  >
                    {g.type === "3d" ? (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-cyan-400 text-[8px] font-mono">
                        3D
                      </div>
                    ) : g.type === "video" ? (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-amber-400 text-[8px] font-mono">
                        VID
                      </div>
                    ) : (
                      <img
                        src={g.src}
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
