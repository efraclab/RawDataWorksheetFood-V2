import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { vCholeraeConfig } from "./config";

export const vCholeraePreparation = createDetectionPreparation(vCholeraeConfig);
export const vCholeraePreparationDefinition = vCholeraePreparation.definition;
export const vCholeraePreparationHandler = vCholeraePreparation.handler;
