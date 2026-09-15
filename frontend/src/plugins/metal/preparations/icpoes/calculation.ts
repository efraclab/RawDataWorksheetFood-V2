export interface IcpOesCalculationInput {
  instrumentConcentrationSample: number | string | null | undefined;
  instrumentConcentrationSampleUnit?: string | null | undefined;

  instrumentConcentrationBlank: number | string | null | undefined;
  instrumentConcentrationBlankUnit?: string | null | undefined;

  sampleWeight: number | string | null | undefined;
  sampleWeightUnit?: string | null | undefined;

  volumeMakeup: number | string | null | undefined;
  volumeMakeupUnit?: string | null | undefined;

  dilutionFactor1: number | string | null | undefined;
  dilutionFactor1Unit?: string | null | undefined;

  dilutionFactor2: number | string | null | undefined;
  dilutionFactor2Unit?: string | null | undefined;
}

export interface IcpOesCalculationResult {
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
 * ICP-OES (FOOD) formula represented by the supplied worksheet:
 *
 * Result (mg/Kg) =
 *
 *   ((Instrument Concentration (Sample) - Instrument Concentration (Blank))
 *      × V1 × V2 × V3)
 *   / SW1
 *
 * ICP-OES (FOOD) uses instrument concentration in ppm in the worksheet.
 * There is NO ×1000 in the denominator. If ppb is selected in the UI, it is
 * converted to ppm (÷1000) before applying the worksheet formula.
 */
export function calculateIcpOes(
  input: IcpOesCalculationInput,
): IcpOesCalculationResult {
  const sampleRaw = toNumber(input.instrumentConcentrationSample);
  const blankRaw = toNumber(input.instrumentConcentrationBlank);
  const sampleWeightRaw = toNumber(input.sampleWeight);
  const volumeMakeupRaw = toNumber(input.volumeMakeup);
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

  if (sampleWeightRaw === null || sampleWeightRaw <= 0) {
    return {
      success: false,
      result: null,
      error: "Sample Weight (SW1) is required and must be greater than 0",
    };
  }

  if (volumeMakeupRaw === null || volumeMakeupRaw <= 0) {
    return {
      success: false,
      result: null,
      error: "Volume Makeup (V1) is required and must be greater than 0",
    };
  }

  if (dilution1Raw === null || dilution1Raw <= 0) {
    return {
      success: false,
      result: null,
      error: "Dilution Factor 1 (V2) is required and must be greater than 0",
    };
  }

  if (dilution2Raw === null || dilution2Raw <= 0) {
    return {
      success: false,
      result: null,
      error: "Dilution Factor 2 (V3) is required and must be greater than 0",
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

  const sampleWeight = massToGrams(
    sampleWeightRaw,
    input.sampleWeightUnit ?? "g",
  );

  const volumeMakeup = volumeToMl(
    volumeMakeupRaw,
    input.volumeMakeupUnit ?? "ml",
  );

  const dilution1 = volumeToMl(
    dilution1Raw,
    input.dilutionFactor1Unit ?? "ml",
  );

  const dilution2 = volumeToMl(
    dilution2Raw,
    input.dilutionFactor2Unit ?? "ml",
  );

  const result =
    ((sample - blank) * volumeMakeup * dilution1 * dilution2) /
    sampleWeight;

  if (!Number.isFinite(result)) {
    return {
      success: false,
      result: null,
      error: "Unable to calculate ICP-OES result",
    };
  }

  return {
    success: true,
    result: Number(result.toFixed(2)),
  };
}
