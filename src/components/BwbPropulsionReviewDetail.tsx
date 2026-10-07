"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Download,
  BookOpen,
  Info,
  Bot,
} from "lucide-react";
import { ProjectData } from "@/data/projects";
import { getAssetPath } from "@/lib/utils";
import { AnimatedFooter } from "@/components/AnimatedFooter";
import { ProjectHeader, ProjectPager } from "@/components/ProjectHeader";

interface BwbPropulsionReviewDetailProps {
  project: ProjectData;
  prevProject?: ProjectData;
  nextProject?: ProjectData;
}

const PAPER_PDF = "/Assets/Shaun_John_Thomas_BWB_Propulsion_Review.pdf";

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

const keyFindings = [
  {
    figure: "2030s",
    title: "Turbofans come first",
    body: "Podded high-bypass turbofans above the aft centre body are the only option realistic for the 2030s. The airframe, not the engine, supplies most of the near-term fuel saving.",
  },
  {
    figure: "13 to 30.8 EPNdB",
    title: "Shielding makes open rotors viable",
    body: "Moving an open rotor from a rear fuselage onto a hybrid wing body raises its cumulative noise margin to Stage 4 from about 13 to 30.8 EPNdB.",
  },
  {
    figure: "3 to 5%",
    title: "Boundary layer ingestion is real but modest",
    body: "With conventional turbomachinery the demonstrated benefit is 3 to 5%. The 70% figure for NASA's N3-X depends on superconducting machines that are not yet flight-ready.",
  },
  {
    figure: "about 30x",
    title: "Batteries cannot power cruise",
    body: "Jet fuel carries roughly 30 times the useful specific energy of a battery pack. Hydrogen suits the BWB's internal volume but is a 2040s prospect.",
  },
];

const noiseRows = [
  { label: "Tube-and-wing, rear open rotors", value: 13, kind: "rotor", est: false },
  { label: "BWB, 3 open rotors on upper surface", value: 24, kind: "rotor", est: false },
  { label: "HWB, open rotors 1.5 D forward of TE", value: 30.8, kind: "rotor", est: false },
  { label: "HWB, + low-noise rotors (est.)", value: 38, kind: "rotor", est: true },
  { label: "BWB, N+2 turbofans", value: 34, kind: "fan", est: false },
  { label: "BWB, turbofans + airframe tech (est.)", value: 41.6, kind: "fan", est: true },
];

const energyRows = [
  { label: "Jet A, chemical", value: 12000, key: false },
  { label: "Jet A, useful after turbine losses", value: 4500, key: true },
  { label: "Li-ion cell", value: 250, key: false },
  { label: "Li-ion pack, useful", value: 150, key: true },
];

const comparisonRows = [
  { option: "Legacy turbofan, BPR 5 to 6", fuel: "None; gain from airframe", noise: "Good with shielding", trl: "9", eis: "Early 2030s" },
  { option: "Geared / UHB turbofan", fuel: "About 10% vs Trent XWB", noise: "Very good", trl: "6 to 7", eis: "Mid 2030s" },
  { option: "Open rotor", fuel: "Over 20% vs in-service engines", noise: "Acceptable only with shielding", trl: "5", eis: "Late 2030s" },
  { option: "Partial BLI, close-mounted fans", fuel: "3 to 5%", noise: "Very good", trl: "4 to 5", eis: "Late 2030s" },
  { option: "Mild hybrid-electric", fuel: "Small; permits a smaller core", noise: "Unchanged", trl: "5 to 6", eis: "2030s" },
  { option: "Turboelectric distributed BLI", fuel: "Extra 18 to 20 points (N3-X)", noise: "Excellent", trl: "2 to 3", eis: "2045+" },
  { option: "Hydrogen combustion", fuel: "Not comparable by fuel mass", noise: "Similar to turbofan", trl: "4", eis: "2040s" },
  { option: "Hydrogen fuel cell", fuel: "Not comparable by fuel mass", noise: "Excellent", trl: "3", eis: "2045+" },
];

const roadmap = [
  {
    period: "2030s",
    gen: "Generation 1",
    title: "Podded high-bypass turbofans",
    body: "Certified or derivative engines above the aft centre body, close to the centreline and about two fan diameters ahead of the trailing edge for shielding.",
  },
  {
    period: "Late 2030s to 2040s",
    gen: "Generation 2",
    title: "Open rotor or BLI turbofans",
    body: "The largest single efficiency gain, with the noise penalty neutralised by the body. Blade-release protection over the cabin is the first problem to solve.",
  },
  {
    period: "2045 onwards",
    gen: "Generation 3",
    title: "Turboelectric distributed fans on LH2",
    body: "No pylons or nacelles, a re-energised wake and symmetric thrust after a turbine failure. Depends on flight-weight megawatt electrical machines.",
  },
];

/* -------------------------------------------------------------------------- */
/* Small building blocks                                                      */
/* -------------------------------------------------------------------------- */

function SectionHeader({ index, eyebrow, title }: { index: string; eyebrow: string; title: string }) {
  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
        {index} / {eyebrow}
      </span>
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
        {title}
      </h2>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export function BwbPropulsionReviewDetail({
  project,
  prevProject,
  nextProject,
}: BwbPropulsionReviewDetailProps) {
  return (
    <main className="min-h-screen pt-24 sm:pt-28 pb-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <ProjectHeader project={project}>
          <a
            href={getAssetPath(PAPER_PDF)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Read the full paper</span>
          </a>
          <a
            href={getAssetPath(PAPER_PDF)}
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-mono font-semibold glass-card border border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </ProjectHeader>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12 pb-20 sm:pb-24">
        {/* 01 Overview */}
        <section className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-5">
          <SectionHeader index="01" eyebrow="Abstract" title="Overview" />
          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              The blended wing body promises large cuts in fuel burn, but it removes the two places airliner engines
              normally sit: under the wing and on the rear fuselage. This review asks which propulsion system suits a
              commercial BWB of roughly 200 to 300 or more seats.
            </p>
            <p>
              Six propulsion families are compared using published data from NASA, industry programmes and academic
              studies: conventional and ultra-high bypass turbofans, open rotors, boundary layer ingestion and
              distributed propulsion, hybrid-electric and turboelectric systems, and hydrogen. Each is judged on mission
              fuel burn, community noise, integration difficulty, in-flight emissions and technology readiness.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* 02 Key findings */}
        <section className="space-y-5">
          <div className="px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
              02 / Results
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Key Findings
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyFindings.map((f) => (
              <div
                key={f.title}
                className="p-5 sm:p-6 rounded-2xl glass-card glass-card-hover border border-slate-200/90 dark:border-slate-800/80"
              >
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-700 dark:text-cyan-400 tracking-tight">
                  {f.figure}
                </div>
                <h3 className="mt-2 text-sm font-mono font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 03 Figures */}
        <section className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-8">
          <SectionHeader index="03" eyebrow="Evidence" title="Figures" />

          {/* Fig. 1 */}
          <figure className="space-y-4">
            <figcaption className="space-y-1">
              <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                Airframe shielding takes open rotor noise from 13 to 30.8 EPNdB below Stage 4
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Cumulative noise margin to FAA Stage 4 (EPNdB, larger is quieter). Dashed line: NASA N+2 goal of 42 EPNdB.
              </div>
            </figcaption>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-500 dark:bg-cyan-400" />Open rotor</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-400 dark:bg-slate-500" />Turbofan</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-400/40 dark:bg-slate-500/40" />Estimate with projected technology</span>
            </div>
            <div className="relative space-y-3">
              {noiseRows.map((r) => {
                const w = (r.value / 45) * 100;
                const base = r.kind === "rotor" ? "bg-cyan-500 dark:bg-cyan-400" : "bg-slate-400 dark:bg-slate-500";
                return (
                  <div key={r.label} className="grid grid-cols-1 sm:grid-cols-[minmax(0,15rem)_1fr] gap-x-4 gap-y-1 items-center">
                    <div className="text-xs text-slate-600 dark:text-slate-300 sm:text-right leading-snug">{r.label}</div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 h-6 rounded bg-slate-100 dark:bg-slate-900/70">
                        <div
                          className={`absolute inset-y-0 left-0 rounded ${base} ${r.est ? "opacity-40" : ""}`}
                          style={{ width: `${w}%` }}
                          title={`${r.label}: ${r.value} EPNdB below Stage 4`}
                        />
                        <div
                          className="absolute inset-y-[-4px] border-l-2 border-dashed border-slate-500/70 dark:border-slate-400/70"
                          style={{ left: `${(42 / 45) * 100}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="w-10 shrink-0 text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {r.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fig. 1 in the paper. Data: Guo, Burley and Thomas (AIAA 2014-0365); Guo and Thomas (AIAA SciTech 2015);
              Thomas et al. (AIAA 2014-0258).
            </p>
          </figure>

          <div className="h-px bg-slate-200/80 dark:bg-slate-800/80" />

          {/* Fig. 2 */}
          <figure className="space-y-4">
            <figcaption className="space-y-1">
              <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                Jet fuel carries about 30 times the useful energy of a battery pack
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Specific energy (Wh/kg). Highlighted bars are the usable values after conversion losses.
              </div>
            </figcaption>
            <div className="space-y-3">
              {energyRows.map((r) => {
                const w = Math.max((r.value / 12000) * 100, 0.6);
                return (
                  <div key={r.label} className="grid grid-cols-1 sm:grid-cols-[minmax(0,15rem)_1fr] gap-x-4 gap-y-1 items-center">
                    <div className="text-xs text-slate-600 dark:text-slate-300 sm:text-right leading-snug">{r.label}</div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 h-6 rounded bg-slate-100 dark:bg-slate-900/70">
                        <div
                          className={`absolute inset-y-0 left-0 rounded ${
                            r.key ? "bg-cyan-500 dark:bg-cyan-400" : "bg-slate-400 dark:bg-slate-500"
                          }`}
                          style={{ width: `${w}%` }}
                          title={`${r.label}: ${r.value.toLocaleString("en-GB")} Wh/kg`}
                        />
                      </div>
                      <span className="w-14 shrink-0 text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {r.value.toLocaleString("en-GB")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fig. 2 in the paper. Data: Ansell and Haran, 2020.
            </p>
          </figure>
        </section>

        {/* 04 Comparison table */}
        <section className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-5">
          <SectionHeader index="04" eyebrow="Discussion" title="Comparative Assessment" />
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            No option wins on every criterion. The trade is between near-term certainty and long-term efficiency, and
            the BWB shifts it by making noise less of a constraint.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm font-mono">
              <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3 px-4 font-semibold">Option</th>
                  <th scope="col" className="py-3 px-4 font-semibold">Fuel burn benefit</th>
                  <th scope="col" className="py-3 px-4 font-semibold">Noise on a BWB</th>
                  <th scope="col" className="py-3 px-4 font-semibold">TRL (est.)</th>
                  <th scope="col" className="py-3 px-4 font-semibold">Service entry (est.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {comparisonRows.map((r) => (
                  <tr key={r.option} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{r.option}</td>
                    <td className="py-2.5 px-4">{r.fuel}</td>
                    <td className="py-2.5 px-4">{r.noise}</td>
                    <td className="py-2.5 px-4">{r.trl}</td>
                    <td className="py-2.5 px-4 whitespace-nowrap">{r.eis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Fuel burn figures come from sources with different baselines, so they show direction and rough size rather
            than a strict ranking. TRL values and service-entry dates are the author&apos;s estimates.
          </p>
        </section>

        {/* 05 Roadmap */}
        <section className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-6">
          <SectionHeader index="05" eyebrow="Conclusion" title="Proposed Roadmap" />
          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {/* connecting line */}
            <div
              className="hidden md:block absolute top-[11px] left-[12px] right-[12px] h-0.5 bg-gradient-to-r from-cyan-500/70 via-cyan-500/40 to-cyan-500/15"
              aria-hidden="true"
            />
            {roadmap.map((step, i) => (
              <li key={step.gen} className="relative pl-9 md:pl-0">
                <div
                  className="md:hidden absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-cyan-500/30 last:hidden"
                  aria-hidden="true"
                />
                <div
                  className="absolute md:relative left-0 top-0 w-6 h-6 rounded-full bg-white dark:bg-slate-950 border-2 border-cyan-500 flex items-center justify-center text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400"
                  style={{ opacity: 1 - i * 0.2 }}
                >
                  {i + 1}
                </div>
                <div className="md:mt-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                    {step.period}
                  </div>
                  <h3 className="mt-1 text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 06 About this paper */}
        <section className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-6">
          <SectionHeader index="06" eyebrow="Notes" title="About This Paper" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-5 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <Info className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                <span>What kind of work this is</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A literature review, not original analysis. The fuel burn and noise figures come from the cited NASA,
                industry and academic sources. The comparison, the readiness estimates and the roadmap are my own
                synthesis.
              </p>
            </div>

            {/* AI use disclosure: edit this text so it matches exactly what you did */}
            <div className="rounded-xl p-5 bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <Bot className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                <span>Use of AI</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                This review was researched and drafted with the help of Claude, an AI assistant made by Anthropic. I set
                the scope and structure, decided what to include, checked the references and made the final edits. Any
                errors are my own.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={getAssetPath(PAPER_PDF)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Read the full paper, with all 24 references</span>
            </a>
          </div>
        </section>

        <ProjectPager prevProject={prevProject} nextProject={nextProject} />
      </div>

      <AnimatedFooter />
    </main>
  );
}
