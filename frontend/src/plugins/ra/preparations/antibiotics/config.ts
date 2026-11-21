import type { ResidueConfig } from "../residue/config";
import { DILUENT, MOBILE_PHASE, STANDARD, instrumentRun, sampleStandard } from "../residue/sections";

/** Antibiotics & Veterinary drugs. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const antibioticsConfig: ResidueConfig = {
  key: "antibiotics",
  moduleId: "ra.antibiotics",
  persistenceType: "antibiotics",
  title: "Antibiotics & Veterinary Drugs",
  testName: "Antibiotics & Veterinary drugs",
  sections: [DILUENT, MOBILE_PHASE, STANDARD, sampleStandard("Sample Preparation for Antibiotics & Veterinary Drugs Analysis"), instrumentRun("LC-MS/MS")],
};