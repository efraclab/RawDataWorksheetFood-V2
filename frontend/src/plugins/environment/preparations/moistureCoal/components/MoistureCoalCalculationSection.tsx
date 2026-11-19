import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { moistureCoalConfig } from "../config";

export default function MoistureCoalCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={moistureCoalConfig} {...props} />;
}
