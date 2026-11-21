import type { ResidueConfig } from "../residue/config";
import { DILUENT, MOBILE_PHASE, STANDARD, instrumentRun, sampleStandard } from "../residue/sections";

/** Aflatoxins (B1, B2, G1, G2). Steps from the RA raw data sheet ("Parameters" column + "Raw Data for Steps"). */
export const aflatoxinsConfig: ResidueConfig = {
  key: "aflatoxins",
  moduleId: "ra.aflatoxins",
  persistenceType: "aflatoxins",
  title: "Aflatoxins (B1, B2, G1, G2)",
  testName: "Aflatoxins (B1, B2, G1, G2)",
  sections: [DILUENT, MOBILE_PHASE, STANDARD, sampleStandard("Sample Preparation for Aflatoxin (B1, B2, G1, G2)"), instrumentRun("LC-MS/MS / HPLC-FLD")],
  analytes: ["B1", "B2", "G1", "G2"],
};