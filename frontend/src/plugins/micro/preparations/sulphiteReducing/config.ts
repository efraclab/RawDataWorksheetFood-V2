import type { PlateCountConfig } from "../plateCount/config";

/** Sulphite Reducing Bacteria. Values come from the "Sulphite reducing bacteria" sheet. Only the 48 h rows enter the formula. */
export const sulphiteReducingConfig: PlateCountConfig = {
  key: "sulphiteReducing",
  moduleId: "micro.sulphiteReducing",
  persistenceType: "sulphiteReducing",
  title: "Sulphite Reducing Bacteria",
  testName: "Sulphite Reducing Bacteria",
  media: "Iron Sulphite Agar",
  method: "ISO 15213: 2003",
  incubationTemp: "37",
  incubationTime: "24 / 48",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/10 gm",
  timePoints: [
    { label: "24 h", counted: false },
    { label: "48 h", counted: true },
  ],
};