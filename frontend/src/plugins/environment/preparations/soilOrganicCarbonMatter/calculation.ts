export interface SoilOrganicCarbonMatterCalculationInput {
  s: unknown;
  t: unknown;
  wt: unknown;
  oc?: unknown;
  y?: unknown;
  organicMatter?: unknown;
}

export interface SoilOrganicCarbonMatterCalculationResult {
  success: boolean;
  result: number | null;
  organicCarbon?: number | null;
  actualOrganicCarbon?: number | null;
  error?: string;
}

const toNumber = (value: unknown): number | null => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Excel source:
 *
 * Percentage organic carbon
 *   = 10 × (S − T) × 0.003 × 100 / S
 *
 * Since 1 g soil is used:
 *   OC = 3 × (S − T) / S
 *
 * Y (actual amount of OC)
 *   = %OC × 1.3
 *
 * Organic matter
 *   = Y × 1.724
 */
export function calculateSoilOrganicCarbonMatter(
  input: SoilOrganicCarbonMatterCalculationInput,
): SoilOrganicCarbonMatterCalculationResult {
  const s = toNumber(input.s);
  const t = toNumber(input.t);
  const wt = toNumber(input.wt);

  if (s === null || t === null || wt === null) {
    return {
      success: false,
      result: null,
      error: "S, T and the equivalent weight of carbon are required and must be numeric.",
    };
  }

  if (s <= 0) {
    return {
      success: false,
      result: null,
      error: "S (FeSO₄ solution required for blank) must be greater than 0.",
    };
  }

  if (wt <= 0) {
    return {
      success: false,
      result: null,
      error: "Equivalent weight of carbon must be greater than 0.",
    };
  }

  if (t < 0 || t > s) {
    return {
      success: false,
      result: null,
      error: "T (FeSO₄ solution required for soil sample) must be between 0 and S.",
    };
  }

  // The worksheet explicitly simplifies the calculation for 1 g soil:
  // OC = 3(S-T)/S.  The displayed Wt=3 is the equivalent-weight constant,
  // not the soil mass denominator.
  const organicCarbon = (3 * (s - t)) / s;
  const actualOrganicCarbon = organicCarbon * 1.3;
  const organicMatter = actualOrganicCarbon * 1.724;

  if (![organicCarbon, actualOrganicCarbon, organicMatter].every(Number.isFinite)) {
    return {
      success: false,
      result: null,
      error: "Unable to calculate organic carbon/organic matter from the supplied values.",
    };
  }

  return {
    success: true,
    result: Number(organicMatter.toFixed(6)),
    organicCarbon: Number(organicCarbon.toFixed(6)),
    actualOrganicCarbon: Number(actualOrganicCarbon.toFixed(6)),
  };
}
