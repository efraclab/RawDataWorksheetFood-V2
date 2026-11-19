import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { icpmsWaterPreparationDefinition } from "./definition";
import type { CalculationIcpmsWater } from "./models/CalculationIcpmsWater";
import type { IcpmsWaterModuleDraft } from "./models/index";
import { calculateIcpmsWater } from "./calculation";

export const ICPMS_WATER_BACKEND_PREPARATION_TYPE = "icpms_water";
export const ICPMS_WATER_BACKEND_CALCULATION_TYPE = "icpms_water";

export interface IcpmsWaterValidationResult { valid: boolean; errors: string[]; }

export function validateIcpmsWaterCalculation(calculation: CalculationIcpmsWater): IcpmsWaterValidationResult {
  const errors: string[] = [];
  const required = [
    ["Instrument Concentration (Sample)", calculation.instrumentConcentrationSample, true],
    ["Instrument Concentration (Blank)", calculation.instrumentConcentrationBlank, true],
    ["Dilution Factor 1 (V1)", calculation.v1, false],
    ["Dilution Factor 2 (V2)", calculation.v2, false],
  ] as const;
  for (const [label, value, allowZero] of required) {
    if (value === null || value === undefined || String(value).trim() === "") { errors.push(`${label} is required`); continue; }
    const n = Number(value);
    if (!Number.isFinite(n)) { errors.push(`${label} must be numeric`); continue; }
    if (!allowZero && n <= 0) errors.push(`${label} must be greater than 0`);
    if (allowZero && n < 0) errors.push(`${label} cannot be negative`);
  }
  return { valid: errors.length === 0, errors };
}

export function runIcpmsWaterCalculation(calculation: CalculationIcpmsWater) {
  return calculateIcpmsWater({
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit: calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    dilutionFactor1: calculation.v1,
    dilutionFactor1Unit: calculation.v1Unit,
    dilutionFactor2: calculation.v2,
    dilutionFactor2Unit: calculation.v2Unit,
  });
}

export function mapIcpmsWaterDraftToPreparations(draft: IcpmsWaterModuleDraft | undefined) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: ICPMS_WATER_BACKEND_PREPARATION_TYPE,
    assignedStandardId: null,
    steps: JSON.stringify(preparation.steps),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapIcpmsWaterDraftToCalculations(draft: IcpmsWaterModuleDraft | undefined) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: ICPMS_WATER_BACKEND_CALCULATION_TYPE,
    selectedSamplePreparationLabel: calculation.selectedSamplePreparationLabel,
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit: calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    v1: calculation.v1,
    v1Unit: calculation.v1Unit,
    v2: calculation.v2,
    v2Unit: calculation.v2Unit,
    acceptanceLimitMin: calculation.acceptanceLimitMin,
    acceptanceLimitMax: calculation.acceptanceLimitMax,
    calculationResult: calculation.calculationResult,
    calculationResultUnit: calculation.calculationResultUnit,
  }));
}

export function mapIcpmsWaterDraftToFiles(draft: IcpmsWaterModuleDraft | undefined) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: ICPMS_WATER_BACKEND_PREPARATION_TYPE,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapIcpmsWaterDraftToPersistence(draft: IcpmsWaterModuleDraft | undefined) {
  return {
    preparationType: ICPMS_WATER_BACKEND_PREPARATION_TYPE,
    calculationType: ICPMS_WATER_BACKEND_CALCULATION_TYPE,
    activeGroup: "metal.icpmsWater",
    preparations: mapIcpmsWaterDraftToPreparations(draft),
    calculations: mapIcpmsWaterDraftToCalculations(draft),
    files: mapIcpmsWaterDraftToFiles(draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const icpmsWaterPreparationHandler: PreparationHandler = {
  definition: icpmsWaterPreparationDefinition,
  capabilities: {
    collectData: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
    validate: async (context: PreparationContext): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") return { success: false, data: context.data, errors: ["ICP-MS (Water) calculation data is required."], warnings: [] };
      const validation = validateIcpmsWaterCalculation(calculation as CalculationIcpmsWater);
      return { success: validation.valid, data: context.data, errors: validation.errors, warnings: [] };
    },
    calculate: async (context: PreparationContext): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") return { success: false, data: context.data, errors: ["ICP-MS (Water) calculation data is required."], warnings: [] };
      const result = runIcpmsWaterCalculation(calculation as CalculationIcpmsWater);
      return {
        success: result.success,
        data: { ...context.data, calculationResult: result.result, calculationResultUnit: result.success ? "mg/L" : null },
        errors: result.success ? [] : [result.error ?? "ICP-MS (Water) calculation failed."],
        warnings: [],
      };
    },
  },
  execute: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
};
