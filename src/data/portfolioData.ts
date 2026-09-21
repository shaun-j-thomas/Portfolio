export interface SkillItem {
  name: string;
  level?: string;
  description: string;
  iconName: string;
  link?: string;
}

export interface SkillCategory {
  title: string;
  categoryIcon: string;
  skills: SkillItem[];
}

export interface TimelineItem {
  period: string;
  title: string;
  roleOrDegree: string;
  organization: string;
  location?: string;
  type: "education" | "experience" | "project";
  badge?: string;
  description: string;
  achievements: string[];
  tags: string[];
}

export interface ProjectMedia {
  type: "image" | "video" | "3d" | "model";
  src: string;
  caption: string;
  desc?: string;
  poster?: string;
}

export interface ProjectMethodology {
  step: string;
  title: string;
  role?: "Led" | "Contributed";
  description: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  status: "In Progress" | "Completed" | "Achievement";
  statusBadge: string;
  dateRange: string;
  leadParagraph: string;
  overview: string;
  quickStats: { label: string; value: string }[];
  methodology: ProjectMethodology[];
  tags: string[];
  featuredImage: string;
  modelSrc?: string;
  gallery: ProjectMedia[];
  links: {
    external?: string;
    externalLabel?: string;
    detailsSlug?: string;
  };
}

export const portfolioData = {
  personal: {
    name: "Shaun John Thomas",
    eyebrow: "Aerospace Engineering Portfolio",
    headline: "Developing integrated aerodynamic and structural systems.",
    status: "Available after June 2027",
    location: "Glasgow, Scotland, UK",
    email: "shaunjthomas.sjt@gmail.com",
    linkedin: "https://www.linkedin.com/in/shaun-john-thomas-0635652aa",
    github: "https://github.com/shaun-j-thomas",
    cvUrl: "/Assets/Shaun J Thomas CV.pdf",
    affiliation: {
      degree: "BEng Aero-Mechanical Engineering (Final Year)",
      institution: "University of Strathclyde",
      previousDegree: "BTech Mechanical Engineering",
      previousInstitution: "VIT Chennai",
    },
    bioParagraphs: [
      "I’m a final year BEng Aero-Mechanical Engineering student at the University of Strathclyde, proficient in aerodynamics, structural design and various manufacturing processes.",
      "I love learning the reasoning behind every process, no matter the field, and figuring out how to fix what's broken. But if I had to name what I love most, it's design optimization and aircraft development.",
      "Consider this portfolio a snapshot of my engineering journey so far. It shares some of the core design work, problem-solving, and manufacturing behind what I’ve built, both on my own and as part of the massive collaborative efforts behind the two model rockets.",
    ],
  },

  bentoItems: {
    philosophy: {
      title: "Design Philosophy",
      highlight: "Learn the reasoning behind every process & optimize relentlessly.",
      body: "From airfoil reflex transitions to weight-saving bulkhead topology, I focus on physics-driven design compromises that turn ambitious aerospace concepts into physically validated flight hardware.",
    },
    currentFocus: {
      title: "Current Research Focus",
      topic: "Tailless Blended Wing Body (BWB) UAV",
      details:
        "Final year dissertation investigating the interplay between winglet cant angles, lateral-directional stability derivatives (Cl_β, Cn_β), and lift-to-drag efficiency.",
    },
    education: [
      {
        school: "University of Strathclyde",
        degree: "BEng Aero-Mechanical Engineering",
        period: "2025 – Present",
        highlight: "Glasgow, Scotland · Final Year Honors",
      },
      {
        school: "VIT Chennai",
        degree: "BTech Mechanical Engineering",
        period: "2023 – 2025",
        highlight: "Chennai, India · Core Engineering Foundations",
      },
    ],
  },

  skillsCategories: [
    {
      title: "CAD & Geometric Modeling",
      categoryIcon: "Box",
      skills: [
        {
          name: "SolidWorks",
          description: "Parametric 3D CAD modeling, large aerospace assemblies, sheet metal, and weldments.",
          iconName: "DraftingCompass",
        },
        {
          name: "OnShape",
          description: "Cloud-native collaborative CAD, parametric branching, and design revision tracking.",
          iconName: "Layers",
        },
        {
          name: "GD&T",
          description: "Geometric Dimensioning & Tolerancing to ASME Y14.5 for CNC precision and fitment.",
          iconName: "Maximize2",
        },
        {
          name: "Assembly Kinematics",
          description: "Interface fit checks, tolerance stack-up analysis, and mechanical collision inspection.",
          iconName: "Cpu",
        },
      ],
    },
    {
      title: "Analysis & Aerodynamic Simulation",
      categoryIcon: "Activity",
      skills: [
        {
          name: "ANSYS Fluent (CFD)",
          description: "Incompressible and compressible aerodynamics, induced drag, and vortex formation sweeps.",
          iconName: "Wind",
        },
        {
          name: "ANSYS Mechanical (FEA)",
          description: "Nonlinear structural stress analysis, deployment shock loads, and weight optimization.",
          iconName: "BarChart3",
        },
        {
          name: "XFLR5 / AVL",
          description: "Vortex Lattice Method (VLM) for wing planform polars, static margin, and stability derivatives.",
          iconName: "LineChart",
        },
        {
          name: "MATLAB & Simulink",
          description: "Flight dynamics mathematical modeling, control dynamics, and automated data processing.",
          iconName: "Binary",
        },
        {
          name: "Python & OpenFOAM",
          description: "Scripted meshing pipelines, computational simulation workflows, and parametric analysis.",
          iconName: "Terminal",
        },
      ],
    },
    {
      title: "Manufacturing & Prototyping",
      categoryIcon: "Hammer",
      skills: [
        {
          name: "3D Printing & Additive",
          description: "Rapid prototyping in PLA/PETG/Nylon-CF, core former manufacture, and mold design.",
          iconName: "Printer",
        },
        {
          name: "Composite Wet Layup",
          description: "Carbon fiber and fiberglass wet layup, vacuum bagging, and reinforcement schedules.",
          iconName: "Sparkles",
        },
        {
          name: "CNC Machining & Milling",
          description: "Subtractive manufacturing for airframe centering rings, motor mounts, and bulkheads.",
          iconName: "Cog",
        },
        {
          name: "Airframe Integration",
          description: "Precision bench assembly, pyrotechnic separation testing, and harness routing.",
          iconName: "Wrench",
        },
      ],
    },
    {
      title: "Leadership & Systems Engineering",
      categoryIcon: "Users",
      skills: [
        {
          name: "Technical Leadership",
          description: "Led 4-member airframe subteam through complete design, manufacture, and test cycles.",
          iconName: "Award",
        },
        {
          name: "PDR & CDR Technical Defense",
          description: "Defended structural margins, safety factors, and manufacturing workflows before panels.",
          iconName: "ShieldCheck",
        },
        {
          name: "Cross-Functional Collaboration",
          description: "Trade study negotiation across avionics, recovery, propulsion, and payload systems.",
          iconName: "Network",
        },
        {
          name: "Root-Cause Failure Diagnosis",
          description: "Post-flight failure analysis, thermal isolation revisions, and preventive design updates.",
          iconName: "Search",
        },
      ],
    },
  ] as SkillCategory[],

  certifications: [
    {
      title: "Certified SolidWorks Design Associate (CSWA)",
      issuer: "Dassault Systèmes",
      link: "https://www.credly.com/badges/f33cd5e5-7aea-4096-9106-cdddca4f05ad/public_url",
      badgeId: "CSWA - Credly Verified",
      badgeImage: "/Assets/credly badge.png",
    },
  ],

  timeline: [
    {
      period: "2026 – Present",
      title: "BWB UAV Dissertation",
      roleOrDegree: "Aerodynamic & Flight Testing Researcher",
      organization: "University of Strathclyde",
      location: "Glasgow, Scotland",
      type: "project",
      description:
        "Investigating the trade-off between winglet cant angle, lateral-directional stability, and aerodynamic lift-to-drag efficiency on a tailless Blended Wing Body UAV.",
      achievements: [
        "Pivoted planform from Clark Y to reflexed MH-series airfoil to secure pitch stability without horizontal stabilizer.",
        "Conducted ANSYS Fluent CFD sweeps (-2° to 14° AoA) mapping induced drag and tip vortex behavior.",
      ],
      tags: [
        "SolidWorks",
        "ANSYS Fluent",
        "XFLR5",
        "MATLAB",
        "SIMULINK",
        "Composites",
        "Flight Dynamics",
      ],
    },
    {
      period: "2025 – Present",
      title: "Strath AIS",
      roleOrDegree: "Airframe Design Engineer",
      organization: "University of Strathclyde",
      location: "Glasgow, Scotland",
      type: "experience",
      description:
        "Engineered the primary load-bearing recovery interface and structural bulkheads for a supersonic competition rocket flown at IREC 2026 in the 30,000ft category.",
      achievements: [
        "Led interface design connecting main parachute shock cord to motor bay assembly under high jerk loads.",
        "Executed nonlinear ANSYS FEA stress sweeps, trimming bulkhead mass by over 50% while preserving safety factors.",
        "Defended structural margins during PDR and CDR reviews, contributing to an 8th place finish reaching 24,528 ft at Mach 1+.",
      ],
      tags: ["FEA Optimization", "Carbon Fiber", "Bulkheads", "Mach 1+", "IREC 2026"],
    },
    {
      period: "2025 – Present",
      title: "University of Strathclyde",
      roleOrDegree: "BEng (Hons) Aero-Mechanical Engineering",
      organization: "Faculty of Engineering",
      location: "Glasgow, Scotland",
      type: "education",
      description:
        "Final year undergraduate focusing on advanced aerodynamics, flight mechanics, structural dynamics, and aerospace manufacturing technologies.",
      achievements: [
        "Honors dissertation on tailless blended-wing aerodynamics.",
        "Active member of the University Rocketry Team (Strath AIS).",
      ],
      tags: ["Aerospace", "Flight Mechanics", "Structural Dynamics", "Glasgow"],
    },
    {
      period: "2023 – 2025",
      title: "Team Ignition",
      roleOrDegree: "Airframe Lead",
      organization: "VIT Chennai",
      location: "Chennai, India",
      type: "experience",
      description:
        "Directed a 4-person engineering team to design, manufacture, assemble, and test the Pioneer model rocket airframe targeting 10,000 ft apogee.",
      achievements: [
        "Developed DFM workflows for structural components and jigs for accurate and efficient manufacturing.",
        "Validated vehicle stability and aerodynamic drag through extensive OpenRocket and CFD simulations.",
        "Diagnosed an avionics connector thermal fault during early testing and led redesign of thermal isolation shielding.",
      ],
      tags: ["Team Leadership", "GD&T", "CNC Machining", "Pyrotechnic Testing", "Pioneer Rocket"],
    },
    {
      period: "2023 – 2025",
      title: "Vellore Institute of Technology (VIT)",
      roleOrDegree: "BTech Mechanical Engineering",
      organization: "School of Mechanical Engineering",
      location: "Chennai, India",
      type: "education",
      badge: "Transferred to Strathclyde",
      description:
        "Completed foundational coursework in Mechanical Engineering, focusing on thermodynamics, solid mechanics, and CAD, before successfully transferring to the University of Strathclyde to specialize in Aero-Mechanical Engineering.",
      achievements: [
        "Founded key airframe engineering practices for the university rocketry club.",
      ],
      tags: ["CAD", "Thermodynamics", "Fluid Mechanics", "Mechanical Design"],
    },
  ] as TimelineItem[],

  projects: [
    {
      id: "bwb-uav",
      slug: "bwb-uav",
      title: "Blended Wing Body UAV",
      subtitle: "Aerodynamic Validation & Lateral Stability Optimization",
      category: "Autonomous Aerospace Vehicle",
      status: "In Progress",
      statusBadge: "Final Year Dissertation · In Progress",
      dateRange: "August 2026 – Present",
      leadParagraph:
        "Investigating the trade-off between winglet cant angle, lateral-directional stability, and aerodynamic lift-to-drag efficiency on a tailless aircraft configuration.",
      overview:
        "Designing, manufacturing, and flight-testing a custom tailless Blended Wing Body (BWB) UAV. The research specifically analyzes how varying winglet cant angles alter roll-due-to-sideslip (Cl_β) and yaw-due-to-sideslip (Cn_β) derivatives while balancing induced drag penalties.",
      quickStats: [
        { label: "Configuration", value: "Tailless BWB" },
        { label: "Airfoil Profile", value: "MH-Series Reflexed" },
        { label: "Analysis Suite", value: "XFLR5 / ANSYS Fluent" },
        { label: "Fabrication", value: "3D Print + Composites" },
      ],
      methodology: [
        {
          step: "01",
          title: "Sizing & Airfoil Selection",
          role: "Led",
          description:
            "Initiated planform design using traditional Clark Y in XFLR5, then pivoted to an MH-series reflexed airfoil profile to mitigate inherent pitch instability and establish positive static margin without a conventional horizontal stabilizer.",
        },
        {
          step: "02",
          title: "Iterative Studies & CFD Sweeps",
          role: "Led",
          description:
            "Refined wing twist, sweep angle, and chord taper ratio. Ran automated ANSYS Fluent CFD sweeps across angles of attack (-2° to 14°) to quantify induced drag and lateral stability derivatives.",
        },
        {
          step: "03",
          title: "Additive Manufacturing & Composite Layup",
          role: "Led",
          description:
            "Translated CAD geometry into physical test hardware by 3D-printing internal core formers, skinning with fiberglass and carbon fiber wet layups, and conducting post-cure dimensional tolerance checks.",
        },
        {
          step: "04",
          title: "Flight Dynamics & Telemetry Validation",
          role: "Led",
          description:
            "Instrumenting the scaled flight article with onboard IMU and pitot-static sensors to capture real-world flight dynamic responses and benchmark them against numerical models.",
        },
      ],
      tags: [
        "SolidWorks CAD",
        "XFLR5 VLM",
        "ANSYS Fluent",
        "MATLAB",
        "SIMULINK",
        "Airfoil Reflex",
        "Composite Layup",
        "Flight Telemetry",
      ],
      featuredImage: "/Assets/TopVIEW.png",
      modelSrc: "/Assets/CFD_model_1.5m.glb",
      gallery: [
        {
          type: "image",
          src: "/Assets/TopVIEW.png",
          caption: "SolidWorks CAD Planform Geometry",
          desc: "Top-down view of the refined SolidWorks CAD geometry showcasing planform sweep, elevon control surfaces, and integrated winglet cuffs.",
        },
        {
          type: "image",
          src: "/Assets/XFLR5Image.png",
          caption: "XFLR5 Aerodynamic Streamlines & Pressure",
          desc: "XFLR5 VLM analysis depicting surface pressure distribution and tip vortex streamlines across the reflexed wing planform.",
        },
        {
          type: "video",
          src: "/Assets/Video Project 10.mp4",
          caption: "Flight Dynamics Simulation Maneuvers",
          desc: "Visualizing aerodynamic pitch and roll stability responses during simulated high-alpha atmospheric maneuvers.",
        },
      ],
      links: {},
    },
    {
      id: "strath-ais",
      slug: "strath-ais",
      title: "StrathAIS: Airframe Design Engineer",
      subtitle: "Parachute Recovery Interface & Bulkhead FEA Optimization",
      category: "Supersonic Rocketry Vehicle",
      status: "Achievement",
      statusBadge: "IREC 2026 · 8th Place Global Finish",
      dateRange: "September 2025 – Present",
      leadParagraph:
        "Engineered the primary load-bearing recovery interface and structural bulkheads for a model rocket built to launch at IREC 2026 in the 30,000ft category.",
      overview:
        "As an Airframe Design Engineer on the University of Strathclyde rocketry team (Strath AIS), led the structural interface between the main parachute deployment shock cord and the motor bay for a high-altitude rocket that successfully reached 24,528 ft at Mach 1+.",
      quickStats: [
        { label: "Apogee Achieved", value: "24,528 ft" },
        { label: "Max Velocity", value: "Mach 1+" },
        { label: "Competition", value: "IREC 8th Place" },
        { label: "Bulkhead Weight Cut", value: "50%+" },
      ],
      methodology: [
        {
          step: "01",
          title: "Interface Design & Attachment Geometry",
          role: "Led",
          description:
            "Designed the high-strength recovery interface connecting main parachute shock cords to the motor bay in SolidWorks, calculating bolt shear patterns and airframe load distribution to absorb violent deceleration spikes.",
        },
        {
          step: "02",
          title: "ANSYS FEA Structural Stress Sweeps",
          role: "Led",
          description:
            "Conducted nonlinear FEA under peak axial drag compression, lateral gust bending, and sudden parachute opening shock. Strategically pocketed low-stress zones, cutting bulkhead mass by >50% without compromising structural margins.",
        },
        {
          step: "03",
          title: "Composite Wet Layup & Manufacturing",
          role: "Contributed",
          description:
            "Refined the carbon fiber and fiberglass wet layup manufacturing schedule, applying lessons from previous campaigns to eliminate dry spots, voids, and resin pooling in high-stress joints.",
        },
        {
          step: "04",
          title: "PDR & CDR Technical Defense",
          role: "Led",
          description:
            "Defended structural safety margins, fastener torque specifications, and manufacturing quality control before rigorous Preliminary and Critical Design Review panels ahead of the successful New Mexico launch.",
        },
      ],
      tags: [
        "ANSYS FEA",
        "Carbon Composite",
        "Bulkhead Integration",
        "PDR & CDR Defense",
        "IREC 2026",
        "Mach 1+ Flight",
      ],
      featuredImage: "/Assets/Nevis.jpg",
      modelSrc: "/Assets/Z_ASSEM.glb",
      gallery: [
        {
          type: "image",
          src: "/Assets/Nevis.jpg",
          caption: "Nevis Rocket Competition Airframe",
          desc: "The fully assembled Nevis competition launch vehicle prepared on the launch pad at Spaceport America.",
        },
        {
          type: "image",
          src: "/Assets/Optimization.png",
          caption: "ANSYS FEA Stress Optimization Heatmap",
          desc: "Von Mises stress contour maps demonstrating load concentration alleviation and weight reduction pockets across the recovery bulkhead.",
        },
        {
          type: "image",
          src: "/Assets/FiberglassLayups.jpg",
          caption: "Composite Fiberglass Wet Layup Process",
          desc: "Precision reinforcement layup process bonding internal structural airframe ribs for supersonic dynamic pressure resistance.",
        },
        {
          type: "3d",
          src: "/Assets/Z_ASSEM.glb",
          caption: "Interactive 3D Recovery Bulkhead Assembly",
          desc: "Full internal CAD assembly of the recovery interface, shock cord retention, and centering bulkhead.",
        },
      ],
      links: {
        external: "https://strathais.com/",
        externalLabel: "StrathAIS Official Portal",
      },
    },
    {
      id: "pioneer-rocket",
      slug: "pioneer-rocket",
      title: "Team Ignition: Airframe Lead",
      subtitle: "Technical Leadership & 10,000 ft Model Rocket Airframe",
      category: "High-Power Rocketry",
      status: "Completed",
      statusBadge: "Completed · VIT Chennai",
      dateRange: "August 2023 – June 2025",
      leadParagraph:
        "Led a 4-person engineering team to design, manufacture, assemble, and test the Pioneer model rocket airframe with strict adherence to Design for Manufacture (DFM) principles.",
      overview:
        "Directed the airframe subteam for Team Ignition, developing the Pioneer launch vehicle to achieve an altitude of 10,000 feet. Managed mechanical CAD modeling, machining interfaces, pyrotechnic separation testing, and root-cause fault investigation.",
      quickStats: [
        { label: "Leadership Role", value: "Airframe Lead (4 Eng)" },
        { label: "Target Apogee", value: "10,000 ft" },
        { label: "Validation", value: "CFD, FEA & Pressure Test" },
        { label: "Reviews", value: "PDR & CDR Defense" },
      ],
      methodology: [
        {
          step: "01",
          title: "Technical Team Leadership & DFM",
          role: "Led",
          description:
            "Supervised 4 subteam engineers across the design, material selection, and fabrication lifecycle of the Pioneer airframe, coordinating spatial compromises with avionics and propulsion.",
        },
        {
          step: "02",
          title: "Bulkhead & Centering Ring Design",
          role: "Led",
          description:
            "Modeled modular body tube couplers, bulkheads, and motor casing centering rings in SolidWorks, applying GD&T to ensure seamless fitment with CNC-milled aluminum components.",
        },
        {
          step: "03",
          title: "Design Validation & Pyrotechnic Ground Tests",
          role: "Led",
          description:
            "Validated structural integrity through pressure chamber tests and controlled ground pyrotechnic ejection tests to verify recovery shear-pin release without tube damage.",
        },
        {
          step: "04",
          title: "Root-Cause Failure Diagnosis & Revision",
          role: "Led",
          description:
            "Diagnosed an avionics connector disconnection caused by radiant thermal soak during an engine burn test. Spearheaded redesign with vibration-locking connectors and silicone thermal barriers.",
        },
      ],
      tags: [
        "SolidWorks Assembly",
        "GD&T",
        "CNC Milling",
        "Pyrotechnic Testing",
        "Fiberglass Layups",
        "Technical Leadership",
        "Root-Cause Analysis",
      ],
      featuredImage: "/Assets/Pioneer.jpg",
      modelSrc: "/Assets/pioneer.glb",
      gallery: [
        {
          type: "image",
          src: "/Assets/Pioneer.jpg",
          caption: "Pioneer Launch Vehicle Assembled",
          desc: "Fully manufactured Pioneer rocket launch vehicle prior to final ground integration and launch readiness review.",
        },
        {
          type: "image",
          src: "/Assets/Pioneer1.jpg",
          caption: "Assembled Pioneer Rocket Flight Vehicle",
          desc: "Full-scale vertical view of the flight-ready Pioneer rocket airframe following composite integration and avionics fitment.",
        },
        {
          type: "image",
          src: "/Assets/PyroTestIgnition.gif",
          caption: "Pyrotechnic Ejection Ground Test",
          desc: "Controlled ground pyrotechnic separation test validating pressure retention and reliable parachute deployment mechanics.",
        },
        {
          type: "3d",
          src: "/Assets/pioneer.glb",
          caption: "Interactive 3D Pioneer Airframe",
          desc: "3D CAD model of the complete Pioneer rocket airframe.",
        },
        {
          type: "3d",
          src: "/Assets/IgniteX.glb",
          caption: "Interactive 3D IgniteX Concept",
          desc: "Preliminary concept CAD assembly developed during design trade studies.",
        },
      ],
      links: {
        external: "https://www.linkedin.com/company/teamignitionvitc/posts/?feedView=all",
        externalLabel: "Team Ignition LinkedIn",
      },
    },
  ] as ProjectItem[],
};
