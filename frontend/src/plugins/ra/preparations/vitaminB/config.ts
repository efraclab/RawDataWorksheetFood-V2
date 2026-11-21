import type { ResidueConfig } from "../residue/config";
import { DILUENT, MOBILE_PHASE, SAMPLE_VITAMINS, STANDARD, instrumentRun } from "../residue/sections";

/** Vitamin B9, B12, B7. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const vitaminBConfig: ResidueConfig = {
  key: "vitaminB",
  moduleId: "ra.vitaminB",
  persistenceType: "vitaminB",
  title: "Vitamin B9, B12, B7",
  testName: "Vitamin B9, B12, B7",
  sections: [DILUENT, MOBILE_PHASE, STANDARD, SAMPLE_VITAMINS, instrumentRun("LC-MS/MS")],
  analytes: ["B9", "B12", "B7"],
};