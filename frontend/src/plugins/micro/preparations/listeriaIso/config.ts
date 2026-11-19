import type { DetectionConfig } from "../detection/config";

/** Detection of Listeria monocytogens. Values from sheet "44" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const listeriaIsoConfig: DetectionConfig = {
  key: "listeriaIso",
  moduleId: "micro.listeriaIso",
  persistenceType: "listeriaIso",
  title: "Listeria (ISO 11290-1)",
  testName: "Detection of Listeria monocytogens",
  media: "Half Fraser Broth(diluent), PALCAM Agar",
  method: "ISO: 11290 (Part 1): 2017 second edition 2017-05",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Half Fraser Broth", characteristics: "Turbidity/Black coloration", temp: "30" },
        { name: "Fraser Broth", characteristics: "Turbidity", temp: "37" },
        { name: "Oxford Agar (From Primary enrichment)", characteristics: "Small greyish colonies surrounded by black halos", temp: "37", time: "24 hr/48 hr" },
        { name: "PALCAM Agar (From Primary enrichment)", characteristics: "small greyish green or olive green colonies with black halos", temp: "37", time: "24 hr/48 hr" },
        { name: "Oxford Agar (From Secondary enrichment)", characteristics: "Small grayish colonies surrounded by black halos", temp: "37", time: "24 hr/48 hr" },
        { name: "PALCAM Agar (From Secondary enrichment)", characteristics: "small greyish green or olive green colonies with black halos", temp: "37", time: "24 hr/48 hr" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Subculture on TSYEA Agar" },
        { name: "Gram's staining", media: "Gram's reagent", temp: "-" },
        { name: "Motility", media: "Motility Agar/Slide Method", temp: "25", time: "24 to 48 hrs" },
        { name: "Catalase test", media: "Hydrogen Peroxide", temp: "-" },
        { name: "Confirmation of Listeria monocytogenes" },
        { name: "Haemolysis test", media: "Sheep Blood Agar Plate" },
        { name: "Carbohydrate Utilization" },
        { name: "CAMP Test", media: "Sheep Blood Agar, CAMP test organisms", temp: "37" },
        { name: "Subculture on TSYEA Agar" },
        { name: "Gram's staining", media: "Gram's reagent", temp: "-" },
        { name: "Motility", media: "Motility Agar/Slide Method", temp: "25" },
        { name: "Catalase test", media: "Hydrogen Peroxide", temp: "-" },
        { name: "Confirmation of Listeria monocytogenes" },
        { name: "Haemolysis test", media: "Sheep Blood Agar Plate", temp: "37" },
        { name: "Carbohydrate Utilization" },
        { name: "CAMP Test", media: "Sheep Blood Agar, CAMP test organisms", temp: "37" },
      ],
    },
  ],
};
