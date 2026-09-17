import type { CalculationLithosun300 } from './models/CalculationLithosun300';
import type { SamplePreparationLithosun300, SamplePreparationLithosun300Step } from './models/SamplePreparationLithosun300';

const createId = (index: number) => Date.now() + index;
const createStep = (name: string, unit1 = ''): SamplePreparationLithosun300Step => ({ name, value1: '', unit1, logBookID: '' });

export function createCalculationLithosun300(index: number): CalculationLithosun300 {
  return { id: createId(index), label: `Calculation ${index + 1}`, selectedSamplePreparationLabel: null, dissolutionSamples: ['', '', '', '', '', ''], results: [null, null, null, null, null, null], acceptanceLimitMin: '', acceptanceLimitMax: '' };
}

export function createSamplePreparationLithosun300(index: number): SamplePreparationLithosun300 {
  return {
    id: createId(index), label: `Sample Preparation ${index + 1}`,
    steps: [
      createStep('Instrument Concentration (Blank)', 'ppm'),
      ...Array.from({ length: 6 }, (_, i) => createStep(`Instrument Concentration (Sample) Tab ${i + 1}`, 'ppm')),
      createStep('Volume makeup (V1)', 'ml'),
      createStep('Volume taken (V2)', 'ml'),
      createStep('Volume makeup (V3)', 'ml'),
      createStep('Label Claim', 'mg'),
      createStep('Conversion Factor', ''),
    ],
  };
}

export function restoreCalculationLithosun300(value: unknown, index = 0): CalculationLithosun300 {
  const source = value && typeof value === 'object' ? value as Partial<CalculationLithosun300> : {};
  return { ...createCalculationLithosun300(index), ...source, id: typeof source.id === 'number' ? source.id : createId(index), label: typeof source.label === 'string' ? source.label : `Calculation ${index + 1}`, dissolutionSamples: Array.isArray(source.dissolutionSamples) ? [...source.dissolutionSamples, '', '', '', '', '', ''].slice(0, 6) : ['', '', '', '', '', ''], results: Array.isArray(source.results) ? [...source.results, null, null, null, null, null, null].slice(0, 6) : [null, null, null, null, null, null] };
}

export function restoreSamplePreparationLithosun300(value: unknown, index = 0): SamplePreparationLithosun300 {
  const created = createSamplePreparationLithosun300(index);
  if (!value || typeof value !== 'object') return created;
  const source = value as Partial<SamplePreparationLithosun300>;
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map(rawSteps.filter((s): s is SamplePreparationLithosun300Step => Boolean(s && typeof s.name === 'string')).map(s => [s.name.trim().toLowerCase(), s]));
  return { ...created, ...source, id: typeof source.id === 'number' ? source.id : created.id, label: typeof source.label === 'string' ? source.label : created.label, steps: created.steps.map((def, i) => { const raw = byName.get(def.name.toLowerCase()) ?? rawSteps[i]; return { ...def, ...(raw ?? {}), name: def.name, value1: raw?.value1 ?? '', unit1: raw?.unit1 ?? def.unit1 }; }) };
}
