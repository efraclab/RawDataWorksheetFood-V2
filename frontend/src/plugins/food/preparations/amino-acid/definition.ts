import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import AminoAcidPreparationModule from "./components/AminoAcidPreparationModule.tsx";

export const aminoacidPreparationDefinition: PreparationDefinition = {
  id: "food.amino-acid",
  name: "Amino Acid",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Amino Acid preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Amino Acid",
      component: AminoAcidPreparationModule,
    },
    persistence: {
      preparationType: "aminoAcid",
      calculationType: "aminoAcid",
    },
  },
};
