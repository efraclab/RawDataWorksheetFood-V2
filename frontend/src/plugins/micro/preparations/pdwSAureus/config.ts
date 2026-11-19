import type { DetectionConfig } from "../detection/config";

/**
 * Staphylococcus aureus/250ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 37 °C/overnight, 37 °C/30 hrs
 */
export const pdwSAureusConfig: DetectionConfig = {
  key: "pdwSAureus",
  moduleId: "micro.pdwSAureus",
  persistenceType: "pdwSAureus",
  title: "PDW S. aureus/250 ml (IS 5887-2)",
  testName: "Staphylococcus aureus/250ml (Packaged Drinking Water)",
  media: "Salt Medium, Baird Parker Agar",
  method: "IS:5887 Part-2:1976 RA 2018",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "37 °C/overnight, 37 °C/30 hrs" }],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Salt Medium", characteristics: "Turbidity" },
        { name: "Blood Agar", characteristics: "Yellow Colonies" },
        { name: "Baird Parker Agar", characteristics: "Shiny Black Colonies" },
      ],
    },
    {
      title: "After enrichment in Salt medium",
      rows: [
        { name: "Baird Parker Agar", characteristics: "Shiny Black Colonies" },
        { name: "Blood Agar", characteristics: "Yellow Colonies" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's Staining", media: "Gram Staining Reagent" },
        { name: "Coagulase", media: "Rabbit Plasma", temp: "37" },
      ],
    },
  ],
};
