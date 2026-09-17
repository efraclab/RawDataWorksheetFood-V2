import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { meropenemPreparationDefinition } from "./definition";
import type { CalculationMeropenem } from "./models/CalculationMeropenem";
import type { MeropenemModuleDraft } from "./models/index";
import { calculateMeropenem } from "./calculation";

export const MEROPENEM_BACKEND_PREPARATION_TYPE = "meropenem";
export const MEROPENEM_BACKEND_CALCULATION_TYPE = "meropenem";

export interface MeropenemValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateMeropenemCalculation(calculation: CalculationMeropenem): MeropenemValidationResult {
  const required: Array<[string, unknown]> = [["Instrument Concentration (Sample)",calculation.instrumentConcentrationSample],["Instrument Concentration (Blank)",calculation.instrumentConcentrationBlank],["V1 factor",calculation.v2Factor],["V1 volume",calculation.v2Volume],["V2 factor",calculation.v3Factor],["V2 volume",calculation.v3Volume],["Label Claim",calculation.labelClaimValue]];
  const errors:string[]=[];
  for(const [label,value] of required){if(value===null||value===undefined||String(value).trim()===''||!Number.isFinite(Number(value)))errors.push(`${label} is required and must be numeric`);}
  return {valid:errors.length===0,errors};
}

export function runMeropenemCalculation(calculation: CalculationMeropenem) {
  return calculateMeropenem({sample:calculation.instrumentConcentrationSample,blank:calculation.instrumentConcentrationBlank,v1Factor:calculation.v2Factor,v1Volume:calculation.v2Volume,v2Factor:calculation.v3Factor,v2Volume:calculation.v3Volume,labelClaim:calculation.labelClaimValue});
}

export function mapMeropenemDraftToPreparations(draft: MeropenemModuleDraft | undefined) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: MEROPENEM_BACKEND_PREPARATION_TYPE,
    assignedStandardId: null,
    steps: JSON.stringify(preparation.steps),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapMeropenemDraftToCalculations(draft: MeropenemModuleDraft | undefined) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: MEROPENEM_BACKEND_CALCULATION_TYPE,
    selectedSamplePreparationLabel: calculation.selectedSamplePreparationLabel,
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit: calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    v1: calculation.v1,
    v1Unit: calculation.v1Unit,
    v2Factor: calculation.v2Factor,
    v2Volume: calculation.v2Volume,
    v2VolumeUnit: calculation.v2VolumeUnit,
    v3Factor: calculation.v3Factor,
    v3Volume: calculation.v3Volume,
    v3VolumeUnit: calculation.v3VolumeUnit,
    v4Factor: calculation.v4Factor,
    v4Volume: calculation.v4Volume,
    v4VolumeUnit: calculation.v4VolumeUnit,
    avgWeight: calculation.avgWeight,
    avgWeightUnit: calculation.avgWeightUnit,
    labelClaimBase: calculation.labelClaimBase,
    labelClaimValue: calculation.labelClaimValue,
    acceptanceLimitMin: calculation.acceptanceLimitMin,
    acceptanceLimitMax: calculation.acceptanceLimitMax,
    calculationResult: calculation.calculationResult,
    calculationResultUnit: calculation.calculationResultUnit,
  }));
}

export function mapMeropenemDraftToFiles(draft: MeropenemModuleDraft | undefined) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: MEROPENEM_BACKEND_PREPARATION_TYPE,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapMeropenemDraftToPersistence(draft: MeropenemModuleDraft | undefined) {
  return {
    preparationType: MEROPENEM_BACKEND_PREPARATION_TYPE,
    calculationType: MEROPENEM_BACKEND_CALCULATION_TYPE,
    activeGroup: "metal.meropenem",
    preparations: mapMeropenemDraftToPreparations(draft),
    calculations: mapMeropenemDraftToCalculations(draft),
    files: mapMeropenemDraftToFiles(draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const meropenemPreparationHandler: PreparationHandler = {
  definition: meropenemPreparationDefinition,
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
          errors: ["Meropenem calculation data is required."],
          warnings: [],
        };
      }
      const validation = validateMeropenemCalculation(calculation as CalculationMeropenem);
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
          errors: ["Meropenem calculation data is required."],
          warnings: [],
        };
      }
      const result = runMeropenemCalculation(calculation as CalculationMeropenem);
      return {
        success: result.success,
        data: {
          ...context.data,
          calculationResult: result.result,
          calculationResultUnit: result.success ? "%" : null,
        },
        errors: result.success ? [] : [result.error ?? "Meropenem calculation failed."],
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
