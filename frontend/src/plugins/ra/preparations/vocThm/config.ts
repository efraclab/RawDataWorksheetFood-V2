import type { ResidueConfig } from "../residue/config";
import { DILUENT, SAMPLE_VOCS, STANDARD, instrumentRun } from "../residue/sections";

/** VOCs & THM. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const vocThmConfig: ResidueConfig = {
  key: "vocThm",
  moduleId: "ra.vocThm",
  persistenceType: "vocThm",
  title: "VOCs & THM",
  testName: "VOCs & THM",
  sections: [DILUENT, STANDARD, SAMPLE_VOCS, instrumentRun("GC-MS/MS")],
};