import type { DetectionConfig } from "../detection/config";

/** Detection of Listeria monocytogenes. Values from sheet "42" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const listeriaBamConfig: DetectionConfig = {
  key: "listeriaBam",
  moduleId: "micro.listeriaBam",
  persistenceType: "listeriaBam",
  title: "Listeria (FDA-BAM)",
  testName: "Detection of Listeria monocytogenes",
  media: "Buffered listeria enrichment broth (BLEB), Oxford agar, PALCAM",
  method: "FDA BAM Chapter10:2011",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "BLEB", characteristics: "Turbidity", temp: "30", time: "48 h" },
        { name: "Oxford Agar", characteristics: "Small grayish colonies surrounded by black halos", temp: "35", time: "48 h" },
        { name: "PALCAM Agar", characteristics: "Small grayish green colony with black halos", temp: "35", time: "48 h" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Subculture on TSAye Agar", media: "Tryptone soya yeast extract agar", temp: "30", time: "48 h" },
        { name: "Gram's staining", media: "Gram's reagent" },
        { name: "Motility", media: "Room Temp.", time: "7 days" },
        { name: "Motility (from TSAye)", media: "Slide Method" },
        { name: "Catalase test", media: "Hydrogen Peroxide" },
        { name: "Confirmation of Listeria monocytogenes" },
        { name: "Haemolysis test", media: "Sheep Blood Agar Plate", temp: "35" },
        { name: "Nitrate Reduction Test(From TSAye)", media: "Nitrate broth", temp: "35" },
        { name: "CAMP Test", media: "Sheep Blood Agar, CAMP test organisms", temp: "35" },
        { name: "Carbohydrate utilization" },
        { name: "Dextrose Utilization", media: "Purple Carbohydrate Broth with 0.5% Dextrose", temp: "35" },
        { name: "Esculin Utilization", media: "Purple Carbohydrate Broth with 0.5% Esculin", temp: "35" },
        { name: "Maltose Utilization", media: "Purple Carbohydrate Broth with 0.5% with Maltose", temp: "35" },
        { name: "Mannitol Utilization", media: "Purple Carbohydrate Broth with 0.5% Mannitol", temp: "35" },
        { name: "Rhamnose Utilization", media: "Purple Carbohydrate Broth with 0.5% Rhamnose", temp: "35" },
        { name: "Xylose Utilization", media: "Purple Carbohydrate Broth with 0.5% Xylose", temp: "35" },
      ],
    },
  ],
};
