import type { ResidueConfig } from "../residue/config";
import { DILUENT, SAMPLE_RESIDUAL_SOLVENTS, STANDARD, instrumentRun } from "../residue/sections";

/** Residual Solvents. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const residualSolventsConfig: ResidueConfig = {
  key: "residualSolvents",
  moduleId: "ra.residualSolvents",
  persistenceType: "residualSolvents",
  title: "Residual Solvents",
  testName: "Residual Solvents",
  sections: [DILUENT, STANDARD, SAMPLE_RESIDUAL_SOLVENTS, instrumentRun("GC-MS/FID/ECD/P&T")],
};