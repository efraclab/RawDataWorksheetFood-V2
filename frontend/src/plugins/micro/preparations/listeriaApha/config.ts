import type { DetectionConfig } from "../detection/config";

/** Detection of Listeria monocytogenes. Values from sheet "43" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const listeriaAphaConfig: DetectionConfig = {
  key: "listeriaApha",
  moduleId: "micro.listeriaApha",
  persistenceType: "listeriaApha",
  title: "Listeria (APHA)",
  testName: "Detection of Listeria monocytogenes",
  media: "Buffered listeria enrichment broth (BLEB), Oxford agar, PALCAM",
  method: "APHA Chapter 36",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "BLEB", characteristics: "Turbidity", temp: "30", time: "48hrs" },
        { name: "Oxford Agar", characteristics: "Small grayish colonies surrounded by black halos", temp: "35", time: "48hrs" },
        { name: "PALCAM Agar", characteristics: "Small grayish green colony with black halos", temp: "35", time: "48hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Subculture on TSAYE Agar", media: "Tryptone soya yeast extract agar", temp: "35", time: "48hrs" },
        { name: "Gram's staining", media: "Gram's reagent", temp: "-" },
        { name: "Motility (from TSAye)", media: "Slide Method", temp: "-" },
        { name: "Oxidase test", media: "Oxidase discs" },
        { name: "Catalase test", media: "Hydrogen Peroxide", temp: "-" },
        { name: "Confirmation of Listeria monocytogenes" },
        { name: "Haemolysis test" },
        { name: "Nitrate Reduction Test(From TSAye)" },
        { name: "CAMP Test" },
        { name: "Carbohydrate utilization" },
        { name: "Glucose Utilization", media: "Purple Carbohydrate Broth with 0.5% Dextrose" },
        { name: "Esculin Utilization", media: "Purple Carbohydrate Broth with 0.5% Esculin" },
        { name: "Maltose Utilization", media: "Purple Carbohydrate Broth with 0.5% with Maltose" },
        { name: "Mannitol Utilization", media: "Purple Carbohydrate Broth with 0.5% Mannitol" },
        { name: "Rhamnose Utilization", media: "Purple Carbohydrate Broth with 0.5% Rhamnose" },
        { name: "Xylose Utilization", media: "Purple Carbohydrate Broth with 0.5% Xylose" },
      ],
    },
  ],
};
