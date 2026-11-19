import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { overallMigrationPackagingConfig } from "../config";

export default function CalculationDetailOverallMigrationPackaging(props: any) {
  return <SimpleEnvironmentCalculationDetail config={overallMigrationPackagingConfig} {...props} />;
}
