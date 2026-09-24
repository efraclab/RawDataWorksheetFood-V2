import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { moistureVolatileSolventConfig } from "../config";

export default function CalculationDetailMoistureVolatileSolvent(props: any) {
  return <SimpleEnvironmentCalculationDetail config={moistureVolatileSolventConfig} {...props} />;
}
