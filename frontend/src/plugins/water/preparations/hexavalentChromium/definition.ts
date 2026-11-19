import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import HexavalentChromiumPreparationModule from "./components/HexavalentChromiumPreparationModule";

export const hexavalentChromiumPreparationDefinition: PreparationDefinition = {
  id: "water.hexavalentChromium",
  name: "Hexavalent Chromium (as Cr6+)",
  pluginId: "water",
  laboratory: "Water",
  description: "HexavalentChromium concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Hexavalent Chromium (as Cr6+) Analysis",
      component: HexavalentChromiumPreparationModule,
    },
    persistence: {
      preparationType: "hexavalentChromium",
      calculationType: "hexavalentChromium",
    },
  },
};
