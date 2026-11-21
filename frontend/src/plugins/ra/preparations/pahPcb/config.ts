import type { ResidueConfig } from "../residue/config";
import { DILUENT, STANDARD, instrumentRun, sampleStandard } from "../residue/sections";

/** PAH & PCB. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const pahPcbConfig: ResidueConfig = {
  key: "pahPcb",
  moduleId: "ra.pahPcb",
  persistenceType: "pahPcb",
  title: "PAH & PCB",
  testName: "PAH & PCB",
  sections: [DILUENT, STANDARD, sampleStandard("Sample Preparation for PAH & PCB"), instrumentRun("GC-MS/FID/ECD/P&T")],
};