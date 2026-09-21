import { notFound } from "next/navigation";
import { projectsData } from "@/data/projects";
import { UniversalProjectDetail } from "@/components/UniversalProjectDetail";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

// Required for Next.js 100% Static Export to pre-render every project page at build time
export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const project = projectsData.find((p) => p.slug === params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Shaun John Thomas`,
    description: project.summary,
  };
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = projectsData.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  const currentIndex = projectsData.findIndex((p) => p.slug === params.slug);
  const prevProject =
    currentIndex > 0
      ? projectsData[currentIndex - 1]
      : projectsData[projectsData.length - 1];
  const nextProject =
    currentIndex < projectsData.length - 1
      ? projectsData[currentIndex + 1]
      : projectsData[0];

  return (
    <UniversalProjectDetail
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
