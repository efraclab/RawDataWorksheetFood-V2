export interface LodCalculationInput {
    readonly w1: string | number;
    readonly w2: string | number;
    readonly w3: string | number;

    readonly w1Unit?: string;
    readonly w2Unit?: string;
    readonly w3Unit?: string;
}

export interface LodCalculationResult {
    readonly success: boolean;

    readonly w1: string | null;
    readonly w2: string | null;
    readonly w3: string | null;

    readonly result: string | null;
    readonly unit: string | null;

    readonly error?: string;
}

/**
 * V1-compatible mass conversion.
 *
 * The LOD calculation works in grams.
 */
function convertMassToG(
    value: string | number,
    unit: string
): number {

    const numericValue = parseFloat(String(value));

    if (Number.isNaN(numericValue)) {
        return 0;
    }

    switch (unit.toLowerCase().trim()) {

        case "g":
        case "gram":
            return numericValue;

        case "mg":
        case "milligram":
            return numericValue / 1000;

        case "kg":
        case "kilogram":
            return numericValue * 1000;

        default:
            return numericValue;
    }
}


/**
 * Reproduces the V1 `toFixedNoRound` behaviour.
 *
 * First truncate to 4 decimal places,
 * then display 3 decimal places.
 */
function toFixedNoRound(
    value: number,
    decimals: number
): number {

    const factor = Math.pow(10, decimals);

    return Math.trunc(value * factor) / factor;
}


/**
 * Food → LOD calculation.
 *
 * Formula from V1:
 *
 *     numerator   = W2 - W3
 *     denominator = W2 - W1
 *
 *     LOD % = (numerator / denominator) * 100
 */
export function calculateLod(
    input: LodCalculationInput
): LodCalculationResult {

    const w1 = convertMassToG(
        input.w1,
        input.w1Unit ?? "g"
    );

    const w2 = convertMassToG(
        input.w2,
        input.w2Unit ?? "g"
    );

    const w3 = convertMassToG(
        input.w3,
        input.w3Unit ?? "g"
    );


    const numerator = w2 - w3;

    const denominator = w2 - w1;


    if (denominator === 0) {

        return {
            success: false,

            w1: w1.toString(),
            w2: w2.toString(),
            w3: w3.toString(),

            result: null,
            unit: null,

            error:
                "Error: Cannot divide by zero (W2 equals W1)",
        };
    }


    const lodPercentage =
        (numerator / denominator) * 100;


    if (
        Number.isNaN(lodPercentage) ||
        !Number.isFinite(lodPercentage)
    ) {

        return {
            success: false,

            w1: w1.toString(),
            w2: w2.toString(),
            w3: w3.toString(),

            result: null,
            unit: null,

            error:
                "Error: Result is NaN or Infinite",
        };
    }


    /*
     * V1:
     *
     * Lod_Percentage
     *     .toFixedNoRound(4)
     *     .toFixed(3)
     *
     * Therefore:
     *
     * 1. truncate at 4 decimals
     * 2. display with 3 decimals
     */
    const displayResult =
        toFixedNoRound(lodPercentage, 4)
            .toFixed(3);


    return {
        success: true,

        w1: w1.toString(),
        w2: w2.toString(),
        w3: w3.toString(),

        result: displayResult,
        unit: "%",
    };
}