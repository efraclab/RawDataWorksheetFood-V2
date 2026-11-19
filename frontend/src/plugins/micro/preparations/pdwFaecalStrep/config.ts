import type { DetectionConfig } from "../detection/config";

/**
 * Faecal Streptococci/250 ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 37 °C/48 hr, 44 °C/24 hrs
 */
export const pdwFaecalStrepConfig: DetectionConfig = {
  key: "pdwFaecalStrep",
  moduleId: "micro.pdwFaecalStrep",
  persistenceType: "pdwFaecalStrep",
  title: "PDW Faecal Streptococci/250 ml (IS 5887-2)",
  testName: "Faecal Streptococci/250 ml (Packaged Drinking Water)",
  media: "Ethyl Violet Azide Dextrose Agar, MacConkey Agar",
  method: "IS 5887(Part 2)-1976 RA 2018",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "37 °C/48 hr, 44 °C/24 hrs" }],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Ethyl Violet Azide Dextrose Agar", characteristics: "Dark red or having red or pink centered colonies" },
        { name: "MacConkey Agar", characteristics: "Small pink colonies" },
      ],
    },
    {
      title: "Confirmation",
      rows: [
        { name: "Gram staining", characteristics: "Gram positive cocci usually in pairs or short chains" },
      ],
    },
  ],
};
