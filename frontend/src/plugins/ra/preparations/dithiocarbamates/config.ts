import type { ResidueConfig } from "../residue/config";
import { DILUENT, SAMPLE_DITHIOCARBAMATES, STANDARD, instrumentRun } from "../residue/sections";

/** Dithiocarbamates. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const dithiocarbamatesConfig: ResidueConfig = {
  key: "dithiocarbamates",
  moduleId: "ra.dithiocarbamates",
  persistenceType: "dithiocarbamates",
  title: "Dithiocarbamates",
  testName: "Dithiocarbamates",
  sections: [DILUENT, STANDARD, SAMPLE_DITHIOCARBAMATES, instrumentRun("GC-MS/FID/ECD/P&T")],
};