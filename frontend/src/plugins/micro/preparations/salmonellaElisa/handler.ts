import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { salmonellaElisaConfig } from "./config";

export const salmonellaElisaPreparation = createDetectionPreparation(salmonellaElisaConfig);
export const salmonellaElisaPreparationDefinition = salmonellaElisaPreparation.definition;
export const salmonellaElisaPreparationHandler = salmonellaElisaPreparation.handler;
