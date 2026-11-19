const n = (v: unknown): number | null => {
  if (v === null || v === undefined || String(v).trim() === '') return null;
  const x = Number(v); return Number.isFinite(x) ? x : null;
};

export interface Lithosun300Input { sample: unknown; blank: unknown; v1: unknown; v2: unknown; v3: unknown; labelClaim: unknown; conversionFactor: unknown; }
export interface Lithosun300Result { success: boolean; result: number | null; error?: string; }

export function calculateLithosun300(input: Lithosun300Input): Lithosun300Result {
  const sample = n(input.sample), blank = n(input.blank), v1 = n(input.v1), v2 = n(input.v2), v3 = n(input.v3), lc = n(input.labelClaim), cf = n(input.conversionFactor);
  if ([sample, blank, v1, v2, v3, lc, cf].some(x => x === null)) return { success: false, result: null, error: 'All Lithosun 300 values are required and must be numeric.' };
  if (v1! <= 0 || v2! <= 0 || v3! <= 0 || lc! <= 0 || cf! <= 0) return { success: false, result: null, error: 'Volumes, label claim and conversion factor must be greater than zero.' };
  const result = ((sample! - blank!) * v1! * v3! * 1000) / (lc! * v2! * cf! * 10000);
  return Number.isFinite(result) ? { success: true, result: Number(result.toFixed(4)) } : { success: false, result: null, error: 'Unable to calculate Lithosun 300 result.' };
}
