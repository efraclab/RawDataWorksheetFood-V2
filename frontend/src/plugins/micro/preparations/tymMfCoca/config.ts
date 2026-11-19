import type { DetectionConfig } from "../detection/config";

/** Total Yeast and Mould Count. Values from sheet "80" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const tymMfCocaConfig: DetectionConfig = {
  key: "tymMfCoca",
  moduleId: "micro.tymMfCoca",
  persistenceType: "tymMfCoca",
  title: "Yeast & Mould MF (SM-PR-688)",
  testName: "Total Yeast and Mould Count",
  media: "Acidified Potato Dextrose Agar / Acidified Orange Serum Agar",
  method: "SM-PR-688 (Coca Cola)",
  headerTextSteps: ["Volume of sample filtered"],
  resultTextSteps: ["Yeast & Mould count"],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Acidified PDA / Acidified OSA", characteristics: "White creamy colonies, Black velvety colonies", media: "Acidified PDA/Acidified OSA", temp: "25 ± 2", time: "5 days" },
      ],
    },
  ],
};
