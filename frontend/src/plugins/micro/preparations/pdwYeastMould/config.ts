import type { DetectionConfig } from "../detection/config";

/**
 * Yeast and Mold/250 ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 25 °C/5 Days
 */
export const pdwYeastMouldConfig: DetectionConfig = {
  key: "pdwYeastMould",
  moduleId: "micro.pdwYeastMould",
  persistenceType: "pdwYeastMould",
  title: "PDW Yeast & Mould/250 ml (IS 5403)",
  testName: "Yeast and Mold/250 ml (Packaged Drinking Water)",
  media: "Yeast Extract Dextrose Chloramphenicol Agar",
  method: "IS:5403:1999 RA 2018",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "25 °C/5 Days" }],
  resultTextSteps: ["Yeast", "Mould"],
  sections: [
    {
      title: "Yeast (A: Absent / P: Present)",
      rows: [
        { name: "1st day", media: "YEDC Agar", temp: "25" },
        { name: "2nd day", media: "YEDC Agar", temp: "25" },
        { name: "3rd day", media: "YEDC Agar", temp: "25" },
        { name: "4th day", media: "YEDC Agar", temp: "25" },
        { name: "5th day", media: "YEDC Agar", temp: "25" },
      ],
    },
    {
      title: "Mould (A: Absent / P: Present)",
      rows: [
        { name: "1st day", media: "YEDC Agar", temp: "25" },
        { name: "2nd day", media: "YEDC Agar", temp: "25" },
        { name: "3rd day", media: "YEDC Agar", temp: "25" },
        { name: "4th day", media: "YEDC Agar", temp: "25" },
        { name: "5th day", media: "YEDC Agar", temp: "25" },
      ],
    },
  ],
};
