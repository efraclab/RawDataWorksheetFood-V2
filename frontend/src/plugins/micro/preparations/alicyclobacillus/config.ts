import type { DetectionConfig } from "../detection/config";

/** Alicyclobacillus/Guaiacol Producing Organisms. Values from sheet "67" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const alicyclobacillusConfig: DetectionConfig = {
  key: "alicyclobacillus",
  moduleId: "micro.alicyclobacillus",
  persistenceType: "alicyclobacillus",
  title: "Alicyclobacillus / Guaiacol (APHA)",
  testName: "Alicyclobacillus/Guaiacol Producing Organisms",
  media: "Ali Broth, BAT Agar, K Agar",
  method: "APHA 5th Edn. Ch-25",
  sections: [
    {
      title: "For Non Filterable samples",
      rows: [
        { name: "ALI Broth", characteristics: "Turbidity", temp: "50", time: "7 days" },
        { name: "BAT Agar", characteristics: "Off white translucent colonies", temp: "43-50", time: "3 days" },
        { name: "K Agar", characteristics: "Typical colonies", temp: "43-50", time: "3 days" },
      ],
    },
    {
      title: "For Filterable samples",
      rows: [
        { name: "BAT Agar", characteristics: "Off white translucent colonies", media: "BAT Agar", temp: "50", time: "3-5 days" },
      ],
    },
  ],
};
