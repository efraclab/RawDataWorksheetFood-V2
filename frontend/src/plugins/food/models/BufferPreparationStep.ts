export interface BufferPreparationStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID: string;
  solventChemical?: string;
  [key: string]: unknown;
}
