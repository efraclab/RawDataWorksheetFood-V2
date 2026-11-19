import type { DetectionConfig } from "../detection/config";

/** Salmonella sp.. Values from sheet "28" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const salmonellaElisaConfig: DetectionConfig = {
  key: "salmonellaElisa",
  moduleId: "micro.salmonellaElisa",
  persistenceType: "salmonellaElisa",
  title: "Salmonella ELISA (FDA-BAM)",
  testName: "Salmonella sp.",
  media: "Buffered peptone water, RVS",
  method: "ELISA (FDA-BAM, Ch.5)",
  resultOptions: ["Negative", "Positive"],
  headerTextSteps: ["Sample Preparation"],
  sections: [
    {
      title: "ELISA",
      rows: [
        { name: "Pre-enrichment in Buffered Peptone Water", media: "Buffered peptone water", temp: "37", time: "16-20 hrs" },
        { name: "ELISA Reader (as per FDA-BAM, Ch.5)" },
      ],
    },
  ],
};
