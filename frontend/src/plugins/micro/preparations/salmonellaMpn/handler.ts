import { createMpnPreparation } from "../mpn/createMpnPreparation";
import { salmonellaMpnConfig } from "./config";

export const salmonellaMpnPreparation = createMpnPreparation(salmonellaMpnConfig);
export const salmonellaMpnPreparationDefinition = salmonellaMpnPreparation.definition;
export const salmonellaMpnPreparationHandler = salmonellaMpnPreparation.handler;
