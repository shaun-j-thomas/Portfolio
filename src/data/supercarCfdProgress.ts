export type ProgressStatus = "done" | "next" | "pending";

export interface SupercarCfdProgressItem {
  id: string;
  label: string;
  status: ProgressStatus;
}

export const supercarCfdProgressItems: SupercarCfdProgressItem[] = [
  {
    id: "round-1-runs",
    label: "Round 1 runs",
    status: "done",
  },
  {
    id: "setup-review",
    label: "Setup review",
    status: "done",
  },
  {
    id: "corrected-setup",
    label: "Corrected setup (moving ground, larger domain)",
    status: "next",
  },
  {
    id: "spoiler-force-sep",
    label: "Spoiler force reported separately from the body",
    status: "next",
  },
  {
    id: "mesh-independence",
    label: "Mesh independence study",
    status: "next",
  },
  {
    id: "rerun-configs",
    label: "Re-run of all four configurations",
    status: "next",
  },
  {
    id: "results-published",
    label: "Results and report published",
    status: "pending",
  },
];
