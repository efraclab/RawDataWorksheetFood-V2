import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateSoilGypsumRequirement } from "./calculation";

export const soilGypsumRequirementConfig: SimpleEnvironmentConfig = {
  shortName: "Soil (gypsum requirement)",
  title: "Soil (Gypsum Requirement) Analysis",
  subtitle: "Environment Laboratory \u2022 Soil Testing",
  preparationType: "soilGypsumRequirement",
  calculationType: "gypsum",
  formula: "Content in soil gypsum requirement (tonnes/ha) = (A \u2212 B) \u00d7 N \u00d7 382",
  resultUnit: "tonnes/ha",
  fields: [
    { key: "a", name: "EDTA (versenate) used for blank titration", symbol: "A", unit: "ml" },
    { key: "b", name: "EDTA used for soil extract", symbol: "B", unit: "ml" },
    { key: "n", name: "Normality of EDTA solution", symbol: "N", unit: "" },
  ],
  calculate: (values) => calculateSoilGypsumRequirement(values as any),
};
