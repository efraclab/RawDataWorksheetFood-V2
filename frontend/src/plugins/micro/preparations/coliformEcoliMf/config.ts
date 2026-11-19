import type { DetectionConfig } from "../detection/config";

/** Enumeration and detection of Coliform & E.coli by Membrane Filtration (MF) Method. Values from sheet "70" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const coliformEcoliMfConfig: DetectionConfig = {
  key: "coliformEcoliMf",
  moduleId: "micro.coliformEcoliMf",
  persistenceType: "coliformEcoliMf",
  title: "Coliform & E. coli MF (IS 15185)",
  testName: "Enumeration and detection of Coliform & E.coli by Membrane Filtration (MF) Method",
  media: "Lactose TTC agar, BGLB",
  method: "IS: 15185:2016",
  headerTextSteps: ["Volume of sample filtered"],
  resultTextSteps: ["Coliform count", "Faecal coliform count", "E. coli count"],
  sections: [
    {
      title: "Test for Coliform (count confirmed characteristic colonies on Lactose TTC agar)",
      rows: [
        { name: "Lactose TTC agar", characteristics: "Development of yellow color under the membrane", media: "Lactose TTC agar", temp: "37", time: "48 hrs" },
      ],
    },
    {
      title: "Test for Faecal Coliform (inoculate typical colonies from Lactose TTC agar)",
      rows: [
        { name: "BGLB", characteristics: "Gas formation", media: "BGLB", temp: "44.5", time: "24 hrs" },
      ],
    },
    {
      title: "Test for Coliform (subculture colonies from Lactose TTC agar on PCA, 37 °C / 24 h)",
      rows: [
        { name: "Oxidase test", characteristics: "-ve (absence of blue-purple color)" },
      ],
    },
    {
      title: "Test for E. coli (inoculate colonies from Lactose TTC agar to Peptone water)",
      rows: [
        { name: "Indole production", characteristics: "Cherry red color ring formation", media: "Peptone water & Kovac's reagent", temp: "44.5", time: "21±3 hrs" },
      ],
    },
  ],
};
