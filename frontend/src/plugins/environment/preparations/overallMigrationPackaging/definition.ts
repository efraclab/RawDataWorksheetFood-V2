import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import OverallMigrationPackagingPreparationModule from "./components/OverallMigrationPackagingPreparationModule";

export const overallMigrationPackagingPreparationDefinition: PreparationDefinition = {
  id: "environment.overallMigrationPackaging",
  name: "Overall migration (packaging)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Overall Migration (Packaging) Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Overall migration (packaging) Analysis", component: OverallMigrationPackagingPreparationModule },
    persistence: { preparationType: "overallMigrationPackaging", calculationType: "overallMigration" },
  },
};
