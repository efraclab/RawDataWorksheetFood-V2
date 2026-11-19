import type { DetectionConfig } from "../detection/config";

/**
 * Faecal Streptococci/250 ml, Alternative Method (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 36 ± 2 °C for 44 ± 4 hrs, 44 ± 0.5 °C for 2 hrs
 */
export const pdwFaecalStrepSbConfig: DetectionConfig = {
  key: "pdwFaecalStrepSb",
  moduleId: "micro.pdwFaecalStrepSb",
  persistenceType: "pdwFaecalStrepSb",
  title: "PDW Faecal Streptococci/250 ml, Slanetz-Bartley (IS 15186)",
  testName: "Faecal Streptococci/250 ml, Alternative Method (Packaged Drinking Water)",
  media: "Slanetz and Bartley medium",
  method: "IS 15186: 2002 RA 2014 / ISO 7899-2:2000",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "36 ± 2 °C for 44 ± 4 hrs, 44 ± 0.5 °C for 2 hrs" }],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Slanetz and Bartley medium", characteristics: "Red, maroon or pink colony" },
      ],
    },
    {
      title: "Confirmation",
      rows: [
        { name: "Bile-aesculin-azide agar", characteristics: "Tan to black colour in the surrounding medium" },
        { name: "Gram staining", characteristics: "Gram positive chains" },
        { name: "Catalase test", characteristics: "Instant bubbles with hydrogen peroxide" },
      ],
    },
  ],
};
