import { createResiduePreparation } from "../residue/createResiduePreparation";
import { vitaminBConfig } from "./config";

export const vitaminBPreparation = createResiduePreparation(vitaminBConfig);
export const vitaminBPreparationDefinition = vitaminBPreparation.definition;
export const vitaminBPreparationHandler = vitaminBPreparation.handler;