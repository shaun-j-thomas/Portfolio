import { notFound } from "next/navigation";
import { Metadata } from "next";
import { projectsData } from "@/data/projects";
import { UniversalProjectDetail } from "@/components/UniversalProjectDetail";
import { SupercarCfdDetail } from "@/components/SupercarCfdDetail";

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

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = projectsData.find((p) => p.slug === params.slug);
  if (!project) return { title: "Project Not Found" };

  if (params.slug === "supercar-spoiler-cfd") {
    const title = "Aerodynamic Analysis of a Supercar Rear Spoiler | CFD Study | Shaun John Thomas";
    const description =
      "2D computational fluid dynamics study in ANSYS Fluent investigating active rear spoiler deployment angles. Method and numerical setup under revision.";
    const url = `https://shaun-j-thomas.github.io/Portfolio/projects/${params.slug}/`;
    const ogImage = "https://shaun-j-thomas.github.io/Portfolio/Assets/og-image.jpg";

    return {
      title,
      description,
      robots: {
        index: false,
        follow: true,
      },
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: "article",
        url,
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: "Shaun John Thomas Portfolio",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      keywords: [
        "Computational Fluid Dynamics",
        "CFD",
        "ANSYS Fluent",
        "Automotive Aerodynamics",
        "Supercar Rear Spoiler",
        "Downforce",
        "Drag Reduction",
        "Lift-to-Drag Ratio",
        "RANS",
        "Shaun John Thomas",
      ],
      authors: [{ name: "Shaun John Thomas" }],
    };
  }

  return {
    title: `${project.title} | Shaun John Thomas`,
    description: project.summary,
    alternates: {
      canonical: `https://shaun-j-thomas.github.io/Portfolio/projects/${params.slug}/`,
    },
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

  if (params.slug === "supercar-spoiler-cfd") {
    // Structured JSON-LD TechArticle schema without result values
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "Aerodynamic Analysis of a Supercar Rear Spoiler",
      description:
        "2D external flow computational fluid dynamics (CFD) investigation evaluating active rear spoiler deployment angles in ANSYS Fluent.",
      image: "https://shaun-j-thomas.github.io/Portfolio/Assets/og-image.jpg",
      datePublished: "2026-09-30",
      dateModified: "2026-10-02",
      author: {
        "@type": "Person",
        name: "Shaun John Thomas",
        url: "https://shaun-j-thomas.github.io/Portfolio/",
      },
      publisher: {
        "@type": "Person",
        name: "Shaun John Thomas",
      },
      keywords: [
        "Aerodynamics",
        "CFD",
        "ANSYS Fluent",
        "Supercar Spoiler",
        "Downforce",
        "Drag",
      ],
      inLanguage: "en-GB",
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SupercarCfdDetail
          project={project}
          prevProject={prevProject}
          nextProject={nextProject}
        />
      </>
    );
  }

  return (
    <UniversalProjectDetail
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
