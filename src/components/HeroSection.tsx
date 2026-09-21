"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  FileText,
  Mail,
  Linkedin,
  ChevronRight,
} from "lucide-react";
import { portfolioData } from "@/data/portfolioData";
import { getAssetPath } from "@/lib/utils";
import { ModelViewer3D } from "./ModelViewer3D";

export function HeroSection() {
  const { personal } = portfolioData;

  return (
    <section
      id="about"
      className="relative min-h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full pt-32 pb-20 px-4 md:px-8 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-colors duration-500 ease-in-out"
    >
      {/* Radial Masked Engineering Blueprint Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none" />

      {/* Left Column Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-cyan-500/10 dark:bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Bottom Fade-Out Gradient Transition */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/70 dark:via-slate-950/70 to-transparent pointer-events-none z-10" />

      {/* Left Column: Text & CTAs */}
      <div className="relative z-20 flex flex-col space-y-6">
        {/* Top Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-wrap items-center gap-2.5 sm:gap-3"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/30 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{personal.status}</span>
          </div>

          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">
            {personal.eyebrow}
          </span>
        </motion.div>

        {/* High-Impact Headline with Cyan -> Indigo -> Purple Multi-Color Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="space-y-3"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Hi! I’m{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-500 drop-shadow-sm">
              Shaun
            </span>
          </h1>

          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
            {personal.headline}
          </h2>

          <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
            {personal.bioParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </motion.div>

        {/* Actions Bar & Quick Links with Telemetry Amber & Cyan Accents */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
          className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
        >
          {/* Primary Button: Tinted Cyan with Glowing Hover State */}
          <a
            href={getAssetPath(personal.cvUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-500/20 dark:hover:bg-cyan-900/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          >
            <FileText className="w-4 h-4 text-cyan-500" />
            <span>VIEW_CV.PDF</span>
          </a>

          {/* Secondary Button: Telemetry Amber Hover State */}
          <a
            href="/#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold font-mono text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-slate-800/80 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/50 border border-slate-200 dark:border-slate-700 transition-all shadow-sm group"
          >
            <span>Explore Projects</span>
            <ArrowDown className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-amber-400 group-hover:translate-y-0.5 transition-transform" />
          </a>

          {/* Social Links with Sharp Amber Hover Accents */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 text-slate-500 dark:text-slate-400 font-mono text-xs">
            <a
              href={`mailto:${personal.email}`}
              className="p-2.5 rounded-full glass-card hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors border border-slate-200 dark:border-slate-800"
              aria-label="Email Shaun"
              title={personal.email}
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full glass-card hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors border border-slate-200 dark:border-slate-800"
              aria-label="LinkedIn Profile"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Aerodynamic CAD Model HUD with "CFD Heatmap" Multi-Color Ambient Mesh Glow */}
      <div className="relative z-20 w-full">
        {/* Dynamic Multi-Color CFD Thermal Mesh Glow (Cyan, Deep Purple, Thermal Rose) */}
        <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
          {/* Electric Cyan Shockwave */}
          <div className="absolute -top-6 -left-6 w-3/4 h-3/4 rounded-full bg-cyan-500/20 dark:bg-cyan-500/25 blur-[90px]" />
          {/* Deep Aerospace Purple Core */}
          <div className="absolute -bottom-6 -right-6 w-3/4 h-3/4 rounded-full bg-purple-600/20 dark:bg-purple-600/25 blur-[100px]" />
          {/* Intense Thermal Magenta / Amber Wave */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 rounded-full bg-rose-500/15 dark:bg-rose-500/20 blur-[85px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="relative w-full rounded-3xl overflow-hidden bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 flex flex-col justify-between shadow-xl hover:shadow-cyan-500/15 transition-all"
        >
          {/* HUD Top Bar */}
          <div className="p-3.5 sm:p-4 bg-slate-100/90 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-cyan-300">
                AERODYNAMIC CAD MODEL HUD
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">
              1.5m Wingspan BWB
            </span>
          </div>

          {/* 3D Model Stage */}
          <div className="w-full aspect-square sm:aspect-[4/3] lg:aspect-video min-h-[320px] sm:min-h-[380px] p-2 sm:p-4 flex flex-col justify-center">
            <ModelViewer3D
              src="/Assets/CFD_model_1.5m.glb"
              alt="Aerodynamic CFD model of BWB UAV"
              hudLabel="BWB CFD REFLEX SURFACE"
              height="100%"
            />
          </div>

          {/* HUD Bottom Bar */}
          <div className="p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono mt-auto">
            <span className="truncate">Real CAD export of Dissertation UAV</span>
            <Link
              href="/projects/bwb-uav/"
              className="flex items-center gap-1.5 font-semibold text-cyan-600 dark:text-cyan-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors shrink-0 pl-3 group"
            >
              <span>Explore Project</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
