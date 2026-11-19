import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationOverallMigrationPackagingStep extends SimpleEnvironmentStep {}
export interface SamplePreparationOverallMigrationPackaging extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationOverallMigrationPackagingStep[]; }
