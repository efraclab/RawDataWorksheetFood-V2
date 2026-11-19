import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { eColiO157Config } from "./config";

export const eColiO157Preparation = createDetectionPreparation(eColiO157Config);
export const eColiO157PreparationDefinition = eColiO157Preparation.definition;
export const eColiO157PreparationHandler = eColiO157Preparation.handler;
