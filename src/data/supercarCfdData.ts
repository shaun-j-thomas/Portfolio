/**
 * Single source of truth for Supercar Rear Spoiler 2D CFD study.
 * All raw values from ANSYS Fluent 2025 R1 (Freestream V_inf = 80 m/s).
 *
 * Forces:
 * - Drag (F_D): Positive opposes vehicle travel direction.
 * - Vertical (F_L): Positive means Downforce, Negative means Lift.
 */

export const FORCE_UNIT = "N";
export const VELOCITY_UNIT = "m/s";
export const PRESSURE_UNIT = "Pa";

export interface RawCfdModel {
  id: "baseline" | "model-190" | "model-175" | "model-150";
  label: string;
  shortLabel: string;
  angleDeg: number | null; // null for baseline
  dragN: number;
  verticalN: number; // positive = downforce, negative = lift
  figureNumberVelocity: number;
  figureNumberPressure?: number;
  velocityLegendRange: string;
  pressureLegendRange?: string;
  velocityImageSrc: string;
  pressureImageSrc?: string;
  velocityAlt: string;
  pressureAlt?: string;
  velocityCaption: string;
  pressureCaption?: string;
  operatingMode: string;
}

export const rawCfdModels: RawCfdModel[] = [
  {
    id: "baseline",
    label: "Baseline (Model 1)",
    shortLabel: "Baseline",
    angleDeg: null,
    dragN: 565.47,
    verticalN: -1415.69,
    figureNumberVelocity: 3,
    velocityLegendRange: "0 to 133 m/s",
    velocityImageSrc: "/Assets/VelocityContour.jpg",
    velocityAlt: "2D velocity magnitude contour for baseline model without spoiler. Legend scale from 0 to 133 m/s shows flow separation and wake recirculation behind the rear decklid.",
    velocityCaption: "Velocity magnitude contour, Model 1 (no spoiler). Flow separates over the rear decklid, leaving a large low-velocity recirculation region.",
    operatingMode: "No spoiler (Unstable lift)",
  },
  {
    id: "model-190",
    label: "190° Spoiler",
    shortLabel: "190°",
    angleDeg: 190,
    dragN: 674.95,
    verticalN: 550.42,
    figureNumberVelocity: 4,
    figureNumberPressure: 5,
    velocityLegendRange: "0 to 132 m/s",
    pressureLegendRange: "-7,620 to 4,140 Pa",
    velocityImageSrc: "/Assets/VelocityContour190.jpg",
    pressureImageSrc: "/Assets/StaticPressureContour190.jpg",
    velocityAlt: "2D velocity magnitude contour for 190 degree spoiler. Legend scale 0 to 132 m/s illustrates reattached boundary layer flow along the rear decklid.",
    pressureAlt: "2D static gauge pressure contour for 190 degree spoiler. Legend scale -7,620 to 4,140 Pa shows localized stagnation on the forward spoiler surface.",
    velocityCaption: "Velocity magnitude contour, spoiler at 190°. Reattached flow suppresses the canopy separation bubble.",
    pressureCaption: "Static gauge pressure contour, spoiler at 190°. High pressure zone forms on the upper spoiler surface.",
    operatingMode: "Low-drag high-speed mode",
  },
  {
    id: "model-175",
    label: "175° Spoiler",
    shortLabel: "175°",
    angleDeg: 175,
    dragN: 890.87,
    verticalN: 3444.84,
    figureNumberVelocity: 6,
    figureNumberPressure: 7,
    velocityLegendRange: "0 to 169 m/s",
    pressureLegendRange: "-17,400 to 4,230 Pa",
    velocityImageSrc: "/Assets/VelocityContour175.jpg",
    pressureImageSrc: "/Assets/StaticPressureContour175.jpg",
    velocityAlt: "2D velocity magnitude contour for 175 degree spoiler. Legend scale 0 to 169 m/s shows upward flow deflection and moderate trailing wake.",
    pressureAlt: "2D static gauge pressure contour for 175 degree spoiler. Legend scale -17,400 to 4,230 Pa shows expanded stagnation envelope ahead of the spoiler.",
    velocityCaption: "Velocity magnitude contour, spoiler at 175°. Upward flow deflection generates balanced vertical force.",
    pressureCaption: "Static gauge pressure contour, spoiler at 175°. High pressure stagnation region extends across the rear decklid.",
    operatingMode: "Balanced cruise and cornering mode",
  },
  {
    id: "model-150",
    label: "150° Spoiler",
    shortLabel: "150°",
    angleDeg: 150,
    dragN: 1424.80,
    verticalN: 8587.88,
    figureNumberVelocity: 8,
    figureNumberPressure: 9,
    velocityLegendRange: "0 to 199 m/s",
    pressureLegendRange: "-24,800 to 4,470 Pa",
    velocityImageSrc: "/Assets/VelocityContour150.jpg",
    pressureImageSrc: "/Assets/StaticPressureContour150.jpg",
    velocityAlt: "2D velocity magnitude contour for 150 degree spoiler. Legend scale 0 to 199 m/s shows maximum flow deflection and large separated wake core.",
    pressureAlt: "2D static gauge pressure contour for 150 degree spoiler. Legend scale -24,800 to 4,470 Pa shows peak stagnation pressure on the forward flap surface.",
    velocityCaption: "Velocity magnitude contour, spoiler at 150°. Peak downforce generation with significant trailing wake growth.",
    pressureCaption: "Static gauge pressure contour, spoiler at 150°. Maximum static pressure coefficient across the deployed wing chord.",
    operatingMode: "Maximum downforce airbrake mode",
  },
];

export interface ComputedCfdModel extends RawCfdModel {
  deltaDragN: number;
  deltaDragPercent: number;
  netVerticalShiftN: number;
  liftToDrag: number;
  isMaxEfficiency: boolean;
}

export interface MarginalReturnStep {
  id: string;
  fromLabel: string;
  toLabel: string;
  fromAngle: number | null;
  toAngle: number;
  deltaVerticalN: number;
  deltaDragN: number;
  marginalReturn: number; // deltaVerticalN / deltaDragN
  downforcePerDegree: number;
  dragPerDegree: number;
  observation: string;
}

/** Round half away from zero */
export function roundHalfAwayFromZero(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  const sign = num < 0 ? -1 : 1;
  return (sign * Math.round(Math.abs(num) * factor)) / factor;
}

export function formatNumber(num: number, decimals: number): string {
  const rounded = roundHalfAwayFromZero(num, decimals);
  return rounded.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatSignedNumber(num: number, decimals: number): string {
  const sign = num > 0 ? "+" : "";
  return `${sign}${formatNumber(num, decimals)}`;
}

// Compute all derived values
const baselineModel = rawCfdModels[0];

export const computedCfdModels: ComputedCfdModel[] = rawCfdModels.map(
  (model, index) => {
    const deltaDragN = model.dragN - baselineModel.dragN;
    const deltaDragPercent =
      index === 0 ? 0 : (deltaDragN / baselineModel.dragN) * 100;
    const netVerticalShiftN = model.verticalN - baselineModel.verticalN;
    const liftToDrag = model.verticalN / model.dragN;

    return {
      ...model,
      deltaDragN,
      deltaDragPercent,
      netVerticalShiftN,
      liftToDrag,
      isMaxEfficiency: false, // set below
    };
  }
);

// Identify maximum L/D model
let maxLdIndex = 0;
computedCfdModels.forEach((m, idx) => {
  if (m.liftToDrag > computedCfdModels[maxLdIndex].liftToDrag) {
    maxLdIndex = idx;
  }
});
computedCfdModels[maxLdIndex].isMaxEfficiency = true;

// Compute marginal return steps between consecutive models
export const marginalReturnSteps: MarginalReturnStep[] = [
  {
    id: "baseline-to-190",
    fromLabel: "Baseline",
    toLabel: "190°",
    fromAngle: null,
    toAngle: 190,
    deltaVerticalN: computedCfdModels[1].verticalN - computedCfdModels[0].verticalN,
    deltaDragN: computedCfdModels[1].dragN - computedCfdModels[0].dragN,
    marginalReturn:
      (computedCfdModels[1].verticalN - computedCfdModels[0].verticalN) /
      (computedCfdModels[1].dragN - computedCfdModels[0].dragN),
    downforcePerDegree: 0,
    dragPerDegree: 0,
    observation:
      "Lift eliminated; initial downforce established with minor drag penalty.",
  },
  {
    id: "190-to-175",
    fromLabel: "190°",
    toLabel: "175°",
    fromAngle: 190,
    toAngle: 175,
    deltaVerticalN: computedCfdModels[2].verticalN - computedCfdModels[1].verticalN,
    deltaDragN: computedCfdModels[2].dragN - computedCfdModels[1].dragN,
    marginalReturn:
      (computedCfdModels[2].verticalN - computedCfdModels[1].verticalN) /
      (computedCfdModels[2].dragN - computedCfdModels[1].dragN),
    downforcePerDegree:
      (computedCfdModels[2].verticalN - computedCfdModels[1].verticalN) / (190 - 175),
    dragPerDegree:
      (computedCfdModels[2].dragN - computedCfdModels[1].dragN) / (190 - 175),
    observation:
      "Balanced downforce gain with high flow attachment along upper surface.",
  },
  {
    id: "175-to-150",
    fromLabel: "175°",
    toLabel: "150°",
    fromAngle: 175,
    toAngle: 150,
    deltaVerticalN: computedCfdModels[3].verticalN - computedCfdModels[2].verticalN,
    deltaDragN: computedCfdModels[3].dragN - computedCfdModels[2].dragN,
    marginalReturn:
      (computedCfdModels[3].verticalN - computedCfdModels[2].verticalN) /
      (computedCfdModels[3].dragN - computedCfdModels[2].dragN),
    downforcePerDegree:
      (computedCfdModels[3].verticalN - computedCfdModels[2].verticalN) / (175 - 150),
    dragPerDegree:
      (computedCfdModels[3].dragN - computedCfdModels[2].dragN) / (175 - 150),
    observation:
      "Peak downforce attained; the wake grows substantially, raising pressure drag.",
  },
];

// Optional note under force table
export const forceBasisNote: string | undefined = undefined;

// Explorer configuration
export const contoursShareScale: boolean = false;

// Supplemental Pathlines Asset
export const pathlinesAsset = {
  figureNumber: 10,
  title: "Particle Pathlines (150° Spoiler Deployment)",
  src: "/Assets/Pathlines150.jpg",
  alt: "2D particle pathlines colored by velocity magnitude for 150 degree spoiler deployment. Flow streamlines track from nose stagnation through roof curvature into the trailing wake vortex core.",
  caption: "Particle pathlines colored by velocity magnitude, spoiler at 150°. Illustrates streamline trajectory and wake core location behind the rear decklid.",
};

// Setup table parameters: required + optional rows (null when not specified)
export interface SetupRow {
  label: string;
  value: string;
  unitOrNote: string;
}

export const cfdSetupRows: SetupRow[] = [
  {
    label: "Freestream Velocity (V_inf)",
    value: "80.00 m/s",
    unitOrNote: "288.00 km/h (Inlet boundary condition)",
  },
  {
    label: "Spoiler Dimensions",
    value: "120.00 mm × 2.00 mm",
    unitOrNote: "Chord length × profile thickness",
  },
  {
    label: "Turbulence Model",
    value: "Realizable k-epsilon",
    unitOrNote: "Enhanced Wall Treatment (y+ approx 1.0)",
  },
  {
    label: "Working Fluid",
    value: "Air (Ideal gas)",
    unitOrNote: "rho = 1.225 kg/m3, mu = 1.7894 × 10^-5 kg/m s",
  },
];

// Optional setup rows that render only when filled (kept null/undefined)
export interface OptionalSetupItem {
  key: string;
  label: string;
  value: string | null;
  note?: string;
}

export const optionalSetupRows: OptionalSetupItem[] = [
  { key: "solverType", label: "Solver Type", value: null },
  { key: "pressureVelocityCoupling", label: "Pressure-Velocity Coupling", value: null },
  { key: "spatialDiscretisation", label: "Spatial Discretisation", value: null },
  { key: "cellCountPerModel", label: "Cell Count per Model", value: null },
  { key: "firstCellHeight", label: "First Cell Height", value: null },
  { key: "inflationLayers", label: "Inflation Layers & Growth Rate", value: null },
  { key: "domainDimensions", label: "Domain Dimensions & Blockage Ratio", value: null },
  { key: "groundBoundary", label: "Ground Boundary Condition", value: null },
  { key: "topBoundary", label: "Top Boundary Condition", value: null },
  { key: "inletTurbulence", label: "Inlet Turbulence Intensity & Viscosity Ratio", value: null },
  { key: "convergenceCriteria", label: "Convergence Criteria", value: null },
  { key: "meshIndependence", label: "Mesh Independence Result", value: null },
  { key: "validationNote", label: "Validation Note", value: null },
];

/** Generate CSV string from the dataset */
export function generateCfdResultsCsv(): string {
  const headers = [
    "Configuration",
    "Spoiler Angle (deg)",
    "Drag F_D (N)",
    "Vertical Force F_L (N)",
    "Delta Drag (N)",
    "Delta Drag (%)",
    "Net Vertical Shift (N)",
    "Efficiency (L/D)",
  ];

  const rows = computedCfdModels.map((m) => [
    `"${m.label}"`,
    m.angleDeg !== null ? m.angleDeg.toString() : "0 (No Spoiler)",
    m.dragN.toFixed(2),
    m.verticalN.toFixed(2),
    m.deltaDragN.toFixed(2),
    m.deltaDragPercent.toFixed(2),
    m.netVerticalShiftN.toFixed(2),
    m.liftToDrag.toFixed(2),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/** Build-time verification assertion function */
export function verifyCfdExpectedValues(): boolean {
  // Baseline
  const b = computedCfdModels[0];
  if (Math.abs(b.dragN - 565.47) > 0.01) throw new Error("Baseline drag mismatch");
  if (Math.abs(b.verticalN - -1415.69) > 0.01) throw new Error("Baseline vertical mismatch");
  if (Math.abs(roundHalfAwayFromZero(b.liftToDrag, 2) - -2.5) > 0.01) throw new Error("Baseline L/D mismatch");

  // 190 deg
  const m190 = computedCfdModels[1];
  if (Math.abs(m190.dragN - 674.95) > 0.01) throw new Error("190 drag mismatch");
  if (Math.abs(m190.verticalN - 550.42) > 0.01) throw new Error("190 vertical mismatch");
  if (Math.abs(roundHalfAwayFromZero(m190.deltaDragN, 2) - 109.48) > 0.01) throw new Error("190 delta drag mismatch");
  if (Math.abs(roundHalfAwayFromZero(m190.deltaDragPercent, 1) - 19.4) > 0.01) throw new Error("190 delta drag percent mismatch");
  if (Math.abs(roundHalfAwayFromZero(m190.netVerticalShiftN, 2) - 1966.11) > 0.01) throw new Error("190 net shift mismatch");
  if (Math.abs(roundHalfAwayFromZero(m190.liftToDrag, 2) - 0.82) > 0.01) throw new Error("190 L/D mismatch");

  // 175 deg
  const m175 = computedCfdModels[2];
  if (Math.abs(m175.dragN - 890.87) > 0.01) throw new Error("175 drag mismatch");
  if (Math.abs(m175.verticalN - 3444.84) > 0.01) throw new Error("175 vertical mismatch");
  if (Math.abs(roundHalfAwayFromZero(m175.deltaDragN, 2) - 325.4) > 0.01) throw new Error("175 delta drag mismatch");
  if (Math.abs(roundHalfAwayFromZero(m175.deltaDragPercent, 1) - 57.5) > 0.01) throw new Error("175 delta drag percent mismatch");
  if (Math.abs(roundHalfAwayFromZero(m175.netVerticalShiftN, 2) - 4860.53) > 0.01) throw new Error("175 net shift mismatch");
  if (Math.abs(roundHalfAwayFromZero(m175.liftToDrag, 2) - 3.87) > 0.01) throw new Error("175 L/D mismatch");

  // 150 deg
  const m150 = computedCfdModels[3];
  if (Math.abs(m150.dragN - 1424.8) > 0.01) throw new Error("150 drag mismatch");
  if (Math.abs(m150.verticalN - 8587.88) > 0.01) throw new Error("150 vertical mismatch");
  if (Math.abs(roundHalfAwayFromZero(m150.deltaDragN, 2) - 859.33) > 0.01) throw new Error("150 delta drag mismatch");
  if (Math.abs(roundHalfAwayFromZero(m150.deltaDragPercent, 1) - 152.0) > 0.01) throw new Error("150 delta drag percent mismatch");
  if (Math.abs(roundHalfAwayFromZero(m150.netVerticalShiftN, 2) - 10003.57) > 0.01) throw new Error("150 net shift mismatch");
  if (Math.abs(roundHalfAwayFromZero(m150.liftToDrag, 2) - 6.03) > 0.01) throw new Error("150 L/D mismatch");

  // Marginal returns
  const mr1 = marginalReturnSteps[0];
  if (Math.abs(roundHalfAwayFromZero(mr1.marginalReturn, 2) - 17.96) > 0.01) throw new Error("Marginal return step 1 mismatch");

  const mr2 = marginalReturnSteps[1];
  if (Math.abs(roundHalfAwayFromZero(mr2.marginalReturn, 2) - 13.41) > 0.01) throw new Error("Marginal return step 2 mismatch");

  const mr3 = marginalReturnSteps[2];
  if (Math.abs(roundHalfAwayFromZero(mr3.marginalReturn, 2) - 9.63) > 0.01) throw new Error("Marginal return step 3 mismatch");

  return true;
}

// Execute assertion immediately at module load time to guarantee consistency
verifyCfdExpectedValues();
