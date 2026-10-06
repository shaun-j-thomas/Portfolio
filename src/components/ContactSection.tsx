"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Linkedin,
  Copy,
  Check,
  FileText,
  Sparkles,
} from "lucide-react";
import { portfolioData } from "@/data/portfolioData";
import { getAssetPath } from "@/lib/utils";

const secondaryButton =
  "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-mono font-semibold text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors";

export function ContactSection() {
  const { personal } = portfolioData;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the mailto button still works */
    }
  };

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20 overflow-hidden transition-colors duration-500 ease-in-out"
    >
      <div className="absolute top-1/2 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400 mb-3 sm:mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>05 // GET IN TOUCH</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-slate-100"
        >
          Let’s build{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500 dark:from-cyan-300 dark:to-sky-400">
            together.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed"
        >
          Whether discussing aerodynamics, computational analysis, or engineering
          opportunities for 2027 and beyond, my inbox is always open.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${personal.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-mono font-semibold text-slate-950 bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Email me</span>
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryButton}
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a
              href={getAssetPath(personal.cvUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryButton}
            >
              <FileText className="w-4 h-4" />
              <span>CV (PDF)</span>
            </a>
          </div>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
            title="Copy email address"
          >
            <span>{personal.email}</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="sr-only" aria-live="polite">
              {copied ? "Email address copied" : "Copy email address"}
            </span>
          </button>

          <p className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>Glasgow, Scotland · Open to UK &amp; global relocation</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
