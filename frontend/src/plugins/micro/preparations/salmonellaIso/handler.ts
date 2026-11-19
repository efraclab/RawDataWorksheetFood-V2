import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { salmonellaIsoConfig } from "./config";

export const salmonellaIsoPreparation = createDetectionPreparation(salmonellaIsoConfig);
export const salmonellaIsoPreparationDefinition = salmonellaIsoPreparation.definition;
export const salmonellaIsoPreparationHandler = salmonellaIsoPreparation.handler;
