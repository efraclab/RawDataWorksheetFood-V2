import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { ipPseudomonasConfig } from "./config";

export const ipPseudomonasPreparation = createDetectionPreparation(ipPseudomonasConfig);
export const ipPseudomonasPreparationDefinition = ipPseudomonasPreparation.definition;
export const ipPseudomonasPreparationHandler = ipPseudomonasPreparation.handler;
