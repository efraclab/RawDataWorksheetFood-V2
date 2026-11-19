import type { MpnConfig } from "../mpn/config";

/** Detection and enumeration of presumptive Escherichia coli. Values from sheet "21" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const eColiMpnConfig: MpnConfig = {
  key: "eColiMpn",
  moduleId: "micro.eColiMpn",
  persistenceType: "eColiMpn",
  title: "Presumptive E. coli (ISO 7251)",
  testName: "Detection and enumeration of presumptive Escherichia coli",
  media: "Lauryl Sulfate Tryptose (LST) Broth (Single/Double Strength), EC broth, Tryptone water",
  method: "ISO 7251:2005",
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
      media: "EC Broth",
      incubation: "44 ± 1 °C / 48 ± 2 h",
      inoculation: "Subculture all tubes of Presumptive test",
      groups: [
        { label: "EC Broth from single strength LST", tubes: 1 },
        { label: "EC Broth from double strength LST", tubes: 1 },
      ],
      readings: ["24 h", "48 h"],
    },
    {
      title: "Indole Test",
      media: "Tryptone water",
      incubation: "44 ± 1 °C / 48 ± 2 h",
      inoculation: "Inoculate one loopful of EC Broth into tryptone water",
      groups: [
        { label: "Tryptone water from EC Broth (single strength)", tubes: 1 },
        { label: "Tryptone water from EC Broth (double strength)", tubes: 1 },
      ],
      readings: ["48 h"],
    },
  ],
  extraTextSteps: ["Indole Test Observation"],
  countStage: 2,
  presence: true,
  mpn: { formula: "none", unit: "MPN/g" },
};
