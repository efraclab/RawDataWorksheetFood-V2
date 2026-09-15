export interface IcpmsCalculationInput {
  instrumentConcentrationSample: number | string | null | undefined;
  instrumentConcentrationBlank: number | string | null | undefined;
  sampleWeight: number | string | null | undefined;
  volumeMakeup: number | string | null | undefined;
  dilutionFactor1: number | string | null | undefined;
  dilutionFactor2: number | string | null | undefined;
}

export interface IcpmsCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/**
 * ICP-MS (FOOD) calculation represented by the supplied Excel worksheet.
 *
 * Result (mg/Kg) =
 *   ((Sample Instrument Concentration - Blank Instrument Concentration)
 *      × V1 × V2 × V3)
 *   / (SW1 × 1000)
 */
export function calculateIcpms(
  input: IcpmsCalculationInput,
): IcpmsCalculationResult {
  const toNumber = (value: unknown): number | null => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return null;
    }

    const parsed = typeof value === "number" ? value : Number(String(value).trim());
    return Number.isFinite(parsed) ? parsed : null;
  };

  const sample = toNumber(input.instrumentConcentrationSample);
  const blank = toNumber(input.instrumentConcentrationBlank);
  const sampleWeight = toNumber(input.sampleWeight);
  const volumeMakeup = toNumber(input.volumeMakeup);
  const dilution1 = toNumber(input.dilutionFactor1);
  const dilution2 = toNumber(input.dilutionFactor2);

  if (sample === null) {
    return { success: false, result: null, error: "Instrument Concentration (Sample) is required" };
  }
  if (blank === null) {
    return { success: false, result: null, error: "Instrument Concentration (Blank) is required" };
  }
  if (sampleWeight === null || sampleWeight <= 0) {
    return { success: false, result: null, error: "Sample Weight is required and must be greater than 0" };
  }
  if (volumeMakeup === null || volumeMakeup <= 0) {
    return { success: false, result: null, error: "Volume Makeup is required and must be greater than 0" };
  }
  if (dilution1 === null || dilution1 <= 0) {
    return { success: false, result: null, error: "Dilution Factor 1 is required and must be greater than 0" };
  }
  if (dilution2 === null || dilution2 <= 0) {
    return { success: false, result: null, error: "Dilution Factor 2 is required and must be greater than 0" };
  }

  const result =
    ((sample - blank) * volumeMakeup * dilution1 * dilution2) /
    (sampleWeight * 1000);

  if (!Number.isFinite(result)) {
    return { success: false, result: null, error: "Unable to calculate ICP-MS result" };
  }

  return { success: true, result: Number(result.toFixed(2)) };
}
