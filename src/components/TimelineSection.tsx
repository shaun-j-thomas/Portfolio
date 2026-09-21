"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Rocket,
} from "lucide-react";
import { portfolioData, TimelineItem } from "@/data/portfolioData";

export function TimelineSection() {
  const { timeline } = portfolioData;

  const getTypeIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "education":
        return GraduationCap;
      case "experience":
        return Rocket;
      case "project":
        return Briefcase;
      default:
        return Rocket;
    }
  };

  return (
    <section
      id="journey"
      className="relative py-20 sm:py-24 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-20 overflow-hidden transition-colors duration-500 ease-in-out"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 mb-3"
        >
          <span>03 // CHRONOLOGICAL PATH</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-slate-100 dark:via-slate-200 dark:to-slate-400"
        >
          Experience & Education
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mt-3 font-normal"
        >
          A continuous track record of structural design, team leadership, and empirical aerospace
          validation from Chennai to Strathclyde.
        </motion.p>
      </div>

      {/* Vertical Timeline Structure */}
      <div className="relative pl-7 sm:pl-10">
        {/* Continuous Connecting Multi-Color CFD Gradient Line on the Left */}
        <div className="absolute left-3 sm:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-amber-500" />

        <div className="space-y-8 sm:space-y-12">
          {timeline.map((item: TimelineItem, index: number) => {
            const Icon = getTypeIcon(item.type);

            return (
              <motion.div
                key={index}
                initial={{ x: -35, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative group z-10 hover:z-20"
              >
                {/* Circular Glowing Node on the left line */}
                <div className="absolute -left-7 sm:-left-10 top-1.5 flex items-center justify-center">
                  <div className="relative flex items-center justify-center w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-cyan-500 dark:border-cyan-400 shadow-md shadow-cyan-500/30 group-hover:scale-125 group-hover:border-purple-400 transition-all duration-300">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 group-hover:bg-purple-400 transition-colors" />
                  </div>
                </div>

                {/* Timeline Content Card */}
                <div className="p-6 sm:p-8 rounded-3xl overflow-hidden glass-card glass-card-hover border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 dark:hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                  {/* Top Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.period}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase">
                        // {item.type}
                      </span>
                    </div>

                    {item.location && (
                      <div className="flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Organization Header */}
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg md:text-xl font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-1">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>{item.organization}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {item.roleOrDegree}
                      </span>
                      {item.badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description Paragraph */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Bulleted Achievements */}
                  {item.achievements && item.achievements.length > 0 && (
                    <div className="space-y-2 mb-5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      <div className="text-[11px] sm:text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Key Milestones & Engineering Impact
                      </div>
                      {item.achievements.map((ach, aIdx) => (
                        <div key={aIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technology & Capability Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/60">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
