import type { DetectionConfig } from "../detection/config";

/**
 * Shigella/250 ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 37 °C/24 hrs, 37 °C/48 hrs
 */
export const pdwShigellaConfig: DetectionConfig = {
  key: "pdwShigella",
  moduleId: "micro.pdwShigella",
  persistenceType: "pdwShigella",
  title: "PDW Shigella/250 ml (IS 5887-7)",
  testName: "Shigella/250 ml (Packaged Drinking Water)",
  media: "Nutrient Broth, Selenite F Broth, Kauffmann Muller's Tetrathionate Broth, DCA, MA",
  method: "IS:5887(Part-7):1999 RA 2018",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "37 °C/24 hrs, 37 °C/48 hrs" }],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Growth in Nutrient Broth", characteristics: "Turbidity" },
        { name: "Selenite F Broth", characteristics: "Turbidity" },
        { name: "Kauffmann Muller's Tetrathionate Broth", characteristics: "Turbidity" },
        { name: "DCA (after incubation from NB)", characteristics: "Opaque with ground glass appearance and even margin" },
        { name: "DCA (after incubation from SFB)", characteristics: "Opaque with ground glass appearance and even margin" },
        { name: "DCA (after incubation from KMTB)", characteristics: "Opaque with ground glass appearance and even margin" },
        { name: "MacConkey Agar (MA) from DCA", characteristics: "Pink Colony" },
      ],
    },
    {
      title: "Biochemical Confirmation (select at least 5 suspected colonies from MA)",
      rows: [
        { name: "Gram Staining", media: "Nutrient Agar", temp: "37", time: "24 hrs" },
        { name: "Motility", media: "Motility Agar", temp: "37", time: "24 hrs or 4 days" },
        { name: "Test For Catalase", media: "Hydrogen Peroxide", temp: "NA" },
        { name: "Test For Oxidase", media: "Oxidase Reagent", temp: "NA" },
        { name: "Lactose/Glucose Fermentation, H2S Production", media: "Triple sugar agar Medium", temp: "37", time: "24 hrs" },
        { name: "Urea Production", media: "Urea Agar", temp: "37", time: "24 hrs or 4 days" },
        { name: "Hugh-Leifson's Test", media: "Hugh-Leifson's Test Medium", temp: "37", time: "24 hrs or 4 days" },
        { name: "Phenyl Pyruvic Acid Production", media: "DL-Phenylalanine, Ferric Chloride", temp: "Room temperature", time: "3 hrs" },
        { name: "Citrate Utilization", media: "Simmons's Citrate Agar", temp: "37", time: "4 days" },
        { name: "Indole Production", media: "Tryptone Broth, Kovac's Reagent", temp: "37", time: "48 hrs" },
        { name: "Gelatin Liquefaction", media: "Gelatin Liquefaction test Medium", temp: "22", time: "4 days" },
        { name: "Malonate Utilization", media: "Malonate test Medium", temp: "37", time: "24 hrs" },
        { name: "Fermentation Of 1% Sucrose", media: "Peptone Water with 1% Sucrose", temp: "37", time: "24 hrs" },
        { name: "Fermentation Of 1% Lactose", media: "Peptone Water with 1% Lactose", temp: "37", time: "24 hrs" },
        { name: "Fermentation Of 1% Salicin", media: "Peptone Water with 1% Salicin", temp: "37", time: "24 hrs" },
        { name: "Fermentation Of 1% Dulcitol", media: "Peptone Water with 1% Dulcitol", temp: "37", time: "24 hrs" },
        { name: "Fermentation Of 1% Mannitol", media: "Peptone Water with 1% Mannitol", temp: "37", time: "24 hrs" },
        { name: "Lysine", media: "L-Lysine Decarboxylase Medium", temp: "37", time: "4 days" },
        { name: "Arginine", media: "Arginine Dihydrolase Medium", temp: "37", time: "4 days" },
        { name: "Ornithine", media: "Decarboxylase Medium", temp: "37", time: "4 days" },
      ],
    },
  ],
};
