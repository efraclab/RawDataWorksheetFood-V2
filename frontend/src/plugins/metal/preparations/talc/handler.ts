import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { talcPreparationDefinition } from "./definition";
import type { CalculationTalc } from "./models/CalculationTalc";
import type { TalcModuleDraft } from "./models/index";
import { calculateTalc } from "./calculation";

export const TALC_BACKEND_PREPARATION_TYPE = "talc";
export const TALC_BACKEND_CALCULATION_TYPE = "talc";

export interface TalcValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTalcCalculation(calculation: CalculationTalc): TalcValidationResult {
  const required: Array<[string, unknown]> = [["Instrument Concentration (Sample)",calculation.instrumentConcentrationSample],["Instrument Concentration (Blank)",calculation.instrumentConcentrationBlank],["Weight of Sample",calculation.sw1],["V1 factor",calculation.v2Factor],["V1 volume",calculation.v2Volume],["V2 factor",calculation.v3Factor],["V2 volume",calculation.v3Volume]];
  const errors:string[]=[];
  for(const [label,value] of required){if(value===null||value===undefined||String(value).trim()===''||!Number.isFinite(Number(value)))errors.push(`${label} is required and must be numeric`);}
  return {valid:errors.length===0,errors};
}

export function runTalcCalculation(calculation: CalculationTalc) {
  return calculateTalc({sample:calculation.instrumentConcentrationSample,blank:calculation.instrumentConcentrationBlank,v1Factor:calculation.v2Factor,v1Volume:calculation.v2Volume,v2Factor:calculation.v3Factor,v2Volume:calculation.v3Volume,sampleWeight:calculation.sw1,x1:1});
}

export function mapTalcDraftToPreparations(draft: TalcModuleDraft | undefined) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: TALC_BACKEND_PREPARATION_TYPE,
    assignedStandardId: null,
    steps: JSON.stringify(preparation.steps),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapTalcDraftToCalculations(draft: TalcModuleDraft | undefined) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: TALC_BACKEND_CALCULATION_TYPE,
    selectedSamplePreparationLabel: calculation.selectedSamplePreparationLabel,
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit: calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    sw1: calculation.sw1,
    sw1Unit: calculation.sw1Unit,
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

export function mapTalcDraftToFiles(draft: TalcModuleDraft | undefined) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: TALC_BACKEND_PREPARATION_TYPE,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapTalcDraftToPersistence(draft: TalcModuleDraft | undefined) {
  return {
    preparationType: TALC_BACKEND_PREPARATION_TYPE,
    calculationType: TALC_BACKEND_CALCULATION_TYPE,
    activeGroup: "metal.talc",
    preparations: mapTalcDraftToPreparations(draft),
    calculations: mapTalcDraftToCalculations(draft),
    files: mapTalcDraftToFiles(draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const talcPreparationHandler: PreparationHandler = {
  definition: talcPreparationDefinition,
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
          errors: ["Talc calculation data is required."],
          warnings: [],
        };
      }
      const validation = validateTalcCalculation(calculation as CalculationTalc);
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
          errors: ["Talc calculation data is required."],
          warnings: [],
        };
      }
      const result = runTalcCalculation(calculation as CalculationTalc);
      return {
        success: result.success,
        data: {
          ...context.data,
          calculationResult: result.result,
          calculationResultUnit: result.success ? "%" : null,
        },
        errors: result.success ? [] : [result.error ?? "Talc calculation failed."],
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
