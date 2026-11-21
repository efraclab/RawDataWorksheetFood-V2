import type { ResidueConfig } from "../residue/config";
import { DILUENT, MOBILE_PHASE, STANDARD, instrumentRun, sampleStandard } from "../residue/sections";

/** Aflatoxin M1. Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const aflatoxinM1Config: ResidueConfig = {
  key: "aflatoxinM1",
  moduleId: "ra.aflatoxinM1",
  persistenceType: "aflatoxinM1",
  title: "Aflatoxin M1",
  testName: "Aflatoxin M1",
  sections: [DILUENT, MOBILE_PHASE, STANDARD, sampleStandard("Sample Preparation for Aflatoxin M1"), instrumentRun("LC-MS/MS")],
  analytes: ["Aflatoxin M1"],
};