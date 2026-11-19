import type { MpnConfig } from "../mpn/config";

/** Detection (Presence/Absence) of Coliforms. Values from sheet "15" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const coliformPresenceConfig: MpnConfig = {
  key: "coliformPresence",
  moduleId: "micro.coliformPresence",
  persistenceType: "coliformPresence",
  title: "Coliform Presence/Absence (IS 5401-2)",
  testName: "Detection (Presence/Absence) of Coliforms",
  media: "Lauryl Sulfate Tryptose (LST) Broth (Single/Double Strength), Brilliant Green Lactose Bile broth (BGLB)",
  method: "IS 5401 (Part-2): 2012 RA 2018",
  stages: [
    {
      title: "Presumptive Test",
      media: "Lauryl Sulfate Tryptose (LST) Broth (Single Strength/Double Strength)",
      incubation: "37 °C for 24 h / 48 h",
      inoculation:
        "10 ml direct / 10 ml from initial suspension for Double strength medium, and 1 ml in Single strength medium",
      groups: [
        { label: "LST Broth (Single Strength)", tubes: 1 },
        { label: "LST Broth (Double Strength)", tubes: 1 },
      ],
      readings: ["24 h", "48 h"],
    },
    {
      title: "Confirmed Test",
      media: "Brilliant Green Lactose Bile broth (BGLB)",
      incubation: "37 °C for 24 h / 48 h",
      inoculation: "Subculture all tubes of Presumptive test",
      groups: [
        { label: "BGLB from single strength LST", tubes: 1 },
        { label: "BGLB from double strength LST", tubes: 1 },
      ],
      readings: ["24 h", "48 h"],
    },
  ],
  countStage: 1,
  presence: true,
};
