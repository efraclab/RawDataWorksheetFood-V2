import type { DetectionConfig } from "../detection/config";

/** Detection of Listeria monocytogens. Values from sheet "41" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const listeriaIsConfig: DetectionConfig = {
  key: "listeriaIs",
  moduleId: "micro.listeriaIs",
  persistenceType: "listeriaIs",
  title: "Listeria (IS 14988)",
  testName: "Detection of Listeria monocytogens",
  media: "Half Fraser Broth, Fraser Broth, Oxford Agar, PALCAM Agar",
  method: "IS: 14988 (Part 1): 2001",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Half Fraser Broth", characteristics: "Turbidity/Black coloration", temp: "37" },
        { name: "Oxford Agar", characteristics: "Small grayish colonies surrounded by black halos", temp: "37", time: "48 h" },
        { name: "PALCAM Agar", characteristics: "Small grayish green colony with black halos", temp: "37", time: "48 h" },
        { name: "Fraser Broth", characteristics: "Turbidity/Black Colouration", temp: "37" },
        { name: "Secondary Enrichment" },
      ],
    },
    {
      title: "Stage 2",
      rows: [
        { name: "Oxford Agar", characteristics: "Small grayish colonies surrounded by black halos", temp: "37", time: "48 h" },
        { name: "PALCAM Agar", characteristics: "Small grayish green colony with black halos", temp: "37", time: "48 h" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Subculture on TSYEA Agar", media: "Tryptone soya yeast extract agar", temp: "37", time: "24 h" },
        { name: "Gram's staining", media: "Gram's reagent" },
        { name: "Motility", media: "Motility Agar/Slide Method", temp: "25", time: "8-24 h" },
        { name: "Catalase test", media: "Hydrogen Peroxide" },
        { name: "Confirmation of Listeria monocytogenes" },
        { name: "Haemolysis test", media: "Sheep Blood Agar Plate", temp: "37", time: "24 h" },
        { name: "Carbohydrate utilization" },
        { name: "Rhamnose Utilization", media: "Rhamnose", temp: "37", time: "5 days" },
        { name: "Xylose Utilization", media: "Xylose", temp: "37", time: "5 days" },
        { name: "CAMP Test", media: "Sheep Blood Agar, CAMP test organisms", temp: "37", time: "18 hrs" },
      ],
    },
  ],
};
