import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateGCV } from "./calculation";

export const gcvConfig: SimpleEnvironmentConfig = {
  shortName: "GCV",
  title: "GCV - Gross Calorific Value Analysis",
  subtitle: "Environment Laboratory \u2022 Coal Testing",
  preparationType: "gcv",
  calculationType: "gcv",
  formula: "GCV = [(EN \u00d7 \u03b8 \u2212 Qfuse \u2212 Qing \u2212 Qn \u2212 M2 \u00d7 qv2) / M1] \u2212 (Qs / M1)",
  resultUnit: "J/g",
  fields: [
    { key: "en", name: "Mean value of effective heat capacity", symbol: "EN", unit: "J/K" },
    { key: "qs", name: "Correction expressed in joules, taking sulfur from aqueous H\u2082SO\u2084 to gaseous SO\u2082", symbol: "Qs", unit: "J" },
    { key: "m1", name: "Mass of fuel", symbol: "M1", unit: "gm" },
    { key: "m2", name: "Mass of combustion aid, if relevant", symbol: "M2", unit: "gm" },
    { key: "qv2", name: "GCV at constant volume of combustion aid, if relevant", symbol: "qv2", unit: "J/g" },
    { key: "qfuse", name: "Contribution from combustion fuse", symbol: "Qfuse", unit: "J" },
    { key: "qing", name: "Contribution from oxidation of ignition wire", symbol: "Qing", unit: "J" },
    { key: "qn", name: "Contribution from formation of nitric acid from liq water & gaseous nitrogen and oxygen", symbol: "Qn", unit: "J" },
    { key: "theta", name: "Corrected temperature rise expressed in kelvins", symbol: "\u03b8", unit: "K" },
  ],
  calculate: (values) => calculateGCV(values as any),
};
