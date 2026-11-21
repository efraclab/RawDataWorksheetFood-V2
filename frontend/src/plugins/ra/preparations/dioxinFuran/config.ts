import type { ResidueConfig } from "../residue/config";
import { DILUENT, STANDARD, instrumentRun, sampleStandard } from "../residue/sections";

/** Dioxin & Furan. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const dioxinFuranConfig: ResidueConfig = {
  key: "dioxinFuran",
  moduleId: "ra.dioxinFuran",
  persistenceType: "dioxinFuran",
  title: "Dioxin & Furan",
  testName: "Dioxin & Furan",
  sections: [DILUENT, STANDARD, sampleStandard("Sample Preparation for Dioxin & Furans"), instrumentRun("HR-GC/HR-MS")],
};