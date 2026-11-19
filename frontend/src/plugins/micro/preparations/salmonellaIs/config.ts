import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of Salmonella. Values from sheet "26" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const salmonellaIsConfig: DetectionConfig = {
  key: "salmonellaIs",
  moduleId: "micro.salmonellaIs",
  persistenceType: "salmonellaIs",
  title: "Salmonella (IS 5887)",
  testName: "Isolation and Detection of Salmonella",
  media: "Buffered Peptone Water, RV Medium, Selenite Cystine Medium (FSCM), Brilliant Green Phenol Red Lactose Agar (BGPRLA), and Bismuth Sulphite Agar (BSA)",
  method: "IS 5887(Part-3):1999 RA 2018",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Buffered Peptone Water", characteristics: "Turbidity", temp: "37", time: "20 Hrs" },
        { name: "Selenite Cystine Medium(SCM)", characteristics: "Turbidity", temp: "37", time: "24 Hrs" },
        { name: "Selenite Cystine Medium(SCM)", characteristics: "Turbidity", temp: "37", time: "48 Hrs" },
        { name: "RV Medium", characteristics: "Turbidity", temp: "42", time: "24 Hrs" },
        { name: "BGPRLA", characteristics: "Red or slightly pink white opaque with red surroundings", temp: "37", time: "48 Hrs" },
        { name: "BSA", characteristics: "Black or green colony", temp: "37", time: "48 Hrs" },
        { name: "BGPRLA (After 24 hrs from SCM)", characteristics: "Red or slightly pink white opaque with red surroundings", temp: "37", time: "48 Hrs" },
        { name: "BSA (After 24 hrs from SCM)", characteristics: "Black or green colony", temp: "37", time: "48 Hrs" },
        { name: "BGPRLA (After 48 hrs from SCM)", characteristics: "Red or slightly pink white opaque with red surroundings", temp: "37", time: "48 Hrs" },
        { name: "BSA (After 48 hrs from SCM)", characteristics: "Black or green colony", temp: "37", time: "48 Hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's staining", media: "Gram's staining reagent", temp: "-" },
        { name: "Lactose/Glucose/ sucrose fermentation,H2S Production (TSI Agar)", media: "Triple sugar Iron agar Medium", temp: "37", time: "24 Hrs" },
        { name: "Urease Production", media: "Urea Agar", temp: "37", time: "24 Hrs" },
        { name: "L-Lysine decarboxylase", media: "L-Lysine Decarboxylation Medium", temp: "37", time: "24 Hrs" },
        { name: "β- galactosidase detection", media: "β- galactosidase reagent", temp: "37", time: "24 Hrs" },
        { name: "Voges-Proskauer Reaction", media: "MR-VP Medium", temp: "37", time: "24 Hrs" },
        { name: "Indole production", media: "Tryptone broth, Kovac's reagent", temp: "37", time: "24 Hrs" },
        { name: "Examination for O-Antigen", media: "Anti O-Serum", temp: "-" },
        { name: "Examination for H-Antigen", media: "Anti H-Serum", temp: "-" },
        { name: "Examination for Vi-Antigen", media: "Anti Vi-Serum", temp: "-" },
      ],
    },
  ],
};
