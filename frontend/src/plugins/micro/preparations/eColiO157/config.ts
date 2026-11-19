import type { DetectionConfig } from "../detection/config";

/** E.coli O157 & Vero or Shiga toxin producing E.coli. Values from sheet "81" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const eColiO157Config: DetectionConfig = {
  key: "eColiO157",
  moduleId: "micro.eColiO157",
  persistenceType: "eColiO157",
  title: "E. coli O157 / STEC (FDA-BAM 4A)",
  testName: "E.coli O157 & Vero or Shiga toxin producing E.coli",
  media: "Modified Buffered Peptone water with pyruvate (mBPWp)",
  method: "FDA-BAM, Chapter 4 A",
  headerTextSteps: ["Sample Preparation"],
  sections: [
    {
      title: "Enrichment",
      rows: [
        { name: "mBPWp (25 g in 225 ml), static", media: "Modified Buffered Peptone water with pyruvate (mBPWp)", temp: "37", time: "5 hours" },
      ],
    },
  ],
};
