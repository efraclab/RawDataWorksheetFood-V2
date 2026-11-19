export interface AasWaterCalculationInput {
  instrumentConcentrationSample: number | string | null | undefined;
  instrumentConcentrationSampleUnit?: string | null | undefined;

  instrumentConcentrationBlank: number | string | null | undefined;
  instrumentConcentrationBlankUnit?: string | null | undefined;

  dilutionFactor1: number | string | null | undefined;
  dilutionFactor1Unit?: string | null | undefined;

  dilutionFactor2: number | string | null | undefined;
  dilutionFactor2Unit?: string | null | undefined;
}

export interface AasWaterCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  const parsed =
    typeof value === "number" ? value : Number(String(value).trim());

  return Number.isFinite(parsed) ? parsed : null;
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
 * AAS (Water) worksheet formula:
 *
 * Result (mg/L) =
 *   (Instrument Concentration (Sample) - Instrument Concentration (Blank))
 *   × V1 × V2
 *
 * The supplied worksheet example is:
 *   (3.26 - 0.35) × 5 × 1 = 14.55 mg/L
 *
 * There is intentionally NO sample-weight term and NO ÷1000 term in this
 * AAS (Water) formula. If ppb is selected, it is normalized to ppm first.
 */
export function calculateAasWater(
  input: AasWaterCalculationInput,
): AasWaterCalculationResult {
  const sampleRaw = toNumber(input.instrumentConcentrationSample);
  const blankRaw = toNumber(input.instrumentConcentrationBlank);
  const dilution1Raw = toNumber(input.dilutionFactor1);
  const dilution2Raw = toNumber(input.dilutionFactor2);

  if (sampleRaw === null) {
    return {
      success: false,
      result: null,
      error: "Instrument Concentration (Sample) is required",
    };
  }

  if (blankRaw === null) {
    return {
      success: false,
      result: null,
      error: "Instrument Concentration (Blank) is required",
    };
  }

  if (dilution1Raw === null || dilution1Raw <= 0) {
    return {
      success: false,
      result: null,
      error: "Dilution Factor 1 (V1) is required and must be greater than 0",
    };
  }

  if (dilution2Raw === null || dilution2Raw <= 0) {
    return {
      success: false,
      result: null,
      error: "Dilution Factor 2 (V2) is required and must be greater than 0",
    };
  }

  const sample = concentrationToPpm(
    sampleRaw,
    input.instrumentConcentrationSampleUnit ?? "ppm",
  );
  const blank = concentrationToPpm(
    blankRaw,
    input.instrumentConcentrationBlankUnit ?? "ppm",
  );

  const dilution1 = volumeToMl(
    dilution1Raw,
    input.dilutionFactor1Unit ?? "ml",
  );
  const dilution2 = volumeToMl(
    dilution2Raw,
    input.dilutionFactor2Unit ?? "ml",
  );

  const result = (sample - blank) * dilution1 * dilution2;

  if (!Number.isFinite(result)) {
    return {
      success: false,
      result: null,
      error: "Unable to calculate AAS (Water) result",
    };
  }

  return {
    success: true,
    result: Number(result.toFixed(2)),
  };
}
