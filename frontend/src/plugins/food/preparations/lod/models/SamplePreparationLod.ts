import type {
    SamplePreparationLodStep
} from "./SamplePreparationLodStep";

export interface SamplePreparationLod {
    readonly id: number;
    readonly label: string;
    readonly steps: readonly SamplePreparationLodStep[];
}