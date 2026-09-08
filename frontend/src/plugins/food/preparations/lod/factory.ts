import type { SamplePreparationLod } from "./models/SamplePreparationLod";
import type { SamplePreparationLodStep } from "./models/SamplePreparationLodStep";
import type { CalculationLod } from "./models/CalculationLod";


export function createNewSamplePreparationLod(
    index: number
): SamplePreparationLod {

    const steps: SamplePreparationLodStep[] = [
        {
            name: "Weighing (Empty Bottle)",
            value1: "",
            unit1: "g",
            logBookID: "",
        },

        {
            name: "Weighing (Before Drying)",
            value1: "",
            unit1: "g",
            logBookID: "",
        },

        {
            name: "Drying",
            value1: "",
            unit1: "°C",
            value2: "",
            unit2: "min",
            logBookID: "",
        },

        {
            name: "Weighing (After Drying)",
            value1: "",
            unit1: "g",
            logBookID: "",
        },
    ];

    return {
        id: Date.now() + index,
        label: `Sample Preparation ${index + 1}`,
        steps,
    };
}


export function createNewCalculationLod(
    index: number
): CalculationLod {

    return {
        id: Date.now() + index,

        label: `Calculation ${index + 1}`,

        selectedSamplePreparationLabel: null,

        w1_emptyDish: "",
        w2_dishWithSample: "",
        w3_dishAfterIgnition: "",

        calculationResult: null,
        calculationResultUnit: null,

        w1: null,
        w2: null,
        w3: null,

        acceptanceLimitMin: "",
        acceptanceLimitMax: "",
    };
}