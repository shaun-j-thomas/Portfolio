"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  RotateCw,
  Layers,
  Sparkles,
  Compass,
  ExternalLink,
  Eye,
} from "lucide-react";
import { getAssetPath } from "@/lib/utils";
import { ProjectData } from "@/data/projects";

interface TurntableCarouselProps {
  projects: ProjectData[];
}

export function TurntableCarousel({ projects }: TurntableCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, projects.findIndex((p) => p.slug === "bwb-uav"))
  );
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const totalProjects = projects.length;

  const rotateNext = useCallback(() => {
    setDirection("right");
    setActiveIndex((prev) => (prev + 1) % totalProjects);
  }, [totalProjects]);

  const rotatePrev = useCallback(() => {
    setDirection("left");
    setActiveIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  const goToIndex = useCallback(
    (index: number) => {
      setDirection(index > activeIndex ? "right" : "left");
      setActiveIndex(index);
    },
    [activeIndex]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") rotatePrev();
      if (e.key === "ArrowRight") rotateNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rotateNext, rotatePrev]);

  // Handle Drag/Touch for smooth turntable scrubbing
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const diff = e.changedTouches[0].clientX - dragStartX;
    if (diff > 50) rotatePrev();
    else if (diff < -50) rotateNext();
    setDragStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    if (diff > 60) rotatePrev();
    else if (diff < -60) rotateNext();
    setDragStartX(null);
  };

  // Helper to calculate circular distance and 3D transform props
  const getCardTransform = (index: number) => {
    // Calculate circular delta relative to active index
    let offset = (index - activeIndex) % totalProjects;
    if (offset > totalProjects / 2) offset -= totalProjects;
    if (offset < -totalProjects / 2) offset += totalProjects;

    const isActive = offset === 0;
    const isPrev = offset === -1;
    const isNext = offset === 1;
    const isFarLeft = offset <= -2;
    const isFarRight = offset >= 2;

    // Responsive offsets based on screen width approximations
    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 10;
    let filter = "blur(0px)";

    if (isActive) {
      translateX = 0;
      translateZ = 60;
      rotateY = 0;
      scale = 1.04;
      opacity = 1;
      zIndex = 40;
      filter = "blur(0px)";
    } else if (isPrev) {
      translateX = -340;
      translateZ = -90;
      rotateY = 28;
      scale = 0.86;
      opacity = 0.75;
      zIndex = 30;
      filter = "blur(1px)";
    } else if (isNext) {
      translateX = 340;
      translateZ = -90;
      rotateY = -28;
      scale = 0.86;
      opacity = 0.75;
      zIndex = 30;
      filter = "blur(1px)";
    } else if (isFarLeft) {
      translateX = -560;
      translateZ = -220;
      rotateY = 46;
      scale = 0.7;
      opacity = 0.25;
      zIndex = 10;
      filter = "blur(3px)";
    } else if (isFarRight) {
      translateX = 560;
      translateZ = -220;
      rotateY = -46;
      scale = 0.7;
      opacity = 0.25;
      zIndex = 10;
      filter = "blur(3px)";
    }

    return {
      offset,
      isActive,
      isPrev,
      isNext,
      translateX,
      translateZ,
      rotateY,
      scale,
      opacity,
      zIndex,
      filter,
    };
  };

  const activeProject = projects[activeIndex];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-6xl mx-auto flex flex-col items-center select-none"
    >
      {/* HUD Top Control Bar */}
      <div className="w-full flex items-center justify-between px-4 sm:px-6 mb-6 text-xs font-mono text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            TURNTABLE ROTOR: 3D CYLINDRICAL STAGE
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-slate-500">
            USE ARROWS OR CLICK SIDES TO ROTATE
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-xs text-cyan-700 dark:text-cyan-400 font-bold">
            {activeIndex + 1} / {totalProjects}
          </span>
        </div>
      </div>

      {/* 3D Turntable Stage Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[520px] sm:h-[560px] md:h-[590px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden sm:overflow-visible"
        style={{ perspective: "1200px" }}
      >
        {/* Virtual Rotating Circular Base Pedestal */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[220px] rounded-[50%] bg-gradient-to-t from-cyan-500/10 via-sky-500/5 to-transparent border border-cyan-500/20 dark:border-cyan-400/20 blur-md pointer-events-none transform -rotate-x-70" />

        {/* Ambient Ring Grid */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[160px] rounded-[50%] border-2 border-dashed border-cyan-500/30 dark:border-cyan-400/30 pointer-events-none opacity-60" />

        {/* Cards Rendered in 3D Space */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {projects.map((project, index) => {
            const transform = getCardTransform(index);

            // Single accent colour for all projects
            const badgeColor =
              "text-cyan-700 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10";

            return (
              <motion.div
                key={project.slug}
                animate={{
                  x: transform.translateX,
                  z: transform.translateZ,
                  rotateY: transform.rotateY,
                  scale: transform.scale,
                  opacity: transform.opacity,
                  filter: transform.filter,
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 26,
                  mass: 0.8,
                }}
                style={{
                  zIndex: transform.zIndex,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (transform.isActive) {
                    router.push(`/projects/${project.slug}`);
                  } else {
                    goToIndex(index);
                  }
                }}
                className={`absolute w-[300px] sm:w-[350px] md:w-[390px] h-[460px] sm:h-[490px] md:h-[520px] rounded-3xl p-5 sm:p-6 glass-card flex flex-col justify-between cursor-pointer transition-shadow duration-500 ${
                  transform.isActive
                    ? "ring-2 ring-cyan-500/70 dark:ring-cyan-400/80 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.35)] dark:shadow-[0_20px_60px_-15px_rgba(0,216,246,0.3)] bg-white/95 dark:bg-slate-900/90"
                    : "border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500/40 bg-white/80 dark:bg-slate-900/70"
                }`}
              >
                <div>
                  {/* Top Thumbnail with Tech Holographic Edge */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 mb-4 sm:mb-5 group/thumb shadow-inner">
                    <img
                      src={getAssetPath(
                        project.heroAsset.poster || project.heroAsset.src
                      )}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-bottom transition-transform duration-700 ease-out group-hover/thumb:scale-105"
                    />

                    {/* Laser Scan Line Overlay on Active Center Card */}
                    {transform.isActive && (
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
                    )}

                    {/* 3D / Type Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1">
                      {project.cardLabel ? (
                        <>
                          <Compass className="w-3 h-3 text-cyan-400" />
                          <span>{project.cardLabel}</span>
                        </>
                      ) : project.heroAsset.type === "3d" ? (
                        <>
                          <Layers className="w-3 h-3 text-cyan-400" />
                          <span>3D CAD</span>
                        </>
                      ) : (
                        <>
                          <Compass className="w-3 h-3 text-cyan-400" />
                          <span>SIMULATION</span>
                        </>
                      )}
                    </div>
                    </div>

                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border truncate min-w-0 ${badgeColor}`}
                      >
                        {project.category}
                      </span>
                      {project.statusBadge === "Under revision" && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 shrink-0">
                          Under revision
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                      {project.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-mono font-bold text-slate-900 dark:text-white uppercase tracking-tight line-clamp-2 mb-2 group-hover:text-cyan-500 transition-colors">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-sans">
                    {project.summary}
                  </p>
                </div>

                {/* Card Bottom CTA Link */}
                <div className="pt-3 sm:pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                      {project.quickStats && project.quickStats.length > 0
                        ? project.quickStats[0].label
                        : "STATUS"}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold truncate ${
                        project.statusBadge === "Under revision"
                          ? "text-amber-700 dark:text-amber-400"
                          : "text-cyan-700 dark:text-cyan-400"
                      }`}
                    >
                      {project.quickStats && project.quickStats.length > 0
                        ? project.quickStats[0].value
                        : (project.statusBadge || "Active")}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wide transition-all ${
                      transform.isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 hover:scale-105"
                        : "text-slate-600 dark:text-slate-400 hover:text-cyan-500"
                    }`}
                  >
                    <span>{transform.isActive ? "Explore" : "Select"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Left Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            rotatePrev();
          }}
          aria-label="Previous project in turntable"
          className="absolute left-2 sm:left-6 z-50 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-cyan-500 dark:hover:bg-cyan-500 text-slate-800 dark:text-slate-100 hover:text-white border border-slate-300 dark:border-slate-700 hover:border-cyan-400 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group/arrow"
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover/arrow:-translate-x-0.5" />
        </button>

        {/* Right Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            rotateNext();
          }}
          aria-label="Next project in turntable"
          className="absolute right-2 sm:right-6 z-50 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-cyan-500 dark:hover:bg-cyan-500 text-slate-800 dark:text-slate-100 hover:text-white border border-slate-300 dark:border-slate-700 hover:border-cyan-400 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group/arrow"
        >
          <ChevronRight className="w-6 h-6 transition-transform group-hover/arrow:translate-x-0.5" />
        </button>
      </div>

      {/* Bottom Turntable Pagination & Quick Select */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl px-4 mt-6 gap-4">
        {/* Step Indicator Pills */}
        <div className="flex items-center gap-2">
          {projects.map((p, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => goToIndex(idx)}
                className={`relative transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-8 sm:w-10 h-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md shadow-cyan-500/40"
                    : "w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                }`}
                aria-label={`Go to ${p.title}`}
              />
            );
          })}
        </div>

        {/* Active Project Direct Route Button */}
        <Link
          href={`/projects/${activeProject.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-500 text-white font-mono text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-sky-500/30 transition-all transform hover:-translate-y-0.5"
        >
          <span>Read more</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
