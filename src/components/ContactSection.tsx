"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
  Send,
} from "lucide-react";
import { portfolioData } from "@/data/portfolioData";

export function ContactSection() {
  const { personal } = portfolioData;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20 overflow-hidden transition-colors duration-500 ease-in-out"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Massive Call-To-Action Headline */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 mb-3 sm:mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>05 // GET IN TOUCH</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-slate-100 dark:via-slate-200 dark:to-slate-400"
        >
          Let’s build{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400">
            together.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-xs sm:text-base md:text-lg text-slate-600 dark:text-slate-400 mt-3 sm:mt-4 leading-relaxed font-normal"
        >
          Whether discussing aerodynamics, computational analysis, or engineering career
          opportunities for 2027 and beyond, my inbox is always open. I’m always looking to learn something new, build something cool, and have fun along the way.
        </motion.p>
      </div>

      {/* 3 Tactile, Interactive Clickable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
        {/* Card 1: Direct Email with Copy & Mailto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, delay: 0.05 }}
          layout="position"
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-10 hover:z-20 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-sm dark:shadow-none hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:shadow-cyan-500/10 transition-all"
          onClick={handleCopyEmail}
        >
          <div className="flex items-start justify-between">
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <Mail className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyEmail();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 transition-colors text-xs font-mono flex items-center gap-1.5 shadow-sm"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] text-emerald-500 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium">Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-5 sm:mt-6">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
              DIRECT CONTACT
            </span>
            <h3
              className="text-xs sm:text-[13px] md:text-sm font-bold text-slate-900 dark:text-slate-100 font-mono mt-1 tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
              title={personal.email}
            >
              {personal.email}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Click anywhere on this card to copy my email address directly.
            </p>
          </div>

          <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-400">
            <a
              href={`mailto:${personal.email}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:underline flex items-center gap-1.5 font-semibold"
            >
              <span>Open Mail Client</span>
              <Send className="w-3 h-3" />
            </a>
            <span className="text-slate-400 dark:text-slate-500">EML // 01</span>
          </div>
        </motion.div>

        {/* Card 2: Location & Academic Affiliation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
          layout="position"
          whileHover={{ y: -4, scale: 1.02 }}
          className="relative z-10 hover:z-20 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden group shadow-sm dark:shadow-none hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:shadow-cyan-500/10 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300 shadow-sm">
              <Clock className="w-3 h-3 text-cyan-500" />
              <span>UK Time (GMT)</span>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
              CURRENT LOCATION
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
              Glasgow, Scotland
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Based at the University of Strathclyde, Faculty of Engineering.
            </p>
          </div>

          <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Open to UK & Global Relocation</span>
            <span className="text-slate-400 dark:text-slate-500">LOC // 02</span>
          </div>
        </motion.div>

        {/* Card 3: LinkedIn & Professional Network */}
        <motion.a
          href={personal.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, delay: 0.15 }}
          layout="position"
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-10 hover:z-20 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-sm dark:shadow-none hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:shadow-cyan-500/10 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <Linkedin className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>

            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 transition-colors shadow-sm">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
              PROFESSIONAL NETWORK
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-mono mt-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              Connect on LinkedIn
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Explore professional milestones, rocketry updates, and engineering network.
            </p>
          </div>

          <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-400">
            <span className="font-semibold group-hover:underline flex items-center gap-1">
              View Profile <ExternalLink className="w-3 h-3" />
            </span>
            <span className="text-slate-400 dark:text-slate-500">SOC // 03</span>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
