import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { overallMigrationPackagingConfig } from "../config";

export default function OverallMigrationPackagingCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={overallMigrationPackagingConfig} {...props} />;
}
