import { createMpnPreparation } from "../mpn/createMpnPreparation";
import { coliformPresenceConfig } from "./config";

export const coliformPresencePreparation = createMpnPreparation(coliformPresenceConfig);
export const coliformPresencePreparationDefinition = coliformPresencePreparation.definition;
export const coliformPresencePreparationHandler = coliformPresencePreparation.handler;
