import type { PreparationHandler } from '../../../../core/preparation/runtime/PreparationRuntime';
import type { PreparationContext } from '../../../../core/preparation/contracts/PreparationContext';
import type { PreparationResult } from '../../../../core/preparation/contracts/PreparationResult';
import { lithosun400PreparationDefinition } from './definition';
import type { CalculationLithosun400 } from './models/CalculationLithosun400';
import type { Lithosun400ModuleDraft } from './models';

export const LITHOSUN400_BACKEND_PREPARATION_TYPE = 'lithosun400';
export const LITHOSUN400_BACKEND_CALCULATION_TYPE = 'lithosun400';

export function validateLithosun400Calculation(calculation: CalculationLithosun400) {
  const errors: string[] = [];
  if (calculation.selectedSamplePreparationId == null) errors.push('Sample preparation is required.');
  if (!Array.isArray(calculation.stages) || calculation.stages.length !== 3) errors.push('Three dissolution stages are required.');
  return { valid: errors.length === 0, errors };
}

export function mapLithosun400DraftToPersistence(draft: Lithosun400ModuleDraft | undefined) {
  return {
    preparationType: LITHOSUN400_BACKEND_PREPARATION_TYPE,
    calculationType: LITHOSUN400_BACKEND_CALCULATION_TYPE,
    activeGroup: 'metal.lithosun400',
    preparations: (draft?.samplePreparations ?? []).map(preparation => ({
      id: preparation.id,
      label: preparation.label,
      preparationCategory: 'sample',
      preparationType: LITHOSUN400_BACKEND_PREPARATION_TYPE,
      assignedStandardId: null,
      steps: JSON.stringify(preparation.stages),
      dissolutionHours: '',
      content: null,
      isPreparationCompleted: Boolean(draft?.completed),
      completedAt: draft?.completedAt ?? null,
    })),
    calculations: (draft?.calculations ?? []).map(calculation => ({ ...calculation, calculationType: LITHOSUN400_BACKEND_CALCULATION_TYPE })),
    files: (draft?.files ?? []).map(file => ({ id: file.id, preparationType: LITHOSUN400_BACKEND_PREPARATION_TYPE, label: file.name, fileName: file.name, fileDataBase64: file.fileDataBase64 })),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const lithosun400PreparationHandler: PreparationHandler = {
  definition: lithosun400PreparationDefinition,
  capabilities: {
    collectData: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
    validate: async (context: PreparationContext): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== 'object') return { success: false, data: context.data, errors: ['Lithosun 400 calculation data is required.'], warnings: [] };
      const result = validateLithosun400Calculation(calculation as CalculationLithosun400);
      return { success: result.valid, data: context.data, errors: result.errors, warnings: [] };
    },
    calculate: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
  },
  execute: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
};
