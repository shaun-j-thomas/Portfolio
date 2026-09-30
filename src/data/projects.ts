export interface ProjectMediaItem {
  type: "image" | "video" | "3d";
  src: string;
  caption: string;
  desc?: string;
  poster?: string;
  colSpan?: string;
}

export interface ProjectContentSection {
  heading: string;
  paragraphs: string[];
}

export interface ProjectMilestoneItem {
  id: number | string;
  title: string;
  description: string;
}

export interface EngineeringBreakdownItem {
  id?: number | string;
  title: string;
  role: "LED" | "CONTRIBUTED" | string;
  description: string;
  icon?: string;
  iconName?: string;
}

export interface ProjectProgressStep {
  step: string;
  title: string;
  shortDesc?: string;
  status: "completed" | "current" | "upcoming";
  badge?: string;
}

export interface ProjectProgressTracker {
  title?: string;
  currentStepLabel?: string;
  steps: ProjectProgressStep[];
}

export interface CfdResultItem {
  fileName: string;
  title: string;
  src: string;
  aoa?: string;
  tag?: string;
  description: string;
}

export interface CfdResultsSection {
  title: string;
  subtitle?: string;
  velocity?: string;
  disclaimer: string;
  items: CfdResultItem[];
}

export interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  statusBadge: string;
  summary: string;
  heroAsset: {
    type: "image" | "video" | "3d";
    src: string;
    caption?: string;
    poster?: string;
  };
  progressTracker?: ProjectProgressTracker;
  cfdResults?: CfdResultsSection;
  content: ProjectContentSection[];
  milestones?: ProjectMilestoneItem[];
  breakdownItems?: EngineeringBreakdownItem[];
  engineeringBreakdown?: EngineeringBreakdownItem[];
  breakdownTitle?: string;
  techStack: string[];
  quickStats: { label: string; value: string }[];
  specs?: { label: string; value: string }[];
  gallery: ProjectMediaItem[];
  readTime?: string;
  externalUrl?: string;
  externalLabel?: string;
}

export const projectsData: ProjectData[] = [
  {
    slug: "supercar-spoiler-cfd",
    title: "Supercar Rear Spoiler Aerodynamics",
    subtitle: "2D External Flow CFD Study of Spoiler Deployment Angles at 80 m/s",
    year: "2026",
    category: "Automotive Aerodynamics & CFD",
    statusBadge: "ANSYS FLUENT STUDY",
    readTime: "6 min read",
    summary:
      "Comprehensive 2D computational fluid dynamics investigation evaluating vehicle downforce generation, flow separation suppression, and drag penalties across deployment angles (190°, 175°, 150°) at 80 m/s (288 km/h).",
    heroAsset: {
      type: "image",
      src: "/Assets/Pathlines150.jpg",
      caption: "ANSYS Fluent 150° Particle Streamlines & Wake Trajectory (V∞ = 80 m/s)",
      poster: "/Assets/Pathlines150_thumb.jpg",
    },
    progressTracker: {
      title: "CFD SIMULATION LIFECYCLE & AERODYNAMIC OPTIMIZATION ROADMAP",
      currentStepLabel: "Completed: Full 2D CFD Investigation & Diminishing Returns Study",
      steps: [
        {
          step: "01",
          title: "Baseline Geometry & Farfield Domain",
          shortDesc: "Structured 2D vehicle boundary in a 10x body length domain at 80 m/s inlet velocity.",
          status: "completed",
          badge: "Completed",
        },
        {
          step: "02",
          title: "Boundary Layer Meshing (y+ ≈ 1)",
          shortDesc: "Prism layer inflation capturing turbulent shear layer separation over the rear decklid.",
          status: "completed",
          badge: "Completed",
        },
        {
          step: "03",
          title: "Angle Sweeps (190°, 175°, 150°)",
          shortDesc: "RANS Realizable k-ε solver iterations measuring lift reversal and pressure drag growth.",
          status: "completed",
          badge: "Completed",
        },
        {
          step: "04",
          title: "Diminishing Returns & Marginal Drag",
          shortDesc: "Quantified marginal return dropping from 17.96 N to 9.63 N downforce per unit drag.",
          status: "completed",
          badge: "Completed",
        },
      ],
    },
    content: [
      {
        heading: "Research Background & Problem Statement",
        paragraphs: [
          "At high velocities exceeding 80 m/s (288 km/h), baseline supercar body geometries often suffer from significant vehicle aerodynamic lift due to roofline curvature and flow acceleration over the fastback canopy. This induces rear tire unloading, directional instability, and severe high-speed yaw sensitivity.",
          "This project investigates the deployment kinematics of an active rear airfoil, analyzing how three distinct deployment angles (190° retracted/mild, 175° intermediate downforce, and 150° high-downforce) transform flow separation, surface static pressure differentials, and total force vectors.",
        ],
      },
      {
        heading: "CFD Methodology & Numerical Setup",
        paragraphs: [
          "Simulations were conducted using ANSYS Fluent 2025 R1 using a steady-state 2D Reynolds-Averaged Navier-Stokes (RANS) formulation with the Realizable k-ε turbulence model and Enhanced Wall Treatment. Inflation layers maintained y+ ≈ 1.0 along all vehicle wall boundaries.",
          "Inlet velocity was fixed at 80.0 m/s with 1% freestream turbulence intensity. Pressure-velocity coupling was resolved using the SIMPLE scheme with second-order upwind spatial discretization for momentum, turbulent kinetic energy, and dissipation rates.",
        ],
      },
      {
        heading: "Aerodynamic Forces & Diminishing Returns",
        paragraphs: [
          "The baseline vehicle generates 1,416 N of upward vertical lift with 565 N of drag. Introducing the 190° spoiler converts lift into +550 N of net downforce (+1,966 N net shift) at the cost of only +109 N drag, yielding 17.96 N of downforce per Newton of added drag.",
          "Steepening the angle to 150° delivers a peak downforce of +8,588 N (L/D = 6.03) with 1,425 N of drag (+152% vs baseline). However, the marginal return degrades to 9.63 N/N between 175° and 150°, illustrating classic diminishing aerodynamic returns.",
        ],
      },
    ],
    breakdownTitle: "AERODYNAMIC SIMULATION PHASES & CORE MILESTONES",
    engineeringBreakdown: [
      {
        id: 1,
        title: "Baseline Geometry & Domain Discretization",
        role: "LED",
        icon: "DraftingCompass",
        iconName: "DraftingCompass",
        description:
          "Defined 2D domain boundaries extending 4 body lengths upstream and 8 lengths downstream with velocity inlet (80 m/s) and pressure outlet (0 Pa gauge).",
      },
      {
        id: 2,
        title: "Boundary Layer Inflation & Mesh Independence",
        role: "LED",
        icon: "Activity",
        iconName: "Activity",
        description:
          "Constructed dense prism inflation layers targeting y+ ≈ 1.0 across the spoiler leading edge and vehicle underbody, validating grid convergence across 3 mesh densities.",
      },
      {
        id: 3,
        title: "Turbulence Modeling & RANS Convergence",
        role: "LED",
        icon: "Layers",
        iconName: "Layers",
        description:
          "Resolved turbulent kinetic energy and dissipation via Realizable k-ε model in ANSYS Fluent until residual convergence < 10⁻⁵ and force monitors plateaued.",
      },
      {
        id: 4,
        title: "Diminishing Returns & Marginal Drag Trade-off",
        role: "LED",
        icon: "ShieldCheck",
        iconName: "ShieldCheck",
        description:
          "Calculated marginal efficiency metrics demonstrating the drop in downforce gain per unit drag from 17.96 N/N down to 9.63 N/N as the angle steepens to 150°.",
      },
    ],
    techStack: [
      "ANSYS Fluent 2025 R1",
      "Realizable k-ε RANS",
      "Enhanced Wall Treatment (y+ ≈ 1)",
      "2D External Aerodynamics",
      "Automotive Active Aero",
      "Aerodynamic Efficiency (L/D)",
      "MATLAB Analysis",
    ],
    quickStats: [
      { label: "Baseline Lift", value: "-1,416 N (Upward)" },
      { label: "Peak Downforce (150°)", value: "+8,588 N" },
      { label: "Best L/D Ratio", value: "6.03 (at 150°)" },
      { label: "Drag Increase (150°)", value: "+152% vs Baseline" },
    ],
    specs: [
      { label: "Freestream Airspeed", value: "80 m/s (~288 km/h)" },
      { label: "Turbulence Model", value: "Realizable k-ε (Enhanced Wall)" },
      { label: "Near-Wall Mesh", value: "y+ ≈ 1.0 (Inflation Layers)" },
      { label: "Baseline Drag Force", value: "565 N" },
      { label: "150° Total Drag Force", value: "1,425 N (+152%)" },
      { label: "Best Return / Unit Drag", value: "17.96 N/N (at 190° Step)" },
    ],
    gallery: [
      {
        type: "image",
        src: "/Assets/Pathlines150.jpg",
        caption: "ANSYS Fluent 150° Particle Streamlines & Wake Recirculation",
        desc: "Particle ID streamline tracking showing vortex core development and high-energy wake deflection at 80 m/s.",
        colSpan: "col-span-12 md:col-span-6",
      },
      {
        type: "image",
        src: "/Assets/VelocityContour150.jpg",
        caption: "150° Peak Downforce Velocity Field",
        desc: "Velocity magnitude contour exhibiting peak vertical flow momentum deflection (+8,588 N downforce).",
        colSpan: "col-span-12 md:col-span-6",
      },
      {
        type: "image",
        src: "/Assets/StaticPressureContour150.jpg",
        caption: "150° Static Pressure Distribution",
        desc: "Intense stagnation zone across the leading spoiler face generating maximum downward load.",
        colSpan: "col-span-12 md:col-span-6",
      },
      {
        type: "image",
        src: "/Assets/VelocityContour.jpg",
        caption: "Baseline Velocity Contour (Unspoilered)",
        desc: "Severe flow detachment and roofline recirculation causing 1,416 N upward rear-axle lift.",
        colSpan: "col-span-12 md:col-span-6",
      },
    ],
  },
  {
    slug: "bwb-uav",
    title: "Blended Wing Body UAV",
    subtitle: "Aerodynamic Validation & Lateral Stability Optimization",
    year: "2026 – Present",
    category: "Autonomous Aerospace Vehicle",
    statusBadge: "ACTIVE RESEARCH",
    readTime: "7 min read",
    summary:
      "Investigating the interplay between winglet cant angles, lateral-directional stability derivatives (Cl_β, Cn_β), and induced drag penalties on a tailless Blended Wing Body aircraft configuration.",
    heroAsset: {
      type: "3d",
      src: "/Assets/CFD_model_1.5m.glb",
      caption: "Interactive 1.5m Wingspan Aerodynamic CFD Mesh",
      poster: "/Assets/TopVIEW.png",
    },
    progressTracker: {
      title: "PROJECT PROGRESSION TIMELINE",
      currentStepLabel: "Current Stage: Step 02 of 04 — Iterative Studies & CFD Sweeps",
      steps: [
        {
          step: "01",
          title: "Sizing & Airfoil Selection",
          shortDesc: "VLM baseline sweeps in XFLR5; MH-series reflexed airfoil selection for longitudinal pitch stability.",
          status: "completed",
          badge: "Completed",
        },
        {
          step: "02",
          title: "Iterative Studies & CFD Sweeps",
          shortDesc: "Automated ANSYS Fluent 3D Navier-Stokes sweeps (-2° to 14° AOA) quantifying lateral stability derivatives.",
          status: "current",
          badge: "Current Stage",
        },
        {
          step: "03",
          title: "Additive Manufacturing & Composite Layup",
          shortDesc: "Translating CAD geometry into modular 3D-printed core formers reinforced with carbon and fiberglass layups.",
          status: "upcoming",
          badge: "Upcoming",
        },
        {
          step: "04",
          title: "Flight Dynamics & Telemetry Validation",
          shortDesc: "Instrumented test flight with onboard IMU, pitot-static probe, and differential elevon telemetry logging.",
          status: "upcoming",
          badge: "Upcoming",
        },
      ],
    },
    content: [
      {
        heading: "Research Background & Problem Statement",
        paragraphs: [
          "Tailless Blended Wing Body (BWB) aircraft present compelling aerodynamic efficiency gains by eliminating fuselage-wing junction drag and maximizing internal volumetric storage. However, the absence of a conventional vertical stabilizer and empennage introduces severe lateral-directional dynamic coupling and inherent pitch instability.",
          "This final-year engineering dissertation investigates how progressive variations in winglet dihedral and cant angles alter the roll-due-to-sideslip (Cl_β) and yaw-due-to-sideslip (Cn_β) stability derivatives, systematically mapping the boundary between dynamic Dutch roll suppression and induced drag penalties.",
        ],
      },
      {
        heading: "Computational Simulation & Planform Sizing",
        paragraphs: [
          "Planform design began with low-speed baseline sweeps in XFLR5 using the Vortex Lattice Method (VLM). Early Clark Y airfoil baselines failed to maintain neutral trim across pitch excursions, prompting a transition to an MH-series reflexed airfoil profile to establish positive longitudinal static margin without elevator trim drag.",
          "High-fidelity ANSYS Fluent 3D Navier-Stokes CFD sweeps were automated across angles of attack from -2° to 14° to quantify boundary layer separation, tip vortex roll-up, and spanwise crossflow behavior along the blended centerbody blend radius.",
        ],
      },
      {
        heading: "Additive Manufacturing & Flight Telemetry Integration",
        paragraphs: [
          "To validate numerical predictions with empirical flight data, CAD surface geometry was partitioned into modular subassemblies for high-strength FDM 3D printing. The structural core was reinforced using precision fiberglass and carbon fiber wet layups with localized directional stiffening along the main spar interface.",
          "The flight test article is integrated with a lightweight onboard IMU, pitot-static telemetry probe, and differential elevon mixer to record dynamic flight response and benchmark computational stability models against real-world maneuvers.",
        ],
      },
    ],
    breakdownTitle: "PROJECT SCOPE & KEY ENGINEERING MILESTONES",
    engineeringBreakdown: [
      {
        id: 1,
        title: "Sizing & Airfoil Selection",
        role: "LED",
        icon: "DraftingCompass",
        iconName: "DraftingCompass",
        description:
          "Initiated planform design using a traditional Clark Y airfoil in XFLR5, pivoted to an MH-series reflexed airfoil profile to mitigate inherent pitch instability and establish a positive static margin without needing a conventional horizontal tail surface.",
      },
      {
        id: 2,
        title: "Iterative Studies & CFD Sweeps",
        role: "LED",
        icon: "Activity",
        iconName: "Activity",
        description:
          "The design was refined through iterative studies on wing twist, sweep angle, and chord taper ratio. CFD sweeps in ANSYS Fluent across a range of angles of attack (-2° to 14°) at 20 m/s were used to analyze induced drag and vortex structures, and to quantify the lateral stability derivatives (Cl_β, Cn_β).",
      },
      {
        id: 3,
        title: "Additive Manufacturing & Composite Layup",
        role: "LED",
        icon: "Layers",
        iconName: "Layers",
        description:
          "With the geometry validated, the next step will be translating the CAD model into a physical test article. This will involve 3D-printing the core formers and reinforcing with fiberglass and carbon composite layups to optimize the strength-to-weight ratio.",
      },
      {
        id: 4,
        title: "Flight Dynamics & Telemetry Validation",
        role: "LED",
        icon: "ShieldCheck",
        iconName: "ShieldCheck",
        description:
          "The final stage will involve preparing the scaled vehicle for instrumented flight testing, capturing real-world telemetry to validate the roll and yaw stability predictions and compare flight dynamic responses against the numerical models.",
      },
    ],
    techStack: [
      "XFLR5 / AVL",
      "ANSYS Fluent (CFD)",
      "SolidWorks",
      "MATLAB",
      "SIMULINK",
      "3D Printing & Additive",
      "Composite Wet Layup",
    ],
    quickStats: [
      { label: "Objective", value: "Directional Stability" },
      { label: "Control Method", value: "Wingtip Fin Cant Angles" },
      { label: "Status", value: "Dissertation Research" },
    ],
    specs: [
      { label: "Objective", value: "Directional Stability" },
      { label: "Control Method", value: "Wingtip Fin Cant Angles" },
      { label: "Status", value: "Dissertation Research" },
    ],
    cfdResults: {
      title: "Test CFD Results",
      subtitle:
        "Preliminary aerodynamic flow simulation sweeps conducted in ANSYS Fluent 2025 R1 at 20 m/s freestream velocity",
      velocity: "20 m/s (Freestream Airspeed)",
      disclaimer:
        "Note: These computational fluid dynamics results are preliminary test runs and are not final whatsoever.",
      items: [
        {
          fileName: "Pathlines at 0 AOA",
          title: "Pathlines at 0 AOA",
          src: "/Assets/Pathlines at 0 AOA.png",
          aoa: "0° AOA",
          tag: "Particle Streamlines",
          description:
            "Visualization of the flow pathlines across the blended wing body at a 0-degree angle of attack.",
        },
        {
          fileName: "StaticPressure at 0 AOA",
          title: "StaticPressure at 0 AOA",
          src: "/Assets/StaticPressure at 0 AOA.png",
          aoa: "0° AOA",
          tag: "Surface Static Pressure",
          description:
            "Static pressure distribution contour over the airframe surface at a 0-degree angle of attack.",
        },
        {
          fileName: "5 AOA Pathlines Side Profile",
          title: "5 AOA Pathlines Side Profile",
          src: "/Assets/5 AOA Pathlines Side Profile.png",
          aoa: "5° AOA",
          tag: "Side Profile Velocity",
          description:
            "Side profile view of the velocity pathlines demonstrating flow behavior and separation characteristics at a 5-degree angle of attack.",
        },
        {
          fileName: "Static Pressure at 5 AOA",
          title: "Static Pressure at 5 AOA",
          src: "/Assets/Static Pressure at 5 AOA.png",
          aoa: "5° AOA",
          tag: "Surface Static Pressure",
          description:
            "Static pressure distribution contour at a 5-degree angle of attack, highlighting the pressure differentials across the geometry.",
        },
      ],
    },
    gallery: [
      {
        type: "image",
        src: "/Assets/TopVIEW.png",
        caption: "SolidWorks CAD Planform Architecture",
        desc: "Top-down view detailing elevon control surfaces, winglet cuff transitions, and centerline motor integration.",
        colSpan: "col-span-12 md:col-span-6",
      },
      {
        type: "image",
        src: "/Assets/XFLR5Image.png",
        caption: "XFLR5 VLM Streamline Analysis",
        desc: "Surface pressure contours and tip vortex streamlines across the reflexed wing planform.",
        colSpan: "col-span-12 md:col-span-6",
      },
      {
        type: "video",
        src: "/Assets/Video Project 10.mp4",
        caption: "High-Alpha Flight Dynamics Simulation",
        desc: "Dynamic visualization of pitch and roll stability response during simulated high-alpha atmospheric maneuvers.",
        colSpan: "col-span-12 md:col-span-8 md:col-start-3",
      },
    ],
  },
  {
    slug: "strath-ais",
    title: "StrathAIS: Airframe Design Engineer",
    subtitle: "Parachute Recovery Interface & Bulkhead FEA Optimization",
    year: "2025 – 2026",
    category: "Supersonic Rocketry Vehicle",
    statusBadge: "Launched",
    readTime: "6 min read",
    summary:
      "Engineered the high-strength parachute deployment interface and structural recovery bulkheads for a supersonic model rocket that achieved 24,528 ft at the 2026 Spaceport America IREC competition.",
    heroAsset: {
      type: "image",
      src: "/Assets/Nevis.jpg",
      caption: "Manufactured NEVIS Model Rocket",
      poster: "/Assets/Nevis.jpg",
    },
    content: [
      {
        heading: "Mission Profile & Technical Requirements",
        paragraphs: [
          "As an Airframe Design Engineer on the University of Strathclyde rocketry team (Strath AIS), the primary technical challenge was developing a structural recovery junction capable of absorbing violent shock loads during supersonic main parachute ejection at terminal apogee.",
          "The flight vehicle competed in the prestigious 30,000 ft category at the Intercollegiate Rocket Engineering Competition (IREC) in New Mexico, necessitating rigorous safety factors against axial aerodynamic drag compression and gust-induced lateral bending.",
        ],
      },
      {
        heading: "Nonlinear FEA Stress Sweeps & Mass Reduction",
        paragraphs: [
          "Using SolidWorks and ANSYS Mechanical, iterative finite element stress simulations were performed across peak deployment load cases (up to 30G deceleration spikes). Critical stress concentrations around the U-bolt pass-throughs and airframe fastener shear rings were mapped and reinforced.",
          "By strategically pocketing low-stress zones in the CNC-milled 6061-T6 aluminum bulkhead and optimizing bolt pattern load distribution, structural mass was reduced by over 50% while maintaining an ultimate factor of safety exceeding 2.2.",
        ],
      },
      {
        heading: "Composite Airframe Layup & Spaceport Flight",
        paragraphs: [
          "The airframe utilized a custom fiberglass and carbon fiber composite wet layup schedule. Lessons learned from vacuum consolidation were applied to eliminate resin voids and delamination risks under supersonic skin friction heating.",
          "The design was successfully defended at Preliminary and Critical Design Reviews (PDR/CDR) before launching to an apogee of 24,528 ft at Mach 1+, securing an 8th-place global finish.",
        ],
      },
    ],
    breakdownTitle: "BULKHEAD ENGINEERING & OPTIMIZATION",
    engineeringBreakdown: [
      {
        id: 1,
        title: "Interface Design",
        role: "LED",
        icon: "DraftingCompass",
        iconName: "DraftingCompass",
        description:
          "Designed the primary structural interface connecting the main parachute shock chord to the motor bay assembly in SolidWorks, including the bulkhead geometry and its airframe attachment bolt pattern, engineered to withstand extreme instantaneous shock loads during high-altitude deployment.",
      },
      {
        id: 2,
        title: "ANSYS FEA Structural Stress Sweeps",
        role: "LED",
        icon: "Activity",
        iconName: "Activity",
        description:
          "Executed nonlinear finite element analysis (FEA) in ANSYS to simulate axial drag compression, bending moments under gust loading, and sudden jerk loads during parachute deployment, reducing bulkhead weight by over 50% while preserving structural margins.",
      },
      {
        id: 3,
        title: "Composite Layup & Manufacturing Refinement",
        role: "CONTRIBUTED",
        icon: "Layers",
        iconName: "Layers",
        description:
          "Refined the carbon fiber and fiberglass composite wet layup processes, and recommended and implemented manufacturing changes based on lessons from previous flight campaigns to minimize error and material waste.",
      },
      {
        id: 4,
        title: "PDR/CDR Technical Defense & Competition Launch",
        role: "LED",
        icon: "ShieldCheck",
        iconName: "ShieldCheck",
        description:
          "Defended airframe structural margins and manufacturing processes through rigorous Preliminary Design Review (PDR) and Critical Design Review (CDR) panels, culminating in a successful supersonic launch reaching 24,528 ft at IREC 2026.",
      },
    ],
    breakdownItems: [
      {
        id: 1,
        title: "Interface Design",
        role: "LED",
        iconName: "DraftingCompass",
        description:
          "Designed the primary structural interface connecting the main parachute shock chord to the motor bay assembly in SolidWorks, including the bulkhead geometry and its airframe attachment bolt pattern, engineered to withstand extreme instantaneous shock loads during high-altitude deployment.",
      },
      {
        id: 2,
        title: "ANSYS FEA Structural Stress Sweeps",
        role: "LED",
        iconName: "Activity",
        description:
          "Executed nonlinear finite element analysis (FEA) in ANSYS to simulate axial drag compression, bending moments under gust loading, and sudden jerk loads during parachute deployment, reducing bulkhead weight by over 50% while preserving structural margins.",
      },
      {
        id: 3,
        title: "Composite Layup & Manufacturing Refinement",
        role: "CONTRIBUTED",
        iconName: "Layers",
        description:
          "Refined the carbon fiber and fiberglass composite wet layup processes, and recommended and implemented manufacturing changes based on lessons from previous flight campaigns to minimize error and material waste.",
      },
      {
        id: 4,
        title: "PDR/CDR Technical Defense & Competition Launch",
        role: "LED",
        iconName: "ShieldCheck",
        description:
          "Defended airframe structural margins and manufacturing processes through rigorous Preliminary Design Review (PDR) and Critical Design Review (CDR) panels, culminating in a successful supersonic launch reaching 24,528 ft at IREC 2026.",
      },
    ],
    techStack: [
      "ANSYS Mechanical (FEA)",
      "SolidWorks Assembly",
      "Composite Wet Layup",
      "CNC Machining / DFM",
      "Fastener Shear Analysis",
      "PDR / CDR Review Defense",
      "Recovery Shock Dynamics",
    ],
    quickStats: [
      { label: "Apogee Achieved", value: "24,528 ft" },
      { label: "Max Velocity", value: "Mach 1+" },
      { label: "Bulkhead Weight Cut", value: "50%+" },
      { label: "Finish", value: "8th Place IREC" },
    ],
    specs: [
      { label: "Apogee Achieved", value: "24,528 ft" },
      { label: "Max Velocity", value: "Mach 1+" },
      { label: "Bulkhead Weight Cut", value: "50%+" },
      { label: "Competition Finish", value: "8th Place IREC" },
    ],
    gallery: [
      {
        type: "image",
        src: "/Assets/Optimization.png",
        caption: "ANSYS FEA Von Mises Stress Heatmap",
        desc: "Stress contour maps showing load alleviation and weight reduction pocketing across the recovery bulkhead.",
        colSpan: "col-span-12 lg:col-span-6",
      },
      {
        type: "image",
        src: "/Assets/FiberglassLayups.jpg",
        caption: "Airframe Composite Wet Layup Process",
        desc: "Vacuum-assisted composite wet layup process reinforcing internal structural joints for supersonic pressure resistance.",
        colSpan: "col-span-12 lg:col-span-6",
      },
    ],
    externalUrl: "https://strathais.com/",
    externalLabel: "StrathAIS Official Portal",
  },
  {
    slug: "pioneer-rocket",
    title: "Team Ignition: Airframe Lead",
    subtitle: "Technical Leadership & 10,000 ft Model Rocket Airframe",
    year: "2023 – 2025",
    category: "High-Power Rocketry",
    statusBadge: "COMPLETED",
    readTime: "5 min read",
    summary:
      "Led a 4-engineer airframe subteam to design, CNC-machine, and ground-test a high-power model rocket targeting 10,000 ft, establishing core DFM and pyrotechnic test procedures.",
    heroAsset: {
      type: "image",
      src: "/Assets/Pioneer.jpg",
      caption: "Pioneer Outline",
      poster: "/Assets/Pioneer.jpg",
    },
    content: [
      {
        heading: "Engineering Leadership & DFM Guidelines",
        paragraphs: [
          "Directed a 4-person airframe subteam for Team Ignition, spearheading the complete mechanical lifecycle of the Pioneer launch vehicle. Defined Design for Manufacture (DFM) guidelines and Geometric Dimensioning & Tolerancing (GD&T) standards to ensure zero-slop fitment between composite tubes and CNC aluminum centering rings.",
          "Coordinated tight spatial compromises across avionics bays, dual-deployment pyrotechnic recovery tubes, and solid motor retention bulkheads.",
        ],
      },
      {
        heading: "Pyrotechnic Ground Separation & Stress Testing",
        paragraphs: [
          "To guarantee reliable recovery without airframe ruptures, the team engineered a controlled ground pyrotechnic test apparatus. Pressure-vessel calculations were calibrated to size black-powder ejection charges, ensuring clean shear-pin separation while protecting sensitive avionics bay seals.",
          "Radial fin flutter and transonic aerodynamic drag were validated using OpenRocket and CFD simulations to verify aerodynamic center of pressure (CP) vs center of gravity (CG) margins.",
        ],
      },
      {
        heading: "Thermal Isolation Fault Diagnosis & Redesign",
        paragraphs: [
          "During static motor integration tests, an avionics connector disconnection occurred due to radiant thermal soak from the motor casing. Led the root-cause failure analysis and implemented high-temperature silicone thermal barriers and positive-latching vibration-proof harnesses, successfully preventing in-flight avionics dropouts.",
        ],
      },
    ],
    breakdownTitle: "SUBSYSTEM INTEGRATION & TECHNICAL LEADERSHIP",
    engineeringBreakdown: [
      {
        id: 1,
        title: "Technical Leadership & Collaboration",
        role: "LED",
        icon: "Users",
        iconName: "Users",
        description:
          "Directed a team of four to design and build the Pioneer rocket airframe, targeting an altitude of 10,000 feet, while collaborating closely with other departments to reach design compromises across the project.",
      },
      {
        id: 2,
        title: "Bulkhead & Attachment Design",
        role: "LED",
        icon: "PenTool",
        iconName: "PenTool",
        description:
          "Designed bulkhead structures and their airframe attachment bolt patterns in SolidWorks, using computational analysis to optimize strength to weight ratios for each part.",
      },
      {
        id: 3,
        title: "Design Validation: CFD & FEA",
        role: "LED",
        icon: "LineChart",
        iconName: "LineChart",
        description:
          "Validated design choices by running CFD, FEA, and pressure and vibration analyses, with technical guidance from external manufacturers and mentors, then defended these decisions during PDR and CDR reviews.",
      },
      {
        id: 4,
        title: "Failure Diagnosis & Design Iteration",
        role: "LED",
        icon: "Search",
        iconName: "Search",
        description:
          "Diagnosed a launch failure to a loose avionics connector that melted under heat, then led the team in revising connector mounting and thermal isolation practices for future builds.",
      },
    ],
    breakdownItems: [
      {
        id: 1,
        title: "Technical Leadership & Collaboration",
        role: "LED",
        iconName: "Users",
        description:
          "Directed a team of four to design and build the Pioneer rocket airframe, targeting an altitude of 10,000 feet, while collaborating closely with other departments to reach design compromises across the project.",
      },
      {
        id: 2,
        title: "Bulkhead & Attachment Design",
        role: "LED",
        iconName: "PenTool",
        description:
          "Designed bulkhead structures and their airframe attachment bolt patterns in SolidWorks, using computational analysis to optimize strength to weight ratios for each part.",
      },
      {
        id: 3,
        title: "Design Validation: CFD & FEA",
        role: "LED",
        iconName: "LineChart",
        description:
          "Validated design choices by running CFD, FEA, and pressure and vibration analyses, with technical guidance from external manufacturers and mentors, then defended these decisions during PDR and CDR reviews.",
      },
      {
        id: 4,
        title: "Failure Diagnosis & Design Iteration",
        role: "LED",
        iconName: "Search",
        description:
          "Diagnosed a launch failure to a loose avionics connector that melted under heat, then led the team in revising connector mounting and thermal isolation practices for future builds.",
      },
    ],
    techStack: [
      "SolidWorks",
      "ANSYS Mechanical (FEA)",
      "ANSYS Fluent (CFD)",
      "Composite Manufacturing",
      "Failure Analysis",
    ],
    quickStats: [
      { label: "Target Altitude", value: "10,000 ft" },
      { label: "Team Size", value: "4 Members" },
      { label: "Role", value: "Airframe Team Lead" },
    ],
    specs: [
      { label: "Target Altitude", value: "10,000 ft" },
      { label: "Team Size", value: "4 Members" },
      { label: "Role", value: "Airframe Team Lead" },
    ],
    gallery: [
      {
        type: "image",
        src: "/Assets/Pioneer1.jpg",
        caption: "Assembled Pioneer Rocket Flight Vehicle",
        desc: "Full-scale vertical view of the flight-ready Pioneer rocket airframe following composite integration and avionics fitment.",
        colSpan: "col-span-12 md:col-span-5 md:row-span-2",
      },
      {
        type: "3d",
        src: "/Assets/pioneer.glb",
        caption: "Interactive 3D Pioneer Airframe CAD",
        desc: "3D CAD model of the complete Pioneer rocket airframe.",
        colSpan: "col-span-12 md:col-span-7",
      },
      {
        type: "image",
        src: "/Assets/PyroTestIgnition.gif",
        caption: "Controlled Pyrotechnic Ejection Ground Test",
        desc: "Controlled ground pyrotechnic separation test validating pressure retention and reliable parachute deployment mechanics.",
        colSpan: "col-span-12 md:col-span-7",
      },
      {
        type: "3d",
        src: "/Assets/IgniteX.glb",
        caption: "Interactive 3D IgniteX Concept CAD",
        desc: "Preliminary concept CAD assembly developed during design trade studies.",
        colSpan: "col-span-12",
      },
    ],
    externalUrl: "https://www.linkedin.com/company/teamignitionvitc/posts/?feedView=all",
    externalLabel: "Team Ignition LinkedIn",
  },
];
