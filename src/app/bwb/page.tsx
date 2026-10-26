import type { Metadata } from "next";
import { BwbShowcase } from "@/components/bwb/BwbShowcase";

export const metadata: Metadata = {
  title: "Blended Wing Body UAV | Shaun John Thomas",
  description:
    "Interactive showcase of a tailless blended wing body UAV designed for a final-year dissertation at the University of Strathclyde.",
};

export default function BwbPage() {
  return <BwbShowcase />;
}
