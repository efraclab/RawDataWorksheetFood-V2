import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { ayushEColiConfig } from "./config";

export const ayushEColiPreparation = createDetectionPreparation(ayushEColiConfig);
export const ayushEColiPreparationDefinition = ayushEColiPreparation.definition;
export const ayushEColiPreparationHandler = ayushEColiPreparation.handler;
