export interface OrsCalculationInput {
  instrumentConcentrationSample: number | string | null | undefined;
  instrumentConcentrationSampleUnit?: string | null | undefined;
  instrumentConcentrationBlank: number | string | null | undefined;
  instrumentConcentrationBlankUnit?: string | null | undefined;

  sampleWeight: number | string | null | undefined;
  sampleWeightUnit?: string | null | undefined;
  volumeMakeup: number | string | null | undefined;
  volumeMakeupUnit?: string | null | undefined;

  /** V2 factor and V2 volume are separate Excel inputs. */
  dilutionFactor1: number | string | null | undefined;
  dilutionVolume1: number | string | null | undefined;
  dilutionVolume1Unit?: string | null | undefined;

  /** V3 factor and V3 volume are separate Excel inputs. */
  dilutionFactor2: number | string | null | undefined;
  dilutionVolume2: number | string | null | undefined;
  dilutionVolume2Unit?: string | null | undefined;

  sachetWeight: number | string | null | undefined;
  sachetWeightUnit?: string | null | undefined;
  molecularWeight: number | string | null | undefined;

  /** Label Claim is entered as two values: 100 and the claim value (e.g. 20). */
  labelClaimBase: number | string | null | undefined;
  labelClaimValue: number | string | null | undefined;
}

export interface OrsCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

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

/** Normalize the instrument reading to ppm because the ORS Excel sheet uses ppm. */
const concentrationToPpm = (value: number, unit: string): number => {
  switch (unit.toLowerCase().trim()) {
    case "ppb":
      return value / 1000;
    default:
      return value;
  }
};

/**
 * ORS / ORS Excel formula.
 *
 *                  Instrument concentration × V1 × V2(volume) × V3(volume)
 *                  × Sachet Weight × 100 × 1000
 * Result = ----------------------------------------------------------------------
 *          Sample Weight × 1000000 × V2(factor) × V3(factor)
 *          × Molecular Weight × Label Claim(value)
 *
 * The 100 in Label Claim's first input is also explicitly represented as
 * labelClaimBase, rather than being hidden as a magic number.
 *
 * With the supplied Excel example:
 * 0.5762, 0, 8.0035, 500, V2=1/50, V3=1/20,
 * Sachet=21.8525, MW=39.0983, Label Claim=100/20
 * => 100.595 % of L.C.
 */
export function calculateOrs(
  input: OrsCalculationInput,
): OrsCalculationResult {
  const sampleRaw = toNumber(input.instrumentConcentrationSample);
  const blankRaw = toNumber(input.instrumentConcentrationBlank);
  const sampleWeightRaw = toNumber(input.sampleWeight);
  const volumeMakeupRaw = toNumber(input.volumeMakeup);
  const v2FactorRaw = toNumber(input.dilutionFactor1);
  const v2VolumeRaw = toNumber(input.dilutionVolume1);
  const v3FactorRaw = toNumber(input.dilutionFactor2);
  const v3VolumeRaw = toNumber(input.dilutionVolume2);
  const sachetWeightRaw = toNumber(input.sachetWeight);
  const molecularWeightRaw = toNumber(input.molecularWeight);
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
  if (sachetWeightRaw === null || sachetWeightRaw <= 0) return { success: false, result: null, error: "Sachet Weight (Avg) is required and must be greater than 0" };
  if (molecularWeightRaw === null || molecularWeightRaw <= 0) return { success: false, result: null, error: "Molecular Weight is required and must be greater than 0" };
  if (labelClaimBaseRaw === null || labelClaimBaseRaw <= 0) return { success: false, result: null, error: "Label Claim first value is required and must be greater than 0" };
  if (labelClaimValueRaw === null || labelClaimValueRaw <= 0) return { success: false, result: null, error: "Label Claim second value is required and must be greater than 0" };

  const sample = concentrationToPpm(sampleRaw, input.instrumentConcentrationSampleUnit ?? "ppm");
  const blank = concentrationToPpm(blankRaw, input.instrumentConcentrationBlankUnit ?? "ppm");
  const sampleWeight = massToGrams(sampleWeightRaw, input.sampleWeightUnit ?? "g");
  const volumeMakeup = volumeToMl(volumeMakeupRaw, input.volumeMakeupUnit ?? "ml");
  const v2Volume = volumeToMl(v2VolumeRaw, input.dilutionVolume1Unit ?? "ml");
  const v3Volume = volumeToMl(v3VolumeRaw, input.dilutionVolume2Unit ?? "ml");
  const sachetWeight = massToGrams(sachetWeightRaw, input.sachetWeightUnit ?? "g");

  const result =
    ((sample - blank) * volumeMakeup * v2Volume * v3Volume * sachetWeight * labelClaimBaseRaw * 1000) /
    (sampleWeight * 1000000 * v2FactorRaw * v3FactorRaw * molecularWeightRaw * labelClaimValueRaw);

  if (!Number.isFinite(result)) {
    return { success: false, result: null, error: "Unable to calculate ORS result" };
  }

  return { success: true, result: Number(result.toFixed(3)) };
}
