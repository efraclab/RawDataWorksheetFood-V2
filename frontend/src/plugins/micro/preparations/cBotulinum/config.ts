import type { PlateCountConfig } from "../plateCount/config";

/** Isolation and Identification of Clostridium botulinum. Values from sheet "31" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const cBotulinumConfig: PlateCountConfig = {
  key: "cBotulinum",
  moduleId: "micro.cBotulinum",
  persistenceType: "cBotulinum",
  title: "Clostridium botulinum",
  testName: "Isolation and Identification of Clostridium botulinum",
  media: "Cooked Meat Medium, Blood Agar, Willis and Hobb's Medium, Ellner's Medium",
  method: "IS 5887 (Part 4):1999 RA 2009",
  incubationTemp: "37",
  incubationTime: "24 (anaerobically)",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/gm",
  // Excel sums only the Willis & Hobbs plates (E14:K15). Blood Agar rows are recorded, not counted.
  timePoints: [
    { label: "Willis & Hobbs", counted: true },
    { label: "Blood Agar", counted: false },
  ],
  confirmationTests: [
    { name: "Gram's staining", media: "Gram's staining reagent" },
    { name: "Spore Production", media: "Ellner's Medium", temp: "37", time: "24 (anaerobically)" },
    { name: "Nagler Reaction", media: "C. perfringens antitoxin", temp: "37", time: "24 (anaerobically)" },
    { name: "Lactose fermentation", media: "Lactose fermentation medium", temp: "37", time: "24 (anaerobically)" },
  ],
};
