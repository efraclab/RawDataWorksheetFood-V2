import type { DetectionConfig } from "../detection/config";

/**
 * Salmonella/250 ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 36 °C±2 /16-20 hrs, 42 °C±0.5 /18-24 hrs, 36 °C±2 /24 hrs
 */
export const pdwSalmonellaConfig: DetectionConfig = {
  key: "pdwSalmonella",
  moduleId: "micro.pdwSalmonella",
  persistenceType: "pdwSalmonella",
  title: "PDW Salmonella/250 ml (IS 15187)",
  testName: "Salmonella/250 ml (Packaged Drinking Water)",
  media: "Buffered Peptone Water, RVS Medium, MKTTn medium, BSA, XLDA",
  method: "IS 15187:2016/ISO 19250: 2010",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "36 °C±2 /16-20 hrs, 42 °C±0.5 /18-24 hrs, 36 °C±2 /24 hrs" }],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Buffered Peptone Water", characteristics: "Turbidity" },
        { name: "Growth in RVS Medium", characteristics: "Turbidity" },
        { name: "Growth in MKTTn Medium", characteristics: "Turbidity" },
        { name: "BSA (from RVS)", characteristics: "Black centered colony" },
        { name: "XLD Agar (from RVS)", characteristics: "Colourless colony with black centre" },
        { name: "BSA (from MKTTn)", characteristics: "Black centered colony" },
        { name: "XLD Agar (from MKTTn)", characteristics: "Colourless colony with black centre" },
      ],
    },
    {
      title: "Biochemical Confirmation (select at least 5 suspected colonies)",
      rows: [
        { name: "Lactose/Glucose Fermentation, H2S Production", media: "Triple Sugar Iron Agar", temp: "36±2", time: "24±3 hrs" },
        { name: "Urease Production", media: "Urea Agar", temp: "36±2", time: "24 hrs" },
        { name: "L-Lysine Decarboxylase", media: "L-Lysine Decarboxylase Medium", temp: "36±2", time: "24±3 hrs" },
        { name: "Examination Of O-Antigen", media: "Anti O-Serum" },
      ],
    },
  ],
};
