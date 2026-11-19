import type { DetectionConfig } from "../detection/config";

/**
 * Coliform Bacteria/250ml, Alternative Method (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 37 °C for 24±3 hrs
 */
export const pdwColiformVrblConfig: DetectionConfig = {
  key: "pdwColiformVrbl",
  moduleId: "micro.pdwColiformVrbl",
  persistenceType: "pdwColiformVrbl",
  title: "PDW Coliform/250 ml, VRBL (IS 5401-1)",
  testName: "Coliform Bacteria/250ml, Alternative Method (Packaged Drinking Water)",
  media: "Crystal Violet neutral red bile lactose (VRBL) Agar",
  method: "IS 5401 (Part-1): 2002 RA 2007",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "37 °C for 24±3 hrs" }],
  resultTextSteps: ["Colony count"],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Growth on VRBL agar", media: "VRBL Agar", temp: "37", time: "24±3 hrs" },
      ],
    },
  ],
};
