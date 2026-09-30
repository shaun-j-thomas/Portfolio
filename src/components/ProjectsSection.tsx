"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, ArrowRight, RotateCw, LayoutGrid } from "lucide-react";
import { getAssetPath } from "@/lib/utils";
import { projectsData, ProjectData } from "@/data/projects";
import { TurntableCarousel } from "./TurntableCarousel";

export function ProjectsSection() {
  const [viewMode, setViewMode] = useState<"turntable" | "grid">("turntable");

  return (
    <section
      id="projects"
      className="relative py-20 sm:py-28 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20 overflow-hidden transition-colors duration-500 ease-in-out"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[700px] h-96 sm:h-[700px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 mb-3"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>04 // FEATURED ENGINEERING WORK</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-slate-100 dark:via-slate-200 dark:to-slate-400"
        >
          Featured Engineering Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mt-3 font-normal"
        >
          Explore interactive case studies across high-speed automotive CFD, UAV stability optimization, supersonic rocketry, and precision CAD design.
        </motion.p>

        {/* View Mode Switcher Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mt-6 inline-flex items-center p-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-mono"
        >
          <button
            type="button"
            onClick={() => setViewMode("turntable")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
              viewMode === "turntable"
                ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>3D Turntable</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid View</span>
          </button>
        </motion.div>
      </div>

      {/* Main Content Area */}
      {viewMode === "turntable" ? (
        <TurntableCarousel projects={projectsData} />
      ) : (
        /* Minimal Project Preview Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          {projectsData.map((project: ProjectData, index: number) => {
            const badgeColor =
              index === 0
                ? "text-cyan-600 dark:text-cyan-400"
                : index === 1
                ? "text-purple-600 dark:text-purple-400"
                : index === 2
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400";

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="flex"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden glass-card glass-card-hover border border-slate-200/90 dark:border-slate-800/80 p-5 sm:p-6 flex flex-col justify-between group cursor-pointer transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)]"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 mb-4 sm:mb-5">
                      <img
                        src={getAssetPath(
                          project.heroAsset.poster || project.heroAsset.src
                        )}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                    </div>

                    {/* Category & Year */}
                    <div
                      className={`flex items-center justify-between text-[11px] font-mono mb-2 ${badgeColor}`}
                    >
                      <span className="uppercase font-semibold tracking-wider truncate">
                        {project.category}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {project.year}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-base font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {project.title}
                    </h3>

                    {/* One-Sentence Summary */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  {/* Bottom Action CTA */}
                  <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                    <span>Explore Study</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

