import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { overallMigrationPackagingConfig } from "../config";

export default function SamplePreparationDetailOverallMigrationPackaging(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={overallMigrationPackagingConfig} {...props} />;
}
