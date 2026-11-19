import type { PlateCountConfig } from "../plateCount/config";

/** Thermophilic Acidophilic Bacteria. Values come from the upper section of the "Acidophilic bacteria" sheet. */
export const acidophilicConfig: PlateCountConfig = {
  key: "acidophilic",
  moduleId: "micro.acidophilic",
  persistenceType: "acidophilic",
  title: "Thermophilic Acidophilic Count",
  testName: "Thermophilic Acidophilic Bacteria",
  media: "K Agar, Potato Dextrose Agar",
  method: "APHA 5th Edition, Chapter 25",
  incubationTemp: "43",
  incubationTime: "72",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
  replicateCount: 3,
  confirmationTests: [
    { name: "Inoculation on Potato Dextrose Agar", temp: "43", time: "5 days" },
    { name: "Inoculation on K agar", temp: "43", time: "3 days" },
  ],
};