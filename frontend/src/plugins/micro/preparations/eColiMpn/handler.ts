import { createMpnPreparation } from "../mpn/createMpnPreparation";
import { eColiMpnConfig } from "./config";

export const eColiMpnPreparation = createMpnPreparation(eColiMpnConfig);
export const eColiMpnPreparationDefinition = eColiMpnPreparation.definition;
export const eColiMpnPreparationHandler = eColiMpnPreparation.handler;
