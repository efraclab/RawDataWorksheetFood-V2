export interface IcpmsWaterCalculationInput {
  instrumentConcentrationSample: number | string | null | undefined;
  instrumentConcentrationSampleUnit?: string | null | undefined;
  instrumentConcentrationBlank: number | string | null | undefined;
  instrumentConcentrationBlankUnit?: string | null | undefined;
  dilutionFactor1: number | string | null | undefined;
  dilutionFactor1Unit?: string | null | undefined;
  dilutionFactor2: number | string | null | undefined;
  dilutionFactor2Unit?: string | null | undefined;
}

export interface IcpmsWaterCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : null;
};

const concentrationToPpb = (value: number, unit: string): number =>
  unit.toLowerCase().trim() === "ppm" ? value * 1000 : value;

const volumeToMl = (value: number, unit: string): number => {
  switch (unit.toLowerCase().trim()) {
    case "l":
    case "liter":
    case "litre":
      return value * 1000;
    case "µl":
    case "ul":
      return value / 1000;
    default:
      return value;
  }
};

/**
 * ICP-MS (Water) Excel formula:
 *
 * Concentration (mg/L) =
 * ((Instrument Concentration (Sample) - Instrument Concentration (Blank))
 *   × V1 × V2) / 1000
 *
 * There is NO sample-weight term for ICP-MS (Water).
 */
export function calculateIcpmsWater(input: IcpmsWaterCalculationInput): IcpmsWaterCalculationResult {
  const sampleRaw = toNumber(input.instrumentConcentrationSample);
  const blankRaw = toNumber(input.instrumentConcentrationBlank);
  const v1Raw = toNumber(input.dilutionFactor1);
  const v2Raw = toNumber(input.dilutionFactor2);

  if (sampleRaw === null) return { success: false, result: null, error: "Instrument Concentration (Sample) is required" };
  if (blankRaw === null) return { success: false, result: null, error: "Instrument Concentration (Blank) is required" };
  if (v1Raw === null || v1Raw <= 0) return { success: false, result: null, error: "Dilution Factor 1 (V1) is required and must be greater than 0" };
  if (v2Raw === null || v2Raw <= 0) return { success: false, result: null, error: "Dilution Factor 2 (V2) is required and must be greater than 0" };

  const sample = concentrationToPpb(sampleRaw, input.instrumentConcentrationSampleUnit ?? "ppb");
  const blank = concentrationToPpb(blankRaw, input.instrumentConcentrationBlankUnit ?? "ppb");
  const v1 = volumeToMl(v1Raw, input.dilutionFactor1Unit ?? "ml");
  const v2 = volumeToMl(v2Raw, input.dilutionFactor2Unit ?? "ml");

  const result = ((sample - blank) * v1 * v2) / 1000;
  if (!Number.isFinite(result)) return { success: false, result: null, error: "Unable to calculate ICP-MS (Water) result" };

  return { success: true, result: Number(result.toFixed(3)) };
}
