import type { ResidueConfig } from "../residue/config";
import { DILUENT, MOBILE_PHASE, STANDARD, instrumentRun, sampleStandard } from "../residue/sections";

/** LC-Pesticides. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const lcPesticidesConfig: ResidueConfig = {
  key: "lcPesticides",
  moduleId: "ra.lcPesticides",
  persistenceType: "lcPesticides",
  title: "LC-Pesticides",
  testName: "LC-Pesticides",
  sections: [DILUENT, MOBILE_PHASE, STANDARD, sampleStandard("Sample Preparation for Pesticides Analysis"), instrumentRun("LC-MS/MS")],
};