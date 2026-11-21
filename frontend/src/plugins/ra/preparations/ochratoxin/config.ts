import type { ResidueConfig } from "../residue/config";
import { DILUENT, MOBILE_PHASE, STANDARD, instrumentRun, sampleStandard } from "../residue/sections";

/** Ochratoxin. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const ochratoxinConfig: ResidueConfig = {
  key: "ochratoxin",
  moduleId: "ra.ochratoxin",
  persistenceType: "ochratoxin",
  title: "Ochratoxin",
  testName: "Ochratoxin",
  sections: [DILUENT, MOBILE_PHASE, STANDARD, sampleStandard("Sample Preparation for Ochratoxin"), instrumentRun("LC-MS/MS")],
  analytes: ["Ochratoxin A"],
};