/**
 * RA formula, from the "Calculation" sheet of RAW_DATA_FORMAT-RA_LAB.xlsx:
 *   RESULT (µg/Kg) = Instrument Concentration x Dilution Factor
 *   RESULT (mg/Kg) = RESULT (µg/Kg) / 1000
 */

/** Decimal places kept. The sheet shows full precision; change here if the lab wants fewer. */
export const RESULT_DECIMALS = 4;

export const RESIDUE_FORMULA =
  "Result (µg/kg) = Instrument concentration × Dilution factor; Result (mg/kg) = Result (µg/kg) / 1000";

const toNumber = (value: unknown): number | null => {
  const text = String(value ?? "").trim();
  if (text === "") return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
};

const round = (n: number) => Number(n.toFixed(RESULT_DECIMALS));

export interface ResidueCalculationResult {
  success: boolean;
  ugKg: number | null;
  mgKg: number | null;
  error?: string;
}

export function calculateResidue(input: {
  concentration: unknown;
  dilutionFactor: unknown;
}): ResidueCalculationResult {
  const concentration = toNumber(input.concentration);
  const dilution = toNumber(input.dilutionFactor);

  if (dilution === null || dilution <= 0)
    return {
      success: false,
      ugKg: null,
      mgKg: null,
      error: "Dilution factor is required and must be greater than 0",
    };
  if (concentration === null || concentration < 0)
    return {
      success: false,
      ugKg: null,
      mgKg: null,
      error: "Instrument concentration is required and must be a number (0 or more)",
    };

  const ugKg = concentration * dilution;
  return { success: true, ugKg: round(ugKg), mgKg: round(ugKg / 1000) };
}

export const isPositiveNumber = (value: unknown) => {
  const n = toNumber(value);
  return n !== null && n > 0;
};