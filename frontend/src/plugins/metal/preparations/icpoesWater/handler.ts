import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { icpoesWaterPreparationDefinition } from "./definition";
import type { CalculationIcpOesWater } from "./models/CalculationIcpOesWater";
import type { IcpOesWaterModuleDraft } from "./models/index";
import { calculateIcpOesWater } from "./calculation";

export const ICPOES_WATER_BACKEND_PREPARATION_TYPE = "icpoes_water";
export const ICPOES_WATER_BACKEND_CALCULATION_TYPE = "icpoes_water";

export interface IcpOesWaterValidationResult { valid: boolean; errors: string[]; }

export function validateIcpOesWaterCalculation(calculation: CalculationIcpOesWater): IcpOesWaterValidationResult {
  const errors: string[] = [];
  const required: [string, unknown, boolean][] = [
    ["Instrument Concentration (Sample)", calculation.instrumentConcentrationSample, false],
    ["Instrument Concentration (Blank)", calculation.instrumentConcentrationBlank, false],
    ["Dilution Factor 1 (V1)", calculation.v1, true],
    ["Dilution Factor 2 (V2)", calculation.v2, true],
  ];
  for (const [label, value, positive] of required) {
    if (value === null || value === undefined || String(value).trim() === "") { errors.push(`${label} is required`); continue; }
    const n = Number(value);
    if (!Number.isFinite(n)) errors.push(`${label} must be numeric`);
    else if (positive && n <= 0) errors.push(`${label} must be greater than 0`);
    else if (!positive && n < 0) errors.push(`${label} cannot be negative`);
  }
  return { valid: errors.length === 0, errors };
}

export function runIcpOesWaterCalculation(calculation: CalculationIcpOesWater) {
  return calculateIcpOesWater({
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

export function mapIcpOesWaterDraftToPreparations(draft: IcpOesWaterModuleDraft | undefined) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: ICPOES_WATER_BACKEND_PREPARATION_TYPE,
    assignedStandardId: null,
    steps: JSON.stringify(preparation.steps),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapIcpOesWaterDraftToCalculations(draft: IcpOesWaterModuleDraft | undefined) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: ICPOES_WATER_BACKEND_CALCULATION_TYPE,
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

export function mapIcpOesWaterDraftToFiles(draft: IcpOesWaterModuleDraft | undefined) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: ICPOES_WATER_BACKEND_PREPARATION_TYPE,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapIcpOesWaterDraftToPersistence(draft: IcpOesWaterModuleDraft | undefined) {
  return {
    preparationType: ICPOES_WATER_BACKEND_PREPARATION_TYPE,
    calculationType: ICPOES_WATER_BACKEND_CALCULATION_TYPE,
    activeGroup: "metal.icpoesWater",
    preparations: mapIcpOesWaterDraftToPreparations(draft),
    calculations: mapIcpOesWaterDraftToCalculations(draft),
    files: mapIcpOesWaterDraftToFiles(draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const icpoesWaterPreparationHandler: PreparationHandler = {
  definition: icpoesWaterPreparationDefinition,
  capabilities: {
    collectData: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
    validate: async (context: PreparationContext): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") return { success: false, data: context.data, errors: ["ICP-OES (Water) calculation data is required."], warnings: [] };
      const validation = validateIcpOesWaterCalculation(calculation as CalculationIcpOesWater);
      return { success: validation.valid, data: context.data, errors: validation.errors, warnings: [] };
    },
    calculate: async (context: PreparationContext): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") return { success: false, data: context.data, errors: ["ICP-OES (Water) calculation data is required."], warnings: [] };
      const result = runIcpOesWaterCalculation(calculation as CalculationIcpOesWater);
      return { success: result.success, data: { ...context.data, calculationResult: result.result, calculationResultUnit: result.success ? "mg/L" : null }, errors: result.success ? [] : [result.error ?? "ICP-OES (Water) calculation failed."], warnings: [] };
    },
  },
  execute: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
};
