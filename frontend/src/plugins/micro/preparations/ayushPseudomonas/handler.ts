import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { ayushPseudomonasConfig } from "./config";

export const ayushPseudomonasPreparation = createDetectionPreparation(ayushPseudomonasConfig);
export const ayushPseudomonasPreparationDefinition = ayushPseudomonasPreparation.definition;
export const ayushPseudomonasPreparationHandler = ayushPseudomonasPreparation.handler;
