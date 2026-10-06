import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { ProjectData } from "@/data/projects";

/**
 * Shared page header and bottom pager so every case study looks the same,
 * whichever detail layout renders its body.
 */

export function ProjectHeader({
  project,
  children,
}: {
  project: ProjectData;
  children?: React.ReactNode;
}) {
  const underRevision = project.statusBadge === "Under revision";

  return (
    <header className="mb-10 sm:mb-14">
      <div className="mb-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-500" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      <div className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-700 dark:text-cyan-400 uppercase">
            {project.category} · {project.year}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border shadow-sm ${
              underRevision
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            }`}
          >
            {underRevision && <AlertTriangle className="w-3.5 h-3.5" />}
            {project.statusBadge}
          </span>
          {project.readTime && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/60 dark:border-slate-700/60 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
              <span>{project.readTime}</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-3">
          {project.title}
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium mb-4 font-mono">
          {project.subtitle}
        </p>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
          {project.summary}
        </p>

        {children && <div className="flex flex-wrap gap-3 mt-6">{children}</div>}
      </div>
    </header>
  );
}

export function ProjectPager({
  prevProject,
  nextProject,
}: {
  prevProject?: ProjectData;
  nextProject?: ProjectData;
}) {
  return (
    <nav
      aria-label="More projects"
      className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
    >
      {prevProject ? (
        <Link
          href={`/projects/${prevProject.slug}`}
          className="w-full sm:w-auto inline-flex items-center gap-3 p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <div className="text-left">
            <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase">
              Previous Project
            </span>
            <span className="font-semibold">{prevProject.title}</span>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {nextProject ? (
        <Link
          href={`/projects/${nextProject.slug}`}
          className="w-full sm:w-auto inline-flex items-center justify-end gap-3 p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors group"
        >
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase">
              Next Project
            </span>
            <span className="font-semibold">{nextProject.title}</span>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
