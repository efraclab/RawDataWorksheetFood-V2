import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { soilAvailablePhosphorousConfig } from "../config";

export default function CalculationDetailSoilAvailablePhosphorous(props: any) {
  return <SimpleEnvironmentCalculationDetail config={soilAvailablePhosphorousConfig} {...props} />;
}
