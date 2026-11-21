import { createResiduePreparation } from "../residue/createResiduePreparation";
import { dithiocarbamatesConfig } from "./config";

export const dithiocarbamatesPreparation = createResiduePreparation(dithiocarbamatesConfig);
export const dithiocarbamatesPreparationDefinition = dithiocarbamatesPreparation.definition;
export const dithiocarbamatesPreparationHandler = dithiocarbamatesPreparation.handler;