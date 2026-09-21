"use client";

import { motion } from "framer-motion";
import {
  Box,
  Activity,
  Hammer,
  Users,
  Award,
  ExternalLink,
  DraftingCompass,
  Layers,
  Maximize2,
  Cpu,
  Wind,
  BarChart3,
  LineChart,
  Binary,
  Terminal,
  Printer,
  Sparkles,
  Cog,
  Wrench,
  ShieldCheck,
  Network,
  Search,
} from "lucide-react";
import { portfolioData, SkillCategory, SkillItem } from "@/data/portfolioData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Box,
  Activity,
  Hammer,
  Users,
  Award,
  DraftingCompass,
  Layers,
  Maximize2,
  Cpu,
  Wind,
  BarChart3,
  LineChart,
  Binary,
  Terminal,
  Printer,
  Sparkles,
  Cog,
  Wrench,
  ShieldCheck,
  Network,
  Search,
};

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Box,
  Activity,
  Hammer,
  Users,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function SkillsSection() {
  const { skillsCategories, certifications } = portfolioData;

  return (
    <section
      id="skills"
      className="relative py-20 sm:py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20 overflow-hidden transition-colors duration-500 ease-in-out"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 mb-3"
        >
          <span>02 // CAPABILITIES & TOOLS</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-slate-100 dark:via-slate-200 dark:to-slate-400"
        >
          Skills & Technologies
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mt-3 font-normal"
        >
          Applied design, aerodynamic simulation, and precision manufacturing capabilities.
        </motion.p>
      </div>

      {/* Symmetrical 2-Column (Desktop) / 1-Column (Mobile) Category Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
      >
        {skillsCategories.map((category: SkillCategory, catIdx: number) => {
          const CatIcon = categoryIconMap[category.categoryIcon] || Box;

          // Distinct accent colors for each category card
          const isSim = category.title.toLowerCase().includes("simulation") || category.title.toLowerCase().includes("analysis");
          const isMfg = category.title.toLowerCase().includes("fabrication") || category.title.toLowerCase().includes("manufacturing");
          const isLead = category.title.toLowerCase().includes("leadership") || category.title.toLowerCase().includes("systems");

          const catColor = isSim
            ? {
                iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
                badge: "dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800/50 bg-purple-500/10 text-purple-700 border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-500/20 dark:hover:bg-purple-900/40",
                iconText: "text-purple-600 dark:text-purple-400",
              }
            : isMfg
            ? {
                iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
                badge: "dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50 bg-amber-500/10 text-amber-700 border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-500/20 dark:hover:bg-amber-900/40",
                iconText: "text-amber-600 dark:text-amber-400",
              }
            : isLead
            ? {
                iconBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
                badge: "dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800/50 bg-indigo-500/10 text-indigo-700 border-indigo-500/30 hover:border-indigo-400/60 hover:bg-indigo-500/20 dark:hover:bg-indigo-900/40",
                iconText: "text-indigo-600 dark:text-indigo-400",
              }
            : {
                iconBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400",
                badge: "dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800/50 bg-cyan-500/10 text-cyan-700 border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/20 dark:hover:bg-cyan-900/40",
                iconText: "text-cyan-600 dark:text-cyan-400",
              };

          return (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="p-5 sm:p-6 rounded-3xl overflow-hidden glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col h-full hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-md"
            >
              {/* Category Heading & Divider */}
              <div className="flex items-center gap-3 pb-3.5 mb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${catColor.iconBg}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {category.title}
                </h3>
              </div>

              {/* Wrapped Categorical Skill Badges */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3 content-start flex-grow">
                {category.skills.map((skill: SkillItem) => {
                  const SkillIcon = iconMap[skill.iconName] || Box;

                  return (
                    <div
                      key={skill.name}
                      className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans font-medium border transition-all duration-200 shadow-sm cursor-default select-none hover:scale-[1.03] ${catColor.badge}`}
                    >
                      <SkillIcon className={`w-4 h-4 ${catColor.iconText} group-hover:scale-110 transition-transform shrink-0`} />
                      <span>{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Verified Certification Footer Pill */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.45 }}
        className="mt-8 sm:mt-10 max-w-5xl mx-auto flex justify-center"
      >
        <a
          href={certifications[0]?.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card border border-amber-500/30 dark:border-amber-500/25 bg-amber-500/[0.03] hover:bg-amber-500/[0.08] hover:border-amber-500/50 hover:scale-[1.02] transition-all duration-200 shadow-sm text-xs sm:text-sm font-sans"
        >
          <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <Award className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <span className="font-semibold text-slate-900 dark:text-white">
              {certifications[0]?.title}
            </span>
            <span className="text-slate-400 hidden sm:inline">· {certifications[0]?.issuer}</span>
          </div>
          <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 group-hover:underline ml-1">
            <span>Verify Credly</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      </motion.div>
    </section>
  );
}
