import { HeroSection } from "@/components/HeroSection";
import { SkillsSection } from "@/components/SkillsSection";
import { TimelineSection } from "@/components/TimelineSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { AnimatedFooter } from "@/components/AnimatedFooter";

export default function Home() {
  return (
    <main id="main-content" className="relative w-full min-h-screen overflow-x-hidden">
      {/* 1. Two-Column Hero & Live 3D CAD Stage */}
      <HeroSection />

      {/* 2. Projects first: the work is what visitors come for */}
      <ProjectsSection />

      {/* Subtle Section Divider */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-slate-800/80 to-transparent" />
      </div>

      {/* 3. Skills & Capabilities */}
      <SkillsSection />

      {/* Subtle Section Divider */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-slate-800/80 to-transparent" />
      </div>

      {/* 4. Experience & Education Timeline */}
      <TimelineSection />

      {/* Subtle Section Divider */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-slate-800/80 to-transparent" />
      </div>

      {/* 5. Contact */}
      <ContactSection />

      <AnimatedFooter />
    </main>
  );
}
