import type { PreparationHandler } from '../../../../core/preparation/runtime/PreparationRuntime';
import type { PreparationContext } from '../../../../core/preparation/contracts/PreparationContext';
import type { PreparationResult } from '../../../../core/preparation/contracts/PreparationResult';
import { lithosun300PreparationDefinition } from './definition';
import type { CalculationLithosun300 } from './models/CalculationLithosun300';
import type { Lithosun300ModuleDraft } from './models';

export const LITHOSUN300_BACKEND_PREPARATION_TYPE = 'lithosun300';
export const LITHOSUN300_BACKEND_CALCULATION_TYPE = 'lithosun300';

export function validateLithosun300Calculation(calculation: CalculationLithosun300) {
  const errors: string[] = [];
  if (!calculation.selectedSamplePreparationLabel) errors.push('Sample preparation is required.');
  if (!Array.isArray(calculation.dissolutionSamples) || calculation.dissolutionSamples.length !== 6) errors.push('Six dissolution sample concentrations are required.');
  return { valid: errors.length === 0, errors };
}

export function mapLithosun300DraftToPersistence(draft: Lithosun300ModuleDraft | undefined) {
  return {
    preparationType: LITHOSUN300_BACKEND_PREPARATION_TYPE, calculationType: LITHOSUN300_BACKEND_CALCULATION_TYPE, activeGroup: 'metal.lithosun300',
    preparations: (draft?.samplePreparations ?? []).map(p => ({ id: p.id, label: p.label, preparationCategory: 'sample', preparationType: LITHOSUN300_BACKEND_PREPARATION_TYPE, assignedStandardId: null, steps: JSON.stringify(p.steps), content: null, isPreparationCompleted: Boolean(draft?.completed), completedAt: draft?.completedAt ?? null })),
    calculations: (draft?.calculations ?? []).map(c => ({ ...c, id: c.id, label: c.label, calculationType: LITHOSUN300_BACKEND_CALCULATION_TYPE })),
    files: (draft?.files ?? []).map(f => ({ id: f.id, preparationType: LITHOSUN300_BACKEND_PREPARATION_TYPE, label: f.name, fileName: f.name, fileDataBase64: f.fileDataBase64 })), completed: Boolean(draft?.completed), completedAt: draft?.completedAt ?? null,
  };
}

export const lithosun300PreparationHandler: PreparationHandler = {
  definition: lithosun300PreparationDefinition,
  capabilities: {
    collectData: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
    validate: async (context: PreparationContext): Promise<PreparationResult> => { const c = context.data.calculation; if (!c || typeof c !== 'object') return { success: false, data: context.data, errors: ['Lithosun 300 calculation data is required.'], warnings: [] }; const v = validateLithosun300Calculation(c as CalculationLithosun300); return { success: v.valid, data: context.data, errors: v.errors, warnings: [] }; },
    calculate: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
  },
  execute: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
};
