"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileDown, Plane } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { portfolioData } from "@/data/portfolioData";

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Journey", href: "/#journey" },
  { name: "Projects", href: "/#projects" },
  { name: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = navLinks.map((link) => link.href.replace(/^\/?#/, ""));
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-[100] flex justify-center px-3 sm:px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`pointer-events-auto flex items-center justify-between gap-2 md:gap-6 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full glass-pill shadow-xl shadow-black/5 dark:shadow-cyan-950/30 transition-all duration-300 w-full max-w-4xl backdrop-blur-xl border border-slate-200/80 dark:border-cyan-500/20 ${
          scrolled ? "bg-white/90 dark:bg-slate-900/90 shadow-lg shadow-cyan-500/5" : ""
        }`}
        aria-label="Main Navigation"
      >
        {/* Brand / Logo */}
        <Link
          href="/#about"
          className="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider font-mono text-slate-900 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors pl-1 sm:pl-2 shrink-0 group"
        >
          <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500 transition-all shadow-sm shadow-cyan-500/20">
            <Plane className="w-3.5 h-3.5 -rotate-45" />
          </div>
          <span className="hidden sm:inline font-bold">SHAUN J THOMAS</span>
          <span className="sm:hidden font-bold">SJT</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 font-mono text-xs">
          {navLinks.map((link) => {
            const sectionId = link.href.replace(/^\/?#/, "");
            const isActive = activeSection === sectionId;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-slate-950 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-full bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Actions: View CV + ThemeToggle + Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={portfolioData.personal.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-cyan-500/15 hover:text-cyan-600 dark:hover:bg-cyan-500/20 dark:hover:text-cyan-300 hover:border-cyan-500/50 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-500" />
            <span>CV</span>
          </a>

          <ThemeToggle />

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-cyan-500 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-14 sm:top-16 inset-x-3 sm:inset-x-4 max-w-md mx-auto p-4 rounded-3xl glass-card shadow-2xl border border-slate-200 dark:border-slate-800 md:hidden flex flex-col gap-1.5 font-mono text-sm z-[110]"
          >
            {navLinks.map((link) => {
              const sectionId = link.href.replace(/^\/?#/, "");
              const isActive = activeSection === sectionId;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-2xl transition-all ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                      : "text-slate-700 dark:text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2 flex justify-between items-center px-1">
              <a
                href={portfolioData.personal.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-600 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <FileDown className="w-4 h-4 text-cyan-500" />
                <span>View CV (PDF)</span>
              </a>
              <span className="text-[10px] text-slate-400 font-mono">Glasgow, UK</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
