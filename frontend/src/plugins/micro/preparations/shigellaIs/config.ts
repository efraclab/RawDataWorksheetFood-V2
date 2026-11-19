import type { DetectionConfig } from "../detection/config";

/** Isolation and Identification of Shigella. Values from sheet "39" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const shigellaIsConfig: DetectionConfig = {
  key: "shigellaIs",
  moduleId: "micro.shigellaIs",
  persistenceType: "shigellaIs",
  title: "Shigella (IS 5887-7)",
  testName: "Isolation and Identification of Shigella",
  media: "Nutrient Broth, Selenite F Broth, and DCA",
  method: "IS:5887(Part-7):1999 RA 2018",
  sections: [
    {
      title: "Enrichment",
      rows: [
        { name: "Growth in Nutrient Broth", characteristics: "Turbidity", temp: "37", time: "24 hrs" },
        { name: "Selenite F Broth", characteristics: "Turbidity", temp: "37", time: "24 hrs" },
        { name: "Kauffmann Muller's Tetrathionate Broth", characteristics: "Turbidity", temp: "37", time: "24 hrs" },
      ],
    },
    {
      title: "DCA before incubation",
      rows: [
        { name: "DCA (from SFB)", characteristics: "Opaque with ground glass appearance and even margin", temp: "37" },
        { name: "DCA (from KMTB)", characteristics: "Opaque with ground glass appearance and even margin", temp: "37" },
      ],
    },
    {
      title: "DCA after incubation",
      rows: [
        { name: "DCA (from SFB)", characteristics: "Opaque with ground glass appearance and even margin", temp: "37" },
        { name: "DCA (from KMTB)", characteristics: "Opaque with ground glass appearance and even margin", temp: "37" },
      ],
    },
    {
      title: "Suspected colonies subculture from DCA",
      rows: [
        { name: "MacConkey Agar (MA)", characteristics: "Pink Colony", temp: "37", time: "24 hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's staining", media: "Nutrient Agar", temp: "37", time: "24hrs." },
        { name: "Motility", media: "Motility Agar", temp: "37", time: "24 hrs or 4 to 6 days" },
        { name: "Test for catalase", media: "Hydrogen Peroxide", temp: "NA" },
        { name: "Test for Oxidase", media: "Oxidase reagent", temp: "NA" },
        { name: "Lactose/Glucose fermentation, H2S Production", media: "TSI agar Medium", temp: "37", time: "7 days" },
        { name: "Urease Production", media: "Urea Agar", temp: "37", time: "24 hrs or 4 days" },
        { name: "Hugh- Leifson's Test", media: "Hugh- Leifson's Test medium", temp: "37", time: "24 hrs or 4 days" },
        { name: "Phenyl Pyruvic acid production", media: "NA, DL-Phenylalanine, Ferric Chloride", temp: "Room temp", time: "3 hrs" },
        { name: "Citrate utilization", media: "Simmon's Citrate Agar", temp: "37", time: "4 days" },
        { name: "Indole production", media: "Peptone water, Kovac's reagent", temp: "37", time: "48hrs" },
        { name: "Gelatin liquefaction", media: "Gelatin liquefaction test medium", temp: "22", time: "4 days" },
        { name: "Malonate utilization", media: "Malonate test medium", temp: "37", time: "24hrs" },
        { name: "Fermentation of 1% Sucrose", media: "1% sucrose", temp: "37", time: "48hrs" },
        { name: "Fermentation of 1% Lactose", media: "1% Lactose", temp: "37", time: "48hrs" },
        { name: "Fermentation of 1% Salicin", media: "1% Salicin", temp: "37", time: "48hrs" },
        { name: "Fermentation of 1% Dulcitol", media: "1% Dulcitol", temp: "37", time: "48hrs" },
        { name: "Fermentation of 1% Mannitol", media: "1% Mannitol", temp: "37", time: "48hrs" },
        { name: "Dihydrolase & Decarboxylase activity (a) Lysine (b) Arginine ( c ) Ornithine", temp: "37", time: "4 days" },
      ],
    },
  ],
};
