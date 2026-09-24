import type {
  SimpleEnvironmentSamplePreparation,
  SimpleEnvironmentStep,
} from "../../_shared/types";

export interface SamplePreparationSoilOrganicCarbonMatterStep extends SimpleEnvironmentStep {}

export interface SamplePreparationSoilOrganicCarbonMatter
  extends SimpleEnvironmentSamplePreparation {
  steps: SamplePreparationSoilOrganicCarbonMatterStep[];
}
