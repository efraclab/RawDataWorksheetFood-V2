import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { moistureVolatileSolventConfig } from "../config";

export default function MoistureVolatileSolventCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={moistureVolatileSolventConfig} {...props} />;
}
