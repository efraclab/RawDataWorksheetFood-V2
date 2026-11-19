import type { MpnFormula } from "./config";

/** "+", "pos", "positive" count as positive. Anything else does not. */
export const isPositive = (value: unknown): boolean => {
  const text = String(value ?? "").trim().toLowerCase();
  return text === "+" || text === "pos" || text === "positive";
};

/** Number of positive tubes in one group. A tube is positive if any counted reading is positive. */
export function countPositiveTubes(
  cells: readonly string[] | undefined,
  tubes: number,
  readingIndexes: readonly number[],
): number {
  let positive = 0;
  for (let t = 0; t < tubes; t += 1) {
    if (readingIndexes.some((r) => isPositive(cells?.[r * tubes + t]))) positive += 1;
  }
  return positive;
}

const num = (value: unknown): number | null => {
  const text = String(value ?? "").trim();
  if (text === "") return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
};

export interface MpnCalculationResult {
  success: boolean;
  value: number | null;
  error?: string;
}

/** Decimal places kept in the MPN result. */
export const MPN_DECIMALS = 2;

export function calculateMpn(
  formula: MpnFormula,
  input: { mpnIndex: string; largestVolume: string; drySolids: string },
): MpnCalculationResult {
  const index = num(input.mpnIndex);
  if (index === null || index < 0)
    return { success: false, value: null, error: "MPN index is required and must be a number" };
  if (formula === "none") return { success: true, value: index };

  const solids = num(input.drySolids);
  if (solids === null || solids <= 0)
    return { success: false, value: null, error: "% dry solids is required and must be greater than 0" };

  let value: number;
  if (formula === "faecalSolids") {
    const volume = num(input.largestVolume);
    if (volume === null || volume <= 0)
      return { success: false, value: null, error: "Largest volume is required and must be greater than 0" };
    value = (10 * index) / (volume * solids);
  } else {
    value = (index * 4) / solids;
  }
  return Number.isFinite(value)
    ? { success: true, value: Number(value.toFixed(MPN_DECIMALS)) }
    : { success: false, value: null, error: "Unable to calculate MPN" };
}

export const MPN_FORMULA_TEXT: Record<MpnFormula, string> = {
  none: "MPN Index from the MPN table",
  faecalSolids: "MPN/g = 10 × MPN Index/100 mL ÷ (Largest volume × % dry solids)",
  salmonellaSolids: "MPN/4 g = MPN Index/100 mL × 4 ÷ % dry solids",
};
