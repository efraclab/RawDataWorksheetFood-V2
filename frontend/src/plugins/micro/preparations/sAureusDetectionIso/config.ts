import type { DetectionConfig } from "../detection/config";

/** Detection of Coagulase positive Staphylococcus aureus. Values from sheet "24" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const sAureusDetectionIsoConfig: DetectionConfig = {
  key: "sAureusDetectionIso",
  moduleId: "micro.sAureusDetectionIso",
  persistenceType: "sAureusDetectionIso",
  title: "Coagulase +ve S. aureus Detection (ISO 6888-3)",
  testName: "Detection of Coagulase positive Staphylococcus aureus",
  media: "Baired parker Agar, Giolitti and Cantoni broth.",
  method: "ISO 6888-3: 2004",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Peptone salt solution" },
        { name: "Giolitti and Cantoni broth", characteristics: "Blackening of media", media: "37 (anaerobically)", time: "48 h ± 2 h" },
        { name: "Baird Parker Agar", characteristics: "Black or grey, Shiny and convex Colony surrounded by clear opaque zone", temp: "37", time: "48 h ± 2 h" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Coagulase test", temp: "37", time: "4 to 6 hr / 24 ± 2hr" },
      ],
    },
  ],
};
