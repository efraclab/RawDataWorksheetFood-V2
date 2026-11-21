import type { ResidueConfig } from "../residue/config";
import { DILUENT, MOBILE_PHASE, STANDARD, instrumentRun, sampleStandard } from "../residue/sections";

/** Melamine. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const melamineConfig: ResidueConfig = {
  key: "melamine",
  moduleId: "ra.melamine",
  persistenceType: "melamine",
  title: "Melamine",
  testName: "Melamine",
  sections: [DILUENT, MOBILE_PHASE, STANDARD, sampleStandard("Sample Preparation for Melamine"), instrumentRun("LC-MS/MS")],
};