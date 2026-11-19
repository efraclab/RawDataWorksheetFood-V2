export interface AnoferCalculationInput {
  instrumentConcentrationSample: number | string | null | undefined;
  instrumentConcentrationSampleUnit?: string | null | undefined;
  instrumentConcentrationBlank: number | string | null | undefined;
  instrumentConcentrationBlankUnit?: string | null | undefined;

  sampleWeight: number | string | null | undefined;
  sampleWeightUnit?: string | null | undefined;
  volumeMakeup: number | string | null | undefined;
  volumeMakeupUnit?: string | null | undefined;

  /** V2, V3 and V4 each have separate Excel factor and volume inputs. */
  dilutionFactor1: number | string | null | undefined;
  dilutionVolume1: number | string | null | undefined;
  dilutionVolume1Unit?: string | null | undefined;
  dilutionFactor2: number | string | null | undefined;
  dilutionVolume2: number | string | null | undefined;
  dilutionVolume2Unit?: string | null | undefined;
  dilutionFactor3: number | string | null | undefined;
  dilutionVolume3: number | string | null | undefined;
  dilutionVolume3Unit?: string | null | undefined;

  avgWeight: number | string | null | undefined;
  avgWeightUnit?: string | null | undefined;

  /** Label Claim is two independent Excel inputs, e.g. 100 and 2. */
  labelClaimBase: number | string | null | undefined;
  labelClaimValue: number | string | null | undefined;
}

export interface AnoferCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : null;
};

const massToGrams = (value: number, unit: string): number => {
  switch (unit.toLowerCase().trim()) {
    case "mg":
    case "milligram":
      return value / 1000;
    case "kg":
    case "kilogram":
      return value * 1000;
    default:
      return value;
  }
};

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

const concentrationToPpm = (value: number, unit: string): number => {
  switch (unit.toLowerCase().trim()) {
    case "ppb":
      return value / 1000;
    default:
      return value;
  }
};

/**
 * Anofer Excel formula:
 *
 *          Instrument Concentration (Sample) × V1 × V2(volume) × V3(volume) × V4(volume)
 *          × Avg. Weight × Label Claim Base
 * Result = ----------------------------------------------------------------------
 *          Sample Weight × 1000 × V2(factor) × V3(factor) × V4(factor)
 *          × Label Claim Value
 *
 * With the supplied Excel example:
 * 2.605, 0, 6.3216, 250, V2=3/50, V3=1/1, V4=1/1,
 * Avg Weight=1.2659, Molecular Weight=39.0983, Label Claim=100/2
 * => 108.677 % of L.C. (Molecular Weight is displayed on the Excel sheet but
 * is not part of the Anofer formula shown there.)
 */
export function calculateAnofer(input: AnoferCalculationInput): AnoferCalculationResult {
  const sampleRaw = toNumber(input.instrumentConcentrationSample);
  const blankRaw = toNumber(input.instrumentConcentrationBlank);
  const sampleWeightRaw = toNumber(input.sampleWeight);
  const volumeMakeupRaw = toNumber(input.volumeMakeup);
  const v2FactorRaw = toNumber(input.dilutionFactor1);
  const v2VolumeRaw = toNumber(input.dilutionVolume1);
  const v3FactorRaw = toNumber(input.dilutionFactor2);
  const v3VolumeRaw = toNumber(input.dilutionVolume2);
  const v4FactorRaw = toNumber(input.dilutionFactor3);
  const v4VolumeRaw = toNumber(input.dilutionVolume3);
  const avgWeightRaw = toNumber(input.avgWeight);
  const labelClaimBaseRaw = toNumber(input.labelClaimBase);
  const labelClaimValueRaw = toNumber(input.labelClaimValue);

  if (sampleRaw === null) return { success: false, result: null, error: "Instrument Concentration (Sample) is required" };
  if (blankRaw === null) return { success: false, result: null, error: "Instrument Concentration (Blank) is required" };
  if (sampleWeightRaw === null || sampleWeightRaw <= 0) return { success: false, result: null, error: "Sample Weight (SW1) is required and must be greater than 0" };
  if (volumeMakeupRaw === null || volumeMakeupRaw <= 0) return { success: false, result: null, error: "Volume Makeup (V1) is required and must be greater than 0" };

  if (v2FactorRaw === null || v2FactorRaw <= 0) return { success: false, result: null, error: "Dilution Factor 1 (V2 factor) is required and must be greater than 0" };
  if (v2VolumeRaw === null || v2VolumeRaw <= 0) return { success: false, result: null, error: "Dilution Factor 1 (V2 volume) is required and must be greater than 0" };
  if (v3FactorRaw === null || v3FactorRaw <= 0) return { success: false, result: null, error: "Dilution Factor 2 (V3 factor) is required and must be greater than 0" };
  if (v3VolumeRaw === null || v3VolumeRaw <= 0) return { success: false, result: null, error: "Dilution Factor 2 (V3 volume) is required and must be greater than 0" };
  if (v4FactorRaw === null || v4FactorRaw <= 0) return { success: false, result: null, error: "Dilution Factor 3 (V4 factor) is required and must be greater than 0" };
  if (v4VolumeRaw === null || v4VolumeRaw <= 0) return { success: false, result: null, error: "Dilution Factor 3 (V4 volume) is required and must be greater than 0" };

  if (avgWeightRaw === null || avgWeightRaw <= 0) return { success: false, result: null, error: "Avg. Weight is required and must be greater than 0" };
  if (labelClaimBaseRaw === null || labelClaimBaseRaw <= 0) return { success: false, result: null, error: "Label Claim first value is required and must be greater than 0" };
  if (labelClaimValueRaw === null || labelClaimValueRaw <= 0) return { success: false, result: null, error: "Label Claim second value is required and must be greater than 0" };

  const sample = concentrationToPpm(sampleRaw, input.instrumentConcentrationSampleUnit ?? "ppm");
  const sampleWeight = massToGrams(sampleWeightRaw, input.sampleWeightUnit ?? "g");
  const volumeMakeup = volumeToMl(volumeMakeupRaw, input.volumeMakeupUnit ?? "ml");
  const v2Volume = volumeToMl(v2VolumeRaw, input.dilutionVolume1Unit ?? "ml");
  const v3Volume = volumeToMl(v3VolumeRaw, input.dilutionVolume2Unit ?? "ml");
  const v4Volume = volumeToMl(v4VolumeRaw, input.dilutionVolume3Unit ?? "ml");
  const avgWeight = massToGrams(avgWeightRaw, input.avgWeightUnit ?? "g");

  const result =
    ((sample) *
      volumeMakeup *
      v2Volume *
      v3Volume *
      v4Volume *
      avgWeight *
      labelClaimBaseRaw) /
    (sampleWeight *
      1000 *
      v2FactorRaw *
      v3FactorRaw *
      v4FactorRaw *
      labelClaimValueRaw);

  if (!Number.isFinite(result)) {
    return { success: false, result: null, error: "Unable to calculate Anofer result" };
  }

  return { success: true, result: Number(result.toFixed(3)) };
}
