import type { PlateCountConfig } from "../plateCount/config";

/** Coagulase positive Staphylococci. Values come from the "S.aureus" sheet. Only the 48 h rows enter the formula. */
export const sAureusConfig: PlateCountConfig = {
  key: "sAureus",
  moduleId: "micro.sAureus",
  persistenceType: "sAureus",
  title: "S. aureus",
  testName: "Enumeration of coagulase positive Staphylococci (Staphylococcus aureus)",
  media: "",
  method: "",
  incubationTemp: "37",
  incubationTime: "24 / 48",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
  inoculationLabel: "Inoculation Volume for Spread Plate (ml)",
  extraTextSteps: ["Petriplate Size", { name: "Positive Control", value: "Black colonies with zone" }],
  timePoints: [
    { label: "24 h", counted: false },
    { label: "48 h", counted: true },
  ],
  plateRecords: {
    replicates: 2,
    plates: 3,
    columnLabels: ["10⁰", "10⁻¹", "10⁻²", "10⁻³", "10⁻⁴", "10⁻⁵", "Blank"],
  },
  confirmationTests: [
    { name: "Inoculation into Brain Heart Infusion Broth", media: "Brain Heart Infusion Broth", temp: "37", time: "24 h" },
    { name: "Grams staining", media: "Grams staining reagent", temp: "-", time: "-" },
    { name: "Coagulase Test", media: "Rabbit Plasma", temp: "37", time: "4-6 h" },
  ],
};