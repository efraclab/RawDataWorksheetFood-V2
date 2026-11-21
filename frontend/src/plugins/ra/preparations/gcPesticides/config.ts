import type { ResidueConfig } from "../residue/config";
import { DILUENT, STANDARD, instrumentRun, sampleStandard } from "../residue/sections";

/** GC-Pesticides. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const gcPesticidesConfig: ResidueConfig = {
  key: "gcPesticides",
  moduleId: "ra.gcPesticides",
  persistenceType: "gcPesticides",
  title: "GC-Pesticides",
  testName: "GC-Pesticides",
  sections: [DILUENT, STANDARD, sampleStandard("Sample Preparation for Pesticides Analysis"), instrumentRun("GC-MS/MS")],
};