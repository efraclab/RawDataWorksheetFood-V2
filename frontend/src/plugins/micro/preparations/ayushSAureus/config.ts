import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of Staphylococcus aureus. Values from sheet "76" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ayushSAureusConfig: DetectionConfig = {
  key: "ayushSAureus",
  moduleId: "micro.ayushSAureus",
  persistenceType: "ayushSAureus",
  title: "S. aureus Detection (AYUSH)",
  testName: "Isolation and Detection of Staphylococcus aureus",
  media: "in Soya bean Casein Digest Medium (SCDM), Mannitol Salt Agar (MSA), Baird-Parker Agar (BPA), Vogel-Johnson Agar (VJA)",
  method: "Ayurvedic Pharmacopoeia of India",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Inoculation in Soya bean Casein Digest Medium equivalent to 1g/1ml of the test sample", characteristics: "Turbidity", temp: "35-37" },
        { name: "Inoculation in MSA (from Incubated SCDB)", characteristics: "Yellow Colony surrounded by yellow Zone", temp: "35-37", time: "24-48h" },
        { name: "Inoculation in BPA (from Incubated SCDB)", characteristics: "Black shiny colonies surrounded by clear Zone", temp: "35-37", time: "24-48h" },
        { name: "Inoculation in VJA (from Incubated SCDB)", characteristics: "Black colonies surrounded by yellow Zone", temp: "35-37", time: "24-48h" },
      ],
    },
    {
      title: "From the growth of Mannitol Agar, Baird-Parker Agar, Vogel-Johnson Agar suspected colonies were inoculated in Brain Heart Infusion Broth for Identification & Confirmation Tests",
      rows: [
        { name: "Growth in Brain Heart Infusion Broth", time: "24 hrs" },
        { name: "Gram Staining" },
        { name: "Coagulase Test", time: "3-24 hrs" },
        { name: "Catalase Test" },
      ],
    },
  ],
};
