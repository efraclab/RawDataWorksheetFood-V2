import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationSoilGypsumRequirementStep extends SimpleEnvironmentStep {}
export interface SamplePreparationSoilGypsumRequirement extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationSoilGypsumRequirementStep[]; }
