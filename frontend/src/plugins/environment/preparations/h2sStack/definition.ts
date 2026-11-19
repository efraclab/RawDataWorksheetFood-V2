import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import H2SStackPreparationModule from "./components/H2SStackPreparationModule";

export const h2sStackPreparationDefinition: PreparationDefinition = {
  id: "environment.h2sStack",
  name: "H\u2082S in Stack",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Hydrogen sulphide concentration in stack gas with dry-gas correction for barometric pressure and aqueous tension.",
  version: "1.0.0",
  metadata: {
    ui: { title: "H\u2082S in Stack Analysis", component: H2SStackPreparationModule },
    persistence: { preparationType: "h2sStack", calculationType: "h2sStack" },
  },
};
