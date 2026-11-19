import type { DetectionConfig } from "../detection/config";

/** Isolation and Identification of Legionellae from Water sample. Values from sheet "48" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const legionellaConfig: DetectionConfig = {
  key: "legionella",
  moduleId: "micro.legionella",
  persistenceType: "legionella",
  title: "Legionellae (APHA 9260J)",
  testName: "Isolation and Identification of Legionellae from Water sample",
  media: "Buffered charcoal yeast extract alpha base (BCYE alpha) normal, Selective BCYE with GPVA",
  method: "APHA 23rd Edition, 9260J",
  resultPer: "250 ml",
  headerTextSteps: ["Incubation Temp/Time"],
  sections: [
    {
      title: "Plating from sample without acid treatment",
      rows: [
        { name: "BCYE alpha normal", characteristics: "Opaque bacterial colonies with a ground-glass appearance" },
        { name: "Selective BCYE alpha", characteristics: "Opaque bacterial colonies with a ground-glass appearance" },
      ],
    },
    {
      title: "Plating from acid treated sample",
      rows: [
        { name: "BCYE alpha normal", characteristics: "Opaque bacterial colonies with a ground-glass appearance" },
        { name: "Selective BCYE alpha", characteristics: "Opaque bacterial colonies with a ground-glass appearance" },
      ],
    },
    {
      title: "Presumptive confirmation",
      rows: [
        { name: "Grown on BCYE agar with L-Cysteine", temp: "35", time: "48 hrs" },
        { name: "Grown on BCYE agar without L-Cysteine", temp: "35", time: "48 hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's Staining", media: "Gram Staining Reagent" },
        { name: "Slide Agglutination" },
        { name: "Direct Fluorescence antibody test (DFA)" },
      ],
    },
  ],
};
