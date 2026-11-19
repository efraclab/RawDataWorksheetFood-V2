import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwPseudomonasConfig } from "./config";

export const pdwPseudomonasPreparation = createDetectionPreparation(pdwPseudomonasConfig);
export const pdwPseudomonasPreparationDefinition = pdwPseudomonasPreparation.definition;
export const pdwPseudomonasPreparationHandler = pdwPseudomonasPreparation.handler;
