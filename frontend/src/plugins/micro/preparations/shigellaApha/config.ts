import type { DetectionConfig } from "../detection/config";

/** Isolation and Identification of Shigella. Values from sheet "38" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const shigellaAphaConfig: DetectionConfig = {
  key: "shigellaApha",
  moduleId: "micro.shigellaApha",
  persistenceType: "shigellaApha",
  title: "Shigella (APHA)",
  testName: "Isolation and Identification of Shigella",
  media: "Shigella Broth/ GN broth, XLDA, and DCA",
  method: "APHA 5th Edition. Chapter-37",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Shigella Broth / GN broth", characteristics: "Turbidity", temp: "37", time: "16-20 hrs" },
        { name: "Hektoen Agar", characteristics: "Green colour colony", temp: "37", time: "48 hrs" },
        { name: "DCA (inoculation after incubation of liquid medium)", characteristics: "Reddish", temp: "37", time: "48 hrs" },
        { name: "XLDA", characteristics: "Translucent and reddish", temp: "37", time: "24 hrs" },
        { name: "MA", characteristics: "Light pink (non lactose fermentor) colony", temp: "37", time: "24 hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's staining", media: "Nutrient Agar", temp: "37", time: "24 hrs" },
        { name: "Motility", media: "Motility Agar", temp: "37", time: "24 hrs" },
        { name: "Test for catalase", media: "Hydrogen Peroxide", temp: "NA" },
        { name: "Test for Oxidase", media: "Oxidase reagent", temp: "NA" },
        { name: "Lactose/Glucose fermentation, H2S Production", media: "TSI agar Medium", temp: "37", time: "7 days" },
        { name: "Urease Production", media: "Urea Agar", temp: "37", time: "24 hrs or 4 days" },
        { name: "Hugh- Leifson's Test", media: "Hugh- Leifson's Test medium", temp: "37", time: "24 hrs or 4 days" },
        { name: "Phenyl Pyruvic acid production", media: "NA, DL-Phenylalanine, Ferric Chloride", temp: "Room temp", time: "3 hrs" },
        { name: "Citrate utilization", media: "Simmon's Citrate Agar", temp: "37", time: "4 days" },
        { name: "Indole production", media: "Peptone water, Kovac's reagent", temp: "37", time: "48hrs" },
        { name: "Methyl red test", media: "MRVP Medium", temp: "35", time: "96hrs" },
        { name: "Voges-Proskauer Reaction", media: "MRVP Medium", temp: "35", time: "48hrs" },
        { name: "KCN broth", media: "KCN broth", temp: "35", time: "48hrs" },
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
