"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, ArrowRight } from "lucide-react";
import { projectsData, ProjectData } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative py-20 sm:py-28 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20 overflow-hidden transition-colors duration-500 ease-in-out"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
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
          Featured Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mt-3 font-normal"
        >
          Explore engineering case studies across aerodynamic research, supersonic rocketry, and precision CAD design.
        </motion.p>
      </div>

      {/* Minimal Project Preview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch">
        {projectsData.map((project: ProjectData, index: number) => {
          const badgeColor =
            index === 0
              ? "text-cyan-600 dark:text-cyan-400"
              : index === 1
              ? "text-purple-600 dark:text-purple-400"
              : "text-amber-600 dark:text-amber-400";

          return (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="flex"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden glass-card glass-card-hover border border-slate-200/90 dark:border-slate-800/80 p-5 sm:p-6 flex flex-col justify-between group cursor-pointer transition-all duration-500 group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)] hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]"
              >
                <div>
                  {/* Thumbnail Image with Fixed Aspect Ratio & Subtle Hover Zoom */}
                  <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 mb-4 sm:mb-5">
                    <img
                      src={project.heroAsset.poster || project.heroAsset.src}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  </div>

                  {/* Category & Status */}
                  <div className={`flex items-center justify-between text-[11px] font-mono mb-2 ${badgeColor}`}>
                    <span className="uppercase font-semibold tracking-wider truncate">
                      {project.category}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-base sm:text-lg font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>

                  {/* One-Sentence Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-4 sm:pt-5 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                  <span>More Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
