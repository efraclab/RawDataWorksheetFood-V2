import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { moistureCoalConfig } from "../config";

export default function CalculationDetailMoistureCoal(props: any) {
  return <SimpleEnvironmentCalculationDetail config={moistureCoalConfig} {...props} />;
}
