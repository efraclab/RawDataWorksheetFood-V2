import type { PlateCountConfig } from "../plateCount/config";

/** Bacillus cereus. Values come from the "B.cereus" sheet. Only the 48 h rows enter the formula. */
export const bCereusConfig: PlateCountConfig = {
  key: "bCereus",
  moduleId: "micro.bCereus",
  persistenceType: "bCereus",
  title: "B. cereus",
  testName: "Enumeration and Confirmation of Bacillus cereus",
  media: "MYP Agar, Sheep Blood Agar",
  method: "IS 5887 (Part 6) : 2012 RA 2018",
  incubationTemp: "30",
  incubationTime: "24 / 48",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
  inoculationLabel: "Inoculation Volume for Spread Plate (ml)",
  extraTextSteps: ["Petriplate Size"],
  timePoints: [
    { label: "24 h", counted: false },
    { label: "48 h", counted: true },
  ],
  plateRecords: {
    replicates: 2,
    plates: 3,
    columnLabels: ["10⁰", "10⁻¹", "10⁻²", "10⁻³", "10⁻⁴", "10⁻⁵", "10⁻⁶", "10⁻⁷"],
  },
  confirmationTests: [
    { name: "Haemolysis on blood agar", media: "Blood agar", temp: "30", time: "24 hrs" },
  ],
};