"use client";

import { motion } from "framer-motion";
import { ArrowUp, Linkedin, Mail, FileText } from "lucide-react";
import { portfolioData } from "@/data/portfolioData";
import { getAssetPath } from "@/lib/utils";

export function AnimatedFooter() {
  const { personal } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative pt-16 sm:pt-20 pb-8 px-4 md:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/70 overflow-hidden transition-colors duration-500 ease-in-out text-sm text-slate-500 dark:text-slate-400">
      {/* Background radial gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-t-[100px] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Navigation & Back to Top Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 pb-8 sm:pb-12 border-b border-slate-200/60 dark:border-slate-800/60">
          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-mono text-sm text-slate-600 dark:text-slate-400">
            <a href="/#about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              // 01. ABOUT
            </a>
            <a href="/#skills" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              // 02. SKILLS
            </a>
            <a href="/#journey" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              // 03. JOURNEY
            </a>
            <a href="/#projects" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              // 04. PROJECTS
            </a>
            <a href="/#contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              // 05. CONTACT
            </a>
          </div>

          {/* Social Links & Back To Top */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-full glass-card hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="LinkedIn"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${personal.email}`}
              className="p-2 sm:p-2.5 rounded-full glass-card hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Email"
              title={personal.email}
            >
              <Mail className="w-4 h-4" />
            </a>

            <a
              href={getAssetPath(personal.cvUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-full glass-card hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="View CV"
              title="View CV (PDF)"
            >
              <FileText className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card hover:bg-cyan-500/15 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/50 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-700 dark:text-slate-200 transition-all shadow-sm ml-1 sm:ml-2 group active:scale-95"
              aria-label="Scroll back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Notices & Disclaimer */}
        <div className="py-6 sm:py-8 text-center text-sm font-mono text-slate-500 dark:text-slate-400 space-y-1">
          <p>
            // Site built with the help of AI · All projects and content shown are my own work - 2026 SHAUN JOHN THOMAS //
          </p>
          <p className="text-xs text-slate-400/90 dark:text-slate-500">
            // Analytics notice: I use privacy-friendly analytics via GoatCounter to count page views without using cookies or tracking your personal data. //
          </p>
        </div>

        {/* Massive Bold Name with Framer Motion Text-Mask Animation */}
        <div className="mt-4 sm:mt-8 pt-2 sm:pt-4 overflow-hidden select-none">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center"
          >
            <div className="text-2xl sm:text-4xl md:text-5xl lg:text-[6.2vw] xl:text-[72px] font-black tracking-tight leading-none uppercase bg-clip-text text-transparent bg-gradient-to-b from-slate-800 via-slate-600 to-slate-300 dark:from-slate-200 dark:via-cyan-400/75 dark:to-cyan-950/20 whitespace-nowrap">
              SHAUN JOHN THOMAS
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
