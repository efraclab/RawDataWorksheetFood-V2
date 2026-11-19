import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateOverallMigrationPackaging } from "./calculation";

export const overallMigrationPackagingConfig: SimpleEnvironmentConfig = {
  shortName: "Overall migration (packaging)",
  title: "Overall Migration (Packaging) Analysis",
  subtitle: "Environment Laboratory \u2022 Packaging Testing",
  preparationType: "overallMigrationPackaging",
  calculationType: "overallMigration",
  formula: "Amount of extract (EX) = (M / A) \u00d7 100",
  resultUnit: "mg/dm\u00b2",
  fields: [
    { key: "m", name: "Mass of residue minus blank value", symbol: "M", unit: "mg" },
    { key: "a", name: "Total surface area exposed in each replicate", symbol: "A", unit: "cm\u00b2" },
  ],
  calculate: (values) => calculateOverallMigrationPackaging(values as any),
};
