import type { CalculationLithosun400, Lithosun400CalculationStage } from './models/CalculationLithosun400';
import type { Lithosun400DissolutionHour, Lithosun400DissolutionStage, SamplePreparationLithosun400, SamplePreparationLithosun400Step } from './models/SamplePreparationLithosun400';

const HOURS: Lithosun400DissolutionHour[] = ['1', '3', '7'];
const hourLabel = (hour: Lithosun400DissolutionHour) => `After ${hour} Hrs Disso`;
const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);
const emptySamples = () => ['', '', '', '', '', ''];
const emptyResults = () => [null, null, null, null, null, null];
const createStep = (name: string, unit1 = ''): SamplePreparationLithosun400Step => ({ name, value1: '', unit1, logBookID: '' });

const createSteps = (): SamplePreparationLithosun400Step[] => [
  createStep('Instrument Concentration (Blank)', 'ppm'),
  ...Array.from({ length: 6 }, (_, i) => createStep(`Instrument Concentration (Sample) Tab ${i + 1}`, 'ppm')),
  createStep('Volume makeup (V1)', 'ml'),
  createStep('Volume taken (V2)', 'ml'),
  createStep('Volume makeup (V3)', 'ml'),
  createStep('Label Claim', 'mg'),
  createStep('Conversion Factor', ''),
];

export const createLithosun400Stage = (hour: Lithosun400DissolutionHour): Lithosun400DissolutionStage => ({
  hour,
  label: hourLabel(hour),
  steps: createSteps(),
});

export const createLithosun400CalculationStage = (hour: Lithosun400DissolutionHour): Lithosun400CalculationStage => ({
  hour,
  label: hourLabel(hour),
  dissolutionSamples: emptySamples(),
  results: emptyResults(),
  acceptanceLimitMin: '',
  acceptanceLimitMax: '',
});

export function createCalculationLithosun400(index: number): CalculationLithosun400 {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationId: null,
    stages: HOURS.map(createLithosun400CalculationStage),
  };
}

export function createSamplePreparationLithosun400(index: number): SamplePreparationLithosun400 {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    stages: HOURS.map(createLithosun400Stage),
  };
}

const validHour = (value: unknown): value is Lithosun400DissolutionHour => value === '1' || value === '3' || value === '7';
const normalizeSamples = (value: unknown) => Array.isArray(value) ? [...value, ...emptySamples()].slice(0, 6) : emptySamples();
const normalizeResults = (value: unknown) => Array.isArray(value) ? [...value, ...emptyResults()].slice(0, 6) : emptyResults();

function restoreStage(value: unknown, hour: Lithosun400DissolutionHour): Lithosun400DissolutionStage {
  const created = createLithosun400Stage(hour);
  if (!value || typeof value !== 'object') return created;
  const source = value as Partial<Lithosun400DissolutionStage>;
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map(rawSteps.filter((s): s is SamplePreparationLithosun400Step => Boolean(s && typeof s.name === 'string')).map(s => [s.name.trim().toLowerCase(), s]));
  return {
    ...created,
    ...(source.label ? { label: source.label } : {}),
    hour,
    steps: created.steps.map((definition, index) => {
      const raw = byName.get(definition.name.toLowerCase()) ?? rawSteps[index];
      return { ...definition, ...(raw ?? {}), name: definition.name, unit1: raw?.unit1 ?? definition.unit1, value1: raw?.value1 ?? '' };
    }),
  };
}

export function restoreSamplePreparationLithosun400(value: unknown, index = 0): SamplePreparationLithosun400 {
  const created = createSamplePreparationLithosun400(index);
  if (!value || typeof value !== 'object') return created;
  const source = value as Partial<SamplePreparationLithosun400> & { dissolutionHours?: unknown };
  let rawStages: unknown[] = Array.isArray(source.stages) ? source.stages : [];
  if (!rawStages.length && Array.isArray(source.steps)) {
    rawStages = [{ hour: validHour(source.dissolutionHours) ? source.dissolutionHours : '1', steps: source.steps }];
  }
  return {
    ...created,
    id: typeof source.id === 'number' ? source.id : created.id,
    label: `Sample Preparation ${index + 1}`,
    stages: HOURS.map(hour => {
      const found = rawStages.find(item => item && typeof item === 'object' && (item as { hour?: unknown }).hour === hour);
      return restoreStage(found, hour);
    }),
  };
}

export function restoreCalculationLithosun400(value: unknown, index = 0): CalculationLithosun400 {
  const created = createCalculationLithosun400(index);
  if (!value || typeof value !== 'object') return created;
  const source = value as Partial<CalculationLithosun400> & { dissolutionHours?: unknown };
  let rawStages: unknown[] = Array.isArray(source.stages) ? source.stages : [];
  if (!rawStages.length && (Array.isArray(source.dissolutionSamples) || Array.isArray(source.results))) {
    rawStages = [{
      hour: validHour(source.dissolutionHours) ? source.dissolutionHours : '1',
      dissolutionSamples: source.dissolutionSamples,
      results: source.results,
      acceptanceLimitMin: source.acceptanceLimitMin ?? '',
      acceptanceLimitMax: source.acceptanceLimitMax ?? '',
    }];
  }
  return {
    ...created,
    id: typeof source.id === 'number' ? source.id : created.id,
    label: typeof source.label === 'string' ? source.label : `Calculation ${index + 1}`,
    selectedSamplePreparationId: typeof source.selectedSamplePreparationId === 'number' ? source.selectedSamplePreparationId : null,
    stages: HOURS.map(hour => {
      const found = rawStages.find(item => item && typeof item === 'object' && (item as { hour?: unknown }).hour === hour) as Partial<Lithosun400CalculationStage> | undefined;
      const base = createLithosun400CalculationStage(hour);
      return {
        ...base,
        ...(found ?? {}),
        hour,
        label: hourLabel(hour),
        dissolutionSamples: normalizeSamples(found?.dissolutionSamples),
        results: normalizeResults(found?.results),
        acceptanceLimitMin: found?.acceptanceLimitMin ?? '',
        acceptanceLimitMax: found?.acceptanceLimitMax ?? '',
      };
    }),
  };
}
