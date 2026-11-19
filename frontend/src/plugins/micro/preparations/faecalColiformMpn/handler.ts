import { createMpnPreparation } from "../mpn/createMpnPreparation";
import { faecalColiformMpnConfig } from "./config";

export const faecalColiformMpnPreparation = createMpnPreparation(faecalColiformMpnConfig);
export const faecalColiformMpnPreparationDefinition = faecalColiformMpnPreparation.definition;
export const faecalColiformMpnPreparationHandler = faecalColiformMpnPreparation.handler;
