export interface CalculationLod {
    readonly id: number;
    readonly label: string;

    readonly selectedSamplePreparationLabel: string | null;

    readonly w1_emptyDish: string;
    readonly w2_dishWithSample: string;
    readonly w3_dishAfterIgnition: string;

    readonly calculationResult: string | null;
    readonly calculationResultUnit: string | null;

    readonly w1: string | null;
    readonly w2: string | null;
    readonly w3: string | null;

    readonly acceptanceLimitMin: string;
    readonly acceptanceLimitMax: string;
}