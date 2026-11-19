import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { icpoesPreparationDefinition } from "./definition";
import type { CalculationIcpOes } from "./models/CalculationIcpOes";
import type { IcpOesModuleDraft } from "./models/index";
import { calculateIcpOes } from "./calculation";

export const ICPOES_BACKEND_PREPARATION_TYPE = "icpoes";
export const ICPOES_BACKEND_CALCULATION_TYPE = "icpoes";

export interface IcpOesValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateIcpOesCalculation(
  calculation: CalculationIcpOes,
): IcpOesValidationResult {
  const errors: string[] = [];

  const required = [
    ["Instrument Concentration (Sample)", calculation.instrumentConcentrationSample, false],
    ["Instrument Concentration (Blank)", calculation.instrumentConcentrationBlank, false],
    ["Sample Weight", calculation.sw1, true],
    ["Volume Makeup", calculation.v1, true],
    ["Dilution Factor 1", calculation.v2, true],
    ["Dilution Factor 2", calculation.v3, true],
  ] as const;

  for (const [label, value, positive] of required) {
    if (value === null || value === undefined || String(value).trim() === "") {
      errors.push(`${label} is required`);
      continue;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      errors.push(`${label} must be numeric`);
      continue;
    }

    if (positive && numeric <= 0) {
      errors.push(`${label} must be greater than 0`);
    }

    if (!positive && numeric < 0) {
      errors.push(`${label} cannot be negative`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function runIcpOesCalculation(calculation: CalculationIcpOes) {
  return calculateIcpOes({
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    sampleWeight: calculation.sw1,
    volumeMakeup: calculation.v1,
    dilutionFactor1: calculation.v2,
    dilutionFactor2: calculation.v3,
  });
}

/** Convert the module draft into the existing worksheet persistence shape. */
export function mapIcpOesDraftToPreparations(draft: IcpOesModuleDraft | undefined) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: ICPOES_BACKEND_PREPARATION_TYPE,
    assignedStandardId: null,
    steps: JSON.stringify(preparation.steps),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapIcpOesDraftToCalculations(draft: IcpOesModuleDraft | undefined) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: ICPOES_BACKEND_CALCULATION_TYPE,
    selectedSamplePreparationLabel: calculation.selectedSamplePreparationLabel,
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit: calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    sw1: calculation.sw1,
    v1: calculation.v1,
    v2: calculation.v2,
    v3: calculation.v3,
    calculationResult: calculation.calculationResult,
    calculationResultUnit: calculation.calculationResultUnit,
  }));
}

export function mapIcpOesDraftToFiles(draft: IcpOesModuleDraft | undefined) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: ICPOES_BACKEND_PREPARATION_TYPE,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapIcpOesDraftToPersistence(draft: IcpOesModuleDraft | undefined) {
  return {
    preparationType: ICPOES_BACKEND_PREPARATION_TYPE,
    calculationType: ICPOES_BACKEND_CALCULATION_TYPE,
    activeGroup: "metal.icpoes",
    preparations: mapIcpOesDraftToPreparations(draft),
    calculations: mapIcpOesDraftToCalculations(draft),
    files: mapIcpOesDraftToFiles(draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const icpoesPreparationHandler: PreparationHandler = {
  definition: icpoesPreparationDefinition,
  capabilities: {
    collectData: async (context: PreparationContext): Promise<PreparationResult> => ({
      success: true,
      data: context.data,
      errors: [],
      warnings: [],
    }),

    validate: async (context: PreparationContext): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") {
        return {
          success: false,
          data: context.data,
          errors: ["ICP-OES calculation data is required."],
          warnings: [],
        };
      }

      const validation = validateIcpOesCalculation(calculation as CalculationIcpOes);
      return {
        success: validation.valid,
        data: context.data,
        errors: validation.errors,
        warnings: [],
      };
    },

    calculate: async (context: PreparationContext): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") {
        return {
          success: false,
          data: context.data,
          errors: ["ICP-OES calculation data is required."],
          warnings: [],
        };
      }

      const result = runIcpOesCalculation(calculation as CalculationIcpOes);
      return {
        success: result.success,
        data: {
          ...context.data,
          calculationResult: result.result,
          calculationResultUnit: result.success ? "mg/Kg" : null,
        },
        errors: result.success ? [] : [result.error ?? "ICP-OES calculation failed."],
        warnings: [],
      };
    },
  },

  execute: async (context: PreparationContext): Promise<PreparationResult> => ({
    success: true,
    data: context.data,
    errors: [],
    warnings: [],
  }),
};
