import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { listeriaIsoConfig } from "./config";

export const listeriaIsoPreparation = createDetectionPreparation(listeriaIsoConfig);
export const listeriaIsoPreparationDefinition = listeriaIsoPreparation.definition;
export const listeriaIsoPreparationHandler = listeriaIsoPreparation.handler;
