import type { DetectionConfig } from "../detection/config";

/** Presence Of Mould. Values from sheet "11" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const mouldPresenceConfig: DetectionConfig = {
  key: "mouldPresence",
  moduleId: "micro.mouldPresence",
  persistenceType: "mouldPresence",
  title: "Presence of Mould (FSSAI)",
  testName: "Presence Of Mould",
  media: "",
  method: "FSSAI Lab Manual",
  headerTextSteps: ["Total Quantity of Sample"],
  sections: [
    {
      title: "Observation (Present/Absent)",
      rows: [
        { name: "R1" },
        { name: "R2" },
        { name: "R3" },
      ],
    },
  ],
};
