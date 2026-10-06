"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "lucide-react";

interface TocEntry {
  id: string;
  label: string;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Reading-progress bar plus an "On this page" menu, built from the h2
 * headings already rendered on a case-study page.
 */
export function ProjectPageTools() {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState("");
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Section headings are h2, or all-caps h3 (used for some section titles)
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>("main h2, main h3")
    ).filter((h) => {
      const text = (h.textContent || "").trim();
      if (!text) return false;
      return h.tagName === "H2" || (text.length > 8 && text === text.toUpperCase());
    });

    const used = new Set<string>();
    const found = headings.map((h, i) => {
      let id = h.id || slugify(h.textContent || "") || `section-${i}`;
      while (used.has(id)) id = `${id}-${i}`;
      used.add(id);
      h.id = id;
      h.style.scrollMarginTop = "6rem";
      return { id, label: (h.textContent || "").trim() };
    });
    setEntries(found);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

      let current = "";
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= 140) current = h.id;
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 h-0.5 z-[120] bg-transparent print:hidden"
      >
        <div
          className="h-full bg-cyan-500 origin-left"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {entries.length > 1 && (
        <div className="fixed bottom-4 left-4 z-[110] print:hidden">
          <AnimatePresence>
            {open && (
              <motion.nav
                aria-label="On this page"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-12 left-0 w-72 max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto rounded-2xl glass-card shadow-2xl border border-slate-200 dark:border-slate-800 p-2"
              >
                <ul className="flex flex-col">
                  {entries.map((entry) => (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        onClick={() => setOpen(false)}
                        aria-current={activeId === entry.id ? "location" : undefined}
                        className={`block px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                          activeId === entry.id
                            ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                        }`}
                      >
                        {entry.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass-pill shadow-lg text-xs font-mono font-semibold text-slate-800 dark:text-slate-100 hover:border-cyan-500/50 transition-colors"
          >
            {open ? <X className="w-4 h-4" /> : <List className="w-4 h-4 text-cyan-500" />}
            <span>On this page</span>
          </button>
        </div>
      )}
    </>
  );
}
