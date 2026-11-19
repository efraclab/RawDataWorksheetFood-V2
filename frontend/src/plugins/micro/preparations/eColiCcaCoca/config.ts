import type { DetectionConfig } from "../detection/config";

/** Test for Escherichia coli. Values from sheet "79" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const eColiCcaCocaConfig: DetectionConfig = {
  key: "eColiCcaCoca",
  moduleId: "micro.eColiCcaCoca",
  persistenceType: "eColiCcaCoca",
  title: "E. coli MF, CCA (SM-PR-681)",
  testName: "Test for Escherichia coli",
  media: "CCA",
  method: "SM-PR-681 (Coca Cola)",
  headerTextSteps: ["Sample volume used for Membrane Filtration"],
  resultTextSteps: ["Confirmed colony count"],
  sections: [
    {
      title: "Membrane Filtration",
      rows: [
        { name: "Growth on CCA", media: "CCA", temp: "36±2", time: "24±4 hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Oxidase test", media: "Oxidase Reagent" },
        { name: "Indole Production", media: "Tryptone broth & Kovac's Reagent", temp: "44.5", time: "24 hrs" },
      ],
    },
  ],
};
