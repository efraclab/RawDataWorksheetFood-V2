export interface SamplePreparationSodiumLactateStep {
    name: string;
    value1?: string;
    unit1?: string;
    value2?: string;
    unit2?: string;
    value3?: string;
    unit3?: string;
    logBookID?: string;
}

export interface SamplePreparationSodiumLactate {
    id: number;
    label: string;
    steps: SamplePreparationSodiumLactateStep[];
}
