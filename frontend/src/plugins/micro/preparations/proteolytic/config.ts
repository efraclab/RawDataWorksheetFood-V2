import type { PlateCountConfig } from "../plateCount/config";

/** Proteolytic Bacterial Count. Values come from the "Proteolytic bacterial count" sheet. */
export const proteolyticConfig: PlateCountConfig = {
  key: "proteolytic",
  moduleId: "micro.proteolytic",
  persistenceType: "proteolytic",
  title: "Proteolytic Count",
  testName: "Proteolytic Bacterial Count",
  media: "Nutrient Agar with Skimmed Milk",
  method: "IS: 4251:1967, RA 2015",
  incubationTemp: "37",
  incubationTime: "48",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/10 gm",
};