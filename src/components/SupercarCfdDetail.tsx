"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { ProjectData } from "@/data/projects";
import {
  supercarCfdProgressItems,
  SupercarCfdProgressItem,
} from "@/data/supercarCfdProgress";
import { AnimatedFooter } from "@/components/AnimatedFooter";
import { ProjectHeader, ProjectPager } from "@/components/ProjectHeader";

interface SupercarCfdDetailProps {
  project: ProjectData;
  prevProject?: ProjectData;
  nextProject?: ProjectData;
}

export function SupercarCfdDetail({
  project,
  prevProject,
  nextProject,
}: SupercarCfdDetailProps) {
  return (
    <main className="min-h-screen pt-24 sm:pt-28 pb-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <ProjectHeader project={project} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Status Panel (Replaces KPI cards) */}
        <div className="rounded-2xl p-6 sm:p-8 bg-amber-500/10 dark:bg-amber-950/25 border border-amber-500/30 dark:border-amber-500/40 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-mono font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">
                  Status Notice: Data Under Revision
                </h2>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                Results removed pending a re-run. A review of my first-round setup found a stationary ground wall and a domain that blocked a large fraction of the flow, so the force values were not representative of a car on a road. I have taken them down rather than leave numbers I no longer trust. The study is being repeated with a moving ground, a larger domain and a mesh independence check.
              </p>
            </div>
          </div>

          {/* Progress Checklist */}
          <div className="mt-8 pt-6 border-t border-amber-500/20 dark:border-amber-500/30">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-4">
              Revision Progress Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              {supercarCfdProgressItems.map((item: SupercarCfdProgressItem) => {
                const isDone = item.status === "done";
                const isNext = item.status === "next";
                const isPending = item.status === "pending";

                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                      isDone
                        ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/30 text-slate-900 dark:text-slate-100"
                        : isNext
                        ? "bg-cyan-50/60 dark:bg-cyan-950/20 border-cyan-500/40 text-slate-900 dark:text-slate-100 font-semibold"
                        : "bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone && (
                        <CheckCircle2
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                          aria-hidden="true"
                        />
                      )}
                      {isNext && (
                        <Circle
                          className="w-4 h-4 text-cyan-700 dark:text-cyan-400"
                          aria-hidden="true"
                        />
                      )}
                      {isPending && (
                        <Circle
                          className="w-4 h-4 text-slate-400 dark:text-slate-600"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <span>{item.label}</span>
                      <span className="sr-only">
                        {isDone
                          ? " (Status: Completed)"
                          : isNext
                          ? " (Status: In Progress / Next)"
                          : " (Status: Pending)"}
                      </span>
                    </div>
                    <span
                      className={`text-xs uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        isDone
                          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                          : isNext
                          ? "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 01 / Aim & Objectives */}
        <section className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
              01 / Project Scope
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Aim & Objectives
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              The primary aim of this investigation is to evaluate the aerodynamic influence of an active rear spoiler deployed at varied angles on a high-performance supercar geometry in 2D external flow.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Study objectives
            </h3>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Baseline Characterisation:</strong>{" "}
                  Quantify flow separation and vehicle lift generated by the clean fastback profile in the absence of aerodynamic control surfaces.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Lift Neutralisation and Downforce Generation:</strong>{" "}
                  Assess flow reattachment, surface static pressure build-up, and vertical force reversal across spoiler deployment angles.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Aerodynamic Efficiency (L/D):</strong>{" "}
                  Evaluate the trade-off between downforce generation and induced pressure drag across all configurations.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Diminishing Returns Analysis:</strong>{" "}
                  Quantify marginal downforce gain per unit drag penalty to identify the aerodynamic balance across deployment angles.
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 02 / Methodology and Numerical Setup */}
        <section className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
              02 / Numerical Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Methodology and Numerical Setup
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            <p>
              Simulations were run in ANSYS Fluent 2025 R1 using a 2D, steady-state, pressure-based RANS solver with coupled pressure-velocity coupling and second-order discretisation. Turbulence was modelled with SST k-omega.
            </p>
          </div>

          {/* Parameter Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Simulation Parameters
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm font-mono">
                <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-semibold w-1/3">
                      Parameter
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold w-2/3">
                      Specification / Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Configurations
                    </td>
                    <td className="py-2.5 px-4">
                      Baseline (no spoiler), spoiler at 190, 175 and 150 degrees
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Freestream velocity
                    </td>
                    <td className="py-2.5 px-4">
                      80.0 m/s (288 km/h), velocity inlet
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Working fluid
                    </td>
                    <td className="py-2.5 px-4">
                      Air, constant density 1.225 kg/m3, viscosity 1.7894e-05 kg/(m s)
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Turbulence model
                    </td>
                    <td className="py-2.5 px-4">SST k-omega</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Spoiler dimensions
                    </td>
                    <td className="py-2.5 px-4">
                      120.00 mm chord, 2.00 mm thickness
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Drag direction
                    </td>
                    <td className="py-2.5 px-4">
                      Along the freestream (flow toward -x)
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Vertical force
                    </td>
                    <td className="py-2.5 px-4">
                      Positive downward, reported as downforce
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Modelling Assumptions */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Modelling Assumptions
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans">
              <li>
                <strong>Steady-state flow:</strong> Time-averaged Navier-Stokes equations solved with steady boundary conditions.
              </li>
              <li>
                <strong>Rigid bodies:</strong> Vehicle profile and spoiler control surfaces treated as non-deforming walls.
              </li>
              <li>
                <strong>Simplified 2D centreline geometry:</strong> Section cut along the vehicle symmetry plane to evaluate fundamental profile aerodynamics.
              </li>
              <li>
                <strong>Fluid properties:</strong> Constant-density air at sea level standard conditions; freestream Mach number about 0.23.
              </li>
            </ul>
          </div>

          {/* Planned Changes for Round 2 */}
          <div className="rounded-xl p-5 bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                Planned
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Planned Changes for Round 2
              </h3>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans">
              <li>Moving ground at the freestream speed.</li>
              <li>Larger domain to reduce blockage.</li>
              <li>Spoiler as a separate wall so its force can be reported alone.</li>
              <li>Boundary layer mesh with measured y+.</li>
              <li>Mesh independence study.</li>
            </ul>
          </div>
        </section>

        {/* Section 03 / Results Placeholder */}
        <section className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
              03 / Investigation Findings
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Results
            </h2>
          </div>
          <div className="p-6 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm font-mono text-slate-600 dark:text-slate-400">
              Results will be published after the re-run.
            </p>
          </div>
        </section>

        <ProjectPager prevProject={prevProject} nextProject={nextProject} />
      </div>

      <AnimatedFooter />
    </main>
  );
}
