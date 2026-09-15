export interface SamplePreparationIcpOesStep {
    name: string;
    value1?: string;
    unit1?: string;
    value2?: string;
    unit2?: string;
    value3?: string;
    unit3?: string;
    logBookID?: string;
}

export interface SamplePreparationIcpOes {
    id: number;
    label: string;
    steps: SamplePreparationIcpOesStep[];
}
